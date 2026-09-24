import { lettersStorageMode } from "./lettersStore.js";

async function getKv() {
  const { createClient } = await import("@vercel/kv");
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return createClient({ url, token });
}

async function bump(key, ttlSeconds) {
  const kv = await getKv();
  if (!kv) return 0;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, ttlSeconds);
  return count;
}

export function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

export async function checkLetterRateLimit(req, phone) {
  if (lettersStorageMode() !== "kv") return null;

  const ip = clientIp(req);
  const ipCount = await bump(`ratelimit:letter:ip:${ip}`, 3600);
  if (ipCount > 5) {
    return "편지는 1시간에 5통까지 보낼 수 있습니다. 잠시 후 다시 시도해 주세요.";
  }

  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length >= 9) {
    const phoneCount = await bump(`ratelimit:letter:phone:${digits}`, 86400);
    if (phoneCount > 8) {
      return "같은 연락처로는 하루 8통까지 보낼 수 있습니다. 전화로 문의해 주세요.";
    }
  }

  return null;
}
