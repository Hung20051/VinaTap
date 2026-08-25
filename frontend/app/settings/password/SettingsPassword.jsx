"use client";

import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import { authAPI } from "@/lib/api";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "../account/SettingsAccount.css";

export default function SettingsPassword() {
  const [lang, setLang] = useState("vi");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Lỗi đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-acc-container">
      {/* Top Header */}
      <div className="settings-acc-header">
        <h1 className="settings-acc-title">
          <span className="title-desktop">🔒 Đổi Mật Khẩu Đăng Nhập</span>
          <span className="title-mobile">🔒 Đổi Mật Khẩu</span>
        </h1>
        <p className="settings-acc-subtitle">
          Cập nhật mật khẩu định kỳ để bảo vệ tài khoản và bộ sưu tập thẻ của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card settings-acc-form-card">
        <h3 className="settings-acc-form-title">
          <KeyRound size={18} /> Thiết Lập Mật Khẩu Mới
        </h3>

        <div className="settings-acc-form-grid">
          {/* Mật khẩu hiện tại */}
          <div className="settings-acc-field">
            <label className="settings-acc-label">
              <Lock size={14} /> Mật Khẩu Hiện Tại *
            </label>
            <div className="settings-password-input-wrapper">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="settings-acc-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="settings-password-toggle-btn"
                title={showCurrent ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="settings-acc-field">
            <label className="settings-acc-label">
              <Lock size={14} /> Mật Khẩu Mới (ít nhất 6 ký tự) *
            </label>
            <div className="settings-password-input-wrapper">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="settings-acc-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="settings-password-toggle-btn"
                title={showNew ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="settings-acc-field">
            <label className="settings-acc-label">
              <ShieldCheck size={14} /> Xác Nhận Mật Khẩu Mới *
            </label>
            <div className="settings-password-input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                className="settings-acc-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="settings-password-toggle-btn"
                title={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="settings-acc-error">{error}</p>}

        <div className="settings-acc-footer">
          {saved && (
            <span className="settings-acc-saved">
              <CheckCircle2 size={16} /> Đã đổi mật khẩu thành công!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn settings-acc-btn-submit"
          >
            {saving ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}
