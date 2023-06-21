const { preparePyodide, PyodideFile } = require('./pyodide.js')
const { getPythonSubsetFunction } = require('./get-python-subset-function.js')

function prepareOptions(options) {
  return Object.entries(options)
    .map(([key, value]) => value === true ? [key] : [key, value])
    .map(([key, value]) => key === '*' ? ['*']: [`--${key}`, value])
    .map((entry) => entry.join('='))
}

async function subset(inputFontBuffer, options) {
  const pyodide = await preparePyodide()

  const files = []
  const inputFile = new PyodideFile({ pyodide })
  const outputFile = new PyodideFile({ pyodide })
  files.push(inputFile)
  files.push(outputFile)

  inputFile.upload(inputFontBuffer)

  options['output-file'] = outputFile.filename

  for (const paramName of ['gids-file', 'glyphs-file', 'text-file', 'unicodes-file']) {
    if (!options[paramName]) {
      continue
    }
    const filePath = options[paramName]
    const file = new PyodideFile({ pyodide })
    const fileBuffer = await fs.promises.readFile(filePath)
    file.upload(fileBuffer)
    options[filePath] = file.filename
    files.push(file)
  }

  const preparedOptions = [inputFile.filename, ...prepareOptions(options)]
  const pythonSubsetFunction = await getPythonSubsetFunction()
  pythonSubsetFunction(preparedOptions)

  const processedFileBuffer = outputFile.download()

  for (const file of files) {
    file.delete()
  }

  return processedFileBuffer
}

module.exports = {
  subset
}