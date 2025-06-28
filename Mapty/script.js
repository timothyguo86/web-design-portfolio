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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords
      const cords = [latitude, longitude]

      const map = L.map('map').setView(cords, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      map.on('click', mapEvent => {
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
    },
    error => {
      alert('Could not get your location')
    }
  )
}
