import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiDownload, FiImage, FiBook, FiHome, FiUser, FiZap, FiFolder, FiMap, FiAward, FiMail } from 'react-icons/fi';
import { getProfile, getImageUrl } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { id: 'hero', label: 'Home', icon: FiHome },
  { id: 'about', label: 'About', icon: FiUser },
  { id: 'strengths', label: 'Skills', icon: FiZap },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'experience', label: 'Journey', icon: FiMap },
  { id: 'achievements', label: 'Achievements', icon: FiAward },
  { id: 'contact', label: 'Contact', icon: FiMail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const [resumeLink, setResumeLink] = useState('/Adnan%20Kader%20Mitul%20-CV.pdf');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    getProfile()
      .then(res => {
        if (res.data?.resumeUrl) setResumeLink(getImageUrl(res.data.resumeUrl));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(id === 'hero' ? '/' : `/#${id}`);
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      {/* Top bar — Logo + Actions */}
      <div className={`nav-top ${scrolled ? 'nav-top--scrolled' : ''}`}>
        <div className="nav-top__inner">
          {/* Left — Logo */}
          <button className="nav__logo" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => {
            if (location.pathname !== '/') navigate('/');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <span className="nav__logo-icon">✦</span>
            <span className="nav__logo-text">Adnan</span>
          </button>

          {/* Right — Desktop Actions */}
          <div className="nav__actions desktop-only">
            <a href="/gallery" className="nav__action-pill">
              <FiImage size={15} />
              <span>Gallery</span>
            </a>
            <a href="/articles" className="nav__action-pill">
              <FiBook size={15} />
              <span>Article</span>
            </a>
            <button className="nav__action-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="nav__cta">
              <FiDownload size={15} />
              <span>Download CV</span>
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="nav__mobile-controls mobile-only">
            <button className="nav__action-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <button className="nav__mobile-toggle" onClick={() => setOpen(!open)}>
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile ${open ? 'nav-mobile--open' : ''}`}>
        <div className="nav-mobile__content">
          <div className="nav-mobile__links">
            {navLinks.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-mobile__link ${active === id ? 'nav-mobile__link--active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                <Icon size={24} />
                {label}
              </button>
            ))}
          </div>

          <div className="nav-mobile__footer">
            <div className="nav-mobile__actions">
              <a href="/gallery" className="nav__action-pill" onClick={() => setOpen(false)}>
                <FiImage size={15} />
                <span>Gallery</span>
              </a>
              <a href="/articles" className="nav__action-pill" onClick={() => setOpen(false)}>
                <FiBook size={15} />
                <span>Article</span>
              </a>
            </div>
            <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="btn nav__cta--mobile">
              <FiDownload size={15} />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
