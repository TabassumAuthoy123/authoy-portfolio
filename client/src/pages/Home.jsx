import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Achievements from '../components/Achievements';
import Booking from '../components/Booking';
import Contact from '../components/Contact';
import AIAssistant from '../components/AIAssistant';
import Footer from '../components/Footer';
import LeadPopup from '../components/LeadPopup';
import { getSettings } from '../api';
import { useState, useEffect } from 'react';

export default function Home() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    getSettings().then(res => setSiteSettings(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <SEOHead 
        title="Tabassum Mustafa Authoy | Software Engineer & Researcher"
        description="Tabassum Mustafa Authoy — Software Engineer, AI safety researcher, and Business Development Manager. Working at the intersection of technology, research, and art."
        keywords="Tabassum Mustafa Authoy, Tabassum Authoy, Software Engineer, AI Safety, BRAC University, DU EMBA, SEGi University, B2B SaaS, SoftifyBD, classical dance"
      />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Achievements />
      <Booking />
      <Contact />
      <Footer />
      <AIAssistant />
      <LeadPopup settings={siteSettings} />
    </>
  );
}
