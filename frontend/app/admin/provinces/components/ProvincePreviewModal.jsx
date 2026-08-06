import { X, ExternalLink } from "lucide-react";
import { REGIONS } from "./provinceConstants";

export default function ProvincePreviewModal({ province, onClose }) {
  if (!province) return null;

  return (
    <div className="admin-prov-modal-backdrop" onClick={onClose}>
      <div
        className="card admin-prov-modal admin-prov-preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-prov-modal__header">
          <h3>👁️ Xem Chi Tiết Mảnh Ghép</h3>
          <button
            type="button"
            className="admin-prov-modal__close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="admin-prov-preview-content">
          {province.thumbnail_url && (
            <img
              src={province.thumbnail_url}
              alt={province.name}
              className="admin-prov-preview-img"
            />
          )}
          <h2>{province.name}</h2>
          <p className="admin-prov-preview-slug">
            Mã định danh: <code>{province.slug}</code> | Vùng miền:{" "}
            <strong>
              {REGIONS[province.region]?.label || province.region}
            </strong>
          </p>
          {province.description && (
            <p className="admin-prov-preview-desc">{province.description}</p>
          )}
          {province.specialties && (
            <p className="admin-prov-preview-spec">
              🍲 <strong>Đặc sản:</strong> {province.specialties}
            </p>
          )}
          {province.youtube_url && (
            <a
              href={province.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ gap: "6px", width: "fit-content" }}
            >
              <ExternalLink size={14} /> Xem Video Giới Thiệu (YouTube)
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
