const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
assert(fs.existsSync('src/site/_data/projectDetails.json'), 'Every public case needs an evidence-backed tiny detail');
const details = require('../src/site/_data/projectDetails.json');
assert.equal(Object.keys(details).length, 7);
for (const [key, detail] of Object.entries(details)) {
  const html = fs.readFileSync(`_site/case-studies/${key}/index.html`, 'utf8');
  assert.equal((html.match(/class="case-tiny-detail"/g) || []).length, 1, key);
  assert(html.includes(`id="tiny-detail-${key}"`));
  assert(detail.title && detail.text && detail.alt);
  assert(fs.existsSync(path.join('src/site/images/case-studies', detail.image)));
  const [x,y,w,h] = detail.crop;
  assert([x,y,w,h,detail.width,detail.height].every(Number.isFinite));
  assert(x>=0 && y>=0 && w>0 && h>0 && x+w<=detail.width && y+h<=detail.height, key);
  if (detail.type === "image") assert(html.includes(`aria-label="View full screen: ${detail.title.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`));
}
assert.doesNotMatch(JSON.stringify(details), /glassfiles\/|roast-cards\/|flavour-guide\//);
const css=fs.readFileSync('src/site/css/index.css','utf8');
assert.match(css,/\.tiny-detail-crop/);
assert.match(css,/overflow: hidden/);
console.log('PASS seven tiny details: factual metadata, one callout each, source crop bounds, public asset boundary and accessible source links');
