// Static regression checks; browser rendering/playback is checked separately.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = process.argv[2] || '_site';
const themes = require('../src/site/_data/projectThemes.json');
const css = fs.readFileSync(path.join(root, 'css/index.css'), 'utf8');
const luminance = hex => {
  const c = hex.replace('#','').match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return c[0]*.2126+c[1]*.7152+c[2]*.0722;
};
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
let count = 0;
for (const slug of fs.readdirSync(path.join(root,'case-studies'))) {
  const html = fs.readFileSync(path.join(root,'case-studies',slug,'index.html'),'utf8');
  assert(/href="\/css\/index\.css\?v=[a-f0-9]{12}"/.test(html), `${slug}: stylesheet must be content-versioned`);
  const t = themes[slug]; assert(t, `Missing theme: ${slug}`);
  const body = html.match(/<body[^>]+>/)[0];
  assert(body.includes('tmpl-report'));
  for (const [name,value] of [['light',t.light],['dark',t.dark],['ink',t.ink]]) assert(body.includes(`--case-${name}: ${value}`),`${slug}: ${name} token missing`);
  assert(new Set(t.dark.match(/[a-f0-9]{2}/gi)).size > 1,`${slug}: neutral black theme`);
  assert(contrast(t.dark,t.light)>=4.5,`${slug}: dark text contrast`);
  assert(contrast(t.ink,t.light)>=4.5,`${slug}: light text contrast`);
  count++;
}
for(const selector of ['body.tmpl-report.u-dark','.tmpl-report.u-dark .u-whitebreak','body.tmpl-report.u-dark .o-header:hover']) {
  const blocks=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(m=>m[1].split(',').some(s=>s.trim()===selector)&& /background:/.test(m[2]));
  assert(blocks.length,`Missing ${selector}`);
  assert(/background:\s*var\(--case-dark/.test(blocks.at(-1)[2]),`${selector}: last background must use project dark`);
}
const video=css.match(/\.exported-demo\s*\{([^}]+)\}/)[1];
assert(/background:\s*var\(--case-dark/.test(video),'Exported video surround must use project tint, not black');
console.log(`PASS ${root}: ${count} case themes, accessible contrast, dark page/header/break and video surfaces`);

if (root === '_site') {
  const allowed = new Set(['glass','wise','checkstep','moteefe','carlos-caballero','dotdot','caballeros']);
  for (const slug of fs.readdirSync(path.join(root,'case-studies'))) assert(allowed.has(slug), `Restricted public route: ${slug}`);
  for (const slug of fs.readdirSync(path.join(root,'images/case-studies'))) assert(allowed.has(slug), `Restricted public assets: ${slug}`);
  console.log('PASS public case routes and media allowlist');
}
