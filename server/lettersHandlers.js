import { buildLetter, readJsonBody, requireAdmin, sendJson } from "./lettersCore.js";
import { notifyNewLetter } from "./letterNotify.js";
import { checkLetterRateLimit } from "./rateLimit.js";
import { addLetter, deleteLetter, loadLetters, setLetterRead } from "./lettersStore.js";

function storageError(res) {
  sendJson(res, 503, {
    ok: false,
    error:
      "편지함 저장소가 연결되지 않았습니다. Vercel KV(Upstash Redis)를 프로젝트에 연결해 주세요.",
  });
}

export async function handleCreateLetter(req, res) {
  try {
    const body = await readJsonBody(req);
    const built = buildLetter(body);
    if (built.spam) {
      sendJson(res, 201, { ok: true, id: "ltr_spam" });
      return;
    }
    if (built.error) {
      sendJson(res, 400, { ok: false, error: built.error });
      return;
    }

    const limited = await checkLetterRateLimit(req, built.letter.phone);
    if (limited) {
      sendJson(res, 429, { ok: false, error: limited });
      return;
    }

    await addLetter(built.letter);
    try {
      await notifyNewLetter(built.letter);
    } catch (err) {
      console.error("[letter-notify]", err?.message || err);
    }
    sendJson(res, 201, { ok: true, id: built.letter.id });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      storageError(res);
      return;
    }
    sendJson(res, 400, { ok: false, error: "편지를 읽지 못했습니다." });
  }
}

export async function handleListLetters(req, res) {
  if (!(await requireAdmin(req, res))) return;

  try {
    const letters = await loadLetters();
    sendJson(res, 200, { ok: true, letters });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      storageError(res);
      return;
    }
    sendJson(res, 500, { ok: false, error: "편지함을 열지 못했습니다." });
  }
}

export async function handlePatchLetter(req, res, id) {
  if (!(await requireAdmin(req, res))) return;

  try {
    const body = await readJsonBody(req);
    if (typeof body.read !== "boolean") {
      sendJson(res, 400, { ok: false, error: "요청을 읽지 못했습니다." });
      return;
    }
    const letter = await setLetterRead(id, body.read);
    if (!letter) {
      sendJson(res, 404, { ok: false, error: "편지를 찾지 못했습니다." });
      return;
    }
    sendJson(res, 200, { ok: true, letter });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      storageError(res);
      return;
    }
    sendJson(res, 400, { ok: false, error: "요청을 읽지 못했습니다." });
  }
}

export async function handleDeleteLetter(req, res, id) {
  if (!(await requireAdmin(req, res))) return;

  try {
    if (!(await deleteLetter(id))) {
      sendJson(res, 404, { ok: false, error: "편지를 찾지 못했습니다." });
      return;
    }
    sendJson(res, 200, { ok: true });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      storageError(res);
      return;
    }
    sendJson(res, 500, { ok: false, error: "편지를 지우지 못했습니다." });
  }
}
