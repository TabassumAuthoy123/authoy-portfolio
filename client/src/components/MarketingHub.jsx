/**
 * MarketingHub.jsx — Full Digital Marketing Dashboard for Admin CMS
 * 
 * Features:
 * - Pixel Setup & Verification (GA4, Facebook Pixel, LinkedIn, GTM, Hotjar)
 * - Campaign Manager (create/manage campaigns with UTM tracking)
 * - UTM Link Builder
 * - Lead Magnet Configuration
 * - Conversion event tracking preview
 */
import { useState, useEffect, useCallback } from 'react';
import {
  FiCheck, FiX, FiPlus, FiTrash2, FiCopy, FiExternalLink,
  FiRefreshCw, FiSettings, FiActivity, FiTarget, FiLink,
  FiZap, FiEye, FiBarChart2, FiEdit2
} from 'react-icons/fi';
import { getSettings, updateSettings } from '../api';

/* ═════════════════════════════════════
   PIXEL SETUP & VERIFICATION PANEL
   ═════════════════════════════════════ */
function PixelSetupPanel({ settings, onSettingsChange }) {
  const pixels = [
    {
      id: 'googleAnalyticsId',
      name: 'Google Analytics 4',
      icon: '📊',
      color: '#E37400',
      placeholder: 'G-XXXXXXXXXX',
      help: 'Go to analytics.google.com → Admin → Data Streams → Copy Measurement ID',
      docUrl: 'https://support.google.com/analytics/answer/9304153',
      verifyUrl: 'https://tagassistant.google.com/',
    },
    {
      id: 'facebookPixelId',
      name: 'Facebook / Meta Pixel',
      icon: '📘',
      color: '#1877F2',
      placeholder: '123456789012345',
      help: 'Go to business.facebook.com → Events Manager → Data Sources → Copy Pixel ID',
      docUrl: 'https://www.facebook.com/business/help/952192354843755',
      verifyUrl: 'https://www.facebook.com/events_manager/',
    },
    {
      id: 'linkedinPartnerId',
      name: 'LinkedIn Insight Tag',
      icon: '💼',
      color: '#0A66C2',
      placeholder: '1234567',
      help: 'Go to LinkedIn Campaign Manager → Analyze → Insight Tag → Copy Partner ID',
      docUrl: 'https://www.linkedin.com/help/lms/answer/a418880',
      verifyUrl: 'https://www.linkedin.com/campaignmanager/',
    },
    {
      id: 'googleTagManagerId',
      name: 'Google Tag Manager',
      icon: '🏷️',
      color: '#4285F4',
      placeholder: 'GTM-XXXXXXX',
      help: 'Go to tagmanager.google.com → Container → Copy Container ID',
      docUrl: 'https://support.google.com/tagmanager/answer/6103696',
      verifyUrl: 'https://tagmanager.google.com/',
    },
    {
      id: 'hotjarId',
      name: 'Hotjar',
      icon: '🔥',
      color: '#FD3A5C',
      placeholder: '3456789',
      help: 'Go to hotjar.com → Settings → Sites & Organizations → Copy Site ID',
      docUrl: 'https://help.hotjar.com/hc/en-us/articles/115009336727',
      verifyUrl: 'https://insights.hotjar.com/',
    },
  ];

  return (
    <div className="mh-panel">
      <div className="mh-panel__header">
        <div>
          <h3 className="mh-panel__title"><FiZap /> Pixel Setup & Verification</h3>
          <p className="mh-panel__desc">Configure tracking pixels. Once saved, they auto-inject on every page visit.</p>
        </div>
      </div>
      <div className="mh-pixel-grid">
        {pixels.map(pixel => {
          const value = settings?.[pixel.id] || '';
          const isActive = !!value.trim();

          return (
            <div className={`mh-pixel-card ${isActive ? 'active' : ''}`} key={pixel.id}>
              <div className="mh-pixel-card__top">
                <div className="mh-pixel-card__icon" style={{ background: `${pixel.color}15`, color: pixel.color }}>
                  <span>{pixel.icon}</span>
                </div>
                <div className={`mh-pixel-status ${isActive ? 'connected' : 'inactive'}`}>
                  {isActive ? <><FiCheck size={11} /> Connected</> : <><FiX size={11} /> Not Set</>}
                </div>
              </div>
              <h4 className="mh-pixel-card__name">{pixel.name}</h4>
              <input
                className="mh-pixel-input"
                value={value}
                onChange={e => onSettingsChange(pixel.id, e.target.value)}
                placeholder={pixel.placeholder}
                spellCheck="false"
              />
              <p className="mh-pixel-help">{pixel.help}</p>
              <div className="mh-pixel-links">
                <a href={pixel.docUrl} target="_blank" rel="noreferrer" className="mh-pixel-link">
                  <FiExternalLink size={12} /> Setup Guide
                </a>
                <a href={pixel.verifyUrl} target="_blank" rel="noreferrer" className="mh-pixel-link">
                  <FiEye size={12} /> Verify
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════
   CAMPAIGN MANAGER
   ═════════════════════════════════════ */
function CampaignManagerPanel({ campaigns, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', platform: 'facebook', status: 'draft',
    startDate: '', endDate: '', budget: '', targetUrl: '', notes: '',
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now().toString(), createdAt: new Date().toISOString() });
    setForm({ name: '', platform: 'facebook', status: 'draft', startDate: '', endDate: '', budget: '', targetUrl: '', notes: '' });
    setShowForm(false);
  };

  const platformLabels = {
    facebook: { label: 'Facebook / Instagram', icon: '📘', color: '#1877F2' },
    google: { label: 'Google Ads', icon: '📊', color: '#E37400' },
    linkedin: { label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    tiktok: { label: 'TikTok', icon: '🎵', color: '#000000' },
    email: { label: 'Email Campaign', icon: '📧', color: '#0d9488' },
    organic: { label: 'Organic / SEO', icon: '🌱', color: '#16a34a' },
  };

  const statusColors = {
    draft: { bg: '#64748b20', text: '#64748b' },
    active: { bg: '#16a34a20', text: '#16a34a' },
    paused: { bg: '#eab30820', text: '#eab308' },
    completed: { bg: '#3b82f620', text: '#3b82f6' },
  };

  return (
    <div className="mh-panel">
      <div className="mh-panel__header">
        <div>
          <h3 className="mh-panel__title"><FiTarget /> Campaign Manager</h3>
          <p className="mh-panel__desc">Track and manage marketing campaigns across platforms.</p>
        </div>
        <button className="mh-btn mh-btn--primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={14} /> New Campaign
        </button>
      </div>

      {showForm && (
        <div className="mh-campaign-form">
          <div className="mh-form-grid">
            <div className="mh-form-group">
              <label>Campaign Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Summer 2026 Launch" />
            </div>
            <div className="mh-form-group">
              <label>Platform</label>
              <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                {Object.entries(platformLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <div className="mh-form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mh-form-group">
              <label>Budget</label>
              <input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="$500" />
            </div>
            <div className="mh-form-group">
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="mh-form-group">
              <label>End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="mh-form-group" style={{ marginTop: 12 }}>
            <label>Target URL</label>
            <input value={form.targetUrl} onChange={e => setForm({ ...form, targetUrl: e.target.value })} placeholder="https://tabassumauthoy.me" />
          </div>
          <div className="mh-form-group" style={{ marginTop: 12 }}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Campaign objectives, audience targeting..." rows={2} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="mh-btn mh-btn--primary" onClick={handleAdd}>Create Campaign</button>
            <button className="mh-btn mh-btn--ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="mh-empty">
          <span className="mh-empty__icon">🎯</span>
          <h4>No campaigns yet</h4>
          <p>Create your first campaign to start tracking ad performance.</p>
        </div>
      ) : (
        <div className="mh-campaign-list">
          {campaigns.map(c => {
            const plat = platformLabels[c.platform] || platformLabels.organic;
            const status = statusColors[c.status] || statusColors.draft;
            return (
              <div className="mh-campaign-card" key={c.id}>
                <div className="mh-campaign-card__left">
                  <div className="mh-campaign-platform" style={{ background: `${plat.color}12`, color: plat.color }}>
                    {plat.icon}
                  </div>
                  <div>
                    <h4 className="mh-campaign-name">{c.name}</h4>
                    <div className="mh-campaign-meta">
                      <span className="mh-campaign-badge" style={{ background: status.bg, color: status.text }}>{c.status}</span>
                      <span>{plat.label}</span>
                      {c.budget && <span>Budget: {c.budget}</span>}
                      {c.startDate && <span>From: {c.startDate}</span>}
                    </div>
                  </div>
                </div>
                <button className="mh-btn-icon" onClick={() => onDelete(c.id)} title="Delete campaign">
                  <FiTrash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════
   UTM LINK BUILDER
   ═════════════════════════════════════ */
function UTMBuilderPanel() {
  const [utm, setUtm] = useState({
    url: 'https://tabassumauthoy.me',
    source: '', medium: '', campaign: '', term: '', content: '',
  });
  const [copied, setCopied] = useState(false);

  const generatedUrl = (() => {
    try {
      const u = new URL(utm.url || 'https://tabassumauthoy.me');
      if (utm.source) u.searchParams.set('utm_source', utm.source);
      if (utm.medium) u.searchParams.set('utm_medium', utm.medium);
      if (utm.campaign) u.searchParams.set('utm_campaign', utm.campaign);
      if (utm.term) u.searchParams.set('utm_term', utm.term);
      if (utm.content) u.searchParams.set('utm_content', utm.content);
      return u.toString();
    } catch {
      return utm.url || '';
    }
  })();

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: 'Facebook Ad', source: 'facebook', medium: 'cpc', campaign: '' },
    { label: 'LinkedIn Post', source: 'linkedin', medium: 'social', campaign: '' },
    { label: 'Google Ad', source: 'google', medium: 'cpc', campaign: '' },
    { label: 'Email Newsletter', source: 'newsletter', medium: 'email', campaign: '' },
    { label: 'Instagram Bio', source: 'instagram', medium: 'social', campaign: 'bio_link' },
  ];

  return (
    <div className="mh-panel">
      <div className="mh-panel__header">
        <div>
          <h3 className="mh-panel__title"><FiLink /> UTM Link Builder</h3>
          <p className="mh-panel__desc">Generate trackable links for campaigns. UTM parameters appear in Google Analytics.</p>
        </div>
      </div>

      <div className="mh-utm-presets">
        <span className="mh-utm-presets__label">Quick presets:</span>
        {presets.map(p => (
          <button key={p.label} className="mh-utm-preset-btn"
            onClick={() => setUtm(prev => ({ ...prev, source: p.source, medium: p.medium, campaign: p.campaign || prev.campaign }))}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="mh-form-grid" style={{ marginTop: 16 }}>
        <div className="mh-form-group">
          <label>Website URL *</label>
          <input value={utm.url} onChange={e => setUtm({ ...utm, url: e.target.value })} placeholder="https://tabassumauthoy.me" />
        </div>
        <div className="mh-form-group">
          <label>Source * <small>(utm_source)</small></label>
          <input value={utm.source} onChange={e => setUtm({ ...utm, source: e.target.value })} placeholder="facebook, google, newsletter" />
        </div>
        <div className="mh-form-group">
          <label>Medium * <small>(utm_medium)</small></label>
          <input value={utm.medium} onChange={e => setUtm({ ...utm, medium: e.target.value })} placeholder="cpc, social, email" />
        </div>
        <div className="mh-form-group">
          <label>Campaign <small>(utm_campaign)</small></label>
          <input value={utm.campaign} onChange={e => setUtm({ ...utm, campaign: e.target.value })} placeholder="summer_sale_2026" />
        </div>
        <div className="mh-form-group">
          <label>Term <small>(utm_term)</small></label>
          <input value={utm.term} onChange={e => setUtm({ ...utm, term: e.target.value })} placeholder="running+shoes" />
        </div>
        <div className="mh-form-group">
          <label>Content <small>(utm_content)</small></label>
          <input value={utm.content} onChange={e => setUtm({ ...utm, content: e.target.value })} placeholder="banner_ad_v2" />
        </div>
      </div>

      <div className="mh-utm-result">
        <label>Generated URL</label>
        <div className="mh-utm-url-box">
          <code>{generatedUrl}</code>
          <button className="mh-btn mh-btn--sm" onClick={copyUrl}>
            {copied ? <><FiCheck size={13} /> Copied!</> : <><FiCopy size={13} /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════
   LEAD MAGNET CONFIG
   ═════════════════════════════════════ */
function LeadMagnetPanel({ settings, onSettingsChange, onToggle }) {
  return (
    <div className="mh-panel">
      <div className="mh-panel__header">
        <div>
          <h3 className="mh-panel__title"><FiActivity /> Lead Generation</h3>
          <p className="mh-panel__desc">Configure exit-intent popup for lead capture on the B2C site.</p>
        </div>
        <label className="mh-toggle">
          <input type="checkbox" checked={settings?.leadMagnetEnabled || false} onChange={e => onToggle(e.target.checked)} />
          <span className="mh-toggle__slider" />
          <span className="mh-toggle__label">{settings?.leadMagnetEnabled ? 'Active' : 'Inactive'}</span>
        </label>
      </div>
      <div className="mh-form-grid" style={{ marginTop: 16 }}>
        <div className="mh-form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Popup Title</label>
          <input value={settings?.leadMagnetTitle || ''} onChange={e => onSettingsChange('leadMagnetTitle', e.target.value)} placeholder="Let's Work Together" />
        </div>
        <div className="mh-form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Popup Message</label>
          <textarea value={settings?.leadMagnetText || ''} onChange={e => onSettingsChange('leadMagnetText', e.target.value)} placeholder="Schedule a free 30-minute consultation..." rows={3} />
        </div>
        <div className="mh-form-group">
          <label>Notification Email</label>
          <input value={settings?.notificationEmail || ''} onChange={e => onSettingsChange('notificationEmail', e.target.value)} placeholder="tabassumauthoy12@gmail.com" />
        </div>
        <div className="mh-form-group">
          <label>Support Email</label>
          <input value={settings?.supportEmail || ''} onChange={e => onSettingsChange('supportEmail', e.target.value)} placeholder="tabassumauthoy12@gmail.com" />
        </div>
      </div>
      <div className="mh-lead-preview">
        <div className="mh-lead-preview__card">
          <span style={{ fontSize: '2rem' }}>🚀</span>
          <h4>{settings?.leadMagnetTitle || "Let's Work Together"}</h4>
          <p>{settings?.leadMagnetText || 'Schedule a free 30-minute consultation to discuss your project needs.'}</p>
          <button className="mh-btn mh-btn--primary" style={{ width: '100%', marginTop: 8 }}>Book a Free Consultation →</button>
        </div>
        <p className="mh-lead-preview__note">
          ↑ This popup appears after 30 seconds or when user tries to leave the page (exit-intent).
        </p>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════
   CONVERSION EVENTS REFERENCE
   ═════════════════════════════════════ */
function ConversionEventsPanel() {
  const events = [
    { event: 'PageView', trigger: 'Every page navigation', platforms: ['GA4', 'FB Pixel', 'LinkedIn'] },
    { event: 'Lead / generate_lead', trigger: 'Lead popup CTA clicked', platforms: ['GA4', 'FB Pixel'] },
    { event: 'Contact', trigger: 'Contact form submitted', platforms: ['GA4', 'FB Pixel'] },
    { event: 'ViewContent', trigger: 'Article or project viewed', platforms: ['FB Pixel'] },
    { event: 'Schedule', trigger: 'Booking appointment booked', platforms: ['GA4', 'FB Pixel'] },
  ];

  return (
    <div className="mh-panel">
      <div className="mh-panel__header">
        <div>
          <h3 className="mh-panel__title"><FiBarChart2 /> Conversion Events</h3>
          <p className="mh-panel__desc">Events automatically fired when tracking pixels are configured.</p>
        </div>
      </div>
      <table className="mh-events-table">
        <thead>
          <tr><th>Event</th><th>Trigger</th><th>Platforms</th></tr>
        </thead>
        <tbody>
          {events.map((ev, i) => (
            <tr key={i}>
              <td><code className="mh-code">{ev.event}</code></td>
              <td>{ev.trigger}</td>
              <td>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {ev.platforms.map(p => (
                    <span key={p} className="mh-platform-badge">{p}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═════════════════════════════════════
   MAIN MARKETING HUB COMPONENT
   ═════════════════════════════════════ */
export default function MarketingHub({ showNotif }) {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('pixels');
  const [campaigns, setCampaigns] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mh_campaigns') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    getSettings().then(res => setSettings(res.data)).catch(() => setSettings({}));
  }, []);

  const handleSettingsChange = (key, value) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showNotif?.('Marketing settings saved successfully');
    } catch (err) {
      showNotif?.('Failed to save: ' + (err.response?.data?.message || err.message), 'error');
    }
    setSaving(false);
  };

  const addCampaign = (campaign) => {
    const updated = [campaign, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem('mh_campaigns', JSON.stringify(updated));
    showNotif?.('Campaign created');
  };

  const deleteCampaign = (id) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('mh_campaigns', JSON.stringify(updated));
    showNotif?.('Campaign deleted');
  };

  const tabs = [
    { key: 'pixels', label: 'Pixel Setup', icon: <FiZap size={14} /> },
    { key: 'campaigns', label: 'Campaigns', icon: <FiTarget size={14} /> },
    { key: 'utm', label: 'UTM Builder', icon: <FiLink size={14} /> },
    { key: 'leads', label: 'Lead Gen', icon: <FiActivity size={14} /> },
    { key: 'events', label: 'Events', icon: <FiBarChart2 size={14} /> },
  ];

  if (!settings) return <div className="ta-loading"><div className="ta-spinner" />Loading marketing settings...</div>;

  return (
    <div className="mh-root">
      {/* Sub-navigation tabs */}
      <div className="mh-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`mh-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <div className="mh-tabs__right">
          <button className="mh-btn mh-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'pixels' && (
        <PixelSetupPanel settings={settings} onSettingsChange={handleSettingsChange} />
      )}
      {activeTab === 'campaigns' && (
        <CampaignManagerPanel campaigns={campaigns} onAdd={addCampaign} onDelete={deleteCampaign} />
      )}
      {activeTab === 'utm' && <UTMBuilderPanel />}
      {activeTab === 'leads' && (
        <LeadMagnetPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onToggle={(v) => handleSettingsChange('leadMagnetEnabled', v)}
        />
      )}
      {activeTab === 'events' && <ConversionEventsPanel />}
    </div>
  );
}
