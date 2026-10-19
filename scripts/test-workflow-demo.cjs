'use strict';

// Run from any directory: node scripts/test-workflow-demo.cjs
// Static and state-machine checks; browser rendering is verified separately.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const scriptPath = path.join(root, 'src/site/js/workflow-demo.js');
const templatePath = path.join(root, 'src/site/_includes/_workflow-demo.njk');
assert.ok(fs.existsSync(scriptPath), 'The interactive workflow module must exist');
assert.ok(fs.existsSync(templatePath), 'The accessible workflow include must exist');
const workflow = require(scriptPath);
const script = fs.readFileSync(scriptPath, 'utf8');
const template = fs.readFileSync(templatePath, 'utf8');
let checks = 0;
function check(name, run) {
  run();
  checks += 1;
  console.log(`PASS ${name}`);
}

check('initial text is a short, prewritten fictional caption', () => {
  assert.ok(workflow.INITIAL_DRAFT.length > 0);
  assert.ok(workflow.INITIAL_DRAFT.length <= workflow.MAX_LENGTH);
  assert.ok(workflow.ALTERNATE_DRAFT.length <= workflow.MAX_LENGTH);
  assert.notEqual(workflow.INITIAL_DRAFT, workflow.ALTERNATE_DRAFT);
  assert.ok(template.includes(workflow.INITIAL_DRAFT));
});

check('a draft cannot be downloaded before comparison and explicit review', () => {
  const draft = workflow.createState();
  assert.equal(workflow.canDownload(draft), false);
  assert.equal(workflow.canDownload(workflow.reviewDraft(draft, true)), false);
  assert.throws(() => workflow.exportText(draft), /review/i);
  const compared = workflow.compareDraft(draft);
  assert.equal(compared.comparedDraft, draft.draft);
  assert.equal(workflow.canDownload(compared), false);
  const reviewed = workflow.reviewDraft(compared, true);
  assert.equal(workflow.canDownload(reviewed), true);
  assert.equal(workflow.canDownload(workflow.reviewDraft(reviewed, false)), false);
});

check('every edit invalidates comparison and review, including reverting to approved text', () => {
  const approved = workflow.reviewDraft(workflow.compareDraft(workflow.createState()), true);
  const edited = workflow.editDraft(approved, 'A shorter, better coffee caption.');
  assert.equal(edited.comparedDraft, null);
  assert.equal(edited.reviewed, false);
  assert.equal(workflow.canDownload(edited), false);
  const restored = workflow.editDraft(edited, approved.draft);
  assert.equal(workflow.canDownload(restored), false);
  assert.equal(workflow.canDownload(workflow.editDraft(approved, approved.draft)), false);
  assert.equal(approved.reviewed, true, 'Transitions must not mutate prior state');
});

check('blank and overlong drafts cannot pass review, including programmatic input', () => {
  for (const text of ['', ' \n\t ', 'a'.repeat(workflow.MAX_LENGTH + 1)]) {
    const state = workflow.reviewDraft(workflow.compareDraft(workflow.createState(text)), true);
    assert.equal(workflow.isValidDraft(text), false);
    assert.equal(state.comparedDraft, null);
    assert.equal(workflow.canDownload(state), false);
    assert.throws(() => workflow.exportText(state), /review/i);
  }
  assert.equal(workflow.isValidDraft('a'.repeat(workflow.MAX_LENGTH)), true);
});

check('download contains only the reviewed version and the permanent invention disclosure', () => {
  const text = '  My coffee caption.\nA second line. ☕  ';
  const reviewed = workflow.reviewDraft(workflow.compareDraft(workflow.createState(text)), true);
  const output = workflow.exportText(reviewed);
  assert.ok(output.startsWith('Interactive example · invented sample content\n'));
  assert.ok(output.endsWith('My coffee caption.\nA second line. ☕\n'));
  assert.ok(!output.includes(workflow.INITIAL_DRAFT));
  assert.equal(workflow.canDownload({ ...reviewed, draft: 'Changed without reviewing' }), false);
});

check('starting over removes all previous approval', () => {
  const reset = workflow.createState();
  assert.equal(reset.draft, workflow.INITIAL_DRAFT);
  assert.equal(reset.comparedDraft, null);
  assert.equal(reset.reviewed, false);
});

check('markup exposes truthful context, native controls and useful no-JavaScript content', () => {
  assert.ok(template.includes('Interactive example · invented sample content'));
  assert.ok(template.includes('Generated is a starting point.'));
  assert.match(template, /<noscript>/);
  assert.match(template, /<textarea[^>]*maxlength="300"[^>]*disabled/);
  assert.match(template, /<label[^>]*for="workflow-draft"/);
  assert.match(template, /role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
  assert.match(template, /id="workflow-download-help"/);
  assert.match(template, /type="checkbox"[^>]*disabled/);
  assert.match(template, /id="workflow-preview-title"[^>]*tabindex="-1"/);
  for (const button of template.matchAll(/<button\b[^>]*>/g)) {
    assert.match(button[0], /type="button"/);
    assert.match(button[0], /disabled/);
  }
});

check('the demo has no network, persistence, HTML injection or automatic downloads', () => {
  assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB)\b/);
  assert.doesNotMatch(script, /\.innerHTML\s*=|insertAdjacentHTML|eval\s*\(/);
  assert.match(script, /downloadButton\.addEventListener\('click'/);
  assert.match(script, /URL\.revokeObjectURL/);
  assert.match(script, /textContent/);
  assert.match(script, /DOMContentLoaded/);
});

// A small DOM boundary double runs the actual event handlers without a browser.
// It deliberately does not claim CSS, layout, screen-reader or real-download coverage.
function fixture(options = {}) {
  const activity = { downloads: [], revoked: [], focused: null };
  class Element {
    constructor(name) {
      this.name = name;
      this.dataset = {};
      this.attributes = {};
      this.listeners = {};
      this.textContent = '';
      this.value = '';
      this.checked = false;
      this.disabled = true;
      this.hidden = false;
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    removeAttribute(name) { delete this.attributes[name]; }
    addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
    fire(name) { for (const handler of this.listeners[name] || []) handler(); }
    focus() { activity.focused = this; }
    remove() { this.removed = true; }
  }
  const names = [...template.matchAll(/data-workflow-([a-z-]+)(?:[ >])/g)].map(match => match[1]);
  const elements = Object.fromEntries(names.map(name => [name, new Element(name)]));
  elements.input.value = workflow.INITIAL_DRAFT;
  const title = new Element('title');
  const steps = ['draft', 'compare', 'reviewed'].map(phase => {
    const step = new Element(phase);
    step.dataset.workflowStep = phase;
    return step;
  });
  const doc = {
    body: { appendChild(link) { link.appended = true; } },
    createElement(tag) {
      assert.equal(tag, 'a');
      const link = new Element('download');
      link.click = () => {
        assert.ok(link.appended, 'Download links should be attached before activation');
        if (options.failClick) throw new Error('Download denied');
        activity.downloads.push(link);
      };
      return link;
    },
    defaultView: {
      Blob: class { constructor(parts, settings) { this.parts = parts; this.type = settings.type; } },
      URL: {
        createObjectURL(blob) { activity.blob = blob; return 'blob:local-test'; },
        revokeObjectURL(url) { activity.revoked.push(url); }
      },
      setTimeout(callback) { callback(); }
    }
  };
  if (options.noDownload) delete doc.defaultView.URL;
  const root = {
    dataset: {},
    ownerDocument: doc,
    querySelector(selector) {
      if (selector === '#workflow-preview-title') return title;
      const name = selector.match(/^\[data-workflow-(.+)\]$/)[1];
      return elements[name] || null;
    },
    querySelectorAll() { return steps; }
  };
  return { root, elements, activity, title, steps };
}

check('native interaction flow gates downloads and preserves edited text as literal text', () => {
  const { root, elements, activity, title } = fixture();
  workflow.mount(root);
  assert.equal(elements.input.disabled, false);
  assert.equal(elements.download.disabled, true);
  assert.equal(activity.downloads.length, 0);
  elements.download.fire('click');
  assert.equal(activity.downloads.length, 0, 'A forced disabled click must still be guarded');
  const caption = '<img src=x onerror=alert(1)> A coffee worth slowing down for.';
  elements.input.value = caption;
  elements.input.fire('input');
  elements.compare.fire('click');
  assert.equal(elements.revised.textContent, caption);
  assert.equal(elements.comparison.hidden, false);
  assert.equal(elements.reviewed.disabled, false);
  assert.equal(elements.download.disabled, true);
  assert.equal(activity.focused, title);
  assert.equal(root.dataset.state, 'compare');
  elements.reviewed.checked = true;
  elements.reviewed.fire('change');
  assert.equal(elements.download.disabled, false);
  assert.equal(root.dataset.state, 'reviewed');
  elements.download.fire('click');
  assert.equal(activity.downloads.length, 1);
  assert.equal(activity.downloads[0].download, 'invented-coffee-caption.txt');
  assert.equal(activity.downloads[0].removed, true);
  assert.ok(activity.blob.parts[0].includes(caption));
  assert.equal(activity.blob.type, 'text/plain;charset=utf-8');
  assert.deepEqual(activity.revoked, ['blob:local-test']);
  assert.match(elements.status.textContent, /Download requested/);
});

check('editing, sample replacement and reset clear approval; mounting twice is harmless', () => {
  const { root, elements, activity } = fixture();
  workflow.mount(root);
  workflow.mount(root);
  assert.equal(elements.compare.listeners.click.length, 1);
  elements.compare.fire('click');
  elements.reviewed.checked = true;
  elements.reviewed.fire('change');
  elements.input.value = 'My new version';
  elements.input.fire('input');
  assert.equal(elements.download.disabled, true);
  assert.equal(elements.reviewed.checked, false);
  assert.equal(elements.reviewed.disabled, true);
  assert.equal(elements.comparison.hidden, true);
  assert.equal(elements.placeholder.hidden, false);
  elements.sample.fire('click');
  assert.equal(elements.input.value, workflow.ALTERNATE_DRAFT);
  assert.equal(activity.focused, elements.input);
  assert.equal(elements.download.disabled, true);
  elements.reset.fire('click');
  assert.equal(elements.input.value, workflow.INITIAL_DRAFT);
  assert.equal(root.dataset.state, 'draft');
  assert.equal(elements.download.disabled, true);
});

check('unsupported downloads have an honest copy fallback', () => {
  const { root, elements } = fixture({ noDownload: true });
  workflow.mount(root);
  elements.compare.fire('click');
  elements.reviewed.checked = true;
  elements.reviewed.fire('change');
  assert.equal(elements.download.disabled, true);
  assert.match(elements['download-help'].textContent, /select your version to copy/);
  assert.match(elements.status.textContent, /copy/);
});

check('a failed download retains reviewed text and releases the temporary file', () => {
  const { root, elements, activity } = fixture({ failClick: true });
  workflow.mount(root);
  elements.compare.fire('click');
  elements.reviewed.checked = true;
  elements.reviewed.fire('change');
  elements.download.fire('click');
  assert.equal(activity.downloads.length, 0);
  assert.equal(elements.input.value, workflow.INITIAL_DRAFT);
  assert.equal(elements.reviewed.checked, true);
  assert.deepEqual(activity.revoked, ['blob:local-test']);
  assert.match(elements.status.textContent, /could not start/);
});

console.log(`\n${checks} workflow checks passed. No browser-rendering claim is made by this suite.`);
