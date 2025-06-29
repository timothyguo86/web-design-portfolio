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

class App {
  _map
  _mapEvent

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

    const { lat, lng } = this._mapEvent.latlng
    const popupProperties = {
      autoClose: false,
      maxWidth: 250,
      minWidth: 100,
      closeOnClick: false,
      className: 'cycling-popup',
      title: 'Running'
    }

    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

    L.marker([lat, lng]).addTo(this._map).bindPopup(L.popup(popupProperties)).setPopupContent('test').openPopup()
  }
}

const app = new App()
