"use client";

import { useEffect, useState } from "react";
import { getLang } from "../../../lib/prefs";
import { t } from "../../../lib/i18n";
import "./SettingsAbout.css";

export default function SettingsAbout() {
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "aboutTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "aboutSubtitle")}</p>

      <div className="card settings-about__card">
        <p className="settings-about__version">{t(lang, "appVersion")} 1.0</p>
        <p className="settings-about__desc">
          {t(lang, "aboutDesc")}
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
