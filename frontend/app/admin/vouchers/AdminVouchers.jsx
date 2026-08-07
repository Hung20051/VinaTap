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
} from "lucide-react";
import { voucherAPI } from "../../../lib/api";
import "./AdminVouchers.css";

export default function AdminVouchers() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherAPI.getAdminList();
      setVouchers(data || []);
    } catch (err) {
      console.error("Fetch admin vouchers error:", err);
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
      setToast("🎉 Đã tạo Mã Voucher mới thành công!");
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

      setToast(`🎁 Đã tặng thành công cho ${res.count} khách hàng!`);
      setSendModalOpen(false);
      fetchVouchers();
    } catch (err) {
      alert(err.message || "Lỗi tặng Voucher");
    } finally {
      setSending(false);
    }
  };

  const filteredVouchers = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="admin-vouchers-shell">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">🎟️ Quản Lý Voucher & Mã Khuyến Mãi</h1>
          <p className="admin-page-subtitle">
            Tạo mã chiết khấu, cài đặt ngày hết hạn, tặng trực tiếp vào Ví khách hàng & bắn Thông báo 🔔
          </p>
        </div>

        <div className="admin-action-btns">
          <button className="btn-refresh" onClick={fetchVouchers}>
            <RefreshCw size={16} /> Làm mới
          </button>
          <button className="btn-create-voucher" onClick={() => setCreateModalOpen(true)}>
            <Plus size={18} /> Tạo Voucher Mới
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast-success-banner">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      {/* FILTER SEARCH BAR */}
      <div className="vouchers-filter-bar">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm mã Voucher (VD: VINATAP2026, FREESHIP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* BẢNG DANH SÁCH VOUCHER */}
      <div className="vouchers-table-card">
        {loading ? (
          <div className="table-loading">Đang tải danh sách Voucher từ Database...</div>
        ) : (
          <table className="vouchers-table">
            <thead>
              <tr>
                <th>Mã Voucher</th>
                <th>Tên Ưu Đãi</th>
                <th>Loại Giảm Giá</th>
                <th>Giá Trị</th>
                <th>Hạn Sử Dụng</th>
                <th>Đơn Tối Thiểu</th>
                <th>Đã Tặng</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-empty">
                    Chưa có mã Voucher nào trong Database. Hãy bấm "Tạo Voucher Mới"!
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <code className="v-code-badge">{v.code}</code>
                    </td>
                    <td>
                      <strong>{v.title}</strong>
                      {v.description && <p className="v-desc-sub">{v.description}</p>}
                    </td>
                    <td>
                      <span className={`type-tag type-${v.discount_type}`}>
                        {v.discount_type === "percent"
                          ? "Giảm %"
                          : v.discount_type === "amount"
                          ? "Giảm tiền ₫"
                          : "Free Ship"}
                      </span>
                    </td>
                    <td>
                      <strong className="text-orange">{v.discountText}</strong>
                    </td>
                    <td>
                      {v.isPermanent ? (
                        <span className="badge badge-green">♾️ Vĩnh viễn</span>
                      ) : v.isExpired ? (
                        <span className="badge badge-red">⏰ Hết hạn</span>
                      ) : (
                        <span className="badge badge-blue">
                          <Clock size={12} /> {new Date(v.expires_at).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </td>
                    <td>{v.min_order_amount > 0 ? formatMoney(v.min_order_amount) : "Không giới hạn"}</td>
                    <td>
                      <span className="user-count-badge">
                        <Users size={14} /> {v.total_assigned || 0} ví
                      </span>
                    </td>
                    <td>
                      {v.isExpired ? (
                        <span className="badge badge-red" style={{ padding: "6px 10px" }}>
                          🛑 Đã hết hạn
                        </span>
                      ) : (
                        <button
                          className="btn-send-gift"
                          onClick={() => {
                            router.push(`/admin/notifications?type=promo&voucherId=${v.id}`);
                          }}
                          title="Tặng Voucher qua Trung Tâm Thông Báo"
                        >
                          <Gift size={15} /> Tặng Khách
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL TẠO VOUCHER MỚI */}
      {createModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setCreateModalOpen(false)}>
              <X size={20} />
            </button>
            <h3>🎟️ Tạo Mã Voucher Khuyến Mãi Mới</h3>
            <form onSubmit={handleCreateVoucher} className="voucher-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Mã Voucher (Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: VINATAP2026, FREESHIP50K"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tên Chương Trình Ưu Đãi *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Voucher Tri Ân Khách Hàng VIP"
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
                    <option value="percent">Giảm Theo Phần Trăm (%)</option>
                    <option value="amount">Giảm Tiền Cố Định (VNĐ)</option>
                    <option value="freeship">Miễn Phí Vận Chuyển (Free Ship)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Giá Trị Giảm *</label>
                  <input
                    type="number"
                    required
                    placeholder="VD: 20 (cho 20%) hoặc 50000 (cho 50k)"
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
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                    <label style={{ fontSize: "0.85rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.is_permanent}
                        onChange={(e) => setFormData({ ...formData, is_permanent: e.target.checked })}
                      />{" "}
                      Vĩnh Viễn (Không Hết Hạn)
                    </label>
                  </div>
                  {!formData.is_permanent && (
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      style={{ marginTop: "8px" }}
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    />
                  )}
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

              <button type="submit" className="btn-submit-create">
                <Plus size={16} /> Tạo Mã Voucher
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TẶNG VOUCHER */}
      {sendModalOpen && selectedVoucher && (
        <div className="admin-modal-overlay" onClick={() => setSendModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSendModalOpen(false)}>
              <X size={20} />
            </button>
            <h3>🎁 Tặng Voucher: {selectedVoucher.code}</h3>
            <p className="text-muted">Voucher sẽ được lưu thẳng vào Ví cá nhân & tự động gửi Thông báo 🔔 cho khách hàng.</p>

            <form onSubmit={handleSendVoucher} className="voucher-form">
              <div className="form-group">
                <label>Đối Tượng Nhận Quà</label>
                <select value={sendTarget} onChange={(e) => setSendTarget(e.target.value)}>
                  <option value="all">🌐 Tất Cả Khách Hàng Trên Hệ Thống</option>
                  <option value="users">👤 Khách Hàng Cụ Thể (Nhập ID)</option>
                </select>
              </div>

              {sendTarget === "users" && (
                <div className="form-group">
                  <label>ID Người Nhận (Cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 1, 5, 12"
                    value={targetUserIds}
                    onChange={(e) => setTargetUserIds(e.target.value)}
                  />
                </div>
              )}

              <button type="submit" className="btn-submit-send" disabled={sending}>
                <Send size={16} /> {sending ? "Đang gửi quà..." : "Xác Nhận Tặng Voucher"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
