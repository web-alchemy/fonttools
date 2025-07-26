const { preparePyodide } = require('../../pyodide.js')
const { getPythonFontToolsFunction } = require('./get-python-fonttools-function.js')

async function main() {
  const pyodide = await preparePyodide({
    args: process.argv.slice(1)
  })
  pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: '.' }, '.')
  const pythonFunction = await getPythonFontToolsFunction(pyodide)
  const result = await pythonFunction()
  const exitCode = Number(result?.toString() ?? 0)
  process.exit(exitCode)
}

module.exports = {
  main
}