// third party import
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// local imports
import * as model from './model.js'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView'
import bookmarksView from './views/bookmarksView'
import addRecipeView from './views/addRecipeView'
import { MODAL_CLOSE_SEC } from './config'

/**
 * Controls the loading and rendering of a recipe
 * Triggered when the page loads or when the URL hash changes
 *
 * @async
 * @returns {Promise<void>}
 */
const controlRecipes = async () => {
  try {
    const recipeId = window.location.hash.slice(1)

    if (!recipeId) return

    recipeView.renderSpinner()

    // 0) Update the results view to mark a selected search result
    resultsView.update(model.getSearchResultPage())
    bookmarksView.update(model.state.bookmarks)

    // 1) Loading recipe
    await model.loadRecipes(recipeId)

    // 2) Rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
    console.error(err)
  }
}

/**
 * Controls the search functionality
 * Gets the search query, loads and renders search results
 *
 * @async
 * @returns {Promise<void>}
 */
const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner()
    // 1) Get a search query
    const query = searchView.getQuery()
    if (!query) return

    // 2) Load search results
    await model.loadSearchResults(query)

    // 3) Render results
    resultsView.render(model.getSearchResultPage())

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    resultsView.renderError()
    console.error(err)
  }
}

/**
 * Controls pagination of search results
 * Renders the specified page of results and updates pagination buttons
 *
 * @param {number} goToPage - The page number to display
 * @returns {void}
 */
const controlPagination = goToPage => {
  resultsView.render(model.getSearchResultPage(goToPage))

  paginationView.render(model.state.search)
}

/**
 * Controls updating the servings of a recipe
 * Updates the model and refreshes the view with new quantities
 *
 * @param {number} newServings - The new number of servings
 * @returns {void}
 */
const controlServings = newServings => {
  model.updateServings(newServings)

  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

/**
 * Controls adding or removing a bookmark
 * Toggles the bookmark status of the current recipe and updates the views
 *
 * @returns {void}
 */
const controlAddBookmark = () => {
  // 1) Add / remove a bookmark
  if (!model.state.recipe.isBookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

/**
 * Controls rendering the bookmarks panel
 * Renders all bookmarked recipes
 *
 * @returns {void}
 */
const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks)
}

/**
 * Controls adding a new recipe
 * Submits the recipe to the API, renders it, and updates bookmarks
 *
 * @async
 * @param {Object} newRecipe - The new recipe data from the form
 * @returns {Promise<void>}
 */
const controlAddRecipe = async newRecipe => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Submit recipe
    await model.submitRecipe(newRecipe)
    console.log(model.state.recipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Close form window
    setTimeout(() => addRecipeView._toggleWindow(), MODAL_CLOSE_SEC * 1000)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
  } catch (err) {
    addRecipeView.renderError(err.message)
  }
}

/**
 * Initializes the application
 * Sets up all event handlers to connect the views with the controller functions
 *
 * @returns {void}
 */
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerSubmit(controlAddRecipe)
}

init()
