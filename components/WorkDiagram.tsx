/**
 * Illustrations for the two work cards, drawn as SVG so they follow the
 * theme tokens. Both share one visual grammar: labelled boxes, thin arrows,
 * a filled accent node for the thing I built.
 */
type Props = { kind: "runtime" | "pipeline" };

function Box({ x, y, w, h, label, sub, accent }: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g className={accent ? "dg-box dg-box--accent" : "dg-box"}>
      <rect x={x} y={y} width={w} height={h} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 5 : h / 2 + 1)} textAnchor="middle" dominantBaseline="middle">
        {label}
      </text>
      {sub && (
        <text className="dg-sub" x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" dominantBaseline="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

const Arrow = ({ d }: { d: string }) => <path className="dg-arrow" d={d} markerEnd="url(#dg-head)" />;

function Defs() {
  return (
    <defs>
      <marker id="dg-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0.5 L7.5 4 L0 7.5 Z" />
      </marker>
    </defs>
  );
}

function Runtime() {
  return (
    <svg className="dg" viewBox="0 0 560 250" role="img" aria-label="A workspace message reaches the supervisor, which runs each agent as its own process; agents call the reasoning service, which escalates from a fast model to a frontier model, and read and write agent memory.">
      <Defs />
      <text className="dg-caption" x="24" y="30">SPAWN · REASON · REMEMBER</text>
      <Box x={24} y={104} w={96} h={44} label="Workspace" sub="message" />
      <Arrow d="M120 126 H164" />
      <Box x={166} y={104} w={100} h={44} label="Supervisor" accent />
      <Arrow d="M266 126 C 290 126, 290 62, 314 62" />
      <Arrow d="M266 126 H314" />
      <Arrow d="M266 126 C 290 126, 290 190, 314 190" />
      <Box x={316} y={42} w={78} h={40} label="Agent" sub="process" />
      <Box x={316} y={106} w={78} h={40} label="Agent" sub="process" />
      <Box x={316} y={170} w={78} h={40} label="Agent" sub="process" />
      <Arrow d="M394 62 C 420 62, 420 84, 446 84" />
      <Arrow d="M394 126 C 420 126, 420 84, 446 84" />
      <Arrow d="M394 190 C 420 190, 420 84, 446 84" />
      <Box x={448} y={62} w={92} h={44} label="Reasoning" sub="fast → frontier" accent />
      <Arrow d="M494 106 V150" />
      <Box x={448} y={152} w={92} h={44} label="Memory" sub="episodic recall" accent />
    </svg>
  );
}

function Pipeline() {
  return (
    <svg className="dg" viewBox="0 0 560 250" role="img" aria-label="SalesIQ, Chatwoot and Zoho connect through one integration service; documents and crawled pages pass through an ingestion service to LLM workflows, with Grafana and OpenTelemetry watching every service.">
      <Defs />
      <text className="dg-caption" x="24" y="30">CONNECT · INGEST · OBSERVE</text>
      <Box x={24} y={48} w={88} h={34} label="SalesIQ" />
      <Box x={24} y={92} w={88} h={34} label="Chatwoot" />
      <Box x={24} y={136} w={88} h={34} label="Zoho" />
      <Arrow d="M112 65 C 140 65, 140 109, 168 109" />
      <Arrow d="M112 109 H168" />
      <Arrow d="M112 153 C 140 153, 140 109, 168 109" />
      <Box x={170} y={87} w={104} h={44} label="Integration" sub="service" accent />
      <Box x={24} y={194} w={88} h={34} label="Docs · pages" />
      <Arrow d="M112 211 H168" />
      <Box x={170} y={189} w={104} h={44} label="Ingestion" sub="file → text" accent />
      <Arrow d="M274 109 C 306 109, 306 150, 338 150" />
      <Arrow d="M274 211 C 306 211, 306 150, 338 150" />
      <Box x={340} y={128} w={104} h={44} label="LLM" sub="workflows" />
      <Arrow d="M444 150 H486" />
      <Box x={488} y={128} w={52} h={44} label="Apps" />
      <g className="dg-box dg-box--dashed">
        <rect x={340} y={48} width={200} height={40} />
        <text x={440} y={69} textAnchor="middle" dominantBaseline="middle">Grafana · OpenTelemetry</text>
      </g>
    </svg>
  );
}

export default function WorkDiagram({ kind }: Props) {
  return kind === "runtime" ? <Runtime /> : <Pipeline />;
}
