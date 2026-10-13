"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  X,
  TrendingUp,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";
import { getLang } from "@/lib/prefs";
import "@/styles/admin-sidebar.css";

export default function AdminSidebar({
  user,
  lang: langProp = "vi",
  onLogout,
  isOpen = false,
  onClose,
}) {
  const pathname = usePathname();
  const [lang, setLang] = useState("vi");
  const [mounted, setMounted] = useState(false);

  // Danh mục điều hướng trực tiếp — bấm là chuyển trang ngay, không dùng mũi tên dropdown
  const adminNavSections = [
    {
      id: "main",
      items: [
        {
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          label: lang === "vi" ? "Tổng quan Dashboard" : "Executive Dashboard",
        },
        {
          href: "/admin/analytics",
          icon: TrendingUp,
          label: lang === "vi" ? "Lượt truy cập & Nguồn khách" : "Traffic & Acquisition",
        },
        {
          href: "/admin/articles",
          icon: FileText,
          label: lang === "vi" ? "Quản lý bài viết & Cẩm nang" : "Articles & Travel Guides",
        },
      ],
    },
    {
      id: "system",
      title: lang === "vi" ? "Hệ thống & Cấu hình" : "System & Settings",
      items: [
        {
          href: "/admin/system-settings",
          icon: Settings,
          label: lang === "vi" ? "Cài đặt & Cấu hình website" : "System Settings",
        },
      ],
    },
  ];

  // Helper kiểm tra route đang kích hoạt
  const isItemActive = (href) => {
    if (!pathname) return false;
    if (pathname === href) return true;
    if (href !== "/admin/dashboard" && href !== "/admin" && pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setMounted(true);
    setLang(getLang());
    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  // Khóa scroll trang đằng sau khi mở Drawer trên Mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Lớp nền mờ trên Mobile */}
      <div
        className={`admin-sidebar-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
        {/* Header: Logo thương hiệu VinaTap & Nút đóng */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <Logo size={28} showText={false} />
            <div className="admin-sidebar-brand-text">
              <span className="brand-name">VinaTap</span>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              className="admin-sidebar-close-btn"
              onClick={onClose}
              aria-label="Đóng menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nội dung menu cuộn độc lập — link trực tiếp, không mũi tên */}
        <div className="admin-sidebar-scroll">
          <nav className="admin-sidebar-nav">
            {adminNavSections.map((sec) => (
              <div key={sec.id} className="admin-nav-group">
                {sec.title && (
                  <div className="admin-nav-section-title">{sec.title}</div>
                )}
                <div className="admin-nav-group-items">
                  {sec.items.map((item) => {
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`admin-nav-link ${active ? "is-active" : ""}`}
                      >
                        <item.icon size={17} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer: User Profile & Đăng xuất */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-cell">
            <div className="admin-user-avatar">
              {user?.full_name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">
                {user?.full_name || "Admin VinaTap"}
              </div>
              <div className="admin-user-role">
                <ShieldCheck size={11} /> {user?.role || "Quản trị viên"}
              </div>
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              className="admin-logout-btn"
              onClick={onLogout}
              title={lang === "vi" ? "Đăng xuất" : "Logout"}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
