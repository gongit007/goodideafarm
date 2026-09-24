import { handleGetBrix, handlePutBrix } from "../../server/brixHandlers.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await handleGetBrix(req, res);
    return;
  }

  if (req.method === "PUT") {
    await handlePutBrix(req, res);
    return;
  }

  res.statusCode = 405;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "허용되지 않은 요청입니다." }));
}
