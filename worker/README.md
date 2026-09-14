# Portfolio assistant backend

The site is static; this Worker is the one thing it can't do itself — hold the LLM key. It is [`@sitepilot/server`](https://github.com/OhanaeL/sitepilot) on Cloudflare's free tier, locked to the site's origin.

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put PILOT_API_KEY      # a budget-capped key
npx wrangler deploy                        # → https://portfolio-pilot.<account>.workers.dev
```

Then set the repository variable `PILOT_URL` to that URL; the deploy workflow passes it to the build as `NEXT_PUBLIC_PILOT_URL`. Flip `site.pilot.enabled` in `lib/site.ts` to hide the widget without redeploying the Worker.

Local: copy `.dev.vars.example` to `.dev.vars`, `npm run dev` (port 8787), and run the site with `NEXT_PUBLIC_PILOT_URL=http://localhost:8787 npm run dev`.
