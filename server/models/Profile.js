const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name:            { type: String, default: '' },
  title:           { type: String, default: '' },
  tagline:         { type: String, default: '' },
  email:           { type: String, default: '' },
  phone:           { type: String, default: '' },
  location:        { type: String, default: '' },
  bio:             [{ type: String }],          // array of paragraphs
  quote:           { type: String, default: '' },
  photoUrl:        { type: String, default: '' },
  resumeUrl:       { type: String, default: '' },
  githubUrl:       { type: String, default: '' },
  linkedinUrl:     { type: String, default: '' },
  floatingTags:    [{ type: String }],
  stats: [{
    icon:  { type: String, default: '' },   // emoji or icon name
    value: { type: String, default: '' },
    label: { type: String, default: '' },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
