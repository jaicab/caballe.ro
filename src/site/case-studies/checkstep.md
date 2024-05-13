---
themeColor: "abadf8"
tileColor: "abadf8"
layout: report
tags: report
short: checkstep
tagline: UX / UI, Frontend lead
title: Solving admin hell in AI Trust & Safety
description: Solving admin hell in AI Trust & Safety
timeframe: May 2022 - Present
readtime: 8
intro: "Unsafe user generated content is difficult to act on, but even harder to do so at scale. This is where AI comes in, but that creates a series of new problems."
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

## Background

Checkstep was first successful for their avant-garde hate and spam detection models, which granted them their first clients. Competing against third-party models like Amazon SageMaker, it was clear we needed to redefine the focus of the company in order to be successful.

On the first company meeting, we established a mission:
> Keep users safer online, empowering moderators and managers to make better decision quickly.

As it evolved, the product had to cover multiple use cases: data governance, moderation and staff performance.

## Understanding the problem

I joined Checkstep when data governance was done on a data type basis. Comments, Posts, etc were tied to AI analysis, graded and triaged. Thresholds determined automatic action, while the rest was passed for manual review by moderators.

<img class="lazyload" data-src="{{ '/images/case-studies/checkstep/event_based.png' | url }}" alt="Checkstep initial workflow"/>

## Mission and solutions

Upon joining the company, my first move was to interview our clients' Trust and Safety teams. My biggest learning was that **rules were reviewed and implemented every two weeks at a policy level**, typed in a Policy document, and then translated into rules for AI and moderators.

<img class="lazyload" data-src="{{ '/images/case-studies/checkstep/interview_results.png' | url }}" alt="Checkstep initial workflow"/>

Our current model's proximity to internal data management tools forced managers to manually adjust settings. Larger clients anticipated administrative challenges in keeping settings aligned with evolving policies, causing poor sales conversion rates.

We set the goal to convert **20 new customers in the next 12 months** by integrating a Policy workflow together with an aggressive presence at Trust & Safety conferences.



## Final design

Testing each feature individually, the final result combined:
- Rules are now stricly managed by developers and data governors.
- Policies contain written description and rule thresholds, managed directly by Trust & Safety experts.
- Policy text updates is notified to moderators, reducing training time.
- Policy insights, helping drive decisions live on policy meetings and drive their own results to success quicker.
- Policy versioning and history, allowing for improvements between releases and clarity for moderators.

<div id="tldr"></div>

{% fullscreen %}
<img class="lazyload" data-src="{{ '/images/case-studies/checkstep/final.png' | url }}" alt="Upload your design wireframe"/>
{% endfullscreen %}

{% screens %}
<img class="lazyload" data-src="{{ '/images/case-studies/checkstep/queues.png' | url }}" alt="Upload your design wireframe"/>
<img class="lazyload" data-src="{{ '/images/case-studies/checkstep/review.png' | url }}" alt="Upload your design wireframe"/>
{% endscreens %}


## Results and improvements

This allowed Trust & Safety teams to act on high volume of events quickly, shifting prioties and tolerances for bad content depending on their workload and priorities, resulting in good sales conversion. We achieved 12 clients within the first 6 months, before the final design had even come together, proving the move to Policy-based strategy was valid.

Things I would have done differently or want to do next:
- Our client base at the time kept us busy with tiny feature requests that were important to them, we should have been better at seeing the big picture and not bend over to particular requests, but it is a fine balance to sustain retention.
- The other big learning from interviews was spikes, meaning a particular type of case (say a terrorist event) going viral required a new policy to be tested and put in place in a matter of minutes. While creating a new policy is a quick process, undoing a Policy's effect is tricky at this stage due to development complexity backtracking actions. Definitely something we're looking into now!