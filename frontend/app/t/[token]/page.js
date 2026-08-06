"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../../../components/Logo";
import { nfcAPI, albumAPI, analyticsAPI } from "../../../lib/api";
import { isLoggedIn, getUser } from "../../../lib/auth";

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

      // Ghi nhận lượt xem/quét thẻ NFC thực tế
      analyticsAPI
        .track(window.location.pathname, c.province_slug)
        .catch(() => {});

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
      <div style={styles.center}>
        <div className="spinner" />
        <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
          Đang tải thông tin thẻ...
        </p>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
        <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>
          Có lỗi xảy ra
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {msg}
        </p>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      {/* Header */}
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
        </div>
      </nav>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "3rem 1rem" }}>
        {/* Ảnh tỉnh */}
        <div
          style={{
            height: 220,
            borderRadius: 20,
            overflow: "hidden",
            background: "var(--primary-light)",
            marginBottom: "1.5rem",
          }}
        >
          {card?.thumbnail_url ? (
            <img
              src={card.thumbnail_url}
              alt={card.province_name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                fontSize: "4rem",
              }}
            >
              🗺
            </div>
          )}
        </div>

        {/* Tên tỉnh */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            marginBottom: ".5rem",
          }}
        >
          {card?.province_name}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          {card?.description || "Khám phá địa danh nổi tiếng tại đây."}
        </p>

        {/* ─── Trạng thái UNCLAIMED: mời claim ─── */}
        {status === "unclaimed" && (
          <div
            className="card"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🎉</div>
            <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>
              Mảnh ghép chưa có chủ!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "1.25rem",
                fontSize: ".9rem",
              }}
            >
              {isLoggedIn()
                ? "Bấm kích hoạt để sở hữu mảnh ghép này và tạo album kỷ niệm."
                : "Đăng nhập để kích hoạt và sở hữu mảnh ghép này."}
            </p>
            {msg && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                {msg}
              </p>
            )}
            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "1rem",
                padding: ".8rem",
              }}
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
              style={{
                display: "block",
                marginTop: "1rem",
                color: "var(--text-secondary)",
                fontSize: ".85rem",
              }}
            >
              Xem thông tin tỉnh trước →
            </Link>
          </div>
        )}

        {/* ─── Trạng thái OWNED: mình là chủ ─── */}
        {status === "owned" && (
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>✅</span>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Đây là mảnh ghép của bạn!
                </h2>
                <p
                  style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}
                >
                  Bạn đã kích hoạt mảnh ghép {card?.province_name}.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".75rem",
              }}
            >
              {album ? (
                <Link
                  href={`/album/${album.id}`}
                  className="btn btn-primary"
                  style={{ justifyContent: "center" }}
                >
                  📸 Xem album kỷ niệm
                </Link>
              ) : (
                <Link
                  href="/customer/dashboard"
                  className="btn btn-primary"
                  style={{ justifyContent: "center" }}
                >
                  📸 Tạo album kỷ niệm
                </Link>
              )}
              <Link
                href={`/province/${card?.province_slug}`}
                className="btn btn-outline"
                style={{ justifyContent: "center" }}
              >
                🗺 Xem thông tin tỉnh
              </Link>
            </div>
          </div>
        )}

        {/* ─── Trạng thái CLAIMED: người khác đang giữ ─── */}
        {status === "claimed" && (
          <div
            className="card"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🔒</div>
            <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>
              Mảnh ghép đã có chủ
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "1.25rem",
                fontSize: ".9rem",
              }}
            >
              Mảnh ghép <b>{card?.province_name}</b> đang được sở hữu bởi người
              khác. Bạn vẫn có thể xem thông tin tỉnh.
            </p>
            <Link
              href={`/province/${card?.province_slug}`}
              className="btn btn-primary"
              style={{ justifyContent: "center" }}
            >
              🗺 Khám phá {card?.province_name}
            </Link>
          </div>
        )}

        {/* Video YouTube */}
        {card?.youtube_url && (
          <div
            style={{
              marginTop: "1.5rem",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <iframe
              src={card.youtube_url
                .replace("watch?v=", "embed/")
                .replace("youtu.be/", "youtube.com/embed/")}
              style={{ width: "100%", height: 220, border: "none" }}
              allowFullScreen
              title={`Giới thiệu ${card?.province_name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center",
  },
};
