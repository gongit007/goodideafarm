import { Link } from "react-router-dom";
import { PageBanner } from "../components/Ui";

export default function NotFound() {
  return (
    <>
      <PageBanner
        kicker="404"
        title="길을 잃으셨군요"
        desc="주소가 바뀌었거나, 아직 심지 않은 페이지일 수 있습니다."
      />
      <section className="wrap not-found">
        <p className="lede">아래에서 다시 시작해 주세요.</p>
        <div className="cover-actions">
          <Link className="ink-btn" to="/">
            홈으로
          </Link>
          <Link className="ghost-btn" to="/shop">
            제철품종
          </Link>
          <Link className="ghost-btn" to="/contact">
            편지 보내기
          </Link>
        </div>
      </section>
    </>
  );
}
