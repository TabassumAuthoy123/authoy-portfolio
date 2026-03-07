import fs from 'fs';

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

const drawerOldLight = `.nav-mobile { position: fixed; top: 80px; right: 20px; width: 280px; height: auto; padding: 25px; border-radius: 20px; background: rgba(245, 245, 245, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(150, 150, 150, 0.2); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); z-index: 998; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; transform: translateY(-20px) scale(0.95); transform-origin: top right; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }`;
const drawerNewLight = `.nav-mobile { position: fixed; top: 76px; right: 20px; width: 250px; height: auto; padding: 20px; border-radius: 20px; background: rgba(250, 250, 250, 0.4); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); z-index: 998; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; transform: translateY(-20px) scale(0.95); transform-origin: top right; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }`;

const drawerOldDark = `[data-theme="dark"] .nav-mobile { background: rgba(20, 25, 35, 0.85); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3); border-color: rgba(255, 255, 255, 0.05); }`;
const drawerNewDark = `[data-theme="dark"] .nav-mobile { background: rgba(10, 15, 25, 0.35); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); }`;

css = css.replace(drawerOldLight, drawerNewLight);
css = css.replace(drawerOldDark, drawerNewDark);

const oldActions = `.nav-mobile__actions { display: flex; gap: 10px; width: 100%; }
.nav-mobile__actions .btn { flex: 1; font-size: 0.9rem; padding: 10px; justify-content: center; }
.nav__cta--mobile { width: 100%; justify-content: center; padding: 15px; font-size: 1rem; }`;

const newActions = `.nav-mobile__actions { display: flex; gap: 8px; width: 100%; }
.nav-mobile__actions .btn, .nav-mobile__actions .nav__action-pill { flex: 1; font-size: 0.8rem; padding: 8px; justify-content: center; border-radius: 8px; }
.nav-mobile__actions svg { width: 14px; height: 14px; }
.nav__cta--mobile { width: 100%; justify-content: center; padding: 10px; font-size: 0.85rem; border-radius: 8px; }
.nav__cta--mobile svg { width: 14px; height: 14px; }`;

css = css.replace(oldActions, newActions);

fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);
console.log("Drawer glass and buttons correctly shrunk");
