"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Building2, MessageCircle } from "lucide-react";
import { getLang } from "../../../lib/prefs";
import { t } from "../../../lib/i18n";
import { systemSettingAPI } from "../../../lib/api";
import "./SettingsSupport.css";

export default function SettingsSupport() {
  const [lang, setLang] = useState("vi");
  const [supportInfo, setSupportInfo] = useState({
    company_name: "VinaTap - Bản Đồ Du Lịch NFC Việt Nam",
    company_email: "support@vinatap.vn",
    company_hotline: "1900 888 999",
    company_address: "Số 108 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
  });

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);

    // Fetch dynamic support contact info from System Settings API
    systemSettingAPI
      .get()
      .then((res) => {
        if (res.settings) {
          setSupportInfo((prev) => ({
            ...prev,
            ...res.settings,
          }));
        }
      })
      .catch(() => {});

    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "supportTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "supportSubtitle")}</p>

      {/* Company Name */}
      <div className="card settings-support__card">
        <Building2 size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">Thương hiệu &amp; Đơn vị vận hành</p>
          <p className="settings-support__value">{supportInfo.company_name}</p>
        </div>
      </div>

      {/* Hotline Support */}
      <div className="card settings-support__card">
        <Phone size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">Hotline Hỗ Trợ Khách Hàng</p>
          <a
            href={`tel:${supportInfo.company_hotline}`}
            className="settings-support__value"
          >
            {supportInfo.company_hotline}
          </a>
        </div>
      </div>

      {/* Email CSKH */}
      <div className="card settings-support__card">
        <Mail size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">{t(lang, "supportEmail")}</p>
          <a
            href={`mailto:${supportInfo.company_email}`}
            className="settings-support__value"
          >
            {supportInfo.company_email}
          </a>
        </div>
      </div>

      {/* Office & Showroom Address */}
      <div className="card settings-support__card">
        <MapPin size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">Trụ sở / Showroom trưng bày</p>
          <p className="settings-support__value">{supportInfo.company_address}</p>
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
