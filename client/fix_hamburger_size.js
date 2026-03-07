import fs from 'fs';

let jsx = fs.readFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', 'utf8');

jsx = jsx.replace('{open ? <FiX size={26} /> : <FiMenu size={26} />}', '{open ? <FiX size={20} /> : <FiMenu size={20} />}');

fs.writeFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', jsx);
console.log("JSX updated");

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

const oldToggle = `.nav__mobile-toggle { width: 38px; height: 38px; border-radius: 10px; background: rgba(150, 150, 150, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(150, 150, 150, 0.2); color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }`;
const newToggle = `.nav__mobile-toggle { width: 34px; height: 34px; border-radius: 8px; background: rgba(150, 150, 150, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(150, 150, 150, 0.2); color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }`;

css = css.replace(oldToggle, newToggle);

fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);

console.log("CSS updated");
