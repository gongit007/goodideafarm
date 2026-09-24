import { products } from "../src/data.js";

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

export function isAdmin(req) {
  const key = getAdminKey();
  if (!key) return false;
  const provided = readAdminHeader(req);
  if (!provided) return false;
  return provided === key;
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
    req.on("data", (chunk) => chunks.push(chunk));
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
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const item = String(body.item || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !phone || !message) {
    return { error: "이름, 연락처, 내용을 적어 주세요." };
  }
  if (name.length > 80 || phone.length > 40 || message.length > 2000) {
    return { error: "내용이 너무 깁니다." };
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
