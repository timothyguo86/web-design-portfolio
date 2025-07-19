// local imports
import View from './View'
import previewView from './previewView'

class ResultsView extends View {
  _parentElement = document.querySelector('.results')
  _errorMessage = 'No recipes found for your query! Please try again.'
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
