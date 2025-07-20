class SearchView {
  _parentElement = document.querySelector('.search')

  /**
   * Retrieves the current search query from the input field and clears the input
   *
   * @returns {string} The search query entered by the user
   */
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value
    this._clearInput()

    return query
  }

  /**
   * Adds an event listener to the search form to handle form submissions
   *
   * @param {Function} handler - The callback function to execute when the form is submitted
   * @returns {void}
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault()
      handler()
    })
  }

  /**
   * Clears the search input field
   *
   * @private
   * @returns {void}
   */
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = ''
  }
}

export default new SearchView()
