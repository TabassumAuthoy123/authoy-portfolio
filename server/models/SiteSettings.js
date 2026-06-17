const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // SEO
  siteTitle: { type: String, default: 'Tabassum Authoy — Portfolio' },
  siteDescription: { type: String, default: 'Software Engineer, AI Safety Researcher & Business Development Manager building digital experiences that inspire.' },
  siteKeywords: { type: String, default: 'Tabassum Authoy, Software Engineer, AI Safety, BRAC University, DU EMBA, SoftifyBD, classical dance' },
  ogImage: { type: String, default: '' },
  favicon: { type: String, default: '' },
  canonicalUrl: { type: String, default: 'https://tabassumauthoy.me' },

  // Branding
  brandName: { type: String, default: 'Tabassum Authoy' },
  brandLogo: { type: String, default: '' },
  accentColor: { type: String, default: '#2dd4bf' },
  primaryColor: { type: String, default: '#3b82f6' },

  // Contact
  supportEmail: { type: String, default: 'tabassumauthoy12@gmail.com' },
  notificationEmail: { type: String, default: 'tabassumauthoy12@gmail.com' },
  contactPhone: { type: String, default: '' },
  address: { type: String, default: 'Dhaka, Bangladesh' },

  // Social Links
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },

  // Features toggles
  features: {
    showArticles: { type: Boolean, default: true },
    showGallery: { type: Boolean, default: true },
    showContact: { type: Boolean, default: true },
    showNewsletter: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    showAIAssistant: { type: Boolean, default: true },
  },

  // Footer
  footerText: { type: String, default: '© 2026 Tabassum Mustafa Authoy. All rights reserved.' },
  footerLinks: [{
    label: { type: String, default: '' },
    url: { type: String, default: '' },
  }],

  // Analytics & Marketing Tracking
  googleAnalyticsId: { type: String, default: '' },     // GA4: G-XXXXXXXXXX
  facebookPixelId: { type: String, default: '' },        // Facebook Pixel ID (numeric)
  linkedinPartnerId: { type: String, default: '' },      // LinkedIn Insight Tag partner_id
  hotjarId: { type: String, default: '' },               // Hotjar site ID (optional)
  googleTagManagerId: { type: String, default: '' },     // GTM-XXXXXXX (optional)

  // Lead Generation
  leadMagnetEnabled: { type: Boolean, default: false },
  leadMagnetTitle: { type: String, default: 'Get My Free Tech Consultation' },
  leadMagnetText: { type: String, default: 'Book a 30-minute strategy session and discover how technology can accelerate your business.' },

  // SEO - Robots
  robotsIndex: { type: Boolean, default: true },
  robotsFollow: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
