/**
 * The agent runtime, as a diagram: supervisor -> isolated agent processes ->
 * reasoning service -> memory. Everything is HTML so the spotlight system
 * (hairline rings and lines keyed by --x/--y) treats it like the rest of the
 * page. Geometry is percent-based inside a fixed-height stage; connectors
 * are orthogonal so every line is a straight div.
 *
 * Stage coordinates (percent of height for y, percent of width for x):
 *   supervisor    y  0..14
 *   bus 1         y  22        (drops at x 16.7 / 50 / 83.3)
 *   agents        y 31..45
 *   bus 2         y 54
 *   reasoning     y 62..76
 *   memory        y 86..100
 */
const AGENTS = ["agent", "agent", "agent"] as const;
const COLS = [16.7, 50, 83.3];

function Node({
  title,
  sub,
  style,
}: {
  title: string;
  sub?: string;
  style: React.CSSProperties;
}) {
  return (
    <div className="sys-node spot" style={style}>
      <span className="sys-title">{title}</span>
      {sub && <span className="sys-sub">{sub}</span>}
    </div>
  );
}

/** A straight connector; `flow` adds a travelling packet with an optional delay. */
function Line({
  style,
  dir,
  delay = 0,
  flow = true,
}: {
  style: React.CSSProperties;
  dir: "v" | "h";
  delay?: number;
  flow?: boolean;
}) {
  return (
    <div className={`sys-line sys-line--${dir} spot`} style={style} aria-hidden="true">
      {flow && <i style={{ animationDelay: `${delay}s` }} />}
    </div>
  );
}

export default function SystemDiagram() {
  return (
    <figure className="sys" aria-label="Diagram of the agent runtime: a supervisor launches isolated agent processes, which call the reasoning service, which reads and writes agent memory.">
      <Node title="Supervisor" sub="one isolated, credentialed process per agent" style={{ left: "25%", width: "50%", top: "0%", height: "14%" }} />

      {/* supervisor down to bus 1 */}
      <Line dir="v" style={{ left: "50%", top: "14%", height: "8%" }} delay={0} />
      {/* bus 1 */}
      <Line dir="h" style={{ left: `${COLS[0]}%`, width: `${COLS[2] - COLS[0]}%`, top: "22%" }} flow={false} />
      {/* drops to agents */}
      {COLS.map((x, i) => (
        <Line key={`d1-${i}`} dir="v" style={{ left: `${x}%`, top: "22%", height: "9%" }} delay={0.6 + i * 0.35} />
      ))}

      {AGENTS.map((a, i) => (
        <Node key={`a-${i}`} title={a} sub="isolated process" style={{ left: `${COLS[i] - 13}%`, width: "26%", top: "31%", height: "14%" }} />
      ))}

      {/* agents down to bus 2 */}
      {COLS.map((x, i) => (
        <Line key={`d2-${i}`} dir="v" style={{ left: `${x}%`, top: "45%", height: "9%" }} delay={1.5 + i * 0.35} />
      ))}
      {/* bus 2 */}
      <Line dir="h" style={{ left: `${COLS[0]}%`, width: `${COLS[2] - COLS[0]}%`, top: "54%" }} flow={false} />
      {/* bus 2 down to reasoning */}
      <Line dir="v" style={{ left: "50%", top: "54%", height: "8%" }} delay={2.4} />

      <Node title="Reasoning service" sub="decides the next step" style={{ left: "22%", width: "56%", top: "62%", height: "14%" }} />

      {/* reasoning <-> memory */}
      <Line dir="v" style={{ left: "50%", top: "76%", height: "10%" }} delay={3.1} />

      <Node title="Memory" sub="carried between turns" style={{ left: "31%", width: "38%", top: "86%", height: "14%" }} />
    </figure>
  );
}
