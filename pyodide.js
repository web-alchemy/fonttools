const crypto = require('node:crypto')
const { loadPyodide } = require('pyodide')
const { once } = require('./utils.js')

async function installPackages(/**@type {import('pyodide').PyodideInterface}*/ pyodide) {
  await pyodide.loadPackage(['Brotli', 'fonttools'], {
    messageCallback: () => {}
  })
}

/**
 * @type {() => Promise<import('pyodide').PyodideInterface>}
 */
const preparePyodide = once(
  async function(options) {
    const pyodide = await loadPyodide(options)
    await installPackages(pyodide)
    return pyodide
  }
)

class PyodideFile {
  static of(options) {
    return new PyodideFile(options)
  }

  constructor(options) {
    if (!new.target) {
      return this.constructor.of(options)
    }

    this.pyodide = options.pyodide
    this.id = options.id ?? crypto.randomUUID()
    this.filename = options.filename ?? this.id
  }

  upload(fontBuffer) {
    return this.pyodide.FS.writeFile(this.id, fontBuffer)
  }

  download() {
    return this.pyodide.FS.readFile(this.id)
  }

  delete() {
    this.pyodide.FS.unlink(this.id)
  }
}

module.exports = {
  preparePyodide,
  PyodideFile
}
