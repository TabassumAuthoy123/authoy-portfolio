import { useState, useEffect } from 'react';
import api from '../api';
import './ClientPortal.css';
import {
  FiLock, FiLogOut, FiUsers, FiMail, FiCalendar, FiGlobe,
  FiBriefcase, FiDollarSign, FiClock, FiKey, FiInfo, FiCopy,
  FiEye, FiEyeOff, FiCheck, FiSettings, FiActivity, FiTerminal
} from 'react-icons/fi';

export default function ClientPortal() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('client_api_key') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [portalData, setPortalData] = useState(null);
  const [inputKey, setInputKey] = useState('');

  // Key Actions
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenConfirm, setRegenConfirm] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  // White-label customizer state
  const [brandColor, setBrandColor] = useState('#14b8a6');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandTitle, setBrandTitle] = useState('Client Form');

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
      verifyAndLoadPortal(apiKey);
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

  const copyToClipboard = () => {
    if (!portalData?.client?.apiKey) return;
    navigator.clipboard.writeText(portalData.client.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = async () => {
    setRegenLoading(true);
    try {
      const currentKey = localStorage.getItem('client_api_key');
      const res = await api.post('/clients/portal/regenerate-key', {}, {
        headers: { 'x-api-key': currentKey }
      });
      
      const newKey = res.data.apiKey;
      localStorage.setItem('client_api_key', newKey);
      setApiKey(newKey);
      setRegenConfirm(false);
      alert('Success! Your new B2B API Key is regenerated. Save this new key as your previous key is now invalidated.');
      verifyAndLoadPortal(newKey);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to regenerate API key.');
    }
    setRegenLoading(false);
  };

  if (loading && !portalData) {
    return (
      <div className="portal-loading">
        <div className="portal-spinner"></div>
        <span>Loading White-label Tenant System...</span>
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
            <p>Access White-Label Developer Tools, API Analytics, and Pipeline Integrations.</p>
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
                  placeholder="Enter your B2B API key (pk_...)"
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
            <p>Default white-label client API Key for local sandbox testing: <br /><code>pk_authoyb2cclientkey2026</code></p>
          </div>
        </div>
      </div>
    );
  }

  const { client, messages } = portalData;

  const planColors = { starter: 'starter-color', professional: 'prof-color', enterprise: 'ent-color' };
  const statusColors = { active: 'active-color', suspended: 'suspended-color', trial: 'trial-color', inactive: 'inactive-color' };

  // Calculate usage percentages based on white-label B2B limits
  const messageLimit = client.plan === 'enterprise' ? 1000 : client.plan === 'professional' ? 200 : 50;
  const messageUsagePercent = Math.min(Math.round((messages.length / messageLimit) * 100), 100);

  const apiCallLimit = client.plan === 'enterprise' ? 100000 : client.plan === 'professional' ? 10000 : 2000;
  const apiCallUsage = Math.round(messages.length * 8.5 + (client.projectsDelivered || 0) * 12); // Simulated calls
  const apiCallPercent = Math.min(Math.round((apiCallUsage / apiCallLimit) * 100), 100);

  // Mock Developer API Logs for troubleshooting
  const mockApiLogs = [
    { timestamp: new Date(Date.now() - 10000).toISOString(), endpoint: '/api/contact', method: 'POST', status: 201, latency: '112ms', ip: '127.0.0.1' },
    { timestamp: new Date(Date.now() - 150000).toISOString(), endpoint: '/api/profile', method: 'GET', status: 200, latency: '45ms', ip: '192.168.1.50' },
    { timestamp: new Date(Date.now() - 400000).toISOString(), endpoint: '/api/contact', method: 'POST', status: 201, latency: '128ms', ip: '103.22.40.12' },
  ];

  return (
    <div className="portal-dashboard">
      {/* HEADER */}
      <header className="portal-header">
        <div className="portal-header-left">
          <div className="portal-logo">✦</div>
          <div>
            <h1>{client.companyName}</h1>
            <span className="portal-subtitle">White-Label B2B Client Dashboard</span>
          </div>
        </div>
        <button onClick={handleLogout} className="portal-btn portal-btn-logout">
          <FiLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </header>

      <main className="portal-content">
        {/* UPPER METRICS CARDS */}
        <div className="portal-grid">
          <div className="portal-card bg-gradient-plan">
            <div className="portal-card-header">
              <h3>CMS Subscription</h3>
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
              <h3>Portfolios Connected</h3>
              <FiGlobe size={20} />
            </div>
            <div className="portal-card-body">
              <span className="portal-metric-val">{client.projectsDelivered || 0}</span>
              <p className="portal-card-text">Total linked client instances</p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <h3>Contract Value</h3>
              <FiDollarSign size={20} />
            </div>
            <div className="portal-card-body">
              <span className="portal-metric-val">${client.totalRevenue ? client.totalRevenue.toLocaleString() : '0'}</span>
              <p className="portal-card-text">Billing ledger accumulated</p>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-header">
              <h3>Inquiries Managed</h3>
              <FiMail size={20} />
            </div>
            <div className="portal-card-body">
              <span className="portal-metric-val">{messages.length}</span>
              <p className="portal-card-text">Forms submissions logged</p>
            </div>
          </div>
        </div>

        {/* PROGRESS METERS SECTION */}
        <div className="portal-progress-section">
          <h2>📊 API Usage & Limits Utilization</h2>
          <div className="portal-progress-grid">
            <div className="progress-card">
              <div className="progress-header">
                <span>Inquiry Storage quota ({messages.length} / {messageLimit})</span>
                <span className="progress-val">{messageUsagePercent}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-teal" style={{ width: `${messageUsagePercent}%` }}></div>
              </div>
            </div>

            <div className="progress-card">
              <div className="progress-header">
                <span>API Calls quota ({apiCallUsage} / {apiCallLimit})</span>
                <span className="progress-val">{apiCallPercent}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-purple" style={{ width: `${apiCallPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION - CONTROLS & LOGS */}
        <div className="portal-layout-split">
          {/* LEFT COLUMN: KEYS AND WHITE-LABEL SETTINGS */}
          <div className="portal-left-column">
            {/* API KEY SECTION */}
            <div className="portal-section-card secure-key-card">
              <div className="section-header">
                <h2>🔐 Secure API Integration Key</h2>
              </div>
              <div className="key-management-box">
                <p>Use this credentials key to authenticate submissions from your forms.</p>
                <div className="key-input-row">
                  <div className="key-input-wrapper">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={client.apiKey}
                      readOnly
                      className="secure-key-input"
                    />
                    <button className="key-toggle-btn" onClick={() => setShowKey(!showKey)} title={showKey ? 'Hide' : 'Reveal'}>
                      {showKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  <button className="key-copy-btn" onClick={copyToClipboard} title="Copy Key">
                    {copied ? <FiCheck size={16} style={{ color: '#14b8a6' }} /> : <FiCopy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="key-actions-row">
                  <button className="portal-btn portal-btn-danger-outline" onClick={() => setRegenConfirm(true)}>
                    <FiLock size={14} style={{ marginRight: '6px' }} />
                    Regenerate API Key
                  </button>
                </div>

                {regenConfirm && (
                  <div className="regen-confirm-modal">
                    <div className="regen-modal-inner">
                      <h4>⚠️ Warning: Regenerate API Key?</h4>
                      <p>
                        This will instantly invalidate your current key. Any forms, scripts, or apps actively sending submissions using the old key will throw authorization failures until they are updated with the new one.
                      </p>
                      <div className="modal-buttons">
                        <button className="portal-btn portal-btn-danger" onClick={handleRegenerateKey} disabled={regenLoading}>
                          {regenLoading ? 'Regenerating...' : 'Yes, Invalidate & Regenerate'}
                        </button>
                        <button className="portal-btn portal-btn-secondary" onClick={() => setRegenConfirm(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* WHITE-LABEL CUSTOMIZER */}
            <div className="portal-section-card white-label-card">
              <div className="section-header">
                <h2>⚙️ Brand Customizer Preview</h2>
              </div>
              <div className="brand-customizer-box">
                <p>Customize White-label branding tokens for client widgets.</p>
                <div className="brand-form-grid">
                  <div className="form-group">
                    <label>Form Title Header</label>
                    <input type="text" value={brandTitle} onChange={(e) => setBrandTitle(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Primary Brand Color</label>
                    <div className="color-picker-row">
                      <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} />
                      <code>{brandColor}</code>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Brand Logo URL</label>
                    <input type="text" placeholder="https://..." value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} />
                  </div>
                </div>

                {/* LIVE PREVIEW CONTAINER */}
                <div className="live-preview-container">
                  <span className="preview-badge">Live White-Label Preview</span>
                  <div className="widget-preview-box" style={{ borderTop: `4px solid ${brandColor}` }}>
                    <div className="widget-preview-header">
                      {brandLogo ? <img src={brandLogo} alt="Logo" className="preview-logo" /> : <div className="preview-logo-placeholder">✦</div>}
                      <h4 style={{ color: brandColor }}>{brandTitle}</h4>
                    </div>
                    <div className="widget-preview-form">
                      <div className="preview-input-field">Name</div>
                      <div className="preview-input-field">Email</div>
                      <button className="preview-submit-btn" style={{ background: brandColor }}>Submit Inquire</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LOGS & INTEGRATIONS */}
          <div className="portal-right-column">
            {/* MESSAGES INBOX */}
            <div className="portal-section-card messages-inbox">
              <div className="section-header">
                <h2>📬 Contact Inquiries Log</h2>
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

            {/* LIVE API LOGGER TERMINAL */}
            <div className="portal-section-card developer-logs-card">
              <div className="section-header">
                <h2><FiTerminal style={{ marginRight: '8px' }} /> Developer API Log (Troubleshooting)</h2>
              </div>
              <div className="terminal-logs-wrapper">
                <div className="terminal-logs-header">
                  <FiActivity className="pulse-icon" />
                  <span>Interactive API Stream (Filter: clientId === "{client._id.slice(0,8)}...")</span>
                </div>
                <div className="terminal-logs-body">
                  {mockApiLogs.map((log, index) => (
                    <div className="terminal-log-line" key={index}>
                      <span className="log-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="log-method">{log.method}</span>
                      <span className="log-endpoint">{log.endpoint}</span>
                      <span className={`log-status status-${log.status}`}>{log.status}</span>
                      <span className="log-latency">{log.latency}</span>
                      <span className="log-ip">ip: {log.ip}</span>
                    </div>
                  ))}
                  <div className="terminal-log-line log-waiting">
                    <span className="log-cursor">█</span>
                    <span>Waiting for inbound request...</span>
                  </div>
                </div>
              </div>
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
  "email": "jane@white-label.com",
  "message": "Project request details",
  "clientId": "${client._id}"
}`}
                </pre>

                <div className="guide-info-box">
                  <FiInfo size={16} />
                  <p>Use your Client ID shown below when integrating forms to ensure inquiries routes to this portal.</p>
                </div>

                <div className="tenant-id-box">
                  <span className="tenant-label">Your B2B Client ID:</span>
                  <code className="tenant-code">{client._id}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
