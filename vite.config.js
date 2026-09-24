import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SITE_ROUTES } from "./src/site.js";
import { farmApiPlugin } from "./server/farmApi.js";

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

function siteOriginFromEnv() {
  return String(process.env.VITE_SITE_URL || "").replace(/\/$/, "");
}

function withAbsoluteSiteUrls(html, origin) {
  if (!origin) return html;
  return html
    .replace(/(<link rel="canonical" href=")\/(")/, `$1${origin}/$2`)
    .replace(/(<link rel="alternate" hreflang="ko" href=")\/(")/, `$1${origin}/$2`)
    .replace(/(<meta property="og:image" content=")\//g, `$1${origin}/`)
    .replace(/(<meta name="twitter:image" content=")\//g, `$1${origin}/`);
}

function imageOptimizePlugin() {
  return {
    name: "farm-image-optimize",
    async closeBundle() {
      const distImages = path.resolve("dist/images");
      if (!fs.existsSync(distImages)) return;
      let sharp;
      try {
        sharp = (await import("sharp")).default;
      } catch {
        return;
      }
      const files = fs.readdirSync(distImages).filter((file) => /\.jpe?g$/i.test(file));
      for (const file of files) {
        const input = path.join(distImages, file);
        const webp = path.join(distImages, file.replace(/\.jpe?g$/i, ".webp"));
        await sharp(input).webp({ quality: 82 }).toFile(webp);
      }
    },
  };
}

function farmSeoPlugin() {
  return {
    name: "farm-seo-sitemap",
    transformIndexHtml(html) {
      return withAbsoluteSiteUrls(html, siteOriginFromEnv());
    },
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
      const origin = siteOriginFromEnv();
      fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemapXml(origin));
      if (origin) {
        const robotsPath = path.join(dist, "robots.txt");
        if (fs.existsSync(robotsPath)) {
          const robots = fs
            .readFileSync(robotsPath, "utf8")
            .replace(/^Sitemap: \/sitemap\.xml$/m, `Sitemap: ${origin}/sitemap.xml`);
          fs.writeFileSync(robotsPath, robots);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), farmSeoPlugin(), imageOptimizePlugin(), farmApiPlugin()],
  server: {
    host: true,
    port: 5174,
  },
});
