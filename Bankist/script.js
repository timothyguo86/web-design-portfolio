'use strict'

/**
 * Bankist Website JavaScript
 * This file contains all the functionality for the Bankist website including:
 * - Modal windows
 * - Smooth scrolling
 * - Tabbed components
 * - Menu animations
 * - Sticky navigation
 * - Section revealing
 * - Lazy loading images
 * - Slider functionality
 */

// DOM Element Selectors
const selectors = {
  // Modal elements
  modal: document.querySelector('.modal'),
  overlay: document.querySelector('.overlay'),
  btnCloseModal: document.querySelector('.btn--close-modal'),
  btnsOpenModal: document.querySelectorAll('.btn--show-modal'),

  // Navigation elements
  nav: document.querySelector('.nav'),
  navLinks: document.querySelector('.nav__links'),
  logo: document.querySelector('.nav__logo'),

  // Scroll elements
  btnScrollTo: document.querySelector('.btn--scroll-to'),
  section1: document.querySelector('#section--1'),

  // Tabbed component elements
  tabs: document.querySelectorAll('.operations__tab'),
  tabsContainer: document.querySelector('.operations__tab-container'),

  // Section elements
  header: document.querySelector('.header'),
  allSections: document.querySelectorAll('.section'),

  // Image elements
  imgTargets: document.querySelectorAll('img[data-src]'),

  // Slider elements
  slides: document.querySelectorAll('.slide'),
  slidePrevBtn: document.querySelector('.slider__btn--left'),
  slideNextBtn: document.querySelector('.slider__btn--right'),
  dotContainer: document.querySelector('.dots')
}

/**
 * Modal Window Functionality
 */
const modal = {
  open: function (e) {
    e.preventDefault()
    selectors.modal.classList.remove('hidden')
    selectors.overlay.classList.remove('hidden')
  },

  close: function () {
    selectors.modal.classList.add('hidden')
    selectors.overlay.classList.add('hidden')
  },

  init: function () {
    // Add event listeners for opening and closing modal
    selectors.btnsOpenModal.forEach(btn => btn.addEventListener('click', this.open))
    selectors.btnCloseModal.addEventListener('click', this.close)
    selectors.overlay.addEventListener('click', this.close)

    // Close modal with Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !selectors.modal.classList.contains('hidden')) {
        this.close()
      }
    })
  }
}

/**
 * Cookie Message Functionality
 */
const cookieMessage = {
  create: function () {
    const message = document.createElement('div')
    message.classList.add('cookie-message')
    message.innerHTML =
      'We use cookies for improved functionality and analytics. <button class="btn btn--sm btn--close-cookie">Got it!</button>'
    selectors.header.prepend(message)

    // Add event listener for closing cookie message
    document.querySelector('.btn--close-cookie').addEventListener('click', () => {
      message.classList.add('cookie-message--fade-out')
      setTimeout(() => {
        message.remove()
      }, 500)
    })
  }
}

/**
 * Smooth Scrolling Functionality
 */
const smoothScroll = {
  init: function () {
    // Button scroll
    selectors.btnScrollTo.addEventListener('click', () => {
      selectors.section1.scrollIntoView({ behavior: 'smooth' })
    })

    // Navigation links scroll
    selectors.navLinks.addEventListener('click', e => {
      e.preventDefault()
      if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href')
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
}

/**
 * Tabbed Component Functionality
 */
const tabbedComponent = {
  init: function () {
    selectors.tabsContainer.addEventListener('click', e => {
      const clickedTab = e.target.closest('.operations__tab')
      if (!clickedTab) return

      // Remove active class from all tabs
      selectors.tabs.forEach(tab => tab.classList.remove('operations__tab--active'))

      // Add active class to clicked tab
      clickedTab.classList.add('operations__tab--active')

      // Fade out current content
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
  }
}

/**
 * Menu Fade Animation Functionality
 */
const menuFade = {
  handleHover: function (e, opacity) {
    if (e.target.classList.contains('nav__link')) {
      const clickedLink = e.target
      const siblings = clickedLink.closest('.nav').querySelectorAll('.nav__link')

      siblings.forEach(link => {
        if (link !== clickedLink) link.style.opacity = opacity
      })
      selectors.logo.style.opacity = opacity
    }
  },

  init: function () {
    // Add event listeners for hover effects
    selectors.nav.addEventListener('mouseover', e => this.handleHover(e, 0.5))
    selectors.nav.addEventListener('mouseout', e => this.handleHover(e, 1))
  }
}

/**
 * Sticky Navigation Functionality
 */
const stickyNav = {
  init: function () {
    const navHeight = selectors.nav.getBoundingClientRect().height

    const obsCallback = entries =>
      entries[0].isIntersecting ? selectors.nav.classList.remove('sticky') : selectors.nav.classList.add('sticky')

    const navObsOptions = {
      root: null,
      threshold: 0.6,
      rootMargin: `-${navHeight}px`
    }

    const headerObserver = new IntersectionObserver(obsCallback, navObsOptions)
    headerObserver.observe(selectors.header)
  }
}

/**
 * Section Reveal Functionality
 */
const sectionReveal = {
  init: function () {
    const revealSection = (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove('section--hidden')
        observer.unobserve(entry.target)
      })
    }

    const sectionObsOptions = { root: null, threshold: 0.1 }
    const sectionObserver = new IntersectionObserver(revealSection, sectionObsOptions)

    selectors.allSections.forEach(section => {
      section.classList.add('section--hidden')
      sectionObserver.observe(section)
    })
  }
}

/**
 * Lazy Loading Images Functionality
 */
const lazyLoading = {
  init: function () {
    const loadImage = (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        // Replace src with data-src
        entry.target.src = entry.target.dataset.src

        // Remove blur filter when image is loaded
        entry.target.addEventListener('load', () => {
          entry.target.classList.remove('lazy-img')
        })

        observer.unobserve(entry.target)
      })
    }

    const imgObsOptions = {
      root: null,
      threshold: 0,
      rootMargin: '200px'
    }

    const imgObserver = new IntersectionObserver(loadImage, imgObsOptions)
    selectors.imgTargets.forEach(img => imgObserver.observe(img))
  }
}

/**
 * Slider Functionality
 */
const slider = {
  currentSlide: 0,

  init: function () {
    const maxSlide = selectors.slides.length

    // Create dots for slider
    const createDots = () => {
      selectors.slides.forEach((_, i) => {
        selectors.dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
      })
    }

    // Activate dot for current slide
    const activateDot = slide => {
      document.querySelectorAll('.dots__dot').forEach(dot => {
        dot.classList.remove('dots__dot--active')
      })

      document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
    }

    // Move slides to position
    const goToSlide = slide => {
      selectors.slides.forEach((s, i) => {
        s.style.transform = `translateX(${(i - slide) * 100}%)`
      })
    }

    // Go to previous slide
    const prevSlide = () => {
      this.currentSlide = this.currentSlide === 0 ? maxSlide - 1 : this.currentSlide - 1
      goToSlide(this.currentSlide)
      activateDot(this.currentSlide)
    }

    // Go to next slide
    const nextSlide = () => {
      this.currentSlide = this.currentSlide === maxSlide - 1 ? 0 : this.currentSlide + 1
      goToSlide(this.currentSlide)
      activateDot(this.currentSlide)
    }

    // Initialize slider
    const initSlider = () => {
      createDots()
      activateDot(0)

      // Position slides
      selectors.slides.forEach((s, i) => {
        s.style.transform = `translateX(${i * 100}%)`

        // Fade in slides except the first one
        if (i !== 0) {
          s.style.opacity = '0'
          setTimeout(() => {
            s.style.opacity = '1'
          }, 1000)
        }
      })
    }

    // Initialize slider
    initSlider()

    // Event handlers
    selectors.slidePrevBtn.addEventListener('click', prevSlide)
    selectors.slideNextBtn.addEventListener('click', nextSlide)

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    })

    // Dot navigation
    selectors.dotContainer.addEventListener('click', e => {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset
        this.currentSlide = parseInt(slide)
        goToSlide(this.currentSlide)
        activateDot(this.currentSlide)
      }
    })
  }
}

/**
 * Initialize all functionality
 */
const init = function () {
  modal.init()
  cookieMessage.create()
  smoothScroll.init()
  tabbedComponent.init()
  menuFade.init()
  stickyNav.init()
  sectionReveal.init()
  lazyLoading.init()
  slider.init()
}

// Start the application
init()
