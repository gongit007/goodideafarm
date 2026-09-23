import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve("data");
const DATA_FILE = path.join(DATA_DIR, "letters.json");
const KV_KEY = "goodidea:letters";

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
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

function loadLettersFromFile() {
  ensureFile();
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveLettersToFile(list) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

async function getKv() {
  const env = kvEnv();
  if (!env) throw new Error("KV_NOT_CONFIGURED");
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: env.url, token: env.token });
}

export function lettersStorageMode() {
  if (hasKv()) return "kv";
  if (process.env.VERCEL) return "missing-kv";
  return "file";
}

export async function loadLetters() {
  if (hasKv()) {
    const kv = await getKv();
    const list = await kv.get(KV_KEY);
    return Array.isArray(list) ? list : [];
  }

  if (process.env.VERCEL) {
    throw new Error("KV_NOT_CONFIGURED");
  }

  return loadLettersFromFile();
}

export async function saveLetters(list) {
  if (hasKv()) {
    const kv = await getKv();
    await kv.set(KV_KEY, list);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error("KV_NOT_CONFIGURED");
  }

  saveLettersToFile(list);
}
