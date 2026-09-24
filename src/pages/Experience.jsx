import { Link } from "react-router-dom";
import { experience, farm } from "../data";
import { PageBanner } from "../components/Ui";
import { BasketMark } from "../components/Icons";
import MapEmbed from "../components/MapEmbed.jsx";
import OptimizedImage from "../components/OptimizedImage.jsx";

export default function Experience() {
  return (
    <>
      <PageBanner
        kicker="감귤타기"
        title={experience.title}
        desc="예약 창구 대신, 밭에 오시기 전에 편지나 전화를 부탁드립니다."
        image="/images/orchard.jpg"
      />
      <section className="ticket wrap">
        <div className="ticket-stub">
          <BasketMark size={140} />
          <p>입장료 없음</p>
          <strong>{experience.price}</strong>
        </div>
        <div className="ticket-main">
          <dl className="spec">
            <div>
              <dt>기간</dt>
              <dd>{experience.period}</dd>
            </div>
            <div>
              <dt>시간</dt>
              <dd>{experience.hours}</dd>
            </div>
            <div>
              <dt>대상</dt>
              <dd>{experience.people}</dd>
            </div>
          </dl>
          <a className="ink-btn" href={farm.phoneHref}>
            방문 전 전화
          </a>
        </div>
        <figure className="ticket-photo">
          <OptimizedImage src="/images/jeju-olle.jpg" alt="제주 올레 해안" />
        </figure>
      </section>
      <section className="split wrap">
        <figure className="frame">
          <OptimizedImage src="/images/jeju-coast.jpg" alt="제주 중문 주상절리" />
          <figcaption>체험이 끝나면, 제주의 바다가 가깝습니다</figcaption>
        </figure>
        <section className="note-list">
          <h2>밭에 오기 전에</h2>
          <ol>
            {experience.notes.map((n, i) => (
              <li key={n}>
                <span>0{i + 1}</span>
                {n}
              </li>
            ))}
          </ol>
          <Link className="text-arrow" to="/contact">
            단체 일정을 편지로
          </Link>
        </section>
      </section>
      <section className="split wrap farm-location">
        <MapEmbed title="감귤타기 · 농장 위치" />
        <div>
          <p className="eyebrow">Location</p>
          <h2>찾아오시는 길</h2>
          <p className="lede">{farm.address.full}</p>
          <p>{farm.address.note}</p>
          <a className="ink-btn" href={farm.phoneHref}>
            방문 전 전화
          </a>
        </div>
      </section>
    </>
  );
}
