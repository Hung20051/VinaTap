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
  ArrowRight,
  ShieldCheck,
  Zap,
  Share2,
  Eye,
  Camera,
  Utensils,
  Calendar,
  X,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  QrCode,
} from "lucide-react";

import Dino404 from "@/components/ui/Dino404";
import DinoLoader from "@/components/ui/DinoLoader";
import "./TapPage.css";

const REGION_BADGES = {
  north: { label: "Miền Bắc", bg: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "rgba(37, 99, 235, 0.3)" },
  central: { label: "Miền Trung", bg: "rgba(234, 88, 12, 0.1)", color: "#ea580c", border: "rgba(234, 88, 12, 0.3)" },
  south: { label: "Miền Nam", bg: "rgba(22, 163, 74, 0.1)", color: "#16a34a", border: "rgba(22, 163, 74, 0.3)" },
};

const CATEGORY_MAP = {
  attraction: { label: "Danh thắng", color: "#3b82f6" },
  beach: { label: "Bãi biển", color: "#06b6d4" },
  temple: { label: "Di tích", color: "#eab308" },
  nature: { label: "Thiên nhiên", color: "#10b981" },
  market: { label: "Chợ", color: "#ec4899" },
  food: { label: "Ẩm thực", color: "#f97316" },
};

export default function TapPage() {
  const { token } = useParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [album, setAlbum] = useState(null);
  const [albumMedia, setAlbumMedia] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [foods, setFoods] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [status, setStatus] = useState("loading"); // loading|unclaimed|owned|claimed|error
  const [msg, setMsg] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [activeTab, setActiveTab] = useState("guide"); // 'guide' | 'food' | 'album' (for desktop)
  const [showWelcome, setShowWelcome] = useState(true);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedModalItem, setSelectedModalItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // 🔄 Đồng bộ hóa Lịch sử Trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== "#detail") {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    if (window.location.hash === "#detail") {
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const handleOpenDetail = () => {
    if (window.location.hash !== "#detail") {
      window.history.pushState({ view: "detail" }, "", window.location.pathname + "#detail");
    }
    setShowWelcome(false);
  };

  const handleBackToWelcome = () => {
    setEnvelopeOpened(true); // When returning from navbar, keep it open or let them view postcard
    if (window.location.hash === "#detail") {
      window.history.back();
    } else {
      setShowWelcome(true);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadCard();
  }, [token]);

  const loadCard = async () => {
    try {
      const res = await nfcAPI.tap(token);
      const c = res.card;
      setCard(c);
      setLandmarks(c.landmarks || []);
      setFoods(c.foods || []);
      setFestivals(c.festivals || []);

      if (c.status === "disabled") {
        setStatus("error");
        setMsg("Thẻ này đã bị vô hiệu hóa bởi quản trị viên.");
        return;
      }

      if (c.album) {
        setAlbum(c.album);
        setAlbumMedia(c.albumMedia || []);
        if (c.album.media_count > 0) {
          setActiveTab("album");
        }
      }

      if (!c.has_owner) {
        setStatus("unclaimed");
        return;
      }

      const me = getUser();
      const isOwner =
        me &&
        ((c.owner_user_id && me.id === c.owner_user_id) ||
          (c.owner_name && me.name === c.owner_name));
      if (isOwner) {
        setStatus("owned");
      } else {
        setStatus("claimed");
      }
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Thẻ NFC không tồn tại hoặc đường dẫn không chính xác.");
    }
  };

  const [creatingAlbum, setCreatingAlbum] = useState(false);

  const handleCreateAlbum = async () => {
    if (!isLoggedIn()) {
      sessionStorage.setItem("pending_nfc_token", token);
      router.push(`/auth?redirect=/t/${token}`);
      return;
    }
    const targetCardId = card?.id;
    if (!targetCardId) {
      router.push("/customer/dashboard");
      return;
    }
    setCreatingAlbum(true);
    try {
      const res = await albumAPI.create({ nfc_card_id: targetCardId });
      const targetAlbum = res.album || res;
      const targetSlug = targetAlbum?.share_code || targetAlbum?.id;
      if (targetSlug) {
        router.push(`/album/${targetSlug}`);
      } else {
        await loadCard();
      }
    } catch (err) {
      console.error("handleCreateAlbum error:", err);
      await loadCard();
    } finally {
      setCreatingAlbum(false);
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
        router.push(`/album/${alb.album?.share_code || alb.album.id}`);
      } else if (myCard?.album_id) {
        router.push(`/album/${myCard.share_code || myCard.album_id}`);
      } else {
        router.push("/customer/dashboard");
      }
    } catch (err) {
      setMsg(err.message || "Kích hoạt thất bại, vui lòng thử lại sau.");
      setClaiming(false);
    }
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href.split("#")[0];
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    const url = getShareUrl();
    if (navigator.share) {
      navigator.share({
        title: `Mảnh ghép NFC VinaTap — ${card?.province_name}`,
        text: `Khám phá cẩm nang du lịch và nhật ký ảnh ${card?.province_name} cùng VinaTap!`,
        url,
      });
    } else {
      handleCopyLink();
    }
  };

  if (status === "loading") {
    return (
      <DinoLoader
        text="Đang nhận diện chip NFC..."
        subtext="Vui lòng giữ điện thoại gần thẻ thông minh"
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
  const pName = card?.province_name || "Việt Nam";

  // 💌 1. MÀN HÌNH CHÀO MỪNG DU LỊCH CAO CẤP (LUXURY FOLIO UNBOXING & TRAVEL PASS)
  if (showWelcome) {
    return (
      <div className="tap-welcome-screen">
        {/* ── Background điện ảnh với độ mờ quang học & ánh sáng hoàng hôn ── */}
        <div className="tap-welcome-bg-wrap">
          {card?.thumbnail_url ? (
            <img
              src={card.thumbnail_url}
              alt={pName}
              className="tap-welcome-bg-img"
            />
          ) : (
            <div className="tap-welcome-bg-fallback" />
          )}
          <div className="tap-welcome-overlay" />
          <div className="tap-welcome-ambient-glow" />
        </div>

        {/* ── Top Floating Minimal Bar ── */}
        <header className="tap-welcome-top-bar">
          <Logo href="/" />
          <div className="tap-welcome-top-actions">
            <button
              type="button"
              className="tap-top-btn-guide"
              onClick={handleOpenDetail}
              title="Xem cẩm nang & danh lam thắng cảnh"
            >
              <Compass size={15} />
              <span className="tap-top-btn-text">Vào thẳng cẩm nang</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="tap-top-btn-share"
              onClick={() => setShowShareModal(true)}
              title="Chia sẻ & Mã QR"
            >
              <Share2 size={15} />
            </button>
          </div>
        </header>

        {/* ── Trọng tâm: Sân khấu Folio Du Lịch (Tự động thích ứng Desktop & Mobile) ── */}
        <div className="tap-welcome-stage">
          <div className={`tap-welcome-folio ${envelopeOpened ? "is-opened" : ""}`}>
            {/* ══ CÁNH TRÁI (DESKTOP): 3D NFC CARD & DANH THẮNG BIỂU TƯỢNG ══ */}
            <div className="tap-folio-left-wing">
              <div className="tap-folio-hero-img-wrap">
                <img
                  src={card?.thumbnail_url || "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"}
                  alt={pName}
                  className="tap-folio-hero-img"
                />
                <div className="tap-folio-hero-gradient" />
                <div className="tap-folio-pass-badge">
                  <span>🇻🇳 VIETNAM HERITAGE PASS</span>
                </div>
              </div>

              {/* Thẻ 3D NFC Card tương tác */}
              <div className="tap-folio-card-showcase">
                <div className="tap-card-3d-mini">
                  <div className="tap-card-3d-mini-bg">
                    {card?.thumbnail_url && (
                      <img src={card.thumbnail_url} alt={pName} />
                    )}
                    <div className="tap-card-mini-overlay" />
                    <div className="tap-card-mini-hologram" />
                  </div>
                  <div className="tap-card-mini-content">
                    <div className="tap-card-mini-top">
                      <span className="tap-card-mini-logo">VinaTap</span>
                      <div className="tap-card-mini-chip">
                        <Radio size={12} className="tap-mini-nfc-pulse" />
                        <span>NFC 3D</span>
                      </div>
                    </div>
                    <div className="tap-card-mini-center">
                      <span className="tap-card-mini-region" style={{ color: regionInfo.color }}>
                        {regionInfo.label}
                      </span>
                      <h3 className="tap-card-mini-title">{pName}</h3>
                    </div>
                    <div className="tap-card-mini-bottom">
                      <span className="tap-card-mini-serial">
                        #{card?.serial_code || "VN-2026-NFC"}
                      </span>
                      <span className="tap-card-mini-verified">
                        <ShieldCheck size={12} />
                        <span>VERIFIED</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin nhanh tỉnh thành dưới thẻ */}
              <div className="tap-folio-left-footer">
                <div className="tap-folio-stat-item">
                  <Compass size={14} />
                  <span>{landmarks.length} Điểm đến</span>
                </div>
                <span className="tap-folio-stat-divider">•</span>
                <div className="tap-folio-stat-item">
                  <Utensils size={14} />
                  <span>{foods.length} Món ngon</span>
                </div>
                <span className="tap-folio-stat-divider">•</span>
                <div className="tap-folio-stat-item">
                  <Camera size={14} />
                  <span>{album?.media_count || 0} Ảnh check-in</span>
                </div>
              </div>
            </div>

            {/* ══ CÁNH PHẢI: BƯU THIẾP DU LỊCH & CON DẤU SÁP ══ */}
            <div className="tap-folio-right-wing">
              {/* Viền Airmail bưu chính & chỉ vàng */}
              <div className="tap-folio-airmail-ribbon" />
              <div className="tap-folio-gold-trim" />

              {/* Hàng tem & con dấu bưu điện du lịch */}
              <div className="tap-folio-postage-header">
                <div className="tap-envelope-postmark">
                  <div className="tap-postmark-inner">
                    <span className="tap-postmark-star">★ VIETNAM PASS ★</span>
                    <strong className="tap-postmark-city">{pName}</strong>
                    <span className="tap-postmark-year">EST. 2026</span>
                  </div>
                  <div className="tap-postmark-waves">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="tap-envelope-stamp">
                  <div className="tap-stamp-perforation">
                    <div className="tap-stamp-art">
                      <div className="tap-stamp-header">
                        <span className="tap-stamp-country">VIỆT NAM</span>
                        <span className="tap-stamp-value">2026</span>
                      </div>
                      <div className="tap-stamp-icon-wrap">
                        <span className="tap-stamp-flag">🇻🇳</span>
                      </div>
                      <span className="tap-stamp-brand">VINATAP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin chào mừng lữ khách */}
              <div className="tap-folio-recipient-box">
                <div className="tap-envelope-badge-row">
                  <span className="tap-envelope-from-tag">
                    <span className="tap-tag-dot" />
                    BƯU THIẾP ĐỘC BẢN • VINATAP
                  </span>
                  {card?.serial_code && (
                    <span className="tap-envelope-serial-tag">
                      #{card.serial_code}
                    </span>
                  )}
                </div>

                <span className="tap-to-label">Kính gửi lữ khách ghé thăm:</span>
                <h1 className="tap-to-name">{pName}</h1>

                <div className="tap-to-meta-row">
                  <div
                    className="tap-to-region-pill"
                    style={{
                      background: regionInfo.bg,
                      color: regionInfo.color,
                      borderColor: regionInfo.border,
                    }}
                  >
                    <MapPin size={13} />
                    <span>{regionInfo.label} • Mảnh Ghép NFC 3D</span>
                  </div>
                  <div className="tap-to-status-pill">
                    <Radio size={12} style={{ color: "#16a34a" }} />
                    <span>{status === "unclaimed" ? "Chưa kích hoạt" : "Đã kích hoạt"}</span>
                  </div>
                </div>
              </div>

              {/* ── NỘI DUNG THIỆP: CHƯA MỞ vs ĐÃ MỞ ── */}
              {!envelopeOpened ? (
                /* Trạng thái 1: Con Dấu Sáp 3D Mời Chạm */
                <div className="tap-folio-unopened-box">
                  <p className="tap-folio-teaser-text">
                    Mảnh ghép du lịch đã được nhận diện. Hãy chạm vào con dấu sáp hoàng gia để mở bưu thiếp kỷ niệm và cẩm nang khám phá!
                  </p>

                  <div className="tap-envelope-seal-section">
                    <div
                      className="tap-wax-seal-btn"
                      onClick={() => setEnvelopeOpened(true)}
                      role="button"
                      tabIndex={0}
                      title="Chạm để mở bưu thiếp"
                    >
                      <div className="tap-wax-seal-glow" />
                      <div className="tap-wax-seal-scallop">
                        <div className="tap-wax-seal-core">
                          <div className="tap-wax-shine-glint" />
                          <div className="tap-wax-icon-wrap">
                            <Sparkles size={18} className="tap-wax-sparkle" />
                          </div>
                          <span className="tap-wax-text">CHẠM ĐỂ MỞ</span>
                        </div>
                      </div>
                    </div>
                    <div className="tap-envelope-hint">
                      <span className="tap-hint-pulse-dot" />
                      <span>Chạm vào con dấu sáp để mở bưu thiếp</span>
                    </div>
                  </div>

                  <div className="tap-folio-actions-row">
                    <button
                      type="button"
                      className="tap-folio-btn-skip"
                      onClick={handleOpenDetail}
                    >
                      <span>Vào thẳng cẩm nang &amp; mảnh ghép</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Trạng thái 2: Thư Tay Mở Ra & Nút Hành Động */
                <div className="tap-folio-opened-box">
                  <div className="tap-postcard-letter-box">
                    <span className="tap-quote-mark">“</span>
                    <p className="tap-letter-text">
                      Chào mừng bạn đến với <strong>{pName}</strong>! Chiếc thẻ thông minh này đã sẵn sàng lưu giữ những khoảnh khắc đẹp nhất và đồng hành cùng bạn khám phá từng địa danh, món ngon đặc sắc nơi đây.
                    </p>
                    <div className="tap-letter-signature">
                      <span>Đội ngũ VinaTap 💙</span>
                    </div>
                  </div>

                  <div className="tap-folio-action-buttons">
                    {status === "unclaimed" ? (
                      <button
                        type="button"
                        className="tap-btn-gold-claim"
                        onClick={handleClaim}
                        disabled={claiming}
                      >
                        <Zap size={18} />
                        <span>{claiming ? "Đang nhận diện..." : "Kích Hoạt Nhận Mảnh Ghép"}</span>
                      </button>
                    ) : status === "owned" ? (
                      album ? (
                        <Link
                          href={`/album/${album.share_code || album.id}`}
                          className="tap-btn-primary"
                        >
                          <Camera size={18} />
                          <span>Mở Album Kỷ Niệm Của Bạn</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="tap-btn-primary"
                          onClick={handleCreateAlbum}
                          disabled={creatingAlbum}
                        >
                          <Camera size={18} />
                          <span>{creatingAlbum ? "Đang khởi tạo album..." : "Tạo Album Kỷ Niệm Đầu Tiên"}</span>
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        className="tap-btn-primary"
                        onClick={handleOpenDetail}
                      >
                        <Compass size={18} />
                        <span>Khám Phá Cẩm Nang {pName}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="tap-btn-explore-full"
                      onClick={handleOpenDetail}
                    >
                      <span>Xem Toàn Bộ Cẩm Nang &amp; Bản Đồ</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 📖 2. GIAO DIỆN THÔNG MINH TỰ ĐỘNG THÍCH ỨNG (DESKTOP 2 CỘT RỘNG + MOBILE SMART PASS VUỐT GỌN)
  return (
    <div className="tap-page-wrapper">
      {/* ── Navbar Glass Header ── */}
      <nav className="tap-nav-glass">
        <div className="tap-nav-inner">
          <Logo />
          <div className="tap-nav-actions">
            <button
              type="button"
              className="tap-nav-postcard-btn"
              onClick={handleBackToWelcome}
              title="Xem lại thiệp chào mừng"
            >
              <span className="tap-nav-icon">💌</span>
              <span className="tap-nav-text-desktop">Thiệp Chào Mừng</span>
            </button>
            <button
              type="button"
              className="tap-nav-share-btn"
              onClick={() => setShowShareModal(true)}
              title="Chia sẻ thẻ & Mã QR"
            >
              <Share2 size={14} />
              <span className="tap-nav-text-desktop">Chia sẻ</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Desktop 2-Column Responsive Layout (Trải rộng trên máy tính) ── */}
      <main className="tap-desktop-layout">
        {/* CỘT TRÁI: THẺ NFC 3D + THÔNG TIN CHỦ + HÀNH ĐỘNG */}
        <aside className="tap-sidebar-col">
          {/* Thẻ NFC 3D */}
          <div className="tap-card-3d-wrap">
            <div className="tap-card-3d">
              <div className="tap-card-3d-bg">
                {card?.thumbnail_url ? (
                  <img src={card.thumbnail_url} alt={pName} className="tap-card-3d-img" />
                ) : (
                  <div className="tap-card-fallback-art">🗺️</div>
                )}
                <div className="tap-card-overlay" />
                <div className="tap-card-hologram-shine" />
              </div>

              <div className="tap-card-header">
                <div className="tap-card-brand">
                  <span className="tap-brand-logo">VinaTap</span>
                  <span className="tap-brand-badge">PROVINCE PASS</span>
                </div>
                <div className="tap-card-nfc-chip">
                  <Radio size={15} className="tap-nfc-signal" />
                  <span className="tap-chip-label">NFC 3D</span>
                </div>
              </div>

              <div className="tap-card-center">
                <div className="tap-card-region-tag" style={{ color: regionInfo.color }}>
                  {regionInfo.label}
                </div>
                <h2 className="tap-card-name">{pName}</h2>
                <p className="tap-card-slogan">Mảnh ghép bản đồ du lịch số Việt Nam</p>
              </div>

              <div className="tap-card-footer">
                <div className="tap-card-serial-box">
                  <span className="tap-serial-label">SERIAL NUMBER</span>
                  <span className="tap-serial-val">{card?.serial_code || "VN-2026-NFC"}</span>
                </div>
                <div className="tap-card-holo-seal">
                  <ShieldCheck size={18} />
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hộp trạng thái thẻ & CTA */}
          <div className="tap-card-status-box">
            <div className="tap-owner-status">
              {status === "unclaimed" && (
                <div className="tap-status-badge unclaimed">
                  <Sparkles size={15} />
                  <span>Chưa có chủ nhân • Sẵn sàng sở hữu</span>
                </div>
              )}
              {status === "owned" && (
                <div className="tap-status-badge owned">
                  <CheckCircle2 size={15} />
                  <span>Mảnh ghép của bạn (Chính chủ)</span>
                </div>
              )}
              {status === "claimed" && (
                <div className="tap-status-badge claimed">
                  <ShieldCheck size={15} />
                  <span>Thuộc bộ sưu tập của <strong>{card?.owner_name || "Thành viên"}</strong></span>
                </div>
              )}
            </div>

            <p className="tap-card-desc-snippet">
              {card?.description || `Khám phá các danh lam thắng cảnh, ẩm thực và trải nghiệm đặc sắc tại ${pName}.`}
            </p>

            <div className="tap-action-buttons">
              {status === "unclaimed" && (
                <button
                  type="button"
                  className="tap-btn-gold-claim"
                  onClick={handleClaim}
                  disabled={claiming}
                >
                  <Zap size={18} />
                  <span>{claiming ? "Đang nhận diện..." : "Kích Hoạt Nhận Mảnh Ghép"}</span>
                </button>
              )}

              {status === "owned" && (
                <Link
                  href={album ? `/album/${album.share_code || album.id}` : "/customer/dashboard"}
                  className="tap-btn-primary"
                >
                  <Camera size={18} />
                  <span>{album ? "Quản Lý Album Của Bạn" : "Tạo Album Kỷ Niệm Ngay"}</span>
                </Link>
              )}

              {status === "claimed" && album && (
                <Link
                  href={`/album/${album.share_code || album.id}`}
                  className="tap-btn-primary"
                >
                  <Camera size={18} />
                  <span>Xem Nhật Ký {card?.owner_name || "Bạn Bè"}</span>
                </Link>
              )}

              <div className="tap-dual-actions">
                <button
                  type="button"
                  className="tap-btn-icon-label"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 size={15} />
                  <span>Chia sẻ & QR</span>
                </button>

                <Link
                  href={`/province/${card?.province_slug}`}
                  className="tap-btn-icon-label"
                >
                  <ExternalLink size={15} />
                  <span>Cẩm nang đầy đủ</span>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* CỘT PHẢI (DESKTOP): TABS VÀ LƯỚI NỘI DUNG ĐA PHƯƠNG TIỆN */}
        <section className="tap-desktop-content-col">
          {/* Tabs Bar */}
          <div className="tap-desktop-tabs-bar">
            <button
              type="button"
              className={`tap-desktop-tab-btn ${activeTab === "guide" ? "active" : ""}`}
              onClick={() => setActiveTab("guide")}
            >
              <Compass size={17} />
              <span>🗺️ Cẩm Nang & Danh Thắng ({landmarks.length})</span>
            </button>

            <button
              type="button"
              className={`tap-desktop-tab-btn ${activeTab === "food" ? "active" : ""}`}
              onClick={() => setActiveTab("food")}
            >
              <Utensils size={17} />
              <span>🍜 Quán Ngon & Ẩm Thực ({foods.length})</span>
            </button>

            <button
              type="button"
              className={`tap-desktop-tab-btn ${activeTab === "album" ? "active" : ""}`}
              onClick={() => setActiveTab("album")}
            >
              <Camera size={17} />
              <span>📸 Album Kỷ Niệm ({album?.media_count || 0})</span>
            </button>
          </div>

          {/* TAB 1: CẨM NANG */}
          {activeTab === "guide" && (
            <div className="tap-desktop-tab-pane">
              <div className="tap-desktop-pane-header">
                <div>
                  <h3 className="tap-desktop-pane-title">Danh Lam Thắng Cảnh Nổi Tiếng</h3>
                  <p className="tap-desktop-pane-sub">Top những điểm đến biểu tượng không thể bỏ lỡ khi đến {pName}</p>
                </div>
                <Link href={`/province/${card?.province_slug}`} className="tap-see-all-badge">
                  <span>Toàn bộ cẩm nang</span>
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="tap-desktop-cards-grid">
                {landmarks.map((lm, idx) => {
                  const cat = CATEGORY_MAP[lm.category] || CATEGORY_MAP.attraction;
                  return (
                    <div
                      key={lm.id || idx}
                      className="tap-desktop-landmark-card"
                      onClick={() => setSelectedModalItem({ ...lm, type: "landmark" })}
                    >
                      <div className="tap-desktop-img-box">
                        <img
                          src={lm.thumbnail_url || card?.thumbnail_url}
                          alt={lm.name}
                          className="tap-desktop-img"
                        />
                        <span className="tap-desktop-cat-badge" style={{ background: cat.color }}>
                          {cat.label}
                        </span>
                      </div>
                      <div className="tap-desktop-card-body">
                        <h4>{lm.name}</h4>
                        <p className="tap-card-addr">
                          <MapPin size={12} className="tap-pin" />
                          <span>{lm.address || pName}</span>
                        </p>
                        <p className="tap-card-desc-clamp">{lm.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {festivals.length > 0 && (
                <div className="tap-desktop-fest-banner">
                  <div className="tap-fest-badge-icon">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="tap-fest-time-tag">{festivals[0].event_time || "Hàng năm"}</span>
                    <h4>{festivals[0].title}</h4>
                    <p>{festivals[0].description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUÁN NGON */}
          {activeTab === "food" && (
            <div className="tap-desktop-tab-pane">
              <div className="tap-desktop-pane-header">
                <div>
                  <h3 className="tap-desktop-pane-title">Ẩm Thực & Quán Ngon Đặc Sản</h3>
                  <p className="tap-desktop-pane-sub">Những món ngon trứ danh làm say lòng du khách tại {pName}</p>
                </div>
                <Link href={`/province/${card?.province_slug}`} className="tap-see-all-badge">
                  <span>Khám phá thêm</span>
                  <ChevronRight size={15} />
                </Link>
              </div>

              <div className="tap-desktop-cards-grid">
                {foods.map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className="tap-desktop-landmark-card"
                    onClick={() => setSelectedModalItem({ ...f, type: "food" })}
                  >
                    <div className="tap-desktop-img-box">
                      <img src={f.image_url} alt={f.title} className="tap-desktop-img" />
                      {f.view_count && (
                        <span className="tap-desktop-views-badge">
                          <Eye size={12} />
                          <span>{f.view_count}</span>
                        </span>
                      )}
                    </div>
                    <div className="tap-desktop-card-body">
                      <h4>{f.title}</h4>
                      {f.address && (
                        <p className="tap-card-addr">
                          <MapPin size={12} className="tap-pin" />
                          <span>{f.address}</span>
                        </p>
                      )}
                      <p className="tap-card-desc-clamp">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALBUM */}
          {activeTab === "album" && (
            <div className="tap-desktop-tab-pane">
              {status === "unclaimed" && (
                <div className="tap-desktop-unclaimed-cta">
                  <Sparkles size={40} style={{ color: "#ea580c" }} />
                  <h3>Mảnh Ghép Chưa Có Chủ Nhân!</h3>
                  <p>Hãy kích hoạt ngay để bắt đầu lưu lại những kỷ niệm check-in đầu tiên tại {pName}.</p>
                  <button type="button" className="tap-btn-gold-claim large" onClick={handleClaim}>
                    <Zap size={18} />
                    <span>Kích Hoạt Sở Hữu Thẻ</span>
                  </button>
                </div>
              )}

              {status === "owned" && !album && (
                <div className="tap-desktop-unclaimed-cta">
                  <Camera size={40} style={{ color: "#2563eb" }} />
                  <h3>Bắt Đầu Lưu Kỷ Niệm Tại {pName}!</h3>
                  <p>Mảnh ghép này chưa có album. Hãy tạo album kỷ niệm đầu tiên để bắt đầu lưu giữ các bức ảnh &amp; video check-in đáng nhớ.</p>
                  <button
                    type="button"
                    className="tap-btn-primary large"
                    onClick={handleCreateAlbum}
                    disabled={creatingAlbum}
                    style={{ maxWidth: 320, margin: "0 auto" }}
                  >
                    <Camera size={18} />
                    <span>{creatingAlbum ? "Đang khởi tạo album..." : "Tạo Album Kỷ Niệm Đầu Tiên"}</span>
                  </button>
                </div>
              )}

              {status !== "unclaimed" && album && (
                <div className="tap-desktop-album-wrap">
                  <div className="tap-desktop-album-top">
                    <div>
                      <span className="tap-album-tag-small">✨ TRAVEL DIARY</span>
                      <h3>{album.title || `Nhật ký chuyến đi ${pName}`}</h3>
                      <p className="tap-album-meta-text">
                        <span>📸 {album.media_count || 0} khoảnh khắc</span> • <span>👁️ {album.view_count || 0} lượt xem</span>
                      </p>
                    </div>
                    <Link href={`/album/${album.share_code || album.id}`} className="tap-btn-primary fit">
                      <span>Mở Album Toàn Bộ</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  {albumMedia.length > 0 ? (
                    <div className="tap-desktop-polaroid-grid">
                      {albumMedia.map((m, idx) => (
                        <div key={m.id || idx} className="tap-polaroid-item">
                          <img src={m.thumbnail_url || m.file_url} alt="Kỷ niệm" className="tap-polaroid-pic" />
                          {(m.caption_user || m.caption_ai) && (
                            <p className="tap-polaroid-text">{m.caption_user || m.caption_ai}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="tap-empty-box">
                      <Camera size={32} />
                      <p>Chưa có hình ảnh nào được tải lên album.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* ── Mobile Smart Pass (Hiển thị mượt mà trên Điện thoại < 960px) ── */}
      <div className="tap-mobile-smartpass">
        {/* 1. Thẻ NFC 3D */}
        <div className="tap-mobile-card-box">
          <div className="tap-smart-card">
            <img
              src={card?.thumbnail_url || "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"}
              alt={pName}
              className="tap-card-bg-photo"
            />
            <div className="tap-card-scrim" />
            <div className="tap-card-holo-glow" />

            <div className="tap-card-top-row">
              <span className="tap-card-logo-badge">VinaTap Pass</span>
              <div className="tap-card-chip-badge">
                <Radio size={13} className="tap-nfc-icon-pulse" />
                <span>NFC 3D</span>
              </div>
            </div>

            <div className="tap-card-bottom-row">
              <span className="tap-card-region" style={{ color: regionInfo.color }}>
                {regionInfo.label}
              </span>
              <h2 className="tap-card-heading">{pName}</h2>
              <div className="tap-card-serial-row">
                <span>{card?.serial_code || "VN-2026-NFC"}</span>
                <span className="tap-verified-chip">
                  <ShieldCheck size={13} />
                  <span>VERIFIED</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Primary Action Button */}
        <div className="tap-mobile-action-wrap">
          {status === "unclaimed" && (
            <button type="button" className="tap-smart-action-btn claim" onClick={handleClaim}>
              <Zap size={18} />
              <span>Kích Hoạt Nhận Mảnh Ghép</span>
            </button>
          )}

          {status !== "unclaimed" && album && (
            <Link href={`/album/${album.share_code || album.id}`} className="tap-smart-action-btn album">
              <Camera size={18} />
              <span>Xem Album Ảnh ({album.media_count || 0} ảnh)</span>
              <ArrowRight size={16} />
            </Link>
          )}

          {status === "owned" && !album && (
            <button
              type="button"
              className="tap-smart-action-btn album"
              onClick={handleCreateAlbum}
              disabled={creatingAlbum}
            >
              <Camera size={18} />
              <span>{creatingAlbum ? "Đang khởi tạo album..." : "Tạo Album Kỷ Niệm Đầu Tiên"}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {status === "claimed" && !album && (
            <div className="tap-friend-owner-pill">
              <ShieldCheck size={14} style={{ color: "#16a34a" }} />
              <span>Mảnh ghép của <strong>{card?.owner_name || "Bạn bè"}</strong></span>
            </div>
          )}
        </div>

        {/* 3. Carousel Vuốt Ngang: Địa Danh */}
        {landmarks.length > 0 && (
          <section className="tap-mobile-carousel-sec">
            <div className="tap-carousel-header">
              <div className="tap-carousel-title-box">
                <Compass size={16} style={{ color: "#ea580c" }} />
                <h3>Điểm Đến Nổi Bật</h3>
              </div>
              <Link href={`/province/${card?.province_slug}`} className="tap-carousel-link">
                <span>Xem tất cả</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="tap-horizontal-scroll snap-x">
              {landmarks.map((lm, idx) => {
                const cat = CATEGORY_MAP[lm.category] || CATEGORY_MAP.attraction;
                return (
                  <div
                    key={lm.id || idx}
                    className="tap-mini-story-card"
                    onClick={() => setSelectedModalItem({ ...lm, type: "landmark" })}
                  >
                    <img src={lm.thumbnail_url || card?.thumbnail_url} alt={lm.name} className="tap-story-img" />
                    <div className="tap-story-scrim" />
                    <span className="tap-story-cat" style={{ background: cat.color }}>
                      {cat.label}
                    </span>
                    <div className="tap-story-text">
                      <h4>{lm.name}</h4>
                      <p><MapPin size={10} /><span>{lm.address || pName}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. Carousel Vuốt Ngang: Ẩm Thực */}
        {foods.length > 0 && (
          <section className="tap-mobile-carousel-sec">
            <div className="tap-carousel-header">
              <div className="tap-carousel-title-box">
                <Utensils size={16} style={{ color: "#ea580c" }} />
                <h3>Món Ngon Phải Thử</h3>
              </div>
              <Link href={`/province/${card?.province_slug}`} className="tap-carousel-link">
                <span>Quán ngon</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="tap-horizontal-scroll snap-x">
              {foods.map((f, idx) => (
                <div
                  key={f.id || idx}
                  className="tap-mini-story-card food"
                  onClick={() => setSelectedModalItem({ ...f, type: "food" })}
                >
                  <img src={f.image_url} alt={f.title} className="tap-story-img" />
                  <div className="tap-story-scrim" />
                  {f.view_count && (
                    <span className="tap-story-views">
                      <Eye size={10} />
                      <span>{f.view_count}</span>
                    </span>
                  )}
                  <div className="tap-story-text">
                    <h4>{f.title}</h4>
                    {f.address && (
                      <p><MapPin size={10} /><span>{f.address}</span></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CTA Cẩm Nang Chi Tiết */}
        <div className="tap-mobile-footer-btns">
          <Link href={`/province/${card?.province_slug}`} className="tap-btn-full-guide">
            <Compass size={18} />
            <span>Mở Bản Đồ & Cẩm Nang {pName}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Modal Xem Nhanh Địa Danh / Món Ăn ── */}
      {selectedModalItem && (
        <div className="tap-modal-backdrop" onClick={() => setSelectedModalItem(null)}>
          <div className="tap-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="tap-sheet-close" onClick={() => setSelectedModalItem(null)}>
              <X size={18} />
            </button>

            <div className="tap-sheet-img-box">
              <img
                src={selectedModalItem.thumbnail_url || selectedModalItem.image_url || card?.thumbnail_url}
                alt={selectedModalItem.name || selectedModalItem.title}
                className="tap-sheet-img"
              />
            </div>

            <div className="tap-sheet-content">
              <h3>{selectedModalItem.name || selectedModalItem.title}</h3>
              {selectedModalItem.address && (
                <p className="tap-sheet-addr">
                  <MapPin size={14} className="tap-pin" />
                  <span>{selectedModalItem.address}</span>
                </p>
              )}
              <p className="tap-sheet-desc">
                {selectedModalItem.description || `Địa điểm hấp dẫn không thể bỏ lỡ tại ${pName}.`}
              </p>
              <Link href={`/province/${card?.province_slug}`} className="tap-btn-full-guide in-sheet">
                <span>Xem Trong Cẩm Nang Du Lịch</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Chia Sẻ Thẻ & Mã QR ── */}
      {showShareModal && (
        <div className="tap-modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="tap-share-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="tap-sheet-close-btn"
              onClick={() => setShowShareModal(false)}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>

            <div className="tap-share-modal-header">
              <div className="tap-share-icon-circle">
                <Share2 size={20} />
              </div>
              <h3 className="tap-share-title">Chia Sẻ Mảnh Ghép {pName}</h3>
              <p className="tap-share-subtitle">
                Quét mã QR hoặc sao chép liên kết để gửi cho bạn bè
              </p>
            </div>

            {/* Mã QR Code */}
            <div className="tap-qr-box">
              <div className="tap-qr-frame">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                    getShareUrl()
                  )}&margin=8`}
                  alt={`Mã QR thẻ ${pName}`}
                  className="tap-qr-image"
                />
              </div>
              <p className="tap-qr-hint">
                <QrCode size={13} />
                <span>Quét bằng Camera điện thoại hoặc Zalo</span>
              </p>
            </div>

            {/* Hộp Copy Link */}
            <div className="tap-copy-bar">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="tap-copy-input"
                onClick={(e) => e.target.select()}
              />
              <button
                type="button"
                className={`tap-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Đã chép!" : "Sao chép"}</span>
              </button>
            </div>

            {/* Native Share button */}
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                type="button"
                className="tap-native-share-btn"
                onClick={handleNativeShare}
              >
                <Share2 size={16} />
                <span>Mở chia sẻ hệ thống</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
