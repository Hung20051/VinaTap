"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { provinceAPI } from "../../../lib/api";
import { isLoggedIn, clearAuth, getUser } from "../../../lib/auth";
import Map from "../../../components/Map";

const REGION_LABEL = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
  island: "Hải đảo",
};

const CATEGORY_LABEL = {
  attraction: "Tham quan",
  food: "Ẩm thực",
  stay: "Lưu trú",
  beach: "Biển",
  temple: "Đền chùa",
  market: "Chợ",
  other: "Khác",
};

const formatNumber = (n) =>
  n === null || n === undefined ? "—" : Number(n).toLocaleString("vi-VN");

export default function ProvincePage() {
  const { slug } = useParams();

  const [province, setProvince] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const load = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await provinceAPI.getOne(slug);
      setProvince(res.province);
      setLandmarks(res.landmarks || []);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    // Hard reload — lý do xem chú thích tương tự ở app/page.js
    window.location.href = "/";
  };

  const categories = [
    "all",
    ...Array.from(new Set(landmarks.map((l) => l.category))),
  ];
  const filteredLandmarks =
    activeCategory === "all"
      ? landmarks
      : landmarks.filter((l) => l.category === activeCategory);

  let specialtiesList = [];
  if (province?.specialties) {
    try {
      const parsed = JSON.parse(province.specialties);
      specialtiesList = Array.isArray(parsed) ? parsed : [province.specialties];
    } catch {
      specialtiesList = province.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "2.5rem" }}>🗺</p>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
          Không tìm thấy tỉnh thành này
        </h1>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Link href="/" className="navbar__logo">
            Vina<span>Tap</span> 🗺
          </Link>
          <div className="navbar__links">
            {user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/activate">Kích hoạt NFC</Link>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/auth">Đăng nhập</Link>
                <Link href="/auth" className="btn btn-primary">
                  Bắt đầu
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero tỉnh */}
      <section
        style={{
          position: "relative",
          background: province.thumbnail_url
            ? `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${province.thumbnail_url}) center/cover`
            : "linear-gradient(135deg, #fff1eb 0%, #fafafa 100%)",
          padding: "3.5rem 0",
          color: province.thumbnail_url ? "#fff" : "var(--text-primary)",
        }}
      >
        <div className="container">
          <span
            className="badge badge-primary"
            style={{
              background: province.thumbnail_url
                ? "rgba(255,255,255,.2)"
                : undefined,
              color: province.thumbnail_url ? "#fff" : undefined,
            }}
          >
            {REGION_LABEL[province.region] || province.region}
          </span>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              marginTop: ".6rem",
            }}
          >
            {province.name}
          </h1>
          {province.description && (
            <p
              style={{
                marginTop: ".75rem",
                maxWidth: 620,
                opacity: province.thumbnail_url ? 0.92 : 1,
                color: province.thumbnail_url
                  ? "#fff"
                  : "var(--text-secondary)",
              }}
            >
              {province.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "1.25rem",
              flexWrap: "wrap",
              fontSize: ".9rem",
            }}
          >
            <span>👥 {formatNumber(province.population)} dân</span>
            <span>📐 {formatNumber(province.area_km2)} km²</span>
          </div>

          <Link
            href="/activate"
            className="btn btn-primary"
            style={{ marginTop: "1.5rem", padding: ".75rem 1.75rem" }}
          >
            🔑 Kích hoạt mảnh ghép {province.name}
          </Link>
        </div>
      </section>

      <div className="container" style={{ padding: "2.5rem 1rem 4rem" }}>
        {/* Đặc sản / lễ hội */}
        {specialtiesList.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: ".75rem",
              }}
            >
              🍜 Đặc sản & lễ hội
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
              {specialtiesList.map((s, i) => (
                <span key={i} className="badge badge-primary">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Video giới thiệu */}
        {province.youtube_url && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: ".75rem",
              }}
            >
              🎬 Giới thiệu
            </h2>
            <div
              style={{
                position: "relative",
                paddingTop: "56.25%",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              <iframe
                src={toEmbedUrl(province.youtube_url)}
                title={`Giới thiệu ${province.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* Bản đồ */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: ".75rem",
            }}
          >
            🗺 Bản đồ địa danh
          </h2>
          <Map
            landmarks={landmarks}
            center={
              province.lat && province.lng
                ? { lat: Number(province.lat), lng: Number(province.lng) }
                : null
            }
          />
        </div>

        {/* Danh sách địa danh */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              📍 Địa danh nổi bật
            </h2>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`btn ${activeCategory === c ? "btn-primary" : "btn-ghost"}`}
                  style={{ padding: ".4rem .9rem", fontSize: ".82rem" }}
                  onClick={() => setActiveCategory(c)}
                >
                  {c === "all" ? "Tất cả" : CATEGORY_LABEL[c] || c}
                </button>
              ))}
            </div>
          </div>

          {filteredLandmarks.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              Chưa có địa danh nào được thêm cho tỉnh này
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {filteredLandmarks.map((l) => (
                <div key={l.id} className="card" style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      height: 130,
                      background: "var(--primary-light)",
                    }}
                  >
                    {l.thumbnail_url ? (
                      <img
                        src={l.thumbnail_url}
                        alt={l.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          fontSize: "2rem",
                        }}
                      >
                        📍
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <span
                      className="badge badge-primary"
                      style={{ fontSize: ".7rem", marginBottom: ".4rem" }}
                    >
                      {CATEGORY_LABEL[l.category] || l.category}
                    </span>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: ".95rem",
                        margin: ".35rem 0",
                      }}
                    >
                      {l.name}
                    </h3>
                    {l.address && (
                      <p
                        style={{
                          fontSize: ".78rem",
                          color: "var(--text-muted)",
                          marginBottom: ".6rem",
                        }}
                      >
                        {l.address}
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${
                        l.latitude && l.longitude
                          ? `${l.latitude},${l.longitude}`
                          : encodeURIComponent(l.name)
                      }${l.maps_place_id ? `&destination_place_id=${encodeURIComponent(l.maps_place_id)}` : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        fontSize: ".82rem",
                      }}
                    >
                      🧭 Chỉ đường
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Chuyển link YouTube thường (watch?v=... hoặc youtu.be/...) sang dạng embed
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    const videoId = u.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  } catch {
    return url;
  }
}
