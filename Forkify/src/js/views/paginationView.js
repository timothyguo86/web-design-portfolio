// local imports
import icons from 'url:../../img/icons.svg'
import View from './View'

export class PaginationView extends View {
  /** @type {HTMLElement} Parent element where pagination controls will be rendered */
  _parentElement = document.querySelector('.pagination')

  /**
   * Adds event listener for pagination button clicks
   * Detects which button was clicked and calls the handler with the target page number
   *
   * @param {Function} handler - The callback function to execute with the target page number
   * @returns {void}
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline')
      if (!btn) return

      const gotoPage = Number(btn.dataset.goto)

      handler(gotoPage)
    })
  }

  /**
   * Generates the HTML markup for pagination controls
   * Determines which buttons to show based on the current page and total number of pages
   *
   * @private
   * @returns {string} HTML markup for pagination controls
   */
  _generateMarkup() {
    const { page: currentPage, results, resultsPerPage } = this._data
    const numPages = Math.ceil(results.length / resultsPerPage)

    // Case 1: No pagination needed (only one page)
    if (numPages <= 1) return ''

    // Case 2: First page with more pages
    if (currentPage === 1) {
      return this._generateNextButton(currentPage)
    }

    // Case 3: Last page
    if (currentPage === numPages) {
      return this._generatePrevButton(currentPage)
    }

    // Case 4: Middle page (show both buttons)
    return `
      ${this._generatePrevButton(currentPage)}
      ${this._generateNextButton(currentPage)}
    `
  }

  /**
   * Generates HTML for the "previous page" button
   *
   * @private
   * @param {number} currentPage - The current page number
   * @returns {string} HTML markup for the previous page button
   */
  _generatePrevButton(currentPage) {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${currentPage - 1}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
    `
  }

  /**
   * Generates HTML for the "next page" button
   *
   * @private
   * @param {number} currentPage - The current page number
   * @returns {string} HTML markup for the next page button
   */
  _generateNextButton(currentPage) {
    return `
      <button class="btn--inline pagination__btn--next" data-goto="${currentPage + 1}">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `
  }
}

export default new PaginationView()
