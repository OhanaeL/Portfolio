# Portfolio

Personal site, live at [ohanael.github.io/Portfolio](https://ohanael.github.io/Portfolio/). A single-page Next.js app exported as static HTML and published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content

Everything shown on the page comes from `content/` and `lib/site.ts`; no code changes are needed for a content update.

| Where | What it drives |
|-------|----------------|
| `lib/site.ts` | Name, headline, contact links, the About facts and the headline stats |
| `lib/toolbox.ts` | The tools strip (icons are vendored in `public/icons/`) |
| `content/experience/<Title at Company>/metadata.txt` | One timeline row: `description`, `date`, `company`, optional `links` and `title` |
| `content/projects/<Name>/metadata.txt` | One project card: `description`, `date`, `tags`, optional `github`, `demo`, `thumbnail` |
| `content/about/introduction.txt` | The About paragraph |
| `scripts/build_resume.py` | Résumé content. `pip install python-docx` then `python scripts/build_resume.py` writes `content/about/resume.docx` and prints `public/media/about/resume.pdf` through headless Edge |
| `public/media/<section>/<slug>/images/` | Media for an entry; `slug` is the folder name lower-cased with spaces as `-` |

`featured.txt` in `content/experience/` and `content/projects/` is the allow-list of what is published, in order. Entries not listed stay on disk unpublished. Each entry's `description.txt` (markdown, with `[image:file:caption]` and `[website_link:Name]` shortcodes) and `content/accomplishments/` are kept for detail pages but are not rendered on the single-page site today.

A project with a video under `public/media/projects/<slug>/embeds/` and no `demo` link gets a "Demo video" link on its card.

## Site assistant

The ✦ button bottom-right is [sitepilot](https://github.com/OhanaeL/sitepilot): an agent that can point at and open anything on the page. The site stays fully static — the only backend is `worker/`, a Cloudflare Worker holding the LLM key (see its README).

| Where | What it drives |
|-------|----------------|
| `lib/pilot.ts` | The manifest: which elements the assistant can see (by CSS selector) and the hint for each, generated from the same `content/` metadata that renders the page |
| `components/Pilot.tsx` | The widget, plus a `search_portfolio` tool over projects, roles and case studies |
| `worker/src/index.ts` | The persona prompt and the origin allow-list |
| `lib/site.ts` → `pilot.enabled` | Turn the widget off without touching the Worker |

The widget renders only when `NEXT_PUBLIC_PILOT_URL` is set (the deploy workflow reads the `PILOT_URL` repository variable), so a checkout without a Worker builds exactly as before. Locally: `NEXT_PUBLIC_PILOT_URL=http://localhost:8787 npm run dev` with `worker/` running `npm run dev`.

## Development

```bash
npm ci
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export to out/
```

`NEXT_PUBLIC_BASE_PATH` is set by the deploy workflow (`/Portfolio` for this project site); leave it unset locally.
