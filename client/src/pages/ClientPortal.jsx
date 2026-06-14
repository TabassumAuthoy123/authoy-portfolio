import { useState, useEffect } from 'react';
import api from '../api';
import './ClientPortal.css';
import {
  FiLock, FiLogOut, FiUsers, FiMail, FiCalendar, FiGlobe,
  FiBriefcase, FiDollarSign, FiClock, FiKey, FiInfo
} from 'react-icons/fi';

export default function ClientPortal() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('client_api_key') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [portalData, setPortalData] = useState(null);
  const [inputKey, setInputKey] = useState('');

  const verifyAndLoadPortal = async (key) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/clients/portal/me', {
        headers: { 'x-api-key': key }
      });
      setPortalData(res.data);
      setIsLoggedIn(true);
      localStorage.setItem('client_api_key', key);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your API Key.');
      setIsLoggedIn(false);
      localStorage.removeItem('client_api_key');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (apiKey) {
      const timer = setTimeout(() => {
        verifyAndLoadPortal(apiKey);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [apiKey]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError('API Key is required.');
      return;
    }
    verifyAndLoadPortal(inputKey.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('client_api_key');
    setApiKey('');
    setInputKey('');
    setPortalData(null);
    setIsLoggedIn(false);
  };

  if (loading && !portalData) {
    return (
      <div className="portal-loading">
        <div className="portal-spinner"></div>
        <span>Authenticating tenant credentials...</span>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="portal-login-container">
        <div className="portal-login-card">
          <div className="portal-login-header">
            <div className="portal-logo-container">
              <FiKey size={24} />
            </div>
            <h2>B2B Client Portal</h2>
            <p>Access your white-label developer CMS analytics, plan limits, and message logs.</p>
          </div>

          <form onSubmit={handleLogin} className="portal-login-form">
            {error && <div className="portal-error-msg">{error}</div>}
            <div className="portal-form-group">
              <label htmlFor="apiKey">Client API Key</label>
              <div className="portal-input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your pk_..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="portal-btn portal-btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          <div className="portal-login-footer">
            <p>Need an API key? Contact the administrator to set up your subscription.</p>
          </div>
        </div>
      </div>
    );
  }

  const { client, messages } = portalData;

  const planColors = { starter: 'starter-color', professional: 'prof-color', enterprise: 'ent-color' };
  const statusColors = { active: 'active-color', suspended: 'suspended-color', trial: 'trial-color', inactive: 'inactive-color' };

  return (
    <div className="portal-dashboard">
      {/* HEADER */}
      <header className="portal-header">
        <div className="portal-header-left">
          <div className="portal-logo">CP</div>
          <div>
            <h1>{client.companyName}</h1>
            <span className="portal-subtitle">Client Dashboard</span>
          </div>
        </div>
        <button onClick={handleLogout} className="portal-btn portal-btn-logout">
          <FiLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </header>

      <main className="portal-content">
        {/* METRICS GRID */}
        <div className="portal-grid">
          <div className="portal-card bg-gradient-plan">
            <div className="portal-card-header">
              <h3>Subscription Plan</h3>
              <FiBriefcase size={20} />
            </div>
            <div className="portal-card-body">
              <div className={`portal-badge ${planColors[client.plan] || 'starter-color'}`}>
                {client.plan.toUpperCase()}
              </div>
              <p className="portal-card-text">Status: <span className={`status-text ${statusColors[client.status]}`}>{client.status}</span></p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <h3>Projects Delivered</h3>
              <FiGlobe size={20} />
            </div>
            <div className="portal-card-body">
              <span className="portal-metric-val">{client.projectsDelivered || 0}</span>
              <p className="portal-card-text">Active portfolios linked</p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <h3>Total Investment</h3>
              <FiDollarSign size={20} />
            </div>
            <div className="portal-card-body">
              <span className="portal-metric-val">${client.totalRevenue ? client.totalRevenue.toLocaleString() : '0'}</span>
              <p className="portal-card-text">Subscription billings</p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <h3>Contact Messages</h3>
              <FiMail size={20} />
            </div>
            <div className="portal-card-body">
              <span className="portal-metric-val">{messages.length}</span>
              <p className="portal-card-text">Total inquiries received</p>
            </div>
          </div>
        </div>

        {/* DETAILS AND INTEGRATION GUIDE */}
        <div className="portal-layout-split">
          {/* MESSAGES SECTION */}
          <div className="portal-section-card messages-inbox">
            <div className="section-header">
              <h2>📬 Contact Inquiry Log</h2>
              <span className="portal-count">{messages.length} messages</span>
            </div>
            {messages.length === 0 ? (
              <div className="portal-empty">
                <FiMail size={48} />
                <p>No messages received yet.</p>
                <span>Visitors submitting forms using your tenant ID will appear here.</span>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div className="message-item" key={msg._id}>
                    <div className="message-item-header">
                      <div className="message-user">
                        <h4>{msg.name}</h4>
                        <span>{msg.email}</span>
                      </div>
                      <div className="message-date">
                        <FiCalendar size={12} />
                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="message-body">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INTEGRATION GUIDE SECTION */}
          <div className="portal-section-card integration-guide">
            <div className="section-header">
              <h2>⚙️ API Integration Guide</h2>
            </div>
            <div className="guide-body">
              <p>Connect your portfolio contact forms directly to your dashboard client pipeline:</p>
              
              <div className="guide-code-header">
                <span>Submit Form Endpoint (POST)</span>
              </div>
              <pre className="guide-code">
{`POST /api/contact
Content-Type: application/json

{
  "name": "Jane Client",
  "email": "jane@example.com",
  "message": "Project request details",
  "clientId": "${client._id}"
}`}
              </pre>

              <div className="guide-info-box">
                <FiInfo size={16} />
                <p>Use your Client ID shown below when integrating forms to ensure inquiries routes to this portal.</p>
              </div>

              <div className="tenant-id-box">
                <span className="tenant-label">Your Client ID:</span>
                <code className="tenant-code">{client._id}</code>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
