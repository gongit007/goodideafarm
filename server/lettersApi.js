import fs from "node:fs";
import path from "node:path";
import { products } from "../src/data.js";

const DATA_DIR = path.resolve("data");
const DATA_FILE = path.join(DATA_DIR, "letters.json");
const ADMIN_KEY = String(process.env.ADMIN_KEY || "goodidea0706");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

function loadLetters() {
  ensureFile();
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveLetters(list) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

function itemName(id) {
  return products.find((p) => p.id === id)?.name || "제철 상담";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function isAdmin(req) {
  const key = req.headers["x-admin-key"] || "";
  return key === ADMIN_KEY;
}

function parsePath(url) {
  const clean = (url || "").split("?")[0];
  const match = clean.match(/^\/api\/letters(?:\/([^/]+))?$/);
  if (!match) return null;
  return { id: match[1] || "" };
}

export function handleLettersApi(req, res) {
  const route = parsePath(req.url);
  if (!route) return false;

  const method = req.method || "GET";

  if (method === "POST" && !route.id) {
    readBody(req)
      .then((raw) => {
        const body = raw ? JSON.parse(raw) : {};
        const name = String(body.name || "").trim();
        const phone = String(body.phone || "").trim();
        const item = String(body.item || "").trim();
        const message = String(body.message || "").trim();
        if (!name || !phone || !message) {
          send(res, 400, { ok: false, error: "이름, 연락처, 내용을 적어 주세요." });
          return;
        }
        if (name.length > 80 || phone.length > 40 || message.length > 2000) {
          send(res, 400, { ok: false, error: "내용이 너무 깁니다." });
          return;
        }
        const letter = {
          id: `ltr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          name,
          phone,
          item,
          itemName: itemName(item),
          message,
          read: false,
        };
        const list = loadLetters();
        list.unshift(letter);
        saveLetters(list);
        send(res, 201, { ok: true, id: letter.id });
      })
      .catch(() => send(res, 400, { ok: false, error: "편지를 읽지 못했습니다." }));
    return true;
  }

  if (!isAdmin(req)) {
    send(res, 401, { ok: false, error: "관리자 암호가 필요합니다." });
    return true;
  }

  if (method === "GET" && !route.id) {
    send(res, 200, { ok: true, letters: loadLetters() });
    return true;
  }

  if ((method === "PATCH" || method === "DELETE") && route.id) {
    readBody(req)
      .then((raw) => {
        const list = loadLetters();
        const index = list.findIndex((row) => row.id === route.id);
        if (index < 0) {
          send(res, 404, { ok: false, error: "편지를 찾지 못했습니다." });
          return;
        }
        if (method === "DELETE") {
          list.splice(index, 1);
          saveLetters(list);
          send(res, 200, { ok: true });
          return;
        }
        const body = raw ? JSON.parse(raw) : {};
        if (typeof body.read === "boolean") list[index].read = body.read;
        saveLetters(list);
        send(res, 200, { ok: true, letter: list[index] });
      })
      .catch(() => send(res, 400, { ok: false, error: "요청을 읽지 못했습니다." }));
    return true;
  }

  send(res, 405, { ok: false, error: "허용되지 않은 요청입니다." });
  return true;
}

export function lettersApiPlugin() {
  const middleware = (req, res, next) => {
    if (handleLettersApi(req, res)) return;
    next();
  };
  return {
    name: "farm-letters-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
