"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Download,
  Trash2,
  X,
  ShoppingBag,
  CheckCircle,
  Truck,
  Clock,
  QrCode,
  CreditCard,
  Eye,
  Edit2,
} from "lucide-react";
import { manualSaleAPI, orderAPI, productAPI } from "@/lib/api";
import { getToken } from "../../../lib/auth";
import "./AdminRevenue.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export default function AdminRevenue() {
  const [activeTab, setActiveTab] = useState("online"); // 'online' | 'manual'
  const [sales, setSales] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  // Modal xác nhận thao tác Admin
  const [confirmModal, setConfirmModal] = useState(null); // { orderId, orderCode, newStatus, message }

  useEffect(() => {
    productAPI
      .getAll()
      .then((res) => setProducts(res.products || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async (searchValue = search) => {
    setLoading(true);
    try {
      if (activeTab === "online") {
        const res = await orderAPI.getAdminOrders({ search: searchValue });
        setOnlineOrders(res.orders || []);
      } else {
        const res = await manualSaleAPI.getAll({ search: searchValue });
        setSales(res.sales || []);
      }
    } catch (err) {
      showToast(err.message || "Lỗi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const requestUpdateOrderStatus = (orderId, orderCode, newStatus) => {
    let message = `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng ${orderCode}?`;
    if (newStatus === "paid") {
      message = `⚡ Bạn có chắc chắn muốn XÁC NHẬN ĐÃ NHẬN TIỀN THỦ CÔNG cho đơn hàng ${orderCode}? (Chỉ thực hiện khi khách đã chuyển tiền thành công vào ngân hàng nhưng gõ sai nội dung).`;
    } else if (newStatus === "shipping") {
      message = `🚀 Bạn có chắc chắn muốn chuyển đơn hàng ${orderCode} sang trạng thái ĐANG GIAO HÀNG?`;
    } else if (newStatus === "completed") {
      message = `🎉 Bạn có chắc chắn muốn xác nhận đơn hàng ${orderCode} đã HOÀN TẤT giao tới khách hàng?`;
    }
    setConfirmModal({ orderId, orderCode, newStatus, message });
  };

  const handleConfirmUpdate = async () => {
    if (!confirmModal) return;
    const { orderId, newStatus } = confirmModal;
    setConfirmModal(null);
    await handleUpdateOrderStatus(orderId, newStatus);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      showToast(`Đã cập nhật đơn hàng #${orderId} sang ${newStatus}`, "success");
      loadData();
    } catch (err) {
      showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  function emptyForm() {
    return {
      product_id: "",
      product_name_snapshot: "",
      unit_price: "",
      quantity: 1,
      buyer_name: "",
      note: "",
    };
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData(search);
  };

  const openCreateForm = () => {
    setActiveTab("manual");
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const openEditForm = (sale) => {
    setActiveTab("manual");
    setEditingId(sale.id);
    setForm({
      product_id: sale.product_id || "",
      product_name_snapshot: sale.product_name_snapshot || "",
      unit_price: sale.unit_price,
      quantity: sale.quantity,
      buyer_name: sale.buyer_name,
      note: sale.note || "",
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.buyer_name || !form.buyer_name.trim()) {
      showToast("Vui lòng nhập tên người mua", "error");
      return;
    }
    if (!form.product_name_snapshot || !form.product_name_snapshot.trim()) {
      showToast("Vui lòng nhập tên sản phẩm", "error");
      return;
    }
    if (form.unit_price === undefined || Number(form.unit_price) < 0) {
      showToast("Vui lòng nhập đơn giá hợp lệ", "error");
      return;
    }
    try {
      if (editingId) {
        await manualSaleAPI.update(editingId, form);
        showToast("Đã cập nhật đơn bán thành công", "success");
      } else {
        await manualSaleAPI.create(form);
        showToast("Đã tạo đơn bán thủ công thành công", "success");
      }
      setFormOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || "Lỗi lưu đơn bán", "error");
    }
  };

  const handleDeleteManual = async (id) => {
    if (!confirm("Bạn có chắc muốn ẩn/xóa đơn bán này?")) return;
    try {
      await manualSaleAPI.delete(id);
      showToast("Đã xóa đơn bán thành công", "success");
      loadData();
    } catch (err) {
      showToast(err.message || "Lỗi xóa đơn bán", "error");
    }
  };

  const handleExportCsv = async () => {
    try {
      const url = manualSaleAPI.exportCsvUrl({ search });
      const token = getToken();
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Không thể tải file CSV");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `VinaTap_DoanhThu_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      showToast("Đã xuất file CSV doanh thu thành công", "success");
    } catch (err) {
      showToast(err.message || "Lỗi khi xuất file CSV", "error");
    }
  };

  return (
    <div className="admin-rev-container">
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="admin-rev-header">
        <div>
          <h1 className="admin-dash-title">💰 Quản Lý Doanh Thu & Đơn Hàng</h1>
          <p className="admin-dash-subtitle">
            Theo dõi đơn hàng Shop Online VietQR & Đơn bán bán buôn đại lý
          </p>
        </div>

        <div className="admin-rev-header__actions">
          <button
            className="btn btn-outline"
            onClick={handleExportCsv}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Download size={16} /> Xuất CSV Doanh Thu
          </button>
          <button className="btn btn-primary" onClick={openCreateForm} style={{ background: "#ea580c", borderColor: "#ea580c", fontWeight: 700 }}>
            <Plus size={16} /> Tạo Đơn Thủ Công / Đại Lý
          </button>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="admin-tab-nav" style={{ display: "flex", gap: "12px", marginBottom: "1.5rem" }}>
        <button
          className={`btn ${activeTab === "online" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("online")}
        >
          <ShoppingBag size={16} /> Đơn Hàng Shop Online (VietQR / COD)
        </button>
        <button
          className={`btn ${activeTab === "manual" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("manual")}
        >
          <CreditCard size={16} /> Đơn Bán Bán Buôn Thủ Công
        </button>
      </div>

      <form className="admin-rev-search" onSubmit={handleSearchSubmit}>
        <Search size={16} className="admin-rev-search__icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mã đơn, số điện thoại hoặc tên người mua..."
          className="admin-rev-search__input"
        />
      </form>

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : activeTab === "online" ? (
        /* DANH SÁCH ĐƠN SHOP ONLINE (VIETQR / COD) */
        onlineOrders.length === 0 ? (
          <div className="card admin-rev-empty">
            Chưa có đơn hàng Shop Online nào được đặt.
          </div>
        ) : (
          <div className="card admin-rev-table-wrap">
            <table className="admin-rev-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>SĐT / Địa Chỉ</th>
                  <th>PTTT</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác Admin</th>
                </tr>
              </thead>
              <tbody>
                {onlineOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <code style={{ fontWeight: 800, color: "#0284c7" }}>
                        {o.order_code}
                      </code>
                      <br />
                      <small className="text-muted">
                        {new Date(o.created_at).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </td>
                    <td>
                      <strong>{o.recipient_name}</strong>
                      <br />
                      <small className="text-muted">{o.user_email || "N/A"}</small>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{o.recipient_phone}</span>
                      <br />
                      <small style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        {o.recipient_address}
                      </small>
                    </td>
                    <td>
                      {o.payment_method === "vietqr" ? (
                        <span className="badge badge-blue">
                          <QrCode size={12} /> VietQR
                        </span>
                      ) : (
                        <span className="badge badge-orange">
                          <Truck size={12} /> COD
                        </span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: "#ea580c" }}>
                        {formatVND(o.total_amount)}
                      </strong>
                      {o.discount_amount > 0 && (
                        <>
                          <br />
                          <small className="text-green">
                            Voucher: -{formatVND(o.discount_amount)}
                          </small>
                        </>
                      )}
                    </td>
                    <td>
                      {o.status === "pending" && (
                        <span className="badge badge-warning" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" }}>
                          ⏳ Chờ chuyển khoản
                        </span>
                      )}
                      {o.status === "paid" && (
                        <span className="badge badge-success" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 800 }}>
                          ✅ Đã thanh toán
                        </span>
                      )}
                      {o.status === "shipping" && (
                        <span className="badge badge-blue">🚚 Đang giao hàng</span>
                      )}
                      {o.status === "completed" && (
                        <span className="badge badge-purple">🎉 Hoàn tất</span>
                      )}
                      {o.status === "cancelled" && (
                        <span className="badge badge-secondary" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #cbd5e1" }}>
                          🚫 Đã bỏ dở
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {o.status === "pending" && (
                          <button
                            className="btn btn-sm"
                            style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#475569", fontSize: "0.75rem", padding: "4px 8px" }}
                            onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "paid")}
                            title="Chỉ bấm khi khách chuyển tiền nhưng gõ sai nội dung"
                          >
                            ⚡ Duyệt tay
                          </button>
                        )}
                        {o.status === "paid" && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ background: "#ea580c", borderColor: "#ea580c", fontWeight: 700 }}
                            onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "shipping")}
                          >
                            🚀 Giao Hàng
                          </button>
                        )}
                        {o.status === "shipping" && (
                          <button
                            className="btn btn-sm btn-purple"
                            onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "completed")}
                          >
                            ✓ Hoàn Tất
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* DANH SÁCH ĐƠN THỦ CÔNG */
        sales.length === 0 ? (
          <div className="card admin-rev-empty">Chưa có đơn bán thủ công nào</div>
        ) : (
          <div className="card admin-rev-table-wrap">
            <table className="admin-rev-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Sản phẩm</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th>Người mua</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <code>{s.sale_code}</code>
                    </td>
                    <td>{s.product_name_snapshot}</td>
                    <td>{s.quantity}</td>
                    <td>{formatVND(s.unit_price)}</td>
                    <td>
                      <strong>{formatVND(s.total_amount)}</strong>
                    </td>
                    <td>{s.buyer_name}</td>
                    <td>
                      {new Date(s.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <button
                          className="btn btn-sm"
                          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #93c5fd", fontSize: "0.75rem", padding: "4px 10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}
                          onClick={() => openEditForm(s)}
                          title="Xem chi tiết & Chỉnh sửa đơn bán thủ công"
                        >
                          <Eye size={13} /> Xem / Sửa
                        </button>
                        <button
                          className="btn-icon text-danger"
                          onClick={() => handleDeleteManual(s.id)}
                          title="Xóa/Ẩn đơn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* 🛡️ MODAL XÁC NHẬN HÀNH ĐỘNG DÀNH CHO ADMIN */}
      {confirmModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.75)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", backdropFilter: "blur(4px)" }}>
          <div className="card" style={{ maxWidth: "460px", width: "100%", background: "#ffffff", borderRadius: "18px", padding: "1.75rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>
              ⚠️ Xác Nhận Thao Tác Đơn Hàng
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              {confirmModal.message}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="btn"
                onClick={() => setConfirmModal(null)}
                style={{ padding: "9px 18px", borderRadius: "10px", background: "#f1f5f9", color: "#475569", fontWeight: "600", border: "1px solid #cbd5e1", cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmUpdate}
                style={{ padding: "9px 22px", borderRadius: "10px", background: "#0284c7", color: "#ffffff", fontWeight: "700", border: "none", cursor: "pointer" }}
              >
                Đồng ý thực hiện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 MODAL TẠO / SỬA ĐƠN BÁN THỦ CÔNG */}
      {formOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.75)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", backdropFilter: "blur(4px)" }}>
          <div className="card" style={{ maxWidth: "540px", width: "100%", background: "#ffffff", borderRadius: "18px", padding: "2rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                {editingId ? "✏️ Chỉnh Sửa Đơn Thủ Công" : "➕ Tạo Đơn Bán Thủ Công / Đại Lý"}
              </h3>
              <button type="button" onClick={() => setFormOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Chọn sản phẩm mẫu (hoặc nhập tên tùy chỉnh):
                </label>
                <select
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                  value={form.product_id || ""}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const selectedP = products.find((p) => String(p.id) === String(pid));
                    setForm({
                      ...form,
                      product_id: pid || "",
                      product_name_snapshot: selectedP ? selectedP.name : (form.product_name_snapshot || ""),
                      unit_price: selectedP ? (selectedP.price ?? selectedP.default_price ?? "") : (form.unit_price ?? ""),
                    });
                  }}
                >
                  <option value="">-- Chọn sản phẩm có sẵn --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatVND(p.price ?? p.default_price ?? 0)})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Tên sản phẩm (Snapshot): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thẻ NFC Gỗ 3D Hà Nội..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                  value={form.product_name_snapshot ?? ""}
                  onChange={(e) => setForm({ ...form, product_name_snapshot: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Đơn giá (VNĐ): *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="VD: 150000"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                    value={form.unit_price ?? ""}
                    onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Số lượng: *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                    value={form.quantity ?? ""}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Tên người mua / Đại lý: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A (Đại lý Đà Nẵng)..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                  value={form.buyer_name ?? ""}
                  onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Ghi chú đơn hàng:
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Đã nhận tiền mặt 50% cọc..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                  value={form.note ?? ""}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setFormOpen(false)}
                  style={{ padding: "10px 20px", borderRadius: "10px", background: "#f1f5f9", color: "#475569", fontWeight: 600, border: "1px solid #cbd5e1", cursor: "pointer" }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: "10px 24px", borderRadius: "10px", background: "#ea580c", color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  {editingId ? "Lưu Cập Nhật" : "Tạo Đơn Ngay 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
