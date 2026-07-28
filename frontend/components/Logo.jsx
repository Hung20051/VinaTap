import Image from "next/image";
import Link from "next/link";

/**
 * Logo dùng chung cho toàn bộ trang (navbar, sidebar, trang auth...).
 * Trước đây mỗi trang tự viết logo riêng (chỗ có emoji 🗺, chỗ có icon
 * Map, chỗ có <span> chỗ không) -> không thống nhất. Giờ gom về 1 chỗ,
 * chỉ cần đổi ảnh/kích thước ở đây là áp dụng cho toàn site.
 *
 * @param {string} className - class bọc ngoài (giữ nguyên style từng khu vực,
 *   ví dụ "navbar__logo", "auth-brand__logo", "dash-sidebar__logo"...)
 * @param {number} size - kích thước ảnh logo (px), mặc định 28
 * @param {boolean} showText - có hiển thị chữ "VinaTap" cạnh ảnh không
 */
export default function Logo({
  className = "navbar__logo",
  size = 28,
  showText = true,
  style,
}) {
  return (
    <Link href="/" className={className} style={style}>
      <Image
        src="/logo.png"
        alt="VinaTap"
        width={size}
        height={size}
        priority
        style={{ objectFit: "contain", flexShrink: 0 }}
      />
      {showText && <span>VinaTap</span>}
    </Link>
  );
}
