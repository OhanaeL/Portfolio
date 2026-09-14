import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, list, str, thumbnail, type Entry } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

function ProjectRow({ p }: { p: Entry }) {
  const src = thumbnail(p);
  const github = str(p.meta, "github");
  const demo = str(p.meta, "demo") || str(p.meta, "website");
  const video = !demo && p.embeds[0] ? `${p.mediaBase}/embeds/${encodeURIComponent(p.embeds[0])}` : "";
  const status = str(p.meta, "status");
  return (
    <article className="project">
      <Link className="project-thumb" href={`/projects/${p.slug}/`} aria-hidden="true" tabIndex={-1}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" loading="lazy" />
        ) : (
          <span className="project-mono">{p.name.slice(0, 2)}</span>
        )}
      </Link>
      <div>
        <p className="project-date">
          {str(p.meta, "date")}
          {status && <span className="pill">{status}</span>}
        </p>
        <h3>
          <Link href={`/projects/${p.slug}/`}>{p.name}</Link>
        </h3>
        <p className="project-blurb">{str(p.meta, "description")}</p>
        <ul className="tags">
          {list(p.meta, "tags").map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="links">
          <Link className="more" href={`/projects/${p.slug}/`}>
            Details <span aria-hidden="true">→</span>
          </Link>
          {github && (
            <a className="more" href={github} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          )}
          {demo && (
            <a className="more" href={demo} target="_blank" rel="noopener noreferrer">
              Live demo <span aria-hidden="true">↗</span>
            </a>
          )}
          {video && (
            <a className="more" href={video} target="_blank" rel="noopener noreferrer">
              Demo video <span aria-hidden="true">↗</span>
            </a>
          )}
        </p>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const all = getProjects({ all: true });
  const featured = all.filter((p) => str(p.meta, "featured"));
  const rest = all.filter((p) => !str(p.meta, "featured"));

  return (
    <>
      <div className="page-head">
        <h1>Projects</h1>
      </div>

      <section className="block">
        <h2>Selected Projects</h2>
        <div className="project-grid">
          {featured.map((p) => (
            <ProjectRow p={p} key={p.slug} />
          ))}
        </div>
      </section>

      {rest.length > 0 && (
        <details className="block more-projects">
          <summary>
            More projects <span className="muted">· {rest.length}</span>
          </summary>
          <div className="project-grid">
            {rest.map((p) => (
              <ProjectRow p={p} key={p.slug} />
            ))}
          </div>
        </details>
      )}
    </>
  );
}
