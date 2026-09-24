import { farm } from "../data";

export default function BusinessInfo({ compact = false }) {
  const b = farm.business;
  const rows = [
    b.registrationNumber && { label: "사업자등록번호", value: b.registrationNumber },
    b.mailOrderNumber && { label: "통신판매업", value: b.mailOrderNumber },
    { label: "대표", value: b.representative },
    { label: "주소", value: farm.address.full },
    b.email && { label: "이메일", value: b.email, href: `mailto:${b.email}` },
    { label: "전화", value: farm.phone, href: farm.phoneHref },
  ].filter(Boolean);

  return (
    <div className={`business-info ${compact ? "is-compact" : ""}`}>
      {!compact && <h2>사업자 정보</h2>}
      <dl>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              {row.href ? (
                <a href={row.href}>{row.value}</a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
