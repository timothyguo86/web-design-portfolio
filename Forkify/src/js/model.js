export const state = {
  recipe: {}
}

export const loadRecipes = async id => {
  try {
    const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`)
    const data = await res.json()

    if (!res.ok) throw new Error(`${data.message} (${res.status})`)

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
  } catch (err) {
    console.error(err)
  }
}
