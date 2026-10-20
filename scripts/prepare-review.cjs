const fs = require('fs');
const path = require('path');
if (process.env.PORTFOLIO_PRIVATE_REVIEW === '1') {
  const root = path.join(__dirname, '..');
  const stage = path.join(root, 'review-src');
  const privatePack = path.join(root, '..', 'private-review', 'site');
  if (!fs.existsSync(privatePack)) throw new Error('Local private review pack is unavailable.');
  fs.rmSync(stage, {recursive:true, force:true});
  fs.cpSync(path.join(root, 'src', 'site'), stage, {recursive:true});
  fs.cpSync(privatePack, stage, {recursive:true});
  for (const key of ['glassfiles','roast-cards','flavour-guide']) {
    if (fs.existsSync(path.join(stage, 'case-studies', key + '.md'))) fs.rmSync(path.join(stage, 'case-studies', key + '.njk'), {force:true});
  }
}
