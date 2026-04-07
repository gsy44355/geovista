# GeoVista — Explore Earth's Landscapes

An interactive geography showcase website featuring 21 countries across 5 continents, with 3D globe visualization, interactive maps, photo galleries, and detailed geographic profiles.

## Features

- **3D Interactive Globe** — Powered by [globe.gl](https://github.com/vasturiano/globe.gl) and Three.js, with country markers and connecting arcs
- **Country Detail Pages** — Full geographic profiles with interactive [Leaflet](https://leafletjs.com/) maps, landmark markers, and photo galleries
- **Continent Carousels** — Cinematic image sliders per continent using [Swiper](https://swiperjs.com/)
- **Statistics Dashboard** — Area comparison and continent distribution charts via [Chart.js](https://www.chartjs.org/)
- **Photo Gallery** — Masonry layout with fullscreen lightbox powered by [lightGallery](https://www.lightgalleryjs.com/)
- **Scroll Animations** — Smooth entrance effects with [AOS](https://michalsnik.github.io/aos/)
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Modern dark UI with accent gradients

## Tech Stack

- [Vite](https://vitejs.dev/) — Build tool
- [globe.gl](https://github.com/vasturiano/globe.gl) + [Three.js](https://threejs.org/) — 3D globe
- [Swiper](https://swiperjs.com/) — Touch slider
- [AOS](https://michalsnik.github.io/aos/) — Scroll animations
- [Leaflet](https://leafletjs.com/) — Interactive maps
- [Chart.js](https://www.chartjs.org/) — Data visualization
- [lightGallery](https://www.lightgalleryjs.com/) — Image lightbox

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:5173` to preview.

## Build

```bash
pnpm run build
```

Static output in `dist/`, ready for deployment to any web server.

## Countries Covered

**Asia** — Japan, China, India, Thailand
**Europe** — Iceland, Norway, Switzerland, Greece, Italy
**Americas** — Brazil, Peru, Canada, Chile, Colombia
**Africa** — Morocco, Kenya, Egypt, South Africa, Namibia
**Oceania** — New Zealand, Australia

## License

MIT
