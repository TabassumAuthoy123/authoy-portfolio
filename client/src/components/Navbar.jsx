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
  const [resumeLink, setResumeLink] = useState('/Tabassum%20Authoy%20-CV.pdf');

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

  // Sync scroll with navigation items
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

  // Responsibility glitch fix: close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          <button 
            className="nav__logo" 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
            onClick={() => {
              if (location.pathname !== '/') navigate('/');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="nav__logo-icon">✦</span>
            <span className="nav__logo-text">Authoy</span>
          </button>

          {/* Right — Actions (Desktop Only pills) */}
          <div className="nav__actions desktop-only">
            <button className="nav__action-pill" onClick={() => navigate('/gallery')}>
              <FiImage size={15} />
              <span>Gallery</span>
            </button>
            <button className="nav__action-pill" onClick={() => navigate('/articles')}>
              <FiBook size={15} />
              <span>Article</span>
            </button>
            <button className="nav__action-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="nav__cta">
              <FiDownload size={15} />
              <span>Download CV</span>
            </a>
          </div>

          {/* Mobile Toggle Only — Keep it clean */}
          <div className="nav__mobile-controls mobile-only">
             <button className="nav__action-icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            {/* The mobile toggle is actually in the nav-floating below in the original design, 
                let's keep the logic consistent with how the user had it. */}
          </div>
        </div>
      </div>

      {/* Floating center pill nav — Restore Original Style */}
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
          
          {/* Add Gallery/Article into the mobile floating list for better UX when "open" */}
          <div className="mobile-only" style={{ display: open ? 'contents' : 'none' }}>
            <button className="nav-floating__link" onClick={() => { navigate('/gallery'); setOpen(false); }}>
              <FiImage size={14} />
              Gallery
            </button>
            <button className="nav-floating__link" onClick={() => { navigate('/articles'); setOpen(false); }}>
              <FiBook size={14} />
              Article
            </button>
          </div>
        </div>

        {/* Mobile toggle button inside the floating nav area */}
        <button className="nav-floating__toggle mobile-only" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>
    </>
  );
}
