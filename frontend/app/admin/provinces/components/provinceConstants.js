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

// ─── Query Geocoding & Place Suggestions (Photon Geocoding + OpenStreetMap) ───
export const queryNominatim = async (searchQuery) => {
  if (!searchQuery || !searchQuery.trim()) return [];

  const cleanQuery = searchQuery.trim();

  // 1. Dùng Photon Geocoding API giới hạn phạm vi LÃNH THỔ VIỆT NAM (bbox & VN country code)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      cleanQuery,
    )}&lat=14.0583&lon=108.2772&bbox=102.14,8.18,109.46,23.39&limit=10`;
    const res = await fetch(photonUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        // Chỉ lấy các địa điểm thuộc lãnh thổ Việt Nam
        const vnFeatures = data.features.filter((f) => {
          const p = f.properties || {};
          const cc = (p.countrycode || "").toUpperCase();
          const cName = (p.country || "").toLowerCase();
          return (
            cc === "VN" ||
            cName.includes("việt nam") ||
            cName.includes("vietnam") ||
            !p.country
          );
        });

        // Ưu tiên xếp hạng cấp hành chính: Tỉnh / Thành phố / Quận Huyện / Thị xã lên đầu
        const rankMap = { state: 1, city: 2, county: 3, district: 4, town: 5 };
        vnFeatures.sort((a, b) => {
          const rankA = rankMap[a.properties?.type] || 99;
          const rankB = rankMap[b.properties?.type] || 99;
          return rankA - rankB;
        });

        if (vnFeatures.length > 0) {
          return vnFeatures.slice(0, 6).map((f) => {
            const p = f.properties || {};
            const coords = f.geometry?.coordinates || [0, 0];
            const displayName = [
              p.name,
              p.district,
              p.city,
              p.state,
              p.country || "Việt Nam",
            ]
              .filter(Boolean)
              .join(", ");
            return {
              name: p.name || cleanQuery,
              displayName: displayName || cleanQuery,
              display_name: displayName || cleanQuery,
              lat: Number(coords[1]).toFixed(6),
              lon: Number(coords[0]).toFixed(6),
              lng: Number(coords[0]).toFixed(6),
              address: {
                road: p.street || p.name,
                suburb: p.district,
                city_district: p.district,
                city: p.city,
                state: p.state || p.city,
              },
            };
          });
        }
      }
    }
  } catch (err) {
    console.warn("Photon geocoding error:", err.message);
  }

  // 2. Fallback sang OpenStreetMap Nominatim giới hạn countrycodes=vn
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cleanQuery,
    )}&countrycodes=vn&limit=6&addressdetails=1`;
    const res = await fetch(osmUrl, {
      headers: { "Accept-Language": "vi" },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}

  return [];
};
