import { Link } from "react-router-dom";
import { useBrix } from "../BrixContext.jsx";
import { farm } from "../data";
import { PageBanner, StoreBuyLink, StoreHint, StoreHomeLink } from "../components/Ui";
import OptimizedImage from "../components/OptimizedImage.jsx";

export default function Buy() {
  const { products } = useBrix();
  return (
    <>
      <PageBanner
        kicker="구매"
        title="제철 감귤 고르기"
        desc="품종을 고르면 네이버 스마트스토어에서 결제와 배송이 이어집니다."
        image="/images/citrus-close-2.jpg"
      />
      <div className="wrap buy-desk">
        <ul className="buy-cards">
          {products.map((p) => (
            <li key={p.id} className="buy-card">
              <OptimizedImage src={p.image} alt={p.name} width={320} height={200} />
              <div className="buy-card-meta">
                <p className="nb-no">{p.no}</p>
                <h2>
                  {p.name}
                  <small>{p.hanja}</small>
                </h2>
                <p>
                  {p.season} · {p.brixLabel} °Bx
                </p>
                <p className="buy-price">
                  {p.unit} {Number(p.price).toLocaleString()}원부터
                </p>
                <Link className="text-arrow" to={`/shop/${p.id}`}>
                  이 귤 이야기
                </Link>
              </div>
              <div className="buy-card-act">
                <StoreBuyLink product={p} />
                <StoreHint product={p} />
              </div>
            </li>
          ))}
        </ul>

        <div className="buy-forks">
          <div className="buy-fork">
            <p className="eyebrow">Smartstore</p>
            <h3>스토어에서 고르기</h3>
            <p>무게와 수량은 스마트스토어에서 고릅니다. 확정 가격도 스토어가 기준입니다.</p>
            <StoreHomeLink />
          </div>
          <div className="buy-fork">
            <p className="eyebrow">Call</p>
            <h3>전화 주문</h3>
            <p>직판·재고 확인은 농장주로 걸어 주세요. {farm.hours}</p>
            <a className="ghost-btn" href={farm.phoneHref}>
              {farm.phone}
            </a>
          </div>
          <div className="buy-fork">
            <p className="eyebrow">Letter</p>
            <h3>단체는 편지</h3>
            <p>명절·단체·맞춤 박스는 수량과 날을 남겨 주시면 준비합니다.</p>
            <Link className="ghost-btn" to="/contact">
              편지 쓰기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
