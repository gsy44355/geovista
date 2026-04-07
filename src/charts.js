import { Chart, registerables } from 'chart.js'
import { COUNTRIES } from './data.js'

Chart.register(...registerables)

// Continent color palette (matching badge/globe colors)
const CONTINENT_COLORS = {
  asia: '#6C8AFF',
  europe: '#4ECDC4',
  americas: '#FF6B9D',
  africa: '#FFD93D',
  oceania: '#00D2FF',
}

const CONTINENT_LABELS = {
  asia: 'Asia',
  europe: 'Europe',
  americas: 'Americas',
  africa: 'Africa',
  oceania: 'Oceania',
}

/**
 * Parse area string like "9,596,961 km²" to a number.
 */
function parseArea(areaStr) {
  if (!areaStr) return 0
  return Number(areaStr.replace(/,/g, '').replace(/\s*km²/i, '').trim()) || 0
}

/**
 * Create a horizontal bar chart showing top 10 countries by area.
 */
function createAreaChart(countries) {
  const canvas = document.getElementById('chart-area')
  if (!canvas) {
    console.warn('[charts.js] #chart-area not found')
    return null
  }

  // Sort by area descending and take top 10
  const sorted = [...countries]
    .map(c => ({ ...c, areaNum: parseArea(c.area) }))
    .sort((a, b) => b.areaNum - a.areaNum)
    .slice(0, 10)

  const labels = sorted.map(c => `${c.flag} ${c.name}`)
  const data = sorted.map(c => c.areaNum)

  // Build gradient colors for bars
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, canvas.parentElement?.clientWidth || 600, 0)
  gradient.addColorStop(0, 'rgba(108, 138, 255, 0.85)')
  gradient.addColorStop(1, 'rgba(255, 107, 157, 0.85)')

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Area (km²)',
          data,
          backgroundColor: sorted.map((_, i) => {
            // Individual gradients per bar via color interpolation
            const ratio = i / (sorted.length - 1)
            const r = Math.round(108 + (255 - 108) * ratio)
            const g = Math.round(138 + (107 - 138) * ratio)
            const b = Math.round(255 + (157 - 255) * ratio)
            return `rgba(${r}, ${g}, ${b}, 0.85)`
          }),
          borderColor: sorted.map((_, i) => {
            const ratio = i / (sorted.length - 1)
            const r = Math.round(108 + (255 - 108) * ratio)
            const g = Math.round(138 + (107 - 138) * ratio)
            const b = Math.round(255 + (157 - 255) * ratio)
            return `rgba(${r}, ${g}, ${b}, 1)`
          }),
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        delay: (context) => context.dataIndex * 100,
        duration: 1000,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(15, 15, 35, 0.95)',
          titleColor: '#fff',
          bodyColor: '#ccc',
          borderColor: 'rgba(108, 138, 255, 0.3)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed.x
              return ` ${val.toLocaleString()} km²`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            callback: (val) => {
              if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
              if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
              return val
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.9)',
            font: {
              size: 13,
            },
          },
        },
      },
    },
  })
}

/**
 * Center-text plugin for doughnut chart.
 */
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return
    const { ctx, chartArea } = chart
    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    const total = chart.data.datasets[0].data.reduce((sum, v) => sum + v, 0)

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Number
    ctx.font = 'bold 28px Inter, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(total, centerX, centerY - 10)

    // Label
    ctx.font = '14px Inter, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillText('Countries', centerX, centerY + 16)

    ctx.restore()
  },
}

/**
 * Create a doughnut chart showing countries per continent.
 */
function createContinentChart(countries) {
  const canvas = document.getElementById('chart-continents')
  if (!canvas) {
    console.warn('[charts.js] #chart-continents not found')
    return null
  }

  // Count countries per continent
  const counts = {}
  countries.forEach(c => {
    counts[c.continent] = (counts[c.continent] || 0) + 1
  })

  const continentKeys = Object.keys(CONTINENT_LABELS)
  const labels = continentKeys.map(k => CONTINENT_LABELS[k])
  const data = continentKeys.map(k => counts[k] || 0)
  const colors = continentKeys.map(k => CONTINENT_COLORS[k])

  const ctx = canvas.getContext('2d')

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: 'rgba(15, 15, 35, 0.8)',
          borderWidth: 3,
          hoverBorderColor: '#ffffff',
          hoverBorderWidth: 2,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.85)',
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 12,
            font: {
              size: 13,
              family: 'Inter, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 15, 35, 0.95)',
          titleColor: '#fff',
          bodyColor: '#ccc',
          borderColor: 'rgba(108, 138, 255, 0.3)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const label = ctx.label || ''
              const value = ctx.parsed
              const total = ctx.dataset.data.reduce((sum, v) => sum + v, 0)
              const pct = ((value / total) * 100).toFixed(1)
              return ` ${label}: ${value} countries (${pct}%)`
            },
          },
        },
      },
    },
    plugins: [centerTextPlugin],
  })
}

/**
 * Initialize all charts for the statistics section.
 */
export function initCharts() {
  const countries = [...COUNTRIES]
  if (!countries.length) {
    console.warn('[charts.js] No country data available')
    return
  }

  createAreaChart(countries)
  createContinentChart(countries)
}
