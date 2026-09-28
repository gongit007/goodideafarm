import fs from "node:fs";
import path from "node:path";
import { getKv, hasKv, storageMode } from "./kv.js";

const DATA_DIR = path.resolve("data");
const DATA_FILE = path.join(DATA_DIR, "letters.json");
const LEGACY_KV_KEY = "goodidea:letters";
const KV_HASH = "goodidea:letters:v2";

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

function loadFile() {
  ensureFile();
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveFile(list) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

function assertStorage() {
  if (!hasKv() && process.env.VERCEL) throw new Error("KV_NOT_CONFIGURED");
}

function parseRow(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function sortNewestFirst(list) {
  return list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

let migrated = false;

async function kvReady() {
  const kv = await getKv();
  if (migrated) return kv;
  const legacy = await kv.get(LEGACY_KV_KEY);
  if (Array.isArray(legacy) && legacy.length) {
    const fields = {};
    for (const letter of legacy) {
      if (letter?.id) fields[letter.id] = JSON.stringify(letter);
    }
    if (Object.keys(fields).length) await kv.hset(KV_HASH, fields);
  }
  if (legacy != null) await kv.del(LEGACY_KV_KEY);
  migrated = true;
  return kv;
}

export function lettersStorageMode() {
  return storageMode();
}

export async function loadLetters() {
  assertStorage();
  if (!hasKv()) return loadFile();
  const kv = await kvReady();
  const all = (await kv.hgetall(KV_HASH)) || {};
  return sortNewestFirst(Object.values(all).map(parseRow).filter(Boolean));
}

export async function addLetter(letter) {
  assertStorage();
  if (!hasKv()) {
    const list = loadFile();
    list.unshift(letter);
    saveFile(list);
    return;
  }
  const kv = await kvReady();
  await kv.hset(KV_HASH, { [letter.id]: JSON.stringify(letter) });
}

export async function setLetterRead(id, read) {
  assertStorage();
  if (!hasKv()) {
    const list = loadFile();
    const letter = list.find((row) => row.id === id);
    if (!letter) return null;
    letter.read = read;
    saveFile(list);
    return letter;
  }
  const kv = await kvReady();
  const letter = parseRow(await kv.hget(KV_HASH, id));
  if (!letter) return null;
  letter.read = read;
  await kv.hset(KV_HASH, { [id]: JSON.stringify(letter) });
  return letter;
}

export async function deleteLetter(id) {
  assertStorage();
  if (!hasKv()) {
    const list = loadFile();
    const next = list.filter((row) => row.id !== id);
    if (next.length === list.length) return false;
    saveFile(next);
    return true;
  }
  const kv = await kvReady();
  return (await kv.hdel(KV_HASH, id)) > 0;
}
