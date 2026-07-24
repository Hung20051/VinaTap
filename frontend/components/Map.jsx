"use client";

import { useEffect, useRef, useState } from "react";

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

  // Chưa cấu hình API key -> fallback danh sách địa danh, vẫn dùng được
  if (!apiKey || scriptState === "error") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {landmarks.map((l) => (
          <a
            key={l.id}
            href={directionsUrl(l)}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
            style={{ padding: "1rem", display: "block" }}
          >
            <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
              {CATEGORY_ICON[l.category] || "📍"} {l.name}
            </p>
            {l.address && (
              <p
                style={{
                  fontSize: ".78rem",
                  color: "var(--text-muted)",
                  marginTop: ".25rem",
                }}
              >
                {l.address}
              </p>
            )}
            <span
              style={{
                fontSize: ".78rem",
                color: "var(--primary)",
                fontWeight: 600,
                display: "inline-block",
                marginTop: ".4rem",
              }}
            >
              Chỉ đường →
            </span>
          </a>
        ))}
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
