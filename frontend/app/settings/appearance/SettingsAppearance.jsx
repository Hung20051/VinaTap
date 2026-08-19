"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Check } from "lucide-react";
import {
  getTheme,
  setTheme as persistTheme,
  getLang,
  setLang as persistLang,
} from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "./SettingsAppearance.css";

export default function SettingsAppearance() {
  const [lang, setLangState] = useState("vi");
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    setLangState(getLang());
    setThemeState(getTheme());

    const handleLangUpdated = (e) => setLangState(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const handleLangChange = (value) => {
    persistLang(value);
    setLangState(value);
  };

  const handleThemeChange = (value) => {
    persistTheme(value);
    setThemeState(value);
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "appearanceTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "appearanceSubtitle")}</p>

      <div className="card settings-appearance__section">
        <h2 className="settings-appearance__section-title">{t(lang, "settingsLanguage")}</h2>
        <p className="settings-field__hint" style={{ marginBottom: "1rem" }}>
          {t(lang, "languageDesc")}
        </p>
        <div className="settings-appearance__options">
          <button
            onClick={() => handleLangChange("vi")}
            className={`settings-appearance__option ${lang === "vi" ? "is-active" : ""}`}
          >
            🇻🇳 Tiếng Việt
            {lang === "vi" && <Check size={16} />}
          </button>
          <button
            onClick={() => handleLangChange("en")}
            className={`settings-appearance__option ${lang === "en" ? "is-active" : ""}`}
          >
            🇬🇧 English
            {lang === "en" && <Check size={16} />}
          </button>
        </div>
      </div>

      <div className="card settings-appearance__section">
        <h2 className="settings-appearance__section-title">{t(lang, "settingsTheme")}</h2>
        <p className="settings-field__hint" style={{ marginBottom: "1rem" }}>
          {t(lang, "themeDesc")}
        </p>
        <div className="settings-appearance__options">
          <button
            onClick={() => handleThemeChange("light")}
            className={`settings-appearance__option ${theme === "light" ? "is-active" : ""}`}
          >
            <Sun size={16} /> {t(lang, "themeLight")}
            {theme === "light" && <Check size={16} />}
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`settings-appearance__option ${theme === "dark" ? "is-active" : ""}`}
          >
            <Moon size={16} /> {t(lang, "themeDark")}
            {theme === "dark" && <Check size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
