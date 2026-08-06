// Hàm dùng chung cho cụm trang Sticker & Theme — tách riêng khỏi từng
// component để component nào cũng gọi được, không lặp code.

// ─── STICKER NGẪU NHIÊN HÔM NAY ────────────────────────────────
// ✅ FIX: bản trước dùng `dayOfYear % activeStickers.length` — vấn đề
// là `.length` đổi mỗi khi thêm/ẩn sticker, mà phép chia dư phụ thuộc
// THẲNG vào số lượng đó, nên dù CÙNG 1 NGÀY, hễ tổng số sticker đổi là
// kết quả đổi theo (thêm 1 ảnh mới là sticker-hôm-nay nhảy sang cái
// khác ngay, dù ảnh mới đó chẳng liên quan).
//
// Cách mới: KHÔNG dùng index/length gì cả — băm (hash) cặp (ngày, id
// sticker) thành 1 số, rồi chọn sticker có số băm LỚN NHẤT trong ngày.
// Vì hash chỉ phụ thuộc vào id của từng sticker (id không đổi khi thêm
// sticker khác), thêm 1 sticker mới CHỈ có thể đổi kết quả nếu chính
// sticker mới đó "thắng" phép so sánh hôm nay — các trường hợp còn lại
// giữ nguyên sticker cũ, không bị xáo trộn hàng loạt như trước.
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // ép về số nguyên 32-bit
  }
  return hash;
}

export function pickStickerOfTheDay(activeStickers) {
  if (!activeStickers || activeStickers.length === 0) return null;

  const dateKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  let best = null;
  let bestScore = -Infinity;

  for (const s of activeStickers) {
    const score = hashCode(`${dateKey}-${s.id}`);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

// ─── TÊN FILE → TÊN STICKER GỢI Ý ──────────────────────────────
// "trai-tim_do.PNG" -> "Trai tim do" — admin sửa lại tay nếu muốn tên
// có dấu tiếng Việt đẹp hơn, đây chỉ là gợi ý ban đầu đỡ phải gõ từ đầu.
export function filenameToName(filename) {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  const spaced = withoutExt.replace(/[-_]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// ─── NHÓM STICKER THEO CATEGORY ─────────────────────────────────
// Trả về mảng [{ category, stickers: [...] }], sắp theo tên category
// (A-Z), category rỗng/null gom vào "Chưa phân loại" và LUÔN xếp cuối
// cùng — dễ tìm hơn khi luôn nằm ở vị trí cố định.
export function groupByCategory(stickers) {
  const map = new Map();
  for (const s of stickers) {
    const key = s.category?.trim() || "__uncategorized__";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  const groups = Array.from(map.entries())
    .filter(([key]) => key !== "__uncategorized__")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, list]) => ({ category, stickers: list }));

  if (map.has("__uncategorized__")) {
    groups.push({
      category: "Chưa phân loại",
      stickers: map.get("__uncategorized__"),
    });
  }
  return groups;
}
