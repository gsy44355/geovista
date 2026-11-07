# Field atlas acceptance record

Verified 7 November 2026 against the local Vite application in headless Chrome.

- 139 atlas routes rendered: 1 atlas, 5 regions, 23 country collections,
  92 landmark profiles, 6 studies, 6 evidence pages and 6 notebooks.
- All six study trails have eight levels including Home. A complete Mount Fuji
  trail was also traversed by clicking the homepage entry and each child card.
- All routes fit a 390px viewport; breadcrumbs remain within the viewport.
  Desktop (1440px) and mobile screenshots were inspected.
- Collection filtering and empty results, all six correct-answer flows,
  unanswered quiz feedback, unknown routes, country-to-landmark links and
  browser Back passed browser checks. No uncaught runtime exceptions occurred.
- Notebook text persisted through a page reload. Downloaded text was read back
  and matched the note. A simulated storage failure displayed download guidance.
- `node --test tests/atlas.test.js`: 3 tests passed, covering all country and
  landmark links, every complete study trail, and direct-link router behavior.
- `npm run build`: passed. Vite still reports the existing large application
  bundle warning (the application includes the globe and mapping libraries).
- `git diff --check`: passed.

External images and map tiles remain network-dependent. Studies link their
source descriptions; field exercises do not claim to be observed datasets.
This change is a local repository implementation; no hosted deployment was made.

Browser scope: the isolated headless Chrome session had GPU rendering disabled;
the existing globe logged a handled WebGL initialization failure, so 3D globe
rendering was not verified. The existing gallery also logged its production
license-key warning. These do not affect the new atlas-route checks above.

## Visual and interactive expansion — 7 November 2026

The follow-up expands the existing eight-level architecture without removing
routes. Three requested areas were checked:

1. **Visual design:** compact homepage navigation with a Discover menu; atlas
   region menu; responsive photo-led headings; consistent title typography,
   cards, chapter labels, sticky reading trail and next-chapter links. Desktop
   and mobile screenshots were inspected. Checks cover 390px, 768px, 1024px and
   1440px viewport widths.
2. **Interactions:** six landscape illustrations have four pointer/focus/tap
   hotspots and an overlay control. Volcanoes reveal a cutaway; fjords can hide
   the water layer. Profile charts support pointer inspection, keyboard slider
   control and line/bar modes. Maps support hover/focus tooltips, linked popups,
   nearby-place buttons and day/night basemaps. Six local photographs open in a
   keyboard-dismissible viewer. Notebook checklists and appendable templates
   work with existing save/download behavior.
3. **Content:** all 92 landmark pages gain an illustrated guide, three expanded
   chapters, a profile chart, evidence table and glossary. Six guided studies
   receive the same relevant modules; their evidence pages gain comparison
   tables and charts; notebooks gain an observation example and writing aids.
   Six subject photographs are bundled with authorship and license metadata.
   General interpretive guides and synthetic profile values are labeled and
   distinguished from site-specific claims.

`node tests/browser-field.mjs` verifies all 139 routes at mobile width and all six
study workflows, with real mouse and keyboard CDP input. It also checks image
loading and modal dismissal, map hover and layer switching, menu behavior,
notebook persistence after reload and collection filtering. The final run
reported no uncaught runtime exceptions. A rapid-navigation Leaflet CSS zoom
callback issue found during testing was fixed by using immediate CSS zoom while
retaining cancellable fly-to navigation.

`node --test tests/atlas.test.js` and `npm run build` pass. Build output includes
all six photos and `images/field/CREDITS.md`; the large JavaScript-bundle warning
remains. The new Chrome run rendered the existing 3D globe; detailed globe
interaction remains outside this follow-up's acceptance checks. Network map
tiles and older remote images still depend on external providers.

Visual inspection also caught a provider returning “API key required” placeholder
tiles with successful image responses. Both basemap themes now use attributed
OpenStreetMap tiles (the night theme applies a visual filter). A separate map
check verified real map imagery, both themes, tooltip width/containment and the
mobile map. Tooltips now have an explicit readable width rather than shrinking
to the marker's containing block.
