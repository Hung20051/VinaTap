"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { nfcAPI, albumAPI, analyticsAPI } from "@/lib/api";
import { isLoggedIn, getUser } from "@/lib/auth";
import "./TapPage.css";

export default function TapPage() {
  const { token } = useParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [album, setAlbum] = useState(null);
  const [status, setStatus] = useState("loading"); // loading|unclaimed|owned|claimed|error
  const [msg, setMsg] = useState("");
  const [claiming, setClaiming] = useState(false);

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
        setMsg("Thẻ này đã bị vô hiệu hóa.");
        return;
      }

      if (!c.has_owner) {
        setStatus("unclaimed"); // Chưa có chủ — mời claim
        return;
      }

      // Đã có chủ — kiểm tra xem mình có phải chủ không
      const me = getUser();
      if (me && c.owner_name === me.name) {
        // Tải album nếu có
        try {
          const cards = await nfcAPI.myCards();
          const myCard = cards.cards?.find((cd) => cd.nfc_token === token);
          if (myCard?.album_id) {
            const alb = await albumAPI.getOne(myCard.album_id);
            setAlbum(alb.album);
          }
        } catch (_) {}
        setStatus("owned");
      } else {
        setStatus("claimed"); // Người khác đang giữ
      }
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Không tải được thông tin thẻ");
    }
  };

  const handleClaim = async () => {
    if (!isLoggedIn()) {
      // Lưu token rồi redirect login
      sessionStorage.setItem("pending_nfc_token", token);
      router.push(`/auth?redirect=/t/${token}`);
      return;
    }
    setClaiming(true);
    try {
      await nfcAPI.claim(token);
      // Sau claim → tạo album luôn
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
      setMsg(err.message || "Kích hoạt thất bại");
      setClaiming(false);
    }
  };

  // ─── Loading ────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="tap-page-center-state">
        <div className="spinner" />
        <p className="tap-state-desc" style={{ marginTop: "1rem" }}>
          Đang tải thông tin thẻ...
        </p>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="tap-page-center-state">
        <div className="tap-state-icon">❌</div>
        <h2 className="tap-state-title">Có lỗi xảy ra</h2>
        <p className="tap-state-desc">{msg}</p>
        <Link href="/" className="tap-btn-primary" style={{ maxWidth: "220px" }}>
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="tap-page-container">
      {/* Header */}
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
        </div>
      </nav>

      <div className="tap-main-content">
        {/* Ảnh tỉnh */}
        <div className="tap-hero-card">
          {card?.thumbnail_url ? (
            <img
              src={card.thumbnail_url}
              alt={card.province_name}
              className="tap-hero-img"
            />
          ) : (
            <div className="tap-hero-placeholder">🗺</div>
          )}
        </div>

        {/* Tên tỉnh */}
        <h1 className="tap-province-name">{card?.province_name}</h1>
        <p className="tap-province-desc">
          {card?.description || "Khám phá địa danh nổi tiếng tại đây."}
        </p>

        {/* ─── Trạng thái UNCLAIMED: mời claim ─── */}
        {status === "unclaimed" && (
          <div className="tap-action-card">
            <div className="tap-action-icon">🎉</div>
            <h2 className="tap-action-title">Mảnh ghép chưa có chủ!</h2>
            <p className="tap-action-subtitle">
              {isLoggedIn()
                ? "Bấm kích hoạt để sở hữu mảnh ghép này và tạo album kỷ niệm."
                : "Đăng nhập để kích hoạt và sở hữu mảnh ghép này."}
            </p>
            {msg && <p className="tap-error-text">{msg}</p>}
            <button
              className="tap-btn-primary"
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming
                ? "Đang kích hoạt..."
                : isLoggedIn()
                  ? "✨ Kích hoạt ngay"
                  : "🔑 Đăng nhập để kích hoạt"}
            </button>
            <Link
              href={`/province/${card?.province_slug}`}
              className="tap-link-secondary"
            >
              Xem thông tin tỉnh trước →
            </Link>
          </div>
        )}

        {/* ─── Trạng thái OWNED: mình là chủ ─── */}
        {status === "owned" && (
          <div className="tap-action-card">
            <div className="tap-owned-header">
              <span style={{ fontSize: "2.25rem" }}>✅</span>
              <div>
                <h2 className="tap-action-title" style={{ textAlign: "left", marginBottom: "0.25rem" }}>
                  Đây là mảnh ghép của bạn!
                </h2>
                <p className="tap-action-subtitle" style={{ textAlign: "left", margin: 0 }}>
                  Bạn đã kích hoạt mảnh ghép {card?.province_name}.
                </p>
              </div>
            </div>

            <div className="tap-owned-actions-list">
              {album ? (
                <Link
                  href={`/album/${album.id}`}
                  className="tap-btn-primary"
                >
                  📸 Xem album kỷ niệm
                </Link>
              ) : (
                <Link
                  href="/customer/dashboard"
                  className="tap-btn-primary"
                >
                  📸 Tạo album kỷ niệm
                </Link>
              )}
              <Link
                href={`/province/${card?.province_slug}`}
                className="tap-btn-outline"
              >
                🗺 Xem thông tin tỉnh
              </Link>
            </div>
          </div>
        )}

        {/* ─── Trạng thái CLAIMED: người khác đang giữ ─── */}
        {status === "claimed" && (
          <div className="tap-action-card">
            <div className="tap-action-icon">🔒</div>
            <h2 className="tap-action-title">Mảnh ghép đã có chủ</h2>
            <p className="tap-action-subtitle">
              Mảnh ghép <b>{card?.province_name}</b> đang được sở hữu bởi người
              khác. Bạn vẫn có thể xem thông tin tỉnh.
            </p>
            <Link
              href={`/province/${card?.province_slug}`}
              className="tap-btn-primary"
            >
              🗺 Khám phá {card?.province_name}
            </Link>
          </div>
        )}

        {/* Video YouTube */}
        {card?.youtube_url && (
          <div className="tap-video-wrap">
            <iframe
              src={card.youtube_url
                .replace("watch?v=", "embed/")
                .replace("youtu.be/", "youtube.com/embed/")}
              style={{ width: "100%", height: 240, border: "none", display: "block" }}
              allowFullScreen
              title={`Giới thiệu ${card?.province_name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
