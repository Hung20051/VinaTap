"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User as UserIcon,
  KeyRound,
  Palette,
  LifeBuoy,
  FileText,
  Info,
  Menu,
  Search,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { clearAuth, isAdmin } from "@/lib/auth";
import { getLang, setSidebarCollapsed, getSidebarCollapsed } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "@/styles/sidebar.css";

export default function SettingsSidebar({ user: userProp }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState("vi");
  const [user, setUser] = useState(userProp);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setUser(userProp);
  }, [userProp]);

  useEffect(() => {
    setCollapsed(getSidebarCollapsed());
    setLang(getLang());

    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const navItems = [
    { href: "/settings/account", icon: <UserIcon size={20} />, label: t(lang, "account") },
    { href: "/settings/password", icon: <KeyRound size={20} />, label: t(lang, "password") },
    { href: "/settings/appearance", icon: <Palette size={20} />, label: t(lang, "appearance") },
    { href: "/settings/support", icon: <LifeBuoy size={20} />, label: t(lang, "support") },
    { href: "/settings/legal", icon: <FileText size={20} />, label: t(lang, "legal") },
    { href: "/settings/about", icon: <Info size={20} />, label: t(lang, "about") },
  ];

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      setSidebarCollapsed(next);
      return next;
    });
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  const handleBackToDashboard = () => {
    if (isAdmin()) {
      router.push("/admin/dashboard");
    } else {
      router.push("/customer/dashboard");
    }
  };

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="app-sidebar__top">
        {!collapsed && <Logo className="app-sidebar__logo" href="/" />}
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
        <button
          type="button"
          className="app-sidebar__back-link"
          onClick={handleBackToDashboard}
        >
          <ChevronLeft size={15} /> Quay lại trang chủ
        </button>
      )}

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
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav__link ${isActive ? "is-active" : ""}`}
            >
              <span className="app-nav__icon">{item.icon}</span>
              {!collapsed && (
                <span className="app-nav__label">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="app-sidebar__footer">
        <div className="app-sidebar__profile">
          <div className="app-avatar-circle">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <span>
                {user?.full_name?.[0]
                  ? user.full_name[0].toUpperCase()
                  : user?.name?.[0]
                  ? user.name[0].toUpperCase()
                  : "U"}
              </span>
            )}
          </div>
          {!collapsed && (
            <div className="app-sidebar__profile-text">
              <span className="app-avatar-name">
                {user?.full_name || user?.name || "Hưng Nguyễn"}
              </span>
              <span className="app-avatar-role">
                {isAdmin() ? t(lang, "admin") : t(lang, "account")}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="app-sidebar__logout"
          onClick={handleLogout}
          title={t(lang, "logout")}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
