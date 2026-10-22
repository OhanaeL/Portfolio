# Portfolio assistant backend

The site is static; this Worker is the one thing it can't do itself — hold the API keys. It is [`@sitepilot/server`](https://github.com/OhanaeL/sitepilot) on Cloudflare's free tier, locked to the site's origin.

Every chat message goes to TypeSafe's Jev first (`src/router.ts`):

1. Off-topic requests get a fixed reply.
2. Questions a prepared answer covers (`src/faq.ts`) get that answer.
3. On-page actions (highlight, open) are run by sitepilot's Jev router.
4. Everything else goes to Gemini, through its OpenAI-compatible endpoint. If Gemini is out of quota or busy, the visitor gets a friendly fallback instead of an error.

Each Jev decision is logged as a `jev` line (Cloudflare dashboard → portfolio-pilot → Logs, or `npx wrangler tail portfolio-pilot`).

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put PILOT_API_KEY      # Gemini API key
npx wrangler secret put TYPESAFE_API_KEY   # Jev; without it every message goes to Gemini
npx wrangler deploy                        # → https://portfolio-pilot.<subdomain>.workers.dev
```

The model, endpoint and allowed origins are in `wrangler.toml`. Set the repository variable `PILOT_URL` to the Worker URL; the deploy workflow passes it to the build as `NEXT_PUBLIC_PILOT_URL`. Flip `site.pilot.enabled` in `lib/site.ts` to hide the widget without redeploying the Worker.

`@sitepilot/server` is installed from a local build until sitepilot is on npm; the site does the same with the tarballs in `vendor/sitepilot/`.

Local: copy `.dev.vars.example` to `.dev.vars`, `npm run dev` (port 8787), and run the site with `NEXT_PUBLIC_PILOT_URL=http://localhost:8787 npm run dev`.
