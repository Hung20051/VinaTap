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
import { orderAPI, voucherAPI, shippingAPI, systemSettingAPI } from "@/lib/api";
import { getUser } from "@/lib/auth";
import "./CheckoutModal.css";

// 🏧 CẤU HÌNH NGÂN HÀNG — Luôn lấy từ Cài đặt hệ thống (systemSettingAPI).
// Tự động sử dụng cấu hình mặc định chính thức nếu hệ thống chưa cài đặt hoặc mạng chậm.
const OFFICIAL_DEFAULT_BANK_CONFIG = {
  bankId: "MBBANK",
  bankName: "MBBank (NH Quân Đội)",
  accountNo: "0813607311",
  accountName: "VINATAP VIETNAM CO LTD",
};

export default function CheckoutModal({
  items = [],
  initialVoucher = "",
  shippingRule = null,
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
  const [shipRule, setShipRule] = useState(
    shippingRule || { base_fee: 30000, free_shipping_threshold: 500000 },
  );
  const [bankConfig, setBankConfig] = useState(OFFICIAL_DEFAULT_BANK_CONFIG);
  const [bankLoading, setBankLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [checkingManual, setCheckingManual] = useState(false);

  useEffect(() => {
    // 👤 TỰ ĐỘNG ĐIỀN THÔNG TIN TÀI KHOẢN NẾU ĐÃ CÓ TRONG SETTING
    const u = getUser();
    if (u) {
      setShippingInfo({
        name: u.name || "",
        phone: u.phone || "",
        address: u.address || "",
        note: "",
      });
    }

    // 🏧 LẤY CẤU HÌNH NGÂN HÀNG MỚI NHẤT TỪ HỆ THỐNG
    systemSettingAPI
      .get()
      .then((res) => {
        if (res && res.settings) {
          const s = res.settings;
          setBankConfig({
            bankId: s.bank_id || OFFICIAL_DEFAULT_BANK_CONFIG.bankId,
            bankName: s.bank_name || OFFICIAL_DEFAULT_BANK_CONFIG.bankName,
            accountNo: s.bank_account_no || OFFICIAL_DEFAULT_BANK_CONFIG.accountNo,
            accountName: s.bank_account_name || OFFICIAL_DEFAULT_BANK_CONFIG.accountName,
          });
        }
      })
      .catch(() => {
        setBankConfig(OFFICIAL_DEFAULT_BANK_CONFIG);
      })
      .finally(() => setBankLoading(false));

    voucherAPI
      .getMyWallet()
      .then((data) => setWalletVouchers(data.myVouchers || []))
      .catch(() => setWalletVouchers([]));

    if (shippingRule) {
      setShipRule(shippingRule);
    } else {
      shippingAPI
        .getPublic()
        .then((res) => {
          if (res && res.rule) {
            setShipRule({
              base_fee: Number(res.rule.base_fee || 30000),
              free_shipping_threshold: Number(
                res.rule.free_shipping_threshold || 500000,
              ),
            });
          }
        })
        .catch(() => {});
    }
  }, [shippingRule]);

  // 🔄 AUTO POLLING KIỂM TRA CHUYỂN KHOẢN TỰ ĐỘNG TỪ VIETQR (Tối đa 5 phút ~ 100 lần)
  useEffect(() => {
    if (
      !createdOrder ||
      createdOrder.payment_method !== "vietqr" ||
      isPaymentVerified
    )
      return;

    let pollCount = 0;
    const maxPolls = 100; // 5 phút

    const interval = setInterval(async () => {
      pollCount += 1;
      if (pollCount >= maxPolls) {
        setPollingTimedOut(true);
        clearInterval(interval);
        return;
      }

      try {
        const res = await orderAPI.checkStatus(createdOrder.order_code);
        if (
          res &&
          (res.status === "paid" ||
            res.status === "processing" ||
            res.status === "completed")
        ) {
          setIsPaymentVerified(true);
          clearInterval(interval);

          // Tự động đóng popup sau 2.5s ăn mừng
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 2500);
        }
      } catch (err) {
        // Bỏ qua lỗi tạm thời khi polling (như mạng chập chờn hoặc rate limit)
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [createdOrder, isPaymentVerified]);

  const handleManualRecheck = async () => {
    if (!createdOrder || checkingManual) return;
    setCheckingManual(true);
    try {
      const res = await orderAPI.checkStatus(createdOrder.order_code);
      if (
        res &&
        (res.status === "paid" ||
          res.status === "processing" ||
          res.status === "completed")
      ) {
        setIsPaymentVerified(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2500);
      } else {
        alert(
          "Hệ thống chưa ghi nhận thanh toán. Nếu bạn đã chuyển khoản, vui lòng chờ 1-2 phút rồi kiểm tra lại!",
        );
      }
    } catch (err) {
      alert(
        "Không thể kiểm tra trạng thái đơn hàng: " +
          (err.message || "Lỗi kết nối"),
      );
    } finally {
      setCheckingManual(false);
    }
  };

  // Tính nhẩm xem trước tổng tiền ở Frontend (Backend vẫn sẽ kiểm tra lại 100%)
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 150000) * (item.quantity || 1),
    0,
  );

  let discount = 0;
  let isFreeshipVoucher = false;
  const cleanV = voucherCode.trim().toUpperCase();

  if (cleanV) {
    // 🎟️ Tìm Voucher chính xác trong Ví để tính tiền theo đúng Loại giảm giá (Percent / Amount / Freeship)
    const selectedVoucher = walletVouchers.find(
      (v) => (v.code || "").trim().toUpperCase() === cleanV,
    );

    if (selectedVoucher) {
      if (selectedVoucher.discount_type === "freeship") {
        isFreeshipVoucher = true;
        discount = 0;
      } else if (selectedVoucher.discount_type === "percent") {
        discount = Math.round(
          subtotal * (Number(selectedVoucher.discount_value || 0) / 100),
        );
        if (selectedVoucher.max_discount_amount) {
          discount = Math.min(
            discount,
            Number(selectedVoucher.max_discount_amount),
          );
        }
      } else if (selectedVoucher.discount_type === "amount") {
        discount = Number(selectedVoucher.discount_value || 0);
      }
    }
  }

  discount = Math.min(discount, subtotal);
  const baseFee = Number(shipRule?.base_fee ?? 30000);
  const freeThreshold = Number(shipRule?.free_shipping_threshold ?? 500000);
  const shippingFee =
    subtotal >= freeThreshold || isFreeshipVoucher ? 0 : baseFee;
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
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      console.warn("Clipboard access not available:", e);
    }
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
              <div className="checkout-badge-row">
                <span className="checkout-items-chip">
                  📦 {items.length} sản phẩm ({formatMoney(subtotal)})
                </span>
              </div>
              <h3 className="checkout-title">Xác Nhận &amp; Thanh Toán</h3>
            </div>

            {errorMsg && (
              <div className="checkout-error-banner">
                <AlertCircle size={17} />
                <span>{errorMsg}</span>
              </div>
            )}

            {paymentMethod === "vietqr" && !bankLoading && !bankConfig.accountNo && (
              <div className="checkout-error-banner is-warn">
                <AlertCircle size={17} />
                <span>Hệ thống VietQR đang bảo trì. Vui lòng chọn COD!</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="checkout-grid">
              {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
              <div className="checkout-col">
                <div className="checkout-section-hdr">
                  <span className="step-num">1</span>
                  <h4 className="section-title">Địa Chỉ Nhận Hàng</h4>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Họ và Tên *</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn An"
                      value={shippingInfo.name}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, name: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      placeholder="0912 345 678"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Địa Chỉ Chi Tiết *</label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi Chú Giao Hàng (Tùy chọn)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước..."
                    value={shippingInfo.note}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, note: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              {/* CỘT PHẢI: PTTT & XÁC NHẬN GIÁ */}
              <div className="checkout-col">
                <div className="checkout-section-hdr">
                  <span className="step-num">2</span>
                  <h4 className="section-title">Hình Thức Thanh Toán</h4>
                </div>

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
                      <QrCode size={18} />
                    </div>
                    <div className="pm-text">
                      <div className="pm-title-row">
                        <strong>Quét VietQR</strong>
                      </div>
                      <span className="pm-sub">Khớp tiền tự động</span>
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
                      <Truck size={18} />
                    </div>
                    <div className="pm-text">
                      <div className="pm-title-row">
                        <strong>Thanh toán COD</strong>
                      </div>
                      <span className="pm-sub">Tiền mặt khi nhận</span>
                    </div>
                  </label>
                </div>

                <div className="voucher-section">
                  <label className="voucher-lbl">
                    <Ticket size={14} /> Mã Voucher Ví Của Bạn:
                  </label>
                  <select
                    className="voucher-select"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  >
                    <option value="">-- Không sử dụng Voucher --</option>
                    {walletVouchers.map((v) => (
                      <option key={v.code} value={v.code}>
                        🎟️ {v.code} ({v.title} - {v.discountText})
                      </option>
                    ))}
                  </select>
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
                    <span>TỔNG THANH TOÁN:</span>
                    <strong className="final-price">
                      {formatMoney(totalAmount)}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-submit-order"
                  disabled={
                    submitting ||
                    (paymentMethod === "vietqr" && (bankLoading || !bankConfig.accountNo))
                  }
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Đang Tạo Đơn Hàng...
                    </>
                  ) : (
                    <>
                      <span>Xác Nhận Đặt Hàng</span>
                      <strong>{formatMoney(totalAmount)} ➔</strong>
                    </>
                  )}
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
                      src={`https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.png?amount=${createdOrder.total_amount}&addInfo=${createdOrder.order_code}&accountName=${encodeURIComponent(bankConfig.accountName)}`}
                      alt="Mã QR Chuyển Khoản VinaTap"
                      className="vietqr-img"
                    />
                  </div>
                </div>

                <div className="vietqr-right">
                  <div className="bank-info-card">
                    <div className="bank-info-row">
                      <span className="label">Ngân hàng:</span>
                      <strong>{bankConfig.bankName}</strong>
                    </div>
                    <div className="bank-info-row">
                      <span className="label">Số tài khoản:</span>
                      <div className="copy-wrap">
                        <strong>{bankConfig.accountNo}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(bankConfig.accountNo, "stk")
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
                      <strong>{bankConfig.accountName}</strong>
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
                    ) : pollingTimedOut ? (
                      <div
                        className="payment-timeout-box"
                        style={{ textAlign: "center", marginTop: "10px" }}
                      >
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#64748b",
                            marginBottom: "8px",
                          }}
                        >
                          Đã tạm dừng tự động kiểm tra để tiết kiệm dữ liệu.
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleManualRecheck}
                          disabled={checkingManual}
                          style={{
                            background: "#0284c7",
                            color: "#fff",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {checkingManual
                            ? "Đang kiểm tra..."
                            : "🔄 Kiểm tra lại trạng thái"}
                        </button>
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
