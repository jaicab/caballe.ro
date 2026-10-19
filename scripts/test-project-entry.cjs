const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('src/site/js/project-entry.js','utf8');
function fixture({reduced=false, href='https://caballe.ro/', surface=true}={}) {
  const handlers={}, root={dataset:{}}, node={style:{removeProperty(){delete this.viewTransitionName;}}};
  const context={URL,location:{href,origin:'https://caballe.ro'},window:{},matchMedia:()=>({matches:reduced}),document:{documentElement:root,querySelector:()=>surface?node:null},addEventListener:(name,fn)=>handlers[name]=fn};
  vm.runInNewContext(code,context);
  return {handlers,root,node,context};
}
function transition() {
  let resolveReady, rejectReady, resolveFinished, rejectFinished;
  const t={skipped:false,skipTransition(){this.skipped=true;},ready:new Promise((a,b)=>{resolveReady=a;rejectReady=b;}),finished:new Promise((a,b)=>{resolveFinished=a;rejectFinished=b;})};
  return {t,resolveReady,rejectReady,resolveFinished,rejectFinished};
}
(async()=>{
  let f=fixture(), a=transition();
  f.handlers.pageswap({viewTransition:a.t,activation:{entry:{url:'https://caballe.ro/case-studies/caballeros/'}}});
  assert.equal(f.node.style.viewTransitionName,'project-surface');
  a.resolveReady(); await Promise.resolve(); assert.equal(f.node.style.viewTransitionName,undefined);
  assert.equal(f.root.dataset.projectEntry,undefined);
  for(const url of ['https://example.com/case-studies/caballeros/','https://caballe.ro/case-studies/wise/','https://caballe.ro/#work',undefined]) {
    f=fixture();a=transition();f.handlers.pageswap({viewTransition:a.t,activation:{entry:{url}}});assert.equal(a.t.skipped,true);
  }
  f=fixture({reduced:true});a=transition();f.handlers.pageswap({viewTransition:a.t,activation:{entry:{url:'https://caballe.ro/case-studies/caballeros/'}}});assert.equal(a.t.skipped,true);
  f=fixture({href:'https://caballe.ro/case-studies/caballeros/'});f.context.window.navigation={activation:{from:{url:'https://caballe.ro/#caballeros-work'}}};a=transition();f.handlers.pagereveal({viewTransition:a.t});assert.equal(f.node.style.viewTransitionName,'project-surface');a.rejectReady(new Error('interrupted'));a.resolveFinished();await Promise.resolve();assert.equal(f.node.style.viewTransitionName,undefined);
  f=fixture();a=transition();let b=transition();const ev=t=>({viewTransition:t,activation:{entry:{url:'https://caballe.ro/case-studies/caballeros/'}}});
  f.handlers.pageswap(ev(a.t));f.handlers.pageswap(ev(b.t));a.rejectReady(new Error('replaced'));await Promise.resolve();assert.equal(f.node.style.viewTransitionName,'project-surface');b.resolveReady();await Promise.resolve();assert.equal(f.node.style.viewTransitionName,undefined);
  f.handlers.pageswap({});f.handlers.pagereveal({});
  f=fixture({href:'https://caballe.ro/case-studies/caballeros/'});a=transition();f.handlers.pageswap({viewTransition:a.t,activation:{entry:{url:'https://caballe.ro/'}}});assert.equal(a.t.skipped,true);
  assert.doesNotMatch(code,/preventDefault|pushState|replaceState|setTimeout|sessionStorage|localStorage/);
  const home=fs.readFileSync('_site/index.html','utf8'), page=fs.readFileSync('_site/case-studies/caballeros/index.html','utf8'), wise=fs.readFileSync('_site/case-studies/wise/index.html','utf8');
  for(const html of [home,page]){assert.equal((html.match(/data-project-entry-surface/g)||[]).length,1);assert.match(html,/@view-transition/);assert.match(html,/prefers-reduced-motion: reduce/);assert.match(html,/project-entry.js/);}
  assert.doesNotMatch(wise,/project-entry.js|@view-transition/);
  assert.match(home,/href="\/case-studies\/caballeros\/"/);
  console.log('PASS native project entry: route scope, reduced motion, capture cleanup, interrupted/replaced transitions, history fallback and untouched anchors');
})().catch(e=>{console.error(e);process.exitCode=1;});
