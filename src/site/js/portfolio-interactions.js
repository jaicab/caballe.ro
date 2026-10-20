/* Progressive enhancement for public pages and authenticated, in-memory case fragments. */
(function () {
  'use strict';
  var dialog = document.querySelector('.image-dialog');
  var enhanced = new WeakSet(), returnTo;
  var observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {if (!entry.isIntersecting) entry.target.pause();});
  }, {threshold:0.1}) : null;
  function enhancePortfolio(root) {
    if (dialog && typeof dialog.showModal === 'function') {
      root.querySelectorAll('[data-image-viewer]').forEach(function (link) {
        if (enhanced.has(link)) return;
        enhanced.add(link);
        link.addEventListener('click', function (event) {
          var imageOnlySource = link.dataset.privateViewerSrc;
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {if (imageOnlySource) event.preventDefault();return;}
          event.preventDefault();
          var source = link.querySelector('img');
          var caption = link.dataset.caption || (source && source.alt) || 'Project image';
          dialog.querySelector('img').src = imageOnlySource || link.href;
          dialog.querySelector('img').alt = caption;
          dialog.querySelector('figcaption').textContent = caption;
          returnTo = link;
          if (!dialog.open) dialog.showModal();
        });
        link.addEventListener('auxclick', function (event) {if (link.dataset.privateViewerSrc) event.preventDefault();});
      });
    }
    root.querySelectorAll('.decision-viewer').forEach(function (viewer) {
      if (enhanced.has(viewer)) return;
      enhanced.add(viewer);
      var controls = viewer.querySelector('.decision-controls');
      if (!controls) return;
      controls.hidden = false;
      controls.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function () {
          var mode = button.dataset.decisionView;
          viewer.dataset.view = mode;
          controls.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
          viewer.querySelectorAll('[data-decision-panel]').forEach(function (panel) { panel.hidden = mode !== 'both' && panel.dataset.decisionPanel !== mode; });
        });
      });
    });
    root.querySelectorAll('.case-chapters a[href="#decisions"]').forEach(function (link) {
      if (enhanced.has(link)) return;
      enhanced.add(link);
      link.addEventListener('click', function () { var details = document.getElementById('decisions'); if (details) details.open = true; });
    });
    if (observer) root.querySelectorAll('video').forEach(function (video) {observer.observe(video);});
  }
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { if (returnTo) returnTo.focus(); returnTo = null; });
  }
  if (typeof window !== 'undefined') {
    window.enhancePortfolio = enhancePortfolio;
    window.clearPortfolioMedia = function (root) {
      if (observer) root.querySelectorAll('video').forEach(function (video) {observer.unobserve(video);});
      returnTo = null;
    };
  }
  enhancePortfolio(document);
}());
