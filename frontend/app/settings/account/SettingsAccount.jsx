"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, User, Mail, Phone, MapPin, ShieldCheck, Lock } from "lucide-react";
import { authAPI } from "@/lib/api";
import { getUser, updateUser } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "./SettingsAccount.css";

export default function SettingsAccount() {
  const [lang, setLang] = useState("vi");
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
    setLang(getLang());
    const cached = getUser();
    if (cached) {
      setUser(cached);
      setName(cached.name || "");
      setPhone(cached.phone || "");
      setAddress(cached.address || "");
    }

    // Luôn fetch thông tin mới nhất từ Database
    authAPI
      .getMe()
      .then((res) => {
        if (res?.user) {
          const updated = updateUser(res.user);
          setUser(updated);
          setName(updated.name || "");
          setPhone(updated.phone || "");
          setAddress(updated.address || "");
        }
      })
      .catch((err) => {
        console.warn("Lỗi load hồ sơ từ API:", err);
      });

    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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
      setAvatarError(err.message || "Lỗi upload ảnh đại diện");
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
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Lỗi lưu thông tin hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="settings-acc-container">
      {/* Top Header */}
      <div className="settings-acc-header">
        <h1 className="settings-acc-title">
          <span className="title-desktop">👤 Hồ Sơ &amp; Thông Tin Tài Khoản</span>
          <span className="title-mobile">👤 Hồ Sơ Tài Khoản</span>
        </h1>
        <p className="settings-acc-subtitle">
          Cập nhật thông tin cá nhân và địa chỉ nhận ship thẻ chip NFC
        </p>
      </div>

      {/* Profile Avatar Card */}
      <div className="card settings-acc-avatar-card">
        <div
          className="settings-acc-avatar-wrapper"
          onClick={() => avatarInputRef.current?.click()}
          title="Nhấp để đổi ảnh đại diện"
        >
          <span className="settings-acc-avatar">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" />
            ) : (
              (user.name || "?").trim().charAt(0).toUpperCase()
            )}
          </span>
          <button
            type="button"
            className="settings-acc-avatar-badge"
            disabled={avatarUploading}
            title="Đổi ảnh đại diện"
          >
            <Camera size={15} />
          </button>
        </div>

        <div className="settings-acc-profile-meta">
          <div className="settings-acc-name-row">
            <h3 className="settings-acc-user-name">{user.name}</h3>
            <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-customer"}`}>
              {user.role === "admin" ? "Admin 🛡️" : "Khách Hàng"}
            </span>
          </div>
          <p className="settings-acc-user-email">{user.email}</p>

          {avatarUploading && (
            <span className="settings-acc-uploading-text">
              ⏳ Đang tải ảnh mới lên...
            </span>
          )}

          {avatarError && <p className="settings-acc-error">{avatarError}</p>}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            hidden
          />
        </div>
      </div>

      {/* Main Details Form Card */}
      <form onSubmit={handleSave} className="card settings-acc-form-card">
        <h3 className="settings-acc-form-title">
          <User size={18} /> Thông Tin Chi Tiết
        </h3>

        <div className="settings-acc-form-grid">
          {/* Tên hiển thị */}
          <div className="settings-acc-field">
            <label className="settings-acc-label">
              <User size={14} /> Tên Hiển Thị *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên đầy đủ..."
              className="settings-acc-input"
              required
            />
          </div>

          {/* Email */}
          <div className="settings-acc-field">
            <label className="settings-acc-label">
              <Mail size={14} /> Email Đăng Ký (Đã Xác Thực)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="settings-acc-input settings-acc-input--readonly"
            />
            <span className="settings-acc-hint">
              <Lock size={12} /> Email được bảo vệ, không thể thay đổi
            </span>
          </div>

          {/* Số điện thoại */}
          <div className="settings-acc-field">
            <label className="settings-acc-label">
              <Phone size={14} /> Số Điện Thoại Nhận Hàng (Ship NFC)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0912 345 678"
              className="settings-acc-input"
            />
          </div>

          {/* Địa chỉ */}
          <div className="settings-acc-field settings-acc-field--full">
            <label className="settings-acc-label">
              <MapPin size={14} /> Địa Chỉ Nhận Hàng Mặc Định
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              rows={3}
              className="settings-acc-textarea"
            />
          </div>
        </div>

        {error && <p className="settings-acc-error">{error}</p>}

        <div className="settings-acc-footer">
          {saved && (
            <span className="settings-acc-saved">
              <CheckCircle2 size={16} /> Đã lưu thông tin thành công!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn settings-acc-btn-submit"
          >
            {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
