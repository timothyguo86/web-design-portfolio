// third party import
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// local imports
import * as model from './model.js'
import recipeView from './views/recipeView'
import searchView from './views/searchView'

const controlRecipes = async () => {
  try {
    const recipeId = window.location.hash.slice(1)

    if (!recipeId) return

    recipeView.renderSpinner()

    // 1) Loading recipe
    await model.loadRecipes(recipeId)

    // 2) Rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery()
    if (!query) return

    await model.loadSearchResults(query)
    console.log(model.state.search.results)
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
}

init()
