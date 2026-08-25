"use client";

import { useState } from "react";
import { Gift, CheckCircle2, X, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { nfcAPI } from "@/lib/api";

export default function GiftNotificationBanner({ gifts = [], onGiftProcessed }) {
  const [processingId, setProcessingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!gifts || gifts.length === 0) return null;

  const handleAccept = async (gift) => {
    setProcessingId(gift.id);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await nfcAPI.acceptTransfer({ transfer_id: gift.id });
      setSuccessMsg(res.message || `🎉 Bạn đã nhận thành công mảnh ${gift.province_name}!`);
      setTimeout(() => {
        if (onGiftProcessed) onGiftProcessed(gift.id);
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Không thể tiếp nhận thẻ vào lúc này");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (gift) => {
    if (!confirm(`Bạn có chắc muốn từ chối nhận mảnh ghép ${gift.province_name}?`)) return;
    setProcessingId(gift.id);
    setErrorMsg("");
    try {
      await nfcAPI.rejectTransfer(gift.id);
      if (onGiftProcessed) onGiftProcessed(gift.id);
    } catch (err) {
      setErrorMsg(err.message || "Lỗi khi từ chối thẻ");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ marginBottom: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {gifts.map((gift) => (
        <div
          key={gift.id}
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #fff7ed 0%, #fff1f2 50%, #fef2f2 100%)",
            border: "2px solid #fdba74",
            borderRadius: "22px",
            padding: "1.35rem 1.5rem",
            boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.15), 0 8px 10px -6px rgba(249, 115, 22, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            animation: "giftPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Decorative Glow */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              background: "radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* Header info */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ea580c, #f97316)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  boxShadow: "0 4px 12px rgba(234, 88, 12, 0.35)",
                  flexShrink: 0,
                  animation: "giftBounce 2s ease-in-out infinite",
                }}
              >
                🎁
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#c2410c",
                      background: "rgba(234, 88, 12, 0.12)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    Quà Tặng Mới
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#9a3412" }}>
                    • {new Date(gift.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <h3
                  style={{
                    margin: "0.25rem 0 0 0",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#7c2d12",
                  }}
                >
                  <strong style={{ color: "#ea580c" }}>{gift.sender_name}</strong> vừa gửi tặng bạn thẻ{" "}
                  <span style={{ color: "#047857", textDecoration: "underline" }}>📍 {gift.province_name}</span>!
                </h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleAccept(gift)}
                disabled={processingId === gift.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "0.65rem 1.35rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: processingId === gift.id ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                <Sparkles size={16} />
                <span>{processingId === gift.id ? "Đang xử lý..." : "Nhận Thẻ Ngay"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleReject(gift)}
                disabled={processingId === gift.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0.65rem 1rem",
                  borderRadius: "12px",
                  background: "#ffffff",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: processingId === gift.id ? "not-allowed" : "pointer",
                }}
              >
                <span>Từ chối</span>
              </button>
            </div>
          </div>

          {/* Note from sender */}
          {gift.note && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px dashed #fdba74",
                borderRadius: "12px",
                padding: "0.6rem 0.9rem",
                fontSize: "0.85rem",
                color: "#9a3412",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <span>💬</span>
              <p style={{ margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>
                &ldquo;{gift.note}&rdquo;
              </p>
            </div>
          )}

          {/* Feedback messages */}
          {successMsg && (
            <div
              style={{
                background: "#ecfdf5",
                color: "#065f46",
                padding: "0.5rem 0.85rem",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                padding: "0.5rem 0.85rem",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}
        </div>
      ))}

      <style>{`
        @keyframes giftBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes giftPopIn {
          from { opacity: 0; transform: scale(0.96) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
