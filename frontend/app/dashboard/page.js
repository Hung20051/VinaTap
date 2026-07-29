"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Logo from "../../components/Logo";
import { useRouter } from "next/navigation";
import { albumAPI, nfcAPI, authAPI } from "../../lib/api";
import {
  getUser,
  updateUser,
  requireAuth,
  clearAuth,
  isAdmin,
} from "../../lib/auth";
import {
  getSidebarCollapsed,
  setSidebarCollapsed as persistSidebarCollapsed,
  getTheme,
  setTheme as persistTheme,
  applyStoredTheme,
  getLang,
  setLang as persistLang,
} from "../../lib/prefs";
import { t } from "../../lib/i18n";
import "../../styles/dashboard.css";

const REGION_LABEL = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
  island: "Hải đảo",
};

const TOTAL_PROVINCES = 34;

// Phải khớp với "width" của .dash-avatar-menu trong styles/dashboard.css
const MENU_WIDTH = 200;

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingFor, setCreatingFor] = useState(null); // nfc_card_id đang tạo album

  // ─── Sidebar thu gọn / mở rộng ─────────────────────────────
  const [collapsed, setCollapsed] = useState(false);

  // ─── Menu avatar (Cài đặt / Tìm hiểu thêm / Đăng xuất) ─────
  // Menu được render qua Portal (ra ngoài <aside>) vì <aside> có
  // overflow:hidden để phục vụ animation thu/mở sidebar — nếu menu nằm
  // trong đó, phần vượt quá bề rộng sidebar (đặc biệt lúc collapsed,
  // rộng chỉ 76px) sẽ bị CẮT MẤT chữ thay vì tràn ra ngoài như dropdown
  // bình thường. avatarMenuRef vẫn giữ để đo vị trí nút + nhận diện
  // click "bên trong nút"; avatarMenuPanelRef nhận diện click "bên
  // trong menu đã portal ra ngoài" — cả 2 cần cho logic đóng khi click
  // ra ngoài bên dưới.
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [avatarMenuPos, setAvatarMenuPos] = useState({ left: 0, bottom: 0 });
  const avatarMenuRef = useRef(null);
  const avatarMenuPanelRef = useRef(null);

  // ─── Đổi ảnh đại diện ───────────────────────────────────────
  const avatarFileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // ─── Modal Cài đặt ──────────────────────────────────────────
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("language"); // language | theme | profile
  const [lang, setLangState] = useState("vi");
  const [theme, setThemeState] = useState("light");
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // ─── Modal Tìm hiểu thêm ────────────────────────────────────
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
    const u = getUser();
    setUser(u);
    setProfileName(u?.name || "");
    setProfilePhone(u?.phone || "");
    setProfileAddress(u?.address || "");
    // Đồng bộ các tuỳ chọn đã lưu ở localStorage — làm ở effect (chạy
    // sau khi mount trên client) thay vì trong useState() initializer để
    // tránh lệch nội dung giữa lần render server và lần hydrate client.
    setCollapsed(getSidebarCollapsed());
    setLangState(getLang());
    setThemeState(applyStoredTheme());
    loadData();
    // Cache localStorage có thể cũ (đăng nhập từ trước khi có phone/address,
    // hoặc hồ sơ vừa được sửa ở thiết bị khác) -> lấy bản mới nhất từ DB rồi
    // đồng bộ lại state + cache.
    refreshProfile();
  }, [router]);

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getMe();
      const fresh = updateUser(res.user);
      setUser(fresh);
      setProfileName(fresh?.name || "");
      setProfilePhone(fresh?.phone || "");
      setProfileAddress(fresh?.address || "");
    } catch {
      // Token hết hạn/lỗi mạng -> im lặng, các phần khác của trang vẫn
      // dùng dữ liệu cache trong localStorage như trước.
    }
  };

  // Đóng menu avatar khi click ra ngoài — phải kiểm tra cả nút (avatarMenuRef)
  // lẫn panel đã portal ra <body> (avatarMenuPanelRef), vì 2 phần này giờ
  // không còn lồng nhau trong DOM nữa.
  useEffect(() => {
    const handleClickOutside = (e) => {
      const insideButton = avatarMenuRef.current?.contains(e.target);
      const insideMenu = avatarMenuPanelRef.current?.contains(e.target);
      if (!insideButton && !insideMenu) setAvatarMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [albumRes, cardRes] = await Promise.all([
        albumAPI.getMy(),
        nfcAPI.myCards(),
      ]);
      setAlbums(albumRes.albums || []);
      setCards(cardRes.cards || []);
    } catch (err) {
      setError(err.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    // Dùng hard redirect (window.location) thay vì router.push (soft nav):
    // router.push giữ nguyên Next.js Router Cache/state trong bộ nhớ, có
    // thể khiến trang /auth hoặc / sau đó vẫn đọc lại thông tin phiên cũ
    // trước khi kịp re-check localStorage. window.location.href buộc
    // reload toàn bộ trang, đảm bảo trạng thái đăng nhập luôn được đọc
    // lại sạch sẽ từ đầu.
    window.location.href = "/";
  };

  // Mở/đóng menu avatar — khi mở, đo vị trí thật của nút trên viewport
  // (getBoundingClientRect) để menu portal ra <body> render đúng ngay
  // cạnh nút, dùng position:fixed thay vì absolute (vì đã ra khỏi cây
  // DOM của sidebar nên không còn hưởng toạ độ tương đối theo sidebar).
  //
  // Menu LUÔN bung sang BÊN PHẢI của sidebar (flyout), không căn giữa
  // theo bề rộng sidebar nữa — trước đây lúc sidebar thu gọn chỉ rộng
  // 76px mà menu rộng 200px, căn giữa sẽ đẩy mép trái ra thành số âm,
  // tức là lọt ra NGOÀI bên trái màn hình và bị trình duyệt cắt mất.
  const toggleAvatarMenu = () => {
    setAvatarMenuOpen((prev) => {
      const next = !prev;
      if (next && avatarMenuRef.current) {
        const rect = avatarMenuRef.current.getBoundingClientRect();
        const gap = 8;
        let left = rect.right + gap; // ngay sát mép phải sidebar/nút
        // Phòng trường hợp màn hình quá hẹp khiến menu tràn ra ngoài bên
        // phải viewport thì kéo lùi lại cho vừa, không để mất luôn cạnh phải.
        if (left + MENU_WIDTH > window.innerWidth - gap) {
          left = window.innerWidth - MENU_WIDTH - gap;
        }
        setAvatarMenuPos({
          left,
          // Căn đáy menu trùng đáy nút avatar, để menu mở lên phía trên
          // theo chiều dọc giống trước, nhưng giờ lệch hẳn sang phải.
          bottom: window.innerHeight - rect.bottom,
        });
      }
      return next;
    });
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // cho phép chọn lại cùng 1 file lần nữa nếu cần
    if (!file) return;

    setAvatarError("");
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await authAPI.uploadAvatar(formData);
      const updated = updateUser(res.user);
      setUser(updated);
    } catch (err) {
      setAvatarError(err.message || "Không upload được ảnh đại diện");
    } finally {
      setAvatarUploading(false);
    }
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      persistSidebarCollapsed(next);
      return next;
    });
  };

  const handleLangChange = (value) => {
    persistLang(value);
    setLangState(value);
  };

  const handleThemeChange = (value) => {
    persistTheme(value);
    setThemeState(value);
  };

  const handleSaveProfile = async () => {
    setProfileError("");
    setProfileSaving(true);
    try {
      const res = await authAPI.updateMe({
        name: profileName.trim() || user?.name,
        phone: profilePhone.trim(),
        address: profileAddress.trim(),
      });
      // Đồng bộ lại cache localStorage với dữ liệu vừa lưu thành công ở DB
      const updated = updateUser(res.user);
      setUser(updated);
      setProfileName(updated?.name || "");
      setProfilePhone(updated?.phone || "");
      setProfileAddress(updated?.address || "");
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileError(err.message || "Không lưu được hồ sơ");
    } finally {
      setProfileSaving(false);
    }
  };

  // 1 thẻ NFC active nhưng chưa có album -> cần bấm "Hoàn tất tạo album"
  const albumByCardId = new Map(albums.map((a) => [a.nfc_card_id, a]));

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

  if (loading) {
    return (
      <div className="dash-page-loading">
        <div className="spinner" />
      </div>
    );
  }

  const settingsTabs = [
    { key: "language", label: t(lang, "settingsLanguage"), icon: "🌐" },
    { key: "theme", label: t(lang, "settingsTheme"), icon: "🎨" },
    { key: "profile", label: t(lang, "settingsProfile"), icon: "👤" },
  ];

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className={`dash-sidebar ${collapsed ? "is-collapsed" : ""}`}>
        {/* Logo + nút hamburger thu/mở sidebar */}
        <div className="dash-sidebar__top">
          {!collapsed && <Logo className="dash-sidebar__logo" size={50} />}
          <button
            onClick={toggleSidebar}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            className="dash-sidebar__toggle"
          >
            ☰
          </button>
        </div>

        <nav className="dash-nav">
          <Link
            href="/dashboard"
            title={t(lang, "dashboard")}
            className="dash-nav__link is-active"
          >
            <span>📊</span>
            {!collapsed && <span>{t(lang, "dashboard")}</span>}
          </Link>
          <Link
            href="/activate"
            title={t(lang, "activateNfc")}
            className="dash-nav__link"
          >
            <span>🔑</span>
            {!collapsed && <span>{t(lang, "activateNfc")}</span>}
          </Link>
          {isAdmin() && (
            <Link
              href="/admin"
              title={t(lang, "admin")}
              className="dash-nav__link"
            >
              <span>🛠</span>
              {!collapsed && <span>{t(lang, "admin")}</span>}
            </Link>
          )}
        </nav>

        {/* Avatar — click để mở menu Cài đặt / Tìm hiểu thêm / Đăng xuất.
            Dropdown menu KHÔNG còn nằm trong div này — đã chuyển ra
            Portal (render ngay dưới, sau </aside>) để không bị overflow:hidden
            của <aside> cắt mất chữ khi tràn ra ngoài bề rộng sidebar. */}
        <div ref={avatarMenuRef} className="dash-sidebar__footer">
          <button
            onClick={toggleAvatarMenu}
            className={`dash-avatar-btn ${avatarMenuOpen ? "is-open" : ""}`}
          >
            <span className="dash-avatar-circle">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" />
              ) : (
                (user?.name || "?").trim().charAt(0).toUpperCase()
              )}
            </span>
            {!collapsed && (
              <span className="dash-avatar-name">
                {user?.name || t(lang, "account")}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Menu Cài đặt/Tìm hiểu thêm/Đăng xuất — portal ra <body>, định vị
          bằng position:fixed theo toạ độ đã đo lúc bấm nút (toggleAvatarMenu).
          typeof document check để tránh lỗi lúc SSR (document không tồn tại
          trên server). left/bottom là giá trị ĐỘNG duy nhất còn giữ inline. */}
      {avatarMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={avatarMenuPanelRef}
            className="dash-avatar-menu"
            style={{ left: avatarMenuPos.left, bottom: avatarMenuPos.bottom }}
          >
            <button
              onClick={() => {
                setSettingsOpen(true);
                setAvatarMenuOpen(false);
              }}
              className="dash-menu-item"
            >
              ⚙️ {t(lang, "settings")}
            </button>
            <button
              onClick={() => {
                setLearnMoreOpen(true);
                setAvatarMenuOpen(false);
              }}
              className="dash-menu-item"
            >
              ❓ {t(lang, "learnMore")}
            </button>
            <div className="dash-menu-divider" />
            <button onClick={handleLogout} className="dash-menu-item is-danger">
              🚪 {t(lang, "logout")}
            </button>
          </div>,
          document.body,
        )}

      {/* Nội dung */}
      <div className="dash-content">
        <div className="container dash-container-inner">
          {/* Chào mừng */}
          <div className="dash-header">
            <div>
              <h1 className="dash-header__title">
                {t(lang, "greeting")} {user?.name || "bạn"} 👋
              </h1>
              <p className="dash-header__subtitle">
                {t(lang, "journeySubtitle")}
              </p>
            </div>
            <Link href="/activate" className="btn btn-primary dash-header__cta">
              🔑 {t(lang, "activateNewCard")}
            </Link>
          </div>

          {error && <div className="dash-error">{error}</div>}

          {/* Thống kê */}
          <div className="dash-stats">
            <div className="card dash-stat">
              <p className="dash-stat__label">
                {t(lang, "provincesCollected")}
              </p>
              <p className="dash-stat__value is-primary">
                {collectedCount}/{TOTAL_PROVINCES}
              </p>
              <div className="dash-stat__progress-track">
                <div
                  className="dash-stat__progress-bar"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="card dash-stat">
              <p className="dash-stat__label">{t(lang, "memoryAlbums")}</p>
              <p className="dash-stat__value">{albums.length}</p>
            </div>

            <div className="card dash-stat">
              <p className="dash-stat__label">{t(lang, "totalViews")}</p>
              <p className="dash-stat__value">{totalViews}</p>
            </div>
          </div>

          {/* Bộ sưu tập */}
          <h2 className="dash-section-title">{t(lang, "myCollection")}</h2>

          {cards.length === 0 ? (
            <div className="card dash-empty">
              <p className="dash-empty__icon">🗺</p>
              <p className="dash-empty__text">
                Bạn chưa kích hoạt mảnh ghép NFC nào cả
              </p>
              <Link href="/activate" className="btn btn-primary">
                Kích hoạt ngay
              </Link>
            </div>
          ) : (
            <div className="dash-cards-grid">
              {cards.map((card) => {
                const album = albumByCardId.get(card.id);
                return (
                  <div key={card.id} className="card dash-card">
                    <div className="dash-card__thumb">
                      {card.thumbnail_url ? (
                        <img
                          src={card.thumbnail_url}
                          alt={card.province_name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="dash-card__thumb-placeholder">🗺</div>
                      )}
                    </div>
                    <div className="dash-card__body">
                      <h3 className="dash-card__title">{card.province_name}</h3>
                      <p className="dash-card__serial">
                        Serial: {card.serial_code}
                      </p>

                      {album ? (
                        <Link
                          href={`/album/${album.id}`}
                          className="btn btn-outline dash-card__action"
                        >
                          📸 Xem album ({album.media_count || 0} ảnh)
                        </Link>
                      ) : (
                        <button
                          className="btn btn-primary dash-card__action"
                          disabled={creatingFor === card.id}
                          onClick={() => handleCreateAlbum(card)}
                        >
                          {creatingFor === card.id
                            ? "Đang tạo..."
                            : "✨ Hoàn tất tạo album"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Modal: Cài đặt ─────────────────────────────────── */}
      {settingsOpen && (
        <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="card settings-panel"
          >
            {/* Danh sách tab */}
            <div className="settings-tabs">
              <h2 className="settings-tabs__title">{t(lang, "settings")}</h2>
              {settingsTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSettingsTab(tab.key)}
                  className={`settings-tab ${settingsTab === tab.key ? "is-active" : ""}`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Nội dung tab */}
            <div className="settings-content">
              <button
                onClick={() => setSettingsOpen(false)}
                aria-label={t(lang, "close")}
                className="settings-close"
              >
                ✕
              </button>

              {settingsTab === "language" && (
                <div className="settings-section">
                  <h3>{t(lang, "settingsLanguage")}</h3>
                  <p className="settings-section__desc">
                    {t(lang, "languageDesc")}
                  </p>
                  <div className="settings-btn-row">
                    <button
                      onClick={() => handleLangChange("vi")}
                      className={
                        lang === "vi" ? "btn btn-primary" : "btn btn-outline"
                      }
                    >
                      🇻🇳 Tiếng Việt
                    </button>
                    <button
                      onClick={() => handleLangChange("en")}
                      className={
                        lang === "en" ? "btn btn-primary" : "btn btn-outline"
                      }
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === "theme" && (
                <div className="settings-section">
                  <h3>{t(lang, "settingsTheme")}</h3>
                  <p className="settings-section__desc">
                    {t(lang, "themeDesc")}
                  </p>
                  <div className="settings-btn-row">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={
                        theme === "light"
                          ? "btn btn-primary"
                          : "btn btn-outline"
                      }
                    >
                      ☀️ {t(lang, "themeLight")}
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={
                        theme === "dark" ? "btn btn-primary" : "btn btn-outline"
                      }
                    >
                      🌙 {t(lang, "themeDark")}
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === "profile" && (
                <div className="settings-section">
                  <h3>{t(lang, "settingsProfile")}</h3>

                  {/* Ảnh đại diện */}
                  <div className="profile-avatar-row">
                    <span className="profile-avatar-circle">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="" />
                      ) : (
                        (user?.name || "?").trim().charAt(0).toUpperCase()
                      )}
                    </span>
                    <div>
                      <input
                        ref={avatarFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleAvatarFileChange}
                        className="hidden-file-input"
                      />
                      <button
                        type="button"
                        className="btn btn-outline profile-avatar-upload-btn"
                        onClick={() => avatarFileInputRef.current?.click()}
                        disabled={avatarUploading}
                      >
                        {avatarUploading
                          ? `${t(lang, "profileAvatarUploading")}…`
                          : t(lang, "profileAvatarChange")}
                      </button>
                      {avatarError && (
                        <p className="profile-avatar-error">{avatarError}</p>
                      )}
                    </div>
                  </div>

                  <div className="profile-field">
                    <label className="profile-field__label">
                      {t(lang, "profileName")}
                    </label>
                    <input
                      className="input"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field__label">
                      {t(lang, "profileEmail")}
                    </label>
                    <input
                      className="input"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field__label">
                      {t(lang, "profilePhone")}
                    </label>
                    <input
                      className="input"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder={t(lang, "profilePhonePlaceholder")}
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field__label">
                      {t(lang, "profileAddress")}
                    </label>
                    <textarea
                      className="input"
                      rows={2}
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder={t(lang, "profileAddressPlaceholder")}
                    />
                  </div>
                  <p className="profile-note">{t(lang, "profileSaveNote")}</p>
                  {profileError && (
                    <p className="profile-error">{profileError}</p>
                  )}
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-primary"
                    disabled={profileSaving}
                  >
                    {profileSaving
                      ? `${t(lang, "save")}…`
                      : profileSaved
                        ? `✓ ${t(lang, "saved")}`
                        : t(lang, "save")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Tìm hiểu thêm ───────────────────────────── */}
      {learnMoreOpen && (
        <div className="modal-overlay" onClick={() => setLearnMoreOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="card learnmore-panel"
          >
            <div className="learnmore-icon">🗺</div>
            <h2 className="learnmore-title">VinaTap</h2>
            <p className="learnmore-desc">
              VinaTap là thẻ NFC lưu giữ kỷ niệm — mỗi thẻ gắn với 1 tỉnh thành,
              khi chạm điện thoại vào thẻ sẽ mở album ảnh, video và lời nhắn
              riêng của bạn. Sưu tầm đủ thẻ để hoàn thành bản đồ 34 tỉnh thành
              Việt Nam.
            </p>
            <button
              onClick={() => setLearnMoreOpen(false)}
              className="btn btn-primary"
            >
              {t(lang, "close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
