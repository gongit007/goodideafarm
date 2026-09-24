import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { farm, products } from "../data";
import { PageBanner } from "../components/Ui";
import BusinessInfo from "../components/BusinessInfo.jsx";

export default function Contact() {
  const [params] = useSearchParams();
  const preset = params.get("item") || "";
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    item: preset,
    message: "",
  });

  const itemName = useMemo(
    () => products.find((p) => p.id === form.item)?.name || "제철 상담",
    [form.item]
  );

  async function onSubmit(e) {
    e.preventDefault();
    if (!consent) {
      setError("개인정보 수집·이용에 동의해 주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "편지를 저장하지 못했습니다.");
      setSent(true);
    } catch (err) {
      setError(err.message || "편지를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageBanner
        kicker="편지"
        title="농장주에게 남기는 말"
        desc="품종과 무게를 적어 보내 주세요. 편지는 농장 편지함에 저장됩니다. 전화로도 받습니다."
      />
      <section className="postcard wrap">
        <form className="post-form" onSubmit={onSubmit}>
          {sent ? (
            <div className="post-done">
              <p>잘 받았습니다.</p>
              <p>
                {form.name || "손님"} 님의 {itemName} 편지를 저장했습니다. 농장주가 편지함에서 확인한
                뒤 연락드립니다. 급하시면 바로 전화해 주세요.
              </p>
              <a className="ink-btn" href={farm.phoneHref}>
                {farm.phone}
              </a>
            </div>
          ) : (
            <>
              <label className="hp-field" aria-hidden="true">
                웹사이트
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
              <label>
                이름
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                연락처
                <input
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="010-0000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                품종
                <select
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                >
                  <option value="">제철 상담</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.no} {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                내용
                <textarea
                  rows="5"
                  required
                  placeholder="무게, 배송지, 방문 날짜를 적어 주세요."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  <Link to="/privacy">개인정보 처리방침</Link>에 동의합니다. (필수)
                </span>
              </label>
              {error && <p className="store-hint">{error}</p>}
              <button className="ink-btn" type="submit" disabled={saving || !consent}>
                {saving ? "보내는 중…" : "편지 보내기"}
              </button>
            </>
          )}
        </form>
        <aside className="post-side">
          <p className="eyebrow">To.</p>
          <h2>
            {farm.ownerTitle} {farm.owner}
          </h2>
          <p>{farm.name}</p>
          <p>{farm.phone}</p>
          <p>{farm.hours}</p>
          <p>{farm.address.full}</p>
          <p>{farm.address.note}</p>
        </aside>
      </section>
      <section className="wrap contact-business">
        <BusinessInfo />
      </section>
    </>
  );
}
