const assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm');
const code=fs.readFileSync('src/site/js/project-entry.js','utf8');
function run({from='https://caballe.ro/',to='https://caballe.ro/case-studies/caballeros/',type='push',reduced=false,activation=true}={}) {
 const handlers={},root={dataset:{}};
 const context={URL,location:{href:to},window:{navigation:activation?{activation:{from:{url:from},navigationType:type}}:undefined},matchMedia:()=>({matches:reduced}),document:{documentElement:root,addEventListener:(n,f)=>handlers[n]=f},addEventListener:(n,f)=>handlers[n]=f};
 vm.runInNewContext(code,context); handlers.pagereveal(); return {root,handlers};
}
let f=run();assert.equal(f.root.dataset.projectArrival,'active');
f.handlers.animationend({animationName:'project-image-arrive'});assert.equal(f.root.dataset.projectArrival,undefined);
f=run();f.handlers.pageswap();assert.equal(f.root.dataset.projectArrival,undefined);
for(const options of [{reduced:true},{type:'traverse'},{activation:false},{from:'https://other.com/'},{from:'https://caballe.ro/about/'},{to:'https://caballe.ro/case-studies/wise/'},{from:'invalid'}]) assert.equal(run(options).root.dataset.projectArrival,undefined);
f=run();f.handlers.pagereveal();assert.equal(f.root.dataset.projectArrival,'active');f.handlers.pageswap();assert.equal(f.root.dataset.projectArrival,undefined);
assert.doesNotMatch(code,/preventDefault|pushState|replaceState|setTimeout|sessionStorage|localStorage|viewTransitionName/);
const home=fs.readFileSync('_site/index.html','utf8'),page=fs.readFileSync('_site/case-studies/caballeros/index.html','utf8'),css=fs.readFileSync('src/site/css/index.css','utf8');
assert.match(page,/project-entry.js/);assert.doesNotMatch(home,/project-entry.js|data-project-entry-surface/);assert.doesNotMatch(css,/@view-transition|view-transition-group/);
assert.match(css,/prefers-reduced-motion: no-preference/);assert.match(css,/project-image-arrive 240ms 75ms/);assert.match(css,/backwards/);
console.log('PASS settled entry: native links/history, traverse/reduced-motion/direct-visit fallback, repeat/interruption cleanup and bounded visible content');
