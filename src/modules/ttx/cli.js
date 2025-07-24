const { preparePyodide } = require('../../pyodide.js')
const { getPythonTtxFunction } = require('./get-python-ttx-function.js')

async function main() {
  const pyodide = await preparePyodide({
    args: process.argv.slice(1)
  })
  pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: '.' }, '.')
  const pythonFunction = await getPythonTtxFunction(pyodide)
  const result = await pythonFunction()
  const exitCode = Number(result?.toString() ?? 0)
  process.exit(exitCode)
}

module.exports = {
  main
}