"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingCart,
  ArrowRight,
  MapPin,
  LayoutDashboard,
  Zap,
  Search,
} from "lucide-react";
import CustomerHeader from "@/components/layout/CustomerHeader";
import Sidebar from "@/components/layout/Sidebar";
import CheckoutModal from "@/components/modals/CheckoutModal";
import CartModal from "@/components/modals/CartModal";
import { getUser, clearAuth, isAdmin } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { productAPI, shippingAPI, systemSettingAPI } from "@/lib/api";
import "./ShopPage.css";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialVoucherCode = searchParams.get("voucher") || "";

  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [shippingRule, setShippingRule] = useState({ base_fee: 30000, free_shipping_threshold: 500000 });

  useEffect(() => {
    setUser(getUser());
    setLang(getLang());
    
    productAPI
      .getPublic()
      .then((res) => {
        if (res && res.products) setDbProducts(res.products);
      })
      .catch(() => {});

    shippingAPI
      .getPublic()
      .then((res) => {
        if (res && res.rule) {
          setShippingRule({
            base_fee: Number(res.rule.base_fee || 30000),
            free_shipping_threshold: Number(res.rule.free_shipping_threshold || 500000),
          });
        }
      })
      .catch(() => {});
  }, []);

  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: Number(p.original_price || 0),
    tag: p.tag || (Number(p.price) <= 5000 ? `TEST GIÁ ${Number(p.price).toLocaleString("vi-VN")}Đ 🔥` : "HOT SELLER 🔥"),
    description: p.description || "Mảnh ghép NFC kỷ niệm du lịch VinaTap.",
    image: p.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    features: ["Chip NFC NXP chuẩn ISO", "Chống nước & chống xước", "Bảo hành chính hãng VinaTap"],
  }));

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  const navItems = [
    {
      href: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: t(lang, "collection"),
    },
    {
      href: "/customer/orders",
      icon: <ShoppingBag size={20} />,
      label: "Đơn Hàng Của Tôi",
    },
    {
      href: "/shop",
      icon: <ShoppingBag size={20} />,
      label: "Cửa Hàng Thẻ NFC",
    },
    ...(user?.role === "admin"
      ? [
          {
            href: "/admin",
            icon: <ShieldCheck size={20} />,
            label: "Trang Quản Trị Admin",
          },
        ]
      : []),
  ];

  const addToCart = (product) => {
    const itemToAdd = {
      ...product,
      quantity: 1,
    };

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx >= 0) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, itemToAdd];
    });
  };

  const updateQuantity = (idx, delta) => {
    setCart((prev) =>
      prev
        .map((item, i) => {
          if (i === idx) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const removeItem = (idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      amount,
    );

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  });

  return (
    <div className="shop-page-shell">
      <CustomerHeader
        isDrawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
      />

      <Sidebar
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        user={user}
        lang={lang}
        onLogout={handleLogout}
      />

      {/* ─── 1. MODERN STORE HEADER (Không còn khối đen cồng kềnh) ─── */}
      <div className="shop-modern-header">
        <div className="shop-header-inner">
          <div className="shop-title-area">
            <div className="shop-brand-chip">
              <Sparkles size={13} />
              <span>CỬA HÀNG THẺ NFC DI SẢN CHÍNH HÃNG</span>
            </div>
            <h1 className="shop-main-title">
              Sở Hữu Mảnh Ghép <span>34 Tỉnh Thành</span>
            </h1>
            <p className="shop-main-desc">
              Chạm thẻ NFC để mở khóa album ảnh kỷ niệm và lưu giữ trọn vẹn từng khoảnh khắc du lịch của bạn.
            </p>
          </div>

          <div className="shop-controls-bar">
            <div className="shop-search-field">
              <Search size={16} className="shop-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm mảnh ghép tỉnh thành..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
            </div>

            {totalCartCount > 0 && (
              <button
                type="button"
                className="shop-quick-cart-btn"
                onClick={() => setCartModalOpen(true)}
              >
                <ShoppingCart size={17} />
                <span>Giỏ hàng: <strong>{totalCartCount}</strong> ({formatMoney(cartSubtotal)})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN PRODUCTS SHOWCASE ─────────────────────────────── */}
      <main className="shop-container">
        {filteredProducts.length === 0 ? (
          <div className="shop-empty-products">
            <ShoppingBag size={44} className="empty-icon" />
            <h3>Không tìm thấy sản phẩm nào</h3>
            <p>Thử tìm kiếm với từ khóa khác hoặc quay lại xem tất cả sản phẩm.</p>
            {searchQuery && (
              <button
                type="button"
                className="btn-reset-shop-search"
                onClick={() => setSearchQuery("")}
              >
                Xem tất cả sản phẩm
              </button>
            )}
          </div>
        ) : (
          <div className="shop-products-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="shopee-card">
                <div className="shopee-img-wrap">
                  <img src={p.image} alt={p.name} className="shopee-img" loading="lazy" />
                  <span className="shopee-tag-badge">{p.tag}</span>
                </div>

                <div className="shopee-card-body">
                  <h3 className="shopee-title" title={p.name}>{p.name}</h3>
                  {p.description && (
                    <p className="shopee-desc" title={p.description}>{p.description}</p>
                  )}

                  <div className="shopee-price-row">
                    <span className="shopee-price-main">{formatMoney(p.price)}</span>
                    {p.originalPrice > 0 && (
                      <span className="shopee-price-del">{formatMoney(p.originalPrice)}</span>
                    )}
                  </div>

                  <div className="shopee-actions">
                    <button
                      type="button"
                      className="btn-shopee-cart"
                      onClick={() => addToCart(p)}
                      title="Thêm vào giỏ hàng"
                    >
                      <ShoppingCart size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-shopee-buy"
                      onClick={() => {
                        addToCart(p);
                        setCheckoutOpen(true);
                      }}
                    >
                      <span>Mua Ngay</span>
                      <Zap size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL CHI TIẾT GIỎ HÀNG QUẢN LÝ / XÓA SẢN PHẨM */}
      {cartModalOpen && (
        <CartModal
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onClose={() => setCartModalOpen(false)}
          onCheckout={() => setCheckoutOpen(true)}
        />
      )}

      {/* MODAL CHECKOUT VỚI THÔNG TIN VOUCHER & VIETQR */}
      {checkoutOpen && (
        <CheckoutModal
          items={cart.length > 0 ? cart : (products && products.length > 0 ? [products[0]] : [])}
          initialVoucher={initialVoucherCode}
          shippingRule={shippingRule}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => setCart([])}
        />
      )}
    </div>
  );
}
