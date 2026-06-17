import { useState, useEffect, useRef } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowRight, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
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
  facebookUrl: 'https://facebook.com/tabassum.authoy', // Added fallbacks
  twitterUrl: 'https://twitter.com/tabassum_authoy',
  instagramUrl: 'https://instagram.com/tabassum_authoy',
  floatingTags: ['AI Safety', 'SaaS Sales', 'SaaS Dev', 'Classical Arts'],
  yearsOfExperience: 3,
};

const cyclingWords = ['PLANNING', 'LOGIC', 'TECHNOLOGY', 'INNOVATION'];

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
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
  const finalPhotoUrl = p.photoUrl ? getImageUrl(p.photoUrl) : '/profile.png';
  const resumeLink = p.resumeUrl ? getImageUrl(p.resumeUrl) : '/Tabassum_Mustafa_Authoy_CV.pdf';

  // Globe Effect (cobe)
  useEffect(() => {
    let phi = 0;
    const isMobile = window.innerWidth <= 768;
    const size = isMobile ? 220 : 360;

    if (!canvasRef.current) return;

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
        { location: [23.8103, 90.4125], size: 0.1 } // Dhaka highlight location
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      }
    });

    return () => globe.destroy();
  }, []);

  // TagCloud effect
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
    <section className="hero-section" id="hero">
      {/* Background gradients */}
      <div className="hero-bg-gradient"></div>
      <div className="hero-ambient-glow hero-ambient-glow--1"></div>
      <div className="hero-ambient-glow hero-ambient-glow--2"></div>
      <div className="hero-grid-lines"></div>

      <div className="hero-container">
        <div className="hero-row">
          {/* Left Column: Text & Intro */}
          <div className="hero-text-col animate-slide-up">
            {/* Greeting badge */}
            <div className="hero-badge">
              <span className="hero-badge-emoji">👋</span>
              <span className="hero-badge-text">Hello,</span>
            </div>

            {/* Name H2 */}
            <h2 className="hero-name-title">{p.name}</h2>

            {/* Main H1 heading */}
            <h1 className="hero-main-title">
              Technology. <span className="text-gradient">Strategy.</span> Results.
            </h1>

            {/* Typing subtitle / role */}
            <div className="hero-typing-box">
              <span className="hero-typing-prefix">{`> `}</span>
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
                className="hero-typing-text"
                repeat={Infinity}
              />
            </div>

            {/* Tagline / Subtitle */}
            <p className="hero-description">
              {p.tagline}
            </p>

            {/* Action Buttons */}
            <div className="hero-cta-row">
              <a href="#contact" className="hero-primary-btn group">
                <span>Let's Talk</span>
                <FiArrowRight className="hero-primary-btn-icon group-hover:translate-x-1" />
              </a>
              <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="hero-secondary-btn">
                <FiDownload style={{ marginRight: '8px' }} />
                <span>Download CV</span>
              </a>
            </div>

            {/* Social Icons row */}
            <div className="hero-socials-row">
              <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hero-social-card" aria-label="LinkedIn">
                <FiLinkedin className="hero-social-card-icon" />
              </a>
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="hero-social-card" aria-label="GitHub">
                <FiGithub className="hero-social-card-icon" />
              </a>
              <a href={`mailto:${p.email || 'tabassumauthoy123@gmail.com'}`} className="hero-social-card" aria-label="Email">
                <FiMail className="hero-social-card-icon" />
              </a>
              <a href={p.facebookUrl || 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="hero-social-card" aria-label="Facebook">
                <FiFacebook className="hero-social-card-icon" />
              </a>
              <a href={p.twitterUrl || 'https://twitter.com'} target="_blank" rel="noopener noreferrer" className="hero-social-card" aria-label="Twitter">
                <FiTwitter className="hero-social-card-icon" />
              </a>
            </div>
          </div>

          {/* Right Column: Premium Portrait Image */}
          <div className="hero-image-col animate-fade-in">
            <div className="hero-image-wrapper">
              <img 
                src={finalPhotoUrl} 
                alt={p.name} 
                className="hero-portrait-img" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preserved Bottom Row: Interactive Tech Deck & 3D Globe */}
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
