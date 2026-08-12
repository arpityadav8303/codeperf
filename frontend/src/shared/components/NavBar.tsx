import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./NavBar.css";

export interface NavBarLink {
  label: string;
  path: string;
}

export interface NavBarProps {
  username: string;
  links?: NavBarLink[];
}

const defaultLinks: NavBarLink[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Editor", path: "/editor" },
  { label: "Security", path: "/changePassword" },
];

export const NavBar: React.FC<NavBarProps> = ({ username, links = defaultLinks }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const userName = username || "Developer";

  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!navRef.current) return;
      if (event.target instanceof Node && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-title">CodePerf</div>
          <div className="navbar-subtitle">Welcome, {userName}</div>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`} aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `navbar-link${isActive ? " navbar-link-active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
