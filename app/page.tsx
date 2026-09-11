import { site } from "@/lib/site";
import { getProjects, getExperience } from "@/lib/content";
import Toolbox from "@/components/Toolbox";
import Timeline, { dated } from "@/components/Timeline";
import ProjectRail from "@/components/ProjectRail";
import AboutSection from "@/components/AboutSection";
import SmoothLink from "@/components/SmoothLink";

export default function Home() {
  const projects = getProjects(); // filtered + ordered by featured.txt
  const experience = getExperience();

  return (
    <>
      <div className="container hero">
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
          <a className="btn" href={`mailto:${site.email}`}>
            Get in touch
          </a>
        </div>
      </div>

      <section className="container" id="now">
        <div className="bento">
          <div className="now bento-main">
            <span className="eyebrow">Currently</span>
            <h2>{site.now.title}</h2>
            <p>{site.now.body}</p>
            <div className="tags">
              {site.now.stack.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {site.stats.map((s) => (
            <div className="stat" key={s.figure}>
              <div className="figure">{s.figure}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container" id="experience">
        <div className="section-head">
          <h2>Experience</h2>
          <span className="section-note">{dated(experience).length} roles</span>
        </div>
        <Timeline entries={experience} />
      </section>

      <Toolbox />

      <section className="container" id="projects">
        <div className="section-head">
          <h2>Selected Projects</h2>
          <span className="section-note">{projects.length} projects</span>
        </div>
        <ProjectRail projects={projects} />
      </section>

      <section className="container" id="about">
        <div className="section-head">
          <h2>About</h2>
        </div>
        <AboutSection />
      </section>
    </>
  );
}
