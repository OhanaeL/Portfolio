import type { Metadata } from "next";
import { getAccomplishments, getCertificates, str, thumbnail, type Entry } from "@/lib/content";

export const metadata: Metadata = { title: "Achievements" };

function Row({ e }: { e: Entry }) {
  const src = thumbnail(e);
  return (
    <article className={src ? "ach" : "ach ach--noimg"}>
      {src && (
        <div className="ach-thumb">
          <a href={src} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
          </a>
        </div>
      )}
      <div>
        <header className="role-head">
          <h3>{str(e.meta, "title") || e.name}</h3>
          <span className="role-date">{str(e.meta, "date")}</span>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
      </div>
    </article>
  );
}

export default function AchievementsPage() {
  const all = getAccomplishments();
  const awards = all.filter((e) => str(e.meta, "group") === "awards");
  const milestones = all.filter((e) => str(e.meta, "group") !== "awards");
  const certs = getCertificates();

  return (
    <>
      <div className="page-head">
        <h1>Achievements</h1>
      </div>

      <section className="block">
        <h2>Awards &amp; Recognition</h2>
        {awards.map((e) => (
          <Row e={e} key={e.slug} />
        ))}
      </section>

      <section className="block">
        <h2>Certificates</h2>
        {certs.map((c) => (
          <article className="ach" key={c.file}>
            <div className="ach-thumb ach-thumb--doc">
              <a href={c.file} target="_blank" rel="noopener noreferrer">
                {/\.(png|jpe?g|webp)$/i.test(c.file) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.file} alt="" loading="lazy" />
                ) : (
                  <span>PDF</span>
                )}
              </a>
            </div>
            <div>
              <header className="role-head">
                <div>
                  <h3>{c.title}</h3>
                  <p className="role-org">{c.from}</p>
                </div>
                <span className="role-date">{c.year}</span>
              </header>
              <p className="muted">{c.description}</p>
              <p className="links">
                <a className="more" href={c.file} target="_blank" rel="noopener noreferrer">
                  Certificate <span aria-hidden="true">↗</span>
                </a>
                {c.verification && (
                  <a className="more" href={c.verification} target="_blank" rel="noopener noreferrer">
                    Verify <span aria-hidden="true">↗</span>
                  </a>
                )}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="block">
        <h2>Milestones</h2>
        {milestones.map((e) => (
          <Row e={e} key={e.slug} />
        ))}
      </section>
    </>
  );
}
