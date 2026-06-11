const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables relative to current script directory and parent directory
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Achievement = require('./models/Achievement');
const Leadership = require('./models/Leadership');
const Profile = require('./models/Profile');
const Client = require('./models/Client');
const Article = require('./models/Article');
const GalleryItem = require('./models/GalleryItem');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in process.env');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB:', mongoUri);

    // Clear existing data in all collections
    await Admin.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Achievement.deleteMany({});
    await Leadership.deleteMany({});
    await Profile.deleteMany({});
    await Client.deleteMany({});
    await Article.deleteMany({});
    await GalleryItem.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Create admin
    await Admin.create({
      email: 'authoy@email.com',
      password: 'AuthoyAdmin@2026!',
    });
    console.log('Admin created (email: authoy@email.com, password: AuthoyAdmin@2026!)');

    // 2. Seed Profile
    await Profile.create({
      name: 'Tabassum Authoy',
      title: 'Project Coordinator Intern & Software Engineer',
      tagline: 'Building digital experiences that inspire and solve real-world problems.',
      email: 'authoy@email.com',
      phone: '+880 1XXX-XXXXXX',
      location: 'Dhaka, Bangladesh',
      bio: [
        "I'm a 3rd-year Computer Science student at Ahsanullah University of Science and Technology, currently working as an Intern Software Engineer at Softify BD Ltd. My journey in tech started with competitive programming — solving 400+ problems across Codeforces, AtCoder, CodeChef, and LeetCode.",
        "This sharpened my algorithmic thinking and problem-solving skills, which I now apply to building real-world applications. I work with React, Laravel, Express, Node.js, MongoDB, MySQL, Docker, and Redux to craft full-stack solutions that make a difference.",
        "Beyond coding, I lead as Head of Administration at AUST Programming and Informatics Club, coordinating large-scale events like AUST IUPC 2025 and Job Fair 2025. I believe in building not just software, but communities that inspire growth."
      ],
      quote: "I craft elegant digital experiences with clean code and thoughtful design. Turning complex ideas into beautiful, intuitive interfaces.",
      photoUrl: '/placeholder-avatar.png',
      resumeUrl: '/Tabassum%20Authoy%20-CV.pdf',
      githubUrl: 'https://github.com/TabassumAuthoy123',
      linkedinUrl: 'https://linkedin.com/in/tabassum-authoy',
      floatingTags: ['UI/UX Magic', 'Clean Code', 'Innovation'],
      stats: [
        { icon: '💼', value: '3rd Year', label: 'CSE at AUST' },
        { icon: '💻', value: '400+',     label: 'Problems Solved' },
        { icon: '🏆', value: 'Head',     label: 'APIC Admin' },
        { icon: '🚀', value: 'Intern',   label: 'Softify BD' }
      ]
    });
    console.log('Profile seeded');

    // 3. Seed Default B2B/B2C Client (Credentials)
    await Client.create({
      companyName: 'SoftifyBD Ltd.',
      contactName: 'Tabassum Authoy',
      contactEmail: 'authoy@email.com',
      plan: 'professional',
      status: 'active',
      apiKey: 'pk_authoyb2cclientkey2026',
      notes: 'Default B2B/B2C client seeded for portal testing.',
      projectsDelivered: 5,
      totalRevenue: 1500,
    });
    console.log('Default B2B/B2C Client seeded (API Key: pk_authoyb2cclientkey2026)');

    // 4. Seed Projects
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

    // 5. Seed Skills
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

    // 6. Seed Experience
    await Experience.insertMany([
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
    ]);
    console.log('Experience seeded');

    // 7. Seed Achievements
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
    ]);
    console.log('Achievements seeded');

    // 8. Seed Leadership
    await Leadership.insertMany([
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
    ]);
    console.log('Leadership seeded');

    // 9. Seed Mock Article
    await Article.create({
      title: 'Navigating Competitive Programming as a Full-Stack Developer',
      slug: 'navigating-competitive-programming',
      excerpt: 'How solving 400+ problems on Codeforces helped build faster, more efficient full-stack web applications.',
      content: 'Competitive programming is more than just passing test cases. It teaches you how to think about memory limits, edge cases, and runtime complexity. As a full-stack engineer, these principles translate directly into database index design, cache optimization, and efficient API responses. Combining algorithms with beautiful frontend interfaces creates high-fidelity production apps.',
      category: 'Competitive Programming',
      published: true,
    });
    console.log('Mock Article seeded');

    console.log('\n✅ All data seeded successfully!');
    console.log('Admin credentials: email=authoy@email.com, password=AuthoyAdmin@2026!');
    console.log('Client Portal credentials: API Key=pk_authoyb2cclientkey2026');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
};

if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seed success. Exiting process.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed. Exiting process.', err);
      process.exit(1);
    });
} else {
  module.exports = seedData;
}
