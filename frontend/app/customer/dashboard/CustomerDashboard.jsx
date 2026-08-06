"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { LayoutDashboard, KeyRound, ShieldCheck } from "lucide-react";
import { albumAPI, nfcAPI, authAPI } from "../../../lib/api";
import { getUser, updateUser, clearAuth, isAdmin, isLoggedIn } from "../../../lib/auth";
import { applyStoredTheme, getLang } from "../../../lib/prefs";
import { t } from "../../../lib/i18n";
import "../../../styles/dashboard.css";

const REGION_LABEL = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
  island: "Hải đảo",
};

const TOTAL_PROVINCES = 34;

export default function CustomerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") return getUser();
    return null;
  });
  const [albums, setAlbums] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingFor, setCreatingFor] = useState(null); // nfc_card_id đang tạo album
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

  // Nghe sự kiện từ updateUser() (lib/auth.js) — cùng cơ chế với
  // settings/layout.js và admin/layout.js, xem chú thích chi tiết ở đó.
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
      // Token hết hạn/lỗi mạng -> im lặng, các phần khác của trang vẫn
      // dùng dữ liệu cache trong localStorage như trước.
    }
  };

  const loadData = async () => {
    if (!isLoggedIn()) return;
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

  // Menu nav của customer dashboard — admin dashboard sau này sẽ tự khai
  // báo danh sách khác (quản lý tỉnh, user, serial NFC...) và truyền vào
  // cùng component <Sidebar>, không đụng tới file này.
  const navItems = [
    {
      href: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: t(lang, "dashboard"),
    },
    {
      href: "/activate",
      icon: <KeyRound size={20} />,
      label: t(lang, "activateNfc"),
    },
    ...(isAdmin()
      ? [
          {
            href: "/admin",
            icon: <ShieldCheck size={20} />,
            label: t(lang, "admin"),
          },
        ]
      : []),
  ];

  return (
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

          {loading ? (
            <div className="dash-loading-box">
              <div className="spinner" />
            </div>
          ) : cards.length === 0 ? (
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
  );
}
