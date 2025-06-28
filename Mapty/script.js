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

let map
let mapEvent

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords
      const cords = [latitude, longitude]

      map = L.map('map').setView(cords, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      map.on('click', mapE => {
        mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
      })
    },
    error => {
      alert('Could not get your location')
    }
  )
}

form.addEventListener('submit', e => {
  e.preventDefault()
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''

  const { lat, lng } = mapEvent.latlng
  const popupProperties = {
    autoClose: false,
    maxWidth: 250,
    minWidth: 100,
    closeOnClick: false,
    className: 'cycling-popup',
    title: 'Running'
  }

  L.marker([lat, lng]).addTo(map).bindPopup(L.popup(popupProperties)).setPopupContent('test').openPopup()
})

inputType.addEventListener('change', () => {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})
