import "@/styles/globals.css";
import TrafficTracker from "@/components/layout/TrafficTracker";
import Script from "next/script";

export const metadata = {
  title: "VinaTap",
  description: "VinaTap — Cẩm nang du lịch và khám phá Việt Nam.",
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
        {/* Google AdSense Account Verification */}
        <meta name="google-adsense-account" content="ca-pub-7715734145505240" />
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7715734145505240"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <TrafficTracker />
        {children}
      </body>
    </html>
  );
}

