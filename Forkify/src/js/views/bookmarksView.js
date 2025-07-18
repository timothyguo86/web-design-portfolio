// local imports
import View from './View'
import previewView from './previewView'

class BookmarksView extends View {
  /** @type {HTMLElement} Parent element where the bookmarks will be rendered */
  _parentElement = document.querySelector('.bookmarks')

  /** @type {string} Error message to display when no bookmarks are available */
  _errorMessage = 'No bookmakers yet. Find a nice recipe and bookmark it!'

  /** @type {string} Success message (empty as not used in this view) */
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
