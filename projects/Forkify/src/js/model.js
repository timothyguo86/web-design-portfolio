// local imports
import { API_KEY, API_URL, RES_PER_PAGE } from './config'
import { getJSON, sendJSON } from './helpers'

/**
 * Application state object that stores all data needed for the application
 * @typedef {Object} State
 * @property {Object} recipe - Currently selected recipe
 * @property {Object} search - Search related data
 * @property {string} search.query - Current search query
 * @property {Array} search.results - List of recipes matching the search query
 * @property {number} search.resultsPerPage - Number of results to display per page
 * @property {number} search.page - Current page of search results
 * @property {Array} bookmarks - List of bookmarked recipes
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1
  },
  bookmarks: []
}

/**
 * Saves the current bookmarks to localStorage
 *
 * @private
 * @returns {void}
 */
const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

/**
 * Loads a recipe with the specified ID from the API
 * Updates the state with the loaded recipe and checks if it's bookmarked
 *
 * @async
 * @param {string} id - The ID of the recipe to load
 * @returns {Promise<void>}
 * @throws {Error} If the recipe cannot be loaded
 */
export const loadRecipes = async id => {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`)
    const { recipe } = data.data

    state.recipe = _createRecipeObject(data)
    state.recipe.isBookmarked = state.bookmarks.some(b => b.id === recipe.id)
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Searches for recipes matching the provided query
 * Updates the state with search results and resets the page to 1
 *
 * @async
 * @param {string} query - The search query
 * @returns {Promise<void>}
 * @throws {Error} If the search fails
 */
export const loadSearchResults = async query => {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
    state.search.query = query
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key })
      }
    })
    state.search.page = 1
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Returns a subset of search results for the specified page
 * Updates the current page in the state
 *
 * @param {number} [page=state.search.page] - The page number to get results for
 * @returns {Array} Array of recipe objects for the specified page
 */
export const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page
  const start = (page - 1) * state.search.resultsPerPage
  const end = page * state.search.resultsPerPage

  return state.search.results.slice(start, end)
}

/**
 * Updates the servings of the current recipe and recalculates ingredient quantities
 *
 * @param {number} newServings - The new number of servings
 * @returns {void}
 */
export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings
  })

  state.recipe.servings = newServings
}

/**
 * Adds a recipe to the bookmarks list and marks the current recipe as bookmarked if applicable
 * Persists bookmarks to localStorage
 *
 * @param {Object} recipe - The recipe to bookmark
 * @returns {void}
 */
export const addBookmark = recipe => {
  // Add bookmark
  state.bookmarks.push(recipe)

  // Mark the current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true

  persistBookmarks()
}

/**
 * Removes a recipe from the bookmarks list and updates the current recipe's bookmark status if applicable
 * Persists bookmarks to localStorage
 *
 * @param {string} recipeId - The ID of the recipe to remove from bookmarks
 * @returns {void}
 */
export const deleteBookmark = recipeId => {
  // Delete bookmark
  const index = state.bookmarks.findIndex(b => b.id === recipeId)
  state.bookmarks.splice(index, 1)

  // Mark the current recipe as NOT bookmarked
  if (recipeId === state.recipe.id) state.recipe.isBookmarked = false

  persistBookmarks()
}

/**
 * Submits a new recipe to the API and adds it to bookmarks
 *
 * @async
 * @param {Object} newRecipe - The new recipe data from the form
 * @returns {Promise<void>}
 * @throws {Error} If the recipe format is invalid or submission fails
 */
export const submitRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArray = ingredient[1].split(',').map(el => el.trim())
        if (ingredientArray.length !== 3)
          throw new Error('Wrong ingredient format. Use: quantity,unit,desc')
        const [quantity, unit, description] = ingredientArray
        return { quantity: quantity ? +quantity : null, unit, description }
      })

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    const url = `${API_URL}?key=${API_KEY}`
    const data = await sendJSON(url, recipe)
    state.recipe = _createRecipeObject(data)
    addBookmark(state.recipe)
  } catch (err) {
    console.error(err)
    throw err
  }
}

/**
 * Initializes the application state by loading bookmarks from localStorage
 *
 * @private
 * @returns {void}
 */
const init = () => {
  const storedBookmarks = localStorage.getItem('bookmarks')
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks)
}

/**
 * Creates a standardized recipe object from API data
 *
 * @private
 * @param {Object} data - The raw data from the API
 * @returns {Object} A formatted recipe object
 */
const _createRecipeObject = data => {
  const { recipe } = data.data

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key })
  }
}

init()
