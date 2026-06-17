/**
 * AdminPreview.jsx — Live B2C Site Preview System for Admin CMS
 *
 * Shows a scaled, real-time preview of each portfolio section.
 * Uses the same components as the B2C frontend but in a sandboxed container.
 */
import { useState, useEffect } from 'react';
import { FiEye, FiExternalLink, FiRefreshCw, FiLayout, FiUser, FiBox, FiGlobe, FiBriefcase, FiAward, FiBook } from 'react-icons/fi';
import { getProfile, getProjects, getSkills, getExperience, getAchievements, getAllArticles, getImageUrl } from '../api';

const SECTION_TABS = [
  { id: 'hero',         label: 'Hero',         icon: <FiLayout /> },
  { id: 'about',        label: 'About',         icon: <FiUser /> },
  { id: 'skills',       label: 'Skills',        icon: <FiBox /> },
  { id: 'projects',     label: 'Projects',      icon: <FiGlobe /> },
  { id: 'experience',   label: 'Experience',    icon: <FiBriefcase /> },
  { id: 'achievements', label: 'Achievements',  icon: <FiAward /> },
  { id: 'articles',     label: 'Articles',      icon: <FiBook /> },
];

export default function AdminPreview() {
  const [activeSection, setActiveSection] = useState('hero');
  const [previewTheme, setPreviewTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    profile: null, projects: [], skills: [], experience: [],
    achievements: [], articles: [],
  });

  useEffect(() => {
    const safeGet = async (fn, fallback) => {
      try { const res = await fn(); return res.data; } catch { return fallback; }
    };
    Promise.all([
      safeGet(getProfile, null),
      safeGet(getProjects, []),
      safeGet(getSkills, []),
      safeGet(getExperience, []),
      safeGet(getAchievements, []),
      safeGet(getAllArticles, []),
    ]).then(([profile, projects, skills, experience, achievements, articles]) => {
      setData({ profile, projects, skills, experience, achievements, articles });
      setLoading(false);
    });
  }, []);

  const refresh = () => {
    setLoading(true);
    const safeGet = async (fn, fallback) => {
      try { const res = await fn(); return res.data; } catch { return fallback; }
    };
    Promise.all([
      safeGet(getProfile, null),
      safeGet(getProjects, []),
      safeGet(getSkills, []),
      safeGet(getExperience, []),
      safeGet(getAchievements, []),
      safeGet(getAllArticles, []),
    ]).then(([profile, projects, skills, experience, achievements, articles]) => {
      setData({ profile, projects, skills, experience, achievements, articles });
      setLoading(false);
    });
  };

  return (
    <div className="preview-root">
      {/* Preview toolbar */}
      <div className="preview-toolbar">
        <div className="preview-toolbar__left">
          <FiEye size={16} />
          <span>Live Preview</span>
          <span className="preview-badge">Real Data</span>
        </div>
        <div className="preview-section-tabs">
          {SECTION_TABS.map(tab => (
            <button
              key={tab.id}
              className={`preview-section-tab ${activeSection === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSection(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="preview-toolbar__right">
          <button
            className="preview-theme-toggle"
            onClick={() => setPreviewTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle preview theme"
          >
            {previewTheme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="preview-refresh-btn" onClick={refresh} title="Refresh data">
            <FiRefreshCw size={14} />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="preview-open-btn" title="Open live site">
            <FiExternalLink size={14} />
            <span>Open Site</span>
          </a>
        </div>
      </div>

      {/* Preview frame container */}
      <div className={`preview-frame-wrapper ${previewTheme}`}>
        <div className="preview-scale-note">
          Preview is scaled for CMS view • <a href="/" target="_blank" rel="noopener noreferrer">Open full site ↗</a>
        </div>

        {loading ? (
          <div className="preview-loading">
            <div className="preview-spinner" />
            <span>Loading preview data...</span>
          </div>
        ) : (
          <div className="preview-section-view" data-theme={previewTheme}>
            {activeSection === 'hero' && <HeroPreview profile={data.profile} />}
            {activeSection === 'about' && <AboutPreview profile={data.profile} />}
            {activeSection === 'skills' && <SkillsPreview skills={data.skills} />}
            {activeSection === 'projects' && <ProjectsPreview projects={data.projects} />}
            {activeSection === 'experience' && <ExperiencePreview experience={data.experience} />}
            {activeSection === 'achievements' && <AchievementsPreview achievements={data.achievements} />}
            {activeSection === 'articles' && <ArticlesPreview articles={data.articles} />}
          </div>
        )}
      </div>

      {/* Data stats bar */}
      <div className="preview-stats-bar">
        <span>📦 {data.projects.length} Projects</span>
        <span>⚡ {data.skills.length} Skills</span>
        <span>💼 {data.experience.length} Experiences</span>
        <span>🏆 {data.achievements.length} Achievements</span>
        <span>📝 {data.articles.length} Articles</span>
      </div>
    </div>
  );
}

// ── Section Previews ─────────────────────────────────────────────────

function HeroPreview({ profile }) {
  const p = profile || {};
  const photoUrl = p.photoUrl ? getImageUrl(p.photoUrl) : null;

  return (
    <div className="pv-hero">
      <div className="pv-hero__bg" />
      <div className="pv-hero__content">
        <div className="pv-hero__text">
          <div className="pv-badge">👋 Hello,</div>
          <h2 className="pv-hero__name">{p.name || 'Tabassum Mustafa Authoy'}</h2>
          <h1 className="pv-hero__title">
            Technology. <span className="pv-gradient">Strategy.</span> Results.
          </h1>
          <p className="pv-hero__role">&gt; {p.title || 'Software Engineer & Business Development Manager'}</p>
          <p className="pv-hero__tagline">{p.tagline || 'Working at the intersection of software engineering, AI safety research, and the classical arts.'}</p>
          <div className="pv-hero__buttons">
            <span className="pv-btn pv-btn--primary">Let's Talk →</span>
            <span className="pv-btn pv-btn--secondary">Download CV</span>
          </div>
        </div>
        <div className="pv-hero__image">
          {photoUrl ? (
            <img src={photoUrl} alt={p.name} />
          ) : (
            <div className="pv-hero__placeholder">👤</div>
          )}
        </div>
      </div>
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Profile</strong></span>
      </div>
    </div>
  );
}

function AboutPreview({ profile }) {
  const p = profile || {};
  const bio = Array.isArray(p.bio) ? p.bio : [p.bio || 'No bio set yet.'];
  const photoUrl = p.photoUrl ? getImageUrl(p.photoUrl) : null;

  return (
    <div className="pv-section">
      <div className="pv-section__header">
        <div className="pv-badge">About Me</div>
        <h2>Who I Am</h2>
      </div>
      <div className="pv-about__grid">
        <div className="pv-about__image">
          {photoUrl ? <img src={photoUrl} alt={p.name} /> : <div className="pv-hero__placeholder">👤</div>}
          <div className="pv-about__stats">
            {(p.stats || [
              { icon: '💼', value: 'Manager', label: 'BD at SoftifyBD' },
              { icon: '🎓', value: 'MSc / EMBA', label: 'BRAC & DU' },
            ]).map((s, i) => (
              <div key={i} className="pv-stat">
                <span>{s.icon}</span>
                <strong>{s.value}</strong>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="pv-about__text">
          {p.quote && <blockquote className="pv-quote">{p.quote}</blockquote>}
          {bio.slice(0, 2).map((para, i) => (
            <p key={i} className="pv-para">{para}</p>
          ))}
        </div>
      </div>
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Profile</strong></span>
      </div>
    </div>
  );
}

function SkillsPreview({ skills }) {
  const grouped = ['frontend', 'backend', 'language', 'database', 'tool'].map(cat => ({
    cat,
    items: skills.filter(s => s.category === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div className="pv-section">
      <div className="pv-section__header">
        <div className="pv-badge">Expertise</div>
        <h2>Skills & <span className="pv-gradient">Technologies</span></h2>
      </div>
      <div className="pv-skills__grid">
        {grouped.map(g => (
          <div key={g.cat} className="pv-skill-group">
            <h4>{g.cat.toUpperCase()}</h4>
            <div className="pv-skill-pills">
              {g.items.map(s => (
                <div key={s._id} className="pv-skill-pill">
                  {s.icon && <span>{s.icon}</span>}
                  <span>{s.name}</span>
                  {s.level > 0 && (
                    <div className="pv-skill-bar">
                      <div style={{ width: `${s.level}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {skills.length === 0 && (
        <div className="pv-empty">No skills added yet. Go to Admin → Skills to add some.</div>
      )}
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Skills</strong></span>
      </div>
    </div>
  );
}

function ProjectsPreview({ projects }) {
  return (
    <div className="pv-section">
      <div className="pv-section__header">
        <div className="pv-badge">Portfolio</div>
        <h2>Featured <span className="pv-gradient">Projects</span></h2>
      </div>
      <div className="pv-projects__grid">
        {projects.slice(0, 4).map(p => (
          <div key={p._id} className="pv-project-card">
            {p.imageUrl && <img src={getImageUrl(p.imageUrl)} alt={p.title} />}
            <div className="pv-project-card__body">
              <h4>{p.title}</h4>
              <p>{p.description?.substring(0, 80)}...</p>
              <div className="pv-tags">
                {p.techStack?.slice(0, 3).map(t => <span key={t} className="pv-tag">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="pv-empty">No projects added yet. Go to Admin → Projects.</div>
      )}
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Projects</strong></span>
      </div>
    </div>
  );
}

function ExperiencePreview({ experience }) {
  return (
    <div className="pv-section">
      <div className="pv-section__header">
        <div className="pv-badge">Journey</div>
        <h2>Work & <span className="pv-gradient">Education</span></h2>
      </div>
      <div className="pv-timeline">
        {experience.slice(0, 5).map(e => (
          <div key={e._id} className="pv-timeline-item">
            <div className="pv-timeline-dot" />
            <div className="pv-timeline-content">
              <div className="pv-timeline-header">
                <strong>{e.role}</strong>
                <span className={`pv-type-badge ${e.type}`}>{e.type}</span>
              </div>
              <div>{e.company}</div>
              <small>{e.duration}</small>
            </div>
          </div>
        ))}
      </div>
      {experience.length === 0 && (
        <div className="pv-empty">No experience added yet. Go to Admin → Experience.</div>
      )}
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Experience</strong></span>
      </div>
    </div>
  );
}

function AchievementsPreview({ achievements }) {
  return (
    <div className="pv-section">
      <div className="pv-section__header">
        <div className="pv-badge">Recognition</div>
        <h2>Achievements & <span className="pv-gradient">Awards</span></h2>
      </div>
      <div className="pv-achieve-grid">
        {achievements.slice(0, 6).map(a => (
          <div key={a._id} className="pv-achieve-card">
            <span className="pv-achieve-icon">{a.icon || '🏆'}</span>
            <h4>{a.title}</h4>
            <p>{a.description?.substring(0, 70)}</p>
            <small>{a.date}</small>
          </div>
        ))}
      </div>
      {achievements.length === 0 && (
        <div className="pv-empty">No achievements added yet. Go to Admin → Achievements.</div>
      )}
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Achievements</strong></span>
      </div>
    </div>
  );
}

function ArticlesPreview({ articles }) {
  const published = articles.filter(a => a.published);

  return (
    <div className="pv-section">
      <div className="pv-section__header">
        <div className="pv-badge">Insights</div>
        <h2>Articles & <span className="pv-gradient">Writing</span></h2>
      </div>
      <div className="pv-articles-grid">
        {published.slice(0, 4).map(a => (
          <div key={a._id} className="pv-article-card">
            {a.coverImage && <img src={getImageUrl(a.coverImage)} alt={a.title} />}
            <div className="pv-article-card__body">
              <span className="pv-tag">{a.category}</span>
              <h4>{a.title}</h4>
              <p>{a.excerpt?.substring(0, 80)}...</p>
              <small>{a.readTime} · {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}</small>
            </div>
          </div>
        ))}
      </div>
      {published.length === 0 && (
        <div className="pv-empty">No published articles yet. Go to Admin → Articles to publish one.</div>
      )}
      <div className="pv-section-note">
        <span>✏️ Edit via: <strong>Admin → Articles</strong></span>
        <span style={{ marginLeft: 16 }}>Total drafts: {articles.length - published.length}</span>
      </div>
    </div>
  );
}
