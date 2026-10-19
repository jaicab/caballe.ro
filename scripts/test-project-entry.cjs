const assert=require('node:assert/strict'),fs=require('node:fs');
const css=fs.readFileSync('src/site/css/index.css','utf8');
assert.match(css,/prefers-reduced-motion: no-preference/);
assert.match(css,/\.tmpl-report \.o-article__header/);
assert.match(css,/project-content-arrive 420ms ease-out backwards/);
assert.match(css,/project-image-arrive 440ms 120ms ease-out backwards/);
assert.doesNotMatch(css,/@view-transition|view-transition-group|data-project-arrival/);
for(const name of ['caballeros','glass','wise','checkstep','moteefe','dotdot','carlos-caballero']){
 const html=fs.readFileSync(`_site/case-studies/${name}/index.html`,'utf8');
 assert.match(html,/class="tmpl-report"/);assert.doesNotMatch(html,/project-entry.js|data-project-entry-surface/);
}
console.log('PASS all-case CSS entrance: direct visits supported, no Navigation API or interception, bounded stagger and reduced-motion fallback');
