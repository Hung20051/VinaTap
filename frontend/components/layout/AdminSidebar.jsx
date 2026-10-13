"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Images,
  DollarSign,
  Settings,
  Sticker,
  LogOut,
  X,
  Ticket,
  Bell,
  Package,
  ChevronDown,
  TrendingUp,
  FileText,
  BarChart3,
  ShieldCheck,
  Megaphone,
} from "lucide-react";
import Logo from "./Logo";
import { getLang } from "@/lib/prefs";
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

  // 7 Module Quản trị cốt lõi theo đúng kiến trúc chuẩn VinaTap
  const adminSections = [
    {
      id: "sec-01",
      title: lang === "vi" ? "01. Tổng Quan Dashboard" : "01. Executive Dashboard",
      icon: LayoutDashboard,
      items: [
        {
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          label: lang === "vi" ? "Bảng điều khiển trung tâm" : "Main Dashboard",
        },
      ],
    },
    {
      id: "sec-02",
      title: lang === "vi" ? "02. Dữ Liệu & Lưu Lượng" : "02. Data & Analytics",
      icon: TrendingUp,
      items: [
        {
          href: "/admin/analytics",
          icon: TrendingUp,
          label: lang === "vi" ? "Phân tích lưu lượng khách" : "Traffic & Acquisition",
        },
      ],
    },
    {
      id: "sec-03",
      title: lang === "vi" ? "03. Nội Dung & SEO" : "03. Content & SEO",
      icon: FileText,
      items: [
        {
          href: "/admin/articles",
          icon: FileText,
          label: lang === "vi" ? "Quản lý bài viết & SEO" : "Articles & SEO CMS",
        },
      ],
    },
    {
      id: "sec-04",
      title: lang === "vi" ? "04. Điểm Đến & Cẩm Nang" : "04. Destinations & Guides",
      icon: MapPin,
      items: [
        {
          href: "/admin/provinces",
          icon: MapPin,
          label: lang === "vi" ? "63 Tỉnh thành & Điểm đến" : "63 Provinces & Places",
        },
        {
          href: "/admin/albums",
          icon: Images,
          label: lang === "vi" ? "Duyệt album ảnh du khách" : "Trip Albums",
        },
        {
          href: "/admin/stickers",
          icon: Sticker,
          label: lang === "vi" ? "Nhãn dán & Sticker du lịch" : "Travel Stickers",
        },
      ],
    },
    {
      id: "sec-05",
      title: lang === "vi" ? "05. Affiliate & Doanh Thu" : "05. Affiliate & Revenue",
      icon: DollarSign,
      items: [
        {
          href: "/admin/revenue",
          icon: DollarSign,
          label: lang === "vi" ? "Báo cáo doanh thu & Affiliate" : "Revenue & Affiliate",
        },
        {
          href: "/admin/products",
          icon: Package,
          label: lang === "vi" ? "Sản phẩm & Bản đồ du lịch" : "Products & Maps",
        },
      ],
    },
    {
      id: "sec-06",
      title: lang === "vi" ? "06. Quảng Cáo & Chiến Dịch" : "06. Ads & Campaigns",
      icon: Ticket,
      items: [
        {
          href: "/admin/vouchers",
          icon: Ticket,
          label: lang === "vi" ? "Chiến dịch & Voucher ưu đãi" : "Campaigns & Vouchers",
        },
      ],
    },
    {
      id: "sec-07",
      title: lang === "vi" ? "07. Hệ Thống & Cấu Hình" : "07. System & Settings",
      icon: Settings,
      items: [
        {
          href: "/admin/users",
          icon: Users,
          label: lang === "vi" ? "Quản lý người dùng & Admin" : "User Management",
        },
        {
          href: "/admin/system-settings",
          icon: Settings,
          label: lang === "vi" ? "Cài đặt & Cấu hình website" : "System Settings",
        },
        {
          href: "/admin/notifications",
          icon: Bell,
          label: lang === "vi" ? "Thông báo & Cảnh báo" : "Notifications & Alerts",
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

  // Tự động mở nhóm chứa trang hiện tại
  const findActiveSectionId = () => {
    for (const section of adminSections) {
      if (section.items.some((item) => isItemActive(item.href))) {
        return section.id;
      }
    }
    return "sec-01";
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
              <span className="brand-badge">ADMIN CMS</span>
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

        {/* Nội dung menu cuộn độc lập */}
        <div className="admin-sidebar-scroll">
          <nav className="admin-sidebar-nav">
            {adminSections.map((section) => {
              const isOpen = !!openSections[section.id];
              const hasActiveChild = section.items.some((item) =>
                isItemActive(item.href)
              );

              return (
                <div key={section.id} className="admin-nav-group">
                  <button
                    type="button"
                    className={`admin-nav-group-header ${hasActiveChild ? "has-active" : ""}`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="admin-nav-group-title">
                      <section.icon size={15} className="group-icon" />
                      <span>{section.title}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`group-chevron ${isOpen ? "is-open" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="admin-nav-group-items">
                      {section.items.map((item) => {
                        const active = isItemActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`admin-nav-link ${active ? "is-active" : ""}`}
                          >
                            <item.icon size={16} className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
