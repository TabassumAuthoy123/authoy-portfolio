/**
 * Seed script for Profile data.
 * Run with: node seed-profile.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Profile = require('./models/Profile');

const profileData = {
  name: 'Tabassum Mustafa Authoy',
  title: 'Software Engineer & Business Development Manager',
  tagline: 'Working at the intersection of software engineering, AI safety research, and the classical arts.',
  email: 'tabassumauthoy123@gmail.com',
  phone: '+880 1XXX-XXXXXX',
  location: 'Dhaka, Bangladesh',
  bio: [
    "I am a multidisciplinary practitioner working at the intersection of technology, research, and art. As a software engineer, aspiring AI safety researcher, and trained classical performer based in Dhaka, Bangladesh, my work focuses on bridging reliable engineering with scientific and creative exploration.",
    "With hands-on experience spanning front-end development, travel OTA platform engineering, UI/UX collaboration, digital platform coordination, and IT-driven business operations, I specialize in technical solution design, building functional web interfaces, supporting platform operations, and coordinating between clients and development teams to deliver reliable products.",
    "My long-term ambition is to contribute to the design of reliable and trustworthy artificial intelligence systems—particularly in reducing hallucinations and uncertainty in large language models, and bridging data-driven models with practical software architecture.",
    "Outside of work, I am a trained classical Bangla performer at Chhayanaut Shongshkriti-Bhobon, an amateur photographer, and a traveler whose practice draws as much from the South Asian classical tradition as from contemporary computer science."
  ],
  quote: "I work at the intersection of software engineering, AI safety research, and the classical arts.",
  photoUrl: '/uploads/profile.png',
  resumeUrl: '/uploads/Tabassum_Mustafa_Authoy_CV.pdf',
  githubUrl: 'https://github.com/TabassumAuthoy123',
  linkedinUrl: 'https://linkedin.com/in/tabassum-authoy',
  floatingTags: ['AI Safety', 'SaaS Sales', 'SaaS Dev', 'Classical Arts'],
  stats: [
    { icon: '💼', value: 'Manager', label: 'BD at SoftifyBD' },
    { icon: '🎓', value: 'MSc / EMBA', label: 'BRAC & DU' },
    { icon: '💻', value: 'BSc IT', label: 'First Class Hons' },
    { icon: '🩰', value: 'Artist', label: 'Classical Performer' }
  ]
};

async function seedProfile() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing profile(s) to avoid duplicates since it's a singleton conceptual document
    const deleted = await Profile.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing profile document(s)`);

    const inserted = await Profile.create(profileData);
    console.log(`✅ Seeded profile configuration:`);
    console.log(`   - Name: ${inserted.name}`);
    console.log(`   - About points: ${inserted.bio.length}`);
    console.log(`   - Stats: ${inserted.stats.length}`);

    console.log('\n🎉 Profile seed complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedProfile();
