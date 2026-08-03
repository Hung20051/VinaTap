"use client";

// Sidebar RIÊNG cho /settings/* — khác cả Sidebar.jsx (customer dashboard)
// lẫn AdminSidebar.jsx (admin). Menu cố định 6 mục, không cần truyền
// navItems linh hoạt vì đây không phân theo role (ai cũng vào /settings
// thấy y hệt 6 mục này). Dùng lại toàn bộ CSS shell (thu/mở, tooltip,
// avatar, logout) từ styles/sidebar.css để đồng bộ giao diện.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User as UserIcon,
  KeyRound,
  Palette,
  LifeBuoy,
  FileText,
  Info,
  Search,
  LogOut,
  Menu,
  ArrowLeft,
} from "lucide-react";
import Logo from "./Logo";
import {
  getSidebarCollapsed,
  setSidebarCollapsed as persistSidebarCollapsed,
} from "../lib/prefs";
import { clearAuth, isAdmin } from "../lib/auth";

const SETTINGS_NAV_ITEMS = [
  { href: "/settings/account", icon: UserIcon, label: "Tài khoản" },
  { href: "/settings/password", icon: KeyRound, label: "Mật khẩu" },
  { href: "/settings/appearance", icon: Palette, label: "Giao diện" },
  { href: "/settings/support", icon: LifeBuoy, label: "Hỗ trợ" },
  { href: "/settings/legal", icon: FileText, label: "Điều khoản & Bảo mật" },
  { href: "/settings/about", icon: Info, label: "Về VinaTap" },
];

export default function SettingsSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(getSidebarCollapsed());
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      persistSidebarCollapsed(next);
      return next;
    });
  };

  const [query, setQuery] = useState("");
  const filteredItems = query.trim()
    ? SETTINGS_NAV_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : SETTINGS_NAV_ITEMS;

  const expandAndFocusSearch = () => {
    setCollapsed(false);
    persistSidebarCollapsed(false);
  };

  const [tooltip, setTooltip] = useState(null);
  const showTooltip = (e, label) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };
  const hideTooltip = () => setTooltip(null);

  const handleLogout = () => {
    clearAuth();
    // Hard reload — lý do xem chú thích tương tự ở app/page.js
    window.location.href = "/";
  };

  // "Quay lại" đưa về đúng dashboard theo role — admin về /admin, customer
  // về /dashboard. Đặt trên cùng menu vì /settings là 1 khu vực tách biệt,
  // không phải route con của dashboard/admin, nên cần lối ra rõ ràng.
  const backHref = isAdmin() ? "/admin/dashboard" : "/dashboard";

  return (
    <>
      <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
        <div className="app-sidebar__top">
          {!collapsed && (
            <Logo className="app-sidebar__logo" size={32} href={backHref} />
          )}
          <button
            onClick={toggleSidebar}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            className="app-sidebar__toggle"
          >
            <Menu size={20} />
          </button>
        </div>

        <Link
          href={backHref}
          className="app-nav__link app-search-toggle"
          onMouseEnter={(e) => showTooltip(e, "Quay lại")}
          onMouseLeave={hideTooltip}
        >
          <span className="app-nav__icon">
            <ArrowLeft size={18} />
          </span>
          {!collapsed && <span className="app-nav__label">Quay lại</span>}
        </Link>

        {collapsed ? (
          <button
            onClick={expandAndFocusSearch}
            className="app-nav__link app-search-toggle"
            aria-label="Tìm trong menu"
            onMouseEnter={(e) => showTooltip(e, "Tìm trong menu")}
            onMouseLeave={hideTooltip}
          >
            <span className="app-nav__icon">
              <Search size={20} />
            </span>
          </button>
        ) : (
          <div className="app-search">
            <Search size={16} className="app-search__icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm trong menu..."
              className="app-search__input"
            />
          </div>
        )}

        <nav className="app-nav">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav__link ${isActive ? "is-active" : ""}`}
                onMouseEnter={(e) => showTooltip(e, item.label)}
                onMouseLeave={hideTooltip}
              >
                <span className="app-nav__icon">
                  <Icon size={20} />
                </span>
                {!collapsed && (
                  <span className="app-nav__label">{item.label}</span>
                )}
              </Link>
            );
          })}
          {query.trim() && filteredItems.length === 0 && (
            <p className="app-nav__empty">Không tìm thấy mục nào</p>
          )}
        </nav>

        <div className="app-sidebar__footer">
          {!collapsed && (
            <div className="app-sidebar__profile" style={{ cursor: "default" }}>
              <span className="app-avatar-circle">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" />
                ) : (
                  (user?.name || "?").trim().charAt(0).toUpperCase()
                )}
              </span>
              <span className="app-sidebar__profile-text">
                <span className="app-avatar-name">{user?.name}</span>
                <span className="app-avatar-role">{user?.email}</span>
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="app-sidebar__logout"
            aria-label="Đăng xuất"
            onMouseEnter={(e) => showTooltip(e, "Đăng xuất")}
            onMouseLeave={hideTooltip}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {tooltip &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="app-tooltip"
            style={{ top: tooltip.top, left: tooltip.left }}
          >
            {tooltip.label}
          </div>,
          document.body,
        )}
    </>
  );
}
