"use client";

import { X, MapPin, Calendar, Eye, Share2, Compass } from "lucide-react";

export default function GuideArticleModal({ item, type, onClose }) {
  if (!item) return null;

  const getGoogleMapsUrl = () => {
    if (item.latitude && item.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name || item.title || "")}`;
  };

  const title = item.name || item.title;
  const image = item.image || item.thumbnail_url;

  return (
    <div className="mia-modal-overlay" onClick={onClose}>
      <div
        className="mia-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="mia-modal-close" onClick={onClose} aria-label="Đóng">
          <X size={20} />
        </button>

        {image && (
          <div className="mia-modal-image-wrap">
            <img src={image} alt={title} className="mia-modal-img" />
            <div className="mia-modal-img-gradient" />
            <h3 className="mia-modal-img-title">{title}</h3>
          </div>
        )}

        <div className="mia-modal-body">
          {!image && <h2 className="mia-modal-title">{title}</h2>}

          <div className="mia-modal-meta">
            {item.date && (
              <span className="mia-meta-tag">
                <Calendar size={13} /> {item.date}
              </span>
            )}
            {item.views && (
              <span className="mia-meta-tag">
                <Eye size={13} /> {item.views} lượt xem
              </span>
            )}
            {item.category && (
              <span className="mia-meta-tag is-badge">
                {item.category === "attraction"
                  ? "Điểm tham quan"
                  : item.category === "beach"
                  ? "Bãi biển"
                  : item.category === "temple"
                  ? "Tâm linh & Di tích"
                  : "Khám phá"}
              </span>
            )}
          </div>

          {item.address && (
            <div className="mia-modal-address">
              <MapPin size={16} className="text-orange-500 shrink-0" />
              <span>{item.address}</span>
            </div>
          )}

          <div className="mia-modal-desc">
            <p>{item.desc || item.description || "Điểm đến trải nghiệm hấp dẫn không thể bỏ lỡ trong hành trình du lịch của bạn."}</p>
            <p className="mia-modal-subdesc">
              Khám phá và lưu giữ trọn vẹn những khoảnh khắc đẹp nhất tại đây. Hãy chuẩn bị máy ảnh và lên kế hoạch tận hưởng chuyến đi thật trọn vẹn nhé!
            </p>
          </div>

          <div className="mia-modal-actions">
            {item.address && (
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mia-btn-direction"
              >
                <Compass size={18} />
                <span>Chỉ đường trên Google Maps</span>
              </a>
            )}
            <button
              className="mia-btn-share"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Đã sao chép liên kết cẩm nang!");
                }
              }}
            >
              <Share2 size={16} />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
