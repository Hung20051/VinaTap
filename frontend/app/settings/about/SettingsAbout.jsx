"use client";

import { useEffect, useState } from "react";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { systemSettingAPI } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import "./SettingsAbout.css";

export default function SettingsAbout() {
  const [lang, setLang] = useState("vi");
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const [aboutData, setAboutData] = useState({
    app_version: "1.0",
    about_desc: "VinaTap giúp bạn lưu giữ từng khoảnh khắc đáng nhớ qua từng mảnh ghép bản đồ Việt Nam.",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    setLang(getLang());
    setUserIsAdmin(isAdmin());

    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);

    systemSettingAPI
      .get()
      .then((res) => {
        if (res.settings) {
          setAboutData((prev) => ({
            ...prev,
            ...res.settings,
          }));
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const handleAdminSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await systemSettingAPI.update(aboutData);
      setMsg({ type: "success", text: "Đã lưu thông tin giới thiệu VinaTap!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Không lưu được cấu hình" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "aboutTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "aboutSubtitle")}</p>

      {msg.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background:
              msg.type === "success"
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",
            border: `1px solid ${
              msg.type === "success" ? "#22c55e" : "#ef4444"
            }`,
            color: msg.type === "success" ? "#16a34a" : "#dc2626",
            fontWeight: 600,
          }}
        >
          {msg.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {userIsAdmin ? (
        <form onSubmit={handleAdminSave} className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
            🛠️ Quản Trị Viên: Cập Nhật Giới Thiệu Nền Tảng VinaTap
          </h2>

          <div className="settings-field">
            <span>Phiên Bản Ứng Dụng</span>
            <input
              type="text"
              value={aboutData.app_version}
              onChange={(e) => setAboutData({ ...aboutData, app_version: e.target.value })}
              required
            />
          </div>

          <div className="settings-field">
            <span>Mô Tả Giới Thiệu Nền Tảng</span>
            <textarea
              rows={4}
              value={aboutData.about_desc}
              onChange={(e) => setAboutData({ ...aboutData, about_desc: e.target.value })}
              required
            />
          </div>

          <div className="settings-form-footer">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Save size={16} />
              {saving ? "Đang lưu..." : "Lưu Giới Thiệu"}
            </button>
          </div>
        </form>
      ) : (
        <div className="card settings-about__card">
          <p className="settings-about__version">
            {t(lang, "appVersion")} {aboutData.app_version}
          </p>
          <p className="settings-about__desc">
            {aboutData.about_desc}
          </p>
        </div>
      )}

      <div className="card settings-about__card">
        <h2 className="settings-about__section-title">Twemoji License</h2>
        <p className="settings-about__credit">
          Icons provided by{" "}
          <a
            href="https://github.com/twitter/twemoji"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twemoji
          </a>{" "}
          — licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC-BY 4.0
          </a>
          .
        </p>
      </div>
    </div>
  );
}
