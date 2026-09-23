import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { farm } from "../data";
import { seoForPath, DEFAULT_OG_IMAGE, DEFAULT_KEYWORDS } from "../seo";
import { siteUrl } from "../site";

function upsertMeta(attr, key, content) {
  if (content == null || content === "") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = seoForPath(pathname);
    const url = siteUrl(page.path);
    const image = siteUrl(page.image || DEFAULT_OG_IMAGE);

    document.title = page.title;
    document.documentElement.lang = "ko";

    upsertMeta("name", "description", page.description);
    upsertMeta("name", "keywords", page.keywords || DEFAULT_KEYWORDS);
    upsertMeta("name", "author", `${farm.name} ${farm.ownerTitle} ${farm.owner}`);
    upsertMeta("name", "robots", page.robots || "index,follow,max-image-preview:large");
    upsertMeta("name", "geo.region", farm.geo.regionCode);
    upsertMeta("name", "geo.placename", farm.geo.placename);
    upsertMeta("name", "geo.position", `${farm.geo.latitude};${farm.geo.longitude}`);
    upsertMeta("name", "ICBM", `${farm.geo.latitude}, ${farm.geo.longitude}`);
    upsertMeta("property", "og:type", page.type === "product" ? "product" : "website");
    upsertMeta("property", "og:locale", "ko_KR");
    upsertMeta("property", "og:site_name", farm.name);
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", page.title);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", url);

    let hreflang = document.head.querySelector('link[rel="alternate"][hreflang="ko"]');
    if (!hreflang) {
      hreflang = document.createElement("link");
      hreflang.setAttribute("rel", "alternate");
      hreflang.setAttribute("hreflang", "ko");
      document.head.appendChild(hreflang);
    }
    hreflang.setAttribute("href", url);

    let script = document.getElementById("jsonld-seo");
    if (!script) {
      script = document.createElement("script");
      script.id = "jsonld-seo";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(page.jsonLd);
  }, [pathname]);

  return null;
}
