"use client";

import { Pencil, Eye, EyeOff, GripVertical, Flame, Trash2 } from "lucide-react";

// 1 card sticker trong lưới — nhận sẵn các prop kéo-thả (dragHandlers)
// từ StickerGroup, bản thân card không tự quản lý state kéo-thả gì cả,
// chỉ là UI thuần + gắn handler cha đưa xuống.
export default function StickerCard({
  sticker,
  onEdit,
  onToggleStatus,
  onDelete,
  dragHandlers,
  isDragOver,
}) {
  return (
    <div
      className={`card admin-stickers-card ${
        sticker.status !== "active" ? "is-inactive" : ""
      } ${isDragOver ? "is-drag-over" : ""}`}
      {...dragHandlers}
    >
      <div
        className="admin-stickers-card__drag-handle"
        title="Kéo để đổi thứ tự"
      >
        <GripVertical size={14} />
      </div>

      <div className="admin-stickers-card__thumb">
        <img src={sticker.image_url} alt={sticker.name} draggable={false} />
        {sticker.status !== "active" && (
          <span className="admin-stickers-card__hidden-tag">Đã ẩn</span>
        )}
      </div>

      <div className="admin-stickers-card__body">
        <p className="admin-stickers-card__name">{sticker.name}</p>
        {sticker.categories && sticker.categories.length > 0 && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {sticker.categories.map((cat) => (
              <span
                key={cat}
                style={{
                  fontSize: "11px",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  background: "var(--bg-subtle, #f1f5f9)",
                  color: "var(--text-muted, #64748b)",
                  border: "1px solid var(--border-color, #e2e8f0)",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        <div className="admin-stickers-card__meta">
          <span
            className="admin-stickers-card__usage"
            title="Số lần user dán sticker này lên ảnh"
          >
            <Flame size={12} /> {sticker.usage_count || 0}
          </span>
        </div>
      </div>

      <div className="admin-stickers-card__actions">
        <button
          type="button"
          className="admin-stickers-action-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(sticker);
          }}
          title="Sửa"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          className="admin-stickers-action-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleStatus(sticker);
          }}
          title={sticker.status === "active" ? "Ẩn sticker" : "Hiện lại"}
        >
          {sticker.status === "active" ? (
            <EyeOff size={15} />
          ) : (
            <Eye size={15} />
          )}
        </button>
        <button
          type="button"
          className="admin-stickers-action-btn admin-stickers-action-btn--delete"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onDelete) onDelete(sticker);
          }}
          title="Xóa vĩnh viễn"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
