const { main } = require('./cli.js')
const { subset } = require('./subset.js')

if (require.main === module) {
  main()
}

module.exports = {
  main,
  subset
}