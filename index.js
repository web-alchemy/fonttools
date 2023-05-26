const { parseArgs } = require('node:util')
const { subsetFont, subsetFontFromBuffer } = require('./subset.js')
const { output } = require('./output.js')

async function main() {
  const { values: options } = parseArgs({
    options: {
      'input-file': { type: 'string' },
      'output-file': { type: 'string' },
      'flavor': { type: 'string' },
      'text': { type: 'string' },
      'unicodes': { type: 'string' },
      'desubroutinize': { type: 'boolean', default: false },
      'no-hinting': { type: 'boolean', default: false },
      'layout-features': { type: 'string', default: '*' }
    },
    strict: false,
    allowPositionals: true
  })

  await subsetFont(options)

  output(options['input-file'], options['output-file'])
}

module.exports = {
  main,
  subsetFont,
  subsetFontFromBuffer
}

if (require.main === module) {
  main()
}
