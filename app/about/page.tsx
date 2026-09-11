import type { Metadata } from "next";
import { getAbout, str } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — ${site.role} based in ${site.location}.`,
};

export default function AboutPage() {
  const about = getAbout();
  const topSkills = [...about.skills].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="container">
      <div className="detail-head">
        <span className="eyebrow">About</span>
        <div className="about-head">
          <img src="/media/about/profile.png" alt={site.name} width={132} height={132} />
          <div>
            <h1 style={{ margin: "0 0 .4rem" }}>{str(about.info, "name") || site.name}</h1>
            <p className="sub" style={{ margin: 0 }}>
              {site.role} · {site.location}
            </p>
            <div className="btn-row" style={{ marginTop: "1rem" }}>
              <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
                Résumé (PDF)
              </a>
              <a className="btn" href={`mailto:${site.email}`}>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {about.sections.map((s) => (
        <section key={s.key} style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2>{s.title}</h2>
          </div>
          <article className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}

      {topSkills.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Skills</h2>
          </div>
          <div className="grid grid-2">
            <div>
              {topSkills.map((sk) => (
                <div className="skill" key={sk.name}>
                  <div className="skill-top">
                    <span>{sk.name}</span>
                    <span>{sk.label}</span>
                  </div>
                  <div className="bar">
                    <i style={{ width: `${Math.max(0, Math.min(100, sk.score))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {about.certificates.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Certificates</h2>
          </div>
          <div className="grid grid-3">
            {about.certificates.map((c) => (
              <a
                className="card"
                key={c}
                href={`/media/about/certificates/${encodeURIComponent(c)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3>{c.replace(/\.(pdf|png|jpg|jpeg)$/i, "").replace(/([a-z])([A-Z])/g, "$1 $2")}</h3>
                <p className="card-meta">{c.split(".").pop()?.toUpperCase()}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
