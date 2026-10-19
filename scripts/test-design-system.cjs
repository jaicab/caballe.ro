'use strict';

// Source and rendered-markup checks. Run with: node scripts/test-design-system.cjs
// These checks do not replace browser, visual, keyboard or screen-reader testing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const nunjucks = require('nunjucks');

const root = path.resolve(__dirname, '..');
const site = path.join(root, 'src/site');
const templatePath = path.join(site, 'system.njk');
assert.ok(fs.existsSync(templatePath), 'The shared component reference must exist at src/site/system.njk');
const template = fs.readFileSync(templatePath, 'utf8');
const stylesheet = fs.readFileSync(path.join(root, 'src/scss/_portfolio.scss'), 'utf8');
const base = fs.readFileSync(path.join(site, '_includes/layouts/base.njk'), 'utf8');
const tokens = {
  '--studio-paper': '#f1ede5',
  '--studio-ink': '#211f25',
  '--studio-violet': '#64428b',
  '--studio-lilac': '#d7c0ef',
  '--studio-lime': '#d2eea2',
  '--studio-line': '#c8c0cf',
  '--space1': '8px',
  '--space2': '16px',
  '--space3': '24px',
  '--space4': '40px',
  '--space5': '64px',
  '--motion-fast': '160ms',
  '--motion-medium': '220ms'
};

const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(site, '_includes')), { autoescape: true });
environment.addFilter('assetVersion', value => value);
environment.addFilter('url', value => value);
const context = {
  title: 'The portfolio system',
  description: 'A component reference for this portfolio.',
  templateClass: 'tmpl-system',
  noindex: true,
  metadata: JSON.parse(fs.readFileSync(path.join(site, '_data/metadata.json'), 'utf8')),
  page: { url: '/system/' },
  build: { privateReview: false }
};
const content = environment.renderString(template.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''), context);
const html = environment.render('layouts/base.njk', { ...context, content });
let checks = 0;
function check(name, run) {
  run();
  checks += 1;
  console.log(`PASS ${name}`);
}
function hasClass(name) {
  return [...html.matchAll(/\bclass="([^"]+)"/g)].some(match => match[1].split(/\s+/).includes(name));
}

check('the reference is a static portfolio page with a clear, truthful purpose', () => {
  assert.match(template, /^---\nlayout: layouts\/base\.njk\n/);
  assert.match(template, /^templateClass: tmpl-system$/m);
  assert.match(template, /^permalink: \/system\/$/m);
  assert.match(content, /component reference/i);
  assert.match(content, /not a client case study/i);
  assert.equal((content.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(template, /\b(?:ReactDOM|createRoot|iframe)\b/);
});

check('every documented palette, spacing and motion token has the agreed shared value', () => {
  for (const [token, value] of Object.entries(tokens)) {
    const declaration = new RegExp(`${token}\\s*:\\s*${value}\\s*[;}]`, 'i');
    assert.ok(declaration.test(stylesheet), `${token} must be defined as ${value} in the shared stylesheet`);
    assert.ok(template.includes(token), `${token} must be visible in the reference`);
  }
  for (const token of Object.keys(tokens).filter(name => !name.startsWith('--motion-'))) {
    assert.ok(template.includes(`var(${token})`), `${token} must drive its actual visual sample`);
  }
});

check('typography names match the shared display, body and label families', () => {
  for (const family of ['Bricolage Grotesque', 'Epilogue', 'Space Mono']) {
    assert.ok(content.includes(family), `${family} must be identified`);
  }
  assert.match(stylesheet, /--font-display\s*:\s*'Bricolage Grotesque'/);
  assert.match(base, /family=Epilogue/);
  assert.match(base, /family=Space\+Mono/);
  assert.ok(hasClass('system-type'));
  assert.ok(hasClass('eyebrow'));
});

check('examples use the real portfolio components instead of a parallel UI library', () => {
  for (const className of [
    'system-page', 'system-section', 'system-swatches', 'system-type', 'system-example',
    'text-link', 'project-stage', 'project-copy', 'project-visual',
    'workflow-lab__button', 'workflow-lab__button--primary'
  ]) {
    assert.ok(hasClass(className), `Missing shared component or reference wrapper: ${className}`);
  }
  assert.match(content, /<details\b[^>]*>\s*<summary\b/);
  assert.match(content, /<button\b[^>]*disabled/);
  assert.match(content, /Tab through/i);
  assert.match(stylesheet, /:focus-visible/);
});

check('the live workflow is included once with one script and a three-state reference', () => {
  assert.equal((template.match(/include\s+"_workflow-demo\.njk"/g) || []).length, 1);
  assert.equal((html.match(/\bdata-workflow-demo(?=[\s>])/g) || []).length, 1);
  assert.equal((html.match(/<script\b[^>]*src="\/js\/workflow-demo\.js(?:\?[^"]*)?"/g) || []).length, 1);
  for (const state of ['draft', 'compare', 'reviewed']) {
    assert.match(content, new RegExp(`data-system-state="${state}"`));
  }
  assert.match(content, /Any edit[\s\S]*review again/i);
  assert.match(content, /invented sample content/i);
  assert.match(content, /no AI call/i);
  assert.match(content, /<noscript>/);
});

check('rendered IDs are unique and every local label, control and fragment resolves', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate IDs break the reference or its included components');
  const idSet = new Set(ids);
  for (const match of html.matchAll(/\b(?:aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) assert.ok(idSet.has(id), `Missing referenced element: ${id}`);
  }
  for (const match of html.matchAll(/\bhref="#([^"]*)"/g)) {
    assert.ok(match[1] && idSet.has(match[1]), `Missing fragment target: #${match[1]}`);
  }
  for (const match of content.matchAll(/<button\b[^>]*>/g)) assert.match(match[0], /type="button"/);
});

check('the reference stays public-safe and all local example assets exist', () => {
  assert.doesNotMatch(content, /\/(?:images\/)?case-studies\/(?:glassfiles|roast-cards)\//);
  assert.doesNotMatch(content, /private-review|private-preview|protected-assets/);
  for (const match of content.matchAll(/\bsrc="(\/[^"?#]+)(?:\?[^"#]*)?"/g)) {
    assert.ok(fs.existsSync(path.join(site, match[1])), `Missing example asset: ${match[1]}`);
  }
  assert.doesNotMatch(content, /<(?:video|audio)\b[^>]*autoplay/);
  assert.doesNotMatch(template, /\b(?:fetch|XMLHttpRequest|setInterval)\s*\(/);
});

check('motion guidance preserves the shared reduced-motion and focus rules', () => {
  assert.match(content, /160\s*ms/);
  assert.match(content, /220\s*ms/);
  assert.match(content, /prefers-reduced-motion/);
  assert.match(stylesheet, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?animation:\s*none\s*!important/);
  assert.match(stylesheet, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?transition:\s*none\s*!important/);
  assert.match(stylesheet, /outline-offset:\s*\d/);
});

console.log(`\n${checks} component-reference checks passed. Browser rendering and interaction coverage remain separate.`);
