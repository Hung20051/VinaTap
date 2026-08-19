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
import { adminStatsAPI, manualSaleAPI } from "@/lib/api";
import { getLang } from "@/lib/prefs";
import { t } from "@/lib/i18n";
import "./AdminDashboard.css";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

export default function AdminDashboard() {
  const [lang, setLang] = useState("vi");
  const [overview, setOverview] = useState(null);
  const [salesSummary, setSalesSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        adminStatsAPI.getOverview(),
        manualSaleAPI.getSummary(),
        manualSaleAPI.getDailyRevenue(30),
      ]);
      setOverview(overviewRes.overview);
      setSalesSummary(summaryRes.summary);
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
      <h1 className="admin-dash-title">{t(lang, "adminOverviewTitle")}</h1>
      <p className="admin-dash-subtitle">{t(lang, "adminOverviewSubtitle")}</p>

      <div className="admin-dash-kpi-grid">
        <KpiCard
          icon={<DollarSign size={20} />}
          label={t(lang, "totalRevenueOffline")}
          value={formatVND(salesSummary?.total_revenue)}
          accent="orange"
        />
        <KpiCard
          icon={<Package size={20} />}
          label={t(lang, "totalCardsSold")}
          value={salesSummary?.total_cards_sold ?? 0}
          accent="orange"
        />
        <KpiCard
          icon={<CreditCard size={20} />}
          label={t(lang, "nfcActivatedCount")}
          value={`${overview?.nfc_activated ?? 0}/${overview?.nfc_total ?? 0}`}
        />
        <KpiCard
          icon={<Users size={20} />}
          label={t(lang, "totalUsers")}
          value={overview?.user_total ?? 0}
          sub={`+${overview?.user_new_7d ?? 0} ${t(lang, "inLast7Days")}`}
        />
        <KpiCard
          icon={<Images size={20} />}
          label={t(lang, "totalAlbums")}
          value={overview?.album_total ?? 0}
          sub={`${overview?.album_public ?? 0} ${t(lang, "publicAlbums")}`}
        />
        <KpiCard
          icon={<Clock size={20} />}
          label={t(lang, "pendingRequests")}
          value={overview?.pending_share_requests ?? 0}
          accent={overview?.pending_share_requests > 0 ? "warning" : undefined}
        />
      </div>

      <div className="card admin-dash-chart-card">
        <h2 className="admin-dash-section-title">{t(lang, "revenue30Days")}</h2>
        {daily.every((d) => d.revenue === 0) ? (
          <p className="admin-dash-empty">
            {t(lang, "noSalesIn30Days")}
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
            🔥 {t(lang, "topProvincesActivated")}
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
