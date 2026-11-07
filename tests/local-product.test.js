import test from 'node:test'
import assert from 'node:assert/strict'
import { createLocalStore, NOTE_PREFIX, BACKUP_MAX_BYTES } from '../src/local-store.js'
import { STUDIES } from '../src/atlas-data.js'
import { searchAtlas } from '../src/discovery.js'
const path = STUDIES[0].path
const notePath = `${path}/evidence/notebook`
function storage() { const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)} }

test('existing notebooks survive and are included in portable backups', () => {
  const disk=storage();disk.setItem(NOTE_PREFIX+notePath,'Existing field notes')
  const store=createLocalStore(disk)
  store.toggle(path);store.visit(path)
  const copy=store.export()
  assert.equal(copy.notes[notePath],'Existing field notes')
  const other=createLocalStore(storage());other.import(copy)
  assert.deepEqual(other.state(),store.state());assert.equal(other.note(notePath),'Existing field notes')
})
test('import merges saved places without replacing conflicting notes', () => {
  const store=createLocalStore(storage());store.saveNote(notePath,'Keep this local note')
  const incoming={format:'geovista-backup',version:1,saved:[path,path],recent:[path],notes:{[notePath]:'Different imported note'}}
  const result=store.import(incoming)
  assert.equal(result.kept,1);assert.equal(store.note(notePath),'Keep this local note');assert.deepEqual(store.state().saved,[path])
})
test('invalid backups are rejected before any writes', () => {
  const disk=storage(),store=createLocalStore(disk);store.toggle(path)
  const before=JSON.stringify([...disk.data])
  assert.throws(()=>store.import({format:'geovista-backup',version:1,saved:[STUDIES[1].path],recent:[],notes:{'/unknown':'bad'}}))
  assert.equal(JSON.stringify([...disk.data]),before)
  assert.throws(()=>store.import({format:'geovista-backup',version:2,saved:[],recent:[],notes:{}}))
})
test('quota failure retains the latest edit in memory and export', () => {
  const disk=storage(),store=createLocalStore(disk);store.saveNote(notePath,'Old saved text')
  disk.setItem=()=>{throw new Error('Quota exceeded')}
  assert.equal(store.saveNote(notePath,'Latest unsaved text'),false)
  assert.equal(store.note(notePath),'Latest unsaved text');assert.equal(store.export().notes[notePath],'Latest unsaved text')
  assert.equal(store.persistent(),false)
})
test('blocked storage permits a session-only saved list', () => {
  const store=createLocalStore({getItem(){throw Error()},setItem(){throw Error()}})
  store.toggle(path);store.visit(path)
  assert.deepEqual(store.state().saved,[path]);assert.equal(store.persistent(),false)
  store.toggle(path);assert.deepEqual(store.state().saved,[])
})
test('search supports accent-free terms, context and content type', () => {
  assert.ok(searchAtlas('jokulsarlon').some(n=>n.title.includes('Jökulsárlón')))
  assert.ok(searchAtlas('Japan Fuji').some(n=>n.title==='Mount Fuji'))
  assert.equal(searchAtlas('Fuji','Country').length,0)
  assert.ok(searchAtlas('volcanic','Study').every(n=>n.type==='Study'))
  assert.equal(searchAtlas('zzzzzzzz').length,0)
})

test('a backup containing maximum-size notes fits the import file limit', () => {
  const store=createLocalStore(storage())
  for(const study of STUDIES)store.saveNote(study.path+'/evidence/notebook', '\u0000'.repeat(200000))
  const backup=store.export()
  assert.ok(Buffer.byteLength(JSON.stringify(backup,null,2),'utf8')<BACKUP_MAX_BYTES)
  const restored=createLocalStore(storage());restored.import(backup)
  assert.equal(Object.keys(restored.notes()).length,6)
})
