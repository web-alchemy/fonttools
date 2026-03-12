const { preparePyodide, PyodideFile } = require('../../pyodide.js')
const { getPythonTtxFunction } = require('./get-python-ttx-function.js')

async function ttx(inputFile, options = ['-q']) {
  const pyodide = await preparePyodide()

  const files = []

  const ignoredOptions = ['-o', '-d', '-h', '--version', '--with-zopfli']
  options = options.filter(([key]) => !ignoredOptions.includes(key))

  const inputPyodideFile = new PyodideFile({ pyodide })
  await inputPyodideFile.upload(inputFile)
  files.push(inputPyodideFile)

  const outputPyodideFile = new PyodideFile({ pyodide })
  files.push(outputPyodideFile)
  options.push(['-o', outputPyodideFile.id])

  for (const option of options) {
    const [key, value] = option

    if (key === '--unicodedata') {
      const unicodeDataPyodideFile = new PyodideFile({ pyodide })
      option[1] = unicodeDataPyodideFile.id
      await unicodeDataPyodideFile.upload(value)
      files.push(unicodeDataPyodideFile)
    }
  }

  const args = options.flat().concat(inputPyodideFile.id)

  const pythonFunction = await getPythonTtxFunction(pyodide)

  await pythonFunction(args)

  const outputFileBuffer = outputPyodideFile.download()

  for (const file of files) {
    file.delete()
  }

  return outputFileBuffer
}

module.exports = {
  ttx
}