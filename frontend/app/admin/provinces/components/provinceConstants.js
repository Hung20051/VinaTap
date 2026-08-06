import {
  Camera,
  Utensils,
  Hotel,
  Sun,
  Landmark,
  ShoppingBag,
  MapPin,
} from "lucide-react";

export const REGIONS = {
  north: { label: "Miền Bắc", color: "#2563eb", bg: "#eff6ff" },
  central: { label: "Miền Trung", color: "#e85d04", bg: "#fff7ed" },
  south: { label: "Miền Nam", color: "#16a34a", bg: "#f0fdf4" },
  island: { label: "Hải Đảo", color: "#0891b2", bg: "#ecfeff" },
};

export const LANDMARK_CATEGORIES = {
  attraction: { label: "Tham quan", icon: Camera, color: "#e85d04" },
  food: { label: "Ẩm thực", icon: Utensils, color: "#d97706" },
  stay: { label: "Lưu trú", icon: Hotel, color: "#2563eb" },
  beach: { label: "Bãi biển", icon: Sun, color: "#0891b2" },
  temple: { label: "Đền chùa", icon: Landmark, color: "#7c3aed" },
  market: { label: "Chợ / Mua sắm", icon: ShoppingBag, color: "#16a34a" },
  other: { label: "Khác", icon: MapPin, color: "#64748b" },
};

// Slug generator
export const generateSlug = (text = "") => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Split province names (e.g. "Bắc Ninh - Bắc Giang" -> ["Bắc Ninh", "Bắc Giang"])
export const parseProvinceNames = (rawName = "") => {
  if (!rawName) return [];
  return rawName
    .split(/[-+/]| mở rộng/i)
    .map((s) => s.trim())
    .filter(Boolean);
};

// Auto detect region
export const detectRegion = (name = "", displayName = "", lat = null) => {
  const text = (name + " " + displayName).toLowerCase();
  if (
    text.includes("trường sa") ||
    text.includes("hoàng sa") ||
    text.includes("phú quốc") ||
    text.includes("côn đảo") ||
    text.includes("lý sơn") ||
    text.includes("cù lao") ||
    text.includes("cát bà") ||
    text.includes("bạch long vĩ") ||
    text.includes("thổ chu")
  ) {
    return "island";
  }
  if (lat) {
    const latNum = Number(lat);
    if (latNum >= 20.0) return "north";
    if (latNum >= 12.0 && latNum < 20.0) return "central";
    if (latNum < 12.0) return "south";
  }
  return "north";
};

// Query Nominatim API
export const queryNominatim = async (searchQuery) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    searchQuery,
  )}&countrycodes=vn&limit=6&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "vi" } });
  if (!res.ok) return [];
  return await res.json();
};
