import { getKv, hasKv } from "./kv.js";

const ADMIN_FAIL_LIMIT = 5;
const ADMIN_FAIL_WINDOW_SECONDS = 600;

async function bump(key, ttlSeconds) {
  const kv = await getKv();
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, ttlSeconds);
  return count;
}

function firstHeader(req, name) {
  const raw = req.headers[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return String(value || "").split(",")[0].trim();
}

// Vercel overwrites x-real-ip / x-vercel-forwarded-for, so clients cannot spoof them.
export function clientIp(req) {
  return (
    firstHeader(req, "x-real-ip") ||
    firstHeader(req, "x-vercel-forwarded-for") ||
    firstHeader(req, "x-forwarded-for") ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export async function checkLetterRateLimit(req, phone) {
  if (!hasKv()) return null;

  const ip = clientIp(req);
  const ipCount = await bump(`ratelimit:letter:ip:${ip}`, 3600);
  if (ipCount > 10) {
    return "편지는 1시간에 10통까지 보낼 수 있습니다. 약 1시간 후 다시 시도하거나 전화로 문의해 주세요.";
  }

  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length >= 9) {
    const phoneCount = await bump(`ratelimit:letter:phone:${digits}`, 86400);
    if (phoneCount > 12) {
      return "같은 연락처로는 하루 12통까지 보낼 수 있습니다. 전화로 문의해 주세요.";
    }
  }

  return null;
}

function adminFailKey(req) {
  return `ratelimit:admin:fail:${clientIp(req)}`;
}

export async function isAdminLocked(req) {
  if (!hasKv()) return false;
  const kv = await getKv();
  const count = Number(await kv.get(adminFailKey(req))) || 0;
  return count >= ADMIN_FAIL_LIMIT;
}

export async function recordAdminFailure(req) {
  if (!hasKv()) return;
  await bump(adminFailKey(req), ADMIN_FAIL_WINDOW_SECONDS);
}

export async function clearAdminFailures(req) {
  if (!hasKv()) return;
  const kv = await getKv();
  await kv.del(adminFailKey(req));
}

export const ADMIN_LOCK_MESSAGE = `암호를 ${ADMIN_FAIL_LIMIT}번 틀려 ${
  ADMIN_FAIL_WINDOW_SECONDS / 60
}분 동안 잠겼습니다. 잠시 후 다시 시도해 주세요.`;
