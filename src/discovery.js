import { NODES, ancestors } from './atlas-data.js'
import { localStore } from './local-store.js'
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export const pageLabel = node => node.study && ['Evidence','Notebook'].includes(node.type) ? `${node.study.title} — ${node.type}` : node.title
export const utilityNav = () => '<button class="search-trigger" data-open-search aria-label="Search the atlas">⌕ <span>Search</span><kbd>⌘ / Ctrl K</kbd></button><a class="library-nav" href="#/library">My atlas</a>'
export const pageActions = path => `<div class="page-actions"><button data-save-page="${path}" aria-pressed="false">☆ Save place</button><button data-copy-link>↗ Copy link</button><span class="action-feedback" role="status"></span></div>`
const searchable = [...NODES.values()].filter(n => !['Evidence', 'Notebook'].includes(n.type))
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
export function searchAtlas(query, type = 'all') {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return searchable.filter(n => (type === 'all' || n.type === type) && terms.every(term => normalize(`${n.title} ${n.summary} ${n.country?.name || ''} ${n.study?.theme || ''}`).includes(term)))
    .sort((a,b) => Number(normalize(b.title).includes(normalize(query))) - Number(normalize(a.title).includes(normalize(query))) || a.title.localeCompare(b.title))
}
export function refreshSavedButtons(root = document) {
  const saved = localStore().state().saved
  root.querySelectorAll('[data-save-page]').forEach(b => { const active = saved.includes(b.dataset.savePage); b.setAttribute('aria-pressed', String(active)); b.textContent = active ? '★ Saved to My atlas' : '☆ Save place' })
}
export function initDiscovery() {
  document.body.insertAdjacentHTML('beforeend', `<dialog id="atlas-search-dialog" class="search-dialog" aria-labelledby="global-search-title"><div class="search-dialog-head"><h2 id="global-search-title">Where will curiosity take you?</h2><button data-close-search aria-label="Close search">×</button></div><p>Find countries, landmarks and guided investigations.</p><label for="global-search" class="sr-only">Search the entire atlas</label><input id="global-search" type="search" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="global-results" aria-autocomplete="list" placeholder="Try Etna, Japan or coral…"><label class="search-type">Explore <select id="global-search-type"><option value="all">Everything</option><option value="Country">Countries</option><option value="Landmark">Landmarks</option><option value="Study">Guided studies</option></select></label><p id="global-search-status" role="status"></p><div id="global-results" role="listbox" aria-label="Search results"></div><p class="search-key-hint">↑ ↓ Choose · Enter Open · Esc Close</p></dialog>`)
  const dialog = document.getElementById('atlas-search-dialog'), input = document.getElementById('global-search'), filter = document.getElementById('global-search-type'), results = document.getElementById('global-results')
  let active = -1, matches = []
  function select(index) {
    active = index
    const options = results.querySelectorAll('[role=option]')
    options.forEach((el,i) => el.setAttribute('aria-selected', String(i === active)))
    if (active >= 0) { input.setAttribute('aria-activedescendant', `search-result-${active}`); options[active]?.scrollIntoView({ block: 'nearest' }) }
    else input.removeAttribute('aria-activedescendant')
  }
  function render() {
    const all = searchAtlas(input.value, filter.value); matches = all.slice(0, 30)
    document.getElementById('global-search-status').textContent = all.length ? `${all.length} results${all.length > 30 ? ' · Showing the first 30; refine your search' : ''}` : 'No matching places. Try a country name or a broader landscape term.'
    results.innerHTML = matches.map((n,i) => `<div id="search-result-${i}" role="option" aria-selected="false" data-result="${i}"><span>${escapeHtml(n.type)} · ${escapeHtml(ancestors(n).slice(0,-1).map(p=>p.title).join(' / '))}</span><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.summary.slice(0,150))}</p></div>`).join('')
    select(-1)
  }
  function open() { if (!dialog.open) { render(); dialog.showModal(); input.focus() } }
  function choose(index) { if (matches[index]) { dialog.close(); location.hash = `#${matches[index].path}` } }
  input.addEventListener('input', render); filter.addEventListener('change', render)
  input.addEventListener('keydown', e => { if (['ArrowDown','ArrowUp'].includes(e.key) && matches.length) { e.preventDefault(); select((active + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length) } else if (e.key === 'Enter' && matches.length) { e.preventDefault(); choose(Math.max(0, active)) } })
  results.addEventListener('click', e => { const el = e.target.closest('[data-result]'); if (el) choose(Number(el.dataset.result)) })
  dialog.querySelector('[data-close-search]').addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close() })
  document.addEventListener('keydown', e => { if(e.key === 'Escape') document.querySelectorAll('.region-menu, .nav-more').forEach(d=>d.open=false); if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open() } })
  document.addEventListener('click', async e => {
    if (e.target.closest('[data-open-search]')) open()
    const saved = e.target.closest('[data-save-page]')
    if (saved) {
      localStore().toggle(saved.dataset.savePage); refreshSavedButtons()
      const feedback = saved.closest('.page-actions')?.querySelector('.action-feedback')
      if (feedback) feedback.textContent = localStore().persistent() ? 'Updated in this browser.' : 'Session only: browser storage is unavailable. Export a backup before leaving.'
      window.dispatchEvent(new Event('geovista:library-change'))
    }
    const copy = e.target.closest('[data-copy-link]')
    if (copy) {
      const feedback = copy.closest('.page-actions').querySelector('.action-feedback')
      try { await navigator.clipboard.writeText(location.href); feedback.textContent = 'Page link copied.' }
      catch { feedback.innerHTML = '<label>Copy this page link <input class="share-fallback" readonly></label>'; const field = feedback.querySelector('input'); field.value = location.href; field.select() }
    }
  })
  window.addEventListener('storage', () => { refreshSavedButtons(); window.dispatchEvent(new Event('geovista:library-change')) })
}
