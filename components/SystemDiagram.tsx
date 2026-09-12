/**
 * A cross-section of what I ship, top to bottom: interfaces, the services
 * behind them (including the agent runtime), and the data and infra that keep
 * them running. All three layers are mine; the caption says so. HTML only,
 * so the spotlight lights its rings and wires like the rest of the page.
 */
type Layer = { key: string; label: string; note: string; items: readonly string[] };

const LAYERS: readonly Layer[] = [
  {
    key: "ui",
    label: "Interfaces",
    note: "what users see",
    items: ["React", "Next.js", "TypeScript", "dashboards"],
  },
  {
    key: "services",
    label: "Services",
    note: "where the logic lives",
    items: ["Go & Rust services", "FastAPI", "agent runtime", "integrations"],
  },
  {
    key: "data",
    label: "Data & infra",
    note: "what keeps it running",
    items: ["Postgres", "Redis", "Docker", "Grafana / OTel"],
  },
];

const VERBS = ["calls", "reads / writes"];

export default function SystemDiagram() {
  return (
    <figure
      className="stack"
      aria-label="Three layers I work across: interfaces, services including the agent runtime, and data and infrastructure."
    >
      {LAYERS.map((layer, i) => (
        <div key={layer.key} className="stack-row">
          <div className="stack-layer spot">
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
              <span className="stack-verb">{VERBS[i]}</span>
            </div>
          )}
        </div>
      ))}
      <figcaption className="stack-cap">I work across all three layers, end to end.</figcaption>
    </figure>
  );
}
