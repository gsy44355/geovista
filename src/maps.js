import L from 'leaflet'
import { COUNTRIES } from './data.js'

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
export function createCountryMap(containerId, countryId) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const country = COUNTRIES.find(c => c.id === countryId)
  if (!country) return null

  const lat = country.lat || 0
  const lng = country.lng || 0

  // Determine theme: use dark tiles by default to match the site's dark theme
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const map = L.map(containerId, {
    center: [lat, lng],
    zoom: 5,
    scrollWheelZoom: true,
    zoomControl: true,
  })

  // Use dark-themed tiles to complement the site's dark UI
  L.tileLayer(darkTileUrl, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  // Add a marker for the country center
  const centerIcon = createCircleIcon('#ff6c8a')
  L.marker([lat, lng], { icon: centerIcon })
    .addTo(map)
    .bindPopup(`<strong>${country.flag} ${country.name}</strong><br>${country.subtitle || ''}`)

  // Add markers for each landmark
  const landmarkColors = ['#6c8aff', '#50c878', '#ffd700', '#ff6c8a']
  if (country.landmarks && country.landmarks.length) {
    country.landmarks.forEach((lm, i) => {
      // Only add if landmark has lat/lng coordinates
      if (lm.lat != null && lm.lng != null) {
        const color = landmarkColors[i % landmarkColors.length]
        const icon = createCircleIcon(color)
        L.marker([lm.lat, lm.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Inter,system-ui,sans-serif;min-width:160px;">
              <strong>${lm.icon || ''} ${lm.name}</strong>
              <p style="margin:.4em 0 0;font-size:.85em;color:#555;">${lm.desc || ''}</p>
            </div>`
          )
      }
    })
  }

  return map
}
