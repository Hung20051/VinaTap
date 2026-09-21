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
  Gift,
} from "lucide-react";
import { albumAPI, nfcAPI, authAPI, provinceAPI } from "@/lib/api";
import { getUser, updateUser, clearAuth, isAdmin, isLoggedIn } from "@/lib/auth";
import { applyStoredTheme, getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import TransferModal from "@/components/modals/TransferModal";
import GiftNotificationBanner from "@/components/ui/GiftNotificationBanner";
import "@/styles/dashboard.css";

function getRegionConfig(lang) {
  return {
    all: { label: t(lang, "regionAllDash"), icon: "✨" },
    north: { label: t(lang, "regionNorthDash"), icon: "🌲" },
    central: { label: t(lang, "regionCentralDash"), icon: "🏛️" },
    south: { label: t(lang, "regionSouthDash"), icon: "🌴" },
    island: { label: t(lang, "regionIslandDash"), icon: "🏝️" },
  };
}

const TOTAL_PROVINCES = 34;

// Hệ thống danh hiệu & cấp bậc thám hiểm
function getExplorerRank(count, lang) {
  if (count >= 34) return { rank: t(lang, "rankLegend"), level: 5, color: "#f59e0b", icon: "👑" };
  if (count >= 22) return { rank: t(lang, "rankMaster"), level: 4, color: "#ec4899", icon: "🏆" };
  if (count >= 12) return { rank: t(lang, "rankAdventurer"), level: 3, color: "#8b5cf6", icon: "🧭" };
  if (count >= 5) return { rank: t(lang, "rankWayfarer"), level: 2, color: "#3b82f6", icon: "🎒" };
  return { rank: t(lang, "rankNovice"), level: 1, color: "#10b981", icon: "🌱" };
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
  const [transferCard, setTransferCard] = useState(null); // { id, name } | null
  const [pendingGifts, setPendingGifts] = useState([]);
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
      const [albumRes, cardRes, provRes, giftRes] = await Promise.all([
        albumAPI.getMy().catch(() => ({ albums: [] })),
        nfcAPI.myCards().catch(() => ({ cards: [] })),
        provinceAPI.getAll().catch(() => ({ provinces: [] })),
        nfcAPI.getPendingTransfers().catch(() => ({ transfers: [] })),
      ]);
      setAlbums(albumRes.albums || []);
      setCards(cardRes.cards || []);
      setAllProvinces(provRes.provinces || []);
      setPendingGifts(giftRes.transfers || []);
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
      const targetAlbum = res.album || res;
      const targetSlug = targetAlbum?.share_code || targetAlbum?.id;
      if (targetSlug) {
        router.push(`/album/${targetSlug}`);
      } else {
        await loadData();
      }
    } catch (err) {
      setError(err.message || "Không tạo được album");
      await loadData();
    } finally {
      setCreatingFor(null);
    }
  };

  const totalViews = albums.reduce((sum, a) => sum + (a.view_count || 0), 0);
  const totalCardsCount = cards.length;
  const uniqueProvinceCount = unlockedProvinceIds.size;
  const progressPct = Math.min(
    100,
    Math.round((uniqueProvinceCount / TOTAL_PROVINCES) * 100),
  );
  const rankInfo = getExplorerRank(uniqueProvinceCount, lang);
  const REGION_CONFIG = getRegionConfig(lang);

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
                  <span className="passport-id-tag">{t(lang, "passportTag")} #VN-{user?.id || 1}</span>
                </div>

                <h1 className="passport-name">
                  {user?.name || t(lang, "defaultExplorer")}
                </h1>
                <p className="passport-subtitle">
                  {t(lang, "passportSubtitle")}
                </p>
              </div>
            </div>

            <div className="passport-actions">
              <Link href="/customer/activate" className="btn-passport-action is-primary">
                <Sparkles size={16} />
                <span>{t(lang, "btnActivateCard")}</span>
              </Link>
              <Link href="/shop" className="btn-passport-action is-secondary">
                <ShoppingBag size={16} />
                <span>{t(lang, "btnCardStore")}</span>
              </Link>
            </div>
          </div>

          {/* Progress bar */}
          <div className="passport-progress-section">
            <div className="passport-prog-meta">
              <span className="prog-label">{t(lang, "mapUnlockProgress")}</span>
              <span className="prog-stats">
                <strong>{uniqueProvinceCount}</strong>/{TOTAL_PROVINCES} {t(lang, "provincesCountLabel")} ({progressPct}%)
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
                <span className="p-stat-val">{totalCardsCount}</span>
                <span className="p-stat-lbl">{t(lang, "ownedPieces")}</span>
              </div>
            </div>

            <div className="passport-stat-item">
              <div className="p-stat-icon is-blue">📸</div>
              <div className="p-stat-data">
                <span className="p-stat-val">{albums.length}</span>
                <span className="p-stat-lbl">{t(lang, "memoryAlbumsCount")}</span>
              </div>
            </div>

            <div className="passport-stat-item">
              <div className="p-stat-icon is-emerald">👁️</div>
              <div className="p-stat-data">
                <span className="p-stat-val">{totalViews}</span>
                <span className="p-stat-lbl">{t(lang, "albumViewsCount")}</span>
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

      {/* 🎁 Hộp quà tặng đang chờ nhận trực tiếp trên Web */}
      <GiftNotificationBanner
        gifts={pendingGifts}
        onGiftProcessed={() => loadData()}
      />

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
              <span>{t(lang, "tabOwnedCards")} ({cards.length})</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === "all_map" ? "is-active" : ""}`}
              onClick={() => setViewMode("all_map")}
            >
              <Globe2 size={15} />
              <span>{t(lang, "tabAllProvinces")}</span>
            </button>
          </div>

          <div className="cust-toolbar-right">
            {/* Search Box */}
            <div className="cust-search-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder={t(lang, "searchDashPlaceholder")}
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
                title={t(lang, "tipSlide")}
              >
                <GalleryHorizontalEnd size={16} />
                <span className="layout-btn-text">{t(lang, "layoutSlide")}</span>
              </button>
              <button
                type="button"
                className={`btn-layout-opt ${layoutMode === "grid" ? "is-active" : ""}`}
                onClick={() => setLayoutMode("grid")}
                title={t(lang, "tipGrid")}
              >
                <LayoutGrid size={16} />
                <span className="layout-btn-text">{t(lang, "layoutGrid")}</span>
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
                title={t(lang, "tipScrollLeft")}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="btn-slider-arrow"
                onClick={() => scrollSlider("right")}
                title={t(lang, "tipScrollRight")}
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
              <h3 className="empty-title">{t(lang, "emptyCollectionTitle")}</h3>
              <p className="empty-desc">
                {t(lang, "emptyCollectionDesc")}
              </p>
              <div className="empty-actions">
                <Link href="/customer/activate" className="btn-passport-action is-primary">
                  <Plus size={16} />
                  <span>{t(lang, "btnActivateNow")}</span>
                </Link>
                <Link href="/shop" className="btn-passport-action is-secondary">
                  <ShoppingBag size={16} />
                  <span>{t(lang, "btnBuyNewCard")}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="cust-no-result">
              <p>{t(lang, "noMatchProvinces")}</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSelectedRegion("all");
                  setSearchQuery("");
                }}
              >
                {t(lang, "btnResetFilters")}
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

                      {album?.status === "archived" ? (
                        <div className="card-status-pill is-locked" style={{ background: "#dc2626", color: "#fff" }}>
                          <Lock size={12} />
                          <span>{t(lang, "albumArchived")}</span>
                        </div>
                      ) : (
                        <div className="card-status-pill is-active">
                          <CheckCircle2 size={12} />
                          <span>{t(lang, "cardStatusActive")}</span>
                        </div>
                      )}

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
                          album.status === "archived" ? (
                            <span className="album-count-text" style={{ color: "#dc2626", fontWeight: 700 }}>
                              ⚠️ {t(lang, "albumArchived")}: {album.locked_reason || (lang === "en" ? "Policy violation" : "Vi phạm chính sách")}
                            </span>
                          ) : photoCount > 0 ? (
                            <span className="album-count-text">
                              📸 <strong>{photoCount}</strong> {t(lang, "photosPreserved")}
                            </span>
                          ) : (
                            <span className="album-count-text is-empty">
                              📸 {t(lang, "emptyAlbumHint")}
                            </span>
                          )
                        ) : (
                          <span className="album-count-text is-empty">
                            ✨ {t(lang, "cardReadyHint")}
                          </span>
                        )}
                      </div>

                      <div className="card-action-bar" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {album ? (
                          album.status === "archived" ? (
                            <Link href={`/album/${album.share_code || album.id}`} className="btn-card-cta" style={{ flex: 1, background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }}>
                              <Lock size={16} />
                              <span>{t(lang, "viewLockReason")}</span>
                              <ArrowRight size={15} className="arrow-icon" />
                            </Link>
                          ) : (
                            <Link href={`/album/${album.share_code || album.id}`} className="btn-card-cta is-view-album" style={{ flex: 1 }}>
                              <Camera size={16} />
                              <span>{photoCount > 0 ? `${t(lang, "btnOpenAlbum")} (${photoCount})` : t(lang, "btnAddPhoto")}</span>
                              <ArrowRight size={15} className="arrow-icon" />
                            </Link>
                          )
                        ) : (
                          <button
                            type="button"
                            className="btn-card-cta is-create-album"
                            style={{ flex: 1 }}
                            disabled={creatingFor === card.id}
                            onClick={() => handleCreateAlbum(card)}
                          >
                            <Sparkles size={16} />
                            <span>{creatingFor === card.id ? t(lang, "btnCreatingAlbum") : t(lang, "btnCreateAlbum")}</span>
                            <ArrowRight size={15} className="arrow-icon" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-card-gift"
                          title={t(lang, "btnGiftTip")}
                          onClick={() => setTransferCard({ id: card.id, name: card.province_name })}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                            padding: "0.72rem 0.9rem",
                            borderRadius: "12px",
                            background: "rgba(234, 88, 12, 0.08)",
                            color: "#ea580c",
                            border: "1px solid rgba(234, 88, 12, 0.2)",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <Gift size={16} />
                          <span>{t(lang, "btnGiftCard")}</span>
                        </button>
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
                          <span>{t(lang, "cardStatusOwned")}</span>
                        </div>
                      ) : (
                        <div className="card-status-pill is-locked">
                          <Lock size={12} />
                          <span>{t(lang, "cardStatusLocked")}</span>
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
                            ? `${t(lang, "cardCodeLabel")}: ${matchedCard?.serial_code || "NFC-ACTIVE"}`
                            : t(lang, "mapPieceSubtitle")}
                        </p>
                      </div>

                      <div className="card-album-preview-meta">
                        {isUnlocked ? (
                          album ? (
                            album.status === "archived" ? (
                              <span className="album-count-text" style={{ color: "#dc2626", fontWeight: 700 }}>
                                ⚠️ {t(lang, "albumArchived")}: {album.locked_reason || (lang === "en" ? "Policy violation" : "Vi phạm chính sách")}
                              </span>
                            ) : photoCount > 0 ? (
                              <span className="album-count-text">
                                📸 <strong>{photoCount}</strong> {t(lang, "photosCount")}
                              </span>
                            ) : (
                              <span className="album-count-text is-empty">
                                📸 {t(lang, "noPhotosHint")}
                              </span>
                            )
                          ) : (
                            <span className="album-count-text is-empty">
                              ✨ {t(lang, "readyToCreateAlbum")}
                            </span>
                          )
                        ) : (
                          <span className="album-count-text is-locked-txt">
                            🔒 {t(lang, "collectToUnlockHint")}
                          </span>
                        )}
                      </div>

                      <div className="card-action-bar" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {isUnlocked ? (
                          <>
                            {album ? (
                              album.status === "archived" ? (
                                <Link href={`/album/${album.share_code || album.id}`} className="btn-card-cta" style={{ flex: 1, background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }}>
                                  <Lock size={16} />
                                  <span>{t(lang, "viewLockReason")}</span>
                                  <ArrowRight size={15} className="arrow-icon" />
                                </Link>
                              ) : (
                                <Link href={`/album/${album.share_code || album.id}`} className="btn-card-cta is-view-album" style={{ flex: 1 }}>
                                  <Camera size={16} />
                                  <span>{t(lang, "btnOpenAlbum")}</span>
                                  <ArrowRight size={15} className="arrow-icon" />
                                </Link>
                              )
                            ) : (
                              <button
                                type="button"
                                className="btn-card-cta is-create-album"
                                style={{ flex: 1 }}
                                disabled={creatingFor === matchedCard?.id}
                                onClick={() => matchedCard && handleCreateAlbum(matchedCard)}
                              >
                                <Sparkles size={16} />
                                <span>{creatingFor === matchedCard?.id ? t(lang, "btnCreatingAlbum") : t(lang, "btnCreateAlbum")}</span>
                                <ArrowRight size={15} className="arrow-icon" />
                              </button>
                            )}
                            {matchedCard && (
                              <button
                                type="button"
                                className="btn-card-gift"
                                title={t(lang, "btnGiftTip")}
                                onClick={() => setTransferCard({ id: matchedCard.id, name: province.name })}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "5px",
                                  padding: "0.72rem 0.9rem",
                                  borderRadius: "12px",
                                  background: "rgba(234, 88, 12, 0.08)",
                                  color: "#ea580c",
                                  border: "1px solid rgba(234, 88, 12, 0.2)",
                                  fontWeight: 700,
                                  fontSize: "0.82rem",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Gift size={16} />
                                <span>{t(lang, "btnGiftCard")}</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <Link href={`/shop`} className="btn-card-cta is-buy-unlock" style={{ flex: 1 }}>
                            <ShoppingBag size={16} />
                            <span>{t(lang, "btnBuyCardToUnlock")}</span>
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

      {/* 🎁 Modal Chuyển nhượng / Tặng thẻ */}
      {transferCard && (
        <TransferModal
          cardId={transferCard.id}
          cardName={transferCard.name}
          onClose={() => setTransferCard(null)}
          onSuccess={() => {
            setTransferCard(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
