import { useState, useEffect } from 'react';
import { FiGithub, FiGlobe } from 'react-icons/fi';
import { getImageUrl, getProjects } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section section-bg-subtle" id="projects">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div className="section__badge">Solutions</div>
          <h2 className="section__title">
            Things I've <span className="text-gradient">built</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            From web apps to games — real projects solving real problems.
          </p>
        </div>

        {/* Sticky-stack project cards */}
        <div className="projects__stack">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>No projects available right now.</div>
          ) : (
            projects.map((p, i) => {
              const accentColor = p.accent || ['#F97316', '#3B82F6', '#2dd4bf', '#a855f7'][i % 4];
              
              return (
              <div
                className="project-stack-card"
                key={p._id || p.title}
                style={{
                  '--accent': accentColor,
                  top: `${100 + i * 40}px`,
                }}
              >
                {/* Left — Image */}
                <div className="project-stack-card__image">
                  <span className="project-stack-card__badge">Project {i + 1}</span>
                  <img src={getImageUrl(p.image)} alt={p.title} loading="lazy" />
                </div>

                {/* Right — Content */}
                <div className="project-stack-card__content">
                  {/* Accent dot + line */}
                  <div className="project-stack-card__accent">
                    <span
                      className="project-stack-card__dot"
                      style={{ background: accentColor }}
                    />
                    <span className="project-stack-card__line" />
                  </div>

                  <h3 className="project-stack-card__title">{p.title}</h3>
                  <p className="project-stack-card__subtitle">{p.subtitle}</p>
                  <p className="project-stack-card__desc">{p.description}</p>

                  {/* Tech stack pills */}
                  <div className="project-stack-card__tech">
                    {p.techStack && p.techStack.map((t) => (
                      <span className="project-stack-card__tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="project-stack-card__links">
                    {p.sourceUrl && (
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-stack-card__link"
                        style={{ color: accentColor }}
                      >
                        <FiGithub size={16} /> Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-stack-card__link"
                        style={{ color: accentColor }}
                      >
                        <FiGlobe size={16} /> Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </section>
  );
}
