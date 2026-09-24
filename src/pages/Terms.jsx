import { Link } from "react-router-dom";
import { farm } from "../data";
import { PageBanner } from "../components/Ui";

export default function Terms() {
  return (
    <>
      <PageBanner
        kicker="Terms"
        title="이용약관"
        desc={`${farm.name} 웹사이트 및 농장 서비스 이용에 관한 안내입니다.`}
      />
      <section className="wrap privacy-page">
        <div className="privacy-block">
          <h2>1. 서비스 개요</h2>
          <p>
            본 사이트는 {farm.name}({farm.address.full})의 농장 소개, 제철 감귤 안내, 편지(문의),
            체험 예약 안내를 제공합니다. 온라인 결제·배송은 네이버 스마트스토어에서 별도로
            진행됩니다.
          </p>
        </div>
        <div className="privacy-block">
          <h2>2. 주문·결제</h2>
          <ul>
            <li>택배 주문은 스마트스토어 상품 페이지의 가격·배송비·결제 수단이 적용됩니다.</li>
            <li>단체·맞춤·명절 주문은 편지 또는 전화 상담 후 별도 안내합니다.</li>
            <li>제철·작황에 따라 품종·가격·출하 일정이 달라질 수 있습니다.</li>
          </ul>
        </div>
        <div className="privacy-block">
          <h2>3. 배송·교환·환불</h2>
          <p>
            택배 상품의 배송·교환·환불은 스마트스토어 판매자 정책과 전자상거래법을 따릅니다.
            산지에서 선별·포장한 뒤 출고하며, 신선식품 특성상 단순 변심 반품이 제한될 수
            있습니다.
          </p>
          <p>
            파손·오배송 등 하자가 있으면 수령 후 가능한 빨리{" "}
            <a href={farm.phoneHref}>{farm.phone}</a> 또는 <Link to="/contact">편지</Link>로
            알려 주세요.
          </p>
        </div>
        <div className="privacy-block">
          <h2>4. 농장 방문·체험</h2>
          <ul>
            <li>직판·감귤 따기는 사전 연락 후 방문해 주세요.</li>
            <li>기상·밭 상황에 따라 안내 장소나 일정이 바뀔 수 있습니다.</li>
            <li>밭 내 안전 수칙을 지켜 주시고, 아이 동반 시 보호자의 관리가 필요합니다.</li>
          </ul>
        </div>
        <div className="privacy-block">
          <h2>5. 저작권</h2>
          <p>
            사이트의 문구·사진·디자인은 {farm.name} 또는 표기된 출처에 귀속됩니다. 무단
            복제·배포를 금합니다. 사진 출처는 <Link to="/credits">사진 출처</Link> 페이지를
            참고해 주세요.
          </p>
        </div>
        <div className="privacy-block">
          <h2>6. 면책</h2>
          <p>
            당도·수확 노트는 당일 측정 기준이며, 자연 조건에 따라 실제 체감과 차이가 있을 수
            있습니다. 사이트 정보는 예고 없이 변경될 수 있습니다.
          </p>
        </div>
        <div className="privacy-block">
          <h2>7. 문의</h2>
          <p>
            {farm.name} · {farm.ownerTitle} {farm.owner} ·{" "}
            <a href={farm.phoneHref}>{farm.phone}</a>
          </p>
          <p className="privacy-note">
            시행일: 2026년 3월 24일 ·{" "}
            <Link to="/privacy">개인정보 처리방침</Link>
          </p>
        </div>
      </section>
    </>
  );
}
