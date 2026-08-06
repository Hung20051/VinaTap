import { MapPin, Power, Edit3, Eye } from "lucide-react";
import { REGIONS } from "./provinceConstants";

export default function ProvinceCard({
  prov,
  onToggleStatus,
  onOpenLandmarks,
  onOpenEdit,
  onPreview,
}) {
  const regInfo = REGIONS[prov.region] || REGIONS.north;
  const isInactive = prov.status === "inactive";

  return (
    <div
      className={`card admin-prov-card ${isInactive ? "is-inactive" : ""}`}
    >
      {/* Cover Image */}
      <div className="admin-prov-card__cover">
        {prov.thumbnail_url ? (
          <img src={prov.thumbnail_url} alt={prov.name} />
        ) : (
          <div className="admin-prov-card__no-img">
            <MapPin size={32} />
            <span>Chưa có ảnh bìa</span>
          </div>
        )}
        <div
          className="admin-prov-card__region-badge"
          style={{ color: regInfo.color, background: regInfo.bg }}
        >
          {regInfo.label}
        </div>
        <button
          type="button"
          className={`admin-prov-card__status-btn ${isInactive ? "is-off" : "is-on"}`}
          onClick={(e) => onToggleStatus(prov, e)}
          title={
            isInactive
              ? "Bấm để mở bán lại"
              : "Bấm để tạm ẩn (báo hết hàng)"
          }
        >
          <Power size={13} />
          <span>{isInactive ? "Đã ẩn" : "Mở bán"}</span>
        </button>
      </div>

      {/* Body */}
      <div className="admin-prov-card__body">
        <div className="admin-prov-card__head">
          <h3 className="admin-prov-card__title">{prov.name}</h3>
          <span className="admin-prov-card__slug">#{prov.slug}</span>
        </div>

        {prov.description && (
          <p className="admin-prov-card__desc">{prov.description}</p>
        )}

        {prov.specialties && (
          <div className="admin-prov-card__spec">
            <strong>🍲 Đặc sản:</strong> {prov.specialties}
          </div>
        )}

        <div className="admin-prov-card__meta">
          {prov.population && (
            <span>
              👥 {Number(prov.population).toLocaleString("vi-VN")} dân
            </span>
          )}
          {prov.area_km2 && (
            <span>
              📐 {Number(prov.area_km2).toLocaleString("vi-VN")} km²
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="admin-prov-card__footer">
        <button
          type="button"
          className="btn btn-outline admin-prov-btn-sm"
          onClick={() => onOpenLandmarks(prov)}
        >
          <MapPin size={14} /> Danh thắng
        </button>
        <button
          type="button"
          className="btn btn-ghost admin-prov-btn-sm"
          onClick={() => onOpenEdit(prov)}
        >
          <Edit3 size={14} /> Chỉnh sửa
        </button>
        <button
          type="button"
          className="btn btn-ghost admin-prov-btn-sm"
          onClick={() => onPreview(prov)}
          title="Xem chi tiết"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}
