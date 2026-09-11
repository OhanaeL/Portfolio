import { asset } from "@/lib/paths";
import { getAbout, str } from "@/lib/content";
import { site } from "@/lib/site";

const pretty = (f: string) =>
  f.replace(/\.(pdf|png|jpg|jpeg)$/i, "").replace(/([a-z])([A-Z])/g, "$1 $2");

/** The old /about page, folded into one two-column block: who + prose + certificates. */
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

        {about.certificates.length > 0 && (
          <div className="certs">
            <span className="certs-label">Certificates</span>
            <div className="certs-list">
              {about.certificates.map((c) => (
                <a
                  className="cert"
                  key={c}
                  href={asset(`/media/about/certificates/${encodeURIComponent(c)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pretty(c)} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
