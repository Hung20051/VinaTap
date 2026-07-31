"use client";
import AdminComingSoon from "../../../components/AdminComingSoon";

// TODO: lượt truy cập web — cần bảng page_views + middleware ghi log ở
// backend (đã bàn với Hưng, để sau vì "chỉ để flex", không gấp).
export default function AdminAnalytics() {
  return (
    <AdminComingSoon
      icon="📈"
      title="Lượt truy cập"
      description="Thống kê lượt xem trang — đang phát triển (không gấp)."
    />
  );
}
