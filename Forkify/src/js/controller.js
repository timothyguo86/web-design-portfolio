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

const controlPagination = goToPage => {
  resultsView.render(model.getSearchResultPage(goToPage))

  paginationView.render(model.state.search)
}

const controlServings = newServings => {
  model.updateServings(newServings)

  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = () => {
  // 1) Add / remove a bookmark
  if (!model.state.recipe.isBookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks)
}

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}

init()
