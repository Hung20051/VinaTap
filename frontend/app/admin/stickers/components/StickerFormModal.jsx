"use client";

import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { stickerAPI } from "@/lib/api";

// Modal tạo/sửa 1 sticker — dùng chung cho cả 2 trường hợp, phân biệt
// bằng prop `editing` (null = đang tạo mới, có giá trị = đang sửa).
//
// Không có ô sort_order nữa — trước đây phải gõ tay số thứ tự, giờ việc
// sắp xếp làm bằng kéo-thả trong StickerGroup (sticker mới luôn vào
// cuối category, admin tự kéo lên nếu muốn ở vị trí khác).
//
// Có thêm khối "Xem thử" — dán sticker lên 1 ảnh nền mẫu (giả lập bằng
// CSS gradient, không cần ảnh thật) để admin hình dung sticker trông ra
// sao khi user thật dán lên ảnh của họ, thay vì chỉ thấy PNG nền trong
// suốt trơ trọi.
export default function StickerFormModal({
  editing,
  categories,
  onClose,
  onSaved,
  showToast,
}) {
  const [name, setName] = useState(editing?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(editing?.image_url || null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const parseCats = (raw) => {
    if (!raw) return [];
    let items = [];
    if (Array.isArray(raw)) items = raw;
    else if (typeof raw === "string") {
      let str = raw.trim();
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) items = parsed;
      } catch {}
      if (!items.length) items = str.split(",");
    }

    return Array.from(
      new Set(
        items
          .map((c) => String(c).replace(/^[\["'\\]+|[\]"'\\]+$/g, "").trim())
          .filter((c) => c && c !== "[]" && c !== "null" && c !== "undefined"),
      ),
    );
  };

  // Khởi tạo mảng danh mục được chọn
  const initialCats = parseCats(
    editing?.categories?.length ? editing.categories : editing?.category,
  );

  const [selectedCats, setSelectedCats] = useState(initialCats);
  const [customCat, setCustomCat] = useState("");

  const defaultCategoryOptions = [
    { slug: "emotion", name: "Cảm xúc" },
    { slug: "travel", name: "Du lịch" },
    { slug: "nature", name: "Thiên nhiên" },
    { slug: "food", name: "Ẩm thực" },
  ];

  // Gộp danh mục có sẵn và danh mục từ server
  const cleanServerCats = (categories || [])
    .map((c) => String(c).replace(/^[\["'\\]+|[\]"'\\]+$/g, "").trim())
    .filter((c) => c && c !== "[]" && c !== "null" && c !== "undefined");

  const allCatOptions = Array.from(
    new Set([
      ...defaultCategoryOptions.map((c) => c.slug),
      ...cleanServerCats,
      ...initialCats,
      ...selectedCats,
    ]),
  ).filter(Boolean);

  const toggleCategory = (slug) => {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );
  };

  const handleAddCustomCat = () => {
    const trimmed = customCat.trim().toLowerCase();
    if (trimmed && !selectedCats.includes(trimmed)) {
      setSelectedCats((prev) => [...prev, trimmed]);
      setCustomCat("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Nhập tên sticker", "error");
    if (!editing && !file)
      return showToast("Chọn ảnh cho sticker mới", "error");
    if (selectedCats.length === 0)
      return showToast("Vui lòng chọn ít nhất 1 danh mục cho sticker", "error");

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("categories", JSON.stringify(selectedCats));
      formData.append("category", selectedCats.join(","));
      if (file) formData.append("file", file);

      if (editing) {
        await stickerAPI.update(editing.id, formData);
        showToast("Đã cập nhật sticker");
      } else {
        await stickerAPI.create(formData);
        showToast("Đã thêm sticker mới");
      }
      onSaved();
    } catch (err) {
      showToast(err.message || "Lỗi lưu sticker", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-stickers-modal-backdrop" onClick={onClose}>
      <form
        className="card admin-stickers-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="admin-stickers-modal__header">
          <h3>{editing ? "Sửa sticker" : "Thêm sticker mới"}</h3>
          <button
            type="button"
            className="admin-stickers-modal__close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <label className="admin-stickers-dropzone">
          {preview ? (
            <img
              src={preview}
              alt=""
              className="admin-stickers-dropzone__preview"
            />
          ) : (
            <span className="admin-stickers-dropzone__placeholder">
              <ImagePlus size={28} />
              Chọn ảnh sticker (PNG nền trong suốt là đẹp nhất)
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </label>

        {preview && (
          <div className="admin-stickers-preview-wrap">
            <p className="admin-stickers-preview-label">Xem thử trên ảnh</p>
            <div className="admin-stickers-preview-photo">
              <img
                src={preview}
                alt=""
                className="admin-stickers-preview-photo__sticker"
              />
            </div>
          </div>
        )}

        <div className="admin-stickers-field">
          <label>Tên sticker</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Tim đỏ"
          />
        </div>

        <div className="admin-stickers-field">
          <label>Danh mục (chọn một hoặc nhiều danh mục)</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "6px 0" }}>
            {allCatOptions.map((catSlug) => {
              const active = selectedCats.includes(catSlug);
              return (
                <button
                  type="button"
                  key={catSlug}
                  onClick={() => toggleCategory(catSlug)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    cursor: "pointer",
                    border: active
                      ? "1px solid var(--primary, #e85d04)"
                      : "1px solid var(--border-color, #cbd5e1)",
                    background: active
                      ? "var(--primary-light, #ffedd5)"
                      : "var(--bg-card, #ffffff)",
                    color: active ? "var(--primary, #e85d04)" : "inherit",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {active ? "✓ " : "+ "}
                  {catSlug}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
            <input
              type="text"
              value={customCat}
              onChange={(e) => setCustomCat(e.target.value)}
              placeholder="Thêm danh mục khác..."
              style={{ fontSize: "12px", padding: "4px 8px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomCat();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleAddCustomCat}
              style={{ padding: "4px 10px", fontSize: "12px" }}
            >
              Thêm
            </button>
          </div>
        </div>

        <div className="admin-stickers-modal__footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
