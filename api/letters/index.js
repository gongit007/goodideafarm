import {
  handleCreateLetter,
  handleListLetters,
} from "../../server/lettersHandlers.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await handleCreateLetter(req, res);
    return;
  }

  if (req.method === "GET") {
    await handleListLetters(req, res);
    return;
  }

  res.statusCode = 405;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "허용되지 않은 요청입니다." }));
}
