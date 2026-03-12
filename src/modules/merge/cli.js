const { preparePyodide } = require('../../pyodide.js')
const { getPythonMergeFunction } = require('./get-python-merge-function.js')

async function main(args = process.argv.slice(2)) {
  const pyodide = await preparePyodide()
  pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: '.' }, '.')
  const pythonFunction = await getPythonMergeFunction(pyodide)
  const exitCode = pythonFunction(args)
  process.exit(exitCode)
}

module.exports = {
  main
}