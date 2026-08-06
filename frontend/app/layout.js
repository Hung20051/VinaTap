import "../styles/globals.css";
import "../styles/admin-shell.css";
import "../styles/sidebar.css";
import "../styles/settings-shell.css";
import "../styles/skeleton.css";

export const metadata = {
  title: "VinaTap — Bản đồ Du lịch NFC Việt Nam",
  description:
    "Sưu tầm 34 tỉnh thành, lưu giữ kỷ niệm chuyến đi bằng công nghệ NFC",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
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
