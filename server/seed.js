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
      photoUrl: '/placeholder-avatar.png',
      resumeUrl: '/Tabassum%20Mustafa%20Authoy%20-CV.pdf',
      githubUrl: 'https://github.com/TabassumAuthoy123',
      linkedinUrl: 'https://linkedin.com/in/tabassum-authoy',
      floatingTags: ['AI Safety', 'SaaS Sales', 'SaaS Dev', 'Classical Arts'],
      stats: [
        { icon: '💼', value: 'Manager', label: 'BD at SoftifyBD' },
        { icon: '🎓', value: 'MSc / EMBA', label: 'BRAC & DU' },
        { icon: '💻', value: 'BSc IT', label: 'First Class Hons' },
        { icon: '🩰', value: 'Artist', label: 'Classical Performer' }
      ]
    });
    console.log('Profile seeded');

    // 3. Seed Default B2B/B2C Client (Credentials)
    await Client.create({
      companyName: 'SoftifyBD Ltd.',
      contactName: 'Tabassum Mustafa Authoy',
      contactEmail: 'tabassumauthoy123@gmail.com',
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
        title: 'Synaptic Replay Networks (SRNs)',
        description: 'Proposed a neuro-inspired architecture that integrates an offline "dream-phase" replay buffer with a metacognitive risk head to reduce overconfident hallucinations in LLMs.',
        techStack: ['Python', 'PyTorch', 'Transformers', 'Jupyter'],
        sourceUrl: 'https://github.com/TabassumAuthoy123',
        order: 1,
      },
      {
        title: 'Heal Here',
        description: 'Designed and implemented an end-to-end intelligent mobile system addressing post-pandemic mental health trauma, with structured assessment modules and user-centered interface.',
        techStack: ['Kotlin', 'Android SDK', 'SQLite', 'Figma'],
        sourceUrl: 'https://github.com/TabassumAuthoy123',
        order: 2,
      },
      {
        title: 'Gender & Course-Type Academic Performance Analysis',
        description: 'Empirical research examines gender and course-type effects on undergraduate performance at University of Dhaka Faculty of Business Studies using LMMs and tree-based models (XGBoost, CatBoost).',
        techStack: ['Python', 'Google Colab', 'Scikit-Learn', 'SHAP', 'Statsmodels'],
        sourceUrl: 'https://github.com/TabassumAuthoy123',
        order: 3,
      },
    ]);
    console.log('Projects seeded');

    // 5. Seed Skills
    const skills = [
      // Web & Front-End
      { name: 'HTML5', category: 'frontend', order: 1 },
      { name: 'CSS3', category: 'frontend', order: 2 },
      { name: 'Responsive Design', category: 'frontend', order: 3 },
      { name: 'Figma-to-UI', category: 'frontend', order: 4 },
      { name: 'JavaScript', category: 'language', order: 1 },
      { name: 'Cross-Browser Testing', category: 'tool', order: 1 },
      // Programming & Data
      { name: 'C++', category: 'language', order: 2 },
      { name: 'Java', category: 'language', order: 3 },
      { name: 'Python', category: 'language', order: 4 },
      { name: 'Jupyter', category: 'tool', order: 2 },
      { name: 'Kaggle', category: 'tool', order: 3 },
      { name: 'Machine Learning', category: 'backend', order: 1 },
      { name: 'Data Visualization', category: 'frontend', order: 5 },
      // Digital Platforms
      { name: 'Travel OTA', category: 'backend', order: 2 },
      { name: 'SRS Documentation', category: 'tool', order: 4 },
      { name: 'Inventory Integration', category: 'backend', order: 3 },
      { name: 'API Coordination', category: 'backend', order: 4 },
      // UI/UX
      { name: 'Figma', category: 'tool', order: 5 },
      { name: 'Canva', category: 'tool', order: 6 },
      { name: 'Usability Testing', category: 'tool', order: 7 },
      { name: 'Interface Consistency', category: 'tool', order: 8 },
      // Productivity
      { name: 'MS Excel/Access', category: 'tool', order: 9 },
      { name: 'GitHub', category: 'tool', order: 10 },
      { name: 'Technical Reporting', category: 'tool', order: 11 },
    ];
    await Skill.insertMany(skills);
    console.log('Skills seeded');

    // 6. Seed Experience
    await Experience.insertMany([
      {
        role: 'Business Development Manager',
        company: 'SoftifyBD Limited',
        location: 'Gulshan-1, Dhaka',
        duration: 'Mar 2026 – Present',
        type: 'work',
        icon: '💼',
        accent: '#F97316',
        summary: 'Leads B2B SaaS sales, full-cycle project management, client consultancy (Faith Trip, Ghorer Bazar Bangladesh, ISP Digital platform, TrackMe, RoadGuard). Requirements gathering, solution design, enterprise client engagement. Building in-house B2B SaaS product as full-stack developer.',
        highlights: [
          'Promoted from Senior BD & IT Executive within 2 months. Confirmed Permanent Employee.',
          'Owns requirement gathering, solution design, and enterprise client engagement.',
          'Building in-house B2B SaaS product end-to-end as full-stack developer (frontend, backend, project management).',
          'Drive AI-augmented workflows and the integration of emerging technologies into product delivery.'
        ],
        tags: ['B2B SaaS', 'Project Management', 'Client Consultancy', 'SaaS Sales', 'Full-Stack Development'],
        description: [],
        order: 1,
      },
      {
        role: 'Senior Executive — Business Development & IT',
        company: 'TechSolutions Plex Limited',
        location: 'Mohakhali, Dhaka',
        duration: 'Aug 2025 – Jan 2026',
        type: 'work',
        icon: '💻',
        accent: '#3B82F6',
        summary: 'Supported IT operations across the company\'s OTA platform Fanam Trip, e-commerce platforms (Discount Bazar UK/UAE, Banglar Bike, YEDI), and core digital business systems.',
        highlights: [
          'Coordinated between technical teams and management to gather system requirements and implement improvements.',
          'Monitored usability issues and prepared technical reports, presentations, and system documentation.',
          'Mentored junior staff on system usage, tooling, and workflow automation.'
        ],
        tags: ['IT Operations', 'Requirement Gathering', 'E-commerce', 'System Documentation'],
        description: [],
        order: 2,
      },
      {
        role: 'Front-End Developer & Senior Agent Support Executive',
        company: 'NZ World Travels',
        location: 'Hybrid (Kuala Lumpur & Dhaka)',
        duration: 'Nov 2022 – May 2025',
        type: 'work',
        icon: '✈️',
        accent: '#A855F7',
        summary: 'Developed and maintained responsive web pages. Supported OTA platform mynztrip.com and managed GSA partners, inventory system, and accounting integration specifications.',
        highlights: [
          'Developed web pages using HTML, CSS, and Figma-based UI implementation under senior supervision.',
          'Assisted with third-party system integrations, data workflow checks, UI improvements, and bug testing.',
          'Collaborated with designers and operations teams to improve usability and cross-device/browser compatibility.'
        ],
        tags: ['HTML5', 'CSS3', 'Figma', 'OTA Platform', 'API Coordination'],
        description: [],
        order: 3,
      },
      {
        role: 'IT Industrial Internship',
        company: 'QRAC Homes',
        location: 'Titiwangsa, Malaysia',
        duration: 'Jul 2022 – Oct 2022',
        type: 'work',
        icon: '🏢',
        accent: '#EC4899',
        summary: 'Supported IT system rollout, maintenance, first-level troubleshooting, and system testing.',
        highlights: [
          'Assisted senior developers in testing and refining existing systems.',
          'Documented technical procedures and completed tasks ahead of schedule.'
        ],
        tags: ['System Rollout', 'Troubleshooting', 'System Testing', 'Documentation'],
        description: [],
        order: 4,
      },
      {
        role: 'Assistant Project Manager — Tech Programs',
        company: 'BeyondGrades & Pathfinder',
        location: 'Grameen Telecom Bhabon, Dhaka',
        duration: 'Dec 2021 – May 2022',
        type: 'work',
        icon: '📊',
        accent: '#EAB308',
        summary: 'Coordinated technical and program tasks for entrepreneurship-mindset and digital-literacy initiatives targeting high-school students.',
        highlights: [
          'Maintained project documentation, schedules, and progress tracking using digital tools.',
          'Supported data collection and reporting.'
        ],
        tags: ['Project Coordination', 'Digital Literacy', 'Progress Tracking', 'Data Collection'],
        description: [],
        order: 5,
      },
      {
        role: 'IT & Operations Intern',
        company: 'Trivooz',
        location: 'Mohammadpur, Dhaka',
        duration: 'Jun 2021 – Nov 2021',
        type: 'work',
        icon: '⚙️',
        accent: '#64748B',
        summary: 'Assisted with website content updates, system operations, and internal IT tasks in a consulting environment.',
        highlights: [
          'Supported website content updates and digital branding initiatives.',
          'Assisted in internal IT troubleshooting and operations.'
        ],
        tags: ['Content Updates', 'Operations', 'IT Support'],
        description: [],
        order: 6,
      },
      {
        role: 'Executive MBA — Management Information Systems',
        company: 'University of Dhaka, Faculty of Business Studies',
        duration: '2026 – 2028',
        type: 'education',
        icon: '🎓',
        accent: '#3ECF8E',
        summary: 'Specializing in Management Information Systems (MIS) within the Faculty of Business Studies.',
        achievements: [
          { label: 'Cohort', value: 'Friday-Saturday' },
          { label: 'Faculty', value: 'Business Studies' }
        ],
        tags: ['MIS', 'Business Analytics', 'Information Systems'],
        description: ['Friday-Saturday cohort'],
        gpa: 'Friday-Saturday Cohort',
        order: 7,
      },
      {
        role: 'M.Sc. in Computer Science & Engineering',
        company: 'BRAC University, Bangladesh',
        duration: '2025 – 2027',
        type: 'education',
        icon: '🔬',
        accent: '#10B981',
        summary: 'Pursuing research-focused graduate studies in Computer Science, concentrating on AI safety and reliable language models.',
        achievements: [
          { label: 'Research', value: 'AI Safety' },
          { label: 'Concentration', value: 'LLM Reliability' }
        ],
        tags: ['AI Safety', 'Language Models', 'Graduate Research'],
        description: ['Research direction: AI safety & reliable language models.'],
        gpa: 'Research Focus: LLM Reliability',
        order: 8,
      },
      {
        role: 'B.Sc. in Information Technology (Honours) — Software Engineering',
        company: 'SEGi University, Malaysia',
        location: 'Kota Damansara, Malaysia',
        duration: '2020 – 2023',
        type: 'education',
        icon: '🎓',
        accent: '#3B82F6',
        summary: 'Graduated with First Class Honours, specializing in Software Engineering.',
        achievements: [
          { label: 'CGPA', value: '3.70 / 4.00' },
          { label: 'Rank', value: 'Top 20% of Cohort' },
          { label: 'Honors', value: 'Dean\'s List' }
        ],
        tags: ['Software Engineering', 'OOP', 'Database Design', 'Web Development'],
        description: ['First Class Honours'],
        gpa: 'CGPA: 3.70 / 4.00',
        order: 9,
      },
      {
        role: 'Bachelor in Economics (One Year Completed)',
        company: 'Bangladesh University of Professionals (BUP)',
        duration: '2019 – 2020',
        type: 'education',
        icon: '📈',
        accent: '#F43F5E',
        summary: 'Completed first year of Economics before receiving a transfer scholarship for IT studies in Malaysia.',
        achievements: [
          { label: 'CGPA', value: '3.33 / 4.00' },
          { label: 'Scholarship', value: 'Transfer Award' }
        ],
        tags: ['Microeconomics', 'Macroeconomics', 'Statistics'],
        description: ['Completed 1 Year'],
        gpa: 'CGPA: 3.33 / 4.00',
        order: 10,
      },
    ]);
    console.log('Experience seeded');

    // 7. Seed Achievements
    await Achievement.insertMany([
      {
        title: 'Business Development Manager Promotion',
        description: 'Promoted from Senior BD Executive to Business Development Manager at SoftifyBD Limited within two months.',
        date: 'May 2026',
        category: 'career',
        order: 1,
      },
      {
        title: 'First Class Honours & Dean\'s List',
        description: 'Graduated with a CGPA of 3.70/4.00 in B.Sc. IT (Software Engineering) from SEGi University, Malaysia.',
        date: '2023',
        category: 'academic',
        order: 2,
      },
      {
        title: 'BUP Transfer Scholarship',
        description: 'Awarded merit-based scholarship to transfer from BUP Economics to SEGi University Malaysia for IT studies.',
        date: '2020',
        category: 'academic',
        order: 3,
      },
      {
        title: 'Student & Cultural Ambassador',
        description: 'Represented Bangladeshi culture at SEGi International Cultural Night (ICN 2022) with solo choreography, costume design, and coordination.',
        date: '2022',
        category: 'leadership',
        order: 4,
      },
      {
        title: 'Active AI Research Co-Authorship',
        description: 'Research paper on gender and course-type effects on academic performance using ANOVA, LMMs, and XGBoost/SHAP.',
        date: 'May 2026',
        category: 'research',
        order: 5,
      },
    ]);
    console.log('Achievements seeded');

    // 8. Seed Leadership
    await Leadership.insertMany([
      {
        title: 'Student & Cultural Ambassador',
        organization: 'SEGi University Cultural Club',
        role: 'Student & Cultural Ambassador',
        description: 'Coordinated performance logistics, costume design, and solo choreography representing Bangladeshi culture for SEGi International Cultural Night (ICN 2022).',
        date: '2022',
        icon: '🩰',
        accent: '#EC4899',
        isActive: false,
        order: 1,
      },
      {
        title: 'Volunteer Book Program',
        organization: 'Bishwa Sahitto Kendro (World Literature Centre)',
        role: 'Volunteer',
        description: 'Supported the Boi Pora Kormoshuchi (Book Reading Programme) across schools to promote reading and literacy.',
        date: 'Ongoing',
        icon: '📚',
        accent: '#10B981',
        isActive: true,
        order: 2,
      },
      {
        title: 'Project & Team Coordinator',
        organization: 'SoftifyBD / TechSolutions Plex',
        role: 'Coordinator',
        description: 'Coordinating cross-functional engineering teams, managing sprints, requirement gathering, and client onboarding workflows.',
        date: '2025 – Present',
        icon: '👥',
        accent: '#3B82F6',
        isActive: true,
        order: 3,
      },
    ]);
    console.log('Leadership seeded');

    // 9. Seed Mock Article
    await Article.create({
      title: 'Synaptic Replay Networks: A Cognitive Approach to LLM Reliability',
      slug: 'synaptic-replay-networks-llm-reliability',
      excerpt: 'Exploring neuro-inspired dream-phase self-rehearsal mechanisms to reduce hallucinations and calibrate memory in large language models.',
      content: 'Large language models often suffer from miscalibrated confidence and factual hallucinations. Drawing inspiration from biological memory consolidation, the proposed Synaptic Replay Networks (SRN) architecture integrates an offline replay buffer (mimicking mammalian sleep-phase replay) with a metacognitive risk detection head. By replaying synthetic and historical data distributions, the model stabilizes its knowledge base against distribution shift and temporal drift without catastrophic forgetting, paving the way for more robust, uncertainty-aware AI applications.',
      category: 'AI Safety & Reliability',
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
