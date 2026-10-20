const assert=require('node:assert/strict'), fs=require('node:fs');
const source=fs.readFileSync('src/site/index.njk','utf8');
for(const match of source.matchAll(/class="project-copy"[\s\S]*?<h2>([\s\S]*?)<\/h2>/g)) assert(!match[1].includes('<br>'),'Project titles must wrap to their actual measure');
assert(source.includes('class="intro-actions"'),'Hero actions need an intentional layout');
const css=fs.readFileSync('src/site/css/index.css','utf8');
assert(css.includes('text-wrap: balance'));
assert(css.includes('.intro-actions'));
assert(!fs.readFileSync('src/scss/utilities/_utilities.headings.scss','utf8').includes('$important: true'),'Editorial heading defaults must not defeat scoped components');
assert(css.includes('.u-text a.text-link'),'All editorial text links share one underline treatment');
console.log('PASS home layout: naturally balanced project titles and intentional three-link action rail');
assert.match(css, /\.c-btn\.c-btn--primary\s*\{[^}]*color:\s*#f1ede5;[^}]*background:\s*#211f25;/);
assert.match(css, /\.u-dark \.c-btn\.c-btn--primary\s*\{[^}]*color:\s*#211f25;[^}]*background:\s*#f1ede5;/);
assert.match(css, /body \.c-btn--primary \.c-btn__text/);

assert.match(css, /grid-template-columns: repeat\(3, max-content\)/);
assert.match(css, /\.intro-actions \.availability\s*\{[^}]*grid-column: 1\/-1;/);
