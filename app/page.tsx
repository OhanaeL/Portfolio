import Link from "next/link";
import { site } from "@/lib/site";
import { getProjects, str, list } from "@/lib/content";
import Toolbox from "@/components/Toolbox";

export default function Home() {
  const projects = getProjects().slice(0, 3);

  return (
    <>
      <div className="container hero">
        <span className="eyebrow">
          {site.role} · {site.location}
        </span>
        <h1>{site.headline}</h1>
        <p className="lede">{site.description}</p>
        <div className="btn-row">
          <Link className="btn btn-primary" href="/projects/">
            View projects
          </Link>
          <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
            Résumé (PDF)
          </a>
          <a className="btn" href={`mailto:${site.email}`}>
            Get in touch
          </a>
        </div>
      </div>

      <div className="container">
        <div className="bento">
        <div className="now bento-main">
          <span className="eyebrow">Currently</span>
          <h2>{site.now.title}</h2>
          <p>{site.now.body}</p>
          <div className="tags">
            {site.now.stack.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>

          {site.stats.map((s) => (
            <div className="stat" key={s.figure}>
              <div className="figure">{s.figure}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Toolbox />

      <section className="container">
        <div className="section-head">
          <h2>Selected work</h2>
          <Link href="/projects/">All projects →</Link>
        </div>
        <div className="grid grid-3">
          {projects.map((p) => (
            <Link className="card" key={p.slug} href={`/projects/${p.slug}/`}>
              <h3>{p.name}</h3>
              {str(p.meta, "date") && <div className="card-meta">{str(p.meta, "date")}</div>}
              <p>{str(p.meta, "description")}</p>
              <div className="tags">
                {list(p.meta, "tags")
                  .slice(0, 4)
                  .map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
