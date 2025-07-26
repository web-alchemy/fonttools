const { createPyodide, installPackages } = require('../pyodide.js')

async function main() {
  const pyodide = await createPyodide()
  await installPackages(pyodide)
}

main()