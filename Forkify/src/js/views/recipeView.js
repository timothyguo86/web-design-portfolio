// local imports
import icons from 'url:../../img/icons.svg'
import View from './View'

/**
 * Object containing event types used by the recipe view
 * @readonly
 * @enum {string}
 */
const EVENTS = Object.freeze({
  HASH_CHANGE: 'hashchange',
  LOAD: 'load'
})

export class RecipeView extends View {
  /** @type {HTMLElement} Parent element where the recipe will be rendered */
  _parentElement = document.querySelector('.recipe')

  /** @type {string} Error message to display when a recipe cannot be found */
  _errorMessage =
    'We could not find the recipe you are looking for. Please try again.'

  /** @type {string} Success message (empty as not used in this view) */
  _message = ''

  /**
   * Adds event listeners to render the recipe when the page loads or the hash changes
   *
   * @param {Function} handler - The callback function to execute when events occur
   * @param {Array<string>} [events=[EVENTS.HASH_CHANGE, EVENTS.LOAD]] - The events to listen for
   * @returns {void}
   */
  addHandlerRender(handler, events = [EVENTS.HASH_CHANGE, EVENTS.LOAD]) {
    events.forEach(event => {
      window.addEventListener(event, handler)
    })
  }

  /**
   * Adds event listener for updating the recipe servings
   * Listens for clicks on the servings buttons and calls the handler with the new servings count
   *
   * @param {Function} handler - The callback function to execute with the new servings count
   * @returns {void}
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--update-servings')

      if (!btn) return

      const updateTo = +btn.dataset.updateTo

      if (updateTo > 0) handler(updateTo)
    })
  }

  /**
   * Adds event listener for bookmarking/unbookmarking the current recipe
   *
   * @param {Function} handler - The callback function to execute when the bookmark button is clicked
   * @returns {void}
   */
  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark')

      if (!btn) return
      handler()
    })
  }

  /**
   * Generates the HTML markup for the recipe view
   * Creates a detailed view of the recipe including image, cooking time, servings,
   * ingredients, and a link to the original recipe directions
   *
   * @private
   * @returns {string} HTML markup for the recipe
   */
  _generateMarkup() {
    return `
			<figure class="recipe__fig">
				<img alt="${this._data.title}" class="recipe__img" src="${this._data.image}" />
				<h1 class="recipe__title">
					<span>${this._data.title}</span>
				</h1>
			</figure>

			<div class="recipe__details">
				<div class="recipe__info">
					<svg class="recipe__info-icon">
						<use href="${icons}#icon-clock"></use>
					</svg>
					<span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
					<span class="recipe__info-text">minutes</span>
				</div>
				<div class="recipe__info">
					<svg class="recipe__info-icon">
						<use href="${icons}#icon-users"></use>
					</svg>
					<span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
					<span class="recipe__info-text">servings</span>

					<div class="recipe__info-buttons">
						<button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
							<svg>
								<use href="${icons}#icon-minus-circle"></use>
							</svg>
						</button>
						<button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
							<svg>
								<use href="${icons}#icon-plus-circle"></use>
							</svg>
						</button>
					</div>
				</div>

        <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
				</div>
				<button class="btn--round btn--bookmark">
					<svg class="">
						<use href="${icons}#icon-bookmark${this._data.isBookmarked ? '-fill' : ''}"></use>
					</svg>
				</button>
			</div>

			<div class="recipe__ingredients">
				<h2 class="heading--2">Recipe ingredients</h2>
				<ul class="recipe__ingredient-list">
					${this._data.ingredients
            .map(ingredient => {
              return `
					<li class="recipe__ingredient">
						<svg class="recipe__icon">
							<use href="${icons}#icon-check"></use>
						</svg>
						<div class="recipe__quantity">${ingredient.quantity || ''}</div>
						<div class="recipe__description">
							<span class="recipe__unit">${ingredient.unit}</span>
							${ingredient.description}
						</div>
					</li>
					`
            })
            .join('')}
				</ul>
			</div>

			<div class="recipe__directions">
				<h2 class="heading--2">How to cook it</h2>
				<p class="recipe__directions-text">
					This recipe was carefully designed and tested by
					<span class="recipe__publisher">${this._data.publisher}</span>. Please
					check out directions at their website.
				</p>
				<a
					class="btn--small recipe__btn"
					href="${this._data.sourceUrl}"
					target="_blank"
				>
					<span>Directions</span>
					<svg class="search__icon">
						<use href="${icons}#icon-arrow-right"></use>
					</svg>
				</a>
			</div>
    `
  }
}

export default new RecipeView()
