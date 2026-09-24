import { adminAuthError, isAdmin, sendJson } from "./lettersCore.js";
import { loadLetters } from "./lettersStore.js";

function groupByDay(letters) {
  const map = {};
  for (const letter of letters) {
    const day = String(letter.createdAt || "").slice(0, 10);
    if (!day) continue;
    map[day] = (map[day] || 0) + 1;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({ date, count }));
}

function groupByItem(letters) {
  const map = {};
  for (const letter of letters) {
    const name = letter.itemName || "제철 상담";
    map[name] = (map[name] || 0) + 1;
  }
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function handleGetStats(req, res) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { ok: false, error: adminAuthError(req) });
    return;
  }

  try {
    const letters = await loadLetters();
    const unread = letters.filter((row) => !row.read).length;
    const read = letters.length - unread;

    sendJson(res, 200, {
      ok: true,
      total: letters.length,
      unread,
      read,
      readRate: letters.length ? Math.round((read / letters.length) * 100) : 0,
      byItem: groupByItem(letters),
      byDay: groupByDay(letters),
      lastLetterAt: letters[0]?.createdAt || null,
    });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      sendJson(res, 503, {
        ok: false,
        error:
          "편지함 저장소가 연결되지 않았습니다. Vercel KV(Upstash Redis)를 프로젝트에 연결해 주세요.",
      });
      return;
    }
    sendJson(res, 500, { ok: false, error: "통계를 불러오지 못했습니다." });
  }
}
