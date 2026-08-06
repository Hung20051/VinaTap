"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { authAPI } from "../../../lib/api";
import { getUser, updateUser } from "../../../lib/auth";
import { getLang } from "../../../lib/prefs";
import { t } from "../../../lib/i18n";
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
    const u = getUser();
    setUser(u);
    setName(u?.name || "");
    setPhone(u?.phone || "");
    setAddress(u?.address || "");

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
      setAvatarError(err.message || "Lỗi upload ảnh");
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
      setError(err.message || "Lỗi lưu hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "accountTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "accountSubtitle")}</p>

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
            {avatarUploading ? t(lang, "profileAvatarUploading") : t(lang, "profileAvatarChange")}
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
          <span>{t(lang, "displayName")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="settings-field">
          <span>{t(lang, "profileEmail")}</span>
          <input
            type="email"
            value={user.email}
            disabled
            className="settings-field--readonly"
          />
          <span className="settings-field__hint">
            {t(lang, "emailReadOnlyHint")}
          </span>
        </label>

        <label className="settings-field">
          <span>{t(lang, "profilePhone")}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t(lang, "profilePhonePlaceholder")}
          />
        </label>

        <label className="settings-field">
          <span>{t(lang, "profileAddress")}</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t(lang, "profileAddressPlaceholder")}
            rows={3}
          />
        </label>

        {error && <p className="settings-error">{error}</p>}

        <div className="settings-form-footer">
          {saved && <span className="settings-saved">✓ {t(lang, "savedSuccess")}</span>}
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? t(lang, "saving") : t(lang, "saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}
