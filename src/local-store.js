import { NODES } from './atlas-data.js'
const KEY = 'geovista:library:v1'
export const BACKUP_MAX_BYTES = 8_000_000
export const NOTE_PREFIX = 'geovista:notebook:'
const notebookPaths = [...NODES.values()].filter(n => n.type === 'Notebook').map(n => n.path)
const validPath = path => typeof path === 'string' && NODES.has(path)

// All writes are local. The memory mirror keeps editing usable when storage is blocked/full.
export function createLocalStore(storage) {
  const memory = new Map()
  let persistent = true
  function read(key) {
    if (!persistent && memory.has(key)) return memory.get(key)
    try { const value = storage.getItem(key); if (value !== null) memory.set(key, value); else memory.delete(key); return value }
    catch { persistent = false; return memory.get(key) ?? null }
  }
  function write(key, value) {
    memory.set(key, value)
    try { storage.setItem(key, value) } catch { persistent = false }
    return persistent
  }
  function state() {
    try {
      const parsed = JSON.parse(read(KEY) || '{}')
      return { saved: Array.isArray(parsed?.saved) ? [...new Set(parsed.saved.filter(validPath))] : [], recent: Array.isArray(parsed?.recent) ? [...new Set(parsed.recent.filter(validPath))].slice(0, 8) : [] }
    } catch { return { saved: [], recent: [] } }
  }
  function change(fn) { const data = state(); fn(data); write(KEY, JSON.stringify(data)); return data }
  function notes() { return Object.fromEntries(notebookPaths.map(path => [path, read(NOTE_PREFIX + path)]).filter(([, value]) => typeof value === 'string' && value.length > 0)) }
  function validateBackup(data) {
    if (!data || data.format !== 'geovista-backup' || data.version !== 1 || !Array.isArray(data.saved) || !Array.isArray(data.recent) || !data.notes || Array.isArray(data.notes) || typeof data.notes !== 'object') throw new Error('This is not a supported GeoVista backup.')
    if (data.saved.length > NODES.size || data.recent.length > NODES.size || !data.saved.every(validPath) || !data.recent.every(validPath)) throw new Error('The backup contains unknown places.')
    for (const [path, text] of Object.entries(data.notes)) {
      if (!notebookPaths.includes(path) || typeof text !== 'string' || text.length > 200000) throw new Error('The backup contains an invalid notebook or an oversized note.')
    }
    return data
  }
  return {
    state, notes,
    persistent: () => persistent,
    note: path => read(NOTE_PREFIX + path) || '',
    saveNote(path, text) { if (!notebookPaths.includes(path) || typeof text !== 'string' || text.length > 200000) throw new Error('Unknown notebook'); return write(NOTE_PREFIX + path, text) },
    toggle(path) { if (!validPath(path)) return; return change(s => { s.saved = s.saved.includes(path) ? s.saved.filter(p => p !== path) : [...s.saved, path] }) },
    visit(path) { if (validPath(path)) change(s => { s.recent = [path, ...s.recent.filter(p => p !== path)].slice(0, 8) }) },
    export() { return { format: 'geovista-backup', version: 1, exportedAt: new Date().toISOString(), ...state(), notes: notes() } },
    import(data) {
      validateBackup(data) // Validate the entire file before mutating anything.
      const currentNotes = notes(); let added = 0, kept = 0
      change(s => { s.saved = [...new Set([...s.saved, ...data.saved])]; s.recent = [...new Set([...s.recent, ...data.recent])].slice(0, 8) })
      for (const [path, text] of Object.entries(data.notes)) {
        if (currentNotes[path] && currentNotes[path] !== text) { kept++; continue }
        if (!currentNotes[path]) { write(NOTE_PREFIX + path, text); added++ }
      }
      return { added, kept, persistent }
    },
  }
}
let store
export function localStore() {
  if (!store) {
    let storage
    try { storage = window.localStorage } catch { storage = { getItem() { throw Error() }, setItem() { throw Error() } } }
    store = createLocalStore(storage)
  }
  return store
}
