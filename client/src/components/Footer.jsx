import { useState, useEffect } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiStar, FiMessageCircle } from 'react-icons/fi';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { getProfile, getSettings } from '../api';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

const FALLBACK_SOCIALS = [
  { icon: <FiGithub size={18} />, label: 'GitHub', url: 'https://github.com/TabassumAuthoy123' },
  { icon: <FiLinkedin size={18} />, label: 'LinkedIn', url: 'https://linkedin.com/in/tabassum-authoy' },
  { icon: <FaFacebook size={18} />, label: 'Facebook', url: 'https://facebook.com/tabassumauthoy' },
  { icon: <FiMail size={18} />, label: 'Email', url: 'mailto:authoy@email.com' },
];

export default function Footer() {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data)).catch(() => {});
    getSettings().then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Build social links from settings or profile, fall back to defaults
  const buildSocials = () => {
    const s = settings?.socialLinks || {};
    const p = profile || {};
    const socialList = [];

    const github = s.github || p.githubUrl || 'https://github.com/TabassumAuthoy123';
    if (github) socialList.push({ icon: <FiGithub size={18} />, label: 'GitHub', url: github });

    const linkedin = s.linkedin || p.linkedinUrl || 'https://linkedin.com/in/tabassum-authoy';
    if (linkedin) socialList.push({ icon: <FiLinkedin size={18} />, label: 'LinkedIn', url: linkedin });

    const facebook = s.facebook || 'https://facebook.com/tabassumauthoy';
    if (facebook) socialList.push({ icon: <FaFacebook size={18} />, label: 'Facebook', url: facebook });

    const email = p.email || settings?.supportEmail || 'authoy@email.com';
    if (email) socialList.push({ icon: <FiMail size={18} />, label: 'Email', url: `mailto:${email}` });

    return socialList.length > 0 ? socialList : FALLBACK_SOCIALS;
  };

  const socials = buildSocials();
  const footerText = settings?.footerText || '© 2026 Tabassum Authoy. All rights reserved.';
  const brandName = settings?.brandName || 'Tabassum Authoy';
  const nameParts = brandName.split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || brandName;
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <footer className="ft">
      {/* Top glow line */}
      <div className="ft__glow" />

      <div className="container">
        <div className="ft__grid">
          {/* ── Col 1: Identity ── */}
          <div className="ft__col ft__col--identity">
            <div className="ft__brand">
              <div className="ft__brand-icon">
                <FiStar size={18} />
              </div>
              <span className="ft__brand-name">
                {firstName} <span className="ft__brand-highlight">{lastName}</span>
              </span>
            </div>
            <p className="ft__role">
              {profile?.title || 'Full Stack Developer & Competitive Programmer'}
            </p>
            <p className="ft__desc">
              {profile?.bio
                ? (Array.isArray(profile.bio) ? profile.bio.join(' ') : profile.bio).substring(0, 160) + 
                  ((Array.isArray(profile.bio) ? profile.bio.join(' ') : profile.bio).length > 160 ? '...' : '')
                : 'Full Stack Developer focused on building efficient, scalable web solutions. Passionate about clean code and problem-solving.'}
            </p>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div className="ft__col">
            <h4 className="ft__col-title">
              <span className="ft__col-bar" />Quick Links
            </h4>
            <ul className="ft__nav">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="ft__nav-link">
                    <span className="ft__nav-dot" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Connect ── */}
          <div className="ft__col">
            <h4 className="ft__col-title">
              <span className="ft__col-bar ft__col-bar--blue" />Connect
            </h4>
            <div className="ft__socials-grid">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ft__social-card"
                  aria-label={s.label}
                >
                  {s.icon}
                  <span className="ft__social-label">{s.label}</span>
                </a>
              ))}
            </div>
            <p className="ft__social-hint">
              <FiStar size={12} /> Follow for updates & insights
            </p>
          </div>

          {/* ── Col 4: Stay Informed ── */}
          <div className="ft__col">
            <h4 className="ft__col-title">
              <span className="ft__col-bar" />Stay Informed
            </h4>
            <div className="ft__info-box">
              <p>
                I share periodic updates on projects, competitive programming, and
                tech explorations. Reach out to connect or collaborate.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#contact" className="ft__cta" style={{ margin: 0 }}>
                <FiMessageCircle size={16} /> Get in Touch
              </a>
              <a href="/client-portal" className="ft__cta" style={{ margin: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                B2B Portal
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="ft__bottom">
          <span className="ft__bottom-left">Made by {brandName}</span>
          <span className="ft__bottom-center">{footerText}</span>
          <button className="ft__back-top" onClick={scrollToTop} aria-label="Back to top">
            <FiArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
