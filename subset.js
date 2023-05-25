const fs = require('node:fs')
const path = require('node:path')
const { loadPyodide } = require('pyodide')

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
  const pyodide = await loadPyodide();

  await Promise.all(
    ['Brotli', 'fonttools']
      .map((package) => pyodide.loadPackage(package, {
        messageCallback: () => {}
      }))
  );

  const TEMP_INPUT_FONT_FILE = './input-file'
  const TEMP_OUTPUT_FONT_FILE = './output-file'

  const fontFile = fs.readFileSync(path.join(process.cwd(), options['input-file']))
  pyodide.FS.writeFile(TEMP_INPUT_FONT_FILE, fontFile)

  const pythonSource = fs.readFileSync(path.join(__dirname, 'subset.py'), 'utf-8')

  const subset_font = pyodide.runPython(pythonSource)

  subset_font(new Map(Object.entries(options)))

  const proccessedFile = pyodide.FS.readFile(TEMP_OUTPUT_FONT_FILE)
  const outputFile = path.join(process.cwd(), options['output-file'])
  const outputFileFolder = path.dirname(outputFile)
  fs.mkdirSync(outputFileFolder, { recursive: true })
  fs.writeFileSync(path.join(process.cwd(), options['output-file']), proccessedFile)
}

module.exports = {
  subsetFont
}