// Load only the requested image (then explicit alternatives). Never substitute unrelated photos.
function escapeAttr(value = '') { return String(value).replace(/[&"<>]/g, c => ({ '&':'&amp;', '"':'&quot;', '<':'&lt;', '>':'&gt;' }[c])) }
export function gradientFallback() { return 'linear-gradient(135deg,#112231,#25535d)' }
function placeholder(label, failed = false) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 744"><defs><linearGradient id="bg"><stop stop-color="#112231"/><stop offset="1" stop-color="#25535d"/></linearGradient></defs><rect width="1200" height="744" fill="url(#bg)"/><path d="M0 620L300 260 600 570 850 330 1200 670" fill="none" stroke="#729496" stroke-width="2"/><text x="60" y="650" fill="#c3d4d8" font-family="Arial,sans-serif" font-size="36">${escapeAttr(label)}</text>${failed ? '<text x="60" y="100" fill="#d6e8e7" font-family="Arial,sans-serif" font-size="44">Image unavailable</text><text x="60" y="150" fill="#a4bfbe" font-family="Arial,sans-serif" font-size="28">Text and diagrams remain available</text>' : ''}</svg>`)}`
}
export function imageSources(url, width = 1200, options = {}) {
  return [...new Set([url, ...(options.extraUrls || [])].filter(Boolean).map(value => {
    try { const parsed = new URL(value); if (parsed.hostname === 'images.unsplash.com') { parsed.searchParams.set('w', String(width)); parsed.searchParams.set('q','80'); parsed.searchParams.set('auto','format'); parsed.searchParams.set('fit','crop') } return parsed.href } catch { return value }
  }))]
}
export function imageAttrs(url, alt, width = 1200, className = '', options = {}) {
  return `src="${placeholder(alt)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async"${className ? ` class="${escapeAttr(className)}"` : ''} data-image-srcs="${escapeAttr(imageSources(url,width,options).join('|'))}"`
}
const pending = new Map()
let observer
function load(img) {
  if (img.dataset.imageLoaded || !img.isConnected) return
  img.dataset.imageLoaded = 'true'
  const sources = (img.dataset.imageSrcs || '').split('|').filter(Boolean)
  let index = 0, timer
  const stop = () => { clearTimeout(timer); img.onload = null; img.onerror = null; pending.delete(img) }
  const next = () => {
    clearTimeout(timer)
    if (!img.isConnected) { stop(); return }
    if (index >= sources.length) { stop(); img.src = placeholder(img.alt, true); img.classList.add('image-fallback'); img.dataset.imageStatus = 'unavailable'; return }
    img.onload = () => { img.dataset.imageStatus = 'loaded'; stop() }
    img.onerror = next; img.loading = 'eager'; img.src = sources[index++]; timer = setTimeout(next, 8000)
  }
  pending.set(img, stop); next()
}
export function attachImageFallbacks(root = document) {
  if (!observer && 'IntersectionObserver' in window) observer = new IntersectionObserver(entries => { for (const e of entries) if (e.isIntersecting) { observer.unobserve(e.target); load(e.target) } }, { rootMargin: '250px' })
  root.querySelectorAll('img[data-image-srcs]').forEach(img => {
    if (img.dataset.fallbackReady) return
    img.dataset.fallbackReady = 'true'
    observer ? observer.observe(img) : load(img)
  })
}
export function releaseImages(root) {
  root.querySelectorAll('img[data-image-srcs]').forEach(img => { observer?.unobserve(img); pending.get(img)?.() })
}
