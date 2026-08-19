"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  QrCode,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  X,
} from "lucide-react";
import { orderAPI, systemSettingAPI } from "@/lib/api";
import "./CustomerOrders.css";

const EMPTY_BANK_CONFIG = {
  bankId: "",
  bankName: "",
  accountNo: "",
  accountName: "",
};

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrderForQr, setSelectedOrderForQr] = useState(null);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [bankConfig, setBankConfig] = useState(EMPTY_BANK_CONFIG);

  useEffect(() => {
    loadOrders();
    systemSettingAPI
      .get()
      .then((res) => {
        if (res && res.settings) {
          const s = res.settings;
          setBankConfig({
            bankId: s.bank_id || "",
            bankName: s.bank_name || "",
            accountNo: s.bank_account_no || "",
            accountName: s.bank_account_name || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Lỗi nạp đơn hàng của tôi:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Chỉ hiển thị những đơn hàng ĐÃ MUA THỰC SỰ:
  // 1. Đơn VietQR đã thanh toán thành công (paid, shipping, completed, processing)
  // 2. Đơn COD nhận hàng thanh toán tiền mặt (pending, paid, shipping, completed)
  // ❌ Tự động ẩn các đơn VietQR pending chưa chuyển tiền (người dùng đóng popup/reload) để rác danh sách
  const validPurchasedOrders = orders.filter((o) => {
    if (["paid", "processing", "shipping", "completed"].includes(o.status)) {
      return true;
    }
    if (o.payment_method === "cod" && o.status !== "cancelled") {
      return true;
    }
    return false;
  });

  const filteredOrders = validPurchasedOrders.filter((o) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "processing") {
      return o.status === "paid" || o.status === "processing" || (o.payment_method === "cod" && o.status === "pending");
    }
    return o.status === filterStatus;
  });

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const getStatusBadge = (status, paymentMethod) => {
    switch (status) {
      case "pending":
        if (paymentMethod === "cod") {
          return (
            <span className="badge badge-warning" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" }}>
              📦 Đang chuẩn bị hàng (COD)
            </span>
          );
        }
        return (
          <span className="badge badge-warning" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" }}>
            ⏳ Chờ xác nhận
          </span>
        );
      case "paid":
        return (
          <span className="badge badge-success" style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 800 }}>
            ✅ Đã thanh toán
          </span>
        );
      case "shipping":
        return (
          <span className="badge badge-blue" style={{ background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" }}>
            🚚 Đang giao hàng
          </span>
        );
      case "completed":
        return (
          <span className="badge badge-purple" style={{ background: "#f3e8ff", color: "#7e22ce", border: "1px solid #e9d5ff" }}>
            🎉 Hoàn tất
          </span>
        );
      case "cancelled":
        return (
          <span className="badge badge-danger" style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }}>
            ❌ Đã hủy
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const copyMemo = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback cho HTTP hoặc trình duyệt không hỗ trợ Clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(textarea);
    }
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className="cust-orders-wrap">
      <div className="cust-orders-header">
        <div>
          <h1 className="cust-orders-title">🛍️ Đơn Hàng Của Tôi</h1>
          <p className="cust-orders-subtitle">
            Danh sách các đơn hàng thẻ NFC VinaTap bạn đã mua và tình trạng giao hàng
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-outline"
            onClick={loadOrders}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} /> Làm mới
          </button>
          <Link href="/shop" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShoppingBag size={15} /> Mua Thêm Thẻ
          </Link>
        </div>
      </div>

      {/* STATUS TABS */}
      <div className="cust-orders-tabs">
        <button
          className={`cust-tab-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          Tất cả đơn đã mua ({validPurchasedOrders.length})
        </button>
        <button
          className={`cust-tab-btn ${filterStatus === "processing" ? "active" : ""}`}
          onClick={() => setFilterStatus("processing")}
        >
          ✅ Đã thanh toán / Chuẩn bị ({validPurchasedOrders.filter((o) => o.status === "paid" || o.status === "processing" || (o.payment_method === "cod" && o.status === "pending")).length})
        </button>
        <button
          className={`cust-tab-btn ${filterStatus === "shipping" ? "active" : ""}`}
          onClick={() => setFilterStatus("shipping")}
        >
          🚚 Đang giao ({validPurchasedOrders.filter((o) => o.status === "shipping").length})
        </button>
        <button
          className={`cust-tab-btn ${filterStatus === "completed" ? "active" : ""}`}
          onClick={() => setFilterStatus("completed")}
        >
          🎉 Hoàn tất ({validPurchasedOrders.filter((o) => o.status === "completed").length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          <p className="text-muted">Đang tải lịch sử mua hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="cust-orders-empty">
          <Package size={48} style={{ color: "#94a3b8" }} />
          <p>
            {filterStatus === "all"
              ? "Bạn chưa có đơn hàng nào đã mua thành công."
              : "Không có đơn hàng nào ở trạng thái này."}
          </p>
          <Link href="/shop" className="btn btn-primary">
            Khám Phá Cửa Hàng Thẻ NFC 🚀
          </Link>
        </div>
      ) : (
        <div className="cust-orders-list">
          {filteredOrders.map((order) => {
            const items = order.items || order.items_json || [];
            return (
              <div key={order.id} className="cust-order-card">
                <div className="cust-order-top">
                  <div>
                    <span className="cust-order-code">#{order.order_code}</span>
                    <span className="cust-order-date">
                      {new Date(order.created_at).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status, order.payment_method)}</div>
                </div>

                <div className="cust-order-body">
                  <div className="cust-order-items-list">
                    {items.map((item, idx) => (
                      <div key={idx} className="cust-order-item-row">
                        <div className="cust-order-item-info">
                          <strong>{item.product_name_snapshot || item.name}</strong>
                          <span className="cust-order-item-qty">x{item.quantity}</span>
                        </div>
                        <div style={{ fontWeight: 600, color: "#334155" }}>
                          {formatMoney((item.unit_price || item.price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cust-order-details-grid">
                    <div>
                      <strong>📍 Địa chỉ nhận hàng:</strong>
                      <div style={{ color: "#475569", marginTop: "2px" }}>
                        {order.recipient_name} ({order.recipient_phone})
                        <br />
                        {order.recipient_address}
                      </div>
                    </div>
                    <div>
                      <strong>💳 Phương thức thanh toán:</strong>
                      <div style={{ color: "#475569", marginTop: "2px" }}>
                        {order.payment_method === "vietqr" ? (
                          <span style={{ color: "#0284c7", fontWeight: 700 }}>
                            Chuyển khoản VietQR
                          </span>
                        ) : (
                          <span style={{ color: "#ea580c", fontWeight: 700 }}>
                            Thanh toán khi nhận hàng (COD)
                          </span>
                        )}
                        {order.voucher_code && (
                          <div style={{ color: "#16a34a", fontSize: "0.8rem", marginTop: "4px" }}>
                            🎟️ Voucher: {order.voucher_code} (-{formatMoney(order.discount_amount)})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cust-order-footer">
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Tổng thanh toán: </span>
                    <span className="cust-order-total">{formatMoney(order.total_amount)}</span>
                  </div>

                  {order.status === "pending" && order.payment_method === "vietqr" && (
                    <button
                      className="btn-repay-qr"
                      onClick={() => setSelectedOrderForQr(order)}
                    >
                      <QrCode size={15} /> Quét Mã QR Thanh Toán
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL XEM LẠI MÃ VIETQR KHI CHƯA THANH TOÁN */}
      {selectedOrderForQr && (
        <div className="checkout-modal-overlay" onClick={() => setSelectedOrderForQr(null)}>
          <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <button className="checkout-modal-close" onClick={() => setSelectedOrderForQr(null)}>
              <X size={20} />
            </button>

            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
                📱 Quét Mã VietQR Chuyển Khoản
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 1rem" }}>
                Đơn hàng: <strong>{selectedOrderForQr.order_code}</strong>
              </p>

              <div style={{ display: "inline-block", background: "#f8fafc", padding: "12px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <img
                  src={`https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.png?amount=${selectedOrderForQr.total_amount}&addInfo=${selectedOrderForQr.order_code}&accountName=${encodeURIComponent(bankConfig.accountName)}`}
                  alt="VietQR"
                  style={{ width: "240px", height: "auto", display: "block" }}
                />
              </div>

              <div style={{ marginTop: "1rem", background: "#f1f5f9", padding: "10px", borderRadius: "10px", fontSize: "0.85rem", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Ngân hàng:</span>
                  <strong>{bankConfig.bankName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Số TK:</span>
                  <strong>{bankConfig.accountNo}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Số tiền:</span>
                  <strong style={{ color: "#ea580c" }}>{formatMoney(selectedOrderForQr.total_amount)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Nội dung CK:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <code style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                      {selectedOrderForQr.order_code}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyMemo(selectedOrderForQr.order_code)}
                      style={{ border: "none", background: "none", cursor: "pointer" }}
                    >
                      {copiedMemo ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedOrderForQr(null)}
                style={{ width: "100%", marginTop: "1.25rem" }}
              >
                Đã Chuyển Khoản & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
