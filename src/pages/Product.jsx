import { Link, useParams } from "react-router-dom";
import { useBrix } from "../BrixContext.jsx";
import { farm } from "../data";
import { PageBanner, StoreBuyLink, StoreHint } from "../components/Ui";
import OptimizedImage from "../components/OptimizedImage.jsx";

export default function Product() {
  const { id } = useParams();
  const { products } = useBrix();
  const product = products.find((p) => p.id === id) || products[0];

  return (
    <>
      <PageBanner kicker={`제철 ${product.no}`} title={product.name} desc={product.hanja} />
      <article className="split wrap product-sheet">
        <div className="swatch" style={{ background: product.color }}>
          <OptimizedImage src={product.image} alt={product.name} priority />
        </div>
        <div>
          <p className="eyebrow">{product.season}</p>
          <p className="lede">{product.summary}</p>
          <p>{product.description}</p>
          <dl className="spec">
            <div>
              <dt>당도</dt>
              <dd>{product.brixLabel} °Bx</dd>
            </div>
            <div>
              <dt>맛</dt>
              <dd>{product.taste}</dd>
            </div>
            <div>
              <dt>중량</dt>
              <dd>{product.weight}</dd>
            </div>
            <div>
              <dt>가격</dt>
              <dd>
                {product.unit} {Number(product.price).toLocaleString()}원부터
              </dd>
            </div>
          </dl>
          <ul className="dot-list">
            {product.points.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="cover-actions">
            <StoreBuyLink product={product} />
            <Link className="ghost-btn" to={`/contact?item=${product.id}`}>
              이 귤로 편지
            </Link>
            <a className="ghost-btn" href={farm.phoneHref}>
              {farm.phone}
            </a>
          </div>
          <StoreHint product={product} />
        </div>
      </article>
    </>
  );
}
