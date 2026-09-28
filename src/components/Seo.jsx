import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { headForPath } from "../seoHead";

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    document.head.appendChild(el);
  }
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const head = headForPath(pathname);

    document.title = head.title;
    document.documentElement.lang = "ko";
    for (const [attr, key, content] of head.meta) upsertMeta(attr, key, content);
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: head.url });
    upsertLink('link[rel="alternate"][hreflang="ko"]', {
      rel: "alternate",
      hreflang: "ko",
      href: head.url,
    });

    let script = document.getElementById("jsonld-seo");
    if (!script) {
      script = document.createElement("script");
      script.id = "jsonld-seo";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(head.jsonLd);
  }, [pathname]);

  return null;
}
