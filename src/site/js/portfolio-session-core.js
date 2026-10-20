/* Only an expiring app credential is persisted. Protected content stays in memory. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PortfolioSession = factory();
}(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  var ORIGIN = 'https://jaime-employer-private-viewing.lamatesoft.chatgpt.site';
  var STORAGE_KEY = 'portfolio.privateSession.v1';
  var MAX_TTL = 8 * 60 * 60 * 1000;
  var CASES = Object.freeze({glassfiles:'/portfolio-cases/glassfiles', 'roast-cards':'/portfolio-cases/roast-cards', 'flavour-guide':'/portfolio-cases/flavour-guide'});
  function parseInvitation(hash) {
    var parts = hash.slice(1).split('&'), token = null, keep = [];
    parts.forEach(function (part) {
      if (part.split('=')[0] === 'access') {
        if (token !== null) throw new Error('Invalid invitation.');
        try { token = decodeURIComponent(part.slice(7)); } catch (_) { throw new Error('Invalid invitation.'); }
      } else if (part) keep.push(part.indexOf('anchor=') === 0 ? part.slice(7) : part);
    });
    return token === null ? null : {token:token, hash:keep.length ? '#' + keep.join('&') : ''};
  }
  function isSafeInlineStyle(style) {
    var properties = ['--journey-stops','aspect-ratio','max-width','width','left','top','height'];
    return style.split(';').every(function (declaration) {
      if (!declaration.trim()) return true;
      var parts = declaration.split(':');
      if (parts.length === 2 && parts[0].trim() === 'height' && parts[1].trim() === 'auto') return true;
      return parts.length === 2 && properties.includes(parts[0].trim()) && /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|em|rem|vh|vw)?(?:\s*\/\s*(?:\d+(?:\.\d+)?|\.\d+))?$/.test(parts[1].trim());
    });
  }
  function normalizePublicHref(value) {
    var absolute = value.match(/^https:\/\/caballe\.ro(\/(?:$|case-studies\/[a-z-]+\/$))/);
    if (absolute && absolute[0] === value) value = absolute[1];
    return value.charAt(0) === '#' || /^\/(?:$|case-studies\/[a-z-]+\/$)/.test(value) || /^mailto:hello@caballe\.ro(?:\?|$)/.test(value) ? value : null;
  }
  // Immutable, privately audited static artwork. A changed SVG needs a fresh security review.
  var SVG_DIGESTS = Object.freeze({
    '/images/case-studies/flavour-guide/flavour-profile-hero-ui.svg':'bd55db3f8b71eff0377e3b6103505a600a97af50d67713b59636dba60efd1e66',
    '/images/case-studies/flavour-guide/flavour-profile-terms-grid.svg':'aa1a9b7e656c6480c5fbff826373f7374d2b37db75d3d4d035034f3cf4128508'
  });
  function isSafeSvg(text, parseXml) {
    if (typeof text !== 'string' || /<!|<\?/.test(text)) return false;
    try {
      var doc = parseXml(text), root = doc.documentElement;
      if (!root || root.localName !== 'svg' || doc.doctype) return false;
      var tags = new Set('svg circle defs desc feDropShadow filter g line path pattern rect text title linearGradient stop'.split(' '));
      var numeric = new Set('width height x y x1 x2 y1 y2 dx dy cx cy r offset opacity stop-opacity stroke-opacity fill-opacity stroke-width font-size font-weight flood-opacity stdDeviation stroke-dasharray'.split(' '));
      var ids = new Set(), refs = [], elements = Array.from(doc.getElementsByTagName('*'));
      return elements.every(function (node) {
        if (node.namespaceURI !== 'http://www.w3.org/2000/svg' || !tags.has(node.localName)) return false;
        return Array.from(node.attributes).every(function (attr) {
          var name = attr.name, value = attr.value;
          if (name === 'xmlns') return node === root && value === 'http://www.w3.org/2000/svg';
          if (attr.namespaceURI) return false;
          if (name === 'id') {if (!/^[A-Za-z][\w-]*$/.test(value) || ids.has(value)) return false;ids.add(value);return true;}
          if (name === 'aria-labelledby') {refs.push.apply(refs,value.split(/\s+/));return true;}
          if (['fill','stroke','filter'].includes(name)) {
            var local = value.match(/^url\(#([A-Za-z][\w-]*)\)$/);
            if (local) {refs.push(local[1]);return true;}
            return /^(?:none|#[a-fA-F0-9]{3,8})$/.test(value);
          }
          if (['stop-color','flood-color'].includes(name)) return /^#[a-fA-F0-9]{3,8}$/.test(value);
          if (numeric.has(name) || name === 'viewBox') return /^[-+\d.eE,%\s]+$/.test(value);
          if (name === 'd') return /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\s-]+$/.test(value);
          if (name === 'transform') return /^(?:(?:matrix|translate|scale|rotate|skewX|skewY)\([-+\d.eE,\s]+\)\s*)+$/.test(value);
          if (name === 'font-family') return /^[A-Za-z0-9 ,'-]+$/.test(value);
          if (name === 'class') return /^[A-Za-z][A-Za-z0-9_ -]*$/.test(value);
          if (name === 'role') return value === 'img';
          if (name === 'text-anchor') return ['start','middle','end'].includes(value);
          if (name === 'stroke-linecap') return ['butt','round','square'].includes(value);
          if (name === 'patternUnits') return ['userSpaceOnUse','objectBoundingBox'].includes(value);
          return false;
        });
      }) && refs.every(function (id) {return ids.has(id);});
    } catch (_) {return false;}
  }
  function createClient(options) {
    var state = null, controller = null, generation = 0, expiryTimer;
    var blobs = new Map(), bytes = 0;
    var now = options.now || Date.now;
    var later = options.setTimeout || setTimeout, cancel = options.clearTimeout || clearTimeout;
    var makeURL = options.createObjectURL || URL.createObjectURL.bind(URL);
    var revokeURL = options.revokeObjectURL || URL.revokeObjectURL.bind(URL);
    function removeStored() { try { options.storage.removeItem(STORAGE_KEY); } catch (_) { /* Already fail closed in memory. */ } }
    function reset(remove) {
      generation++;
      if (controller) controller.abort();
      controller = null;
      cancel(expiryTimer);
      blobs.forEach(function (entry) { if (entry.url) revokeURL(entry.url); });
      blobs.clear(); bytes = 0; state = null;
      if (remove) removeStored();
      if (options.onClear) options.onClear();
    }
    function validExpiry(value) { return Number.isSafeInteger(value) && value > now() && value <= now() + MAX_TTL + 1000; }
    function validCredential(value) { return typeof value === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value) && value.length <= 1024; }
    function persist() {
      try {
        var serialized = JSON.stringify({credential:state.credential, expiresAt:state.expiresAt, welcomeShown:state.welcomeShown});
        options.storage.setItem(STORAGE_KEY, serialized);
        if (options.storage.getItem(STORAGE_KEY) !== serialized) throw new Error();
      } catch (_) { reset(true); throw new Error('Session storage is unavailable. Enable it and reopen your invitation.'); }
    }
    function active() {
      if (state && !validExpiry(state.expiresAt)) reset(true);
      return Boolean(state);
    }
    function armExpiry() {
      cancel(expiryTimer);
      expiryTimer = later(function () { reset(true); }, Math.max(0, state.expiresAt - now()));
    }
    function assertCurrent(version) {
      if (version !== generation) { var error = new Error('Request abandoned.'); error.name = 'AbortError'; throw error; }
    }
    async function request(path, init, version, isAsset) {
      try {
        if (!controller) controller = new AbortController();
        var response = await options.fetch(ORIGIN + path, Object.assign({
          method:'GET', credentials:'omit', cache:'no-store', redirect:'error', referrerPolicy:'no-referrer', signal:controller.signal
        }, init));
        assertCurrent(version);
        if (!response.ok) {
          var failure = new Error('Private work is temporarily unavailable. Please try again.');
          if (response.status === 401 || response.status === 403) {failure.name = 'PortfolioAuthError';failure.message = 'Your private session has ended. Reopen your invitation.';}
          throw failure;
        }
        if (isAsset) return response;
        if (!(response.headers.get('Content-Type') || '').toLowerCase().includes('application/json')) throw new Error('Invalid private response.');
        var text = await response.text();
        assertCurrent(version);
        if (text.length > 1024 * 1024) throw new Error('Private response is too large.');
        return JSON.parse(text);
      } catch (error) { if (generation === version && error.name === 'PortfolioAuthError') reset(true); throw error; }
    }
    async function validate() {
      if (!active()) return null;
      var version = generation;
      try {
        var data = await request('/portfolio-session', {headers:{Authorization:'Bearer ' + state.credential}}, version);
        assertCurrent(version);
        if (data.ok !== true || !validExpiry(data.expiresAt) || data.expiresAt > state.expiresAt + 1000 || !Array.isArray(data.cases) || !data.cases.length || data.cases.length > 3) throw new Error('Invalid private session.');
        var seen = new Set();
        var cases = data.cases.map(function (entry) {
          if (!entry || !Object.prototype.hasOwnProperty.call(CASES,entry.key) || entry.path !== CASES[entry.key] || seen.has(entry.key) || typeof entry.title !== 'string' || entry.title.length > 150) throw new Error('Invalid private case.');
          var publicPath = '/case-studies/' + entry.key + '/';
          if (entry.publicPath && entry.publicPath !== publicPath) throw new Error('Invalid private destination.');
          seen.add(entry.key);
          return {key:entry.key,path:entry.path,title:entry.title,publicPath:publicPath};
        });
        state.expiresAt = Math.min(state.expiresAt, data.expiresAt);
        state.cases = cases;
        persist(); armExpiry();
        return {expiresAt:state.expiresAt,cases:cases};
      } catch (error) { if (generation === version) reset(error.name === 'PortfolioAuthError'); throw error; }
    }
    async function exchange(token) {
      reset(true);
      var version = generation;
      try {
        if (typeof token !== 'string' || !token || token.length > 2048) throw new Error('Invalid invitation.');
        var data = await request('/portfolio-session', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({token:token})}, version);
        token = null;
        assertCurrent(version);
        if (data.ok !== true || !validCredential(data.credential) || !validExpiry(data.expiresAt)) throw new Error('Invalid private session.');
        state = {credential:data.credential,expiresAt:data.expiresAt,welcomeShown:false};
        persist(); armExpiry();
        return await validate();
      } catch (error) { if (generation === version) reset(error.name === 'PortfolioAuthError'); throw error; }
    }
    async function restore() {
      reset(false);
      var saved;
      try { saved = options.storage.getItem(STORAGE_KEY); }
      catch (_) { throw new Error('Session storage is unavailable. Enable it and reopen your invitation.'); }
      if (!saved) return null;
      try {
        var record = JSON.parse(saved);
        if (!record || !validCredential(record.credential) || !validExpiry(record.expiresAt)) { reset(true); return null; }
        state = {credential:record.credential,expiresAt:record.expiresAt,welcomeShown:record.welcomeShown === true};
        armExpiry();
        return await validate();
      } catch (error) { if (error.name !== 'AbortError') reset(error.name === 'PortfolioAuthError'); throw error; }
    }
    async function getCase(key) {
      if (!active() || !state.cases.some(function (entry) {return entry.key === key;})) throw new Error('This case requires a current invitation.');
      var version = generation;
      return request(CASES[key], {headers:{Authorization:'Bearer ' + state.credential}}, version);
    }
    async function getAsset(asset, download, imageOnly) {
      if (!active()) throw new Error('Your private session has ended.');
      if (!asset || typeof asset.path !== 'string' || !/^\/images\/[A-Za-z0-9_./-]+$/.test(asset.path) || asset.path.includes('..') || asset.path.includes('//') || !Number.isSafeInteger(asset.size) || asset.size < 1 || asset.size > 2.5 * 1024 * 1024) throw new Error('Invalid private asset.');
      var type = asset.contentType.toLowerCase().split(';')[0];
      var svg = type === 'image/svg+xml';
      if (svg && (download || !imageOnly || !SVG_DIGESTS[asset.path])) throw new Error('SVG requires an approved image-only context.');
      var mediaType = svg || /^(image\/(png|jpeg|webp|gif|avif)|video\/mp4)$/.test(type);
      var downloadType = ['text/html','application/json','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/octet-stream'].includes(type);
      if (!mediaType && !(download && downloadType)) throw new Error('Invalid private media type.');
      var key = asset.path + (download ? ':download' : ':media');
      if (blobs.has(key)) return blobs.get(key).promise;
      var version = generation, entry = {};
      entry.promise = (async function () {
        try {
          var response = await request(asset.path, {headers:{Authorization:'Bearer ' + state.credential}}, version, true);
          var actualType = (response.headers.get('Content-Type') || '').toLowerCase().split(';')[0];
          if (actualType !== type && !(download && actualType === 'application/octet-stream')) throw new Error('Private asset type changed.');
          var blob = await response.blob();
          assertCurrent(version);
          if (!active() || blob.size !== asset.size || bytes + blob.size > 11 * 1024 * 1024) throw new Error('Private asset size changed.');
          if (svg) {
            var hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))).map(function (value) {return value.toString(16).padStart(2,'0');}).join('');
            if (hash !== SVG_DIGESTS[asset.path]) throw new Error('SVG digest does not match the audited artwork.');
            var parseXml = options.parseSvg || function (text) {return new DOMParser().parseFromString(text,'image/svg+xml');};
            if (!isSafeSvg(await blob.text(),parseXml)) throw new Error('SVG is not safe static artwork.');
            assertCurrent(version);
            if (!active()) throw new Error('Your private session has ended.');
          }
          bytes += blob.size;
          entry.url = makeURL(download ? new Blob([blob], {type:'application/octet-stream'}) : blob);
          return entry.url;
        } catch (error) { if (generation === version) blobs.delete(key); throw error; }
      }());
      blobs.set(key,entry);
      return entry.promise;
    }
    return {
      exchange:exchange, restore:restore, validate:validate, active:active, getCase:getCase, getAsset:getAsset,
      lock:function () {reset(true);}, suspend:function () {reset(false);},
      takeWelcome:function () {if (!active() || state.welcomeShown) return false;state.welcomeShown = true;persist();return true;}
    };
  }
  return {isSafeSvg:isSafeSvg,isSafeInlineStyle:isSafeInlineStyle,normalizePublicHref:normalizePublicHref,createClient:createClient,parseInvitation:parseInvitation,CASES:CASES,STORAGE_KEY:STORAGE_KEY,ORIGIN:ORIGIN};
}));
