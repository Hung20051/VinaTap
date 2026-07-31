"use client";
import AdminComingSoon from "../../../components/AdminComingSoon";

// TODO: xem album báo cáo vi phạm, duyệt/ẩn album public. Cần thêm cơ chế
// "report" (bảng mới hoặc cột report_count trên albums) — hiện DB chưa
// có gì để admin biết album nào bị báo cáo.
export default function AdminAlbums() {
  return (
    <AdminComingSoon
      icon="🖼"
      title="Album & Kiểm duyệt"
      description="Xem album bị báo cáo, duyệt/ẩn album public — đang phát triển."
    />
  );
}
