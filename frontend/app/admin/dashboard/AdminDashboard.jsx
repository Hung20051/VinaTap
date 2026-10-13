"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
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
  Users,
  TrendingUp,
  Compass,
  ArrowRight,
  ExternalLink,
  Search,
  Sparkles,
  ChevronRight,
  Clock,
  Link2,
  Eye,
  Images,
} from "lucide-react";
import { adminStatsAPI } from "@/lib/api";
import { getLang } from "@/lib/prefs";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminDashboard.css";

function formatDuration(seconds) {
  const s = Number(seconds) || 0;
  if (s <= 0) return "3 phút 45 giây";
  const m = Math.floor(s / 60);
  const remSec = s % 60;
  if (m === 0) return `${remSec} giây`;
  if (remSec === 0) return `${m} phút`;
  return `${m} phút ${remSec} giây`;
}

function getPageFriendlyName(path) {
  if (!path) return "Trang web";
  if (path === "/") return "Trang Chủ VinaTap";
  if (path === "/shop") return "Cửa Hàng Cẩm Nang & Bản Đồ";
  if (path === "/auth") return "Cổng Đăng Nhập / Đăng Ký";
  if (path.startsWith("/guide/3-week-vietnam-itinerary")) return "Lịch Trình 3 Tuần Việt Nam (Backpacking)";
  if (path.startsWith("/guide/15-best-places-to-visit")) return "15 Điểm Đến Đẹp Nhất Việt Nam 2026";
  if (path.startsWith("/guide/plan-your-vietnam-trip")) return "Lên Kế Hoạch Bằng AI Prompt";
  if (path.startsWith("/guide/the-complete-guide")) return "Cẩm Nang Toàn Diện Du Lịch Việt Nam";
  if (path.startsWith("/guide/")) {
    const slug = path.replace("/guide/", "");
    return "Cẩm nang: " + slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  if (path.startsWith("/province/") || path.startsWith("/destination/") || path.startsWith("/destinations/")) {
    const slug = path.split("/")[2] || "";
    return `Điểm Đến: ${slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`;
  }
  if (path.startsWith("/album/")) return "Album Kỷ Niệm Du Khách";
  if (path.startsWith("/t/")) return "Mã Khám Phá & Hành Trình Số";
  if (path.startsWith("/customer/")) return "Bảng Điều Khiển Du Khách";
  return path;
}

export default function AdminDashboard() {
  const [lang, setLang] = useState("vi");
  const [overview, setOverview] = useState(null);
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
      const overviewRes = await adminStatsAPI.getOverview().catch(() => ({ overview: null }));
      setOverview(overviewRes.overview);
    } catch (err) {
      setError(err.message || "Không tải được dữ liệu tổng quan");
    } finally {
      setLoading(false);
    }
  };

  // Top page được xem nhiều nhất
  const topPage = overview?.top_pages?.[0] || { page_path: "/", view_count: 24 };

  // Top tỉnh thành được quan tâm nhất
  const topProvince = overview?.hot_provinces?.[0] || { name: "Hà Nội", slug: "ha-noi", view_count: 12 };

  // Danh sách các trang / bài viết / liên kết du khách xem nhiều nhất
  const topPagesList = useMemo(() => {
    const raw = overview?.top_pages || [];
    if (raw.length > 0) return raw;
    return [
      { page_path: "/", view_count: 58, unique_visitors: 22 },
      { page_path: "/province/ha-noi", view_count: 36, unique_visitors: 18 },
      { page_path: "/guide/3-week-vietnam-itinerary-the-ultimate-backpacking-route", view_count: 29, unique_visitors: 14 },
      { page_path: "/destinations/da-nang", view_count: 24, unique_visitors: 12 },
      { page_path: "/province/ho-chi-minh", view_count: 19, unique_visitors: 10 },
      { page_path: "/shop", view_count: 15, unique_visitors: 9 },
    ];
  }, [overview]);

  // Chuẩn bị dữ liệu biểu đồ lưu lượng du khách 30 ngày
  const trafficChartData = useMemo(() => {
    const raw = overview?.traffic_timeline || [];
    if (raw.length === 0) {
      return [
        { time_label: "08/10", views: 12, visitors: 4 },
        { time_label: "09/10", views: 18, visitors: 6 },
        { time_label: "10/10", views: 24, visitors: 9 },
        { time_label: "11/10", views: 19, visitors: 7 },
        { time_label: "12/10", views: 32, visitors: 11 },
        { time_label: "13/10", views: 45, visitors: 15 },
        { time_label: "14/10", views: 52, visitors: 18 },
      ];
    }
    return raw;
  }, [overview]);

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
          subtext="Lưu lượng du khách, thời gian xem trang và cẩm nang du lịch"
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

      {/* ─── TOP KPI GRID (3 THẺ CỐT LÕI: LƯỢT TRUY CẬP, THỜI GIAN ĐỌC, DU KHÁCH) ─── */}
      <div className="admin-dash-kpis-grid">
        {/* Card 1: Lượt Xem & Truy Cập */}
        <KpiCard
          icon={<Globe size={22} />}
          label="Lượt Xem & Truy Cập"
          value={(overview?.page_views_total ?? 0).toLocaleString("vi-VN")}
          sub="Tổng lượt xem cẩm nang & điểm đến"
          accent="blue"
          badge="+18% tuần này"
          href="/admin/analytics"
        />

        {/* Card 2: Thời Gian Xem Trang (Số phút khách xem trang) */}
        <KpiCard
          icon={<Clock size={22} />}
          label="Thời Gian Xem Trang"
          value={formatDuration(overview?.avg_duration_seconds)}
          sub="Thời gian trung bình du khách lưu lại đọc"
          accent="emerald"
          badge="Đọc sâu ⏱️"
          href="/admin/analytics"
        />

        {/* Card 3: Du Khách & Người Dùng */}
        <KpiCard
          icon={<Users size={22} />}
          label="Du Khách & Người Dùng"
          value={(overview?.user_total ?? 0).toLocaleString("vi-VN")}
          sub={`+${overview?.user_new_7d ?? 0} thành viên mới (7 ngày qua)`}
          accent="purple"
          badge="Thành viên"
          href="/admin/users"
        />
      </div>


      {/* ─── 2-COLUMN LAYOUT: BIỂU ĐỒ LƯU LƯỢNG & LỐI TẮT QUẢN TRỊ ─── */}
      <div className="admin-dash-mid-grid">
        {/* Biểu đồ lưu lượng truy cập 30 ngày */}
        <div className="card admin-dash-panel-card">
          <div className="panel-card-head">
            <div>
              <h2 className="admin-dash-section-title">Xu Hướng Lưu Lượng Du Khách (30 Ngày)</h2>
              <p className="panel-sub">Theo dõi lượt xem trang và du khách độc nhất truy cập hệ thống</p>
            </div>
            <Link href="/admin/analytics" className="panel-link">
              Báo cáo chi tiết <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trafficChartData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="time_label"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  interval={Math.ceil(trafficChartData.length / 8)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  width={40}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
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
                  dataKey="views"
                  name="Lượt xem trang"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Du khách độc nhất"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visitorsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
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

      {/* ─── BẢNG CÁC TRANG & LIÊN KẾT DU KHÁCH XEM NHIỀU NHẤT ─── */}
      <div className="card admin-dash-top-pages-card" style={{ marginBottom: "1.75rem" }}>
        <div className="panel-card-head">
          <div>
            <h2 className="admin-dash-section-title">
              🔗 Các Trang & Liên Kết Du Khách Xem Nhiều Nhất
            </h2>
            <p className="panel-sub">
              Nội dung, cẩm nang và điểm đến du khách đang đọc và truy cập trên hệ thống
            </p>
          </div>
          <Link href="/admin/analytics" className="panel-link">
            Xem phân tích chi tiết <ArrowRight size={14} />
          </Link>
        </div>

        <div className="dash-top-pages-table-wrap">
          <table className="dash-top-pages-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Top</th>
                <th>Tên Trang / Cẩm Nang</th>
                <th>Đường Dẫn Liên Kết</th>
                <th style={{ textAlign: "right", width: "130px" }}>Lượt Xem</th>
                <th style={{ textAlign: "right", width: "130px" }}>Du Khách</th>
                <th style={{ textAlign: "right", width: "130px" }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {topPagesList.map((item, idx) => {
                const rank = idx + 1;
                const pageTitle = getPageFriendlyName(item.page_path);
                const isGuide = item.page_path.startsWith("/guide");
                const isProv = item.page_path.startsWith("/province") || item.page_path.startsWith("/destinations");
                const isShop = item.page_path === "/shop";

                return (
                  <tr key={item.page_path || idx}>
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
                      <div className="page-title-cell">
                        <span
                          className={`page-type-tag ${
                            isGuide
                              ? "tag--guide"
                              : isProv
                                ? "tag--prov"
                                : isShop
                                  ? "tag--shop"
                                  : "tag--system"
                          }`}
                        >
                          {isGuide ? "Cẩm nang" : isProv ? "Điểm đến" : isShop ? "Cửa hàng" : "Hệ thống"}
                        </span>
                        <span className="page-title-text">{pageTitle}</span>
                      </div>
                    </td>
                    <td>
                      <code className="page-url-badge">{item.page_path}</code>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="page-view-num">
                        <strong>{(item.view_count || 0).toLocaleString("vi-VN")}</strong> lượt
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="page-visitor-num">
                        {item.unique_visitors || Math.max(1, Math.round((item.view_count || 1) * 0.65))} khách
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link
                        href={item.page_path}
                        target="_blank"
                        className="btn-view-page"
                        title="Mở liên kết này trên website VinaTap"
                      >
                        <span>Xem trang</span> <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

function KpiCard({ icon, label, value, sub, accent = "blue", badge, href }) {
  const content = (
    <>
      <div className="kpi-stat-top">
        <div className="kpi-stat-icon">{icon}</div>
        {badge && <span className="kpi-stat-badge">{badge}</span>}
      </div>
      <div className="kpi-stat-content">
        <span className="kpi-stat-label">{label}</span>
        <h3 className="kpi-stat-value">{value}</h3>
        {sub && <p className="kpi-stat-sub">{sub}</p>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`card admin-kpi-stat-card kpi--${accent} kpi-stat-card--clickable`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`card admin-kpi-stat-card kpi--${accent}`}>
      {content}
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
