import { NODES } from './atlas-data.js'
import { localStore, BACKUP_MAX_BYTES } from './local-store.js'
import { escapeHtml as esc, utilityNav, refreshSavedButtons, pageLabel } from './discovery.js'

function placeCard(path, saved = false) {
  const n = NODES.get(path)
  return `<article class="library-card"><span class="eyebrow">${n.type} · ${esc(n.country?.name || 'World atlas')}</span><h3><a href="#${path}">${esc(pageLabel(n))}</a></h3><p>${esc(n.summary.slice(0,180))}</p>${saved ? `<button data-remove-saved="${path}">Remove from saved</button>` : ''}</article>`
}
export function renderLibrary(container) {
  document.title = 'My atlas · GeoVista'
  container.innerHTML = `<header class="atlas-top"><a href="#/" class="atlas-brand">Geo<span>Vista</span></a><nav class="atlas-primary" aria-label="Library navigation"><a href="#/atlas">Field atlas</a>${utilityNav()}</nav></header><main class="atlas-shell library-shell"><header class="library-heading"><span class="eyebrow">YOUR PERSONAL FIELD SHELF</span><h1 tabindex="-1">Pick up where curiosity left off.</h1><p>Saved places, recently opened pages and field notes — together in one place.</p><div class="library-local-note">◈ Stored in this browser. No account or cloud sync. Export a backup to keep a copy or move to another device.</div></header><div id="library-content"></div><section class="atlas-panel backup-panel"><span class="eyebrow">KEEP YOUR WORK</span><h2>A portable atlas, without an account</h2><p>Export saved places, recent pages and saved notes as a JSON file. Import merges places and adds missing notes; an existing different note is kept unchanged.</p><div class="backup-actions"><button class="atlas-button" id="export-backup">Export backup ↓</button><label class="atlas-button secondary import-label">Import backup ↑<input id="import-backup" type="file" accept="application/json,.json"></label></div><p id="backup-status" role="status"></p><details><summary>What is stored, and what uses the network?</summary><p>Your notes and saved places stay in browser storage. Clearing site data or using another browser removes access to them unless you have exported a backup. Private browsing and storage restrictions may limit saving.</p><p>Map tiles, older remote images and fonts are requested from their providers. The six study photographs, text and diagrams are bundled with this static site. There is no GeoVista account, server database or automatic cross-device synchronization.</p></details></section></main>`
  const events = new AbortController()
  const store = localStore()
  function update() {
    const state = store.state(), notes = Object.entries(store.notes())
    container.querySelector('#library-content').innerHTML = `${!store.persistent() ? '<p class="storage-warning" role="status">Browser storage is unavailable. Changes are kept for this session only; export before leaving.</p>' : ''}<section class="atlas-panel"><div class="library-section-title"><h2>Saved places</h2><span>${state.saved.length}</span></div>${state.saved.length ? `<div class="library-grid">${state.saved.map(p=>placeCard(p,true)).join('')}</div>` : '<div class="library-empty"><span aria-hidden="true">☆</span><h3>Your next discovery belongs here.</h3><p>Use “Save place” on any atlas page to build a personal reading list.</p><a href="#/atlas">Explore the atlas →</a></div>'}</section><section class="atlas-panel"><div class="library-section-title"><h2>Field notebooks</h2><span>${notes.length}</span></div>${notes.length ? `<div class="library-grid">${notes.map(([path,text])=>`<article class="library-card"><span class="eyebrow">${esc(NODES.get(path).country.name)} / NOTEBOOK</span><h3><a href="#${path}">${esc(NODES.get(path).study.title)}</a></h3><p class="note-excerpt">${esc(text.slice(0,220))}</p><a href="#${path}">Continue writing →</a></article>`).join('')}</div>` : '<p>No saved notes yet. Each guided study ends with a notebook for your observations. <a href="#/atlas">Choose a study →</a></p>'}</section><section class="atlas-panel"><h2>Recently opened</h2><p>Last eight places visited in this browser. Opening a page does not mark a study as completed.</p>${state.recent.length ? `<div class="recent-list">${state.recent.map(p=>`<a href="#${p}"><span>${esc(pageLabel(NODES.get(p)))}</span><small>${NODES.get(p).type} ↗</small></a>`).join('')}</div>` : '<p>Your recent exploration will appear here.</p>'}</section>`
  }
  update()
  const change = () => update()
  window.addEventListener('geovista:library-change', change)
  container.addEventListener('click', e => { const b = e.target.closest('[data-remove-saved]'); if (b) { store.toggle(b.dataset.removeSaved); update(); refreshSavedButtons() } }, { signal: events.signal })
  container.querySelector('#export-backup').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(store.export(), null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `geovista-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000)
    container.querySelector('#backup-status').textContent = 'Backup download prepared. Keep this file somewhere you control.'
  })
  container.querySelector('#import-backup').addEventListener('change', async e => {
    const file = e.target.files?.[0]; if (!file) return
    const status = container.querySelector('#backup-status')
    try {
      if (file.size > BACKUP_MAX_BYTES) throw new Error('Choose a GeoVista backup smaller than 8 MB.')
      const data = JSON.parse(await file.text()); if (events.signal.aborted) return
      const result = store.import(data)
      update()
      status.textContent = `Backup merged. ${result.added} notes added; ${result.kept} existing different notes kept.${result.persistent ? '' : ' Session only — storage is unavailable.'}`
    } catch (error) { status.textContent = `Import failed. ${error instanceof SyntaxError ? 'The file is not valid JSON.' : error.message} Your existing data was not replaced.` }
    e.target.value = ''
  })
  return () => { events.abort(); window.removeEventListener('geovista:library-change', change) }
}
