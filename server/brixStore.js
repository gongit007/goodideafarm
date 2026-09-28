import fs from "node:fs";
import path from "node:path";
import { getKv, hasKv, storageMode } from "./kv.js";

const DATA_DIR = path.resolve("data");
const DATA_FILE = path.join(DATA_DIR, "brix.json");
const KV_KEY = "goodidea:brix";

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function brixStorageMode() {
  return storageMode();
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
