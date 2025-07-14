// local imports
import { API_URL, RES_PER_PAGE } from './config'
import { getJSON } from './helpers'

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

export const loadRecipes = async id => {
  try {
    const data = await getJSON(`${API_URL}${id}`)
    const { recipe } = data.data

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    }

    if (state.bookmarks.some(b => b.id === recipe.id))
      state.recipe.isBookmarked = true
    else state.recipe.isBookmarked = false
  } catch (err) {
    throw err
  }
}

export const loadSearchResults = async query => {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`)
    state.search.query = query
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url
      }
    })
    state.search.page = 1
  } catch (err) {
    throw err
  }
}

export const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page
  const start = (page - 1) * state.search.resultsPerPage
  const end = page * state.search.resultsPerPage

  return state.search.results.slice(start, end)
}

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings
  })

  state.recipe.servings = newServings
}

export const addBookmark = recipe => {
  // Add bookmark
  state.bookmarks.push(recipe)

  // Mark the current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true
}

export const deleteBookmark = recipeId => {
  // Delete bookmark
  const index = state.bookmarks.findIndex(b => b.id === recipeId)
  state.bookmarks.splice(index, 1)

  // Mark the current recipe as NOT bookmarked
  if (recipeId === state.recipe.id) state.recipe.isBookmarked = false
}
