import { fieldPhoto, photoUrl, initPhotoViewer } from './field-media.js'
import { labMarkup, readingMarkup, chartMarkup, evidenceMarkup, notebookHelp, initFieldLab } from './field-lab.js'
import { guideKey, FIELD_GUIDES } from './field-content.js'
import { utilityNav, pageActions, refreshSavedButtons, pageLabel } from './discovery.js'
import { localStore } from './local-store.js'
import { NODES, STUDIES, ancestors } from './atlas-data.js'
import { imageAttrs, attachImageFallbacks } from './assets.js'
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const link = (path, label, cls = '') => `<a class="${cls}" href="#${path}">${escapeHtml(label)}</a>`
const card = node => `<a class="atlas-card" href="#${node.path}">${fieldPhoto(node) ? `<img src="${photoUrl(fieldPhoto(node))}" alt="${escapeHtml(fieldPhoto(node).description)}" loading="lazy">` : node.image ? `<img ${imageAttrs(node.image, `${node.country?.name || node.title} — context landscape`, 600)}>` : ''}<div><span class="eyebrow">${node.type}${node.children.length ? ` · ${node.children.length} entries` : ''}</span><h3>${escapeHtml(node.title)} <span aria-hidden="true">↗</span></h3><p>${escapeHtml(node.summary)}</p></div></a>`
const source = s => `<aside class="atlas-source"><strong>Source & further reading</strong><p><a href="https://whc.unesco.org/en/list/${s.source}/" target="_blank" rel="noopener noreferrer">UNESCO World Heritage Centre · ${s.sourceTitle} ↗</a></p><small>Editorial learning guide based on the linked description, reviewed 7 November 2026. Exercises are proposed methods, not collected field data.</small></aside>`
export function renderAtlas(path, container) {
  const node = NODES.get(path)
  if (!node) {
    container.innerHTML = `<main class="atlas-shell"><span class="eyebrow">Page not found</span><h1>This trail is not on the map.</h1><p>The link may be incomplete. Choose a place to begin again.</p>${link('/atlas', 'Open the field atlas', 'atlas-button')}</main>`
    document.title = 'Page not found · GeoVista'
    return
  }
  document.title = `${pageLabel(node)} · GeoVista`
  const trail = ancestors(node)
  const s = node.study
  let content = ''
  if (node.type === 'Atlas') {
    content = `<section class="atlas-panel"><span class="eyebrow">Six guided investigations</span><h2>Explore a question, not just a destination</h2><p>Culture, water, ecosystems and Earth processes — follow each study through its evidence into your own notebook.</p><div class="atlas-grid">${STUDIES.map(s => card({ ...NODES.get(s.path), type: s.theme })).join('')}</div></section>`
  }
  if (node.type === 'Country') content = `<section class="atlas-panel"><h2>Place in context</h2><p>${escapeHtml(node.country.description)}</p><dl class="atlas-facts"><div><dt>Terrain</dt><dd>${escapeHtml(node.country.terrain)}</dd></div><div><dt>Climate</dt><dd>${escapeHtml(node.country.climate)}</dd></div></dl>${link(`/country/${node.country.id}`, 'Open country profile & interactive map →')}</section>`
  if (node.type === 'Landmark') content = `<section class="atlas-panel"><h2>Locate the landscape</h2><dl class="atlas-facts"><div><dt>Latitude</dt><dd>${node.landmark.lat}°</dd></div><div><dt>Longitude</dt><dd>${node.landmark.lng}°</dd></div><div><dt>National terrain context</dt><dd>${escapeHtml(node.country.terrain)}</dd></div></dl><p>${escapeHtml(node.country.geography)}</p><p class="atlas-muted">Country context describes the wider setting; local conditions vary. Country imagery elsewhere in this atlas is illustrative, not a verified image of each landmark.</p>${link(`/country/${node.country.id}`, 'Locate on the country map →')}${node.children.length ? '' : `<p>This place has a location profile. For a guided investigation, choose one of the six studies in the ${link('/atlas', 'field atlas')}.</p>`}</section>`
  if (node.type === 'Study') content = `<section class="atlas-panel"><span class="eyebrow">${s.theme}</span><h2>${s.question}</h2><div class="atlas-grid">${s.sections.map(([title, body]) => `<article class="atlas-reading"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></section>${source(s)}`
  if (node.type === 'Evidence') content = `<section class="atlas-panel"><h2>What this evidence cannot tell us</h2><p>${s.limit}</p><div class="atlas-method"><span>01 · Locate</span><span>02 · Describe</span><span>03 · Interpret</span><span>04 · Test</span></div><h3>Check your interpretation</h3><fieldset class="atlas-quiz"><legend>${s.question}</legend>${s.choices.map((c, i) => `<label><input type="radio" name="interpretation" value="${i}"> ${c}</label>`).join('')}</fieldset><button class="atlas-button" id="check-answer">Check answer</button><p id="answer-feedback" role="status"></p></section>${source(s)}`
  if (node.type === 'Notebook') content = `<section class="atlas-panel"><h2>Build an observation record</h2><p>Record a location or source, what you can observe, what you infer, and what remains unknown. Notes save automatically as you type and stay in this browser. Download a copy or export all notes from My atlas.</p><label class="atlas-note-label" for="field-notes">Field notes</label><textarea id="field-notes" rows="10" placeholder="Location / source and date:\nObservation:\nInterpretation:\nMissing evidence:\nNext question:"></textarea><div class="atlas-actions"><button class="atlas-button" id="save-notes">Save notes</button><button class="atlas-button secondary" id="download-notes">Download notes</button></div><p id="note-status" role="status"></p><details><summary>Review your record</summary><ul><li>Can someone distinguish your observations from your interpretation?</li><li>Have you recorded the source, location and date?</li><li>What additional evidence would challenge your explanation?</li></ul></details></section>${source(s)}<section class="atlas-panel"><h2>Continue across landscapes</h2><p>Compare the questions and methods with another setting.</p>${link(STUDIES.find(other => other.country === s.compare).path, STUDIES.find(other => other.country === s.compare).title, 'atlas-button')}</section>`
  const collection = ['Atlas', 'Region', 'Country'].includes(node.type)
  const photo = node.country || (node.type === 'Region' ? NODES.get(node.children[0])?.country : NODES.get('/atlas/europe/norway')?.country)
  const guide = FIELD_GUIDES[guideKey(node)]
  const exactPhoto = fieldPhoto(node)
  const photoFigure = exactPhoto ? `<figure class="heading-photo"><img src="${photoUrl(exactPhoto)}" alt="${escapeHtml(exactPhoto.description)}" fetchpriority="high" decoding="async"><button class="photo-open" aria-label="View landscape photograph full size">View image ⤢</button><figcaption><span>LANDSCAPE PORTRAIT</span><strong>${escapeHtml(node.landmark?.name || node.country.landmarks[s.landmark].name)}</strong><small>Photo: ${escapeHtml(exactPhoto.artist)} · <a href="${escapeHtml(exactPhoto.page)}" target="_blank" rel="noopener noreferrer">Source</a> · <a href="${exactPhoto.licenseUrl}" target="_blank" rel="noopener noreferrer">${exactPhoto.license}</a></small></figcaption></figure>` : photo ? `<figure class="heading-photo"><img ${imageAttrs(photo.heroImage || photo.image, `${photo.name} — regional context`, 1000)}><figcaption><span>REGIONAL LENS</span><strong>${photo.flag} ${photo.name}</strong><small>Context imagery · not a verified view of this landmark</small></figcaption></figure>` : ''
  if (node.type === 'Landmark' || node.type === 'Study') content = labMarkup(node) + content + readingMarkup(node) + chartMarkup(node) + evidenceMarkup(node)
  if (node.type === 'Evidence') content = chartMarkup(node) + evidenceMarkup(node) + content
  if (node.type === 'Notebook') content = notebookHelp(node) + content
  if (node.country && ['Country', 'Landmark', 'Study'].includes(node.type)) content += `<section class="atlas-panel atlas-map-panel" id="place-map"><span class="eyebrow">SPATIAL CONTEXT</span><h2>Explore the neighborhood</h2><p>Hover or focus a marker for a quick preview. Click or tap to open its place card. Switch basemaps with the layer control.</p><div id="atlas-place-map" class="atlas-place-map" aria-label="Interactive map of ${node.country.name}"></div><div class="map-place-controls">${node.country.landmarks.map((lm,i)=>`<button data-map-place="${i}">${lm.icon} ${lm.name}</button>`).join('')}</div><p class="map-status" role="status"></p></section>`
  const children = node.children.length ? `<section class="atlas-panel collection-panel"><span class="eyebrow">${collection ? 'YOUR NEXT DESTINATION' : 'CONTINUE THE INVESTIGATION'}</span><h2>${node.type === 'Atlas' ? 'Start with a region' : 'Continue exploring'}</h2>${collection ? '<label class="atlas-note-label" for="atlas-search">Filter this collection</label><div class="atlas-search-wrap"><span aria-hidden="true">⌕</span><input id="atlas-search" type="search" placeholder="Search names and landscapes…"></div><p id="search-count" role="status"></p>' : ''}<div class="atlas-grid" id="atlas-children">${node.children.map(p => card(NODES.get(p))).join('')}</div></section>` : ''
  container.innerHTML = `<div class="atlas-top"><a href="#/" class="atlas-brand"><span class="brand-mark" aria-hidden="true">◎</span>Geo<span>Vista</span></a><nav class="atlas-primary" aria-label="Atlas navigation">${link('/atlas', 'Field atlas', 'selected')}<details class="region-menu"><summary>Regions <span aria-hidden="true">⌄</span></summary><div>${['asia','europe','americas','africa','oceania'].map(id=>link(`/atlas/${id}`,NODES.get(`/atlas/${id}`).title)).join('')}</div></details>${link('/', 'World overview')}${utilityNav()}</nav><span class="atlas-top-note">A FIELD GUIDE TO OUR PLANET</span></div><main class="atlas-shell"><nav class="atlas-crumbs" aria-label="Breadcrumb">${link('/', 'Home')}<span aria-hidden="true">/</span>${trail.map((n, i) => i === trail.length - 1 ? `<span aria-current="page">${escapeHtml(n.title)}</span>` : `${link(n.path, n.title)}<span aria-hidden="true">/</span>`).join('')}</nav><header class="atlas-heading editorial-heading"><div class="heading-copy"><span class="eyebrow"><i></i> ${node.study ? node.study.theme : node.type} / FIELD NOTES</span><h1 tabindex="-1">${escapeHtml(node.title)}</h1><p>${escapeHtml(node.summary)}</p><div class="heading-tags"><span>◈ Level ${trail.length + 1}</span><span>${collection ? `${node.children.length} places to explore` : guide.label}</span><span>${node.type === 'Notebook' ? 'Your personal record' : collection ? 'Explore at your own pace' : 'Read · Explore · Reflect'}</span></div>${pageActions(node.path)}${!collection && node.children.length ? link(node.children[0], `Next: ${NODES.get(node.children[0]).title} →`, 'heading-next') : ''}</div>${photoFigure}</header><div class="atlas-layout"><div class="atlas-main-column">${collection ? children + content : content + children}</div><aside class="atlas-sidebar"><span class="eyebrow">YOUR EXPEDITION</span><h2>Follow the landscape</h2><ol><li>${link('/', 'Home')}</li>${trail.map((n,i) => `<li${i===trail.length-1?' class="current"':''}>${link(n.path, n.title)}</li>`).join('')}</ol>${!collection ? `<div class="on-this-page"><h3>On this page</h3>${node.type==='Landmark'||node.type==='Study'?'<button data-scroll-target="landscape-lab">Interactive explorer ↗</button><button data-scroll-target="deep-reading">Field guide ↗</button>':''}${node.type!=='Notebook'?'<button data-scroll-target="profile-chart">Landscape profile ↗</button><button data-scroll-target="evidence-register">Evidence register ↗</button>':'<button data-scroll-target="field-notes">Your notebook ↗</button>'}</div>`:''}<p>From a place to a question.<br>From evidence to understanding.</p>${node.parent ? link(node.parent, '← Back one level', 'atlas-back-link') : link('/', '← Back to home', 'atlas-back-link')}</aside></div></main>`
  if (exactPhoto) container.insertAdjacentHTML('beforeend', `<dialog class="photo-dialog" aria-label="Landscape photograph"><button class="photo-close" aria-label="Close photograph">×</button><img src="${photoUrl(exactPhoto)}" alt="${escapeHtml(exactPhoto.description)}"><div><p>${escapeHtml(exactPhoto.description)}</p><small>Photo: ${escapeHtml(exactPhoto.artist)} · <a href="${escapeHtml(exactPhoto.page)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons source</a> · <a href="${exactPhoto.licenseUrl}" target="_blank" rel="noopener noreferrer">${exactPhoto.license}</a>. Displayed with a crop in the header; full image shown here.</small></div></dialog>`)
  initPhotoViewer(container)
  attachImageFallbacks(container)
  initFieldLab(container)
  container.querySelector('h1').focus({ preventScroll: true })
  let map = null, disposed = false, mapObserver = null
  const mapContainer = container.querySelector('#atlas-place-map')
  async function loadMap() {
    try {
      const { createCountryMap } = await import('./maps.js')
      if (disposed) return
      map = createCountryMap('atlas-place-map', node.country.id, { selected: node.landmark || (s ? node.country.landmarks[s.landmark] : null) })
      mapContainer.removeAttribute('aria-busy')
    } catch { if (!disposed) { mapContainer.removeAttribute('aria-busy'); container.querySelector('.map-status').textContent = 'The interactive map could not load. Coordinates and place links remain available.' } }
  }
  if (mapContainer) {
    mapContainer.setAttribute('aria-busy', 'true')
    mapContainer.innerHTML = '<p class="map-loading">The map loads when you reach this section.</p>'
    mapObserver = new IntersectionObserver(entries => { if (entries.some(e=>e.isIntersecting)) { mapObserver.disconnect(); mapContainer.replaceChildren(); loadMap() } }, { rootMargin: '200px' })
    mapObserver.observe(mapContainer)
    container.querySelectorAll('[data-map-place]').forEach(button => button.addEventListener('click', () => {
      const lm = node.country.landmarks[Number(button.dataset.mapPlace)]
      if (map) { map.flyTo([lm.lat, lm.lng], 8, { animate: !matchMedia('(prefers-reduced-motion: reduce)').matches }); map.eachLayer(layer => { if (layer.options?.title === lm.name) layer.openPopup() }) }
      container.querySelector('.map-status').textContent = `${lm.name} · ${lm.lat}°, ${lm.lng}°${map ? '' : ' · Map is not ready yet.'}`
      container.querySelectorAll('[data-map-place]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))
    }))
  }
  const search = container.querySelector('#atlas-search')
  search?.addEventListener('input', () => {
    let count = 0
    container.querySelectorAll('#atlas-children .atlas-card').forEach(el => {
      el.hidden = !el.textContent.toLowerCase().includes(search.value.trim().toLowerCase())
      if (!el.hidden) count++
    })
    container.querySelector('#search-count').textContent = count ? `${count} entries found` : 'No matching entries. Try a different name or landscape.'
  })
  container.querySelector('#check-answer')?.addEventListener('click', () => {
    const selected = container.querySelector('input[name="interpretation"]:checked')
    container.querySelector('#answer-feedback').textContent = !selected ? 'Choose an interpretation first.' : Number(selected.value) === s.answer ? `Correct. ${s.feedback}` : `Try again. ${s.limit}`
  })
  let flushNotes = () => {}
  const notes = container.querySelector('#field-notes')
  if (notes) {
    const status = container.querySelector('#note-status')
    const store = localStore()
    notes.maxLength = 200000
    notes.value = store.note(node.path)
    let timer, dirty = false
    if (!store.persistent()) status.textContent = 'Session only: storage is unavailable. Download or export a backup before leaving.'
    function save() {
      clearTimeout(timer)
      if (!dirty) return
      const durable = store.saveNote(node.path, notes.value); dirty = false
      status.textContent = durable ? 'Notes saved in this browser.' : 'Session only: unable to save in browser storage. Download or export a backup before leaving.'
    }
    notes.addEventListener('input', () => { dirty = true; status.textContent = 'Saving…'; clearTimeout(timer); timer = setTimeout(save, 500) })
    container.querySelector('#save-notes').addEventListener('click', () => { dirty = true; save() })
    window.addEventListener('pagehide', save)
    const onVisibility = () => { if (document.hidden) save() }
    document.addEventListener('visibilitychange', onVisibility)
    flushNotes = () => { save(); clearTimeout(timer); window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', onVisibility) }
    container.querySelector('#download-notes').addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([`${s.title}\nhttps://whc.unesco.org/en/list/${s.source}/\n\n${notes.value}`], { type: 'text/plain;charset=utf-8' }))
      const a = document.createElement('a'); a.href = url; a.download = `${s.id}-notes.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
      status.textContent = 'Notes download prepared.'
    })
  }
  refreshSavedButtons(container)
  return () => { disposed = true; mapObserver?.disconnect(); map?.remove(); flushNotes() }
}
