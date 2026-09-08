"use client";

import Link from "next/link";
import { MessageSquare, ShoppingBag, XCircle, AlertTriangle } from "lucide-react";

export default function OrderActionFooter({
  order,
  onDirectCancel,
  onRequestCancel,
}) {
  const canDirectCancel =
    order.status === "pending" && order.payment_method === "cod";
  const canRequestCancel =
    order.status === "paid" && order.cancel_request_status !== "pending";

  return (
    <div className="order-detail-footer-sticky">
      <div className="footer-links-group">
        <Link href="/shop" className="footer-action-btn is-outline">
          <ShoppingBag size={15} />
          <span>Tiếp Tục Mua Sắm</span>
        </Link>
      </div>

      <div className="footer-buttons-group">
        {canDirectCancel && (
          <button
            type="button"
            className="footer-action-btn is-danger"
            onClick={onDirectCancel}
          >
            <XCircle size={15} />
            <span>Hủy Đơn Hàng</span>
          </button>
        )}

        {canRequestCancel && (
          <button
            type="button"
            className="footer-action-btn is-warning"
            onClick={onRequestCancel}
          >
            <AlertTriangle size={15} />
            <span>Yêu Cầu Hủy & Hoàn Tiền</span>
          </button>
        )}
      </div>
    </div>
  );
}
