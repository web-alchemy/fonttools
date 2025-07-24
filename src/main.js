const { main } = require('./modules/fonttools/cli.js')
const { subset } = require('./modules/subset/subset.js')
const { instantiateVariableFont } = require('./modules/varlib/instantiate-variable-font.js')
const { ttx } = require('./modules/ttx/ttx.js')

const isCliMode = require.main === module
if (isCliMode) {
  main()
}

module.exports = {
  main,
  subset,
  instantiateVariableFont,
  ttx
}