"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAuth, isAdmin } from "../../lib/auth";

// Auth guard dùng chung cho MỌI trang trong app/customer/* — mirror đúng
// pattern app/admin/layout.js và app/settings/layout.js. Chạy 1 lần ở
// đây, các trang con (CustomerDashboard, và các trang customer thêm sau
// này) không cần tự gọi requireAuth() nữa.
export default function CustomerLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!requireAuth(router)) return;
    // Admin không dùng khu vực customer ("0/34 tỉnh", "Kích hoạt NFC"...)
    // — dù đăng nhập xong đã redirect sang /admin rồi, vẫn cần chặn thêm
    // ở đây phòng trường hợp admin tự gõ URL /customer/..., bấm Back,
    // hoặc mở lại tab/bookmark cũ.
    if (isAdmin()) {
      router.replace("/admin");
      return;
    }
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chưa xác nhận xong đăng nhập -> không render gì (tránh nháy nội dung
  // dashboard lên rồi mới bị đá ra nếu chưa đăng nhập hoặc là admin)
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

  return children;
}
