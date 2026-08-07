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
} from "lucide-react";
import { manualSaleAPI, orderAPI } from "@/lib/api";
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
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
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
          {activeTab === "manual" && (
            <button className="btn btn-primary" onClick={openCreateForm}>
              <Plus size={16} /> Tạo đơn thủ công
            </button>
          )}
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
                        <span className="badge badge-warning">Chờ thanh toán</span>
                      )}
                      {o.status === "paid" && (
                        <span className="badge badge-success">Đã thanh toán</span>
                      )}
                      {o.status === "shipping" && (
                        <span className="badge badge-blue">Đang giao hàng</span>
                      )}
                      {o.status === "completed" && (
                        <span className="badge badge-purple">Hoàn tất</span>
                      )}
                      {o.status === "cancelled" && (
                        <span className="badge badge-danger">Đã hủy</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {o.status === "pending" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleUpdateOrderStatus(o.id, "paid")}
                            title="Xác nhận đã nhận tiền chuyển khoản"
                          >
                            Xác nhận chuyển khoản
                          </button>
                        )}
                        {o.status === "paid" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateOrderStatus(o.id, "shipping")}
                          >
                            Giao Hàng
                          </button>
                        )}
                        {o.status === "shipping" && (
                          <button
                            className="btn btn-sm btn-purple"
                            onClick={() => handleUpdateOrderStatus(o.id, "completed")}
                          >
                            Hoàn Tất
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
                      <button
                        className="btn-icon text-danger"
                        onClick={() => handleDeleteManual(s.id)}
                        title="Xóa đơn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
