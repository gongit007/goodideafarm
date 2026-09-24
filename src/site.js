export const SITE_ROUTES = [
  "/",
  "/farm",
  "/shop",
  "/shop/geukjosaeng",
  "/shop/josaeng",
  "/shop/bigarim",
  "/shop/redhyang",
  "/buy",
  "/brix",
  "/experience",
  "/contact",
  "/privacy",
  "/terms",
  "/credits",
];

function readSiteUrlEnv() {
  const fromVite =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_SITE_URL
      : "";
  if (fromVite) return String(fromVite);
  if (typeof process !== "undefined" && process.env.VITE_SITE_URL) {
    return String(process.env.VITE_SITE_URL);
  }
  return "";
}

export function siteOrigin() {
  const env = readSiteUrlEnv().replace(/\/$/, "");
  if (env) return env;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}

export function siteUrl(path = "/") {
  const origin = siteOrigin();
  const clean = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${clean}` : clean;
}
