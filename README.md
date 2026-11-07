# GeoVista — Explore Earth's Landscapes

An interactive geography showcase website featuring 23 countries across 5 continents, with 3D globe visualization, interactive maps, photo galleries, and detailed geographic profiles.

## Features

- **Optional 3D Interactive Globe** — Loaded after user opt-in; powered by [globe.gl](https://github.com/vasturiano/globe.gl) and Three.js, with country markers and connecting arcs
- **Country Detail Pages** — Full geographic profiles with interactive [Leaflet](https://leafletjs.com/) maps, landmark markers, and photo galleries
- **Continent Carousels** — Cinematic image sliders per continent using [Swiper](https://swiperjs.com/)
- **Statistics Dashboard** — Area comparison and continent distribution charts via [Chart.js](https://www.chartjs.org/)
- **Photo Gallery** — Six locally bundled, credited landscape photographs with a native dialog viewer
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
**Europe** — Iceland, Norway, Switzerland, Greece, Italy, Russia
**Americas** — Brazil, Peru, Canada, Chile, Colombia, United States
**Africa** — Morocco, Kenya, Egypt, South Africa, Namibia
**Oceania** — New Zealand, Australia

## License

MIT

## Field atlas

Open `#/atlas` from the main navigation or the homepage introduction. The atlas adds
5 region pages, 23 country collections, 92 landmark profiles and 6 guided studies.
Each study includes an evidence page and a browser-local observation notebook.

A complete eight-level trail (including home):

1. Home — `#/`
2. Field atlas — `#/atlas`
3. Asia — `#/atlas/asia`
4. Japan — `#/atlas/asia/japan`
5. Mount Fuji — `#/atlas/asia/japan/mount-fuji`
6. Cultural landscape study — `#/atlas/asia/japan/mount-fuji/sacred-landscape`
7. Evidence — `#/atlas/asia/japan/mount-fuji/sacred-landscape/evidence`
8. Notebook — `#/atlas/asia/japan/mount-fuji/sacred-landscape/evidence/notebook`

Equivalent complete trails cover the Namib Sand Sea, Great Barrier Reef, Machu
Picchu, Geirangerfjord and Mount Etna. Breadcrumbs and the exploration trail link
to each ancestor; the original country profiles also link into the atlas.
Collection search filters names and descriptions. Evidence pages include a
self-check with feedback. Notes can be saved in localStorage or downloaded as text;
they do not sync across devices. Storage failures leave downloading available.

Study sources are linked UNESCO World Heritage descriptions reviewed on
7 November 2026. Observation exercises are editorial prompts, not measured data.
Existing country statistics are descriptive snapshots, not live statistics;
country photos are illustrative and should not be treated as verified landmark
photos. Country maps and remote images still require external network access.

Content lives in `src/studies.js`; the hierarchy in `src/atlas-data.js`; page
rendering in `src/atlas.js`. Add studies with a matching country and landmark index.

Validate navigation coverage and all six eight-level trails:

```bash
node --test tests/atlas.test.js
npm run build
```

### Interactive field guides

The field atlas now includes illustrated landscape guides for volcanoes, dunes,
reefs, glacial valleys, terraced slopes and general landscape observation.
Landmark and study pages include four focusable hotspots, a layer toggle,
three expanded-reading chapters, an interactive profile chart, an evidence
register and a glossary. Evidence pages retain the chart and evidence register;
notebooks add a checklist and an appendable writing template.

- Mouse, touch and keyboard: hover/focus/tap hotspots, use the chart slider with
  arrow keys, and switch between profile lines and sample bars.
- Maps: hover or focus a place marker, click for the linked place card, jump to
  neighboring landmarks, and switch between light and dark basemaps.
- Photos: six verified subject photographs ship locally and open in a modal
  viewer. Credits and license links appear with the images and in
  `public/images/field/CREDITS.md`.
- Navigation: compact primary links, a Discover menu on the homepage, region
  menus in the atlas, sticky reading trails and next-chapter links.

`src/field-content.js` contains the editorial guides; `src/field-lab.js` contains
SVG illustrations and interactions; `src/field.css` styles the editorial layout.
Profile values are explicitly synthetic teaching examples, not measured heights
or forecasts. General field guides are distinct from site-specific descriptions.

The browser regression suite uses Chrome DevTools Protocol without adding a
browser dependency. With Vite running on port 5173 and an isolated Chrome session
started with `--remote-debugging-port=9227`, run:

```bash
node tests/browser-field.mjs
```

It exercises all six studies and checks all 139 atlas routes at mobile width,
plus tablet layouts, map tooltips, keyboard controls, photo viewing and menus.

### Browser-only product workflow

- **Find a place:** global search in the header or `Ctrl/Cmd + K`. Search by
  name, country context or landscape; filter countries, landmarks and studies.
  Arrow keys and Enter select a result.
- **Keep exploring:** save any atlas page and reopen it through `#/library`
  (My atlas). Recently opened pages and the homepage resume link keep a short
  local history. Route navigation restores previous scroll positions in the tab.
- **Keep notes:** the existing per-notebook storage keys are preserved. Notes
  autosave after a short pause, when changing routes, when hiding the tab and on
  page exit. Save/download buttons remain available. Blocked or full storage
  retains the latest session copy and visibly recommends exporting it.
- **Move between devices:** My atlas exports a versioned JSON backup. Import
  validates the entire file before writing, merges saved places and recent
  pages, and keeps an existing different note unchanged. This is manual file
  transfer, not cloud synchronization. Backups may contain personal writing.

This remains a static client application. There is no backend, login, database,
newsletter subscription or analytics service. Fonts, older country photos and
map tiles are external resources. No full offline installation is claimed;
first visits and dynamically loaded modules require a connection to the host.

The entry, homepage, country view, atlas, library, maps, charts, gallery and globe
are split into chunks. The 3D globe is opt-in and pauses when the overview/tab is
hidden. Atlas maps and overview charts/gallery load near their sections. Image
loading uses the requested URL and explicit alternatives sequentially; failed
images display a labeled placeholder rather than an unrelated stock photo.

Validation:

```bash
npm test
npm run check:build
```

`check:build` verifies the static entry graph stays below 60 kB gzip, excludes
heavy feature chunks and includes all six local study photos. Route-specific
chunks, images, styles and map tiles are additional transfers. The large-chunk
warning now applies to the optional globe chunk.

For browser acceptance, use Vite on port 5173 and a **separate Chrome profile**
with remote debugging on port 9227. The product test uses test data and resets
GeoVista browser keys in that profile; do not run it against a personal browser
profile with real notes.

```bash
node tests/browser-product.mjs
node tests/browser-field.mjs
```

The review findings and verification scope are recorded in
`docs/product-review.md`.
