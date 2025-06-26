'use strict'

const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')

const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')

const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')

const nav = document.querySelector('.nav')
const navLinks = document.querySelector('.nav__links')
const logo = document.querySelector('.nav__logo')

const header = document.querySelector('.header')

const allSections = document.querySelectorAll('.section')

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

// Cookie message
const message = document.createElement('div')
message.classList.add('cookie-message')
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--sm btn--close-cookie">Got it!</button>'
header.append(message)
document.querySelector('.btn--close-cookie').addEventListener('click', () => message.remove())

// Smooth scrolling animation
btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' })
})

// Page navigation
navLinks.addEventListener('click', e => {
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

// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const clickedLink = e.target
    const siblings = clickedLink.closest('.nav').querySelectorAll('.nav__link')

    siblings.forEach(link => {
      if (link !== clickedLink) link.style.opacity = opacity
    })
    logo.style.opacity = opacity
  }
}

nav.addEventListener('mouseover', e => handleHover(e, 0.5))
nav.addEventListener('mouseout', e => handleHover(e, 1))

// Sticky navigation
const navHeight = nav.getBoundingClientRect().height
const obsCallback = entries =>
  entries[0].isIntersecting ? nav.classList.remove('sticky') : nav.classList.add('sticky')
const navObsOptions = { root: null, threshold: 0.6, rootMargin: `-${navHeight}px` }
const headerObserver = new IntersectionObserver(obsCallback, navObsOptions)
headerObserver.observe(header)

// Reveal sections
const revealSection = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) return
    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)
  })
}
const sectionObsOption = { root: null, threshold: 0.1 }
const sectionObserver = new IntersectionObserver(revealSection, sectionObsOption)
allSections.forEach(section => {
  section.classList.add('section--hidden')
  sectionObserver.observe(section)
})
