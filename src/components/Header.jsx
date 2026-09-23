import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { farm, nav } from "../data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`mast ${scrolled ? "is-stuck" : ""}`}>
      <p className="mast-tick">
        <span>제주 · {farm.name}</span>
        <span>
          {farm.ownerTitle} {farm.owner}
        </span>
        <span>{farm.tagline}</span>
      </p>
      <div className="mast-bar">
        <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
          <span className="wm-small">좋은생각</span>
          <span className="wm-big">귤농수산</span>
        </Link>

        <nav className="mast-nav" aria-label="주요 메뉴">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link className="stamp-btn" to="/buy">
          구매하기
        </Link>

        <button
          className={`fold ${open ? "is-open" : ""}`}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
        </button>
      </div>

      <div className={`fold-sheet ${open ? "is-open" : ""}`}>
        {nav.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="fold-link"
            onClick={() => setOpen(false)}
          >
            <span className="fold-link-no">0{i + 1}</span>
            {item.label}
          </NavLink>
        ))}
        <Link className="ink-btn" to="/buy" onClick={() => setOpen(false)}>
          구매하기
        </Link>
        <a className="ghost-btn" href={farm.phoneHref} onClick={() => setOpen(false)}>
          {farm.phone}
        </a>
      </div>
    </header>
  );
}
