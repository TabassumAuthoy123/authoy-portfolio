import fs from 'fs';

let jsx = fs.readFileSync('f:/Softify/portfolio/client/src/components/Navbar_new.jsx', 'utf8');

const navFloatingHtml = `      {/* Floating center pill nav — Desktop only */}
      <nav className="nav-floating desktop-only">
        <div className="\`nav-floating__pill \${open ? 'nav-floating__pill--open' : ''}\`">
          {navLinks.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className="\`nav-floating__link \${active === id ? 'nav-floating__link--active' : ''}\`"
              onClick={() => scrollTo(id)}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}`;

// Replace the end of Navbar_new.jsx with the missing desktop bar
jsx = jsx.replace('    </>\n  );\n}', navFloatingHtml);

// Fix template literal escaping from above
jsx = jsx.replace(/"`nav-floating__pill \$\{open \? 'nav-floating__pill--open' : ''\}`"/g, "{`nav-floating__pill ${open ? 'nav-floating__pill--open' : ''}`}");
jsx = jsx.replace(/"`nav-floating__link \$\{active === id \? 'nav-floating__link--active' : ''\}`"/g, "{`nav-floating__link ${active === id ? 'nav-floating__link--active' : ''}`}");

fs.writeFileSync('f:/Softify/portfolio/client/src/components/Navbar.jsx', jsx);
console.log("Desktop navbar recovered and injected successfully!");
