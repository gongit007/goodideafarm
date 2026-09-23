import { farm, productStoreUrl } from "../data";

export function PageBanner({ kicker, title, desc, image }) {
  return (
    <section className={`banner ${image ? "has-photo" : ""}`}>
      {image && <img className="banner-photo" src={image} alt={title} />}
      <div className="banner-copy">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {desc && <p className="banner-desc">{desc}</p>}
      </div>
    </section>
  );
}

export function StoreBuyLink({
  product,
  className = "ink-btn",
  children = "스마트스토어에서 구매",
}) {
  const href = productStoreUrl(product);
  if (!href) {
    return (
      <span className={`${className} is-wait`} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function StoreHint({ product }) {
  const href = productStoreUrl(product);
  return (
    <p className="store-hint">
      {href
        ? "결제와 배송은 네이버 스마트스토어에서 이어집니다."
        : "스토어 주소를 연결 중입니다. 지금은 전화로 주문해 주세요."}
    </p>
  );
}

export function StoreHomeLink({ className = "ghost-btn", children = "스토어 전체 보기" }) {
  const href = String(farm.smartStoreUrl || "").trim();
  if (!href) {
    return (
      <span className={`${className} is-wait`} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
