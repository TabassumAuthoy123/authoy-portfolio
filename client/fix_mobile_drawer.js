import fs from 'fs';

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

const oldCss = `.nav-mobile { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 99; display: flex; flex-direction: column; justify-content: center; align-items: center; transform: translateY(-100%); opacity: 0; transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease; pointer-events: none; }
[data-theme="dark"] .nav-mobile { background: rgba(10, 15, 25, 0.95); }
.nav-mobile--open { transform: translateY(0); opacity: 1; pointer-events: auto; }
.nav-mobile__links { display: flex; flex-direction: column; gap: 20px; width: 100%; align-items: center; }
.nav-mobile__link { display: flex; align-items: center; gap: 15px; font-size: 1.5rem; font-weight: 700; color: hsl(var(--fg)); background: none; border: none; cursor: pointer; transition: color 0.3s ease, transform 0.3s ease; }`;

const newCss = `.nav-mobile { position: absolute; top: 70px; right: 20px; width: 280px; height: auto; padding: 25px; border-radius: 20px; background: rgba(245, 245, 245, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(150, 150, 150, 0.2); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); z-index: 99; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; transform: translateY(-20px) scale(0.95); transform-origin: top right; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }
[data-theme="dark"] .nav-mobile { background: rgba(20, 25, 35, 0.85); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3); border-color: rgba(255, 255, 255, 0.05); }
.nav-mobile--open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
.nav-mobile__links { display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: flex-start; }
.nav-mobile__link { display: flex; align-items: center; gap: 12px; font-size: 1.1rem; font-weight: 600; color: hsl(var(--fg)); background: none; border: none; cursor: pointer; transition: color 0.3s ease, transform 0.3s ease; width: 100%; text-align: left; padding: 8px 10px; border-radius: 8px; }
.nav-mobile__link:hover { background: rgba(150, 150, 150, 0.1); }
[data-theme="dark"] .nav-mobile__link:hover { background: rgba(255, 255, 255, 0.05); }`;

css = css.replace(oldCss, newCss);

// Make Footer inside Drawer more compact
const oldFooter = `.nav-mobile__footer { display: flex; flex-direction: column; gap: 20px; align-items: center; border-top: 1px solid rgba(150, 150, 150, 0.2); padding-top: 30px; margin-top: 40px; }
.nav-mobile__actions { display: flex; gap: 15px; }`;

const newFooter = `.nav-mobile__footer { display: flex; flex-direction: column; gap: 15px; align-items: stretch; border-top: 1px solid rgba(150, 150, 150, 0.2); padding-top: 20px; margin-top: 25px; }
.nav-mobile__actions { display: flex; gap: 10px; width: 100%; }
.nav-mobile__actions .btn { flex: 1; font-size: 0.9rem; padding: 10px; justify-content: center; }`;

css = css.replace(oldFooter, newFooter);

fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);
console.log("CSS replaced successfully");
