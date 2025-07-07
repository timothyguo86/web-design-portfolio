// third party import
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// local imports
import * as model from './model.js'
import recipeView from './views/recipeView'

const recipeContainer = document.querySelector('.recipe')

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`))
    }, s * 1000)
  })
}

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
    alert(err)
  }
}

controlRecipes()

window.addEventListener('hashchange', controlRecipes)
window.addEventListener('load', controlRecipes)
