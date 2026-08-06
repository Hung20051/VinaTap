"use client";

import { useEffect, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { getLang } from "../../../lib/prefs";
import { t } from "../../../lib/i18n";
import "./SettingsSupport.css";

const SUPPORT_EMAIL = "support@vinatap.com";

export default function SettingsSupport() {
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "supportTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "supportSubtitle")}</p>

      <div className="card settings-support__card">
        <Mail size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">{t(lang, "supportEmail")}</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="settings-support__value"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <div className="card settings-support__card">
        <MessageCircle size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">{t(lang, "supportDocs")}</p>
          <p className="settings-support__hint">
            {t(lang, "supportDocsDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
