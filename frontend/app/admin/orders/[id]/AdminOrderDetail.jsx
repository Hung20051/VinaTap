"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  AlertTriangle,
  Phone,
  MapPin,
  User,
  CreditCard,
  QrCode,
  ShieldCheck,
  Building2,
  CheckCircle,
} from "lucide-react";
import { orderAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminOrderDetail.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export default function AdminOrderDetail({ orderId }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Review Cancel Request modal
  const [cancelModal, setCancelModal] = useState(null); // { type: 'approve' | 'reject' | 'admin_cancel' }
  const [rejectionReason, setRejectionReason] = useState(
    "Đơn hàng đã được xuất kho và giao cho đơn vị vận chuyển.",
  );
  const [adminCancelReason, setAdminCancelReason] = useState("Hết hàng trong kho");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast(`Đã sao chép: ${text}`, "success");
  };

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAdminOrderDetail(orderId);
      setOrder(res.order);
    } catch (err) {
      setError(err.message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchDetail();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setActionLoading(true);
      await orderAPI.updateStatus(order.id, newStatus);
      showToast(`Đã cập nhật trạng thái sang "${newStatus}"!`, "success");
      fetchDetail();
    } catch (err) {
      showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewCancel = async (action) => {
    try {
      setActionLoading(true);
      await orderAPI.reviewCancelRequest(order.id, {
        action,
        rejection_reason: action === "reject" ? rejectionReason : undefined,
      });
      showToast(
        action === "approve"
          ? "Đã duyệt hủy đơn & hoàn tiền thành công!"
          : "Đã từ chối yêu cầu hủy đơn!",
        "success",
      );
      setCancelModal(null);
      fetchDetail();
    } catch (err) {
      showToast(err.message || "Lỗi xử lý yêu cầu hủy", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminCancel = async () => {
    try {
      setActionLoading(true);
      await orderAPI.updateStatus(order.id, "cancelled", adminCancelReason);
      showToast("Đã hủy đơn hàng thành công!", "success");
      setCancelModal(null);
      fetchDetail();
    } catch (err) {
      showToast(err.message || "Lỗi hủy đơn", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="admin-detail-loading">
        <DinoLoader fullScreen={false} size={180} text="Đang tải chi tiết đơn..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-detail-error">
        <AlertTriangle size={48} color="#ef4444" />
        <h2>{error || "Không tìm thấy đơn hàng"}</h2>
        <Link href="/admin/revenue" className="btn btn-primary">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Stepper calculations
  const isCancelled = order.status === "cancelled";
  const isPendingCancel = order.cancel_request_status === "pending";
  const steps = [
    { key: "created", label: "Đặt Hàng", icon: Clock, done: true },
    {
      key: "paid",
      label: order.payment_method === "vietqr" ? "Đã Thanh Toán" : "Đã Xác Nhận",
      icon: CheckCircle2,
      done: ["paid", "shipping", "completed"].includes(order.status),
      active: order.status === "paid",
    },
    {
      key: "shipping",
      label: "Đang Giao",
      icon: Truck,
      done: ["shipping", "completed"].includes(order.status),
      active: order.status === "shipping",
    },
    {
      key: "completed",
      label: "Hoàn Tất",
      icon: Package,
      done: order.status === "completed",
      active: order.status === "completed",
    },
  ];

  const totalItemsQty = (order.items || []).reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );
  const fallbackPerItem =
    totalItemsQty > 0
      ? Math.max(
          0,
          Math.round(
            (Number(order.total_amount || 0) -
              Number(order.shipping_fee || 0) +
              Number(order.discount_amount || 0)) /
              totalItemsQty,
          ),
        )
      : 0;

  const subtotal =
    (order.items || []).reduce(
      (sum, item) =>
        sum +
        Number(item.unit_price || item.price || fallbackPerItem) *
          Number(item.quantity || 1),
      0,
    ) ||
    Math.max(
      0,
      Number(order.total_amount || 0) -
        Number(order.shipping_fee || 0) +
        Number(order.discount_amount || 0),
    );
  const discountAmount = Number(order.discount_amount || 0);
  const shippingFee = Number(order.shipping_fee || 0);

  return (
    <div className="admin-detail-wrapper">
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* TOP HEADER */}
      <div className="admin-detail-header no-print">
        <div className="admin-detail-header__left">
          <Link href="/admin/revenue" className="admin-detail-back-btn">
            <ArrowLeft size={18} />
            <span>Quản lý Doanh thu</span>
          </Link>
          <div className="admin-detail-title-row">
            <h1 className="admin-detail-code">
              #{order.order_code}
            </h1>
            <button
              className="admin-detail-copy-btn"
              onClick={() => copyToClipboard(order.order_code, "code")}
              title="Sao chép mã đơn"
            >
              {copiedKey === "code" ? (
                <Check size={14} color="#10b981" />
              ) : (
                <Copy size={14} />
              )}
            </button>
            <span className={`admin-detail-badge admin-detail-badge--${order.status}`}>
              {order.status === "pending" && (order.payment_method === "vietqr" ? "Chờ VietQR" : "Chờ đóng gói")}
              {order.status === "paid" && "Đã thanh toán (Chờ giao)"}
              {order.status === "shipping" && "Đang giao hàng"}
              {order.status === "completed" && "Hoàn tất"}
              {order.status === "cancelled" && "Đã hủy"}
            </span>
          </div>
          <p className="admin-detail-date">
            Đặt ngày: {new Date(order.created_at).toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="admin-detail-header__actions">
          <button
            className="btn btn-outline admin-detail-btn-print"
            onClick={handlePrint}
            title="In phiếu giao hàng (A5/A6)"
          >
            <Printer size={16} /> <span>In Vận Đơn</span>
          </button>

          {/* QUICK ADMIN ACTIONS */}
          {order.status === "pending" && order.payment_method === "cod" && (
            <button
              className="btn btn-primary"
              onClick={() => handleUpdateStatus("shipping")}
              disabled={actionLoading}
            >
              <Truck size={16} /> <span>Giao Hàng</span>
            </button>
          )}

          {order.status === "paid" && (
            <button
              className="btn btn-primary"
              onClick={() => handleUpdateStatus("shipping")}
              disabled={actionLoading}
            >
              <Truck size={16} /> <span>Giao Hàng</span>
            </button>
          )}

          {order.status === "shipping" && (
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus("completed")}
              disabled={actionLoading}
            >
              <CheckCircle size={16} /> <span>Hoàn Tất Đơn</span>
            </button>
          )}

          {!["completed", "cancelled"].includes(order.status) && (
            <button
              className="btn btn-danger-outline"
              onClick={() => setCancelModal({ type: "admin_cancel" })}
              disabled={actionLoading}
            >
              <XCircle size={16} /> <span>Hủy Đơn</span>
            </button>
          )}
        </div>
      </div>

      {/* CANCEL REQUEST ALERT (IF ANY) */}
      {isPendingCancel && (
        <div className="admin-cancel-alert no-print">
          <div className="admin-cancel-alert__icon">
            <AlertTriangle size={24} color="#d97706" />
          </div>
          <div className="admin-cancel-alert__content">
            <div className="admin-cancel-alert__title">
              Khách hàng yêu cầu hủy đơn & hoàn tiền
            </div>
            <p className="admin-cancel-alert__desc">
              <strong>Lý do:</strong> {order.cancel_reason || "Khách muốn hủy"}
            </p>
            {order.refund_bank_info && (
              <div className="admin-cancel-alert__bank">
                <strong>STK Hoàn Tiền:</strong> {order.refund_bank_info}
                <button
                  className="admin-detail-copy-btn"
                  onClick={() => copyToClipboard(order.refund_bank_info, "bank")}
                >
                  {copiedKey === "bank" ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                </button>
              </div>
            )}
          </div>
          <div className="admin-cancel-alert__actions">
            <button
              className="btn btn-success"
              onClick={() => setCancelModal({ type: "approve" })}
              disabled={actionLoading}
            >
              Duyệt & Hoàn
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setCancelModal({ type: "reject" })}
              disabled={actionLoading}
            >
              Từ Chối
            </button>
          </div>
        </div>
      )}

      {/* STEPPER PROGRESS */}
      {!isCancelled ? (
        <div className="admin-detail-card admin-detail-stepper no-print">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = s.done;
            const isActive = s.active;
            return (
              <div
                key={s.key}
                className={`admin-step-item ${isDone ? "is-done" : ""} ${
                  isActive ? "is-active" : ""
                }`}
              >
                <div className="admin-step-circle">
                  <Icon size={16} />
                </div>
                <span className="admin-step-label">{s.label}</span>
                {idx < steps.length - 1 && <div className="admin-step-line" />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="admin-detail-card admin-cancelled-banner no-print">
          <XCircle size={20} color="#ef4444" />
          <div>
            <strong>Đơn hàng này đã bị hủy</strong>
            {order.cancel_reason && <p>Lý do: {order.cancel_reason}</p>}
          </div>
        </div>
      )}

      {/* MAIN 2-COLUMN GRID */}
      <div className="admin-detail-grid">
        {/* LEFT COLUMN: PRODUCTS & BILL */}
        <div className="admin-detail-grid__main">
          {/* ITEMS CARD */}
          <div className="admin-detail-card">
            <div className="admin-card-title">
              <Package size={18} />
              <span>Kiện Hàng / Sản Phẩm ({order.items?.length || 0})</span>
            </div>

            <div className="admin-items-list">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="admin-item-row">
                  <div className="admin-item-thumb">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="admin-item-img"
                      />
                    ) : (
                      <div className="admin-item-noimg">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="admin-item-info">
                    <h3 className="admin-item-name">{item.name || "Sản phẩm VinaTap"}</h3>
                    <div className="admin-item-meta">
                      <span>Đơn giá: {formatVND(item.unit_price || item.price || fallbackPerItem)}</span>
                      <span>x {item.quantity || 1}</span>
                    </div>
                  </div>
                  <div className="admin-item-total">
                    {formatVND(
                      Number(item.unit_price || item.price || fallbackPerItem) *
                        Number(item.quantity || 1),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {order.note && (
              <div className="admin-order-note">
                <strong>Ghi chú từ khách:</strong> {order.note}
              </div>
            )}
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="admin-detail-card">
            <div className="admin-card-title">
              <CreditCard size={18} />
              <span>Chi Tiết Thanh Toán</span>
            </div>
            <div className="admin-summary-table">
              <div className="admin-summary-row">
                <span>Tạm tính tiền hàng:</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="admin-summary-row is-discount">
                  <span>Giảm giá Voucher ({order.voucher_code || "VNT"}):</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="admin-summary-row">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
              </div>
              <div className="admin-summary-row is-total">
                <span>Tổng Thanh Toán:</span>
                <span className="admin-total-val">{formatVND(order.total_amount)}</span>
              </div>
              <div className="admin-payment-method-pill">
                {order.payment_method === "vietqr" ? (
                  <span className="pill-vietqr">
                    <QrCode size={14} /> Chuyển khoản VietQR
                  </span>
                ) : (
                  <span className="pill-cod">
                    <Truck size={14} /> Thanh toán khi nhận hàng (COD)
                  </span>
                )}
                {order.paid_at && (
                  <span className="pill-paid-time">
                    <ShieldCheck size={14} color="#10b981" /> Đã xác nhận lúc{" "}
                    {new Date(order.paid_at).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECIPIENT & SHIPPING */}
        <div className="admin-detail-grid__side">
          {/* CUSTOMER & RECIPIENT */}
          <div className="admin-detail-card">
            <div className="admin-card-title">
              <User size={18} />
              <span>Thông Tin Người Nhận</span>
            </div>
            <div className="admin-info-block">
              <div className="admin-info-item">
                <span className="admin-info-label">Khách hàng:</span>
                <strong className="admin-info-val">
                  {order.recipient_name || "Khách VinaTap"}
                </strong>
              </div>
              <div className="admin-info-item">
                <span className="admin-info-label">Điện thoại:</span>
                <div className="admin-info-val-row">
                  <strong className="admin-info-val">{order.recipient_phone}</strong>
                  <button
                    className="admin-detail-copy-btn"
                    onClick={() => copyToClipboard(order.recipient_phone, "phone")}
                    title="Sao chép SĐT"
                  >
                    {copiedKey === "phone" ? (
                      <Check size={12} color="#10b981" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
              <div className="admin-info-item">
                <span className="admin-info-label">Địa chỉ giao:</span>
                <div className="admin-info-val admin-info-address">
                  <MapPin size={14} className="address-icon" />
                  <span>{order.shipping_address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHIPPING & PACKING SLIP HELPER */}
          <div className="admin-detail-card no-print">
            <div className="admin-card-title">
              <Truck size={18} />
              <span>Thao Tác Đóng Gói</span>
            </div>
            <p className="admin-packing-desc">
              In phiếu xuất kho dán mặt thùng hàng hoặc lưu vết giao nhận bưu cục.
            </p>
            <button
              className="btn btn-outline btn-block"
              onClick={handlePrint}
            >
              <Printer size={16} /> In Phiếu Xuất Kho & Vận Đơn
            </button>
          </div>
        </div>
      </div>

      {/* 🖨️ PRINT ONLY BILL / SHIPPING SLIP TEMPLATE */}
      <div className="admin-print-bill print-only">
        <div className="print-header">
          <div className="print-logo">VINATAP — SHOP ONLINE</div>
          <div className="print-type">PHIẾU ĐÓNG GÓI & GIAO HÀNG</div>
        </div>
        <div className="print-divider" />
        <div className="print-meta">
          <div><strong>Mã đơn:</strong> #{order.order_code}</div>
          <div><strong>Ngày đặt:</strong> {new Date(order.created_at).toLocaleString("vi-VN")}</div>
          <div><strong>PTTT:</strong> {order.payment_method === "vietqr" ? "Đã thanh toán VietQR" : "Thu tiền COD"}</div>
        </div>
        <div className="print-divider" />
        <div className="print-recipient">
          <div><strong>Người nhận:</strong> {order.recipient_name} — {order.recipient_phone}</div>
          <div><strong>Địa chỉ:</strong> {order.shipping_address}</div>
          {order.note && <div><strong>Ghi chú:</strong> {order.note}</div>}
        </div>
        <div className="print-divider" />
        <table className="print-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Sản Phẩm</th>
              <th>SL</th>
              <th>Đơn Giá</th>
              <th>Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{formatVND(item.unit_price)}</td>
                <td>{formatVND(Number(item.unit_price) * Number(item.quantity))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="print-divider" />
        <div className="print-total">
          <div><strong>Tổng thanh toán:</strong> {formatVND(order.total_amount)}</div>
        </div>
        <div className="print-footer">
          <p>Cảm ơn quý khách đã tin tưởng VinaTap Heritage!</p>
          <p>Hotline hỗ trợ: 0912 345 678 | Website: vinatap.com</p>
        </div>
      </div>

      {/* MODAL CANCEL / REVIEW */}
      {cancelModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            {cancelModal.type === "approve" && (
              <>
                <h3 className="admin-modal-title">Xác nhận Duyệt Yêu Cầu Hủy?</h3>
                <p className="admin-modal-desc">
                  Bạn có chắc chắn muốn duyệt hủy đơn <strong>#{order.order_code}</strong>?
                  {order.refund_bank_info && (
                    <span className="admin-modal-bank-note">
                      Vui lòng đảm bảo bạn đã thực hiện chuyển tiền hoàn về STK:{" "}
                      <strong>{order.refund_bank_info}</strong>.
                    </span>
                  )}
                </p>
                <div className="admin-modal-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => setCancelModal(null)}
                    disabled={actionLoading}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleReviewCancel("approve")}
                    disabled={actionLoading}
                  >
                    Xác nhận Duyệt & Hoàn
                  </button>
                </div>
              </>
            )}

            {cancelModal.type === "reject" && (
              <>
                <h3 className="admin-modal-title">Từ Chối Yêu Cầu Hủy Đơn</h3>
                <p className="admin-modal-desc">
                  Nhập lý do từ chối để thông báo cho khách hàng:
                </p>
                <textarea
                  className="admin-modal-textarea"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
                <div className="admin-modal-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => setCancelModal(null)}
                    disabled={actionLoading}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReviewCancel("reject")}
                    disabled={actionLoading}
                  >
                    Gửi Từ Chối
                  </button>
                </div>
              </>
            )}

            {cancelModal.type === "admin_cancel" && (
              <>
                <h3 className="admin-modal-title">Hủy Đơn Hàng (Admin)</h3>
                <p className="admin-modal-desc">
                  Chọn lý do hủy đơn <strong>#{order.order_code}</strong>:
                </p>
                <select
                  className="admin-modal-select"
                  value={adminCancelReason}
                  onChange={(e) => setAdminCancelReason(e.target.value)}
                >
                  <option value="Hết hàng trong kho">Hết hàng trong kho</option>
                  <option value="Khách gọi điện yêu cầu hủy trực tiếp">
                    Khách gọi điện yêu cầu hủy trực tiếp
                  </option>
                  <option value="Không liên hệ được khách hàng xác nhận">
                    Không liên hệ được khách hàng xác nhận
                  </option>
                  <option value="Địa chỉ giao hàng không hợp lệ">
                    Địa chỉ giao hàng không hợp lệ
                  </option>
                </select>
                <div className="admin-modal-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => setCancelModal(null)}
                    disabled={actionLoading}
                  >
                    Đóng
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleAdminCancel}
                    disabled={actionLoading}
                  >
                    Xác Nhận Hủy Đơn
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
