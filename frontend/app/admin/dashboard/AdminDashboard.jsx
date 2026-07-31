"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CreditCard,
  Users,
  Images,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";
import { adminStatsAPI, manualSaleAPI } from "../../../lib/api";
import "./AdminDashboard.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [salesSummary, setSalesSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      // Gọi song song 3 API độc lập — không phụ thuộc nhau, gộp lại cho
      // nhanh thay vì await tuần tự từng cái.
      const [overviewRes, summaryRes, dailyRes] = await Promise.all([
        adminStatsAPI.getOverview(),
        manualSaleAPI.getSummary(),
        manualSaleAPI.getDailyRevenue(30),
      ]);
      setOverview(overviewRes.overview);
      setSalesSummary(summaryRes.summary);
      // Chart cần đủ 30 ngày kể cả ngày không có đơn nào (revenue=0) —
      // API chỉ trả về ngày có dữ liệu, nên tự điền các ngày thiếu ở đây.
      setDaily(fillMissingDays(dailyRes.daily, 30));
    } catch (err) {
      setError(err.message || "Không tải được dữ liệu tổng quan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dash-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="card admin-dash-error">{error}</div>;
  }

  return (
    <div>
      <h1 className="admin-dash-title">📊 Tổng quan</h1>
      <p className="admin-dash-subtitle">Số liệu hệ thống VinaTap</p>

      <div className="admin-dash-kpi-grid">
        <KpiCard
          icon={<DollarSign size={20} />}
          label="Tổng doanh thu (offline)"
          value={formatVND(salesSummary?.total_revenue)}
          accent="orange"
        />
        <KpiCard
          icon={<Package size={20} />}
          label="Số thẻ đã bán"
          value={salesSummary?.total_cards_sold ?? 0}
          accent="orange"
        />
        <KpiCard
          icon={<CreditCard size={20} />}
          label="Serial NFC đã kích hoạt"
          value={`${overview?.nfc_activated ?? 0}/${overview?.nfc_total ?? 0}`}
        />
        <KpiCard
          icon={<Users size={20} />}
          label="Tổng người dùng"
          value={overview?.user_total ?? 0}
          sub={`+${overview?.user_new_7d ?? 0} trong 7 ngày qua`}
        />
        <KpiCard
          icon={<Images size={20} />}
          label="Tổng album"
          value={overview?.album_total ?? 0}
          sub={`${overview?.album_public ?? 0} album public`}
        />
        <KpiCard
          icon={<Clock size={20} />}
          label="Yêu cầu chờ duyệt"
          value={overview?.pending_share_requests ?? 0}
          accent={overview?.pending_share_requests > 0 ? "warning" : undefined}
        />
      </div>

      <div className="card admin-dash-chart-card">
        <h2 className="admin-dash-section-title">Doanh thu 30 ngày gần nhất</h2>
        {daily.every((d) => d.revenue === 0) ? (
          <p className="admin-dash-empty">
            Chưa có đơn bán nào trong 30 ngày qua
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                interval={Math.ceil(daily.length / 10)}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                width={70}
                tickFormatter={(v) => formatVND(v)}
              />
              <Tooltip
                formatter={(value) => formatVND(value)}
                labelStyle={{ fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {overview?.hot_provinces?.length > 0 && (
        <div className="card admin-dash-hot-card">
          <h2 className="admin-dash-section-title">
            🔥 Tỉnh được kích hoạt nhiều nhất
          </h2>
          <ul className="admin-dash-hot-list">
            {overview.hot_provinces.map((p, i) => (
              <li key={p.name} className="admin-dash-hot-item">
                <span className="admin-dash-hot-rank">#{i + 1}</span>
                <span className="admin-dash-hot-name">{p.name}</span>
                <span className="admin-dash-hot-count">
                  {p.activated_count} thẻ
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div
      className={`card admin-kpi-card ${accent ? `admin-kpi-card--${accent}` : ""}`}
    >
      <div className="admin-kpi-card__icon">{icon}</div>
      <div>
        <p className="admin-kpi-card__label">{label}</p>
        <p className="admin-kpi-card__value">{value}</p>
        {sub && <p className="admin-kpi-card__sub">{sub}</p>}
      </div>
    </div>
  );
}

// API chỉ trả về những ngày CÓ đơn bán — hàm này điền thêm các ngày
// không có đơn nào (revenue=0) để chart vẽ đủ 1 đường liền mạch 30 ngày,
// thay vì bị đứt quãng ở những ngày không bán được gì.
function fillMissingDays(apiDaily, days) {
  const map = new Map(apiDaily.map((d) => [d.date, Number(d.revenue)]));
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      revenue: map.get(key) || 0,
    });
  }
  return result;
}
