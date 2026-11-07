import { COUNTRIES } from './data.js'
import { STUDIES } from './studies.js'
export const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const countryPath = c => `/atlas/${c.continent}/${c.id}`
export const landmarkPath = (c, lm) => `${countryPath(c)}/${slug(lm.name)}`
export const NODES = new Map()
function add(path, title, type, summary, extra = {}) {
  const parent = path.slice(0, path.lastIndexOf('/')) || null
  const node = { path, title, type, summary, parent, children: [], ...extra }
  NODES.set(path, node)
  if (NODES.has(parent)) NODES.get(parent).children.push(path)
  return node
}
add('/atlas', 'The field atlas', 'Atlas', 'Follow a place from its continental setting to the questions, evidence and observations that help explain it.')
const regions = {
  asia: ['Asia', 'Explore mountain interiors, island arcs and landscapes shaped by long histories of settlement.'],
  europe: ['Europe', 'Connect alpine relief, glacial coasts, volcanic terrain and cultural landscapes.'],
  americas: ['Americas', 'Trace a continental span of forests, mountain chains, drylands and river systems.'],
  africa: ['Africa', 'Investigate desert margins, highlands, river corridors and wildlife landscapes.'],
  oceania: ['Oceania', 'Read the connections between islands, ocean environments and continental landscapes.'],
}
for (const [key, [title, summary]] of Object.entries(regions)) {
  add(`/atlas/${key}`, title, 'Region', summary, { image: COUNTRIES.find(c => c.continent === key)?.image })
  for (const country of COUNTRIES.filter(c => c.continent === key)) {
    add(countryPath(country), country.name, 'Country', country.geography, { country, image: country.image })
    for (const landmark of country.landmarks) {
      add(landmarkPath(country, landmark), landmark.name, 'Landmark', landmark.desc, { country, landmark })
    }
  }
}
for (const study of STUDIES) {
  const country = COUNTRIES.find(c => c.id === study.country)
  const path = `${landmarkPath(country, country.landmarks[study.landmark])}/${study.id}`
  study.path = path
  add(path, study.title, 'Study', study.intro, { study, country, image: country.image })
  add(`${path}/evidence`, 'Reading the evidence', 'Evidence', study.evidence, { study, country, image: country.image })
  add(`${path}/evidence/notebook`, 'Your observation notebook', 'Notebook', study.activity, { study, country, image: country.image })
}
export function ancestors(node) {
  const trail = [node]
  while (trail[0].parent && NODES.has(trail[0].parent)) trail.unshift(NODES.get(trail[0].parent))
  return trail
}
export { STUDIES }
