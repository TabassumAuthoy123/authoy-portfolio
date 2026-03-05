import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiDownload, FiImage, FiBook, FiHome, FiUser, FiZap, FiFolder, FiMap, FiAward, FiMail } from 'react-icons/fi';
import { getProfile, getImageUrl } from '../api';

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
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
          <a href="#" className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="nav__logo-icon">✦</span>
            <span className="nav__logo-text">Adnan</span>
          </a>

          {/* Right — Actions */}
          <div className="nav__actions">
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
        </div>
      </div>

      {/* Floating center pill nav — Asif style */}
      <nav className="nav-floating">
        <div className={`nav-floating__pill ${open ? 'nav-floating__pill--open' : ''}`}>
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-floating__link ${active === id ? 'nav-floating__link--active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="nav-floating__toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>
    </>
  );
}
