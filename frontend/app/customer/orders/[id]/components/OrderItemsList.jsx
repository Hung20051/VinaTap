"use client";

import Link from "next/link";
import { Store, ChevronRight, ShieldCheck, RefreshCcw } from "lucide-react";

export default function OrderItemsList({ order }) {
  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const items = Array.isArray(order.items)
    ? order.items
    : typeof order.items_json === "string"
      ? JSON.parse(order.items_json)
      : order.items_json || [];

  const totalItemsQty = items.reduce(
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

  return (
    <div className="order-detail-card">
      {/* Header Store */}
      <div className="detail-shop-header">
        <div className="shop-title-wrap">
          <Store size={18} className="text-orange" />
          <span className="shop-title">VinaTap Craft Studio</span>
        </div>
        <Link href="/shop" className="shop-visit-link">
          <span>Lướt xem cửa hàng</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Items list */}
      <div className="detail-items-container">
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
            <div key={idx} className="detail-item-card">
              <div className="detail-item-thumb">
                <img
                  src={itemImg}
                  alt={itemName}
                  className="detail-item-img"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600";
                  }}
                />
              </div>

              <div className="detail-item-main">
                <h4 className="detail-item-name">{itemName}</h4>
                <div className="detail-item-meta">
                  Phân loại:{" "}
                  <strong>{item.wood_type || item.variant || "Gỗ Khắc Laser Cao Cấp"}</strong>
                </div>

                <div className="detail-item-badges">
                  <span className="item-badge is-return">
                    <RefreshCcw size={11} /> Đổi ý 7 ngày
                  </span>
                  <span className="item-badge is-warranty">
                    <ShieldCheck size={11} /> Bảo hành NFC 10 năm
                  </span>
                </div>
              </div>

              <div className="detail-item-price-col">
                <div className="detail-item-price">
                  {formatMoney(item.unit_price || item.price || fallbackPerItem)}
                </div>
                <div className="detail-item-qty">x{item.quantity || 1}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
