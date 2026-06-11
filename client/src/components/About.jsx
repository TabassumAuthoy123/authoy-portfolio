import { useState, useEffect } from 'react';
import { FaBriefcase, FaCode, FaTrophy, FaLightbulb, FaArrowRight } from 'react-icons/fa';
import { getProfile, getImageUrl } from '../api';

// Fallback data
const FALLBACK = {
  photoUrl: '/placeholder-avatar.png',
  quote: "\"I work at the intersection of software engineering, AI safety research, and the classical arts.\"",
  bio: [
    "I am a multidisciplinary practitioner working at the intersection of technology, research, and art. As a software engineer, aspiring AI safety researcher, and trained classical performer based in Dhaka, Bangladesh, my work focuses on bridging reliable engineering with scientific and creative exploration.",
    "With hands-on experience spanning front-end development, travel OTA platform engineering, UI/UX collaboration, digital platform coordination, and IT-driven business operations, I specialize in technical solution design, building functional web interfaces, supporting platform operations, and coordinating between clients and development teams to deliver reliable products.",
    "My long-term ambition is to contribute to the design of reliable and trustworthy artificial intelligence systems—particularly in reducing hallucinations and uncertainty in large language models, and bridging data-driven models with practical software architecture.",
    "Outside of work, I am a trained classical Bangla performer at Chhayanaut Shongshkriti-Bhobon, an amateur photographer, and a traveler whose practice draws as much from the South Asian classical tradition as from contemporary computer science."
  ],
  stats: [
    { icon: '💼', value: 'Manager', label: 'BD at SoftifyBD' },
    { icon: '🎓', value: 'MSc / EMBA', label: 'BRAC & DU' },
    { icon: '💻', value: 'BSc IT', label: 'First Class Hons' },
    { icon: '🩰', value: 'Artist', label: 'Classical Performer' }
  ],
};

export default function About() {
  const [profile, setProfile] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    getProfile()
      .then(res => setProfile(res.data))
      .catch(() => setProfile(FALLBACK));
  }, []);

  const p = profile || FALLBACK;

  const stats = p.stats?.length
    ? p.stats
    : FALLBACK.stats;

  const rawBio = p.bio?.length ? p.bio : FALLBACK.bio;
  const bio = Array.isArray(rawBio)
    ? rawBio
    : (typeof rawBio === 'string' ? [rawBio] : FALLBACK.bio);
  const quote = p.quote || FALLBACK.quote;
  const photoUrl = p.photoUrl || FALLBACK.photoUrl;
  // Since FALLBACK.photoUrl is a local public asset, don't pass it to getImageUrl if it's the fallback
  const finalPhotoUrl = (photoUrl === FALLBACK.photoUrl) ? photoUrl : getImageUrl(photoUrl);

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about__grid">
          {/* Left — Image + Stats */}
          <div className="about__image-col">
            <div className="about__image-wrapper">
              {imgError ? (
                <div className="about__photo-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: 'var(--ta-surface)', borderRadius: '20px' }}>👨‍💻</div>
              ) : (
                <img
                  src={finalPhotoUrl}
                  alt={p.name || 'Profile Photo'}
                  className="about__photo"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            {/* Stats overlay */}
            <div className="about__stats-bar">
              {stats.map((s, i) => (
                <div className="about__stat-card" key={i}>
                  <span className="about__stat-icon">{s.icon}</span>
                  <span className="about__stat-value">{s.value}</span>
                  <span className="about__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Text Content */}
          <div className="about__text-col">
            <div className="section__badge">About Me</div>
            <h2 className="about__heading">Who I Am</h2>

            <blockquote className="about__quote">{quote}</blockquote>

            {bio.map((paragraph, i) => (
              <p className="about__paragraph" key={i}>{paragraph}</p>
            ))}

            <a href="#contact" className="about__cta-link">
              Let's Connect <FaArrowRight className="about__cta-arrow" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
