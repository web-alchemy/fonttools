function getPythonFontToolsFunction(pyodide) {
  return pyodide.runPythonAsync(`
    from fontTools.__main__ import main

    def main_fn():
      try:
        return main()
      except SystemExit as error:
        return error
      except Exception:
        raise

    main_fn
  `)
}

module.exports = {
  getPythonFontToolsFunction
}