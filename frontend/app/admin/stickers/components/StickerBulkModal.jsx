"use client";

import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { stickerAPI } from "@/lib/api";
import { filenameToName } from "./stickerUtils";

const MAX_FILES = 10; // khớp giới hạn multer ở backend (uploadImagesOnly)

// Modal upload nhiều sticker cùng lúc — chọn 1 lượt nhiều ảnh, tên mỗi
// ảnh tự gợi ý từ tên file (sửa được từng cái), category chọn 1 lần áp
// dụng chung cho cả lô (đỡ gõ lặp lại), nhưng vẫn sửa riêng được từng
// dòng nếu 1-2 ảnh trong lô thuộc category khác.
export default function StickerBulkModal({
  categories,
  onClose,
  onSaved,
  showToast,
}) {
  const [rows, setRows] = useState([]); // [{ file, preview, name, category }]
  const [sharedCategory, setSharedCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFilesChange = (e) => {
    const picked = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!picked.length) return;

    if (rows.length + picked.length > MAX_FILES) {
      showToast(`Tối đa ${MAX_FILES} ảnh mỗi lượt`, "error");
      return;
    }

    const newRows = picked.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: filenameToName(file.name),
      category: sharedCategory,
    }));
    setRows((prev) => [...prev, ...newRows]);
    e.target.value = ""; // cho chọn lại cùng file nếu lỡ bỏ nhầm
  };

  const applySharedCategoryToAll = (value) => {
    setSharedCategory(value);
  };

  const getCombinedCategories = (rowCat) => {
    const set = new Set();
    if (sharedCategory && sharedCategory.trim()) {
      sharedCategory.split(",").forEach((c) => {
        const clean = c.trim();
        if (clean) set.add(clean);
      });
    }
    if (rowCat && rowCat.trim()) {
      rowCat.split(",").forEach((c) => {
        const clean = c.trim();
        if (clean) set.add(clean);
      });
    }
    return Array.from(set).join(",");
  };

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rows.length) return showToast("Chưa chọn ảnh nào", "error");
    if (rows.some((r) => !r.name.trim()))
      return showToast("Còn ảnh thiếu tên", "error");

    setSaving(true);
    try {
      const formData = new FormData();
      rows.forEach((r) => formData.append("files", r.file));
      formData.append(
        "meta",
        JSON.stringify(
          rows.map((r) => {
            const combinedCatStr = getCombinedCategories(r.category);
            return {
              name: r.name.trim(),
              category: combinedCatStr,
              categories: combinedCatStr.split(",").filter(Boolean),
            };
          }),
        ),
      );
      const res = await stickerAPI.bulkCreate(formData);
      showToast(res.message);
      onSaved();
    } catch (err) {
      showToast(err.message || "Lỗi upload hàng loạt", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-stickers-modal-backdrop" onClick={onClose}>
      <form
        className="card admin-stickers-modal admin-stickers-modal--wide"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="admin-stickers-modal__header">
          <h3>Thêm nhiều sticker cùng lúc</h3>
          <button
            type="button"
            className="admin-stickers-modal__close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <label className="admin-stickers-bulk-pick">
          <UploadCloud size={22} />
          Chọn ảnh (tối đa {MAX_FILES}, đã chọn {rows.length})
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            hidden
          />
        </label>

        {rows.length > 0 && (
          <>
            <div className="admin-stickers-field">
              <label>
                Danh mục chung (áp dụng cho cả lô — sửa riêng được bên dưới)
              </label>
              <input
                type="text"
                list="admin-stickers-category-list"
                value={sharedCategory}
                onChange={(e) => applySharedCategoryToAll(e.target.value)}
                placeholder="VD: emotion, travel, food..."
              />
              <datalist id="admin-stickers-category-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div className="admin-stickers-bulk-list">
              {rows.map((r, i) => (
                <div className="admin-stickers-bulk-row" key={i}>
                  <img src={r.preview} alt="" />
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => updateRow(i, "name", e.target.value)}
                    placeholder="Tên sticker"
                  />
                  <input
                    type="text"
                    value={r.category}
                    onChange={(e) => updateRow(i, "category", e.target.value)}
                    placeholder="Danh mục riêng (tùy chọn)"
                  />
                  <button
                    type="button"
                    className="admin-stickers-bulk-row__remove"
                    onClick={() => removeRow(i)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="admin-stickers-modal__footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !rows.length}
          >
            {saving ? "Đang tải lên..." : `Thêm ${rows.length || ""} sticker`}
          </button>
        </div>
      </form>
    </div>
  );
}
