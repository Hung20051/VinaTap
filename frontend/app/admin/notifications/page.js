import { Suspense } from "react";
import AdminNotifications from "./AdminNotifications";

export const metadata = {
  title: "Gửi Thông Báo - Admin VinaTap",
  description: "Trung tâm phát thông báo, tin tức và quà tặng Voucher VinaTap",
};

export default function AdminNotificationsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Đang tải Trung Tâm Thông Báo...</div>}>
      <AdminNotifications />
    </Suspense>
  );
}
