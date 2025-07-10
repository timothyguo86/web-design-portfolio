// local imports
import icons from 'url:../../img/icons.svg'
import View from './View'

const EVENTS = Object.freeze({
  HASH_CHANGE: 'hashchange',
  LOAD: 'load'
})

export class PaginationView extends View {
  _parentElement = document.querySelector('.pagination')

  _generateMarkup() {
    const search = this._data
    const { page: currentPage } = search
    const numPages = Math.ceil(search.results.length / search.resultsPerPage)
    console.log(currentPage)

    // On page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `
    }
    // On page 1, and there are NO other pages
    if (currentPage === 1 && numPages === 1) {
      return ``
    }
    // On the Last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `
    }
    // On other pages
    return `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
      <button class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `
  }
}

export default new PaginationView()
