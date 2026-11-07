# Product and frontend review

Reviewed 7 November 2026. Constraint: static frontend only, without an account,
application server, server-side database or invented cloud behavior.

## Product decisions and implemented changes

The primary user is a curious reader moving from an interesting place into a
geography investigation. The next useful improvement is a coherent exploration
loop rather than another layer of destinations.

| Observed problem | Implemented response | Evidence |
| --- | --- | --- |
| A large collection had only per-page filters | Global name/context search, type filters, keyboard selection and empty state | `browser-product.mjs`; accent/context unit tests |
| Users could not collect places or resume a trail | Local saved pages, recent history, My atlas, homepage resume link and in-tab scroll restoration | Browser saved list, refresh and history checks |
| Notes required manual saving and had no portable backup | Debounced autosave, route/page-exit flush, JSON export/import, existing-note conflict preservation | Storage tests; browser immediate navigation, downloaded file and import checks |
| Storage failures could leave an obsolete saved copy | Latest session copy retained; visible session-only status and export path | Simulated quota failure unit and browser checks |
| Heavy home features loaded on every route | Route splitting, opt-in globe, viewport-triggered map/chart/gallery imports | Build manifest budget and browser network request inspection |
| Failed photos could be replaced by unrelated images | Sequential explicit sources and a labeled local SVG placeholder | Source inspection and blocked-image browser check |
| Main gallery carried an unnecessary plugin/license warning | Native dialog over six locally bundled licensed photos; removed unused dependency | Browser modal flow and package/lockfile diff |
| Country cards depended on mouse-only click handlers | Real links, explicit map buttons, skip link, focus handling, reduced-motion styles | Keyboard behavior and semantic DOM checks |
| Footer promised unavailable newsletter/contact actions | Replaced placeholders with atlas, source, local-data and backup destinations | No `href="#"` remains |
| Animated statistics initially showed partial counts | Immediate collection counts; “Live collection” renamed “Collection snapshot” | Source-derived metrics and rendered homepage |

## Storage and import contract

- Library key: `geovista:library:v1`; notes retain `geovista:notebook:<route>`.
- Only known atlas paths and notebook routes are accepted. Notes are capped at
  200,000 characters; imported files are limited to 8 MB.
- Version 1 backups include saved paths, up to eight recent paths and note text.
- The entire file is validated before mutation. Import merges collections and
  adds missing notes. Different existing notes are not overwritten.
- A storage failure leaves the latest session copy available for export. It
  does not claim durable saving or cloud synchronization.
- Dynamic text in results, note previews and source captions is escaped.

## Performance measurement

Before this review, the build emitted a single application script of approximately
2.48 MB (722 kB gzip), including globe, charts, mapping and gallery code. After
splitting, the shared static entry graph is approximately **27.3 kB gzip**.
This is not the total page size: the selected route, CSS, images and any explicitly
opened heavy features add resources. `scripts/check-build.mjs` measures the
manifest's recursive static imports and enforces a 60 kB gzip budget.

A fresh direct notebook visit was verified to make no requests for home, globe,
map or chart modules. The globe module loads only after activating its control.
A persistent large-chunk warning is expected for that optional ~1.8 MB globe
module; it is not downloaded by every reader.

## Acceptance and limits

- `npm test`: ten tests covering routes, eight-level trails,
  storage migration, backup round trips, conflict preservation, invalid input,
  quota failure, blocked storage, maximum-size backup round trips and search behavior.
- `npm run check:build`: build and static entry budget pass; local photos present.
- `tests/browser-product.mjs`: search keyboard flow and empty state, saved pages,
  autosave before navigation, durable reload, backup download/import and invalid
  import, quota failure, latest-route wins, history scroll restoration, native
  gallery and explicit globe opt-in.
- `tests/browser-field.mjs`: all 139 existing atlas routes at 390px and all six
  guided-study interactions, plus 768px/1024px/1440px layout coverage.
- Screenshots of search, library, homepage, and narrow-screen layouts inspected.
- Static build is suitable for root-path hosting; hash routes require no backend
  route rewrites. There is no service worker or guarantee of complete offline use.
- External fonts, map tiles and older photos depend on their providers. The new
  six-photo gallery and study images are local, with licenses in the build.

The built `dist/` was also tested through Vite's static preview server on port
4173: direct notebook hash link, search, persisted notes after a full reload,
lazy map rendering and keyboard marker tooltip passed. No globe chunk was
requested during that flow. Headless keyboard checks explicitly activate/emulate
page focus so an unfocused browser window is not mistaken for an app failure.
