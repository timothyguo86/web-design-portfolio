// local imports
import icons from 'url:../../img/icons.svg'
import View from './View'

const EVENTS = Object.freeze({
  HASH_CHANGE: 'hashchange',
  LOAD: 'load'
})

export class PaginationView extends View {
  _parentElement = document.querySelector('.pagination')

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline')
      if (!btn) return

      const gotoPage = Number(btn.dataset.goto)

      handler(gotoPage)
    })
  }

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
