import PHOTOS from './field-photos.json'
const STUDY_PHOTOS = { 'sacred-landscape': 'fuji', 'volcanic-record': 'etna', 'fog-and-sand': 'namib', 'reef-mosaic': 'reef', 'mountain-settlement': 'peru', 'glacial-relief': 'fjord' }
const PLACE_PHOTOS = { 'Mount Fuji': 'fuji', 'Mount Etna': 'etna', Sossusvlei: 'namib', 'Great Barrier Reef': 'reef', 'Machu Picchu': 'peru', Geirangerfjord: 'fjord' }
export function fieldPhoto(node) {
  const key = STUDY_PHOTOS[node.study?.id] || PLACE_PHOTOS[node.landmark?.name]
  return key ? { ...PHOTOS[key], key } : null
}
export function photoUrl(photo) { return `${import.meta.env.BASE_URL}${photo.local.slice(1)}` }
export function initPhotoViewer(container) {
  const button = container.querySelector('.photo-open')
  if (!button) return
  const dialog = container.querySelector('.photo-dialog')
  button.addEventListener('click', () => dialog.showModal())
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close() })
}
