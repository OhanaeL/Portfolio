/**
 * A cross-section of what I ship, top to bottom: interfaces, the services
 * behind them (including the agent runtime), and the data and infra that keep
 * them running. All three layers are mine; the caption says so. HTML only,
 * so the spotlight lights its rings and arrows like the rest of the page.
 */
type Layer = { key: string; label: string; items: readonly string[] };

const LAYERS: readonly Layer[] = [
  {
    key: "ui",
    label: "Interfaces",
    items: ["React", "Next.js", "TypeScript", "dashboards"],
  },
  {
    key: "services",
    label: "Services",
    items: ["Go & Rust services", "FastAPI", "agent runtime", "integrations"],
  },
  {
    key: "data",
    label: "Data & infra",
    items: ["Postgres", "Redis", "Docker", "Grafana / OTel"],
  },
];

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
            </div>
            <ul className="stack-items">
              {layer.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          {i < LAYERS.length - 1 && (
            <div className="stack-link" aria-hidden="true">
              <span className="stack-arrow spot" />
            </div>
          )}
        </div>
      ))}
      <figcaption className="stack-cap">The layers I have owned on product teams.</figcaption>
    </figure>
  );
}
