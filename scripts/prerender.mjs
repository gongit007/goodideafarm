import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SITE_ROUTES } from "../src/site.js";

const DIST = path.resolve("dist");
const SERVER_DIR = path.resolve("dist-server");
const NOT_FOUND_PROBE = "/__not-found__";

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsert(html, pattern, tag) {
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function applyHead(template, head) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(head.title)}</title>`);

  for (const [attr, key, content] of head.meta) {
    const pattern = new RegExp(`<meta\\s+${attr}="${escapeRe(key)}"\\s+content="[^"]*"\\s*/?>`);
    html = upsert(html, pattern, `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`);
  }

  html = upsert(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(head.url)}" />`
  );
  html = upsert(
    html,
    /<link rel="alternate" hreflang="ko" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="ko" href="${escapeAttr(head.url)}" />`
  );

  const jsonLd = JSON.stringify(head.jsonLd).replace(/</g, "\\u003c");
  html = html.replace(
    /(<script type="application\/ld\+json" id="jsonld-seo">)[\s\S]*?(<\/script>)/,
    `$1${jsonLd}$2`
  );
  return html;
}

function outFile(route) {
  if (route === "/") return path.join(DIST, "index.html");
  return path.join(DIST, `${route.replace(/^\//, "")}.html`);
}

async function main() {
  const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("dist/index.html has no empty #root to fill");
  }

  const { render, headForPath } = await import(
    pathToFileURL(path.join(SERVER_DIR, "entry-server.js")).href
  );

  const pages = [...SITE_ROUTES, "/admin"].map((route) => ({ route, file: outFile(route) }));
  pages.push({ route: NOT_FOUND_PROBE, file: path.join(DIST, "404.html") });

  for (const { route, file } of pages) {
    const body = render(route);
    const html = applyHead(template, headForPath(route)).replace(
      '<div id="root"></div>',
      `<div id="root">${body}</div>`
    );
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }

  fs.rmSync(SERVER_DIR, { recursive: true, force: true });
  console.log(`prerendered ${pages.length} pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
