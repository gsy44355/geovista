import test from 'node:test'
import assert from 'node:assert/strict'
import { NODES, STUDIES, ancestors, countryPath, landmarkPath } from '../src/atlas-data.js'
import { COUNTRIES } from '../src/data.js'
import { initRouter } from '../src/router.js'

test('every country and landmark is reachable from the atlas', () => {
  assert.equal([...NODES.values()].filter(n => n.type === 'Country').length, COUNTRIES.length)
  for (const c of COUNTRIES) {
    assert.ok(NODES.has(countryPath(c)))
    for (const lm of c.landmarks) assert.ok(NODES.has(landmarkPath(c, lm)))
  }
  for (const n of NODES.values()) {
    assert.equal(ancestors(n)[0].path, '/atlas')
    for (const child of n.children) assert.equal(NODES.get(child).parent, n.path)
  }
})
test('six distinct studies provide eight real levels including home', () => {
  assert.equal(STUDIES.length, 6)
  assert.equal(new Set(STUDIES.map(s => s.source)).size, 6)
  for (const s of STUDIES) {
    const trail = ancestors(NODES.get(`${s.path}/evidence/notebook`))
    assert.deepEqual(trail.map(n => n.type), ['Atlas', 'Region', 'Country', 'Landmark', 'Study', 'Evidence', 'Notebook'])
    assert.equal(trail.length + 1, 8)
    assert.ok(s.sections.length >= 2 && s.evidence && s.limit && s.activity)
    assert.ok(s.choices[s.answer])
    assert.ok(STUDIES.some(other => other.country === s.compare))
  }
})
test('router supports direct deep links, back navigation and unknown paths', () => {
  let handler, result
  globalThis.window = { location: { hash: `#${STUDIES[0].path}/evidence/notebook` }, addEventListener: (_, fn) => { handler = fn } }
  initRouter(() => { result = 'home' }, c => { result = c.id }, path => { result = path })
  assert.equal(result, `${STUDIES[0].path}/evidence/notebook`)
  for (const [hash, expected] of [['#/atlas/', '/atlas'], ['#/country/japan', 'japan'], ['#/', 'home'], ['#/missing', '/missing'], ['#/country/missing', '/country/missing']]) {
    window.location.hash = hash; handler(); assert.equal(result, expected)
  }
  delete globalThis.window
})
