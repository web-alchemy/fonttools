const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const { loadPyodide } = require('pyodide')
const { once } = require('./utils.js')

async function createPyodide(options) {
   const defaultOptions = {
      packageCacheDir: path.join(__dirname, '..', 'python_modules'),
      lockFileURL: path.join(__dirname, '..', 'pyodide-lock.json'),
    }
    const args = Object.assign({}, defaultOptions, options)
    return await loadPyodide(args)
}

async function installPackages(/**@type {import('pyodide').PyodideInterface}*/ pyodide, options) {
  await pyodide.loadPackage(['Brotli', 'fonttools', 'lxml'], options)
}

/**
 * @type {() => Promise<import('pyodide').PyodideInterface>}
 */
const preparePyodide = once(
  async function(options) {
    const pyodide = await createPyodide(options)
    await installPackages(pyodide, {
      messageCallback: () => {}
    })
    return pyodide
  }
)

async function updateLockFile() {
  const pyodide = await loadPyodide()
  await pyodide.loadPackage('micropip')
  const micropip = pyodide.pyimport('micropip')
  const content = micropip.freeze()
  const prettyContent = JSON.stringify(JSON.parse(content), null, 2)
  await fs.promises.writeFile('pyodide-lock.json', prettyContent)
}

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
  createPyodide,
  preparePyodide,
  installPackages,
  updateLockFile,
  PyodideFile
}
