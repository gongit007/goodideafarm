export const farm = {
  name: "좋은생각 귤농수산",
  english: "Jeju Good Idea Citrus",
  owner: "전홍구",
  ownerTitle: "농장주",
  phone: "010-8215-0706",
  phoneHref: "tel:010-8215-0706",
  hours: "매일 09:00 – 18:00 · 점심 12:00 – 13:00",
  region: "제주특별자치도 애월읍",
  address: {
    full: "제주특별자치도 제주시 애월읍",
    detail: "",
    note: "방문·직판은 전화 예약 후 상세 주소를 안내합니다.",
  },
  notifyEmail: "",
  business: {
    name: "좋은생각 귤농수산",
    representative: "전홍구",
    registrationNumber: "",
    mailOrderNumber: "",
    email: "",
  },
  slogan: "좋은 귤은, 좋은 생각에서 자랍니다",
  tagline: "극조생 · 조생 · 비가림하우스 · 레드향",
  harvestDate: "2026. 9. 21",
  smartStoreUrl: "https://smartstore.naver.com/gongsmartstore",
  description:
    "제주특별자치도 애월읍 감귤 농장 좋은생각 귤농수산. 농장주 전홍구가 극조생, 조생, 비가림하우스, 레드향을 제철에만 수확해 산지직송합니다. 구매는 네이버 스마트스토어에서 이어집니다.",
  keywords:
    "좋은생각 귤농수산, 제주 감귤, 제주 귤, 애월읍 귤농장, 애월 감귤, 제주도 귤농장, 산지직송, 극조생, 조생, 비가림하우스, 레드향, 전홍구, 감귤 택배, 제주 만감류",
  geo: {
    regionCode: "KR-49",
    placename: "제주특별자치도 애월읍",
    country: "KR",
    latitude: "33.4640",
    longitude: "126.3180",
  },
  phoneIntl: "+82-10-8215-0706",
};

export const nav = [
  { to: "/farm", label: "농장이야기" },
  { to: "/shop", label: "제철품종" },
  { to: "/buy", label: "구매" },
  { to: "/brix", label: "수확 노트" },
  { to: "/experience", label: "감귤타기" },
  { to: "/contact", label: "편지" },
];

export function smartStoreSearchUrl(query) {
  const base = String(farm.smartStoreUrl || "").replace(/\/$/, "");
  if (!base) return "";
  return `${base}/search?q=${encodeURIComponent(query)}`;
}

export function productStoreUrl(product) {
  const own = String(product?.storeUrl || "").trim();
  if (own) return own;
  return String(farm.smartStoreUrl || "").trim();
}

export const products = [
  {
    id: "geukjosaeng",
    no: "01",
    name: "극조생",
    hanja: "極早生",
    season: "10월 중순 – 11월 초",
    brix: 11,
    brixLabel: "11.0",
    price: 25000,
    unit: "5kg",
    weight: "5kg / 10kg",
    taste: "상큼한 첫맛",
    color: "#8fb52a",
    summary: "한 해를 여는 감귤. 달콤함보다 청량한 산미가 먼저입니다.",
    description:
      "극조생은 제주 감귤 시즌의 첫 문장입니다. 10월 중순부터 색이 오르고 11월 초면 수확이 끝납니다. 착색을 서두르지 않고, 제철이 왔을 때만 담습니다.",
    points: ["시즌 첫 출하", "얇은 껍질", "아침 간식"],
    image: "/images/citrus-green.jpg",
    storeUrl: "https://smartstore.naver.com/gongsmartstore/search?q=%EA%B7%B9%EC%A1%B0%EC%83%9D",
  },
  {
    id: "josaeng",
    no: "02",
    name: "조생",
    hanja: "早生",
    season: "11월 중순 – 12월 말",
    brix: 12,
    brixLabel: "12.2",
    price: 18000,
    unit: "5kg",
    weight: "5kg / 10kg",
    taste: "과즙이 많은 단맛",
    color: "#ee7a1a",
    summary: "제주의 식탁을 대표하는 노지감귤. 껍질이 얇고 잘 벗겨집니다.",
    description:
      "햇살과 해풍을 머금고 노지에서 천천히 익힙니다. 아이 간식부터 택배 선물까지, 가장 많이 찾는 품종입니다.",
    points: ["대표 노지", "풍부한 과즙", "직판 · 택배"],
    image: "/images/citrus-close-2.jpg",
    storeUrl: "https://smartstore.naver.com/gongsmartstore/search?q=%EC%A1%B0%EC%83%9D",
  },
  {
    id: "bigarim",
    no: "03",
    name: "비가림하우스",
    hanja: "雨除",
    season: "1월 – 2월",
    brix: 13,
    brixLabel: "13.4",
    price: 22000,
    unit: "5kg",
    weight: "5kg / 10kg",
    taste: "겨울의 진한 단맛",
    color: "#d45e0c",
    summary: "비를 가리고 수분을 조절해, 노지가 끝난 뒤에 더 달게 익힙니다.",
    description:
      "가온 없이 비닐만 씌웁니다. 눈비를 막고 물을 아끼니 당도가 오릅니다. 1~2월, 한 철 더 깊은 감귤입니다.",
    points: ["수분 조절", "겨울 제철", "선물용"],
    image: "/images/citrus-close-3.jpg",
    storeUrl: "https://smartstore.naver.com/gongsmartstore/search?q=%EB%B9%84%EA%B0%80%EB%A6%BC",
  },
  {
    id: "redhyang",
    no: "04",
    name: "레드향",
    hanja: "紅香",
    season: "12월 – 2월",
    brix: 15,
    brixLabel: "15.1",
    price: 28000,
    unit: "3kg",
    weight: "3kg / 5kg",
    taste: "향이 진하고 과육이 부드러움",
    color: "#c53a16",
    summary: "붉은 껍질, 진한 향. 한라봉과 서지향이 만난 만감류입니다.",
    description:
      "껍질이 진한 주홍빛일 때 수확합니다. 속이 꽉 찬 열매만 골라 명절과 단체 선물 상자에 담습니다.",
    points: ["만감류", "높은 당도", "명절 선물"],
    image: "/images/citrus-tree.jpg",
    storeUrl: "https://smartstore.naver.com/gongsmartstore/search?q=%EB%A0%88%EB%93%9C%ED%96%A5",
  },
];

export const stories = [
  {
    no: "I",
    title: "제철만 담습니다",
    body: "이르게 따지 않고, 늦지도 않습니다. 자연이 허락한 그 순간만 수확합니다.",
  },
  {
    no: "II",
    title: "농장주가 고릅니다",
    body: "전홍구 농장주가 나무에서 익은 열매를 보고, 당도와 산미를 확인한 뒤 출하합니다.",
  },
  {
    no: "III",
    title: "밭에서 식탁까지",
    body: "당일 선별한 감귤을 직판과 택배로 보냅니다. 머무는 시간을 줄이는 것이 신선함입니다.",
  },
];

export const experience = {
  title: "밭 걷기, 귤 따기",
  price: "1kg 3,000원",
  hours: "10:00 – 17:00 · 입장 마감 16:00",
  period: "품종별 제철 · 10월 – 2월",
  people: "가족 · 연인 · 아이",
  notes: [
    "입장료는 없고, 수확한 무게만큼 계산합니다.",
    "밭에서 시식은 가능하니 잘 익은 것만 담아 주세요.",
    "15인 이상 단체는 방문 전 전화가 필요합니다.",
    "비 오는 날은 노지 대신 비가림하우스로 안내합니다.",
  ],
};

export const faqs = [
  {
    q: "택배로도 보내 주시나요?",
    a: "택배는 구매 페이지에서 네이버 스마트스토어로 이어집니다. 산지에서 선별한 뒤 출고합니다. 단체·맞춤 주문은 전화나 편지로 받습니다.",
  },
  {
    q: "당도는 언제 재나요?",
    a: "매일 아침 품종별로 재어 수확 노트에 적습니다. 기준보다 낮으면 출하를 미룹니다.",
  },
  {
    q: "선물 상자가 있나요?",
    a: "레드향·비가림은 선물 박스로 보냅니다. 명절·단체 주문은 편지(문의)로 수량과 날을 남겨 주세요.",
  },
  {
    q: "농장에 들러도 되나요?",
    a: "직판을 합니다. 오시기 전 전화로 재고를 확인해 주시면 가장 맛있는 박스를 준비합니다.",
  },
];

export const heroSlides = [
  {
    src: "/images/farm-06.jpg",
    alt: "새로 심은 감귤 묘목",
    caption: "새로 심은 감귤 묘목",
  },
  {
    src: "/images/farm-02.jpg",
    alt: "감귤 가지를 살피는 농장주",
    caption: "감귤 가지를 살피는 농장주",
  },
  {
    src: "/images/farm-07.jpg",
    alt: "아직 푸른 감귤이 열린 나무",
    caption: "아직 푸른 감귤",
  },
  {
    src: "/images/farm-03.jpg",
    alt: "열매가 가득한 감귤밭",
    caption: "열매가 가득한 감귤밭",
  },
  {
    src: "/images/farm-01.jpg",
    alt: "수확 전, 작익은 감귤밭",
    caption: "수확 전, 작익은 감귤밭",
  },
  {
    src: "/images/farm-04.jpg",
    alt: "오늘 수확한 신선한 감귤",
    caption: "오늘 수확한 신선한 감귤",
  },
  {
    src: "/images/farm-05.jpg",
    alt: "감귤밭에서 본 애월 노을",
    caption: "감귤밭에서 본 애월 노을",
  },
];

export const vistas = [
  {
    src: "/images/jeju-coast.jpg",
    alt: "제주 중문 주상절리와 일몰",
    caption: "중문 주상절리",
  },
  {
    src: "/images/jeju-olle.jpg",
    alt: "제주 올레 해안 절벽",
    caption: "올레 해안",
  },
  {
    src: "/images/jeju-seongsan-sea.jpg",
    alt: "성산일출봉에서 본 제주 바다",
    caption: "성산 앞바다",
  },
  {
    src: "/images/jeju-hallasan.jpg",
    alt: "한라산 백록담",
    caption: "한라산",
  },
  {
    src: "/images/jeju-seongsan.jpg",
    alt: "성산일출봉",
    caption: "성산일출봉",
  },
];

export const citrusShots = [
  { src: "/images/citrus-close-3.jpg", alt: "나무에 열린 감귤" },
  { src: "/images/citrus-tree.jpg", alt: "수확한 감귤 바구니" },
  { src: "/images/citrus-close-1.jpg", alt: "깐 감귤 과육" },
  { src: "/images/citrus-sliced.jpg", alt: "감귤 단면" },
  { src: "/images/orchard.jpg", alt: "좋은생각 귤농수산 감귤밭" },
];

export const photoCreditsOwn =
  "메인 슬라이드·과수원 사진(farm-01~07, orchard.jpg)은 좋은생각 귤농수산 제공입니다.";

export const photoCreditsCommons = [
  {
    label: "성산일출봉",
    file: "jeju-seongsan.jpg",
    author: "Bernard Gagnon",
    license: "CC0",
  },
  {
    label: "한라산",
    file: "jeju-hallasan.jpg",
    author: "Wikimedia Commons",
    license: "퍼블릭 도메인",
  },
  {
    label: "중문 주상절리",
    file: "jeju-coast.jpg",
    author: "Yoo Chung",
    license: "CC BY-SA 3.0",
  },
  {
    label: "올레 해안",
    file: "jeju-olle.jpg",
    author: "Jeju Olle Foundation",
    license: "CC BY-SA 4.0",
  },
  {
    label: "온주밀감·감귤 클로즈업",
    file: "citrus-close-1.jpg 외",
    author: "Batholith, Imuzak",
    license: "퍼블릭 도메인",
  },
  {
    label: "감귤 바구니",
    file: "citrus-tree.jpg",
    author: "Tomomarusan",
    license: "CC BY 2.5",
  },
];

