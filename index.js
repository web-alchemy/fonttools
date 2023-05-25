const path = require('node:path')
const { parseArgs } = require('node:util')
const { subsetFont } = require('./subset.js')
const { output } = require('./output.js')

function getFilePathWithoutExtension(filePath) {
  return filePath.slice(0, filePath.lastIndexOf('.'))
}

function getFilePathExtension(filePath) {
  return path.extname(filePath)
}

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

  if (!options['output-file']) {
    const originalFileExtension = getFilePathExtension(options['input-file'])
    options['output-file'] = getFilePathWithoutExtension(options['input-file']) + (`.${options['flavor']}` ?? originalFileExtension)
  }

  if (!options['flavor']) {
    const outputFileExtension = getFilePathExtension(options['output-file']).slice(1)
    if (['woff', 'woff2'].includes(outputFileExtension)) {
      options['flavor'] = outputFileExtension
    }
  }

  await subsetFont(options)

  output(options['input-file'], options['output-file'])
}

module.exports = {
  main
}

if (require.main === module) {
  main()
}
