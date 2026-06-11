import { useState, useEffect } from 'react';
import { FiAward, FiBookOpen, FiBriefcase, FiCalendar, FiTrendingUp, FiUsers } from 'react-icons/fi';
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

  // Filter achievements by type/category
  const careerAndAcademic = achievements.filter(a => 
    ['career', 'academic', 'education'].includes(a.category)
  );
  
  const researchAndLeadership = achievements.filter(a => 
    ['research', 'leadership', 'competition', 'publications', 'cp', 'sports'].includes(a.category)
  );

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'career':
        return { icon: <FiBriefcase size={16} />, color: '#F97316', bg: 'rgba(249,115,22,0.12)' };
      case 'academic':
      case 'education':
        return { icon: <FiBookOpen size={16} />, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' };
      case 'research':
      case 'publications':
        return { icon: <FiTrendingUp size={16} />, color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
      case 'leadership':
        return { icon: <FiUsers size={16} />, color: '#A855F7', bg: 'rgba(168,85,247,0.12)' };
      default:
        return { icon: <FiAward size={16} />, color: '#EC4899', bg: 'rgba(236,72,153,0.12)' };
    }
  };

  return (
    <section className="section section-bg-subtle" id="achievements">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', marginBottom: '3rem' }}>
          <div className="section__badge">Highlights</div>
          <h2 className="section__title">
            Achievements & <span className="text-gradient">Highlights</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            Milestones in business development, software research, and academic excellence.
          </p>
        </div>

        <div className="ach__layout">
          {/* ─── Left Column: Career & Academic ─── */}
          <div className="ach__column">
            <div className="ach__col-header">
              <div className="ach__col-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                <FiBriefcase size={20} />
              </div>
              <h3 className="ach__col-title">Career & Academic Highlights</h3>
            </div>

            <div className="ach__timeline">
              {loading && <p>Loading highlights...</p>}
              {!loading && careerAndAcademic.length === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>No highlights added yet.</p>
              )}
              
              {careerAndAcademic.map((item, idx) => {
                const style = getCategoryStyle(item.category);
                return (
                  <div className="ach__tl-item" key={item._id || `left-${idx}`} style={{ '--ach-accent': style.color }}>
                    <div className="ach__tl-dot" />
                    <div className="ach__tl-card">
                      <div className="ach__tl-card-top" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span className="ach__tl-badge" style={{ background: style.bg, color: style.color, display: 'inline-flex', padding: '6px', borderRadius: '8px' }}>
                          {style.icon}
                        </span>
                        <h4 className="ach__tl-title" style={{ margin: 0 }}>{item.title}</h4>
                      </div>
                      {item.description && <p className="ach__tl-desc" style={{ marginBottom: '8px' }}>{item.description}</p>}
                      {item.date && (
                        <span className="ach__tl-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          <FiCalendar size={11} /> {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Right Column: Research & Leadership ─── */}
          <div className="ach__column">
            <div className="ach__col-header">
              <div className="ach__col-icon" style={{ background: 'rgba(168,85,247,0.12)', color: '#A855F7' }}>
                <FiTrendingUp size={20} />
              </div>
              <h3 className="ach__col-title">Research & Leadership</h3>
            </div>

            <div className="ach__timeline">
              {loading && <p>Loading highlights...</p>}
              {!loading && researchAndLeadership.length === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>No highlights added yet.</p>
              )}
              
              {researchAndLeadership.map((item, idx) => {
                const style = getCategoryStyle(item.category);
                return (
                  <div className="ach__tl-item" key={item._id || `right-${idx}`} style={{ '--ach-accent': style.color }}>
                    <div className="ach__tl-dot" />
                    <div className="ach__tl-card">
                      <div className="ach__tl-card-top" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span className="ach__tl-badge" style={{ background: style.bg, color: style.color, display: 'inline-flex', padding: '6px', borderRadius: '8px' }}>
                          {style.icon}
                        </span>
                        <h4 className="ach__tl-title" style={{ margin: 0 }}>{item.title}</h4>
                      </div>
                      {item.description && <p className="ach__tl-desc" style={{ marginBottom: '8px' }}>{item.description}</p>}
                      {item.date && (
                        <span className="ach__tl-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          <FiCalendar size={11} /> {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

