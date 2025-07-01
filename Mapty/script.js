'use strict'

const form = document.querySelector('.form')
const containerWorkouts = document.querySelector('.workouts')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('.form__input--distance')
const inputDuration = document.querySelector('.form__input--duration')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')

class Workout {
  date = new Date()
  id = uuidv4()

  constructor(coords, distance, duration) {
    this.corrds = coords
    this.distance = distance
    this.duration = duration
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }
}

class Running extends Workout {
  type = 'running'

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
    this._setDescription()
  }

  calcPace() {
    this.pace = this.distance / this.duration
    return this.pace
  }
}

class Cycling extends Workout {
  type = 'cycling'

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration)
    this.elevation = elevation
    this.calcSpeed()
    this._setDescription()
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60)
    return this.speed
  }
}

////////////////////////////////////
// Application Architecture
class App {
  _map
  _mapEvent
  _workouts = []

  constructor() {
    this._getPosition()
    form.addEventListener('submit', this._newWorkout.bind(this))
    inputType.addEventListener('change', this._toggleElevationField.bind(this))
  }

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

  _loadMap(position) {
    const { latitude, longitude } = position.coords
    const cords = [latitude, longitude]

    this._map = L.map('map').setView(cords, 13)

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map)

    this._map.on('click', this._showForm.bind(this))
  }

  _showForm(mapE) {
    this._mapEvent = mapE
    form.classList.remove('hidden')
    inputDistance.focus()
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        ''

    form.style.display = 'none'
    form.classList.add('hidden')
    setTimeout(() => {
      form.style.display = 'grid'
    }, 1000) // Same duration as the .hidden animation duration
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  _newWorkout(e) {
    e.preventDefault()

    const type = inputType.value
    const distance = inputDistance.value
    const duration = inputDuration.value
    const validInput = (...inputs) => inputs.every(input => input > 0)
    const { lat, lng } = this._mapEvent.latlng

    let workout

    if (type === 'running') {
      const cadence = +inputCadence.value
      if (!validInput(distance, duration, cadence))
        return alert('Distance, duration and cadence must be greater than 0')

      workout = new Running([lat, lng], distance, duration, cadence)
    } else if (type === 'cycling') {
      const elevation = +inputElevation.value
      if (!validInput(distance, duration, elevation))
        return alert('Distance, duration and elevation must be greater than 0')

      workout = new Cycling([lat, lng], distance, duration, elevation)
    }

    this._renderWorkoutMarker(workout)
    this._renderWorkout(workout)
    this._hideForm()
    this._workouts.push(workout)
  }

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

    console.log(workout)
  }

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
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `

    containerWorkouts.insertAdjacentHTML('beforeend', html)
  }
}

const app = new App()
