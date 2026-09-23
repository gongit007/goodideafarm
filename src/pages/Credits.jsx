import { photoCreditsCommons, photoCreditsOwn } from "../data";
import { PageBanner } from "../components/Ui";

export default function Credits() {
  return (
    <>
      <PageBanner
        kicker="Photo credits"
        title="사진 출처"
        desc="농장 사진과 Wikimedia Commons 자료의 저작·라이선스 표기입니다."
      />
      <section className="wrap credits-page">
        <div className="credits-block">
          <h2>농장 제공</h2>
          <p>{photoCreditsOwn}</p>
        </div>
        <div className="credits-block">
          <h2>Wikimedia Commons</h2>
          <p className="credits-lede">
            아래 풍경·감귤 사진은 Wikimedia Commons의 퍼블릭 도메인·CC0·Creative
            Commons 자료를 사용했습니다.
          </p>
          <ol className="credits-list">
            {photoCreditsCommons.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.file}</span>
                <span>
                  {item.author} · {item.license}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
