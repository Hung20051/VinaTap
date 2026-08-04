"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../../components/Logo";
import { useRouter } from "next/navigation";
import { nfcAPI, albumAPI } from "../../lib/api";
import { requireAuth } from "../../lib/auth";

export default function ActivatePage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState(null); // thẻ vừa kích hoạt thành công
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
    setCheckingAuth(false);
  }, [router]);

  const handleActivate = async (e) => {
    e.preventDefault();
    setError("");

    const cleaned = serial.trim().toUpperCase();
    if (!cleaned) {
      setError("Vui lòng nhập mã serial in trên mảnh ghép");
      return;
    }

    setLoading(true);
    try {
      const res = await nfcAPI.activate(cleaned);
      setCard(res.card);
    } catch (err) {
      setError(err.message || "Kích hoạt thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (!card) return;
    setCreatingAlbum(true);
    setError("");
    try {
      const res = await albumAPI.create({ nfc_card_id: card.id });
      router.push(`/album/${res.album.id}`);
    } catch (err) {
      setError(err.message || "Không tạo được album, thử lại từ Dashboard");
      setCreatingAlbum(false);
    }
  };

  if (checkingAuth) {
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

  return (
    <>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
          <div className="navbar__links">
            <Link href="/customer/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div
        style={{
          minHeight: "calc(100vh - 65px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1rem",
          background: "linear-gradient(135deg, #fff1eb 0%, #fafafa 100%)",
        }}
      >
        <div
          className="card"
          style={{ width: "100%", maxWidth: 440, padding: "2rem" }}
        >
          {!card ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "2.5rem" }}>🔑</p>
                <h1
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    marginTop: ".5rem",
                  }}
                >
                  Kích hoạt mảnh ghép NFC
                </h1>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: ".9rem",
                    marginTop: ".4rem",
                  }}
                >
                  Nhập mã serial in trên mặt sau mảnh ghép, hoặc chạm điện thoại
                  vào chip NFC để tự động điền
                </p>
              </div>

              {error && (
                <div
                  style={{
                    background: "#fee2e2",
                    color: "var(--danger)",
                    padding: "0.65rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: ".85rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleActivate}>
                <label
                  style={{
                    fontSize: ".85rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: ".35rem",
                  }}
                >
                  Mã serial
                </label>
                <input
                  className="input"
                  placeholder="VD: HAN-2026-A3F9C71B2C"
                  value={serial}
                  onChange={(e) => {
                    setSerial(e.target.value);
                    if (error) setError("");
                  }}
                  style={{
                    textAlign: "center",
                    letterSpacing: "1px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                  autoFocus
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "1.25rem",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Đang kích hoạt..." : "Kích hoạt ngay"}
                </button>
              </form>

              <p
                style={{
                  textAlign: "center",
                  fontSize: ".8rem",
                  color: "var(--text-muted)",
                  marginTop: "1.25rem",
                }}
              >
                Mỗi mảnh ghép chỉ kích hoạt được 1 lần và gắn với đúng 1 tài
                khoản
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "2.5rem" }}>🎉</p>
              <h1
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  marginTop: ".5rem",
                }}
              >
                Kích hoạt thành công!
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: ".9rem",
                  marginTop: ".4rem",
                  marginBottom: "1.5rem",
                }}
              >
                Bạn vừa mở khóa mảnh ghép
              </p>

              <div
                style={{
                  background: "var(--primary-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                  }}
                >
                  {card.province_name}
                </p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--text-muted)",
                    marginTop: ".25rem",
                  }}
                >
                  Serial: {card.serial_code}
                </p>
              </div>

              {error && (
                <div
                  style={{
                    background: "#fee2e2",
                    color: "var(--danger)",
                    padding: "0.65rem 1rem",
                    borderRadius: "var(--radius-md)",
                    fontSize: ".85rem",
                    marginBottom: "1rem",
                    textAlign: "left",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleCreateAlbum}
                disabled={creatingAlbum}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: creatingAlbum ? 0.7 : 1,
                }}
              >
                {creatingAlbum
                  ? "Đang tạo album..."
                  : "✨ Tạo album & bắt đầu lưu kỷ niệm"}
              </button>

              <Link
                href={`/province/${card.province_slug}`}
                className="btn btn-ghost"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: ".5rem",
                }}
              >
                Xem thông tin tỉnh trước
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
