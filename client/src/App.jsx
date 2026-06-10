import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ClientPortal from './pages/ClientPortal';
import './App.css';

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
