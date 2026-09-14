import Link from "next/link";
import { site, work } from "@/lib/site";
import Contacts from "@/components/Contacts";
import WorkDiagram from "@/components/WorkDiagram";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">{site.role}</span>
          <h1>{site.headline}</h1>
        </div>
        <div className="btn-row">
          <Link className="btn btn-primary" href="/projects/">
            Explore my work <span aria-hidden="true">→</span>
          </Link>
          <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
            View résumé <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="block">
        <div className="block-head">
          <h2>Professional Work</h2>
          <Link className="more" href="/experience/">
            Explore all work <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="work-grid">
          {work.map((w) => (
            <article className="work" key={w.slug}>
              <div className="work-art">
                <WorkDiagram kind={w.diagram} />
              </div>
              <p className="work-eyebrow">{w.eyebrow}</p>
              <h3>{w.title}</h3>
              <p className="work-blurb">{w.blurb}</p>
              <ul className="stats">
                {w.stats.map(([figure, label]) => (
                  <li key={label}>
                    <b>{figure}</b> {label}
                  </li>
                ))}
              </ul>
              <Link className="more" href={`/experience/#${w.slug}`}>
                Read more <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="block edu-block">
        <div>
          <h2>Education</h2>
          <p className="edu-degree">{site.education.degree}</p>
          <p className="edu-honours">{site.education.honours}</p>
          <p className="muted">
            {site.education.school} · {site.education.years}
          </p>
        </div>
        <Contacts />
      </section>
    </>
  );
}
