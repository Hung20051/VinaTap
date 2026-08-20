"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  Award,
  Plus,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  Camera,
  ShoppingBag,
  Layers,
  MapPin,
  ExternalLink,
  Flame,
  Globe2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontalEnd,
} from "lucide-react";
import { albumAPI, nfcAPI, authAPI, provinceAPI } from "@/lib/api";
import { getUser, updateUser, clearAuth, isAdmin, isLoggedIn } from "@/lib/auth";
import { applyStoredTheme, getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "@/styles/dashboard.css";

const REGION_CONFIG = {
  all: { label: "Tất cả miền", icon: "✨" },
  north: { label: "Miền Bắc", icon: "🌲" },
  central: { label: "Miền Trung", icon: "🏛️" },
  south: { label: "Miền Nam", icon: "🌴" },
  island: { label: "Hải Đảo", icon: "🏝️" },
};

const TOTAL_PROVINCES = 34;

// Hệ thống danh hiệu & cấp bậc thám hiểm
function getExplorerRank(count) {
  if (count >= 34) return { rank: "Huyền Thoại Việt Nam", level: 5, color: "#f59e0b", icon: "👑" };
  if (count >= 22) return { rank: "Bậc Thầy Khám Phá", level: 4, color: "#ec4899", icon: "🏆" };
  if (count >= 12) return { rank: "Nhà Thám Hiểm", level: 3, color: "#8b5cf6", icon: "🧭" };
  if (count >= 5) return { rank: "Người Đồng Hành", level: 2, color: "#3b82f6", icon: "🎒" };
  return { rank: "Tân Thủ Du Hành", level: 1, color: "#10b981", icon: "🌱" };
}

export default function CustomerDashboard() {
  const router = useRouter();
  const sliderRef = useRef(null);

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") return getUser();
    return null;
  });
  const [albums, setAlbums] = useState([]);
  const [cards, setCards] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingFor, setCreatingFor] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [viewMode, setViewMode] = useState("collected"); // "collected" | "all_map"
  const [layoutMode, setLayoutMode] = useState("slider"); // "slider" | "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLangState] = useState(() => {
    if (typeof window !== "undefined") return getLang();
    return "vi";
  });

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    setLangState(getLang());
    applyStoredTheme();
    loadData();
    refreshProfile();

    const handleLangUpdated = (e) => setLangState(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, [router]);

  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    return () =>
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
  }, []);

  const refreshProfile = async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await authAPI.getMe();
      const fresh = updateUser(res.user);
      setUser(fresh);
    } catch {
      // Ignore network errors
    }
  };

  const loadData = async () => {
    if (!isLoggedIn()) return;
    setLoading(true);
    setError("");
    try {
      const [albumRes, cardRes, provRes] = await Promise.all([
        albumAPI.getMy().catch(() => ({ albums: [] })),
        nfcAPI.myCards().catch(() => ({ cards: [] })),
        provinceAPI.getAll().catch(() => ({ provinces: [] })),
      ]);
      setAlbums(albumRes.albums || []);
      setCards(cardRes.cards || []);
      setAllProvinces(provRes.provinces || []);
    } catch (err) {
      setError(err.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const albumByCardId = new Map(albums.map((a) => [Number(a.nfc_card_id), a]));
  const unlockedProvinceIds = new Set(cards.map((c) => Number(c.province_id)));

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCreateAlbum = async (card) => {
    setCreatingFor(card.id);
    try {
      const res = await albumAPI.create({ nfc_card_id: card.id });
      router.push(`/album/${res.album.id}`);
    } catch (err) {
      setError(err.message || "Không tạo được album");
      setCreatingFor(null);
    }
  };

  const totalViews = albums.reduce((sum, a) => sum + (a.view_count || 0), 0);
  const collectedCount = cards.length;
  const progressPct = Math.min(
    100,
    Math.round((collectedCount / TOTAL_PROVINCES) * 100),
  );
  const rankInfo = getExplorerRank(collectedCount);

  // Lọc theo chế độ xem (Chỉ đã mở khóa HOẶC Tất cả 34 tỉnh)
  const itemsToDisplay = viewMode === "collected" ? cards : allProvinces;

  const filteredItems = itemsToDisplay.filter((item) => {
    const isCard = viewMode === "collected";
    const region = item.region;
    const name = isCard ? item.province_name : item.name;
    const serial = isCard ? item.serial_code : "";

    const matchRegion =
      selectedRegion === "all" || region === selectedRegion;
    const matchSearch =
      !searchQuery.trim() ||
      name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (serial && serial.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    return matchRegion && matchSearch;
  });

  if (loading) {
    return (
      <div className="dash-loading-shell">
        <div className="passport-skeleton" />
        <div className="collection-skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skel-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cust-dash-root">
      {/* ─── 1. DIGITAL TRAVEL PASSPORT CARD ──────────────────────── */}
      <div className="travel-passport-card">
        <div className="passport-inner">
          <div className="passport-top">
            <div className="passport-profile">
              <div className="passport-avatar-box">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
                )}
                <span className="passport-online-dot" />
              </div>

              <div className="passport-info">
                <div className="passport-badge-row">
                  <span
                    className="passport-rank-badge"
                    style={{
                      borderColor: rankInfo.color,
                      color: rankInfo.color,
                      background: `${rankInfo.color}15`,
                    }}
                  >
                    <span>{rankInfo.icon}</span>
                    <span>Level {rankInfo.level}: {rankInfo.rank}</span>
                  </span>
                  <span className="passport-id-tag">Hộ chiếu #VN-{user?.id || 1}</span>
                </div>

                <h1 className="passport-name">
                  {user?.name || "Nhà Thám Hiểm"}
                </h1>
                <p className="passport-subtitle">
                  Hành trình chinh phục 34 mảnh ghép bản đồ di sản Việt Nam
                </p>
              </div>
            </div>

            <div className="passport-actions">
              <Link href="/customer/activate" className="btn-passport-action is-primary">
                <Sparkles size={16} />
                <span>Kích Hoạt Thẻ Mới</span>
              </Link>
              <Link href="/shop" className="btn-passport-action is-secondary">
                <ShoppingBag size={16} />
                <span>Cửa Hàng Thẻ</span>
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="passport-progress-section">
            <div className="passport-prog-meta">
              <span className="prog-label">Tiến độ mở khóa bản đồ</span>
              <span className="prog-stats">
                <strong>{collectedCount}</strong>/{TOTAL_PROVINCES} Tỉnh thành ({progressPct}%)
              </span>
            </div>
            <div className="passport-prog-track">
              <div
                className="passport-prog-fill"
                style={{ width: `${Math.max(progressPct, 4)}%` }}
              />
            </div>
          </div>

          {/* 3 Quick Metric Badges */}
          <div className="passport-stats-bar">
            <div className="passport-stat-item">
              <div className="p-stat-icon is-orange">🗺️</div>
              <div className="p-stat-data">
                <span className="p-stat-val">{collectedCount}</span>
                <span className="p-stat-lbl">Mảnh ghép sở hữu</span>
              </div>
            </div>

            <div className="passport-stat-item">
              <div className="p-stat-icon is-blue">📸</div>
              <div className="p-stat-data">
                <span className="p-stat-val">{albums.length}</span>
                <span className="p-stat-lbl">Album kỷ niệm</span>
              </div>
            </div>

            <div className="passport-stat-item">
              <div className="p-stat-icon is-emerald">👁️</div>
              <div className="p-stat-data">
                <span className="p-stat-val">{totalViews}</span>
                <span className="p-stat-lbl">Lượt xem album</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative holographic background accents */}
        <div className="passport-holo-glow" />
        <div className="passport-pattern-overlay" />
      </div>

      {error && (
        <div className="cust-error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* ─── 2. BỘ SƯU TẬP THẺ BÀI DU LỊCH ───────────────────────── */}
      <div className="cust-explorer-section">
        {/* Navigation Bar: View Toggle, Layout Toggle & Search */}
        <div className="cust-nav-bar">
          {/* View Mode Toggle */}
          <div className="cust-view-toggle">
            <button
              type="button"
              className={`toggle-btn ${viewMode === "collected" ? "is-active" : ""}`}
              onClick={() => setViewMode("collected")}
            >
              <Award size={15} />
              <span>Thẻ Đã Sở Hữu ({cards.length})</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === "all_map" ? "is-active" : ""}`}
              onClick={() => setViewMode("all_map")}
            >
              <Globe2 size={15} />
              <span>Toàn Bộ 34 Tỉnh Thành</span>
            </button>
          </div>

          <div className="cust-toolbar-right">
            {/* Search Box */}
            <div className="cust-search-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm tỉnh thành, mã serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Layout Mode Switcher (Slider vs Grid) */}
            <div className="cust-layout-toggle">
              <button
                type="button"
                className={`btn-layout-opt ${layoutMode === "slider" ? "is-active" : ""}`}
                onClick={() => setLayoutMode("slider")}
                title="Xem dạng thẻ trượt ngang (Slide)"
              >
                <GalleryHorizontalEnd size={16} />
                <span className="layout-btn-text">Dạng Trượt</span>
              </button>
              <button
                type="button"
                className={`btn-layout-opt ${layoutMode === "grid" ? "is-active" : ""}`}
                onClick={() => setLayoutMode("grid")}
                title="Xem dạng lưới (Grid)"
              >
                <LayoutGrid size={16} />
                <span className="layout-btn-text">Dạng Lưới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Region Filter Carousel + Slider Arrows */}
        <div className="cust-filter-row">
          <div className="cust-region-carousel">
            {Object.entries(REGION_CONFIG).map(([key, config]) => {
              const count =
                viewMode === "collected"
                  ? key === "all"
                    ? cards.length
                    : cards.filter((c) => c.region === key).length
                  : key === "all"
                  ? allProvinces.length
                  : allProvinces.filter((p) => p.region === key).length;

              return (
                <button
                  key={key}
                  type="button"
                  className={`region-pill-btn ${selectedRegion === key ? "is-active" : ""}`}
                  onClick={() => setSelectedRegion(key)}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                  <span className="pill-badge">{count}</span>
                </button>
              );
            })}
          </div>

          {layoutMode === "slider" && filteredItems.length > 0 && (
            <div className="cust-slider-nav-arrows">
              <button
                type="button"
                className="btn-slider-arrow"
                onClick={() => scrollSlider("left")}
                title="Trượt sang trái"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="btn-slider-arrow"
                onClick={() => scrollSlider("right")}
                title="Trượt sang phải"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Card Grid / Slider Content */}
        {filteredItems.length === 0 ? (
          viewMode === "collected" && cards.length === 0 ? (
            <div className="cust-empty-box">
              <div className="empty-globe-icon">
                <Compass size={48} />
              </div>
              <h3 className="empty-title">Bạn chưa có mảnh ghép nào</h3>
              <p className="empty-desc">
                Chạm thẻ NFC vào điện thoại hoặc kích hoạt mã thẻ để mở khóa địa danh đầu tiên trên bản đồ!
              </p>
              <div className="empty-actions">
                <Link href="/customer/activate" className="btn-passport-action is-primary">
                  <Plus size={16} />
                  <span>Kích Hoạt Ngay</span>
                </Link>
                <Link href="/shop" className="btn-passport-action is-secondary">
                  <ShoppingBag size={16} />
                  <span>Mua Thẻ Mới</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="cust-no-result">
              <p>Không tìm thấy địa danh nào phù hợp với bộ lọc hiện tại.</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSelectedRegion("all");
                  setSearchQuery("");
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )
        ) : (
          <div
            ref={sliderRef}
            className={layoutMode === "slider" ? "cust-collect-slider" : "cust-collect-grid"}
          >
            {filteredItems.map((item) => {
              if (viewMode === "collected") {
                // ĐANG XEM DANH SÁCH THẺ ĐÃ MỞ KHÓA
                const card = item;
                const album = albumByCardId.get(card.id);
                const regionInfo = REGION_CONFIG[card.region] || { label: card.region, icon: "📍" };
                const photoCount = album?.media_count || 0;

                return (
                  <div key={card.id} className="holo-travel-card is-unlocked">
                    <div className="card-media-wrap">
                      {card.thumbnail_url ? (
                        <img src={card.thumbnail_url} alt={card.province_name} loading="lazy" />
                      ) : (
                        <div className="card-thumb-empty">
                          <MapPin size={36} />
                          <span>{card.province_name}</span>
                        </div>
                      )}

                      <div className="card-media-gradient-overlay" />

                      <div className="card-status-pill is-active">
                        <CheckCircle2 size={12} />
                        <span>Đã Kích Hoạt</span>
                      </div>

                      <div className="card-region-tag">
                        <span>{regionInfo.icon}</span>
                        <span>{regionInfo.label}</span>
                      </div>

                      <div className="card-media-bottom-info">
                        <span className="card-badge-province">📍 {card.province_name}</span>
                      </div>
                    </div>

                    <div className="card-content-wrap">
                      <div className="card-meta-top">
                        <h3 className="card-province-title">{card.province_name}</h3>
                        <div className="card-serial-chip">
                          <span className="chip-icon">🏷️</span>
                          <code>{card.serial_code}</code>
                        </div>
                      </div>

                      <div className="card-album-preview-meta">
                        {album ? (
                          photoCount > 0 ? (
                            <span className="album-count-text">
                              📸 <strong>{photoCount}</strong> bức ảnh kỷ niệm lưu giữ
                            </span>
                          ) : (
                            <span className="album-count-text is-empty">
                              📸 Album trống • Hãy tải lên bức ảnh đầu tiên!
                            </span>
                          )
                        ) : (
                          <span className="album-count-text is-empty">
                            ✨ Thẻ đã sẵn sàng • Chạm để tạo album
                          </span>
                        )}
                      </div>

                      <div className="card-action-bar">
                        {album ? (
                          <Link href={`/album/${album.id}`} className="btn-card-cta is-view-album">
                            <Camera size={16} />
                            <span>{photoCount > 0 ? `Mở Album (${photoCount} ảnh)` : "Đăng Ảnh Kỷ Niệm"}</span>
                            <ArrowRight size={15} className="arrow-icon" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="btn-card-cta is-create-album"
                            disabled={creatingFor === card.id}
                            onClick={() => handleCreateAlbum(card)}
                          >
                            <Sparkles size={16} />
                            <span>{creatingFor === card.id ? "Đang tạo..." : "Tạo Album Kỷ Niệm"}</span>
                            <ArrowRight size={15} className="arrow-icon" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
                // ĐANG XEM TOÀN BỘ 34 TỈNH THÀNH (BẢN ĐỒ KHÁM PHÁ)
                const province = item;
                const isUnlocked = unlockedProvinceIds.has(Number(province.id));
                const matchedCard = cards.find((c) => Number(c.province_id) === Number(province.id));
                const album = matchedCard ? albumByCardId.get(Number(matchedCard.id)) : null;
                const regionInfo = REGION_CONFIG[province.region] || { label: province.region, icon: "📍" };
                const photoCount = album?.media_count || 0;

                return (
                  <div key={province.id} className={`holo-travel-card ${isUnlocked ? "is-unlocked" : "is-locked"}`}>
                    <div className="card-media-wrap">
                      {province.thumbnail_url ? (
                        <img
                          src={province.thumbnail_url}
                          alt={province.name}
                          loading="lazy"
                          className={isUnlocked ? "" : "is-locked-img"}
                        />
                      ) : (
                        <div className="card-thumb-empty">
                          <MapPin size={36} />
                          <span>{province.name}</span>
                        </div>
                      )}

                      <div className="card-media-gradient-overlay" />

                      {isUnlocked ? (
                        <div className="card-status-pill is-active">
                          <CheckCircle2 size={12} />
                          <span>Đã Sở Hữu</span>
                        </div>
                      ) : (
                        <div className="card-status-pill is-locked">
                          <Lock size={12} />
                          <span>Chưa Mở Khóa</span>
                        </div>
                      )}

                      <div className="card-region-tag">
                        <span>{regionInfo.icon}</span>
                        <span>{regionInfo.label}</span>
                      </div>

                      <div className="card-media-bottom-info">
                        <span className="card-badge-province">📍 {province.name}</span>
                      </div>
                    </div>

                    <div className="card-content-wrap">
                      <div className="card-meta-top">
                        <h3 className="card-province-title">{province.name}</h3>
                        <p className="card-prov-desc">
                          {isUnlocked
                            ? `Mã thẻ: ${matchedCard?.serial_code || "NFC-ACTIVE"}`
                            : "Mảnh ghép bản đồ du lịch NFC Việt Nam"}
                        </p>
                      </div>

                      <div className="card-album-preview-meta">
                        {isUnlocked ? (
                          album ? (
                            photoCount > 0 ? (
                              <span className="album-count-text">
                                📸 <strong>{photoCount}</strong> bức ảnh kỷ niệm
                              </span>
                            ) : (
                              <span className="album-count-text is-empty">
                                📸 Chưa có ảnh • Chạm để thêm ảnh
                              </span>
                            )
                          ) : (
                            <span className="album-count-text is-empty">
                              ✨ Sẵn sàng tạo album kỷ niệm
                            </span>
                          )
                        ) : (
                          <span className="album-count-text is-locked-txt">
                            🔒 Sưu tầm thẻ để mở khóa album địa danh này
                          </span>
                        )}
                      </div>

                      <div className="card-action-bar">
                        {isUnlocked ? (
                          album ? (
                            <Link href={`/album/${album.id}`} className="btn-card-cta is-view-album">
                              <Camera size={16} />
                              <span>Mở Album Kỷ Niệm</span>
                              <ArrowRight size={15} className="arrow-icon" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="btn-card-cta is-create-album"
                              disabled={creatingFor === matchedCard?.id}
                              onClick={() => matchedCard && handleCreateAlbum(matchedCard)}
                            >
                              <Sparkles size={16} />
                              <span>Tạo Album Kỷ Niệm</span>
                              <ArrowRight size={15} className="arrow-icon" />
                            </button>
                          )
                        ) : (
                          <Link href={`/shop`} className="btn-card-cta is-buy-unlock">
                            <ShoppingBag size={16} />
                            <span>Mua Thẻ Mở Khóa Tỉnh Này</span>
                            <ArrowRight size={15} className="arrow-icon" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
