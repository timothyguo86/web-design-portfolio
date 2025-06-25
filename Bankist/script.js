'use strict'

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')

const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')

const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')

///////////////////////////////////////
// Modal window
const openModal = e => {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

const closeModal = () => {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

for (const element of btnsOpenModal) element.addEventListener('click', openModal)

btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

// Smooth scrolling animation
btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' })
})

// Page navigation
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault()
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

// Tabbed component
tabsContainer.addEventListener('click', e => {
  const clickedTab = e.target.closest('.operations__tab')
  if (!clickedTab) return

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
  clickedTab.classList.add('operations__tab--active')

  const activeContent = document.querySelector('.operations__content--active')
  activeContent.classList.add('operations__content--fade-out')
  // Wait for animation to complete before switching content
  setTimeout(() => {
    activeContent.classList.remove('operations__content--active', 'operations__content--fade-out')
    document
      .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
      .classList.add('operations__content--active')
  }, 200)
})
