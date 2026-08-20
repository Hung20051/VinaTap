"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { systemSettingAPI } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
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

  return (
    <div className="settings-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div>
          <h1 className="settings-page__title">{t(lang, "legalTitle")}</h1>
          <p className="settings-page__subtitle">{t(lang, "legalSubtitle")}</p>
        </div>

        {userIsAdmin && (
          <Link
            href="/admin/system-settings?tab=legal"
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

      <div className="card settings-legal__content" style={{ whiteSpace: "pre-line" }}>
        {tab === "terms" ? legalData.terms_content : legalData.privacy_content}
      </div>
    </div>
  );
}
