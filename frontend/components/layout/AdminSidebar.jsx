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

  // Danh mục điều hướng phân nhóm Accordion
  const adminSections = [
    {
      id: "overview",
      title: "Tổng quan & Báo cáo",
      icon: BarChart3,
      items: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
        { href: "/admin/revenue", icon: DollarSign, label: "Doanh thu" },
        { href: "/admin/analytics", icon: TrendingUp, label: "Thống kê truy cập" },
      ],
    },
    {
      id: "sales",
      title: "Bán hàng & Kho thẻ",
      icon: Package,
      items: [
        { href: "/admin/products", icon: Package, label: "Sản phẩm" },
        { href: "/admin/vouchers", icon: Ticket, label: "Vouchers" },
        { href: "/admin/nfc-cards", icon: CreditCard, label: "Mã thẻ NFC" },
      ],
    },
    {
      id: "content",
      title: "Dữ liệu & Du lịch",
      icon: MapPin,
      items: [
        { href: "/admin/provinces", icon: MapPin, label: "Tỉnh thành" },
        { href: "/admin/albums", icon: Images, label: "Albums ảnh" },
        { href: "/admin/stickers", icon: Sticker, label: "Stickers" },
      ],
    },
    {
      id: "system",
      title: "Quản trị & Hệ thống",
      icon: Settings,
      items: [
        { href: "/admin/users", icon: Users, label: "Người dùng" },
        { href: "/admin/notifications", icon: Bell, label: "Gửi thông báo" },
        { href: "/admin/system-settings", icon: Settings, label: "Cài đặt" },
      ],
    },
  ];

  // Tự động mở nhóm chứa trang hiện tại
  const findActiveSectionId = () => {
    for (const section of adminSections) {
      if (section.items.some((item) => item.href === pathname)) {
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
          <Logo className="app-sidebar__logo" href="/admin/dashboard" />
          <button
            type="button"
            className="app-sidebar__toggle"
            onClick={onClose}
            title="Đóng Menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="app-nav app-nav--accordion">
          {adminSections.map((section) => {
            const isExpanded = !!openSections[section.id];
            const SectionIcon = section.icon;
            const hasActiveChild = section.items.some(
              (item) => item.href === pathname,
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
                      const isActive = pathname === item.href;
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
              <span className="app-avatar-role">Quản Trị Viên</span>
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
