/* A settled page with a brief content entrance. Navigation is never intercepted. */
(function () {
  'use strict';
  var root = document.documentElement;
  function clear() { delete root.dataset.projectArrival; }
  addEventListener('pagereveal', function () {
    clear();
    var activation = window.navigation && window.navigation.activation;
    if (!activation || activation.navigationType === 'traverse' || !activation.from || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      var from = new URL(activation.from.url), to = new URL(location.href);
      if (from.origin !== to.origin || from.pathname !== '/' || to.pathname !== '/case-studies/caballeros/') return;
      root.dataset.projectArrival = 'active';
    } catch (_) { /* A direct visit or unsupported browser stays fully visible. */ }
  });
  addEventListener('pageswap', clear);
  document.addEventListener('animationend', function (event) {
    if (event.animationName === 'project-image-arrive') clear();
  });
}());
