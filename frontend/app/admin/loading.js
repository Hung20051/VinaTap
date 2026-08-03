import PageSkeleton from "../../components/PageSkeleton";

// Next.js tự động hiện file này (Suspense boundary có sẵn) mỗi khi điều
// hướng sang 1 route con của /admin/* mà route đó (hoặc route hiện tại)
// chưa sẵn sàng — kể cả lúc dev-mode Turbopack đang compile route lần
// đầu. Nhờ vậy sidebar nhảy active-state ngay lập tức, đồng thời có
// skeleton hiện ra thay vì đứng im ở trang cũ.
export default function AdminLoading() {
  return <PageSkeleton variant="grid" />;
}
