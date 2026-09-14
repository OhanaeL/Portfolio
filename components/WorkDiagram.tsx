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

const Arrow = ({ d, both }: { d: string; both?: boolean }) => (
  <path className="dg-arrow" d={d} markerEnd="url(#dg-head)" markerStart={both ? "url(#dg-head)" : undefined} />
);

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
    <svg className="dg" viewBox="0 0 560 250" role="img" aria-label="The supervisor launches one process per agent with its own credentials. Each agent receives workspace messages over pub/sub and replies the same way, and calls the reasoning service and episodic memory through the gateway.">
      <Defs />
      <text className="dg-caption" x="24" y="24">SPAWN · REASON · REMEMBER</text>
      <Box x={24} y={104} w={90} h={44} label="Workspace" sub="pub/sub fan-out" />
      <g className="dg-box dg-box--dashed">
        <rect x={146} y={36} width={112} height={206} />
        <text className="dg-caption" x={202} y={50} textAnchor="middle">SUPERVISOR</text>
        <text className="dg-sub" x={202} y={232} textAnchor="middle" dominantBaseline="middle">one process each</text>
      </g>
      <Box x={164} y={62} w={78} h={40} label="Agent" sub="own creds" />
      <Box x={164} y={120} w={78} h={40} label="Agent" sub="own creds" />
      <Box x={164} y={178} w={78} h={40} label="Agent" sub="own creds" />
      <Arrow d="M114 126 C 140 126, 140 82, 164 82" both />
      <Arrow d="M114 126 C 140 126, 140 140, 164 140" both />
      <Arrow d="M114 126 C 140 126, 140 198, 164 198" both />
      <Arrow d="M242 82 C 270 82, 270 126, 298 126" />
      <Arrow d="M242 140 C 270 140, 270 126, 298 126" />
      <Arrow d="M242 198 C 270 198, 270 126, 298 126" />
      <Box x={300} y={104} w={84} h={44} label="Gateway" sub="one API" />
      <Arrow d="M384 126 C 404 126, 404 84, 424 84" />
      <Arrow d="M384 126 C 404 126, 404 172, 424 172" />
      <Box x={426} y={62} w={110} h={44} label="Reasoning" sub="fast + frontier" accent />
      <Box x={426} y={150} w={110} h={44} label="Memory" sub="episodic search" accent />
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
