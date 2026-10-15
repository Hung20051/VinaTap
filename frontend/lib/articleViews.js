// Mapping lượt xem chuẩn cho 24 bài viết cẩm nang VinaTap (Tổng chính xác = 856 lượt xem)
export const ARTICLE_VIEWS_MAP = {
  "10-best-things-to-do-in-ho-chi-minh-city": 52,
  "8-best-things-to-do-in-nha-trang": 40,
  "15-best-places-to-visit-in-vietnam-in-2026": 65,
  "20-best-things-to-do-in-vietnam": 55,
  "3-week-vietnam-itinerary": 60,
  "12-must-try-foods-in-ho-chi-minh-city": 36,
  "8-must-try-foods-in-hanoi": 44,
  "5-must-try-nha-trang-dishes": 27,
  "7-must-try-foods-in-vung-tau": 25,
  "5-best-vung-tau-beaches": 30,
  "pho-the-complete-guide": 47,
  "ao-dai-vietnamese-traditional-dress": 19,
  "where-to-stay-in-ho-chi-minh-city": 55,
  "hanoi-tourist-map": 25,
  "plan-your-vietnam-trip-with-just-one-prompt": 33,
  "the-complete-guide-to-vietnam": 42,
  "accommodation-in-vietnam": 28,
  "vietnam-climate": 22,
  "vietnamese-currency": 24,
  "vietnam-visa": 36,
  "the-15-best-attractions-in-dalat": 34,
  "10-days-in-vietnam": 21,
  "2-weeks-in-vietnam": 18,
  "1-month-in-vietnam": 18,
};

export const TOTAL_SYSTEM_ARTICLE_VIEWS = 856;

export function getArticleViews(slug) {
  if (!slug) return 35;
  return ARTICLE_VIEWS_MAP[slug] || 35;
}
