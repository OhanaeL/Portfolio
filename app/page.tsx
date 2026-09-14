import { site, work } from "@/lib/site";
import { getProjects, getExperience } from "@/lib/content";
import ToolStrip from "@/components/ToolStrip";
import Timeline, { dated } from "@/components/Timeline";
import ProjectRail from "@/components/ProjectRail";
import AboutSection from "@/components/AboutSection";
import SmoothLink from "@/components/SmoothLink";
import SystemDiagram from "@/components/SystemDiagram";
import WorkDiagram from "@/components/WorkDiagram";

export default function Home() {
  const projects = getProjects(); // filtered + ordered by featured.txt
  const experience = getExperience();

  return (
    <>
      <div className="container hero spot" data-spot="after">
        <div className="hero-copy">
          <span className="eyebrow">
            {site.role} · {site.location}
          </span>
          <h1>{site.headline}</h1>
          <p className="lede">{site.description}</p>
          <div className="btn-row">
            <SmoothLink className="btn btn-primary" href="#projects">
              View projects
            </SmoothLink>
            <a className="btn" href={site.resume} target="_blank" rel="noopener noreferrer">
              Résumé (PDF)
            </a>
          </div>
        </div>

        <SystemDiagram />

        <dl className="bento bento--stats spot" aria-label="Highlights">
          {site.stats.map((s) => (
            <div className="stat" key={s.figure}>
              <dt className="label">{s.label}</dt>
              <dd className="figure">{s.figure}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="container reveal spot" id="work" data-spot="after">
        <div className="section-head">
          <h2>Professional Work</h2>
          <span className="section-note">{work.length} case studies</span>
        </div>
        <div className="work-grid">
          {work.map((w) => (
            <article className="work spot" key={w.slug}>
              <div className="work-art">
                <WorkDiagram kind={w.diagram} />
              </div>
              <p className="work-eyebrow">{w.eyebrow}</p>
              <h3>{w.title}</h3>
              <p className="work-blurb">{w.blurb}</p>
              <ul className="work-stats">
                {w.stats.map(([figure, label]) => (
                  <li key={label}>
                    <b>{figure}</b> {label}
                  </li>
                ))}
              </ul>
              <SmoothLink className="work-more" href="#experience">
                Read case study <span aria-hidden="true">→</span>
              </SmoothLink>
            </article>
          ))}
        </div>
      </section>

      <section className="container reveal spot" id="experience" data-spot="after">
        <div className="section-head">
          <h2>Experience</h2>
          <span className="section-note">{dated(experience).length} roles</span>
        </div>
        <Timeline entries={experience} />
        <ToolStrip />
      </section>

      <section className="container reveal spot" id="projects" data-spot="after">
        <div className="section-head">
          <h2>Selected Projects</h2>
          <span className="section-note">{projects.length} projects</span>
        </div>
        <ProjectRail projects={projects} />
      </section>

      <section className="container reveal spot" id="about" data-spot="after">
        <div className="section-head">
          <h2>About</h2>
        </div>
        <AboutSection />
      </section>
    </>
  );
}
