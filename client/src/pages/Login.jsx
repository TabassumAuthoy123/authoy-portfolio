import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import './Admin.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="ta-login">
      {/* Left branding panel */}
      <div className="ta-login__brand">
        <div className="ta-login__brand-content">
          <div className="ta-login__brand-icon">A</div>
          <h1>Admin Panel</h1>
          <p>Manage your portfolio content, projects, articles, and more from one central dashboard.</p>
          <div className="ta-login__brand-features">
            <div className="ta-login__brand-feature">
              <FiCheck size={16} />
              <span>Manage projects, skills & experience</span>
            </div>
            <div className="ta-login__brand-feature">
              <FiCheck size={16} />
              <span>Write & publish articles</span>
            </div>
            <div className="ta-login__brand-feature">
              <FiCheck size={16} />
              <span>Upload gallery images</span>
            </div>
            <div className="ta-login__brand-feature">
              <FiCheck size={16} />
              <span>View & manage contact messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="ta-login__form-side">
        <div className="ta-login__form-container">
          <h2>Sign In</h2>
          <p>Enter your credentials to access the admin panel</p>

          <form className="ta-login__form" onSubmit={handleSubmit}>
            <div className="ta-form-group">
              <label className="ta-form-label" htmlFor="username">Username</label>
              <input
                className="ta-form-input"
                type="text"
                id="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="ta-form-group">
              <label className="ta-form-label" htmlFor="password">Password</label>
              <input
                className="ta-form-input"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            {error && <div className="ta-login__error">{error}</div>}
            <button type="submit" className="ta-login__submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <a href="/" className="ta-login__back-link">
            <FiArrowLeft size={14} /> Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
