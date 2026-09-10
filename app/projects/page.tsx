import Link from "next/link";
import type { Metadata } from "next";
import { getProjects, str, list } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I have designed, built and shipped.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="container">
      <div className="detail-head">
        <span className="eyebrow">Projects</span>
        <h1>Things I have built</h1>
        <p className="sub">
          {projects.length} projects — production systems, hackathon builds and experiments.
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: "3rem" }}>
        {projects.map((p) => (
          <Link className="card" key={p.slug} href={`/projects/${p.slug}/`}>
            <h3>{p.name}</h3>
            {str(p.meta, "date") && <div className="card-meta">{str(p.meta, "date")}</div>}
            <p>{str(p.meta, "description")}</p>
            <div className="tags">
              {list(p.meta, "tags").map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
