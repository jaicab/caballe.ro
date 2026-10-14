const fs = require('fs');
const path = require('path');
const output = process.env.PORTFOLIO_PRIVATE_REVIEW === '1' ? '_review' : '_site';
fs.rmSync(path.join(__dirname, '..', output), {recursive:true, force:true});
