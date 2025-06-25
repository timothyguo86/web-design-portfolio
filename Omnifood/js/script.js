const yearEl = document.querySelector('.year')
const btnNavEl = document.querySelector('.btn-mobile-nav')
const headerEl = document.querySelector('.header')
const allLinks = document.querySelectorAll('a:link')
const sectionHeroEl = document.querySelector('.section-hero')

///////////////////////////////////////////////////////////
// Set current year
yearEl.textContent = new Date().getFullYear().toString()

///////////////////////////////////////////////////////////
// Make mobile navigation work
btnNavEl.addEventListener('click', () => headerEl.classList.toggle('nav-open'))

///////////////////////////////////////////////////////////
// Smooth scrolling animation
allLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const href = link.getAttribute('href')

    // Scroll back to top
    if (href === '#')
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

    // Scroll to other links
    if (href !== '#' && href.startsWith('#')) {
      const sectionEl = document.querySelector(href)
      sectionEl.scrollIntoView({ behavior: 'smooth' })
    }

    // Close mobile navigation
    if (link.classList.contains('main-nav-link')) headerEl.classList.toggle('nav-open')
  })
})

///////////////////////////////////////////////////////////
// Sticky navigation
const obs = new IntersectionObserver(
  (entries) => {
    entries[0].isIntersecting ? document.body.classList.remove('sticky') : document.body.classList.add('sticky')
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: '-80px'
  }
)
obs.observe(sectionHeroEl)
