const { preparePyodide } = require('./prepare-pyodide.js')

async function main(args = process.argv.slice(2)) {
  const pyodide = await preparePyodide()
  pyodide.FS.mount(pyodide.FS.filesystems.NODEFS, { root: '.' }, '.')
  const subsetMainFunc = await pyodide.runPythonAsync(`
    from fontTools.subset import main
    main
  `)
  subsetMainFunc(args)
}

if (require.main === module) {
  main()
}

module.exports = {
  main
}