"use client";

import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import "./CartModal.css";

export default function CartModal({ cart = [], onUpdateQuantity, onRemoveItem, onClearCart, onClose, onCheckout }) {
  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="cart-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="cart-modal-header">
          <div className="cart-h-icon">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h3>🛒 Giỏ Hàng Của Bạn ({cart.length} sản phẩm)</h3>
            <p className="text-muted">Quản lý danh sách thẻ NFC đã chọn mua</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty-box">
            <p>Giỏ hàng của bạn đang trống.</p>
            <button className="btn-continue-shop" onClick={onClose}>
              Khám Phá Cửa Hàng
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map((item, idx) => (
                <div key={idx} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <strong className="cart-item-name">{item.name}</strong>
                    {item.selectedProvince && (
                      <span className="cart-item-province">
                        📍 Tỉnh thành: <strong>{item.selectedProvince}</strong>
                      </span>
                    )}
                    <span className="cart-item-price">{formatMoney(item.price)}</span>
                  </div>

                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(idx, -1)}
                      className="btn-qty"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(idx, 1)}
                      className="btn-qty"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <strong>{formatMoney(item.price * item.quantity)}</strong>
                    <button
                      type="button"
                      className="btn-trash"
                      onClick={() => onRemoveItem(idx)}
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-modal-footer">
              <button className="btn-clear-all" onClick={onClearCart}>
                <Trash2 size={15} /> Xóa Tất Cả
              </button>

              <div className="cart-footer-right">
                <div className="cart-total-text">
                  <span>Tổng cộng:</span>
                  <strong>{formatMoney(subtotal)}</strong>
                </div>

                <button
                  className="btn-cart-checkout"
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                >
                  Thanh Toán Ngay <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
