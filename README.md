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

`featured.txt` in `content/experience/` and `content/projects/` is the allow-list of what is published, in order. Entries not listed stay on disk unpublished. An experience entry's `description.txt` (markdown, with `[image:file:caption]`, `[figure:name]` and `[website_link:Name]` shortcodes) renders as its case-study page when `lib/site.ts` → `work` lists it. Project descriptions and `content/accomplishments/` are kept on disk but not rendered.

A project with a video under `public/media/projects/<slug>/embeds/` and no `demo` link gets a "Demo video" link on its card.

## Site assistant

The ✦ button bottom-right is [sitepilot](https://github.com/OhanaeL/sitepilot): an agent that can point at and open anything on the page. The site stays fully static. The only backend is `worker/`, a Cloudflare Worker holding the API keys (see its README).

| Where | What it drives |
|-------|----------------|
| `lib/pilot.ts` | The manifest: which elements the assistant can see (by CSS selector) and the hint for each, generated from the same `content/` metadata that renders the page |
| `components/Pilot.tsx` | The widget, its starter questions, the site-wide chat history (cleared with New conversation) and a `search_portfolio` tool over projects, roles and case studies |
| `worker/src/router.ts` | The Jev call that answers, acts or hands each message to Gemini |
| `worker/src/faq.ts` | The prepared answers Jev can pick |
| `worker/src/index.ts` | The Gemini persona prompt and the friendly fallback when Gemini is unavailable |
| `worker/wrangler.toml` | Model, endpoint and the origin allow-list |
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
