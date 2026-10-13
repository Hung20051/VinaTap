"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Image as ImageIcon,
  Upload,
  Check,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  ArrowLeft,
  Save,
  Clock,
  AlertCircle,
} from "lucide-react";
import { articleAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminArticles.css";

const CATEGORIES = [
  { value: "all", label: "Tất cả chuyên mục" },
  { value: "things-to-do", label: "Trải nghiệm (Things to do)" },
  { value: "eat-drink", label: "Ẩm thực (Eat & Drink)" },
  { value: "itineraries", label: "Lịch trình (Itineraries)" },
  { value: "inspired", label: "Cảm hứng (Be Inspired)" },
];

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toast, setToast] = useState(null);

  // Modal editor
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await articleAPI.getAll();
      setArticles(res.articles || []);
    } catch (err) {
      showToast(err.message || "Lỗi nạp danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setCurrentArticle({
      id: null,
      slug: "",
      category: "things-to-do",
      province_slug: "",
      title_en: "",
      title_vi: "",
      hero_image: "/guide/megamenu/todo-2-hcmc.jpg",
      author_name: "VinaTap",
      status: "published",
      items: [
        {
          item_number: 1,
          title_en: "",
          title_vi: "",
          image_url: "",
          caption_en: "",
          caption_vi: "",
          content_en: [""],
          content_vi: [""],
        },
      ],
    });
    setIsEditing(true);
  };

  const handleOpenEdit = async (art) => {
    try {
      const res = await articleAPI.getBySlug(art.slug);
      setCurrentArticle(res.article || art);
      setIsEditing(true);
    } catch (err) {
      showToast("Lỗi lấy chi tiết bài viết: " + err.message, "error");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      return;
    }
    try {
      await articleAPI.delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("Đã xóa bài viết thành công!");
    } catch (err) {
      showToast(err.message || "Lỗi xóa bài viết", "error");
    }
  };

  const handleSaveArticle = async (articleData) => {
    setSaving(true);
    try {
      if (articleData.id) {
        await articleAPI.update(articleData.id, articleData);
        showToast("Đã lưu cập nhật bài viết thành công!");
      } else {
        await articleAPI.create(articleData);
        showToast("Đã tạo bài viết mới thành công!");
      }
      setIsEditing(false);
      loadArticles();
    } catch (err) {
      showToast(err.message || "Lỗi lưu bài viết", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = articles.filter((a) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      a.title_vi?.toLowerCase().includes(q) ||
      a.title_en?.toLowerCase().includes(q) ||
      a.slug?.toLowerCase().includes(q);
    const matchCat = selectedCat === "all" || a.category === selectedCat;
    const matchStatus = selectedStatus === "all" || a.status === selectedStatus;
    return matchQ && matchCat && matchStatus;
  });

  // KPI stats
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="admin-articles-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast ${toast.type === "error" ? "is-error" : "is-success"}`}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── HEADER ─────────────────────────────────────────────────── */}
      <div className="admin-articles-header">
        <div>
          <div className="admin-badge-pill">
            <Sparkles size={13} />
            <span>EDITORIAL CMS</span>
          </div>
          <h1 className="admin-articles-title">Quản Lý Bài Viết Cẩm Nang</h1>
          <p className="admin-articles-subtitle">
            Biên tập nội dung song ngữ, cập nhật hình ảnh và quản lý xuất bản các cẩm nang du lịch VinaTap.
          </p>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleOpenCreate}
        >
          <Plus size={16} />
          <span>Viết bài mới</span>
        </button>
      </div>

      {/* ─── KPI OVERVIEW ────────────────────────────────────────────── */}
      <div className="articles-kpi-grid">
        <div className="articles-kpi-card">
          <span className="kpi-label">Tổng bài viết</span>
          <div className="kpi-val">{articles.length}</div>
          <span className="kpi-hint">Trên hệ thống</span>
        </div>
        <div className="articles-kpi-card kpi-border-emerald">
          <span className="kpi-label">Đã xuất bản</span>
          <div className="kpi-val text-emerald">{publishedCount}</div>
          <span className="kpi-hint">Đang hiển thị ngoài web</span>
        </div>
        <div className="articles-kpi-card kpi-border-amber">
          <span className="kpi-label">Bản nháp</span>
          <div className="kpi-val text-amber">{draftCount}</div>
          <span className="kpi-hint">Đang biên tập</span>
        </div>
        <div className="articles-kpi-card kpi-border-cyan">
          <span className="kpi-label">Tổng lượt xem</span>
          <div className="kpi-val text-cyan">{totalViews.toLocaleString("vi-VN")}</div>
          <span className="kpi-hint">Tích lũy toàn cẩm nang</span>
        </div>
      </div>

      {/* ─── FILTER BAR ──────────────────────────────────────────────── */}
      <div className="articles-filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc đường dẫn slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* ─── ARTICLES LIST ───────────────────────────────────────────── */}
      {loading ? (
        <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang tải danh sách bài viết..." subtext="Đang kết nối cơ sở dữ liệu cẩm nang" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="articles-empty-state">
          <FileText size={48} color="#94a3b8" />
          <h3>Không tìm thấy bài viết nào</h3>
          <p>Thử tìm kiếm với từ khóa khác hoặc tạo bài viết cẩm nang mới.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filtered.map((art) => (
            <article key={art.id} className="article-card">
              <div className="article-thumb-wrap">
                <img
                  src={art.hero_image || "/guide/megamenu/todo-2-hcmc.jpg"}
                  alt={art.title_vi}
                  className="article-thumb-img"
                  loading="lazy"
                />
                <span className={`article-status-badge ${art.status === "published" ? "is-published" : "is-draft"}`}>
                  {art.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </span>
                <span className="article-category-badge">{art.category}</span>
              </div>

              <div className="article-card-body">
                <h3 className="article-card-title-vi" title={art.title_vi}>
                  {art.title_vi}
                </h3>
                <p className="article-card-title-en" title={art.title_en}>
                  {art.title_en}
                </p>

                <div className="article-card-meta">
                  <span className="meta-slug">/guide/{art.slug}</span>
                  <div className="meta-stats-row">
                    <span>
                      <Eye size={13} /> {art.views_count || 0} lượt xem
                    </span>
                    <span>
                      <Layers size={13} /> {art.item_count || art.items?.length || 0} mục
                    </span>
                  </div>
                </div>

                <div className="article-card-actions">
                  <button
                    type="button"
                    className="action-btn-edit"
                    onClick={() => handleOpenEdit(art)}
                  >
                    <Edit3 size={14} />
                    <span>Sửa nội dung</span>
                  </button>

                  <a
                    href={`/guide/${art.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn-preview"
                    title="Xem trước ngoài website"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    type="button"
                    className="action-btn-delete"
                    onClick={() => handleDelete(art.id, art.title_vi)}
                    title="Xóa bài viết"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ─── MODAL EDIT / CREATE ARTICLE ─────────────────────────────── */}
      {isEditing && currentArticle && (
        <ArticleEditorModal
          article={currentArticle}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveArticle}
          saving={saving}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ─── SUBCOMPONENT: ARTICLE EDITOR MODAL ─────────────────────────
function ArticleEditorModal({ article, onClose, onSave, saving, showToast }) {
  const [formData, setFormData] = useState({ ...article });
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingItemIdx, setUploadingItemIdx] = useState(null);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Upload hero image
  const handleUploadHero = async (file) => {
    if (!file) return;
    setUploadingHero(true);
    try {
      const f = new FormData();
      f.append("file", file);
      const res = await articleAPI.uploadImage(f);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, hero_image: res.url }));
        showToast("Đã tải ảnh đại diện lên thành công!");
      }
    } catch (err) {
      showToast("Lỗi upload ảnh: " + err.message, "error");
    } finally {
      setUploadingHero(false);
    }
  };

  // Upload item image
  const handleUploadItemImg = async (file, itemIdx) => {
    if (!file) return;
    setUploadingItemIdx(itemIdx);
    try {
      const f = new FormData();
      f.append("file", file);
      const res = await articleAPI.uploadImage(f);
      if (res?.url) {
        setFormData((prev) => {
          const nextItems = [...(prev.items || [])];
          nextItems[itemIdx] = { ...nextItems[itemIdx], image_url: res.url };
          return { ...prev, items: nextItems };
        });
        showToast(`Đã tải ảnh mục ${itemIdx + 1} thành công!`);
      }
    } catch (err) {
      showToast("Lỗi upload ảnh mục: " + err.message, "error");
    } finally {
      setUploadingItemIdx(null);
    }
  };

  const handleItemChange = (idx, field, value) => {
    setFormData((prev) => {
      const nextItems = [...(prev.items || [])];
      nextItems[idx] = { ...nextItems[idx], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => {
      const currentItems = prev.items || [];
      const newNum = currentItems.length + 1;
      return {
        ...prev,
        items: [
          ...currentItems,
          {
            item_number: newNum,
            title_en: `${newNum}. `,
            title_vi: `${newNum}. `,
            image_url: "",
            caption_en: "",
            caption_vi: "",
            content_en: [""],
            content_vi: [""],
          },
        ],
      };
    });
  };

  const handleRemoveItem = (idx) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mục ${idx + 1}?`)) return;
    setFormData((prev) => {
      const next = [...(prev.items || [])];
      next.splice(idx, 1);
      return { ...prev, items: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title_vi.trim() || !formData.title_en.trim()) {
      showToast("Vui lòng nhập đầy đủ tiêu đề Tiếng Việt và Tiếng Anh!", "error");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="editor-modal-backdrop" onClick={onClose}>
      <div className="editor-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="editor-modal-header">
          <div>
            <h2 className="editor-modal-title">
              {formData.id ? "Chỉnh Sửa Bài Viết Cẩm Nang" : "Tạo Mới Bài Viết Cẩm Nang"}
            </h2>
            <p className="editor-modal-subtitle">
              Sửa trực tiếp tiêu đề, tải ảnh HD và cập nhật nội dung các mục
            </p>
          </div>
          <button type="button" className="editor-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-modal-body">
          {/* Thông tin cơ bản */}
          <div className="editor-section-card">
            <h3 className="section-card-title">1. Thông tin chung bài viết</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Tiêu đề Tiếng Việt (Bắt buộc)</label>
                <input
                  type="text"
                  required
                  value={formData.title_vi || ""}
                  onChange={(e) => handleFieldChange("title_vi", e.target.value)}
                  placeholder="Vd: 8 trải nghiệm tuyệt nhất tại Nha Trang"
                />
              </div>

              <div className="form-group">
                <label>Tiêu đề Tiếng Anh (Bắt buộc)</label>
                <input
                  type="text"
                  required
                  value={formData.title_en || ""}
                  onChange={(e) => handleFieldChange("title_en", e.target.value)}
                  placeholder="Vd: 8 best things to do in Nha Trang"
                />
              </div>

              <div className="form-group">
                <label>Đường dẫn Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) => handleFieldChange("slug", e.target.value)}
                  placeholder="Vd: 8-best-things-to-do-in-nha-trang"
                />
              </div>

              <div className="form-group">
                <label>Chuyên mục</label>
                <select
                  value={formData.category || "things-to-do"}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                >
                  <option value="things-to-do">Trải nghiệm (Things to do)</option>
                  <option value="eat-drink">Ẩm thực (Eat & Drink)</option>
                  <option value="itineraries">Lịch trình (Itineraries)</option>
                  <option value="inspired">Cảm hứng (Be Inspired)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tỉnh / Thành phố liên quan</label>
                <input
                  type="text"
                  value={formData.province_slug || ""}
                  onChange={(e) => handleFieldChange("province_slug", e.target.value)}
                  placeholder="Vd: khanh-hoa, ho-chi-minh, ha-noi"
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.status || "published"}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                >
                  <option value="published">Đã xuất bản (Công khai)</option>
                  <option value="draft">Bản nháp (Tạm ẩn)</option>
                </select>
              </div>
            </div>

            {/* Ảnh Hero */}
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Ảnh bìa chính (Hero Image)</label>
              <div className="upload-input-combo">
                <input
                  type="text"
                  value={formData.hero_image || ""}
                  onChange={(e) => handleFieldChange("hero_image", e.target.value)}
                  placeholder="https://... hoặc /guide/..."
                />
                <label className="upload-file-btn">
                  <Upload size={14} />
                  <span>{uploadingHero ? "Đang tải..." : "Tải ảnh từ máy"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={uploadingHero}
                    onChange={(e) => handleUploadHero(e.target.files[0])}
                  />
                </label>
              </div>
              {formData.hero_image && (
                <div className="preview-hero-thumb">
                  <img src={formData.hero_image} alt="Hero preview" />
                </div>
              )}
            </div>
          </div>

          {/* Các mục con (Items 1..8) */}
          <div className="editor-section-card">
            <div className="section-card-header-flex">
              <div>
                <h3 className="section-card-title">2. Danh sách các mục trải nghiệm / món ăn</h3>
                <p className="section-card-desc">Từng mục được chia thành 2 cột: Ảnh bên trái và Đoạn văn bên phải</p>
              </div>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={handleAddItem}
              >
                <Plus size={14} />
                <span>Thêm mục</span>
              </button>
            </div>

            <div className="items-list-wrap">
              {(formData.items || []).map((item, idx) => (
                <div key={idx} className="item-editor-row">
                  <div className="item-editor-header">
                    <span className="item-badge-num">Mục #{idx + 1}</span>
                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => handleRemoveItem(idx)}
                      title="Xóa mục này"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Tiêu đề mục (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={item.title_vi || ""}
                        onChange={(e) => handleItemChange(idx, "title_vi", e.target.value)}
                        placeholder="Vd: 1. Khám phá các hòn đảo..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Tiêu đề mục (Tiếng Anh)</label>
                      <input
                        type="text"
                        value={item.title_en || ""}
                        onChange={(e) => handleItemChange(idx, "title_en", e.target.value)}
                        placeholder="Vd: 1. Dive into the islands..."
                      />
                    </div>
                  </div>

                  {/* Ảnh mục */}
                  <div className="form-group" style={{ marginTop: "0.75rem" }}>
                    <label>Hình ảnh mục #{idx + 1}</label>
                    <div className="upload-input-combo">
                      <input
                        type="text"
                        value={item.image_url || ""}
                        onChange={(e) => handleItemChange(idx, "image_url", e.target.value)}
                        placeholder="Đường dẫn ảnh..."
                      />
                      <label className="upload-file-btn">
                        <Upload size={14} />
                        <span>{uploadingItemIdx === idx ? "Đang tải..." : "Tải ảnh từ máy"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={uploadingItemIdx === idx}
                          onChange={(e) => handleUploadItemImg(e.target.files[0], idx)}
                        />
                      </label>
                    </div>
                    {item.image_url && (
                      <div className="preview-item-thumb">
                        <img src={item.image_url} alt={`Item ${idx + 1} preview`} />
                      </div>
                    )}
                  </div>

                  <div className="form-grid-2" style={{ marginTop: "0.75rem" }}>
                    <div className="form-group">
                      <label>Chú thích ảnh (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={item.caption_vi || ""}
                        onChange={(e) => handleItemChange(idx, "caption_vi", e.target.value)}
                        placeholder="Vd: Đảo Hòn Mun..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Chú thích ảnh (Tiếng Anh)</label>
                      <input
                        type="text"
                        value={item.caption_en || ""}
                        onChange={(e) => handleItemChange(idx, "caption_en", e.target.value)}
                        placeholder="Vd: Hon Mun Island..."
                      />
                    </div>
                  </div>

                  {/* Đoạn văn */}
                  <div className="form-grid-2" style={{ marginTop: "0.75rem" }}>
                    <div className="form-group">
                      <label>Nội dung đoạn văn (Tiếng Việt)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(item.content_vi) ? item.content_vi.join("\n\n") : item.content_vi || ""}
                        onChange={(e) => handleItemChange(idx, "content_vi", e.target.value.split("\n\n"))}
                        placeholder="Nội dung mô tả tiếng Việt..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Nội dung đoạn văn (Tiếng Anh)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(item.content_en) ? item.content_en.join("\n\n") : item.content_en || ""}
                        onChange={(e) => handleItemChange(idx, "content_en", e.target.value.split("\n\n"))}
                        placeholder="English description content..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="editor-modal-footer">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "Đang lưu..." : "Lưu thay đổi bài viết"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
