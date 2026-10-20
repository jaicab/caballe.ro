'use strict';

// Execute the actual head bootstrap before a body exists. Browser paint/scroll
// checks are separate; this catches ordering, preference and palette regressions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const nunjucks = require('nunjucks');
const themes = require('../src/site/_data/projectThemes.json');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/site/_includes'), { autoescape: true });
env.addFilter('url', value => value);
env.addFilter('assetVersion', value => value);
const metadata = require('../src/site/_data/metadata.json');
function render(slug, templateClass = 'tmpl-report') {
  return env.render('layouts/base.njk', {
    short: slug, templateClass, themeColor: themes[slug] && themes[slug].light.slice(1),
    projectThemes: themes, metadata, page: { url: slug ? `/case-studies/${slug}/` : '/' }, content: ''
  });
}
function boot(html, options = {}) {
  const bootstrap = html.match(/<script id="page-theme-bootstrap">([\s\S]*?)<\/script>/);
  assert.ok(bootstrap, 'A synchronous head theme bootstrap must run before any entrance can paint');
  assert.ok(html.indexOf(bootstrap[0]) < html.indexOf('<link rel="stylesheet"'), 'Theme resolution must precede stylesheet loading');
  const rootTag = html.match(/<html\b[^>]*>/)[0];
  const dataset = Object.fromEntries([...rootTag.matchAll(/data-([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), value]));
  const style = { setProperty(name, value) { this[name] = value; } };
  const root = { dataset, style };
  const events = {}, documentEvents = {}, mediaEvents = {};
  const writes = [];
  let stored = options.stored === undefined ? null : options.stored;
  let dark = Boolean(options.dark);
  const media = { get matches() { return dark; }, addEventListener(type, handler) { mediaEvents[type] = handler; } };
  const themeMeta = { content: '', setAttribute(name, value) { this[name] = value; } };
  const toggle = { checked: false };
  const document = {
    documentElement: root, body: null,
    querySelector(selector) { return selector === 'meta[name="theme-color"]' ? themeMeta : null; },
    getElementById(id) { return id === 'lightSwitch' ? toggle : null; },
    addEventListener(name, handler) { documentEvents[name] = handler; }
  };
  const context = {
    document,
    sessionStorage: {
      getItem() { if (options.storageBlocked) throw new Error('Storage disabled'); return stored; },
      setItem(key, value) { if (options.storageBlocked) throw new Error('Storage disabled'); stored = String(value); writes.push([key, stored]); }
    },
    matchMedia: query => query.includes('color-scheme') ? media : { matches: Boolean(options.reduced) },
    performance: { getEntriesByType: () => [{ type: options.navigation || 'navigate' }] },
    location: { hash: options.hash || '' },
    addEventListener(name, handler) { events[name] = handler; }
  };
  context.window = context;
  if (options.noMatchMedia) delete context.matchMedia;
  if (options.noPerformance) delete context.performance;
  vm.runInNewContext(bootstrap[1], context);
  assert.equal(document.body, null, 'The first resolution runs before the body is parsed');
  function parseBody() {
    const classes = new Set((html.match(/<body[^>]*class="([^"]+)"/) || ['', ''])[1].split(' '));
    document.body = { classList: {
      add(name) { classes.add(name); }, remove(name) { classes.delete(name); },
      toggle(name, force) { force ? classes.add(name) : classes.delete(name); },
      contains(name) { return classes.has(name); }
    } };
    const firstBodyScript = html.match(/<body\b[^>]*>\s*<script>([\s\S]*?)<\/script>/);
    assert.ok(firstBodyScript, 'Body theme must synchronize before the header or any content is parsed');
    vm.runInNewContext(firstBodyScript[1], context);
  }
  return { root, themeMeta, toggle, document, context, events, documentEvents, writes, parseBody,
    setStored(value) { stored = value; },
    setSystemDark(value) { dark = value; if (mediaEvents.change) mediaEvents.change(); }
  };
}

let matrix = 0;
for (const [slug, palette] of Object.entries(themes)) {
  for (const dark of [false, true]) {
    for (const stored of [null, 'true', 'false']) {
      for (const reduced of [false, true]) {
        const run = boot(render(slug), { stored, dark, reduced });
        const effective = stored === null ? (dark ? 'dark' : 'light') : (stored === 'true' ? 'light' : 'dark');
        assert.equal(run.root.dataset.theme, effective, `${slug}: stored preference overrides system before body exists`);
        assert.equal(run.root.style.backgroundColor, palette[effective], `${slug}: destination canvas uses its own palette before paint`);
        assert.equal(run.root.style.colorScheme, effective);
        assert.equal(run.themeMeta.content, palette[effective], `${slug}: browser chrome matches destination`);
        assert.equal(run.writes.length, 0, 'Reading system theme must not freeze it as a user preference');
        if (reduced) assert.equal(run.root.dataset.pageEntry, 'skip');
        run.parseBody();
        assert.equal(run.document.body.classList.contains('u-dark'), effective === 'dark');
        assert.equal(run.toggle.checked, effective === 'light');
        matrix++;
      }
    }
  }
}
console.log(`PASS ${matrix} pre-paint project theme combinations: all palettes, stored/system light/dark and reduced motion`);

for (const templateClass of ['tmpl-home', 'tmpl-system', 'tmpl-system tmpl-about']) {
  for (const dark of [false, true]) {
    const run = boot(render(null, templateClass), { dark });
    assert.equal(run.root.style.backgroundColor, dark ? '#28212f' : '#f1ede5');
    run.parseBody();
    assert.equal(run.document.body.classList.contains('u-dark'), dark);
  }
}
console.log('PASS homepage and studio pages resolve their actual light/dark background, not the previous case palette');

for (const options of [{ storageBlocked: true, dark: true }, { stored: 'invalid', dark: true }, { noMatchMedia: true }, { noPerformance: true }]) {
  const run = boot(render('wise'), options);
  assert.equal(run.root.dataset.theme, options.dark ? 'dark' : 'light');
  run.parseBody();
  assert.equal(run.document.body.classList.contains('u-dark'), Boolean(options.dark));
}
const dynamic = boot(render('wise'));
dynamic.parseBody();
dynamic.setSystemDark(true);
assert.equal(dynamic.root.style.backgroundColor, themes.wise.dark);
dynamic.context.switchTheme({ checked: true });
assert.deepEqual(dynamic.writes, [['theme', 'true']]);
dynamic.setSystemDark(false);
dynamic.setSystemDark(true);
assert.equal(dynamic.root.dataset.theme, 'light', 'Explicit selection must survive system changes');
dynamic.setStored('false');
dynamic.events.pageshow({ persisted: true });
assert.equal(dynamic.root.dataset.theme, 'dark', 'BFCache restore must re-read a later selection');
assert.equal(dynamic.root.dataset.pageEntry, 'skip');
assert.equal(dynamic.document.body.classList.contains('is-transitioning'), false, 'History restoration must not crossfade from stale colours');
for (const options of [{ navigation: 'back_forward' }, { hash: '#work' }]) {
  const run = boot(render(null, 'tmpl-home'), options);
  assert.equal(run.root.dataset.pageEntry, 'skip', 'History and fragment arrivals must reveal settled content');
}
const leaving = boot(render(null, 'tmpl-home'));
leaving.events.pagehide();
assert.equal(leaving.root.dataset.pageEntry, 'skip', 'A cached page must not resume a half-finished entrance');
assert.doesNotMatch(fs.readFileSync('src/site/_includes/theme-bootstrap.js', 'utf8'), /preventDefault|pushState|replaceState|scrollTo|startViewTransition|\bnavigation\./);
console.log('PASS unavailable storage/APIs, system changes, manual preference, native history restoration and fragment links');

const css = fs.readFileSync('src/site/css/index.css', 'utf8');
assert.match(css, /\.tmpl-home \.portfolio-intro\s*\{[^}]*animation:\s*home-content-arrive 360ms ease-out backwards/);
assert.match(css, /\.tmpl-home \.project-stage\s*\{[^}]*animation:\s*home-content-arrive 420ms 100ms ease-out backwards/);
assert.match(css, /\[data-page-entry=.?skip.?\][\s\S]*?animation:\s*none/);
assert.match(css, /\.project-stage:focus-within[\s\S]*?animation:\s*none/);
assert.match(css, /@keyframes home-content-arrive\s*\{[\s\S]*?opacity:\s*0\.35;[\s\S]*?transform:\s*translateY\(6px\)/);
assert.doesNotMatch(css.match(/@keyframes home-content-arrive\s*\{[\s\S]*?\n\}/)[0], /height:|width:|margin:|padding:|display:|visibility:|pointer-events:/);
console.log('PASS restrained homepage intro/card stagger, no layout animation or click gate, history/focus and reduced-motion escape');
