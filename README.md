# melanieawilson.com

Personal site for Melanie Wilson — [melanieawilson.com](https://melanieawilson.com).

Built with [Nuxt](https://nuxt.com) + [Nuxt Content](https://content.nuxt.com) using the [Content Wind](https://github.com/Atinux/content-wind) theme. Deployed on [Vercel](https://vercel.com).

## Stack

- **Nuxt 3** — Vue framework
- **Nuxt Content v3** — markdown-driven pages from the `content/` directory
- **TailwindCSS v4** — styling, plus `@tailwindcss/typography` for prose
- **Iconify** (`@nuxt/icon`) — icons via `simple-icons` and `lucide` collections
- **pnpm** — package manager (pinned to `pnpm@10.7.1` in `package.json`)

## Local development

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

If pnpm isn't on your PATH, prefix commands with `npx` (e.g. `npx pnpm dev`).

## Project structure

```
content/            Markdown pages (numeric prefix controls nav order)
app/
  app.config.ts     Site config — socials, default OG cover image
  app.vue           Root layout
  components/       Vue components, including AppNavbar
  layouts/          Page layouts (default, full-width)
  pages/            Dynamic [...slug].vue route that renders content
public/             Static assets (favicon, OG cover image)
nuxt.config.ts      Nuxt config (Shiki theme, modules)
content.config.ts   Nuxt Content collection config
```

## Editing content

Add or edit Markdown files in `content/`. Frontmatter controls navigation, layout, and SEO:

```md
---
navigation:
  title: About
layout: full-width
seo:
  description: Personal website for Melanie Wilson
  image: /og-about.jpg
---

# About

Page body here.
```

`navigation.title` controls the navbar label. `seo.image` sets the per-page OG preview image (falls back to `cover` in `app/app.config.ts`).

## Deployment

Pushes to `main` deploy automatically via Vercel.

To build locally:

```bash
pnpm build       # SSR build (Node server output)
pnpm generate    # static site (output in dist/)
```

## License

The Content Wind theme is MIT-licensed by [Atinux](https://github.com/Atinux). Site content (text and images under `content/` and `public/`) is © Melanie Wilson.
