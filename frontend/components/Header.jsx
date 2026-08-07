"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Plus,
  Bell,
  Ticket,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  CreditCard,
  Megaphone,
  Sticker,
  FolderPlus,
  ShoppingBag,
} from "lucide-react";
import Logo from "./Logo";
import NotificationBell from "./NotificationBell";
import VoucherWalletModal from "./VoucherWalletModal";
import { getUser, isAdmin, clearAuth } from "../lib/auth";
import "./Header.css";

export default function Header({ onToggleDrawer, isDrawerOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [voucherWalletOpen, setVoucherWalletOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setUserAdmin(isAdmin());
    const handleUserUpdated = (e) => {
      setUser(e.detail);
      setUserAdmin(isAdmin());
    };
    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    return () =>
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (userAdmin) {
      router.push(`/admin/users?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/customer/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  // Tính toán Breadcrumbs tiêu đề theo Route
  const getBreadcrumb = () => {
    if (pathname.includes("/admin/dashboard")) return { parent: "Admin", page: "Tổng Quan Hệ Thống" };
    if (pathname.includes("/admin/provinces")) return { parent: "Admin", page: "34 Tỉnh Thành & Địa Danh" };
    if (pathname.includes("/admin/stickers")) return { parent: "Admin", page: "Sticker Theme" };
    if (pathname.includes("/admin/system-settings")) return { parent: "Admin", page: "Cài Đặt Hệ Thống" };
    if (pathname.includes("/admin/albums")) return { parent: "Admin", page: "Quản Lý Album" };
    if (pathname.includes("/admin/users")) return { parent: "Admin", page: "Quản Lý Người Dùng" };
    if (pathname.includes("/admin/nfc-cards")) return { parent: "Admin", page: "Quản Lý Thẻ NFC" };
    if (pathname.includes("/admin/notifications")) return { parent: "Admin", page: "Trung Tâm Thông Báo" };
    if (pathname.includes("/admin/revenue")) return { parent: "Admin", page: "Báo Cáo Doanh Thu" };
    if (pathname.includes("/admin/analytics")) return { parent: "Admin", page: "Phân Tích Lượt Truy Cập" };
    if (pathname.startsWith("/admin")) return { parent: "Admin", page: "Bảng Quản Trị" };
    if (pathname.includes("/customer/dashboard")) return { parent: "Khách Hàng", page: "Bộ Sưu Tập Của Tôi" };
    if (pathname.includes("/settings")) return { parent: "VinaTap", page: "Cài Đặt Tài Khoản" };
    return { parent: "VinaTap", page: "Khám Phá Bản Đồ" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="linear-top-header">
      {/* LEFT REGION: BRAND & BREADCRUMBS */}
      <div className="header-region-left">
        <button
          type="button"
          className="header-btn-hamburger"
          onClick={onToggleDrawer}
          title={isDrawerOpen ? "Đóng Menu" : "Mở Menu"}
        >
          {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Logo
          className="header-logo-brand"
          href={userAdmin ? "/admin/dashboard" : "/customer/dashboard"}
        />

        <div className="header-breadcrumb-divider">/</div>
        <div className="header-breadcrumb">
          <span className="bc-parent">{breadcrumb.parent}</span>
          <span className="bc-slash">/</span>
          <span className="bc-page">{breadcrumb.page}</span>
        </div>
      </div>

      {/* CENTER REGION: GLOBAL SEARCH BAR */}
      <div className="header-region-center">
        <form onSubmit={handleGlobalSearch} className="header-global-search-form">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder={
              userAdmin
                ? "🔍 Tìm người dùng, mã NFC, album..."
                : "🔍 Tìm tỉnh thành, album kỷ niệm..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="global-search-input"
          />
        </form>
      </div>

      {/* RIGHT REGION: QUICK ACTIONS, NOTIFICATIONS & USER PROFILE */}
      <div className="header-region-right">
        {/* Admin Quick Action Button ➕ */}
        {userAdmin && (
          <div className="header-quick-action-wrap">
            <button
              className="btn-quick-action"
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              title="Tạo Nhanh Thẻ/Thông Báo"
            >
              <Plus size={18} />
            </button>

            {quickAddOpen && (
              <div className="quick-action-dropdown">
                <div className="qa-dropdown-title">TẠO NHANH QUẢN TRỊ</div>
                <Link
                  href="/admin/notifications"
                  className="qa-dropdown-item"
                  onClick={() => setQuickAddOpen(false)}
                >
                  <Megaphone size={16} className="text-blue" /> Phát Thông Báo Mới
                </Link>
                <Link
                  href="/admin/nfc-cards"
                  className="qa-dropdown-item"
                  onClick={() => setQuickAddOpen(false)}
                >
                  <CreditCard size={16} className="text-orange" /> Thêm Serial Thẻ NFC
                </Link>
                <Link
                  href="/admin/stickers"
                  className="qa-dropdown-item"
                  onClick={() => setQuickAddOpen(false)}
                >
                  <Sticker size={16} className="text-purple" /> Thêm Sticker Theme
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Customer Voucher & Shop Buttons 🎫 🛍️ */}
        {!userAdmin && (
          <>
            <Link
              href="/shop"
              className="btn-header-shop"
              title="Cửa Hàng Thẻ NFC VinaTap"
            >
              <ShoppingBag size={18} />
              <span>Cửa Hàng</span>
            </Link>

            <button
              type="button"
              className="btn-header-voucher"
              onClick={() => setVoucherWalletOpen(true)}
              title="Ví Voucher & Ưu Đãi"
            >
              <Ticket size={18} />
              <span>Ví Voucher</span>
            </button>
            {voucherWalletOpen && (
              <VoucherWalletModal
                onClose={() => setVoucherWalletOpen(false)}
                onSelectVoucher={(code) => {
                  router.push(`/shop?voucher=${code}`);
                }}
              />
            )}
          </>
        )}

        {/* Global Notification Bell 🔔 */}
        <div className="header-notif-wrap">
          <NotificationBell />
        </div>

        {/* User Profile Badge Dropdown 👤 */}
        {user && (
          <div className="header-user-menu-wrap">
            <button
              className="header-user-badge-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="header-avatar-circle">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} />
                ) : (
                  <span>{user.name?.[0]?.toUpperCase() || "U"}</span>
                )}
              </div>
              <span className="header-user-name">
                {userAdmin ? "Admin" : user.name}
              </span>
              <ChevronDown size={14} className="chevron-icon" />
            </button>

            {userDropdownOpen && (
              <div className="header-user-dropdown">
                <div className="dropdown-user-info">
                  <strong>{user.name}</strong>
                  <span className="text-muted">{user.email}</span>
                </div>

                <div className="dropdown-divider" />

                {userAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <ShieldCheck size={16} /> Trang Quản Trị Admin
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/customer/dashboard"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} /> Bộ Sưu Tập Của Tôi
                    </Link>
                    <Link
                      href="/shop"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <ShoppingBag size={16} /> Cửa Hàng Thẻ NFC
                    </Link>
                  </>
                )}

                <Link
                  href="/settings"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <Settings size={16} /> Cài Đặt Tài Khoản
                </Link>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Đăng Xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
