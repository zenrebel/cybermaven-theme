# cybermaven-theme

Child theme of Twenty Twenty-Five for [cybermaven.net](https://cybermaven.net).

## Layout

- `style.css` – theme header (tells WordPress this is a child of Twenty Twenty-Five)
- `theme.json` – colors, fonts, spacing (the main design file)
- `assets/css/cybermaven.css` – extra CSS effects
- `parts/` – header and footer template parts
- `templates/` – page templates

## Deployment

Hostinger Git deployment pulls `main` into `wp-content/themes/cybermaven/`.
Deploy to the theme folder only, never the site root.

## Design: night drive (v0.2.0)

- Palette (slugs kept from Twenty Twenty-Five so patterns still work): night road `#13151B`, moonlight `#E6DFD0`, golden moon `#D7A443`, drive-in ember `#B85C38`, pale moon `#EADBB8`, dust `#A9A497`, fog `#1F222B`.
- Type: Big Shoulders Display for headings, site title, nav and buttons; Newsreader for body text. Both self-hosted in `assets/fonts` (SIL Open Font License).
- The loud element is the home page title: huge, condensed, left-aligned, with a headlight glow. Everything else stays quiet.
- Faint film grain and a headlight bloom at the top of every page.
