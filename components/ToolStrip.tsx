import { toolbox, iconUrl } from "@/lib/toolbox";

/**
 * "Tools I've worked with": the toolbox flattened into one wrapped row of
 * chips, each with its logo when we have one. Sits at the foot of Experience.
 */
export default function ToolStrip() {
  const tools = toolbox.flatMap((g) => g.tools.map((t) => ({ ...t, group: g.title })));
  return (
    <div className="tools">
      <span className="tools-label">Tools I&apos;ve worked with</span>
      <ul className="tools-list">
        {tools.map((t) => {
          const src = iconUrl(t);
          return (
            <li className="tool-chip" key={t.name} title={`${t.name} (${t.group})`}>
              {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" aria-hidden="true" width={14} height={14} loading="lazy" />
              )}
              {t.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
