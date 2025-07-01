/**
 * Mapty - Workout Tracking Application
 *
 * This application allows users to track their workouts (running and cycling) on an interactive map.
 * Users can click on the map to add a new workout, specifying the type, distance, duration, and
 * additional metrics specific to the workout type.
 *
 * Key Features:
 * - Geolocation to display the user's current location on the map
 * - Interactive map using the Leaflet library
 * - Ability to add two types of workouts: running and cycling
 * - Form validation for workout inputs
 * - Display of workouts in a list and on the map
 * - Ability to click on a workout to center the map on its location
 * - Local storage to persist workout data
 *
 * Architecture:
 * - Workout: Base class for all workout types
 *   - Running: Extends Workout with running-specific properties (cadence, pace)
 *   - Cycling: Extends Workout with cycling-specific properties (elevation gain, speed)
 * - App: Main application class that handles UI, map interactions, and data management
 *
 * Usage:
 * - The app automatically loads the map centered on the user's location
 * - Click anywhere on the map to add a new workout
 * - Fill in the form with workout details and submit
 * - Click on a workout in the list to center the map on that location
 * - Workouts are automatically saved to local storage
 * - Call app.reset() in the console to clear all saved workouts
 */

'use strict'

// DOM Element Selectors
const selectors = {
  form: document.querySelector('.form'),
  containerWorkouts: document.querySelector('.workouts'),
  inputType: document.querySelector('.form__input--type'),
  inputDistance: document.querySelector('.form__input--distance'),
  inputDuration: document.querySelector('.form__input--duration'),
  inputCadence: document.querySelector('.form__input--cadence'),
  inputElevation: document.querySelector('.form__input--elevation')
}

/**
 * Workout Base Class
 * Parent class for all workout types with common properties and methods
 */
class Workout {
  date = new Date()
  id = uuidv4()

  constructor(coords, distance, duration) {
    this.corrds = coords
    this.distance = distance
    this.duration = duration
  }

  /**
   * Sets the description for the workout
   * Creates a human-readable description based on workout type and date
   * @private
   */
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }
}

/**
 * Running Workout Class
 * Extends the base Workout class with running-specific properties and methods
 */
class Running extends Workout {
  type = 'running'

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
    this._setDescription()
  }

  /**
   * Calculates the pace (min/km) for the running workout
   * @returns {number} The calculated pace
   */
  calcPace() {
    this.pace = this.duration / this.distance
    return this.pace
  }
}

/**
 * Cycling Workout Class
 * Extends the base Workout class with cycling-specific properties and methods
 */
class Cycling extends Workout {
  type = 'cycling'

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration)
    this.elevation = elevation
    this.calcSpeed()
    this._setDescription()
  }

  /**
   * Calculates the speed (km/h) for the cycling workout
   * @returns {number} The calculated speed
   */
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60)
    return this.speed
  }
}

/**
 * Application Architecture
 * Main class that handles the application's functionality including:
 * - Map initialization and interaction
 * - Form handling for new workouts
 * - Workout rendering and storage
 */
class App {
  _map
  _mapZoomLevel = 13
  _mapEvent
  _workouts = []

  constructor() {
    this._getPosition()
    this._getLocalStorage()
    selectors.form.addEventListener('submit', this._newWorkout.bind(this))
    selectors.inputType.addEventListener('change', this._toggleElevationField.bind(this))
    selectors.containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))
  }

  /**
   * Gets the user's current position using the Geolocation API
   * @private
   */
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        error => {
          alert('Could not get your location')
        }
      )
    }
  }

  /**
   * Loads the map centered on the user's position
   * @param {GeolocationPosition} position - The user's geolocation position
   * @private
   */
  _loadMap(position) {
    const { latitude, longitude } = position.coords
    const cords = [latitude, longitude]

    this._map = L.map('map').setView(cords, this._mapZoomLevel)

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map)

    this._map.on('click', this._showForm.bind(this))
    this._workouts.forEach(w => this._renderWorkoutMarker(w))
  }

  /**
   * Shows the workout form when the map is clicked
   * @param {Event} mapE - The map click event
   * @private
   */
  _showForm(mapE) {
    this._mapEvent = mapE
    selectors.form.classList.remove('hidden')
    selectors.inputDistance.focus()
  }

  /**
   * Hides the workout form after submission
   * @private
   */
  _hideForm() {
    selectors.inputDistance.value =
      selectors.inputDuration.value =
      selectors.inputCadence.value =
      selectors.inputElevation.value =
        ''

    selectors.form.style.display = 'none'
    selectors.form.classList.add('hidden')
    setTimeout(() => {
      selectors.form.style.display = 'grid'
    }, 1000) // Same duration as the .hidden animation duration
  }

  /**
   * Toggles between elevation and cadence input fields based on workout type
   * @private
   */
  _toggleElevationField() {
    selectors.inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    selectors.inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  /**
   * Creates a new workout based on form input
   * @param {Event} e - The form submit event
   * @private
   */
  _newWorkout(e) {
    e.preventDefault()

    const type = selectors.inputType.value
    const distance = +selectors.inputDistance.value
    const duration = +selectors.inputDuration.value
    const validInput = (...inputs) => inputs.every(input => input > 0)
    const { lat, lng } = this._mapEvent.latlng

    let workout

    if (type === 'running') {
      const cadence = +selectors.inputCadence.value
      if (!validInput(distance, duration, cadence))
        return alert('Distance, duration and cadence must be greater than 0')

      workout = new Running([lat, lng], distance, duration, cadence)
    } else if (type === 'cycling') {
      const elevation = +selectors.inputElevation.value
      if (!validInput(distance, duration, elevation))
        return alert('Distance, duration and elevation must be greater than 0')

      workout = new Cycling([lat, lng], distance, duration, elevation)
    }

    this._renderWorkoutMarker(workout)
    this._renderWorkout(workout)
    this._hideForm()
    this._workouts.push(workout)
    this._setLocalStorage()
  }

  /**
   * Renders a marker on the map for a workout
   * @param {Workout} workout - The workout to render a marker for
   * @private
   */
  _renderWorkoutMarker(workout) {
    const popupProperties = {
      autoClose: false,
      maxWidth: 250,
      minWidth: 100,
      closeOnClick: false,
      className: `${workout.type}-popup`
    }

    L.marker(workout.corrds)
      .addTo(this._map)
      .bindPopup(L.popup(popupProperties))
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup()
  }

  /**
   * Renders a workout in the workout list
   * @param {Workout} workout - The workout to render
   * @private
   */
  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `

    selectors.containerWorkouts.insertAdjacentHTML('beforeend', html)
  }

  /**
   * Moves the map view to the clicked workout
   * @param {Event} e - The click event
   * @private
   */
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout')
    if (!workoutEl) return
    const workout = this._workouts.find(w => w.id === workoutEl.dataset.id)
    this._map.setView(workout.corrds, this._mapZoomLevel, {
      animate: true,
      pan: { duration: 1 }
    })
  }

  /**
   * Saves workouts to local storage
   * @private
   */
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this._workouts))
  }

  /**
   * Loads workouts from local storage
   * @private
   */
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'))

    if (!data) return

    this._workouts = data

    this._workouts.forEach(w => {
      this._renderWorkout(w)
    })
  }

  /**
   * Resets the application by clearing local storage and reloading the page
   * Can be called from the console with app.reset()
   */
  reset() {
    localStorage.removeItem('workouts')
    location.reload()
  }
}

// Initialize the application
const app = new App()
