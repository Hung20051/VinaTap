"use client";

import { useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
} from "lucide-react";

export default function ShareModal({
  isOpen,
  onClose,
  albumTitle = "Album Kỷ Niệm VinaTap",
  shareUrl,
  provinceName = "Việt Nam",
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const fullUrl =
    shareUrl || (typeof window !== "undefined" ? window.location.href : "");
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    fullUrl,
  )}&margin=10&color=18181b`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const input = document.createElement("input");
        input.value = fullUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleDownloadQr = async () => {
    try {
      setDownloading(true);
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const cleanName = (albumTitle || "vinatap-album")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      a.download = `qr-${cleanName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download QR error", e);
      window.open(qrApiUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: albumTitle,
          text: `Cùng ngắm nhìn những khoảnh khắc kỷ niệm ${provinceName} trên VinaTap nhé!`,
          url: fullUrl,
        });
      } catch (e) {
        if (e.name !== "AbortError") handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      fullUrl,
    )}`;
    window.open(fbUrl, "_blank", "width=600,height=450");
  };

  const handleZaloShare = () => {
    const zaloUrl = `https://sp.zalo.me/share_inline?link=${encodeURIComponent(
      fullUrl,
    )}&title=${encodeURIComponent(albumTitle)}`;
    window.open(zaloUrl, "_blank", "width=600,height=550");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          border: "1px solid rgba(229, 231, 235, 0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f3f4f6",
            background: "linear-gradient(to right, #fff7ed, #ffffff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #ea580c, #f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(234, 88, 12, 0.25)",
              }}
            >
              <Share2 size={18} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Chia Sẻ Album
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                Quét mã QR hoặc gửi liên kết cho bạn bè
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "1.5rem", textAlign: "center" }}>
          {/* QR Code Container */}
          <div
            style={{
              display: "inline-block",
              padding: "1rem",
              background: "linear-gradient(145deg, #ffffff, #f8fafc)",
              borderRadius: "20px",
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)",
              position: "relative",
              marginBottom: "1rem",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrApiUrl}
              alt="Mã QR Album VinaTap"
              style={{
                width: "180px",
                height: "180px",
                display: "block",
                borderRadius: "12px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "6px",
                right: "6px",
                background: "#ea580c",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <Sparkles size={10} /> VINATAP
            </div>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#475569",
              margin: "0 0 1.25rem 0",
              fontWeight: 500,
            }}
          >
            Mở Camera điện thoại để quét và truy cập Album ngay
          </p>

          {/* Action Buttons (Download QR & Native Share) */}
          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}
          >
            <button
              onClick={handleDownloadQr}
              disabled={downloading}
              style={{
                flex: 1,
                padding: "0.55rem 0.8rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#334155",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#f8fafc")}
            >
              <Download size={15} />
              {downloading ? "Đang tải..." : "Tải Mã QR"}
            </button>

            <button
              onClick={handleNativeShare}
              style={{
                flex: 1,
                padding: "0.55rem 0.8rem",
                borderRadius: "12px",
                border: "1px solid #fed7aa",
                background: "#fff7ed",
                color: "#c2410c",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#ffedd5")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff7ed")}
            >
              <Share2 size={15} />
              Chia Sẻ Điện Thoại
            </button>
          </div>

          {/* Copy Link Input Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "14px",
              padding: "4px 4px 4px 12px",
              marginBottom: "1.25rem",
              transition: "border-color 0.2s",
            }}
          >
            <input
              type="text"
              readOnly
              value={fullUrl}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "#334155",
                fontSize: "0.82rem",
                outline: "none",
                fontWeight: 500,
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: copied ? "#16a34a" : "#ea580c",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.2s",
                boxShadow: copied
                  ? "0 4px 12px rgba(22, 163, 74, 0.3)"
                  : "0 4px 12px rgba(234, 88, 12, 0.3)",
              }}
            >
              {copied ? (
                <>
                  <Check size={14} /> Đã Sao Chép!
                </>
              ) : (
                <>
                  <Copy size={14} /> Sao Chép
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                margin: "0 0 0.75rem 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 600,
              }}
            >
              Hoặc chia sẻ trực tiếp qua
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleFacebookShare}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "10px",
                  border: "1px solid #dbeafe",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#1877f2",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                >
                  f
                </span>
                Facebook
              </button>

              <button
                onClick={handleZaloShare}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "10px",
                  border: "1px solid #e0e7ff",
                  background: "#eef2ff",
                  color: "#4338ca",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#0068ff",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Z
                </span>
                Zalo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
