import { createPilotHandler } from "@sitepilot/server";
import { portfolioRouter } from "./router";

interface Env {
  PILOT_API_KEY: string;
  PILOT_BASE_URL: string;
  PILOT_MODEL: string;
  ALLOW_ORIGINS: string;
  PILOT_EXTRA_BODY: string;
  TYPESAFE_API_KEY?: string;
}

const SYSTEM = `You are the guide to Htin Linn's portfolio (he goes by Lynn). Visitors ask where things are, what he built with a given technology, or about a role.

- Be warm and brief: one or two sentences, then act.
- To show something, highlight_element it rather than describing where it is. To open a case study or an external link, click_element it.
- For "what did he build with X" or questions about a role, call search_portfolio first, then highlight the best match.
- Only state facts that are on the site or in the search results. If something isn't there, say so and suggest emailing him.
- Never invent projects, employers, dates or numbers.`;

const BUSY =
  "I can't answer that one right now. Ask me where he's based, what he does or how to reach him, or email him at htinlinn.dev.03@gmail.com.";

const TIMEOUT_MS = 20_000;

// Gemini 3 rejects replayed tool calls without a thought signature, and sitepilot's message cleaning drops it.
const PLACEHOLDER_SIGNATURE = { google: { thought_signature: "skip_thought_signature_validator" } };

const signedFetch: typeof fetch = (input, init) => {
  if (typeof init?.body !== "string") return fetch(input, init);
  const body = JSON.parse(init.body) as { messages?: { tool_calls?: { extra_content?: unknown }[] }[] };
  body.messages?.forEach((m) => m.tool_calls?.forEach((c) => (c.extra_content ??= PLACEHOLDER_SIGNATURE)));
  return fetch(input, { ...init, body: JSON.stringify(body) });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowOrigins = env.ALLOW_ORIGINS.split(",").map((s) => s.trim());
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(TIMEOUT_MS)]);
    const handler = createPilotHandler({
      apiKey: env.PILOT_API_KEY,
      baseURL: env.PILOT_BASE_URL,
      model: env.PILOT_MODEL,
      allowOrigins,
      fetch: signedFetch,
      maxMessages: 40,
      extraBody: JSON.parse(env.PILOT_EXTRA_BODY),
      prompt: { system: SYSTEM },
      ...(env.TYPESAFE_API_KEY && { router: portfolioRouter(env.TYPESAFE_API_KEY) }),
    });
    const res = await handler(new Request(request, { signal })).catch(() => null);
    if (res && res.status !== 429 && res.status < 500) return res;
    const origin = request.headers.get("origin");
    const headers = new Headers(res?.headers ?? { "content-type": "application/json" });
    if (origin && allowOrigins.includes(origin)) headers.set("access-control-allow-origin", origin);
    const reply = { object: "chat.completion", model: env.PILOT_MODEL, choices: [{ index: 0, message: { role: "assistant", content: BUSY }, finish_reason: "stop" }] };
    return new Response(JSON.stringify(reply), { status: 200, headers });
  },
};
