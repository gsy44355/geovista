// Run with Vite on :5173 and an isolated Chrome --remote-debugging-port=9227.
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { NODES, STUDIES } from '../src/atlas-data.js'
import { FIELD_GUIDES, guideKey } from '../src/field-content.js'
const tabs = await (await fetch('http://127.0.0.1:9227/json/list')).json()
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map(), errors = []
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id) } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text) })
const send = (method, params={}) => new Promise((resolve,reject) => { const key=++id; pending.set(key,m=>m.error?reject(m.error):resolve(m.result)); ws.send(JSON.stringify({id:key,method,params})) })
const run = async expression => { const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value }
const wait = ms => new Promise(r=>setTimeout(r,ms))
async function until(expression) { for(let i=0;i<100;i++){if(await run(expression)) return; await wait(100)} throw new Error('Timed out: '+expression) }
async function go(path) { await run(`location.hash=${JSON.stringify('#'+path)}`); await until(`document.querySelector('.atlas-heading h1')?.textContent===${JSON.stringify(NODES.get(path)?.title)}`) }
async function hover(selector) {
 if(selector.startsWith('.leaflet-marker')) { await run(`document.querySelector('#atlas-place-map').scrollIntoView({block:'center',behavior:'instant'})`); await until(`!!document.querySelector(${JSON.stringify(selector)})`) }
 await run(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`)
 const p=await run(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`)
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',...p})
}
async function shot(name) { const {data}=await send('Page.captureScreenshot',{format:'png'}); await writeFile(`/tmp/geovista-${name}.png`,Buffer.from(data,'base64')) }
try {
 await send('Runtime.enable'); await send('Page.enable');await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true})
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false})
 await send('Page.navigate',{url:'http://127.0.0.1:5173/#/atlas'})
 await until(`document.querySelector('.atlas-heading h1')?.textContent==='The field atlas'`)
 for(const study of STUDIES) {
  const node=NODES.get(study.path), g=FIELD_GUIDES[guideKey(node)]
  await go(study.path)
  assert.equal(await run(`document.querySelectorAll('.lab-hotspot').length`),4)
  await until(`document.querySelector('.heading-photo img').complete && document.querySelector('.heading-photo img').naturalWidth>0`)
  assert.match(await run(`document.querySelector('.heading-photo img').getAttribute('src')`),/images\/field/)
  await run(`document.querySelector('.photo-open').click()`)
  assert.equal(await run(`document.querySelector('.photo-dialog').open`),true)
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27})
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27})
  await until(`!document.querySelector('.photo-dialog').open`)
  await hover('.lab-hotspot[data-spot="2"]')
  assert.equal(await run(`document.querySelector('.lab-callout h3').textContent`),g.spots[2][0])
  await run(`document.querySelector('.lab-hotspot[data-spot="3"]').focus()`)
  assert.equal(await run(`document.querySelector('.lab-callout h3').textContent`),g.spots[3][0])
  await run(`document.querySelector('.lab-toggle').click()`)
  assert.equal(await run(`document.querySelector('.field-lab').classList.contains('overlay-hidden')`),true)
  await run(`document.querySelector('.lab-toggle').click();document.querySelectorAll('.reading-chapter summary')[1].click()`)
  assert.equal(await run(`document.querySelectorAll('.reading-chapter')[1].open`),true)
  await run(`document.querySelector('.profile-range').focus()`)
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39})
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39})
  assert.match(await run(`document.querySelector('.profile-output').textContent`),/Point 8 of 13/)
  await run(`document.querySelector('[data-chart-mode="bars"]').click()`)
  assert.equal(await run(`getComputedStyle(document.querySelector('.chart-bars')).display!=='none'`),true)
  assert.equal(await run(`getComputedStyle(document.querySelector('.chart-line')).display==='none'`),true)
  await hover('.profile-svg')
  assert.match(await run(`document.querySelector('.profile-output').textContent`),/Point 7 of 13/)
  await go(study.path+'/evidence')
  assert.equal(await run(`document.querySelectorAll('.evidence-table tbody tr').length`),3)
  await go(study.path+'/evidence/notebook')
  await run(`document.querySelector('.note-check').click();document.querySelector('#insert-template').click()`)
  assert.equal(await run(`document.querySelector('progress').value`),1)
  assert.match(await run(`document.querySelector('#field-notes').value`),/ALTERNATIVE EXPLANATION/)
 }
 await go(STUDIES[5].path)
 await run(`scrollTo({top:0,behavior:'instant'})`);await wait(1000);await shot('v2-study-desktop')
 await hover('.lab-hotspot[data-spot="3"]');await shot('v2-volcano')
 await hover('.leaflet-marker-icon[title="Mount Etna"]')
 await until(`document.querySelector('.geo-map-tooltip')?.textContent.includes('Mount Etna')`)
 await shot('v2-map-hover')
 await run(`document.querySelector('[data-map-place="0"]').click()`)
 assert.match(await run(`document.querySelector('.leaflet-popup').textContent`),/Dolomites/)
 await run(`document.querySelector('.leaflet-control-layers-toggle').click()`)
 await run(`document.querySelectorAll('.leaflet-control-layers-selector')[1].click()`)
 assert.equal(await run(`document.querySelectorAll('.leaflet-control-layers-selector')[1].checked`),true)
 await run(`document.querySelector('.region-menu summary').click()`)
 assert.equal(await run(`document.querySelector('.region-menu').open`),true)
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27})
 assert.equal(await run(`document.querySelector('.region-menu').open`),false)
 for (const width of [768,1024]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
  await go(STUDIES[0].path)
  assert.equal(await run('document.documentElement.scrollWidth <= innerWidth'),true,'Tablet overflow: '+width)
 }
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true})
 for(const node of NODES.values()) {
  await go(node.path)
  assert.equal(await run('document.documentElement.scrollWidth <= innerWidth'),true,'Mobile overflow: '+node.path)
  assert.equal(await run(`document.querySelector('.atlas-crumbs').getBoundingClientRect().left>=0`),true)
  if(node.type==='Landmark') {
   assert.equal(await run(`document.querySelectorAll('.reading-chapter').length`),3)
   assert.equal(await run(`!!document.querySelector('.field-chart')`),true)
  }
 }
 await go(STUDIES[5].path);await shot('v2-mobile-heading')
 await hover('.lab-hotspot[data-spot="2"]');await shot('v2-mobile-lab')
 await run(`location.hash='#/'`);await until(`document.querySelector('#home-view').style.display!== 'none'`)
 await run(`scrollTo({top:0,behavior:'instant'});document.querySelector('.nav-toggle').click()`)
 assert.equal(await run(`document.querySelector('.nav-toggle').getAttribute('aria-expanded')`),'true')
 await shot('v2-mobile-nav')
 await run(`document.querySelector('.nav-more summary').click()`)
 assert.equal(await run(`document.querySelector('.nav-more').open`),true)
 await run(`document.querySelector('.site-header a[href="#/atlas"]').click()`)
 await until(`document.querySelector('.atlas-heading h1')?.textContent==='The field atlas'`)
 assert.equal(await run(`document.querySelector('.nav-toggle').getAttribute('aria-expanded')`),'false')
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false})
 await run(`location.hash='#/'`);await until(`document.querySelector('#home-view').style.display!== 'none'`)
 await run(`scrollTo({top:0,behavior:'instant'})`);await shot('v2-home-desktop')
 await go(STUDIES[0].path+'/evidence/notebook')
 await run(`document.querySelector('#field-notes').value='Field guide regression record';document.querySelector('#save-notes').click()`)
 await send('Page.reload')
 await until(`document.querySelector('#field-notes')?.value==='Field guide regression record'`)
 await run(`localStorage.removeItem(${JSON.stringify('geovista:notebook:'+STUDIES[0].path+'/evidence/notebook')})`)
 await go('/atlas/asia')
 await run(`document.querySelector('#atlas-search').value='japan';document.querySelector('#atlas-search').dispatchEvent(new Event('input'))`)
 assert.equal(await run(`document.querySelectorAll('#atlas-children .atlas-card:not([hidden])').length`),1)
 assert.deepEqual(errors,[])
 console.log(JSON.stringify({routes:NODES.size,studies:6,mobileWidth:390,interactions:'local photos + modal, hotspot pointer + keyboard, cutaway, reading chapters, chart pointer + keyboard + modes, evidence, notebook checklist + template, map hover + popup + layer switch, navigation menus',runtimeErrors:errors},null,2))
} finally {ws.close()}
