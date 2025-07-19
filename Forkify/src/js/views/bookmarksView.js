// local imports
import View from './View'
import previewView from './previewView'

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks')
  _errorMessage = 'No bookmakers yet. Find a nice recipe and bookmark it!'
  _message = ''

  /**
   * Adds an event listener for the 'load' event on the window object and associates it with the provided handler function.
   *
   * @param {Function} handler The callback function to be executed when the 'load' event is triggered.
   * @return {void} Does not return a value.
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler)
  }

  /**
   * Generates and returns markup string for the provided data.
   * It maps through the data array, processes each item, and concatenates the results into a single string.
   *
   * @return {string} The concatenated markup string generated from the data.
   */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('')
  }
}

export default new BookmarksView()
