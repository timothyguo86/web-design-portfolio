'use strict'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
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

    console.log(this.id)
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
  }

  calcPace() {
    this.pace = this.distance / this.duration
    return this.pace
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration)
    this.elevation = elevation
    this.calcSpeed()
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
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), error => {
        alert('Could not get your location')
      })
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords
    const cords = [latitude, longitude]

    this._map = L.map('map').setView(cords, 13)

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map)

    this._map.on('click', this._showForm.bind(this))
  }

  _showForm(mapE) {
    this._mapEvent = mapE
    form.classList.remove('hidden')
    inputDistance.focus()
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
    this._workouts.push(workout)

    const popupProperties = {
      autoClose: false,
      maxWidth: 250,
      minWidth: 100,
      closeOnClick: false,
      className: 'cycling-popup'
    }

    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

    L.marker([lat, lng]).addTo(this._map).bindPopup(L.popup(popupProperties)).setPopupContent('test').openPopup()
  }
}

const app = new App()
