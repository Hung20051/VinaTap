"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
  AlertTriangle,
  Copy,
  Check,
  XCircle,
} from "lucide-react";
import { manualSaleAPI, orderAPI, productAPI } from "@/lib/api";
import { getToken } from "@/lib/auth";
import DinoLoader from "@/components/ui/DinoLoader";
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
  const [statusFilter, setStatusFilter] = useState("active"); // 'active' | 'cancel_request' | 'pending' | 'paid' | 'shipping' | 'completed' | 'cancelled' | 'all'
  const [toast, setToast] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  // Modal xác nhận thao tác Admin
  const [confirmModal, setConfirmModal] = useState(null); // { orderId, orderCode, newStatus, message }

  // Modals xử lý Hủy đơn & Duyệt Yêu cầu hủy từ khách
  const [cancelReviewModal, setCancelReviewModal] = useState(null); // { order, action: 'approve' | 'reject' }
  const [rejectionReason, setRejectionReason] = useState("Đơn hàng đã được đóng gói và giao cho đơn vị vận chuyển.");
  const [adminCancelModal, setAdminCancelModal] = useState(null); // { order }
  const [adminCancelReason, setAdminCancelReason] = useState("Hết hàng trong kho");
  const [customAdminCancelReason, setCustomAdminCancelReason] = useState("");
  const [processingCancel, setProcessingCancel] = useState(false);
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);

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

  const loadData = async (
    searchValue = search,
    pageNum = page,
    filterStatus = statusFilter,
  ) => {
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
      showToast(
        `Đã cập nhật đơn hàng #${orderId} sang ${newStatus}`,
        "success",
      );
      loadData();
    } catch (err) {
      showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyBankInfo = async (info) => {
    try {
      await navigator.clipboard.writeText(info);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = info;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(textarea);
    }
    setCopiedBankInfo(true);
    setTimeout(() => setCopiedBankInfo(false), 2000);
  };

  const handleReviewCancelSubmit = async () => {
    if (!cancelReviewModal) return;
    const { order, action } = cancelReviewModal;
    setProcessingCancel(true);
    try {
      await orderAPI.reviewCancelRequest(order.id, {
        action,
        rejection_reason: action === "reject" ? rejectionReason : undefined,
      });
      showToast(
        action === "approve"
          ? `Đã duyệt hủy đơn #${order.order_code} và hoàn voucher thành công!`
          : `Đã từ chối yêu cầu hủy đơn #${order.order_code}!`,
        "success"
      );
      setCancelReviewModal(null);
      loadData();
    } catch (err) {
      showToast(err.message || "Lỗi khi xử lý yêu cầu hủy", "error");
    } finally {
      setProcessingCancel(false);
    }
  };

  const handleAdminDirectCancelSubmit = async () => {
    if (!adminCancelModal) return;
    const { order } = adminCancelModal;
    setProcessingCancel(true);
    const finalReason =
      adminCancelReason === "Khác" ? customAdminCancelReason : adminCancelReason;
    try {
      await orderAPI.updateStatus(order.id, "cancelled", finalReason);
      showToast(`Đã hủy đơn hàng #${order.order_code} thành công!`, "success");
      setAdminCancelModal(null);
      setCustomAdminCancelReason("");
      loadData();
    } catch (err) {
      showToast(err.message || "Lỗi khi hủy đơn hàng", "error");
    } finally {
      setProcessingCancel(false);
    }
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
            <Download size={14} />{" "}
            <span className="btn-label-desktop">Xuất CSV</span>
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
            className={`admin-tab-btn ${activeTab === "online" ? "is-active" : ""}`}
            onClick={() => handleTabChange("online")}
          >
            <ShoppingBag size={14} />
            <span className="tab-label-desktop">
              Đơn Hàng Shop Online (VietQR / COD)
            </span>
            <span className="tab-label-mobile">Shop Online</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "manual" ? "is-active" : ""}`}
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
              <option value="active">
                ⚡ Đơn cần xử lý (COD mới & VietQR đã thanh toán)
              </option>
              <option value="cancel_request">
                ⚠️ Khách xin hủy đơn ({onlineOrders.filter((o) => o.cancel_request_status === "pending").length})
              </option>
              <option value="pending_qr">
                ⏳ Chờ chuyển khoản (VietQR chưa thanh toán)
              </option>
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
        <div
          className="card admin-rev-table-wrap"
          style={{ padding: "2.5rem 1rem" }}
        >
          <DinoLoader
            fullScreen={false}
            size={200}
            text="Đang tải dữ liệu doanh thu..."
            subtext="Đang đồng bộ đơn hàng VietQR & Bán buôn"
          />
        </div>
      ) : activeTab === "online" ? (
        /* DANH SÁCH ĐƠN SHOP ONLINE (VIETQR / COD) */
        (() => {
          const displayOnlineOrders = onlineOrders.filter((o) => {
            if (statusFilter === "all") return true;
            if (statusFilter === "active") return o.status !== "cancelled";
            if (statusFilter === "cancel_request") return o.cancel_request_status === "pending";
            return o.status === statusFilter;
          });

          return displayOnlineOrders.length === 0 ? (
            <div className="admin-rev-empty">
              Chưa có đơn hàng Shop Online nào khớp với bộ lọc.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="admin-rev-table-wrap">
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
                      <tr
                        key={o.id}
                        style={{
                          background:
                            o.cancel_request_status === "pending"
                              ? "#fffbeb"
                              : "transparent",
                        }}
                      >
                        <td>
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="rev-order-code-badge rev-order-code-link"
                            title="Xem chi tiết đơn hàng"
                          >
                            #{o.order_code}
                          </Link>
                          <span className="rev-order-date">
                            {new Date(o.created_at).toLocaleDateString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                              },
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="rev-customer-name">
                            {o.recipient_name}
                          </span>
                          <span className="rev-customer-sub">
                            {o.user_email || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="rev-phone-text">
                            📞 {o.recipient_phone}
                          </span>
                          <div className="rev-address-text">
                            📍 {o.recipient_address}
                          </div>
                        </td>
                        <td>
                          {o.payment_method === "vietqr" ? (
                            <span className="rev-pm-pill is-vietqr">
                              <QrCode size={13} /> VietQR
                            </span>
                          ) : (
                            <span className="rev-pm-pill is-cod">
                              <Truck size={13} /> COD
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="rev-price-main">
                            {formatVND(o.total_amount)}
                          </span>
                          {o.discount_amount > 0 && (
                            <span className="rev-price-discount">
                              🎟️ -{formatVND(o.discount_amount)}
                            </span>
                          )}
                        </td>
                        <td>
                          {o.cancel_request_status === "pending" ? (
                            <div>
                              <span className="rev-status-pill is-cancel-req">
                                ⚠️ Khách xin hủy
                              </span>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#64748b",
                                  marginTop: "4px",
                                  maxWidth: "200px",
                                  lineHeight: 1.3,
                                }}
                              >
                                <div>
                                  <strong>Lý do:</strong> {o.cancel_reason}
                                </div>
                                {o.cancel_bank_info && (
                                  <div
                                    style={{
                                      marginTop: "2px",
                                      color: "#0284c7",
                                    }}
                                  >
                                    <strong>STK hoàn:</strong>{" "}
                                    {o.cancel_bank_info}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              {o.status === "pending" &&
                                (o.payment_method === "cod" ? (
                                  <span className="rev-status-pill is-pending-cod">
                                    📦 Chờ đóng gói
                                  </span>
                                ) : (
                                  <span className="rev-status-pill is-pending-qr">
                                    ⏳ Chờ CK VietQR
                                  </span>
                                ))}
                              {o.status === "paid" && (
                                <span className="rev-status-pill is-paid">
                                  ✅ Đã thanh toán
                                </span>
                              )}
                              {o.status === "shipping" && (
                                <span className="rev-status-pill is-shipping">
                                  🚚 Đang giao hàng
                                </span>
                              )}
                              {o.status === "completed" && (
                                <span className="rev-status-pill is-completed">
                                  🎉 Hoàn tất
                                </span>
                              )}
                              {o.status === "cancelled" && (
                                <div>
                                  <span className="rev-status-pill is-cancelled">
                                    🚫 Đã hủy
                                  </span>
                                  {o.cancel_reason && (
                                    <div
                                      style={{
                                        fontSize: "0.74rem",
                                        color: "#94a3b8",
                                        marginTop: "3px",
                                        maxWidth: "180px",
                                      }}
                                    >
                                      {o.cancel_reason}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </td>
                        <td>
                          {o.cancel_request_status === "pending" ? (
                            <div className="rev-actions-group">
                              <button
                                className="rev-btn-action is-success"
                                onClick={() =>
                                  setCancelReviewModal({
                                    order: o,
                                    action: "approve",
                                  })
                                }
                                title="Duyệt yêu cầu và hoàn tiền"
                              >
                                ✓ Duyệt & Hoàn
                              </button>
                              <button
                                className="rev-btn-action is-danger-ghost"
                                onClick={() => {
                                  setRejectionReason(
                                    "Đơn hàng đã được xuất kho và đang giao.",
                                  );
                                  setCancelReviewModal({
                                    order: o,
                                    action: "reject",
                                  });
                                }}
                                title="Từ chối yêu cầu hủy"
                              >
                                ✕ Từ Chối
                              </button>
                            </div>
                          ) : (
                            <div className="rev-actions-group">
                              {o.status === "pending" &&
                                o.payment_method === "vietqr" && (
                                  <button
                                    className="rev-btn-action is-secondary"
                                    onClick={() =>
                                      requestUpdateOrderStatus(
                                        o.id,
                                        o.order_code,
                                        "paid",
                                      )
                                    }
                                    title="Chỉ bấm khi khách chuyển tiền nhưng gõ sai nội dung"
                                  >
                                    ⚡ Duyệt tay CK
                                  </button>
                                )}
                              {o.status === "pending" &&
                                o.payment_method === "cod" && (
                                  <button
                                    className="rev-btn-action is-primary"
                                    onClick={() =>
                                      requestUpdateOrderStatus(
                                        o.id,
                                        o.order_code,
                                        "shipping",
                                      )
                                    }
                                  >
                                    🚀 Giao Hàng
                                  </button>
                                )}
                              {o.status === "paid" && (
                                <button
                                  className="rev-btn-action is-primary"
                                  onClick={() =>
                                    requestUpdateOrderStatus(
                                      o.id,
                                      o.order_code,
                                      "shipping",
                                    )
                                  }
                                >
                                  🚀 Giao Hàng
                                </button>
                              )}
                              {o.status === "shipping" && (
                                <button
                                  className="rev-btn-action is-purple"
                                  onClick={() =>
                                    requestUpdateOrderStatus(
                                      o.id,
                                      o.order_code,
                                      "completed",
                                    )
                                  }
                                >
                                  ✓ Hoàn Tất
                                </button>
                              )}
                              {["pending", "paid", "shipping"].includes(
                                o.status,
                              ) && (
                                <button
                                  className="rev-btn-action is-danger-ghost"
                                  onClick={() => {
                                    setAdminCancelReason("Hết hàng trong kho");
                                    setCustomAdminCancelReason("");
                                    setAdminCancelModal({ order: o });
                                  }}
                                  title="Hủy đơn hàng này"
                                >
                                  ✕ Hủy
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📱 MOBILE ORDER CARDS VIEW */}
              <div className="admin-rev-cards-mobile">
                {displayOnlineOrders.map((o) => (
                  <div
                    key={o.id}
                    className="admin-order-card"
                    style={{
                      border:
                        o.cancel_request_status === "pending"
                          ? "1.5px solid #fecdd3"
                          : undefined,
                      background:
                        o.cancel_request_status === "pending"
                          ? "#fffdfb"
                          : undefined,
                    }}
                  >
                    <div className="order-card-header">
                      <div>
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="order-card-code order-card-code-link"
                          title="Xem chi tiết đơn hàng"
                        >
                          #{o.order_code}
                        </Link>
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
                        {o.cancel_request_status === "pending" ? (
                          <span
                            className="badge badge-warning"
                            style={{
                              background: "#fff1f2",
                              color: "#e11d48",
                              border: "1px solid #fecdd3",
                              fontWeight: 800,
                            }}
                          >
                            ⚠️ Khách xin hủy
                          </span>
                        ) : (
                          <>
                            {o.status === "pending" &&
                              (o.payment_method === "cod" ? (
                                <span
                                  className="badge badge-warning"
                                  style={{
                                    background: "#fff7ed",
                                    color: "#c2410c",
                                    border: "1px solid #ffedd5",
                                  }}
                                >
                                  📦 Đơn COD mới
                                </span>
                              ) : (
                                <span
                                  className="badge badge-warning"
                                  style={{
                                    background: "#fef3c7",
                                    color: "#b45309",
                                    border: "1px solid #fde68a",
                                  }}
                                >
                                  ⏳ Chờ CK
                                </span>
                              ))}
                            {o.status === "paid" && (
                              <span
                                className="badge badge-success"
                                style={{
                                  background: "#dcfce7",
                                  color: "#15803d",
                                  border: "1px solid #86efac",
                                  fontWeight: 800,
                                }}
                              >
                                ✅ Đã thanh toán
                              </span>
                            )}
                            {o.status === "shipping" && (
                              <span className="badge badge-blue">
                                🚚 Đang giao
                              </span>
                            )}
                            {o.status === "completed" && (
                              <span className="badge badge-purple">
                                🎉 Hoàn tất
                              </span>
                            )}
                            {o.status === "cancelled" && (
                              <span
                                className="badge badge-secondary"
                                style={{
                                  background: "#f1f5f9",
                                  color: "#64748b",
                                }}
                              >
                                🚫 Đã hủy
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-card-customer">
                        <span className="customer-name">
                          👤 {o.recipient_name}
                        </span>
                        <span className="customer-phone">
                          📞 {o.recipient_phone}
                        </span>
                      </div>
                      {o.recipient_address && (
                        <div className="order-card-address">
                          📍 {o.recipient_address}
                        </div>
                      )}
                      {o.cancel_request_status === "pending" && (
                        <div
                          style={{
                            padding: "8px 10px",
                            background: "#fff1f2",
                            borderRadius: "8px",
                            border: "1px solid #fecdd3",
                            fontSize: "0.8rem",
                            color: "#9f1239",
                            marginTop: "8px",
                          }}
                        >
                          <div><strong>Lý do hủy:</strong> {o.cancel_reason}</div>
                          {o.cancel_bank_info && (
                            <div style={{ marginTop: "3px" }}>
                              <strong>STK hoàn:</strong> {o.cancel_bank_info}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="order-card-footer">
                      <div className="order-card-price-wrap">
                        <span className="payment-tag">
                          {o.payment_method === "vietqr"
                            ? "💳 VietQR"
                            : "🚚 COD"}
                        </span>
                        <strong className="order-card-total">
                          {formatVND(o.total_amount)}
                        </strong>
                      </div>

                      <div className="order-card-actions">
                        {o.cancel_request_status === "pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="btn btn-sm"
                              style={{
                                background: "#16a34a",
                                color: "#ffffff",
                                fontWeight: 700,
                              }}
                              onClick={() =>
                                setCancelReviewModal({
                                  order: o,
                                  action: "approve",
                                })
                              }
                            >
                              ✓ Duyệt & Hoàn
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                background: "#fee2e2",
                                color: "#dc2626",
                                border: "1px solid #fca5a5",
                                fontWeight: 700,
                              }}
                              onClick={() => {
                                setRejectionReason(
                                  "Đơn hàng đã được xuất kho và đang giao.",
                                );
                                setCancelReviewModal({
                                  order: o,
                                  action: "reject",
                                });
                              }}
                            >
                              ✕ Từ Chối
                            </button>
                          </div>
                        ) : (
                          <>
                            {o.status === "pending" &&
                              o.payment_method === "vietqr" && (
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() =>
                                    requestUpdateOrderStatus(
                                      o.id,
                                      o.order_code,
                                      "paid",
                                    )
                                  }
                                >
                                  ⚡ Duyệt tay
                                </button>
                              )}
                            {o.status === "pending" &&
                              o.payment_method === "cod" && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  style={{
                                    background: "#ea580c",
                                    borderColor: "#ea580c",
                                  }}
                                  onClick={() =>
                                    requestUpdateOrderStatus(
                                      o.id,
                                      o.order_code,
                                      "shipping",
                                    )
                                  }
                                >
                                  🚀 Giao Hàng
                                </button>
                              )}
                            {o.status === "paid" && (
                              <button
                                className="btn btn-sm btn-primary"
                                style={{
                                  background: "#ea580c",
                                  borderColor: "#ea580c",
                                }}
                                onClick={() =>
                                  requestUpdateOrderStatus(
                                    o.id,
                                    o.order_code,
                                    "shipping",
                                  )
                                }
                              >
                                🚀 Giao Hàng
                              </button>
                            )}
                            {o.status === "shipping" && (
                              <button
                                className="btn btn-sm btn-purple"
                                onClick={() =>
                                  requestUpdateOrderStatus(
                                    o.id,
                                    o.order_code,
                                    "completed",
                                  )
                                }
                              >
                                ✓ Hoàn Tất
                              </button>
                            )}
                            {["pending", "paid", "shipping"].includes(
                              o.status,
                            ) && (
                              <button
                                className="btn btn-sm"
                                style={{
                                  background: "#fef2f2",
                                  color: "#ef4444",
                                  border: "1px solid #fee2e2",
                                }}
                                onClick={() => {
                                  setAdminCancelReason("Hết hàng trong kho");
                                  setCustomAdminCancelReason("");
                                  setAdminCancelModal({ order: o });
                                }}
                              >
                                ✕ Hủy
                              </button>
                            )}
                          </>
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
                    <span className="pagination-current">
                      Trang {page} / {Math.ceil(totalOnlineOrders / PAGE_SIZE)}
                    </span>
                    <span className="pagination-total">
                      ({totalOnlineOrders} đơn hàng)
                    </span>
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
      ) : /* DANH SÁCH ĐƠN THỦ CÔNG */
      sales.length === 0 ? (
        <div className="admin-rev-empty">Chưa có đơn bán thủ công nào</div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="admin-rev-table-wrap">
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
                      <span className="rev-order-code-badge">
                        #{s.sale_code}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "#0f172a" }}>
                        {s.product_name_snapshot}
                      </strong>
                      {s.note && (
                        <div
                          style={{
                            fontSize: "0.76rem",
                            color: "#64748b",
                            marginTop: "2px",
                          }}
                        >
                          📝 {s.note}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          background: "#f1f5f9",
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        ×{s.quantity}
                      </span>
                    </td>
                    <td>{formatVND(s.unit_price)}</td>
                    <td>
                      <span className="rev-price-main">
                        {formatVND(s.total_amount)}
                      </span>
                    </td>
                    <td>
                      <span className="rev-customer-name">{s.buyer_name}</span>
                    </td>
                    <td>
                      <span className="rev-order-date">
                        {new Date(s.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td>
                      <div className="rev-actions-group">
                        <button
                          className="rev-btn-action is-secondary"
                          onClick={() => openEditForm(s)}
                          title="Xem chi tiết & Chỉnh sửa đơn bán thủ công"
                        >
                          <Eye size={13} /> Sửa
                        </button>
                        <button
                          className="rev-btn-action is-danger-ghost"
                          onClick={() => handleDeleteManual(s.id)}
                          title="Xóa đơn"
                        >
                          <Trash2 size={14} />
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
                  <strong className="order-card-total">
                    {formatVND(s.total_amount)}
                  </strong>
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

                <div
                  className="order-card-footer"
                  style={{ justifyContent: "flex-end" }}
                >
                  <div className="order-card-actions">
                    <button
                      className="btn btn-sm btn-outline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
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
                <span className="pagination-current">
                  Trang {page} / {Math.ceil(sales.length / PAGE_SIZE)}
                </span>
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
      )}

      {/* 🛡️ MODAL XÁC NHẬN HÀNH ĐỘNG DÀNH CHO ADMIN */}
      {confirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: "460px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h3
              style={{
                margin: "0 0 0.75rem 0",
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "#0f172a",
              }}
            >
              ⚠️ Xác Nhận Thao Tác Đơn Hàng
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#334155",
                lineHeight: "1.5",
                marginBottom: "1.5rem",
              }}
            >
              {confirmModal.message}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  color: "#475569",
                  fontWeight: "600",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmUpdate}
                style={{
                  padding: "9px 22px",
                  borderRadius: "10px",
                  background: "#0284c7",
                  color: "#ffffff",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Đồng ý thực hiện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ MODAL DUYỆT HOẶC TỪ CHỐI YÊU CẦU HỦY TỪ KHÁCH */}
      {cancelReviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setCancelReviewModal(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "520px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  background:
                    cancelReviewModal.action === "approve"
                      ? "#dcfce7"
                      : "#fee2e2",
                  color:
                    cancelReviewModal.action === "approve"
                      ? "#15803d"
                      : "#dc2626",
                  padding: "10px",
                  borderRadius: "12px",
                }}
              >
                {cancelReviewModal.action === "approve" ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  {cancelReviewModal.action === "approve"
                    ? "Duyệt Yêu Cầu Hủy & Hoàn Tiền"
                    : "Từ Chối Yêu Cầu Hủy Đơn"}
                </h3>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.85rem",
                    color: "#64748b",
                  }}
                >
                  Đơn hàng: <strong>#{cancelReviewModal.order.order_code}</strong>{" "}
                  ({formatVND(cancelReviewModal.order.total_amount)})
                </p>
              </div>
            </div>

            {cancelReviewModal.action === "approve" ? (
              <div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem",
                    fontSize: "0.88rem",
                    color: "#334155",
                    lineHeight: 1.6,
                    marginBottom: "1.25rem",
                  }}
                >
                  <div style={{ marginBottom: "6px" }}>
                    <strong>Lý do khách xin hủy:</strong>{" "}
                    <span style={{ color: "#e11d48" }}>
                      {cancelReviewModal.order.cancel_reason || "Không nêu"}
                    </span>
                  </div>
                  <div>
                    <strong>Tài khoản nhận tiền hoàn:</strong>
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontWeight: 700,
                        color: "#0284c7",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        {cancelReviewModal.order.cancel_bank_info ||
                          "Chưa cung cấp"}
                      </span>
                      {cancelReviewModal.order.cancel_bank_info && (
                        <button
                          type="button"
                          onClick={() =>
                            copyBankInfo(
                              cancelReviewModal.order.cancel_bank_info,
                            )
                          }
                          style={{
                            background: copiedBankInfo ? "#dcfce7" : "#f1f5f9",
                            color: copiedBankInfo ? "#15803d" : "#475569",
                            border: "none",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {copiedBankInfo ? (
                            <>
                              <Check size={12} /> Đã chép
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Sao chép
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "0.82rem",
                    color: "#b45309",
                    marginBottom: "1.5rem",
                  }}
                >
                  💡 <strong>Quy trình:</strong> Vui lòng chuyển khoản số tiền{" "}
                  <strong>
                    {formatVND(cancelReviewModal.order.total_amount)}
                  </strong>{" "}
                  vào STK trên trước, sau đó bấm <strong>Xác Nhận</strong>. Hệ
                  thống sẽ chuyển đơn sang <strong>Đã hủy</strong> và tự động
                  hoàn lại voucher cho khách.
                </div>
              </div>
            ) : (
              <div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#475569",
                    marginBottom: "1rem",
                  }}
                >
                  Vui lòng cung cấp lý do từ chối để hệ thống gửi thông báo giải
                  thích cho khách hàng:
                </p>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#334155",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Chọn lý do từ chối:
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.88rem",
                      background: "#ffffff",
                    }}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  >
                    <option value="Đơn hàng đã được đóng gói và giao cho đơn vị vận chuyển.">
                      Đơn hàng đã được đóng gói và giao cho đơn vị vận chuyển.
                    </option>
                    <option value="Sản phẩm đang trên đường vận chuyển, quý khách vui lòng từ chối nhận khi shipper giao.">
                      Sản phẩm đang trên đường vận chuyển, quý khách vui lòng từ
                      chối nhận khi shipper giao.
                    </option>
                    <option value="Thông tin tài khoản nhận tiền hoàn chưa đầy đủ hoặc không chính xác.">
                      Thông tin tài khoản nhận tiền hoàn chưa đầy đủ hoặc không
                      chính xác.
                    </option>
                  </select>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() => setCancelReviewModal(null)}
                disabled={processingCancel}
                style={{
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  color: "#475569",
                  fontWeight: "600",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn"
                disabled={processingCancel}
                onClick={handleReviewCancelSubmit}
                style={{
                  padding: "9px 22px",
                  borderRadius: "10px",
                  background:
                    cancelReviewModal.action === "approve"
                      ? "#16a34a"
                      : "#dc2626",
                  color: "#ffffff",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {processingCancel
                  ? "Đang xử lý..."
                  : cancelReviewModal.action === "approve"
                    ? "✓ Xác Nhận Đã Hoàn Tiền & Hủy Đơn"
                    : "✕ Xác Nhận Từ Chối"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 MODAL ADMIN TRỰC TIẾP HỦY ĐƠN */}
      {adminCancelModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setAdminCancelModal(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "480px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  padding: "10px",
                  borderRadius: "12px",
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  Admin Hủy Đơn Hàng
                </h3>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.85rem",
                    color: "#64748b",
                  }}
                >
                  Đơn hàng: <strong>#{adminCancelModal.order.order_code}</strong>
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.88rem",
                color: "#475569",
                lineHeight: 1.5,
                marginBottom: "1rem",
              }}
            >
              Bạn đang thực hiện hủy đơn hàng này với quyền Quản trị viên. Voucher (nếu có) sẽ được tự động hoàn lại cho khách hàng.
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#334155",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Lý do hủy đơn:
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.88rem",
                  background: "#ffffff",
                }}
                value={adminCancelReason}
                onChange={(e) => setAdminCancelReason(e.target.value)}
              >
                <option value="Hết hàng trong kho">Hết hàng trong kho</option>
                <option value="Khách hàng liên hệ qua Hotline/Zalo yêu cầu hủy">
                  Khách hàng liên hệ qua Hotline/Zalo yêu cầu hủy
                </option>
                <option value="Sai thông tin người nhận / không thể liên lạc">
                  Sai thông tin người nhận / không thể liên lạc
                </option>
                <option value="Đơn hàng trùng lặp">Đơn hàng trùng lặp</option>
                <option value="Khác">Lý do khác...</option>
              </select>

              {adminCancelReason === "Khác" && (
                <textarea
                  rows={2}
                  placeholder="Nhập lý do hủy chi tiết..."
                  value={customAdminCancelReason}
                  onChange={(e) => setCustomAdminCancelReason(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                className="btn"
                onClick={() => setAdminCancelModal(null)}
                disabled={processingCancel}
                style={{
                  padding: "9px 18px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  color: "#475569",
                  fontWeight: "600",
                  border: "1px solid #cbd5e1",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn"
                disabled={processingCancel}
                onClick={handleAdminDirectCancelSubmit}
                style={{
                  padding: "9px 22px",
                  borderRadius: "10px",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {processingCancel ? "Đang hủy..." : "Xác Nhận Hủy Đơn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📝 MODAL TẠO / SỬA ĐƠN BÁN THỦ CÔNG */}
      {formOpen && (
        <div
          className="admin-rev-modal-overlay"
          onClick={() => setFormOpen(false)}
        >
          <div
            className="admin-rev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-rev-modal-handle-bar" />
            <div className="admin-rev-modal-header">
              <h3 className="admin-rev-modal-title">
                {editingId
                  ? "✏️ Sửa Đơn Bán Buôn"
                  : "➕ Tạo Đơn Bán Buôn / Đại Lý"}
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
                    const selectedP = products.find(
                      (p) => String(p.id) === String(pid),
                    );
                    setForm({
                      ...form,
                      product_id: pid || "",
                      product_name_snapshot: selectedP
                        ? selectedP.name
                        : form.product_name_snapshot || "",
                      unit_price: selectedP
                        ? (selectedP.price ?? selectedP.default_price ?? "")
                        : (form.unit_price ?? ""),
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
                  onChange={(e) =>
                    setForm({ ...form, product_name_snapshot: e.target.value })
                  }
                />
              </div>

              <div className="admin-rev-form-row">
                <div className="admin-rev-form-field">
                  <label className="admin-rev-form-label">Đơn giá: *</label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="150000"
                      className="admin-rev-form-input price-input"
                      value={form.unit_price ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, unit_price: e.target.value })
                      }
                    />
                    <span className="currency-tag">VNĐ</span>
                  </div>
                </div>

                <div className="admin-rev-form-field">
                  <label className="admin-rev-form-label">Số lượng: *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1"
                    className="admin-rev-form-input"
                    value={form.quantity ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* TỔNG TIỀN TẠM TÍNH */}
              {Number(form.unit_price) > 0 && Number(form.quantity) > 0 && (
                <div className="admin-rev-calc-badge">
                  <span>💰 Thành tiền:</span>
                  <strong>
                    {formatVND(Number(form.unit_price) * Number(form.quantity))}
                  </strong>
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
                  onChange={(e) =>
                    setForm({ ...form, buyer_name: e.target.value })
                  }
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
