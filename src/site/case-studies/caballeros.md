---
themeColor: "f0e3cf"
tileColor: "f0e3cf"
layout: report
tags: report
short: caballeros
tagline: Identity, product design, development
title: A dinner starts long before anyone sits down.
description: Caballero’s, a supper-club identity and connected tools for inviting, cooking and making keepsakes.
timeframe: An evolving personal project
contract: Personal project
location: London
readtime: 6
date: 2026-10-19
properties:
  responsibilities:
    - Identity and custom type design
    - Dinner planning and interaction design
    - Frontend implementation
    - AI-assisted development and visual workflows
  tools:
    - JavaScript, React and Vite
    - Python, Markdown and TOML
    - Cloudflare Pages, Workers and D1
    - Codex, ImageGen and Runway
    - fontTools and Pillow
---

<div class="caballeros-intro" id="tldr">
<img class="caballeros-wordmark" src="/images/case-studies/caballeros/wordmark.svg" width="519" height="253" alt="Caballero’s hand-drawn terracotta wordmark" />
<p>I designed the identity and custom invitation type, planned the dinners, and built the tools around them. A guest’s food memory starts the conversation; I turn that inspiration into a menu, then use connected recipes, quantities, prep and print to bring it to the table.</p>
</div>

{% journey "caballeros" %}

<section id="invitation-demo" aria-labelledby="invitation-demo-title">
<h2 id="invitation-demo-title">Take a seat at the imaginary table.</h2>
<p>Try the invitation with a fictional dinner and sample guest. Accept or decline, add a food memory, and review your note. Nothing is sent or saved; reset or reload to start again. This accept/decline route was made for the portfolio. The real invitation gathers food contributions for private host review.</p>
<p><a class="text-link" href="/demos/caballeros/">Try the fictional invitation →</a></p>
</section>

{% evidence %}
<figure class="caballeros-dinner"><a class="image-inspect" href="/images/case-studies/caballeros/dinner-table.jpg" data-image-viewer><img src="/images/case-studies/caballeros/dinner-table.jpg" width="1600" height="1066" alt="A Caballero’s dinner table in sunlight, set with printed menus, flowers, citrus and candles" loading="eager" /><span>Enlarge image +</span></a><figcaption>The experience the tools serve: a real Caballero’s table, with its menus and small details in place.</figcaption></figure>
{% endevidence %}

{% statement "01 / One identity, different jobs" %}Warm enough to invite you in. Clear enough to cook with.{% endstatement %}

## A custom voice, not just a logo.

I developed **Caballeros Crayon Invitation**, a custom derivative of Caveat under the SIL Open Font License. I redrew the Latin letters, numerals, punctuation and supported accents around the wordmark’s narrow, upright strokes and restrained crayon texture. Some extended glyphs remain inherited; the original logo stays separate.

The same type carries invitation headings, recipe titles and Studio output. Instructions, controls and operational numbers keep a more readable companion face.

{% evidence %}
<figure class="caballeros-type-specimen"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-custom-font-specimen-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-custom-font-specimen-2x.png" width="2560" height="2000" alt="Actual Caballeros Crayon Invitation typeface: A note to the kitchen, alphabet, numerals and invitation phrases" loading="lazy" /><span>Inspect the type specimen +</span></a><figcaption>Portfolio specimen rendered with the actual custom font. <a href="/demos/caballeros/assets/OFL.txt">Caveat attribution and open-font licence</a>.</figcaption></figure>
{% endevidence %}


{% evidence %}
<div class="caballeros-retina-pair">
<figure class="caballeros-invitation-scene"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-invitation-demo-desktop-2x.png" data-image-viewer><span class="caballeros-invitation-crop"><img src="/images/case-studies/caballeros/caballeros-invitation-demo-desktop-2x.png" width="2560" height="1800" alt="Caballero’s invitation preview with a hand-drawn envelope and A note to the kitchen heading" loading="lazy" /></span><span>Enlarge image +</span></a><figcaption><p class="eyebrow">The invitation</p><h3>Start with a story.</h3><p>A dish you remember. A few words, or a voice note. The invitation gives guests a way into the evening before they arrive. Demo invitation shown.</p></figcaption></figure>
<figure class="caballeros-desktop-scene"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-library-desserts-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-library-desserts-2x.png" width="2560" height="1800" alt="Caballero’s dessert recipe library with Moscovitas, apple and lime granita, and Basque cheesecake" loading="lazy" /><span>Enlarge image +</span></a><figcaption><strong>The recipe library.</strong> Find the dish, check what it needs, add it to the shopping list.</figcaption></figure>
</div>
{% endevidence %}



## The handoff is a design decision.

The invitation asks for a story, not a finished recipe. I review the responses privately and decide which ideas become dishes. That human handoff matters: choosing a menu, adapting recipes and setting covers are my work, not an automatic result of submitting the form.

Once I choose the dishes, stable recipe links connect the menu to scaled ingredients and a shopping list. Pantry checks and purchase overrides remain explicit. The kitchen then needs a different kind of care: readable instructions, quantities within reach and a clear next action.

{% statement "02 / Cooking, without the clutter" %}Less hunting for ingredients. Less losing your place.{% endstatement %}

{% evidence %}
<div class="caballeros-phone-scene" id="what-changed">
<figure><p class="eyebrow">01 / Cook</p><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-cook-tahini-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-cook-tahini-2x.png" width="780" height="1688" alt="Tahini Yoghurt Sauce in Cook mode: a short instruction, progress and an Ingredients button" loading="lazy" /><span>Enlarge image +</span></a><figcaption>One step at a time. The method stays readable and the next action stays put.</figcaption></figure>
<figure><p class="eyebrow">02 / Check, then return</p><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-ingredients-tahini-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-ingredients-tahini-2x.png" width="780" height="1688" alt="Tahini Yoghurt Sauce ingredient sheet with six quantities and a Back to cooking button" loading="lazy" /><span>Enlarge image +</span></a><figcaption>Check the quantities, then get straight back to the recipe.</figcaption></figure>
</div>
{% endevidence %}

I kept the quantities and temperatures in the instructions, and made the ingredient list easier to reach. I’ve tested it in the kitchen, too.

{% tinyDetail "caballeros" %}

{% statement "03 / Planning is part of the product" %}Make ahead. Stay at the table.{% endstatement %}

For Caballero’s No. 1, I authored a timed production plan: what could be made ahead, which batches could share equipment, when oven and cold work could run in parallel, and what to protect if the evening ran late. Finish cues sit beside clock times, so the sheet says what “done” looks like.

The current kitchen tools make authored prep tasks checkable and provide scaled recipes, step progress and timers. Service starts from a time I enter, with explicit start, finish and delay actions. They support a plan; they do not invent one.

{% evidence %}
<figure class="caballeros-prep-scene"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-no1-prep-kitchen-mockup.png" data-image-viewer data-caption="AI-generated kitchen mockup, not a documentary photograph. Privacy-safe original No. 1 prep content in a new portfolio layout."><img src="/images/case-studies/caballeros/caballeros-no1-prep-kitchen-mockup.png" width="1536" height="1024" alt="AI-generated kitchen mockup of a privacy-safe Caballero’s No. 1 Tuesday prep excerpt, in a new layout, on a stainless-steel kitchen counter beside mushrooms, walnuts, a wooden spoon and towel" loading="lazy" /><span>Enlarge kitchen presentation +</span></a><figcaption>AI-generated kitchen mockup, not a documentary dinner photograph. A privacy-safe excerpt of the original production plan, presented in a new portfolio layout.</figcaption><p class="prep-source-links"><a class="text-link" href="/images/case-studies/caballeros/no1-prep-tuesday-portfolio-2x.png" data-image-viewer>Read the Tuesday prep excerpt</a><a class="text-link" href="/images/case-studies/caballeros/no1-prep-wednesday-portfolio-2x.png" data-image-viewer>Read the Wednesday prep excerpt</a></p></figure>
{% endevidence %}

These excerpts preserve the historical task sequence and finish cues, with private details removed. They are not current cooking guidance, original document screenshots or evidence that the newer invitation generated the No. 1 schedule.

{% statement "04 / Beyond the screen" %}Make the recipe useful. Then make it worth keeping.{% endstatement %}

{% evidence %}
<figure class="caballeros-studio caballeros-studio--retina"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-studio-cabrales-selected-2x.png" aria-label="Enlarge the Caballero’s Design Studio screenshot" data-image-viewer><span class="caballeros-studio-full"><img src="/images/case-studies/caballeros/caballeros-studio-cabrales-selected-2x.png" width="2880" height="2000" alt="Caballero’s Design Studio with the Mild Whipped Cabrales Method layer selected and text, font, position and opacity controls visible" loading="lazy" /></span><span>Enlarge image +</span></a><figcaption>Select a layer, edit the text, and adjust the layout. The Studio keeps the recipe and print controls in the same view.</figcaption></figure>
{% endevidence %}

I connected recipes to editable menus and keepsakes, so a source change can refresh the content without rebuilding the layout. Export supports PNG, PDF and SVG containers; the illustrated artwork remains raster.

<div class="caballeros-table-detail"><a class="image-inspect" href="/images/case-studies/caballeros/table-detail.jpg" data-image-viewer><img src="/images/case-studies/caballeros/table-detail.jpg" width="1066" height="1600" alt="A plated scallop at a Caballero’s dinner, with flowers and a printed menu behind it" loading="lazy" /><span>Enlarge image +</span></a><div><h2>The screen is only part of it.</h2><p>The invitation, recipes and printed menus all come together at the table.</p></div></div>

<section id="decisions" class="case-build-note">

## Built to keep working.

I built the kitchen and Studio in HTML, CSS and JavaScript, and the invitation in React. Recipe files feed the library and print tools. Local storage and IndexedDB keep edits available between sessions.

I used Codex to build and check the tools, and ImageGen and Runway for the invitation’s artwork and motion.

Cloudflare Pages, Workers and D1 support the deployed guest flow and private host tools. Voice transcription uses Workers AI.

I used fontTools and Pillow to develop and check the custom invitation type. Its Caveat attribution and SIL Open Font License ship with the font.

</section>

<p class="caballeros-status">Working tools, an evolving independent project.</p>
