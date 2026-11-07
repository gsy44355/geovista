import{t as e}from"./data-DrTZH58z.js";import{i as t,r as n}from"./atlas-data-DYUO2TYn.js";import{a as r,o as i,r as a}from"./discovery-CNYlTX4o.js";import{n as o,t as s}from"./assets-C6F8jgfj.js";import{createCountryMap as c}from"./maps-DSw-9UBS.js";function l(l,u){if(!l||!u)return;let d=`map-${l.id}`,f=[l.continent,l.terrain,l.climate,...l.tags||[]].filter(Boolean),p=e.filter(e=>e.id!==l.id&&(e.continent===l.continent||e.tags?.some(e=>l.tags?.includes(e)))).slice(0,3),m=[{label:`Capital`,value:l.capital},{label:`Population`,value:l.population},{label:`Area`,value:l.area},{label:`Language`,value:l.language},{label:`Climate`,value:l.climate},{label:`Elevation`,value:l.elevation}].filter(e=>e.value),h=e=>Number(String(e||``).replace(/,/g,``).replace(/\s*km²/i,``).trim())||0,g=e=>{let t=String(e||``).match(/-?\d[\d,]*/g);return t?.length?Math.max(...t.map(e=>Number(e.replace(/,/g,``))||0)):0},_=e.filter(e=>e.continent===l.continent),v=[...e].sort((e,t)=>h(t.area)-h(e.area)).findIndex(e=>e.id===l.id)+1,y=[...e].sort((e,t)=>g(t.elevation)-g(e.elevation)).findIndex(e=>e.id===l.id)+1,b=m.map(e=>`
      <div class="cp-fact-card">
        <div class="cp-fact-label">${e.label}</div>
        <div class="cp-fact-value">${e.value}</div>
      </div>`).join(``),x=(l.landmarks||[]).map((e,n)=>`
      <div class="cp-landmark-card" data-landmark-index="${n}">
        <span class="cp-landmark-icon">${e.icon||``}</span>
        <div class="cp-landmark-body">
          <h4>${e.name}</h4>
          <p>${e.desc||``}</p><button class="cp-map-focus" data-landmark-index="${n}" aria-label="Locate ${e.name} on map">Locate on map</button><a href="#${t(l,e)}" class="cp-explore-link">Explore this landmark →</a>
        </div>
      </div>`).join(``),S=l.galleryImages||[],C=S.length?`
    <section class="cp-section">
      <h3 class="cp-section-title">Photo Gallery</h3>
      <div class="cp-gallery-grid">
        ${S.slice(0,4).map(e=>`
          <div class="cp-gallery-item">
            <img ${o(e,l.name,800,``,{keywords:f})}>
          </div>`).join(``)}
      </div>
    </section>`:``,w=l.terrain?`<div class="cp-info-card">
        <h4>Terrain</h4>
        <p>${l.terrain}</p>
      </div>`:``,T=l.climate?`<div class="cp-info-card">
        <h4>Climate</h4>
        <p>${l.climate}</p>
      </div>`:``,E=(l.landmarks||[]).length?`
      <div class="cp-route-strip">
        ${(l.landmarks||[]).map((e,t)=>`
          <button class="cp-route-stop" data-landmark-index="${t}">
            <span>${t+1}</span>
            <strong>${e.name}</strong>
          </button>
        `).join(``)}
      </div>`:``,D=p.length?`
      <section class="cp-section">
        <h3 class="cp-section-title">Related Profiles</h3>
        <div class="cp-related-grid">
          ${p.map(e=>`
            <a class="cp-related-card" href="#/country/${e.id}">
              <span>${e.flag}</span>
              <strong>${e.name}</strong>
              <em>${e.terrain}</em>
            </a>
          `).join(``)}
        </div>
      </section>`:``,O=`
    <section class="cp-section">
      <h3 class="cp-section-title">Atlas Comparison</h3>
      <div class="cp-compare-strip">
        <div><span>Area rank</span><strong>#${v}</strong><em>of ${e.length}</em></div>
        <div><span>Elevation rank</span><strong>#${y}</strong><em>by high terrain</em></div>
        <div><span>Regional peers</span><strong>${_.length}</strong><em>${l.continent}</em></div>
        <div><span>Mapped stops</span><strong>${l.landmarks?.length||0}</strong><em>landmarks</em></div>
      </div>
    </section>`;u.innerHTML=`
    <style>
      /* ---- Country Page Styles ---- */
      .cp-page {
        background: var(--bg, #0a0a0f);
        color: var(--text, #e8e8f0);
        min-height: 100vh;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }

      /* Hero */
      .cp-hero {
        position: relative;
        width: 100%;
        height: 60vh;
        min-height: 360px;
        overflow: hidden;
      }
      .cp-hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .cp-hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          var(--bg, #0a0a0f) 0%,
          rgba(10, 10, 15, 0.6) 40%,
          rgba(10, 10, 15, 0.2) 100%
        );
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 3rem 2rem;
      }
      .cp-hero-flag {
        font-size: 3.5rem;
        margin-bottom: 0.5rem;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
      }
      .cp-hero-name {
        font-size: clamp(2.2rem, 5vw, 4rem);
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 0.3rem;
        background: linear-gradient(135deg, #fff, var(--accent, #6c8aff));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .cp-hero-local {
        font-size: 1.1rem;
        font-weight: 300;
        color: var(--text2, #8888a0);
        margin-bottom: 0.5rem;
      }
      .cp-hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.3rem);
        color: var(--text2, #8888a0);
      }

      /* Content wrapper */
      .cp-content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 2rem 4rem;
      }

      /* Quick Facts Bar */
      .cp-facts-bar {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
        padding: 1.5rem 0;
        margin-bottom: 2rem;
        scrollbar-width: thin;
        scrollbar-color: var(--border, #2a2a3a) transparent;
      }
      .cp-facts-bar::-webkit-scrollbar { height: 4px; }
      .cp-facts-bar::-webkit-scrollbar-thumb { background: var(--border, #2a2a3a); border-radius: 2px; }
      .cp-fact-card {
        flex: 0 0 auto;
        min-width: 140px;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1rem 1.2rem;
        text-align: center;
      }
      .cp-fact-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text2, #8888a0);
        margin-bottom: 0.4rem;
      }
      .cp-fact-value {
        font-size: 1rem;
        font-weight: 700;
      }

      /* Sections */
      .cp-section {
        margin-bottom: 3rem;
      }
      .cp-section-title {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border, #2a2a3a);
      }

      /* Blockquote description */
      .cp-description {
        color: var(--text2, #8888a0);
        line-height: 1.9;
        font-size: 1.05rem;
        border-left: 3px solid var(--accent, #6c8aff);
        padding-left: 1.2rem;
        margin: 0;
      }

      /* Map */
      .cp-map-container {
        width: 100%;
        height: 420px;
        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid var(--border, #2a2a3a);
      }

      /* Info cards (terrain/climate) */
      .cp-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .cp-profile-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 3rem;
      }
      .cp-profile-card {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1.2rem;
      }
      .cp-profile-card h3 {
        font-size: 1rem;
        margin-bottom: 0.65rem;
      }
      .cp-profile-card p {
        color: var(--text2, #8888a0);
        line-height: 1.75;
        font-size: 0.94rem;
      }
      .cp-compare-strip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
      .cp-compare-strip div {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1rem;
      }
      .cp-compare-strip span {
        display: block;
        color: var(--text2, #8888a0);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 0.35rem;
      }
      .cp-compare-strip strong {
        display: block;
        font-size: 1.35rem;
        margin-bottom: 0.2rem;
      }
      .cp-compare-strip em {
        display: block;
        color: var(--text2, #8888a0);
        font-size: 0.8rem;
        font-style: normal;
      }
      .cp-route-strip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.8rem;
        margin-top: 1rem;
      }
      .cp-route-stop {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        color: var(--text, #e8e8f0);
        border-radius: 0.7rem;
        padding: 0.8rem;
        text-align: left;
        cursor: pointer;
        transition: border-color 0.25s, background 0.25s;
      }
      .cp-route-stop:hover {
        border-color: var(--accent, #6c8aff);
        background: rgba(108, 138, 255, 0.1);
      }
      .cp-route-stop span {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(108, 138, 255, 0.16);
        color: var(--accent, #6c8aff);
        font-weight: 800;
      }
      .cp-route-stop strong {
        font-size: 0.86rem;
        line-height: 1.25;
      }
      .cp-info-card {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1.2rem;
      }
      .cp-info-card h4 {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text2, #8888a0);
        margin-bottom: 0.5rem;
      }
      .cp-info-card p {
        font-size: 0.95rem;
        line-height: 1.7;
        color: var(--text, #e8e8f0);
      }

      /* Geography text */
      .cp-geography-text {
        color: var(--text2, #8888a0);
        line-height: 1.8;
        font-size: 1rem;
      }

      /* Landmarks grid */
      .cp-landmarks-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .cp-landmark-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1.2rem;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
      }
      .cp-landmark-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        border-color: var(--accent, #6c8aff);
      }
      .cp-landmark-icon {
        font-size: 1.8rem;
        flex-shrink: 0;
        line-height: 1;
      }
      .cp-landmark-body h4 {
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }
      .cp-landmark-body p {
        font-size: 0.85rem;
        color: var(--text2, #8888a0);
        line-height: 1.5;
      }

      /* Gallery 2x2 */
      .cp-gallery-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .cp-gallery-item {
        border-radius: 0.8rem;
        overflow: hidden;
        border: 1px solid var(--border, #2a2a3a);
        aspect-ratio: 16/10;
      }
      .cp-gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s;
      }
      .cp-gallery-item:hover img {
        transform: scale(1.05);
      }
      .cp-related-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
      .cp-related-card {
        display: block;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.8rem;
        padding: 1rem;
        color: var(--text, #e8e8f0);
        transition: border-color 0.25s, transform 0.25s;
      }
      .cp-related-card:hover {
        border-color: var(--accent, #6c8aff);
        transform: translateY(-3px);
        color: var(--text, #e8e8f0);
      }
      .cp-related-card span {
        display: block;
        font-size: 1.7rem;
        margin-bottom: 0.45rem;
      }
      .cp-related-card strong {
        display: block;
        margin-bottom: 0.35rem;
      }
      .cp-related-card em {
        display: block;
        color: var(--text2, #8888a0);
        font-size: 0.8rem;
        font-style: normal;
        line-height: 1.45;
      }

      /* Back button */
      .cp-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 1.5rem;
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 2rem;
        color: var(--text, #e8e8f0);
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: none;
        transition: background 0.3s, border-color 0.3s;
        cursor: pointer;
        margin-top: 1rem;
      }
      .cp-back-btn:hover {
        background: var(--accent, #6c8aff);
        border-color: var(--accent, #6c8aff);
        color: #fff;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .cp-hero { height: 45vh; min-height: 280px; }
        .cp-profile-grid,
        .cp-route-strip,
        .cp-compare-strip,
        .cp-related-grid { grid-template-columns: 1fr; }
        .cp-landmarks-grid { grid-template-columns: 1fr; }
        .cp-gallery-grid { grid-template-columns: 1fr; }
        .cp-content { padding: 0 1rem 3rem; }
      }
    </style>

    <div class="cp-page"><header class="atlas-top"><a class="atlas-brand" href="#/">Geo<span>Vista</span></a><nav class="atlas-primary" aria-label="Country navigation"><a href="#${n(l)}">Country atlas</a>${i()}</nav></header>

      <!-- 1. Hero Banner -->
      <div class="cp-hero">
        <img class="cp-hero-img"
          ${o(l.heroImage||l.image||``,l.name,1400,``,{keywords:f})}>
        <div class="cp-hero-overlay">
          <div class="cp-hero-flag">${l.flag||``}</div>
          <h1 class="cp-hero-name">${l.name}</h1>
          ${l.nameLocal?`<div class="cp-hero-local">${l.nameLocal}</div>`:``}
          ${l.subtitle?`<div class="cp-hero-subtitle">${l.subtitle}</div>`:``}
        </div>
      </div>

      <div class="cp-content">${a(n(l))}<p class="atlas-country-entry"><a href="#/atlas">Field atlas</a> / <a href="#/atlas/${l.continent}">${l.continent}</a> / <a href="#${n(l)}">${l.name}: explore all landmarks →</a></p>

        <!-- 2. Quick Facts Bar -->
        <div class="cp-facts-bar">
          ${b}
        </div>

        <!-- 3. Overview -->
        <section class="cp-section">
          <h3 class="cp-section-title">Overview</h3>
          <blockquote class="cp-description">${l.description||``}</blockquote>
        </section>

        <div class="cp-profile-grid">
          <article class="cp-profile-card">
            <h3>Geographic Signature</h3>
            <p>${l.terrain||l.geography||``}</p>
          </article>
          <article class="cp-profile-card">
            <h3>Field Notes</h3>
            <p>${l.name} spans ${l.area||`a significant area`} with elevations from ${l.elevation||`varied terrain`}, creating ${l.climate||`distinct climate zones`} conditions across the profile.</p>
          </article>
        </div>

        ${O}

        <!-- 4. Interactive Map -->
        <section class="cp-section">
          <h3 class="cp-section-title">Interactive Map</h3>
          <div id="${d}" class="cp-map-container"></div>
        </section>

        <!-- 5. Geography & Terrain -->
        <section class="cp-section">
          <h3 class="cp-section-title">Geography &amp; Terrain</h3>
          ${l.geography?`<p class="cp-geography-text">${l.geography}</p>`:``}
          ${w||T?`<div class="cp-info-grid">${w}${T}</div>`:``}
        </section>

        <!-- 6. Landmarks -->
        ${l.landmarks&&l.landmarks.length?`
          <section class="cp-section">
            <h3 class="cp-section-title">Landmark Route</h3>
            ${E}
            <div class="cp-landmarks-grid">${x}</div>
          </section>`:``}

        <!-- 7. Photo Gallery -->
        ${C}

        ${D}

        <!-- 8. Back Button -->
        <a href="#/" class="cp-back-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Home
        </a>

      </div>
    </div>
  `,r(u);let k=null,A=!1,j=requestAnimationFrame(()=>{A||(s(u),k=c(d,l.id),k&&setTimeout(()=>k?.invalidateSize(),200),u.querySelectorAll(`.cp-map-focus, .cp-route-stop`).forEach(e=>{e.addEventListener(`click`,t=>{if(t.target.closest(`a`)||!k)return;let n=parseInt(e.dataset.landmarkIndex,10),r=l.landmarks[n];if(!r)return;if(r.lat!=null&&r.lng!=null)k.flyTo([r.lat,r.lng],8,{duration:1.2});else{let e=l.lat||0,t=l.lng||0;k.flyTo([e,t],6,{duration:1.2})}let i=document.getElementById(d);i&&i.scrollIntoView({behavior:`smooth`,block:`center`})})}))});return()=>{A=!0,cancelAnimationFrame(j),k?.remove(),k=null}}export{l as renderCountryPage};