import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt Next.js Dev Tools indicator (nút tròn "N" góc dưới trái khi chạy
  // `next dev`) — chỉ là công cụ debug lúc phát triển, không ảnh hưởng
  // production, nhưng vướng khi demo nên tắt cho gọn.
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatar
    ],
  },

  // Tự động redirect nếu ai đó truy cập /customer/settings về /settings cấp 1
  async redirects() {
    return [
      {
        source: "/customer/settings",
        destination: "/settings",
        permanent: true,
      },
      {
        source: "/customer/settings/:path*",
        destination: "/settings/:path*",
        permanent: true,
      },
    ];
  },

  // Cho phép gọi API backend từ server component nếu cần sau này
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
