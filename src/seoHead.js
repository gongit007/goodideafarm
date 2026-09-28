import { farm } from "./data";
import { seoForPath, DEFAULT_OG_IMAGE, DEFAULT_KEYWORDS } from "./seo";
import { siteUrl } from "./site";

export function headForPath(pathname) {
  const page = seoForPath(pathname);
  const url = siteUrl(page.path);
  const image = siteUrl(page.image || DEFAULT_OG_IMAGE);

  return {
    title: page.title,
    url,
    jsonLd: page.jsonLd,
    meta: [
      ["name", "description", page.description],
      ["name", "keywords", page.keywords || DEFAULT_KEYWORDS],
      ["name", "author", `${farm.name} ${farm.ownerTitle} ${farm.owner}`],
      ["name", "robots", page.robots || "index,follow,max-image-preview:large"],
      ["name", "geo.region", farm.geo.regionCode],
      ["name", "geo.placename", farm.geo.placename],
      ["name", "geo.position", `${farm.geo.latitude};${farm.geo.longitude}`],
      ["name", "ICBM", `${farm.geo.latitude}, ${farm.geo.longitude}`],
      ["property", "og:type", page.type === "product" ? "product" : "website"],
      ["property", "og:locale", "ko_KR"],
      ["property", "og:site_name", farm.name],
      ["property", "og:title", page.title],
      ["property", "og:description", page.description],
      ["property", "og:url", url],
      ["property", "og:image", image],
      ["property", "og:image:alt", page.title],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", page.title],
      ["name", "twitter:description", page.description],
      ["name", "twitter:image", image],
    ].filter(([, , content]) => content != null && content !== ""),
  };
}
