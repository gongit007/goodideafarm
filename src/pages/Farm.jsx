import { Link } from "react-router-dom";
import { farm, stories, vistas } from "../data";
import { PageBanner } from "../components/Ui";
import { FarmerMark } from "../components/Icons";
import MapEmbed from "../components/MapEmbed.jsx";
import BusinessInfo from "../components/BusinessInfo.jsx";
import OptimizedImage from "../components/OptimizedImage.jsx";

export default function Farm() {
  return (
    <>
      <PageBanner
        kicker="농장이야기"
        title="밭에서 고른 마음"
        desc="좋은생각 귤농수산은 제주에서 감귤을 키우고, 제철에만 담아 보냅니다."
        image="/images/jeju-hallasan.jpg"
      />
      <section className="split wrap">
        <figure className="frame">
          <OptimizedImage src="/images/orchard.jpg" alt="감귤밭" />
          <figcaption>수확 전, 잘 익은 감귤</figcaption>
        </figure>
        <div>
          <p className="eyebrow">Since the grove</p>
          <h2>
            {farm.ownerTitle} {farm.owner}
          </h2>
          <p className="lede">
            {farm.slogan}. 극조생, 조생, 비가림하우스, 레드향 — 네 가지를 철에 맞춰 키웁니다.
          </p>
          <p>
            이름을 ‘좋은생각’이라 붙인 이유는 단순합니다. 예쁘게 보이게 서두르지 않고, 맛이 올랐을
            때만 따는 것이 농부의 생각이라고 믿기 때문입니다.
          </p>
          <div className="farmer-row">
            <FarmerMark size={120} />
            <p>
              전화 {farm.phone}
              <br />
              {farm.hours}
            </p>
          </div>
        </div>
      </section>
      <section className="roman-band">
        <div className="wrap story-trio">
          {stories.map((s) => (
            <article key={s.no}>
              <span>{s.no}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="jeju-grid wrap farm-grid">
        {vistas.map((v) => (
          <figure key={v.src}>
            <OptimizedImage src={v.src} alt={v.alt} />
            <figcaption>{v.caption}</figcaption>
          </figure>
        ))}
      </section>
      <section className="brand-spread wrap">
        <OptimizedImage src="/images/brand-card.jpg" alt="좋은생각 귤농수산 소개 카드" />
        <OptimizedImage src="/images/brand-farmer.jpg" alt="농장주 일러스트" />
      </section>
      <section className="split wrap farm-location">
        <MapEmbed title="좋은생각 귤농수산 위치" />
        <div>
          <p className="eyebrow">Location</p>
          <h2>오시는 길</h2>
          <p className="lede">{farm.address.full}</p>
          <p>{farm.address.note}</p>
          <p>
            직판·밭 걷기는 <a href={farm.phoneHref}>{farm.phone}</a>로 미리 연락해 주세요.
          </p>
          <BusinessInfo compact />
        </div>
      </section>
      <div className="wrap end-cta">
        <Link className="ink-btn" to="/contact">
          농장주에게 편지
        </Link>
      </div>
    </>
  );
}
