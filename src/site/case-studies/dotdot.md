---
themeColor: "FECFC6"
tileColor: "FEAA99"
layout: report
tags: report
short: dotdot
tagline: Research, Branding, UX/UI, Storybook
title: Breaking paradigms of online chat rooms
description: A place where you can talk to people. Built as a side project during quarantine
intro: "A small chat experiment where you can see what people type, as they type it."
timeframe: March 2020 - April 2020
readtime: 3
contract: Passion project
location: Remote
properties:
  responsibilities:
    - Discovery
    - Identity design
    - UI design
    - Frontend components
  tools:
    - Sketch
    - Notion
    - VSCode
  tech:
    - React
    - Storybook
    - AWS + CI
    - Github Pages
  credits:
    - Alex Urbano for frontend, backend development and co-product direction
    - Phil Cummins for backend development and co-product direction
---

<div class="case-summary">

## The short version

- **Role:** Product direction with Alex Urbano and Phil Cummins; research, identity, UI and frontend components.
- **Problem:** Online chat felt either overwhelming, impersonal or too much effort to join.
- **Decision:** Small text-only rooms, a name to enter, and messages streamed as people type.
- **Result:** A soft launch on Reddit gave us encouraging feedback on live typing. The full design was not implemented.

</div>

<div id="tldr"></div>

## Watch the live-typing experiment

This recording shows the real prototype: people see a message taking shape instead of waiting for someone to press send.

<video controls playsinline preload="metadata" aria-label="Dotdot prototype showing messages streamed as users type">
<source src="{{ '/images/case-studies/dotdot/demo.mp4' | url }}" type="video/mp4"/>
<p>Your browser cannot play this video. <a href="{{ '/images/case-studies/dotdot/demo.mp4' | url }}">Download the demonstration</a>.</p>
</video>

{% journey "dotdot" %}

{% statement "01 / Live typing" %}Let people see the conversation take shape.{% endstatement %}

## One identity, two themes

<img width="3360" height="2100" src="{{ '/images/case-studies/dotdot/ui-dark-desktop.png' | url }}" alt="Dotdot desktop chat design in dark mode" loading="lazy"/>
<img width="750" height="1624" src="{{ '/images/case-studies/dotdot/ui-light-mobile.png' | url }}" alt="Dotdot mobile chat design in light mode" loading="lazy"/>

<details>
<summary>Decisions, process and lessons</summary>

### Make the constraint the experience

We limited rooms to ten people and required only a name to join. Messages disappear once everyone who saw them leaves. Streaming text emerged from a WebSocket experiment and became the core interaction.

### Design and frontend together

I designed the identity, screens and frontend components with React and Storybook. User-selected colours needed to work in both themes, so I wrote a readability helper using the third-party pSBC colour library.

<img width="434" height="344" src="{{ '/images/case-studies/dotdot/make-color-readable.png' | url }}" alt="User-selected colours adjusted for legibility on light and dark backgrounds" loading="lazy"/>

### What I would revisit

Mobile browser behaviour made the chat harder to use than the desktop version. That needs more work, alongside infrastructure for scale. The strongest lesson was letting a technical experiment influence the product direction.

</details>
