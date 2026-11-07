import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import assert from 'node:assert/strict'
const manifest=JSON.parse(readFileSync('dist/.vite/manifest.json','utf8'))
const entry=Object.keys(manifest).find(k=>manifest[k].isEntry)
const eager=new Set()
function collect(key){if(eager.has(key))return;eager.add(key);for(const child of manifest[key].imports||[])collect(child)}
collect(entry)
const js=[...eager].map(k=>manifest[k].file).filter(f=>f.endsWith('.js'))
const gzipBytes=js.reduce((sum,file)=>sum+gzipSync(readFileSync('dist/'+file)).byteLength,0)
assert.ok(gzipBytes<60_000,`Initial static JavaScript graph exceeds 60 kB gzip: ${gzipBytes}`)
assert.ok(!js.some(f=>/globe-|charts-|maps-|home-/.test(f)),'A heavy feature leaked into the static entry graph')
for(const name of ['etna','fuji','namib','reef','peru','fjord'])assert.ok(readFileSync(`dist/images/field/${name}.jpg`).length>1000)
console.log(JSON.stringify({initialJavaScriptGzipBytes:gzipBytes,initialFiles:js,heavyFeatures:'dynamic imports only',localPhotos:6},null,2))
