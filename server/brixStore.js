import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("data");
const DATA_FILE = path.join(DATA_DIR, "brix.json");
const KV_KEY = "goodidea:brix";

function kvEnv() {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

function hasKv() {
  return Boolean(kvEnv());
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function getKv() {
  const env = kvEnv();
  if (!env) throw new Error("KV_NOT_CONFIGURED");
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: env.url, token: env.token });
}

export function brixStorageMode() {
  if (hasKv()) return "kv";
  if (process.env.VERCEL) return "missing-kv";
  return "file";
}

export async function loadBrix() {
  if (hasKv()) {
    const kv = await getKv();
    const data = await kv.get(KV_KEY);
    return data && typeof data === "object" ? data : null;
  }

  if (process.env.VERCEL) {
    throw new Error("KV_NOT_CONFIGURED");
  }

  ensureFile();
  if (!fs.existsSync(DATA_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export async function saveBrix(data) {
  if (hasKv()) {
    const kv = await getKv();
    await kv.set(KV_KEY, data);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error("KV_NOT_CONFIGURED");
  }

  ensureFile();
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
