import { COUNTRIES } from './data.js'

/**
 * Initialize a simple hash-based router.
 *
 * Routes:
 *   #/              -> renderHome()
 *   (empty hash)    -> renderHome()
 *   #/country/{id}  -> renderCountry(country)
 *   #/atlas/...     -> renderAtlas(path)
 *   unknown path   -> not-found page
 *
 * @param {Function} renderHome    - Called with no arguments for the home route
 * @param {Function} renderCountry - Called with the matched country object
 */
export function initRouter(renderHome, renderCountry, renderAtlas) {
  function handleRoute() {
    const hash = window.location.hash || '#/'

    if (hash === '#/atlas' || hash.startsWith('#/atlas/')) {
      renderAtlas(hash.slice(1).replace(/\/$/, ''))
      return
    }

    // Match country detail route: #/country/{id}
    const countryMatch = hash.match(/^#\/country\/(.+)$/)

    if (countryMatch) {
      const countryId = countryMatch[1]
      const country = COUNTRIES.find(c => c.id === countryId)
      if (country) {
        renderCountry(country)
      } else {
        // Unknown countries receive a recoverable not-found page.
        renderAtlas(hash.slice(1))
      }
    } else {
      // Home route or any unrecognized route
      if (hash.startsWith('#/') && hash !== '#/') renderAtlas(hash.slice(1))
      else renderHome()
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
