"use client";

import { useEffect, useState } from "react";
import { getLang, setLang } from "@/lib/prefs";
import "./LanguageSwitch.css";

export default function LanguageSwitch({ variant = "navbar", className = "" }) {
  const [currentLang, setCurrentLang] = useState("vi");

  useEffect(() => {
    setCurrentLang(getLang());

    const handleLangUpdated = (e) => {
      setCurrentLang(e.detail);
    };

    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  const handleSwitch = (lang) => {
    if (lang === currentLang) return;
    setLang(lang);
    setCurrentLang(lang);
  };

  return (
    <div
      className={`vt-lang-switch vt-lang-switch--${variant} ${className}`}
      role="group"
      aria-label="Ngôn ngữ / Language"
    >
      <button
        type="button"
        onClick={() => handleSwitch("vi")}
        className={`vt-lang-btn ${currentLang === "vi" ? "is-active" : ""}`}
        aria-pressed={currentLang === "vi"}
        title="Tiếng Việt"
      >
        VI
      </button>
      <span className="vt-lang-divider">|</span>
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={`vt-lang-btn ${currentLang === "en" ? "is-active" : ""}`}
        aria-pressed={currentLang === "en"}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
