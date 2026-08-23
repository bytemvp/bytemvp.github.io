# Blog

Personal blog and online tools built with [Astro](https://astro.build), pure static output, deployable to both GitHub Pages and Cloudflare Pages.

## Topics

- AI & Machine Learning
- Developer Tools & Workflows
- Tech Industry Analysis

## Commands

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview the built site locally |
| `npm run check` | Build + TypeScript check |

## Deployment

- **GitHub Pages**: push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/`. In the repo settings (Settings → Pages), set Source to "GitHub Actions".
- **Cloudflare Pages**: connect this repository in the Cloudflare dashboard, set Build command to `npm run build` and Build output directory to `dist`.

## Tech Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS
- **Content:** Markdown & MDX
- **Deployment:** GitHub Pages / Cloudflare Pages
