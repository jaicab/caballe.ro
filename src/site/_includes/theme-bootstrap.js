/* Resolve this document's palette before styles/content can paint. No navigation interception. */
(function () {
  'use strict';
  var root = document.documentElement;
  var system = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var preference = null;

  function readPreference() {
    try {
      var stored = window.sessionStorage.getItem('theme');
      return stored === 'true' ? 'light' : stored === 'false' ? 'dark' : null;
    } catch (_) { return preference; }
  }

  function applyTheme() {
    var theme = preference || (system && system.matches ? 'dark' : 'light');
    var color = theme === 'dark' ? root.dataset.pageDark : root.dataset.pageLight;
    root.dataset.theme = theme;
    root.style.backgroundColor = color;
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
    if (document.body) document.body.classList.toggle('u-dark', theme === 'dark');
    var toggle = document.getElementById('lightSwitch');
    if (toggle) toggle.checked = theme === 'light';
  }

  window.loadTheme = function () {
    preference = readPreference();
    applyTheme();
  };
  window.switchTheme = function (toggle) {
    preference = toggle.checked ? 'light' : 'dark';
    try { window.sessionStorage.setItem('theme', String(toggle.checked)); } catch (_) { /* The current page still responds when storage is unavailable. */ }
    if (document.body) document.body.classList.add('is-transitioning');
    applyTheme();
  };

  window.loadTheme();
  var navigationEntry = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType('navigation')[0];
  if ((window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      (navigationEntry && navigationEntry.type === 'back_forward') || window.location.hash) {
    root.dataset.pageEntry = 'skip';
  }
  // Store settled content in the back/forward cache, without changing scroll or history.
  window.addEventListener('pagehide', function () { root.dataset.pageEntry = 'skip'; });
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) root.dataset.pageEntry = 'skip';
    if (document.body) document.body.classList.remove('is-transitioning');
    window.loadTheme();
  });
  document.addEventListener('DOMContentLoaded', window.loadTheme);
  if (system && system.addEventListener) system.addEventListener('change', window.loadTheme);
}());
