/**
 * Figures embedded in case-study write-ups via the `[figure:name]` shortcode.
 * Same visual grammar as WorkDiagram: labelled boxes, thin arrows, accent for
 * what I built. The chart is a single series in one hue, directly labelled.
 */

function Box({ x, y, w, h, label, sub, accent, dashed }: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean; dashed?: boolean }) {
  const cls = ["dg-box", accent && "dg-box--accent", dashed && "dg-box--dashed"].filter(Boolean).join(" ");
  return (
    <g className={cls}>
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

const Defs = () => (
  <defs>
    <marker id="dg-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0.5 L7.5 4 L0 7.5 Z" />
    </marker>
  </defs>
);

function BeforeAfter() {
  return (
    <svg className="dg" viewBox="0 0 640 230" role="img" aria-label="Before: every client message goes through one orchestrator that calls the model and replies as a single assistant. After: the supervisor runs each agent as its own process with its own credentials, and each agent subscribes to and replies in the workspace directly.">
      <Defs />
      <text className="dg-caption" x="20" y="26">BEFORE · ONE ORCHESTRATOR</text>
      <Box x={20} y={64} w={84} h={40} label="Client" />
      <Box x={20} y={120} w={84} h={40} label="Client" />
      <Arrow d="M104 84 C 130 84, 130 112, 156 112" />
      <Arrow d="M104 140 C 130 140, 130 112, 156 112" />
      <Box x={158} y={90} w={110} h={44} label="Orchestrator" sub='replies as "assistant"' dashed />
      <Arrow d="M268 112 H294" />
      <Box x={296} y={92} w={52} h={40} label="Model" />
      <line className="dg-arrow" x1="360" y1="20" x2="360" y2="215" strokeDasharray="3 4" />
      <text className="dg-caption" x="384" y="26">AFTER · AGENTS AS PARTICIPANTS</text>
      <Box x={384} y={100} w={92} h={44} label="Supervisor" sub="spawns · creds" accent />
      <Arrow d="M476 122 C 496 122, 496 64, 516 64" />
      <Arrow d="M476 122 H516" />
      <Arrow d="M476 122 C 496 122, 496 180, 516 180" />
      <Box x={518} y={44} w={54} h={40} label="Agent" sub="own creds" />
      <Box x={518} y={102} w={54} h={40} label="Agent" sub="own creds" />
      <Box x={518} y={160} w={54} h={40} label="Agent" sub="own creds" />
      <Arrow d="M572 64 H600" both />
      <Arrow d="M572 122 H600" both />
      <Arrow d="M572 180 H600" both />
      <rect className="dg-lane" x={602} y={36} width={22} height={172} />
      <text className="dg-sub dg-vert" transform="translate(616 122) rotate(90)" textAnchor="middle" dominantBaseline="middle">workspace channel</text>
    </svg>
  );
}

function Escalation() {
  return (
    <svg className="dg" viewBox="0 0 640 200" role="img" aria-label="A turn goes to the fast model first. It must answer through a single tool call that says whether the answer is final. If final, the reply is sent; if not, the same turn and context are handed to the frontier model, which may call tools before replying.">
      <Defs />
      <text className="dg-caption" x="20" y="26">ONE TURN · TWO MODELS</text>
      <Box x={20} y={78} w={70} h={40} label="Turn" />
      <Arrow d="M90 98 H126" />
      <Box x={128} y={78} w={92} h={40} label="Fast model" sub="cheap, quick" />
      <Arrow d="M220 98 H256" />
      <Box x={258} y={72} w={104} h={52} label="answer tool" sub="is_final?" accent />
      <Arrow d="M362 88 C 386 88, 386 60, 410 60" />
      <text className="dg-sub" x="386" y="52" textAnchor="middle">yes</text>
      <Box x={412} y={40} w={72} h={40} label="Reply" />
      <Arrow d="M362 108 C 386 108, 386 148, 410 148" />
      <text className="dg-sub" x="386" y="160" textAnchor="middle">no</text>
      <Box x={412} y={128} w={104} h={40} label="Frontier model" sub="same context" accent />
      <Arrow d="M516 148 H546" />
      <Box x={548} y={128} w={72} h={40} label="Tools" sub="native calls" />
      <Arrow d="M584 128 C 584 96, 484 96, 484 82" />
    </svg>
  );
}

function Bundle() {
  return (
    <svg className="dg" viewBox="0 0 640 230" role="img" aria-label="An agent is a bundle of four things it owns: an identity, a personality, its memories and a running process. The bundle joins workspaces, which are rooms it visits rather than things that own it.">
      <Defs />
      <text className="dg-caption" x="20" y="26">THE AGENT OWNS THE BUNDLE · ROOMS ARE VISITED</text>
      <g className="dg-box dg-box--dashed">
        <rect x={20} y={44} width={300} height={166} />
        <text className="dg-caption" x={170} y={60} textAnchor="middle">AGENT</text>
      </g>
      <Box x={40} y={76} w={122} h={44} label="Identity" sub="own credentials" accent />
      <Box x={178} y={76} w={122} h={44} label="Personality" sub="versioned, per person" />
      <Box x={40} y={140} w={122} h={44} label="Memory" sub="its own point of view" accent />
      <Box x={178} y={140} w={122} h={44} label="Process" sub="one per agent" accent />
      <Arrow d="M320 100 C 350 100, 350 80, 380 80" />
      <Arrow d="M320 154 C 350 154, 350 174, 380 174" />
      <text className="dg-sub" x="350" y="120" textAnchor="middle">joins</text>
      <Box x={382} y={58} w={120} h={44} label="Workspace A" sub="a room" />
      <Box x={382} y={152} w={120} h={44} label="Workspace B" sub="another room" />
      <text className="dg-sub" x="520" y="80" dominantBaseline="middle">people + other agents</text>
      <text className="dg-sub" x="520" y="174" dominantBaseline="middle">people + other agents</text>
    </svg>
  );
}

/** GPQA, gpt-5.2, same model for every strategy. Source: internal benchmark run, June 2026. */
const GPQA = [
  { name: "Direct call", pct: 40.2, n: 400 },
  { name: "MCTS", pct: 62.4, n: 90 },
  { name: "RLM", pct: 73.8, n: 400 },
];

function GpqaChart() {
  const left = 118;
  const barH = 22;
  const gap = 18;
  const scale = 4.4;
  return (
    <svg className="dg dg-chart" viewBox="0 0 640 170" role="img" aria-label="GPQA accuracy with the same model: direct call 40.2 percent over 400 questions, MCTS 62.4 percent over 90, RLM 73.8 percent over 400.">
      <text className="dg-caption" x="20" y="26">GPQA ACCURACY · SAME MODEL (GPT-5.2) · JUNE 2026</text>
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line className="dg-grid" x1={left + t * scale} y1={44} x2={left + t * scale} y2={44 + GPQA.length * (barH + gap) - gap + 6} />
          <text className="dg-sub" x={left + t * scale} y={160} textAnchor="middle">{t}%</text>
        </g>
      ))}
      {GPQA.map((d, i) => {
        const y = 44 + i * (barH + gap);
        return (
          <g key={d.name}>
            <title>{`${d.name}: ${d.pct}% (n=${d.n})`}</title>
            <text x={left - 12} y={y + barH / 2} textAnchor="end" dominantBaseline="middle" className="dg-label">{d.name}</text>
            <rect className="dg-bar" x={left} y={y} width={d.pct * scale} height={barH} />
            <text x={left + d.pct * scale + 8} y={y + barH / 2} dominantBaseline="middle" className="dg-label">
              {d.pct}% <tspan className="dg-sub">n={d.n}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const FIGURES: Record<string, { el: React.ReactNode; caption: string }> = {
  bundle: {
    el: <Bundle />,
    caption: "What an agent owns, and what it only visits.",
  },
  "before-after": {
    el: <BeforeAfter />,
    caption: "Before: one orchestrator replies for every agent. After: one process and one identity per agent.",
  },
  escalation: {
    el: <Escalation />,
    caption: "Mid-turn escalation. The fast model answers through one tool call that says whether the answer is final. If it is not, the frontier model takes the same turn.",
  },
  "gpqa-chart": {
    el: <GpqaChart />,
    caption: "Graduate-level science questions, one model, three strategies.",
  },
};

export default function CaseFigure({ name }: { name: string }) {
  const f = FIGURES[name];
  if (!f) return null;
  return (
    <figure className="case-figure work-art">
      {f.el}
      <figcaption>{f.caption}</figcaption>
    </figure>
  );
}
