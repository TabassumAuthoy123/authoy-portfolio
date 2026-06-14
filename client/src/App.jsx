import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ClientPortal from './pages/ClientPortal';
import './App.css';

/* ═══════════════════════════════════════
   SCROLL TO HASH ELEMENT UTILITY
   ═══════════════════════════════════════ */
function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Element might not be rendered yet, observe DOM modifications
        const observer = new MutationObserver((_, obs) => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            obs.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Safety timeout to prevent infinite observer hanging
        const timeout = setTimeout(() => observer.disconnect(), 2000);
        return () => {
          observer.disconnect();
          clearTimeout(timeout);
        };
      }
    } else {
      // Scroll to top on standard subpage transitions
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  return null;
}

/* ═══════════════════════════════════════
   404 PAGE
   ═══════════════════════════════════════ */
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary, #0f172a)',
      color: 'var(--text-primary, #e2e8f0)',
      textAlign: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        fontSize: '8rem',
        fontWeight: 800,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #3b82f6, #2dd4bf)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}>
        404
      </div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary, #94a3b8)', maxWidth: 460, lineHeight: 1.6, marginBottom: '2rem' }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #3b82f6, #2dd4bf)',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}>
          ← Back to Home
        </Link>
        <Link to="/login" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          color: 'var(--text-primary, #e2e8f0)',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          border: '1px solid var(--border, #334155)',
        }}>
          Admin Login
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client-portal" element={<ClientPortal />} />
        {/* Admin — each section gets its own URL */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/:section" element={<Admin />} />
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
