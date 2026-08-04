// Bộ khối skeleton dùng cho app/**/loading.js — thay vì 1 khuôn chung,
// mỗi trang admin/settings TỰ LẮP các khối dưới đây theo đúng hình dạng
// nội dung thật của nó (bảng ra bảng, form ra form...), xem cách dùng ở
// từng file loading.js cùng cấp route.
//
// Luôn có SkeletonHeader (tiêu đề + phụ đề) ở đầu mọi trang — phần còn
// lại tuỳ trang mà chọn 1-2 khối bên dưới.

export function SkeletonHeader() {
  return (
    <>
      <div className="skeleton-block skeleton-title" />
      <div className="skeleton-block skeleton-subtitle" />
    </>
  );
}

// Cards KPI xếp lưới — vd "Tổng quan", "Doanh thu"
export function SkeletonKpiGrid({ count = 4 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-block skeleton-card" />
      ))}
    </div>
  );
}

// Thanh filter/search — vd "Doanh thu", "Người dùng"
export function SkeletonFilters({ count = 3 }) {
  return (
    <div className="skeleton-filters">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-block skeleton-filter" />
      ))}
    </div>
  );
}

// Bảng dữ liệu — vd danh sách giao dịch, danh sách user
export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      <div className="skeleton-block skeleton-table-header" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-block skeleton-table-row" />
      ))}
    </div>
  );
}

// Avatar tròn + vài dòng field — vd "Tài khoản"
export function SkeletonAvatarForm({ fields = 3 }) {
  return (
    <>
      <div className="skeleton-avatar-row">
        <div className="skeleton-block skeleton-avatar-circle" />
        <div className="skeleton-block skeleton-filter" />
      </div>
      <div className="skeleton-rows">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="skeleton-block skeleton-row" />
        ))}
      </div>
    </>
  );
}

// Form thường (không avatar) — vd "Mật khẩu"
export function SkeletonForm({ fields = 3 }) {
  return (
    <div className="skeleton-rows">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="skeleton-block skeleton-row" />
      ))}
    </div>
  );
}

// Danh sách icon + nhãn — vd "Hỗ trợ", "Top tỉnh hot"
export function SkeletonList({ rows = 4 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-list-row">
          <div className="skeleton-block skeleton-list-icon" />
          <div className="skeleton-block skeleton-list-text" />
        </div>
      ))}
    </div>
  );
}

// Options dạng thẻ chọn — vd "Giao diện" (sáng/tối)
export function SkeletonOptionsGrid({ count = 3 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-block skeleton-card" />
      ))}
    </div>
  );
}

// Tabs — vd "Điều khoản & Bảo mật"
export function SkeletonTabs({ count = 2 }) {
  return (
    <div className="skeleton-tabs">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-block skeleton-tab" />
      ))}
    </div>
  );
}

// Đoạn văn bản nhiều dòng — vd "Điều khoản", "Về VinaTap"
export function SkeletonTextLines({ lines = 6 }) {
  return (
    <div className="skeleton-text-lines">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-block skeleton-text-line ${
            i % 3 === 2 ? "skeleton-text-line--short" : ""
          }`}
        />
      ))}
    </div>
  );
}

// Placeholder giữa màn hình — dùng cho các tab admin còn là
// AdminComingSoon (chưa có nội dung thật để mô phỏng)
export function SkeletonCentered() {
  return (
    <div className="skeleton-centered">
      <div className="skeleton-block skeleton-centered-icon" />
      <div className="skeleton-block skeleton-centered-title" />
      <div className="skeleton-block skeleton-centered-desc" />
    </div>
  );
}
