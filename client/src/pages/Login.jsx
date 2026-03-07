import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, forgotPassword, resetPassword } from '../api';
import { FiArrowLeft, FiCheck, FiMail, FiLock, FiKey } from 'react-icons/fi';
import './Admin.css';

export default function Login() {
  const navigate = useNavigate();
  // views: 'login', 'forgot', 'reset'
  const [view, setView] = useState('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot/Reset State
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword({ email: resetEmail });
      setSuccess('OTP sent to your email!');
      setTimeout(() => {
        setSuccess('');
        setView('reset');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword({ email: resetEmail, otp, newPassword });
      setSuccess('Password reset successful! You can now login.');
      setTimeout(() => {
        setSuccess('');
        setView('login');
        setOtp('');
        setNewPassword('');
        setResetEmail('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
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
          
          {view === 'login' && (
            <>
              <h2>Sign In</h2>
              <p>Enter your credentials to access the admin panel</p>

              <form className="ta-login__form" onSubmit={handleLogin}>
                <div className="ta-form-group">
                  <label className="ta-form-label" htmlFor="email">Email Address</label>
                  <div className="ta-input-icon-wrapper" style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
                    <input
                      className="ta-form-input"
                      style={{ paddingLeft: '45px' }}
                      type="email"
                      id="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="ta-form-group">
                  <label className="ta-form-label" htmlFor="password">Password</label>
                  <div className="ta-input-icon-wrapper" style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
                    <input
                      className="ta-form-input"
                      style={{ paddingLeft: '45px' }}
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', width: '100%' }}>
                    <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'hsl(var(--primary))', fontSize: '0.85rem', cursor: 'pointer', marginLeft: 'auto' }}>
                      Forgot Password?
                    </button>
                  </div>
                </div>
                {error && <div className="ta-login__error">{error}</div>}
                {success && <div className="ta-login__success" style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}
                <button type="submit" className="ta-login__submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </>
          )}

          {view === 'forgot' && (
            <>
              <h2>Reset Password</h2>
              <p>Enter your admin email. We will send you a 6-digit OTP code.</p>

              <form className="ta-login__form" onSubmit={handleForgotPassword}>
                <div className="ta-form-group">
                  <label className="ta-form-label" htmlFor="resetEmail">Email Address</label>
                  <div className="ta-input-icon-wrapper" style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
                    <input
                      className="ta-form-input"
                      style={{ paddingLeft: '45px' }}
                      type="email"
                      id="resetEmail"
                      placeholder="admin@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <div className="ta-login__error">{error}</div>}
                {success && <div className="ta-login__success" style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}
                <button type="submit" className="ta-login__submit" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                  <button type="button" onClick={() => { setView('login'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted))', fontSize: '0.9rem', cursor: 'pointer' }}>
                    Wait, I remember my password
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'reset' && (
            <>
              <h2>Verify OTP & New Password</h2>
              <p>Enter the 6-digit code sent to {resetEmail}</p>

              <form className="ta-login__form" onSubmit={handleResetPassword}>
                <div className="ta-form-group">
                  <label className="ta-form-label" htmlFor="otp">6-Digit OTP</label>
                  <div className="ta-input-icon-wrapper" style={{ position: 'relative' }}>
                    <FiKey style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
                    <input
                      className="ta-form-input"
                      type="text"
                      id="otp"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      style={{ paddingLeft: '45px', letterSpacing: '2px', fontSize: '1.2rem', textAlign: 'center' }}
                    />
                  </div>
                </div>
                <div className="ta-form-group">
                  <label className="ta-form-label" htmlFor="newPassword">New Password</label>
                  <div className="ta-input-icon-wrapper" style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted))' }} />
                    <input
                      className="ta-form-input"
                      style={{ paddingLeft: '45px' }}
                      type="password"
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <div className="ta-login__error">{error}</div>}
                {success && <div className="ta-login__success" style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}
                <button type="submit" className="ta-login__submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Confirm Reset'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                     <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'hsl(var(--muted))', fontSize: '0.9rem', cursor: 'pointer' }}>
                    Resend Code
                  </button>
                </div>
              </form>
            </>
          )}

          <a href="/" className="ta-login__back-link" style={{ marginTop: '20px', display: 'inline-flex' }}>
            <FiArrowLeft size={14} /> Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
