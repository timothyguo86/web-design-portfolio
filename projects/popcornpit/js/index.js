const omdbApiKey = '466d8bb1'

const autoCompleteConfig = {
  renderOption: movie => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `
  },
  inputValue: movie => movie.Title,
  async fetchData(searchTerm) {
    try {
      const response = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: omdbApiKey,
          s: searchTerm
        }
      })

      if (response.data.Error) {
        return []
      }

      return response.data.Search
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }
}

const createAutoCompleteWithConfig = (
  config,
  rootSelector,
  summarySelector
) => {
  createAutoComplete({
    ...config,
    root: document.querySelector(rootSelector),
    onOptionSelect(movie) {
      document.querySelector('.tutorial').classList.add('is-hidden')
      onMovieSelect(movie, document.querySelector(summarySelector))
    }
  })
}

createAutoCompleteWithConfig(
  autoCompleteConfig,
  '#left-autocomplete',
  '#left-summary'
)
createAutoCompleteWithConfig(
  autoCompleteConfig,
  '#right-autocomplete',
  '#right-summary'
)

let leftMovie, rightMovie

const onMovieSelect = async (movie, summaryElement) => {
  try {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: omdbApiKey,
        i: movie.imdbID
      }
    })

    summaryElement.innerHTML = movieTemplate(response.data)

    if (summaryElement.id === 'left-summary') {
      leftMovie = response.data
    } else {
      rightMovie = response.data
    }

    if (leftMovie && rightMovie) {
      runComparison()
    }
  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  )

  leftSideStats.forEach((leftStat, i) => {
    const rightStat = rightSideStats[i]
    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = rightStat.dataset.value

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

const movieTemplate = movieDetail => {
  const dollars = convertToNumber(movieDetail.BoxOffice)
  const metascore = convertToNumber(movieDetail.Metascore)
  const imdbRating = convertToNumber(movieDetail.imdbRating)
  const imdbVotes = convertToNumber(movieDetail.imdbVotes)

  // totalAwards includes both awards and anominations
  const awards = movieDetail.Awards.split(' ').reduce((pre, word) => {
    const value = parseInt(word)
    return isNaN(value) ? pre : pre + value
  }, 0)

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" alt="${movieDetail.Title}" />
        </p>
      </figure>
      <div class="media-conten">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary has-text-dark">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary has-text-dark">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary has-text-dark">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary has-text-dark">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary has-text-dark">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}
