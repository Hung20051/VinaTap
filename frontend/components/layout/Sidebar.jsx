"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LogOut, X } from "lucide-react";
import Logo from "./Logo";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "@/styles/sidebar.css";

export default function Sidebar({
  navItems = [],
  user,
  lang: langProp = "vi",
  roleLabel,
  settingsHref = "/settings/account",
  onLogout,
  isOpen = false,
  onClose,
}) {
  const pathname = usePathname();
  const [lang, setLang] = useState("vi");
  const [query, setQuery] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && <div className="app-drawer-overlay" onClick={onClose} />}

      {/* GitHub-style Off-canvas Slide Drawer */}
      <aside className={`app-sidebar-drawer ${isOpen ? "is-open" : ""}`}>
        <div className="app-sidebar__top">
          <Logo className="app-sidebar__logo" href="/customer/dashboard" />
          <button
            type="button"
            className="app-sidebar__toggle"
            onClick={onClose}
            title="Đóng Menu"
          >
            <X size={20} />
          </button>
        </div>

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

        <nav className="app-nav">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav__link ${isActive ? "is-active" : ""}`}
                onClick={onClose}
              >
                <span className="app-nav__icon">{item.icon}</span>
                <span className="app-nav__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <Link
            href={settingsHref}
            className="app-sidebar__profile"
            onClick={onClose}
          >
            <div className="app-avatar-circle">
              {mounted && user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <span>
                  {mounted && user?.name?.[0] ? user.name[0].toUpperCase() : "U"}
                </span>
              )}
            </div>
            <div className="app-sidebar__profile-text">
              <span className="app-avatar-name">
                {mounted && user?.name ? user.name : "User"}
              </span>
              <span className="app-avatar-role">
                {roleLabel || t(lang, "account")}
              </span>
            </div>
          </Link>
          {onLogout && (
            <button
              type="button"
              className="app-sidebar__logout"
              onClick={() => {
                if (onClose) onClose();
                onLogout();
              }}
              title={t(lang, "logout")}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
