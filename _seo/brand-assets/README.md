# Approved branding sources

`full-logo-original.png` and `symbol-original.png` are the unmodified PNGs from the owner's `company logos.zip`, supplied on 19 October 2026. Their hashes and the prepared asset hashes are recorded in `../branding-assets.json`.

The production assets retain the supplied geometry and opaque symbol colors. Near-white background pixels are made transparent, empty margins are trimmed, and a small safety margin is added. The dark-theme logo changes only the wordmark fill to near-white; the light-theme and Organization logo retain the original navy wordmark. No generated/redrawn artwork is shipped.

Asset preparation (ImageMagick 7, from the repository root):

```sh
magick _seo/brand-assets/full-logo-original.png -alpha on -fuzz 6% -transparent white -trim +repage -bordercolor none -border 8 haeman-logo.png
magick _seo/brand-assets/full-logo-original.png -alpha on -fuzz 6% -transparent white -channel RGB -fx 'j>=900 ? 0.96 : u' +channel -trim +repage -bordercolor none -border 8 haeman-logo-dark.png
magick _seo/brand-assets/symbol-original.png -alpha on -fuzz 6% -transparent white -trim +repage -bordercolor none -border 12 -gravity center -background none -extent '%[fx:max(w,h)]x%[fx:max(w,h)]' haeman-symbol.png
for size in 16 32 48; do
  magick haeman-symbol.png -filter Lanczos -resize "${size}x${size}" "favicon-${size}x${size}.png"
done
magick haeman-symbol.png -define icon:auto-resize=48,32,16 favicon.ico
```

Prepared assets are committed; ImageMagick is not required for normal builds or CI. A future asset change must update the manifest hashes/version, head references and original-image pixel samples together.

`branding.cjs` updates only the existing shared React logo component during preparation. `branding.css` styles only that image. The existing theme context selects the contrast variant. `shell.html` declares symbol-only browser icons, and the Organization schema uses the full logo. All routes receive the content-hashed runtime URL to prevent stale shared branding.

Run `npm run build`, `npm test`, `node _seo/branding-browser-test.cjs` and the existing team, Phase B and full browser suites. Chromium is required for browser tests. The branding tests preserve all route text, destinations and SEO metadata/schema except the intended Organization logo URL; existing header/footer hash checks normalize only the changed logo image, leaving all other markup protected. Browser checks cover both themes, source-color samples, transparent corners, favicon sizes, proportional rendering, refresh and navigation at 1440px, 768px and 390px.
