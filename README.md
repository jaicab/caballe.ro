# caballe.ro

Jaime Caballero’s portfolio, built with Eleventy, Nunjucks and Sass.

## Local development

Install the existing dependencies with `npm install`, then:

- `npm run build` creates the public-safe `_site` output.
- `npm run build:review` creates `_review` for an authorized local review. It requires an untracked private content pack at `../private-review/site`; those sources are kept outside this repository.
- `npm run preview` serves the local review at `http://127.0.0.1:8765`.
- `python3 scripts/preview.py --directory _site` previews the public output on the same port.

The local server supports byte ranges for video seeking and binds only to loopback. Public and review output folders are cleaned separately. Restricted material is never part of the default build. The sample reveal is an interaction prototype with fictional content; it does not implement authentication.

## Fonts

Bricolage Grotesque is locally embedded for headings, with Epilogue for body text and Space Mono for labels. The original CABALLERO wordmark and project palettes remain. Official font sources and SIL Open Font Licenses are retained under `src/site/fonts`; the local comparison also includes Instrument Sans.

## Publishing

Review and approve content before publishing. Restricted work requires a separately approved authenticated delivery arrangement; obscuring links, `noindex` or a client-side password is not an access boundary. The public build deliberately omits restricted routes and assets.
