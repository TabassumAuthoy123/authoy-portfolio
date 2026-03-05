import { useState, useEffect } from 'react';
import { sendMessage, getProfile } from '../api';
import {
  FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiSend,
  FiClock, FiUser, FiMessageSquare, FiAtSign
} from 'react-icons/fi';

const FALLBACK_PROFILE = {
  location: 'Dhaka, Bangladesh',
  email: 'adnankmitul@gmail.com',
  phone: '+880 1305 900658',
  githubUrl: 'https://github.com/adnan-mitul',
  linkedinUrl: 'https://linkedin.com/in/adnan-kader-mitul'
};

export default function Contact() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('');
    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        message: form.message
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
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

            <form className="ct__form" onSubmit={handleSubmit}>
              <div className="ct__field">
                <div className="ct__field-icon"><FiUser size={16} /></div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="ct__field">
                <div className="ct__field-icon"><FiAtSign size={16} /></div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="ct__field ct__field--textarea">
                <div className="ct__field-icon"><FiMessageSquare size={16} /></div>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  placeholder="What's on your mind?"
                ></textarea>
              </div>

              <button type="submit" className="ct__submit" disabled={sending}>
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
