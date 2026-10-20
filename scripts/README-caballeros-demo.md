# Fictional RSVP demo

The isolated demo lives at `/demos/caballeros/`. Eleventy passes through
`src/site/demos/caballeros/` byte-for-byte and never templates its HTML.
The case study links into it; every state links back to the case.

This is a fictional dinner with sample answers, not the real guest flow.
Do not add analytics, storage, submissions, production event details or external
assets. Keep the visible disclosure and restrictive CSP. The font, wordmark
and animated envelope are the approved handoff files; tests lock their hashes.
The supplied invitation stylesheet is unchanged except for the back-link styles.

Verify with `npm run build && node scripts/test-caballeros-demo.cjs`.
The dependency-free Node harness executes the actual event handlers for acceptance
twice, decline, review edits, blank-field validation, escaping, reset and a fresh
page context. It also checks source/output parity, CSP and resource boundaries.
It does not verify rendering, actual storage state or browser request behavior.

Before publication, inspect desktop and mobile rendering in an available browser.
After publication, check both case/demo links, accepted and declined routes, reset,
reload, keyboard focus, and that requests remain static same-origin GETs only.
