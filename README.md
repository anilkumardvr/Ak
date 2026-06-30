# AK Photography

An editorial-style photography portfolio and working archive — static site, no build step, no backend.

**Live structure**
- `index.html` — homepage: hero, filmstrip highlight reel, featured frames, about, contact
- `gallery.html` — full archive with category filtering
- `admin.html` — client-side upload tool (demo-grade, see note below)
- `css/style.css` — full design system (tokens, type, layout)
- `js/store.js` — photo data layer
- `js/main.js` — shared interactions (lightbox, nav)
- `js/admin.js` — upload page logic
- `images/` — seed/demo photos + portrait

## Running locally

No build tools needed. Just serve the folder:

```bash
cd akdemo
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly also works for browsing, but a local server avoids
some browsers' file:// restrictions.)

## How photo publishing works

The **Upload** page (`admin.html`) lets you drag in photos, set a title and category,
and "publish" them. This stores the images as base64 in the browser's `localStorage`
— it's a fully working demo with no server required, but uploads only persist **on
the device/browser you uploaded from**, and reset if site data is cleared.

### To publish photos permanently, for every visitor

1. Add your image file(s) to `/images`, e.g. `images/skyline-04.jpg`
2. Open `js/store.js` and add an entry to `AK_SEED_PHOTOS`:
   ```js
   { id: "p-007", src: "images/skyline-04.jpg", title: "Skyline IV", category: "Urban", caption: "Shot from the Bentway", date: "2026-06-30" }
   ```
3. Commit and push — GitHub Pages rebuilds automatically (see below).

This two-step (drop file in `/images`, add one line to `store.js`) is intentionally
simple so publishing real work doesn't require a CMS or backend.

## Pushing to GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: AK Photography site"
git branch -M main
git remote add origin https://github.com/anilkumardvr/Akdemo.git
git push -u origin main
```

## Publishing with GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under "Build and deployment", set **Source** to `Deploy from a branch`
3. Branch: `main`, folder: `/ (root)` → **Save**
4. Your site will be live at `https://anilkumardvr.github.io/Akdemo/` within a minute or two

A `.nojekyll` file is included so GitHub Pages serves the site as-is without
Jekyll processing.

## Customizing

- **Colors/type**: edit the `:root` tokens at the top of `css/style.css`
- **Copy**: hero, about, and contact text live directly in `index.html`
- **Categories**: edit the category list in `js/admin.js` (`qi-cat-select` options)
- **Contact form**: currently shows a local confirmation only — wire it to a form
  service (Formspree, Getform, etc.) by setting the form's `action` attribute if
  you want real email delivery.
