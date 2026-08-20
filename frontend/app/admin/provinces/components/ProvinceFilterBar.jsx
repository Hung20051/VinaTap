import { Search, X } from "lucide-react";

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
        <Search size={15} />
        <input
          type="text"
          placeholder="Tìm theo tên Tỉnh thành, slug, đặc sản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearch("")}
            title="Xóa tìm kiếm"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="admin-prov-selects-row">
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
          <option value="inactive">Tạm ẩn (Hết hàng)</option>
        </select>
      </div>
    </div>
  );
}

