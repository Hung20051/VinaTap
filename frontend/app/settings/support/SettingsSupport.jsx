"use client";

import { Mail, MessageCircle } from "lucide-react";
import "./SettingsSupport.css";

const SUPPORT_EMAIL = "support@vinatap.com";

export default function SettingsSupport() {
  return (
    <div className="settings-page">
      <h1 className="settings-page__title">🆘 Hỗ trợ</h1>
      <p className="settings-page__subtitle">
        Cần giúp đỡ? Liên hệ với đội ngũ VinaTap
      </p>

      <div className="card settings-support__card">
        <Mail size={22} className="settings-support__icon" />
        <div>
          <p className="settings-support__label">Email hỗ trợ</p>
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
          <p className="settings-support__label">Báo lỗi / góp ý</p>
          <p className="settings-support__hint">
            Gửi email kèm mô tả lỗi và ảnh chụp màn hình nếu có — chúng mình sẽ
            phản hồi sớm nhất có thể.
          </p>
        </div>
      </div>
    </div>
  );
}
