'use strict'

/**
 * Omnifood Website JavaScript
 * This file contains all the functionality for the Omnifood website including:
 * - Current year display
 * - Mobile navigation
 * - Smooth scrolling
 * - Sticky navigation
 */

// DOM Element Selectors
const selectors = {
  year: document.querySelector('.year'),
  btnMobileNav: document.querySelector('.btn-mobile-nav'),
  header: document.querySelector('.header'),
  allLinks: document.querySelectorAll('a:link'),
  sectionHero: document.querySelector('.section-hero')
}

/**
 * Year Display Functionality
 * Updates the year element with the current year
 */
const yearDisplay = {
  init: function () {
    selectors.year.textContent = new Date().getFullYear().toString()
  }
}

/**
 * Mobile Navigation Functionality
 * Handles the mobile navigation toggle
 */
const mobileNavigation = {
  init: function () {
    selectors.btnMobileNav.addEventListener('click', () => {
      selectors.header.classList.toggle('nav-open')
    })
  }
}

/**
 * Smooth Scrolling Functionality
 * Handles smooth scrolling for all links
 */
const smoothScrolling = {
  init: function () {
    selectors.allLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        const href = link.getAttribute('href')

        // Scroll back to top
        if (href === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }

        // Scroll to other links
        if (href !== '#' && href.startsWith('#')) {
          const sectionEl = document.querySelector(href)
          sectionEl.scrollIntoView({ behavior: 'smooth' })
        }

        // Close mobile navigation
        if (link.classList.contains('main-nav-link')) {
          selectors.header.classList.toggle('nav-open')
        }
      })
    })
  }
}

/**
 * Sticky Navigation Functionality
 * Adds sticky navigation when scrolling past the hero section
 */
const stickyNavigation = {
  init: function () {
    const navObserver = new IntersectionObserver(
      entries => {
        entries[0].isIntersecting ? document.body.classList.remove('sticky') : document.body.classList.add('sticky')
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-80px'
      }
    )

    navObserver.observe(selectors.sectionHero)
  }
}

/**
 * Initialize all functionality
 */
const init = function () {
  yearDisplay.init()
  mobileNavigation.init()
  smoothScrolling.init()
  stickyNavigation.init()
}

// Start the application
init()
