# GeoVista Deep Optimization Design

## Goal

Make GeoVista feel like a layered geography atlas instead of a shallow country gallery, while improving image reliability without adding local image assets.

## Approved Direction

Use the combined approach:

- Add richer information layers: world summary, biome systems, climate zones, explorer controls, route stories, and deeper country profiles.
- Keep the app pure frontend and data-driven from `COUNTRIES`.
- Continue using third-party images, but avoid relying only on `images.unsplash.com`.
- Build a multi-domain image source chain with visual fallback so cards, galleries, and detail pages do not render blank.

## Content Architecture

The homepage should support multiple reading paths:

- `World Lens`: computed facts from the dataset, including area represented, climate range, extreme profiles, and continent balance.
- `Biome Atlas`: groups countries by landscape systems such as mountains, deserts, water worlds, volcanic terrain, forests, ice, and urban heritage.
- `Climate Matrix`: groups countries by climate signals and links into matching profiles.
- `Explorer`: searchable and sortable country index with continent, landscape, and climate filters.
- `Route Stories`: curated cross-country routes with stages and narrative focus.
- `Country Sections`: richer cards with terrain, climate, elevation, landmarks, and rotating images.

Country detail pages should add:

- Geographic snapshot cards.
- Terrain and climate breakdown.
- Landmark route timeline.
- Related profiles.
- Image source status that is implicit through stable rendering, not visible explanatory text.

## Image Strategy

The image layer should:

- Keep original data URLs as the first source.
- For Unsplash URLs, generate additional third-party variants using `images.weserv.nl` and `wsrv.nl`.
- Add keyword fallback images from `source.unsplash.com` and deterministic seeded fallback images from `picsum.photos`.
- Rotate card images through country image sets.
- Use CSS gradient fallback as the final non-network fallback.
- Apply the same behavior to country cards, landscape cards, gallery items, and detail hero/gallery images.

## Scope Boundaries

- Do not add local raster images.
- Do not change the static data file format unless required for derived views.
- Do not introduce backend or runtime APIs.
- Do not replace existing libraries.
- Keep changes focused on `src/`, `index.html`, docs, and generated `dist/`.

## Verification

Run `pnpm run build`. A Vite chunk-size warning is acceptable because the project already bundles heavy visualization libraries. Build failure is not acceptable.
