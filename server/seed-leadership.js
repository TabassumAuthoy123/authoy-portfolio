/**
 * Seed script for Leadership & Activities data.
 * Run with: node seed-leadership.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Leadership = require('./models/Leadership');

const leadershipData = [
  {
    title: 'Head of Administration',
    organization: 'AUST Programming & Informatics Club (APIC)',
    role: 'Head of Administration',
    description: 'Coordinating MTB presents AUST IUPC 2025 and Job Fair 2025.',
    date: 'Jan 2024 – Present',
    icon: '🏛️',
    accent: '#2dd4bf',
    isActive: true,
    order: 1,
  },
  {
    title: 'Founding Secretary — Brain Games',
    organization: 'BAFSD Mathematics Club',
    role: 'Founding Secretary',
    description: "Established the club's administrative framework and collaborated with the founding team.",
    date: 'Sep 2020 – Apr 2022',
    icon: '🧠',
    accent: '#3B82F6',
    isActive: false,
    order: 2,
  },
  {
    title: 'Officer of Olympiads',
    organization: 'BAFSD Science Club',
    role: 'Officer of Olympiads',
    description: 'Organized the 4th BAFSD Science Fest 2021.',
    date: 'Sep 2020 – Mar 2022',
    icon: '🔬',
    accent: '#3ECF8E',
    isActive: false,
    order: 3,
  },
  {
    title: 'Secretary of Marketing',
    organization: 'BAFSD Green Thumbs (Nature Club)',
    role: 'Secretary of Marketing',
    description: 'Organized Online Nature Summit 2.0.',
    date: 'Sep 2020 – Jan 2022',
    icon: '🌿',
    accent: '#22C55E',
    isActive: false,
    order: 4,
  },
  {
    title: 'Associate Member',
    organization: 'Bangladesh Science Congress Association',
    role: 'Associate Member',
    description: 'Participated in scientific discussions and congress activities.',
    date: 'May 2021 – Apr 2022',
    icon: '🔭',
    accent: '#EAB308',
    isActive: false,
    order: 5,
  },
];

async function seedLeadership() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const deleted = await Leadership.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing leadership item(s)`);

    const inserted = await Leadership.insertMany(leadershipData);
    console.log(`✅ Seeded ${inserted.length} leadership item(s):`);
    inserted.forEach(item => console.log(`   - ${item.icon} ${item.title} @ ${item.organization}`));

    console.log('\n🎉 Leadership seed complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedLeadership();
