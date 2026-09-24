import { farm, products, faqs } from "./data";
import { siteUrl } from "./site";

export const DEFAULT_OG_IMAGE = "/images/farm-03.jpg";
export const DEFAULT_KEYWORDS = farm.keywords;

const TITLE_END = farm.name;

export function pageTitle(lead) {
  return lead === TITLE_END ? `${lead} | 제주 감귤 산지직송` : `${lead} | ${TITLE_END}`;
}

export function farmJsonLd() {
  return {
    "@type": ["Farm", "LocalBusiness", "Store"],
    "@id": `${siteUrl("/")}#farm`,
    name: farm.name,
    alternateName: [farm.english, "좋은생각 귤", "제주 좋은생각 귤농수산"],
    description: farm.description,
    slogan: farm.slogan,
    url: siteUrl("/"),
    image: [siteUrl(DEFAULT_OG_IMAGE), siteUrl("/images/farm-01.jpg"), siteUrl("/images/brand-farmer.jpg")],
    telephone: farm.phoneIntl,
    founder: {
      "@type": "Person",
      name: farm.owner,
      jobTitle: farm.ownerTitle,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "제주특별자치도",
      addressLocality: "애월읍",
      addressCountry: farm.geo.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: farm.geo.latitude,
      longitude: farm.geo.longitude,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: farm.region },
      { "@type": "Country", name: "대한민국" },
    ],
    knowsAbout: ["제주 감귤", "극조생", "조생", "비가림하우스", "레드향", "산지직송"],
    sameAs: [farm.smartStoreUrl],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      name: `${p.name} 제주 감귤`,
      url: siteUrl(`/shop/${p.id}`),
      priceCurrency: "KRW",
      price: String(p.price),
      availability: "https://schema.org/InStock",
    })),
  };
}

function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl("/")}#website`,
    name: farm.name,
    url: siteUrl("/"),
    inLanguage: "ko-KR",
    publisher: { "@id": `${siteUrl("/")}#farm` },
  };
}

function breadcrumbJsonLd(crumbs) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: siteUrl(c.path),
    })),
  };
}

function faqJsonLd() {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function productJsonLd(product) {
  return {
    "@type": "Product",
    name: `${product.name} 제주 감귤`,
    alternateName: product.hanja,
    description: product.description,
    image: siteUrl(product.image),
    brand: { "@type": "Brand", name: farm.name },
    category: "제주 감귤",
    countryOfOrigin: { "@type": "Country", name: "대한민국" },
    offers: {
      "@type": "Offer",
      url: siteUrl(`/buy`),
      priceCurrency: "KRW",
      price: String(product.price),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${siteUrl("/")}#farm` },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "당도", value: `${product.brixLabel} °Bx` },
      { "@type": "PropertyValue", name: "제철", value: product.season },
      { "@type": "PropertyValue", name: "중량", value: product.weight },
    ],
  };
}

function graph(nodes) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

const pages = {
  "/": {
    title: pageTitle(farm.name),
    description: farm.description,
    path: "/",
    keywords: farm.keywords,
    crumbs: [{ name: "홈", path: "/" }],
  },
  "/farm": {
    title: pageTitle("제주 감귤 농장 이야기"),
    description:
      "제주 좋은생각 귤농수산 이야기. 농장주 전홍구가 극조생부터 레드향까지 제철에만 수확하는 감귤 농장입니다.",
    path: "/farm",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "농장이야기", path: "/farm" },
    ],
  },
  "/shop": {
    title: pageTitle("제철 제주 감귤"),
    description:
      "극조생, 조생, 비가림하우스, 레드향. 제주 좋은생각 귤농수산의 제철 감귤을 품종별로 소개합니다.",
    path: "/shop",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "제철품종", path: "/shop" },
    ],
  },
  "/buy": {
    title: pageTitle("제주 감귤 구매"),
    description:
      "좋은생각 귤농수산 제주 감귤 구매. 결제는 네이버 스마트스토어에서 이어지며, 산지에서 선별 후 택배 출고합니다.",
    path: "/buy",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "구매", path: "/buy" },
    ],
  },
  "/brix": {
    title: pageTitle("감귤 당도 수확 노트"),
    description:
      "제주 좋은생각 귤농수산 수확 노트. 농장주 전홍구가 매일 아침 극조생·조생·비가림·레드향 당도를 측정합니다.",
    path: "/brix",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "수확 노트", path: "/brix" },
    ],
  },
  "/experience": {
    title: pageTitle("제주 감귤 따기 체험"),
    description:
      "좋은생각 귤농수산 밭 걷기·귤 따기 체험. 입장료 없이 수확한 무게만큼 계산합니다. 제철 10월부터 2월.",
    path: "/experience",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "감귤타기", path: "/experience" },
    ],
  },
  "/contact": {
    title: pageTitle("단체·맞춤 주문 문의"),
    description: `제주 감귤 단체·명절 맞춤 주문은 편지나 전화 ${farm.phone}으로 받습니다. 농장주 전홍구.`,
    path: "/contact",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "편지", path: "/contact" },
    ],
  },
  "/admin": {
    title: pageTitle("편지함"),
    description: "좋은생각 귤농수산 관리자 편지함.",
    path: "/admin",
    robots: "noindex,nofollow",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "관리", path: "/admin" },
    ],
  },
  "/credits": {
    title: pageTitle("사진 출처"),
    description: "좋은생각 귤농수산 웹사이트 이미지 저작·라이선스 표기.",
    path: "/credits",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "사진 출처", path: "/credits" },
    ],
  },
  "/privacy": {
    title: pageTitle("개인정보 처리방침"),
    description: `${farm.name} 개인정보 수집·이용·보관 및 문의 방법을 안내합니다.`,
    path: "/privacy",
    crumbs: [
      { name: "홈", path: "/" },
      { name: "개인정보 처리방침", path: "/privacy" },
    ],
  },
};

export function seoForPath(pathname) {
  const productMatch = pathname.match(/^\/shop\/([^/]+)$/);
  if (productMatch) {
    const product = products.find((p) => p.id === productMatch[1]) || products[0];
    const path = `/shop/${product.id}`;
    const crumbs = [
      { name: "홈", path: "/" },
      { name: "제철품종", path: "/shop" },
      { name: product.name, path },
    ];
    return {
      title: pageTitle(`${product.name} 제주 감귤`),
      description: `제주 ${product.name}(${product.hanja}) ${product.season}. ${product.summary} ${product.unit} ${Number(product.price).toLocaleString()}원부터. 좋은생각 귤농수산 산지직송.`,
      path,
      image: product.image,
      keywords: `${product.name}, 제주 ${product.name}, ${product.hanja}, 제주 감귤, 좋은생각 귤농수산`,
      type: "product",
      jsonLd: graph([farmJsonLd(), websiteJsonLd(), productJsonLd(product), breadcrumbJsonLd(crumbs)]),
    };
  }

  const page = pages[pathname] || pages["/"];
  const extra = [];
  if (page.path === "/") extra.push(faqJsonLd());
  if (page.path === "/shop") {
    extra.push({
      "@type": "CollectionPage",
      name: "제철 제주 감귤",
      url: siteUrl("/shop"),
      hasPart: products.map((p) => ({
        "@type": "Product",
        name: p.name,
        url: siteUrl(`/shop/${p.id}`),
      })),
    });
  }
  return {
    ...page,
    image: DEFAULT_OG_IMAGE,
    keywords: page.keywords || farm.keywords,
    type: "website",
    jsonLd: graph([farmJsonLd(), websiteJsonLd(), breadcrumbJsonLd(page.crumbs), ...extra]),
  };
}
