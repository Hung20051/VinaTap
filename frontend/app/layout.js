import "../styles/globals.css";

export const metadata = {
  title: "VinaTap — Bản đồ Du lịch NFC Việt Nam",
  description:
    "Sưu tầm 34 tỉnh thành, lưu giữ kỷ niệm chuyến đi bằng công nghệ NFC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Preload ảnh nền /auth và /forgot-password đã CHUYỂN sang
            app/page.js (trang chủ) — đặt ở đây (layout gốc) từng khiến
            ảnh bị preload trên MỌI trang kể cả /admin/revenue, nơi
            không hề dùng tới, gây warning "preloaded but not used" ở
            console trên toàn bộ khu vực admin. */}
        {/* Áp dụng theme (sáng/tối) đã lưu TRƯỚC khi trang render, để
            tránh hiện tượng nháy trắng rồi mới chuyển sang tối (FOUC).
            Chạy trước khi React hydrate nên phải là script thuần, không
            thể dùng useEffect. Vì script này set data-theme trực tiếp lên
            <html> ngoài tầm kiểm soát của React (sau khi server đã render
            xong nhưng trước khi client hydrate), React sẽ luôn thấy lệch
            giữa HTML server render và DOM thực tế lúc hydrate -> cần
            suppressHydrationWarning ở thẻ <html> để tắt cảnh báo (vô hại,
            vì đây là thay đổi có chủ đích chứ không phải lỗi state). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('vinatap_theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
