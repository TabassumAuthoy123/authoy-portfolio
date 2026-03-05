import React, { useRef } from 'react';
import { 
  FiCode, FiLayers, FiDatabase, FiCpu, FiTool 
} from 'react-icons/fi';
import { 
  SiReact, SiJavascript, SiPhp, SiCplusplus, SiHtml5, SiCss3,
  SiTailwindcss, SiBootstrap, SiLaravel, SiNodedotjs, SiExpress,
  SiPostgresql, SiMysql, SiMongodb, SiFirebase, SiSupabase,
  SiGit, SiGithub, SiDocker, SiVercel, SiVscodium
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { getSkills } from '../api';

/* ── Brand colours for each tech ── */
const brandColors = {
  C: '#A8B9CC', 'C++': '#00599C', JavaScript: '#F7DF1E', PHP: '#777BB4',
  Java: '#ED8B00', HTML5: '#E34F26', CSS3: '#1572B6', React: '#61DAFB',
  Bootstrap: '#7952B3', 'Tailwind CSS': '#06B6D4', 'Blade Template': '#FF2D20',
  Laravel: '#FF2D20', 'Node.js': '#339933', 'Express.js': '#ffffff',
  PostgreSQL: '#4169E1', MySQL: '#4479A1', MongoDB: '#47A248',
  Firebase: '#FFCA28', Supabase: '#3ECF8E', Git: '#F05032',
  GitHub: '#ffffff', Docker: '#2496ED', Vercel: '#ffffff',
  Render: '#46E3B7', 'VS Code': '#007ACC',
};

/* ── All cloud icons (rotating sphere) ── */
const cloudIcons = [
  { Icon: SiReact, color: '#61DAFB' },
  { Icon: SiJavascript, color: '#F7DF1E' },
  { Icon: SiNodedotjs, color: '#339933' },
  { Icon: SiLaravel, color: '#FF2D20' },
  { Icon: SiDocker, color: '#2496ED' },
  { Icon: SiGithub, color: '#ffffff' },
  { Icon: SiMongodb, color: '#47A248' },
  { Icon: SiPostgresql, color: '#4169E1' },
  { Icon: SiCplusplus, color: '#00599C' },
  { Icon: SiHtml5, color: '#E34F26' },
  { Icon: SiCss3, color: '#1572B6' },
  { Icon: SiTailwindcss, color: '#06B6D4' },
  { Icon: SiFirebase, color: '#FFCA28' },
  { Icon: SiGit, color: '#F05032' },
  { Icon: SiPhp, color: '#777BB4' },
  { Icon: FaJava, color: '#ED8B00' },
  { Icon: SiBootstrap, color: '#7952B3' },
  { Icon: SiExpress, color: '#ffffff' },
  { Icon: SiMysql, color: '#4479A1' },
  { Icon: SiVercel, color: '#ffffff' },
  { Icon: SiVscodium, color: '#007ACC' },
  { Icon: SiSupabase, color: '#3ECF8E' },
];

/* ── Skill Categories Config ── */
const categoryConfig = [
  { id: 'language', icon: <FiCode size={22} />, title: 'Programming', titleBold: 'Languages' },
  { id: 'frontend', icon: <FiLayers size={22} />, title: 'Frontend', titleBold: 'Development' },
  { id: 'backend', icon: <FiCpu size={22} />, title: 'Backend', titleBold: 'Development' },
  { id: 'database', icon: <FiDatabase size={22} />, title: 'Databases', titleBold: '' },
  { id: 'tool', icon: <FiTool size={22} />, title: 'Tools', titleBold: '& DevOps' },
];

/* ─────────────────────────
   Infinite Marquee component
   ───────────────────────── */
function InfiniteMarquee() {
  return (
    <div className="hero__marquee-wrapper" style={{ marginBottom: "50px", marginTop: "30px" }}>
      <div className="hero__marquee-track">
        {/* Iterate over icons twice for a seamless loop effect */}
        {[...cloudIcons, ...cloudIcons].map((item, idx) => {
          const { Icon, color } = item;
          // Determine the name based on original mapping
          let iconName = Object.keys(brandColors).find(key => brandColors[key] === color) || "Tech";
          
          return (
            <div className="hero__tech-badge" key={idx}>
              <Icon size={20} color={color} />
              <span>{iconName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────
   Interactive Skill Card Component
   ───────────────────────── */
function SkillCard({ cat }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Tilt calculation (subtle 3D effect)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg tilt
    const rotateY = ((x - centerX) / centerX) * 4;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rotate-x', '0deg');
    cardRef.current.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <div 
      ref={cardRef}
      className="skills__card skills__card--interactive"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="skills__card-header">
        <div className="skills__card-icon-box">{cat.icon}</div>
        <h3 className="skills__card-title">
          {cat.title} {cat.titleBold && <strong>{cat.titleBold}</strong>}
        </h3>
      </div>
      <div className="skills__pills">
        {cat.skills.map((skill, index) => (
          <span
            className="skills__pill"
            key={skill.name}
            style={{ '--pill-color': skill.color, '--pill-index': index }}
          >
            <span className="skills__pill-icon" style={{ color: skill.color }}>
              {skill.icon}
            </span>
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────
   Main Skills Component
   ───────────────────────── */
export default function Skills() {
  const [skills, setSkills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    getSkills()
      .then(res => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching skills:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Group skills by category based on fetched data
  const groupedSkills = categoryConfig.map(cat => {
    return {
      ...cat,
      skills: skills
        .filter(s => s.category === cat.id)
        .map(s => {
          // Identify matching icon and color if available
          const foundMatch = cloudIcons.find(c => c.color === brandColors[s.name] || Object.keys(brandColors).find(k => k.toLowerCase() === s.name.toLowerCase() && brandColors[k] === c.color));
          const icon = foundMatch ? <foundMatch.Icon /> : <FiCode />;
          const color = brandColors[s.name] 
                        || Object.keys(brandColors).find(k => k.toLowerCase() === s.name.toLowerCase()) 
                        ? brandColors[Object.keys(brandColors).find(k => k.toLowerCase() === s.name.toLowerCase())] 
                        : '#ffffff';
          return { name: s.name, order: s.order, icon, color };
        })
    };
  }).filter(cat => cat.skills.length > 0);

  return (
    <section className="section" id="strengths">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 20px' }}>
          <div className="section__badge">Skills</div>
          <h2 className="section__title">
            Technologies I <span className="text-gradient">work with</span>
          </h2>
          <p className="section__subtitle" style={{ margin: '0 auto' }}>
            A growing stack of tools and technologies I use to build software.
          </p>
        </div>

        {/* Infinite Tech Marquee */}
        <InfiniteMarquee />

        {/* Loading / Error States */}
        {loading && <div style={{ textAlign: 'center', margin: '40px 0', color: 'var(--text-secondary)' }}>Loading skills...</div>}
        {error && <div style={{ textAlign: 'center', margin: '40px 0', color: 'var(--accent)' }}>Failed to load skills.</div>}

        {/* Skills Cards Grid */}
        {!loading && !error && (
          <div className="skills__grid">
            {groupedSkills.map((cat) => (
              <SkillCard key={cat.title} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
