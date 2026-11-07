import './style.css'
import './field.css'
import './product.css'
import { initRouter } from './router.js'
import { initDiscovery, utilityNav, refreshSavedButtons, pageLabel } from './discovery.js'
import { localStore } from './local-store.js'
import { NODES } from './atlas-data.js'
import { attachImageFallbacks, releaseImages } from './assets.js'

const home = document.getElementById('home-view'), detail = document.getElementById('country-view')
let cleanup, homeModule, version = 0, previousHash = null
const positions = new Map()
history.scrollRestoration = 'manual'
initDiscovery()
document.querySelector('.header-inner').insertAdjacentHTML('beforeend', `<div class="home-utilities">${utilityNav()}</div>`)
document.querySelector('.skip-link').addEventListener('click', e => { e.preventDefault(); const target = home.style.display === 'none' ? detail.querySelector('h1') : home.querySelector('h1'); target?.focus(); target?.scrollIntoView({ block: 'start' }) })

async function show(kind, value) {
  const currentVersion = ++version, hash = location.hash || '#/'
  if (previousHash) positions.set(previousHash, window.scrollY)
  previousHash = hash
  cleanup?.(); cleanup = null
  releaseImages(detail)
  homeModule?.setHomeActive(false)
  home.style.display = 'none'; detail.style.display = ''
  detail.innerHTML = '<main class="atlas-shell route-loading" aria-busy="true"><p role="status">Opening your next landscape…</p></main>'
  try {
    if (kind === 'home') {
      const module = await import('./home.js'); if (currentVersion !== version) return
      homeModule = module; detail.style.display = 'none'; home.style.display = ''
      document.querySelector('.site-header').style.display = ''
      module.initHome(); module.setHomeActive(true)
      document.title = 'GeoVista — Explore Earth’s Landscapes'
      const recent = localStore().state().recent[0], resume = document.getElementById('resume-exploration')
      resume.hidden = !recent
      if (recent) { resume.href = `#${recent}`; resume.textContent = `Continue: ${pageLabel(NODES.get(recent))} →` }
      attachImageFallbacks(home)
    } else if (kind === 'country') {
      const module = await import('./country-page.js'); if (currentVersion !== version) return
      cleanup = module.renderCountryPage(value, detail)
      document.title = `${value.name} · GeoVista`
    } else if (value === '/library') {
      const module = await import('./library.js'); if (currentVersion !== version) return
      cleanup = module.renderLibrary(detail)
    } else {
      const module = await import('./atlas.js'); if (currentVersion !== version) return
      localStore().visit(value)
      cleanup = module.renderAtlas(value, detail)
    }
    refreshSavedButtons()
    const heading = (kind === 'home' ? home : detail).querySelector('h1')
    heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true })
    window.scrollTo({ top: positions.get(hash) || 0, behavior: 'instant' })
    if (kind === 'home' && hash !== '#/' && !hash.startsWith('#/')) {
      const target = document.getElementById(hash.slice(1)); target?.scrollIntoView({ behavior: 'instant' })
    }
  } catch (error) {
    if (currentVersion !== version) return
    home.style.display = 'none'; detail.style.display = ''
    detail.innerHTML = '<main class="atlas-shell"><h1 tabindex="-1">This page could not load.</h1><p>Check your connection and try again. Your saved notes remain in this browser.</p><button class="atlas-button" id="retry-route">Try again</button> <a href="#/">Return to overview</a></main>'
    detail.querySelector('#retry-route').addEventListener('click', () => show(kind, value))
    detail.querySelector('h1').focus()
    console.error('Page load failed', error)
  }
}
initRouter(() => show('home'), country => show('country', country), path => show('atlas', path))
