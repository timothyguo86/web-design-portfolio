'use strict';

/**
 * Bankist Website JavaScript
 * This file contains all the interactive functionality for the Bankist marketing website
 */

///////////////////////////////////////
// DOM Element Selections
///////////////////////////////////////

// Modal elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Scroll elements
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// Tab elements
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');

// Navigation elements
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const logo = document.querySelector('.nav__logo');

///////////////////////////////////////
// Modal Window Functionality
///////////////////////////////////////

/**
 * Opens the modal window
 * @param {Event} e - The event object
 */
const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

/**
 * Closes the modal window
 */
const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

/**
 * Initialize modal window functionality
 */
const initModal = () => {
  // Open modal button
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  // Close modal buttons
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Close modal with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};

///////////////////////////////////////
// Smooth Scrolling
///////////////////////////////////////

/**
 * Initialize smooth scrolling functionality
 */
const initSmoothScrolling = () => {
  // Button scroll
  btnScrollTo.addEventListener('click', () => {
    section1.scrollIntoView({ behavior: 'smooth' });
  });

  // Navigation links scroll
  navLinks.addEventListener('click', e => {
    e.preventDefault();

    // Matching strategy (only proceed if nav link was clicked)
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
};

///////////////////////////////////////
// Tabbed Component
///////////////////////////////////////

/**
 * Initialize tabbed component functionality
 */
const initTabbedComponent = () => {
  tabsContainer.addEventListener('click', e => {
    // Find closest parent tab element (if clicked on child element)
    const clickedTab = e.target.closest('.operations__tab');

    // Guard clause - if click is not on a tab, return early
    if (!clickedTab) return;

    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

    // Add active class to clicked tab
    clickedTab.classList.add('operations__tab--active');

    // Get currently active content
    const activeContent = document.querySelector('.operations__content--active');

    // Apply fade-out animation
    activeContent.classList.add('operations__content--fade-out');

    // Wait for animation to complete before switching content
    setTimeout(() => {
      // Remove active and fade-out classes
      activeContent.classList.remove('operations__content--active', 'operations__content--fade-out');

      // Activate new content with fade-in animation (applied via CSS)
      document
        .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
        .classList.add('operations__content--active');
    }, 200);
  });
};

///////////////////////////////////////
// Menu Fade Animation
///////////////////////////////////////

/**
 * Handle hover effect on navigation links
 * @param {Event} e - The event object
 * @param {number} opacity - The opacity value to set
 */
const handleHover = function(e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const hoveredLink = e.target;
    const siblings = hoveredLink.closest('.nav').querySelectorAll('.nav__link');

    // Change opacity of all siblings except the hovered one
    siblings.forEach(link => {
      if (link !== hoveredLink) link.style.opacity = opacity;
    });

    // Also change logo opacity
    logo.style.opacity = opacity;
  }
};

/**
 * Initialize menu fade animation
 */
const initMenuFade = () => {
  // Using bind to set the opacity parameter
  nav.addEventListener('mouseover', e => handleHover(e, 0.5));
  nav.addEventListener('mouseout', e => handleHover(e, 1));
};

///////////////////////////////////////
// Initialize All Functionality
///////////////////////////////////////

/**
 * Initialize all website functionality
 */
const init = () => {
  initModal();
  initSmoothScrolling();
  initTabbedComponent();
  initMenuFade();
};

// Start the application
init();
