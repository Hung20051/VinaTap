"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import { getUser, requireAdmin, clearAuth } from "../../lib/auth";
import "../../styles/admin-shell.css";

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
