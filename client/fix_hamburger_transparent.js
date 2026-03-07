import fs from 'fs';

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

const oldCss = `.nav__mobile-toggle { width: 34px; height: 34px; border-radius: 8px; background: rgba(150, 150, 150, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(150, 150, 150, 0.2); color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }`;
const newCss = `.nav__mobile-toggle { width: 30px; height: 30px; background: transparent; border: none; color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; padding: 0; margin-left: 5px; }`;

css = css.replace(oldCss, newCss);

const oldDark = `[data-theme="dark"] .nav__mobile-toggle { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #fff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }`;
const newDark = `[data-theme="dark"] .nav__mobile-toggle { background: transparent; border: none; color: #fff; box-shadow: none; }`;

css = css.replace(oldDark, newDark);

const oldHover = `.nav__mobile-toggle:hover { background: rgba(150, 150, 150, 0.25); transform: scale(1.05); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }`;
const newHover = `.nav__mobile-toggle:hover { opacity: 0.7; transform: scale(0.95); background: transparent; box-shadow: none; }`;

css = css.replace(oldHover, newHover);

const oldDarkHover = `[data-theme="dark"] .nav__mobile-toggle:hover { background: rgba(255, 255, 255, 0.1); }`;
const newDarkHover = `[data-theme="dark"] .nav__mobile-toggle:hover { background: transparent; opacity: 0.7; }`;

css = css.replace(oldDarkHover, newDarkHover);

fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);
console.log("CSS toggle updated");

let jsx = fs.readFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', 'utf8');
jsx = jsx.replace('{open ? <FiX size={20} /> : <FiMenu size={20} />}', '{open ? <FiX size={18} /> : <FiMenu size={18} />}');
fs.writeFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', jsx);
console.log("JSX SVGs updated");
