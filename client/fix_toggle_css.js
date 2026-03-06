import fs from 'fs';

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

const oldCss = `.nav__mobile-toggle { background: transparent; border: none; color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; }
[data-theme="dark"] .nav__mobile-toggle { color: #fff; }`;

const newCss = `.nav__mobile-toggle { width: 38px; height: 38px; border-radius: 10px; background: rgba(150, 150, 150, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(150, 150, 150, 0.2); color: hsl(var(--fg)); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
[data-theme="dark"] .nav__mobile-toggle { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #fff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
.nav__mobile-toggle:hover { background: rgba(150, 150, 150, 0.25); transform: scale(1.05); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }
[data-theme="dark"] .nav__mobile-toggle:hover { background: rgba(255, 255, 255, 0.1); }`;

css = css.replace(oldCss, newCss);
fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);
console.log("CSS replaced successfully");
