import fs from 'fs';

let jsx = fs.readFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', 'utf8');

const oldJsx = `<button className="nav__mobile-toggle" onClick={() => setOpen(!open)}>\n              {open ? <FiX size={26} /> : <FiMenu size={26} />}\n            </button>`;

const newJsx = `<button className="nav__mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle mobile menu">\n              {open ? <FiX size={20} /> : <FiMenu size={20} />}\n            </button>`;

jsx = jsx.replace(oldJsx, newJsx);
fs.writeFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', jsx);
console.log("JSX replaced successfully");
