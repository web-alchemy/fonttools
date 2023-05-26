const { loadPyodide } = require('pyodide')

let promise = null

async function _preparePyodide() {
  const pyodide = await loadPyodide();

  await Promise.all(
    ['Brotli', 'fonttools']
      .map((package) => pyodide.loadPackage(package, {
        messageCallback: () => {}
      }))
  );

  return pyodide
}

/**
 * @returns {Promise<import('pyodide').PyodideInterface>}
 */
function preparePyodide() {
  if (promise) {
    return promise
  }

  promise = _preparePyodide()

  return promise
}

module.exports = {
  preparePyodide
}