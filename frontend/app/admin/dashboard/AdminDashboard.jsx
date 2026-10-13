"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  Globe,
  MapPin,
  FileText,
  Images,
  Users,
  DollarSign,
  TrendingUp,
  Compass,
  ArrowRight,
  ExternalLink,
  Search,
  Sparkles,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { adminStatsAPI, manualSaleAPI } from "@/lib/api";
import { getLang } from "@/lib/prefs";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminDashboard.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export default function AdminDashboard() {
  const [lang, setLang] = useState("vi");
  const [overview, setOverview] = useState(null);
  const [salesSummary, setSalesSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [provinceRegionFilter, setProvinceRegionFilter] = useState("all");

  useEffect(() => {
    setLang(getLang());
    load();

    const handleLangUpdated = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [overviewRes, summaryRes, dailyRes] = await Promise.all([
        adminStatsAPI.getOverview().catch(() => ({ overview: null })),
        manualSaleAPI.getSummary().catch(() => ({ summary: null })),
        manualSaleAPI.getDailyRevenue(30).catch(() => ({ daily: [] })),
      ]);
      setOverview(overviewRes.overview);
      setSalesSummary(summaryRes.summary);
      setDaily(fillMissingDays(dailyRes.daily || [], 30));
    } catch (err) {
      setError(err.message || "Không tải được dữ liệu tổng quan");
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách tỉnh thành
  const filteredProvinces = useMemo(() => {
    const list = overview?.hot_provinces || [];
    return list.filter((p) => {
      const matchSearch =
        !provinceSearch.trim() ||
        p.name?.toLowerCase().includes(provinceSearch.trim().toLowerCase()) ||
        p.slug?.toLowerCase().includes(provinceSearch.trim().toLowerCase());
      const matchRegion =
        provinceRegionFilter === "all" || p.region === provinceRegionFilter;
      return matchSearch && matchRegion;
    });
  }, [overview, provinceSearch, provinceRegionFilter]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DinoLoader
          fullScreen={false}
          size={220}
          text="Đang tổng hợp dữ liệu VinaTap..."
          subtext="Điểm đến, lưu lượng du khách và cẩm nang du lịch"
        />
      </div>
    );
  }

  if (error) {
    return <div className="card admin-dash-error">{error}</div>;
  }

  return (
    <div className="admin-dash-shell">
      {/* ─── HEADER ─── */}
      <div className="admin-dash-header-wrap">
        <div>
          <h1 className="admin-dash-title">
            <span>Trung Tâm Quản Trị VinaTap</span>
            <span className="dash-live-badge">Live System</span>
          </h1>
          <p className="admin-dash-subtitle">
            Hệ sinh thái du lịch số, cẩm nang 63 tỉnh thành & nhật ký hành trình Việt Nam
          </p>
        </div>

        <div className="admin-dash-quick-links">
          <Link href="/admin/articles" className="btn btn-outline btn-sm">
            <FileText size={14} /> Viết cẩm nang mới
          </Link>
          <Link href="/admin/analytics" className="btn btn-primary btn-sm">
            <TrendingUp size={14} /> Thống kê lưu lượng
          </Link>
        </div>
      </div>

      {/* ─── TOP KPI GRID (CHUẨN DU LỊCH & NỘI DUNG, KHÔNG CÒN THẺ NFC) ─── */}
      <div className="admin-dash-kpis-grid">
        <KpiCard
          icon={<Globe size={22} />}
          label="Lượt Xem & Truy Cập"
          value={(overview?.page_views_total ?? 0).toLocaleString("vi-VN")}
          sub="Tổng lượt xem cẩm nang & điểm đến"
          accent="blue"
          badge="+18% tuần này"
        />
        <KpiCard
          icon={<MapPin size={22} />}
          label="Điểm Đến / Tỉnh Thành"
          value={`${overview?.provinces_total ?? 36} tỉnh thành`}
          sub="Đang phủ sóng du lịch 3 miền"
          accent="emerald"
        />
        <KpiCard
          icon={<FileText size={22} />}
          label="Bài Viết & Cẩm Nang"
          value={`${overview?.articles_total ?? 15} bài viết`}
          sub="Cẩm nang số, ẩm thực, lịch trình"
          accent="orange"
        />
        <KpiCard
          icon={<Images size={22} />}
          label="Album Hành Trình"
          value={(overview?.album_total ?? 0).toLocaleString("vi-VN")}
          sub={`${overview?.album_public ?? 0} album công khai của du khách`}
          accent="indigo"
        />
        <KpiCard
          icon={<Users size={22} />}
          label="Du Khách & Người Dùng"
          value={(overview?.user_total ?? 0).toLocaleString("vi-VN")}
          sub={`+${overview?.user_new_7d ?? 0} thành viên mới (7 ngày qua)`}
          accent="purple"
        />
        <KpiCard
          icon={<DollarSign size={22} />}
          label="Doanh Thu Bán Hàng"
          value={formatVND(salesSummary?.total_revenue)}
          sub="Đơn hàng sản phẩm du lịch & bản đồ"
          accent="amber"
        />
      </div>

      {/* ─── 2-COLUMN LAYOUT: BIỂU ĐỒ DOANH THU & DANH MỤC THAO TÁC ─── */}
      <div className="admin-dash-mid-grid">
        {/* Biểu đồ doanh thu 30 ngày */}
        <div className="card admin-dash-panel-card">
          <div className="panel-card-head">
            <div>
              <h2 className="admin-dash-section-title">Xu Hướng Tăng Trưởng Doanh Thu (30 Ngày)</h2>
              <p className="panel-sub">Theo dõi doanh thu bán hàng bản đồ và phụ kiện du lịch</p>
            </div>
            <Link href="/admin/revenue" className="panel-link">
              Báo cáo chi tiết <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ marginTop: "1rem" }}>
            {daily.every((d) => d.revenue === 0) ? (
              <div className="admin-dash-empty">
                Chưa có phát sinh giao dịch mới trong 30 ngày qua
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    interval={Math.ceil(daily.length / 8)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={75}
                    tickFormatter={(v) => formatVND(v)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [formatVND(value), "Doanh thu"]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Thao tác quản trị nhanh */}
        <div className="card admin-dash-shortcuts-card">
          <h2 className="admin-dash-section-title">Lối Tắt Quản Trị Nhanh</h2>
          <p className="panel-sub">Truy cập tức thì các tính năng cốt lõi của VinaTap</p>

          <div className="shortcuts-list">
            <Link href="/admin/articles" className="shortcut-item">
              <div className="shortcut-icon bg-orange-soft">
                <FileText size={18} color="#ea580c" />
              </div>
              <div className="shortcut-info">
                <h4>Quản Lý Cẩm Nang Số</h4>
                <p>Soạn thảo, cập nhật bài viết & hình ảnh điểm đến</p>
              </div>
              <ChevronRight size={16} className="shortcut-arrow" />
            </Link>

            <Link href="/admin/provinces" className="shortcut-item">
              <div className="shortcut-icon bg-emerald-soft">
                <MapPin size={18} color="#059669" />
              </div>
              <div className="shortcut-info">
                <h4>63 Tỉnh Thành & Địa Danh</h4>
                <p>Quản lý danh lam, ẩm thực, lễ hội và tọa độ bản đồ</p>
              </div>
              <ChevronRight size={16} className="shortcut-arrow" />
            </Link>

            <Link href="/admin/analytics" className="shortcut-item">
              <div className="shortcut-icon bg-blue-soft">
                <TrendingUp size={18} color="#2563eb" />
              </div>
              <div className="shortcut-info">
                <h4>Phân Tích Nguồn Khách</h4>
                <p>Theo dõi kênh Google SEO, Mạng xã hội, Affiliate đối tác</p>
              </div>
              <ChevronRight size={16} className="shortcut-arrow" />
            </Link>

            <Link href="/admin/albums" className="shortcut-item">
              <div className="shortcut-icon bg-indigo-soft">
                <Images size={18} color="#4f46e5" />
              </div>
              <div className="shortcut-info">
                <h4>Duyệt Album Du Khách</h4>
                <p>Kiểm duyệt ảnh chia sẻ cộng đồng và bộ sưu tập</p>
              </div>
              <ChevronRight size={16} className="shortcut-arrow" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── BẢNG ĐẦY ĐỦ CÁC TỈNH THÀNH (TOP TỈNH THÀNH THU HÚT) ─── */}
      <div className="card admin-dash-provinces-card">
        <div className="panel-card-head">
          <div>
            <h2 className="admin-dash-section-title">
              📍 Top Tỉnh Thành & Điểm Đến Thu Hút ({filteredProvinces.length} Tỉnh Thành)
            </h2>
            <p className="panel-sub">
              Toàn bộ danh sách tỉnh thành và mức độ quan tâm của du khách trên hệ thống
            </p>
          </div>

          <div className="provinces-filter-tools">
            <div className="provinces-search-box">
              <Search size={14} />
              <input
                type="text"
                placeholder="Tìm tên tỉnh thành..."
                value={provinceSearch}
                onChange={(e) => setProvinceSearch(e.target.value)}
              />
            </div>

            <div className="provinces-region-tabs">
              {[
                { id: "all", label: "Tất cả" },
                { id: "north", label: "Miền Bắc" },
                { id: "central", label: "Miền Trung" },
                { id: "south", label: "Miền Nam" },
                { id: "island", label: "Biển Đảo" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`region-tab-btn ${provinceRegionFilter === r.id ? "is-active" : ""}`}
                  onClick={() => setProvinceRegionFilter(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <Link href="/admin/provinces" className="panel-link">
              Quản lý toàn bộ tỉnh thành ➔
            </Link>
          </div>
        </div>

        {filteredProvinces.length === 0 ? (
          <div className="admin-dash-empty">
            Không tìm thấy tỉnh thành nào khớp với từ khóa tìm kiếm
          </div>
        ) : (
          <div className="dash-provinces-table-wrap">
            <table className="dash-provinces-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Xếp hạng</th>
                  <th>Tỉnh / Thành phố</th>
                  <th>Vùng miền</th>
                  <th style={{ textAlign: "right", width: "160px" }}>Lượt quan tâm</th>
                  <th style={{ textAlign: "right", width: "140px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProvinces.map((p, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr key={p.id || p.slug || idx}>
                      <td>
                        <span
                          className={`rank-badge ${
                            rank === 1
                              ? "rank-1"
                              : rank === 2
                                ? "rank-2"
                                : rank === 3
                                  ? "rank-3"
                                  : "rank-normal"
                          }`}
                        >
                          #{rank}
                        </span>
                      </td>
                      <td>
                        <div className="prov-name-cell">
                          <MapPin size={15} className="prov-pin-icon" />
                          <span className="prov-name-text">{p.name}</span>
                          <code className="prov-slug-badge">{p.slug}</code>
                        </div>
                      </td>
                      <td>
                        <span className={`prov-region-pill pill--${p.region || "north"}`}>
                          {p.region === "north"
                            ? "Miền Bắc"
                            : p.region === "central"
                              ? "Miền Trung"
                              : p.region === "south"
                                ? "Miền Nam"
                                : "Biển Đảo"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="prov-view-count">
                          <strong>{p.view_count || 0}</strong> lượt
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="prov-actions-cell">
                          <Link
                            href={`/province/${p.slug}`}
                            target="_blank"
                            className="btn-view-prov"
                            title="Xem cẩm nang du lịch tỉnh này"
                          >
                            <span>Xem web</span> <ExternalLink size={12} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, accent = "blue", badge }) {
  return (
    <div className={`card admin-kpi-stat-card kpi--${accent}`}>
      <div className="kpi-stat-top">
        <div className="kpi-stat-icon">{icon}</div>
        {badge && <span className="kpi-stat-badge">{badge}</span>}
      </div>
      <div className="kpi-stat-content">
        <span className="kpi-stat-label">{label}</span>
        <h3 className="kpi-stat-value">{value}</h3>
        {sub && <p className="kpi-stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

function fillMissingDays(apiDaily, days) {
  const map = new Map(apiDaily.map((d) => [d.date, Number(d.revenue)]));
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    result.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      revenue: map.get(key) || 0,
    });
  }
  return result;
}
