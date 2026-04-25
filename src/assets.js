const UNSPLASH_HOST = 'images.unsplash.com'
const IMAGE_RATIO = 0.62
const LOAD_TIMEOUT_MS = 4500
const REAL_SOURCE_PRIORITY_MS = 1800

function escapeAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'geography'
}

function normalizeUrl(url) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== UNSPLASH_HOST) return url
    parsed.searchParams.set('auto', 'format')
    parsed.searchParams.set('fit', 'crop')
    return parsed.toString()
  } catch {
    return url
  }
}

function imageHeight(width) {
  return Math.round(width * IMAGE_RATIO)
}

function placeholderSvg(label = '') {
  const bg = gradientFallback(label).match(/#(?:[0-9a-f]{3}){1,2}/i)?.[0] || '#112231'
  const text = escapeAttr(label || 'GeoVista')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 744"><rect width="1200" height="744" fill="${bg}"/><text x="60" y="650" fill="rgba(255,255,255,.72)" font-family="Arial,sans-serif" font-size="52" font-weight="700">${text}</text></svg>`)}`
}

function fixedFallbackSources(label = '', width = 1200) {
  const seed = encodeURIComponent(slugify(label))
  const h = imageHeight(width)
  return [
    `https://picsum.photos/seed/${seed}/${width}/${h}`,
  ]
}

function isSyntheticFallback(src = '') {
  return src.includes('picsum.photos/seed/')
}

export function imageSources(url, width = 1200, options = {}) {
  const label = options.label || ''
  const keywords = options.keywords || []
  const extraUrls = options.extraUrls || []
  const fallbackLabel = label || keywords.join(' ') || 'GeoVista landscape'
  const normalized = normalizeUrl(url)
  const sources = []

  ;[normalized, ...extraUrls.map(normalizeUrl)].filter(Boolean).forEach(candidate => {
    try {
      const parsed = new URL(candidate)
      parsed.searchParams.set('w', String(width))
      parsed.searchParams.set('q', '82')
      const optimized = parsed.toString()

      if (parsed.hostname === UNSPLASH_HOST) {
        const proxyPath = encodeURIComponent(parsed.hostname + parsed.pathname + parsed.search)
        sources.push(`https://wsrv.nl/?url=${proxyPath}&w=${width}&output=webp`)
        sources.push(`https://images.weserv.nl/?url=${proxyPath}&w=${width}&output=webp`)
        sources.push(optimized)
      } else {
        sources.push(optimized)
      }
    } catch {
      sources.push(candidate)
    }
  })

  sources.push(...fixedFallbackSources(fallbackLabel, width))

  return [...new Set(sources)]
}

export function gradientFallback(seed = '') {
  const gradients = [
    'linear-gradient(135deg,#112231 0%,#25535d 52%,#f2b36d 100%)',
    'linear-gradient(135deg,#171b2b 0%,#355070 45%,#6d597a 100%)',
    'linear-gradient(135deg,#10251c 0%,#386641 55%,#a7c957 100%)',
    'linear-gradient(135deg,#25170f 0%,#7f5539 48%,#ddb892 100%)',
    'linear-gradient(135deg,#101820 0%,#2f6690 48%,#d9dcd6 100%)',
  ]
  const code = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return gradients[code % gradients.length]
}

export function imageAttrs(url, alt, width = 1200, className = '', options = {}) {
  const sources = imageSources(url, width, { label: alt, ...(options || {}) })
  return `src="${placeholderSvg(alt)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async"${className ? ` class="${escapeAttr(className)}"` : ''} data-image-srcs="${escapeAttr(sources.join('|'))}"`
}

export function setParallelImageSources(img, sources, label = img?.alt || '') {
  if (!img) return
  img.dataset.imageSrcs = [...new Set(sources.filter(Boolean))].join('|')
  img.dataset.imageLoaded = ''
  img.dataset.imageRaceId = String((Number(img.dataset.imageRaceId) || 0) + 1)
  img.src = placeholderSvg(label)
}

function showGradientFallback(img) {
  img.removeAttribute('src')
  img.style.background = gradientFallback(img.alt)
  img.style.minHeight = img.style.minHeight || '220px'
  img.classList.add('image-fallback')
}

function raceImageSources(img) {
  if (!img || img.dataset.imageLoaded === 'true') return
  const sources = (img.dataset.imageSrcs || img.dataset.fallbackSrcs || '').split('|').filter(Boolean)
  if (!sources.length) {
    showGradientFallback(img)
    return
  }
  img.dataset.imageLoaded = 'true'
  const raceId = String((Number(img.dataset.imageRaceId) || 0) + 1)
  img.dataset.imageRaceId = raceId
  let settled = false
  let fallbackReady = null
  const racers = []

  const settle = src => {
    if (settled || img.dataset.imageRaceId !== raceId) return
    settled = true
    img.src = src
    img.classList.remove('image-fallback')
    racers.forEach(racer => {
      racer.onload = null
      racer.onerror = null
    })
  }

  const fail = () => {
    if (settled || img.dataset.imageRaceId !== raceId) return
    settled = true
    showGradientFallback(img)
  }

  const timeout = window.setTimeout(() => {
    if (fallbackReady) settle(fallbackReady)
    else fail()
  }, LOAD_TIMEOUT_MS)
  const fallbackTimer = window.setTimeout(() => {
    if (fallbackReady) settle(fallbackReady)
  }, REAL_SOURCE_PRIORITY_MS)

  sources.forEach(src => {
    const probe = new Image()
    racers.push(probe)
    probe.decoding = 'async'
    probe.onload = () => {
      if (isSyntheticFallback(src)) {
        fallbackReady = src
        return
      }
      window.clearTimeout(timeout)
      window.clearTimeout(fallbackTimer)
      settle(src)
    }
    probe.onerror = () => {
      if (racers.every(racer => racer.complete && racer.naturalWidth === 0)) {
        window.clearTimeout(timeout)
        window.clearTimeout(fallbackTimer)
        fail()
      }
    }
    probe.src = src
  })
}

export function attachImageFallbacks(root = document) {
  root.querySelectorAll('img[data-image-srcs],img[data-fallback-srcs]').forEach(img => {
    if (img.dataset.fallbackReady) return
    img.dataset.fallbackReady = 'true'
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        observer.disconnect()
        raceImageSources(img)
      }, { rootMargin: '400px' })
      observer.observe(img)
    } else {
      raceImageSources(img)
    }
  })
}

export function rotateImageElement(img, urls, interval = 6500, options = {}) {
  if (!img || !urls?.length || urls.length < 2) return null
  let index = 0
  return setInterval(() => {
    index = (index + 1) % urls.length
    setParallelImageSources(img, imageSources(urls[index], 900, options), options.label || img.alt)
    raceImageSources(img)
  }, interval)
}
