"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CATEGORY_ICON = {
  attraction: "🏞",
  food: "🍜",
  stay: "🏨",
  beach: "🏖",
  temple: "🛕",
  market: "🛍",
  other: "📍",
};

// Link mở Google Maps chỉ đường từ vị trí hiện tại của người dùng tới
// địa danh — không cần API key, hoạt động trên cả web lẫn app Google Maps.
const directionsUrl = (landmark) => {
  const dest = landmark.maps_place_id
    ? `&destination_place_id=${encodeURIComponent(landmark.maps_place_id)}`
    : "";
  const q =
    landmark.latitude && landmark.longitude
      ? `${landmark.latitude},${landmark.longitude}`
      : encodeURIComponent(landmark.name);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}${dest}`;
};

/**
 * Bản đồ địa danh của 1 tỉnh.
 * - Nếu có NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: hiển thị Google Maps JS thật,
 *   ghim marker từng địa danh, click marker mở info window + nút chỉ đường.
 * - Nếu chưa cấu hình key: hiển thị danh sách địa danh dạng thẻ (fallback),
 *   vẫn bấm "Chỉ đường" được bình thường — không để trắng màn hình.
 */
export default function Map({ landmarks = [], center, zoom = 13 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [scriptState, setScriptState] = useState("idle"); // idle | loading | ready | error

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // ─── Carousel cho danh sách fallback (khi chưa có Google Maps API key)
  // Trước đây hiển thị dạng lưới cứng, dồn hết địa danh thành 1 khối dài
  // xấu — giờ chuyển thành carousel trượt ngang, cùng pattern với carousel
  // tỉnh thành ở trang chủ (tự trượt 3s/lần, dừng khi hover, có nút lùi/tới).
  const trackRef = useRef(null);
  const [autoPaused, setAutoPaused] = useState(false);
  const showFallback = !apiKey || scriptState === "error";

  useEffect(() => {
    if (!showFallback || autoPaused || landmarks.length < 2) return;
    const track = trackRef.current;
    if (!track) return;

    const timer = setInterval(() => {
      if (!track) return;
      const cardStep = 260; // 240px thẻ + 20px khoảng cách
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [showFallback, autoPaused, landmarks.length]);

  const scrollTrack = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const fallbackCenter =
    center && center.lat && center.lng
      ? center
      : landmarks.find((l) => l.latitude && l.longitude)
        ? {
            lat: Number(landmarks.find((l) => l.latitude).latitude),
            lng: Number(landmarks.find((l) => l.longitude).longitude),
          }
        : null;

  // Nạp Google Maps JS SDK (chỉ 1 lần cho cả app)
  useEffect(() => {
    if (!apiKey || !fallbackCenter) return;

    if (window.google?.maps) {
      setScriptState("ready");
      return;
    }

    const existing = document.querySelector("script[data-vinatap-gmaps]");
    if (existing) {
      existing.addEventListener("load", () => setScriptState("ready"));
      return;
    }

    setScriptState("loading");
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.vinatapGmaps = "true";
    script.onload = () => setScriptState("ready");
    script.onerror = () => setScriptState("error");
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // Khởi tạo map + marker khi SDK sẵn sàng
  useEffect(() => {
    if (scriptState !== "ready" || !mapRef.current || !fallbackCenter) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: fallbackCenter,
      zoom,
      mapId: "VINATAP_PROVINCE_MAP",
      streetViewControl: false,
      mapTypeControl: false,
    });
    mapInstance.current = map;

    const infoWindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;

    landmarks
      .filter((l) => l.latitude && l.longitude)
      .forEach((l) => {
        const position = { lat: Number(l.latitude), lng: Number(l.longitude) };
        bounds.extend(position);
        hasPoints = true;

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: l.name,
          label: CATEGORY_ICON[l.category] || "📍",
        });

        marker.addListener("click", () => {
          infoWindow.setContent(`
            <div style="font-family:sans-serif;max-width:200px">
              <strong>${escapeHtml(l.name)}</strong>
              ${l.address ? `<p style="margin:4px 0;font-size:12px;color:#555">${escapeHtml(l.address)}</p>` : ""}
              <a href="${directionsUrl(l)}" target="_blank" rel="noopener noreferrer"
                 style="font-size:12px;color:#e85d04;font-weight:600">Chỉ đường →</a>
            </div>
          `);
          infoWindow.open(map, marker);
        });
      });

    if (hasPoints) map.fitBounds(bounds, 60);
  }, [scriptState, landmarks, fallbackCenter, zoom]);

  // Không có tọa độ nào để hiển thị
  if (!fallbackCenter) {
    return (
      <div
        className="card"
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        Chưa có dữ liệu tọa độ để hiển thị bản đồ tỉnh này
      </div>
    );
  }

  // Chưa cấu hình API key -> fallback carousel trượt ngang, vẫn dùng được
  if (showFallback) {
    return (
      <div
        className="map-fallback-carousel"
        onMouseEnter={() => setAutoPaused(true)}
        onMouseLeave={() => setAutoPaused(false)}
      >
        {landmarks.length > 1 && (
          <button
            aria-label="Trước"
            onClick={() => scrollTrack(-1)}
            className="map-fallback-carousel__nav-btn map-fallback-carousel__nav-btn--prev"
          >
            <ChevronLeft size={18} strokeWidth={2.4} />
          </button>
        )}

        <div
          ref={trackRef}
          className="no-scrollbar map-fallback-carousel__track"
        >
          {landmarks.map((l) => (
            <a
              key={l.id}
              href={directionsUrl(l)}
              target="_blank"
              rel="noopener noreferrer"
              className="card map-fallback-carousel__card"
            >
              <p className="map-fallback-carousel__card-name">
                {CATEGORY_ICON[l.category] || "📍"} {l.name}
              </p>
              {l.address && (
                <p className="map-fallback-carousel__card-address">
                  {l.address}
                </p>
              )}
              <span className="map-fallback-carousel__card-cta">
                Chỉ đường →
              </span>
            </a>
          ))}
        </div>

        {landmarks.length > 1 && (
          <button
            aria-label="Tiếp"
            onClick={() => scrollTrack(1)}
            className="map-fallback-carousel__nav-btn map-fallback-carousel__nav-btn--next"
          >
            <ChevronRight size={18} strokeWidth={2.4} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: 380,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--border)",
      }}
    >
      {scriptState === "loading" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
