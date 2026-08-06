"use client";

import { Sparkles } from "lucide-react";
import { pickStickerOfTheDay } from "./stickerUtils";

// Banner nhỏ ở đầu trang — chỉ mang tính vui, KHÔNG có tác dụng thật
// (không ưu tiên sticker này ở đâu khác). Chỉ tính trên sticker đang
// 'active' — sticker bị ẩn không nên được "vinh danh" ngẫu nhiên.
export default function StickerOfTheDay({ stickers }) {
  const activeStickers = stickers.filter((s) => s.status === "active");
  const picked = pickStickerOfTheDay(activeStickers);

  if (!picked) return null;

  return (
    <div className="admin-stickers-of-day">
      <img src={picked.image_url} alt={picked.name} />
      <div>
        <p className="admin-stickers-of-day__label">
          <Sparkles size={14} /> Sticker hôm nay
        </p>
        <p className="admin-stickers-of-day__name">{picked.name}</p>
      </div>
    </div>
  );
}
