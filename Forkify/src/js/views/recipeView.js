// local imports
import icons from 'url:../../img/icons.svg'

const EVENTS = Object.freeze({
  HASH_CHANGE: 'hashchange',
  LOAD: 'load'
})

export class RecipeView {
  _parentElement = document.querySelector('.recipe')
  _data

  render(data) {
    this._data = data
    const markup = this._generateMarkup()

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderSpinner = () => {
    const spinner = `
        <div class="spinner">
        <svg>
					<use href="${icons}#icon-loader"></use>
				</svg>
			</div>
		`
    this._parentElement.innerHTML = ''
    this._parentElement.insertAdjacentHTML('afterbegin', spinner)
  }

  addRecipeRenderListeners(
    handler,
    events = [EVENTS.HASH_CHANGE, EVENTS.LOAD]
  ) {
    events.forEach(event => {
      window.addEventListener(event, handler)
    })
  }

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
						<button class="btn--tiny btn--increase-servings">
							<svg>
								<use href="${icons}#icon-minus-circle"></use>
							</svg>
						</button>
						<button class="btn--tiny btn--increase-servings">
							<svg>
								<use href="${icons}#icon-plus-circle"></use>
							</svg>
						</button>
					</div>
				</div>

				<div class="recipe__user-generated">
					<svg>
						<use href="${icons}#icon-user"></use>
					</svg>
				</div>
				<button class="btn--round">
					<svg class="">
						<use href="${icons}#icon-bookmark-fill"></use>
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

  _clear() {
    this._parentElement.innerHTML = ''
  }
}

export default new RecipeView()
