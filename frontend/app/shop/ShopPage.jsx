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
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import CheckoutModal from "../../components/CheckoutModal";
import CartModal from "../../components/CartModal";
import { getUser, clearAuth } from "../../lib/auth";
import { getLang } from "../../lib/prefs";
import { t } from "../../lib/i18n";
import DvdBounce from "../../components/DvdBounce";
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

  useEffect(() => {
    setUser(getUser());
    setLang(getLang());
  }, []);

  const products = [
    {
      id: 1,
      name: "Mảnh Ghép NFC Gỗ 3D — Tùy Chọn Tỉnh Thành",
      price: 2000, // 🚨 GIÁ 2.000Đ THỬ NGHIỆM THANH TOÁN VIETQR
      originalPrice: 180000,
      tag: "TEST GIÁ 2.000Đ 🔥",
      description:
        "Mảnh ghép gỗ tự nhiên khắc chìm Laser 3D địa danh du lịch. Tích hợp chip NFC cảm ứng 1 chạm mở Album Kỷ Niệm.",
      image:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      features: [
        "Chip NFC NXP chuẩn ISO",
        "Gỗ bách xanh tự nhiên 100%",
        "Chống nước & chống xước",
      ],
      hasProvinceSelector: true,
    },
    {
      id: 2,
      name: "Combo Trọn Bộ 34 Tỉnh Thành Việt Nam (Bản Đồ Bản Quyền)",
      price: 4500000,
      originalPrice: 5100000,
      tag: "TIẾT KIỆM 600K 👑",
      description:
        "Trọn bộ 34 mảnh ghép NFC của 34 Tỉnh Thành + Khung treo bản đồ khắc chìm chất liệu gỗ Óc Chó cao cấp.",
      image:
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80",
      features: [
        "Tặng kèm khung bản đồ cao cấp",
        "Miễn phí khắc tên gia đình/chủ sở hữu",
        "Miễn phí vận chuyển Toàn Quốc",
      ],
    },
    {
      id: 3,
      name: "Thẻ NFC Kim Loại VinaTap VIP Edition",
      price: 250000,
      originalPrice: 300000,
      tag: "PHIÊN BẢN GIỚI HẠN ✨",
      description:
        "Thẻ NFC chất liệu Hợp Kim Titan xước mạ Vàng Kim Gold. Thiết kế cực kỳ sang trọng dành cho Collectors.",
      image:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
      features: [
        "Thép Titan chống gỉ mạ Vàng",
        "Công nghệ quét chạm siêu nhạy",
        "Bảo hành 5 năm 1 đổi 1",
      ],
    },
  ];

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  const navItems = [
    {
      href: "/shop",
      icon: <ShoppingBag size={20} />,
      label: "Cửa hàng",
    },
    {
      href: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: t(lang, "collection"),
    },
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
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {provinceList.map((pr) => (
                        <option key={pr} value={pr}>
                          Mảnh Ghép: {pr}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <ul className="product-features">
                  {p.features.map((f, idx) => (
                    <li key={idx}>
                      <Check size={14} className="text-green" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="product-price-box">
                  <div className="price-group">
                    <span className="current-price">{formatMoney(p.price)}</span>
                    {p.originalPrice && (
                      <span className="original-price">
                        {formatMoney(p.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    className="btn-add-to-cart"
                    onClick={() => {
                      addToCart(p);
                      setCheckoutOpen(true);
                    }}
                  >
                    <ShoppingBag size={16} /> Mua Ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              : [
                  {
                    ...products[0],
                    name: `${products[0].name} (${selectedProvince})`,
                    selectedProvince,
                  },
                ]
          }
          initialVoucher={initialVoucherCode}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => setCart([])}
        />
      )}
    </div>
  );
}
