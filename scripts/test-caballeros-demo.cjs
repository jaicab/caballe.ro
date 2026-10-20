'use strict';

// Run after npm run build. Uses the real app's handlers with a minimal DOM
// boundary, not a browser. Layout and real request behavior need browser QA.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src/site/demos/caballeros');
const output = path.join(root, '_site/demos/caballeros');
const read = (directory, file) => fs.readFileSync(path.join(directory, file), 'utf8');
const html = read(source, 'index.html');
const script = read(source, 'app.js');
const css = read(source, 'styles.css');
const disclosure = 'Portfolio demo · fictional dinner · nothing is sent';
const backToCase = '/case-studies/caballeros/#invitation-demo';
const files = [
  'app.js',
  'assets/crayon-invitation.woff',
  'assets/envelope-opening-transparent.webp',
  'assets/wordmark.png',
  'index.html',
  'styles.css'
];

let checks = 0;
function check(name, run) {
  run();
  checks += 1;
  console.log(`PASS ${name}`);
}

function listFiles(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    return entry.isDirectory()
      ? listFiles(path.join(directory, entry.name), relative + '/')
      : [relative];
  }).sort();
}

check('the standalone output is exactly the six public source files', () => {
  assert.deepEqual(listFiles(source), files);
  assert.deepEqual(listFiles(output), files);
  for (const file of files) {
    assert.deepEqual(fs.readFileSync(path.join(output, file)), fs.readFileSync(path.join(source, file)), file);
  }
  assert.doesNotMatch(html, /portfolio-interactions|workflow-demo|project-entry|googletag|analytics/i);
  assert.match(read(root, '.eleventyignore'), /\*\*\/demos\/caballeros\/\*\*/);
});

check('the font and illustration bytes are the approved handoff assets', () => {
  const expected = {
    'crayon-invitation.woff': '31532ef255d7f0549dbebd487e96b4d6c3ce4208e392c0290b81b76cb37276ae',
    'envelope-opening-transparent.webp': '2d3b472e49fddefc9babd0f7ebc5afa895460cafe9f8ae00aab3ed9507585870',
    'wordmark.png': '7dd35870629a5a26c13443342ccdf267ed9f679166fcc8a1099e02ade92b17f4'
  };
  for (const [file, hash] of Object.entries(expected)) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(source, 'assets', file))).digest('hex');
    assert.equal(actual, hash, file);
  }
});

check('CSP blocks connections, submissions and embedded execution', () => {
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  const directives = Object.fromEntries(policy.split(';').map(value => {
    const [name, ...values] = value.trim().split(/\s+/);
    return [name, values.join(' ')];
  }));
  assert.deepEqual(directives, {
    'default-src': "'none'",
    'script-src': "'self'",
    'style-src': "'self'",
    'img-src': "'self'",
    'font-src': "'self'",
    'connect-src': "'none'",
    'form-action': "'none'",
    'base-uri': "'none'",
    'object-src': "'none'",
    'frame-src': "'none'",
    'worker-src': "'none'"
  });
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<link'));
  assert.match(html, /<meta name="referrer" content="no-referrer">/);
  assert.deepEqual([...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)].map(match => match[1]), ['./app.js']);
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  assert.doesNotMatch(html + script, /<(?:form|iframe|object|embed|audio|video)\b|\son\w+=/i);
  assert.doesNotMatch(html + css + script, /https?:\/\/|\/\/[a-z0-9.-]+\.[a-z]{2}|data:|javascript:/i);
});

check('all resources are relative static assets and all navigation stays in the portfolio', () => {
  const allowed = new Set(['./styles.css', './app.js', './assets/envelope-opening-transparent.webp', './assets/wordmark.png', backToCase]);
  for (const match of (html + script).matchAll(/(?:src|href)="([^"]+)"/g)) {
    assert.ok(allowed.has(match[1]), `Unexpected resource or link: ${match[1]}`);
  }
  assert.deepEqual([...css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(match => match[1]), ['./assets/crayon-invitation.woff']);
  assert.doesNotMatch(css, /@import/i);
  assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|cookie|caches|serviceWorker|Worker|SharedWorker|MediaRecorder|getUserMedia|FileReader|FormData|URLSearchParams)\b/);
  assert.doesNotMatch(script, /\b(?:eval|Function|import)\s*\(|\b(?:location|history)\b|createElement\s*\(/);
});

check('case entry and no-JavaScript fallback explain the fictional, unsent flow', () => {
  const caseHtml = read(root, '_site/case-studies/caballeros/index.html');
  assert.match(caseHtml, /id="invitation-demo"/);
  assert.match(caseHtml, /href="\/demos\/caballeros\/">Try the fictional invitation/);
  assert.ok(caseHtml.indexOf('Try the fictional invitation') < caseHtml.indexOf('caballeros-dinner'));
  assert.match(caseHtml, /Nothing is sent or saved; reset or reload to start again/);
  assert.ok(html.includes(disclosure));
  assert.match(html, /<noscript>[\s\S]*needs JavaScript[\s\S]*Back to case[\s\S]*<\/noscript>/);
  assert.match(css, /\.demo-case-link\s*\{[^}]*min-height:\s*44px/);
});

// The fixture exposes only the document methods this app needs. Its setters
// inspect every rendered state; it does not implement layout or a full DOM.
function fixture(reducedMotion = false) {
  const listeners = {};
  const activity = { focused: 0, renders: 0 };
  let markup = '';
  const app = {
    get innerHTML() { return markup; },
    set innerHTML(value) {
      markup = value;
      activity.renders += 1;
      assert.ok(value.includes(disclosure), 'Every state retains the demo label');
      assert.ok(value.includes('Use sample answers only. No personal or health information.'));
      assert.ok(value.includes(`href="${backToCase}">Back to case</a>`));
      assert.ok(value.includes('Answers stay in memory until reset or reload.'));
      for (const button of value.matchAll(/<button\b[^>]*>/g)) assert.match(button[0], /type="button"/);
      assert.doesNotMatch(value, /<(?:script|form|iframe|audio|video)\b/i);
      for (const tag of value.matchAll(/<[a-z][^>]*>/gi)) {
        // Escaped text inside a quoted value is not an executable attribute.
        assert.doesNotMatch(tag[0].replace(/"[^"]*"|'[^']*'/g, '""'), /\son\w+=/i);
      }
    },
    addEventListener(type, handler) {
      assert.ok(!listeners[type], `Only one ${type} handler is mounted`);
      listeners[type] = handler;
    },
    querySelector(selector) {
      assert.equal(selector, 'h1, h2');
      return /<h[12]/.test(markup) ? { focus() { activity.focused += 1; } } : null;
    }
  };
  const document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    }
  };
  vm.runInNewContext(script, { document, matchMedia: () => ({ matches: reducedMotion, addEventListener() {} }) }, { filename: 'caballeros/app.js', timeout: 1000 });
  return {
    activity,
    get html() { return markup; },
    click(action) {
      assert.ok(markup.includes(`data-action="${action}"`), `${action} is not available`);
      listeners.click({ target: { closest(selector) {
        assert.equal(selector, '[data-action]');
        return { dataset: { action } };
      } } });
    },
    input(field, value) {
      assert.ok(markup.includes(`data-field="${field}"`), `${field} is not available`);
      listeners.input({ target: { dataset: { field }, value } });
    },
    attendance(value) {
      assert.ok(markup.includes(`name="attendance" value="${value}"`));
      listeners.input({ target: { dataset: {}, name: 'attendance', value } });
    }
  };
}

function accept(demo, name = 'Alex Demo') {
  demo.click('start');
  demo.click('next');
  demo.input('name', name);
  demo.click('next');
  demo.click('next');
  demo.click('next');
  demo.click('next');
  assert.match(demo.html, /Your note, before it stays here/);
  assert.match(demo.html, /Joining the fictional dinner/);
  demo.click('confirm');
  assert.ok(demo.html.includes(`You’re on the imaginary list, ${name}.`));
  assert.match(demo.html, /Nothing was sent. No booking or guest record was created/);
}

check('acceptance can be completed twice, with fictional defaults restored between runs', () => {
  const demo = fixture();
  assert.match(demo.html, /The imaginary table/);
  assert.equal(demo.activity.focused, 0);
  accept(demo, 'Sample Friend');
  assert.ok(demo.activity.focused >= 7, 'Step headings receive focus');
  demo.click('restart');
  assert.doesNotMatch(demo.html, /Sample Friend/);
  accept(demo);
  demo.click('reset');
  assert.match(demo.html, /Try the RSVP demo/);
});

check('declining goes directly to review, can go back, and never claims a real submission', () => {
  const demo = fixture();
  demo.click('start');
  demo.attendance('no');
  demo.click('next');
  assert.match(demo.html, /Not joining the fictional dinner/);
  assert.doesNotMatch(demo.html, /<dt>Dish<\/dt>|<dt>Memory<\/dt>/);
  demo.click('back');
  assert.match(demo.html, /name="attendance" value="no" checked/);
  demo.click('next');
  demo.click('confirm');
  assert.match(demo.html, /Maybe another imaginary evening/);
  assert.match(demo.html, /Your fictional decline is complete in this tab. Nothing was sent/);
  demo.click('restart');
  demo.click('start');
  assert.match(demo.html, /name="attendance" value="yes" checked/);
});

check('blank required answers block progress while optional notes can stay empty', () => {
  const demo = fixture();
  demo.click('start');
  demo.click('next');
  demo.input('name', '   ');
  demo.click('next');
  assert.match(demo.html, /role="alert">Please keep a fictional sample answer here/);
  assert.match(demo.html, /data-field="name"/);
  demo.input('name', 'Alex Demo');
  demo.click('next');
  assert.doesNotMatch(demo.html, /role="alert"/);
  demo.input('dish', '\t');
  demo.click('next');
  assert.match(demo.html, /role="alert"/);
  demo.input('dish', 'Fictional lemon potatoes');
  demo.click('next');
  demo.input('story', '');
  demo.click('next');
  demo.input('version', '');
  demo.click('next');
  assert.equal((demo.html.match(/Not added/g) || []).length, 2);
  demo.click('confirm');
  assert.match(demo.html, /fictional RSVP is complete/);
});

check('edits remain literal escaped text in fields, headings, review and confirmation', () => {
  const demo = fixture();
  const unsafe = '<img src=x onerror=alert(1)> & "sample" \'text\'';
  const escaped = '&lt;img src=x onerror=alert(1)&gt; &amp; &quot;sample&quot; &#39;text&#39;';
  demo.click('start');
  demo.click('next');
  demo.input('name', unsafe);
  demo.click('next');
  demo.input('dish', unsafe);
  demo.click('next');
  assert.ok(demo.html.includes(`What comes to mind about ${escaped}?`));
  demo.input('story', unsafe);
  demo.click('next');
  demo.input('version', unsafe);
  demo.click('next');
  assert.equal(demo.html.split(escaped).length - 1, 4);
  assert.ok(!demo.html.includes(unsafe));
  demo.click('edit');
  demo.click('next');
  assert.ok(demo.html.includes(`value="${escaped}"`));
  demo.click('next');
  demo.click('next');
  assert.ok(demo.html.includes(`>${escaped}</textarea>`));
  demo.click('next');
  demo.click('next');
  demo.click('confirm');
  assert.ok(demo.html.includes(`You’re on the imaginary list, ${escaped}.`));
});

check('back, reset and a fresh page context restore the expected answers', () => {
  const demo = fixture();
  demo.click('start');
  demo.click('back');
  assert.match(demo.html, /Try the RSVP demo/);
  demo.click('start');
  demo.click('next');
  demo.input('name', 'Changed Fictional Guest');
  demo.click('next');
  demo.click('back');
  assert.match(demo.html, /value="Changed Fictional Guest"/);
  demo.click('reset');
  demo.click('start');
  demo.click('next');
  assert.match(demo.html, /value="Alex Demo"/);
  demo.input('name', 'Another Fictional Guest');
  const reloaded = fixture();
  reloaded.click('start');
  reloaded.click('next');
  assert.match(reloaded.html, /value="Alex Demo"/);
  assert.doesNotMatch(reloaded.html, /Another Fictional Guest/);
});

console.log(`\n${checks} Caballero’s demo checks passed. Browser rendering and live network behavior require separate QA.`);

check('animated invitation respects reduced motion and can be stopped', () => {
  const reduced = fixture(true);
  assert.doesNotMatch(reduced.html, /src="\.\/assets\/envelope-opening-transparent.webp"/);
  assert.doesNotMatch(reduced.html, /data-action="stop-animation"/);
  const normal = fixture();
  assert.match(normal.html, /data-action="stop-animation"/);
  normal.click('stop-animation');
  assert.doesNotMatch(normal.html, /src="\.\/assets\/envelope-opening-transparent.webp"/);
  assert.equal(normal.activity.focused, 1);
});

check('returning to welcome restores keyboard focus to the heading', () => {
  const demo = fixture();
  demo.click('start');
  const before = demo.activity.focused;
  demo.click('back');
  assert.match(demo.html, /<h1 tabindex="-1">/);
  assert.equal(demo.activity.focused, before + 1);
});
