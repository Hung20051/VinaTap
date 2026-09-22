"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, RefreshCw } from "lucide-react";
import { orderAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import OrderTabs from "./components/OrderTabs";
import OrderCard from "./components/OrderCard";
import CancelModal from "./components/CancelModal";
import "./CustomerOrders.css";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "direct", // "direct" or "request"
    order: null,
  });
  const [submittingModal, setSubmittingModal] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  // 🎯 Lọc danh sách hiển thị
  const validPurchasedOrders = orders.filter((o) => {
    if (["paid", "shipping", "completed", "cancelled"].includes(o.status)) {
      return true;
    }
    if (o.payment_method === "cod" || o.status === "pending") {
      return true;
    }
    return false;
  });

  const filteredOrders = validPurchasedOrders.filter((o) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "preparing") {
      return (
        (o.status === "paid" && o.cancel_request_status !== "pending") ||
        o.status === "pending"
      );
    }
    if (filterStatus === "shipping") {
      return o.status === "shipping";
    }
    if (filterStatus === "cancel_request") {
      return o.cancel_request_status === "pending";
    }
    if (filterStatus === "completed") {
      return o.status === "completed";
    }
    if (filterStatus === "cancelled") {
      return o.status === "cancelled";
    }
    return o.status === filterStatus;
  });

  // Xử lý khách tự hủy đơn COD pending
  const handleConfirmDirectCancel = async (order, reason) => {
    setSubmittingModal(true);
    try {
      await orderAPI.cancelMyOrder(order.id, reason);
      showToast("Đã hủy đơn hàng thành công!", "success");
      setModalConfig({ isOpen: false, type: "direct", order: null });
      loadOrders();
    } catch (err) {
      alert(err.message || "Lỗi khi hủy đơn hàng");
    } finally {
      setSubmittingModal(false);
    }
  };

  // Xử lý gửi yêu cầu hủy đơn VietQR paid
  const handleConfirmRequestCancel = async (order, { reason, bankInfo }) => {
    setSubmittingModal(true);
    try {
      await orderAPI.requestCancelMyOrder(order.id, { reason, bankInfo });
      showToast(
        "Đã gửi yêu cầu hủy đơn. Admin sẽ liên hệ & hoàn tiền cho bạn sớm nhất!",
        "success",
      );
      setModalConfig({ isOpen: false, type: "request", order: null });
      loadOrders();
    } catch (err) {
      alert(err.message || "Lỗi gửi yêu cầu hủy");
    } finally {
      setSubmittingModal(false);
    }
  };

  return (
    <div className="cust-orders-wrap">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            background: toastMessage.type === "success" ? "#0f172a" : "#dc2626",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontSize: "0.9rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "custFadeIn 0.3s ease",
          }}
        >
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* ─── 1. HEADER HERO BANNER ─────────────────────────────────── */}
      <div className="cust-orders-header">
        <div className="cust-orders-header-title-box">
          <div className="cust-orders-tag">
            <span>🏮 Quản lý mua sắm</span>
          </div>
          <h1 className="cust-orders-title">Đơn Hàng Của Tôi</h1>
          <p className="cust-orders-subtitle">
            Theo dõi hành trình chế tác xưởng mộc, giao nhận và quản lý đơn hàng
          </p>
        </div>

        <div className="cust-orders-header-actions">
          <button
            type="button"
            className="btn-order-hdr is-refresh"
            onClick={loadOrders}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            <span>Làm mới</span>
          </button>
          <Link href="/shop" className="btn-order-hdr is-shop">
            <ShoppingBag size={15} />
            <span>Mua Thêm Thẻ</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. STATUS FILTER PILLS (MODULAR) ───────────────────────── */}
      <OrderTabs
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        orders={validPurchasedOrders}
      />

      {/* ─── 3. ORDERS LIST / EMPTY STATE ──────────────────────────── */}
      {loading ? (
        <div
          style={{
            padding: "3rem 1rem",
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #f1f5f9",
          }}
        >
          <DinoLoader
            fullScreen={false}
            size={200}
            text="Đang tải lịch sử đơn hàng..."
            subtext="Đang đồng bộ trạng thái đơn hàng & xưởng chế tác"
          />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="cust-orders-empty-box">
          <div className="empty-pkg-icon-wrap">
            <Package size={52} />
          </div>
          <h2 className="empty-pkg-title">
            {filterStatus === "all"
              ? "Bạn chưa có đơn hàng nào"
              : "Không có đơn hàng nào trong mục này"}
          </h2>
          <p className="empty-pkg-desc">
            Khám phá bộ sưu tập Thẻ Mảnh Ghép NFC Di Sản Việt Nam độc bản và tạo đơn hàng
            ngay hôm nay!
          </p>
          <Link href="/shop" className="btn-empty-shop">
            <ShoppingBag size={18} />
            <span>Khám Phá Cửa Hàng Ngay</span>
          </Link>
        </div>
      ) : (
        <div className="cust-orders-list">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onDirectCancel={(o) =>
                setModalConfig({ isOpen: true, type: "direct", order: o })
              }
              onRequestCancel={(o) =>
                setModalConfig({ isOpen: true, type: "request", order: o })
              }
            />
          ))}
        </div>
      )}

      {/* ─── 4. CANCEL / REFUND MODAL (MODULAR) ────────────────────── */}
      {modalConfig.isOpen && (
        <CancelModal
          type={modalConfig.type}
          order={modalConfig.order}
          onClose={() =>
            setModalConfig({ isOpen: false, type: "direct", order: null })
          }
          onConfirmDirect={handleConfirmDirectCancel}
          onConfirmRequest={handleConfirmRequestCancel}
          submitting={submittingModal}
        />
      )}
    </div>
  );
}
