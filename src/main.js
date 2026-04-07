import './style.css'
import 'aos/dist/aos.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import 'leaflet/dist/leaflet.css'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

import AOS from 'aos'
import Swiper from 'swiper'
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'
import { COUNTRIES } from './data.js'
import { initGlobe } from './globe.js'
import { initCharts } from './charts.js'
import { initGallery } from './gallery.js'
import { initRouter, navigateTo } from './router.js'
import { renderCountryPage } from './country-page.js'

// ===== CONTINENT CONFIG =====
const CONTINENTS = {
  asia: { label: 'Asia', badge: 'badge-asia', color: '#6c8aff', desc: "From the Himalayas to tropical archipelagos, Asia spans the extremes of Earth's geography." },
  europe: { label: 'Europe', badge: 'badge-europe', color: '#50c878', desc: 'Compact yet incredibly diverse — fjords, volcanoes, alpine peaks, and Mediterranean shores.' },
  americas: { label: 'Americas', badge: 'badge-americas', color: '#ff6c8a', desc: 'Two vast continents stretching from Arctic tundra to Patagonian ice fields.' },
  africa: { label: 'Africa', badge: 'badge-africa', color: '#ffd700', desc: 'The cradle of humanity — savannahs, deserts, rainforests, and the Great Rift Valley.' },
  oceania: { label: 'Oceania', badge: 'badge-oceania', color: '#00bfff', desc: "Island nations and an entire continent surrounded by the world's largest ocean." },
}

const CONTINENT_IMAGES = {
  asia: [
    'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=80',
    'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
  ],
  europe: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80',
  ],
  americas: [
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80',
    'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80',
  ],
  africa: [
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
    'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80',
    'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=1200&q=80',
  ],
  oceania: [
    'https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80',
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80',
    'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=80',
  ],
}

// ===== HEADER =====
function initHeader() {
  const header = document.querySelector('.site-header')
  let lastY = 0
  window.addEventListener('scroll', () => {
    const y = window.scrollY
    if (y > lastY && y > 80) header.classList.add('hidden')
    else header.classList.remove('hidden')
    lastY = y
  })
  // Mobile nav
  const toggle = document.querySelector('.nav-toggle')
  const nav = document.querySelector('nav')
  if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('open'))
  document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')))
}

// ===== RENDER COUNTRIES =====
function renderCountries() {
  const container = document.getElementById('countries-container')
  if (!container) return

  Object.entries(CONTINENTS).forEach(([key, info]) => {
    const countries = COUNTRIES.filter(c => c.continent === key)
    if (!countries.length) return

    const images = CONTINENT_IMAGES[key] || []
    const section = document.createElement('div')
    section.className = 'continent-section'
    section.id = `continent-${key}`
    section.innerHTML = `
      <div class="section-header" data-aos="fade-up">
        <span class="continent-badge ${info.badge}">${info.label}</span>
        <h2>${info.label}</h2>
        <p>${info.desc}</p>
      </div>
      ${images.length ? `
      <div class="continent-carousel" data-aos="fade-up" data-aos-delay="100">
        <div class="swiper continent-swiper-${key}">
          <div class="swiper-wrapper">
            ${images.map(img => `
              <div class="swiper-slide">
                <div class="carousel-slide" style="background-image:url('${img}')"></div>
              </div>
            `).join('')}
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>` : ''}
      <div class="country-grid">
        ${countries.map((c, i) => `
          <div class="country-card" data-id="${c.id}" data-aos="fade-up" data-aos-delay="${i * 80}">
            <div class="card-image">
              <img src="${c.image}" alt="${c.name}" loading="lazy"
                onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#16213e)';this.style.minHeight='220px'">
              <div class="card-overlay"></div>
              <span class="card-flag">${c.flag}</span>
            </div>
            <div class="card-body">
              <h3>${c.name}</h3>
              <div class="subtitle">${c.subtitle}</div>
              <div class="card-tags">${c.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
              <div class="card-stats">
                <div class="card-stat"><div class="val">${c.population}</div><div class="lbl">Population</div></div>
                <div class="card-stat"><div class="val">${c.capital}</div><div class="lbl">Capital</div></div>
                <div class="card-stat"><div class="val">${c.flag}</div><div class="lbl">Flag</div></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`
    container.appendChild(section)
  })

  // Card clicks → navigate to country page
  document.querySelectorAll('.country-card').forEach(card => {
    card.addEventListener('click', () => navigateTo(`#/country/${card.dataset.id}`))
  })
}

// ===== SWIPER INIT =====
function initSwipers() {
  Object.keys(CONTINENTS).forEach(key => {
    const el = document.querySelector(`.continent-swiper-${key}`)
    if (!el) return
    new Swiper(el, {
      modules: [Pagination, Autoplay, EffectFade],
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
      loop: true,
      speed: 1200,
    })
  })
}

// ===== FILTER BAR =====
function setFilter(f) {
  const bar = document.getElementById('filter-bar')
  if (!bar) return
  bar.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === f)
  })
  document.querySelectorAll('.continent-section').forEach(s => {
    if (!s.id.startsWith('continent-')) return
    s.style.display = (f === 'all' || s.id === `continent-${f}`) ? '' : 'none'
  })
}

function initFilters() {
  const bar = document.getElementById('filter-bar')
  if (!bar) return
  const continents = ['all', 'asia', 'europe', 'americas', 'africa', 'oceania']
  const labels = { all: 'All Continents', asia: 'Asia', europe: 'Europe', americas: 'Americas', africa: 'Africa', oceania: 'Oceania' }
  bar.innerHTML = continents.map(c =>
    `<button class="filter-btn${c === 'all' ? ' active' : ''}" data-filter="${c}">${labels[c]}</button>`
  ).join('')
  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn')
    if (!btn) return
    const f = btn.dataset.filter
    setFilter(f)
    if (f !== 'all') {
      const target = document.getElementById(`continent-${f}`)
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  })
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('.hero-stat .num')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return
      const el = e.target, target = parseInt(el.dataset.target)
      let current = 0
      const step = Math.ceil(target / 60)
      const timer = setInterval(() => {
        current += step
        if (current >= target) { current = target; clearInterval(timer) }
        el.textContent = current + (el.dataset.suffix || '')
      }, 20)
      observer.unobserve(el)
    })
  }, { threshold: 0.5 })
  counters.forEach(c => observer.observe(c))
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href^="#/"])').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      const href = a.getAttribute('href')
      const continentMatch = href.match(/^#continent-(.+)$/)
      if (continentMatch) {
        setFilter('all')
        setTimeout(() => {
          const target = document.querySelector(href)
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      } else {
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
}

// ===== ROUTER INTEGRATION =====
function renderHome() {
  document.getElementById('home-view').style.display = ''
  document.getElementById('country-view').style.display = 'none'
  document.querySelector('.site-header').style.display = ''
  window.scrollTo(0, 0)
  AOS.refresh()
}

function renderCountry(country) {
  document.getElementById('home-view').style.display = 'none'
  document.getElementById('country-view').style.display = ''
  document.querySelector('.site-header').style.display = 'none'
  const container = document.getElementById('country-view')
  renderCountryPage(country, container)
  window.scrollTo(0, 0)
}

// ===== MAIN INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // AOS
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  })

  initHeader()
  renderCountries()
  initSwipers()
  initFilters()
  initCounters()
  initSmoothScroll()

  // Globe (non-blocking)
  setTimeout(() => {
    try { initGlobe() } catch (e) { console.warn('Globe init failed:', e) }
  }, 500)

  // Charts (on scroll into view)
  const chartsSection = document.getElementById('stats-section')
  if (chartsSection) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        initCharts()
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    observer.observe(chartsSection)
  }

  // Gallery
  try { initGallery() } catch (e) { console.warn('Gallery init failed:', e) }

  // Router
  initRouter(renderHome, renderCountry)
})
