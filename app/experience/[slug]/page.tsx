import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getExperience, getEntry, str } from "@/lib/content";

export function generateStaticParams() {
  return getExperience().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("experience", slug);
  if (!entry) return {};
  return { title: entry.name, description: str(entry.meta, "description") };
}

export default async function ExperienceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getEntry("experience", slug);
  if (!e) notFound();

  return (
    <div className="container">
      <div className="detail-head">
        <Link className="back" href="/experience/">
          ← All experience
        </Link>
        <h1>{e.name}</h1>
        {str(e.meta, "description") && <p className="sub">{str(e.meta, "description")}</p>}
        <div className="meta-row">
          {str(e.meta, "company") && <span>{str(e.meta, "company")}</span>}
          {str(e.meta, "date") && <span>{str(e.meta, "date")}</span>}
        </div>
      </div>

      <article className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />

      {e.gallery.length > 0 && (
        <div className="gallery">
          {e.gallery.map((img) => (
            <img
              key={img}
              src={`${e.mediaBase}/images/${encodeURIComponent(img)}`}
              alt={`${e.name} — ${img}`}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}
