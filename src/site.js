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

export function siteOrigin() {
  const env = String(import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
  if (env) return env;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}

export function siteUrl(path = "/") {
  const origin = siteOrigin();
  const clean = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${clean}` : clean;
}
