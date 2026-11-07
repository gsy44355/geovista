import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { COUNTRIES } from './data.js'
import { landmarkPath } from './atlas-data.js'

// Fix Leaflet default icon paths (broken by bundlers like Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/**
 * Create a custom circle-based divIcon for landmark markers.
 * @param {string} color - CSS color value
 * @returns {L.DivIcon}
 */
function createCircleIcon(color = 'var(--accent, #6c8aff)') {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px;
      height: 14px;
      background: ${color};
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  })
}

/**
 * Initialize a Leaflet map centered on a country, with landmark markers.
 *
 * @param {string} containerId - DOM id of the map container element
 * @param {string} countryId   - Country id matching COUNTRIES data
 * @returns {L.Map|null} The Leaflet map instance, or null if country/container not found
 */
export function createCountryMap(containerId, countryId, options = {}) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const country = COUNTRIES.find(c => c.id === countryId)
  if (!country) return null

  const lat = country.lat || 0
  const lng = country.lng || 0

  // Determine theme: use dark tiles by default to match the site's dark theme
  const darkTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const map = L.map(containerId, {
    center: [lat, lng],
    zoom: 5,
    scrollWheelZoom: false,
    zoomControl: true,
    // Avoid Leaflet CSS zoom callbacks firing after a hash-route unmount.
    // flyTo still provides cancellable requestAnimationFrame navigation.
    zoomAnimation: false,
  })

  // Use dark-themed tiles to complement the site's dark UI
  const darkLayer = L.tileLayer(darkTileUrl, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: 'geo-night-tiles',
    maxZoom: 19,
  }).addTo(map)
  const lightLayer = L.tileLayer(lightTileUrl, { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 })
  L.control.layers({ 'Night atlas': darkLayer, 'Day atlas': lightLayer }, {}, { position: 'topright' }).addTo(map)
  L.control.scale({ imperial: false }).addTo(map)
  const status = container.parentElement.querySelector('.map-status')
  const tileError = () => { if (status) status.textContent = 'Map tiles are unavailable. Place markers and coordinates remain usable; try the other basemap.' }
  darkLayer.on('tileerror', tileError); lightLayer.on('tileerror', tileError)

  // Add a marker for the country center
  const centerIcon = createCircleIcon('#ff6c8a')
  L.marker([lat, lng], { icon: centerIcon, title: country.name, alt: country.name })
    .addTo(map)
    .bindTooltip(`${country.flag} ${country.name} · Country overview`, { direction: 'top', className: 'geo-map-tooltip' })
    .bindPopup(`<strong>${country.flag} ${country.name}</strong><br>${country.subtitle || ''}`)

  // Add markers for each landmark
  const landmarkColors = ['#6c8aff', '#50c878', '#ffd700', '#ff6c8a']
  if (country.landmarks && country.landmarks.length) {
    country.landmarks.forEach((lm, i) => {
      // Only add if landmark has lat/lng coordinates
      if (lm.lat != null && lm.lng != null) {
        const color = landmarkColors[i % landmarkColors.length]
        const icon = createCircleIcon(color)
        const marker = L.marker([lm.lat, lm.lng], { icon, title: lm.name, alt: lm.name, keyboard: true })
          .addTo(map)
          .bindTooltip(`<strong>${lm.icon} ${lm.name}</strong><span>${lm.desc}</span><small>${lm.lat}°, ${lm.lng}° · Click to explore</small>`, { direction: 'top', className: 'geo-map-tooltip', opacity: 1 })
          .bindPopup(
            `<div style="font-family:Inter,system-ui,sans-serif;min-width:160px;">
              <strong>${lm.icon || ''} ${lm.name}</strong>
              <p style="margin:.4em 0 0;font-size:.85em;">${lm.desc || ''}</p><a class="map-explore-link" href="#${landmarkPath(country, lm)}">Explore this landscape →</a>
            </div>`
          )
        marker.on('mouseover', () => marker.setZIndexOffset(1000))
        marker.on('mouseout', () => marker.setZIndexOffset(0))
        const element = marker.getElement()
        element?.addEventListener('focus', () => marker.openTooltip())
        element?.addEventListener('blur', () => marker.closeTooltip())
      }
    })
  }

  if (options.selected) map.setView([options.selected.lat, options.selected.lng], 7, { animate: false })
  else if (country.landmarks?.length) map.fitBounds(country.landmarks.map(lm => [lm.lat, lm.lng]), { padding: [35, 35], maxZoom: 6, animate: false })
  return map
}
