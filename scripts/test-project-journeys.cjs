const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const journeys=require('../src/site/_data/projectJourneys.json');
assert.equal(Object.keys(journeys).length,7);
for(const [key,j] of Object.entries(journeys)){
 const html=fs.readFileSync(`_site/case-studies/${key}/index.html`,'utf8');
 assert.equal((html.match(/class="case-journey"/g)||[]).length,1,key);
 assert.match(html,new RegExp(`aria-labelledby="journey-${key}"`));assert.match(html,/<ol class="journey-route" role="list"/,'Preserve list semantics when CSS removes markers');
 assert(j.steps.length>=3 && j.steps.length<=4);
 for(const s of j.steps){assert(s.action&&s.question&&s.decision);if(s.image){assert(fs.existsSync(path.join('src/site/images/case-studies',s.image)));assert.match(html,new RegExp(s.image.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));}}
 assert(html.indexOf('class="case-journey"')>html.indexOf('id="tldr"'));
}
const all=JSON.stringify(journeys);assert.doesNotMatch(all,/glassfiles\/|roast-cards\/|flavour-guide\/|next test is a real cook/);
assert.match(journeys.wise.status,/rather than four successive screens/);assert(journeys.checkstep.steps.every(s=>s.role));assert.equal(journeys.wise.steps[2].image,'','Pending-refund explanation has no directly matching screen');assert.match(journeys.dotdot.status,/not implemented/);assert.match(journeys.caballeros.steps[2].decision,/full recipe quantities/);
const config=fs.readFileSync('.eleventy.js','utf8');assert.match(config,/aria-label="View the evidence:/,'Link accessible name includes its visible label');
const css=fs.readFileSync('src/site/css/index.css','utf8');assert.match(css,/grid-template-columns: 1fr/);assert.match(css,/\.journey-evidence/);
console.log('PASS seven public journeys: evidence files, labels, ordered steps, role boundaries, current captures and no restricted media');
