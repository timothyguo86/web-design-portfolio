// local imports
import { API_KEY, API_URL, RES_PER_PAGE } from './config'
import { getJSON, sendJSON } from './helpers'

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

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

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

  persistBookmarks()
}

export const deleteBookmark = recipeId => {
  // Delete bookmark
  const index = state.bookmarks.findIndex(b => b.id === recipeId)
  state.bookmarks.splice(index, 1)

  // Mark the current recipe as NOT bookmarked
  if (recipeId === state.recipe.id) state.recipe.isBookmarked = false

  persistBookmarks()
}

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

const init = () => {
  const storedBookmarks = localStorage.getItem('bookmarks')
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks)
}

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
