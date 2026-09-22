"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Users,
  Smartphone,
  Laptop,
  Radio,
  RefreshCw,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Compass,
  Activity,
} from "lucide-react";
import { analyticsAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminAnalytics.css";

const TIMEFRAME_OPTIONS = [
  { value: "today", label: "Hôm nay" },
  { value: "7days", label: "7 ngày qua" },
  { value: "30days", label: "30 ngày qua" },
  { value: "all", label: "Tất cả" },
];

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    total_views: 0,
    unique_visitors: 0,
    today_views: 0,
    bot_blocked_count: 0,
    nfc_scans_count: 0,
    device_stats: [],
    top_provinces: [],
    recent_views: [],
  });

  useEffect(() => {
    loadStats();
    // Tự động làm mới mỗi 60 giây
    const interval = setInterval(() => {
      loadStats(true);
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const loadStats = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const res = await analyticsAPI.getStats(timeframe);
      if (res?.stats) {
        setStats(res.stats);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Lỗi nạp thống kê truy cập:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDevicePercentage = (type) => {
    const total = stats.device_stats.reduce((acc, curr) => acc + curr.count, 0);
    if (!total) return 0;
    const found = stats.device_stats.find((d) => d.device_type === type);
    return found ? Math.round((found.count / total) * 100) : 0;
  };

  const mobilePct = getDevicePercentage("mobile");
  const desktopPct = stats.device_stats.length === 0 ? 0 : 100 - mobilePct;

  // Format relative or exact time
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="admin-analytics-container">
      {/* ─── Header ─── */}
      <div className="admin-analytics-header">
        <div className="admin-analytics-title-group">
          <div className="admin-analytics-badge-pill">
            <span className="live-dot-pulse" />
            <span>REALTIME ANALYTICS</span>
          </div>
          <h1 className="admin-analytics-title">Thống Kê Lưu Lượng Truy Cập</h1>
          <p className="admin-analytics-subtitle">
            Đo lường người dùng thực tế, lượt chạm thẻ NFC &amp; tự động ngăn chặn bot / crawler
          </p>
        </div>

        <div className="admin-analytics-actions">
          {/* Segmented Timeframe Switcher */}
          <div className="admin-analytics-timeframe-bar" role="tablist">
            <Calendar size={14} className="timeframe-icon" />
            {TIMEFRAME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`timeframe-btn ${timeframe === opt.value ? "is-active" : ""}`}
                onClick={() => setTimeframe(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className={`admin-analytics-btn-reload ${refreshing ? "is-spinning" : ""}`}
            onClick={() => loadStats(false)}
            disabled={loading || refreshing}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={15} />
            <span>{refreshing ? "Đang cập nhật..." : "Tải lại"}</span>
          </button>
        </div>
      </div>

      {/* ─── System Security Notice Bar ─── */}
      {stats.bot_blocked_count > 0 && (
        <div className="admin-analytics-notice">
          <ShieldCheck size={16} className="notice-icon" />
          <span>
            Hệ thống VinaTap Bot-Shield đã tự động phân loại và loại trừ{" "}
            <strong>{stats.bot_blocked_count}</strong> truy vấn spam/crawler để số liệu luôn chính xác 100%.
          </span>
          {lastUpdated && (
            <span className="notice-time">
              Cập nhật: {lastUpdated.toLocaleTimeString("vi-VN")}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="admin-analytics-loader-wrap">
          <DinoLoader
            fullScreen={false}
            size={180}
            text="Đang phân tích dữ liệu lưu lượng truy cập..."
            subtext="Đang tổng hợp thiết bị, lượt quét thẻ NFC và danh lam tỉnh thành"
          />
        </div>
      ) : (
        <>
          {/* ─── 4 Modern High-Impact KPI Cards ─── */}
          <div className="admin-analytics-kpi-grid">
            {/* Card 1: Tổng Lượt Xem Trang */}
            <div className="admin-kpi-modern card-blue">
              <div className="kpi-top">
                <div className="kpi-icon-wrap kpi-icon-blue">
                  <Eye size={22} />
                </div>
                <span className="kpi-badge kpi-badge-blue">
                  +{stats.today_views} hôm nay
                </span>
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Tổng Lượt Xem Trang</span>
                <div className="kpi-value-row">
                  <h2 className="kpi-value">{stats.total_views.toLocaleString("vi-VN")}</h2>
                  <span className="kpi-unit">views</span>
                </div>
                <p className="kpi-desc">Lượt tải trang từ người dùng thực</p>
              </div>
            </div>

            {/* Card 2: Khách Độc Nhất (IP Riêng Biệt) */}
            <div className="admin-kpi-modern card-emerald">
              <div className="kpi-top">
                <div className="kpi-icon-wrap kpi-icon-emerald">
                  <Users size={22} />
                </div>
                <span className="kpi-badge kpi-badge-emerald">Unique IP</span>
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Khách Xem Độc Nhất</span>
                <div className="kpi-value-row">
                  <h2 className="kpi-value">{stats.unique_visitors.toLocaleString("vi-VN")}</h2>
                  <span className="kpi-unit">khách</span>
                </div>
                <p className="kpi-desc">Thiết bị &amp; địa chỉ IP phân biệt</p>
              </div>
            </div>

            {/* Card 3: Tỷ Lệ Thiết Bị (Mobile vs Desktop) */}
            <div className="admin-kpi-modern card-orange">
              <div className="kpi-top">
                <div className="kpi-icon-wrap kpi-icon-orange">
                  <Smartphone size={22} />
                </div>
                <div className="device-pills">
                  <span className="device-chip chip-mob">📱 {mobilePct}%</span>
                  <span className="device-chip chip-pc">💻 {desktopPct}%</span>
                </div>
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Tỷ Lệ Mobile / Desktop</span>
                {/* Visual Ratio Progress Bar */}
                <div className="device-ratio-track" title={`Mobile: ${mobilePct}% | Desktop: ${desktopPct}%`}>
                  <div
                    className="device-ratio-bar mobile-fill"
                    style={{ width: `${Math.max(mobilePct, 2)}%` }}
                  />
                  <div
                    className="device-ratio-bar desktop-fill"
                    style={{ width: `${Math.max(desktopPct, 2)}%` }}
                  />
                </div>
                <div className="device-legend-row">
                  <span className="legend-item text-mob">
                    <span className="legend-dot dot-mob" /> Mobile: {mobilePct}%
                  </span>
                  <span className="legend-item text-pc">
                    <span className="legend-dot dot-pc" /> Desktop: {desktopPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Lượt Quét Thẻ NFC */}
            <div className="admin-kpi-modern card-purple">
              <div className="kpi-top">
                <div className="kpi-icon-wrap kpi-icon-purple">
                  <Radio size={22} />
                </div>
                <span className="kpi-badge kpi-badge-purple">Thẻ Vật Lý</span>
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Lượt Quét Thẻ NFC</span>
                <div className="kpi-value-row">
                  <h2 className="kpi-value">{(stats.nfc_scans_count || 0).toLocaleString("vi-VN")}</h2>
                  <span className="kpi-unit">chạm</span>
                </div>
                <p className="kpi-desc">Quét chip NFC mở khóa kỷ niệm du lịch</p>
              </div>
            </div>
          </div>

          {/* ─── 2-Column Responsive Dashboard Layout ─── */}
          <div className="admin-analytics-layout">
            {/* Cột Trái: Top 10 Tỉnh Thành Được Quan Tâm Nhất */}
            <div className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div className="card-header-left">
                  <div className="card-header-icon-box">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3>Top 10 Tỉnh Thành Được Xem Nhiều Nhất</h3>
                    <p className="card-header-sub">Xu hướng điểm đến hấp dẫn du khách</p>
                  </div>
                </div>
                <span className="admin-analytics-pill-hot">
                  <TrendingUp size={13} /> HOT DESTINATIONS
                </span>
              </div>

              {stats.top_provinces.length === 0 ? (
                <div className="admin-analytics-empty-box">
                  <div className="empty-icon-circle">
                    <Compass size={32} />
                  </div>
                  <h4>Chưa ghi nhận lượt xem tỉnh thành</h4>
                  <p>Khi du khách ghé thăm cẩm nang các tỉnh, thứ hạng sẽ tự động hiển thị tại đây.</p>
                  <Link href="/admin/provinces" className="btn-explore-provinces">
                    <span>Xem danh sách 34 tỉnh thành</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              ) : (
                <div className="admin-analytics-provinces-list">
                  {stats.top_provinces.map((prov, index) => {
                    const pct = Math.round(
                      (prov.view_count / (stats.total_views || 1)) * 100,
                    );
                    const rank = index + 1;
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    return (
                      <div key={prov.province_slug} className="admin-analytics-prov-item">
                        <div
                          className={`admin-analytics-prov-rank ${
                            isTop1 ? "rank-1" : isTop2 ? "rank-2" : isTop3 ? "rank-3" : ""
                          }`}
                        >
                          {isTop1 ? "🥇 1" : isTop2 ? "🥈 2" : isTop3 ? "🥉 3" : `#${rank}`}
                        </div>

                        <div className="admin-analytics-prov-info">
                          <div className="admin-analytics-prov-name-row">
                            <Link
                              href={`/province/${prov.province_slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="prov-name-link"
                            >
                              <span>{prov.province_name || prov.province_slug}</span>
                              <ExternalLink size={12} className="link-arrow" />
                            </Link>
                            <span className="admin-analytics-prov-count">
                              <strong>{prov.view_count.toLocaleString("vi-VN")}</strong> lượt xem
                            </span>
                          </div>

                          <div className="admin-analytics-prov-bar-wrap">
                            <div
                              className={`admin-analytics-prov-bar-fill ${
                                isTop1 ? "fill-gold" : isTop2 ? "fill-silver" : isTop3 ? "fill-bronze" : ""
                              }`}
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cột Phải: Nhật Ký Truy Cập Thời Gian Thực (Live Feed) */}
            <div className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div className="card-header-left">
                  <div className="card-header-icon-box card-header-icon-emerald">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3>Nhật Ký Truy Cập Người Dùng Thực</h3>
                    <p className="card-header-sub">Theo dõi từng phiên truy cập mới nhất</p>
                  </div>
                </div>
                <span className="admin-analytics-badge--green">
                  <span className="live-dot-pulse live-dot-green" /> Realtime Live
                </span>
              </div>

              {stats.recent_views.length === 0 ? (
                <div className="admin-analytics-empty-box">
                  <div className="empty-icon-circle">
                    <Clock size={32} />
                  </div>
                  <h4>Chưa có dữ liệu nhật ký truy cập</h4>
                  <p>Hệ thống đang sẵn sàng ghi nhận các phiên truy cập mới.</p>
                </div>
              ) : (
                <div className="admin-analytics-feed-container">
                  <div className="admin-analytics-feed">
                    {stats.recent_views.map((log) => {
                      const isMobile = log.device_type === "mobile";
                      const isNfc = log.page_path?.startsWith("/t/");
                      const isHome = log.page_path === "/" || !log.page_path;

                      return (
                        <div key={log.id} className="admin-analytics-feed-item">
                          <div className={`feed-device-badge ${isMobile ? "badge-mobile" : "badge-pc"}`}>
                            {isMobile ? <Smartphone size={15} /> : <Laptop size={15} />}
                          </div>

                          <div className="admin-analytics-feed-content">
                            <div className="admin-analytics-feed-path">
                              {log.province_name ? (
                                <span className="feed-dest prov-dest">
                                  <MapPin size={13} /> {log.province_name}
                                </span>
                              ) : isNfc ? (
                                <span className="feed-dest nfc-dest">
                                  <Radio size={13} /> Chạm thẻ NFC: {log.page_path}
                                </span>
                              ) : isHome ? (
                                <span className="feed-dest home-dest">
                                  🏠 Trang chủ (/)
                                </span>
                              ) : (
                                <span className="feed-dest generic-dest">
                                  {log.page_path}
                                </span>
                              )}
                            </div>

                            <div className="admin-analytics-feed-meta">
                              <span className="feed-ip-chip">
                                IP: {log.ip_address || "Khách"}
                              </span>
                              <span className="feed-meta-dot">•</span>
                              <span className="feed-time-chip">
                                <Clock size={11} /> {formatTime(log.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
