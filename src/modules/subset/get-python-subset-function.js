function getPythonSubsetFunction(pyodide) {
  return pyodide.runPythonAsync(`
    from fontTools.subset import main
    main
  `)
}

module.exports = {
  getPythonSubsetFunction
}