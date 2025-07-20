// local imports

export default class View {
  /**
   * Data to be rendered in the view
   * @type {Object|Array}
   * @protected
   */
  _data

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()

    this._data = data
    const markup = this._generateMarkup()

    if (!render) return markup

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  /**
   * Update the DOM with new data without re-rendering the entire view
   * Uses a virtual DOM approach to only update elements that have changed
   *
   * @param {Object | Object[]} data The data to be updated (e.g. recipe)
   * @returns {undefined}
   */
  update(data) {
    this._data = data
    const newMarkup = this._generateMarkup()
    const newDom = document.createRange().createContextualFragment(newMarkup) // virtual DOM
    const newElements = Array.from(newDom.querySelectorAll('*'))
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*') // Current DOM elements
    )

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i]
      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value)
        })
    })
  }

  /**
   * Renders a loading spinner in the parent element
   * Used to indicate that content is being loaded
   *
   * @returns {void}
   */
  renderSpinner() {
    const spinner = `
        <div class="spinner">
          <i class="fas fa-spinner fa-spin"></i>
			</div>
		`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', spinner)
  }

  /**
   * Renders a success message in the parent element
   *
   * @param {string} [message=this._message] - The message to display
   * @returns {void}
   */
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <i class="fas fa-smile"></i>
          </div>
          <p>${message}</p>
        </div>
			`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  /**
   * Renders an error message in the parent element
   *
   * @param {string} [message=this._errorMessage] - The error message to display
   * @returns {void}
   */
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
					<div>
						<i class="fas fa-exclamation-triangle"></i>
					</div>
					<p>${message}</p>
        </div>
			`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  /**
   * Clears the content of the parent element
   *
   * @private
   * @returns {void}
   */
  _clear() {
    this._parentElement.innerHTML = ''
  }
}
