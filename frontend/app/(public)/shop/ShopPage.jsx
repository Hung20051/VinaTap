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
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CheckoutModal from "@/components/modals/CheckoutModal";
import CartModal from "@/components/modals/CartModal";
import { getUser, clearAuth, isAdmin } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import { productAPI, shippingAPI, systemSettingAPI } from "@/lib/api";
import DvdBounce from "@/components/ui/DvdBounce";
import "./ShopPage.css";

const provinceList = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Lào Cai (Sapa)",
  "Hà Giang",
  "Quảng Ninh (Hạ Long)",
  "Ninh Bình",
  "Thừa Thiên Huế",
  "Quảng Nam (Hội An)",
  "Lâm Đồng (Đà Lạt)",
  "Khánh Hòa (Nha Trang)",
  "Bình Thuận (Phan Thiết)",
  "Bà Rịa - Vũng Tàu",
  "Cần Thơ",
  "Kiên Giang (Phú Quốc)",
  "An Giang",
  "Bắc Ninh",
  "Cao Bằng",
  "Điện Biên",
  "Hải Phòng",
  "Hà Tĩnh",
  "Hòa Bình",
  "Lạng Sơn",
  "Nghệ An",
  "Phú Thọ",
  "Quảng Bình",
  "Quảng Ngãi",
  "Quảng Trị",
  "Thái Nguyên",
  "Thanh Hóa",
  "Tuyên Quang",
  "Yên Bái",
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialVoucherCode = searchParams.get("voucher") || "";

  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("Hà Nội");
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
    hasProvinceSelector: p.category === "single" || String(p.name).includes("Mảnh Ghép"),
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
    ...(typeof window !== "undefined" && isAdmin()
      ? [
          {
            href: "/admin",
            icon: <ShieldCheck size={20} />,
            label: t(lang, "admin"),
          },
        ]
      : []),
  ];

  const addToCart = (product) => {
    const itemToAdd = {
      ...product,
      name: product.hasProvinceSelector
        ? `${product.name} (${selectedProvince})`
        : product.name,
      selectedProvince: product.hasProvinceSelector ? selectedProvince : null,
      quantity: 1,
    };

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedProvince === itemToAdd.selectedProvince,
      );

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

  return (
    <div className="shop-page-shell">
      <DvdBounce />
      <Header
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

      <div className="shop-hero">
        <div className="shop-hero-content">
          <span className="shop-badge">🏆 CỬA HÀNG CHÍNH HÃNG VINATAP</span>
          <h1 className="shop-title">Bộ Sưu Tập Thẻ NFC 34 Tỉnh Thành Việt Nam</h1>
          <p className="shop-subtitle">
            Chạm thẻ NFC để mở ngay Album Ảnh & Kỷ Niệm Chuyến Đi — Lưu giữ hành
            trình chinh phục quê hương!
          </p>

          <div className="shop-hero-trust">
            <div className="trust-item">
              <ShieldCheck size={18} className="text-orange" />
              <span>Bảo hành 1 đổi 1 trong 12 tháng</span>
            </div>
            <div className="trust-item">
              <Truck size={18} className="text-orange" />
              <span>Giao hàng Hỏa Tốc Toàn Quốc</span>
            </div>
            <div className="trust-item">
              <RotateCcw size={18} className="text-orange" />
              <span>Miễn phí đổi trả trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      <main className="shop-container">
        {/* THANH GIỎ HÀNG NỔI NẾU CÓ SẢN PHẨM */}
        {totalCartCount > 0 && (
          <div className="shop-cart-floating-bar">
            <div
              className="cart-bar-left"
              style={{ cursor: "pointer" }}
              onClick={() => setCartModalOpen(true)}
              title="Xem & Quản Lý Giỏ Hàng"
            >
              <ShoppingCart size={20} />
              <span>
                Giỏ hàng: <strong>{totalCartCount} sản phẩm</strong> (
                {formatMoney(cartSubtotal)})
              </span>
            </div>
            <button
              className="btn-checkout-floating"
              onClick={() => setCheckoutOpen(true)}
            >
              Thanh Toán Ngay <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* LƯỚI SẢN PHẨM */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", background: "#ffffff", borderRadius: "20px", border: "1px dashed #cbd5e1", margin: "2rem 0" }}>
            <ShoppingBag size={48} style={{ color: "#94a3b8", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#334155", margin: "0 0 6px 0" }}>
              Cửa Hàng Hiện Chưa Có Sản Phẩm Mở Bán
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
              Quản trị viên chưa thêm sản phẩm nào vào Database. Vui lòng quay lại sau!
            </p>
          </div>
        ) : (
          <div className="shop-products-grid">
            {products.map((p) => (
              <div key={p.id} className="shop-product-card">
                <div className="product-image-wrap">
                  <img src={p.image} alt={p.name} className="product-img" />
                  <span className="product-tag">{p.tag}</span>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.description}</p>

                  {/* PROVINCE SELECTOR FOR PRODUCT 1 */}
                  {p.hasProvinceSelector && (
                    <div
                      style={{
                        marginBottom: "1rem",
                        background: "#fff7ed",
                        border: "1px solid #fdba74",
                        padding: "8px 12px",
                        borderRadius: "10px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#ea580c",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "4px",
                        }}
                      >
                        <MapPin size={14} /> Chọn Tỉnh Thành Muốn Mua:
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #fed7aa",
                          background: "#ffffff",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {provinceList.map((prov) => (
                          <option key={prov} value={prov}>
                            Mảnh Ghép: {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <ul className="product-features">
                    {p.features.map((feat, i) => (
                      <li key={i}>
                        <Check size={14} className="text-orange" /> {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="product-pricing">
                    <div className="price-wrap">
                      <span className="current-price">
                        {formatMoney(p.price)}
                      </span>
                      {p.originalPrice > 0 && (
                        <span className="original-price">
                          {formatMoney(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn-buy-now"
                      onClick={() => addToCart(p)}
                    >
                      <ShoppingBag size={16} /> Mua Ngay
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
          items={
            cart.length > 0
              ? cart
              : products && products.length > 0
              ? [
                  {
                    ...products[0],
                    name: `${products[0].name} (${selectedProvince})`,
                    selectedProvince,
                  },
                ]
              : []
          }
          initialVoucher={initialVoucherCode}
          shippingRule={shippingRule}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => setCart([])}
        />
      )}
    </div>
  );
}
