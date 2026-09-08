"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Package, AlertCircle } from "lucide-react";
import { orderAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import OrderStepper from "./components/OrderStepper";
import OrderShippingInfo from "./components/OrderShippingInfo";
import OrderItemsList from "./components/OrderItemsList";
import OrderPaymentSummary from "./components/OrderPaymentSummary";
import OrderActionFooter from "./components/OrderActionFooter";
import CancelModal from "../components/CancelModal";
import "./OrderDetail.css";

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State for Cancellation / Refund
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "direct",
  });
  const [submittingModal, setSubmittingModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadOrderDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderAPI.getMyOrderDetail(orderId);
      if (res && res.order) {
        setOrder(res.order);
      } else {
        setError("Không tìm thấy đơn hàng yêu cầu.");
      }
    } catch (err) {
      console.error("Lỗi nạp chi tiết đơn hàng:", err);
      setError(err.message || "Lỗi nạp chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDirectCancel = async (ord, reason) => {
    setSubmittingModal(true);
    try {
      await orderAPI.cancelMyOrder(ord.id, reason);
      showToast("Đã hủy đơn hàng thành công!", "success");
      setModalConfig({ isOpen: false, type: "direct" });
      loadOrderDetail();
    } catch (err) {
      alert(err.message || "Lỗi khi hủy đơn hàng");
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleConfirmRequestCancel = async (ord, { reason, bankInfo }) => {
    setSubmittingModal(true);
    try {
      await orderAPI.requestCancelMyOrder(ord.id, { reason, bankInfo });
      showToast(
        "Đã gửi yêu cầu hủy đơn. Admin sẽ liên hệ & hoàn tiền cho bạn sớm nhất!",
        "success",
      );
      setModalConfig({ isOpen: false, type: "request" });
      loadOrderDetail();
    } catch (err) {
      alert(err.message || "Lỗi gửi yêu cầu hủy");
    } finally {
      setSubmittingModal(false);
    }
  };

  const getStatusHeadline = () => {
    if (!order) return "";
    if (order.status === "cancelled") return "Đơn hàng đã hủy";
    if (order.cancel_request_status === "pending")
      return "Đang chờ duyệt hoàn tiền";
    if (order.status === "completed") return "Giao hàng thành công";
    if (order.status === "shipping") return "Đang trên đường giao";
    if (order.status === "paid") return "Xưởng mộc đang gia công";
    return "Đang chuẩn bị hàng (COD)";
  };

  if (loading) {
    return (
      <div className="order-detail-page-wrap">
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <DinoLoader
            fullScreen={false}
            size={180}
            text="Đang tải chi tiết đơn hàng..."
            subtext="Đang đồng bộ tiến độ xưởng chế tác"
          />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page-wrap">
        <div className="order-detail-error-box">
          <AlertCircle size={48} className="text-red" />
          <h2>{error || "Không tìm thấy đơn hàng"}</h2>
          <p>Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này.</p>
          <button
            type="button"
            className="btn-back-to-orders"
            onClick={() => router.push("/customer/orders")}
          >
            <ArrowLeft size={16} /> Quay lại danh sách đơn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page-wrap">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="detail-toast-alert">
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* ─── 1. TOP NAV BAR WITH BACK BUTTON ─────────────────────────── */}
      <div className="order-detail-nav">
        <button
          type="button"
          className="btn-detail-back"
          onClick={() => router.push("/customer/orders")}
        >
          <ChevronLeft size={22} />
        </button>

        <div className="detail-nav-title-box">
          <h1 className="detail-nav-headline">{getStatusHeadline()}</h1>
          <span className="detail-nav-subcode">#{order.order_code}</span>
        </div>
      </div>

      {/* ─── 2. PROGRESS STEPPER (TIKTOK STYLE) ───────────────────────── */}
      <OrderStepper order={order} />

      {/* ─── 3. RECIPIENT & SHIPPING INFO ─────────────────────────────── */}
      <OrderShippingInfo order={order} />

      {/* ─── 4. PURCHASED PRODUCTS LIST ───────────────────────────────── */}
      <OrderItemsList order={order} />

      {/* ─── 5. PAYMENT & PRICING SUMMARY ─────────────────────────────── */}
      <OrderPaymentSummary order={order} />

      {/* ─── 6. STICKY BOTTOM ACTION BAR ──────────────────────────────── */}
      <OrderActionFooter
        order={order}
        onDirectCancel={() =>
          setModalConfig({ isOpen: true, type: "direct" })
        }
        onRequestCancel={() =>
          setModalConfig({ isOpen: true, type: "request" })
        }
      />

      {/* ─── 7. MODAL HỦY ĐƠN (NẾU CẦN THAO TÁC) ──────────────────────── */}
      {modalConfig.isOpen && (
        <CancelModal
          type={modalConfig.type}
          order={order}
          onClose={() => setModalConfig({ isOpen: false, type: "direct" })}
          onConfirmDirect={handleConfirmDirectCancel}
          onConfirmRequest={handleConfirmRequestCancel}
          submitting={submittingModal}
        />
      )}
    </div>
  );
}
