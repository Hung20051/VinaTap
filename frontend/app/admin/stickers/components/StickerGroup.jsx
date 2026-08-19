"use client";

import { useEffect, useState } from "react";
import { stickerAPI } from "@/lib/api";
import StickerCard from "./StickerCard";

// 1 khối category (kiểu bảng chọn emoji Discord/Slack) — tự quản lý
// việc kéo-thả đổi thứ tự BÊN TRONG category này. Kéo-thả KHÔNG cho
// phép giữa 2 category khác nhau (mỗi card chỉ nhận thả trong đúng
// StickerGroup chứa nó) — vì "category" của sticker không đổi chỉ bằng
// việc kéo nó sang chỗ khác, phải sửa qua form mới đúng ngữ nghĩa.
export default function StickerGroup({
  category,
  stickers,
  onEdit,
  onToggleStatus,
  onDelete,
  onReordered,
  showToast,
}) {
  // Bản sao cục bộ để kéo-thả mượt (cập nhật UI ngay, không đợi API) —
  // đồng bộ lại mỗi khi danh sách gốc từ cha đổi (sau khi reload).
  const [items, setItems] = useState(stickers);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => setItems(stickers), [stickers]);

  const handleDrop = async (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    const prev = items;
    setItems(reordered); // optimistic
    setDragIndex(null);
    setDragOverIndex(null);

    try {
      await stickerAPI.reorder(reordered.map((s) => s.id));
      onReordered();
    } catch (err) {
      setItems(prev); // revert nếu API lỗi
      showToast(err.message || "Lỗi cập nhật thứ tự", "error");
    }
  };

  return (
    <div className="admin-stickers-group">
      <h3 className="admin-stickers-group__title">
        {category}
        <span className="admin-stickers-group__count">{items.length}</span>
      </h3>
      <div className="admin-stickers-grid">
        {items.map((sticker, i) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            isDragOver={dragOverIndex === i && dragIndex !== i}
            dragHandlers={{
              draggable: true,
              onDragStart: () => setDragIndex(i),
              onDragEnter: (e) => {
                e.preventDefault();
                setDragOverIndex(i);
              },
              onDragOver: (e) => e.preventDefault(),
              onDrop: (e) => {
                e.preventDefault();
                handleDrop(i);
              },
              onDragEnd: () => {
                setDragIndex(null);
                setDragOverIndex(null);
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
