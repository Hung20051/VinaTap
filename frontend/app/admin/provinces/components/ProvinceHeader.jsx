import { RefreshCw, Plus } from "lucide-react";

export default function ProvinceHeader({ onRefresh, onCreateClick }) {
  return (
    <div className="admin-prov-header">
      <div>
        <h1 className="admin-dash-title">🗺️ 34 Tỉnh Thành & Địa Danh</h1>
        <p className="admin-dash-subtitle">
          Quản lý danh mục 34 mảnh ghép VinaTap, ảnh bìa, trạng thái mở bán và điểm du lịch
        </p>
      </div>
      <div className="admin-prov-header__actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onRefresh}
          title="Tải lại danh sách"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onCreateClick}
        >
          <Plus size={16} /> Thêm Tỉnh Mới
        </button>
      </div>
    </div>
  );
}
