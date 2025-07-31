const debounce = (func, delay = 1000) => {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

const convertToNumber = value => {
  const cleanValue = value.replace(/\$|,/g, '')
  const numberValue = parseFloat(cleanValue)

  return isNaN(numberValue) ? null : numberValue
}
