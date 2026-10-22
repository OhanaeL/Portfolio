import { jevRouter, type JevAnswer, type PilotRouter, type RouteInput } from "@sitepilot/server";
import { FAQ, OFF_TOPIC } from "./faq";

const THRESHOLD = 0.7;
const EARLIER_MESSAGES = 6;

type Json = Record<string, unknown>;

const QUESTIONS: Json = {
  on_topic: {
    type: "noul",
    instructions:
      "Is `user_request` about Htin Linn (Lynn): his work, projects, skills, education, background or how to reach him, or about this portfolio site and finding things on it?",
    criteria: {
      true: "It asks about Lynn, his roles, projects, skills, results or contact details, how or why he built something, asks to see or open something on the site, or is a greeting or thanks.",
      false: "It asks for something unrelated to Lynn or this site, such as writing code, general knowledge, homework, or chatting about other topics.",
    },
  },
  answer: {
    type: "choice",
    instructions: "Which prepared answer fully answers `user_request`? Pick `none` unless one of them answers the whole request on its own.",
    criteria: {
      ...Object.fromEntries(Object.entries(FAQ).map(([id, f]) => [id, f.question])),
      none: "None of the prepared answers is about what the user asked, or the user wants something shown or opened on the page.",
    },
  },
};

async function ask(apiKey: string, input: RouteInput, request: string, earlier: Json[]): Promise<Record<string, JevAnswer> | null> {
  const transcript = earlier
    .filter((m) => (m["role"] === "user" || m["role"] === "assistant") && typeof m["content"] === "string" && m["content"])
    .slice(-EARLIER_MESSAGES)
    .map((m) => ({ speaker: m["role"], text: m["content"] }));
  try {
    const res = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "jev-latest",
        state: { user_request: request, ...(transcript.length && { earlier_conversation: transcript }) },
        questions: QUESTIONS,
      }),
      signal: input.signal,
    });
    return res.ok ? ((await res.json()) as { answers: Record<string, JevAnswer> }).answers : null;
  } catch {
    return null;
  }
}

/**
 * Jev in front of everything: off-topic requests get a fixed reply, questions a
 * prepared answer covers get that answer, on-page actions go to sitepilot's
 * jevRouter, and only the rest reaches the LLM.
 */
export function portfolioRouter(apiKey: string): PilotRouter {
  const act = jevRouter({ apiKey, threshold: THRESHOLD });
  return async (input) => {
    const start = input.messages.map((m) => m["role"] === "user" && typeof m["content"] === "string").lastIndexOf(true);
    if (start < 0 || start !== input.messages.length - 1) return act(input);

    const answers = await ask(apiKey, input, input.messages[start]!["content"] as string, input.messages.slice(0, start));
    if (!answers) return act(input);

    const onTopic = answers["on_topic"];
    console.log("jev", JSON.stringify({ on_topic: onTopic, answer: answers["answer"] }));
    if (onTopic?.type === "noul" && onTopic.noul <= 1 - THRESHOLD) {
      return { route: "self", content: OFF_TOPIC, toolCalls: [], model: "jev" };
    }
    const pick = answers["answer"];
    if (pick?.type === "choice" && pick.choice !== "none" && FAQ[pick.choice] && (pick.probabilities[pick.choice] ?? 0) >= THRESHOLD) {
      return { route: "self", content: FAQ[pick.choice]!.answer, toolCalls: [], model: "jev" };
    }
    return act(input);
  };
}
