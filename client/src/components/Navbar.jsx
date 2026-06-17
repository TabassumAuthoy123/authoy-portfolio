import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiDownload, FiImage, FiBook, FiCalendar } from 'react-icons/fi';
import { getProfile, getImageUrl } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'strengths', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Journey' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'booking', label: 'Booking' },
  { id: 'contact', label: 'Contact' },
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
  const [resumeLink, setResumeLink] = useState('/Tabassum_Mustafa_Authoy_CV.pdf');

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync scroll with navigation items
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
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

  // Close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
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
    <header className={`navbar-header ${scrolled ? 'navbar-header--scrolled' : ''}`}>
      <div className="navbar-container">
        <nav className="navbar-inner">
          {/* Logo - Sparkles Icon + Authoy */}
          <button 
            className="navbar-logo group"
            onClick={() => {
              if (location.pathname !== '/') navigate('/');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="navbar-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-sparkles">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                <path d="M20 2v4"></path>
                <path d="M22 4h-4"></path>
                <circle cx="4" cy="20" r="2"></circle>
              </svg>
            </div>
            <span className="navbar-logo-text">Authoy</span>
          </button>

          {/* Center Links (Desktop only) */}
          <div className="navbar-center-links">
            <ul className="navbar-pills">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    className={`navbar-pill-btn ${active === link.id ? 'navbar-pill-btn--active' : ''}`}
                    onClick={() => scrollTo(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Actions (Desktop only) */}
          <div className="navbar-right-actions">
            <button className="navbar-action-btn" onClick={() => navigate('/gallery')}>
              <FiImage style={{ marginRight: '6px' }} />
              <span>Gallery</span>
            </button>
            <button className="navbar-action-btn" onClick={() => navigate('/articles')}>
              <FiBook style={{ marginRight: '6px' }} />
              <span>Blog</span>
            </button>
            <button className="navbar-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <button className="navbar-cta-btn" onClick={() => scrollTo('booking')}>
              <FiCalendar style={{ marginRight: '6px' }} />
              <span>Book Call</span>
            </button>
          </div>

          {/* Mobile Controls (Toggle + Theme) */}
          <div className="navbar-mobile-controls">
            <button className="navbar-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <button className="navbar-hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        <div className={`navbar-mobile-menu ${open ? 'navbar-mobile-menu--open' : ''}`}>
          <div className="navbar-mobile-menu-inner">
            <ul className="navbar-mobile-links">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    className={`navbar-mobile-link-btn ${active === link.id ? 'navbar-mobile-link-btn--active' : ''}`}
                    onClick={() => scrollTo(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="navbar-mobile-actions">
              <button className="navbar-mobile-action-btn" onClick={() => { navigate('/gallery'); setOpen(false); }}>
                <FiImage style={{ marginRight: '8px' }} />
                <span>Gallery</span>
              </button>
              <button className="navbar-mobile-action-btn" onClick={() => { navigate('/articles'); setOpen(false); }}>
                <FiBook style={{ marginRight: '8px' }} />
                <span>Blog</span>
              </button>
              <button className="navbar-mobile-cta-btn" onClick={() => scrollTo('booking')}>
                <FiCalendar style={{ marginRight: '8px' }} />
                <span>Book Consultation</span>
              </button>
              <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="navbar-mobile-download-btn">
                <FiDownload style={{ marginRight: '8px' }} />
                <span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
