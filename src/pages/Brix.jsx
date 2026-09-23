import { products } from "../data";
import { PageBanner } from "../components/Ui";

export default function Brix() {
  return (
    <>
      <PageBanner
        kicker="수확 노트"
        title="오늘 아침의 숫자"
        desc="매일 아침 밭에서 재어 적습니다. 기준보다 낮으면 그 날은 출하하지 않습니다."
      />
      <section className="notebook wrap brix-page">
        <h2 className="nb-title nb-title--solo">오늘 아침의 당도</h2>
        <ol className="nb-list tall">
          {products.map((p) => (
            <li key={p.id}>
              <div className="note-block">
                <img className="nb-thumb" src={p.image} alt={`${p.name} 제주 감귤`} />
                <span className="nb-no">{p.no}</span>
                <span className="nb-name">
                  {p.name}
                  <small>
                    {p.hanja} · {p.season}
                  </small>
                </span>
                <strong>
                  {p.brixLabel}
                  <small>°Bx</small>
                </strong>
                <span className="nb-bar">
                  <i style={{ width: `${(p.brix / 16) * 100}%`, background: p.color }} />
                </span>
                <p>{p.taste}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
