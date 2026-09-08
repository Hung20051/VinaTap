"use client";

import { useState } from "react";
import { X, AlertTriangle, Send } from "lucide-react";

export default function CancelModal({
  type = "direct", // "direct" (COD) or "request" (VietQR Paid)
  order,
  onClose,
  onConfirmDirect,
  onConfirmRequest,
  submitting = false,
}) {
  const [reason, setReason] = useState(
    type === "direct"
      ? "Đổi ý không muốn mua nữa"
      : "Đặt nhầm sản phẩm / thông tin",
  );
  const [customReason, setCustomReason] = useState("");
  const [bankInfo, setBankInfo] = useState("");

  if (!order) return null;

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const handleSubmit = () => {
    const finalReason = reason === "Khác" ? customReason : reason;
    if (type === "direct") {
      onConfirmDirect(order, finalReason);
    } else {
      if (!bankInfo.trim()) {
        alert("Vui lòng cung cấp thông tin tài khoản nhận hoàn tiền!");
        return;
      }
      onConfirmRequest(order, { reason: finalReason, bankInfo });
    }
  };

  return (
    <div className="cust-modal-overlay" onClick={onClose}>
      <div
        className="cust-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: type === "direct" ? "480px" : "520px" }}
      >
        <button className="cust-modal-close" onClick={onClose} title="Đóng">
          <X size={18} />
        </button>

        <div className="cust-modal-body">
          {type === "direct" ? (
            <>
              <div className="cust-modal-head">
                <div className="cust-modal-icon-badge danger">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="cust-modal-title">Xác Nhận Hủy Đơn Hàng</h3>
                  <p className="cust-modal-subtitle">
                    Mã đơn: <strong>#{order.order_code}</strong>
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#475569",
                  lineHeight: 1.5,
                  margin: "0 0 1.25rem",
                }}
              >
                Bạn có chắc chắn muốn hủy đơn hàng này? Mã giảm giá (nếu có) sẽ
                được tự động hoàn lại vào ví voucher của bạn ngay lập tức.
              </p>

              <div className="cust-modal-form-group">
                <label className="cust-modal-label">Lý do hủy đơn:</label>
                <select
                  className="cust-modal-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="Đổi ý không muốn mua nữa">
                    Đổi ý không muốn mua nữa
                  </option>
                  <option value="Muốn đổi tỉnh thành / sản phẩm khác">
                    Muốn đổi tỉnh thành / sản phẩm khác
                  </option>
                  <option value="Đặt nhầm số lượng / thông tin nhận hàng">
                    Đặt nhầm số lượng / thông tin nhận hàng
                  </option>
                  <option value="Thời gian giao hàng không phù hợp">
                    Thời gian giao hàng không phù hợp
                  </option>
                  <option value="Khác">Lý do khác...</option>
                </select>

                {reason === "Khác" && (
                  <textarea
                    className="cust-modal-textarea"
                    placeholder="Nhập lý do cụ thể..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                    style={{ marginTop: "8px" }}
                  />
                )}
              </div>

              <div className="cust-modal-footer">
                <button
                  type="button"
                  className="cust-modal-btn-close"
                  onClick={onClose}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="cust-modal-btn-submit-danger"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Đang hủy..." : "Đồng Ý Hủy"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="cust-modal-head">
                <div className="cust-modal-icon-badge warning">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="cust-modal-title">Yêu Cầu Hủy & Hoàn Tiền</h3>
                  <p className="cust-modal-subtitle">
                    Đơn hàng: <strong>#{order.order_code}</strong> (Đã thanh
                    toán {formatMoney(order.total_amount)})
                  </p>
                </div>
              </div>

              <div className="cust-modal-alert info-green">
                💡 Sau khi nhận yêu cầu, Admin VinaTap sẽ kiểm tra tiến độ gia
                công xưởng mộc và chuyển khoản hoàn lại 100% tiền qua tài khoản
                của bạn trong vòng 24h.
              </div>

              <div className="cust-modal-form-group">
                <label className="cust-modal-label">Lý do xin hủy đơn:</label>
                <select
                  className="cust-modal-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="Đặt nhầm sản phẩm / thông tin">
                    Đặt nhầm sản phẩm / thông tin
                  </option>
                  <option value="Đổi ý không muốn mua nữa">
                    Đổi ý không muốn mua nữa
                  </option>
                  <option value="Thay đổi địa chỉ / kế hoạch du lịch">
                    Thay đổi địa chỉ / kế hoạch du lịch
                  </option>
                  <option value="Khác">Lý do khác...</option>
                </select>

                {reason === "Khác" && (
                  <textarea
                    className="cust-modal-textarea"
                    placeholder="Mô tả chi tiết lý do..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={2}
                    style={{ marginTop: "8px" }}
                  />
                )}
              </div>

              <div
                className="cust-modal-form-group"
                style={{ marginBottom: "1.25rem" }}
              >
                <label className="cust-modal-label">
                  Thông tin ngân hàng nhận hoàn tiền:{" "}
                  <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  className="cust-modal-input"
                  placeholder="Ví dụ: MBBank - 0987654321 - NGUYEN VAN A"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                />
              </div>

              <div className="cust-modal-footer">
                <button
                  type="button"
                  className="cust-modal-btn-close"
                  onClick={onClose}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="cust-modal-btn-submit-orange"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Đang gửi..." : "Gửi Yêu Cầu Hủy"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
