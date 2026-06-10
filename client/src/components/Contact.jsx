import { useState, useEffect } from 'react';
import { sendMessage, getProfile } from '../api';
import {
  FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiSend,
  FiClock, FiUser, FiMessageSquare, FiAtSign
} from 'react-icons/fi';

const FALLBACK_PROFILE = {
  location: 'Dhaka, Bangladesh',
  email: 'authoy@email.com',
  phone: '+880 1XXX-XXXXXX',
  githubUrl: 'https://github.com/TabassumAuthoy123',
  linkedinUrl: 'https://linkedin.com/in/tabassum-authoy'
};

export default function Contact() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getProfile()
      .then(res => setProfile(res.data))
      .catch(() => setProfile(FALLBACK_PROFILE));
  }, []);

  const p = profile || FALLBACK_PROFILE;

  const infoCards = [
    {
      icon: <FiMapPin size={20} />,
      title: 'Location',
      value: p.location || FALLBACK_PROFILE.location,
      accent: '#3B82F6',
    },
    {
      icon: <FiMail size={20} />,
      title: 'Email',
      value: p.email || FALLBACK_PROFILE.email,
      href: `mailto:${p.email || FALLBACK_PROFILE.email}`,
      accent: '#2dd4bf',
    },
    {
      icon: <FiPhone size={20} />,
      title: 'Phone',
      value: p.phone || FALLBACK_PROFILE.phone,
      href: `tel:${(p.phone || FALLBACK_PROFILE.phone).replace(/\s+/g, '')}`,
      accent: '#22C55E',
    },
    {
      icon: <FiClock size={20} />,
      title: 'Response Time',
      value: 'I typically reply within one business day.',
      accent: '#F97316',
    },
  ];

  const socials = [
    { icon: <FiGithub size={20} />, label: 'GitHub', url: p.githubUrl || FALLBACK_PROFILE.githubUrl },
    { icon: <FiLinkedin size={20} />, label: 'LinkedIn', url: p.linkedinUrl || FALLBACK_PROFILE.linkedinUrl },
  ];

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSending(true);
    setStatus('');
    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        message: form.message,
        honeypot: form.honeypot
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '', honeypot: '' });
      setErrors({});
    } catch (error) {
      console.error('Message failed to send:', error);
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto', marginBottom: 48 }}>
          <div className="section__badge">Contact</div>
          <h2 className="section__title">
            Reach <span className="text-gradient">Out</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            Have an opportunity, project idea, or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="ct__grid">
          {/* ─── Left: Info Cards ─── */}
          <div className="ct__info">
            {infoCards.map((c, i) => {
              const inner = (
                <div className="ct__info-card" key={i} style={{ '--ct-accent': c.accent }}>
                  <div className="ct__info-icon">{c.icon}</div>
                  <div>
                    <p className="ct__info-label">{c.title}</p>
                    <p className="ct__info-value">{c.value}</p>
                  </div>
                </div>
              );
              return c.href ? (
                <a href={c.href} key={i} className="ct__info-link">{inner}</a>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}

            {/* Social buttons */}
            <div className="ct__socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ct__social-btn"
                >
                  {s.icon}
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ─── Right: Contact Form ─── */}
          <div className="ct__form-card">
            <h3 className="ct__form-heading">Send a Message</h3>
            <p className="ct__form-subtitle">Fill in the details and I'll get back to you shortly.</p>

            <form className="ct__form" onSubmit={handleSubmit} noValidate>
              {/* Honeypot field — hidden from humans, catches bots */}
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="ct__field">
                <div className="ct__field-icon"><FiUser size={16} /></div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({...errors, name: ''}); }}
                  required
                  placeholder="Your Name"
                  id="contact-name"
                />
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.name}</span>}
              </div>
              <div className="ct__field">
                <div className="ct__field-icon"><FiAtSign size={16} /></div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({...errors, email: ''}); }}
                  required
                  placeholder="your@email.com"
                  id="contact-email"
                />
                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.email}</span>}
              </div>
              <div className="ct__field ct__field--textarea">
                <div className="ct__field-icon"><FiMessageSquare size={16} /></div>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); if (errors.message) setErrors({...errors, message: ''}); }}
                  required
                  placeholder="What's on your mind?"
                  id="contact-message"
                ></textarea>
                {errors.message && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.message}</span>}
              </div>

              <button type="submit" className="ct__submit" disabled={sending} id="contact-submit">
                {sending ? 'Sending...' : <><FiSend size={16} /> Send Message</>}
              </button>

              <p className="ct__privacy">🔒 Your information is secure and will never be shared.</p>

              {status === 'sent' && (
                <p className="ct__success">✓ Message sent! I'll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="ct__error" style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>
                  ✗ Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
