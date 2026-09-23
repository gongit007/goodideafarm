import {
  handleDeleteLetter,
  handlePatchLetter,
} from "../../server/lettersHandlers.js";

export default async function handler(req, res) {
  const id = String(req.query.id || "");

  if (req.method === "PATCH") {
    await handlePatchLetter(req, res, id);
    return;
  }

  if (req.method === "DELETE") {
    await handleDeleteLetter(req, res, id);
    return;
  }

  res.statusCode = 405;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "허용되지 않은 요청입니다." }));
}
