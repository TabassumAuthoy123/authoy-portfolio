import { useState, useEffect } from 'react';
import { FiAward, FiCode, FiCalendar, FiExternalLink, FiBookOpen, FiActivity } from 'react-icons/fi';
import { getAchievements } from '../api';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAchievements().then(res => {
      setAchievements(res.data || []);
      setLoading(false);
    }).catch(() => {
      setAchievements([]);
      setLoading(false);
    });
  }, []);

  const competitions = achievements.filter(a => a.category === 'competition');
  const cpData = achievements.filter(a => a.category === 'cp');
  const publicationsData = achievements.filter(a => a.category === 'publications');
  const sportsData = achievements.filter(a => a.category === 'sports');

  // Hardcoded fallback data for CP stats/links since it's a unique section
  const renderCPSection = () => (
    <>
      <div className="ach__stat-card">
        <div className="ach__stat-number">400<span>+</span></div>
        <p className="ach__stat-label">Problems Solved</p>
        <p className="ach__stat-sub">across all major competitive programming platforms</p>
        <div className="ach__profile-links">
          <a href="https://codeforces.com/profile/me_none" target="_blank" rel="noopener noreferrer" className="ach__profile-link">
            <FiExternalLink size={12} /> Codeforces
          </a>
          <a href="https://leetcode.com/u/me_none/" target="_blank" rel="noopener noreferrer" className="ach__profile-link ach__profile-link--lc">
            <FiExternalLink size={12} /> LeetCode
          </a>
        </div>
      </div>
      
      {cpData.length > 0 && cpData.map((item, idx) => (
        <div className="ach__inner-section" key={`cp-${idx}`} style={{ marginTop: '2.5rem' }}>
          <div className="ach__inner-header">
            <div className="ach__col-icon" style={{ background: 'rgba(234,179,8,0.12)', color: '#EAB308' }}>
              <FiBookOpen size={18} />
            </div>
            <h4 className="ach__inner-title">Publications</h4>
          </div>
          <div className="ach__interest-card" style={{ '--ach-accent': '#EAB308' }}>
            <div className="ach__interest-emoji">
               <FiBookOpen size={24} />
            </div>
            <div>
              <h4 className="ach__interest-title">{item.title}</h4>
              <p className="ach__interest-desc">
                {item.description}
              </p>
              {item.date && (
                <span className="ach__tl-date" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <FiCalendar size={11} /> {item.date}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );

  const renderPublicationsSection = () => {
    if (publicationsData.length === 0) return null;
    return (
      <div style={{ marginTop: '3rem' }}>
        <div className="ach__inner-header">
          <div className="ach__col-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
            <FiBookOpen size={18} />
          </div>
          <h4 className="ach__inner-title">Publications</h4>
        </div>
        {publicationsData.map((item, idx) => (
          <div className="ach__interest-card" key={item._id || `pub-${idx}`} style={{ '--ach-accent': '#3B82F6', marginTop: '1.25rem' }}>
            <div className="ach__interest-emoji">
               <FiBookOpen size={24} />
            </div>
            <div>
              <h4 className="ach__interest-title">{item.title}</h4>
              {item.description && <p className="ach__interest-desc">{item.description}</p>}
              {item.date && (
                <span className="ach__tl-date" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <FiCalendar size={11} /> {item.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSportsSection = () => {
    if (sportsData.length === 0) return null;
    return (
      <div style={{ marginTop: '3rem' }}>
        <div className="ach__inner-header">
          <div className="ach__col-icon" style={{ background: 'rgba(234,179,8,0.12)', color: '#EAB308' }}>
            <FiActivity size={18} />
          </div>
          <h4 className="ach__inner-title">Sports & Athletics</h4>
        </div>
        {sportsData.map((item, idx) => (
          <div className="ach__interest-card" key={item._id || `sport-${idx}`} style={{ '--ach-accent': '#EAB308', marginTop: '1.25rem' }}>
            <div className="ach__interest-emoji">
               <FiActivity size={24} />
            </div>
            <div>
              <h4 className="ach__interest-title">{item.title}</h4>
              {item.description && <p className="ach__interest-desc">{item.description}</p>}
              {item.date && (
                <span className="ach__tl-date" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                  <FiCalendar size={11} /> {item.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="section section-bg-subtle" id="achievements">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div className="section__badge">Highlights</div>
          <h2 className="section__title">
            Achievements & <span className="text-gradient">Interests</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            Competitions won, problems solved, and passions pursued.
          </p>
        </div>

        <div className="ach__layout">
          {/* ─── Left Column: Competitions ─── */}
          <div className="ach__column">
            <div className="ach__col-header">
              <div className="ach__col-icon" style={{ background: 'rgba(249,115,22,0.12)', color: '#F97316' }}>
                <FiAward size={20} />
              </div>
              <h3 className="ach__col-title">Competitions & Awards</h3>
            </div>

            <div className="ach__timeline">
              {loading && <p>Loading achievements...</p>}
              {!loading && competitions.length === 0 && <p className="text-sm" style={{ color: 'var(--text-light)' }}>No competitions added yet.</p>}
              
              {competitions.map((c, i) => (
                <div className="ach__tl-item" key={c._id || i} style={{ '--ach-accent': i % 2 === 0 ? '#F97316' : '#3B82F6' }}>
                  <div className="ach__tl-dot" />
                  <div className="ach__tl-card">
                    <div className="ach__tl-card-top">
                      <span className="ach__tl-badge">{i % 2 === 0 ? '🥇' : '🏅'}</span>
                      <h4 className="ach__tl-title">{c.title}</h4>
                    </div>
                    {c.description && <p className="ach__tl-desc">{c.description}</p>}
                    {c.date && (
                      <span className="ach__tl-date">
                        <FiCalendar size={11} /> {c.date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Column: CP + Leadership ─── */}
          <div className="ach__column ach__column--right-full">
            <div className="ach__col-header">
              <div className="ach__col-icon" style={{ background: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }}>
                <FiCode size={20} />
              </div>
              <h3 className="ach__col-title">Competitive Programming</h3>
            </div>

            {renderCPSection()}
            {!loading && renderSportsSection()}
            {!loading && renderPublicationsSection()}
          </div>
        </div>
      </div>
    </section>
  );
}

