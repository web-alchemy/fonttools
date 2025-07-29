function once(/**@type {Function}*/ func) {
  let isCalled = false
  let result

  return function() {
    if (isCalled) {
      return result
    }

    result = func.apply(this, arguments)
    isCalled = true

    return result
  }
}

module.exports = {
  once
}