const fs=require('fs');const assert=require('assert');
const dir='src/site/images/case-studies/caballeros/';
const files={
 'caballeros-invitation-demo-desktop-2x.png':[2560,1800],
 'caballeros-cook-tahini-2x.png':[780,1688],
 'caballeros-ingredients-tahini-2x.png':[780,1688],
 'caballeros-library-desktop-2x.png':[2560,1800],
 'caballeros-studio-tahini-desktop-2x.png':[2880,2000]
};
for(const [name,[w,h]] of Object.entries(files)){const b=fs.readFileSync(dir+name);assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(b.readUInt32BE(16),w);assert.equal(b.readUInt32BE(20),h);}
const css=fs.readFileSync('src/scss/_portfolio.scss','utf8');
assert(css.includes('max-width:390px'));assert(css.includes('max-width:1200px'));assert(css.includes('.caballeros-studio-crop'));
const html=fs.readFileSync('_site/case-studies/caballeros/index.html','utf8');
for(const file of Object.keys(files))assert(html.includes(file));
assert(!html.includes('cook-before.jpg'));assert(!html.includes('cook-after.jpg'));
assert(html.includes('Editor detail; open the image for the full view.'));
assert(html.includes('I’ve tested it in the kitchen, too.'));
console.log('PASS five Retina PNG dimensions, bounded display sizes, current recipe evidence and honest editor crop');

assert(!html.includes('caballeros-invitation-desktop-2x.png'));
assert(!fs.existsSync(dir+'caballeros-invitation-desktop-2x.png'));
