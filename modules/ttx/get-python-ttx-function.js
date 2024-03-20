function getPythonTtxFunction(pyodide) {
  return pyodide.runPythonAsync(`
    from fontTools.ttx import main

    def main_fn(args = None):
      try:
        return main(args)
      except SystemExit as error:
        return error
      except Exception:
        raise

    main_fn
  `)
}

module.exports = {
  getPythonTtxFunction
}