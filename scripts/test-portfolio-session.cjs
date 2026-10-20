'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = 'src/site/js/portfolio-session-core.js';
assert(fs.existsSync(source), 'The normal portfolio needs a shared authenticated session client');
const {createClient, parseInvitation, CASES, STORAGE_KEY, ORIGIN, isSafeInlineStyle, normalizePublicHref} = require('../' + source);
const credential = 'signed-session-fixture.signature';
const token = 'invitation-fixture-not-a-live-capability';
function harness(options = {}) {
  let time = 1000000, stored = options.stored || null;
  const calls = [], revoked = [], timers = new Map(); let timer = 0, clearCount = 0;
  const storage = {getItem(){if(options.storageBlocked)throw Error();return stored},setItem(k,v){if(options.storageBlocked)throw Error();stored=v},removeItem(){stored=null}};
  const client = createClient({storage, now:()=>time, setTimeout(fn,ms){timers.set(++timer,{fn,ms});return timer},clearTimeout(id){timers.delete(id)},onClear(){clearCount++},
    createObjectURL:()=> 'blob:fixture-' + calls.length, revokeObjectURL:url=>revoked.push(url),
    fetch:async(url,init)=>{calls.push({url,init});if(options.respond)return options.respond(url,init,time);return new Response(JSON.stringify(init.method==='POST'?{ok:true,credential,expiresAt:time+10000}:{ok:true,expiresAt:time+10000,cases:Object.keys(CASES).map(key=>({key,path:CASES[key],title:key}))}),{headers:{'Content-Type':'application/json'}})}
  });
  return {client,calls,revoked,timers,get stored(){return stored},get clears(){return clearCount},advance(ms){time+=ms},setStored(v){stored=v}};
}
(async()=>{
  assert.equal(typeof isSafeInlineStyle,'function','Fragment style validation must be testable independently');
  for (const css of ['width:100%;left:-10.5%;top:0;max-width:560px','aspect-ratio:334/162;--journey-stops:4','width:100%;height:auto;']) assert(isSafeInlineStyle(css));
  for (const css of ['background-image:image-set("https://example.test/x.png" 1x)','width:expression(alert(1))','height:url(https://example.test/x)','--journey-stops:var(--evil)','width:100px!important','width:100px;position:fixed','width:100px\\;']) assert(!isSafeInlineStyle(css),css);
  assert.equal(normalizePublicHref('/'),'/');
  assert.equal(normalizePublicHref('/case-studies/glass/'),'/case-studies/glass/');
  assert.equal(normalizePublicHref('#decisions'),'#decisions');
  assert.equal(normalizePublicHref('https://caballe.ro/'),'/');
  assert.equal(normalizePublicHref('https://caballe.ro/case-studies/glass/'),'/case-studies/glass/');
  assert.equal(normalizePublicHref('https://caballe.ro.evil.test/'),null);
  assert.equal(normalizePublicHref('javascript:alert(1)'),null);
  assert.equal(normalizePublicHref('//evil.test/'),null);
  assert.deepEqual(parseInvitation('#access=abc'),{token:'abc',hash:''});
  assert.deepEqual(parseInvitation('#decisions&access=abc'),{token:'abc',hash:'#decisions'});
  assert.deepEqual(parseInvitation('#access=abc&anchor=decisions'),{token:'abc',hash:'#decisions'});
  assert.equal(parseInvitation('#decisions'),null);
  let h=harness(); await h.client.exchange(token); assert.equal(h.calls.length,2,'Exchange is followed by validation');
  assert(h.stored.includes(credential));assert(!h.stored.includes(token));
  assert.equal(h.calls[0].init.body,JSON.stringify({token}));
  assert.equal(h.calls[0].init.headers['Content-Type'],'application/json');
  assert.equal(h.calls[1].init.headers.Authorization,'Bearer '+credential);
  for(const {url,init} of h.calls){assert(url.startsWith(ORIGIN+'/'));assert.equal(init.credentials,'omit');assert.equal(init.cache,'no-store');assert.equal(init.redirect,'error');assert.equal(init.referrerPolicy,'no-referrer');}
  assert.equal(h.client.takeWelcome(),true);assert.equal(h.client.takeWelcome(),false);
  const saved=h.stored; h=harness({stored:saved}); assert.equal((await h.client.restore()).cases.length,3);assert.equal(h.client.takeWelcome(),false,'Welcome only once across ordinary page loads');
  h.client.lock();assert.equal(h.stored,null);assert.equal(h.client.active(),false);
  h=harness({stored:saved});h.advance(20000);assert.equal(await h.client.restore(),null);assert.equal(h.stored,null);assert.equal(h.calls.length,0,'Never use expired local sessions');
  h=harness();await h.client.exchange(token);h.advance(20000);assert.equal(h.client.active(),false);assert.equal(h.stored,null,'Active expiry wipes storage');
  h=harness({storageBlocked:true});await assert.rejects(()=>h.client.exchange(token),/storage/i);assert.equal(h.client.active(),false);
  h=harness({respond:async()=>new Response('',{status:401})});await assert.rejects(()=>h.client.exchange(token));assert.equal(h.stored,null);
  h=harness({stored:JSON.stringify({credential,expiresAt:1009999}),respond:async()=>new Response('',{status:401})});await assert.rejects(()=>h.client.restore());assert.equal(h.stored,null);
  h=harness({respond:async()=>new Response(JSON.stringify({ok:true,credential,expiresAt:1000000+86400000}),{headers:{'Content-Type':'application/json'}})});await assert.rejects(()=>h.client.exchange(token));assert.equal(h.stored,null,'Reject unexpectedly persistent credentials');
  h=harness({stored:JSON.stringify({credential,expiresAt:1009999}),respond:async()=>new Response(JSON.stringify({ok:true,expiresAt:1009999,cases:[{key:'glassfiles',path:'https://evil.test/case',title:'Bad'}]}),{headers:{'Content-Type':'application/json'}})});await assert.rejects(()=>h.client.restore());assert(h.stored,'Protocol failure retains the credential for a later retry');assert.equal(h.client.active(),false,'Reject unrecognized destinations and hide all protected content');
  console.log('PASS session exchange, per-tab storage, request options, one-time welcome, expiry, denial, malformed state and fail-closed storage');
  const home=fs.readFileSync('_site/index.html','utf8');
  assert.match(home,/portfolio-session(?:-core)?\.js/); assert.doesNotMatch(home,/build\.privateReview/);
  for(const key of Object.keys(CASES)){
    const html=fs.readFileSync(`_site/case-studies/${key}/index.html`,'utf8');
    assert.match(html,new RegExp(`data-private-case-shell="${key}"`));
    assert.match(html,/Request an invitation/);assert.match(html,/noindex, nofollow/);
    const main=html.match(/<main id="main-content">([\s\S]*?)<\/main>/)[1];
    assert.doesNotMatch(main,/<(?:img|video|source|iframe|object)\b|data-private-(?:src|href)|case-journey|case-tiny-detail|exported-demo/);
    assert.doesNotMatch(html,/\/images\/case-studies\/(?:glassfiles|roast-cards|flavour-guide)\//);
    assert(!fs.existsSync(`_site/images/case-studies/${key}`));
  }
  const layout=fs.readFileSync('src/site/_includes/layouts/base.njk','utf8');assert.match(layout,/portfolio-session\.js/);
  const js=fs.readFileSync(source,'utf8')+fs.readFileSync('src/site/js/portfolio-session.js','utf8');
  assert.match(js,/data-srcset\|data-private-viewer-src\|srcdoc/,'Untrusted fragments cannot supply the hydrated-only SVG viewer source');
  assert.doesNotMatch(js,/localStorage|document\.cookie|iframe|location\.(?:assign|replace)/);
  assert.doesNotMatch(js,new RegExp(token+'|'+credential));
  console.log('PASS normal portfolio routes contain empty locked shells only; exact private-media exclusion retained');
})().catch(error=>{console.error(error);process.exitCode=1});

// Asset bytes, stale requests, and revocation are exercised independently of rendering.
(async()=>{
  let time=2000000, saved=null, pending, aborted=false, cleared=0;
  const revoked=[], requests=[], blobTypes=[];
  const client=createClient({storage:{getItem:()=>saved,setItem:(k,v)=>{saved=v},removeItem:()=>{saved=null}},now:()=>time,setTimeout:()=>1,clearTimeout:()=>{},onClear:()=>cleared++,createObjectURL:blob=>{blobTypes.push(blob.type);return 'blob:synthetic-media'},revokeObjectURL:url=>revoked.push(url),fetch:async(url,init)=>{
    requests.push({url,init});
    if(url.endsWith('/portfolio-session'))return new Response(JSON.stringify(init.method==='POST'?{ok:true,credential,expiresAt:time+10000}:{ok:true,expiresAt:time+10000,cases:[{key:'glassfiles',path:CASES.glassfiles,title:'Test case'}]}),{headers:{'Content-Type':'application/json'}});
    if(pending)return new Promise((resolve,reject)=>{pending.resolve=resolve;init.signal.addEventListener('abort',()=>{aborted=true;const error=Error();error.name='AbortError';reject(error)})});
    return new Response('abc',{headers:{'Content-Type':url.endsWith('.html')?'text/html':url.endsWith('.json')?'application/json':url.endsWith('.xlsx')?'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'image/png'}});
  }});
  await client.exchange(token);
  const media={path:'/images/case-studies/glassfiles/test.png',contentType:'image/png',size:3};
  const urls=await Promise.all([client.getAsset(media),client.getAsset(media)]);
  assert.deepEqual(urls,['blob:synthetic-media','blob:synthetic-media']);assert.equal(requests.filter(r=>r.url.endsWith('.png')).length,1,'Deduplicate authenticated asset fetches');
  await assert.rejects(()=>client.getAsset({path:'https://evil.test/pic',contentType:'image/png',size:3}));
  await assert.rejects(()=>client.getAsset({...media,path:'/images/../escape.png'}));
  await assert.rejects(()=>client.getAsset({...media,size:99999999}));
  await assert.rejects(()=>client.getAsset({...media,path:'/images/evidence.html',contentType:'text/html'}));
  await client.getAsset({...media,path:'/images/evidence.html',contentType:'text/html'},true);
  for (const [extension,contentType] of [['json','application/json'],['xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]) {
    const asset={...media,path:'/images/evidence.'+extension,contentType};
    await assert.rejects(()=>client.getAsset(asset));
    await client.getAsset(asset,true);
  }
  assert.deepEqual(blobTypes,['image/png','application/octet-stream','application/octet-stream','application/octet-stream'],'HTML, JSON and XLSX must be inert downloads, never active same-origin documents');
  pending={};const loading=client.getAsset({...media,path:'/images/pending.png'});await new Promise(resolve=>setImmediate(resolve));
  client.suspend();await assert.rejects(()=>loading);assert(aborted);assert(saved,'Page departure retains only the credential');assert.equal(revoked.length,4,'All generated blobs revoked at page departure');
  assert(!client.active());assert(cleared>0);
  // Back/forward restoration must not erase the tab credential when navigation aborts validation.
  let release;
  const restored=createClient({storage:{getItem:()=>saved,setItem:(k,v)=>{saved=v},removeItem:()=>{saved=null}},now:()=>time,setTimeout:()=>1,clearTimeout:()=>{},fetch:()=>new Promise(resolve=>{release=resolve})});
  const restoring=restored.restore();restored.suspend();release(new Response('{}',{headers:{'Content-Type':'application/json'}}));
  await assert.rejects(()=>restoring);assert(saved,'Abandoned validation must not lock the next normal page');
  console.log('PASS asset authentication, deduplication, path/type/size guards, safe downloads, abort and blob revocation');
})().catch(error=>{console.error(error);process.exitCode=1});

(async()=>{
  let stored=null, mode='ok';
  const fixture='<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>';
  const client=createClient({storage:{getItem:()=>stored,setItem:(k,v)=>{stored=v},removeItem:()=>{stored=null}},now:()=>3000000,setTimeout:()=>1,clearTimeout:()=>{},createObjectURL:()=> 'blob:fixture',revokeObjectURL:()=>{},fetch:async(url,init)=>{
    if(url.endsWith('/portfolio-session'))return new Response(JSON.stringify(init.method==='POST'?{ok:true,credential,expiresAt:3010000}:{ok:true,expiresAt:3010000,cases:[{key:'glassfiles',path:CASES.glassfiles,title:'Test case'}]}),{headers:{'Content-Type':'application/json'}});
    if(mode==='offline')throw new Error('Network failed');
    if(mode==='denied' || mode==='unauthorized')return new Response('',{status:mode==='denied'?403:401});
    if(mode==='server' || mode==='missing')return new Response('',{status:mode==='server'?500:404});
    if(mode==='wrongtype')return new Response('abc',{headers:{'Content-Type':'text/html'}});
    return new Response(mode==='svg'?fixture:'abc',{headers:{'Content-Type':mode==='svg'?'image/svg+xml':'image/png'}});
  }});
  await client.exchange(token);
  const asset={path:'/images/test.png',contentType:'image/png',size:5};
  await assert.rejects(()=>client.getAsset(asset));
  assert(client.active()&&stored,'An ordinary media size failure must retain the validated private session');
  mode='offline';await assert.rejects(()=>client.getAsset({...asset,path:'/images/offline.png'}));
  assert(client.active()&&stored,'A media transport failure must not log the visitor out');
  for(const failure of ['server','missing','wrongtype']) {mode=failure;await assert.rejects(()=>client.getAsset({...asset,path:'/images/'+failure+'.png'}));assert(client.active()&&stored,failure+' must preserve session');}
  mode='svg';const svg={path:'/images/case-studies/flavour-guide/flavour-profile-hero-ui.svg',contentType:'image/svg+xml',size:Buffer.byteLength(fixture)};
  await assert.rejects(()=>client.getAsset(svg,false),/image|type/i,'SVG must not be an active link or download');
  await assert.rejects(()=>client.getAsset(svg,false,true),/SVG|digest/i,'Even image-only SVG must match one of the audited immutable asset digests');
  assert(client.active()&&stored,'Rejected unsafe media must leave valid navigation usable');
  mode='denied';await assert.rejects(()=>client.getAsset({...asset,path:'/images/denied.png'}),error=>error.name==='PortfolioAuthError');
  assert.equal(client.active(),false);assert.equal(stored,null,'Actual authorization failure clears private session');
  mode='ok';await client.exchange(token);mode='unauthorized';await assert.rejects(()=>client.getAsset({...asset,path:'/images/401.png'}),error=>error.name==='PortfolioAuthError');assert.equal(stored,null);
  console.log('PASS media failures retain access; only401/403 revoke it; SVG requires audited digest and image-only context');
})().catch(error=>{console.error(error);process.exitCode=1});

// Real browser XML parsing is verified separately in live QA. These synthetic parsed
// trees exercise the exact post-parse namespace/element/attribute/reference policy.
{
  const {isSafeSvg}=require('../src/site/js/portfolio-session-core');
  const ns='http://www.w3.org/2000/svg';
  const element=(localName,attrs={},namespaceURI=ns)=>({localName,namespaceURI,attributes:Object.entries(attrs).map(([name,value])=>({name,value,namespaceURI:null}))});
  const tree=(children=[],rootAttrs={})=>{const root=element('svg',rootAttrs);return {documentElement:root,doctype:null,getElementsByTagName:()=>[root,...children]}};
  assert(isSafeSvg('<svg/>',()=>tree([element('defs'),element('linearGradient',{id:'gradient'}),element('rect',{width:'10',height:'10',fill:'url(#gradient)'})])));
  for(const bad of [element('script'),element('foreignObject'),element('style'),element('rect',{onload:'alert(1)'}),element('rect',{href:'https://example.test/'}),element('rect',{fill:'url(https://example.test/x)'}),element('rect',{fill:'url(#missing)'}),element('rect',{style:'fill:red'}),element('rect',{},'http://www.w3.org/1999/xhtml')])assert(!isSafeSvg('<svg/>',()=>tree([bad])));
  for(const text of ['<!DOCTYPE svg><svg/>','<!ENTITY x "bad"><svg/>','<?xml-stylesheet href="x"?><svg/>'])assert(!isSafeSvg(text,()=>tree()));
  assert(!isSafeSvg('<broken',()=>{throw Error('Malformed XML')}));
  assert(!isSafeSvg('<svg/>',()=>({documentElement:element('parsererror'),getElementsByTagName:()=>[]})));
  console.log('PASS SVG parsed-tree allowlist: namespaces, inert elements/attrs, declared local refs, and declaration rejection');
}
