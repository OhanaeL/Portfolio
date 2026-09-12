import { toolbox, iconUrl, type Tool } from "@/lib/toolbox";

/** Monogram fallback for tools with no logo — keeps the rail even. */
function monogram(name: string) {
  const cleaned = name.replace(/[^A-Za-z0-9 /]/g, "");
  const words = cleaned.split(/[\s/]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return cleaned.slice(0, 2).toUpperCase();
}

function Tile({ tool, group }: { tool: Tool; group: string }) {
  const src = iconUrl(tool);
  return (
    <div className="tool" title={`${tool.name} (${group})`}>
      <div className="tool-icon">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" aria-hidden="true" loading="lazy" width={28} height={28} />
        ) : (
          <span className="tool-mono">{monogram(tool.name)}</span>
        )}
      </div>
      <span className="tool-name">{tool.name}</span>
    </div>
  );
}

export default function Toolbox() {
  const tools: (Tool & { group: string })[] = toolbox.flatMap((g) =>
    g.tools.map((t) => ({ ...t, group: g.title }))
  );

  // The set is rendered twice; the marquee shifts by exactly one set + one gap,
  // so the second copy lands where the first started and the loop is seamless.
  const set = (
    <div className="rail-set">
      {tools.map((t) => (
        <Tile tool={t} group={t.group} key={t.name} />
      ))}
    </div>
  );

  return (
    <section id="toolbox" className="reveal spot" data-spot="after">
      <div className="container">
        <div className="section-head">
          <h2>Toolbox</h2>
          <span className="section-note">{tools.length} tools I actually work in</span>
        </div>

        <div className="rail-wrap">
          <div className="rail">
            {set}
            <div className="rail-set" aria-hidden="true">
              {tools.map((t) => (
                <Tile tool={t} group={t.group} key={`dup-${t.name}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
