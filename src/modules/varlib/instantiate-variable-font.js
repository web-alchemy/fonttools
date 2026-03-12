const { preparePyodide, PyodideFile } = require('../../pyodide.js')
const { getPythonVariableFontFunction } = require('./get-python-variable-font-function.js')

async function instantiateVariableFont(inputFontBuffer, options) {
  const pyodide = await preparePyodide()

  const files = []
  const inputFile = new PyodideFile({ pyodide })
  const outputFile = new PyodideFile({ pyodide })
  files.push(inputFile)
  files.push(outputFile)

  inputFile.upload(inputFontBuffer)

  const fileOptions = new Map([
    ['input-file', inputFile.filename],
    ['output-file', outputFile.filename]
  ])

  const pythonFunction = await getPythonVariableFontFunction(pyodide)
  pythonFunction(fileOptions, new Map(Object.entries(options)))

  const processedFileBuffer = outputFile.download()

  for (const file of files) {
    file.delete()
  }

  return processedFileBuffer
}

module.exports = {
  instantiateVariableFont
}