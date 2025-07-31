const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
  // Set initial HTML structure
  root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
          <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
          </div>
        </div>
      `
  const input = root.querySelector('.input')
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

  const renderDropdownItem = item => {
    const option = document.createElement('a')
    option.classList.add('dropdown-item')
    option.innerHTML = renderOption(item)
    option.addEventListener('click', () => {
      closeDropdown()
      setInputValue(item)
      onOptionSelect(item)
    })
    return option
  }

  const onInput = async event => {
    const items = await fetchData(event.target.value)

    if (!items.length) {
      closeDropdown()
      return
    }

    clearResults()
    openDropdown()

    items.forEach(item => {
      resultsWrapper.appendChild(renderDropdownItem(item))
    })
  }

  const closeDropdown = () => {
    dropdown.classList.remove('is-active')
  }

  const openDropdown = () => {
    dropdown.classList.add('is-active')
  }

  const clearResults = () => {
    resultsWrapper.innerHTML = ''
  }

  const setInputValue = item => {
    input.value = inputValue(item)
  }

  input.addEventListener('input', debounce(onInput, 300))

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown()
    }
  })
}
