// Mapping lượt xem chuẩn cho 24 bài viết cẩm nang VinaTap (Chia đều random, Tổng = chính xác 856 lượt xem)
export const ARTICLE_VIEWS_MAP = {
  "10-best-things-to-do-in-ho-chi-minh-city": 38,
  "8-best-things-to-do-in-nha-trang": 34,
  "15-best-places-to-visit-in-vietnam-in-2026": 37,
  "20-best-things-to-do-in-vietnam": 35,
  "3-week-vietnam-itinerary": 39,
  "12-must-try-foods-in-ho-chi-minh-city": 33,
  "8-must-try-foods-in-hanoi": 36,
  "5-must-try-nha-trang-dishes": 35,
  "7-must-try-foods-in-vung-tau": 37,
  "5-best-vung-tau-beaches": 34,
  "pho-the-complete-guide": 38,
  "ao-dai-vietnamese-traditional-dress": 33,
  "where-to-stay-in-ho-chi-minh-city": 36,
  "hanoi-tourist-map": 35,
  "plan-your-vietnam-trip-with-just-one-prompt": 37,
  "the-complete-guide-to-vietnam": 34,
  "accommodation-in-vietnam": 36,
  "vietnam-climate": 35,
  "vietnamese-currency": 38,
  "vietnam-visa": 33,
  "the-15-best-attractions-in-dalat": 37,
  "10-days-in-vietnam": 34,
  "2-weeks-in-vietnam": 36,
  "1-month-in-vietnam": 36,
};

export const TOTAL_SYSTEM_ARTICLE_VIEWS = 856;

export function getArticleViews(slug) {
  if (!slug) return 36;
  return ARTICLE_VIEWS_MAP[slug] || 36;
}
