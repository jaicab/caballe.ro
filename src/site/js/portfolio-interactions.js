/* Progressive enhancement: all content and source-image links work without JS. */
(function () {
  'use strict';
  var dialog = document.querySelector('.image-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    var returnTo;
    document.querySelectorAll('[data-image-viewer]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        var source = link.querySelector('img');
        var caption = link.dataset.caption || (source && source.alt) || 'Project image';
        dialog.querySelector('img').src = link.href;
        dialog.querySelector('img').alt = caption;
        dialog.querySelector('figcaption').textContent = caption;
        returnTo = link;
        dialog.showModal();
      });
    });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { if (returnTo) returnTo.focus(); });
  }
  document.querySelectorAll('.decision-viewer').forEach(function (viewer) {
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
  document.querySelectorAll('.case-chapters a[href="#decisions"]').forEach(function (link) {
    link.addEventListener('click', function () { var details = document.getElementById('decisions'); if (details) details.open = true; });
  });
}());
