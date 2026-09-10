import Link from "next/link";
import type { Metadata } from "next";
import { getExperience, str } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
  description: "Where I have worked and what I did there.",
};

export default function ExperiencePage() {
  const roles = getExperience();

  return (
    <div className="container">
      <div className="detail-head">
        <span className="eyebrow">Experience</span>
        <h1>Where I have worked</h1>
      </div>

      <div className="grid grid-2" style={{ marginBottom: "3rem" }}>
        {roles.map((r) => (
          <Link className="card" key={r.slug} href={`/experience/${r.slug}/`}>
            <h3>{r.name}</h3>
            <div className="card-meta">
              {[str(r.meta, "company"), str(r.meta, "date")].filter(Boolean).join(" · ")}
            </div>
            <p>{str(r.meta, "description")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
