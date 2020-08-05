---
themeColor: "#D4C7FF"
tileColor: "#BDA9FF"
layout: report
tags: report
short: moteefe
tagline: Management, Research, UX, Storybook
title: Redesigning a garment builder experience
description: A dynamic e-commerce platform for merchandise creators and influencer brands
timeframe: Nov 2016 - Nov 2017
readtime: 8
intro: "Moteefe began a redesign of its B2B app with the vision of becoming the most striking in the industry, alongside Teespring or Bonfire.
While I actually led the entire move to the new brand, on this case study we will mainly focus on the campaign builder."
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

## Background

Moteefe allows creators to upload an artwork and start selling branded garments with no up-front cost and before the product even exists physically. That means it's a double product, a a B2B app for admins or creators to manage their products, handle payouts, etc and a B2C when these products are presented to customers.

The company was born in 2014 and had been building upon their original branding and UI ever since. In 2016, they decided it was time for a rebrand and cleanup.

## Understanding the problem

BEAR agency was commissioned with the rebrand, and I was taken in as the frontend architect to lead and execute this new branding into their current UI. Shortly after joining, I discovered:

- BEAR was commissioned with discovery and branding, but not UI design
- BEAR's efforts for branding were great for marketing purposes, but didn't do enough for product design
- BEAR's brand suggestion was strikingly different, which helped make the product stand out. But testing revealed creators wanted the b2c side of things to be as white label as possible, so it couldn't apply there, or as much.
- With years of UX debt and no head of design in charge, Moteefe's platform was in need of a massive UX redesign, not just a brand refresh.
- As a small startup quickly grown into a massive company, there was a massive lack of processes in place.

## Mission and solutions

After a few brainstorming sessions with the London and Lisbon offices, I quickly identified Moteefe's mission:

> Empower creators to deliver branded garments and test niche audiences with no up-front cost

Thankfully BEAR had already done the work on the company values:

<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/bear.png' | url }}" alt="BEAR company values"/>

At a brainstorming session with the founders, this seemed to be the crazy user flow:

<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/user-flow.png' | url }}" alt="Moteefe user flow"/>

After a few days of strategic discussions and product research, it was decided we should rebuild the app from scratch, in stages and in React.

Solutions:

- Workflow: there was no working methodology set in place, only the developers had their tasks broken into bits. I proposed educating the team in SCRUM.
- Team up: as the task at hand was much greater than I originally anticipated, we specced out the need for a UI designer and a few React developers.
- Project planning: this was a humongous task, so we broke it down by projects.
  - Content analysis: Analyse the creator's needs and goals and rework the information architecture.
  - Homepage: the landing page for creators.
  - Campaign builder: the tool creators would use to upload artworks, customise their products and set their campaigns.
  - CRUD app: The dashboard side of things, where creators manage their campaigns, payments, etc.
  - Campaign page: The customer-facing side of a campaign.
  - Checkout: Including upsell, CR analysis, etc.
  - Stores: Campaigns may group into branded marketplaces that we called stores.

## Implementing SCRUM

<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/agile.png' | url }}" alt="Implementing agile"/>

Some of the team members had worked with agile methodology before, but the founders had been working on different ways as the company grew and hadn't considered ownership as part of project planning. Epics was a completely new concept for them. So I sat down with them and after a few sessions, we had set a few guidelines:

- Milestones would be owned and set by the founders, reviewed on a monthly basis and represent company goals.
- Epics would be owned by founders or managers, reviewed on bi-weekly sprints and represent projects that could be one to many sprints long.
- Tasks would be owned by anyone, usually assigned to one single individual and reviewed daily (if in progress) or weekly (if in icebox).

We tried many tools like Asana and Jira, but finally decided on [Zube](https://zube.io/) for its integration with GitHub Issues, which was powerful for us given the distributed teams across London, Lisbon and Moscow, plus remote workers like myself.

## Redesigning the campaign builder

The creators had a campaign builder tool at their disposal to create the garments and set up their campaigns. One of the biggest challenges of the experience was making it both easy to use and communicative of the marketing options available to creators.

The company's directions on how to inform things like VAT, product availability and cost weren't clear, so there were some heavy brainstorming sessions until late.

{% fullscreen %}
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/wb-campaign.png' | url }}" alt="Brainstorming campaign builder"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/wb-builder.png' | url }}" alt="Brainstorming campaign editing"/>
{% endfullscreen %}

## Wireframing

I worked on low-fi wireframes to have a discussion ground with sales and founders for business and customer feedback.

{% screens %}
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ux-upload.png' | url }}" alt="Upload your design wireframe"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ux-select.png' | url }}" alt="Select your garments wireframe"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ux-edit.png' | url }}" alt="Edit your artwork wireframe"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ux-selected.png' | url }}" alt="Selected products wireframe"/>
{% endscreens %}

## Artwork handling

The customer could upload different artworks and the editor had to handle them within different canvas. I put together guidelines to asses the frames and actionable elements of the design tool, and how they should react in different situations.

{% fullscreen %}
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ux-limits.png' | url }}" alt="Artwork limits for builder"/>
{% endfullscreen %}

<div id="tldr"></div>

## Final design

Together with Jason, we put together the final designs.

{% screens %}
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ui-upload.png' | url }}" alt="Upload your design screen"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ui-select.png' | url }}" alt="Select a product screen"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ui-edit.png' | url }}" alt="Edit your artwork screen"/>
<img class="lazyload" data-src="{{ '/images/case-studies/moteefe/ui-selected.png' | url }}" alt="Selected products screen"/>
{% endscreens %}

## Development

Together with Henrique and Wagner, we built all these components into a separate repository and private npm package, with a Storybook library to preview, test and document all the reusable components.

{% fullscreen %}
<video autoplay loop muted playsinline>
<source src="{{ '/images/case-studies/moteefe/storybook.mp4' | url }}" type="video/mp4"/>
</video>
{% endfullscreen %}

{% screens %}

<div class="c-video">
  <video autoplay loop muted playsinline>
    <source src="{{ '/images/case-studies/moteefe/color-selector.mp4' | url }}" type="video/mp4"/>
  </video>
</div><div class="c-video">
  <video autoplay loop muted playsinline>
    <source src="{{ '/images/case-studies/moteefe/profit-calculator.mp4' | url }}" type="video/mp4"/>
  </video>
</div><div class="c-video">
  <video autoplay loop muted playsinline>
    <source src="{{ '/images/case-studies/moteefe/campaign-options.mp4' | url }}" type="video/mp4"/>
  </video>
</div><div class="c-video">
  <video autoplay loop muted playsinline>
    <source src="{{ '/images/case-studies/moteefe/duration-selector.mp4' | url }}" type="video/mp4"/>
  </video>
</div>
{% endscreens %}

## Results and improvements

Moteefe has now moved on from this heavy blue and red UI to a more minimalist design. They hired a great agency, but hadn't planned for UI design. It took some decent time since I joined to get into a position where we could be producing something valuable. We learned:

- Cross-team collaboration saves time if done right: Components like the profit calculator took weeks to get done. There can be so many decisions to be made, from business and sales all the way to UX and frontend, that affect a single component. A frontend's idea can feed into a business view and vice versa. We learned the lesson with this calculator, and after that we started putting together different disciplines so they could brainstorm the component together.
- Cheap is expensive: the massive delays from hiring a small team for a humongous task until we hired more people could have been saved. Be realistic about the consequences of what you're trying to achieve and overestimate, or you'll end up paying more (be it time or money) than if done right.
- Project management is key: having owners helps delegating tasks and avoids communication issues and informs if delays happen. There's a difference between micro-management and informing your colleagues. Delays are bound to happen, but let people know.
