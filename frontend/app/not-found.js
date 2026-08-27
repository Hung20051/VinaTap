import Dino404 from "@/components/ui/Dino404";

// Next.js App Router tự động dùng file này làm trang 404 cho MỌI route không tồn tại
export default function NotFound() {
  return (
    <Dino404
      title="404 - Lạc đường rồi!"
      message="Trang này không tồn tại hoặc đã được di chuyển. Chú khủng long VinaTap đang cố tìm lại lối đi giúp bạn!"
      backBtnText="Quay Lại Trang Trước"
    />
  );
}
