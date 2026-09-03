"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { nfcAPI, albumAPI } from "@/lib/api";
import { isLoggedIn, getUser } from "@/lib/auth";
import {
  Radio,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Compass,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  Share2,
  Eye,
  Camera,
} from "lucide-react";

import Dino404 from "@/components/ui/Dino404";
import DinoLoader from "@/components/ui/DinoLoader";
import "./TapPage.css";

const REGION_BADGES = {
  north: { label: "Miền Bắc", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  central: { label: "Miền Trung", bg: "#fefce8", color: "#ca8a04", border: "#fef08a" },
  south: { label: "Miền Nam", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
};

export default function TapPage() {
  const { token } = useParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [album, setAlbum] = useState(null);
  const [status, setStatus] = useState("loading"); // loading|unclaimed|owned|claimed|error
  const [msg, setMsg] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [activeTab, setActiveTab] = useState("album"); // 'album' | 'guide'

  useEffect(() => {
    if (!token) return;
    loadCard();
  }, [token]);

  const loadCard = async () => {
    try {
      const res = await nfcAPI.tap(token);
      const c = res.card;
      setCard(c);

      if (c.status === "disabled") {
        setStatus("error");
        setMsg("Thẻ này đã bị vô hiệu hóa bởi quản trị viên.");
        return;
      }

      if (c.album) {
        setAlbum(c.album);
      }

      if (!c.has_owner) {
        setStatus("unclaimed"); // Chưa có chủ — mời claim
        return;
      }

      // Đã có chủ — kiểm tra xem mình có phải chủ không
      const me = getUser();
      if (me && c.owner_name === me.name) {
        setStatus("owned");
      } else {
        setStatus("claimed"); // Người khác đang giữ
      }
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Thẻ NFC không tồn tại hoặc đường dẫn không chính xác.");
    }
  };

  const handleClaim = async () => {
    if (!isLoggedIn()) {
      sessionStorage.setItem("pending_nfc_token", token);
      router.push(`/auth?redirect=/t/${token}`);
      return;
    }
    setClaiming(true);
    try {
      await nfcAPI.claim(token);
      const cards = await nfcAPI.myCards();
      const myCard = cards.cards?.find((c) => c.nfc_token === token);
      if (myCard && !myCard.album_id) {
        const alb = await albumAPI.create({ nfc_card_id: myCard.id });
        router.push(`/album/${alb.album.id}`);
      } else if (myCard?.album_id) {
        router.push(`/album/${myCard.album_id}`);
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err) {
      setMsg(err.message || "Kích hoạt thất bại, vui lòng thử lại sau.");
      setClaiming(false);
    }
  };

  if (status === "loading") {
    return (
      <DinoLoader
        text="Đang nhận diện chip NFC..."
        subtext="Vui lòng giữ điện thoại gần mảnh ghép VinaTap"
        size={260}
        fullScreen={true}
      />
    );
  }

  if (status === "error") {
    return (
      <Dino404
        title="Thẻ NFC Không Tồn Tại"
        message={msg || "Mã thẻ này không tồn tại trong hệ thống VinaTap hoặc đã bị vô hiệu hóa."}
        backBtnText="Về Trang Chủ"
      />
    );
  }

  const regionInfo = REGION_BADGES[card?.region] || REGION_BADGES.north;

  return (
    <div className="tap-page-wrapper">
      {/* Header Glass */}
      <nav className="tap-nav-glass">
        <div className="tap-nav-inner">
          <Logo />
          <div className="tap-nav-chip">
            <span className="tap-nav-chip-dot" />
            <span>NFC CHÍNH HÃNG</span>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="tap-main-container">
        {/* ─── Hero Province Showcase Card ─── */}
        <section className="tap-hero-card">
          <div className="tap-hero-img-box">
            {card?.thumbnail_url ? (
              <img
                src={card.thumbnail_url}
                alt={card.province_name}
                className="tap-hero-img"
              />
            ) : (
              <div style={{ fontSize: "4.5rem", opacity: 0.85 }}>🗺️</div>
            )}
            <div className="tap-hero-gradient-overlay" />

            {/* Region Badge */}
            <div
              className="tap-hero-region-badge"
              style={{
                background: regionInfo.bg,
                color: regionInfo.color,
                borderColor: regionInfo.border,
              }}
            >
              {regionInfo.label}
            </div>

            {/* NFC Chip Indicator */}
            <div className="tap-hero-nfc-badge">
              <Radio size={14} className="text-orange-400" />
              <span>Mảnh Ghép Gỗ 3D</span>
            </div>

            <div className="tap-hero-img-title">
              <h1 className="tap-hero-title">{card?.province_name}</h1>
            </div>
          </div>

          <div className="tap-hero-content">
            <p className="tap-hero-desc">
              {card?.description || "Khám phá các danh lam thắng cảnh, ẩm thực và văn hóa đặc trưng tại đây."}
            </p>

            <div className="tap-hero-meta-grid">
              {card?.serial_code && (
                <div className="tap-meta-pill">
                  <ShieldCheck size={14} style={{ color: "#ea580c" }} />
                  <span>Serial: <strong>{card.serial_code}</strong></span>
                </div>
              )}
              {card?.landmarks && card.landmarks.length > 0 && (
                <div className="tap-meta-pill">
                  <MapPin size={14} style={{ color: "#0284c7" }} />
                  <span>{card.landmarks.length} địa danh nổi tiếng</span>
                </div>
              )}
              <div className="tap-meta-pill">
                <Compass size={14} style={{ color: "#16a34a" }} />
                <span>Bản đồ du lịch số</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Dual Tab Switcher: Album Kỷ Niệm vs Cẩm Nang Du Lịch ─── */}
        <div className="tap-tabs-bar">
          <button
            type="button"
            className={`tap-tab-btn ${activeTab === "album" ? "active" : ""}`}
            onClick={() => setActiveTab("album")}
          >
            <Camera size={16} />
            <span>📸 Album Kỷ Niệm</span>
          </button>
          <button
            type="button"
            className={`tap-tab-btn ${activeTab === "guide" ? "active" : ""}`}
            onClick={() => setActiveTab("guide")}
          >
            <Compass size={16} />
            <span>🗺️ Cẩm Nang Du Lịch</span>
          </button>
        </div>

        {/* ─── TAB 1: ALBUM KỶ NIỆM ─── */}
        {activeTab === "album" && (
          <div className="tap-content-card">
            {/* TRƯỜNG HỢP 1: CHƯA CÓ CHỦ (UNCLAIMED) */}
            {status === "unclaimed" && (
              <div className="tap-unclaimed-box">
                <div className="tap-unclaimed-icon">
                  <Sparkles size={28} />
                </div>
                <h2 className="tap-unclaimed-title">Mảnh Ghép Chưa Có Chủ Nhân!</h2>
                <p className="tap-unclaimed-desc">
                  {isLoggedIn()
                    ? `Kích hoạt ngay để sở hữu mảnh ghép ${card?.province_name} và tạo Album kỷ niệm check-in của riêng bạn.`
                    : `Đăng nhập để nhận quyền sở hữu mảnh ghép ${card?.province_name} vào bộ sưu tập bản đồ số.`}
                </p>

                {msg && (
                  <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                    {msg}
                  </p>
                )}

                <button
                  className="tap-btn-primary"
                  onClick={handleClaim}
                  disabled={claiming}
                >
                  <Zap size={18} />
                  <span>
                    {claiming
                      ? "Đang kết nối chip NFC..."
                      : isLoggedIn()
                      ? "Kích Hoạt Quyền Sở Hữu"
                      : "Đăng Nhập Để Kích Hoạt"}
                  </span>
                </button>
              </div>
            )}

            {/* TRƯỜNG HỢP 2: ĐÃ CÓ ALBUM (MỞ CHO TẤT CẢ MỌI NGƯỜI CÙNG XEM) */}
            {status !== "unclaimed" && album && (
              <>
                <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {status === "owned" ? "✨ Mảnh Ghép Của Bạn" : `✨ Nhật Ký Của ${card?.owner_name || "Thành viên VinaTap"}`}
                  </span>
                </div>

                <div className="tap-album-preview-card">
                  <img
                    src={album.cover_url || card?.thumbnail_url || "/images/placeholder-album.png"}
                    alt={album.title}
                    className="tap-album-cover"
                  />
                  <div className="tap-album-info">
                    <h3 className="tap-album-title">{album.title || `Nhật ký ${card?.province_name}`}</h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                      Người tạo: <strong>{card?.owner_name || "Thành viên VinaTap"}</strong>
                    </p>
                    <div className="tap-album-meta">
                      <span>📸 {album.media_count || 0} ảnh & video</span>
                      <span>👁️ {album.view_count || 0} lượt xem</span>
                    </div>
                  </div>
                </div>

                <Link href={`/album/${album.share_code || album.id}`} className="tap-btn-primary">
                  <ImageIcon size={18} />
                  <span>
                    {status === "owned"
                      ? "Xem Album Kỷ Niệm Của Bạn"
                      : `Mở Xem Album Ảnh Của ${card?.owner_name || "Bạn Bè"}`}
                  </span>
                </Link>
              </>
            )}

            {/* TRƯỜNG HỢP 3: MÌNH LÀ CHỦ NHƯNG CHƯA TẠO ALBUM */}
            {status === "owned" && !album && (
              <div className="tap-unclaimed-box">
                <div className="tap-unclaimed-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="tap-unclaimed-title">Bạn Đã Sở Hữu Mảnh Ghép!</h2>
                <p className="tap-unclaimed-desc">
                  Mảnh ghép <strong>{card?.province_name}</strong> đã nằm trong bộ sưu tập của bạn. Hãy tạo ngay Album đầu tiên để lưu lại những kỷ niệm đẹp!
                </p>

                <Link href="/customer/dashboard" className="tap-btn-primary">
                  <Camera size={18} />
                  <span>Tạo Album Ảnh & Video Ngay</span>
                </Link>
              </div>
            )}

            {/* TRƯỜNG HỢP 4: BẠN BÈ / KHÁCH CHẠM VÀO KHI CHỦ NHÂN CHƯA UP ALBUM */}
            {status === "claimed" && !album && (
              <div className="tap-unclaimed-box">
                <div className="tap-unclaimed-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  <Camera size={28} />
                </div>
                <h2 className="tap-unclaimed-title">Bộ Sưu Tập Của {card?.owner_name || "Bạn Bè"}</h2>
                <p className="tap-unclaimed-desc">
                  Mảnh ghép <strong>{card?.province_name}</strong> này thuộc về <strong>{card?.owner_name}</strong>. Chủ nhân đang chuẩn bị đăng tải những bức ảnh kỷ niệm cho chuyến đi. Mời bạn cùng khám phá cẩm nang du lịch bên dưới nhé!
                </p>
                <button
                  type="button"
                  className="tap-btn-secondary"
                  onClick={() => setActiveTab("guide")}
                >
                  <Compass size={16} />
                  <span>Khám Phá Cẩm Nang Du Lịch {card?.province_name}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: CẨM NANG DU LỊCH TỈNH ─── */}
        {activeTab === "guide" && (
          <div className="tap-content-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                📍 Danh Lam Thắng Cảnh Nổi Bật
              </h3>
              <Link
                href={`/province/${card?.province_slug}`}
                style={{ fontSize: "0.8rem", color: "#ea580c", fontWeight: 700, textDecoration: "none" }}
              >
                Xem tất cả →
              </Link>
            </div>

            {/* Danh sách địa danh */}
            {card?.landmarks && card.landmarks.length > 0 ? (
              <div className="tap-landmarks-list">
                {card.landmarks.slice(0, 4).map((lm) => (
                  <div key={lm.id} className="tap-landmark-item">
                    <img
                      src={lm.image_url || card.thumbnail_url || "/images/placeholder-landmark.png"}
                      alt={lm.name}
                      className="tap-landmark-thumb"
                    />
                    <div className="tap-landmark-info">
                      <h4 className="tap-landmark-name">{lm.name}</h4>
                      <p className="tap-landmark-addr">{lm.address || card.province_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, textAlign: "center", padding: "1rem 0" }}>
                Chưa có danh sách địa danh cho tỉnh này.
              </p>
            )}

            {/* Video YouTube giới thiệu */}
            {card?.youtube_url && (
              <div className="tap-video-frame">
                <iframe
                  src={card.youtube_url
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "youtube.com/embed/")}
                  style={{ width: "100%", height: 200, border: "none", display: "block" }}
                  allowFullScreen
                  title={`Giới thiệu ${card?.province_name}`}
                />
              </div>
            )}

            {/* Nút xem toàn bộ cẩm nang */}
            <Link
              href={`/province/${card?.province_slug}`}
              className="tap-btn-secondary"
            >
              <Compass size={16} />
              <span>Mở Toàn Bộ Cẩm Nang & Bản Đồ {card?.province_name}</span>
            </Link>
          </div>
        )}

        {/* Footer info */}
        <div className="tap-footer-badge">
          <ShieldCheck size={14} />
          <span>VinaTap Vietnam — Bản Đồ Gỗ Du Lịch Thông Minh NFC</span>
        </div>
      </main>
    </div>
  );
}
