"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../../../components/Logo";
import { useParams } from "next/navigation";
import { provinceAPI } from "../../../lib/api";
import { isLoggedIn, clearAuth, getUser } from "../../../lib/auth";
import Map from "../../../components/Map";
import "../../../styles/province.css";

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
  const [expandedLandmarks, setExpandedLandmarks] = useState(false);
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

  // Chỉ hiện tối đa 3 địa danh, còn lại ẩn sau nút "+N" — bấm vào mới
  // hiện hết, tránh dồn cả chục thẻ thành 1 khối dài như trước.
  const hiddenLandmarkCount = Math.max(0, filteredLandmarks.length - 3);
  const visibleLandmarks = expandedLandmarks
    ? filteredLandmarks
    : filteredLandmarks.slice(0, 3);

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
      <div className="province-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="province-notfound">
        <p className="province-notfound__icon">🗺</p>
        <h1 className="province-notfound__title">
          Không tìm thấy tỉnh thành này
        </h1>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const hasImage = !!province.thumbnail_url;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
          <div className="navbar__links">
            {user ? (
              <>
                <Link href="/customer/dashboard">Dashboard</Link>
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

      {/* Hero tỉnh — background/color giữ inline vì phụ thuộc ảnh của
          từng tỉnh (province.thumbnail_url), phần còn lại nằm ở
          styles/province.css (.province-hero) */}
      <section
        className="province-hero"
        style={{
          background: hasImage
            ? `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${province.thumbnail_url}) center/cover`
            : "linear-gradient(135deg, #fff1eb 0%, #fafafa 100%)",
          color: hasImage ? "#fff" : "var(--text-primary)",
        }}
      >
        <div className="container">
          <span
            className={`badge badge-primary ${hasImage ? "province-hero__badge--overlay" : ""}`}
          >
            {REGION_LABEL[province.region] || province.region}
          </span>
          <h1 className="province-hero__title">{province.name}</h1>
          {province.description && (
            <p
              className={`province-hero__desc ${hasImage ? "province-hero__desc--overlay" : "province-hero__desc--plain"}`}
            >
              {province.description}
            </p>
          )}

          <div className="province-hero__stats">
            <span>👥 {formatNumber(province.population)} dân</span>
            <span>📐 {formatNumber(province.area_km2)} km²</span>
          </div>

          <Link href="/activate" className="btn btn-primary province-hero__cta">
            🔑 Kích hoạt mảnh ghép {province.name}
          </Link>
        </div>
      </section>

      <div className="container province-content">
        {/* Đặc sản / lễ hội */}
        {specialtiesList.length > 0 && (
          <div className="province-section">
            <h2 className="province-section__title">🍜 Đặc sản & lễ hội</h2>
            <div className="province-specialties-list">
              {specialtiesList.map((s, i) => (
                <span key={i} className="province-specialty-chip">
                  <span className="province-specialty-chip__dot" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Video giới thiệu */}
        {province.youtube_url && (
          <div className="province-section">
            <h2 className="province-section__title">🎬 Giới thiệu</h2>
            <div className="province-video-wrap">
              <iframe
                src={toEmbedUrl(province.youtube_url)}
                title={`Giới thiệu ${province.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="province-video-iframe"
              />
            </div>
          </div>
        )}

        {/* Bản đồ */}
        <div className="province-section">
          <h2 className="province-section__title">🗺 Bản đồ địa danh</h2>
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
          <div className="province-landmarks-header">
            <h2 className="province-landmarks-header__title">
              📍 Địa danh nổi bật
            </h2>
            <div className="province-filter-row">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`btn province-filter-btn ${activeCategory === c ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => {
                    setActiveCategory(c);
                    setExpandedLandmarks(false);
                  }}
                >
                  {c === "all" ? "Tất cả" : CATEGORY_LABEL[c] || c}
                </button>
              ))}
            </div>
          </div>

          {filteredLandmarks.length === 0 ? (
            <div className="card province-empty">
              Chưa có địa danh nào được thêm cho tỉnh này
            </div>
          ) : (
            <div className="province-landmark-grid">
              {visibleLandmarks.map((l) => (
                <div key={l.id} className="card province-landmark-card">
                  <div className="province-landmark-card__thumb">
                    {l.thumbnail_url ? (
                      <img src={l.thumbnail_url} alt={l.name} loading="lazy" />
                    ) : (
                      <div className="province-landmark-card__thumb-placeholder">
                        📍
                      </div>
                    )}
                  </div>
                  <div className="province-landmark-card__body">
                    <span className="badge badge-primary province-landmark-card__badge">
                      {CATEGORY_LABEL[l.category] || l.category}
                    </span>
                    <h3 className="province-landmark-card__name">{l.name}</h3>
                    {l.address && (
                      <p className="province-landmark-card__address">
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
                      className="btn btn-outline province-landmark-card__cta"
                    >
                      🧭 Chỉ đường
                    </a>
                  </div>
                </div>
              ))}

              {/* Còn hơn 3 địa danh mà chưa mở rộng -> hiện tile "+N" thay
                  vì dồn hết thành 1 khối dài */}
              {!expandedLandmarks && hiddenLandmarkCount > 0 && (
                <button
                  onClick={() => setExpandedLandmarks(true)}
                  className="province-landmark-more-card"
                >
                  <span className="province-landmark-more-card__plus">
                    +{hiddenLandmarkCount}
                  </span>
                  <span className="province-landmark-more-card__label">
                    Tìm hiểu thêm
                  </span>
                </button>
              )}
            </div>
          )}

          {expandedLandmarks && hiddenLandmarkCount > 0 && (
            <div className="province-landmarks-footer">
              <button
                onClick={() => setExpandedLandmarks(false)}
                className="btn btn-ghost"
              >
                Thu gọn
              </button>
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
