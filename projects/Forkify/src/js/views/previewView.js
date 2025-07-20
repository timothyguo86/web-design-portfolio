// local imports
import View from './View'

class PreviewView extends View {
  _parentElement = ''

  /**
   * Generates the HTML markup for a recipe preview
   * Highlights the currently selected recipe and displays user-generated badge if applicable
   *
   * @private
   * @returns {string} HTML markup for the recipe preview
   */
  _generateMarkup() {
    const id = window.location.hash.slice(1)

    return `
      <li class="preview">
        <a class="preview__link ${this._data.id === id ? 'preview__link--active' : ''}" href="#${this._data.id}">
          <figure class="preview__fig">
            <img alt="${this._data.title}" src="${this._data.image}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <i class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
              <i class="fas fa-user"></i>
            </i>
          </div>
        </a>
      </li>
    `
  }
}

export default new PreviewView()
