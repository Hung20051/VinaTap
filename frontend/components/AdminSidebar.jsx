"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MapPin,
  Images,
  DollarSign,
  BarChart3,
  Settings,
  Sticker,
  Search,
  LogOut,
  Menu,
} from "lucide-react";
import Logo from "./Logo";
import {
  getSidebarCollapsed,
  setSidebarCollapsed as persistSidebarCollapsed,
  getLang,
} from "../lib/prefs";
import { t } from "../lib/i18n";
import "../styles/sidebar.css";

export default function AdminSidebar({ user, onLogout }) {
  const pathname = usePathname();

  const [lang, setLang] = useState("vi");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(getSidebarCollapsed());
    setLang(getLang());

    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const adminNavItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: t(lang, "adminOverview") },
    { href: "/admin/revenue", icon: DollarSign, label: t(lang, "adminRevenue") },
    { href: "/admin/nfc-cards", icon: CreditCard, label: t(lang, "adminNfcCards") },
    { href: "/admin/provinces", icon: MapPin, label: t(lang, "adminProvinces") },
    { href: "/admin/users", icon: Users, label: t(lang, "adminUsers") },
    { href: "/admin/albums", icon: Images, label: t(lang, "adminAlbums") },
    { href: "/admin/stickers", icon: Sticker, label: t(lang, "adminStickers") },
    { href: "/admin/analytics", icon: BarChart3, label: t(lang, "adminAnalytics") },
    { href: "/admin/system-settings", icon: Settings, label: t(lang, "adminSystemSettings") },
  ];

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      persistSidebarCollapsed(next);
      return next;
    });
  };

  const [query, setQuery] = useState("");
  const filteredNavItems = adminNavItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="app-sidebar__top">
        {!collapsed && (
          <Logo className="app-sidebar__logo" href="/admin/dashboard" />
        )}
        <button
          type="button"
          className="app-sidebar__toggle"
          onClick={toggleSidebar}
          title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
        >
          <Menu size={20} />
        </button>
      </div>

      {!collapsed && (
        <div className="app-search">
          <Search size={15} className="app-search__icon" />
          <input
            type="text"
            className="app-search__input"
            placeholder={t(lang, "searchMenu")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      <nav className="app-nav">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav__link ${isActive ? "is-active" : ""}`}
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
      </nav>

      <div className="app-sidebar__footer">
        <Link href="/settings" className="app-sidebar__profile">
          <div className="app-avatar-circle">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <span>{user?.name?.[0]?.toUpperCase() || "A"}</span>
            )}
          </div>
          {!collapsed && (
            <div className="app-sidebar__profile-text">
              <span className="app-avatar-name">
                {user?.name || "Admin"}
              </span>
              <span className="app-avatar-role">Quản trị viên</span>
            </div>
          )}
        </Link>
        {onLogout && (
          <button
            type="button"
            className="app-sidebar__logout"
            onClick={onLogout}
            title={t(lang, "logout")}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
