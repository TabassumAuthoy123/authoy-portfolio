import { useState, useEffect } from 'react';
import { FaBriefcase, FaCode, FaTrophy, FaLightbulb, FaArrowRight } from 'react-icons/fa';
import { getProfile, getImageUrl } from '../api';

// Fallback data
const FALLBACK = {
  photoUrl: '/WhatsApp Image 2026-02-24 at 9.28.02 PM.jpeg',
  quote: "\"The best code I've ever written wasn't about choosing the right framework — it was about truly understanding the problem first.\"",
  bio: [
    "I'm a 3rd-year Computer Science student at Ahsanullah University of Science and Technology, currently working as an Intern Software Engineer at Softify BD Ltd. My journey in tech started with competitive programming — solving 400+ problems across Codeforces, AtCoder, CodeChef, and LeetCode.",
    "This sharpened my algorithmic thinking and problem-solving skills, which I now apply to building real-world applications. I work with React, Laravel, Express, Node.js, MongoDB, MySQL, Docker, and Redux to craft full-stack solutions that make a difference.",
    "Beyond coding, I lead as Head of Administration at AUST Programming and Informatics Club, coordinating large-scale events like AUST IUPC 2025 and Job Fair 2025. I believe in building not just software, but communities that inspire growth.",
  ],
  stats: [
    { icon: '💼', value: '3rd Year', label: 'CSE at AUST' },
    { icon: '💻', value: '400+',     label: 'Problems Solved' },
    { icon: '🏆', value: 'Head',     label: 'APIC Admin' },
    { icon: '🚀', value: 'Intern',   label: 'Softify BD' },
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
