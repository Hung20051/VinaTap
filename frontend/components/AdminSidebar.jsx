"use client";

// Sidebar RIÊNG cho khu vực admin — tách hẳn khỏi components/Sidebar.jsx
// (dùng cho customer dashboard) vì admin có menu cố định, không cần
// truyền navItems linh hoạt theo role như Sidebar.jsx generic. Dùng lại
// toàn bộ CSS shell (thu/mở, tooltip, avatar, logout) từ styles/sidebar.css
// để đồng bộ giao diện, không viết lại CSS collapse/animation từ đầu.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  MapPin,
  Users,
  Images,
  Sticker,
  BarChart3,
  Settings,
  Search,
  LogOut,
  Menu,
} from "lucide-react";
import Logo from "./Logo";
import {
  getSidebarCollapsed,
  setSidebarCollapsed as persistSidebarCollapsed,
} from "../lib/prefs";
import "../styles/sidebar.css";

// Menu cố định — mỗi mục ứng với 1 folder trong app/admin/*. Đổi tên/route
// ở đây là đủ, không cần sửa gì thêm.
const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/admin/revenue", icon: DollarSign, label: "Doanh thu" },
  { href: "/admin/nfc-cards", icon: CreditCard, label: "Serial NFC" },
  { href: "/admin/provinces", icon: MapPin, label: "Tỉnh & Địa danh" },
  { href: "/admin/users", icon: Users, label: "Người dùng" },
  { href: "/admin/albums", icon: Images, label: "Album & Kiểm duyệt" },
  { href: "/admin/stickers", icon: Sticker, label: "Sticker theme" },
  { href: "/admin/analytics", icon: BarChart3, label: "Lượt truy cập" },
  { href: "/admin/settings", icon: Settings, label: "Cài đặt hệ thống" },
];

export default function AdminSidebar({ user, onLogout }) {
  const pathname = usePathname();

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

  // Tìm kiếm — lọc nhanh 9 mục theo tên, giống Sidebar.jsx customer
  const [query, setQuery] = useState("");
  const filteredItems = query.trim()
    ? ADMIN_NAV_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : ADMIN_NAV_ITEMS;

  const expandAndFocusSearch = () => {
    setCollapsed(false);
    persistSidebarCollapsed(false);
  };

  // Tooltip nổi khi thu gọn — portal ra <body>, xem giải thích chi tiết ở
  // components/Sidebar.jsx (cùng cơ chế, không lặp lại comment ở đây)
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

  return (
    <>
      <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
        <div className="app-sidebar__top">
          {!collapsed && (
            <Logo
              className="app-sidebar__logo"
              size={32}
              href="/admin/dashboard"
            />
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
            // Active khi pathname trùng chính xác HOẶC là route con của mục
            // này (vd /admin/provinces/123 vẫn highlight "Tỉnh & Địa danh")
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
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
                  (user?.name || "A").trim().charAt(0).toUpperCase()
                )}
              </span>
              <span className="app-sidebar__profile-text">
                <span className="app-avatar-name">
                  {user?.name || "Admin VinaTap"}
                </span>
                <span className="app-avatar-role">Quản trị</span>
              </span>
            </div>
          )}

          <button
            onClick={onLogout}
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
