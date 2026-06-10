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
        title="Tabassum Authoy | Full Stack Developer & Competitive Programmer"
        description="Tabassum Authoy — Full Stack Developer & Competitive Programmer. Building production-grade web applications with React, Node.js, Laravel, and modern technologies. 400+ competitive programming problems solved."
        keywords="Tabassum Authoy, developer, programmer, React, Node.js, Laravel, MERN stack, Bangladesh, AUST CSE"
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
