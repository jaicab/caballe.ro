---
themeColor: "abadf8"
tileColor: "abadf8"
layout: report
tags: report
short: checkstep
tagline: UX / UI, Frontend lead
title: Solving admin hell in AI Trust & Safety
description: Solving admin hell in AI Trust & Safety
timeframe: Started May 2022
readtime: 3
intro: "Designing and building policy workflows for Trust & Safety teams, from client research to the frontend."
contract: Full time
location: London / Remote
date: 2008-05-01
properties:
  responsibilities:
    - User interviews
    - UX/UI design
    - Design system
    - Frontend lead
  tools:
    - Figma
    - Looker
  credits:
    - Jonathan Manfield as CTO
    - Guillaume Bouchard as CEO
---

<div class="case-summary">

## The short version

- **Role:** Product design and frontend lead. Client interviews, UX/UI and design system.
- **Problem:** Trust & Safety teams wrote policies, then manually translated them into scattered rules and thresholds.
- **Decision:** Put policies at the centre of the workflow, separating policy ownership from technical rule management.
- **Result:** Checkstep gained **12 clients in the first six months**, as reported in the original case study. This was a company outcome, alongside sales and conference activity.

</div>

<div id="tldr"></div>

## A workflow built around the policy

Policies bring written guidance, thresholds, version history and insights together. Moderators get the context behind a decision; managers can change priorities without digging through every data type.

<img width="1920" height="1080" src="{{ '/images/case-studies/checkstep/final.png' | url }}" alt="Checkstep policy management interface bringing policy guidance and rule thresholds together" loading="lazy"/>

{% journey "checkstep" %}

{% statement "01 / Policy workflow" %}Put the policy where decisions are made.{% endstatement %}

{% screens %}
<img width="1920" height="1080" src="{{ '/images/case-studies/checkstep/queues.png' | url }}" alt="Checkstep moderation queues organising content for review" loading="lazy"/>
<img width="1920" height="1080" src="{{ '/images/case-studies/checkstep/review.png' | url }}" alt="Checkstep moderator review interface showing content and decision controls" loading="lazy"/>
{% endscreens %}


## How the product was explained publicly

<figure class="case-website-video"><video controls playsinline preload="metadata" width="762" height="1678" poster="/images/case-studies/checkstep/public-website-2023-poster.jpg" aria-label="Checkstep public website walkthrough recorded in April 2023"><source src="/images/case-studies/checkstep/public-website-2023.mp4" type="video/mp4"><a href="/images/case-studies/checkstep/public-website-2023.mp4">Watch the website recording</a></video><figcaption>15-second recording from my archive, April 2023. This is the public marketing website, showing how analytics, moderator actions and policy conditions were presented. It is not a recording of the logged-in product.</figcaption></figure>

<details>
<summary>Decisions, process and lessons</summary>

### Find the mismatch

Client interviews showed that Trust & Safety teams reviewed policies roughly every two weeks. The product was organised around data types instead, which meant managers had to keep technical settings aligned manually.

<img width="1920" height="1080" src="{{ '/images/case-studies/checkstep/event_based.png' | url }}" alt="Original Checkstep workflow organised around event and data types" loading="lazy"/>
<img width="1920" height="1080" src="{{ '/images/case-studies/checkstep/interview_results.png' | url }}" alt="Trust and Safety client interview findings informing the policy workflow" loading="lazy"/>

### Separate responsibilities

Developers and data governors manage rules. Trust & Safety experts manage policy descriptions and thresholds. Policy updates notify moderators, while version history makes changes traceable.

### What I would revisit

Small client requests could distract from the larger workflow. Another unresolved challenge was responding to sudden spikes in harmful content: creating a policy was quick, but reversing its previous actions was technically harder.

</details>
