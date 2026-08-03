"use client";

import { useState } from "react";
import { authAPI } from "../../../lib/api";

export default function SettingsPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự");
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
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Không đổi được mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">🔑 Đổi mật khẩu</h1>
      <p className="settings-page__subtitle">
        Dùng khi bạn vẫn nhớ mật khẩu hiện tại. Quên mật khẩu thì đăng xuất rồi
        bấm "Quên mật khẩu?" ở trang đăng nhập.
      </p>

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ padding: "1.5rem" }}
      >
        <label className="settings-field">
          <span>Mật khẩu hiện tại</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>

        <label className="settings-field">
          <span>Mật khẩu mới</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            required
          />
        </label>

        <label className="settings-field">
          <span>Xác nhận mật khẩu mới</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="settings-error">{error}</p>}

        <div className="settings-form-footer">
          {saved && <span className="settings-saved">✓ Đã đổi mật khẩu</span>}
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}
