const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { preparePyodide } = require('./prepare-pyodide.js')

const pythonSource = fs.readFileSync(path.join(__dirname, 'subset.py'), 'utf-8')

async function subsetFontFromBuffer(inputFontBuffer, options) {
  const pyodide = await preparePyodide()

  const TEMP_INPUT_FONT_FILE = `./${crypto.randomUUID()}`
  const TEMP_OUTPUT_FONT_FILE = `./${crypto.randomUUID()}`

  pyodide.FS.writeFile(TEMP_INPUT_FONT_FILE, inputFontBuffer)

  const subset_font = pyodide.runPython(pythonSource)

  subset_font(new Map(Object.entries({
    ...options,
    ...{
      'input-file': TEMP_INPUT_FONT_FILE,
      'output-file': TEMP_OUTPUT_FONT_FILE
    }
  })))

  const processedFile = pyodide.FS.readFile(TEMP_OUTPUT_FONT_FILE)

  pyodide.FS.unlink(TEMP_INPUT_FONT_FILE)
  pyodide.FS.unlink(TEMP_OUTPUT_FONT_FILE)

  return processedFile
}

function getFilePathWithoutExtension(filePath) {
  return filePath.slice(0, filePath.lastIndexOf('.'))
}

function getFilePathExtension(filePath) {
  return path.extname(filePath)
}

/**
 * @typedef {Object} SubsetFontOptions
 * @property {string} input-file
 * @property {string} output-file
 * @property {'woff' | 'woff2'} [flavor]
 * @property {string} [text]
 * @property {string} [unicodes]
 * @property {boolean} [desubroutinize = false]
 * @property {boolean} [no-hinting = false]
 * @property {string} [layout-features = *]
 */

/**
 * @param {SubsetFontOptions} options
 */
async function subsetFont(options) {
  if (!options['output-file']) {
    const originalFileExtension = getFilePathExtension(options['input-file'])
    const newFileExtension = ['woff', 'woff2'].includes(options['flavor']) ? `.${options['flavor']}` : originalFileExtension
    options['output-file'] = getFilePathWithoutExtension(options['input-file']) + newFileExtension
  }

  if (!options['flavor']) {
    const outputFileExtension = getFilePathExtension(options['output-file']).slice(1)
    if (['woff', 'woff2'].includes(outputFileExtension)) {
      options['flavor'] = outputFileExtension
    }
  }

  const inputFileBuffer = await fs.promises.readFile(path.join(process.cwd(), options['input-file']))
  const outputFileBuffer = await subsetFontFromBuffer(inputFileBuffer, options)
  const outputFilePath = path.join(process.cwd(), options['output-file'])
  const outputFileFolder = path.dirname(outputFilePath)
  await fs.promises.mkdir(outputFileFolder, { recursive: true })
  await fs.promises.writeFile(path.join(process.cwd(), options['output-file']), outputFileBuffer)
}

module.exports = {
  subsetFont,
  subsetFontFromBuffer
}
