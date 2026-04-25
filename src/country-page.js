import { COUNTRIES } from './data.js'
import { createCountryMap } from './maps.js'
import { attachImageFallbacks, imageAttrs } from './assets.js'

/**
 * Render a full country detail page into the given container element.
 *
 * Layout:
 *  1. Hero banner with heroImage overlay, flag, name, subtitle
 *  2. Quick facts bar (capital, population, area, language, climate, elevation)
 *  3. Overview / description section
 *  4. Interactive Leaflet map with landmarks
 *  5. Geography & terrain section
 *  6. Landmarks grid (2-column, clickable to fly-to on map)
 *  7. Photo gallery (2x2 grid of galleryImages)
 *  8. Back button to #/
 *
 * @param {Object}      country   - Country data object from COUNTRIES
 * @param {HTMLElement}  container - DOM element to render into
 */
export function renderCountryPage(country, container) {
  if (!country || !container) return

  const mapContainerId = `map-${country.id}`
  const imageKeywords = [country.continent, country.terrain, country.climate, ...(country.tags || [])].filter(Boolean)
  const relatedCountries = COUNTRIES
    .filter(item => item.id !== country.id && (item.continent === country.continent || item.tags?.some(tag => country.tags?.includes(tag))))
    .slice(0, 3)

  // Build quick-facts entries, skipping any that are missing
  const facts = [
    { label: 'Capital', value: country.capital },
    { label: 'Population', value: country.population },
    { label: 'Area', value: country.area },
    { label: 'Language', value: country.language },
    { label: 'Climate', value: country.climate },
    { label: 'Elevation', value: country.elevation },
  ].filter(f => f.value)

  const parseArea = area => Number(String(area || '').replace(/,/g, '').replace(/\s*km²/i, '').trim()) || 0
  const parseHighElevation = elevation => {
    const matches = String(elevation || '').match(/-?\d[\d,]*/g)
    if (!matches?.length) return 0
    return Math.max(...matches.map(value => Number(value.replace(/,/g, '')) || 0))
  }
  const continentPeers = COUNTRIES.filter(item => item.continent === country.continent)
  const areaRank = [...COUNTRIES].sort((a, b) => parseArea(b.area) - parseArea(a.area)).findIndex(item => item.id === country.id) + 1
  const elevationRank = [...COUNTRIES].sort((a, b) => parseHighElevation(b.elevation) - parseHighElevation(a.elevation)).findIndex(item => item.id === country.id) + 1

  const factsHtml = facts
    .map(
      f => `
      <div class="cp-fact-card">
        <div class="cp-fact-label">${f.label}</div>
        <div class="cp-fact-value">${f.value}</div>
      </div>`
    )
    .join('')

  // Landmarks HTML
  const landmarksHtml = (country.landmarks || [])
    .map(
      (lm, i) => `
      <div class="cp-landmark-card" data-landmark-index="${i}" title="Click to locate on map">
        <span class="cp-landmark-icon">${lm.icon || ''}</span>
        <div class="cp-landmark-body">
          <h4>${lm.name}</h4>
          <p>${lm.desc || ''}</p>
        </div>
      </div>`
    )
    .join('')

  // Gallery HTML (2x2 grid)
  const galleryImages = country.galleryImages || []
  const galleryHtml = galleryImages.length
    ? `
    <section class="cp-section">
      <h3 class="cp-section-title">Photo Gallery</h3>
      <div class="cp-gallery-grid">
        ${galleryImages
          .slice(0, 4)
          .map(
            url => `
          <div class="cp-gallery-item">
            <img ${imageAttrs(url, country.name, 800, '', { keywords: imageKeywords })}>
          </div>`
          )
          .join('')}
      </div>
    </section>`
    : ''

  // Geography info cards
  const terrainCard = country.terrain
    ? `<div class="cp-info-card">
        <h4>Terrain</h4>
        <p>${country.terrain}</p>
      </div>`
    : ''
  const climateCard = country.climate
    ? `<div class="cp-info-card">
        <h4>Climate</h4>
        <p>${country.climate}</p>
      </div>`
    : ''

  const routeHtml = (country.landmarks || []).length
    ? `
      <div class="cp-route-strip">
        ${(country.landmarks || []).map((lm, index) => `
          <button class="cp-route-stop" data-landmark-index="${index}">
            <span>${index + 1}</span>
            <strong>${lm.name}</strong>
          </button>
        `).join('')}
      </div>`
    : ''

  const relatedHtml = relatedCountries.length
    ? `
      <section class="cp-section">
        <h3 class="cp-section-title">Related Profiles</h3>
        <div class="cp-related-grid">
          ${relatedCountries.map(item => `
            <a class="cp-related-card" href="#/country/${item.id}">
              <span>${item.flag}</span>
              <strong>${item.name}</strong>
              <em>${item.terrain}</em>
            </a>
          `).join('')}
        </div>
      </section>`
    : ''

  const comparisonHtml = `
    <section class="cp-section">
      <h3 class="cp-section-title">Atlas Comparison</h3>
      <div class="cp-compare-strip">
        <div><span>Area rank</span><strong>#${areaRank}</strong><em>of ${COUNTRIES.length}</em></div>
        <div><span>Elevation rank</span><strong>#${elevationRank}</strong><em>by high terrain</em></div>
        <div><span>Regional peers</span><strong>${continentPeers.length}</strong><em>${country.continent}</em></div>
        <div><span>Mapped stops</span><strong>${country.landmarks?.length || 0}</strong><em>landmarks</em></div>
      </div>
    </section>`

  // Full page template
  container.innerHTML = `
    <style>
      /* ---- Country Page Styles ---- */
      .cp-page {
        background: var(--bg, #0a0a0f);
        color: var(--text, #e8e8f0);
        min-height: 100vh;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }

      /* Hero */
      .cp-hero {
        position: relative;
        width: 100%;
        height: 60vh;
        min-height: 360px;
        overflow: hidden;
      }
      .cp-hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .cp-hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          var(--bg, #0a0a0f) 0%,
          rgba(10, 10, 15, 0.6) 40%,
          rgba(10, 10, 15, 0.2) 100%
        );
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 3rem 2rem;
      }
      .cp-hero-flag {
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
      }
      .cp-hero-name {
        font-size: clamp(2.2rem, 5vw, 4rem);
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 0.3rem;
        background: linear-gradient(135deg, #fff, var(--accent, #6c8aff));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .cp-hero-local {
        font-size: 1.1rem;
        font-weight: 300;
        color: var(--text2, #8888a0);
        margin-bottom: 0.5rem;
      }
      .cp-hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.3rem);
        color: var(--text2, #8888a0);
      }

      /* Content wrapper */
      .cp-content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 2rem 4rem;
      }

      /* Quick Facts Bar */
      .cp-facts-bar {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding: 1.5rem 0;
        margin-bottom: 2rem;
        scrollbar-width: thin;
        scrollbar-color: var(--border, #2a2a3a) transparent;
      }
      .cp-facts-bar::-webkit-scrollbar { height: 4px; }
      .cp-facts-bar::-webkit-scrollbar-thumb { background: var(--border, #2a2a3a); border-radius: 2px; }
      .cp-fact-card {
        flex: 0 0 auto;
        min-width: 140px;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1rem 1.2rem;
        text-align: center;
      }
      .cp-fact-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text2, #8888a0);
        margin-bottom: 0.4rem;
      }
      .cp-fact-value {
        font-size: 1rem;
        font-weight: 700;
      }

      /* Sections */
      .cp-section {
        margin-bottom: 3rem;
      }
      .cp-section-title {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border, #2a2a3a);
      }

      /* Blockquote description */
      .cp-description {
        color: var(--text2, #8888a0);
        line-height: 1.9;
        font-size: 1.05rem;
        border-left: 3px solid var(--accent, #6c8aff);
        padding-left: 1.2rem;
        margin: 0;
      }

      /* Map */
      .cp-map-container {
        width: 100%;
        height: 420px;
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid var(--border, #2a2a3a);
      }

      /* Info cards (terrain/climate) */
      .cp-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .cp-profile-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 3rem;
      }
      .cp-profile-card {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1.2rem;
      }
      .cp-profile-card h3 {
        font-size: 1rem;
        margin-bottom: 0.65rem;
      }
      .cp-profile-card p {
        color: var(--text2, #8888a0);
        line-height: 1.75;
        font-size: 0.94rem;
      }
      .cp-compare-strip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
      .cp-compare-strip div {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1rem;
      }
      .cp-compare-strip span {
        display: block;
        color: var(--text2, #8888a0);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.35rem;
      }
      .cp-compare-strip strong {
        display: block;
        font-size: 1.35rem;
        margin-bottom: 0.2rem;
      }
      .cp-compare-strip em {
        display: block;
        color: var(--text2, #8888a0);
        font-size: 0.8rem;
        font-style: normal;
      }
      .cp-route-strip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.8rem;
        margin-top: 1rem;
      }
      .cp-route-stop {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        color: var(--text, #e8e8f0);
        border-radius: 0.7rem;
        padding: 0.8rem;
        text-align: left;
        cursor: pointer;
        transition: border-color 0.25s, background 0.25s;
      }
      .cp-route-stop:hover {
        border-color: var(--accent, #6c8aff);
        background: rgba(108, 138, 255, 0.1);
      }
      .cp-route-stop span {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(108, 138, 255, 0.16);
        color: var(--accent, #6c8aff);
        font-weight: 800;
      }
      .cp-route-stop strong {
        font-size: 0.86rem;
        line-height: 1.25;
      }
      .cp-info-card {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1.2rem;
      }
      .cp-info-card h4 {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text2, #8888a0);
        margin-bottom: 0.5rem;
      }
      .cp-info-card p {
        font-size: 0.95rem;
        line-height: 1.7;
        color: var(--text, #e8e8f0);
      }

      /* Geography text */
      .cp-geography-text {
        color: var(--text2, #8888a0);
        line-height: 1.8;
        font-size: 1rem;
      }

      /* Landmarks grid */
      .cp-landmarks-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .cp-landmark-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1.2rem;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      }
      .cp-landmark-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        border-color: var(--accent, #6c8aff);
      }
      .cp-landmark-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
        line-height: 1;
      }
      .cp-landmark-body h4 {
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }
      .cp-landmark-body p {
        font-size: 0.85rem;
        color: var(--text2, #8888a0);
        line-height: 1.5;
      }

      /* Gallery 2x2 */
      .cp-gallery-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .cp-gallery-item {
        border-radius: 0.8rem;
        overflow: hidden;
        border: 1px solid var(--border, #2a2a3a);
        aspect-ratio: 16/10;
      }
      .cp-gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s;
      }
      .cp-gallery-item:hover img {
        transform: scale(1.05);
      }
      .cp-related-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
      .cp-related-card {
        display: block;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1rem;
        color: var(--text, #e8e8f0);
        transition: border-color 0.25s, transform 0.25s;
      }
      .cp-related-card:hover {
        border-color: var(--accent, #6c8aff);
        transform: translateY(-3px);
        color: var(--text, #e8e8f0);
      }
      .cp-related-card span {
        display: block;
        font-size: 1.7rem;
        margin-bottom: 0.45rem;
      }
      .cp-related-card strong {
        display: block;
        margin-bottom: 0.35rem;
      }
      .cp-related-card em {
        display: block;
        color: var(--text2, #8888a0);
        font-size: 0.8rem;
        font-style: normal;
        line-height: 1.45;
      }

      /* Back button */
      .cp-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 1.5rem;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 2rem;
        color: var(--text, #e8e8f0);
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: none;
        transition: background 0.3s, border-color 0.3s;
        cursor: pointer;
        margin-top: 1rem;
      }
      .cp-back-btn:hover {
        background: var(--accent, #6c8aff);
        border-color: var(--accent, #6c8aff);
        color: #fff;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .cp-hero { height: 45vh; min-height: 280px; }
        .cp-profile-grid,
        .cp-route-strip,
        .cp-compare-strip,
        .cp-related-grid { grid-template-columns: 1fr; }
        .cp-landmarks-grid { grid-template-columns: 1fr; }
        .cp-gallery-grid { grid-template-columns: 1fr; }
        .cp-content { padding: 0 1rem 3rem; }
      }
    </style>

    <div class="cp-page">

      <!-- 1. Hero Banner -->
      <div class="cp-hero">
        <img class="cp-hero-img"
          ${imageAttrs(country.heroImage || country.image || '', country.name, 1400, '', { keywords: imageKeywords })}>
        <div class="cp-hero-overlay">
          <div class="cp-hero-flag">${country.flag || ''}</div>
          <h1 class="cp-hero-name">${country.name}</h1>
          ${country.nameLocal ? `<div class="cp-hero-local">${country.nameLocal}</div>` : ''}
          ${country.subtitle ? `<div class="cp-hero-subtitle">${country.subtitle}</div>` : ''}
        </div>
      </div>

      <div class="cp-content">

        <!-- 2. Quick Facts Bar -->
        <div class="cp-facts-bar">
          ${factsHtml}
        </div>

        <!-- 3. Overview -->
        <section class="cp-section">
          <h3 class="cp-section-title">Overview</h3>
          <blockquote class="cp-description">${country.description || ''}</blockquote>
        </section>

        <div class="cp-profile-grid">
          <article class="cp-profile-card">
            <h3>Geographic Signature</h3>
            <p>${country.terrain || country.geography || ''}</p>
          </article>
          <article class="cp-profile-card">
            <h3>Field Notes</h3>
            <p>${country.name} spans ${country.area || 'a significant area'} with elevations from ${country.elevation || 'varied terrain'}, creating ${country.climate || 'distinct climate zones'} conditions across the profile.</p>
          </article>
        </div>

        ${comparisonHtml}

        <!-- 4. Interactive Map -->
        <section class="cp-section">
          <h3 class="cp-section-title">Interactive Map</h3>
          <div id="${mapContainerId}" class="cp-map-container"></div>
        </section>

        <!-- 5. Geography & Terrain -->
        <section class="cp-section">
          <h3 class="cp-section-title">Geography &amp; Terrain</h3>
          ${country.geography ? `<p class="cp-geography-text">${country.geography}</p>` : ''}
          ${terrainCard || climateCard
            ? `<div class="cp-info-grid">${terrainCard}${climateCard}</div>`
            : ''}
        </section>

        <!-- 6. Landmarks -->
        ${
          country.landmarks && country.landmarks.length
            ? `
          <section class="cp-section">
            <h3 class="cp-section-title">Landmark Route</h3>
            ${routeHtml}
            <div class="cp-landmarks-grid">${landmarksHtml}</div>
          </section>`
            : ''
        }

        <!-- 7. Photo Gallery -->
        ${galleryHtml}

        ${relatedHtml}

        <!-- 8. Back Button -->
        <a href="#/" class="cp-back-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Home
        </a>

      </div>
    </div>
  `

  // After innerHTML is set, initialize the Leaflet map
  let mapInstance = null
  // Small delay to ensure the container has rendered and has dimensions
  requestAnimationFrame(() => {
    attachImageFallbacks(container)
    mapInstance = createCountryMap(mapContainerId, country.id)

    // Ensure map renders correctly after container is visible
    if (mapInstance) {
      setTimeout(() => mapInstance.invalidateSize(), 200)
    }

    // Add click listeners on landmark cards to pan/fly the map
    const landmarkCards = container.querySelectorAll('.cp-landmark-card, .cp-route-stop')
    landmarkCards.forEach(card => {
      card.addEventListener('click', () => {
        if (!mapInstance) return
        const idx = parseInt(card.dataset.landmarkIndex, 10)
        const lm = country.landmarks[idx]
        if (!lm) return

        if (lm.lat != null && lm.lng != null) {
          // Fly to the landmark on the map
          mapInstance.flyTo([lm.lat, lm.lng], 8, { duration: 1.2 })
        } else {
          // If landmark has no coordinates, fly to the country center
          const lat = country.lat || 0
          const lng = country.lng || 0
          mapInstance.flyTo([lat, lng], 6, { duration: 1.2 })
        }

        // Scroll the map into view
        const mapEl = document.getElementById(mapContainerId)
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    })
  })
}
