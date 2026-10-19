(function () {
  'use strict';

  const MAX_LENGTH = 300;
  const INITIAL_DRAFT = 'Our new oat latte is literally the best coffee in the city!!! Come get yours today and transform your morning. ☕ #Coffee #BestCoffee #MustTry';
  const ALTERNATE_DRAFT = 'A little oat, a lot of comfort. Our oat latte is ready when you are. Pop by for a slower start to your morning. ☕';

  function isValidDraft(text) {
    return typeof text === 'string' && text.trim().length > 0 && text.length <= MAX_LENGTH;
  }

  function createState(text) {
    return { draft: typeof text === 'string' ? text : INITIAL_DRAFT, comparedDraft: null, reviewed: false };
  }

  function editDraft(state, text) {
    // Even reverting an edit requires a fresh comparison and review.
    return createState(text);
  }

  function compareDraft(state) {
    return { draft: state.draft, comparedDraft: isValidDraft(state.draft) ? state.draft : null, reviewed: false };
  }

  function reviewDraft(state, checked) {
    return {
      draft: state.draft,
      comparedDraft: state.comparedDraft,
      reviewed: Boolean(checked && isValidDraft(state.draft) && state.comparedDraft === state.draft)
    };
  }

  function canDownload(state) {
    return Boolean(state.reviewed && isValidDraft(state.draft) && state.comparedDraft === state.draft);
  }

  function exportText(state) {
    if (!canDownload(state)) throw new Error('Compare and review the current draft before downloading.');
    return 'Interactive example · invented sample content\n\n' +
      'A fictional coffee caption edited in a portfolio interaction. No AI service was used.\n\n' +
      state.draft.trim() + '\n';
  }

  function mount(root) {
    if (root.dataset.workflowReady) return;
    const query = name => root.querySelector('[data-workflow-' + name + ']');
    const input = query('input');
    const compareButton = query('compare');
    const sampleButton = query('sample');
    const resetButton = query('reset');
    const downloadButton = query('download');
    const reviewCheckbox = query('reviewed');
    const comparison = query('comparison');
    const placeholder = query('placeholder');
    const original = query('original');
    const revised = query('revised');
    const count = query('count');
    const status = query('status');
    const downloadHelp = query('download-help');
    const previewTitle = root.querySelector('#workflow-preview-title');
    const doc = root.ownerDocument;
    const view = doc.defaultView;
    if (![input, compareButton, sampleButton, resetButton, downloadButton, reviewCheckbox,
      comparison, placeholder, original, revised, count, status, downloadHelp, previewTitle].every(Boolean)) return;

    let state = createState(input.value);
    const supportsDownload = Boolean(view && view.Blob && view.URL &&
      typeof view.URL.createObjectURL === 'function' && typeof view.URL.revokeObjectURL === 'function');

    function announce(message) {
      // Do not make a screen reader repeat an unchanged message on each keystroke.
      if (status.textContent !== message) status.textContent = message;
    }

    function render(message) {
      const valid = isValidDraft(state.draft);
      const compared = valid && state.comparedDraft === state.draft;
      const phase = canDownload(state) ? 'reviewed' : compared ? 'compare' : 'draft';
      root.dataset.state = phase;
      root.querySelectorAll('[data-workflow-step]').forEach(step => {
        if (step.dataset.workflowStep === phase) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      count.textContent = state.draft.length + ' / ' + MAX_LENGTH + ' characters';
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      compareButton.disabled = !valid;
      compareButton.setAttribute('aria-expanded', compared ? 'true' : 'false');
      comparison.hidden = !compared;
      placeholder.hidden = compared;
      original.textContent = INITIAL_DRAFT;
      revised.textContent = compared ? state.comparedDraft : '';
      reviewCheckbox.disabled = !compared;
      reviewCheckbox.checked = state.reviewed;
      downloadButton.disabled = !supportsDownload || !canDownload(state);
      if (!supportsDownload) {
        downloadHelp.textContent = 'This browser cannot create the text download. You can still edit, compare and select your version to copy it.';
      } else if (canDownload(state)) {
        downloadHelp.textContent = 'Ready when you are. Download saves a text file with the invented-example label. Editing will require another review.';
      } else {
        downloadHelp.textContent = 'Compare your version, then check the review box to enable download. Any edit will ask you to review again.';
      }
      if (message) announce(message);
    }

    input.addEventListener('input', function () {
      state = editDraft(state, input.value);
      render(!isValidDraft(state.draft)
        ? (state.draft.trim() ? 'Keep your version within 300 characters before comparing.' : 'Add a few words before comparing your version.')
        : 'Draft changed. Compare and review this version before downloading.');
    });

    compareButton.addEventListener('click', function () {
      state = compareDraft(state);
      if (state.comparedDraft === null) {
        render('Add a caption of 300 characters or fewer before comparing.');
        input.focus();
        return;
      }
      render('Compare the starting draft with your version. Read it through, then check the review box.');
      previewTitle.focus();
    });

    reviewCheckbox.addEventListener('change', function () {
      state = reviewDraft(state, reviewCheckbox.checked);
      render(state.reviewed
        ? (supportsDownload ? 'Reviewed. Your version is ready to download.' : 'Reviewed. You can select and copy your version.')
        : 'Review unchecked. Check the box when you are happy with this version.');
    });

    sampleButton.addEventListener('click', function () {
      state = editDraft(state, ALTERNATE_DRAFT);
      input.value = state.draft;
      render('Prewritten example loaded. Make it yours, then compare and review it.');
      input.focus();
    });

    resetButton.addEventListener('click', function () {
      state = createState();
      input.value = state.draft;
      render('Starting draft restored. All previous review choices have been cleared.');
      input.focus();
    });

    downloadButton.addEventListener('click', function () {
      if (!supportsDownload || !canDownload(state)) return;
      let objectUrl;
      let link;
      try {
        objectUrl = view.URL.createObjectURL(new view.Blob([exportText(state)], { type: 'text/plain;charset=utf-8' }));
        link = doc.createElement('a');
        link.href = objectUrl;
        link.download = 'invented-coffee-caption.txt';
        link.hidden = true;
        doc.body.appendChild(link);
        link.click();
        announce('Download requested. Your reviewed version is still here.');
      } catch (error) {
        announce('The download could not start. Your version is still here; you can select and copy it instead.');
      } finally {
        if (link) link.remove();
        // Release the temporary file after the browser has accepted the click.
        if (objectUrl) view.setTimeout(function () { view.URL.revokeObjectURL(objectUrl); }, 1000);
      }
    });

    input.disabled = false;
    sampleButton.disabled = false;
    resetButton.disabled = false;
    root.dataset.workflowReady = 'true';
    render('Make it yours, then compare. Nothing leaves this page until you download it.');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAX_LENGTH, INITIAL_DRAFT, ALTERNATE_DRAFT, isValidDraft,
      createState, editDraft, compareDraft, reviewDraft, canDownload, exportText, mount };
  }

  if (typeof document !== 'undefined') {
    const initialize = function () {
      document.querySelectorAll('[data-workflow-demo]').forEach(mount);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
    else initialize();
  }
}());
