"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Plus,
  Send,
  Gift,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Users,
  Bell,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
} from "lucide-react";
import { voucherAPI } from "@/lib/api";
import "./AdminVouchers.css";

const PAGE_SIZE = 8;

export default function AdminVouchers() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [toast, setToast] = useState(null);

  // Form Tạo Voucher Mới
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    discount_type: "percent",
    discount_value: 20,
    min_order_amount: 0,
    max_discount_amount: "",
    usage_limit: "",
    is_permanent: true,
    expires_at: "",
  });

  // Form Tặng Voucher
  const [sendTarget, setSendTarget] = useState("all"); // 'all' | 'users'
  const [targetUserIds, setTargetUserIds] = useState("");
  const [sending, setSending] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherAPI.getAdminList();
      setVouchers(data || []);
    } catch (err) {
      console.error("Fetch admin vouchers error:", err);
      showToast("Không thể tải danh sách voucher", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!formData.is_permanent && formData.expires_at) {
      const selectedDate = new Date(formData.expires_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        alert("⚠️ Hạn sử dụng không thể ở trong quá khứ! Vui lòng chọn từ hôm nay trở đi.");
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        expires_at: formData.is_permanent ? null : formData.expires_at,
      };
      await voucherAPI.createAdmin(payload);
      showToast("🎉 Đã tạo Mã Voucher mới thành công!");
      setCreateModalOpen(false);
      setFormData({
        code: "",
        title: "",
        description: "",
        discount_type: "percent",
        discount_value: 20,
        min_order_amount: 0,
        max_discount_amount: "",
        usage_limit: "",
        is_permanent: true,
        expires_at: "",
      });
      fetchVouchers();
    } catch (err) {
      alert(err.message || "Lỗi tạo Voucher");
    }
  };

  const handleDeleteVoucher = async (v) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn Voucher [${v.code}] không?\nKhách hàng đã lưu mã này sẽ bị gỡ bỏ.`)) {
      return;
    }
    try {
      await voucherAPI.deleteAdmin(v.id);
      showToast(`🗑️ Đã xóa Voucher "${v.code}" thành công!`);
      fetchVouchers();
    } catch (err) {
      alert(err.message || "Lỗi khi xóa Voucher");
    }
  };

  const handleSendVoucher = async (e) => {
    e.preventDefault();
    if (!selectedVoucher) return;

    setSending(true);
    try {
      const userIds = targetUserIds
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter(Boolean);

      const res = await voucherAPI.sendToUsers({
        voucherId: selectedVoucher.id,
        targetType: sendTarget,
        userIds,
        sendNotification: true,
      });

      showToast(`🎁 Đã tặng thành công cho ${res.count} khách hàng!`);
      setSendModalOpen(false);
      fetchVouchers();
    } catch (err) {
      alert(err.message || "Lỗi tặng Voucher");
    } finally {
      setSending(false);
    }
  };

  // Filter & Search Logic
  const filteredVouchers = vouchers.filter((v) => {
    // 1. Search Query
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      v.code.toLowerCase().includes(q) ||
      v.title.toLowerCase().includes(q) ||
      (v.description && v.description.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // 2. Type / Status Filter
    if (typeFilter === "all") return true;
    if (typeFilter === "percent") return v.discount_type === "percent";
    if (typeFilter === "amount") return v.discount_type === "amount";
    if (typeFilter === "freeship") return v.discount_type === "freeship";
    if (typeFilter === "active") return !v.isExpired;
    if (typeFilter === "expired") return v.isExpired;

    return true;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredVouchers.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const pagedVouchers = filteredVouchers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="admin-vouchers-shell">
      {/* ─── APP BAR HEADER ──────────────────────────── */}
      <div className="admin-header-row">
        <div className="admin-header-title-wrap">
          <h1 className="admin-page-title">🎟️ Quản Lý Voucher</h1>
          <p className="admin-page-subtitle">
            Cài đặt mã ưu đãi, điều kiện áp dụng & tặng vào ví khách hàng
          </p>
        </div>

        <div className="admin-action-btns">
          <button className="btn-refresh" onClick={fetchVouchers} title="Làm mới">
            <RefreshCw size={15} /> <span className="btn-label-desktop">Làm mới</span>
          </button>
          <button className="btn-create-voucher" onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} /> <span>Tạo Voucher</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className={`toast-banner toast-${toast.type}`}>
          <CheckCircle size={17} /> {toast.message}
        </div>
      )}

      {/* ─── STICKY CONTROLS (SEARCH + TYPE FILTER CHIPS) ─── */}
      <div className="vouchers-sticky-controls">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo mã code hoặc tên ưu đãi..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              title="Xóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 🏷️ DẢI CHIP LỌC VUỐT CHẠM (HORIZONTAL FILTER TABS) */}
        <div className="voucher-filter-chips">
          <button
            className={`filter-chip ${typeFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("all");
              setPage(1);
            }}
          >
            Tất cả ({vouchers.length})
          </button>
          <button
            className={`filter-chip ${typeFilter === "percent" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("percent");
              setPage(1);
            }}
          >
            % Giảm giá
          </button>
          <button
            className={`filter-chip ${typeFilter === "amount" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("amount");
              setPage(1);
            }}
          >
            ₫ Giảm tiền
          </button>
          <button
            className={`filter-chip ${typeFilter === "freeship" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("freeship");
              setPage(1);
            }}
          >
            🚚 FreeShip
          </button>
          <button
            className={`filter-chip ${typeFilter === "active" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("active");
              setPage(1);
            }}
          >
            ✨ Hiệu lực
          </button>
          <button
            className={`filter-chip ${typeFilter === "expired" ? "active" : ""}`}
            onClick={() => {
              setTypeFilter("expired");
              setPage(1);
            }}
          >
            ⏰ Hết hạn
          </button>
        </div>
      </div>

      {/* 🎟️ DANH SÁCH VOUCHER (LUXURY COUPON GRID - DESKTOP & MOBILE) */}
      <div className="vouchers-grid-container">
        {loading ? (
          <div className="table-loading">Đang tải danh sách Voucher từ Database...</div>
        ) : pagedVouchers.length === 0 ? (
          <div className="table-empty">Không tìm thấy mã Voucher nào khớp với bộ lọc.</div>
        ) : (
          <div className="vouchers-lux-grid">
            {pagedVouchers.map((v) => (
              <div key={v.id} className={`voucher-lux-card type-${v.discount_type}`}>
                {/* Cuống vé bên trái với lỗ khoét vé coupon */}
                <div className="v-lux-left">
                  <div className="v-lux-notch top-notch" />
                  <div className="v-lux-notch bottom-notch" />
                  <div className="v-lux-val-group">
                    <span className="v-lux-val-main">
                      {v.discount_type === "percent"
                        ? `${Math.round(v.discount_value)}%`
                        : v.discount_type === "amount"
                        ? `${Number(v.discount_value) >= 1000 ? `${Math.round(Number(v.discount_value) / 1000)}k` : formatMoney(v.discount_value)}`
                        : "FREE"}
                    </span>
                    <span className="v-lux-val-sub">
                      {v.discount_type === "freeship" ? "FREESHIP" : "GIẢM GIÁ"}
                    </span>
                  </div>
                </div>

                {/* Thân vé bên phải */}
                <div className="v-lux-right">
                  <div className="v-lux-top-row">
                    <div className="v-lux-code-tag">
                      <Ticket size={11} />
                      <span>{v.code}</span>
                    </div>
                    {v.isPermanent ? (
                      <span className="v-lux-pill v-pill-green">♾️ Vĩnh viễn</span>
                    ) : v.isExpired ? (
                      <span className="v-lux-pill v-pill-red">⏰ Hết hạn</span>
                    ) : (
                      <span className="v-lux-pill v-pill-blue">
                        <Clock size={10} /> {new Date(v.expires_at).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>

                  <div className="v-lux-title">{v.title}</div>
                  {v.description && <div className="v-lux-desc">{v.description}</div>}

                  <div className="v-lux-footer-row">
                    <div className="v-lux-condition">
                      <span>Đơn từ: <strong>{v.min_order_amount > 0 ? formatMoney(v.min_order_amount) : "0đ"}</strong></span>
                      <span className="v-lux-dot">•</span>
                      <span><Users size={11} /> <strong>{v.total_assigned || 0}</strong> ví</span>
                    </div>

                    <div className="v-lux-actions">
                      {!v.isExpired && (
                        <button
                          className="btn-lux-gift"
                          onClick={() => {
                            router.push(`/admin/notifications?type=promo&voucherId=${v.id}`);
                          }}
                          title="Tặng Voucher cho khách qua thông báo"
                        >
                          <Gift size={12} /> <span>Tặng</span>
                        </button>
                      )}
                      <button
                        className="btn-lux-delete"
                        onClick={() => handleDeleteVoucher(v)}
                        title="Xóa voucher"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📄 PHÂN TRANG (PAGINATION) - TRÁNH NGỘP */}
      {totalPages > 1 && (
        <div className="vouchers-pagination">
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={15} /> Trang trước
          </button>
          <span className="pagination-info">
            Trang <strong>{currentPage}</strong> / {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Trang sau <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* 📝 MODAL TẠO VOUCHER MỚI (BALANCED BOTTOM SHEET) */}
      {createModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle-bar" />
            <div className="modal-header-row">
              <h3>🎟️ Tạo Mã Voucher Khuyến Mãi</h3>
              <button className="admin-modal-close" onClick={() => setCreateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="voucher-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Voucher (Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: VINATAP2026, FREESHIP50K"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label>Tên Chương Trình *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Ưu Đãi Lần Đầu"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loại Giảm Giá</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  >
                    <option value="percent">Giảm Phần Trăm (%)</option>
                    <option value="amount">Giảm Tiền Cố Định (VNĐ)</option>
                    <option value="freeship">Miễn Phí Vận Chuyển (FreeShip)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Giá Trị Giảm *</label>
                  <input
                    type="number"
                    required
                    placeholder="VD: 20 (cho 20%) hoặc 50000"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Đơn Hàng Tối Thiểu (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="0 = Không giới hạn"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>Hạn Sử Dụng</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", height: "36px" }}>
                    <label style={{ fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.is_permanent}
                        onChange={(e) => setFormData({ ...formData, is_permanent: e.target.checked })}
                      />{" "}
                      Vĩnh Viễn
                    </label>
                    {!formData.is_permanent && (
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        style={{ flex: 1, padding: "5px 8px" }}
                        value={formData.expires_at}
                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Mô Tả Ưu Đãi</label>
                <input
                  type="text"
                  placeholder="VD: Áp dụng cho tất cả đơn hàng thẻ NFC VinaTap"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-footer-row">
                <button type="button" className="btn-cancel" onClick={() => setCreateModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-submit-create">
                  <Plus size={16} /> Tạo Voucher Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
