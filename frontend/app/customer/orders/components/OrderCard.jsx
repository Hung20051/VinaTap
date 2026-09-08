"use client";

import { useRouter } from "next/navigation";
import { Store, ChevronRight, Truck, AlertTriangle } from "lucide-react";

export default function OrderCard({
  order,
  onDirectCancel,
  onRequestCancel,
}) {
  const router = useRouter();

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const getEstimatedDelivery = (createdAt) => {
    if (!createdAt) return "2 - 3 ngày tới";
    const date = new Date(createdAt);
    const fromDate = new Date(date);
    fromDate.setDate(date.getDate() + 2);
    const toDate = new Date(date);
    toDate.setDate(date.getDate() + 4);

    return `${fromDate.getDate()} tháng ${fromDate.getMonth() + 1} – ${toDate.getDate()} tháng ${toDate.getMonth() + 1}`;
  };

  const getStatusBadge = () => {
    const { status, payment_method, cancel_request_status } = order;

    if (cancel_request_status === "pending") {
      return (
        <span className="order-card-status-pill is-warning">
          ⚠️ Chờ duyệt hủy
        </span>
      );
    }

    switch (status) {
      case "pending":
        return (
          <span className="order-card-status-pill is-amber">
            📦 Đang chuẩn bị (COD)
          </span>
        );
      case "paid":
        return (
          <span className="order-card-status-pill is-green">
            ⚡ Đã thanh toán (Chờ giao)
          </span>
        );
      case "shipping":
        return (
          <span className="order-card-status-pill is-blue">
            🚚 Đang giao hàng
          </span>
        );
      case "completed":
        return (
          <span className="order-card-status-pill is-purple">
            🎉 Hoàn tất
          </span>
        );
      case "cancelled":
        return (
          <span className="order-card-status-pill is-gray">
            ❌ Đã hủy
          </span>
        );
      default:
        return <span className="order-card-status-pill">{status}</span>;
    }
  };

  const handleCardClick = () => {
    router.push(`/customer/orders/${order.id}`);
  };

  const items = Array.isArray(order.items)
    ? order.items
    : typeof order.items_json === "string"
      ? JSON.parse(order.items_json)
      : order.items_json || [];

  return (
    <div className="order-card-tiktok" onClick={handleCardClick}>
      {/* 1. Header: Store name & Status */}
      <div className="order-card-header">
        <div className="order-card-shop">
          <Store size={16} className="text-orange" />
          <span className="shop-name">VinaTap Craft Studio</span>
          <ChevronRight size={14} className="shop-arrow" />
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* 2. Dự kiến giao hàng banner */}
      {order.status !== "cancelled" && (
        <div className="order-card-est-delivery">
          <Truck size={15} className="truck-icon" />
          <span>
            Dự kiến giao: <strong>{getEstimatedDelivery(order.created_at)}</strong>
          </span>
        </div>
      )}

      {/* 3. Dòng sản phẩm (Clickable) */}
      <div className="order-card-items-list">
        {items.map((item, idx) => {
          const itemImg =
            item.image ||
            item.image_url ||
            item.thumbnail ||
            item.cover_url ||
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600";

          const itemName =
            item.name || item.title || item.product_name || "Thẻ Gỗ NFC Di Sản VinaTap";

          return (
            <div key={idx} className="order-card-item-row">
              <div className="item-thumbnail-box">
                <img
                  src={itemImg}
                  alt={itemName}
                  className="item-thumbnail-img"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600";
                  }}
                />
              </div>

              <div className="item-info-col">
                <h4 className="item-title">{itemName}</h4>
                <div className="item-variant-label">
                  {item.wood_type || item.variant || "Gỗ Khắc Laser Cao Cấp"}
                </div>
              </div>

              <div className="item-price-col">
                <div className="item-price">
                  {formatMoney(item.unit_price || item.price)}
                </div>
                <div className="item-qty">x{item.quantity || 1}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Footer: Tổng tiền & Nút hành động */}
      <div className="order-card-footer">
        <div className="order-card-total-box">
          <span className="total-label">Tổng:</span>
          <span className="total-amount">
            {formatMoney(order.total_amount)}
          </span>
        </div>

        <div className="order-card-actions-group">
          {/* Đơn COD pending: Khách tự hủy */}
          {order.status === "pending" && order.payment_method === "cod" && (
            <button
              type="button"
              className="btn-tiktok-action is-cancel"
              onClick={(e) => {
                e.stopPropagation();
                onDirectCancel(order);
              }}
            >
              Hủy đơn hàng
            </button>
          )}

          {/* Đơn paid (VietQR): Khách gửi yêu cầu hủy & hoàn tiền */}
          {order.status === "paid" &&
            order.cancel_request_status !== "pending" && (
              <button
                type="button"
                className="btn-tiktok-action is-req-cancel"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestCancel(order);
                }}
              >
                ⚠️ Yêu cầu hủy & Hoàn tiền
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
