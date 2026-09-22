"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Megaphone,
  Gift,
  Zap,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  X,
  Send,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";
import { notificationAPI } from "@/lib/api";
import { getUser } from "@/lib/auth";
import "./NotificationBell.css";

const formatTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'unread' | 'promo' | 'system'
  const [bannerDismissedId, setBannerDismissedId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);

    if (u) {
      loadNotifications();
    }

    const handleUserUpdate = (e) => {
      const nextUser = e.detail;
      setUser(nextUser);
      if (nextUser) {
        loadNotifications();
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    window.addEventListener("vinatap:user-updated", handleUserUpdate);

    // Tự động làm mới mỗi 45 giây nếu đã đăng nhập
    const interval = setInterval(() => {
      if (getUser()) {
        loadNotifications();
      }
    }, 45000);

    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdate);
      clearInterval(interval);
    };
  }, []);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    const currentUser = getUser();
    if (!currentUser) return;
    try {
      const res = await notificationAPI.getMy();
      if (res && res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // Unauthenticated or network error silently ignored
    }
  };

  const handleMarkAsRead = async (id = "all") => {
    try {
      await notificationAPI.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  };

  const handleItemClick = (n) => {
    if (!n.is_read) {
      handleMarkAsRead(n.id);
    }
    if (n.link) {
      setOpen(false);
      const targetLink =
        n.link.startsWith("/admin") && user?.role !== "admin"
          ? "/customer/orders"
          : n.link;
      router.push(targetLink);
    }
  };

  const copyVoucher = (code) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      }
    } catch (e) {
      console.warn("Clipboard access not available:", e);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!mounted || !user) return null;

  // Lọc thông báo theo tab
  const filteredNotifications = notifications.filter((n) => {
    if (filterTab === "unread") return !n.is_read;
    if (filterTab === "promo") return n.type === "promo";
    if (filterTab === "system") return n.type === "system" || n.type === "feature";
    return true;
  });

  // Lấy thông báo chưa đọc mới nhất để hiện Banner Nổi Đỉnh Trang
  const latestUnread = notifications.find((n) => !n.is_read);
  const showBanner =
    latestUnread && bannerDismissedId !== latestUnread.id && !open;

  return (
    <>
      {/* GLOBAL TOP ANNOUNCEMENT PILL BANNER */}
      {showBanner && (
        <div
          className={`global-notif-banner global-notif-banner--${latestUnread.type || "custom"}`}
        >
          {latestUnread.type === "promo" ? (
            <Gift size={16} />
          ) : (
            <Megaphone size={16} />
          )}
          <span className="banner-title">{latestUnread.title}</span>
          <button
            className="btn-banner-action"
            onClick={() => {
              setOpen(true);
              handleMarkAsRead(latestUnread.id);
            }}
          >
            Xem ngay
          </button>
          <button
            className="btn-banner-close"
            onClick={() => setBannerDismissedId(latestUnread.id)}
            title="Đóng thông báo"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="notif-bell-container" ref={dropdownRef}>
        <button
          className="notif-bell-trigger"
          onClick={() => setOpen(!open)}
          title="Thông báo"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notif-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            <div
              className="notif-backdrop-overlay"
              onClick={() => setOpen(false)}
            />
            <div className="notif-dropdown-popover">
              <div className="notif-sheet-handle" />

              {/* Header */}
              <div className="notif-popover-header">
                <div className="notif-header-title">
                  <Bell size={18} className="text-blue" />
                  <h4>Thông Báo VinaTap</h4>
                  {unreadCount > 0 && (
                    <span className="notif-header-count">{unreadCount} mới</span>
                  )}
                </div>
                <div className="notif-header-actions">
                  {unreadCount > 0 && (
                    <button
                      className="notif-btn-readall"
                      onClick={() => handleMarkAsRead("all")}
                      title="Đánh dấu tất cả là đã đọc"
                    >
                      <CheckCheck size={14} /> Đọc tất cả
                    </button>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      href="/admin/notifications"
                      className="notif-header-admin-btn"
                      onClick={() => setOpen(false)}
                      title="Giao diện quản lý & gửi thông báo"
                    >
                      <Send size={13} /> Gửi tin
                    </Link>
                  )}
                  <button
                    type="button"
                    className="notif-btn-close"
                    onClick={() => setOpen(false)}
                    title="Đóng"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="notif-tabs-bar">
                <button
                  type="button"
                  className={`notif-tab-item ${filterTab === "all" ? "active" : ""}`}
                  onClick={() => setFilterTab("all")}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  type="button"
                  className={`notif-tab-item ${filterTab === "unread" ? "active" : ""}`}
                  onClick={() => setFilterTab("unread")}
                >
                  Chưa đọc {unreadCount > 0 ? `(${unreadCount})` : ""}
                </button>
                <button
                  type="button"
                  className={`notif-tab-item ${filterTab === "system" ? "active" : ""}`}
                  onClick={() => setFilterTab("system")}
                >
                  Hệ thống
                </button>
                <button
                  type="button"
                  className={`notif-tab-item ${filterTab === "promo" ? "active" : ""}`}
                  onClick={() => setFilterTab("promo")}
                >
                  Ưu đãi
                </button>
              </div>

              {/* Popover Body */}
              <div className="notif-popover-body">
                {filteredNotifications.length === 0 ? (
                  <div className="notif-empty-state">
                    <div className="notif-empty-icon-circle">
                      <Inbox size={32} className="text-muted" />
                    </div>
                    <p className="notif-empty-title">
                      {filterTab === "unread"
                        ? "Tuyệt vời! Bạn đã đọc hết mọi thông báo."
                        : filterTab === "promo"
                        ? "Chưa có ưu đãi nào mới."
                        : filterTab === "system"
                        ? "Hệ thống chưa có cảnh báo nào."
                        : "Bạn chưa có thông báo nào mới."}
                    </p>
                    <span className="notif-empty-sub">
                      Các cập nhật về thẻ NFC, đơn hàng và sự kiện sẽ hiển thị tại đây.
                    </span>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin/notifications"
                        className="notif-empty-admin-cta"
                        onClick={() => setOpen(false)}
                      >
                        <Send size={13} /> Tạo thông báo mới ngay
                      </Link>
                    )}
                  </div>
                ) : (
                  filteredNotifications.map((n) => {
                    const payload = n.payload || {};
                    const isPromo = n.type === "promo";
                    const isSystem = n.type === "system";
                    const isFeature = n.type === "feature";

                    return (
                      <div
                        key={n.id}
                        className={`notif-item-card ${!n.is_read ? "unread" : ""}`}
                        onClick={() => handleItemClick(n)}
                      >
                        <div className="notif-item-icon">
                          {isSystem && (
                            <Megaphone size={18} className="icon-system" />
                          )}
                          {isPromo && <Gift size={18} className="icon-promo" />}
                          {isFeature && <Zap size={18} className="icon-feature" />}
                          {!isSystem && !isPromo && !isFeature && (
                            <AlertTriangle size={18} className="icon-custom" />
                          )}
                        </div>

                        <div className="notif-item-content">
                          <div className="notif-item-top">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-item-time">
                              {formatTime(n.created_at)}
                            </span>
                          </div>

                          <p className="notif-item-text">{n.content}</p>

                          {/* DYNAMIC CARD RENDER: PROMO VOUCHER CARD */}
                          {isPromo && payload.voucher_code && (
                            <div className="notif-voucher-box">
                              <div className="voucher-code-wrap">
                                <span className="voucher-label">MÃ VOUCHER:</span>
                                <code className="voucher-code">
                                  {payload.voucher_code}
                                </code>
                              </div>

                              <div className="voucher-actions">
                                <button
                                  type="button"
                                  className="btn-copy-code"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyVoucher(payload.voucher_code);
                                  }}
                                >
                                  {copiedCode === payload.voucher_code ? (
                                    <>
                                      <Check size={12} /> Đã chép
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} /> Sao chép
                                    </>
                                  )}
                                </button>
                                {payload.discount_amount && (
                                  <span className="voucher-discount-badge">
                                    {payload.discount_amount}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC CARD RENDER: SYSTEM MAINTENANCE BADGE */}
                          {isSystem && (payload.m_start || payload.m_end) && (
                            <div className="notif-maint-box">
                              <Clock size={13} />
                              <span>
                                Dự kiến: {payload.m_start || "N/A"} →{" "}
                                {payload.m_end || "N/A"}
                              </span>
                            </div>
                          )}

                          {/* LINK ACTION */}
                          {n.link && (
                            <div className="notif-item-link-wrap">
                              <span className="notif-item-link">
                                Xem chi tiết <ExternalLink size={12} />
                              </span>
                            </div>
                          )}
                        </div>

                        {!n.is_read && <span className="notif-unread-dot" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Popover Footer */}
              {user?.role === "admin" && (
                <div className="notif-popover-footer">
                  <Link
                    href="/admin/notifications"
                    className="notif-footer-link"
                    onClick={() => setOpen(false)}
                  >
                    <Send size={13} />
                    <span>Quản lý &amp; Gửi thông báo hệ thống</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
