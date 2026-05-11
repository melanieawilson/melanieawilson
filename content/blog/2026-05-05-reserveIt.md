---
title: From SignUp Genius Frustration to a Purpose-Built Reservation App — With a Little Help from Claude Code
description: How I used agentic coding to build a lightweight equipment reservation website for a local watershed volunteer group in an evening.
date: 2026-05-05
category: tech
tags:
  - AI
  - coding
  - project
---

I recently had the opportunity to see how capable agentic coding is at solving a real-world project from start to finish. I was excited to try this out with Claude Code.

I volunteer doing seasonal water sampling with a local soil & water conservation district. The watershed group partners with local libraries to lend out sampling kits. These kits are not part of the libraries' collection, so reserving them is handled separately.

The group has been using SignUp Genius to manage reservations, and it was a continued source of frustration. The UI was cluttered and required sifting through multiple pages just to reach the current week. There was no way to see kit availability at a glance or filter by location, and staff had to manually clear out past dates on a regular basis.

At the annual meeting they shared that they still hadn't found a replacement for SignUp Genius ... lightbulb ... later that evening I prompted Claude asking:

*"I am starting to plan for developing a website that allows a user to reserve some equipment for up to 2 days. The metadata will include kit number, kit name, location and availability status. The frontend should allow for filtering — what is the best backend to use? I'd like a simple, lightweight, easy to maintain stack."*

*"Vue and Supabase sound like the right fit for me."*

After a few back-and-forth exchanges, I landed on implementing a solution using Vue (frontend), Supabase (backend), Resend (email service), and Vercel for hosting & deploys — with built-in support for email confirmations and reservation reminders. I registered a new domain on Porkbun.

When I was ready to go, I opened a terminal window in VS Code, initiated Claude Code, and asked Claude to set up a project using Nuxt.

Within less than an hour, I had a functional, nicely designed site that successfully accepted reservations. Over the next few weeks, I iterated on the design and functionality. I'll get into some of my learnings and sticky spots in a future post.

I was very impressed with the end product, but it got me thinking — what background do you actually need to pull something like this off?

Having foundational tech knowledge — being familiar with GitHub, repositories, deploying code, frontend, backend, APIs, and various frameworks — is a huge advantage. These tools level the playing field for people with a tech background who aren't expert coders.

Agentic coding could be a game-changer for small nonprofits and volunteer-based organizations — giving them the ability to build powerful, purpose-built tools instead of making do with the freemium tier of a subpar product. If you want to see how it all came together, the full repo is here: https://github.com/melanieawilson/reserve-it
