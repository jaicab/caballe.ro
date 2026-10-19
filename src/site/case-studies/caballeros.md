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
<p>I designed the identity, built a React invitation, and connected a recipe library to an editable print studio. The tools support my supper-club project, from inviting people to cooking and making keepsakes.</p>
</div>

{% evidence %}
<figure class="caballeros-dinner"><a class="image-inspect" href="/images/case-studies/caballeros/dinner-table.jpg" data-image-viewer><img src="/images/case-studies/caballeros/dinner-table.jpg" width="1600" height="1066" alt="A Caballero’s dinner table in sunlight, set with printed menus, flowers, citrus and candles" loading="eager" /><span>Enlarge image +</span></a><figcaption>The experience the tools serve: a real Caballero’s table, with its menus and small details in place.</figcaption></figure>
{% endevidence %}

{% statement "01 / One identity, different jobs" %}Warm enough to invite you in. Clear enough to cook with.{% endstatement %}

{% evidence %}
<div class="caballeros-retina-pair">
<figure class="caballeros-invitation-scene"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-invitation-demo-desktop-2x.png" data-image-viewer><span class="caballeros-invitation-crop"><img src="/images/case-studies/caballeros/caballeros-invitation-demo-desktop-2x.png" width="2560" height="1800" alt="Caballero’s invitation preview with a hand-drawn envelope and A note to the kitchen heading" loading="lazy" /></span><span>Enlarge image +</span></a><figcaption><p class="eyebrow">The invitation</p><h3>Start with a story.</h3><p>A dish you remember. A few words, or a voice note. The invitation gives guests a way into the evening before they arrive. Demo invitation shown.</p></figcaption></figure>
<figure class="caballeros-desktop-scene"><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-library-desserts-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-library-desserts-2x.png" width="2560" height="1800" alt="Caballero’s dessert recipe library with Moscovitas, apple and lime granita, and Basque cheesecake" loading="lazy" /><span>Enlarge image +</span></a><figcaption><strong>The recipe library.</strong> Find the dish, check what it needs, add it to the shopping list.</figcaption></figure>
</div>
{% endevidence %}

## Personality has a job to do.

The crayon identity makes a digital invitation feel personal. The kitchen needs a different kind of care: readable instructions, quantities within reach and a clear next action. The visual language connects them without making them behave the same way.

{% statement "02 / Cooking, without the clutter" %}Less hunting for ingredients. Less losing your place.{% endstatement %}

{% evidence %}
<div class="caballeros-phone-scene" id="what-changed">
<figure><p class="eyebrow">01 / Cook</p><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-cook-tahini-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-cook-tahini-2x.png" width="780" height="1688" alt="Tahini Yoghurt Sauce in Cook mode: a short instruction, progress and an Ingredients button" loading="lazy" /><span>Enlarge image +</span></a><figcaption>One step at a time. The method stays readable and the next action stays put.</figcaption></figure>
<figure><p class="eyebrow">02 / Check, then return</p><a class="image-inspect" href="/images/case-studies/caballeros/caballeros-ingredients-tahini-2x.png" data-image-viewer><img src="/images/case-studies/caballeros/caballeros-ingredients-tahini-2x.png" width="780" height="1688" alt="Tahini Yoghurt Sauce ingredient sheet with six quantities and a Back to cooking button" loading="lazy" /><span>Enlarge image +</span></a><figcaption>Check the quantities, then get straight back to the recipe.</figcaption></figure>
</div>
{% endevidence %}

I kept the quantities and temperatures in the instructions, and made the ingredient list easier to reach. I’ve tested it in the kitchen, too.

{% statement "03 / Beyond the screen" %}Make the recipe useful. Then make it worth keeping.{% endstatement %}

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

The custom invitation type was developed with fontTools and Pillow, using a modified Caveat scaffold under its open font licence.

</section>

<p class="caballeros-status">Working tools, an evolving independent project.</p>
