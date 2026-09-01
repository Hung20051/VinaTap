"use client";

import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import "./CartModal.css";

export default function CartModal({
  isOpen = false,
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
  onCheckout,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

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
                <div key={idx} className="cart-item-card">
                  <div className="cart-item-img-wrap">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </div>
                  
                  <div className="cart-item-main">
                    <div className="cart-item-top">
                      <div className="cart-item-name-box">
                        <h4 className="cart-item-name">{item.name}</h4>
                        {item.selectedProvince && (
                          <span className="cart-item-province">
                            📍 {item.selectedProvince}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-trash"
                        onClick={() => onRemoveItem(idx)}
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-item-price-wrap">
                        <span className="cart-item-unit-price">{formatMoney(item.price * item.quantity)}</span>
                        {item.quantity > 1 && (
                          <span className="cart-item-sub-price">({formatMoney(item.price)}/sp)</span>
                        )}
                      </div>

                      <div className="cart-qty-controls">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, -1)}
                          className="btn-qty"
                          title="Giảm 1"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, 1)}
                          className="btn-qty"
                          title="Tăng 1"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-modal-footer">
              <button className="btn-clear-all" onClick={onClearCart}>
                <Trash2 size={14} /> Xóa tất cả
              </button>

              <div className="cart-footer-right">
                <div className="cart-total-text">
                  <span className="cart-total-lbl">Tổng cộng:</span>
                  <strong className="cart-total-val">{formatMoney(subtotal)}</strong>
                </div>

                <button
                  type="button"
                  className="btn-cart-checkout"
                  onClick={() => {
                    if (onProceedToCheckout) {
                      onProceedToCheckout();
                    } else if (onCheckout) {
                      if (onClose) onClose();
                      onCheckout();
                    }
                  }}
                >
                  <span>Thanh Toán</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
