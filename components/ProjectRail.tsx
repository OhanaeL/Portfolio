import { str, list, type Entry } from "@/lib/content";

function monogram(name: string) {
  const words = name.split(/[\s-]+/).filter((w) => /^[A-Za-z0-9]/.test(w));
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

/** Thumbnail: explicit `thumbnail:` in metadata, else the first gallery image. */
function thumb(p: Entry) {
  const pick = str(p.meta, "thumbnail") || p.gallery[0];
  return pick ? `${p.mediaBase}/images/${encodeURIComponent(pick)}` : undefined;
}

/** Everything about a project lives on the card: image, name, blurb, tags, links. */
function Card({ p, hidden }: { p: Entry; hidden?: boolean }) {
  const src = thumb(p);
  const github = str(p.meta, "github");
  const demo = str(p.meta, "demo") || str(p.meta, "website");
  const tab = hidden ? -1 : undefined;
  return (
    <article className="proj spot" aria-hidden={hidden || undefined}>
      <div className="proj-thumb">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" />
        ) : (
          <span className="proj-mono">{monogram(p.name)}</span>
        )}
      </div>
      <div className="proj-body">
        <h3 className="proj-name">{p.name}</h3>
        {str(p.meta, "description") && <p className="proj-desc">{str(p.meta, "description")}</p>}
        <div className="proj-meta">
          {str(p.meta, "date") && <span className="proj-date">{str(p.meta, "date")}</span>}
          {list(p.meta, "tags")
            .slice(0, 3)
            .map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
        </div>
        {(github || demo) && (
          <div className="proj-links">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" tabIndex={tab}>
                GitHub <span aria-hidden="true">↗</span>
              </a>
            )}
            {demo && (
              <a href={demo} target="_blank" rel="noopener noreferrer" tabIndex={tab}>
                Live <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/** Marquee of project cards, drifting right to left. */
export default function ProjectRail({ projects }: { projects: Entry[] }) {
  return (
    <div className="rail-wrap">
      <div className="rail rail--projects">
        <div className="rail-set">
          {projects.map((p) => (
            <Card p={p} key={p.slug} />
          ))}
        </div>
        <div className="rail-set">
          {projects.map((p) => (
            <Card p={p} hidden key={`dup-${p.slug}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
