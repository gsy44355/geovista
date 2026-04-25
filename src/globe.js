import Globe from 'globe.gl'
import { COUNTRIES } from './data.js'

// Continent color palette
const CONTINENT_COLORS = {
  asia: '#6C8AFF',
  europe: '#4ECDC4',
  americas: '#FF6B9D',
  africa: '#FFD93D',
  oceania: '#00D2FF',
}

function getContinentColor(continent) {
  return CONTINENT_COLORS[continent] || '#ffffff'
}

/**
 * Generate random arcs between country pairs for visual effect.
 * Returns 8-10 arcs with colors based on source continent.
 */
function generateArcs(countries) {
  const arcs = []
  const numArcs = 8 + Math.floor(Math.random() * 3) // 8-10 arcs
  const shuffled = [...countries].sort(() => Math.random() - 0.5)

  for (let i = 0; i < numArcs && i < shuffled.length - 1; i++) {
    const from = shuffled[i]
    const to = shuffled[(i + 1) % shuffled.length]
    const color = getContinentColor(from.continent)
    arcs.push({
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
      color: [color, getContinentColor(to.continent)],
      stroke: 0.5,
      dashLength: 0.4,
      dashGap: 0.2,
      dashAnimateTime: 2000 + Math.random() * 2000,
    })
  }

  return arcs
}

/**
 * Initialize the interactive 3D globe.
 * Renders countries as glowing points with labels and arcs.
 */
export function initGlobe() {
  const container = document.getElementById('globe-container')
  if (!container) {
    console.warn('[globe.js] #globe-container not found')
    return null
  }

  container.replaceChildren()

  const countries = [...COUNTRIES]
  const arcsData = generateArcs(countries)

  const getSize = () => {
    const rect = container.getBoundingClientRect()
    return {
      width: Math.round(rect.width || container.clientWidth || window.innerWidth || 600),
      height: Math.round(rect.height || container.clientHeight || window.innerHeight || 600),
    }
  }

  const { width, height } = getSize()

  const globe = Globe()(container)
    .width(width)
    .height(height)
    .backgroundColor('rgba(0,0,0,0)')
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .showAtmosphere(true)
    .atmosphereColor('rgba(108, 138, 255, 0.3)')
    .atmosphereAltitude(0.25)

    // Points: each country as a glowing dot
    .pointsData(countries)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(d => getContinentColor(d.continent))
    .pointAltitude(0.05)
    .pointRadius(0.6)
    .pointResolution(12)
    .pointsMerge(false)

    // Labels: country name + flag
    .labelsData(countries)
    .labelLat(d => d.lat)
    .labelLng(d => d.lng)
    .labelText(d => `${d.flag} ${d.name}`)
    .labelSize(1.2)
    .labelDotRadius(0.4)
    .labelColor(d => getContinentColor(d.continent))
    .labelResolution(2)
    .labelAltitude(0.06)

    // Arcs: connections between random country pairs
    .arcsData(arcsData)
    .arcStartLat(d => d.startLat)
    .arcStartLng(d => d.startLng)
    .arcEndLat(d => d.endLat)
    .arcEndLng(d => d.endLng)
    .arcColor(d => d.color)
    .arcStroke(d => d.stroke)
    .arcDashLength(d => d.dashLength)
    .arcDashGap(d => d.dashGap)
    .arcDashAnimateTime(d => d.dashAnimateTime)
    .arcAltitudeAutoScale(0.3)

    // Interaction: click to scroll to country card
    .onPointClick(d => {
      const el =
        document.getElementById(`country-${d.id}`) ||
        document.getElementById(d.id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('highlight')
        setTimeout(() => el.classList.remove('highlight'), 2000)
      }
    })

  // Auto-rotation
  const controls = globe.controls()
  if (controls) {
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true
  }

  // Handle resize
  const syncSize = () => {
    const { width: w, height: h } = getSize()
    globe.width(w).height(h)
  }
  window.addEventListener('resize', syncSize)

  const resizeObserver = new ResizeObserver(syncSize)
  resizeObserver.observe(container)

  requestAnimationFrame(syncSize)
  setTimeout(syncSize, 250)
  setTimeout(syncSize, 1000)

  return globe
}
