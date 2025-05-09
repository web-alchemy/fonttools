const crypto = require('node:crypto')
const fs = require('node:fs')
const { loadPyodide } = require('pyodide')
const { once } = require('./utils.js')

async function installPackages(/**@type {import('pyodide').PyodideInterface}*/ pyodide) {
  await pyodide.loadPackage(['Brotli', 'fonttools', 'lxml'], {
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

  async upload(fontFile = this.filename) {
    fontFile = (typeof fontFile === 'string' || fontFile instanceof URL)
      ? await fs.promises.readFile(fontFile)
      : fontFile
    return this.pyodide.FS.writeFile(this.id, fontFile)
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
