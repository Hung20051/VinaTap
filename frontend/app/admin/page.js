"use client";

// Route "/admin" chỉ để redirect sang "/admin/dashboard" — nội dung thật
// đã tách sang app/admin/dashboard/ (theo cấu trúc feature-folder mới).
// Toàn bộ 864 dòng logic cũ (CRUD tỉnh/địa danh, upload sticker, tạo
// serial NFC hàng loạt) đã được backup, sẽ di dời dần sang
// app/admin/provinces/, app/admin/nfc-cards/, app/admin/stickers/.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

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
