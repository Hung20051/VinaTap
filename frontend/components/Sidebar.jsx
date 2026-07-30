"use client";

// Sidebar dùng chung cho mọi khu vực có đăng nhập (customer dashboard,
// admin dashboard sau này...). Component KHÔNG biết gì về role — chỉ
// nhận `navItems` (mỗi role tự quyết định menu của mình ở trang gọi nó)
// và render logo, ô tìm kiếm, danh sách nav, avatar + nút đăng xuất.
//
// Thiết kế theo mẫu: sidebar tối màu, thu gọn còn icon kèm tooltip nổi
// bên phải, avatar bấm vào đi thẳng tới trang Cài đặt (không còn dropdown
// như bản trước), nút Đăng xuất tách riêng ở cuối.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LogOut, Menu } from "lucide-react";
import Logo from "./Logo";
import {
  getSidebarCollapsed,
  setSidebarCollapsed as persistSidebarCollapsed,
} from "../lib/prefs";
import { t } from "../lib/i18n";
import "../styles/sidebar.css";

/**
 * @param {Array<{href: string, icon: React.ReactNode, label: string}>} navItems
 *        Danh sách mục nav — mỗi role (customer/admin) tự truyền vào,
 *        icon là 1 React element (vd: <LayoutDashboard size={20} />).
 * @param {object} user — user hiện tại (avatar_url, name)
 * @param {string} lang — "vi" | "en"
 * @param {string} roleLabel — dòng phụ dưới tên trong khối avatar (vd:
 *        "Khách hàng" / "Quản trị viên") — mỗi trang tự truyền vào.
 * @param {string} settingsHref — route trang Cài đặt (mặc định "/settings")
 * @param {() => void} onLogout
 */
export default function Sidebar({
  navItems = [],
  user,
  lang = "vi",
  roleLabel,
  settingsHref = "/settings",
  onLogout,
}) {
  const pathname = usePathname();

  // ─── Sidebar thu gọn / mở rộng ─────────────────────────────
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Đọc localStorage ở effect (chạy sau mount trên client) thay vì
    // trong useState() initializer, để tránh lệch nội dung giữa lần
    // render server và lần hydrate client.
    setCollapsed(getSidebarCollapsed());
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      persistSidebarCollapsed(next);
      return next;
    });
  };

  // ─── Ô tìm kiếm — lọc nhanh menu theo tên ───────────────────
  // Chỉ lọc phía client trong navItems hiện có, không gọi API.
  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);

  // Lúc thu gọn, ô input không đủ chỗ hiển thị nên chỉ còn icon kính lúp
  // (giống ảnh mẫu) — bấm vào thì mở rộng sidebar ra rồi focus luôn vào
  // ô input, thay vì mất hẳn khả năng tìm kiếm lúc đang thu gọn.
  const expandAndFocusSearch = () => {
    setCollapsed(false);
    persistSidebarCollapsed(false);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const filteredItems = query.trim()
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : navItems;

  // ─── Tooltip nổi khi sidebar thu gọn ─────────────────────────
  // .app-sidebar có overflow:hidden để phục vụ animation thu/mở, nên
  // tooltip đặt position:absolute bên trong sẽ bị cắt mất — phải portal
  // ra <body> với position:fixed, định vị bằng getBoundingClientRect()
  // của icon đang hover (giống cách avatar-menu bản trước từng làm).
  const [tooltip, setTooltip] = useState(null); // { label, top, left } | null

  const showTooltip = (e, label) => {
    if (!collapsed) return; // mở rộng thì đã có label kế icon, không cần tooltip
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
        {/* Logo + nút hamburger thu/mở sidebar */}
        <div className="app-sidebar__top">
          {!collapsed && (
            <Logo
              className="app-sidebar__logo"
              size={32}
              href="/dashboard"
              // Trang chủ "/" tự redirect ngược về /dashboard nếu đã đăng
              // nhập (xem app/page.js) — link thẳng /dashboard ở đây để
              // tránh hiệu ứng nháy (nhảy qua / rồi bị đá lại /dashboard).
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

        {/* Tìm kiếm — mở rộng thì ô input đầy đủ, thu gọn thì chỉ còn
            icon kính lúp (bấm vào tự mở rộng sidebar + focus ô input) */}
        {collapsed ? (
          <button
            onClick={expandAndFocusSearch}
            className="app-nav__link app-search-toggle"
            aria-label={t(lang, "searchMenu")}
            onMouseEnter={(e) => showTooltip(e, t(lang, "searchMenu"))}
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
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "searchMenu")}
              className="app-search__input"
            />
          </div>
        )}

        <nav className="app-nav">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav__link ${
                pathname === item.href ? "is-active" : ""
              }`}
              onMouseEnter={(e) => showTooltip(e, item.label)}
              onMouseLeave={hideTooltip}
            >
              <span className="app-nav__icon">{item.icon}</span>
              {!collapsed && (
                <span className="app-nav__label">{item.label}</span>
              )}
            </Link>
          ))}
          {query.trim() && filteredItems.length === 0 && (
            <p className="app-nav__empty">{t(lang, "noResults")}</p>
          )}
        </nav>

        <div className="app-sidebar__footer">
          {/* Avatar — bấm để đi tới trang Cài đặt. Ẩn hẳn lúc sidebar thu
              gọn (chỉ còn icon Đăng xuất ở dưới, giống ảnh mẫu) thay vì
              chỉ ẩn phần chữ tên như trước.
              TODO: /settings hiện CHƯA có route/trang thật — cần xây
              trang Cài đặt riêng (dùng lại logic đổi ngôn ngữ/theme/hồ
              sơ đang nằm trong modal settingsOpen ở dashboard/page.js).
              "Tìm hiểu thêm" (learnMoreOpen) cũng đang mồ côi tương tự,
              chưa có điểm vào từ sidebar mới. */}
          {!collapsed && (
            <Link
              href={settingsHref}
              className="app-sidebar__profile"
              onMouseEnter={(e) => showTooltip(e, t(lang, "settings"))}
              onMouseLeave={hideTooltip}
            >
              <span className="app-avatar-circle">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" />
                ) : (
                  (user?.name || "?").trim().charAt(0).toUpperCase()
                )}
              </span>
              <span className="app-sidebar__profile-text">
                <span className="app-avatar-name">
                  {user?.name || t(lang, "account")}
                </span>
                <span className="app-avatar-role">
                  {roleLabel || t(lang, "account")}
                </span>
              </span>
            </Link>
          )}

          {/* Đăng xuất — nút riêng, luôn hiện kể cả lúc thu gọn */}
          <button
            onClick={onLogout}
            className="app-sidebar__logout"
            aria-label={t(lang, "logout")}
            onMouseEnter={(e) => showTooltip(e, t(lang, "logout"))}
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
