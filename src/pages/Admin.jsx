import { useEffect, useState } from "react";
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

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_NAME) || "");
  const [draft, setDraft] = useState("");
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  async function load(nextKey = key) {
    const data = await api("/api/letters", { key: nextKey });
    setLetters(data.letters || []);
    setReady(true);
    setError("");
  }

  useEffect(() => {
    if (!key) return undefined;
    load(key).catch((err) => {
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
      await load(next);
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
    await load();
  }

  async function remove(letter) {
    if (!window.confirm(`${letter.name} 님의 편지를 지우시겠습니까?`)) return;
    await api(`/api/letters/${letter.id}`, { method: "DELETE", key });
    await load();
  }

  function logout() {
    sessionStorage.removeItem(KEY_NAME);
    setKey("");
    setReady(false);
    setLetters([]);
  }

  const unread = letters.filter((row) => !row.read).length;

  return (
    <>
      <PageBanner
        kicker="관리"
        title="편지함"
        desc="손님이 남긴 편지를 여기서 읽고, 읽음 표시하거나 지울 수 있습니다."
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
              편지함 열기
            </button>
          </form>
        ) : (
          <>
            <div className="admin-toolbar">
              <p>
                전체 {letters.length}통
                {unread ? ` · 새 편지 ${unread}통` : ""}
              </p>
              <button className="ghost-btn" type="button" onClick={logout}>
                잠그기
              </button>
            </div>
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
                      <button className="ghost-btn" type="button" onClick={() => markRead(letter)}>
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
      </section>
    </>
  );
}
