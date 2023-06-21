const { preparePyodide } = require('./pyodide.js')

async function getPythonSubsetFunction() {
  const pyodide = await preparePyodide()

  return pyodide.runPythonAsync(`
    from fontTools.subset import main
    main
  `)
}

module.exports = {
  getPythonSubsetFunction
}