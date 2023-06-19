const fs = require('node:fs')
const path = require('node:path')

function formatFileSize(bytes, decimals = 2) {
  if (bytes == 0) {
    return '0 Bytes'
  };

  const
    k = 1024,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

function getFullFilePath(file) {
  return path.join(process.cwd(), file)
}

function getFileSize(file) {
  return fs.statSync(file).size
}

/**
 * @param {string} inputFile
 * @param {string} outputFile
*/
function output(inputFile, outputFile) {
  const input = getFullFilePath(inputFile)
  const output = getFullFilePath(outputFile)
  const inputSize = getFileSize(input)
  const outputSize = getFileSize(output)

  console.log('Result')
  console.table([
    { file: input, size: formatFileSize(inputSize) },
    { file: output, size: formatFileSize(outputSize) },
  ])
}

module.exports = {
  output
}