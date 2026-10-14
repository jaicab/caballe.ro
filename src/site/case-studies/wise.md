---
themeColor: "aeec86"
tileColor: "aeec86"
layout: report
tags: report
short: wise
tagline: Research, UX / UI
title: Reducing confusion on card refunds
description: Removing confusion around card transactions
timeframe: Jan 2021 - Apr 2022
readtime: 3
intro: "Clearer refunds, fewer support contacts. I led research and UX/UI for the Wise card experience."
contract: Full time
location: London / Remote
date: 2010-05-01
properties:
  responsibilities:
    - User interviews
    - UX/UI design
    - Component breakdown
  tools:
    - Figma
    - UserTesting.com
    - Looker
  credits:
    - Karam Kanan for Product Management
    - Triinu Palmre for Data Analyst
---

<div class="case-summary">

## The short version

- **Role:** Main designer on the Spend team, across personal and business cards. Research, UX/UI and component definition.
- **Problem:** Refunds appeared as separate transactions. Half the customers we interviewed expected the original payment to update instead.
- **Decision:** Make transaction types and states explicit, simplify the information hierarchy and explain pending refunds.
- **Result:** Customer support rate fell **32% over the following quarter**, as reported in the original case study.

</div>

<div id="tldr"></div>

## From confusing status to a clear explanation

The redesign separates refunds, cancellations and card checks, so customers can understand what happened and what comes next.

<img width="1920" height="1080" src="{{ '/images/case-studies/wise/redesign.png' | url }}" alt="Wise redesigned card transaction screens showing distinct payment and refund states" loading="lazy"/>

{% statement "01 / Transaction states" %}Make the state clear. Explain what comes next.{% endstatement %}

{% screens %}
<img width="1920" height="1080" src="{{ '/images/case-studies/wise/refund.png' | url }}" alt="Wise refund detail screen with a plus sign identifying money returned" loading="lazy"/>
<img width="1920" height="1080" src="{{ '/images/case-studies/wise/checked.png' | url }}" alt="Wise card check detail screen explaining the temporary authorisation" loading="lazy"/>
{% endscreens %}


<details>
<summary>Decisions, process and lessons</summary>

### Start with support, not a new interface

With the PM and support team, I ran a two-week discovery exercise: 28,000 transactions analysed and 20 customer interviews. We found 16 refund cases, with pending refunds causing the most confusion.

<img width="1920" height="1080" src="{{ '/images/case-studies/wise/customer_journey.png' | url }}" alt="Customer journey mapping a card payment through a refund" loading="lazy"/>
<img width="1920" height="1080" src="{{ '/images/case-studies/wise/consolidating_reasons.png' | url }}" alt="Research grouping reasons customers contacted support about refunds" loading="lazy"/>

### Test the changes separately

We tested features independently in-product before combining them: merchant identification, clearer state labels, conversion breakdowns and less duplicated information. The rollout happened in two stages: states first, then conversion details.

<img width="1920" height="1081" src="{{ '/images/case-studies/wise/transaction_attributes.png' | url }}" alt="Breakdown of transaction attributes used to define consistent card payment components" loading="lazy"/>

### What I would revisit

The conversion breakdown inherited complexity from the Send framework. I would explore a simpler explanation of fees and test left-aligned attributes for readability.

</details>
