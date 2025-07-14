// local imports
import icons from 'url:../../img/icons.svg'

export default class View {
  _data

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()

    this._data = data
    const markup = this._generateMarkup()

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError()

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

  renderSpinner() {
    const spinner = `
        <div class="spinner">
        <svg>
					<use href="${icons}#icon-loader"></use>
				</svg>
			</div>
		`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', spinner)
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
			`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
					<div>
						<svg>
							<use href="${icons}#icon-alert-triangle"></use>
						</svg>
					</div>
					<p>${message}</p>
        </div>
			`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }
}
