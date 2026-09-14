# Portfolio

Personal site, live at [ohanael.github.io/Portfolio](https://ohanael.github.io/Portfolio/). A static Next.js site — Home, Experience, Projects (with a page per project) and Achievements — exported as HTML and published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content

Everything shown on the page comes from `content/` and `lib/site.ts`; no code changes are needed for a content update.

| Where | What it drives |
|-------|----------------|
| `lib/site.ts` | Name, headline, contact links, education, the nav, and the two "Professional Work" cards on the home page |
| `lib/toolbox.ts` | The Skills table on the Experience page |
| `content/experience/<Title at Company>/` | One role: `metadata.txt` (`date`, `company`, optional `title`, `links`, `group`) and the markdown `description.txt` body |
| `content/projects/<Name>/` | One project: `metadata.txt` (`description`, `date`, `tags`, optional `github`, `demo`, `thumbnail`, `status`, `team`, `disclaimer`) and `description.txt` for its page |
| `content/accomplishments/<Mon, YYYY - Title>/` | One achievement; the folder name carries the date and title. `metadata.txt` with `group: awards` lists it under Awards, otherwise Milestones |
| `content/about/introduction.txt` | The lead paragraph on the Experience page |
| `public/media/about/certificates/certificates.txt` | The Certificates list on Achievements |
| `scripts/build_resume.py` | Résumé content. `pip install python-docx` then `python scripts/build_resume.py` writes `content/about/resume.docx` and prints `public/media/about/resume.pdf` through headless Edge |
| `public/media/<section>/<slug>/images/` | Media for an entry; `slug` is the folder name lower-cased with spaces as `-` |

`featured.txt` in `content/experience/` picks the roles shown, in order. In `content/projects/` it picks the "Selected Projects"; everything else appears under "More projects", ordered by `order.txt`. `description.txt` is markdown with two shortcodes: `[image:file:caption]` links to an image in the entry's `images/` folder, `[website_link:Name]` links to that project's page.

A project with a video under `public/media/projects/<slug>/embeds/` shows it on its page and, without a `demo` link, gets a "Demo video" link on the list.

## Development

```bash
npm ci
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export to out/
```

`NEXT_PUBLIC_BASE_PATH` is set by the deploy workflow (`/Portfolio` for this project site); leave it unset locally.
