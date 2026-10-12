"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Route error caught:", error);
  }, [error]);

  return (
    <div style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#f8fafc", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ maxWidth: "480px", margin: "20px", padding: "32px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", margin: "0 auto 16px", borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: "24px" }}>
          ⚠️
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Không thể hiển thị trang</h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.5" }}>
          {error?.message || "Đã xảy ra lỗi trong quá trình tải dữ liệu. Vui lòng thử lại."}
        </p>
        <button
          onClick={() => reset ? reset() : window.location.reload()}
          style={{
            padding: "10px 24px",
            backgroundColor: "#0d9488",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
