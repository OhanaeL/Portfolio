import { asset } from "@/lib/paths";
import { getAbout, str } from "@/lib/content";
import { site } from "@/lib/site";

/** The old /about page, folded into one two-column block: who + prose + facts. */
export default function AboutSection() {
  const about = getAbout();

  return (
    <div className="about">
      <aside className="about-side">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/media/about/profile.png")} alt={site.name} width={132} height={132} />
        <div className="about-who">
          <strong>{str(about.info, "name") || site.name}</strong>
          <span>
            {site.role} · {site.location}
          </span>
        </div>
        <div className="about-actions">
          <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
            Résumé (PDF)
          </a>
          <a className="btn" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </aside>

      <div className="about-body">
        {about.sections.map((s) => (
          <article className="prose" key={s.key} dangerouslySetInnerHTML={{ __html: s.html }} />
        ))}

        <dl className="facts">
          {site.facts.map(([k, v]) => (
            <div className="fact spot" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

      </div>
    </div>
  );
}
