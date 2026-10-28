const BASE_URL = "https://www.vinatap.io.vn";

const GUIDE_ROUTES = [
  "/guide",
  "/guide/the-complete-guide-to-vietnam",
  "/guide/15-best-places-to-visit-in-vietnam-in-2026",
  "/guide/20-best-things-to-do-in-vietnam",
  "/guide/accommodation-in-vietnam",
  "/guide/where-to-stay-in-ho-chi-minh-city",
  "/guide/10-best-things-to-do-in-ho-chi-minh-city",
  "/guide/12-must-try-foods-in-ho-chi-minh-city",
  "/guide/8-must-try-foods-in-hanoi",
  "/guide/hanoi-tourist-map",
  "/guide/pho",
  "/guide/pho-the-complete-guide",
  "/guide/ao-dai-vietnamese-traditional-dress",
  "/guide/10-best-attractions-in-da-nang",
  "/guide/10-best-things-to-do-in-da-nang",
  "/guide/the-10-best-attractions-in-da-nang",
  "/guide/8-best-things-to-do-in-nha-trang",
  "/guide/5-must-try-nha-trang-dishes",
  "/guide/banh-mi-long-hoi",
  "/guide/15-best-attractions-in-dalat",
  "/guide/the-15-best-attractions-in-dalat",
  "/guide/5-best-vung-tau-beaches",
  "/guide/7-must-try-foods-in-vung-tau",
  "/guide/ninh-binh",
  "/guide/ha-giang",
  "/guide/hue",
  "/guide/nha-trang",
  "/guide/vietnam-visa",
  "/guide/vietnamese-currency",
  "/guide/vietnam-climate",
  "/guide/climate-of-vietnam",
  "/guide/10-days-in-vietnam",
  "/guide/2-weeks-in-vietnam",
  "/guide/3-week-vietnam-itinerary",
  "/guide/1-month-in-vietnam",
  "/guide/plan-your-vietnam-trip-with-just-one-prompt",
];

const PROVINCE_AND_STAY_ROUTES = [
  "/province/ha-noi",
  "/province/ho-chi-minh",
  "/province/da-nang",
  "/province/hoi-an",
  "/province/nha-trang",
  "/province/dalat",
  "/province/ha-long",
  "/province/sapa",
  "/province/ninh-binh",
  "/province/ha-giang",
  "/province/hue",
  "/province/can-tho",
  "/province/ba-ria-vung-tau",
  "/province/khanh-hoa",
  "/province/lam-dong",
  "/province/lao-cai",
  "/province/quang-nam",
  "/province/quang-ninh",
  "/province/thua-thien-hue",
  "/stay/casa-blanca-da-lat",
  "/stay/accommodation-in-vietnam",
  "/policy",
  "/terms",
];

export default function sitemap() {
  const now = new Date();

  const homeEntry = {
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  };

  const guideEntries = GUIDE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/guide" ? 0.9 : 0.85,
  }));

  const provinceEntries = PROVINCE_AND_STAY_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [homeEntry, ...guideEntries, ...provinceEntries];
}
