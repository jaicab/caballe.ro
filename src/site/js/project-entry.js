/* Native navigation owns history, loading, cancellation and keyboard activation. */
(function () {
  'use strict';
  var root = document.documentElement;
  var serial = 0;
  function isEntry(from, to) {
    try {
      var source = new URL(from), target = new URL(to);
      return source.origin === location.origin && target.origin === location.origin &&
        source.pathname === '/' && target.pathname === '/case-studies/caballeros/';
    } catch (_) { return false; }
  }
  function prepare(event, from, to, outgoing) {
    var transition = event.viewTransition;
    if (!transition) return;
    var surface = document.querySelector('[data-project-entry-surface]');
    if (!surface || !isEntry(from, to) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.skipTransition();
      return;
    }
    var token = ++serial;
    surface.style.viewTransitionName = 'project-surface';
    root.dataset.projectEntry = 'active';
    function clear() {
      if (token !== serial) return;
      surface.style.removeProperty('view-transition-name');
      delete root.dataset.projectEntry;
    }
    /* Outgoing names must be cleared after capture for back/forward cache reuse. */
    var complete = outgoing ? transition.ready : transition.finished;
    complete.then(clear, clear);
  }
  addEventListener('pageswap', function (event) {
    var activation = event.activation;
    prepare(event, location.href, activation && activation.entry && activation.entry.url, true);
  });
  addEventListener('pagereveal', function (event) {
    var activation = window.navigation && window.navigation.activation;
    prepare(event, activation && activation.from && activation.from.url, location.href, false);
  });
}());
