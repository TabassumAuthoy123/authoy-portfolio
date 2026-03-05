/**
 * Seed script for Work Experience & Education data.
 * Run with: node seed-experience.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Experience = require('./models/Experience');

const experienceData = [
  // ── Work ──
  {
    role: 'Project Coordinator Intern',
    company: 'Softify BD Ltd.',
    location: 'Dhaka, Bangladesh',
    duration: 'Dec 2025 – Present',
    type: 'work',
    icon: '💼',
    accent: '#F97316',
    summary: 'Coordinating project workflows, collaborating with cross-functional teams, and ensuring timely delivery of software milestones.',
    highlights: [
      'Coordinating development sprints and project deliverables',
      'Collaborating with senior engineers and stakeholders',
      'Following industry-standard agile workflows and version control',
    ],
    tags: ['Project Management', 'Agile', 'Git', 'Communication'],
    description: [],
    order: 1,
  },
  {
    role: 'Intern Software Developer',
    company: 'GetUp Limited',
    location: 'Dhaka, Bangladesh',
    duration: 'Sep 2025 – Nov 2025',
    type: 'work',
    icon: '💻',
    accent: '#3B82F6',
    summary: 'Contributed to software development tasks using modern web technologies in a fast-paced startup environment.',
    highlights: [
      'Developed features for web applications',
      'Collaborated with the dev team on debugging and code reviews',
      'Gained hands-on experience with production-level codebases',
    ],
    tags: ['JavaScript', 'React', 'Node.js', 'REST API'],
    description: [],
    order: 2,
  },
  // ── Education ──
  {
    role: 'B.Sc. in Computer Science and Engineering',
    company: 'Ahsanullah University of Science and Technology',
    duration: 'May 2023 – Present',
    type: 'education',
    icon: '📗',
    accent: '#3ECF8E',
    summary: 'Focused on comprehensive software development skills with emphasis on problem-solving, system design, and intelligent computing methodologies.',
    achievements: [
      { label: 'CGPA', value: '3.508' },
      { label: 'Department', value: 'CSE' },
    ],
    tags: ['Full-Stack Development', 'Data Structure', 'Algorithm', 'OOP'],
    description: ['3rd Year, 2nd Semester'],
    gpa: 'CGPA: 3.508 / 4.00',
    order: 3,
  },
  {
    role: 'Higher Secondary Certificate (HSC)',
    company: 'BAF Shaheen College, Dhaka',
    duration: 'Jan 2019 – Dec 2021',
    type: 'education',
    icon: '📘',
    accent: '#3B82F6',
    summary: 'Developed strong analytical and critical thinking skills through comprehensive study of Science.',
    achievements: [
      { label: 'GPA', value: '5.00' },
      { label: 'Group', value: 'Science' },
    ],
    tags: ['Mathematics', 'Physics', 'Chemistry', 'ICT'],
    description: [],
    gpa: 'GPA: 5.00 / 5.00',
    order: 4,
  },
];

async function seedExperience() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const deleted = await Experience.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing experience item(s)`);

    const inserted = await Experience.insertMany(experienceData);
    console.log(`✅ Seeded ${inserted.length} experience item(s):`);
    inserted.forEach(e => console.log(`   - ${e.icon || '•'} [${e.type}] ${e.role} @ ${e.company}`));

    console.log('\n🎉 Experience seed complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedExperience();
