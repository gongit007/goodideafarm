import { createHash, timingSafeEqual } from "node:crypto";
import { products } from "../src/data.js";
import {
  ADMIN_LOCK_MESSAGE,
  clearAdminFailures,
  isAdminLocked,
  recordAdminFailure,
} from "./rateLimit.js";

const MAX_BODY_BYTES = 32 * 1024;

function resolveAdminKey() {
  const configured = String(process.env.ADMIN_KEY || "").trim();
  if (configured) return configured;
  if (process.env.VERCEL) return "";
  return "goodidea0706";
}

export function getAdminKey() {
  return resolveAdminKey();
}

export function itemName(id) {
  return products.find((p) => p.id === id)?.name || "제철 상담";
}

function readAdminHeader(req) {
  const raw =
    req.headers["x-admin-key"] ||
    req.headers["X-Admin-Key"] ||
    req.headers["X-ADMIN-KEY"] ||
    "";
  return String(Array.isArray(raw) ? raw[0] : raw).trim();
}

function digest(value) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function isAdmin(req) {
  const key = getAdminKey();
  if (!key) return false;
  const provided = readAdminHeader(req);
  if (!provided) return false;
  return timingSafeEqual(digest(provided), digest(key));
}

export async function requireAdmin(req, res) {
  try {
    if (await isAdminLocked(req)) {
      sendJson(res, 429, { ok: false, error: ADMIN_LOCK_MESSAGE });
      return false;
    }
    if (isAdmin(req)) {
      await clearAdminFailures(req);
      return true;
    }
    if (getAdminKey() && readAdminHeader(req)) {
      await recordAdminFailure(req);
    }
  } catch (err) {
    console.error("[admin-auth]", err?.message || err);
    if (isAdmin(req)) return true;
  }
  sendJson(res, 401, { ok: false, error: adminAuthError(req) });
  return false;
}

export function adminAuthError(req) {
  const key = getAdminKey();
  if (!key) {
    return "관리자 암호가 서버에 설정되지 않았습니다. Vercel ADMIN_KEY를 확인해 주세요.";
  }
  if (!readAdminHeader(req)) {
    return "관리자 암호를 입력해 주세요.";
  }
  return "암호가 맞지 않습니다.";
}

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return null;
}

export function readJsonBody(req) {
  const parsed = parseJsonBody(req);
  if (parsed) return Promise.resolve(parsed);

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("BODY_TOO_LARGE"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

export function buildLetter(body) {
  const honeypot = String(body.website || body._hp || "").trim();
  if (honeypot) {
    return { spam: true };
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  let item = String(body.item || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !phone || !message) {
    return { error: "이름, 연락처, 내용을 적어 주세요." };
  }
  if (name.length > 80 || phone.length > 40 || message.length > 2000) {
    return { error: "내용이 너무 깁니다." };
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^[0-9+\-\s().]+$/.test(phone) || phoneDigits.length < 9 || phoneDigits.length > 15) {
    return { error: "연락처는 숫자와 하이픈(-)으로 적어 주세요. 예: 010-1234-5678" };
  }
  if (!products.some((p) => p.id === item)) {
    item = "";
  }

  return {
    letter: {
      id: `ltr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      item,
      itemName: itemName(item),
      message,
      read: false,
    },
  };
}
