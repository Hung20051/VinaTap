import { RefreshCw, Plus } from "lucide-react";

export default function ProvinceHeader({ onRefresh, onCreateClick }) {
  return (
    <div className="admin-prov-header">
      <div className="admin-prov-header-title-wrap">
        <h1 className="admin-dash-title">
          <span className="title-desktop">🗺️ 34 Tỉnh Thành & Địa Danh</span>
          <span className="title-mobile">🗺️ 34 Tỉnh Thành</span>
        </h1>
        <p className="admin-dash-subtitle">
          Quản lý danh mục 34 mảnh ghép VinaTap, ảnh bìa, trạng thái mở bán và điểm du lịch
        </p>
      </div>
      <div className="admin-prov-header__actions">
        <button
          type="button"
          className="btn btn-refresh-prov"
          onClick={onRefresh}
          title="Tải lại danh sách"
        >
          <RefreshCw size={15} /> <span className="btn-text-desktop">Làm mới</span>
        </button>
        <button
          type="button"
          className="btn btn-create-prov"
          onClick={onCreateClick}
        >
          <Plus size={16} /> <span className="btn-text-desktop">Thêm Tỉnh Mới</span><span className="btn-text-mobile">Thêm Tỉnh</span>
        </button>
      </div>
    </div>
  );
}

