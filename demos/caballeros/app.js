'use strict';

// Frontend-only adaptation. All answers live in this closure and vanish on reload.
const app = document.querySelector('#app');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let envelopeStopped = false;
const sample = Object.freeze({
  attendance: 'yes',
  name: 'Alex Demo',
  dish: 'Crispy potatoes with lemon',
  story: 'A fictional Sunday lunch with friends, passing bowls around the table.',
  version: 'Golden edges, a soft centre, and plenty of lemon.'
});
let answers = {
    ...sample
  },
  step = 'welcome',
  error = '';
const order = ['attendance', 'name', 'dish', 'story', 'version', 'review'];
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
const btn = (action, label, primary = false) => `<button type="button" data-action="${action}" class="${primary ? 'primary' : 'text-action'}">${label}</button>`;
function render(focus = true) {
  const showEnvelopeMotion = !motionPreference.matches && !envelopeStopped;
  const finished = step === 'confirmed' || step === 'declined';
  let content = '';
  if (step === 'welcome') content = `<section class="demo-home"><p class="edition">The imaginary table</p><h1 tabindex="-1">A note to<br>the kitchen.</h1>${showEnvelopeMotion ? '<img class="demo-envelope" src="./assets/envelope-opening-transparent.webp" alt="An illustrated invitation opening">' + btn('stop-animation', 'Stop invitation animation') : '<img class="demo-envelope" src="./assets/wordmark.png" alt="Caballero’s invitation">'}<p class="hint">Our dinner starts with a little memory.</p><p class="invitation-dates"><span>A fictional supper · Saturday evening</span><span>Sample guest: Alex Demo · no real booking</span></p><div class="demo-actions">${btn('start', 'Try the RSVP demo', true)}</div><p class="hint">A few words are enough.</p></section>`;else if (finished) content = `<section><p class="edition">The imaginary table</p><h2 tabindex="-1">${step === 'confirmed' ? `You’re on the imaginary list, ${escape(answers.name)}.` : 'Maybe another imaginary evening.'}</h2><p class="hint">${step === 'confirmed' ? 'Your fictional RSVP is complete in this tab.' : 'Your fictional decline is complete in this tab.'} Nothing was sent. No booking or guest record was created.</p><div class="demo-actions">${btn('restart', 'Try again', true)}</div></section>`;else {
    let field = '';
    let title = '';
    let hint = '';
    if (step === 'attendance') {
      title = 'Will you join our imaginary table?';
      hint = 'Choose either route to explore this demo.';
      field = `<label class="demo-choice"><input type="radio" name="attendance" value="yes" ${answers.attendance === 'yes' ? 'checked' : ''}>I’d love to join</label><label class="demo-choice"><input type="radio" name="attendance" value="no" ${answers.attendance === 'no' ? 'checked' : ''}>Not this time</label>`;
    }
    if (step === 'name') {
      title = 'What shall we call you?';
      hint = 'Alex Demo is a fictional guest. Please keep all answers fictional.';
      field = input('name', 'Fictional guest name');
    }
    if (step === 'dish') {
      title = 'What dish comes to mind for you?';
      hint = 'An everyday favourite is welcome. This is inspiration for a fictional menu.';
      field = input('dish', 'Dish');
    }
    if (step === 'story') {
      title = `What comes to mind about ${escape(answers.dish)}?`;
      hint = 'Company, setting, or a small memory. Writing is optional.';
      field = textarea('story', 'Fictional food memory');
    }
    if (step === 'version') {
      title = 'What is the bite you look forward to?';
      hint = 'A flavour, texture, or a little detail you would love to keep.';
      field = textarea('version', 'A detail about your dish');
    }
    if (step === 'review') {
      title = 'Your note, before it stays here.';
      hint = 'Review the sample answers. Confirming changes only this tab.';
      field = `<dl class="demo-review"><dt>Guest</dt><dd>${escape(answers.name)}</dd><dt>RSVP</dt><dd>${answers.attendance === 'yes' ? 'Joining the fictional dinner' : 'Not joining the fictional dinner'}</dd>${answers.attendance === 'yes' ? `<dt>Dish</dt><dd>${escape(answers.dish)}</dd><dt>Memory</dt><dd>${escape(answers.story || 'Not added')}</dd><dt>The bite</dt><dd>${escape(answers.version || 'Not added')}</dd>` : ''}</dl>`;
    }
    content = `<section><p class="demo-progress">${order.indexOf(step) + 1} / 6 · ${step === 'review' ? 'Review your note' : 'A note to the kitchen'}</p><h2 tabindex="-1">${title}</h2><p class="hint">${hint}</p><div class="answer-area">${field}</div>${error ? `<p class="demo-error" role="alert">${escape(error)}</p>` : ''}<div class="demo-actions">${btn('back', 'Back')}${btn(step === 'review' ? 'confirm' : 'next', step === 'review' ? 'Confirm demo RSVP' : 'Continue', true)}</div>${step === 'review' ? btn('edit', 'Edit sample answers') : ''}</section>`;
  }
  app.innerHTML = `<nav class="demo-navigation" aria-label="Portfolio"><a class="demo-case-link" href="/case-studies/caballeros/#invitation-demo">Back to case</a></nav><p class="demo-label">Portfolio demo · fictional dinner · nothing is sent<br>Use sample answers only. No personal or health information.</p><div class="demo-stage">${content}</div><footer class="demo-footer"><img src="./assets/wordmark.png" alt="Caballero’s"><p>A shared table, a few surprises.</p><p>Answers stay in memory until reset or reload.</p>${step !== 'welcome' ? btn('reset', 'Reset demo') : ''}</footer>`;
  if (focus) app.querySelector('h1, h2')?.focus();
}
function input(key, label) {
  return `<label class="demo-field"><span>${label}</span><input type="text" data-field="${key}" value="${escape(answers[key])}" maxlength="80" autocomplete="off" spellcheck="false"></label>`;
}
function textarea(key, label) {
  return `<label class="demo-field"><span>${label}</span><textarea data-field="${key}" maxlength="600" autocomplete="off">${escape(answers[key])}</textarea></label>`;
}
app.addEventListener('input', e => {
  const key = e.target.dataset.field;
  if (key) answers[key] = e.target.value;
  if (e.target.name === 'attendance') answers.attendance = e.target.value;
});
app.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  error = '';
  if (action === 'stop-animation') {
    envelopeStopped = true;
  } else if (['restart', 'reset'].includes(action)) {
    answers = {
      ...sample
    };
    step = 'welcome';
  } else if (action === 'start' || action === 'edit') step = 'attendance';else if (action === 'back') step = step === 'review' && answers.attendance === 'no' ? 'attendance' : order[order.indexOf(step) - 1] || 'welcome';else if (action === 'confirm') step = answers.attendance === 'yes' ? 'confirmed' : 'declined';else if (action === 'next') {
    if (['name', 'dish'].includes(step) && !answers[step].trim()) {
      error = 'Please keep a fictional sample answer here.';
      render();
      return;
    }
    step = step === 'attendance' && answers.attendance === 'no' ? 'review' : order[order.indexOf(step) + 1];
  }
  render();
});
motionPreference.addEventListener('change', () => {
  if (step === 'welcome') render(false);
});
render(false);
