"use client";

import "./SettingsAbout.css";

export default function SettingsAbout() {
  return (
    <div className="settings-page">
      <h1 className="settings-page__title">🗺 Về VinaTap</h1>
      <p className="settings-page__subtitle">Bản đồ Du lịch NFC Việt Nam</p>

      <div className="card settings-about__card">
        <p className="settings-about__version">Phiên bản 1.0</p>
        <p className="settings-about__desc">
          VinaTap — sưu tầm 34 tỉnh thành Việt Nam qua thẻ NFC, lưu giữ kỷ niệm
          chuyến đi bằng album ảnh có AI viết caption tự động.
        </p>
      </div>

      <div className="card settings-about__card">
        <h2 className="settings-about__section-title">Bản quyền tài nguyên</h2>
        <p className="settings-about__credit">
          Sticker sử dụng bộ biểu tượng{" "}
          <a
            href="https://github.com/twitter/twemoji"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twemoji
          </a>{" "}
          — phát hành theo giấy phép{" "}
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
