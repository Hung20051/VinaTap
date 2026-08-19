"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Building2, MessageCircle, Save, CheckCircle, AlertCircle } from "lucide-react";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { systemSettingAPI } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import "./SettingsSupport.css";

export default function SettingsSupport() {
  const [lang, setLang] = useState("vi");
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [supportInfo, setSupportInfo] = useState({
    company_name: "VinaTap - Bản Đồ Du Lịch NFC Việt Nam",
    company_email: "support@vinatap.vn",
    company_hotline: "1900 888 999",
    company_address: "Số 108 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    setLang(getLang());
    setUserIsAdmin(isAdmin());

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

  const handleAdminSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await systemSettingAPI.update(supportInfo);
      setMsg({ type: "success", text: "Đã lưu thông tin Hỗ trợ cho toàn bộ Khách hàng!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Không lưu được cấu hình" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "supportTitle")}</h1>
      <p className="settings-page__subtitle">{t(lang, "supportSubtitle")}</p>

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

      {/* ADMIN EDITING FORM */}
      {userIsAdmin ? (
        <form onSubmit={handleAdminSave} className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
            🛠️ Quản Trị Viên: Cập Nhật Thông Tin Hỗ Trợ Khách Hàng
          </h2>

          <div className="settings-field">
            <span>Tên Thương Hiệu &amp; Đơn Vị Vận Hành</span>
            <input
              type="text"
              value={supportInfo.company_name}
              onChange={(e) =>
                setSupportInfo({ ...supportInfo, company_name: e.target.value })
              }
              required
            />
          </div>

          <div className="settings-field">
            <span>Hotline Hỗ Trợ</span>
            <input
              type="text"
              value={supportInfo.company_hotline}
              onChange={(e) =>
                setSupportInfo({ ...supportInfo, company_hotline: e.target.value })
              }
              required
            />
          </div>

          <div className="settings-field">
            <span>Email Hỗ Trợ CSKH</span>
            <input
              type="email"
              value={supportInfo.company_email}
              onChange={(e) =>
                setSupportInfo({ ...supportInfo, company_email: e.target.value })
              }
              required
            />
          </div>

          <div className="settings-field">
            <span>Địa Chỉ Trụ Sở / Showroom</span>
            <input
              type="text"
              value={supportInfo.company_address}
              onChange={(e) =>
                setSupportInfo({ ...supportInfo, company_address: e.target.value })
              }
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
              {saving ? "Đang lưu..." : "Lưu Thông Tin Hỗ Trợ"}
            </button>
          </div>
        </form>
      ) : (
        /* CUSTOMER READ-ONLY VIEW */
        <>
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
        </>
      )}
    </div>
  );
}
