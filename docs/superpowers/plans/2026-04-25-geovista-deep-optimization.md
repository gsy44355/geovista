# GeoVista Deep Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deepen GeoVista into a richer static geography atlas and make third-party image rendering more resilient.

**Architecture:** Keep the app as a Vite pure frontend. Add derived content views from `COUNTRIES`, and centralize all image URL generation/fallback behavior in `src/assets.js`.

**Tech Stack:** Vite, vanilla JavaScript modules, Swiper, Chart.js, Leaflet, lightGallery, existing CSS.

---

### Task 1: Multi-Domain Image Pipeline

**Files:**
- Modify: `src/assets.js`
- Modify: `src/main.js`
- Modify: `src/gallery.js`
- Modify: `src/country-page.js`

- [ ] Expand `imageSources()` so every image can produce a source chain: original optimized URL, `images.weserv.nl`, `wsrv.nl`, `source.unsplash.com`, `picsum.photos`.
- [ ] Add keyword-aware helper arguments so fallback images can use country or landscape labels.
- [ ] Keep CSS gradient fallback as the terminal state.
- [ ] Update all image call sites to pass meaningful labels and keywords.

### Task 2: Homepage Information Architecture

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/style.css`

- [ ] Add containers for `World Lens`, `Climate Matrix`, and `Explorer`.
- [ ] Derive all values from `COUNTRIES`: total area, continent counts, elevation extremes, climate groups, landscape groups, and matching profile lists.
- [ ] Add interactive search/sort/filter behavior without backend dependencies.
- [ ] Keep controls compact and atlas-like, not marketing-style.

### Task 3: Country Detail Depth

**Files:**
- Modify: `src/country-page.js`

- [ ] Add terrain/climate profile cards.
- [ ] Add landmark route timeline with map fly-to behavior.
- [ ] Add related country recommendations.
- [ ] Add a compact country comparison strip based on area, elevation, climate, and continent.

### Task 4: Verification

**Files:**
- Generated: `dist/`

- [ ] Run `pnpm run build`.
- [ ] Confirm exit code is 0.
- [ ] Review `git status --short` for expected files only.
