"use client";

import { useEffect, useState } from "react";
import { getLang } from "../../../lib/prefs";
import { t } from "../../../lib/i18n";
import "./SettingsLegal.css";

export default function SettingsLegal() {
  const [lang, setLang] = useState("vi");
  const [tab, setTab] = useState("terms"); // terms | privacy

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">{t(lang, "legalTitle")}</h1>
      <p className="settings-page__subtitle">
        {t(lang, "legalSubtitle")}
      </p>

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

      <div className="card settings-legal__content">
        {tab === "terms" ? (
          <>
            <p>
              {lang === "en"
                ? "By using VinaTap, you agree to only activate NFC cards that you legally own or transferred via the app."
                : "Bằng việc sử dụng VinaTap, bạn đồng ý chỉ kích hoạt thẻ NFC do chính bạn sở hữu hoặc được chuyển nhượng hợp lệ qua tính năng chuyển thẻ trong app."}
            </p>
            <p>
              {lang === "en"
                ? "Album content uploaded by you remains your property. VinaTap is not liable for third-party copyright violations."
                : "Nội dung album (ảnh, video, ghi chú) do bạn tải lên thuộc quyền sở hữu của bạn. VinaTap không chịu trách nhiệm với nội dung vi phạm pháp luật hoặc quyền sở hữu trí tuệ của bên thứ ba."}
            </p>
            <p>
              {lang === "en"
                ? "Public albums can be viewed by anyone without login. Please review your privacy settings carefully."
                : "Album đặt ở chế độ công khai (public) có thể được người khác xem mà không cần đăng nhập — vui lòng cân nhắc trước khi bật chế độ này."}
            </p>
          </>
        ) : (
          <>
            <p>
              {lang === "en"
                ? "VinaTap collects basic profile information (name, email, phone, shipping address) to operate service and ship physical cards."
                : "VinaTap thu thập: tên, email, số điện thoại, địa chỉ (nếu bạn cung cấp), ảnh đại diện, và nội dung album bạn tạo. Dữ liệu được lưu trữ trên máy chủ VinaTap và Cloudinary."}
            </p>
            <p>
              {lang === "en"
                ? "Passwords are securely hashed with bcrypt; VinaTap never stores raw plaintext passwords."
                : "Mật khẩu được mã hóa một chiều (bcrypt), VinaTap không bao giờ lưu hoặc xem được mật khẩu gốc của bạn."}
            </p>
            <p>
              {lang === "en"
                ? "Personal data is never sold to third parties."
                : "VinaTap không chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba ngoài mục đích vận hành dịch vụ."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
