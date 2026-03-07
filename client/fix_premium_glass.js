import fs from 'fs';

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

// The current pure transparent styles:
const oldLight = `.nav__mobile-toggle { width: 30px; height: 30px; background: transparent; border: none; color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; padding: 0; margin-left: 5px; }`;
const oldDark = `[data-theme="dark"] .nav__mobile-toggle { background: transparent; border: none; color: #fff; box-shadow: none; }`;
const oldHover = `.nav__mobile-toggle:hover { opacity: 0.7; transform: scale(0.95); background: transparent; box-shadow: none; }`;
const oldDarkHover = `[data-theme="dark"] .nav__mobile-toggle:hover { background: transparent; opacity: 0.7; }`;

// Premium Frosted Glass Effect
const newLight = `.nav__mobile-toggle { width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-left: auto; }`;
const newDark = `[data-theme="dark"] .nav__mobile-toggle { background: rgba(10, 15, 25, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }`;
const newHover = `.nav__mobile-toggle:hover { background: rgba(255, 255, 255, 0.25); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.5); }`;
const newDarkHover = `[data-theme="dark"] .nav__mobile-toggle:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }`;

css = css.replace(oldLight, newLight);
css = css.replace(oldDark, newDark);
css = css.replace(oldHover, newHover);
css = css.replace(oldDarkHover, newDarkHover);

fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);
console.log("Premium glass CSS applied to toggle successfully!");

let jsx = fs.readFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', 'utf8');
jsx = jsx.replace('{open ? <FiX size={18} /> : <FiMenu size={18} />}', '{open ? <FiX size={20} /> : <FiMenu size={20} />}');
fs.writeFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', jsx);
console.log("JSX SVGs updated to balance the box size");
