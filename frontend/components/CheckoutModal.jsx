"use client";

import { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Truck,
  Ticket,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  QrCode,
  Loader2,
} from "lucide-react";
import { orderAPI, voucherAPI } from "../lib/api";
import "./CheckoutModal.css";

// 🏧 CẤU HÌNH NGÂN HÀNG CỦA BẠN ĐỂ NHẬN TIỀN THANH TOÁN VIETQR
export const BANK_CONFIG = {
  bankId: "MBBANK", // Mã NH: MBBANK, VCB, TCB, VPB, ACB, CTG, BIDV, STB, TPB...
  bankName: "MBBank (NH Quân Đội)", // Tên ngân hàng hiển thị
  accountNo: "0813607311", // 👉 SỐ TÀI KHOẢN CỦA BẠN
  accountName: "VINATAP VIETNAM CO LTD", // 👉 TÊN CHỦ TÀI KHOẢN CỦA BẠN
};

export default function CheckoutModal({
  items = [],
  initialVoucher = "",
  onClose,
  onSuccess,
}) {
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("vietqr"); // 'vietqr' | 'cod'
  const [voucherCode, setVoucherCode] = useState(initialVoucher || "");
  const [walletVouchers, setWalletVouchers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);

  useEffect(() => {
    voucherAPI
      .getMyWallet()
      .then((data) => setWalletVouchers(data.myVouchers || []))
      .catch(() => setWalletVouchers([]));
  }, []);

  // 🔄 AUTO POLLING KIỂM TRA CHUYỂN KHOẢN TỰ ĐỘNG TỪ VIETQR MỖI 3 GIÂY
  useEffect(() => {
    if (!createdOrder || createdOrder.payment_method !== "vietqr" || isPaymentVerified) return;

    const interval = setInterval(async () => {
      try {
        const res = await orderAPI.checkStatus(createdOrder.order_code);
        if (res && (res.status === "paid" || res.status === "processing" || res.status === "completed")) {
          setIsPaymentVerified(true);
          clearInterval(interval);

          // Tự động đóng popup sau 2.5s ăn mừng
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 2500);
        }
      } catch (err) {
        console.error("Auto polling status error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [createdOrder, isPaymentVerified]);

  // Tính nhẩm xem trước tổng tiền ở Frontend (Backend vẫn sẽ kiểm tra lại 100%)
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 150000) * (item.quantity || 1),
    0,
  );

  let discount = 0;
  let isFreeshipVoucher = false;
  const cleanV = voucherCode.trim().toUpperCase();

  if (cleanV) {
    if (cleanV.includes("SHIP") || cleanV.includes("FREESHIP")) {
      isFreeshipVoucher = true;
      discount = 0;
    } else if (cleanV.includes("VINATAP2026") || cleanV.includes("20")) {
      discount = Math.round(subtotal * 0.2);
    } else if (cleanV.includes("50") || cleanV.includes("VIP")) {
      discount = Math.round(subtotal * 0.5);
    } else {
      discount = 30000;
    }
  }

  discount = Math.min(discount, subtotal);
  const shippingFee = subtotal >= 500000 || isFreeshipVoucher ? 0 : 30000;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!shippingInfo.name.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên người nhận");
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(shippingInfo.phone.trim())) {
      setErrorMsg(
        "Số điện thoại không hợp lệ (Phải đúng 10 số di động Việt Nam)",
      );
      return;
    }

    if (
      !shippingInfo.address.trim() ||
      shippingInfo.address.trim().length < 5
    ) {
      setErrorMsg("Địa chỉ giao hàng quá ngắn (Tối thiểu 5 ký tự)");
      return;
    }

    setSubmitting(true);

    try {
      const res = await orderAPI.create({
        items: items.map((i) => ({
          product_id: i.id || null,
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
        })),
        shippingInfo,
        voucherCode,
        paymentMethod,
        note: shippingInfo.note,
      });

      if (res.order) {
        setCreatedOrder(res.order);
        if (onSuccess) onSuccess(res.order);
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setErrorMsg(err.message || "Không thể tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {!createdOrder ? (
          /* FORM ĐẶT HÀNG */
          <div className="checkout-form-body">
            <div className="checkout-header">
              <h3>🛍️ Thanh Toán Đơn Hàng VinaTap</h3>
              <p className="text-muted">
                Điền thông tin nhận thẻ NFC — Bảo mật 100% 🔒
              </p>
            </div>

            {errorMsg && (
              <div className="checkout-error-banner">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="checkout-grid">
              {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
              <div className="checkout-col">
                <h4 className="section-title">1. Thông Tin Nhận Thẻ NFC</h4>

                <div className="form-group">
                  <label>Họ và Tên người nhận *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={shippingInfo.name}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số Điện Thoại di động *</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0988888888"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Địa Chỉ Nhận Hàng Cụ Thể *</label>
                  <textarea
                    rows={2}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ghi Chú Đơn Hàng (Nếu có)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    value={shippingInfo.note}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, note: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* CỘT PHẢI: PTTT & XÁC NHẬN GIÁ */}
              <div className="checkout-col">
                <h4 className="section-title">2. Phương Thức Thanh Toán</h4>

                <div className="payment-method-selector">
                  <label
                    className={`pm-option ${paymentMethod === "vietqr" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="vietqr"
                      checked={paymentMethod === "vietqr"}
                      onChange={() => setPaymentMethod("vietqr")}
                    />
                    <div className="pm-icon icon-qr">
                      <QrCode size={20} />
                    </div>
                    <div className="pm-text">
                      <strong>Quét Mã VietQR Chuyển Khoản</strong>
                      <span>Tự động điền số tiền & nội dung VNT-...</span>
                    </div>
                  </label>

                  <label
                    className={`pm-option ${paymentMethod === "cod" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div className="pm-icon icon-cod">
                      <Truck size={20} />
                    </div>
                    <div className="pm-text">
                      <strong>COD — Thanh Toán Khi Nhận Hàng</strong>
                      <span>Thanh toán tiền mặt cho shipper</span>
                    </div>
                  </label>
                </div>

                <div className="voucher-section">
                  <label>Mã Giảm Giá Voucher (Trong Ví Của Bạn)</label>
                  <div className="voucher-input-group">
                    <Ticket size={16} className="v-icon" />
                    <input
                      type="text"
                      placeholder="Nhập mã (VD: VINATAP2026)"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                  </div>
                  {walletVouchers.length > 0 && (
                    <div style={{ marginTop: "6px" }}>
                      <select
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.82rem",
                          color: "#0f172a",
                        }}
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      >
                        <option value="">
                          -- Chọn Voucher Đã Có Trong Ví --
                        </option>
                        {walletVouchers.map((v) => (
                          <option key={v.code} value={v.code}>
                            🎟️ {v.code} ({v.title} - {v.discountText})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* BẢNG TÍNH TIỀN */}
                <div className="price-summary-box">
                  <div className="price-row">
                    <span>Tạm tính ({items.length} món):</span>
                    <strong>{formatMoney(subtotal)}</strong>
                  </div>
                  {discount > 0 && (
                    <div className="price-row text-green">
                      <span>Voucher giảm giá:</span>
                      <strong>-{formatMoney(discount)}</strong>
                    </div>
                  )}
                  <div className="price-row">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="badge-free">Miễn phí</span>
                      ) : (
                        formatMoney(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="price-row total-row">
                    <span>TỔNG THÀNH TIỀN:</span>
                    <strong className="final-price">
                      {formatMoney(totalAmount)}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-submit-order"
                  disabled={submitting}
                >
                  {submitting
                    ? "Đang Khởi Tạo Đơn Hàng..."
                    : "XÁC NHẬN ĐẶT HÀNG 🚀"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* MÀN HÌNH XÁC NHẬN & VIETQR CODE */
          <div className="checkout-success-body">
            <div className="success-badge">
              <CheckCircle size={44} className="text-green" />
              <h2>ĐẶT HÀNG THÀNH CÔNG!</h2>
              <p className="order-code-text">
                Mã đơn hàng của bạn: <code>{createdOrder.order_code}</code>
              </p>
            </div>


            {createdOrder.payment_method === "vietqr" ? (
              <div className="vietqr-payment-box">
                <div className="vietqr-left">
                  <h4 className="qr-title">Quét Mã VietQR Để Chuyển Khoản</h4>
                  <p className="qr-sub">
                    Mở App ngân hàng bất kỳ ➔ Quét mã QR ➔ Tự động điền số tiền
                  </p>

                  <div className="qr-image-wrap">
                    <img
                      src={`https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${createdOrder.total_amount}&addInfo=${createdOrder.order_code}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`}
                      alt="Mã QR Chuyển Khoản VinaTap"
                      className="vietqr-img"
                    />
                  </div>
                </div>

                <div className="vietqr-right">
                  <div className="bank-info-card">
                    <div className="bank-info-row">
                      <span className="label">Ngân hàng:</span>
                      <strong>{BANK_CONFIG.bankName}</strong>
                    </div>
                    <div className="bank-info-row">
                      <span className="label">Số tài khoản:</span>
                      <div className="copy-wrap">
                        <strong>{BANK_CONFIG.accountNo}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(BANK_CONFIG.accountNo, "stk")
                          }
                        >
                          {copiedText === "stk" ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bank-info-row">
                      <span className="label">Chủ tài khoản:</span>
                      <strong>{BANK_CONFIG.accountName}</strong>
                    </div>
                    <div className="bank-info-row">
                      <span className="label">Số tiền:</span>
                      <strong className="text-orange">
                        {formatMoney(createdOrder.total_amount)}
                      </strong>
                    </div>
                    <div className="bank-info-row">
                      <span className="label">Nội dung CK:</span>
                      <div className="copy-wrap highlight">
                        <code>{createdOrder.order_code}</code>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(createdOrder.order_code, "memo")
                          }
                        >
                          {copiedText === "memo" ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="success-actions">
                    {isPaymentVerified ? (
                      <div className="payment-verified-banner">
                        <CheckCircle size={22} className="verified-icon" />
                        <span>🎉 CHUYỂN KHOẢN THÀNH CÔNG!</span>
                      </div>
                    ) : (
                      <div className="payment-waiting-banner">
                        <Loader2 size={20} className="spin-icon" />
                        <span>Đang chờ xác nhận chuyển khoản...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="cod-success-box">
                <Truck size={48} className="text-blue" />
                <h4>Đơn hàng COD đang được xử lý</h4>
                <p>
                  Bộ phận kho VinaTap sẽ gọi điện xác nhận tới SĐT{" "}
                  <strong>{createdOrder.recipient_phone}</strong> và giao thẻ
                  NFC tới bạn trong 1-3 ngày tới.
                </p>

                <button className="btn-cod-done" onClick={onClose}>
                  Đã Hiểu & Xong
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
