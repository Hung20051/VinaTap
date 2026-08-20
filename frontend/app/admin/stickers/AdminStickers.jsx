"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, UploadCloud, Search, Filter } from "lucide-react";
import { stickerAPI } from "@/lib/api";
import StickerOfTheDay from "./components/StickerOfTheDay";
import StickerGroup from "./components/StickerGroup";
import CategorySelect from "./components/CategorySelect";
import StickerFormModal from "./components/StickerFormModal";
import StickerBulkModal from "./components/StickerBulkModal";
import "./AdminStickers.css";

export default function AdminStickers() {
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInactive, setShowInactive] = useState(true);
  const [modal, setModal] = useState(null); // "new" | "bulk" | sticker object | null
  const [toast, setToast] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await stickerAPI.getAllAdmin();
      setStickers(res.stickers || []);
    } catch (err) {
      showToast(err.message || "Lỗi tải danh sách sticker", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const categories = useMemo(() => {
    const set = new Set();
    stickers.forEach((s) => {
      if (Array.isArray(s.categories)) {
        s.categories.forEach((c) => set.add(c));
      } else if (s.category) {
        s.category.split(",").forEach((c) => set.add(c.trim()));
      }
    });
    return Array.from(set).filter(Boolean).sort();
  }, [stickers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stickers.filter((s) => {
      if (!showInactive && s.status !== "active") return false;
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (selectedCategory !== "all") {
        const cats = s.categories || (s.category ? s.category.split(",") : []);
        if (!cats.includes(selectedCategory)) return false;
      }
      return true;
    });
  }, [stickers, search, showInactive, selectedCategory]);

  const toggleStatus = async (sticker) => {
    const nextStatus = sticker.status === "active" ? "inactive" : "active";
    // Optimistic update — cập nhật UI tức thì không làm giật DOM
    setStickers((prev) =>
      prev.map((s) => (s.id === sticker.id ? { ...s, status: nextStatus } : s)),
    );
    try {
      await stickerAPI.setStatus(sticker.id, nextStatus);
      showToast(
        nextStatus === "active"
          ? `Đã hiện lại "${sticker.name}"`
          : `Đã ẩn "${sticker.name}"`,
      );
      load(true); // Tải ngầm đồng bộ lại
    } catch (err) {
      // Revert lại nếu có lỗi
      setStickers((prev) =>
        prev.map((s) =>
          s.id === sticker.id ? { ...s, status: sticker.status } : s,
        ),
      );
      showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const handleDeleteSticker = async (sticker) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa VĨNH VIỄN sticker "${sticker.name}"?`,
      )
    ) {
      return;
    }
    setStickers((prev) => prev.filter((s) => s.id !== sticker.id));
    try {
      await stickerAPI.delete(sticker.id);
      showToast(`Đã xóa vĩnh viễn sticker "${sticker.name}"`);
      load(true);
    } catch (err) {
      showToast(err.message || "Lỗi xóa sticker", "error");
      load(true);
    }
  };

  return (
    <div className="admin-stickers-wrap">
      <div className="admin-stickers-sticky-header">
        <div className="admin-stickers-header">
          <div>
            <h1 className="admin-stickers-title">
              <span className="title-desktop">🎨 Quản Lý Sticker Theme</span>
              <span className="title-mobile">🎨 Sticker Theme</span>
            </h1>
            <p className="admin-stickers-subtitle">
              Sticker trang trí album — quản lý ảnh, danh mục và độ ưu tiên hiển thị
            </p>
          </div>
          <div className="admin-stickers-header__actions">
            <button className="btn-bulk-stickers" onClick={() => setModal("bulk")}>
              <UploadCloud size={15} /> Thêm nhiều
            </button>
            <button className="btn-add-sticker" onClick={() => setModal("new")}>
              <Plus size={15} /> Thêm sticker
            </button>
          </div>
        </div>

        <div className="admin-stickers-filters">
          <div className="admin-stickers-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Tìm sticker theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <CategorySelect
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalStickersCount={stickers.length}
          />

          <label className="admin-stickers-toggle">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Hiện cả sticker đã ẩn
          </label>
        </div>
      </div>

      {!loading && <StickerOfTheDay stickers={stickers} />}

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card admin-stickers-empty">
          {stickers.length === 0
            ? 'Chưa có sticker nào — bấm "Thêm sticker" để tạo cái đầu tiên'
            : "Không có sticker nào khớp bộ lọc"}
        </div>
      ) : (
        <StickerGroup
          category={
            selectedCategory === "all"
              ? "Tất cả Sticker"
              : `Danh mục: ${selectedCategory}`
          }
          stickers={filtered}
          onEdit={(s) => setModal(s)}
          onToggleStatus={toggleStatus}
          onDelete={handleDeleteSticker}
          onReordered={() => load(true)}
          showToast={showToast}
        />
      )}

      {(modal === "new" || (modal && modal !== "bulk")) && (
        <StickerFormModal
          editing={modal === "new" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load(true);
          }}
          showToast={showToast}
        />
      )}

      {modal === "bulk" && (
        <StickerBulkModal
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            load(true);
          }}
          showToast={showToast}
        />
      )}

      {toast && (
        <div
          className={`admin-stickers-toast admin-stickers-toast--${toast.type}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
