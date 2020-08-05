---
themeColor: "#FECFC6"
tileColor: "#FEAA99"
layout: report
tags: report
short: dotdot
tagline: Research, Branding, UX/UI, Storybook
title: Breaking paradigms of online chatting
description: A place where you can talk to people. Built as a side project during quarantine
intro: Remember being quarantined and missing talking to random people? This was our attempt to solve that, while getting entertained in the meantime.
timeframe: March 2020 - April 2020
readtime: 9
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

## Background

Alex and I have been proudly working on many side projects over the years. The origin of this story starts no less than 10 years ago, when he built [Chevismo](https://chevismo.com/).

<img class="lazyload" data-src="{{ '/images/case-studies/dotdot/chevismo.png' | url }}" alt="Chevismo back in 2016"/>

We left this project years ago, but it was an online community where Alex built ideas he thought would be interesting to have online. When I met Alex in Uni, I started collaborating on many of these. But the homepage, besides being a bit of a sitemap to the rest of the site, was really just a dead simple chat.

Over time, this chat became more interesting than we expected. People kept coming back, so ways to give yourself a name and colour were added, and then this identity extended throughout the site. We started really getting to know some of the users that randomly appeared on the site and becoming regulars. We've even met some of these users in real life.

## Understanding the problem

We are social beings. There is something extremely rewarding about having an engaging conversation with a stranger completely outside your social circle. But with quarantine, that wasn't really possible unless it were on the internet. We missed the Chevismo banter, but wanted to create something more generic that applied to anyone. The problem with internet chatting at the moment as we saw it was:

- IIRC felt outdated and dead/busy, there's either nobody or too many people chatting at once.
- Random one-to-one video-call services like Omegle required too much effort per person and there was a high chance of bots or trolls.
- Dedicated communities were too niche on a topic, it was hard to talk about something outside the community topic until you established a relationship with the person.
- Large communities like Slack groups felt overwhelming and required massive effort to filter through the crowd to find interesting chats.

## Mission and solutions

After some brainstorming, we were decided on a mission:

> Make chatting to strangers on the internet feel as engaging as crossing paths with random people in real life.

Principles:

- Social responsibility: Care for user's privacy and peace of mind.
- Trustworthiness: Develop an environment where the user feels like they can open up.

Solutions:

- To avoid trolls, prioritise privacy and development speed, it will be limited to text messaging.
- To minimise the cost of entry, only a name will be required. No name wouldn't be personal enough, and more details put a high barrier on starting the conversation.
- To avoid overwhelming new users, no more than 10 people can be in the same chat.

## Exploration

Since this project was heavily sided on backend, the developers started building a demo with basic chat elements and Bootstrap to then go from there. Then we found the happy accident.

Thanks to WebSockets technology, **you can stream what an user is typing**.

<video autoplay loop muted playsinline>

<source src="{{ '/images/case-studies/dotdot/demo.mp4' | url }}" type="video/mp4"/>
</video>

While this may seem like a bit of an uncanny valley to you at the moment, it resembles another UX paradigm shift you might have come across before: the first Snapchat you received and... gone!

Messages in Snapchat are ephemeral by design. While this was initially shocking to users, it is now a great success thanks to positioning themselves differently with this feature.

> With so much to store mentally and digitally, users reported that they enjoy being able to have an interaction where they can be their true selves without worrying about the repercussions of their exchanges.

[by Social Media Lab and and ReImagination Lab - Cornell University](https://news.cornell.edu/stories/2016/02/snap-its-gone-so-app-users-get-personal)

At this point we had reached a solution that reached our goals while maintaining our values:

1. A message will be deleted the moment everyone that has seen it leaves. This allows the conversation to stay alive only as someone is interested in it, while helping maintain our care for user privacy.
2. What you type will be streamed to the room as you type it, creating a uniquely personal experience, specially when typing impulsively. Now users can backtrack and delete before sending a message if they regret it, but the ones reading would have seen what they typed previously.

## Defining the project

After a few brainstorming discussions, we came up with a few key user stories.

- Start a conversation: user can set a name and start chatting away.
- Set a representing color: user can set a color that helps represent their identity.
- Set mood: user can reflect their mood by selecting one of a given list. This can also be used to reflect and improve their personal identity.
- Send private messages: user can send a message that is only visible by another user.
- Save user state: Recurrent users can hold their username, status and colour by setting a password.

We separated these two into 2 screens:

- Landing / login: Must communicate the app's purpose, while focusing on being a conversation starter.
- App: The post-login chat app where all the interactions will reside.

## Interface exploration

{% fullscreen %}
<img class="lazyload" data-src="{{ '/images/case-studies/dotdot/research.png' | url }}" alt="WhatsApp, Messenger, Instagram and Slack analysis"/>
{% endfullscreen %}

I studied the UI elements and experience of the most well-known chat apps out there to make the experience relatable to users. It was interesting to see:

- Apps mainly used on mobile had bubbly messages and aligned to the sender.
- Apps mainly used on desktop (like Slack) had the messages left aligned and not bubbled.
- OP's avatar wasn't reflected on each message since they already know who they are, unless it's Slack where there is no differentiation for your message among others.

## Wireframes

Based on this and after a few brainstorming sessions with Alex and Phil, I came up with initial high-end wireframes for the web-app.

{% fullscreen %}
<img class="lazyload" data-src="{{ '/images/case-studies/dotdot/wireframes.png' | url }}" alt="UX for dotdot"/>
{% endfullscreen %}

- Landing would focus on a personal approach for a login screen while briefly describing the app.
- App would straight up put you in a room with at least 1 other user but no more than 9 others. The top navigation bar would show:
  - The current user's colour, mood and saved state on the top left. It would also act as an action to save the current state.
  - How many people are online, their colour an mood.

## Branding exploration

{% fullscreen %}
<img class="lazyload" data-src="{{ '/images/case-studies/dotdot/exploring-branding.png' | url }}" alt="Branding options for dotdot"/>
{% endfullscreen %}

While the developers were working on the app, I explored concepts for branding. The whole concept revolved around any 2 people interacting, so a core branding concept was representing each person with a dot. Besides that:

- Alex had the domain "dotdot.im" from thinking about trailing dots in conversations.
- A personal challenge I had put on myself for this was building this supporting both dark and light themes with the same core branding.
- The "glitch" effect was part of the visual trends, so I thought of working with red and blue colours, which made for a very contrasting representation of 2 people.
- The messages are gonna be bubbly, so that is a big part of the brand.

As the developers were building the better prototype, we quickly realised web-chat apps (aka not native) were tremendously hard to make a nice experience on mobile, so while massively important to us, we shifted to being a desktop first web-app. This meant leaving bubbles behind and embracing left-alignment, and so the follow-up UI reflected this.

<div id="tldr"></div>

## Final design

For the type, I had originally gone with [Rubik](https://fonts.google.com/specimen/Rubik), a slightly quirky type, but ended up going with [Manrope](https://fonts.google.com/specimen/Manrope), a new variable font. It reads brilliantly at small sizes and makes for a super-fast load time.

{% display %}

<div class="ui-photo__mobile">
  <img class="lazyload" data-src="{{ '/images/case-studies/dotdot/ui-dark-mobile.png' | url }}" alt="UI for landing page"/>
</div>
<div class="ui-photo__desktop">
  <img class="lazyload" data-src="{{ '/images/case-studies/dotdot/ui-dark-desktop.png' | url }}" alt="UI for landing page"/>
</div>
{% enddisplay %}

{% display %}

<div class="ui-photo__mobile">
  <img class="lazyload" data-src="{{ '/images/case-studies/dotdot/ui-light-mobile.png' | url }}" alt="UI for landing page"/>
</div>
<div class="ui-photo__desktop">
  <img class="lazyload" data-src="{{ '/images/case-studies/dotdot/ui-light-desktop.png' | url }}" alt="UI for landing page"/>
</div>
{% enddisplay %}

## The user-picked colour challenge

Users can be on the light or dark theme, depending on their device and the setting they're on. When they pick a colour, they won't take into consideration the contrast with the background, let alone the contrast with the theme they're not using.

So I developed a `makeColorReadable` function! Powered by [pSBC](<https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)>).

```js
/**
 * Takes a HEX string (with or without pound) and returns a colour visible in the theme background
 */
export const makeColorReadable = (color: string) => {
  const colorRgb = hex2Rgb(color) as rgbColor
  const isLightMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches

  if (!colorRgb) return '#0000FF' // fail

  const offset = getThemeOffset(colorRgb, isLightMode)
  const readableColor = offset && pSBC(offset, color)

  return readableColor || color
}
```

<img class="lazyload" data-src="{{ '/images/case-studies/dotdot/make-color-readable.png' | url }}" alt="Showing different colors on the dark and light modes"/>

This function measures the luminance a colour has and, if it's further than 50% in range (to preserve the originally picked colour where possible), swaps the colour with the one adapted for the theme.

No more worrying about contrast!

## Results and improvements

While not all of the design has been implemented, we soft-launched dotdot on reddit and the response was great! We validated how refreshing it is to see the messages being streamed directly. We learned that:

- Tech exploration is valuable: we wouldn't have discovered streaming messages without it happening by mistake.
- Commit to your paradigm shifts: if you're gonna break a user expectation, commit to it and make it the heart of the experience. It can seem uncanny, but if you sell it well, it'll make you stand out.
- Chats are impossible to build as mobile web-apps: mobile browsers are just too used to the concept of viewport instead of content, native UX is just far superior.

Plans for improvement:

- Improve the infrastructure to handle scale better
- Enhance the mobile experience as much as humanly possible
- Launch on Product Hunt
- Explore the idea of an AI-question-thrower bot for quiet rooms
