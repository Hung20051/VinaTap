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
  LogOut,
  X,
  Ticket,
  Bell,
  Package,
  ChevronDown,
  TrendingUp,
  FolderTree,
  Shield,
  FileText,
} from "lucide-react";
import Logo from "./Logo";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "@/styles/sidebar.css";

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

  // Danh mục điều hướng chuẩn hệ sinh thái Du Lịch VinaTap
  const adminSections = [
    {
      id: "overview",
      title: lang === "vi" ? "Tổng Quan & Dữ Liệu" : "Overview & Analytics",
      icon: BarChart3,
      items: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: lang === "vi" ? "Bảng điều khiển" : "Dashboard" },
        { href: "/admin/analytics", icon: TrendingUp, label: lang === "vi" ? "Lượt truy cập & Nguồn khách" : "Traffic & Acquisition" },
        { href: "/admin/revenue", icon: DollarSign, label: lang === "vi" ? "Báo cáo doanh thu" : "Revenue Reports" },
      ],
    },
    {
      id: "travel",
      title: lang === "vi" ? "Điểm Đến & Cẩm Nang" : "Destinations & Guides",
      icon: MapPin,
      items: [
        { href: "/admin/provinces", icon: MapPin, label: lang === "vi" ? "63 Tỉnh thành & Điểm đến" : "Provinces & Places" },
        { href: "/admin/articles", icon: FileText, label: lang === "vi" ? "Bài viết & Cẩm nang du lịch" : "Travel Guides & CMS" },
        { href: "/admin/albums", icon: Images, label: lang === "vi" ? "Nhật ký & Album chuyến đi" : "Trip Albums & Memories" },
        { href: "/admin/stickers", icon: Sticker, label: lang === "vi" ? "Nhãn dán & Sticker du lịch" : "Travel Stickers" },
      ],
    },
    {
      id: "customers",
      title: lang === "vi" ? "Du Khách & Ưu Đãi" : "Customers & Vouchers",
      icon: Users,
      items: [
        { href: "/admin/users", icon: Users, label: lang === "vi" ? "Quản lý người dùng" : "User Management" },
        { href: "/admin/vouchers", icon: Ticket, label: lang === "vi" ? "Mã ưu đãi & Vouchers" : "Promo Vouchers" },
        { href: "/admin/products", icon: Package, label: lang === "vi" ? "Sản phẩm & Bản đồ du lịch" : "Travel Products" },
      ],
    },
    {
      id: "system",
      title: lang === "vi" ? "Hệ Thống & Cấu Hình" : "System & Settings",
      icon: Settings,
      items: [
        { href: "/admin/notifications", icon: Bell, label: lang === "vi" ? "Thông báo hệ thống" : "Notifications" },
        { href: "/admin/system-settings", icon: Settings, label: lang === "vi" ? "Cài đặt & Cấu hình" : "System Settings" },
      ],
    },
  ];

  // Helper kiểm tra route đang kích hoạt (hỗ trợ cả subroutes như /admin/orders/:id, /admin/provinces/:slug)
  const isItemActive = (href) => {
    if (!pathname) return false;
    if (pathname === href) return true;
    if (href !== "/admin/dashboard" && href !== "/admin" && pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  // Tự động mở nhóm chứa trang hiện tại
  const findActiveSectionId = () => {
    for (const section of adminSections) {
      if (section.items.some((item) => isItemActive(item.href))) {
        return section.id;
      }
    }
    return "overview";
  };

  const [openSections, setOpenSections] = useState({
    [findActiveSectionId()]: true,
  });

  useEffect(() => {
    const currentActiveId = findActiveSectionId();
    setOpenSections((prev) => ({ ...prev, [currentActiveId]: true }));
  }, [pathname]);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
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
      {/* Overlay Backdrop */}
      {isOpen && <div className="app-drawer-overlay" onClick={onClose} />}

      {/* GitHub / Mobile App Slide Drawer */}
      <aside className={`app-sidebar-drawer ${isOpen ? "is-open" : ""}`}>
        <div className="app-sidebar__top">
          <Logo className="app-sidebar__logo" href="/" />
          <button
            type="button"
            className="app-sidebar__toggle"
            onClick={onClose}
            title={t(lang, "close")}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="app-nav app-nav--accordion">
          {adminSections.map((section) => {
            const isExpanded = !!openSections[section.id];
            const SectionIcon = section.icon;
            const hasActiveChild = section.items.some(
              (item) => isItemActive(item.href),
            );

            return (
              <div
                key={section.id}
                className={`app-accordion-group ${isExpanded ? "is-expanded" : ""} ${hasActiveChild ? "has-active" : ""}`}
              >
                <button
                  type="button"
                  className="app-accordion-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="app-accordion-header__left">
                    <span className="app-accordion-header__icon">
                      <SectionIcon size={17} />
                    </span>
                    <span className="app-accordion-header__title">
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    size={15}
                    className={`app-accordion-chevron ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="app-accordion-body">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = isItemActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`app-nav__link ${isActive ? "is-active" : ""}`}
                          onClick={onClose}
                        >
                          <span className="app-nav__icon">
                            <ItemIcon size={16} />
                          </span>
                          <span className="app-nav__label">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="app-sidebar__footer">
          <Link
            href="/settings/account"
            className="app-sidebar__profile"
            onClick={onClose}
          >
            <div className="app-avatar-circle">
              {mounted && user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <span>
                  {mounted && user?.name?.[0] ? user.name[0].toUpperCase() : "A"}
                </span>
              )}
            </div>
            <div className="app-sidebar__profile-text">
              <span className="app-avatar-name">
                {mounted && user?.name ? user.name : "Admin"}
              </span>
              <span className="app-avatar-role">{t(lang, "adminRole")}</span>
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
