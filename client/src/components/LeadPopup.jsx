/**
 * LeadPopup.jsx — Exit-intent & timed lead generation popup
 *
 * Shows a smart popup after 30s or on exit intent.
 * Sends users to the booking section when clicked.
 * Tracks the lead via Facebook Pixel & GA4 if configured.
 */
import { useState, useEffect, useCallback } from 'react';
import { trackLeadFB } from './Analytics';

const DISMISS_KEY = 'lead_popup_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function LeadPopup({ settings }) {
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const show = useCallback(() => {
    if (hasShown) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < DISMISS_DURATION) return;

    setVisible(true);
    setHasShown(true);
  }, [hasShown]);

  // Timer-based trigger: show after 30 seconds
  useEffect(() => {
    const timer = setTimeout(show, 30000);
    return () => clearTimeout(timer);
  }, [show]);

  // Exit-intent trigger: show when mouse leaves viewport top
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 5) show();
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [show]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleCTA = () => {
    // Track the lead
    trackLeadFB({ source: 'Lead Popup' });

    // Navigate to booking
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#booking';
    }

    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!visible) return null;

  const title = settings?.leadMagnetTitle || 'Let\'s Work Together';
  const text = settings?.leadMagnetText || 'Schedule a free 30-minute consultation to discuss your project needs.';

  return (
    <div className="lead-popup" role="dialog" aria-modal="true" aria-label="Consultation offer">
      <button
        className="lead-popup__close"
        onClick={handleDismiss}
        aria-label="Close"
      >
        ×
      </button>
      <span className="lead-popup__icon">🚀</span>
      <h3 className="lead-popup__title">{title}</h3>
      <p className="lead-popup__text">{text}</p>
      <button className="lead-popup__cta" onClick={handleCTA}>
        Book a Free Consultation →
      </button>
    </div>
  );
}
