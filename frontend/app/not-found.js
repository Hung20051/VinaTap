import Link from "next/link";
import Dino404 from "@/components/ui/Dino404";

// Next.js App Router tự động dùng file này làm trang 404 cho MỌI route không tồn tại
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
        padding: "2.5rem 1.5rem",
        background: "radial-gradient(circle at 50% 30%, #ffffff 0%, #f8fafc 100%)",
        boxSizing: "border-box",
      }}
    >
      {/* Animation Khủng Long 404 Lottie to rộng bao phủ */}
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Dino404 size={850} />
      </div>

      <h1
        style={{
          marginTop: "1.25rem",
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}
      >
        404 - Lạc đường rồi!
      </h1>

      <p
        style={{
          marginTop: "0.6rem",
          maxWidth: "540px",
          color: "#64748b",
          fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
          lineHeight: 1.6,
        }}
      >
        Trang này không tồn tại hoặc đã được di chuyển. Chú khủng long VinaTap
        đang cố tìm lại lối đi giúp bạn!
      </p>

      <Link
        href="/"
        style={{
          marginTop: "2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem 2.5rem",
          borderRadius: 9999,
          background: "#059669",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
          boxShadow: "0 10px 25px rgba(5, 150, 105, 0.35)",
          textDecoration: "none",
          transition: "transform 0.2s ease, background-color 0.2s ease",
        }}
      >
        ← Trở về Trang Chủ
      </Link>
    </div>
  );
}
