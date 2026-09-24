import { Link } from "react-router-dom";
import { farm, nav } from "../data";

export default function Footer() {
  return (
    <footer className="colophon">
      <div className="wrap colo-grid">
        <div className="colo-brand">
          <p className="wm-small">좋은생각</p>
          <p className="wm-big">귤농수산</p>
          <p className="colo-slogan">{farm.slogan}</p>
        </div>
        <ul className="colo-nav">
          {nav.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <address className="colo-meta">
          <p>
            {farm.ownerTitle} {farm.owner}
          </p>
          <p>
            <a href={farm.phoneHref}>{farm.phone}</a>
          </p>
          <p>{farm.hours}</p>
          <p>{farm.region}</p>
        </address>
        <div className="colo-seal" aria-hidden="true">
          <span>産地</span>
          <span>直送</span>
        </div>
      </div>
      <p className="colo-copy">
        © {new Date().getFullYear()} {farm.name} · 시세는 작황에 따라 달라질 수 있습니다.{" "}
        <Link to="/privacy" className="footer-quiet">
          개인정보
        </Link>
        {" · "}
        <Link to="/credits" className="footer-quiet">
          사진 출처
        </Link>
        {" · "}
        <Link to="/admin" className="footer-quiet">
          관리
        </Link>
      </p>
    </footer>
  );
}
