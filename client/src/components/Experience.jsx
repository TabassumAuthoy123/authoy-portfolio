import { useState, useEffect } from 'react';
import {
  FiBriefcase,
  FiBookOpen,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiUsers,
  FiImage,
} from 'react-icons/fi';
import { getImageUrl, getLeadership, getExperience } from '../api';

/* ── Journey Card (Work & Education) ── */
function JourneyCard({ item }) {
  const accent = item.accent || '#F97316';
  return (
    <div className="journey-card" style={{ '--jc-accent': accent }}>
      <div className="journey-card__header">
        <span className="journey-card__icon">{item.icon || (item.type === 'work' ? '💼' : '📗')}</span>
        <h4 className="journey-card__role">{item.role}</h4>
      </div>
      <div className="journey-card__meta">
        <span className="journey-card__meta-item">
          <FiMapPin size={13} /> {item.company}
          {item.location ? ` — ${item.location}` : ''}
        </span>
        <span className="journey-card__meta-item">
          <FiCalendar size={13} /> {item.duration}
        </span>
      </div>
      {item.summary && (
        <blockquote className="journey-card__summary">{item.summary}</blockquote>
      )}
      {item.achievements && item.achievements.length > 0 && (
        <div className="journey-card__achievements">
          <span className="journey-card__ach-label">
            <FiAward size={14} /> Key Achievements
          </span>
          <div className="journey-card__ach-pills">
            {item.achievements.map((a, i) => (
              <span className="journey-card__ach-pill" key={i}>
                {a.label}: <strong>{a.value}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Fallback: show gpa as an achievement */}
      {(!item.achievements || item.achievements.length === 0) && item.gpa && (
        <div className="journey-card__achievements">
          <span className="journey-card__ach-label">
            <FiAward size={14} /> Result
          </span>
          <div className="journey-card__ach-pills">
            <span className="journey-card__ach-pill">{item.gpa}</span>
          </div>
        </div>
      )}
      {item.highlights && item.highlights.length > 0 && (
        <ul className="journey-card__highlights">
          {item.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className="journey-card__tags">
          {item.tags.map((t) => (
            <span className="journey-card__tag" key={t}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Section Box Wrapper ── */
function SectionBox({ icon, iconBg, iconColor, title, children, loading }) {
  return (
    <div className="journey__box">
      <div className="journey__box-header">
        <div className="journey__box-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        <h3 className="journey__box-title">{title}</h3>
      </div>
      <div className="journey__box-cards">
        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.88rem' }}>
            Loading...
          </div>
        ) : children}
      </div>
    </div>
  );
}

/* ── Vertical Alternating Timeline — dynamic from API ── */
function LeadershipTimeline({ items, loading }) {
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        Loading leadership data...
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        No leadership activities added yet.
      </div>
    );
  }
  return (
    <div className="vtl">
      <div className="vtl__line" />
      {items.map((item, i) => {
        const isLeft = i % 2 === 0;
        return (
          <div
            className={`vtl__row ${isLeft ? 'vtl__row--left' : 'vtl__row--right'} ${item.isActive ? 'vtl__row--active' : ''}`}
            key={item._id || i}
            style={{ '--vtl-accent': item.accent || '#2dd4bf' }}
          >
            <div className="vtl__dot">
              <FiBriefcase size={16} />
            </div>
            <div className="vtl__card">
              <div className="vtl__card-photo">
                {item.imageUrl ? (
                  <img src={getImageUrl(item.imageUrl)} alt={item.title} />
                ) : (
                  <FiImage size={18} />
                )}
              </div>
              <div className="vtl__card-body">
                <span className="vtl__card-date">
                  <FiCalendar size={12} /> {item.date}
                </span>
                <h4 className="vtl__card-role">{item.title}</h4>
                <p className="vtl__card-company">{item.organization}</p>
                <p className="vtl__card-desc">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Section ── */
export default function Experience() {
  const [experienceData, setExperienceData] = useState([]);
  const [leadershipItems, setLeadershipItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getExperience().catch(() => ({ data: [] })),
      getLeadership().catch(() => ({ data: [] })),
    ]).then(([expRes, leadRes]) => {
      setExperienceData(expRes.data || []);
      setLeadershipItems(leadRes.data || []);
      setLoading(false);
    });
  }, []);

  const workItems = experienceData.filter(e => e.type === 'work');
  const educationItems = experienceData.filter(e => e.type === 'education');

  return (
    <section className="section" id="experience">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div className="section__badge">Journey</div>
          <h2 className="section__title">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            My professional and academic path so far.
          </p>
        </div>

        {/* Row 1: Work + Education */}
        <div className="journey__grid">
          <SectionBox
            icon={<FiBriefcase size={20} />}
            iconBg="rgba(249,115,22,0.12)"
            iconColor="#F97316"
            title="Work Experience"
            loading={loading}
          >
            {workItems.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', padding: '1rem 0' }}>No work experience added yet.</p>
            ) : (
              workItems.map((item) => <JourneyCard item={item} key={item._id} />)
            )}
          </SectionBox>

          <SectionBox
            icon={<FiBookOpen size={20} />}
            iconBg="rgba(62,207,142,0.12)"
            iconColor="#3ECF8E"
            title="Education"
            loading={loading}
          >
            {educationItems.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', padding: '1rem 0' }}>No education added yet.</p>
            ) : (
              educationItems.map((item) => <JourneyCard item={item} key={item._id} />)
            )}
          </SectionBox>
        </div>

        {/* Row 2: Leadership & Activities — dynamic from /api/leadership */}
        <div className="journey__grid journey__grid--full" style={{ marginTop: 30 }}>
          <div className="journey__box">
            <div className="journey__box-header">
              <div className="journey__box-icon" style={{ background: 'rgba(45,212,191,0.12)', color: '#2dd4bf' }}>
                <FiUsers size={20} />
              </div>
              <h3 className="journey__box-title">Leadership & Activities</h3>
            </div>
            <LeadershipTimeline items={leadershipItems} loading={loading} />
          </div>
        </div>
      </div>
    </section>
  );
}
