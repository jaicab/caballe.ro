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
readtime: 3
date: 2026-10-19
properties:
  responsibilities:
    - Brand and interaction design
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
<p>I designed the identity and built the invitation, kitchen and Studio tools for my supper-club project. One system connecting the stories people bring to dinner with the work of making it happen.</p>
</div>

{% evidence %}
<figure class="caballeros-dinner"><a class="image-inspect" href="/images/case-studies/caballeros/dinner-table.jpg" data-image-viewer><img src="/images/case-studies/caballeros/dinner-table.jpg" width="1600" height="1066" alt="A Caballero’s dinner table in sunlight, set with printed menus, flowers, citrus and candles" loading="eager" /><span>Enlarge image +</span></a><figcaption>The experience the tools serve: a real Caballero’s table, with its menus and small details in place.</figcaption></figure>
{% endevidence %}

{% statement "01 / One identity, different jobs" %}Warm enough to invite you in. Clear enough to cook with.{% endstatement %}

{% evidence %}
<div class="caballeros-pair">
<figure><div class="caballeros-invite-frame"><img src="/images/case-studies/caballeros/invitation-preview.jpg" width="1280" height="720" alt="Invitation design preview: a hand-drawn envelope, A note to the kitchen, and one Start button" loading="lazy" /></div><figcaption><strong>The guest side.</strong> An invitation to share a dish and its story, in writing or by voice. Invitation design preview.</figcaption></figure>
<figure><img src="/images/case-studies/caballeros/recipe-library.jpg" width="788" height="1048" alt="Recipe library with illustrated recipe cards, search, filters and shopping actions" loading="lazy" /><figcaption><strong>The kitchen side.</strong> Find a recipe, prepare the ingredients, follow the method. Kitchen interface, September 2026.</figcaption></figure>
</div>
{% endevidence %}

## Personality has a job to do.

The crayon identity makes a digital invitation feel personal. The kitchen needs a different kind of care: readable instructions, quantities within reach and a clear next action. The visual language connects them without making them behave the same way.

{% statement "02 / A concrete iteration" %}Less hunting for ingredients. Less losing your place.{% endstatement %}

{% evidence %}
<div class="caballeros-cook-sequence" id="what-changed">
<figure><p class="eyebrow">Before</p><a class="image-inspect" href="/images/case-studies/caballeros/cook-before.jpg" data-image-viewer><img src="/images/case-studies/caballeros/cook-before.jpg" width="390" height="844" alt="Earlier cooking screen with an oversized step number, dense paragraphs and timer action in the bottom bar" loading="lazy" /><span>Enlarge image +</span></a><figcaption>The step number competed with the method. Ingredient quantities sat below a long instruction.</figcaption></figure>
<figure><p class="eyebrow">Revised</p><a class="image-inspect" href="/images/case-studies/caballeros/cook-after.jpg" data-image-viewer><img src="/images/case-studies/caballeros/cook-after.jpg" width="390" height="844" alt="Revised cooking screen with larger text option, clearer paragraph separation, All steps and a fixed Ingredients button" loading="lazy" /><span>Enlarge image +</span></a><figcaption>Clearer reading, an explicit step overview and an Ingredients button that stays within reach.</figcaption></figure>
<figure><p class="eyebrow">Reference, then return</p><a class="image-inspect" href="/images/case-studies/caballeros/cook-ingredients.jpg" data-image-viewer><img src="/images/case-studies/caballeros/cook-ingredients.jpg" width="390" height="844" alt="Ingredient sheet showing staged quantities and a Back to cooking button" loading="lazy" /><span>Enlarge image +</span></a><figcaption>Open the quantities, check the relevant stage, then return to the same place in the recipe.</figcaption></figure>
</div>
{% endevidence %}

I kept the quantities and temperatures in the instructions, and made the ingredient list easier to reach.

{% statement "03 / Beyond the screen" %}Make the recipe useful. Then make it worth keeping.{% endstatement %}

{% evidence %}
<figure class="caballeros-studio"><a href="/images/case-studies/caballeros/design-studio.jpg" aria-label="Enlarge the Caballero’s Design Studio screenshot" data-image-viewer><img src="/images/case-studies/caballeros/design-studio.jpg" width="1280" height="720" alt="Caballero’s Design Studio editing a generic Burnt Basque Cheesecake keepsake, with artwork, text layers and print format controls" loading="lazy" /></a><figcaption>A recipe keepsake in the Studio. Open the image for a closer look.</figcaption></figure>
{% endevidence %}

The Studio connects recipe content to editable menus and keepsakes. Layers, artwork and print formats can change without rebuilding every design by hand. Export supports PNG, PDF and SVG containers; the illustrated artwork remains raster.

<div class="caballeros-table-detail"><a class="image-inspect" href="/images/case-studies/caballeros/table-detail.jpg" data-image-viewer><img src="/images/case-studies/caballeros/table-detail.jpg" width="1066" height="1600" alt="A plated scallop at a Caballero’s dinner, with flowers and a printed menu behind it" loading="lazy" /><span>Enlarge image +</span></a><div><h2>The screen is only part of it.</h2><p>The invitation, recipes and printed menus all come together at the table.</p></div></div>

<details id="decisions">
<summary>What I built with, and where AI fits</summary>

The kitchen and Studio use HTML, CSS and vanilla JavaScript. The invitation uses React and Vite. Markdown/TOML recipes and JSON plans feed a Python static generator; local storage and IndexedDB preserve working state.

I used Codex to build and check the tools, and ImageGen and Runway for the invitation’s artwork and motion.

Cloudflare Pages, Workers and D1 support the deployed guest flow and private host tools. Voice transcription is implemented through Workers AI. Guest responses and host records are deliberately absent from this case study.

The custom invitation type was developed with fontTools and Pillow, using a modified Caveat scaffold under its open font licence. The project has continued evolving since the historical interface captures shown here.

</details>

<p class="caballeros-status">Working tools, an evolving independent project.</p>
