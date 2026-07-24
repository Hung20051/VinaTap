import Link from "next/link";

// Next.js App Router tự động dùng file này làm trang 404 cho MỌI route
// không khớp (và cả khi gọi notFound() thủ công) — không cần import hay
// khai báo route ở đâu cả, cứ đặt đúng tên `not-found.js` trong app/ là
// được nhận diện.
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at 30% 20%, #fff1eb 0%, #fafafa 55%, #fafafa 100%)",
      }}
    >
      {/* La bàn xoay nhẹ — gợi ý "lạc đường" đúng chất app du lịch/bản đồ */}
      <div
        style={{
          fontSize: "5.5rem",
          lineHeight: 1,
          animation: "compassSpin 3.5s ease-in-out infinite",
        }}
        aria-hidden="true"
      >
        🧭
      </div>

      <h1
        style={{
          marginTop: "1.5rem",
          fontSize: "clamp(3rem, 10vw, 5rem)",
          fontWeight: 800,
          color: "#e85d04",
          letterSpacing: "-2px",
          lineHeight: 1,
        }}
      >
        404
      </h1>

      <h2
        style={{
          marginTop: ".75rem",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        Lạc đường rồi bạn ơi!
      </h2>

      <p
        style={{
          marginTop: ".6rem",
          maxWidth: 420,
          color: "#6b7280",
          fontSize: ".95rem",
        }}
      >
        Trang này chưa có trên bản đồ của VinaTap — có thể đang được khám phá,
        hoặc đường dẫn không còn tồn tại nữa.
      </p>

      <Link
        href="/"
        style={{
          marginTop: "2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: ".5rem",
          padding: ".8rem 1.75rem",
          borderRadius: 9999,
          background: "#0d9488",
          color: "#fff",
          fontWeight: 700,
          fontSize: ".95rem",
          boxShadow: "0 8px 24px rgba(13,148,136,.3)",
        }}
      >
        ← Về trang chủ
      </Link>

      <style>{`
        @keyframes compassSpin {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
