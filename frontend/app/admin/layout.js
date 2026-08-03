"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import { getUser, requireAdmin, clearAuth } from "../../lib/auth";
// admin-shell.css đã chuyển lên app/layout.js (layout gốc) — xem chú
// thích ở đó để hiểu lý do (tránh vỡ CSS khi F5 thẳng vào 1 trang con).

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // requireAdmin tự redirect về "/" nếu không phải admin — chạy 1 lần
    // ở đây, mọi trang con trong app/admin/* đều được bảo vệ mà không
    // cần lặp lại check này ở từng page.js riêng lẻ.
    if (!requireAdmin(router)) return;
    setUser(getUser());
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nghe sự kiện từ updateUser() (lib/auth.js) — nếu sau này admin cũng có
  // trang đổi avatar/tên (ví dụ AdminSettings đang là placeholder), sidebar
  // admin sẽ tự cập nhật ngay, không cần F5. Xem chi tiết ở settings/layout.js.
  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    return () =>
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
  }, []);

  const handleLogout = () => {
    clearAuth();
    // Hard reload — lý do xem chú thích tương tự ở app/page.js
    window.location.href = "/";
  };

  // Chưa xác nhận xong quyền admin -> không render gì (tránh nháy nội
  // dung admin lên rồi mới bị đá ra nếu user không đủ quyền)
  if (!checked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AdminSidebar user={user} onLogout={handleLogout} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
