"use client";

import { useState } from "react";
import "./SettingsLegal.css";

export default function SettingsLegal() {
  const [tab, setTab] = useState("terms"); // terms | privacy

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">📄 Điều khoản & Bảo mật</h1>
      <p className="settings-page__subtitle">
        Điều khoản sử dụng và chính sách bảo mật VinaTap
      </p>

      <div className="settings-legal__tabs">
        <button
          onClick={() => setTab("terms")}
          className={`settings-legal__tab ${tab === "terms" ? "is-active" : ""}`}
        >
          Điều khoản sử dụng
        </button>
        <button
          onClick={() => setTab("privacy")}
          className={`settings-legal__tab ${tab === "privacy" ? "is-active" : ""}`}
        >
          Chính sách bảo mật
        </button>
      </div>

      <div className="card settings-legal__content">
        {tab === "terms" ? (
          <>
            <p>
              Bằng việc sử dụng VinaTap, bạn đồng ý chỉ kích hoạt thẻ NFC do
              chính bạn sở hữu hoặc được chuyển nhượng hợp lệ qua tính năng
              chuyển thẻ trong app.
            </p>
            <p>
              Nội dung album (ảnh, video, ghi chú) do bạn tải lên thuộc quyền sở
              hữu của bạn. VinaTap không chịu trách nhiệm với nội dung vi phạm
              pháp luật hoặc quyền sở hữu trí tuệ của bên thứ ba do người dùng
              tự đăng tải.
            </p>
            <p>
              Album đặt ở chế độ công khai (public) có thể được người khác xem
              mà không cần đăng nhập — vui lòng cân nhắc trước khi bật chế độ
              này.
            </p>
          </>
        ) : (
          <>
            <p>
              VinaTap thu thập: tên, email, số điện thoại, địa chỉ (nếu bạn cung
              cấp), ảnh đại diện, và nội dung album bạn tạo. Dữ liệu được lưu
              trữ trên máy chủ VinaTap và Cloudinary (dịch vụ lưu trữ
              ảnh/video).
            </p>
            <p>
              Mật khẩu được mã hóa một chiều (bcrypt), VinaTap không bao giờ lưu
              hoặc xem được mật khẩu gốc của bạn.
            </p>
            <p>
              VinaTap không chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba ngoài
              mục đích vận hành dịch vụ (Cloudinary cho lưu trữ ảnh, Google
              Gemini cho tính năng viết caption ảnh tự động).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
