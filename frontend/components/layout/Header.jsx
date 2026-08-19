"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Plus,
  Ticket,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ShoppingBag,
  Package,
} from "lucide-react";
import Logo from "./Logo";
import NotificationBell from "@/components/layout/NotificationBell";
import VoucherWalletModal from "@/components/modals/VoucherWalletModal";
import { getUser, isAdmin, clearAuth } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "./Header.css";

export default function Header({ onToggleDrawer, isDrawerOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [userAdmin, setUserAdmin] = useState(false);
  const [lang, setLang] = useState("vi");
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [voucherWalletOpen, setVoucherWalletOpen] = useState(false);

  const userMenuRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
    setUserAdmin(isAdmin());
    setLang(getLang());

    const handleUserUpdated = (e) => {
      setUser(e.detail);
      setUserAdmin(isAdmin());
    };

    const handleLangUpdated = (e) => {
      setLang(e.detail);
    };

    window.addEventListener("vinatap:user-updated", handleUserUpdated);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdated);
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const getBreadcrumb = () => {
    if (pathname.includes("/admin/dashboard")) return { parent: "Admin", page: t(lang, "adminOverview") };
    if (pathname.includes("/admin/provinces")) return { parent: "Admin", page: t(lang, "adminProvinces") };
    if (pathname.includes("/admin/stickers")) return { parent: "Admin", page: t(lang, "adminStickers") };
    if (pathname.includes("/admin/system-settings")) return { parent: "Admin", page: t(lang, "adminSystemSettings") };
    if (pathname.includes("/admin/albums")) return { parent: "Admin", page: t(lang, "adminAlbums") };
    if (pathname.includes("/admin/users")) return { parent: "Admin", page: t(lang, "adminUsers") };
    if (pathname.includes("/admin/nfc-cards")) return { parent: "Admin", page: t(lang, "adminNfcCards") };
    if (pathname.includes("/admin/notifications")) return { parent: "Admin", page: "Notifications" };
    if (pathname.includes("/admin/products")) return { parent: "Admin", page: "Products & Shipping" };
    if (pathname.includes("/admin/revenue")) return { parent: "Admin", page: t(lang, "adminRevenue") };
    if (pathname.includes("/admin/analytics")) return { parent: "Admin", page: t(lang, "adminAnalytics") };
    if (pathname.startsWith("/admin")) return { parent: "Admin", page: t(lang, "adminRole") };
    if (pathname.includes("/customer/dashboard")) return { parent: t(lang, "greeting"), page: t(lang, "myCollection") };
    if (pathname.includes("/settings")) return { parent: "VinaTap", page: t(lang, "accountSettings") };

    return { parent: "VinaTap", page: "Trang Chủ" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="linear-top-header">
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

      <div className="header-region-center">
        <form onSubmit={handleGlobalSearch} className="header-global-search-form">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder={
              userAdmin
                ? "🔍 Tìm người dùng, mã NFC, album..."
                : `🔍 ${t(lang, "searchPlaceholder")}`
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-region-right">
        {!userAdmin && (
          <Link href="/shop" className="btn-header-shop">
            <ShoppingBag size={15} />
            <span>{t(lang, "shop")}</span>
          </Link>
        )}

        {!userAdmin && (
          <button
            type="button"
            className="btn-header-voucher"
            onClick={() => setVoucherWalletOpen(true)}
          >
            <Ticket size={15} />
            <span>{t(lang, "vouchers")}</span>
          </button>
        )}

        <NotificationBell />

        {user && (
          <div className="header-user-menu-wrap" ref={userMenuRef}>
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
                    <ShieldCheck size={16} /> {t(lang, "adminPortal")}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/customer/dashboard"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} /> {t(lang, "myCollection")}
                    </Link>
                    <Link
                      href="/customer/orders"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={16} /> {t(lang, "myOrders")}
                    </Link>
                    <Link
                      href="/shop"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <ShoppingBag size={16} /> {t(lang, "nfcStore")}
                    </Link>
                  </>
                )}

                <Link
                  href="/settings/account"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <Settings size={16} /> {t(lang, "accountSettings")}
                </Link>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> {t(lang, "logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <VoucherWalletModal
        isOpen={voucherWalletOpen}
        onClose={() => setVoucherWalletOpen(false)}
      />
    </header>
  );
}
