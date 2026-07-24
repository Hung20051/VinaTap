"use client";

// Lưu & áp dụng các tuỳ chọn giao diện của người dùng (theme, ngôn ngữ,
// trạng thái thu gọn sidebar) — tất cả lưu ở localStorage, chưa có API
// backend riêng nên không đồng bộ giữa các thiết bị.

const THEME_KEY = "vinatap_theme"; // "light" | "dark"
const LANG_KEY = "vinatap_lang"; // "vi" | "en"
const SIDEBAR_KEY = "vinatap_sidebar_collapsed"; // "1" | "0"

// ─── THEME ───────────────────────────────────────────────────
export const getTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(THEME_KEY) || "light";
};

// Ghi vào localStorage + gắn data-theme lên <html> để CSS variables
// trong globals.css đổi theo ngay lập tức.
export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
};

// Gọi 1 lần khi mount trang (client) để đồng bộ lại UI với theme đã lưu
// — layout.js đã set trước bằng inline script để tránh nháy màu lúc tải
// trang, hàm này chỉ cần trả về giá trị hiện tại cho React state.
export const applyStoredTheme = () => {
  const theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

// ─── NGÔN NGỮ ────────────────────────────────────────────────
// Lưu ý: hiện tại mới chỉ áp dụng cho phần chrome (sidebar, tiêu đề khu
// dashboard...) qua từ điển ở lib/i18n.js — CHƯA dịch toàn bộ app.
export const getLang = () => {
  if (typeof window === "undefined") return "vi";
  return localStorage.getItem(LANG_KEY) || "vi";
};

export const setLang = (lang) => {
  localStorage.setItem(LANG_KEY, lang);
};

// ─── SIDEBAR THU GỌN ─────────────────────────────────────────
export const getSidebarCollapsed = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIDEBAR_KEY) === "1";
};

export const setSidebarCollapsed = (collapsed) => {
  localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
};
