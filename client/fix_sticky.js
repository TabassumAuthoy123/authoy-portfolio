import fs from 'fs';

let css = fs.readFileSync('f:/Softify/portfolio/client/src/index.css', 'utf8');

const oldCss = `.nav-top { z-index: 100; }
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
  .nav-floating { display: none !important; }
  .nav-top { display: block !important; }
  .nav-top__inner { display: flex !important; margin-top: 10px; }
}`;

const newCss = `.nav-top { z-index: 999; }
@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
  .nav-floating { display: none !important; }
  .nav-top { 
    display: block !important; 
    position: sticky; 
    top: 0; 
    padding: 10px 0; 
    background: rgba(250, 250, 250, 0.85); 
    backdrop-filter: blur(15px); 
    border-bottom: 1px solid rgba(150, 150, 150, 0.1); 
  }
  [data-theme="dark"] .nav-top {
    background: rgba(10, 15, 25, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .nav-top__inner { display: flex !important; align-items: center; justify-content: space-between; padding: 0 5%; }
}`;

css = css.replace(oldCss, newCss);

// Also we need to adjust the drawer to be relative to the viewport if the navbar is sticky, but since it's absolute, it will attach to the nearest relative parent or document.
// Actually, since nav-top is sticky, if we put nav-mobile inside it, it will scroll with it. But nav-mobile is outside nav-top!
// If nav-mobile is `position: fixed` it works smoothly. Let's make the drawer `position: fixed` instead of absolute to avoid scrolling issues.
// Let's replace the nav-mobile absolute with fixed.

const oldDrawer = `.nav-mobile { position: absolute; top: 70px; right: 20px; width: 280px; height: auto; padding: 25px; border-radius: 20px; background: rgba(245, 245, 245, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(150, 150, 150, 0.2); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); z-index: 99; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; transform: translateY(-20px) scale(0.95); transform-origin: top right; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }`;

const newDrawer = `.nav-mobile { position: fixed; top: 80px; right: 20px; width: 280px; height: auto; padding: 25px; border-radius: 20px; background: rgba(245, 245, 245, 0.85); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(150, 150, 150, 0.2); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); z-index: 998; display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch; transform: translateY(-20px) scale(0.95); transform-origin: top right; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }`;

css = css.replace(oldDrawer, newDrawer);

fs.writeFileSync('f:/Softify/portfolio/client/src/index.css', css);
console.log("Sticky CSS applied");
