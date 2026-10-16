# Technical SEO foundation

Rollback: `backup/pre-technical-seo-20261016` at `a681971f1e21e1ecc5b76bb93bece58c9343095f`.

The original shipped React bundle is preserved in `original-app.js`. `prepare.cjs` applies only head management and missing career routing, then creates a route manifest. `build.cjs` prerenders that React application using a DOM environment; its browser animations and styles remain in the application. Generated snapshots are replaced by the original React rendering when JavaScript loads. No API keys or new hosting are required.

Run `npm ci`, `npm run build`, `npm test`. For browser checks run `npx playwright install --with-deps chromium` and `node _seo/browser-test.cjs`.

The 12 incomplete article pages, Insights index and six existing career detail pages remain accessible with noindex and are excluded from the sitemap. Vacancy verification and editorial work are deferred. Every other route has static metadata and an apex HTTPS canonical with a trailing slash, matching GitHub Pages directory URLs. Unknown routes retain GitHub Pages' actual 404 status.

Organization schema includes only company name, public URL, logo and official email. No ratings, certifications or historical-first claims are added.

The deployment remains the root of `main` on GitHub Pages. To roll back, restore the backup tree in a new commit to main (do not reset shared history). Future content edits must be followed by a rebuild and tests before publishing the generated pages.
