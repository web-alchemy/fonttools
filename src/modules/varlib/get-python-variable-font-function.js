async function getPythonVariableFontFunction(pyodide) {
  return pyodide.runPythonAsync(`
    from fontTools import ttLib
    from fontTools.varLib import instancer

    def main_fn(file_options, options):
      font = ttLib.TTFont(file_options['input-file'])
      partial = instancer.instantiateVariableFont(font, options)
      partial.save(file_options['output-file'])

    main_fn
  `)
}

module.exports = {
  getPythonVariableFontFunction
}