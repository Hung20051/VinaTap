import "@/styles/globals.css";
import TrafficTracker from "@/components/layout/TrafficTracker";

export const metadata = {
  title: "VinaTap — Bản Đồ Du Lịch NFC Việt Nam",
  description:
    "Bộ sưu tập 34 mảnh ghép tỉnh thành Việt Nam qua thẻ NFC và album ảnh kỷ niệm du lịch.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Kalam:wght@400;700&display=swap&subset=vietnamese,latin-ext"
          rel="stylesheet"
        />
        <script
          id="theme-initializer"
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
      <body>
        <TrafficTracker />
        {children}
      </body>
    </html>
  );
}
