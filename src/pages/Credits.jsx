import { photoCreditsBrand, photoCreditsCommons, photoCreditsOwn } from "../data";
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
          <h2>브랜드·일러스트</h2>
          <ol className="credits-list credits-list--brand">
            {photoCreditsBrand.map((item) => (
              <li key={item.siteFile}>
                <strong>{item.label}</strong>
                <span>{item.siteFile}</span>
                <span>{item.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="credits-block">
          <h2>Wikimedia Commons</h2>
          <p className="credits-lede">
            아래 풍경·감귤 사진은 Wikimedia Commons의 CC0·퍼블릭 도메인·Creative
            Commons 자료를 사용했습니다. CC 라이선스 사진은 저작자 표시와 라이선스
            링크를 함께 표기합니다.
          </p>
          <ol className="credits-list">
            {photoCreditsCommons.map((item) => (
              <li key={item.siteFile}>
                <strong>{item.label}</strong>
                <span>
                  <code>{item.siteFile}</code>
                  <br />
                  <a href={item.commonsUrl} target="_blank" rel="noopener noreferrer">
                    {item.commonsFile}
                  </a>
                </span>
                <span>
                  {item.author} ·{" "}
                  <a href={item.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {item.license}
                  </a>
                  {item.modified ? (
                    <>
                      <br />
                      <em className="credits-mod">{item.modified}</em>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
