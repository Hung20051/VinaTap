"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Truck,
  Save,
  Tag,
  CheckCircle,
  XCircle,
  X,
  Upload,
  ImageIcon,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { productAPI, shippingAPI, provinceAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminProducts.css";

const emptyForm = () => ({
  name: "",
  category: "single",
  price: 150000,
  original_price: 180000,
  image: "",
  tag: "SIÊU ƯU ĐÃI 🔥",
  description: "",
});

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [shipping, setShipping] = useState({
    base_fee: 30000,
    free_shipping_threshold: 500000,
  });
  const [loading, setLoading] = useState(true);
  const [savingShip, setSavingShip] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState(null);

  // Popup xác nhận hành động
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [shipEditOpen, setShipEditOpen] = useState(false);

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, shipRes] = await Promise.all([
        productAPI.getAll(true),
        shippingAPI.get(),
      ]);
      setProducts(prodRes.products || []);
      if (shipRes.rule) {
        setShipping({
          base_fee: Number(shipRes.rule.base_fee || 30000),
          free_shipping_threshold: Number(shipRes.rule.free_shipping_threshold || 500000),
        });
      }
    } catch (err) {
      showToast("Lỗi tải dữ liệu sản phẩm / phí ship", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatVND = (num) => Number(num || 0).toLocaleString("vi-VN") + "đ";

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast("Kích thước tệp quá lớn (Tối đa 15MB)", "error");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await provinceAPI.uploadFile(formData);
      if (res && res.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
        showToast("☁️ Tải ảnh lên Cloudinary thành công!");
      }
    } catch (err) {
      showToast(err.message || "Lỗi tải ảnh lên Cloudinary", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveShipping = (e) => {
    e.preventDefault();
    setConfirmDialog({
      title: "🚚 Xác Nhận Lưu Phí Vận Chuyển",
      message: `Bạn có chắc chắn muốn cập nhật Phí Vận Chuyển Chuẩn là ${formatVND(shipping.base_fee)} và Hạn mức FreeShip là ${formatVND(shipping.free_shipping_threshold)} cho toàn bộ hệ thống?`,
      confirmText: "Đồng Ý Lưu",
      confirmBg: "#ea580c",
      onConfirm: async () => {
        setSavingShip(true);
        try {
          await shippingAPI.update(shipping);
          showToast("🚚 Đã lưu phí vận chuyển & mốc freeship toàn quốc thành công!");
        } catch (err) {
          showToast(err.message || "Lỗi lưu phí vận chuyển", "error");
        } finally {
          setSavingShip(false);
          setConfirmDialog(null);
        }
      },
    });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEditForm = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      category: p.category || "single",
      price: p.price || 0,
      original_price: p.original_price || 0,
      image: p.image || "",
      tag: p.tag || "",
      description: p.description || "",
    });
    setFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) {
      showToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }
    if (form.price === undefined || Number(form.price) < 0) {
      showToast("Vui lòng nhập giá bán hợp lệ", "error");
      return;
    }

    const actionText = editingId ? "cập nhật thông tin" : "thêm sản phẩm mới";
    setConfirmDialog({
      title: editingId ? "✏️ Xác Nhận Cập Nhật Sản Phẩm" : "🎉 Xác Nhận Thêm Sản Phẩm Mới",
      message: `Bạn có chắc chắn muốn ${actionText} "${form.name}" với giá bán ${formatVND(form.price)}?`,
      confirmText: editingId ? "Đồng Ý Cập Nhật" : "Đồng Ý Tạo Mới",
      confirmBg: "#ea580c",
      onConfirm: async () => {
        try {
          if (editingId) {
            await productAPI.update(editingId, form);
            showToast("✏️ Đã cập nhật sản phẩm thành công!");
          } else {
            await productAPI.create(form);
            showToast("🎉 Đã thêm sản phẩm mới thành công!");
          }
          setFormOpen(false);
          loadData();
        } catch (err) {
          showToast(err.message || "Lỗi lưu sản phẩm", "error");
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleToggleActive = (p) => {
    const actionText = p.is_active ? "tạm ẩn" : "mở bán công khai";
    setConfirmDialog({
      title: p.is_active ? "🙈 Xác Nhận Tạm Ẩn Sản Phẩm" : "👁️ Xác Nhận Mở Bán Sản Phẩm",
      message: `Bạn có chắc chắn muốn ${actionText} sản phẩm "${p.name}"? Khách hàng ${p.is_active ? "sẽ không thấy sản phẩm này trên cửa hàng" : "có thể đặt mua sản phẩm này ngay"}.`,
      confirmText: p.is_active ? "Xác Nhận Tạm Ẩn" : "Xác Nhận Mở Bán",
      confirmBg: p.is_active ? "#64748b" : "#16a34a",
      onConfirm: async () => {
        try {
          await productAPI.setActive(p.id, !p.is_active);
          showToast(!p.is_active ? "👁️ Đã mở bán sản phẩm công khai" : "🙈 Đã tạm ẩn sản phẩm khỏi cửa hàng");
          loadData();
        } catch (err) {
          showToast("Lỗi thay đổi trạng thái", "error");
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleDeleteProduct = (p) => {
    setConfirmDialog({
      title: "🗑️ Xác Nhận Xóa Vĩnh Viễn Sản Phẩm",
      message: `Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm "${p.name}" khỏi Database? Hành động này KHÔNG THỂ hoàn tác!`,
      confirmText: "Đồng Ý Xóa Vĩnh Viễn",
      confirmBg: "#e11d48",
      onConfirm: async () => {
        try {
          await productAPI.delete(p.id);
          showToast("🗑️ Đã xóa sản phẩm khỏi Database thành công!");
          loadData();
        } catch (err) {
          showToast("Lỗi xóa sản phẩm", "error");
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  return (
    <div className="admin-prod-container">
      {toast && (
        <div className={`admin-toast-fixed admin-toast-fixed--${toast.type}`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-prod-header">
        <div>
          <h1 className="admin-dash-title">📦 Quản Lý Sản Phẩm</h1>
          <p className="admin-dash-subtitle">
            Bảng giá, ảnh sản phẩm 34 tỉnh thành &amp; chính sách freeship
          </p>
        </div>
        <div className="admin-prod-header__actions">
          <button className="btn btn-ghost admin-prod-btn-reload" onClick={loadData} disabled={loading}>
            <RefreshCw size={15} /> <span>Tải lại</span>
          </button>
          <button
            className="btn btn-primary admin-prod-btn-create"
            onClick={openCreateForm}
          >
            <Plus size={16} /> <span>Thêm Sản Phẩm</span>
          </button>
        </div>
      </div>

      {/* 🚚 COMPACT SHIPPING CONFIG WIDGET */}
      <div className="admin-prod-ship-widget">
        <div className="admin-prod-ship-widget__info">
          <div className="admin-prod-ship-widget__icon">
            <Truck size={20} />
          </div>
          <div className="admin-prod-ship-widget__text">
            <span className="admin-prod-ship-widget__title">Chính sách Phí Vận Chuyển:</span>
            <div className="admin-prod-ship-widget__badges">
              <span className="ship-badge ship-badge--fee">
                Phí ship: <strong>{formatVND(shipping.base_fee)}</strong>
              </span>
              <span className="ship-badge ship-badge--free">
                Freeship từ: <strong>{formatVND(shipping.free_shipping_threshold)}</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline admin-prod-ship-widget__btn"
          onClick={() => setShipEditOpen(!shipEditOpen)}
        >
          {shipEditOpen ? <X size={14} /> : <Edit2 size={14} />}
          <span>{shipEditOpen ? "Đóng" : "Chỉnh sửa"}</span>
        </button>
      </div>

      {/* Expandable Shipping Edit Form */}
      {shipEditOpen && (
        <div className="admin-prod-shipping-card">
          <h3 className="admin-prod-shipping-title">
            <Truck size={18} className="text-orange" /> Cập Nhật Phí Vận Chuyển Toàn Quốc
          </h3>
          <form onSubmit={handleSaveShipping} className="admin-prod-shipping-grid">
            <div className="admin-prod-shipping-field">
              <label className="admin-prod-shipping-label">Phí Vận Chuyển Chuẩn (VNĐ): *</label>
              <input
                type="number"
                required
                min="0"
                className="admin-prod-shipping-input"
                value={shipping.base_fee}
                onChange={(e) => setShipping({ ...shipping, base_fee: e.target.value })}
              />
            </div>
            <div className="admin-prod-shipping-field">
              <label className="admin-prod-shipping-label">Hạn Mức Freeship (VNĐ): *</label>
              <input
                type="number"
                required
                min="0"
                className="admin-prod-shipping-input"
                value={shipping.free_shipping_threshold}
                onChange={(e) => setShipping({ ...shipping, free_shipping_threshold: e.target.value })}
              />
            </div>
            <div className="admin-prod-shipping-action">
              <button type="submit" className="btn btn-primary admin-prod-btn-save-ship" disabled={savingShip}>
                <Save size={15} /> <span>{savingShip ? "Đang lưu..." : "Lưu Phí Ship"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📦 Header Danh Sách Sản Phẩm */}
      <div className="admin-prod-list-header">
        <h3 className="admin-prod-list-title">
          Danh Mục Sản Phẩm ({products.length})
        </h3>
      </div>

      {loading ? (
        <div style={{ padding: "3rem 1rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang tải danh mục sản phẩm..." subtext="Đang đồng bộ giá và phí vận chuyển" />
        </div>
      ) : products.length === 0 ? (
        <div className="admin-prod-empty">
          <p>Chưa có sản phẩm nào. Bấm nút <strong>"+ Thêm Sản Phẩm"</strong> ở góc trên để tạo sản phẩm đầu tiên!</p>
        </div>
      ) : (
        <>
          {/* 💻 DESKTOP & TABLET PRODUCT GRID */}
          <div className="admin-prod-grid">
            {products.map((p) => (
              <div key={p.id} className="admin-prod-card">
                <div className="admin-prod-card-img-wrap">
                  <img
                    src={
                      p.image ||
                      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={p.name}
                    className="admin-prod-card-img"
                  />
                  {p.tag && <span className="admin-prod-card-tag">{p.tag}</span>}
                  <span
                    className={`admin-prod-card-status ${
                      p.is_active
                        ? "admin-prod-card-status--active"
                        : "admin-prod-card-status--inactive"
                    }`}
                  >
                    {p.is_active ? "Đang mở bán" : "Đã tạm ẩn"}
                  </span>
                </div>

                <div className="admin-prod-card-body">
                  <h4 className="admin-prod-card-title">{p.name}</h4>
                  <p className="admin-prod-card-desc">{p.description || "Chưa có mô tả"}</p>

                  <div className="admin-prod-card-prices">
                    <span className="admin-prod-card-price">{formatVND(p.price)}</span>
                    {p.original_price > 0 && (
                      <span className="admin-prod-card-original">
                        {formatVND(p.original_price)}
                      </span>
                    )}
                  </div>

                  <div className="admin-prod-card-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-edit-prod"
                      onClick={() => openEditForm(p)}
                    >
                      <Edit2 size={14} /> Sửa thông tin
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${p.is_active ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => handleToggleActive(p)}
                      title={p.is_active ? "Bấm để tạm ẩn sản phẩm" : "Bấm để hiển thị lại sản phẩm"}
                    >
                      {p.is_active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm text-danger"
                      onClick={() => handleDeleteProduct(p)}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 📱 MOBILE HORIZONTAL PRODUCT CARDS (E-COMMERCE ROWS) */}
          <div className="admin-prod-cards-mobile">
            {products.map((p) => (
              <div key={p.id} className="admin-prod-row-card">
                <div className="admin-prod-row-thumb-wrap">
                  <img
                    src={
                      p.image ||
                      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={p.name}
                    className="admin-prod-row-thumb"
                  />
                  <span className={`admin-prod-row-status ${p.is_active ? "status--active" : "status--inactive"}`}>
                    {p.is_active ? "Đang bán" : "Tạm ẩn"}
                  </span>
                </div>

                <div className="admin-prod-row-content">
                  <div className="admin-prod-row-header">
                    <h4 className="admin-prod-row-title">{p.name}</h4>
                    {p.tag && <span className="admin-prod-row-tag">{p.tag}</span>}
                  </div>

                  <div className="admin-prod-row-prices">
                    <strong className="admin-prod-row-price">{formatVND(p.price)}</strong>
                    {p.original_price > 0 && (
                      <span className="admin-prod-row-original">{formatVND(p.original_price)}</span>
                    )}
                  </div>

                  <div className="admin-prod-row-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline admin-prod-row-btn-edit"
                      onClick={() => openEditForm(p)}
                    >
                      <Edit2 size={13} /> <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${p.is_active ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => handleToggleActive(p)}
                      title={p.is_active ? "Tạm ẩn" : "Mở bán"}
                    >
                      {p.is_active ? <XCircle size={13} /> : <CheckCircle size={13} />}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm text-danger"
                      onClick={() => handleDeleteProduct(p)}
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 📝 MODAL TẠO / SỬA SẢN PHẨM (BALANCED SHOPIFY STYLE) */}
      {formOpen && (
        <div className="admin-prod-modal-overlay" onClick={() => setFormOpen(false)}>
          <div className="admin-prod-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-prod-modal-handle-bar" />
            <div className="admin-prod-modal-header">
              <h3 className="admin-prod-modal-title">
                {editingId ? "✏️ Chỉnh Sửa Sản Phẩm" : "➕ Thêm Sản Phẩm Mới"}
              </h3>
              <button
                type="button"
                className="admin-prod-modal-close"
                onClick={() => setFormOpen(false)}
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-prod-modal-form">
              {/* 🖼️ KHUNG ẢNH STUDIO 100PX */}
              <div className="admin-prod-photo-section">
                {form.image ? (
                  <div className="admin-prod-photo-card">
                    <div className="admin-prod-photo-stage">
                      <img src={form.image} alt="Sản phẩm" className="admin-prod-photo-img" />
                    </div>
                    <div className="admin-prod-photo-actions">
                      <label htmlFor="prod-image-file-input" className="btn btn-sm btn-outline prod-photo-btn">
                        <Upload size={12} /> <span>{uploadingImage ? "Đang tải..." : "Thay ảnh"}</span>
                      </label>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost text-danger prod-photo-btn"
                        onClick={() => setForm({ ...form, image: "" })}
                      >
                        <Trash2 size={12} /> Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="prod-image-file-input" className="admin-prod-photo-empty">
                    <Upload size={20} />
                    <span className="photo-empty-text">{uploadingImage ? "Đang tải ảnh..." : "Chạm để tải ảnh từ máy tính"}</span>
                  </label>
                )}

                <input
                  id="prod-image-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  style={{ display: "none" }}
                />
              </div>

              {/* TÊN SẢN PHẨM */}
              <div className="admin-prod-form-field">
                <label className="admin-prod-form-label">Tên sản phẩm: *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Mảnh Ghép NFC Gỗ 3D — Hà Nội"
                  className="admin-prod-form-input prod-name-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* PHÂN LOẠI & HUY HIỆU */}
              <div className="admin-prod-form-row">
                <div className="admin-prod-form-field">
                  <label className="admin-prod-form-label">Phân loại:</label>
                  <select
                    className="admin-prod-form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="single">Mảnh Ghép Lẻ Tỉnh Thành</option>
                    <option value="combo">Combo Trọn Bộ / Fullbox</option>
                    <option value="accessory">Thẻ VIP / Phụ Kiện</option>
                  </select>
                </div>

                <div className="admin-prod-form-field">
                  <label className="admin-prod-form-label">Huy hiệu / Tag:</label>
                  <input
                    type="text"
                    placeholder="VD: SIÊU ƯU ĐÃI 🔥"
                    className="admin-prod-form-input"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  />
                </div>
              </div>

              {/* GIÁ BÁN & GIÁ GỐC */}
              <div className="admin-prod-form-row">
                <div className="admin-prod-form-field">
                  <label className="admin-prod-form-label">Giá bán thực tế: *</label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="150000"
                      className="admin-prod-form-input price-input"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                    <span className="currency-tag">VNĐ</span>
                  </div>
                </div>

                <div className="admin-prod-form-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="admin-prod-form-label">Giá gốc niêm yết:</label>
                    {Number(form.original_price) > Number(form.price) && Number(form.original_price) > 0 && (
                      <span className="discount-pill">
                        -{Math.round(((Number(form.original_price) - Number(form.price)) / Number(form.original_price)) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      min="0"
                      placeholder="180000"
                      className="admin-prod-form-input"
                      value={form.original_price}
                      onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    />
                    <span className="currency-tag">VNĐ</span>
                  </div>
                </div>
              </div>

              {/* MÔ TẢ */}
              <div className="admin-prod-form-field">
                <label className="admin-prod-form-label">Mô tả sản phẩm:</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả chất liệu gỗ bách xanh, chip NFC..."
                  className="admin-prod-form-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* FOOTER NÚT HÀNH ĐỘNG */}
              <div className="admin-prod-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline admin-prod-btn-cancel"
                  onClick={() => setFormOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary admin-prod-btn-submit"
                >
                  {editingId ? "Lưu Cập Nhật 🚀" : "Tạo Sản Phẩm 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚠️ POPUP XÁC NHẬN HÀNH ĐỘNG DÙNG CHUNG */}
      {confirmDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.75)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", backdropFilter: "blur(4px)" }}>
          <div style={{ maxWidth: "460px", width: "100%", background: "#ffffff", borderRadius: "20px", padding: "1.75rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#fff7ed",
                  color: confirmDialog.confirmBg || "#ea580c",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  border: "2px solid #ffedd5"
                }}
              >
                <AlertTriangle size={28} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                {confirmDialog.title}
              </h3>
              <p style={{ fontSize: "0.92rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                {confirmDialog.message}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem" }}>
              <button
                type="button"
                className="btn"
                style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", fontWeight: 700, color: "#475569", cursor: "pointer" }}
                onClick={() => setConfirmDialog(null)}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "12px",
                  border: "none",
                  background: confirmDialog.confirmBg || "#ea580c",
                  color: "#ffffff",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText || "Xác Nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
