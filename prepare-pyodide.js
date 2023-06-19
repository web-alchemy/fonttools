const { loadPyodide } = require('pyodide')

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

module.exports = {
  preparePyodide
}
