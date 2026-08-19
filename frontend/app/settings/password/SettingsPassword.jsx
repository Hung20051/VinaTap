"use client";

import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";

export default function SettingsPassword() {
  const [lang, setLang] = useState("vi");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setError(t(lang, "newPasswordPlaceholder"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t(lang, "passwordMismatch"));
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
      setError(err.message || "Lỗi đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "passwordTitle")}</h1>
      <p className="settings-page__subtitle">
        {t(lang, "passwordSubtitle")}
      </p>

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ padding: "1.5rem" }}
      >
        <label className="settings-field">
          <span>{t(lang, "currentPassword")}</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t(lang, "currentPasswordPlaceholder")}
            required
          />
        </label>

        <label className="settings-field">
          <span>{t(lang, "newPassword")}</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t(lang, "newPasswordPlaceholder")}
            required
          />
        </label>

        <label className="settings-field">
          <span>{t(lang, "confirmPassword")}</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t(lang, "confirmPasswordPlaceholder")}
            required
          />
        </label>

        {error && <p className="settings-error">{error}</p>}

        <div className="settings-form-footer">
          {saved && <span className="settings-saved">✓ {t(lang, "passwordSuccess")}</span>}
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? t(lang, "saving") : t(lang, "updatePassword")}
          </button>
        </div>
      </form>
    </div>
  );
}
