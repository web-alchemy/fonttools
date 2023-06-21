const crypto = require('node:crypto')
const { loadPyodide: _loadPyodide } = require('pyodide')

function asyncOnce(func) {
  let promise

  return function() {
    if (promise) {
      return promise
    }

    promise = func.apply(this, arguments)

    return promise
  }
}

/**
 * @type {() => Promise<import('pyodide').PyodideInterface>}
 */
const loadPyodide = asyncOnce(_loadPyodide)

/**
 * @type {() => Promise<import('pyodide').PyodideInterface>}
 */
const preparePyodide = asyncOnce(
  async function() {
    const pyodide = await loadPyodide()

    await Promise.all(
      ['Brotli', 'fonttools']
        .map((package) => pyodide.loadPackage(package, {
          messageCallback: () => { }
        }))
    );

    return pyodide
  }
)

class PyodideFile {
  constructor({ pyodide, filename }) {
    this.pyodide = pyodide
    this.filename = filename ?? crypto.randomUUID()
  }

  upload(fontBuffer) {
    return this.pyodide.FS.writeFile(this.filename, fontBuffer)
  }

  download() {
    return this.pyodide.FS.readFile(this.filename)
  }

  delete() {
    this.pyodide.FS.unlink(this.filename)
  }
}

module.exports = {
  preparePyodide,
  PyodideFile
}
