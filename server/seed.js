const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Achievement = require('./models/Achievement');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Achievement.deleteMany({});

    // Create admin
    await Admin.create({
      email: 'authoy@email.com',
      password: 'AuthoyAdmin@2026!',
    });
    console.log('Admin created (email: authoy@email.com, password: admin)');

    // Seed Projects
    await Project.insertMany([
      {
        title: 'Bizz-Insight',
        description: 'An AI-powered business management platform with role-based operations. Integrated Google Gemini API for natural language data retrieval and automated actions.',
        techStack: ['Laravel', 'MySQL', 'Tailwind CSS', 'Google Gemini API'],
        sourceUrl: 'https://github.com/TabassumAuthoy123',
        order: 1,
      },
      {
        title: 'FindHome',
        description: 'A full-stack rental housing platform connecting property owners and renters. Built with the MERN stack for seamless user experience.',
        techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
        sourceUrl: 'https://github.com/TabassumAuthoy123',
        order: 2,
      },
      {
        title: 'Combat Chronicles — The Ninja Odyssey',
        description: 'A 2D story-driven fighting game with multi-level gameplay, enemy AI, collision detection, scoring, life systems, and interactive menus.',
        techStack: ['C', 'C++', 'iGraphics'],
        sourceUrl: 'https://github.com/TabassumAuthoy123',
        order: 3,
      },
    ]);
    console.log('Projects seeded');

    // Seed Skills
    const skills = [
      // Languages
      { name: 'C', category: 'language', order: 1 },
      { name: 'C++', category: 'language', order: 2 },
      { name: 'JavaScript', category: 'language', order: 3 },
      { name: 'SQL', category: 'language', order: 4 },
      { name: 'PHP', category: 'language', order: 5 },
      { name: 'Java', category: 'language', order: 6 },
      { name: 'HTML', category: 'language', order: 7 },
      { name: 'CSS', category: 'language', order: 8 },
      // Frontend
      { name: 'React.js', category: 'frontend', order: 1 },
      { name: 'Blade Template', category: 'frontend', order: 2 },
      { name: 'Bootstrap', category: 'frontend', order: 3 },
      { name: 'Tailwind CSS', category: 'frontend', order: 4 },
      // Backend
      { name: 'Laravel', category: 'backend', order: 1 },
      { name: 'Node.js', category: 'backend', order: 2 },
      { name: 'Express.js', category: 'backend', order: 3 },
      // Databases
      { name: 'PostgreSQL', category: 'database', order: 1 },
      { name: 'MySQL', category: 'database', order: 2 },
      { name: 'MongoDB', category: 'database', order: 3 },
      { name: 'Firebase', category: 'database', order: 4 },
      { name: 'Supabase', category: 'database', order: 5 },
      // Tools
      { name: 'Git', category: 'tool', order: 1 },
      { name: 'GitHub', category: 'tool', order: 2 },
      { name: 'Docker', category: 'tool', order: 3 },
      { name: 'Vercel', category: 'tool', order: 4 },
      { name: 'Render', category: 'tool', order: 5 },
      { name: 'VS Code', category: 'tool', order: 6 },
    ];
    await Skill.insertMany(skills);
    console.log('Skills seeded');

    // Seed Experience
    await Experience.insertMany([
      {
        role: 'Intern Software Engineer',
        company: 'Softify BD Ltd.',
        duration: 'Dec 2025 – Present',
        description: [
          'Working on production-level software development tasks in a professional environment',
          'Collaborating with senior engineers on feature development, debugging, and code optimization',
          'Following industry-standard workflows, version control practices, and agile methodologies',
        ],
        type: 'work',
        order: 1,
      },
      {
        role: 'B.Sc. in Computer Science and Engineering',
        company: 'Ahsanullah University of Science and Technology',
        duration: 'May 2023 – Present',
        description: ['3rd Year, 2nd Semester'],
        type: 'education',
        gpa: 'CGPA: 3.508 / 4.00',
        order: 2,
      },
      {
        role: 'Higher Secondary Certificate (HSC)',
        company: 'BAF Shaheen College, Dhaka',
        duration: 'Jan 2019 – Dec 2021',
        description: [],
        type: 'education',
        gpa: 'GPA: 5.00 / 5.00',
        order: 3,
      },
    ]);
    console.log('Experience seeded');

    // Seed Achievements
    await Achievement.insertMany([
      {
        title: 'Champion — SPOT N\'GO Robotics Contest',
        description: 'Line-Following Robotics Contest organized by Notre Dame Informatics & Technology Club',
        date: 'May 2024',
        category: 'competition',
        order: 1,
      },
      {
        title: 'Champion — Intra-AUST Quiz Competition',
        description: 'Organized by AUST CSE Society',
        date: 'Fall 2023',
        category: 'competition',
        order: 2,
      },
      {
        title: 'ICPC Preliminary Contest 2025',
        description: 'Participant in the International Collegiate Programming Contest',
        date: '2025',
        category: 'cp',
        order: 3,
      },
      {
        title: 'Intra-AUST Hackathon 2025',
        description: 'Participant in university hackathon',
        date: '2025',
        category: 'competition',
        order: 4,
      },
      {
        title: '400+ Problems Solved',
        description: 'Solved across Codeforces, AtCoder, CodeChef, and LeetCode. Codeforces handle: me_none',
        date: '',
        category: 'cp',
        order: 5,
      },
      {
        title: 'Head of Administration — AUST Programming and Informatics Club',
        description: 'Coordinating MTB presents AUST IUPC 2025 and Job Fair 2025',
        date: 'Jan 2024 – Present',
        category: 'leadership',
        order: 6,
      },
      {
        title: 'Founding Secretary — BAFSD Mathematics Club',
        description: 'Established the club\'s administrative framework and collaborated with the founding team',
        date: 'Sep 2020 – Apr 2022',
        category: 'leadership',
        order: 7,
      },
    ]);
    console.log('Achievements seeded');

    console.log('\n✅ All data seeded successfully!');
    console.log('Admin credentials: email=authoy@email.com, password=AuthoyAdmin@2026!');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0)).catch(() => process.exit(1));
} else {
  module.exports = seedData;
}
