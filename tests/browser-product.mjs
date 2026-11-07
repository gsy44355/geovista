// Uses the same isolated Chrome and local Vite setup as browser-field.mjs.
import assert from 'node:assert/strict'
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { STUDIES } from '../src/atlas-data.js'
const tabs = await (await fetch('http://127.0.0.1:9227/json/list')).json()
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(r=>ws.addEventListener('open',r,{once:true}))
let id=0; const pending=new Map(),errors=[],requests=[]
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);else if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url)})
const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:key,method,params}))})
const run=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value}
const wait=ms=>new Promise(r=>setTimeout(r,ms))
async function until(expression){for(let i=0;i<100;i++){if(await run(expression))return;await wait(100)}throw Error('Timed out: '+expression)}
async function go(path,heading){await run(`location.hash=${JSON.stringify('#'+path)}`);await until(`document.querySelector('#country-view h1')?.textContent===${JSON.stringify(heading)}`)}
async function shot(name){const {data}=await send('Page.captureScreenshot',{format:'png'});await writeFile(`/tmp/geovista-product-${name}.png`,Buffer.from(data,'base64'))}
const notePath=STUDIES[0].path+'/evidence/notebook'
try {
 await send('Runtime.enable');await send('Page.enable');await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});await send('Network.enable')
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
 await send('Page.navigate',{url:'http://127.0.0.1:5173/#'+notePath})
 await until(`!!document.querySelector('#field-notes')`);await wait(500)
 const eagerHeavy=requests.filter(url=>/\/src\/(home|maps|globe|charts)\.js|\/deps\/(leaflet|globe__gl|swiper|chart__js)/.test(url))
 assert.deepEqual(eagerHeavy,[],'Heavy features loaded on direct notebook entry')
 // This suite must run in the isolated test profile described in README.
 await run(`Object.keys(localStorage).filter(k=>k.startsWith('geovista:')).forEach(k=>localStorage.removeItem(k))`)
 await run(`document.querySelector('[data-save-page]').click()`)
 assert.equal(await run(`document.querySelector('[data-save-page]').getAttribute('aria-pressed')`),'true')
 await run(`document.querySelector('#field-notes').value='Browser-only observation <img src=x onerror=window.__xss=1>';document.querySelector('#field-notes').dispatchEvent(new Event('input'))`)
 // Navigate before the autosave delay: route cleanup must flush the draft.
 await go('/library','Pick up where curiosity left off.')
 assert.match(await run(`document.querySelector('#library-content').textContent`),/Browser-only observation/)
 assert.equal(await run(`window.__xss===undefined`),true)
 await shot('library-desktop')
 await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:'/tmp/geovista-product-downloads'})
 await run(`document.querySelector('#export-backup').click()`);await wait(500)
 const file=`/tmp/geovista-product-downloads/geovista-backup-${new Date().toISOString().slice(0,10)}.json`
 const backup=JSON.parse(await readFile(file,'utf8'))
 assert.ok(backup.saved.includes(notePath));assert.match(backup.notes[notePath],/Browser-only/)
 await mkdir('/tmp/geovista-product-imports',{recursive:true})
 await writeFile('/tmp/geovista-product-imports/merge.json',JSON.stringify({...backup,saved:[STUDIES[1].path],notes:{[notePath]:'Must not replace local note'}}))
 const {root}=await send('DOM.getDocument')
 let {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector:'#import-backup'})
 await send('DOM.setFileInputFiles',{nodeId,files:['/tmp/geovista-product-imports/merge.json']})
 await until(`document.querySelector('#backup-status').textContent.includes('1 existing different notes kept')`)
 assert.match(await run(`document.querySelector('.note-excerpt').textContent`),/Browser-only/)
 await writeFile('/tmp/geovista-product-imports/invalid.json','{"format":"wrong"}')
 await send('DOM.setFileInputFiles',{nodeId,files:['/tmp/geovista-product-imports/invalid.json']})
 await until(`document.querySelector('#backup-status').textContent.includes('Import failed')`)
 assert.match(await run(`document.querySelector('.note-excerpt').textContent`),/Browser-only/)
 // Keyboard-first global search; context queries and empty states.
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'k',code:'KeyK',modifiers:2,windowsVirtualKeyCode:75})
 await until(`document.querySelector('#atlas-search-dialog').open`)
 await run(`document.querySelector('#global-search').value='Etna';document.querySelector('#global-search').dispatchEvent(new Event('input'))`)
 assert.match(await run(`document.querySelector('#global-results').textContent`),/Mount Etna/)
 await shot('search')
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40})
 assert.ok(await run(`document.querySelector('#global-search').hasAttribute('aria-activedescendant')`))
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
 await until(`!document.querySelector('#atlas-search-dialog').open && location.hash.includes('etna')`)
 await until(`!!document.querySelector('.field-lab')`)
 // A map remains unloaded until its section is approached.
 assert.equal(await run(`!!document.querySelector('#atlas-place-map .leaflet-container')`),false)
 await run(`document.querySelector('#place-map').scrollIntoView({block:'center',behavior:'instant'})`)
 await until(`!!document.querySelector('#atlas-place-map .leaflet-marker-icon')`)
 // Browser back retains reading position, and direct route races settle on the last route.
 await run(`scrollTo({top:700,behavior:'instant'})`)
 await go('/atlas','The field atlas');await run('history.back()')
 await until(`document.querySelector('.atlas-heading h1')?.textContent==='Mount Etna'`)
 assert.ok(Math.abs(await run('scrollY')-700)<10)
 await run(`location.hash='#/country/japan';setTimeout(()=>{location.hash='#/library'},0)`)
 await until(`document.querySelector('#country-view h1')?.textContent==='Pick up where curiosity left off.'`);await wait(500)
 assert.equal(await run(`document.querySelector('#country-view h1').textContent`),'Pick up where curiosity left off.')
 // Durable state, then session fallback on a simulated quota failure.
 await go(notePath,'Your observation notebook');await send('Page.reload');await until(`document.querySelector('#field-notes')?.value.startsWith('Browser-only')`)
 await run(`Storage.prototype.setItem=function(){throw new Error('Quota exceeded')};document.querySelector('#field-notes').value='Session-only latest draft';document.querySelector('#field-notes').dispatchEvent(new Event('input'))`)
 await wait(650);assert.match(await run(`document.querySelector('#note-status').textContent`),/Session only/)
 await go('/library','Pick up where curiosity left off.')
 assert.match(await run(`document.querySelector('.note-excerpt').textContent`),/Session-only latest draft/)
 assert.match(await run(`document.querySelector('.storage-warning').textContent`),/session only/)
 // A reload restores native Storage methods and durable data, not the session-only draft.
 await send('Page.reload');await until(`!!document.querySelector('#library-content')`)
 for(const width of [390,768,1024]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width===390})
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'Library overflow '+width)
 }
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true})
 await shot('library-mobile')
 await run(`location.hash='#/'`);await until(`document.querySelector('#home-view').style.display!== 'none' && !!document.querySelector('.country-card')`)
 assert.equal(await run(`document.querySelectorAll('.country-card[href]').length`),23)
 assert.equal(await run(`document.querySelectorAll('a[href="#"]').length`),0)
 assert.ok(!requests.some(url=>/\/src\/globe\.js/.test(url)))
 assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true,'Home mobile overflow')
 await shot('home-mobile')
 await run(`document.querySelector('.nav-toggle').click()`);assert.equal(await run(`document.querySelector('.nav-toggle').getAttribute('aria-expanded')`),'true')
 await run(`document.querySelector('.nav-toggle').click();document.querySelector('[data-open-search]').click()`)
 await until(`document.querySelector('#atlas-search-dialog').open`)
 await run(`document.querySelector('#global-search').value='zzzzzzz';document.querySelector('#global-search').dispatchEvent(new Event('input'))`)
 assert.match(await run(`document.querySelector('#global-search-status').textContent`),/No matching/)
 await run(`document.querySelector('[data-close-search]').click();document.querySelector('#gallery-section').scrollIntoView({block:'center',behavior:'instant'})`)
 await until(`document.querySelectorAll('[data-gallery-photo]').length===6`)
 await run(`document.querySelector('[data-gallery-photo]').click()`)
 assert.equal(await run(`!!document.querySelector('.photo-dialog[open]')`),true)
 await run(`document.querySelector('.photo-dialog[open] .photo-close').click()`)
 // A failed remote image becomes an honest placeholder, never a random photo.
 await send('Network.setBlockedURLs',{urls:['*images.unsplash.com*']})
 await go('/atlas/asia/japan','Japan')
 await run(`scrollTo({top:0,behavior:'instant'})`)
 await until(`document.querySelector('.heading-photo img')?.dataset.imageStatus==='unavailable'`)
 assert.ok(await run(`document.querySelector('.heading-photo img').src.startsWith('data:image/svg')`))
 await shot('image-fallback')
 await send('Network.setBlockedURLs',{urls:[]})
 await run(`location.hash='#/'`);await until(`document.querySelector('#home-view').style.display!== 'none'`)
 assert.deepEqual(await run(`Array.from(document.querySelectorAll('.hero-stat .num')).slice(0,3).map(n=>n.textContent)`),['23','5','92'])
 // Explicit opt-in is the only trigger for the large globe module.
 await run(`document.querySelector('#load-globe').click()`)
 await until(`document.querySelector('#load-globe').textContent.includes('Pause') || document.querySelector('#load-globe').textContent.includes('Retry')`)
 assert.ok(requests.some(url=>/\/src\/globe\.js/.test(url)))
 assert.ok(!requests.some(url=>/picsum|weserv|wsrv\.nl|lightgallery/.test(url)))
 assert.deepEqual(errors,[])
 console.log(JSON.stringify({directNotebookHeavyRequests:eagerHeavy,backup:'export/import validated; conflicts preserved',notes:'autosave on navigation; durable reload; quota-safe session copy',search:'keyboard, context, empty state',navigation:'last-route wins; scroll restore',responsive:[390,768,1024],globe:'explicit opt-in',errors},null,2))
} finally {ws.close()}
