"use client";

import { useEffect, useState } from "react";
import { getLang, setLang } from "@/lib/prefs";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher({ className = "" }) {
  const [currentLang, setCurrentLang] = useState("vi");

  useEffect(() => {
    setCurrentLang(getLang());

    const handleLangUpdated = (e) => {
      if (e.detail) {
        setCurrentLang(e.detail);
      }
    };

    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  const handleSelect = (langCode) => {
    if (langCode !== currentLang) {
      setLang(langCode);
      setCurrentLang(langCode);
    }
  };

  return (
    <div
      className={`vinatap-lang-switcher ${className}`}
      role="group"
      aria-label="Chọn ngôn ngữ / Choose language"
    >
      <button
        type="button"
        className={`lang-btn ${currentLang === "vi" ? "is-active" : ""}`}
        onClick={() => handleSelect("vi")}
        aria-pressed={currentLang === "vi"}
        title="Tiếng Việt (Vietnamese)"
      >
        VI
      </button>

      <button
        type="button"
        className={`lang-btn ${currentLang === "en" ? "is-active" : ""}`}
        onClick={() => handleSelect("en")}
        aria-pressed={currentLang === "en"}
        title="English (Tiếng Anh)"
      >
        EN
      </button>
    </div>
  );
}
