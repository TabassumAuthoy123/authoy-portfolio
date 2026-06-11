import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
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
      <Contact />
      <Footer />
    </>
  );
}
