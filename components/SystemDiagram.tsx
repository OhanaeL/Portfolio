/**
 * The headline, drawn: AI agents sit on top of the runtime I build, which sits
 * on models and infrastructure. Three layers, the middle one is mine.
 * HTML only, so the spotlight lights its rings and connectors like the rest
 * of the page; the packets on the connectors show traffic moving through.
 */
type Layer = { key: string; label: string; note: string; items: readonly string[]; mine?: boolean };

const LAYERS: readonly Layer[] = [
  {
    key: "agents",
    label: "AI agents",
    note: "what people use",
    items: ["support agent", "sales agent", "research agent", "coding agent"],
  },
  {
    key: "runtime",
    label: "Agent runtime",
    note: "what I build",
    items: ["supervisor", "reasoning service", "memory", "tool calling"],
    mine: true,
  },
  {
    key: "infra",
    label: "Models & infra",
    note: "what it runs on",
    items: ["LLM APIs", "Postgres", "Redis", "Docker"],
  },
];

export default function SystemDiagram() {
  return (
    <figure
      className="stack"
      aria-label="Three layers: AI agents on top, the agent runtime I build in the middle, models and infrastructure underneath."
    >
      {LAYERS.map((layer, i) => (
        <div key={layer.key} className="stack-row">
          <div className={layer.mine ? "stack-layer stack-layer--mine spot" : "stack-layer spot"}>
            <div className="stack-head">
              <span className="stack-label">{layer.label}</span>
              <span className="stack-note">{layer.note}</span>
            </div>
            <ul className="stack-items">
              {layer.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          {i < LAYERS.length - 1 && (
            <div className="stack-link" aria-hidden="true">
              {[0, 1, 2].map((n) => (
                <span key={n} className="stack-wire spot">
                  <i style={{ animationDelay: `${i * 1.1 + n * 0.45}s` }} />
                </span>
              ))}
              <span className="stack-verb">{i === 0 ? "runs on" : "built on"}</span>
            </div>
          )}
        </div>
      ))}
    </figure>
  );
}
