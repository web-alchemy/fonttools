function once(/**@type {Function}*/ func) {
  let result

  return function() {
    if (result) {
      return result
    }

    result = func.apply(this, arguments)

    return result
  }
}

module.exports = {
  once
}