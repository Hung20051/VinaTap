"use client";

import { useEffect, useState, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { manualSaleAPI, orderAPI, productAPI } from "@/lib/api";
import { getToken } from "@/lib/auth";
import "./AdminRevenue.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";
const PAGE_SIZE = 20;

export default function AdminRevenue() {
  const [activeTab, setActiveTab] = useState("online"); // 'online' | 'manual'
  const [sales, setSales] = useState([]);
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [totalOnlineOrders, setTotalOnlineOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // 'active' | 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled' | 'all'
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

  // Tự động tìm kiếm Real-time (Debounce 300ms) mỗi khi gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(search, page, statusFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab, page, statusFilter]);

  const loadData = async (searchValue = search, pageNum = page, filterStatus = statusFilter) => {
    setLoading(true);
    try {
      if (activeTab === "online") {
        const res = await orderAPI.getAdminOrders({
          search: searchValue,
          status: filterStatus,
          limit: PAGE_SIZE,
          offset: (pageNum - 1) * PAGE_SIZE,
        });
        setOnlineOrders(res.orders || []);
        setTotalOnlineOrders(res.total || (res.orders || []).length);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setPage(1);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="admin-rev-header__title-group">
          <h1 className="admin-dash-title">💰 Quản Lý Doanh Thu</h1>
          <p className="admin-dash-subtitle">
            Theo dõi đơn hàng Shop Online VietQR & Đơn bán buôn đại lý
          </p>
        </div>

        <div className="admin-rev-header__actions">
          <button
            className="btn btn-outline admin-rev-btn-csv"
            onClick={handleExportCsv}
            title="Xuất danh sách ra file CSV"
          >
            <Download size={14} /> <span className="btn-label-desktop">Xuất CSV</span>
          </button>
          <button
            className="btn btn-primary admin-rev-btn-create"
            onClick={openCreateForm}
            title="Tạo đơn hàng mới"
          >
            <Plus size={14} /> <span>Tạo Đơn</span>
          </button>
        </div>
      </div>

      {/* STICKY CONTROLS (TABS + SEARCH + FILTER) */}
      <div className="admin-rev-sticky-controls">
        {/* TAB SELECTOR */}
        <div className="admin-tab-nav">
          <button
            className={`btn admin-tab-btn ${activeTab === "online" ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleTabChange("online")}
          >
            <ShoppingBag size={14} />
            <span className="tab-label-desktop">Đơn Hàng Shop Online (VietQR / COD)</span>
            <span className="tab-label-mobile">Shop Online</span>
          </button>
          <button
            className={`btn admin-tab-btn ${activeTab === "manual" ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleTabChange("manual")}
          >
            <CreditCard size={14} />
            <span className="tab-label-desktop">Đơn Bán Buôn Thủ Công</span>
            <span className="tab-label-mobile">Bán Buôn</span>
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="admin-rev-filter-wrap">
          <div className="admin-rev-search">
            <Search size={16} className="admin-rev-search__icon" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Tìm theo mã đơn, SĐT hoặc tên người mua..."
              className="admin-rev-search__input"
            />
            {search && (
              <button
                type="button"
                className="admin-rev-search__clear"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                title="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {activeTab === "online" && (
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="admin-rev-status-select"
            >
              <option value="active">⚡ Đơn cần xử lý (COD mới & VietQR đã thanh toán)</option>
              <option value="pending_qr">⏳ Chờ chuyển khoản (VietQR chưa thanh toán)</option>
              <option value="paid">✅ Đã thanh toán (Chờ đóng gói)</option>
              <option value="shipping">🚚 Đang giao hàng</option>
              <option value="completed">🎉 Đã hoàn tất</option>
              <option value="cancelled">🚫 Đã hủy / Hết hạn 30p</option>
              <option value="all">🌐 Tất cả đơn hàng</option>
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : activeTab === "online" ? (
        /* DANH SÁCH ĐƠN SHOP ONLINE (VIETQR / COD) */
        (() => {
          const displayOnlineOrders = onlineOrders.filter((o) => {
            if (statusFilter === "all") return true;
            if (statusFilter === "active") return o.status !== "cancelled";
            return o.status === statusFilter;
          });

          return displayOnlineOrders.length === 0 ? (
            <div className="card admin-rev-empty">
              Chưa có đơn hàng Shop Online nào khớp với bộ lọc.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
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
                    {displayOnlineOrders.map((o) => (
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
                            o.payment_method === "cod" ? (
                              <span className="badge badge-warning" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5" }}>
                                📦 Đơn COD mới
                              </span>
                            ) : (
                              <span className="badge badge-warning" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" }}>
                                ⏳ Chờ CK VietQR
                              </span>
                            )
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
                            {o.status === "pending" && o.payment_method === "vietqr" && (
                              <button
                                className="btn btn-sm"
                                style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#475569", fontSize: "0.75rem", padding: "4px 8px" }}
                                onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "paid")}
                                title="Chỉ bấm khi khách chuyển tiền nhưng gõ sai nội dung"
                              >
                                ⚡ Duyệt tay CK
                              </button>
                            )}
                            {o.status === "pending" && o.payment_method === "cod" && (
                              <button
                                className="btn btn-sm btn-primary"
                                style={{ background: "#ea580c", borderColor: "#ea580c", fontWeight: 700 }}
                                onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "shipping")}
                              >
                                🚀 Duyệt & Giao
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

              {/* 📱 MOBILE ORDER CARDS VIEW */}
              <div className="admin-rev-cards-mobile">
                {displayOnlineOrders.map((o) => (
                  <div key={o.id} className="admin-order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-card-code">{o.order_code}</span>
                        <div className="order-card-time">
                          {new Date(o.created_at).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>
                        {o.status === "pending" && (
                          o.payment_method === "cod" ? (
                            <span className="badge badge-warning" style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5" }}>
                              📦 Đơn COD mới
                            </span>
                          ) : (
                            <span className="badge badge-warning" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" }}>
                              ⏳ Chờ CK
                            </span>
                          )
                        )}
                        {o.status === "paid" && (
                          <span className="badge badge-success" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 800 }}>
                            ✅ Đã thanh toán
                          </span>
                        )}
                        {o.status === "shipping" && (
                          <span className="badge badge-blue">🚚 Đang giao</span>
                        )}
                        {o.status === "completed" && (
                          <span className="badge badge-purple">🎉 Hoàn tất</span>
                        )}
                        {o.status === "cancelled" && (
                          <span className="badge badge-secondary" style={{ background: "#f1f5f9", color: "#64748b" }}>
                            🚫 Đã hủy
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-card-customer">
                        <span className="customer-name">👤 {o.recipient_name}</span>
                        <span className="customer-phone">📞 {o.recipient_phone}</span>
                      </div>
                      {o.recipient_address && (
                        <div className="order-card-address">
                          📍 {o.recipient_address}
                        </div>
                      )}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-card-price-wrap">
                        <span className="payment-tag">
                          {o.payment_method === "vietqr" ? "💳 VietQR" : "🚚 COD"}
                        </span>
                        <strong className="order-card-total">{formatVND(o.total_amount)}</strong>
                      </div>

                      <div className="order-card-actions">
                        {o.status === "pending" && o.payment_method === "vietqr" && (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "paid")}
                          >
                            ⚡ Duyệt tay
                          </button>
                        )}
                        {o.status === "pending" && o.payment_method === "cod" && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ background: "#ea580c", borderColor: "#ea580c" }}
                            onClick={() => requestUpdateOrderStatus(o.id, o.order_code, "shipping")}
                          >
                            🚀 Giao Hàng
                          </button>
                        )}
                        {o.status === "paid" && (
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ background: "#ea580c", borderColor: "#ea580c" }}
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
                    </div>
                  </div>
                ))}
              </div>
              {/* PHÂN TRANG (ONLINE ORDERS) */}
              {Math.ceil(totalOnlineOrders / PAGE_SIZE) > 1 && (
                <div className="admin-pagination">
                  <button
                    type="button"
                    className="btn btn-outline admin-pagination-btn"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <ChevronLeft size={15} /> <span>Trang trước</span>
                  </button>

                  <div className="admin-pagination-info">
                    <span className="pagination-current">Trang {page} / {Math.ceil(totalOnlineOrders / PAGE_SIZE)}</span>
                    <span className="pagination-total">({totalOnlineOrders} đơn hàng)</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline admin-pagination-btn"
                    disabled={page >= Math.ceil(totalOnlineOrders / PAGE_SIZE)}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <span>Trang sau</span> <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          );
        })()
      ) : (
        /* DANH SÁCH ĐƠN THỦ CÔNG */
        sales.length === 0 ? (
          <div className="card admin-rev-empty">Chưa có đơn bán thủ công nào</div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
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

            {/* 📱 MOBILE CARDS VIEW (MANUAL SALES) */}
            <div className="admin-rev-cards-mobile">
              {sales.map((s) => (
                <div key={s.id} className="admin-order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-card-code">{s.sale_code}</span>
                      <div className="order-card-time">
                        {new Date(s.created_at).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <strong className="order-card-total">{formatVND(s.total_amount)}</strong>
                  </div>

                  <div className="order-card-body">
                    <div className="order-card-product">
                      📦 <strong>{s.product_name_snapshot}</strong> × {s.quantity}
                    </div>
                    <div className="order-card-customer">
                      👤 Người mua: <strong>{s.buyer_name}</strong>
                    </div>
                    {s.note && (
                      <div className="order-card-address">
                        📝 Ghi chú: {s.note}
                      </div>
                    )}
                  </div>

                  <div className="order-card-footer" style={{ justifyContent: "flex-end" }}>
                    <div className="order-card-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ display: "flex", alignItems: "center", gap: "4px" }}
                        onClick={() => openEditForm(s)}
                      >
                        <Eye size={14} /> Xem / Sửa
                      </button>
                      <button
                        className="btn-icon text-danger"
                        onClick={() => handleDeleteManual(s.id)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PHÂN TRANG (MANUAL SALES) */}
            {Math.ceil(sales.length / PAGE_SIZE) > 1 && (
              <div className="admin-pagination">
                <button
                  type="button"
                  className="btn btn-outline admin-pagination-btn"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft size={15} /> <span>Trang trước</span>
                </button>

                <div className="admin-pagination-info">
                  <span className="pagination-current">Trang {page} / {Math.ceil(sales.length / PAGE_SIZE)}</span>
                  <span className="pagination-total">({sales.length} đơn)</span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline admin-pagination-btn"
                  disabled={page >= Math.ceil(sales.length / PAGE_SIZE)}
                  onClick={() => handlePageChange(page + 1)}
                >
                  <span>Trang sau</span> <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
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
        <div className="admin-rev-modal-overlay" onClick={() => setFormOpen(false)}>
          <div className="admin-rev-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-rev-modal-handle-bar" />
            <div className="admin-rev-modal-header">
              <h3 className="admin-rev-modal-title">
                {editingId ? "✏️ Sửa Đơn Bán Buôn" : "➕ Tạo Đơn Bán Buôn / Đại Lý"}
              </h3>
              <button
                type="button"
                className="admin-rev-modal-close"
                onClick={() => setFormOpen(false)}
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-rev-modal-form">
              <div className="admin-rev-form-field">
                <label className="admin-rev-form-label">
                  Sản phẩm mẫu có sẵn:
                </label>
                <select
                  className="admin-rev-form-select"
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
                  <option value="">-- Chọn sản phẩm mẫu --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatVND(p.price ?? p.default_price ?? 0)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-rev-form-field">
                <label className="admin-rev-form-label">
                  Tên sản phẩm ghi nhận: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Mảnh Ghép NFC Gỗ 3D — Hà Nội"
                  className="admin-rev-form-input prod-name-input"
                  value={form.product_name_snapshot ?? ""}
                  onChange={(e) => setForm({ ...form, product_name_snapshot: e.target.value })}
                />
              </div>

              <div className="admin-rev-form-row">
                <div className="admin-rev-form-field">
                  <label className="admin-rev-form-label">
                    Đơn giá: *
                  </label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="150000"
                      className="admin-rev-form-input price-input"
                      value={form.unit_price ?? ""}
                      onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                    />
                    <span className="currency-tag">VNĐ</span>
                  </div>
                </div>

                <div className="admin-rev-form-field">
                  <label className="admin-rev-form-label">
                    Số lượng: *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1"
                    className="admin-rev-form-input"
                    value={form.quantity ?? ""}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
              </div>

              {/* TỔNG TIỀN TẠM TÍNH */}
              {Number(form.unit_price) > 0 && Number(form.quantity) > 0 && (
                <div className="admin-rev-calc-badge">
                  <span>💰 Thành tiền:</span>
                  <strong>{formatVND(Number(form.unit_price) * Number(form.quantity))}</strong>
                </div>
              )}

              <div className="admin-rev-form-field">
                <label className="admin-rev-form-label">
                  Tên người mua / Đại lý: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A (Đại lý Đà Nẵng)"
                  className="admin-rev-form-input"
                  value={form.buyer_name ?? ""}
                  onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                />
              </div>

              <div className="admin-rev-form-field">
                <label className="admin-rev-form-label">
                  Ghi chú đơn hàng:
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Đã thanh toán tiền mặt 50% cọc..."
                  className="admin-rev-form-textarea"
                  value={form.note ?? ""}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <div className="admin-rev-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline admin-rev-btn-cancel"
                  onClick={() => setFormOpen(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary admin-rev-btn-submit"
                >
                  {editingId ? "Lưu Cập Nhật 🚀" : "Tạo Đơn Ngay 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
