"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { authAPI } from "../../../lib/api";
import { getUser, updateUser } from "../../../lib/auth";
import "./SettingsAccount.css";

export default function SettingsAccount() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const avatarInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setName(u?.name || "");
    setPhone(u?.phone || "");
    setAddress(u?.address || "");
  }, []);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // cho phép chọn lại cùng 1 file lần nữa nếu cần
    if (!file) return;

    setAvatarError("");
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await authAPI.uploadAvatar(formData);
      const updated = updateUser(res.user);
      setUser(updated);
    } catch (err) {
      setAvatarError(err.message || "Không upload được ảnh đại diện");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await authAPI.updateMe({
        name: name.trim() || user?.name,
        phone: phone.trim(),
        address: address.trim(),
      });
      const updated = updateUser(res.user);
      setUser(updated);
      setName(updated?.name || "");
      setPhone(updated?.phone || "");
      setAddress(updated?.address || "");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || "Không lưu được hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">👤 Tài khoản</h1>
      <p className="settings-page__subtitle">
        Thông tin cá nhân — địa chỉ dùng để tự động điền khi đặt hàng giao thẻ
        NFC sau này.
      </p>

      <div className="card settings-account__avatar-card">
        <span className="settings-account__avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" />
          ) : (
            (user.name || "?").trim().charAt(0).toUpperCase()
          )}
        </span>
        <div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
            className="btn btn-outline settings-account__avatar-btn"
          >
            <Camera size={15} />
            {avatarUploading ? "Đang tải lên..." : "Đổi ảnh đại diện"}
          </button>
          {avatarError && <p className="settings-error">{avatarError}</p>}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            hidden
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="card settings-account__form">
        <label className="settings-field">
          <span>Tên hiển thị</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="settings-field">
          <span>Email</span>
          <input
            type="email"
            value={user.email}
            disabled
            className="settings-field--readonly"
          />
          <span className="settings-field__hint">
            Chưa hỗ trợ đổi email trong bản này
          </span>
        </label>

        <label className="settings-field">
          <span>Số điện thoại</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxx"
          />
        </label>

        <label className="settings-field">
          <span>Địa chỉ nhận hàng</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Dùng để tự động điền khi đặt hàng ship thẻ NFC"
            rows={3}
          />
        </label>

        {error && <p className="settings-error">{error}</p>}

        <div className="settings-form-footer">
          {saved && <span className="settings-saved">✓ Đã lưu</span>}
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
