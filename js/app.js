// ===== PARTICLE BACKGROUND =====
function initParticles(){
  const canvas=document.getElementById('particles');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let w,h,particles=[];
  function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight}
  window.addEventListener('resize',resize);resize();
  class Particle{
    constructor(){this.reset()}
    reset(){this.x=Math.random()*w;this.y=Math.random()*h;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.r=Math.random()*2+.5;this.alpha=Math.random()*.5+.1}
    update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>w)this.vx*=-1;if(this.y<0||this.y>h)this.vy*=-1}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(108,138,255,${this.alpha})`;ctx.fill()}
  }
  for(let i=0;i<80;i++)particles.push(new Particle());
  function animate(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{p.update();p.draw()});
    for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(108,138,255,${.1*(1-d/120)})`;ctx.stroke()}
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== HEADER SCROLL =====
function initHeader(){
  const header=document.querySelector('.site-header');
  let lastY=0;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y>lastY&&y>80)header.classList.add('hidden');
    else header.classList.remove('hidden');
    lastY=y;
  });
}

// ===== MOBILE NAV =====
function initNav(){
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('nav');
  if(toggle)toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

// ===== RENDER COUNTRIES =====
function renderCountries(){
  const continents={
    asia:{label:'Asia',badge:'badge-asia',desc:'From the Himalayas to tropical archipelagos, Asia spans the extremes of Earth\'s geography.'},
    europe:{label:'Europe',badge:'badge-europe',desc:'Compact yet incredibly diverse — fjords, volcanoes, alpine peaks, and Mediterranean shores.'},
    americas:{label:'Americas',badge:'badge-americas',desc:'Two vast continents stretching from Arctic tundra to Patagonian ice fields.'},
    africa:{label:'Africa',badge:'badge-africa',desc:'The cradle of humanity — savannahs, deserts, rainforests, and the Great Rift Valley.'},
    oceania:{label:'Oceania',badge:'badge-oceania',desc:'Island nations and an entire continent surrounded by the world\'s largest ocean.'}
  };
  const container=document.getElementById('countries-container');
  if(!container)return;
  Object.entries(continents).forEach(([key,info])=>{
    const countries=COUNTRIES.filter(c=>c.continent===key);
    if(!countries.length)return;
    const section=document.createElement('div');
    section.className='continent-section';
    section.id=`continent-${key}`;
    section.innerHTML=`
      <div class="section-header fade-in">
        <span class="continent-badge ${info.badge}">${info.label}</span>
        <h2>${info.label}</h2>
        <p>${info.desc}</p>
      </div>
      <div class="country-grid stagger">
        ${countries.map(c=>`
          <div class="country-card" data-id="${c.id}">
            <div class="card-image">
              <img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#16213e)';this.style.minHeight='220px'">
              <div class="card-overlay"></div>
              <span class="card-flag">${c.flag}</span>
            </div>
            <div class="card-body">
              <h3>${c.name}</h3>
              <div class="subtitle">${c.subtitle}</div>
              <div class="card-tags">${c.tags.map(t=>`<span class="card-tag">${t}</span>`).join('')}</div>
              <div class="card-stats">
                <div class="card-stat"><div class="val">${c.population}</div><div class="lbl">Population</div></div>
                <div class="card-stat"><div class="val">${c.capital}</div><div class="lbl">Capital</div></div>
                <div class="card-stat"><div class="val">${c.flag}</div><div class="lbl">Flag</div></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
    container.appendChild(section);
  });
  // card clicks
  document.querySelectorAll('.country-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const c=COUNTRIES.find(x=>x.id===card.dataset.id);
      if(c)openModal(c);
    });
  });
}

// ===== MODAL =====
function openModal(c){
  const overlay=document.getElementById('modal-overlay');
  overlay.innerHTML=`
    <div class="modal">
      <div class="modal-hero">
        <img src="${c.heroImage}" alt="${c.name}" onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#16213e)';this.style.minHeight='300px'">
        <div class="modal-hero-overlay"></div>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-content">
        <h2>${c.flag} ${c.name} <span style="font-weight:300;color:var(--text2)">${c.nameLocal}</span></h2>
        <div class="modal-subtitle">${c.subtitle}</div>
        <div class="modal-info-grid">
          <div class="info-card"><h4>Capital</h4><p>${c.capital}</p></div>
          <div class="info-card"><h4>Population</h4><p>${c.population}</p></div>
          <div class="info-card"><h4>Area</h4><p>${c.area}</p></div>
          <div class="info-card"><h4>Language</h4><p>${c.language}</p></div>
        </div>
        <div class="modal-description">
          <h3>Overview</h3>
          <p>${c.description}</p>
        </div>
        <div class="modal-description">
          <h3>Geography & Terrain</h3>
          <p>${c.geography}</p>
        </div>
        <div class="landmarks">
          <h3>Notable Landmarks</h3>
          <div class="landmark-list">
            ${c.landmarks.map(l=>`
              <div class="landmark-item">
                <span class="landmark-icon">${l.icon}</span>
                <div class="landmark-info"><h4>${l.name}</h4><p>${l.desc}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>`;
  overlay.classList.add('active');
  overlay.querySelector('.modal-close').addEventListener('click',()=>overlay.classList.remove('active'));
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('active')});
  document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){overlay.classList.remove('active');document.removeEventListener('keydown',esc)}});
}

// ===== FILTER =====
function setFilter(f){
  const bar=document.getElementById('filter-bar');
  if(!bar)return;
  bar.querySelectorAll('.filter-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.filter===f);
  });
  document.querySelectorAll('.continent-section').forEach(s=>{
    if(!s.id.startsWith('continent-'))return;
    s.style.display=(f==='all'||s.id===`continent-${f}`)?'':'none';
  });
}
function initFilters(){
  const bar=document.getElementById('filter-bar');
  if(!bar)return;
  const continents=['all','asia','europe','americas','africa','oceania'];
  const labels={all:'All Continents',asia:'Asia',europe:'Europe',americas:'Americas',africa:'Africa',oceania:'Oceania'};
  bar.innerHTML=continents.map(c=>`<button class="filter-btn${c==='all'?' active':''}" data-filter="${c}">${labels[c]}</button>`).join('');
  bar.addEventListener('click',e=>{
    const btn=e.target.closest('.filter-btn');
    if(!btn)return;
    const f=btn.dataset.filter;
    setFilter(f);
    if(f!=='all'){
      const target=document.getElementById(`continent-${f}`);
      if(target)setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),50);
    }
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations(){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
  },{threshold:.1});
  document.querySelectorAll('.fade-in,.stagger').forEach(el=>observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function initCounters(){
  const counters=document.querySelectorAll('.hero-stat .num');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,target=parseInt(el.dataset.target);
      let current=0;const step=Math.ceil(target/60);
      const timer=setInterval(()=>{current+=step;if(current>=target){current=target;clearInterval(timer)}el.textContent=current+(el.dataset.suffix||'')},20);
      observer.unobserve(el);
    });
  },{threshold:.5});
  counters.forEach(c=>observer.observe(c));
}

// ===== SMOOTH SCROLL NAV =====
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const href=a.getAttribute('href');
      // 如果是大洲导航链接，先重置筛选再跳转
      const continentMatch=href.match(/^#continent-(.+)$/);
      if(continentMatch){
        setFilter('all');
        setTimeout(()=>{
          const target=document.querySelector(href);
          if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
        },50);
      }else{
        const target=document.querySelector(href);
        if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{
  initParticles();
  initHeader();
  initNav();
  renderCountries();
  initFilters();
  initScrollAnimations();
  initCounters();
  initSmoothScroll();
});
