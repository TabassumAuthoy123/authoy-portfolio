import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiStar, FiMessageCircle } from 'react-icons/fi';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { icon: <FiGithub size={18} />, label: 'GitHub', url: 'https://github.com/TabassumAuthoy123' },
  { icon: <FiLinkedin size={18} />, label: 'LinkedIn', url: 'https://linkedin.com/in/tabassum-authoy' },
  { icon: <FaFacebook size={18} />, label: 'Facebook', url: 'https://facebook.com/tabassumauthoy' },
  { icon: <FiMail size={18} />, label: 'Email', url: 'mailto:authoy@email.com' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
                Tabassum <span className="ft__brand-highlight">Authoy</span>
              </span>
            </div>
            <p className="ft__role">Creative Developer & Designer</p>
            <p className="ft__desc">
              Full Stack Developer focused on building efficient, scalable web
              solutions. Passionate about clean code and problem-solving.
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
            <a href="#contact" className="ft__cta">
              <FiMessageCircle size={16} /> Get in Touch
            </a>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="ft__bottom">
          <span className="ft__bottom-left">Made by Tabassum Authoy</span>
          <span className="ft__bottom-center">© 2025 All rights reserved.</span>
          <button className="ft__back-top" onClick={scrollToTop} aria-label="Back to top">
            <FiArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
