"use client";

import { MapPin, ShieldCheck, Clock } from "lucide-react";

export default function OrderShippingInfo({ order }) {
  const getEstimatedDelivery = (createdAt) => {
    if (!createdAt) return "2 - 3 ngày tới";
    const date = new Date(createdAt);
    const fromDate = new Date(date);
    fromDate.setDate(date.getDate() + 2);
    const toDate = new Date(date);
    toDate.setDate(date.getDate() + 4);

    return `${fromDate.getDate()} tháng ${fromDate.getMonth() + 1} – ${toDate.getDate()} tháng ${toDate.getMonth() + 1}`;
  };

  return (
    <div className="order-detail-card">
      {/* Cam kết giao hàng đúng hạn (TikTok style) */}
      <div className="delivery-guarantee-banner">
        <Clock size={16} className="guarantee-icon" />
        <div className="guarantee-text">
          <strong>Dự kiến giao hàng: {getEstimatedDelivery(order.created_at)}</strong>
          <p>
            VinaTap cam kết bọc lót chống sốc 3 lớp & bảo hiểm 100% hàng vỡ hỏng trong quá trình vận chuyển.
          </p>
        </div>
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className="shipping-address-row">
        <div className="address-pin-wrap">
          <MapPin size={20} />
        </div>
        <div className="address-content">
          <div className="recipient-head">
            <strong className="recipient-name">{order.recipient_name}</strong>
            <span className="recipient-phone">({order.recipient_phone})</span>
          </div>
          <p className="recipient-address">{order.shipping_address}</p>
          {order.note && (
            <div className="recipient-note">
              <span>Ghi chú:</span> <em>"{order.note}"</em>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
