import { Link } from "react-router-dom";
import { useBrix } from "../BrixContext.jsx";
import { PageBanner, StoreHomeLink } from "../components/Ui";
import OptimizedImage from "../components/OptimizedImage.jsx";

export default function Shop() {
  const { products } = useBrix();
  return (
    <>
      <PageBanner
        kicker="제철품종"
        title="지금 익은 감귤"
        desc="철을 따라 한 품종씩 소개합니다. 결제는 네이버 스마트스토어에서 이어집니다."
        image="/images/citrus-close-3.jpg"
      />
      <div className="wrap season-table">
        {products.map((p) => (
          <Link key={p.id} to={`/shop/${p.id}`} className="season-row">
            <OptimizedImage src={p.image} alt={p.name} width={88} height={88} />
            <span className="nb-no">{p.no}</span>
            <span>
              <strong>{p.name}</strong>
              <em>{p.hanja}</em>
            </span>
            <span>{p.season}</span>
            <span className="hide-sm">{p.taste}</span>
            <span>
              {p.unit} {Number(p.price).toLocaleString()}원~
            </span>
          </Link>
        ))}
      </div>
      <div className="wrap season-buy">
        <Link className="ink-btn" to="/buy">
          이 귤 구매하기
        </Link>
        <StoreHomeLink />
      </div>
    </>
  );
}
