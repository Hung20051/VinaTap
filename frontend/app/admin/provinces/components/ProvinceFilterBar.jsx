import { Search } from "lucide-react";

export default function ProvinceFilterBar({
  search,
  setSearch,
  selectedRegion,
  setSelectedRegion,
  selectedStatus,
  setSelectedStatus,
}) {
  return (
    <div className="admin-prov-filters">
      <div className="admin-prov-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Tìm theo tên Tỉnh thành, slug hoặc đặc sản du lịch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="admin-prov-select"
      >
        <option value="all">Tất cả Vùng Miền</option>
        <option value="north">Miền Bắc</option>
        <option value="central">Miền Trung</option>
        <option value="south">Miền Nam</option>
        <option value="island">Hải Đảo</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="admin-prov-select"
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="active">Đang mở bán (Active)</option>
        <option value="inactive">Tạm ẩn (Out of stock)</option>
      </select>
    </div>
  );
}
