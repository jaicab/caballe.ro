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
<img class="caballeros-wordmark" src="/images/case-studies/caballeros/wordmark.png" width="519" height="253" alt="Caballero’s hand-drawn terracotta wordmark" />
<p>A supper club, an invitation, a working kitchen toolkit. One project connecting the stories people bring to dinner with the work of making it happen.</p>
</div>

{% statement "01 / One identity, different jobs" %}Warm enough to invite you in. Clear enough to cook with.{% endstatement %}

{% evidence %}
<div class="caballeros-pair">
<figure><div class="caballeros-invite-frame"><img src="/images/case-studies/caballeros/invitation-preview.jpg" width="1280" height="720" alt="Invitation design preview: a hand-drawn envelope, A note to the kitchen, and one Start button" loading="lazy" /></div><figcaption><strong>The guest side.</strong> An invitation to share a dish and its story, in writing or by voice. This capture is a design preview; nothing is sent.</figcaption></figure>
<figure><img src="/images/case-studies/caballeros/recipe-library.jpg" width="788" height="1048" alt="Recipe library with illustrated recipe cards, search, filters and shopping actions" loading="lazy" /><figcaption><strong>The kitchen side.</strong> Find a recipe, prepare the ingredients, follow the method. Actual interface capture, September 2026.</figcaption></figure>
</div>
{% endevidence %}

## Personality has a job to do.

The crayon identity makes a digital invitation feel personal. The kitchen needs a different kind of care: readable instructions, quantities within reach and a clear next action. The visual language connects them without making them behave the same way.

{% statement "02 / A concrete iteration" %}Less hunting for ingredients. Less losing your place.{% endstatement %}

{% evidence %}
<div class="caballeros-cook-sequence">
<figure><p class="eyebrow">Before</p><img src="/images/case-studies/caballeros/cook-before.jpg" width="390" height="844" alt="Earlier cooking screen with an oversized step number, dense paragraphs and timer action in the bottom bar" loading="lazy" /><figcaption>The step number competed with the method. Ingredient quantities sat below a long instruction.</figcaption></figure>
<figure><p class="eyebrow">Revised</p><img src="/images/case-studies/caballeros/cook-after.jpg" width="390" height="844" alt="Revised cooking screen with larger text option, clearer paragraph separation, All steps and a fixed Ingredients button" loading="lazy" /><figcaption>Clearer reading, an explicit step overview and an Ingredients button that stays within reach.</figcaption></figure>
<figure><p class="eyebrow">Reference, then return</p><img src="/images/case-studies/caballeros/cook-ingredients.jpg" width="390" height="844" alt="Ingredient sheet showing staged quantities and a Back to cooking button" loading="lazy" /><figcaption>Open the quantities, check the relevant stage, then return to the same place in the recipe.</figcaption></figure>
</div>
{% endevidence %}

The revision kept the full method instead of shortening away important quantities or temperatures. These September 2026 captures document an implementation review, not a usability study. A real cook with a phone on the worktop is the next validation step.

{% statement "03 / Beyond the screen" %}Make the recipe useful. Then make it worth keeping.{% endstatement %}

{% evidence %}
<figure class="caballeros-studio"><a href="/images/case-studies/caballeros/design-studio.jpg" aria-label="Open the full-size Caballero’s Design Studio screenshot"><img src="/images/case-studies/caballeros/design-studio.jpg" width="1280" height="720" alt="Caballero’s Design Studio editing a generic Burnt Basque Cheesecake keepsake, with artwork, text layers and print format controls" loading="lazy" /></a><figcaption>Actual Design Studio interface with a generic recipe keepsake. Open the image to inspect the editor.</figcaption></figure>
{% endevidence %}

The Studio connects recipe content to editable menus and keepsakes. Layers, artwork and print formats can change without rebuilding every design by hand. Export supports PNG, PDF and SVG containers; the illustrated artwork remains raster.

<details>
<summary>What I built with, and where AI fits</summary>

The kitchen and Studio use HTML, CSS and vanilla JavaScript. The invitation uses React and Vite. Markdown/TOML recipes and JSON plans feed a Python static generator; local storage and IndexedDB preserve working state.

Codex supports development and checks. ImageGen and Runway were used in the invitation’s visual and motion workflow. They support the craft; the product decisions still need clear constraints, implementation checks and real-world validation.

Cloudflare Pages, Workers and D1 support the deployed guest flow and private host tools. Voice transcription is implemented through Workers AI. Guest responses and host records are deliberately absent from this case study.

The custom invitation type was developed with fontTools and Pillow, using a modified Caveat scaffold under its open font licence. The project has continued evolving since the historical interface captures shown here.

</details>

<p class="caballeros-status">Working tools, an evolving independent project.</p>
