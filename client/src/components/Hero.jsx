import { useState, useEffect, useRef } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowRight } from 'react-icons/fi';
import { getProfile, getImageUrl } from '../api';
import TagCloud from 'TagCloud';
import createGlobe from 'cobe';
import { TypeAnimation } from 'react-type-animation';

const FALLBACK = {
  name: 'Tabassum Mustafa Authoy',
  title: 'Software Engineer & Business Development Manager',
  tagline: 'Working at the intersection of software engineering, AI safety research, and the classical arts.',
  currentLearning: 'AI Safety & Deep Learning',
  githubUrl: 'https://github.com/TabassumAuthoy123',
  linkedinUrl: 'https://linkedin.com/in/tabassum-authoy',
  floatingTags: ['AI Safety', 'SaaS Sales', 'SaaS Dev', 'Classical Arts'],
  yearsOfExperience: 3,
};

const cyclingWords = ['PLANNING','LOGIC','TECHNOLOGY','INNOVATION'];

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);

  const handleTextMouseMove = (e) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    textRef.current.style.setProperty("--mouse-x", `${x}px`);
    textRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

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
  const finalPhotoUrl = p.photoUrl ? getImageUrl(p.photoUrl) : '/profile.png';
  const resumeLink = p.resumeUrl ? getImageUrl(p.resumeUrl) : '/Tabassum_Mustafa_Authoy_CV.pdf';

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
    const size = isMobile ? 220 : 360;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.2,
      dark: 1, // dark theme
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.15],
      markerColor: [0.176, 0.831, 0.749], // teal var(--primary)
      glowColor: [0.05, 0.58, 0.53], // teal/cyan glow
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
    const container = containerRef.current;
    container.innerHTML = '';

    const texts = [
      '⚛️', '⚡', '🟢', '🚂',
      '🍃', '🌊', '🐙', '🔄',
      '▲', '🔌', '🐬', '💡',
      '⚙️', '🐳', '🔴', '☕',
      '🔥', '☁️'
    ];
    
    TagCloud(container, texts, {
      radius: window.innerWidth <= 768 ? 120 : 220,
      maxSpeed: 'normal',
      initSpeed: 'normal',
      keep: true,
      useContainerInlineStyles: true,
      useItemInlineStyles: true,
      containerClass: 'tagcloud',
      itemClass: 'tagcloud-item'
    });

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Glow Backdrops */}
      <div className="hero__grid-bg"></div>
      <div className="hero__glow hero__glow--1"></div>
      <div className="hero__glow hero__glow--2"></div>

      {/* Main Row — Mostaim-inspired Design */}
      <div className="hero__layout">
        {/* Left Column — Bio & Intro */}
        <div 
          className="hero__text" 
          ref={textRef} 
          onMouseMove={handleTextMouseMove}
        >
          <div className="hero__mouse-glow"></div>

          <div className="hero__welcome-badge">
            <span className="hero__welcome-dot">●</span>
            Assalamualikum <span className="hero__sparkle" style={{ marginLeft: "6px" }}>✨</span>
          </div>

          <h1 className="hero__heading">
            I'm <span className="hero__name-highlight">{p.name}</span>
          </h1>

          <div className="hero__typing-container">
            <span className="typing-prefix">{`> `}</span>
            <TypeAnimation
              sequence={[
                p.title,
                2000,
                'Software Engineer',
                2000,
                'AI Safety Researcher',
                2000,
                'Business Development Manager',
                2000,
              ]}
              wrapper="span"
              speed={50}
              className="hero__typing-text"
              repeat={Infinity}
            />
          </div>

          <p className="hero__desc" style={{ fontFamily: "var(--font-serif)", fontWeight: "600", color: "#f8fafc", fontSize: "1.15rem", letterSpacing: "0.01em" }}>
            {p.tagline}
          </p>

          <div className="hero__action-btns">
            <a href="#contact" className="hero__cta-btn">
              Let's Talk <FiArrowRight style={{ marginLeft: '8px' }} />
            </a>
            <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="hero__secondary-btn">
              <FiDownload style={{ marginRight: '8px' }} /> Download CV
            </a>
          </div>

          <div className="hero__social-btns">
            <a
              ref={magneticGitRef}
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-btn hero__social-btn--magnetic hero__social-btn--github"
              onMouseMove={(e) => handleMagneticMove(e, magneticGitRef)}
              onMouseLeave={() => handleMagneticLeave(magneticGitRef)}
            >
              <FiGithub style={{ marginRight: '6px' }} /> Github
            </a>
            <a
              ref={magneticLinRef}
              href={p.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__social-btn hero__social-btn--magnetic hero__social-btn--linkedin"
              onMouseMove={(e) => handleMagneticMove(e, magneticLinRef)}
              onMouseLeave={() => handleMagneticLeave(magneticLinRef)}
            >
              <FiLinkedin style={{ marginRight: '6px' }} /> LinkedIn
            </a>
          </div>
        </div>

        {/* Right Column — Large Premium Portrait Image (Exactly like Mostaim) */}
        <div className="hero__portrait-wrapper">
          <div className="hero__portrait-backdrop"></div>
          <div className="hero__portrait-frame">
            <img 
              src={finalPhotoUrl} 
              alt={p.name} 
              className="hero__portrait-img" 
            />
          </div>
        </div>
      </div>

      {/* Bottom Row — Interactive Tech Deck & 3D Globe (Moved Down) */}
      <div className="hero__bottom-deck">
        <div className="hero__deck-info">
          <div className="section__badge">Interactive Deck</div>
          <h2 className="hero__deck-title">Global <span className="text-gradient">Tech Sphere</span></h2>
          <p className="hero__deck-desc">
            Visualizing the intersection of neural networks, software engineering dependencies, and active AI safety parameters in real time. Hover to interact with the tag sphere or spin the geolocated globe.
          </p>
        </div>

        <div className="hero__sphere-wrapper">
          <div className="cyberpunk-grid"></div>
          <div className="hologram-projector"></div>
          
          <canvas 
            ref={canvasRef} 
            className="hero__cobe-globe"
            style={{
              width: window.innerWidth <= 768 ? 220 : 360,
              height: window.innerWidth <= 768 ? 220 : 360,
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
