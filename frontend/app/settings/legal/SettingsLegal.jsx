"use client";

import { useEffect, useState } from "react";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { systemSettingAPI } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import "./SettingsLegal.css";

export default function SettingsLegal() {
  const [lang, setLang] = useState("vi");
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [tab, setTab] = useState("terms"); // terms | privacy

  const [legalData, setLegalData] = useState({
    terms_content:
      "Bằng việc sử dụng VinaTap, bạn đồng ý chỉ kích hoạt thẻ NFC do chính bạn sở hữu hoặc được chuyển nhượng hợp lệ qua tính năng chuyển thẻ trong app.\n\nNội dung album (ảnh, video, ghi chú) do bạn tải lên thuộc quyền sở hữu của bạn. VinaTap không chịu trách nhiệm với nội dung vi phạm pháp luật hoặc quyền sở hữu trí tuệ của bên thứ ba.\n\nAlbum đặt ở chế độ công khai (public) có thể được người khác xem mà không cần đăng nhập — vui lòng cân nhắc trước khi bật chế độ này.",
    privacy_content:
      "VinaTap thu thập: tên, email, số điện thoại, địa chỉ (nếu bạn cung cấp), ảnh đại diện, và nội dung album bạn tạo. Dữ liệu được lưu trữ bảo mật trên máy chủ VinaTap.\n\nMật khẩu được mã hóa một chiều (bcrypt), VinaTap không bao giờ lưu hoặc xem được mật khẩu gốc của bạn.\n\nVinaTap không chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba ngoài mục đích vận hành dịch vụ.",
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
          setLegalData((prev) => ({
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
      await systemSettingAPI.update(legalData);
      setMsg({ type: "success", text: "Đã cập nhật Điều khoản & Bảo mật cho ứng dụng!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Không lưu được nội dung" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "legalTitle")}</h1>
      <p className="settings-page__subtitle">
        {t(lang, "legalSubtitle")}
      </p>

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

      <div className="settings-legal__tabs">
        <button
          onClick={() => setTab("terms")}
          className={`settings-legal__tab ${tab === "terms" ? "is-active" : ""}`}
        >
          {t(lang, "termsOfService")}
        </button>
        <button
          onClick={() => setTab("privacy")}
          className={`settings-legal__tab ${tab === "privacy" ? "is-active" : ""}`}
        >
          {t(lang, "privacyPolicy")}
        </button>
      </div>

      {userIsAdmin ? (
        <form onSubmit={handleAdminSave} className="card">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
            🛠️ Quản Trị Viên: {tab === "terms" ? "Cập Nhật Điều Khoản Sử Dụng" : "Cập Nhật Chính Sách Bảo Mật"}
          </h2>

          <div className="settings-field">
            <span>
              {tab === "terms" ? "Nội dung Điều Khoản Sử Dụng" : "Nội dung Chính Sách Bảo Mật"}
            </span>
            <textarea
              rows={8}
              value={tab === "terms" ? legalData.terms_content : legalData.privacy_content}
              onChange={(e) =>
                setLegalData({
                  ...legalData,
                  [tab === "terms" ? "terms_content" : "privacy_content"]: e.target.value,
                })
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
              {saving ? "Đang lưu..." : "Lưu Văn Bản"}
            </button>
          </div>
        </form>
      ) : (
        <div className="card settings-legal__content" style={{ whiteSpace: "pre-line" }}>
          {tab === "terms" ? legalData.terms_content : legalData.privacy_content}
        </div>
      )}
    </div>
  );
}
