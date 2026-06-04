/**
 * Seed script for Profile data.
 * Run with: node seed-profile.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Profile = require('./models/Profile');

const profileData = {
  name: 'Tabassum Authoy',
  title: 'Creative Developer & Designer',
  tagline: 'Building digital experiences that inspire.',
  email: 'authoy@email.com',
  phone: '+880 1XXX-XXXXXX',
  location: 'Dhaka, Bangladesh',
  bio: [
    "I'm a creative developer and designer based in Bangladesh, passionate about building beautiful and functional web experiences.",
    "I specialize in front-end development and UI/UX design, combining aesthetics with performance to deliver products that users love.",
    "I work with HTML5, CSS3, JavaScript, React, Next.js, and Node.js to craft elegant digital experiences that inspire."
  ],
  quote: "I craft elegant digital experiences with clean code and thoughtful design. Turning complex ideas into beautiful, intuitive interfaces.",
  photoUrl: '/placeholder-avatar.png',
  resumeUrl: '/Tabassum%20Authoy%20-CV.pdf',
  githubUrl: 'https://github.com/TabassumAuthoy123',
  linkedinUrl: 'https://linkedin.com/in/tabassum-authoy',
  floatingTags: ['UI/UX Magic', 'Clean Code', 'Innovation'],
  stats: [
    { icon: '💼', value: '3+ Years', label: 'Experience' },
    { icon: '💻', value: '25+', label: 'Projects' },
    { icon: '🏆', value: '15+', label: 'Happy Clients' },
    { icon: '🚀', value: 'Available', label: 'For Freelance' }
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
