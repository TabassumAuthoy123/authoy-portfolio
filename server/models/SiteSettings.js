const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // SEO
  siteTitle: { type: String, default: 'Tabassum Authoy — Portfolio' },
  siteDescription: { type: String, default: 'Full Stack Developer & Competitive Programmer building digital experiences that inspire.' },
  siteKeywords: { type: String, default: 'portfolio, developer, full stack, react, node.js, competitive programming' },
  ogImage: { type: String, default: '' },
  favicon: { type: String, default: '' },

  // Branding
  brandName: { type: String, default: 'Tabassum Authoy' },
  brandLogo: { type: String, default: '' },
  accentColor: { type: String, default: '#2dd4bf' },
  primaryColor: { type: String, default: '#3b82f6' },

  // Contact
  supportEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  address: { type: String, default: '' },

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
  },

  // Footer
  footerText: { type: String, default: '© 2026 Tabassum Authoy. All rights reserved.' },
  footerLinks: [{
    label: { type: String, default: '' },
    url: { type: String, default: '' },
  }],

  // Analytics
  googleAnalyticsId: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
