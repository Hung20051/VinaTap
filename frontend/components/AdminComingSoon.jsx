"use client";

// Component placeholder dùng chung cho các mục admin CHƯA xây xong —
// tránh 404 khi bấm vào sidebar, và ghi rõ trạng thái để không ai tưởng
// nhầm là lỗi. Xóa import này khi trang thật đã có nội dung.
export default function AdminComingSoon({ icon, title, description }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
        gap: "0.75rem",
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>{icon}</div>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{title}</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: 380 }}>
        {description ||
          "Mục này đang được phát triển, sẽ có trong bản cập nhật tới."}
      </p>
    </div>
  );
}
