import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SITE_ROUTES } from "./src/site.js";
import { lettersApiPlugin } from "./server/lettersApi.js";

function sitemapXml(origin) {
  const today = new Date().toISOString().slice(0, 10);
  const base = String(origin || "").replace(/\/$/, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITE_ROUTES.map(
    (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  ).join("\n")}
</urlset>
`;
}

function farmSeoPlugin() {
  return {
    name: "farm-seo-sitemap",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== "/sitemap.xml") return next();
        const host = req.headers.host || "localhost:5174";
        const proto = req.headers["x-forwarded-proto"] || "http";
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.end(sitemapXml(`${proto}://${host}`));
      });
    },
    closeBundle() {
      const dist = path.resolve("dist");
      if (!fs.existsSync(dist)) return;
      const origin = String(process.env.VITE_SITE_URL || "").replace(/\/$/, "");
      fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemapXml(origin));
    },
  };
}

export default defineConfig({
  plugins: [react(), farmSeoPlugin(), lettersApiPlugin()],
  server: {
    host: true,
    port: 5174,
  },
});
