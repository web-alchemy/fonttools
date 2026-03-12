function getPythonMergeFunction(pyodide) {
  return pyodide.runPythonAsync(`
    from fontTools.merge import main
    main
  `)
}

module.exports = {
  getPythonMergeFunction
}