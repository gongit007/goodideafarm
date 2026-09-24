import { useBrix } from "../BrixContext.jsx";
import { PageBanner } from "../components/Ui";
import OptimizedImage from "../components/OptimizedImage.jsx";

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Brix() {
  const { products, updatedAt, harvestDate } = useBrix();

  return (
    <>
      <PageBanner
        kicker="수확 노트"
        title="오늘 아침의 숫자"
        desc="매일 아침 밭에서 재어 적습니다. 기준보다 낮으면 그 날은 출하하지 않습니다."
      />
      <section className="notebook wrap brix-page">
        <div className="nb-head">
          <h2 className="nb-title nb-title--solo">오늘 아침의 당도</h2>
          {(updatedAt || harvestDate) && (
            <p className="brix-meta">
              {harvestDate ? `수확 메모 ${harvestDate}` : null}
              {updatedAt ? ` · 갱신 ${formatWhen(updatedAt)}` : null}
            </p>
          )}
        </div>
        <ol className="nb-list tall">
          {products.map((p) => (
            <li key={p.id}>
              <div className="note-block">
                <OptimizedImage
                  className="nb-thumb"
                  src={p.image}
                  alt={`${p.name} 제주 감귤`}
                  width={88}
                  height={88}
                />
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
