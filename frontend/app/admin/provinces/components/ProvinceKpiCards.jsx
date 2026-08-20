export default function ProvinceKpiCards({ provinces = [] }) {
  const totalActive = provinces.filter((p) => p.status === "active").length;
  const totalInactive = provinces.length - totalActive;

  const countNorth = provinces.filter((p) => p.region === "north").length;
  const countCentral = provinces.filter((p) => p.region === "central").length;
  const countSouth = provinces.filter((p) => p.region === "south").length;
  const countIsland = provinces.filter((p) => p.region === "island").length;

  return (
    <div className="admin-prov-kpis-carousel">
      <div className="admin-prov-kpis">
        <div className="admin-prov-kpi-card">
          <span className="admin-prov-kpi-label">Tổng Tỉnh Thành</span>
          <span className="admin-prov-kpi-value">{provinces.length}</span>
        </div>
        <div className="admin-prov-kpi-card admin-prov-kpi-card--active">
          <span className="admin-prov-kpi-label">Đang Mở Bán</span>
          <span className="admin-prov-kpi-value text-green">{totalActive}</span>
        </div>
        <div className="admin-prov-kpi-card admin-prov-kpi-card--pending">
          <span className="admin-prov-kpi-label">Tạm Ẩn / Hết Hàng</span>
          <span className="admin-prov-kpi-value text-orange">{totalInactive}</span>
        </div>
        <div className="admin-prov-kpi-card">
          <span className="admin-prov-kpi-label">Phân Phối Vùng Miền</span>
          <span className="admin-prov-kpi-sub">
            Bắc: <strong>{countNorth}</strong> | Trung: <strong>{countCentral}</strong> | Nam: <strong>{countSouth}</strong> | Đảo: <strong>{countIsland}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

