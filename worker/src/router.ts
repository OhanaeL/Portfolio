import { JEV_CALL_PREFIX, type JevAnswer, type PilotRouter, type RouteDecision } from "@sitepilot/server";
import { FAQ, OFF_TOPIC } from "./faq";

const THRESHOLD = 0.7;
const ACT_THRESHOLD = 0.5;
const EARLIER_MESSAGES = 6;
const MAX_ELEMENTS = 255;
const ACTIONS = ["highlight_element", "click_element"];
const FINISH: Record<string, string> = { highlight_element: "Here it is.", click_element: "Done." };

type Json = Record<string, unknown>;

const llm: RouteDecision = { route: "llm" };
const say = (content: string): RouteDecision => ({ route: "self", content, toolCalls: [], model: "jev" });

const sure = (a: JevAnswer | undefined): number =>
  !a ? 0 : a.type === "noul" ? Math.max(a.noul, 1 - a.noul) : (a.probabilities[a.choice] ?? 0);

/** After a Jev step: finish once it landed, hand to the LLM otherwise. Jev is never asked twice in one turn. */
function followUp(turn: Json[]): RouteDecision {
  const calls = turn.flatMap((m) => (m["role"] === "assistant" ? ((m["tool_calls"] as Json[] | undefined) ?? [null]) : []));
  if (!calls.length || calls.some((c) => !c || !String(c["id"]).startsWith(JEV_CALL_PREFIX))) return llm;
  const call = calls.at(-1)!;
  const last = turn.at(-1);
  const name = String((call["function"] as Json)["name"]);
  const landed = last?.["role"] === "tool" && last["tool_call_id"] === call["id"] && String(last["content"]).startsWith("Done:");
  return landed && FINISH[name] ? say(FINISH[name]) : llm;
}

/**
 * One Jev call per visitor message, every judgment in parallel: is it about
 * Lynn, does a prepared answer cover it, is it one on-page action and on which
 * element. Only what none of those settles reaches the LLM.
 */
export function portfolioRouter(apiKey: string): PilotRouter {
  return async ({ messages, tools, context, signal }) => {
    const start = messages.map((m) => m["role"] === "user" && typeof m["content"] === "string").lastIndexOf(true);
    if (start < 0) return llm;
    if (start !== messages.length - 1) return followUp(messages.slice(start + 1));

    const offered = tools.map((t) => t["function"] as Json).filter((f) => ACTIONS.includes(String(f["name"])));
    const elements = (context?.screen.ambient ?? []).slice(0, MAX_ELEMENTS);
    const canAct = offered.length > 0 && elements.length > 0;
    const actions = Object.fromEntries(offered.map((f) => [String(f["name"]), String(f["description"] ?? f["name"])]));
    const earlier = messages
      .slice(0, start)
      .filter((m) => (m["role"] === "user" || m["role"] === "assistant") && typeof m["content"] === "string" && m["content"])
      .slice(-EARLIER_MESSAGES)
      .map((m) => ({ speaker: m["role"], text: m["content"] }));

    const questions: Json = {
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
      ...(canAct && {
        act: {
          type: "noul",
          instructions:
            "Is `user_request` only one of the `actions` done to one of the `screen.elements`, so that doing it is the whole answer and nothing needs to be written back?",
          criteria: {
            true: "The user wants something shown or opened, such as 'where is X', 'show me X', 'open X', and that element is in `screen.elements`.",
            false: "It needs words in reply (how, why, what, who), is a greeting or thanks, needs something not in `screen.elements`, or needs several steps.",
          },
        },
        tool: { type: "choice", instructions: "Which of the `actions` does `user_request` ask for?", criteria: actions },
        target: {
          type: "choice",
          instructions: "Which element in `screen.elements` is `user_request` about?",
          criteria: Object.fromEntries(elements.map((e) => [e.key, e.hint ? `${e.description} — ${e.hint}` : e.description])),
        },
      }),
    };

    let answers: Record<string, JevAnswer>;
    try {
      const res = await fetch("https://api.typesafe.ai/v1/systemone", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "jev-latest",
          state: {
            user_request: messages[start]!["content"],
            ...(earlier.length && { earlier_conversation: earlier }),
            ...(canAct && {
              screen: {
                route: context?.screen.path ?? "",
                elements: elements.map((e) => ({ key: e.key, description: e.description, ...(e.hint && { hint: e.hint }) })),
              },
              actions,
            }),
          },
          questions,
        }),
        signal,
      });
      if (!res.ok) return llm;
      answers = ((await res.json()) as { answers: Record<string, JevAnswer> }).answers;
    } catch {
      return llm;
    }

    const choice = (id: string) => (answers[id]?.type === "choice" ? answers[id].choice : undefined);
    console.log("jev", JSON.stringify(Object.fromEntries(Object.entries(answers).map(([id, a]) => [id, a.type === "noul" ? +a.noul.toFixed(2) : [a.choice, +sure(a).toFixed(2)]]))));

    const onTopic = answers["on_topic"];
    if (onTopic?.type === "noul" && onTopic.noul <= 1 - THRESHOLD) return say(OFF_TOPIC);

    const faq = choice("answer");
    if (faq && faq !== "none" && FAQ[faq] && sure(answers["answer"]) >= THRESHOLD) return say(FAQ[faq].answer);

    const act = answers["act"];
    const tool = choice("tool");
    const target = choice("target");
    if (
      act?.type === "noul" &&
      act.noul >= ACT_THRESHOLD &&
      tool &&
      target &&
      sure(answers["tool"]) >= ACT_THRESHOLD &&
      sure(answers["target"]) >= ACT_THRESHOLD
    ) {
      return { route: "self", content: null, toolCalls: [{ id: `${JEV_CALL_PREFIX}${crypto.randomUUID()}`, name: tool, args: { target } }], model: "jev" };
    }
    return llm;
  };
}
