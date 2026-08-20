"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";
import NotificationBell from "@/components/layout/NotificationBell";
import { getUser, clearAuth } from "@/lib/auth";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "./Header.css";

export default function AdminHeader({ onToggleDrawer, isDrawerOpen }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userMenuRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
    setLang(getLang());

    const handleUserUpdated = (e) => setUser(e.detail);
    const handleLangUpdated = (e) => setLang(e.detail);

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
    if (pathname.includes("/admin/vouchers")) return { parent: "Admin", page: "Mã Giảm Giá" };

    return { parent: "Admin", page: t(lang, "adminRole") };
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
          href="/admin/dashboard"
        />

        <div className="header-breadcrumb-divider">/</div>
        <div className="header-breadcrumb">
          <span className="bc-parent">{breadcrumb.parent}</span>
          <span className="bc-slash">/</span>
          <span className="bc-page">{breadcrumb.page}</span>
        </div>
      </div>

      <div className="header-region-right">
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
                  <span>{user.name?.[0]?.toUpperCase() || "A"}</span>
                )}
              </div>
              <span className="header-user-name">
                {user.name || "Admin"}
              </span>
              <ChevronDown size={14} className="chevron-icon" />
            </button>

            {userDropdownOpen && (
              <div className="header-user-dropdown">
                <div className="dropdown-user-info">
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <strong>{user.name}</strong>
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: "rgba(239, 68, 68, 0.12)",
                      color: "#dc2626",
                    }}>
                      ADMIN
                    </span>
                  </div>
                  <span className="text-muted">{user.email}</span>
                </div>

                <div className="dropdown-divider" />

                <Link
                  href="/admin/dashboard"
                  className="dropdown-item"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <ShieldCheck size={16} /> Bảng Quản Trị
                </Link>

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
    </header>
  );
}
