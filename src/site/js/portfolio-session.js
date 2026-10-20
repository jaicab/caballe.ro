/* Normal-page enhancement. Authorization and media always come from the private gateway. */
(function () {
  'use strict';
  var api = window.PortfolioSession;
  if (!api || !window.fetch || !window.AbortController) return;
  var main = document.getElementById('main-content');
  var shellKey = document.body.dataset.privateCaseShell;
  var original = {html:shellKey ? main.innerHTML : null, title:document.title, style:document.body.getAttribute('style'), light:document.documentElement.dataset.pageLight, dark:document.documentElement.dataset.pageDark};
  var controls = document.querySelector('[data-private-session-controls]');
  var notice = document.querySelector('[data-private-session-notice]');
  var welcome = document.querySelector('[data-private-welcome]');
  var originalLinks = [], run = 0, returnFocus;
  var requestLink = document.querySelector('[data-private-request]');
  if (requestLink) originalLinks.push({node:requestLink,href:requestLink.getAttribute('href'),text:requestLink.textContent});
  function message(text) {
    notice.textContent = text; notice.hidden = !text;
    var status = document.querySelector('[data-private-shell-status]');
    if (status) status.textContent = text || 'Open your invitation link to view this case study.';
  }
  function clearProtected() {
    run++;
    if (welcome.open) welcome.close();
    controls.hidden = true;
    controls.querySelector('[data-private-projects]').replaceChildren();
    document.querySelectorAll('[data-session-added]').forEach(function (node) { node.remove(); });
    originalLinks.forEach(function (link) {link.node.setAttribute('href',link.href);link.node.textContent = link.text;});
    if (shellKey) {
      if (window.clearPortfolioMedia) window.clearPortfolioMedia(main);
      main.querySelectorAll('video').forEach(function (video) {video.pause();video.removeAttribute('src');video.querySelectorAll('source').forEach(function (source) {source.removeAttribute('src');});video.load();});
      main.innerHTML = original.html;
      document.title = original.title;
      if (original.style === null) document.body.removeAttribute('style'); else document.body.setAttribute('style',original.style);
      document.documentElement.dataset.pageLight = original.light;
      document.documentElement.dataset.pageDark = original.dark;
      var label = document.querySelector('[data-private-case-label]');
      if (label) label.textContent = 'CASE STUDY: Private case study';
      var viewer = document.querySelector('.image-dialog');
      if (viewer && viewer.open) viewer.close();
      if (viewer) {viewer.querySelector('img').removeAttribute('src');viewer.querySelector('figcaption').textContent = '';}
      window.loadTheme();
    }
    document.documentElement.removeAttribute('data-private-access');
  }
  var storage;
  try { storage = window.sessionStorage; } catch (_) { storage = {getItem:function () {throw new Error();},setItem:function () {throw new Error();},removeItem:function () {}}; }
  var client = api.createClient({fetch:window.fetch.bind(window),storage:storage,onClear:clearProtected});
  function showWelcome() {
    if (!client.active() || welcome.open) return;
    returnFocus = document.activeElement;
    if (typeof welcome.showModal === 'function') welcome.showModal(); else welcome.setAttribute('open','');
  }
  welcome.querySelector('[data-private-continue]').addEventListener('click', function () {if (welcome.close) welcome.close(); else welcome.removeAttribute('open');});
  welcome.addEventListener('click',function (event) {if (event.target === welcome) welcome.close();});
  welcome.addEventListener('close',function () {if (returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll:true});});
  document.querySelector('[data-private-replay]').addEventListener('click',showWelcome);
  document.querySelector('[data-private-lock]').addEventListener('click',function () {client.lock();message('Private access is locked. Reopen your invitation to continue.');});
  function revealLinks(session) {
    var projects = controls.querySelector('[data-private-projects]');
    session.cases.forEach(function (entry) {
      var link = document.createElement('a'); link.href = entry.publicPath; link.textContent = entry.title;
      if (shellKey === entry.key) link.setAttribute('aria-current','page');
      projects.appendChild(link);
      if (requestLink && requestLink.dataset.privateRequest === entry.key) {requestLink.href = entry.publicPath;requestLink.textContent = 'Inside the toolkit';}
      var more = document.querySelector('[data-private-more-work]');
      if (more && entry.key !== 'glassfiles') {
        var item = document.createElement('a');item.href = entry.publicPath;item.textContent = entry.title;item.dataset.sessionAdded = '';
        var label = document.createElement('span');label.textContent = 'Private case study';item.appendChild(label);more.appendChild(item);
      }
    });
    controls.hidden = false;
    controls.querySelector('[data-private-expiry]').textContent = 'Available in this tab until ' + new Date(session.expiresAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) + '.';
    document.documentElement.dataset.privateAccess = 'granted';
  }
  function validateFragment(data) {
    if (!data || data.key !== shellKey || typeof data.title !== 'string' || data.title.length > 150 || typeof data.html !== 'string' || data.html.length > 1024 * 1024 || !Array.isArray(data.assets) || data.assets.length > 100) throw new Error('Invalid private case.');
    ['light','dark','ink','focusLight','focusDark'].forEach(function (key) {if (!data.theme || !/^#[a-f0-9]{6}$/i.test(data.theme[key])) throw new Error('Invalid private palette.');});
    var manifest = new Map();
    data.assets.forEach(function (asset) {if (!asset || manifest.has(asset.path)) throw new Error('Invalid private manifest.');manifest.set(asset.path,asset);});
    // A template is inert: remote resources are not mounted or requested during inspection.
    var template = document.createElement('template');template.innerHTML = data.html;
    var permitted = new Set('A ARTICLE ASIDE B BR BUTTON CAPTION CODE COL COLGROUP DD DETAILS DIV DL DT EM FIGCAPTION FIGURE H1 H2 H3 H4 H5 H6 HEADER HR I IMG LI MAIN NAV OL P PICTURE PRE SECTION SMALL SOURCE SPAN STRONG SUB SUMMARY SUP TABLE TBODY TD TH THEAD TIME TR UL VIDEO'.split(' '));
    var jobs = [];
    template.content.querySelectorAll('*').forEach(function (node) {
      if (!permitted.has(node.tagName)) throw new Error('Unsupported private element.');
      Array.from(node.attributes).forEach(function (attribute) {
        var name = attribute.name, value = attribute.value;
        if (/^on/i.test(name) || /^(src|srcset|poster|data-src|data-srcset|data-private-viewer-src|srcdoc|action|formaction|ping|background|autofocus)$/i.test(name)) throw new Error('Active private resource rejected.');
        if (name === 'style' && !api.isSafeInlineStyle(value)) throw new Error('Active private style rejected.');
        if (name === 'href') {
          var href = api.normalizePublicHref(value);
          if (href === null) throw new Error('Unexpected private link.');
          node.setAttribute('href',href);
        }
      });
      if (node.hasAttribute('data-private-case')) {
        var path = node.getAttribute('data-private-case');
        var key = Object.keys(api.CASES).find(function (key) {return api.CASES[key] === path;});
        if (!key || node.tagName !== 'A') throw new Error('Unknown private case link.');
        node.href = '/case-studies/' + key + '/';node.removeAttribute('data-private-case');
      }
      var attrs = {'data-private-src':'src','data-private-data-src':'src','data-private-poster':'poster','data-private-srcset':'srcset','data-private-data-srcset':'srcset','data-private-href':'href'};
      Object.keys(attrs).forEach(function (name) {
        if (!node.hasAttribute(name)) return;
        var target = attrs[name], value = node.getAttribute(name), download = node.hasAttribute('data-private-download');
        if ((target === 'href' && node.tagName !== 'A') || (target === 'poster' && node.tagName !== 'VIDEO') || (target === 'src' && !['IMG','VIDEO','SOURCE'].includes(node.tagName)) || (target === 'srcset' && !['IMG','SOURCE'].includes(node.tagName))) throw new Error('Invalid private resource target.');
        var linkedAsset = target === 'href' ? manifest.get(value) : null;
        if (linkedAsset && ['application/json','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(linkedAsset.contentType.toLowerCase().split(';')[0])) {
          var filename = value.split('/').pop();
          if (node.tagName !== 'A' || !/^[A-Za-z0-9_.-]+$/.test(filename)) throw new Error('Invalid private download.');
          download = true;node.setAttribute('download',filename);node.setAttribute('data-private-download','');
        }
        if (download && (target !== 'href' || !node.hasAttribute('download') || !/^[\w.-]+$/.test(node.getAttribute('download')))) throw new Error('Invalid private download.');
        var entries = target === 'srcset' ? value.split(',').map(function (entry) {var bits=entry.trim().split(/\s+/);if(bits.length > 2 || (bits[1] && !/^\d+(?:\.\d+)?[wx]$/.test(bits[1]))) throw new Error('Invalid private image set.');return {path:bits[0],descriptor:bits[1] || ''};}) : [{path:value,descriptor:''}];
        jobs.push(async function () {
          try {
          var imageOnly = (node.tagName === 'IMG' && ['src','srcset'].includes(target)) || (node.tagName === 'SOURCE' && node.parentElement && node.parentElement.tagName === 'PICTURE' && ['src','srcset'].includes(target));
          var svgViewer = target === 'href' && node.hasAttribute('data-image-viewer') && entries.length === 1 && manifest.get(entries[0].path) && manifest.get(entries[0].path).contentType === 'image/svg+xml';
          var urls = await Promise.all(entries.map(async function (entry) {
            var asset = manifest.get(entry.path);
            if (!asset) throw new Error('Private resource is not approved.');
            if (target !== 'href' && !/^(image\/|video\/)/.test(asset.contentType)) throw new Error('Unsafe private media.');
            return (await client.getAsset(asset,download,imageOnly || svgViewer)) + (entry.descriptor ? ' '+entry.descriptor : '');
          }));
          if (svgViewer) {
            // A lightbox image source is not a navigable SVG document, even with modifier clicks.
            node.setAttribute('href','#');node.setAttribute('data-private-viewer-src',urls[0]);node.removeAttribute('target');
          } else node.setAttribute(target,urls.join(', '));
          node.removeAttribute(name);
          if (download) {node.removeAttribute('target');node.setAttribute('rel','noopener');}
          } catch (error) {
            if (error.name === 'PortfolioAuthError' || error.name === 'AbortError' || !client.active()) throw error;
            node.removeAttribute(name);
            if (node.tagName === 'A') {node.removeAttribute('href');node.removeAttribute('data-image-viewer');node.setAttribute('aria-disabled','true');}
            var video = node.closest('video');
            var container = node.closest('figure') || (video ? video.parentElement : node.parentElement) || template.content;
            if (!container.querySelector('[data-private-media-error]')) {
              var fallback = document.createElement('p');fallback.className = 'private-session-notice';fallback.setAttribute('data-private-media-error','');fallback.setAttribute('role','status');
              fallback.textContent = 'This media could not load. You can keep reading and explore the other projects, or reload to try again.';container.appendChild(fallback);
            }
          }
        });
      });
    });
    return {template:template,jobs:jobs};
  }
  async function loadCase(version) {
    message('Loading your private case study…');
    var data = await client.getCase(shellKey);
    if (version !== run) return;
    var fragment = validateFragment(data), index = 0;
    // Bounded parallelism avoids launching dozens of authenticated media requests at once.
    await Promise.all(Array.from({length:Math.min(4,fragment.jobs.length)},async function () {while(index < fragment.jobs.length) await fragment.jobs[index++]();}));
    if (version !== run || !client.active()) return;
    main.replaceChildren(fragment.template.content);
    document.title = data.title + ' | Jaime Caballero - Product Designer';
    var palette = {light:'--case-light',dark:'--case-dark',ink:'--case-ink',focusLight:'--case-focus-light',focusDark:'--case-focus-dark'};
    Object.keys(palette).forEach(function (key) {document.body.style.setProperty(palette[key],data.theme[key]);});
    document.body.style.setProperty('--color-bg',data.theme.light);
    document.documentElement.dataset.pageLight = data.theme.light;document.documentElement.dataset.pageDark = data.theme.dark;
    var label = document.querySelector('[data-private-case-label]');if(label)label.textContent = 'CASE STUDY: ' + data.title;
    window.loadTheme();
    if (window.enhancePortfolio) window.enhancePortfolio(main);
    main.querySelectorAll('video').forEach(function (video) {video.load();});
    message('');
    if (window.location.hash) {
      var target;try {target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));} catch (_) { /* Preserve an unknown ordinary fragment. */ }
      if (target) {if (target.tagName === 'DETAILS') target.open = true;target.scrollIntoView();}
    }
  }
  async function start(invitation) {
    var session;
    try {
      session = invitation ? await client.exchange(invitation.token) : await client.restore();
      if (invitation) invitation.token = null;
      if (!session) {message('');return;}
      var version = run;
      revealLinks(session);
      if (shellKey) await loadCase(version);
      if (version !== run || !client.active()) return;
      message('');
      if (client.takeWelcome()) showWelcome();
    } catch (error) {
      if (invitation) invitation.token = null;
      if (error.name === 'AbortError') return;
      if (error.name === 'PortfolioAuthError') client.lock();
      if (invitation || shellKey || session) {
        if (session && client.active()) message('This case could not load. Your private access is still available: try another project or reload this page.');
        else message(error.message.indexOf('storage') >= 0 ? 'This browser is blocking session storage. Enable it and reopen your invitation.' : error.name === 'PortfolioAuthError' ? 'Private access has ended. Reopen your invitation or request a new one.' : 'Private access could not be checked just now. Reload to try again.');
      }
    }
  }
  var invitation;
  try {
    invitation = api.parseInvitation(window.location.hash);
    if (invitation) window.history.replaceState(window.history.state,'',window.location.pathname + window.location.search + invitation.hash);
  } catch (_) {
    try { window.history.replaceState(window.history.state,'',window.location.pathname + window.location.search); } catch (_) { /* Do not exchange an invitation that cannot be removed from the address bar. */ }
    client.lock();message('This invitation could not be opened. Please request a new one.');return;
  }
  window.addEventListener('pagehide',function () {client.suspend();});
  window.addEventListener('pageshow',function (event) {if (event.persisted) start(null);});
  document.addEventListener('visibilitychange',function () {if (document.visibilityState === 'visible') client.active();});
  start(invitation);
}());
