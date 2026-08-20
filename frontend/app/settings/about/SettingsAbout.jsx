"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { systemSettingAPI } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import "./SettingsAbout.css";

export default function SettingsAbout() {
  const [lang, setLang] = useState("vi");
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const [aboutData, setAboutData] = useState({
    app_version: "1.0",
    about_desc: "VinaTap giúp bạn lưu giữ từng khoảnh khắc đáng nhớ qua từng mảnh ghép bản đồ Việt Nam.",
  });

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

  return (
    <div className="settings-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div>
          <h1 className="settings-page__title">{t(lang, "aboutTitle")}</h1>
          <p className="settings-page__subtitle">{t(lang, "aboutSubtitle")}</p>
        </div>

        {userIsAdmin && (
          <Link
            href="/admin/system-settings?tab=about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(37, 99, 235, 0.08)",
              color: "#2563eb",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(37, 99, 235, 0.2)",
            }}
          >
            <span>🛠️ Chỉnh sửa trong Quản Trị</span>
            <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <div className="card settings-about__card">
        <p className="settings-about__version">
          {t(lang, "appVersion")} {aboutData.app_version}
        </p>
        <p className="settings-about__desc">
          {aboutData.about_desc}
        </p>
      </div>

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
