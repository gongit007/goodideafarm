import { farm } from "../src/data.js";
import { siteUrl } from "../src/site.js";

function notifyEmail() {
  return String(process.env.NOTIFY_EMAIL || farm.notifyEmail || "").trim();
}

export async function notifyNewLetter(letter) {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const to = notifyEmail();
  if (!apiKey || !to) return { skipped: true };

  const subject = `[${farm.name}] ${letter.name} 님 편지`;
  const text = [
    `${farm.name}에 새 편지가 도착했습니다.`,
    "",
    `이름: ${letter.name}`,
    `연락처: ${letter.phone}`,
    `품종: ${letter.itemName}`,
    "",
    letter.message,
    "",
    `관리: ${siteUrl("/admin")}`,
  ].join("\n");

  const from = String(process.env.RESEND_FROM || "Good Idea Farm <onboarding@resend.dev>").trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend failed: ${res.status} ${detail}`);
  }

  return { ok: true };
}
