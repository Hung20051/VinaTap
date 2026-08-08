"use client";

import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { notificationAPI } from "../lib/api";
import { getUser } from "../lib/auth";
import "./NotificationBell.css";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [bannerDismissedId, setBannerDismissedId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);
    if (!u) return;

    loadNotifications();

    // Tự động làm mới mỗi 30 giây
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
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

  const copyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!mounted || !user) return null;

  // Lấy thông báo chưa đọc mới nhất để hiện Banner Nổi Đỉnh Trang (Global Pill Banner)
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
          onClick={() => {
            setOpen(!open);
            if (!open && unreadCount > 0) {
              handleMarkAsRead("all");
            }
          }}
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
          <div className="notif-dropdown-popover">
            <div className="notif-popover-header">
              <div className="notif-header-title">
                <Bell size={18} className="text-blue" />
                <h4>Thông Báo VinaTap</h4>
              </div>
              {unreadCount > 0 && (
                <button
                  className="notif-btn-readall"
                  onClick={() => handleMarkAsRead("all")}
                >
                  <CheckCheck size={14} /> Đọc tất cả
                </button>
              )}
            </div>

            <div className="notif-popover-body">
              {notifications.length === 0 ? (
                <div className="notif-empty-state">
                  <Bell size={36} className="text-muted" />
                  <p>Bạn chưa có thông báo nào mới.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const payload = n.payload || {};
                  const isPromo = n.type === "promo";
                  const isSystem = n.type === "system";
                  const isFeature = n.type === "feature";

                  return (
                    <div
                      key={n.id}
                      className={`notif-item-card ${!n.is_read ? "unread" : ""}`}
                      onClick={() => {
                        if (!n.is_read) handleMarkAsRead(n.id);
                      }}
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
                            {new Date(n.created_at).toLocaleDateString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
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
                          <a
                            href={n.link}
                            className="notif-item-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Xem chi tiết <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
