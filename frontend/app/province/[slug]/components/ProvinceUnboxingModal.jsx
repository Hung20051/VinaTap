"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, Trophy, MapPin, CheckCircle, Share2, LogIn } from "lucide-react";
import Link from "next/link";
import { isLoggedIn } from "../../../../lib/auth";

export default function ProvinceUnboxingModal({ province, onClose }) {
  const [copied, setCopied] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, []);

  if (!province) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="province-unbox-backdrop" onClick={onClose}>
      <div
        className="card province-unbox-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="province-unbox-close"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="province-unbox-banner">
          <div className="province-unbox-sparkle-ring">
            <Sparkles size={36} className="province-unbox-sparkle-icon" />
          </div>
          <span className="province-unbox-tag">
            <Trophy size={14} /> MẢNH GHÉP ĐÃ MỞ KHÓA
          </span>
          <h2>BẠN ĐÃ SỞ HỮU MẢNH GHÉP</h2>
          <h1>{province.name.toUpperCase()}</h1>
        </div>

        {/* 3D NFC Card Piece Display */}
        <div className="province-unbox-card-3d-wrap">
          <div className="province-unbox-card-3d">
            {province.thumbnail_url ? (
              <img src={province.thumbnail_url} alt={province.name} />
            ) : (
              <div className="province-unbox-no-img">
                <MapPin size={48} />
                <span>{province.name}</span>
              </div>
            )}
            <div className="province-unbox-chip-badge">NFC VINATAP</div>
            <div className="province-unbox-shine" />
          </div>
        </div>

        <p className="province-unbox-desc">
          🎉 Chúc mừng bạn đã bổ sung mảnh ghép <strong>{province.name}</strong> vào bộ sưu tập du lịch Việt Nam VinaTap!
        </p>

        <div className="province-unbox-actions">
          {userLoggedIn ? (
            <Link
              href="/customer/dashboard"
              className="btn btn-primary province-unbox-btn"
            >
              <CheckCircle size={18} /> Xem Bộ Sưu Tập Của Tôi
            </Link>
          ) : (
            <Link
              href="/auth"
              className="btn btn-primary province-unbox-btn"
            >
              <LogIn size={18} /> Đăng Nhập Để Lưu Bộ Sưu Tập
            </Link>
          )}

          <button
            type="button"
            className="btn btn-outline province-unbox-btn"
            onClick={handleShare}
          >
            <Share2 size={18} /> {copied ? "Đã copy link!" : "Chia sẻ mảnh ghép"}
          </button>
        </div>
      </div>
    </div>
  );
}
