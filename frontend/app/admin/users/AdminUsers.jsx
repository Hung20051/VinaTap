"use client";
import AdminComingSoon from "../../../components/AdminComingSoon";

// TODO: danh sách user, khóa/mở tài khoản (users.status), đổi role.
// Backend chưa có route riêng cho việc này — cần thêm userController.js
// + routes/users.js (GET list có phân trang, PATCH status, PATCH role).
export default function AdminUsers() {
  return (
    <AdminComingSoon
      icon="👥"
      title="Người dùng"
      description="Danh sách user, khóa/mở tài khoản, đổi role — đang phát triển."
    />
  );
}
