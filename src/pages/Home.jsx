import { Link } from "react-router-dom";
import { useBrix } from "../BrixContext.jsx";
import { farm, stories, experience, faqs, vistas, citrusShots } from "../data";
import { BranchDecor, BasketMark } from "../components/Icons";
import CoverSlides from "../components/CoverSlides";
import OptimizedImage from "../components/OptimizedImage.jsx";

export default function Home() {
  const { products } = useBrix();
  return (
    <>
      <section className="cover">
        <div className="cover-left">
          <BranchDecor className="cover-branch" />
          <p className="eyebrow">Jeju · {farm.english}</p>
          <h1 className="cover-title">
            <span className="vert">좋은생각</span>
            <span className="cover-hangul">귤농수산</span>
          </h1>
          <p className="cover-line">{farm.slogan}</p>
          <p className="cover-entity">
            {farm.region}에서 {farm.ownerTitle} {farm.owner}가 운영하는 감귤 농장입니다. 극조생,
            조생, 비가림하우스, 레드향을 제철에만 수확해 산지직송하며, 택배 구매는 네이버
            스마트스토어로 이어집니다.
          </p>
          <p className="cover-who">
            {farm.ownerTitle} {farm.owner}
            <em>{farm.phone}</em>
          </p>
          <div className="cover-actions">
            <Link className="ink-btn" to="/buy">
              구매하기
            </Link>
            <Link className="ghost-btn" to="/shop">
              제철 감귤 보기
            </Link>
          </div>
        </div>
        <CoverSlides />
      </section>

      <section className="vista wrap" aria-label="제주와 감귤">
        <figure className="vista-hero">
          <OptimizedImage src={vistas[0].src} alt={vistas[0].alt} priority />
          <figcaption>{vistas[0].caption}</figcaption>
        </figure>
        {citrusShots.slice(0, 4).map((shot) => (
          <figure key={shot.src}>
            <OptimizedImage src={shot.src} alt={shot.alt} width={320} height={240} />
          </figure>
        ))}
      </section>

      <section className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>극조생 · 조생 · 비가림하우스 · 레드향 · </span>
          ))}
        </div>
      </section>

      <section className="notebook wrap">
        <div className="nb-head">
          <div>
            <p className="eyebrow">Harvest note</p>
            <p>매일 아침 밭에서 적어 온 숫자입니다. 기준보다 낮으면 내지 않습니다.</p>
          </div>
          <h2 className="nb-title">오늘 아침의 당도</h2>
        </div>
        <ol className="nb-list">
          {products.map((p) => (
            <li key={p.id}>
              <Link to="/brix">
                <OptimizedImage className="nb-thumb" src={p.image} alt="" width={72} height={72} />
                <span className="nb-no">{p.no}</span>
                <span className="nb-name">
                  {p.name}
                  <small>{p.hanja}</small>
                </span>
                <span className="nb-bar">
                  <i style={{ width: `${(p.brix / 16) * 100}%`, background: p.color }} />
                </span>
                <strong>
                  {p.brixLabel}
                  <small>°Bx</small>
                </strong>
              </Link>
            </li>
          ))}
        </ol>
        <Link className="text-arrow" to="/brix">
          수확 노트 펼치기
        </Link>
      </section>

      <section className="jeju-band wrap">
        <div className="jeju-copy">
          <p className="eyebrow">Jeju</p>
          <h2>바람이 키운 섬, 귤이 익는 땅</h2>
          <p>
            한라산의 아침, 성산의 바람, 주상절리의 파도. 제주의 날씨가 곧 당도가 됩니다. 좋은생각
            귤농수산은 그 철을 기다려 담습니다.
          </p>
        </div>
        <div className="jeju-grid">
          {vistas.map((v) => (
            <figure key={v.src}>
              <OptimizedImage src={v.src} alt={v.alt} />
              <figcaption>{v.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="chapters">
        <div className="wrap chapter-intro">
          <p className="eyebrow">In season</p>
          <h2>네 가지 제철</h2>
          <p>품종마다 얼굴이 다릅니다. 번호 순으로 한 철씩 익습니다.</p>
        </div>
        {products.map((p, i) => (
          <article key={p.id} className={`chapter ${i % 2 ? "is-flip" : ""}`}>
            <div className="chapter-num" style={{ color: p.color }}>
              {p.no}
            </div>
            <div className="chapter-copy">
              <p className="eyebrow">{p.season}</p>
              <h3>
                {p.name}
                <small>{p.hanja}</small>
              </h3>
              <p>{p.summary}</p>
              <ul>
                {p.points.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="chapter-price">
                {p.unit} · {Number(p.price).toLocaleString()}원부터
              </p>
              <Link className="text-arrow" to={`/shop/${p.id}`}>
                이 귤 이야기
              </Link>
            </div>
            <div className="chapter-visual" style={{ "--tone": p.color }}>
              <OptimizedImage src={p.image} alt={p.name} />
            </div>
          </article>
        ))}
      </section>

      <section className="letter wrap">
        <div className="letter-photo">
          <OptimizedImage src="/images/brand-farmer.jpg" alt="좋은생각 귤농수산 브랜드" />
        </div>
        <div className="letter-body">
          <p className="eyebrow">Farmer</p>
          <h2>
            {farm.ownerTitle} {farm.owner}
          </h2>
          <p>
            좋은생각 귤농수산은 이름 그대로, 귤을 고르는 마음이 먼저입니다. 극조생부터 레드향까지
            제철이 아니면 담지 않고, 당도가 오를 때까지 기다립니다.
          </p>
          <ul className="roman-list">
            {stories.map((s) => (
              <li key={s.no}>
                <span>{s.no}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link className="ink-btn" to="/farm">
            이야기 더 읽기
          </Link>
        </div>
      </section>

      <section className="ticket wrap">
        <div className="ticket-stub">
          <BasketMark size={120} />
          <p>입장료 없음</p>
          <strong>{experience.price}</strong>
        </div>
        <div className="ticket-main">
          <p className="eyebrow">Walk the grove</p>
          <h2>{experience.title}</h2>
          <p>
            {experience.period} · {experience.hours}
            <br />
            {experience.people}
          </p>
          <Link className="ghost-btn" to="/experience">
            체험 안내
          </Link>
        </div>
        <figure className="ticket-photo">
          <OptimizedImage src="/images/orchard.jpg" alt="감귤 따기 체험 밭" />
        </figure>
      </section>

      <section className="ask wrap">
        <h2>자주 묻는 말</h2>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
