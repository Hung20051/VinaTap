// Component skeleton dùng chung cho app/admin/loading.js và
// app/settings/loading.js — Next.js tự động hiện file loading.js trong
// lúc route đang tải (kể cả lúc dev-mode Turbopack đang compile lần đầu),
// nhờ vậy sidebar (active state) nhảy sang mục mới NGAY khi bấm, thay vì
// đứng im ở trang cũ tới lúc "[Fast Refresh] done" mới chuyển.
//
// `variant="grid"` — dùng cho trang có KPI cards (Tổng quan)
// `variant="rows"` — dùng cho trang có bảng danh sách (Doanh thu, Người dùng)
// `variant="form"` — dùng cho trang có form (Tài khoản, Mật khẩu...)
export default function PageSkeleton({ variant = "rows" }) {
  return (
    <div>
      <div className="skeleton-block skeleton-title" />
      <div className="skeleton-block skeleton-subtitle" />

      {variant === "grid" && (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-block skeleton-card" />
          ))}
        </div>
      )}

      {(variant === "rows" || variant === "grid") && (
        <div className="skeleton-rows">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-block skeleton-row" />
          ))}
        </div>
      )}

      {variant === "form" && (
        <div className="skeleton-rows">
          <div className="skeleton-block skeleton-row" style={{ height: 90 }} />
          <div className="skeleton-block skeleton-row" />
          <div className="skeleton-block skeleton-row" />
          <div className="skeleton-block skeleton-row" style={{ height: 80 }} />
        </div>
      )}
    </div>
  );
}
