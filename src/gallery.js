import PHOTOS from './field-photos.json'
import { STUDIES } from './atlas-data.js'
import { escapeHtml as esc } from './discovery.js'
export function initGallery() {
  const container = document.getElementById('photo-gallery')
  if (!container) return
  const keys = ['fuji','namib','reef','peru','fjord','etna']
  container.innerHTML = keys.map((key,i) => { const p = PHOTOS[key]; return `<button class="gallery-item gallery-photo-button" data-gallery-photo="${key}" aria-label="View ${esc(p.description)}"><img src="${import.meta.env.BASE_URL}${p.local.slice(1)}" alt="${esc(p.description)}" loading="lazy" width="640" height="420"><span class="gallery-caption">${STUDIES[i].sourceTitle} ⤢</span></button>` }).join('')
  const dialog = document.createElement('dialog'); dialog.className = 'photo-dialog'; dialog.setAttribute('aria-label','Landscape photograph'); document.body.append(dialog)
  container.addEventListener('click', e => {
    const button = e.target.closest('[data-gallery-photo]'); if (!button) return
    const key = button.dataset.galleryPhoto, p = PHOTOS[key], study = STUDIES[keys.indexOf(key)]
    dialog.innerHTML = `<button class="photo-close" aria-label="Close photograph">×</button><img src="${import.meta.env.BASE_URL}${p.local.slice(1)}" alt="${esc(p.description)}"><div><p>${esc(p.description)}</p><small>${esc(p.artist)} · <a href="${p.page}" target="_blank" rel="noopener">Source</a> · <a href="${p.licenseUrl}" target="_blank" rel="noopener">${p.license}</a></small><p><a class="gallery-study-link" href="#${study.path}">Explore this study →</a></p></div>`
    dialog.querySelector('.photo-close').addEventListener('click',()=>dialog.close())
    dialog.querySelector('.gallery-study-link').addEventListener('click',()=>dialog.close())
    dialog.showModal()
  })
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()})
}
