---
title: Getting Playwright to Play Nice with Nuxt and Vercel CI
description: A layer-by-layer account of the SSR hydration, networkidle, and deployment protection problems I hit writing end-to-end tests for ReserveIt — and how I fixed them.
date: 2026-05-20
category: tech
tags:
  - Playwright
  - Nuxt
  - testing
  - CI/CD
  - Vercel
---

Writing end-to-end tests for [ReserveIt](https://github.com/melanieawilson/reserve-it) turned out to be the most technically demanding part of the whole project. The app itself — a Nuxt 3 frontend backed by Supabase — came together quickly with Claude Code. The Playwright test suite took longer, not because the tests were complicated, but because getting them to run reliably against a deployed Vercel URL required peeling back several layers of problems, each one hiding behind the last.

This post covers what broke, why, and what actually fixed it.

---

## The Core Problem: SSR Hydration

Nuxt renders HTML on the server and sends it to the browser. That means elements are visible in the DOM — and technically "enabled" from Playwright's perspective — *before* Vue has finished attaching event handlers. The result is a test that looks correct but silently does nothing:

```ts
// Finds the button, confirms visible and enabled, clicks... nothing happens
await page.getByRole('button', { name: 'Reserve' }).click()
```

The standard Playwright guidance is to use `waitForLoadState('load')` or `waitForLoadState('networkidle')` before interacting. Neither was sufficient here.

- `waitForLoadState('load')` fires when scripts are parsed, but *before* Vue finishes hydrating
- `waitForLoadState('networkidle')` — waiting for 500ms with no network activity — worked locally, but more on why that falls apart in CI below

The reliable fix: Vue 3 sets a `__vue_app__` property on the Nuxt root element (`#__nuxt`) after full hydration. Polling for this property is framework-aware and network-independent:

```ts
async function waitForHydration(page: Page) {
  await page.waitForFunction(
    () => !!(document.querySelector('#__nuxt') as any)?.__vue_app__
  )
}
```

Call this after every navigation before interacting with the page. It's the single most important fix in the entire test suite.

---

## Why `networkidle` Hung in CI

Locally, `networkidle` was a reasonable proxy for hydration — Vue's `onMounted` data fetches would complete, the network would go quiet, and tests would pass. In CI, running against a Vercel preview URL, `networkidle` hung indefinitely and eventually timed out.

The reason: Vercel injects analytics and Speed Insights scripts that make continuous background requests. The network never goes idle. `networkidle` is fundamentally incompatible with Vercel-hosted deployments.

The `waitForHydration` function above solves this completely — it checks the DOM directly with no network dependency.

---

## Vercel Deployment Protection Blocking Playwright

After switching to `waitForHydration`, tests still hung in GitHub Actions. A different problem entirely: Vercel's **Deployment Protection** was intercepting Playwright's requests and serving an auth wall instead of the app.

**Fix:**

1. Enable **Protection Bypass for Automation** in the Vercel project settings and copy the generated secret
2. Add it as a GitHub repository secret
3. Pass it as a request header in `playwright.config.ts`:

```ts
extraHTTPHeaders: process.env.VERCEL_BYPASS_SECRET
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_SECRET }
  : {},
```

---

## Triggering Tests on Deployment, Not on Push

One architectural decision worth calling out: the CI pipeline triggers on `deployment_status`, not `push`. This means every Vercel preview deployment — not just merges to main — gets tested against the real deployed URL:

```yaml
on:
  deployment_status:

jobs:
  test:
    if: github.event.deployment_status.state == 'success'
```

`PLAYWRIGHT_BASE_URL` is set to a unique per-deployment preview URL. Only Chromium is installed in CI to keep run times manageable.

---

## shadcn-vue Select Components: The Portal Problem

shadcn-vue's `Select` component (built on reka-ui) teleports its dropdown options into a DOM portal outside the component tree. This means scoping locators to the select trigger doesn't work — the options simply aren't inside it:

```ts
// ❌ Fails — options are teleported outside the listbox element
await page.getByRole('listbox').getByText('2 Days').click()

// ✅ Works — searches the full page for the option by ARIA role
await page.getByRole('option', { name: '2 Days' }).click()
```

If a click on a shadcn-vue select option appears to do nothing, check whether you're scoping the locator too narrowly.

---

## Semantic Locators Over CSS Selectors

Early in the project, Claude Code used CSS selectors like:

```ts
page.locator('span.text-sm.font-medium.text-muted-foreground')
```


These are brittle. Any styling change — a Tailwind class rename, a component refactor — silently breaks the test with no indication of what went wrong. 

I had to nudge code to Playwright's documentation for the [preferred locators](https://playwright.dev/docs/locators).


---

## Vue Router Navigation Not Triggering Playwright Events

`router.replace()` inside a Vue watcher doesn't always trigger Playwright's built-in navigation event system. `page.waitForURL()` timed out consistently in these cases.

The workaround is to poll `window.location.href` directly:

```ts
// ❌ Can time out when navigation is triggered by a Vue watcher
await page.waitForURL(/week=/)

// ✅ Polls the browser location directly
await page.waitForFunction(
  () => window.location.href.includes('week=')
)
```

---

## The Pattern That Emerges

Looking back, most of these problems share a root cause: **the gap between what Playwright can observe and what the framework has actually finished doing**. SSR hydration, network activity, DOM portals, and client-side router events all fall into this category.

The general principle: when a Playwright interaction silently fails or a wait condition times out, don't assume the locator is wrong. Ask whether the element is *visible* but not yet *ready*, and look for a framework-level signal — not a network or timing heuristic — to wait on.

Claude Code was useful throughout this process for generating test scaffolding and iterating quickly on locator strategies, but the diagnostic work — figuring out *why* something was failing — required reading Nuxt internals, Vercel docs, and Playwright source behavior carefully.

The full test suite is in the [ReserveIt repo](https://github.com/melanieawilson/reserve-it/tree/3a68a86e1a61f05402faa577138a74160aa32ff2/tests) if you want to see how it all fits together.
