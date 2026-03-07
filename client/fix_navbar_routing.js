import fs from 'fs';

let jsx = fs.readFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', 'utf8');

// Add react-router-dom hooks
jsx = jsx.replace(
  "import { getProfile, getImageUrl } from '../api';",
  "import { getProfile, getImageUrl } from '../api';\nimport { useLocation, useNavigate } from 'react-router-dom';"
);

// Add hooks inside component
jsx = jsx.replace(
  "export default function Navbar() {",
  "export default function Navbar() {\n  const location = useLocation();\n  const navigate = useNavigate();"
);

// Update scrollTo logic
const oldScrollTo = `  const scrollTo = (id) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };`;

const newScrollTo = `  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(id === 'hero' ? '/' : \`/#\${id}\`);
      // Scroll to top immediately when going to home
      if(id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' });
      else {
          // Add a short delay to allow page load before scroll
          setTimeout(() => {
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
    } else {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setOpen(false);
  };`;

jsx = jsx.replace(oldScrollTo, newScrollTo);

// Fix logo click
const oldLogoList = `          <a href="#" className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="nav__logo-icon">✦</span>
            <span className="nav__logo-text">Adnan</span>
          </a>`;

const newLogoList = `          <button className="nav__logo" style={{background:'none',border:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center'}} onClick={() => {
            if (location.pathname !== '/') navigate('/');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <span className="nav__logo-icon">✦</span>
            <span className="nav__logo-text">Adnan</span>
          </button>`;

jsx = jsx.replace(oldLogoList, newLogoList);

fs.writeFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', jsx);
console.log("Navbar routing fixed successfully.");
