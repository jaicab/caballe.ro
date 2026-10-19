---
themeColor: "D4C7FF"
tileColor: "BDA9FF"
layout: report
tags: report
short: moteefe
tagline: Management, Research, UX, Storybook
title: Redesigning a garment builder experience
description: A dynamic e-commerce platform for merchandise creators and influencer brands
timeframe: Nov 2016 - Nov 2017
readtime: 3
intro: "From a brand refresh to a reusable campaign builder: product design and frontend architecture for merchandise creators."
contract: Freelance gig
location: London / Remote
date: 2018-05-01
properties:
  responsibilities:
    - User interviews
    - UX/UI design
    - Redesign planning
    - Product management
    - Component breakdown
    - Frontend build
  tools:
    - Sketch
    - Asana / Zube / Jira
    - Zeplin
    - VSCode
  tech:
    - React
    - Storybook
    - AWS + CI
    - Ruby on Rails
  credits:
    - Jason Cianfrone for UI design
    - Lev Kundin for technical leadership
    - Mathijs Eefting for product and business direction
    - Maria Ladusane for product management
    - Henrique Alves for React development
    - Wagner Santos for React development
    - BEAR agency for brand design and discovery
---

<div class="case-summary">

## The short version

- **Role:** Frontend architecture, research, UX and redesign planning; UI design with Jason Cianfrone and React development with Henrique Alves and Wagner Santos.
- **Problem:** A brand refresh exposed years of UX debt in a complex merchandise campaign builder.
- **Decision:** Rebuild in stages around reusable React components, with a Storybook library to preview and document them.
- **Result:** A redesigned campaign builder and shared component package. This case study does not include a measured business impact.

</div>

<div id="tldr"></div>

## Watch the components in use

The original Storybook recording shows the actual component library we built.

<video controls playsinline preload="metadata" aria-label="Moteefe Storybook demonstration of the reusable campaign builder components">
<source src="{{ '/images/case-studies/moteefe/storybook.mp4' | url }}" type="video/mp4"/>
<p>Your browser cannot play this video. <a href="{{ '/images/case-studies/moteefe/storybook.mp4' | url }}">Download the demonstration</a>.</p>
</video>

{% journey "moteefe" %}

{% statement "01 / Design and engineering" %}Design the interaction. Build the component.{% endstatement %}

## From artwork to campaign

{% screens %}
<img width="1440" height="1605" src="{{ '/images/case-studies/moteefe/ui-upload.png' | url }}" alt="Moteefe campaign builder artwork upload screen" loading="lazy"/>
<img width="1440" height="1961" src="{{ '/images/case-studies/moteefe/ui-select.png' | url }}" alt="Moteefe campaign builder product selection screen" loading="lazy"/>
<img width="1440" height="2062" src="{{ '/images/case-studies/moteefe/ui-edit.png' | url }}" alt="Moteefe campaign builder artwork placement editor" loading="lazy"/>
<img width="1440" height="2539" src="{{ '/images/case-studies/moteefe/ui-selected.png' | url }}" alt="Moteefe campaign builder selected products screen" loading="lazy"/>
{% endscreens %}


<details>
<summary>Decisions, process and lessons</summary>

### Resolve product decisions before polishing the UI

Creators needed to understand VAT, availability, pricing and campaign settings while placing artwork on different products. I used wireframes to bring sales, founders and developers into the same discussion.

<img width="3071" height="1904" src="{{ '/images/case-studies/moteefe/ux-limits.png' | url }}" alt="Artwork placement guidelines defining canvas limits and editor controls" loading="lazy"/>

### Build the behaviour, not just the screens

We packaged the components in a private npm library. These recordings show the original interactions.

<video controls playsinline preload="metadata" aria-label="Moteefe product colour selector demonstration">
<source src="{{ '/images/case-studies/moteefe/color-selector.mp4' | url }}" type="video/mp4"/>
<p>Your browser cannot play this video. <a href="{{ '/images/case-studies/moteefe/color-selector.mp4' | url }}">Download the demonstration</a>.</p>
</video>
<video controls playsinline preload="metadata" aria-label="Moteefe profit calculator demonstration">
<source src="{{ '/images/case-studies/moteefe/profit-calculator.mp4' | url }}" type="video/mp4"/>
<p>Your browser cannot play this video. <a href="{{ '/images/case-studies/moteefe/profit-calculator.mp4' | url }}">Download the demonstration</a>.</p>
</video>
<video controls playsinline preload="metadata" aria-label="Moteefe campaign options demonstration">
<source src="{{ '/images/case-studies/moteefe/campaign-options.mp4' | url }}" type="video/mp4"/>
<p>Your browser cannot play this video. <a href="{{ '/images/case-studies/moteefe/campaign-options.mp4' | url }}">Download the demonstration</a>.</p>
</video>
<video controls playsinline preload="metadata" aria-label="Moteefe campaign duration selector demonstration">
<source src="{{ '/images/case-studies/moteefe/duration-selector.mp4' | url }}" type="video/mp4"/>
<p>Your browser cannot play this video. <a href="{{ '/images/case-studies/moteefe/duration-selector.mp4' | url }}">Download the demonstration</a>.</p>
</video>

### What I learned

A single profit calculator touched business, sales, design and frontend decisions. Bringing those disciplines together earlier improved how we worked. Clear ownership and realistic staffing mattered as much as the component architecture.

</details>
