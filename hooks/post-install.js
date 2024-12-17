const { preparePyodide } = require('../pyodide')

preparePyodide().then(console.log, console.error)