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
  DollarSign,
  Share2,
  FileText,
  Search,
  Sparkles,
  Layers,
  MousePointerClick,
  Link2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
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
  const [activeTab, setActiveTab] = useState("audience"); // 'audience' | 'content' | 'sources' | 'affiliate'
  const [timeframe, setTimeframe] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Dữ liệu lượt truy cập
  const [stats, setStats] = useState({
    total_views: 0,
    unique_visitors: 0,
    today_views: 0,
    bot_blocked_count: 0,
    nfc_scans_count: 0,
    avg_duration_seconds: 0,
    timeline: [],
    device_stats: [],
    channel_stats: [],
    top_pages: [],
    top_provinces: [],
    top_referrers: [],
    utm_campaigns: [],
    recent_views: [],
  });

  // Dữ liệu Affiliate
  const [affiliateStats, setAffiliateStats] = useState({
    total_clicks: 0,
    unique_users: 0,
    clicks_by_partner: [],
    top_clicked_links: [],
    top_pages_with_clicks: [],
    recent_clicks: [],
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
      const [resStats, resAffiliate] = await Promise.all([
        analyticsAPI.getStats(timeframe).catch(() => ({ stats: null })),
        analyticsAPI.getAffiliateStats(timeframe).catch(() => ({ stats: null })),
      ]);

      if (resStats?.stats) {
        setStats(resStats.stats);
      }
      if (resAffiliate?.stats) {
        setAffiliateStats(resAffiliate.stats);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Lỗi nạp thống kê truy cập:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDevicePercentage = (type) => {
    const total = (stats.device_stats || []).reduce(
      (acc, curr) => acc + curr.count,
      0,
    );
    if (!total) return 0;
    const found = stats.device_stats.find((d) => d.device_type === type);
    return found ? Math.round((found.count / total) * 100) : 0;
  };

  const mobilePct = getDevicePercentage("mobile");
  const tabletPct = getDevicePercentage("tablet");
  const desktopPct =
    stats.device_stats?.length === 0 ? 0 : Math.max(0, 100 - mobilePct - tabletPct);

  // Format relative time
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="admin-analytics-container">
      {/* ─── HEADER ─────────────────────────────────────────────────── */}
      <div className="admin-analytics-header">
        <div className="admin-analytics-title-group">
          <div className="admin-analytics-badge-pill">
            <span className="live-dot-pulse live-dot-green" />
            <span>LIVE TRAFFIC & PERFORMANCE</span>
          </div>
          <h1 className="admin-analytics-title">
            Thống Kê Số Liệu & Báo Cáo Toàn Diện
          </h1>
          <p className="admin-analytics-subtitle">
            Theo dõi người xem thực tế, hiệu suất bài viết, kênh giới thiệu và chuyển đổi Affiliate của VinaTap.
          </p>
        </div>

        <div className="admin-analytics-actions">
          {/* Timeframe Pill Filter */}
          <div className="timeframe-pill-group">
            {TIMEFRAME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`timeframe-pill-btn ${timeframe === opt.value ? "is-active" : ""}`}
                onClick={() => setTimeframe(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className={`admin-analytics-refresh-btn ${refreshing ? "is-spin" : ""}`}
            onClick={() => loadStats()}
            title="Làm mới số liệu"
          >
            <RefreshCw size={16} />
            <span>{refreshing ? "Đang cập nhật..." : "Làm mới"}</span>
          </button>
        </div>
      </div>

      {/* ─── TAB NAVIGATION BAR ────────────────────────────────────── */}
      <div className="admin-analytics-tab-bar">
        <button
          type="button"
          className={`analytics-tab-btn ${activeTab === "audience" ? "is-active" : ""}`}
          onClick={() => setActiveTab("audience")}
        >
          <Users size={16} />
          <span>Thống Kê Người Xem</span>
        </button>

        <button
          type="button"
          className={`analytics-tab-btn ${activeTab === "content" ? "is-active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          <FileText size={16} />
          <span>Thống Kê Nội Dung</span>
        </button>

        <button
          type="button"
          className={`analytics-tab-btn ${activeTab === "sources" ? "is-active" : ""}`}
          onClick={() => setActiveTab("sources")}
        >
          <Share2 size={16} />
          <span>Nguồn Truy Cập & UTM</span>
        </button>

        <button
          type="button"
          className={`analytics-tab-btn ${activeTab === "affiliate" ? "is-active" : ""}`}
          onClick={() => setActiveTab("affiliate")}
        >
          <MousePointerClick size={16} />
          <span>Thống Kê Affiliate</span>
        </button>
      </div>

      {loading ? (
        <div style={{ minHeight: "45vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang phân tích số liệu..." subtext="Đang tổng hợp dữ liệu lượt xem và kênh nguồn" />
        </div>
      ) : (
        <>
          {/* ════════════════════════════════════════════════════════════════
              TAB 1: THỐNG KÊ NGƯỜI XEM (AUDIENCE)
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === "audience" && (
            <div className="analytics-tab-content">
              {/* KPI Cards */}
              <div className="analytics-kpi-grid">
                <div className="analytics-kpi-card kpi-card-cyan">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Tổng lượt xem trang</span>
                    <div className="kpi-card-icon-wrap">
                      <Eye size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">{stats.total_views.toLocaleString("vi-VN")}</div>
                  <div className="kpi-card-footer">
                    <span className="kpi-trend-pill is-up">
                      <TrendingUp size={12} /> Lượt xem thực
                    </span>
                    <span className="kpi-hint">Đã loại trừ bot ngầm</span>
                  </div>
                </div>

                <div className="analytics-kpi-card kpi-card-blue">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Khách truy cập (Unique IP)</span>
                    <div className="kpi-card-icon-wrap">
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">{stats.unique_visitors.toLocaleString("vi-VN")}</div>
                  <div className="kpi-card-footer">
                    <span className="kpi-hint">Người dùng riêng biệt</span>
                  </div>
                </div>

                <div className="analytics-kpi-card kpi-card-amber">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Quét thẻ NFC VinaTap</span>
                    <div className="kpi-card-icon-wrap">
                      <Radio size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">{stats.nfc_scans_count.toLocaleString("vi-VN")}</div>
                  <div className="kpi-card-footer">
                    <span className="kpi-hint">Từ cổng chạm thẻ /t/[token]</span>
                  </div>
                </div>

                <div className="analytics-kpi-card kpi-card-emerald">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Xem trong ngày hôm nay</span>
                    <div className="kpi-card-icon-wrap">
                      <Calendar size={18} />
                    </div>
                  </div>
                  <div className="kpi-card-value">{stats.today_views.toLocaleString("vi-VN")}</div>
                  <div className="kpi-card-footer">
                    <span className="kpi-hint">Cập nhật thời gian thực</span>
                  </div>
                </div>
              </div>

              {/* Biểu đồ xu hướng thời gian */}
              {stats.timeline && stats.timeline.length > 0 && (
                <div className="analytics-chart-panel">
                  <div className="chart-panel-header">
                    <div>
                      <h3 className="chart-panel-title">Biểu Đồ Xu Hướng Lượt Xem</h3>
                      <p className="chart-panel-subtitle">Số lượt xem trang và số lượng khách truy cập theo thời gian</p>
                    </div>
                  </div>
                  <div className="chart-panel-body" style={{ height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.timeline}>
                        <defs>
                          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00c2cb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#00c2cb" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="time_label" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            background: "#0f172a",
                            color: "#fff",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "12px",
                          }}
                        />
                        <Area type="monotone" dataKey="views" name="Lượt xem" stroke="#00c2cb" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGrad)" />
                        <Area type="monotone" dataKey="visitors" name="Khách riêng biệt" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tỷ lệ thiết bị & Bảo mật */}
              <div className="analytics-two-col-grid">
                <div className="analytics-panel-card">
                  <h3 className="panel-card-title">Phân Bổ Thiết Bị Truy Cập</h3>
                  <div className="device-progress-list">
                    <div className="device-progress-item">
                      <div className="device-progress-header">
                        <div className="device-progress-name">
                          <Smartphone size={16} /> <span>Điện thoại di động (Mobile)</span>
                        </div>
                        <span className="device-progress-pct">{mobilePct}%</span>
                      </div>
                      <div className="device-progress-bar">
                        <div className="device-progress-fill" style={{ width: `${mobilePct}%`, background: "#00c2cb" }} />
                      </div>
                    </div>

                    <div className="device-progress-item">
                      <div className="device-progress-header">
                        <div className="device-progress-name">
                          <Laptop size={16} /> <span>Máy tính để bàn (Desktop)</span>
                        </div>
                        <span className="device-progress-pct">{desktopPct}%</span>
                      </div>
                      <div className="device-progress-bar">
                        <div className="device-progress-fill" style={{ width: `${desktopPct}%`, background: "#2563eb" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-panel-card">
                  <h3 className="panel-card-title">Lọc Bot Tự Động & An Toàn</h3>
                  <div className="bot-filter-stat">
                    <div className="bot-filter-icon">
                      <ShieldCheck size={28} color="#16a34a" />
                    </div>
                    <div>
                      <div className="bot-filter-num">{stats.bot_blocked_count}</div>
                      <p className="bot-filter-desc">
                        Lượt thu thập dữ liệu tự động (Googlebot, Bingbot, web crawlers, AI scraping) đã được hệ thống tách lọc để số liệu hiển thị là 100% người dùng thực.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 2: THỐNG KÊ NỘI DUNG (CONTENT PERFORMANCE)
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === "content" && (
            <div className="analytics-tab-content">
              <div className="analytics-two-col-grid">
                {/* Top Trang / Bài Viết */}
                <div className="analytics-panel-card">
                  <div className="panel-card-header-flex">
                    <h3 className="panel-card-title">Top Bài Viết & Trang Xem Nhiều Nhất</h3>
                    <Link href="/admin/articles" className="panel-link-action">
                      Quản lý bài viết ➔
                    </Link>
                  </div>
                  <div className="analytics-table-wrap">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Đường dẫn trang (URL)</th>
                          <th style={{ textAlign: "right" }}>Lượt xem</th>
                          <th style={{ textAlign: "right" }}>Khách độc nhất</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.top_pages && stats.top_pages.length > 0 ? (
                          stats.top_pages.map((p, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="page-path-cell">
                                  <span className="page-path-text">{p.page_path}</span>
                                  <a href={p.page_path} target="_blank" rel="noopener noreferrer" className="page-path-link-btn" title="Xem trang">
                                    <ExternalLink size={12} />
                                  </a>
                                </div>
                              </td>
                              <td style={{ textAlign: "right", fontWeight: "600" }}>{p.view_count}</td>
                              <td style={{ textAlign: "right", color: "#64748b" }}>{p.unique_visitors || "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                              Chưa có dữ liệu trang xem trong khoảng thời gian này
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Tỉnh Thành */}
                <div className="analytics-panel-card">
                  <div className="panel-card-header-flex">
                    <h3 className="panel-card-title">Top Tỉnh Thành Thu Hút</h3>
                    <Link href="/admin/provinces" className="panel-link-action">
                      Quản lý tỉnh thành ➔
                    </Link>
                  </div>
                  <div className="analytics-table-wrap">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Tỉnh / Thành phố</th>
                          <th style={{ textAlign: "right" }}>Lượt quan tâm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.top_provinces && stats.top_provinces.length > 0 ? (
                          stats.top_provinces.map((prov, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="prov-cell">
                                  <MapPin size={14} color="#00c2cb" />
                                  <span>{prov.province_name || prov.province_slug}</span>
                                </div>
                              </td>
                              <td style={{ textAlign: "right", fontWeight: "600", color: "#00c2cb" }}>
                                {prov.view_count} lượt
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                              Chưa có dữ liệu tỉnh thành
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 3: NGUỒN TRUY CẬP & UTM (TRAFFIC ACQUISITION)
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === "sources" && (
            <div className="analytics-tab-content">
              {/* Kênh nguồn truy cập chính */}
              <div className="analytics-kpi-grid">
                {(stats.channel_stats || []).map((ch, idx) => (
                  <div key={idx} className="analytics-kpi-card">
                    <div className="kpi-card-header">
                      <span className="kpi-card-label">{ch.channel_name}</span>
                      <Share2 size={16} color="#64748b" />
                    </div>
                    <div className="kpi-card-value">{ch.count.toLocaleString("vi-VN")}</div>
                    <div className="kpi-card-footer">
                      <span className="kpi-hint">
                        {stats.total_views > 0
                          ? Math.round((ch.count / stats.total_views) * 100) + "% tổng lượng truy cập"
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="analytics-two-col-grid">
                {/* Chiến dịch UTM */}
                <div className="analytics-panel-card">
                  <h3 className="panel-card-title">Chiến Dịch Tiếp Thị (UTM Campaigns)</h3>
                  <div className="analytics-table-wrap">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Nguồn (utm_source)</th>
                          <th>Phương thức</th>
                          <th>Chiến dịch</th>
                          <th style={{ textAlign: "right" }}>Lượt vào</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.utm_campaigns && stats.utm_campaigns.length > 0 ? (
                          stats.utm_campaigns.map((utm, idx) => (
                            <tr key={idx}>
                              <td><span className="badge-pill-source">{utm.utm_source}</span></td>
                              <td>{utm.utm_medium || "-"}</td>
                              <td>{utm.utm_campaign || "-"}</td>
                              <td style={{ textAlign: "right", fontWeight: "600" }}>{utm.count}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                              Chưa có chiến dịch UTM nào được gắn vào link
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Website giới thiệu (Referrers) */}
                <div className="analytics-panel-card">
                  <h3 className="panel-card-title">Top Website Giới Thiệu (Referrers)</h3>
                  <div className="analytics-table-wrap">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Website nguồn</th>
                          <th style={{ textAlign: "right" }}>Lượt chuyển hướng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.top_referrers && stats.top_referrers.length > 0 ? (
                          stats.top_referrers.map((ref, idx) => (
                            <tr key={idx}>
                              <td style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {ref.referrer}
                              </td>
                              <td style={{ textAlign: "right", fontWeight: "600" }}>{ref.count}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                              Hầu hết khách truy cập trực tiếp hoặc chưa có website giới thiệu bên ngoài
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              TAB 4: THỐNG KÊ AFFILIATE & ĐỐI TÁC (AFFILIATE CLICKS)
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === "affiliate" && (
            <div className="analytics-tab-content">
              {/* Affiliate KPI Cards */}
              <div className="analytics-kpi-grid">
                <div className="analytics-kpi-card kpi-card-cyan">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Tổng lượt click Affiliate</span>
                    <MousePointerClick size={18} />
                  </div>
                  <div className="kpi-card-value">
                    {affiliateStats.total_clicks.toLocaleString("vi-VN")}
                  </div>
                  <div className="kpi-card-footer">
                    <span className="kpi-hint">Click vào link đặt tour/vé/phòng</span>
                  </div>
                </div>

                <div className="analytics-kpi-card kpi-card-blue">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Khách click riêng biệt</span>
                    <Users size={18} />
                  </div>
                  <div className="kpi-card-value">
                    {affiliateStats.unique_users.toLocaleString("vi-VN")}
                  </div>
                  <div className="kpi-card-footer">
                    <span className="kpi-hint">Người dùng quan tâm dịch vụ</span>
                  </div>
                </div>

                <div className="analytics-kpi-card kpi-card-amber">
                  <div className="kpi-card-header">
                    <span className="kpi-card-label">Tỷ lệ click (CTR)</span>
                    <TrendingUp size={18} />
                  </div>
                  <div className="kpi-card-value">
                    {stats.total_views > 0
                      ? ((affiliateStats.total_clicks / stats.total_views) * 100).toFixed(1) + "%"
                      : "0%"}
                  </div>
                  <div className="kpi-card-footer">
                    <span className="kpi-hint">Trên tổng số lượt xem trang</span>
                  </div>
                </div>
              </div>

              {/* Bảng Top đối tác & Top liên kết */}
              <div className="analytics-two-col-grid">
                {/* Click theo Đối tác */}
                <div className="analytics-panel-card">
                  <h3 className="panel-card-title">Phân Bổ Theo Đối Tác</h3>
                  <div className="analytics-table-wrap">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Đối tác</th>
                          <th style={{ textAlign: "right" }}>Số lượt click</th>
                        </tr>
                      </thead>
                      <tbody>
                        {affiliateStats.clicks_by_partner && affiliateStats.clicks_by_partner.length > 0 ? (
                          affiliateStats.clicks_by_partner.map((p, idx) => (
                            <tr key={idx}>
                              <td>
                                <span className="badge-pill-partner">{p.partner_name.toUpperCase()}</span>
                              </td>
                              <td style={{ textAlign: "right", fontWeight: "700", color: "#00c2cb" }}>
                                {p.count}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                              Chưa có lượt click đối tác nào trong thời gian này
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Liên kết được click */}
                <div className="analytics-panel-card">
                  <h3 className="panel-card-title">Top Liên Kết Được Quan Tâm</h3>
                  <div className="analytics-table-wrap">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Tên hiển thị / Dịch vụ</th>
                          <th>Đối tác</th>
                          <th style={{ textAlign: "right" }}>Click</th>
                        </tr>
                      </thead>
                      <tbody>
                        {affiliateStats.top_clicked_links && affiliateStats.top_clicked_links.length > 0 ? (
                          affiliateStats.top_clicked_links.map((link, idx) => (
                            <tr key={idx}>
                              <td>
                                <a href={link.destination_url} target="_blank" rel="noopener noreferrer" className="affiliate-dest-link">
                                  {link.link_title || link.destination_url}
                                </a>
                              </td>
                              <td><span className="badge-pill-partner">{link.partner_name}</span></td>
                              <td style={{ textAlign: "right", fontWeight: "600" }}>{link.count}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                              Chưa có dữ liệu liên kết
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              NHẬT KÝ LƯỢT TRUY CẬP GẦN ĐÂY (REALTIME LOGS)
             ════════════════════════════════════════════════════════════════ */}
          <div className="analytics-panel-card" style={{ marginTop: "1.5rem" }}>
            <div className="panel-card-header-flex">
              <div>
                <h3 className="panel-card-title">Nhật Ký 20 Lượt Truy Cập Mới Nhất</h3>
                <p className="panel-card-subtitle">Cập nhật trực tiếp lượt ghé thăm từ người dùng</p>
              </div>
              <div className="live-status-indicator">
                <span className="live-dot-pulse live-dot-green" />
                <span>Thời gian thực</span>
              </div>
            </div>

            <div className="analytics-table-wrap">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Trang xem (Path)</th>
                    <th>Tỉnh thành</th>
                    <th>Thiết bị</th>
                    <th>Nguồn vào</th>
                    <th style={{ textAlign: "right" }}>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_views && stats.recent_views.length > 0 ? (
                    stats.recent_views.map((v) => (
                      <tr key={v.id}>
                        <td style={{ whiteSpace: "nowrap", color: "#64748b", fontSize: "0.82rem" }}>
                          {formatTime(v.created_at)}
                        </td>
                        <td>
                          <span className="page-path-text">{v.page_path}</span>
                        </td>
                        <td>
                          {v.province_name ? (
                            <span className="badge-pill-prov">{v.province_name}</span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>—</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge-pill-device ${v.device_type === "mobile" ? "is-mobile" : "is-desktop"}`}>
                            {v.device_type === "mobile" ? "Mobile" : "Desktop"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                            {v.utm_source ? `UTM: ${v.utm_source}` : v.referrer ? v.referrer.slice(0, 30) : "Direct"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b" }}>
                          {v.ip_address}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                        Chưa có nhật ký truy cập
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
