"use client";

import { useState, useEffect, useRef } from "react";
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
  User,
  Settings,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import CheckoutModal from "@/components/modals/CheckoutModal";
import CartModal from "@/components/modals/CartModal";
import { getUser, clearAuth, isAdmin } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { productAPI, shippingAPI } from "@/lib/api";
import "./ShopPage.css";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialVoucherCode = searchParams.get("voucher") || "";

  const [user, setUser] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [lang, setLang] = useState("vi");
  const [cart, setCart] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [shippingRule, setShippingRule] = useState({
    base_fee: 30000,
    free_shipping_threshold: 500000,
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
    setUserAdmin(isAdmin());
    setLang(getLang());

    const handleUserUpdated = (e) => {
      setUser(e.detail);
      setUserAdmin(isAdmin());
    };
    window.addEventListener("vinatap:user-updated", handleUserUpdated);

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

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
            free_shipping_threshold: Number(
              res.rule.free_shipping_threshold || 500000,
            ),
          });
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: Number(p.original_price || 0),
    tag:
      p.tag ||
      (Number(p.price) <= 5000
        ? `TEST GIÁ ${Number(p.price).toLocaleString("vi-VN")}Đ 🔥`
        : "HOT SELLER 🔥"),
    description: p.description || "Mảnh ghép NFC kỷ niệm du lịch VinaTap.",
    image:
      p.image ||
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    features: [
      "Chip NFC NXP chuẩn ISO",
      "Chống nước & chống xước",
      "Bảo hành chính hãng VinaTap",
    ],
  }));

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

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

  const handleAddToCart = (product) => {
    if (!user) {
      window.location.href = "/auth?redirect=/shop";
      return;
    }
    addToCart(product);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      window.location.href = "/auth?redirect=/shop";
      return;
    }
    addToCart(product);
    setCartModalOpen(true);
  };

  const handleOpenCart = () => {
    if (!user) {
      window.location.href = "/auth?redirect=/shop";
      return;
    }
    setCartModalOpen(true);
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

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
      {/* ─── PUBLIC SHOP NAVBAR ──────────────────────────────────────── */}
      <header className="shop-public-navbar">
        <div className="shop-navbar-container">
          {/* Logo */}
          <div className="shop-navbar-left">
            <Logo />
          </div>

          {/* Center Nav Links */}
          <nav className="shop-navbar-links">
            <Link href="/" className="shop-nav-link">
              🗺️ Khám Phá Bản Đồ
            </Link>
            <Link href="/shop" className="shop-nav-link shop-nav-link--active">
              🛍️ Cửa Hàng Thẻ NFC
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="shop-navbar-actions">
            {/* Quick Cart Button */}
            <button
              type="button"
              className="shop-nav-cart-btn"
              onClick={handleOpenCart}
              title="Xem giỏ hàng"
            >
              <ShoppingCart size={19} />
              {totalCartCount > 0 && (
                <span className="shop-cart-badge">{totalCartCount}</span>
              )}
            </button>

            {/* Auth Button / User Dropdown */}
            {user ? (
              <div className="shop-user-dropdown-wrap" ref={userMenuRef}>
                <button
                  type="button"
                  className="shop-user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="shop-user-avatar"
                    />
                  ) : (
                    <div className="shop-user-avatar-fallback">
                      {(user.name || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="shop-user-name">{user.name}</span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div className="shop-dropdown-menu">
                    <div className="shop-dropdown-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link
                      href="/customer/dashboard"
                      className="shop-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      <span>Bộ Sưu Tập Của Tôi</span>
                    </Link>
                    <Link
                      href="/customer/orders"
                      className="shop-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={16} />
                      <span>Đơn Hàng Của Tôi</span>
                    </Link>
                    {userAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="shop-dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldCheck size={16} />
                        <span>Trang Quản Trị Admin</span>
                      </Link>
                    )}
                    <Link
                      href="/settings/account"
                      className="shop-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Cài Đặt Tài Khoản</span>
                    </Link>
                    <button
                      type="button"
                      className="shop-dropdown-item shop-dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="shop-nav-login-btn">
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── 1. MODERN STORE HERO BANNER ─────────────────────────────── */}
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
              Chạm thẻ NFC để mở khóa album ảnh kỷ niệm và lưu giữ trọn vẹn từng
              khoảnh khắc du lịch của bạn.
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
                onClick={handleOpenCart}
              >
                <ShoppingCart size={17} />
                <span>
                  Giỏ hàng: <strong>{totalCartCount}</strong> (
                  {formatMoney(cartSubtotal)})
                </span>
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
            <p>
              Thử tìm kiếm với từ khóa khác hoặc quay lại xem tất cả sản phẩm.
            </p>
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
                  <img
                    src={p.image}
                    alt={p.name}
                    className="shopee-img"
                    loading="lazy"
                  />
                  <span className="shopee-tag-badge">{p.tag}</span>
                </div>

                <div className="shopee-card-body">
                  <h3 className="shopee-title" title={p.name}>
                    {p.name}
                  </h3>
                  <p className="shopee-desc">{p.description}</p>

                  <div className="shopee-price-row">
                    <span className="shopee-price-main">
                      {formatMoney(p.price)}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="shopee-price-del">
                        {formatMoney(p.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="shopee-actions">
                    <button
                      type="button"
                      className="btn-shopee-cart"
                      onClick={() => handleAddToCart(p)}
                      title="Thêm vào giỏ"
                    >
                      <ShoppingCart size={17} />
                    </button>
                    <button
                      type="button"
                      className="btn-shopee-buy"
                      onClick={() => handleBuyNow(p)}
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

      {/* ─── 3. MODALS (Cart & Checkout) ─────────────────────────────── */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onProceedToCheckout={() => {
          setCartModalOpen(false);
          setCheckoutOpen(true);
        }}
        freeShippingThreshold={shippingRule.free_shipping_threshold}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onClearCart={clearCart}
        initialVoucherCode={initialVoucherCode}
        shippingRule={shippingRule}
        user={user}
      />
    </div>
  );
}
