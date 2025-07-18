// local imports
import View from './View'
import previewView from './previewView'

class ResultsView extends View {
  /** @type {HTMLElement} Parent element where the search results will be rendered */
  _parentElement = document.querySelector('.results')

  /** @type {string} Error message to display when no recipes match the search query */
  _errorMessage = 'No recipes found for your query! Please try again.'

  /** @type {string} Success message (empty as not used in this view) */
  _message = ''

  /**
   * Generates the markup string by mapping over the data and rendering previews for each result.
   * Combines all rendered preview strings into a single string.
   *
   * @return {string} The concatenated markup string generated from data rendering.
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('')
  }
}

export default new ResultsView()
