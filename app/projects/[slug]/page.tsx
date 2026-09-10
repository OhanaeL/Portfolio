import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjects, getEntry, str, list } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("projects", slug);
  if (!entry) return {};
  return { title: entry.name, description: str(entry.meta, "description") };
}

const VIDEO = /\.(mp4|webm|mov)$/i;
const PDF = /\.pdf$/i;

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getEntry("projects", slug);
  if (!p) notFound();

  const team = list(p.meta, "team");
  const github = str(p.meta, "github");
  const demo = str(p.meta, "demo");
  const disclaimer = str(p.meta, "disclaimer");

  return (
    <div className="container">
      <div className="detail-head">
        <Link className="back" href="/projects/">
          ← All projects
        </Link>
        <h1>{p.name}</h1>
        {str(p.meta, "description") && <p className="sub">{str(p.meta, "description")}</p>}

        <div className="meta-row">
          {str(p.meta, "date") && <span>{str(p.meta, "date")}</span>}
          {team.length > 0 && <span>Team: {team.join(", ")}</span>}
          {github && (
            <a className="xlink" href={github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          )}
          {demo && (
            <a className="xlink" href={demo} target="_blank" rel="noopener noreferrer">
              Live demo ↗
            </a>
          )}
        </div>

        <div className="tags" style={{ marginTop: "1rem" }}>
          {list(p.meta, "tags").map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {disclaimer && <div className="notice">{disclaimer}</div>}

      <article className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />

      {p.embeds.length > 0 && (
        <div className="embed">
          {p.embeds.map((file) =>
            VIDEO.test(file) ? (
              <video key={file} controls preload="metadata" playsInline>
                <source src={`${p.mediaBase}/embeds/${encodeURIComponent(file)}`} />
              </video>
            ) : PDF.test(file) ? (
              <a
                key={file}
                className="btn"
                href={`${p.mediaBase}/embeds/${encodeURIComponent(file)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open {file}
              </a>
            ) : null
          )}
        </div>
      )}

      {p.gallery.length > 0 && (
        <>
          <div className="section-head" style={{ marginTop: "2.5rem" }}>
            <h2>Gallery</h2>
          </div>
          <div className="gallery">
            {p.gallery.map((img) => (
              <img
                key={img}
                src={`${p.mediaBase}/images/${encodeURIComponent(img)}`}
                alt={`${p.name} — ${img}`}
                loading="lazy"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
