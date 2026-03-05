import { useState, useEffect, useRef } from 'react';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { getProfile } from '../api';
import TagCloud from 'TagCloud';
import createGlobe from 'cobe';
import { TypeAnimation } from 'react-type-animation';

// Fallback data — shown while loading or if API is down
const FALLBACK = {
  name: 'Adnan Kader Mitul',
  title: 'Project Coordinator Intern | Problem Solver|Programmer',
  tagline: 'Connecting Business with Technology.',
  currentLearning: 'React Native',
  githubUrl: 'https://github.com/adnan-mitul',
  linkedinUrl: 'https://linkedin.com/in/adnan-kader-miul',
  floatingTags: ['UI Magic', 'Clean Code', 'Innovation'],
  yearsOfExperience: 2,
};

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  const handleTextMouseMove = (e) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    textRef.current.style.setProperty("--mouse-x", `${x}px`);
    textRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const cyclingWords = ['PLANNING','LOGIC','TECHNOLOGY','INNOVATION'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex(prev => (prev + 1) % cyclingWords.length);
    }, 2500);
    return () => clearInterval(wordTimer);
  }, []);

  useEffect(() => {
    getProfile()
      .then(res => setProfile(res.data))
      .catch(() => setProfile(FALLBACK));
  }, []);

  const p = profile || FALLBACK;
  const tags = p.floatingTags?.length ? p.floatingTags : FALLBACK.floatingTags;

  // Refs for Magnetic Buttons
  const magneticGitRef = useRef(null);
  const magneticLinRef = useRef(null);

  const handleMagneticMove = (e, ref) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMagneticLeave = (ref) => {
    if (!ref.current) return;
    ref.current.style.transform = `translate(0px, 0px)`;
  };

  // Globe Effect (cobe)
  useEffect(() => {
    let phi = 0;
    const isMobile = window.innerWidth <= 768;
    const size = isMobile ? 220 : 400;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2,
      dark: 1, // dark theme
      diffuse: 1.5, // slightly more diffuse
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15],
      markerColor: [0.176, 0.831, 0.749], // teal var(--accent)
      glowColor: [0.231, 0.513, 0.964], // blue var(--primary)
      markers: [
        { location: [23.8103, 90.4125], size: 0.1 } // highlight location
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => globe.destroy();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear container to prevent duplicate clouds on re-renders (like React StrictMode)
    containerRef.current.innerHTML = '';

    const texts = [
      '⚛️', '⚡', '🟢', '🚂',
      '🍃', '🌊', '🐙', '🔄',
      '▲', '🔌', '🐬', '💡',
      '⚙️', '🐳', '🔴', '☕',
      '🔥', '☁️'
    ];
    
    // Create the TagCloud
    TagCloud(containerRef.current, texts, {
      radius: window.innerWidth <= 768 ? 130 : 250,
      maxSpeed: 'normal',
      initSpeed: 'normal',
      keep: true,
      useContainerInlineStyles: true,
      useItemInlineStyles: true,
      containerClass: 'tagcloud',
      itemClass: 'tagcloud-item'
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero__layout">
        {/* Left — Text Content */}
        <div 
          className="hero__text" 
          ref={textRef} 
          onMouseMove={handleTextMouseMove}
        >
          {/* Grid and Glows specifically restricted to naming section */}
          <div className="hero__grid-bg"></div>
          <div className="hero__glow hero__glow--1"></div>
          <div className="hero__glow hero__glow--2"></div>
          <div className="hero__mouse-glow"></div>

          <div className="hero__welcome-badge" style={{ position: "relative", zIndex: 10 }}>
            <span className="hero__welcome-dot">●</span>
            Assalamualikum <span className="hero__sparkle" style={{ marginLeft: "6px" }}>✨</span>
          </div>

          <h1 className="hero__heading" style={{ position: "relative", zIndex: 10 }}>
            I'm <span className="hero__name-highlight">{p.name || FALLBACK.name}</span>
          </h1>

          <div className="hero__typing-container" style={{ marginBottom: "20px" }}>
            <span className="typing-prefix">{`> `}</span>
            <TypeAnimation
              sequence={[
                p.title || FALLBACK.title,
                2000,
                'Full Stack Developer',
                2000,
                'Competitive Programmer',
                2000,
                'Problem Solver',
                2000,
              ]}
              wrapper="span"
              speed={50}
              className="hero__typing-text"
              repeat={Infinity}
            />
          </div>

          <p className="hero__desc" style={{ fontFamily: "var(--font-serif)", fontWeight: "600", color: "#f8fafc", fontSize: "1.15rem", letterSpacing: "0.01em" }}>
            {p.tagline || FALLBACK.tagline}
          </p>

          <div className="hero__social-btns">
            <a
              ref={magneticGitRef}
              href={p.githubUrl || FALLBACK.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-btn hero__social-btn--magnetic hero__social-btn--github"
              onMouseMove={(e) => handleMagneticMove(e, magneticGitRef)}
              onMouseLeave={() => handleMagneticLeave(magneticGitRef)}
            >
              Github
            </a>
            <a
              ref={magneticLinRef}
              href={p.linkedinUrl || FALLBACK.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-btn hero__social-btn--magnetic hero__social-btn--linkedin"
              onMouseMove={(e) => handleMagneticMove(e, magneticLinRef)}
              onMouseLeave={() => handleMagneticLeave(magneticLinRef)}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right — 3D Tech Sphere */}
        <div className="hero__sphere-wrapper">
          <div className="cyberpunk-grid"></div>
          <div className="hologram-projector"></div>
          
          {/* COBE Globe inside the wrapper */}
          <canvas 
            ref={canvasRef} 
            className="hero__cobe-globe"
            style={{
              width: window.innerWidth <= 768 ? 220 : 400,
              height: window.innerWidth <= 768 ? 220 : 400,
            }}
          />
          <div className="globe-center-text">
            <span className="shine-text globe-word-fade" key={wordIndex}>
              {cyclingWords[wordIndex]}
            </span>
          </div>
          <div className="hero__sphere" ref={containerRef}></div>
        </div>
      </div>
    </section>
  );
}
