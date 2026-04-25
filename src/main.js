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
import { attachImageFallbacks, imageAttrs, rotateImageElement } from './assets.js'

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

const LANDSCAPE_GROUPS = [
  { key: 'mountains', label: 'Mountain Systems', terms: ['Mountain', 'Mountains', 'Alps', 'Andes', 'Himalayas', 'Peaks', 'Highlands', 'Fjords'], reps: ['switzerland', 'norway', 'peru'], images: ['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80'], desc: 'High relief routes across alpine ranges, fjord coastlines, volcanic summits, and glacial valleys.' },
  { key: 'deserts', label: 'Drylands & Deserts', terms: ['Desert', 'Dunes', 'Sahara', 'Outback', 'Atacama', 'Arid'], reps: ['namibia', 'chile', 'morocco'], images: ['https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80', 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=1200&q=80', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80'], desc: 'Arid basins, salt pans, canyon systems, dune fields, and coastlines shaped by scarce rainfall.' },
  { key: 'water', label: 'Water Worlds', terms: ['Coast', 'Coastal', 'Islands', 'Beaches', 'Reef', 'Lakes', 'Waterfalls', 'Rainforest'], reps: ['newzealand', 'brazil', 'australia'], images: ['https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80', 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=1200&q=80'], desc: 'Archipelagos, tropical coasts, river basins, reefs, wetlands, and lake districts where water defines the journey.' },
  { key: 'volcanic', label: 'Volcanic & Tectonic', terms: ['Volcanic', 'Volcanoes', 'Geysers', 'Geothermal', 'Ring of Fire', 'Lava'], reps: ['iceland', 'newzealand', 'japan'], images: ['https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=80', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&q=80'], desc: 'Young landscapes built by plate boundaries, active volcanoes, geothermal fields, and uplifted terrain.' },
  { key: 'ice', label: 'Ice & Polar Margins', terms: ['Glacier', 'Glaciers', 'Ice', 'Arctic', 'Subarctic', 'Northern Lights', 'Fjords'], reps: ['iceland', 'norway', 'canada'], images: ['https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&q=80', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80', 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80'], desc: 'Glacier-fed terrain, polar edges, fjords, ice caps, and cold-ocean environments.' },
  { key: 'forests', label: 'Forests & Biodiversity', terms: ['Rainforest', 'Forest', 'Mangrove', 'Biodiverse', 'Wetland', 'Savannahs', 'Wildlife'], reps: ['brazil', 'colombia', 'kenya'], images: ['https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=1200&q=80', 'https://images.unsplash.com/photo-1536086845124-5a5439703e0e?w=1200&q=80', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80'], desc: 'Dense forests, wetlands, savannah corridors, and biodiversity hotspots.' },
  { key: 'heritage', label: 'Cultural Landscapes', terms: ['Ancient', 'Temples', 'Ruins', 'Medinas', 'Civilization', 'Heritage', 'Castle'], reps: ['greece', 'italy', 'morocco'], images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80'], desc: 'Places where geography and long human settlement are tightly layered together.' },
]

const CLIMATE_GROUPS = [
  { key: 'tropical', label: 'Tropical Systems', terms: ['Tropical', 'Monsoon', 'Subtropical'], desc: 'Warm, wet, and seasonally dynamic climates shaped by oceans, monsoons, and latitude.' },
  { key: 'arid', label: 'Arid & Semi-Arid', terms: ['Arid', 'Desert', 'Semi-arid'], desc: 'Dry climates where relief, rivers, and coastlines create sharp ecological contrasts.' },
  { key: 'alpine', label: 'Alpine & Highland', terms: ['Alpine', 'Highland', 'Mountain'], desc: 'Elevation-driven climates with compressed ecological zones and dramatic vertical gradients.' },
  { key: 'temperate', label: 'Temperate & Maritime', terms: ['Temperate', 'Maritime', 'Mediterranean', 'Oceanic'], desc: 'Mid-latitude climates shaped by seas, mountain barriers, and seasonal storm tracks.' },
  { key: 'polar', label: 'Arctic & Subarctic', terms: ['Arctic', 'Subarctic', 'Subpolar'], desc: 'Cold-margin landscapes where ice, permafrost, and low-angle light define experience.' },
]

const FEATURED_JOURNEYS = [
  {
    title: 'Fire, Ice & Plate Boundaries',
    countries: ['iceland', 'japan', 'newzealand', 'italy'],
    focus: 'Volcanic islands, geothermal basins, glacial valleys, and active tectonic margins.',
  },
  {
    title: 'Desert Edge Expedition',
    countries: ['morocco', 'egypt', 'namibia', 'chile'],
    focus: 'Sahara corridors, ancient river valleys, coastal fog deserts, and high-altitude drylands.',
  },
  {
    title: 'Great Mountain Spine',
    countries: ['switzerland', 'peru', 'china', 'canada'],
    focus: 'Alpine relief, Andean civilizations, plateau transitions, and glacial lake systems.',
  },
]

function parseArea(area = '') {
  return Number(area.replace(/,/g, '').replace(/\s*km²/i, '').trim()) || 0
}

function parseHighElevation(elevation = '') {
  const matches = elevation.match(/-?\d[\d,]*/g)
  if (!matches?.length) return 0
  return Math.max(...matches.map(value => Number(value.replace(/,/g, '')) || 0))
}

function totalArea() {
  return COUNTRIES.reduce((sum, country) => sum + parseArea(country.area), 0)
}

function totalLandmarks() {
  return COUNTRIES.reduce((sum, country) => sum + (country.landmarks?.length || 0), 0)
}

function countBy(key) {
  return COUNTRIES.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1
    return acc
  }, {})
}

function countryById(id) {
  return COUNTRIES.find(country => country.id === id)
}

function allText(country) {
  return [
    country.subtitle,
    country.terrain,
    country.climate,
    country.description,
    country.geography,
    ...(country.tags || []),
    ...(country.landmarks || []).flatMap(lm => [lm.name, lm.desc]),
  ].join(' ')
}

function matchesGroup(country, group) {
  const text = allText(country).toLowerCase()
  return group.terms.some(term => text.includes(term.toLowerCase()))
}

function landscapeCountries(group) {
  return COUNTRIES.filter(country => matchesGroup(country, group))
}

function representativeCountries(group, fallbackCountries = []) {
  const selected = (group.reps || []).map(countryById).filter(Boolean)
  const rest = fallbackCountries.filter(country => !selected.some(item => item.id === country.id))
  return [...selected, ...rest]
}

function representativeImages(countries = []) {
  return countries
    .flatMap(country => [country?.heroImage, country?.image, ...(country?.galleryImages || [])])
    .filter(Boolean)
}

function climateCountries(group) {
  return COUNTRIES.filter(country => {
    const climate = (country.climate || '').toLowerCase()
    return group.terms.some(term => climate.includes(term.toLowerCase()))
  })
}

function countryKeywords(country) {
  return [country.continent, country.terrain, country.climate, ...(country.tags || [])].filter(Boolean)
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

function syncHeroStats() {
  const stats = document.querySelectorAll('.hero-stat .num')
  const values = [COUNTRIES.length, Object.keys(countBy('continent')).length, totalLandmarks(), Math.round(totalArea() / 1_000_000)]
  stats.forEach((stat, index) => {
    if (values[index] != null) stat.dataset.target = String(values[index])
  })
}

function renderWorldBrief() {
  const container = document.getElementById('world-brief')
  if (!container) return

  const area = totalArea()
  const continentCounts = countBy('continent')
  const largest = [...COUNTRIES].sort((a, b) => parseArea(b.area) - parseArea(a.area)).slice(0, 4)
  const highest = [...COUNTRIES].sort((a, b) => parseHighElevation(b.elevation) - parseHighElevation(a.elevation)).slice(0, 4)
  const climates = [...new Set(COUNTRIES.map(country => country.climate).filter(Boolean))]

  container.innerHTML = `
    <div class="brief-grid">
      <article class="brief-panel brief-panel-large" data-aos="fade-up">
        <span class="eyebrow">Live collection</span>
        <h3>${COUNTRIES.length} country profiles across ${Object.keys(continentCounts).length} continents</h3>
        <p>GeoVista now works more like a layered field guide: start with global patterns, move into landscape systems, then open a country profile for maps, landmarks, terrain, climate, and photography.</p>
        <div class="brief-metrics">
          <div><strong>${Math.round(area / 1_000_000)}M</strong><span>km² represented</span></div>
          <div><strong>${climates.length}</strong><span>climate descriptions</span></div>
          <div><strong>${totalLandmarks()}</strong><span>mapped landmarks</span></div>
        </div>
      </article>
      <article class="brief-panel" data-aos="fade-up" data-aos-delay="100">
        <span class="eyebrow">Scale</span>
        <h3>Largest Profiles</h3>
        <div class="rank-list">
          ${largest.map((country, index) => `
            <button class="rank-row" data-country="${country.id}">
              <span>${index + 1}</span>
              <strong>${country.flag} ${country.name}</strong>
              <em>${country.area}</em>
            </button>
          `).join('')}
        </div>
      </article>
      <article class="brief-panel" data-aos="fade-up" data-aos-delay="130">
        <span class="eyebrow">Relief</span>
        <h3>Highest Terrain Signals</h3>
        <div class="rank-list">
          ${highest.map((country, index) => `
            <button class="rank-row" data-country="${country.id}">
              <span>${index + 1}</span>
              <strong>${country.flag} ${country.name}</strong>
              <em>${country.elevation}</em>
            </button>
          `).join('')}
        </div>
      </article>
      <article class="brief-panel" data-aos="fade-up" data-aos-delay="160">
        <span class="eyebrow">Coverage</span>
        <h3>Continental Balance</h3>
        <div class="continent-meter-list">
          ${Object.entries(CONTINENTS).map(([key, info]) => {
            const count = continentCounts[key] || 0
            const pct = Math.round((count / COUNTRIES.length) * 100)
            return `<div class="continent-meter"><span>${info.label}</span><div><i style="width:${pct}%"></i></div><strong>${count}</strong></div>`
          }).join('')}
        </div>
      </article>
    </div>
  `

  container.querySelectorAll('[data-country]').forEach(button => {
    button.addEventListener('click', () => navigateTo(`#/country/${button.dataset.country}`))
  })
}

function renderClimateMatrix() {
  const container = document.getElementById('climate-matrix')
  if (!container) return

  container.innerHTML = CLIMATE_GROUPS.map((group, index) => {
    const countries = climateCountries(group)
    return `
      <article class="climate-card" data-aos="fade-up" data-aos-delay="${index * 70}">
        <div class="climate-card-top">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${countries.length}</strong>
        </div>
        <h3>${group.label}</h3>
        <p>${group.desc}</p>
        <div class="climate-countries">
          ${countries.slice(0, 6).map(country => `<button data-country="${country.id}">${country.flag} ${country.name}</button>`).join('')}
        </div>
      </article>
    `
  }).join('')

  container.querySelectorAll('[data-country]').forEach(button => {
    button.addEventListener('click', () => navigateTo(`#/country/${button.dataset.country}`))
  })
}

function renderExplorer() {
  const container = document.getElementById('atlas-explorer')
  if (!container) return

  container.innerHTML = `
    <div class="explorer-shell" data-aos="fade-up">
      <div class="explorer-controls">
        <input class="explorer-search" type="search" placeholder="Search country, terrain, climate, landmark" aria-label="Search countries">
        <select class="explorer-select" data-filter="continent" aria-label="Filter by continent">
          <option value="all">All continents</option>
          ${Object.entries(CONTINENTS).map(([key, info]) => `<option value="${key}">${info.label}</option>`).join('')}
        </select>
        <select class="explorer-select" data-filter="landscape" aria-label="Filter by landscape">
          <option value="all">All landscapes</option>
          ${LANDSCAPE_GROUPS.map(group => `<option value="${group.key}">${group.label}</option>`).join('')}
        </select>
        <select class="explorer-select" data-filter="sort" aria-label="Sort countries">
          <option value="name">Sort by name</option>
          <option value="area">Largest area</option>
          <option value="elevation">Highest terrain</option>
          <option value="landmarks">Most landmarks</option>
        </select>
      </div>
      <div class="explorer-meta"></div>
      <div class="explorer-results"></div>
    </div>
  `

  const search = container.querySelector('.explorer-search')
  const continent = container.querySelector('[data-filter="continent"]')
  const landscape = container.querySelector('[data-filter="landscape"]')
  const sort = container.querySelector('[data-filter="sort"]')
  const meta = container.querySelector('.explorer-meta')
  const results = container.querySelector('.explorer-results')

  const render = () => {
    const query = search.value.trim().toLowerCase()
    let rows = [...COUNTRIES]
    if (continent.value !== 'all') rows = rows.filter(country => country.continent === continent.value)
    if (landscape.value !== 'all') {
      const group = LANDSCAPE_GROUPS.find(item => item.key === landscape.value)
      if (group) rows = rows.filter(country => matchesGroup(country, group))
    }
    if (query) {
      rows = rows.filter(country => allText(country).toLowerCase().includes(query) || country.name.toLowerCase().includes(query) || country.capital.toLowerCase().includes(query))
    }
    rows.sort((a, b) => {
      if (sort.value === 'area') return parseArea(b.area) - parseArea(a.area)
      if (sort.value === 'elevation') return parseHighElevation(b.elevation) - parseHighElevation(a.elevation)
      if (sort.value === 'landmarks') return (b.landmarks?.length || 0) - (a.landmarks?.length || 0)
      return a.name.localeCompare(b.name)
    })

    meta.textContent = `${rows.length} profiles matched`
    results.innerHTML = rows.slice(0, 12).map(country => `
      <button class="explorer-row" data-country="${country.id}">
        <span>${country.flag}</span>
        <strong>${country.name}</strong>
        <em>${CONTINENTS[country.continent]?.label || country.continent}</em>
        <small>${country.climate}</small>
      </button>
    `).join('')

    results.querySelectorAll('[data-country]').forEach(button => {
      button.addEventListener('click', () => navigateTo(`#/country/${button.dataset.country}`))
    })
  }

  ;[search, continent, landscape, sort].forEach(control => control.addEventListener('input', render))
  render()
}

function renderLandscapeAtlas() {
  const container = document.getElementById('landscape-atlas')
  if (!container) return

  container.innerHTML = LANDSCAPE_GROUPS.map((group, index) => {
    const countries = landscapeCountries(group)
    const displayCountries = representativeCountries(group, countries)
    const images = group.images?.length ? group.images : representativeImages(displayCountries)
    const image = images[0] || ''
    const extraUrls = images.slice(1, 3)
    return `
      <article class="landscape-card" data-landscape="${group.key}" data-aos="fade-up" data-aos-delay="${index * 80}">
        <div class="landscape-media">
          <img ${imageAttrs(image, group.label, 900, '', { keywords: [group.label, 'landscape', 'geography'], extraUrls })}>
          <span>${countries.length} profiles</span>
        </div>
        <div class="landscape-body">
          <h3>${group.label}</h3>
          <p>${group.desc}</p>
          <div class="mini-country-list">
            ${displayCountries.slice(0, 5).map(country => `<button data-country="${country.id}">${country.flag} ${country.name}</button>`).join('')}
          </div>
        </div>
      </article>
    `
  }).join('')

  container.querySelectorAll('[data-country]').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation()
      navigateTo(`#/country/${button.dataset.country}`)
    })
  })
}

function renderJourneys() {
  const container = document.getElementById('journey-planner')
  if (!container) return

  container.innerHTML = FEATURED_JOURNEYS.map((journey, index) => {
    const countries = journey.countries.map(countryById).filter(Boolean)
    return `
      <article class="journey-card" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="journey-index">0${index + 1}</div>
        <div>
          <h3>${journey.title}</h3>
          <p>${journey.focus}</p>
          <div class="journey-route">
            ${countries.map(country => `<button data-country="${country.id}">${country.flag}<span>${country.name}</span></button>`).join('')}
          </div>
        </div>
      </article>
    `
  }).join('')

  container.querySelectorAll('[data-country]').forEach(button => {
    button.addEventListener('click', () => navigateTo(`#/country/${button.dataset.country}`))
  })
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
                <div class="carousel-slide"><img ${imageAttrs(img, `${info.label} landscape`, 1200, '', { keywords: [info.label, 'continent', 'landscape'] })}></div>
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
              <img ${imageAttrs(c.image, c.name, 800, '', { keywords: countryKeywords(c) })}>
              <div class="card-overlay"></div>
              <span class="card-flag">${c.flag}</span>
            </div>
            <div class="card-body">
              <h3>${c.name}</h3>
              <div class="subtitle">${c.subtitle}</div>
              <div class="card-tags">${c.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
              <p class="card-summary">${c.terrain}</p>
              <div class="card-stats">
                <div class="card-stat"><div class="val">${c.population}</div><div class="lbl">Population</div></div>
                <div class="card-stat"><div class="val">${c.capital}</div><div class="lbl">Capital</div></div>
                <div class="card-stat"><div class="val">${c.elevation.split(' - ').pop() || c.elevation}</div><div class="lbl">High point</div></div>
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
    const country = countryById(card.dataset.id)
    const img = card.querySelector('img')
    rotateImageElement(img, [country?.image, ...(country?.galleryImages || [])].filter(Boolean), 8500 + Math.floor(Math.random() * 2500), { label: country?.name, keywords: country ? countryKeywords(country) : [] })
  })
  attachImageFallbacks(container)
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
  attachImageFallbacks()
  AOS.refresh()
}

function renderCountry(country) {
  document.getElementById('home-view').style.display = 'none'
  document.getElementById('country-view').style.display = ''
  document.querySelector('.site-header').style.display = 'none'
  const container = document.getElementById('country-view')
  renderCountryPage(country, container)
  window.scrollTo(0, 0)
  attachImageFallbacks(container)
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
  syncHeroStats()
  renderWorldBrief()
  renderLandscapeAtlas()
  renderClimateMatrix()
  renderExplorer()
  renderJourneys()
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
