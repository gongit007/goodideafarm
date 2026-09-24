import { Link } from "react-router-dom";
import { farm } from "../data";
import { PageBanner } from "../components/Ui";

export default function Privacy() {
  return (
    <>
      <PageBanner
        kicker="Privacy"
        title="개인정보 처리방침"
        desc={`${farm.name} 웹사이트에서 수집하는 개인정보와 이용·보관 방법을 안내합니다.`}
      />
      <section className="wrap privacy-page">
        <div className="privacy-block">
          <h2>1. 수집하는 개인정보</h2>
          <p>편지(문의) 작성 시 아래 정보를 받습니다.</p>
          <ul>
            <li>이름</li>
            <li>연락처(전화번호)</li>
            <li>문의 품종(선택)</li>
            <li>문의 내용</li>
          </ul>
        </div>
        <div className="privacy-block">
          <h2>2. 수집·이용 목적</h2>
          <ul>
            <li>감귤 주문·단체·방문 상담에 대한 회신</li>
            <li>제철·재고·배송 일정 안내</li>
            <li>농장 체험(감귤 타기) 예약 관련 연락</li>
          </ul>
        </div>
        <div className="privacy-block">
          <h2>3. 보관 장소 및 기간</h2>
          <p>
            문의 내용은 웹사이트 서버(Upstash Redis)에 저장되며, 농장주 {farm.ownerTitle}{" "}
            {farm.owner}만 관리자 화면에서 확인할 수 있습니다.
          </p>
          <p>
            보관 기간은 상담·주문 처리가 끝날 때까지이며, 불필요해지면 농장주가 삭제합니다.
            삭제를 원하시면 {farm.phone} 또는{" "}
            <Link to="/contact">편지</Link>로 요청해 주세요.
          </p>
        </div>
        <div className="privacy-block">
          <h2>4. 스팸 방지</h2>
          <p>
            편지 남용을 막기 위해 IP·연락처 기준 전송 횟수를 제한합니다(1시간 5통,
            동일 연락처 하루 8통). 자동 수집을 막는 숨김 필드도 사용합니다.
          </p>
        </div>
        <div className="privacy-block">
          <h2>5. 제3자 제공</h2>
          <p>
            법령에 따른 경우를 제외하고, 수집한 개인정보를 외부에 제공하거나 판매하지
            않습니다. 온라인 결제는 네이버 스마트스토어에서 별도로 진행되며, 해당
            서비스의 개인정보 처리방침이 적용됩니다.
          </p>
        </div>
        <div className="privacy-block">
          <h2>6. 이용자 권리</h2>
          <p>
            본인의 문의 내용 열람·수정·삭제를 요청하실 수 있습니다. {farm.phone}으로
            연락해 주시면 확인 후 처리합니다.
          </p>
        </div>
        <div className="privacy-block">
          <h2>7. 문의</h2>
          <p>
            개인정보 관련 문의: {farm.name} · {farm.ownerTitle} {farm.owner} ·{" "}
            <a href={farm.phoneHref}>{farm.phone}</a>
          </p>
          <p className="privacy-note">시행일: 2026년 3월 24일</p>
        </div>
      </section>
    </>
  );
}
