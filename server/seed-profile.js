/**
 * Seed script for Profile data.
 * Run with: node seed-profile.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Profile = require('./models/Profile');

const profileData = {
  name: 'Adnan Kader Mitul',
  title: 'Project Coordinator Intern',
  tagline: 'Delivering scalable technology solutions with problem-solving at the core.',
  email: 'adnankmitul@gmail.com',
  phone: '+880 1305 900658',
  location: 'Dhaka, Bangladesh',
  bio: [
    "I'm a 3rd-year Computer Science student at Ahsanullah University of Science and Technology, currently working as an Intern Software Engineer at Softify BD Ltd. My journey in tech started with competitive programming — solving 400+ problems across Codeforces, AtCoder, CodeChef, and LeetCode.",
    "This sharpened my algorithmic thinking and problem-solving skills, which I now apply to building real-world applications. I work with React, Laravel, Express, Node.js, MongoDB, MySQL, Docker, and Redux to craft full-stack solutions that make a difference.",
    "Beyond coding, I lead as Head of Administration at AUST Programming and Informatics Club, coordinating large-scale events like AUST IUPC 2025 and Job Fair 2025. I believe in building not just software, but communities that inspire growth."
  ],
  quote: "The best code I've ever written wasn't about choosing the right framework — it was about truly understanding the problem first.",
  photoUrl: '/WhatsApp Image 2026-02-24 at 9.28.02 PM.jpeg',
  resumeUrl: '/Adnan%20Kader%20Mitul%20-CV.pdf',
  githubUrl: 'https://github.com/adnan-mitul',
  linkedinUrl: 'https://linkedin.com/in/adnan-kader-mitul',
  floatingTags: ['UI Magic', 'Clean Code', 'Innovation'],
  stats: [
    { icon: '💼', value: '3rd Year', label: 'CSE at AUST' },
    { icon: '💻', value: '400+', label: 'Problems Solved' },
    { icon: '🏆', value: 'Head', label: 'APIC Admin' },
    { icon: '🚀', value: 'Intern', label: 'Softify BD' }
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
