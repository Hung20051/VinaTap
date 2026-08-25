"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  AlertCircle,
  Smartphone,
  Edit3,
} from "lucide-react";
import { nfcAPI, albumAPI } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import "./ActivatePage.css";

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
      setError("Vui lòng nhập mã serial in trên mảnh ghép gỗ");
      return;
    }

    setLoading(true);
    try {
      const res = await nfcAPI.activate(cleaned);
      setCard(res.card);
    } catch (err) {
      setError(err.message || "Kích hoạt thất bại, vui lòng kiểm tra lại mã serial");
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
      <div className="activate-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="activate-wrapper">
      <div className="activate-bg-glow activate-bg-glow--top" />

      <div className="activate-card">
        {!card ? (
          <>
            {/* NFC Wave Animation Icon */}
            <div className="activate-icon-container">
              <div className="activate-radar-ring" />
              <div className="activate-radar-ring activate-radar-ring--delayed" />
              <div className="activate-icon-badge">
                <Radio size={36} strokeWidth={2.4} />
              </div>
            </div>

            {/* Header Text */}
            <div className="activate-header">
              <h1 className="activate-title">Kích Hoạt Mảnh Ghép NFC</h1>
              <p className="activate-subtitle">
                Chạm điện thoại vào chip NFC trên mảnh gỗ hoặc nhập mã Serial để mở khóa bản đồ du lịch của bạn.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="activate-error-banner">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Serial Form */}
            <form onSubmit={handleActivate} className="activate-form">
              <div>
                <label className="activate-input-label">
                  <span>MÃ SERIAL MẢNH GHÉP</span>
                  <span className="activate-input-hint">In ở mặt sau thẻ gỗ</span>
                </label>
                <div className="activate-input-wrap">
                  <input
                    className="activate-serial-input"
                    placeholder="VD: HAN-2026-A3F9C7"
                    value={serial}
                    onChange={(e) => {
                      setSerial(e.target.value);
                      if (error) setError("");
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="activate-submit-btn"
                disabled={loading || !serial.trim()}
              >
                {loading ? (
                  <>Đang xác thực thẻ NFC...</>
                ) : (
                  <>
                    <Zap size={18} fill="currentColor" />
                    <span>Kích Hoạt Mảnh Ghép Ngay</span>
                  </>
                )}
              </button>
            </form>

            {/* Helper Guide 2-Steps */}
            <div className="activate-guide-grid">
              <div className="activate-guide-item">
                <div className="activate-guide-icon">📱</div>
                <h4>Cách 1: Chạm NFC</h4>
                <p>Bật NFC trên điện thoại và chạm nhẹ vào mảnh ghép gỗ.</p>
              </div>

              <div className="activate-guide-item">
                <div className="activate-guide-icon">✍️</div>
                <h4>Cách 2: Nhập Serial</h4>
                <p>Xem chuỗi ký tự in laser ở mặt sau mảnh ghép gỗ.</p>
              </div>
            </div>

            <p className="activate-footer-note">
              🔒 Mỗi mảnh ghép chỉ kích hoạt được 1 lần và gắn cố định với tài khoản của bạn.
            </p>
          </>
        ) : (
          <div className="activate-success-card">
            {/* Success Badge */}
            <div className="activate-success-badge">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <h1 className="activate-title" style={{ color: "#16a34a" }}>
              Mở Khóa Thành Công!
            </h1>
            <p className="activate-subtitle">
              Mảnh ghép đã được gắn vào tài khoản của bạn và sẵn sàng lưu giữ những kỷ niệm tuyệt đẹp.
            </p>

            {/* Province Info Showcase */}
            <div className="activate-province-showcase">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#ea580c",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                <MapPin size={16} /> Mảnh ghép tỉnh / thành phố
              </div>
              <h2 className="activate-province-name">{card.province_name}</h2>
              <span className="activate-serial-tag">Serial: {card.serial_code}</span>
            </div>

            {error && (
              <div className="activate-error-banner" style={{ textAlign: "left" }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="activate-success-actions">
              <button
                className="activate-submit-btn"
                onClick={handleCreateAlbum}
                disabled={creatingAlbum}
              >
                <Sparkles size={18} />
                <span>
                  {creatingAlbum
                    ? "Đang khởi tạo Album..."
                    : "Khởi Tạo Album & Lưu Kỷ Niệm"}
                </span>
                <ArrowRight size={18} />
              </button>

              <Link
                href={`/province/${card.province_slug}`}
                className="activate-btn-ghost"
              >
                Khám phá thông tin du lịch {card.province_name}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
