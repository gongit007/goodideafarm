import { products } from "../src/data.js";
import {
  adminAuthError,
  isAdmin,
  readJsonBody,
  sendJson,
} from "./lettersCore.js";
import { loadBrix, saveBrix } from "./brixStore.js";

export function defaultBrixReadings() {
  const readings = {};
  for (const product of products) {
    readings[product.id] = {
      brix: product.brix,
      brixLabel: product.brixLabel,
      taste: product.taste,
    };
  }
  return readings;
}

function normalizePayload(stored) {
  if (!stored) {
    return {
      updatedAt: null,
      harvestDate: "",
      readings: defaultBrixReadings(),
    };
  }

  const readings = { ...defaultBrixReadings(), ...(stored.readings || {}) };
  return {
    updatedAt: stored.updatedAt || null,
    harvestDate: stored.harvestDate || "",
    readings,
  };
}

function storageError(res) {
  sendJson(res, 503, {
    ok: false,
    error:
      "당도 저장소가 연결되지 않았습니다. Vercel KV(Upstash Redis)를 프로젝트에 연결해 주세요.",
  });
}

export async function handleGetBrix(_req, res) {
  try {
    const stored = await loadBrix();
    sendJson(res, 200, { ok: true, ...normalizePayload(stored) });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      storageError(res);
      return;
    }
    sendJson(res, 500, { ok: false, error: "당도를 불러오지 못했습니다." });
  }
}

export async function handlePutBrix(req, res) {
  if (!isAdmin(req)) {
    sendJson(res, 401, { ok: false, error: adminAuthError(req) });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const readings = {};

    for (const product of products) {
      const row = body.readings?.[product.id] || {};
      const brix = Number(row.brix);
      const brixLabel = String(row.brixLabel ?? "").trim() || product.brixLabel;
      const taste = String(row.taste ?? product.taste).trim().slice(0, 200);

      if (!Number.isFinite(brix) || brix < 0 || brix > 20) {
        sendJson(res, 400, {
          ok: false,
          error: `${product.name} 당도(0–20)를 확인해 주세요.`,
        });
        return;
      }

      readings[product.id] = { brix, brixLabel, taste };
    }

    const payload = {
      updatedAt: new Date().toISOString(),
      harvestDate: String(body.harvestDate ?? "").trim().slice(0, 40),
      readings,
    };

    await saveBrix(payload);
    sendJson(res, 200, { ok: true, ...payload });
  } catch (error) {
    if (error.message === "KV_NOT_CONFIGURED") {
      storageError(res);
      return;
    }
    sendJson(res, 400, { ok: false, error: "당도를 저장하지 못했습니다." });
  }
}
