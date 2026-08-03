"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SettingsSidebar from "../../components/SettingsSidebar";
import { getUser, requireAuth } from "../../lib/auth";
// admin-shell.css / settings-shell.css đã chuyển lên app/layout.js
// (layout gốc) — xem chú thích ở đó để hiểu lý do (tránh vỡ CSS khi F5
// thẳng vào 1 trang con, vd /settings/password).

export default function SettingsLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
    setUser(getUser());
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nghe sự kiện từ updateUser() (lib/auth.js) — bắn ra mỗi khi 1 trang con
  // (vd SettingsAccount) đổi avatar/tên và ghi lại localStorage. Nhờ đó
  // SettingsSidebar cập nhật NGAY LẬP TỨC trong cùng tab, không cần F5.
  useEffect(() => {
    const handleUserUpdated = (e) => setUser(e.detail);
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    return () =>
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
  }, []);

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
      <SettingsSidebar user={user} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
