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
  ShieldAlert,
  X,
  Ticket,
  Gift,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import CheckoutModal from "@/components/modals/CheckoutModal";
import CartModal from "@/components/modals/CartModal";
import { getUser, clearAuth, isAdmin } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { productAPI, shippingAPI } from "@/lib/api";
import "./ShopPage.css";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialVoucherCode = (searchParams.get("voucher") || "").trim().toUpperCase();

  const [user, setUser] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [adminNotice, setAdminNotice] = useState("");
  const [lang, setLang] = useState("vi");
  const [cart, setCart] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeVoucherCode, setActiveVoucherCode] = useState(initialVoucherCode);
  const [appliedVoucherToast, setAppliedVoucherToast] = useState("");
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

    const handleLang = (e) => setLang(e?.detail || getLang());
    window.addEventListener("vinatap:lang-updated", handleLang);
    window.addEventListener("storage", handleLang);

    // Nạp mã voucher từ searchParams hoặc localStorage
    const urlVoucher = (searchParams?.get("voucher") || "").trim().toUpperCase();
    let savedVoucher = "";
    try {
      savedVoucher = (localStorage.getItem("vinatap_active_voucher") || "").trim().toUpperCase();
    } catch {}

    const targetCode = urlVoucher || savedVoucher;
    if (targetCode) {
      setActiveVoucherCode(targetCode);
      try {
        localStorage.setItem("vinatap_active_voucher", targetCode);
      } catch {}
    }

    const handleUserUpdated = (e) => {
      setUser(e.detail);
      setUserAdmin(isAdmin());
    };
    window.addEventListener("vinatap:user-updated", handleUserUpdated);

    // Lắng nghe sự kiện kích hoạt Voucher từ Thông báo hoặc Ví
    const handleApplyVoucher = (e) => {
      const code = (e.detail?.code || "").trim().toUpperCase();
      if (code) {
        setActiveVoucherCode(code);
        setAppliedVoucherToast(`Đã nhận Voucher "${code}" và áp dụng vào thanh toán!`);
        setTimeout(() => setAppliedVoucherToast(""), 5000);
      }
    };

    const handleShopFocused = (e) => {
      const code = (e.detail?.code || "").trim().toUpperCase();
      if (code) {
        setActiveVoucherCode(code);
        setAppliedVoucherToast(`Đã kích hoạt Voucher "${code}" cho đơn hàng!`);
        setTimeout(() => setAppliedVoucherToast(""), 5000);
        // Nếu đã có hàng trong giỏ, tự động mở Thanh toán
        setCart((currentCart) => {
          if (currentCart && currentCart.length > 0) {
            setCheckoutOpen(true);
          }
          return currentCart;
        });
      }
    };

    window.addEventListener("vinatap:apply-voucher", handleApplyVoucher);
    window.addEventListener("vinatap:voucher-shop-focused", handleShopFocused);

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
      window.removeEventListener("vinatap:apply-voucher", handleApplyVoucher);
      window.removeEventListener("vinatap:voucher-shop-focused", handleShopFocused);
      window.removeEventListener("vinatap:lang-updated", handleLang);
      window.removeEventListener("storage", handleLang);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchParams]);

  const isVi = lang === "vi";

  const getStandardPrice = (p) => {
    const priceNum = Number(p.price || 0);
    const name = p.name || "";
    if (p.category === "combo" || name.includes("Combo")) {
      if (name.includes("3") && !name.includes("34")) return 139000;
      if (name.includes("5")) return 239000;
      if (name.includes("34")) return 1400000;
      return priceNum >= 10000 ? priceNum : 139000;
    }
    // Thẻ lẻ: Bắt buộc chuẩn 49.000đ, tuyệt đối không chấp nhận giá test < 10k
    return priceNum < 10000 ? 49000 : priceNum;
  };

  const getStandardOriginalPrice = (p) => {
    const origNum = Number(p.original_price || 0);
    const name = p.name || "";
    if (p.category === "combo" || name.includes("Combo")) {
      if (name.includes("3") && !name.includes("34")) return 147000;
      if (name.includes("5")) return 245000;
      if (name.includes("34")) return 1700000;
      return origNum > 0 ? origNum : 245000;
    }
    // Thẻ lẻ: Giá gốc niêm yết gạch đi là 59.000đ
    return origNum < 10000 ? 59000 : origNum;
  };

  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: getStandardPrice(p),
    originalPrice: getStandardOriginalPrice(p),
    tag: p.tag || "BÁN CHẠY 🔥",
    description: p.description || "Cẩm nang & bản đồ du lịch số VinaTap.",
    image:
      p.image ||
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    features: [
      "Bản đồ số & GPS thông minh",
      "Cẩm nang chi tiết 63 tỉnh",
      "Lưu giữ kỷ niệm hành trình",
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
    if (user.role === "admin" || userAdmin) {
      setAdminNotice(
        "Tài khoản Quản trị viên (Admin) không thực hiện mua hàng. Vui lòng sử dụng tài khoản Khách hàng (Customer)."
      );
      setTimeout(() => setAdminNotice(""), 6000);
      return;
    }
    addToCart(product);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      window.location.href = "/auth?redirect=/shop";
      return;
    }
    if (user.role === "admin" || userAdmin) {
      setAdminNotice(
        "Tài khoản Quản trị viên (Admin) không thực hiện mua hàng. Vui lòng sử dụng tài khoản Khách hàng (Customer)."
      );
      setTimeout(() => setAdminNotice(""), 6000);
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
    if (user.role === "admin" || userAdmin) {
      setAdminNotice(
        "Tài khoản Quản trị viên (Admin) không thực hiện mua hàng. Vui lòng sử dụng tài khoản Khách hàng (Customer)."
      );
      setTimeout(() => setAdminNotice(""), 6000);
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
              {isVi ? "Trang chủ" : "Home"}
            </Link>
            <Link href="/#about" className="shop-nav-link">
              {isVi ? "Giới thiệu" : "About"}
            </Link>
            <Link href="/shop" className="shop-nav-link shop-nav-link--active">
              {isVi ? "Sản phẩm" : "Products"}
            </Link>
            <Link href="/guide" className="shop-nav-link">
              {isVi ? "Cẩm nang" : "Guides"}
            </Link>
            <Link href="/#faq" className="shop-nav-link">
              {isVi ? "Hỏi đáp" : "FAQ"}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="shop-navbar-actions">
            <LanguageSwitch variant="navbar" />

            {/* Quick Cart Button */}
            <button
              type="button"
              className="shop-nav-cart-btn"
              onClick={handleOpenCart}
              title={isVi ? "Xem giỏ hàng" : "View Cart"}
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
                      <span>{t(lang, "myCollection")}</span>
                    </Link>
                    <Link
                      href="/customer/orders"
                      className="shop-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={16} />
                      <span>{t(lang, "myOrders")}</span>
                    </Link>
                    {userAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="shop-dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldCheck size={16} />
                        <span>{t(lang, "adminPortal")}</span>
                      </Link>
                    )}
                    <Link
                      href="/settings/account"
                      className="shop-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      <span>{t(lang, "accountSettings")}</span>
                    </Link>
                    <button
                      type="button"
                      className="shop-dropdown-item shop-dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>{t(lang, "logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="shop-nav-login-btn">
                {isVi ? "Đăng Nhập" : "Sign In"}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── ADMIN NOTICE STRIP ────────────────────────────────────── */}
      {userAdmin && (
        <div className="shop-admin-strip">
          <div className="shop-admin-strip-inner">
            <ShieldAlert size={18} className="shop-admin-strip-icon" />
            <div className="shop-admin-strip-text">
              <strong>Chế độ Quản trị viên (Admin):</strong> Bạn đang xem trước giao diện cửa hàng. Chức năng mua sắm & đặt đơn chỉ áp dụng cho tài khoản <strong>Khách hàng (Customer)</strong>. Quản trị viên quản lý tại{" "}
              <Link href="/admin/products" className="shop-admin-strip-link">Quản lý Sản phẩm</Link> hoặc{" "}
              <Link href="/admin/orders" className="shop-admin-strip-link">Quản lý Đơn hàng</Link>.
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING ADMIN NOTICE TOAST ───────────────────────────── */}
      {adminNotice && (
        <div className="shop-admin-notice-toast" role="alert">
          <div className="shop-admin-notice-toast-content">
            <ShieldAlert size={20} className="toast-icon" />
            <div className="toast-text">
              <strong>Thông báo quyền tài khoản</strong>
              <p>{adminNotice}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-toast-close"
            onClick={() => setAdminNotice("")}
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── 1. MODERN STORE HERO BANNER ─────────────────────────────── */}
      <div className="shop-modern-header">
        <div className="shop-header-inner">
          <div className="shop-title-area">
            <div className="shop-brand-chip">
              <Sparkles size={13} />
              <span>
                {isVi
                  ? "CẨM NANG & BẢN ĐỒ DU LỊCH CHÍNH HÃNG"
                  : "OFFICIAL TRAVEL GUIDES & DIGITAL MAPS"}
              </span>
            </div>
            <h1 className="shop-main-title">
              {isVi ? (
                <>
                  Khám Phá Cẩm Nang <span>63 Tỉnh Thành</span>
                </>
              ) : (
                <>
                  Discover Travel Guides of <span>63 Provinces</span>
                </>
              )}
            </h1>
            <p className="shop-main-desc">
              {isVi
                ? "Sở hữu bản đồ du lịch số và cẩm nang chi tiết để mở khóa album ảnh kỷ niệm và lưu giữ trọn vẹn từng khoảnh khắc của bạn."
                : "Own digital interactive travel maps and detailed guides to unlock photo albums and preserve every moment of your adventure."}
            </p>
          </div>

          <div className="shop-controls-bar">
            <div className="shop-search-field">
              <Search size={16} className="shop-search-icon" />
              <input
                type="text"
                placeholder={
                  isVi
                    ? "Tìm kiếm cẩm nang & bản đồ tỉnh thành..."
                    : "Search travel guides & province maps..."
                }
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
                  {isVi ? "Giỏ hàng: " : "Cart: "}<strong>{totalCartCount}</strong> (
                  {formatMoney(cartSubtotal)})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── VOUCHER BANNER / TOAST FEEDBACK ───────────────────────── */}
      {appliedVoucherToast && (
        <div className="shop-voucher-toast" role="status">
          <Gift size={18} className="voucher-toast-icon" />
          <span>{appliedVoucherToast}</span>
          <button
            type="button"
            className="btn-toast-close"
            onClick={() => setAppliedVoucherToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {activeVoucherCode && (
        <div className="shop-active-voucher-strip">
          <div className="active-voucher-strip-inner">
            <div className="active-voucher-left">
              <span className="voucher-tag-pill">
                <Ticket size={14} /> VOUCHER ĐANG ÁP DỤNG
              </span>
              <strong className="active-voucher-code-text">{activeVoucherCode}</strong>
              <span className="active-voucher-desc">
                Ưu đãi sẽ được tự động tính vào tổng tiền khi bạn mở thanh toán!
              </span>
            </div>
            <div className="active-voucher-actions">
              {cart.length > 0 && (
                <button
                  type="button"
                  className="btn-voucher-quick-checkout"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Thanh Toán Ngay ➔
                </button>
              )}
              <button
                type="button"
                className="btn-voucher-remove"
                onClick={() => {
                  setActiveVoucherCode("");
                  try {
                    localStorage.removeItem("vinatap_active_voucher");
                  } catch {}
                }}
                title="Hủy áp dụng mã này"
              >
                Gỡ mã
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. MAIN PRODUCTS SHOWCASE ─────────────────────────────── */}
      <main className="shop-container">
        {filteredProducts.length === 0 ? (
          <div className="shop-empty-products">
            <ShoppingBag size={44} className="empty-icon" />
            <h3>{isVi ? "Không tìm thấy sản phẩm nào" : "No products found"}</h3>
            <p>
              {isVi
                ? "Thử tìm kiếm với từ khóa khác hoặc quay lại xem tất cả sản phẩm."
                : "Try searching with different keywords or reset to view all items."}
            </p>
            {searchQuery && (
              <button
                type="button"
                className="btn-reset-shop-search"
                onClick={() => setSearchQuery("")}
              >
                {isVi ? "Xem tất cả sản phẩm" : "View all products"}
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
                      className={`btn-shopee-cart ${userAdmin ? "btn-shopee-cart--admin" : ""}`}
                      onClick={() => handleAddToCart(p)}
                      title={
                        userAdmin
                          ? (isVi ? "Admin không thể mua hàng (Dành cho Customer)" : "Admin cannot purchase (Customer only)")
                          : !user
                          ? (isVi ? "Đăng nhập để thêm vào giỏ" : "Sign in to add to cart")
                          : (isVi ? "Thêm vào giỏ" : "Add to cart")
                      }
                    >
                      <ShoppingCart size={17} />
                    </button>
                    <button
                      type="button"
                      className={`btn-shopee-buy ${userAdmin ? "btn-shopee-buy--admin" : ""}`}
                      onClick={() => handleBuyNow(p)}
                      title={
                        userAdmin
                          ? (isVi ? "Admin không thể mua hàng (Dành cho Customer)" : "Admin cannot purchase (Customer only)")
                          : !user
                          ? (isVi ? "Đăng nhập để mua" : "Sign in to buy")
                          : (isVi ? "Mua Ngay" : "Buy Now")
                      }
                    >
                      <span>
                        {userAdmin
                          ? (isVi ? "Dành cho Customer" : "Customer Only")
                          : (isVi ? "Mua Ngay" : "Buy Now")}
                      </span>
                      {userAdmin ? <ShieldAlert size={14} /> : <Zap size={14} />}
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

      {checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cart={cart}
          onClearCart={clearCart}
          initialVoucherCode={activeVoucherCode}
          shippingRule={shippingRule}
          user={user}
        />
      )}
    </div>
  );
}
