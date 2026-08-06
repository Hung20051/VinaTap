"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Users,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Clock,
  TrendingUp,
  MapPin,
  Filter,
} from "lucide-react";
import { analyticsAPI, getBaseUrl } from "../../../lib/api";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_views: 0,
    unique_visitors: 0,
    today_views: 0,
    bot_blocked_count: 0,
    device_stats: [],
    top_provinces: [],
    recent_views: [],
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      loadStats(true);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  const loadStats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      console.log(`📊 [AdminAnalytics] Đang lấy dữ liệu từ API: ${getBaseUrl()} (Timeframe: ${timeframe})`);
      const res = await analyticsAPI.getStats(timeframe);
      if (res.stats) {
        console.log(`✅ [AdminAnalytics] Đã nạp thành công: Tổng lượt xem = ${res.stats.total_views}, Hôm nay = ${res.stats.today_views}`);
        setStats(res.stats);
      }
    } catch (err) {
      console.error("❌ [AdminAnalytics] Lỗi nạp thống kê:", err?.message || err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getDevicePercentage = (type) => {
    const total = stats.device_stats.reduce((acc, curr) => acc + curr.count, 0);
    if (!total) return 0;
    const found = stats.device_stats.find((d) => d.device_type === type);
    return found ? Math.round((found.count / total) * 100) : 0;
  };

  const mobilePct = getDevicePercentage("mobile");
  const desktopPct = getDevicePercentage("desktop");

  return (
    <div className="admin-analytics-container">
      {/* Header */}
      <div className="admin-analytics-header">
        <div>
          <h1 className="admin-dash-title">📈 Thống Kê Truy Cập Người Dùng Thực</h1>
          <p className="admin-dash-subtitle">
            Đo lường chi tiết lượt xem trang, khách truy cập độc nhất &amp; tự động lọc bỏ Bot/Crawler
          </p>
        </div>

        <div className="admin-analytics-actions">
          {/* Timeframe Filter */}
          <div className="admin-analytics-timeframe">
            <Filter size={15} />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="admin-analytics-select"
            >
              <option value="today">Hôm nay</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="all">Tất cả thời gian</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={loadStats}
            disabled={loading}
          >
            <RefreshCw size={16} /> Tải lại
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* KPI Metrics Summary Grid */}
          <div className="admin-analytics-kpi-grid">
            {/* Card 1: Tổng Lượt Xem Thực */}
            <div className="card admin-analytics-kpi-card">
              <div className="admin-analytics-kpi-icon admin-analytics-kpi-icon--blue">
                <Eye size={22} />
              </div>
              <div className="admin-analytics-kpi-info">
                <span className="admin-analytics-kpi-label">Tổng Lượt Xem Trang</span>
                <h3 className="admin-analytics-kpi-value">
                  {stats.total_views.toLocaleString("vi-VN")}
                </h3>
                <span className="admin-analytics-kpi-sub">
                  +{stats.today_views} lượt hôm nay
                </span>
              </div>
            </div>

            {/* Card 2: Khách Độc Nhất */}
            <div className="card admin-analytics-kpi-card">
              <div className="admin-analytics-kpi-icon admin-analytics-kpi-icon--green">
                <Users size={22} />
              </div>
              <div className="admin-analytics-kpi-info">
                <span className="admin-analytics-kpi-label">Khách Xem Độc Nhất (IP)</span>
                <h3 className="admin-analytics-kpi-value">
                  {stats.unique_visitors.toLocaleString("vi-VN")}
                </h3>
                <span className="admin-analytics-kpi-sub">
                  Thiết bị &amp; IP thực tế
                </span>
              </div>
            </div>

            {/* Card 3: Mobile vs PC */}
            <div className="card admin-analytics-kpi-card">
              <div className="admin-analytics-kpi-icon admin-analytics-kpi-icon--orange">
                <Smartphone size={22} />
              </div>
              <div className="admin-analytics-kpi-info">
                <span className="admin-analytics-kpi-label">Tỷ Lệ Mobile vs PC</span>
                <h3 className="admin-analytics-kpi-value">
                  {mobilePct}% <span className="text-muted">/ {desktopPct}%</span>
                </h3>
                <span className="admin-analytics-kpi-sub">
                  📱 Mobile / 💻 Desktop
                </span>
              </div>
            </div>

            {/* Card 4: Bot Spams Blocked */}
            <div className="card admin-analytics-kpi-card">
              <div className="admin-analytics-kpi-icon admin-analytics-kpi-icon--purple">
                <ShieldCheck size={22} />
              </div>
              <div className="admin-analytics-kpi-info">
                <span className="admin-analytics-kpi-label">Số Bot Đã Lọc Bỏ</span>
                <h3 className="admin-analytics-kpi-value">
                  {stats.bot_blocked_count.toLocaleString("vi-VN")}
                </h3>
                <span className="admin-analytics-kpi-sub text-green">
                  🛡️ Đã tự động chặn 100%
                </span>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="admin-analytics-layout">
            {/* Top 10 Tỉnh Thành Xem Nhiều Nhất */}
            <div className="card admin-analytics-card">
              <div className="admin-analytics-card-header">
                <h3>
                  <MapPin size={18} /> Top 10 Tỉnh Thành Được Xem Nhiều Nhất
                </h3>
                <span className="admin-analytics-badge">
                  <TrendingUp size={13} /> HOT Destinations
                </span>
              </div>

              {stats.top_provinces.length === 0 ? (
                <p className="admin-analytics-empty">Chưa có dữ liệu lượt xem tỉnh thành</p>
              ) : (
                <div className="admin-analytics-provinces-list">
                  {stats.top_provinces.map((prov, index) => {
                    const pct = Math.round(
                      (prov.view_count / (stats.total_views || 1)) * 100,
                    );
                    return (
                      <div key={prov.province_slug} className="admin-analytics-prov-item">
                        <div className="admin-analytics-prov-rank">#{index + 1}</div>
                        <div className="admin-analytics-prov-info">
                          <div className="admin-analytics-prov-name-row">
                            <strong>{prov.province_name || prov.province_slug}</strong>
                            <span className="admin-analytics-prov-count">
                              {prov.view_count} lượt xem
                            </span>
                          </div>
                          <div className="admin-analytics-prov-bar-wrap">
                            <div
                              className="admin-analytics-prov-bar-fill"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Nhật Ký Lượt Xem Real-Time Người Dùng Thực */}
            <div className="card admin-analytics-card">
              <div className="admin-analytics-card-header">
                <h3>
                  <Clock size={18} /> Nhật Ký Truy Cập Người Dùng Thực
                </h3>
                <span className="admin-analytics-badge admin-analytics-badge--green">
                  ● Realtime Live
                </span>
              </div>

              {stats.recent_views.length === 0 ? (
                <p className="admin-analytics-empty">Chưa có dữ liệu nhật ký truy cập</p>
              ) : (
                <div className="admin-analytics-feed">
                  {stats.recent_views.map((log) => (
                    <div key={log.id} className="admin-analytics-feed-item">
                      <div className="admin-analytics-feed-device">
                        {log.device_type === "mobile" ? "📱" : "💻"}
                      </div>
                      <div className="admin-analytics-feed-content">
                        <div className="admin-analytics-feed-path">
                          <strong>{log.province_name || log.page_path}</strong>
                        </div>
                        <div className="admin-analytics-feed-meta">
                          <span>IP: {log.ip_address || "Khách"}</span>
                          <span>•</span>
                          <span>{new Date(log.created_at).toLocaleTimeString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
