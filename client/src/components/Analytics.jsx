/**
 * Analytics.jsx — Digital Marketing & Lead Tracking Component
 *
 * Injects GA4, Facebook Pixel, LinkedIn Insight Tag scripts dynamically.
 * Also captures UTM parameters for lead attribution and logs pageviews
 * to our own backend for admin dashboard visibility.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

// ── Helpers ──────────────────────────────────────────────────────────
function injectScript(src, id, onload) {
  if (document.getElementById(id)) return; // Already injected
  const s = document.createElement('script');
  s.src = src;
  s.id = id;
  s.async = true;
  if (onload) s.onload = onload;
  document.head.appendChild(s);
}

function injectInlineScript(code, id) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.innerHTML = code;
  document.head.appendChild(s);
}

// ── GA4 ──────────────────────────────────────────────────────────────
function initGA4(measurementId) {
  if (!measurementId) return;
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, 'ga4-script');
  injectInlineScript(`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { send_page_view: false });
    window.__ga4Id = '${measurementId}';
  `, 'ga4-config');
}

function trackPageviewGA4(path) {
  if (window.gtag && window.__ga4Id) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
    });
  }
}

// ── Facebook Pixel ────────────────────────────────────────────────────
function initFBPixel(pixelId) {
  if (!pixelId) return;
  injectInlineScript(`
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    window.__fbPixelId = '${pixelId}';
  `, 'fb-pixel-script');
}

function trackPageviewFB(path) {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function trackLeadFB(data = {}) {
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: data.source || 'Contact Form',
      currency: 'USD',
    });
  }
  if (window.gtag && window.__ga4Id) {
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: data.source || 'Contact Form',
    });
  }
}

// ── LinkedIn Insight ──────────────────────────────────────────────────
function initLinkedIn(partnerId) {
  if (!partnerId) return;
  injectInlineScript(`
    _linkedin_partner_id = "${partnerId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  `, 'li-partner-id');
  injectInlineScript(`
    (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);
  `, 'li-insight-script');
}

// ── UTM Capture ───────────────────────────────────────────────────────
function captureUTM() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    term: params.get('utm_term') || '',
    content: params.get('utm_content') || '',
  };
  if (utm.source) {
    sessionStorage.setItem('utm', JSON.stringify(utm));
  }
  return utm;
}

export function getStoredUTM() {
  try { return JSON.parse(sessionStorage.getItem('utm') || '{}'); } catch { return {}; }
}

// ── Pageview logging to our own backend ──────────────────────────────
async function logPageview(path) {
  try {
    const utm = getStoredUTM();
    await api.post('/analytics/pageview', {
      page: path,
      referrer: document.referrer || 'direct',
      utmSource: utm.source,
      utmMedium: utm.medium,
      utmCampaign: utm.campaign,
    });
  } catch {
    // Silently fail — never disrupt UX
  }
}

// ── Main Component ────────────────────────────────────────────────────
export default function Analytics({ settings }) {
  const location = useLocation();

  // Initialize tracking scripts once
  useEffect(() => {
    if (!settings) return;
    captureUTM();
    initGA4(settings.googleAnalyticsId);
    initFBPixel(settings.facebookPixelId);
    initLinkedIn(settings.linkedinPartnerId);
  }, [settings]);

  // Track each route change
  useEffect(() => {
    const path = location.pathname + location.search;
    trackPageviewGA4(path);
    trackPageviewFB(path);
    logPageview(path);
  }, [location]);

  return null; // Purely behavioral — renders nothing
}
