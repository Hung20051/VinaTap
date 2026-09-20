"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { provinceAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import Dino404 from "@/components/ui/Dino404";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Camera,
  MapPin,
  Calendar,
  Sparkles,
  Check,
  X,
  Upload,
  Layers,
  ChevronRight,
} from "lucide-react";
import "@/styles/province.css";
import "./AdminProvinceEditor.css";

export default function AdminProvinceVisualEditor() {
  const { slug } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Core Data Model
  const [province, setProvince] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [foods, setFoods] = useState([]);
  const [articles, setArticles] = useState([]);
  const [festivals, setFestivals] = useState([]);

  // Active modal edit item
  const [editingModal, setEditingModal] = useState(null);
  // { type: 'landmark'|'food'|'article'|'festival'|'heroImg', item: {...}, index: number }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await provinceAPI.getOne(slug);
      setProvince(res.province);
      setLandmarks(res.landmarks || []);
      setFoods(res.foods || []);
      setArticles(res.articles || []);
      setFestivals(res.festivals || []);
    } catch (err) {
      showToast(err.message || "Không tải được dữ liệu cẩm nang", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── SAVE TO BACKEND ──────────────────────────────────────────
  const handleSaveAll = async () => {
    if (!province?.id) return;
    setSaving(true);
    try {
      await provinceAPI.saveFullGuide(province.id, {
        province: {
          name: province.name,
          slug: province.slug,
          region: province.region,
          description: province.description,
          thumbnail_url: province.thumbnail_url,
          population: province.population,
          area_km2: province.area_km2,
          status: province.status,
        },
        landmarks,
        foods,
        articles,
        festivals,
      });
      showToast("💾 Đã lưu toàn bộ cẩm nang tỉnh thành vào Database!");
    } catch (err) {
      showToast(err.message || "Lỗi khi lưu cẩm nang", "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── ITEM MODIFIERS ──────────────────────────────────────────
  const handleSaveModalItem = (updatedItem) => {
    const { type, index } = editingModal;

    if (type === "landmark") {
      if (index === -1) {
        setLandmarks([...landmarks, updatedItem]);
      } else {
        const next = [...landmarks];
        next[index] = updatedItem;
        setLandmarks(next);
      }
    } else if (type === "food") {
      let next = [...foods];
      if (index === -1) {
        next.push(updatedItem);
      } else {
        next[index] = updatedItem;
      }

      // Nếu mục này được đặt làm Card lớn (is_featured = 1)
      if (updatedItem.is_featured) {
        const otherFeatured = next.filter(
          (f, i) => f.is_featured && i !== (index === -1 ? next.length - 1 : index)
        );
        // Nếu đã có >= 2 card lớn khác, card lớn cũ nhất sẽ tự động trở về danh sách bên trái (is_featured = 0)
        if (otherFeatured.length >= 2) {
          const toDemote = otherFeatured[0];
          next = next.map((f) => (f === toDemote ? { ...f, is_featured: 0 } : f));
        }
      }

      setFoods(next);
    } else if (type === "article") {
      let next = [...articles];
      if (index === -1) {
        next.push(updatedItem);
      } else {
        next[index] = updatedItem;
      }

      if (updatedItem.category === "review" && updatedItem.is_featured) {
        const otherFeatReviews = next.filter(
          (a, i) =>
            a.category === "review" &&
            a.is_featured &&
            i !== (index === -1 ? next.length - 1 : index)
        );
        if (otherFeatReviews.length >= 2) {
          const toDemote = otherFeatReviews[0];
          next = next.map((a) => (a === toDemote ? { ...a, is_featured: 0 } : a));
        }
      }

      setArticles(next);
    } else if (type === "festival") {
      if (index === -1) {
        setFestivals([...festivals, updatedItem]);
      } else {
        const next = [...festivals];
        next[index] = updatedItem;
        setFestivals(next);
      }
    }

    setEditingModal(null);
  };

  const handleDeleteItem = (type, index, e) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa mục này?")) return;

    if (type === "landmark") {
      setLandmarks(landmarks.filter((_, i) => i !== index));
    } else if (type === "food") {
      setFoods(foods.filter((_, i) => i !== index));
    } else if (type === "article") {
      setArticles(articles.filter((_, i) => i !== index));
    } else if (type === "festival") {
      setFestivals(festivals.filter((_, i) => i !== index));
    }
  };

  if (loading) {
    return (
      <DinoLoader
        text="Đang tải trình biên tập cẩm nang..."
        subtext="Vui lòng chờ trong giây lát"
        size={260}
        fullScreen={true}
      />
    );
  }

  if (!province) {
    return (
      <Dino404
        title="Không tìm thấy tỉnh thành"
        message="Vui lòng kiểm tra lại slug hoặc quay lại danh sách quản lý."
        backBtnText="Quay lại danh sách"
      />
    );
  }

  // Lọc articles theo category
  const transportArticles = articles.filter((a) => a.category === "transport");
  const itineraryArticles = articles.filter((a) => a.category === "itinerary");
  const tipsArticles = articles.filter((a) => a.category === "tips");
  const reviewArticles = articles.filter((a) => a.category === "review");

  // Foods: List vs Featured
  const listFoods = foods.filter((f) => !f.is_featured);
  const featuredFoods = foods.filter((f) => f.is_featured);

  // Reviews: List vs Featured
  const listReviews = reviewArticles.filter((r) => !r.is_featured);
  const featuredReviews = reviewArticles.filter((r) => r.is_featured);

  return (
    <div className="admin-editor-wrapper">
      {/* ─── TOAST NOTIFICATION ───────────────────────────────── */}
      {toast && (
        <div className={`admin-editor-toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ─── 1. TOP STICKY TOOLBAR ────────────────────────────── */}
      <header className="admin-editor-toolbar">
        <div className="admin-editor-toolbar-inner">
          <div className="admin-editor-toolbar-left">
            <Link href="/admin/provinces" className="btn-editor-back">
              <ArrowLeft size={16} />
              <span>Danh sách tỉnh</span>
            </Link>
            <div className="admin-editor-tag">
              <Sparkles size={14} className="text-amber-500" />
              <span>Biên tập Cẩm nang: <strong>{province.name}</strong></span>
            </div>
          </div>

          <div className="admin-editor-toolbar-right">
            <button
              type="button"
              className={`btn-editor-status ${province.status === "active" ? "is-active" : "is-inactive"}`}
              onClick={() =>
                setProvince({
                  ...province,
                  status: province.status === "active" ? "inactive" : "active",
                })
              }
            >
              {province.status === "active" ? "🟢 Mở bán" : "🔴 Tạm ẩn"}
            </button>

            <a
              href={`/province/${province.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editor-preview"
            >
              <Eye size={15} />
              <span>Xem trang Public</span>
            </a>

            <button
              type="button"
              className="btn-editor-save"
              onClick={handleSaveAll}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? "Đang lưu..." : "Lưu tất cả thay đổi"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. WYSIWYG LIVE CANVAS ───────────────────────────── */}
      <main className="mia-main-container admin-canvas">
        {/* Breadcrumb Info */}
        <div className="mia-breadcrumb">
          <span className="mia-breadcrumb-item">Trang chủ</span>
          <ChevronRight size={14} className="mia-breadcrumb-sep" />
          <span className="mia-breadcrumb-item">Cẩm nang du lịch</span>
          <ChevronRight size={14} className="mia-breadcrumb-sep" />
          <span className="mia-breadcrumb-current">{province.name}</span>
        </div>

        {/* ─── SECTION 1: HERO (ẢNH 1) ────────────────────────── */}
        <section className="mia-hero-section admin-editable-block">
          <div className="mia-hero-left">
            <div className="mia-hero-img-wrap">
              <img
                src={
                  province.thumbnail_url ||
                  "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"
                }
                alt={province.name}
                className="mia-hero-img"
              />
              <button
                type="button"
                className="admin-edit-badge"
                onClick={() =>
                  setEditingModal({
                    type: "heroImg",
                    item: { thumbnail_url: province.thumbnail_url },
                  })
                }
              >
                <Camera size={14} /> Thay ảnh bìa chính
              </button>
            </div>
          </div>
          <div className="mia-hero-right">
            <div className="admin-hero-editor-card">
              <div className="admin-field-inline">
                <label className="admin-field-lbl">Tên Tỉnh / Thành phố:</label>
                <input
                  type="text"
                  className="admin-input-title"
                  value={province.name}
                  onChange={(e) =>
                    setProvince({ ...province, name: e.target.value })
                  }
                />
              </div>
              <div className="admin-field-inline">
                <label className="admin-field-lbl">Mô tả cẩm nang giới thiệu:</label>
                <textarea
                  className="admin-textarea-desc"
                  rows={4}
                  value={province.description || ""}
                  onChange={(e) =>
                    setProvince({ ...province, description: e.target.value })
                  }
                  placeholder="Nhập mô tả truyền cảm hứng du lịch cho tỉnh thành này..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: ĐIỂM THAM QUAN NỔI TIẾNG (ẢNH 1 & 2) ── */}
        <section className="mia-section admin-editable-block">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Điểm tham quan nổi tiếng</h2>
            <button
              type="button"
              className="admin-btn-add"
              onClick={() =>
                setEditingModal({
                  type: "landmark",
                  item: {
                    name: "",
                    category: "attraction",
                    thumbnail_url: "",
                    address: `${province.name}, Việt Nam`,
                    description: "",
                  },
                  index: -1,
                })
              }
            >
              <Plus size={14} /> Thêm địa danh
            </button>
          </div>

          {/* Hàng ngang cuộn mượt mà nếu vượt quá */}
          <div className="admin-grid-scroll-x">
            {landmarks.map((l, idx) => (
              <div
                key={l.id || idx}
                className="mia-card-img-large admin-card-hover-box"
                onClick={() =>
                  setEditingModal({
                    type: "landmark",
                    item: l,
                    index: idx,
                  })
                }
              >
                <img
                  src={
                    l.thumbnail_url ||
                    l.image ||
                    "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
                  }
                  alt={l.name}
                  className="mia-card-bg-img"
                />
                <div className="mia-card-gradient" />
                <h3 className="mia-card-title">{l.name || "Tên địa danh"}</h3>

                <div className="admin-card-actions">
                  <button
                    type="button"
                    className="admin-act-btn is-edit"
                    title="Chỉnh sửa"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    className="admin-act-btn is-delete"
                    onClick={(e) => handleDeleteItem("landmark", idx, e)}
                    title="Xóa"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 3: QUÁN ĂN NỔI TIẾNG (ẢNH 2) ──────────── */}
        <section className="mia-section admin-editable-block">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Quán ăn nổi tiếng</h2>
            <button
              type="button"
              className="admin-btn-add"
              onClick={() =>
                setEditingModal({
                  type: "food",
                  item: {
                    title: "",
                    image_url: "",
                    address: "",
                    description: "",
                    view_count: "100,000+",
                    published_date: "01/01/2026",
                    is_featured: 0,
                  },
                  index: -1,
                })
              }
            >
              <Plus size={14} /> Thêm món ăn / quán ngon
            </button>
          </div>

          <div className="mia-culinary-grid">
            {/* Cột trái: Danh sách dọc (cuộn dọc có giới hạn) */}
            <div className="mia-food-list-col admin-scroll-y-box">
              {listFoods.map((item, idx) => {
                const realIndex = foods.findIndex((f) => f === item);
                return (
                  <div
                    key={item.id || idx}
                    className="mia-food-item admin-card-hover-box"
                    onClick={() =>
                      setEditingModal({
                        type: "food",
                        item,
                        index: realIndex,
                      })
                    }
                  >
                    <div className="mia-food-thumb">
                      <img
                        src={
                          item.image_url ||
                          item.image ||
                          "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80"
                        }
                        alt={item.title}
                      />
                    </div>
                    <div className="mia-food-info">
                      <h4 className="mia-food-title">{item.title}</h4>
                      <div className="mia-food-meta">
                        <span>{item.published_date || item.date || "2026"}</span>
                        <span>{item.view_count || item.views || "100K"} xem</span>
                      </div>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-act-btn is-delete"
                        onClick={(e) => handleDeleteItem("food", realIndex, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cột giữa & phải: 2 Card lớn món ăn tiêu biểu */}
            {featuredFoods.slice(0, 2).map((feat, fIdx) => {
              const realIndex = foods.findIndex((f) => f === feat);
              return (
                <div
                  key={feat.id || fIdx}
                  className="mia-food-featured-card admin-card-hover-box"
                  onClick={() =>
                    setEditingModal({
                      type: "food",
                      item: feat,
                      index: realIndex,
                    })
                  }
                >
                  <img
                    src={
                      feat.image_url ||
                      feat.image ||
                      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80"
                    }
                    alt={feat.title}
                    className="mia-card-bg-img"
                  />
                  <div className="mia-card-gradient" />
                  <h3 className="mia-card-title">{feat.title}</h3>

                  <div className="admin-card-actions">
                    <button type="button" className="admin-act-btn is-edit">
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      className="admin-act-btn is-delete"
                      onClick={(e) => handleDeleteItem("food", realIndex, e)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── SECTION 4: BỘ 3 CẨM NANG (ẢNH 3) ───────────────── */}
        <section className="mia-section admin-editable-block">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Bộ 3 Cẩm nang du lịch</h2>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Bấm trực tiếp vào từng bài để chỉnh sửa, hoặc bấm <strong>+ Thêm bài</strong> ở từng cột
            </span>
          </div>

          <div className="mia-guides-3col">
            {/* Cột 1: Di chuyển */}
            <div className="mia-guide-column">
              <div
                className="mia-guide-top-img-card admin-card-hover-box"
                onClick={() => {
                  const targetArt = transportArticles[0] || { category: "transport", title: "Cẩm nang di chuyển", image_url: "", description: "" };
                  const realIndex = articles.findIndex((a) => a === targetArt);
                  setEditingModal({
                    type: "article",
                    item: targetArt,
                    index: realIndex,
                  });
                }}
              >
                <img
                  src={
                    transportArticles[0]?.image_url ||
                    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80"
                  }
                  alt="Di chuyển"
                />
                <button type="button" className="admin-edit-badge" style={{ top: "8px", right: "8px" }}>
                  <Camera size={12} /> Đổi ảnh bìa cột
                </button>
              </div>

              <div className="admin-guide-col-header">
                <div className="admin-guide-col-title-wrap">
                  <h3 className="mia-guide-col-title" style={{ margin: 0 }}>Di chuyển</h3>
                  <span className="admin-count-pill">{transportArticles.length} bài</span>
                </div>
                <button
                  type="button"
                  className="admin-btn-add-mini"
                  onClick={() =>
                    setEditingModal({
                      type: "article",
                      item: {
                        category: "transport",
                        title: "",
                        image_url: transportArticles[0]?.image_url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
                        description: "",
                      },
                      index: -1,
                    })
                  }
                >
                  <Plus size={12} /> Thêm bài
                </button>
              </div>

              <ul className="mia-guide-article-list admin-scroll-y-box" style={{ maxHeight: "240px" }}>
                {transportArticles.map((art, idx) => {
                  const realIndex = articles.findIndex((a) => a === art);
                  return (
                    <li
                      key={art.id || idx}
                      className="admin-article-item"
                      onClick={() =>
                        setEditingModal({
                          type: "article",
                          item: art,
                          index: realIndex,
                        })
                      }
                    >
                      <span>{art.title}</span>
                      <div className="admin-article-item-actions">
                        <button
                          type="button"
                          className="admin-act-btn is-edit"
                          title="Sửa bài"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModal({
                              type: "article",
                              item: art,
                              index: realIndex,
                            });
                          }}
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          type="button"
                          className="admin-act-btn is-delete"
                          title="Xóa bài"
                          onClick={(e) => handleDeleteItem("article", realIndex, e)}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Cột 2: Gợi ý lịch trình */}
            <div className="mia-guide-column">
              <div
                className="mia-guide-top-img-card admin-card-hover-box"
                onClick={() => {
                  const targetArt = itineraryArticles[0] || { category: "itinerary", title: "Gợi ý lịch trình", image_url: "", description: "" };
                  const realIndex = articles.findIndex((a) => a === targetArt);
                  setEditingModal({
                    type: "article",
                    item: targetArt,
                    index: realIndex,
                  });
                }}
              >
                <img
                  src={
                    itineraryArticles[0]?.image_url ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"
                  }
                  alt="Lịch trình"
                />
                <button type="button" className="admin-edit-badge" style={{ top: "8px", right: "8px" }}>
                  <Camera size={12} /> Đổi ảnh bìa cột
                </button>
              </div>

              <div className="admin-guide-col-header">
                <div className="admin-guide-col-title-wrap">
                  <h3 className="mia-guide-col-title" style={{ margin: 0 }}>Gợi ý lịch trình</h3>
                  <span className="admin-count-pill">{itineraryArticles.length} bài</span>
                </div>
                <button
                  type="button"
                  className="admin-btn-add-mini"
                  onClick={() =>
                    setEditingModal({
                      type: "article",
                      item: {
                        category: "itinerary",
                        title: "",
                        image_url: itineraryArticles[0]?.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
                        description: "",
                      },
                      index: -1,
                    })
                  }
                >
                  <Plus size={12} /> Thêm bài
                </button>
              </div>

              <ul className="mia-guide-article-list admin-scroll-y-box" style={{ maxHeight: "240px" }}>
                {itineraryArticles.map((art, idx) => {
                  const realIndex = articles.findIndex((a) => a === art);
                  return (
                    <li
                      key={art.id || idx}
                      className="admin-article-item"
                      onClick={() =>
                        setEditingModal({
                          type: "article",
                          item: art,
                          index: realIndex,
                        })
                      }
                    >
                      <span>{art.title}</span>
                      <div className="admin-article-item-actions">
                        <button
                          type="button"
                          className="admin-act-btn is-edit"
                          title="Sửa bài"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModal({
                              type: "article",
                              item: art,
                              index: realIndex,
                            });
                          }}
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          type="button"
                          className="admin-act-btn is-delete"
                          title="Xóa bài"
                          onClick={(e) => handleDeleteItem("article", realIndex, e)}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Cột 3: Kinh nghiệm đi tự túc */}
            <div className="mia-guide-column">
              <div
                className="mia-guide-top-img-card admin-card-hover-box"
                onClick={() => {
                  const targetArt = tipsArticles[0] || { category: "tips", title: "Kinh nghiệm đi tự túc", image_url: "", description: "" };
                  const realIndex = articles.findIndex((a) => a === targetArt);
                  setEditingModal({
                    type: "article",
                    item: targetArt,
                    index: realIndex,
                  });
                }}
              >
                <img
                  src={
                    tipsArticles[0]?.image_url ||
                    "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80"
                  }
                  alt="Kinh nghiệm"
                />
                <button type="button" className="admin-edit-badge" style={{ top: "8px", right: "8px" }}>
                  <Camera size={12} /> Đổi ảnh bìa cột
                </button>
              </div>

              <div className="admin-guide-col-header">
                <div className="admin-guide-col-title-wrap">
                  <h3 className="mia-guide-col-title" style={{ margin: 0 }}>Kinh nghiệm đi tự túc</h3>
                  <span className="admin-count-pill">{tipsArticles.length} bài</span>
                </div>
                <button
                  type="button"
                  className="admin-btn-add-mini"
                  onClick={() =>
                    setEditingModal({
                      type: "article",
                      item: {
                        category: "tips",
                        title: "",
                        image_url: tipsArticles[0]?.image_url || "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
                        description: "",
                      },
                      index: -1,
                    })
                  }
                >
                  <Plus size={12} /> Thêm bài
                </button>
              </div>

              <ul className="mia-guide-article-list admin-scroll-y-box" style={{ maxHeight: "240px" }}>
                {tipsArticles.map((art, idx) => {
                  const realIndex = articles.findIndex((a) => a === art);
                  return (
                    <li
                      key={art.id || idx}
                      className="admin-article-item"
                      onClick={() =>
                        setEditingModal({
                          type: "article",
                          item: art,
                          index: realIndex,
                        })
                      }
                    >
                      <span>{art.title}</span>
                      <div className="admin-article-item-actions">
                        <button
                          type="button"
                          className="admin-act-btn is-edit"
                          title="Sửa bài"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModal({
                              type: "article",
                              item: art,
                              index: realIndex,
                            });
                          }}
                        >
                          <Edit3 size={11} />
                        </button>
                        <button
                          type="button"
                          className="admin-act-btn is-delete"
                          title="Xóa bài"
                          onClick={(e) => handleDeleteItem("article", realIndex, e)}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: GÓC REVIEW (ẢNH 3 & 4) ──────────────── */}
        <section className="mia-section admin-editable-block">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Góc review trải nghiệm</h2>
            <button
              type="button"
              className="admin-btn-add"
              onClick={() =>
                setEditingModal({
                  type: "article",
                  item: {
                    category: "review",
                    title: "",
                    image_url: "",
                    description: "",
                    is_featured: 0,
                  },
                  index: -1,
                })
              }
            >
              <Plus size={14} /> Thêm bài review
            </button>
          </div>

          <div className="mia-culinary-grid">
            {/* Cột trái: 4 bài review dọc */}
            <div className="mia-food-list-col admin-scroll-y-box">
              {listReviews.map((rev, idx) => {
                const realIndex = articles.findIndex((a) => a === rev);
                return (
                  <div
                    key={rev.id || idx}
                    className="mia-food-item admin-card-hover-box"
                    onClick={() =>
                      setEditingModal({
                        type: "article",
                        item: rev,
                        index: realIndex,
                      })
                    }
                  >
                    <div className="mia-food-thumb">
                      <img
                        src={
                          rev.image_url ||
                          rev.image ||
                          "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=400&q=80"
                        }
                        alt={rev.title}
                      />
                    </div>
                    <div className="mia-food-info">
                      <h4 className="mia-food-title">{rev.title}</h4>
                      <div className="mia-food-meta">
                        <span>{rev.published_date || rev.date || "2026"}</span>
                        <span>{rev.view_count || rev.views || "50K"} xem</span>
                      </div>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-act-btn is-delete"
                        onClick={(e) => handleDeleteItem("article", realIndex, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cột giữa & phải: 2 card review lớn */}
            {featuredReviews.slice(0, 2).map((feat, fIdx) => {
              const realIndex = articles.findIndex((a) => a === feat);
              return (
                <div
                  key={feat.id || fIdx}
                  className="mia-food-featured-card admin-card-hover-box"
                  onClick={() =>
                    setEditingModal({
                      type: "article",
                      item: feat,
                      index: realIndex,
                    })
                  }
                >
                  <img
                    src={
                      feat.image_url ||
                      feat.image ||
                      "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&q=80"
                    }
                    alt={feat.title}
                    className="mia-card-bg-img"
                  />
                  <div className="mia-card-gradient" />
                  <h3 className="mia-card-title">{feat.title}</h3>

                  <div className="admin-card-actions">
                    <button type="button" className="admin-act-btn is-edit">
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      className="admin-act-btn is-delete"
                      onClick={(e) => handleDeleteItem("article", realIndex, e)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── SECTION 6: LỄ HỘI (ẢNH 4) ──────────────────────── */}
        <section className="mia-section admin-editable-block">
          <div className="mia-section-header">
            <h2 className="mia-section-title">Lễ hội</h2>
            <button
              type="button"
              className="admin-btn-add"
              onClick={() =>
                setEditingModal({
                  type: "festival",
                  item: {
                    title: "",
                    image_url: "",
                    event_time: "Tháng Giêng âm lịch",
                    description: "",
                  },
                  index: -1,
                })
              }
            >
              <Plus size={14} /> Thêm lễ hội
            </button>
          </div>

          <div className="admin-grid-scroll-x">
            {festivals.map((fe, idx) => (
              <div
                key={fe.id || idx}
                className="mia-card-img-large admin-card-hover-box"
                onClick={() =>
                  setEditingModal({
                    type: "festival",
                    item: fe,
                    index: idx,
                  })
                }
              >
                <img
                  src={
                    fe.image_url ||
                    fe.image ||
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80"
                  }
                  alt={fe.title}
                  className="mia-card-bg-img"
                />
                <div className="mia-card-gradient" />
                <h3 className="mia-card-title">{fe.title}</h3>

                <div className="admin-card-actions">
                  <button type="button" className="admin-act-btn is-edit">
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    className="admin-act-btn is-delete"
                    onClick={(e) => handleDeleteItem("festival", idx, e)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── 3. INLINE EDIT MODAL FORM ────────────────────────── */}
      {editingModal && (
        <AdminEditItemModal
          modalData={editingModal}
          onSave={handleSaveModalItem}
          onClose={() => setEditingModal(null)}
          onUploadFile={async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await provinceAPI.uploadFile(formData);
            return res.url;
          }}
          onSaveHeroImg={(url) => {
            setProvince({ ...province, thumbnail_url: url });
            setEditingModal(null);
          }}
        />
      )}
    </div>
  );
}

// ─── SUBCOMPONENT: EDIT MODAL ──────────────────────────────────
function AdminEditItemModal({ modalData, onSave, onClose, onUploadFile, onSaveHeroImg }) {
  const { type, item } = modalData;

  const [form, setForm] = useState({
    title: item?.title || item?.name || "",
    name: item?.name || item?.title || "",
    category: item?.category || "attraction",
    image_url: item?.image_url || item?.thumbnail_url || item?.image || "",
    address: item?.address || "",
    description: item?.description || item?.desc || "",
    event_time: item?.event_time || item?.date || "",
    is_featured: item?.is_featured ? 1 : 0,
  });

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUploadFile(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      // Fallback: đọc file trực tiếp dưới dạng Base64 Data URI
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "heroImg") {
      onSaveHeroImg(form.image_url);
      return;
    }
    onSave({
      ...item,
      ...form,
      name: form.title || form.name,
      title: form.title || form.name,
      thumbnail_url: form.image_url,
      image: form.image_url,
    });
  };

  return (
    <div className="mia-modal-overlay" onClick={onClose}>
      <div className="mia-modal-container admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>
            {type === "heroImg"
              ? "Thay Ảnh Bìa Toàn Cảnh"
              : type === "landmark"
              ? "Chỉnh Sửa Địa Danh Tham Quan"
              : type === "food"
              ? "Chỉnh Sửa Quán Ăn & Món Ngon"
              : type === "festival"
              ? "Chỉnh Sửa Lễ Hội"
              : "Chỉnh Sửa Bài Viết Cẩm Nang"}
          </h3>
          <button type="button" className="mia-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          {/* Tên / Tiêu đề */}
          {type !== "heroImg" && (
            <div className="admin-form-group">
              <label>Tiêu đề / Tên: *</label>
              <input
                type="text"
                required
                className="admin-form-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, name: e.target.value })}
                placeholder="VD: Cầu Vàng Bà Nà Hills..."
              />
            </div>
          )}

          {/* Phân loại category (nếu là article hoặc landmark) */}
          {type === "article" && (
            <div className="admin-form-group">
              <label>Chuyên mục cẩm nang:</label>
              <select
                className="admin-form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="transport">Di chuyển (Máy bay, xe khách, taxi)</option>
                <option value="itinerary">Gợi ý lịch trình (1N, 3N2Đ, 4N3Đ)</option>
                <option value="tips">Kinh nghiệm tự túc (Mẹo, lưu ý, mua quà)</option>
                <option value="review">Góc review trải nghiệm</option>
              </select>
            </div>
          )}

          {/* Ảnh URL & Upload */}
          <div className="admin-form-group">
            <label>Link ảnh đại diện / Thumbnail:</label>
            <div className="admin-input-upload-row">
              <input
                type="url"
                className="admin-form-input"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              <label className="admin-btn-file-upload">
                <Upload size={14} />
                <span>{uploading ? "Đang tải..." : "Tải ảnh"}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
              </label>
            </div>
            {form.image_url && (
              <div className="admin-img-preview-box">
                <img src={form.image_url} alt="Preview" />
              </div>
            )}
          </div>

          {/* Địa chỉ (nếu là landmark hoặc food) */}
          {(type === "landmark" || type === "food") && (
            <div className="admin-form-group">
              <label>Địa chỉ / Tọa độ gợi ý:</label>
              <input
                type="text"
                className="admin-form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="VD: Võ Nguyên Giáp, Sơn Trà, Đà Nẵng"
              />
            </div>
          )}

          {/* Thời gian diễn ra (nếu là festival) */}
          {type === "festival" && (
            <div className="admin-form-group">
              <label>Thời gian tổ chức:</label>
              <input
                type="text"
                className="admin-form-input"
                value={form.event_time}
                onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                placeholder="VD: Tháng Giêng âm lịch hàng năm"
              />
            </div>
          )}

          {/* Chọn Vị trí hiển thị (Card lớn nổi bật vs Danh sách thường) */}
          {(type === "food" || (type === "article" && form.category === "review")) && (
            <div className="admin-form-group">
              <label>Vị trí hiển thị:</label>
              <div className="admin-display-mode-selector">
                <label className={`admin-mode-option ${!form.is_featured ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="featured_mode"
                    checked={!form.is_featured}
                    onChange={() => setForm({ ...form, is_featured: 0 })}
                  />
                  <span>📋 Danh sách bên trái</span>
                </label>
                <label className={`admin-mode-option ${form.is_featured ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="featured_mode"
                    checked={!!form.is_featured}
                    onChange={() => setForm({ ...form, is_featured: 1 })}
                  />
                  <span>⭐ Card lớn nổi bật (Phải)</span>
                </label>
              </div>
            </div>
          )}

          {/* Mô tả chi tiết */}
          {type !== "heroImg" && (
            <div className="admin-form-group">
              <label>Mô tả nội dung cẩm nang:</label>
              <textarea
                rows={3}
                className="admin-form-textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Nhập thông tin chi tiết hoặc kinh nghiệm chia sẻ..."
              />
            </div>
          )}

          <div className="admin-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Cập nhật ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
