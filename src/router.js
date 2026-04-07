import { COUNTRIES } from './data.js'

/**
 * Initialize a simple hash-based router.
 *
 * Routes:
 *   #/              -> renderHome()
 *   (empty hash)    -> renderHome()
 *   #/country/{id}  -> renderCountry(country)
 *
 * @param {Function} renderHome    - Called with no arguments for the home route
 * @param {Function} renderCountry - Called with the matched country object
 */
export function initRouter(renderHome, renderCountry) {
  function handleRoute() {
    const hash = window.location.hash || '#/'

    // Match country detail route: #/country/{id}
    const countryMatch = hash.match(/^#\/country\/(.+)$/)

    if (countryMatch) {
      const countryId = countryMatch[1]
      const country = COUNTRIES.find(c => c.id === countryId)
      if (country) {
        renderCountry(country)
      } else {
        // Country not found, fall back to home
        renderHome()
      }
    } else {
      // Home route or any unrecognized route
      renderHome()
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute)

  // Route on initial page load
  handleRoute()
}

/**
 * Programmatically navigate to a hash route.
 *
 * @param {string} hash - The hash to navigate to (e.g. '#/' or '#/country/japan')
 */
export function navigateTo(hash) {
  window.location.hash = hash
}
