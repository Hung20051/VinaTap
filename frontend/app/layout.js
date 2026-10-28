import "@/styles/globals.css";
import TrafficTracker from "@/components/layout/TrafficTracker";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://www.vinatap.io.vn"),
  title: {
    default: "VinaTap — Vietnam Travel Guide, Itineraries & Local Experiences",
    template: "%s | VinaTap",
  },
  description:
    "VinaTap — Cẩm nang du lịch, ẩm thực, lưu trú và lịch trình khám phá Việt Nam. Comprehensive Vietnam travel guide, itineraries, food & hotel recommendations.",
  keywords: [
    "VinaTap",
    "Vietnam travel guide",
    "du lịch Việt Nam",
    "cẩm nang du lịch Việt Nam",
    "where to stay in Vietnam",
    "Vietnam itinerary",
    "Ho Chi Minh City travel guide",
    "Hanoi travel guide",
    "Da Nang Hoi An guide",
    "Ha Long Bay cruise",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  alternates: {
    canonical: "https://www.vinatap.io.vn",
  },
  openGraph: {
    title: "VinaTap — Vietnam Travel Guide & Local Experiences",
    description:
      "Cẩm nang du lịch, ẩm thực, lưu trú và bản đồ hành trình khám phá Việt Nam.",
    url: "https://www.vinatap.io.vn",
    siteName: "VinaTap",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/hero-showcase.jpg",
        width: 1200,
        height: 630,
        alt: "VinaTap Vietnam Travel Guide",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
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
          crossorigin="anonymous"
        ></script>
      </head>
      <body>
        <TrafficTracker />
        {children}
      </body>
    </html>
  );
}
