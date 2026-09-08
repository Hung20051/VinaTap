"use client";

import { useState } from "react";
import { Copy, Check, CreditCard, Banknote, Tag } from "lucide-react";

export default function OrderPaymentSummary({ order }) {
  const [copied, setCopied] = useState(false);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(order.order_code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = order.order_code;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const discountAmount = Number(order.discount_amount) || 0;
  const totalAmount = Number(order.total_amount) || 0;
  const subtotal = totalAmount + discountAmount;

  return (
    <div className="order-detail-card">
      {/* 1. Mã đơn & Thời gian */}
      <div className="summary-meta-grid">
        <div className="summary-meta-row">
          <span className="summary-meta-label">Số đơn hàng:</span>
          <div className="summary-code-box">
            <span className="summary-code">{order.order_code}</span>
            <button
              type="button"
              className="btn-copy-code"
              onClick={copyCode}
              title="Sao chép mã"
            >
              {copied ? (
                <Check size={14} className="text-green" />
              ) : (
                <Copy size={14} />
              )}
              <span>{copied ? "Đã chép" : "Sao chép"}</span>
            </button>
          </div>
        </div>

        <div className="summary-meta-row">
          <span className="summary-meta-label">Thời gian đặt hàng:</span>
          <span className="summary-meta-val">
            {formatDateTime(order.created_at)}
          </span>
        </div>

        <div className="summary-meta-row">
          <span className="summary-meta-label">Phương thức thanh toán:</span>
          <div className="summary-payment-badge">
            {order.payment_method === "cod" ? (
              <>
                <Banknote size={15} className="text-amber" />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </>
            ) : (
              <>
                <CreditCard size={15} className="text-blue" />
                <span>Chuyển khoản VietQR</span>
              </>
            )}
          </div>
        </div>

        {order.voucher_code && (
          <div className="summary-meta-row">
            <span className="summary-meta-label">Mã giảm giá đã dùng:</span>
            <span className="voucher-applied-pill">
              <Tag size={12} /> {order.voucher_code}
            </span>
          </div>
        )}
      </div>

      <div className="summary-divider" />

      {/* 2. Bảng tính tiền */}
      <div className="pricing-rows-container">
        <div className="pricing-row">
          <span className="pricing-label">Tổng tiền hàng:</span>
          <span className="pricing-val">{formatMoney(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="pricing-row is-discount">
            <span className="pricing-label">Giảm giá voucher:</span>
            <span className="pricing-val">-{formatMoney(discountAmount)}</span>
          </div>
        )}

        <div className="pricing-row">
          <span className="pricing-label">Phí vận chuyển:</span>
          <span className="pricing-val free-ship">Miễn phí</span>
        </div>

        <div className="pricing-row is-total">
          <span className="total-main-label">Tổng thanh toán:</span>
          <span className="total-main-val">{formatMoney(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
