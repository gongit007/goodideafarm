import { useEffect, useState } from "react";
import { products as catalog } from "../data";
import { useBrix } from "../BrixContext.jsx";
import { PageBanner } from "../components/Ui";

const KEY_NAME = "goodidea-admin-key";

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

async function api(path, { method = "GET", key, body } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": key,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "요청에 실패했습니다.");
    error.status = res.status;
    throw error;
  }
  return data;
}

function AdminBrix({ key, onSaved }) {
  const { refresh } = useBrix();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/brix")
      .then((data) => {
        setForm({
          harvestDate: data.harvestDate || "",
          readings: catalog.reduce((acc, product) => {
            const row = data.readings?.[product.id] || {};
            acc[product.id] = {
              brix: row.brix ?? product.brix,
              brixLabel: row.brixLabel ?? product.brixLabel,
              taste: row.taste ?? product.taste,
            };
            return acc;
          }, {}),
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  function updateProduct(id, field, value) {
    setForm((prev) => ({
      ...prev,
      readings: {
        ...prev.readings,
        [id]: { ...prev.readings[id], [field]: value },
      },
    }));
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await api("/api/brix", {
        method: "PUT",
        key,
        body: form,
      });
      setMessage(`저장했습니다 · ${formatWhen(data.updatedAt)}`);
      await refresh();
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return <p className="admin-empty">{error || "당도를 불러오는 중…"}</p>;
  }

  return (
    <form className="admin-brix" onSubmit={onSave}>
      <label>
        수확·측정 메모
        <input
          value={form.harvestDate}
          onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
          placeholder="예: 2026. 9. 21"
        />
      </label>
      <ol className="admin-brix-list">
        {catalog.map((product) => {
          const row = form.readings[product.id];
          return (
            <li key={product.id}>
              <header>
                <strong>
                  {product.no} {product.name}
                </strong>
                <span>{product.season}</span>
              </header>
              <div className="admin-brix-fields">
                <label>
                  당도(숫자)
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    required
                    value={row.brix}
                    onChange={(e) => updateProduct(product.id, "brix", e.target.value)}
                  />
                </label>
                <label>
                  표시(°Bx)
                  <input
                    required
                    value={row.brixLabel}
                    onChange={(e) => updateProduct(product.id, "brixLabel", e.target.value)}
                  />
                </label>
                <label className="admin-brix-taste">
                  맛·메모
                  <input
                    value={row.taste}
                    onChange={(e) => updateProduct(product.id, "taste", e.target.value)}
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ol>
      {error && <p className="store-hint">{error}</p>}
      {message && <p className="admin-note">{message}</p>}
      <button className="ink-btn" type="submit" disabled={saving}>
        {saving ? "저장 중…" : "당도 저장"}
      </button>
    </form>
  );
}

function AdminStats({ key }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/stats", { key })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [key]);

  if (error) return <p className="store-hint">{error}</p>;
  if (!stats) return <p className="admin-empty">통계를 불러오는 중…</p>;

  const maxDay = Math.max(...stats.byDay.map((row) => row.count), 1);
  const maxItem = Math.max(...stats.byItem.map((row) => row.count), 1);

  return (
    <div className="admin-stats">
      <div className="stats-cards">
        <article>
          <strong>{stats.total}</strong>
          <span>전체 편지</span>
        </article>
        <article>
          <strong>{stats.unread}</strong>
          <span>안 읽음</span>
        </article>
        <article>
          <strong>{stats.readRate}%</strong>
          <span>읽음 비율</span>
        </article>
      </div>
      {stats.lastLetterAt && (
        <p className="admin-note">마지막 편지 · {formatWhen(stats.lastLetterAt)}</p>
      )}
      <section className="stats-panel">
        <h3>품종별 문의</h3>
        {stats.byItem.length === 0 ? (
          <p className="admin-empty">아직 데이터가 없습니다.</p>
        ) : (
          <ul className="stats-bars">
            {stats.byItem.map((row) => (
              <li key={row.name}>
                <span>{row.name}</span>
                <i style={{ width: `${(row.count / maxItem) * 100}%` }} />
                <em>{row.count}</em>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="stats-panel">
        <h3>최근 30일</h3>
        {stats.byDay.length === 0 ? (
          <p className="admin-empty">아직 데이터가 없습니다.</p>
        ) : (
          <ul className="stats-bars stats-bars--day">
            {stats.byDay.map((row) => (
              <li key={row.date}>
                <span>{row.date.slice(5)}</span>
                <i style={{ width: `${(row.count / maxDay) * 100}%` }} />
                <em>{row.count}</em>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_NAME) || "");
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState("letters");
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  async function loadLetters(nextKey = key) {
    const data = await api("/api/letters", { key: nextKey });
    setLetters(data.letters || []);
    setReady(true);
    setError("");
  }

  useEffect(() => {
    if (!key) return undefined;
    loadLetters(key).catch((err) => {
      sessionStorage.removeItem(KEY_NAME);
      setKey("");
      setReady(false);
      setError(err.message || "암호가 맞지 않습니다.");
    });
    return undefined;
  }, []);

  async function onLogin(e) {
    e.preventDefault();
    const next = draft.trim();
    try {
      await loadLetters(next);
      sessionStorage.setItem(KEY_NAME, next);
      setKey(next);
      setDraft("");
    } catch (err) {
      setError(err.message || "암호가 맞지 않습니다.");
    }
  }

  async function markRead(letter) {
    await api(`/api/letters/${letter.id}`, {
      method: "PATCH",
      key,
      body: { read: !letter.read },
    });
    await loadLetters();
  }

  async function remove(letter) {
    if (!window.confirm(`${letter.name} 님의 편지를 지우시겠습니까?`)) return;
    await api(`/api/letters/${letter.id}`, { method: "DELETE", key });
    await loadLetters();
  }

  function logout() {
    sessionStorage.removeItem(KEY_NAME);
    setKey("");
    setReady(false);
    setLetters([]);
    setTab("letters");
  }

  const unread = letters.filter((row) => !row.read).length;

  return (
    <>
      <PageBanner
        kicker="관리"
        title="농장 관리"
        desc="편지함, 당도 수확 노트, 문의 통계를 한곳에서 관리합니다."
      />
      <section className="wrap admin-desk">
        {!ready ? (
          <form className="post-form admin-login" onSubmit={onLogin}>
            <label>
              관리자 암호
              <input
                type="password"
                autoComplete="current-password"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                required
              />
            </label>
            {error && <p className="store-hint">{error}</p>}
            <button className="ink-btn" type="submit">
              관리 화면 열기
            </button>
          </form>
        ) : (
          <>
            <div className="admin-toolbar">
              <div className="admin-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "letters"}
                  className={tab === "letters" ? "is-on" : ""}
                  onClick={() => setTab("letters")}
                >
                  편지함{unread ? ` (${unread})` : ""}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "brix"}
                  className={tab === "brix" ? "is-on" : ""}
                  onClick={() => setTab("brix")}
                >
                  당도
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "stats"}
                  className={tab === "stats" ? "is-on" : ""}
                  onClick={() => setTab("stats")}
                >
                  통계
                </button>
              </div>
              <button className="ghost-btn" type="button" onClick={logout}>
                잠그기
              </button>
            </div>

            {tab === "letters" && (
              <>
                <p className="admin-note">
                  전체 {letters.length}통{unread ? ` · 새 편지 ${unread}통` : ""}
                </p>
                {letters.length === 0 ? (
                  <p className="admin-empty">아직 도착한 편지가 없습니다.</p>
                ) : (
                  <ol className="admin-letters">
                    {letters.map((letter) => (
                      <li key={letter.id} className={letter.read ? "is-read" : ""}>
                        <header>
                          <strong>{letter.name}</strong>
                          <span>{letter.itemName}</span>
                          <time dateTime={letter.createdAt}>{formatWhen(letter.createdAt)}</time>
                        </header>
                        <p>
                          <a href={`tel:${letter.phone}`}>{letter.phone}</a>
                        </p>
                        <p className="admin-body">{letter.message}</p>
                        <div className="cover-actions">
                          <button
                            className="ghost-btn"
                            type="button"
                            onClick={() => markRead(letter)}
                          >
                            {letter.read ? "안 읽음으로" : "읽음"}
                          </button>
                          <button className="ghost-btn" type="button" onClick={() => remove(letter)}>
                            지우기
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </>
            )}

            {tab === "brix" && <AdminBrix key={key} onSaved={() => {}} />}
            {tab === "stats" && <AdminStats key={key} />}
          </>
        )}
      </section>
    </>
  );
}
