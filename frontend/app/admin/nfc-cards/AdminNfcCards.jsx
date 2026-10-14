"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CreditCard,
  Plus,
  Search,
  UserPlus,
  Download,
  Copy,
  Check,
  Eye,
  X,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  History,
  Lock,
  Unlock,
  UserMinus,
  Trash2,
  Activity,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Radio,
  Sparkles,
  QrCode,
} from "lucide-react";
import { nfcAPI, provinceAPI, userAPI, productAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminNfcCards.css";

export default function AdminNfcCards() {
  const [cards, setCards] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    disabled: 0,
    total_taps: 0,
    active_today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Live timer tick để tự động cập nhật "X phút Y giây trước" theo thời gian thực
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [viewTokenCard, setViewTokenCard] = useState(null);
  const [accessLogsCard, setAccessLogsCard] = useState(null);
  const [cardLogs, setCardLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Batch Form State
  const [batchProductId, setBatchProductId] = useState("");
  const [batchPrefix, setBatchPrefix] = useState("VNT");
  const [batchCount, setBatchCount] = useState(50);
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  // Assign / Provision Form State
  const [assignSerial, setAssignSerial] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [assignReason, setAssignReason] = useState("");
  const [assignAlbumTitle, setAssignAlbumTitle] = useState("");
  const [assignAlbumDesc, setAssignAlbumDesc] = useState("");
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCards();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedProvince, selectedStatus]);

  const loadInitialData = async () => {
    try {
      const [provRes, userRes, prodRes] = await Promise.all([
        provinceAPI.getAll().catch(() => ({ provinces: [] })),
        userAPI.getAll({ limit: 300 }).catch(() => ({ users: [] })),
        productAPI.getAll(true).catch(() => []),
      ]);
      setProvinces(provRes.provinces || []);
      setUsers(userRes.users || []);
      setProducts(prodRes.products || (Array.isArray(prodRes) ? prodRes : []));
    } catch (err) {
      console.error("loadInitialData error:", err);
    }
  };

  const loadCards = async () => {
    setLoading(true);
    try {
      const res = await nfcAPI.adminSearch({
        q: search.trim(),
        province_id: selectedProvince,
        status: selectedStatus,
        limit: 150,
      });
      setCards(res.cards || []);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      showToast(err.message || "Lỗi tải danh sách thẻ NFC", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper format thời gian truy cập với phút và giây
  const formatTimeAgoWithMinutesSeconds = (dateString) => {
    if (!dateString) return null;
    const past = new Date(dateString).getTime();
    if (isNaN(past)) return null;
    const diffSec = Math.max(0, Math.floor((now - past) / 1000));

    if (diffSec < 60) {
      return diffSec <= 5 ? "Vừa xong (5 giây trước)" : `${diffSec} giây trước`;
    }
    const minutes = Math.floor(diffSec / 60);
    const seconds = diffSec % 60;
    if (minutes < 60) {
      return `${minutes} phút ${seconds} giây trước`;
    }
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    if (hours < 24) {
      return `${hours} giờ ${remMinutes} phút trước`;
    }
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  // Helper format thời gian lưu lại (dwell time duration)
  const formatDurationMinutesSeconds = (sec) => {
    const s = Number(sec) || 0;
    if (s <= 0) return null;
    if (s < 60) return `${s} giây`;
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return remS > 0 ? `${m} phút ${remS} giây` : `${m} phút`;
  };

  // Helper format ngày giờ chuẩn tiếng Việt
  const formatDateTimeFull = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Mở modal xem lịch sử người truy cập thẻ NFC
  const handleOpenAccessLogs = async (card) => {
    setAccessLogsCard(card);
    setLoadingLogs(true);
    setCardLogs([]);
    try {
      const res = await nfcAPI.getAccessLogs(card.id);
      setCardLogs(res.logs || []);
    } catch (err) {
      showToast(err.message || "Lỗi tải lịch sử truy cập thẻ", "error");
    } finally {
      setLoadingLogs(false);
    }
  };

  // Đổi trạng thái thẻ nhanh (active / disabled / pending)
  const handleToggleStatus = async (card, newStatus) => {
    try {
      const res = await nfcAPI.updateStatus(card.id, newStatus);
      showToast(res.message || "Đã cập nhật trạng thái thẻ");
      loadCards();
    } catch (err) {
      showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  // Hủy gán thẻ (Unassign)
  const handleUnassignCard = async (card) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn hủy gán thẻ ${card.serial_code} khỏi khách hàng ${card.owner_name || card.owner_email}? Thẻ sẽ trở về trạng thái Chờ phát hành.`,
      )
    ) {
      return;
    }
    try {
      const res = await nfcAPI.unassignCard(card.id);
      showToast(res.message || "Đã hủy gán thẻ thành công");
      loadCards();
    } catch (err) {
      showToast(err.message || "Lỗi hủy gán thẻ", "error");
    }
  };

  // Xóa thẻ chưa kích hoạt
  const handleDeleteCard = async (card) => {
    if (
      !confirm(
        `Xác nhận xóa vĩnh viễn thẻ ${card.serial_code}? Hành động này không thể hoàn tác.`,
      )
    ) {
      return;
    }
    try {
      const res = await nfcAPI.deleteCard(card.id);
      showToast(res.message || "Đã xóa thẻ");
      loadCards();
    } catch (err) {
      showToast(err.message || "Lỗi xóa thẻ", "error");
    }
  };

  // Xử lý tạo lô thẻ mới (Batch Generator) với validate chặt chẽ
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!batchProductId) {
      showToast("Vui lòng chọn Sản Phẩm thẻ cần nạp chip", "error");
      return;
    }

    const cleanPrefix = batchPrefix.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (!cleanPrefix || cleanPrefix.length < 2 || cleanPrefix.length > 8) {
      showToast("Tiền tố Serial phải từ 2 đến 8 ký tự (chữ hoa, số hoặc gạch nối)", "error");
      return;
    }

    const countNum = parseInt(batchCount, 10);
    if (isNaN(countNum) || countNum < 1 || countNum > 500) {
      showToast("Số lượng thẻ mỗi lô phải từ 1 đến 500 thẻ", "error");
      return;
    }

    setBatchSubmitting(true);
    try {
      const res = await nfcAPI.createBatch({
        product_id: batchProductId,
        prefix: cleanPrefix,
        count: countNum,
      });
      showToast(res.message || `Đã tạo thành công lô ${countNum} thẻ NFC!`);
      setShowBatchModal(false);
      setBatchProductId("");
      loadCards();
    } catch (err) {
      showToast(err.message || "Lỗi tạo lô thẻ NFC", "error");
    } finally {
      setBatchSubmitting(false);
    }
  };

  // Xử lý gán thẻ cho khách hàng với validation
  const handleAssignCard = async (e) => {
    e.preventDefault();
    const cleanSerial = assignSerial.trim().toUpperCase();
    const cleanEmail = assignEmail.trim().toLowerCase();

    if (!cleanSerial) {
      showToast("Vui lòng nhập Mã Serial NFC", "error");
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showToast("Vui lòng nhập địa chỉ Email hợp lệ của khách hàng", "error");
      return;
    }

    setAssignSubmitting(true);
    try {
      let res;
      if (assignAlbumTitle.trim()) {
        res = await nfcAPI.provisionCard({
          serial_code: cleanSerial,
          owner_email: cleanEmail,
          title: assignAlbumTitle.trim(),
          description: assignAlbumDesc.trim(),
          reason: assignReason.trim(),
        });
      } else {
        res = await nfcAPI.adminAssignCard({
          serial_code: cleanSerial,
          user_email: cleanEmail,
          reason: assignReason.trim(),
        });
      }
      showToast(res.message || "Đã gán thẻ cho khách hàng thành công!");
      setShowAssignModal(false);
      setAssignSerial("");
      setAssignEmail("");
      setAssignReason("");
      setAssignAlbumTitle("");
      setAssignAlbumDesc("");
      setShowUserDropdown(false);
      loadCards();
    } catch (err) {
      showToast(err.message || "Lỗi gán thẻ NFC", "error");
    } finally {
      setAssignSubmitting(false);
    }
  };

  const getAppUrl = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || "https://vinatap.com";
  };

  // Xuất file CSV nạp chip chuẩn
  const exportCSV = () => {
    if (!cards.length) {
      showToast("Không có dữ liệu thẻ để xuất", "error");
      return;
    }
    const baseUrl = getAppUrl();
    const headers = [
      "STT",
      "Mã Serial",
      "Link Nạp Chip NFC",
      "Tỉnh Thành",
      "Trạng Thái",
      "Chủ Sở Hữu",
      "Email",
      "Số Lượt Truy Cập",
      "Lần Truy Cập Cuối",
      "Thời Gian Xem (giây)",
      "Ngày Kích Hoạt",
    ];
    const rows = cards.map((c, i) => [
      i + 1,
      c.serial_code || "",
      c.nfc_token ? `${baseUrl}/t/${c.nfc_token}` : "",
      c.province_name || "",
      c.status === "active"
        ? "Đã kích hoạt"
        : c.status === "disabled"
          ? "Đã khóa"
          : "Chờ phát hành",
      c.owner_name || "",
      c.owner_email || "",
      c.tap_count || 0,
      c.last_tapped_at ? new Date(c.last_tapped_at).toLocaleString("vi-VN") : "Chưa có",
      c.last_duration_seconds || 0,
      c.activated_at ? new Date(c.activated_at).toLocaleString("vi-VN") : "Chưa có",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join(
        "\n",
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `danh_sach_nfc_vinatap_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất file Nạp chip NFC (CSV) thành công");
  };

  const filteredUsers = useMemo(() => {
    const q = assignEmail.trim().toLowerCase();
    if (!q) return users.slice(0, 8);
    return users
      .filter((u) => {
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
        );
      })
      .slice(0, 8);
  }, [users, assignEmail]);

  return (
    <div className="admin-nfc-shell">
      {/* ─── STICKY HEADER ─── */}
      <div className="admin-nfc-sticky-header">
        <div className="admin-nfc-header">
          <div className="admin-nfc-header-title-wrap">
            <h1 className="admin-dash-title">
              <span className="title-desktop">🎫 Quản Lý Mã Khám Phá & Hành Trình Số</span>
              <span className="title-mobile">🎫 Mã Khám Phá</span>
            </h1>
            <p className="admin-dash-subtitle">
              Theo dõi lượt truy cập thời gian thực, quản lý mã hành trình số và cấp quyền mở khóa cho khách hàng
            </p>
          </div>
          <div className="admin-nfc-header__actions">
            <button
              type="button"
              className="btn btn-outline btn-export-csv"
              onClick={exportCSV}
              title="Tải file CSV danh sách mã hành trình số"
            >
              <Download size={15} /> <span className="btn-text-desktop">Xuất File CSV</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-assign-header"
              onClick={() => {
                setShowAssignModal(true);
                setShowUserDropdown(false);
              }}
              title="Cấp quyền hành trình cho khách hàng"
            >
              <UserPlus size={15} /> <span className="btn-text-desktop">Cấp Quyền Khách</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-create-batch"
              onClick={() => setShowBatchModal(true)}
              title="Tạo lô thẻ mới"
            >
              <Plus size={16} /> <span className="btn-text-desktop">Tạo Lô Thẻ Mới</span>
              <span className="btn-text-mobile">Tạo Lô</span>
            </button>
          </div>
        </div>

        {/* ─── TOP KPIS CAROUSEL ─── */}
        <div className="admin-nfc-kpis-carousel">
          <div className="admin-nfc-kpis">
            <div className="admin-nfc-kpi-card">
              <span className="admin-nfc-kpi-label">Tổng Mã Hành Trình</span>
              <span className="admin-nfc-kpi-value">{stats.total}</span>
              <span className="admin-nfc-kpi-sub">Đã tạo trong hệ thống</span>
            </div>
            <div className="admin-nfc-kpi-card admin-nfc-kpi-card--active">
              <span className="admin-nfc-kpi-label">Đã Kích Hoạt</span>
              <span className="admin-nfc-kpi-value text-green">{stats.active}</span>
              <span className="admin-nfc-kpi-sub">Đang hoạt động & gắn album</span>
            </div>
            <div className="admin-nfc-kpi-card admin-nfc-kpi-card--pending">
              <span className="admin-nfc-kpi-label">Chờ Kích Hoạt</span>
              <span className="admin-nfc-kpi-value text-orange">{stats.pending}</span>
              <span className="admin-nfc-kpi-sub">Mã dự trữ chưa cấp cho khách</span>
            </div>
            <div className="admin-nfc-kpi-card admin-nfc-kpi-card--disabled">
              <span className="admin-nfc-kpi-label">Đã Khóa / Tạm Dừng</span>
              <span className="admin-nfc-kpi-value text-red">{stats.disabled}</span>
              <span className="admin-nfc-kpi-sub">Vô hiệu hóa tạm thời</span>
            </div>
            <div className="admin-nfc-kpi-card admin-nfc-kpi-card--taps">
              <span className="admin-nfc-kpi-label">Tổng Lượt Truy Cập</span>
              <span className="admin-nfc-kpi-value text-blue">{stats.total_taps}</span>
              <span className="admin-nfc-kpi-sub">Truy cập hành trình & xem album</span>
            </div>
          </div>
        </div>

        {/* ─── SEARCH & FILTER BAR ─── */}
        <div className="admin-nfc-filters">
          <div className="admin-nfc-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Tra cứu Mã Kích Hoạt, Token, Email, Tên du khách, Tỉnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch("")}
                title="Xóa tìm kiếm"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="admin-nfc-selects-row">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="admin-nfc-select"
            >
              <option value="">Tất cả Tỉnh Thành ({provinces.length} Tỉnh)</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="admin-nfc-select"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đã kích hoạt</option>
              <option value="pending">Chờ phát hành</option>
              <option value="disabled">Đã khóa</option>
            </select>

            <button
              type="button"
              className={`btn btn-ghost btn-reload-nfc ${loading ? "is-loading" : ""}`}
              onClick={loadCards}
              title="Tải lại danh sách"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── DATA TABLE / LOAD STATE ─── */}
      {loading ? (
        <div className="card admin-nfc-table-wrap" style={{ padding: "2.5rem 1rem" }}>
          <DinoLoader
            fullScreen={false}
            size={200}
            text="Đang tải dữ liệu thẻ NFC VinaTap..."
            subtext="Đồng bộ lượt chạm, thời gian truy cập và trạng thái chip"
          />
        </div>
      ) : cards.length === 0 ? (
        <div className="card admin-nfc-empty">
          <CreditCard size={40} style={{ margin: "0 auto 12px", opacity: 0.35 }} />
          <p style={{ fontWeight: 600, fontSize: "1rem" }}>Không tìm thấy thẻ NFC nào phù hợp</p>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: 4 }}>
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái
          </p>
        </div>
      ) : (
        <>
          {/* 💻 BẢNG DỮ LIỆU DESKTOP */}
          <div className="card admin-nfc-table-wrap">
            <table className="admin-nfc-table">
              <thead>
                <tr>
                  <th>Mã Serial NFC</th>
                  <th>Sản Phẩm & Tỉnh Thành</th>
                  <th>Trạng Thái</th>
                  <th>Chủ Sở Hữu & Album</th>
                  <th>Truy Cập / Lượt Chạm (Chi Tiết)</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => {
                  const timeAgoText = formatTimeAgoWithMinutesSeconds(c.last_tapped_at);
                  const dwellText = formatDurationMinutesSeconds(c.last_duration_seconds);

                  return (
                    <tr key={c.id}>
                      {/* Cột 1: Serial + Copy */}
                      <td>
                        <div className="admin-nfc-serial-cell">
                          <CreditCard size={15} className="admin-nfc-serial-icon" />
                          <code className="admin-nfc-serial-code">{c.serial_code}</code>
                          <button
                            type="button"
                            className="admin-nfc-icon-btn"
                            onClick={() => copyToClipboard(c.serial_code, `serial-${c.id}`)}
                            title="Sao chép mã Serial"
                          >
                            {copiedId === `serial-${c.id}` ? (
                              <Check size={14} color="#16a34a" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Cột 2: Tỉnh thành & Vùng miền */}
                      <td>
                        <div className="admin-nfc-prov-cell">
                          <span className="admin-nfc-province">📍 {c.province_name || "Chưa gán"}</span>
                          {c.province_region && (
                            <span className={`nfc-region-badge nfc-region--${c.province_region}`}>
                              {c.province_region === "north"
                                ? "Miền Bắc"
                                : c.province_region === "central"
                                  ? "Miền Trung"
                                  : c.province_region === "south"
                                    ? "Miền Nam"
                                    : "Biển Đảo"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cột 3: Trạng thái */}
                      <td>
                        <div className="admin-nfc-status-group">
                          <span
                            className={`admin-nfc-status admin-nfc-status--${
                              c.status === "active"
                                ? "active"
                                : c.status === "disabled"
                                  ? "disabled"
                                  : "pending"
                            }`}
                          >
                            {c.status === "active"
                              ? "Đã kích hoạt"
                              : c.status === "disabled"
                                ? "Đã khóa"
                                : "Chờ phát hành"}
                          </span>
                        </div>
                      </td>

                      {/* Cột 4: Chủ sở hữu & Album */}
                      <td>
                        {c.owner_name || c.owner_email ? (
                          <div className="admin-nfc-owner-cell">
                            <p className="admin-nfc-owner-name">
                              <strong>{c.owner_name || "Khách hàng"}</strong>
                            </p>
                            <p className="admin-nfc-owner-email">{c.owner_email}</p>
                            {c.owner_phone && (
                              <p className="admin-nfc-owner-phone">📞 {c.owner_phone}</p>
                            )}
                            {c.album_title && (
                              <div className="admin-nfc-owner-album">
                                📖 <span>{c.album_title}</span>
                                {c.album_media_count > 0 && (
                                  <span className="album-media-badge">
                                    📸 {c.album_media_count} ảnh
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="admin-nfc-no-owner">Chưa có chủ sở hữu</span>
                        )}
                      </td>

                      {/* Cột 5: TRUY CẬP / LƯỢT CHẠM (TÂM ĐIỂM) */}
                      <td>
                        <div className="admin-nfc-access-cell">
                          <div className="access-cell-top">
                            <button
                              type="button"
                              className="nfc-tap-badge"
                              onClick={() => handleOpenAccessLogs(c)}
                              title="Bấm để xem danh sách chi tiết các lượt truy cập"
                            >
                              <Radio size={13} className="tap-pulse-icon" />
                              <span>{c.tap_count || 0} lượt truy cập</span>
                            </button>

                            <button
                              type="button"
                              className="btn-open-logs"
                              onClick={() => handleOpenAccessLogs(c)}
                              title="Xem chi tiết nhật ký người truy cập"
                            >
                              <History size={13} />
                              <span>Xem lịch sử</span>
                            </button>
                          </div>

                          {c.last_tapped_at ? (
                            <div className="access-cell-details">
                              <div
                                className="nfc-time-ago"
                                title={`Thời điểm truy cập: ${formatDateTimeFull(c.last_tapped_at)}`}
                              >
                                <Clock size={12} />
                                <span className="time-ago-text">
                                  <strong>{timeAgoText || "Vừa xong"}</strong>
                                </span>
                              </div>

                              {dwellText && (
                                <div className="nfc-dwell-duration">
                                  <Activity size={12} />
                                  <span>Thời gian lưu lại: <strong>{dwellText}</strong></span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="nfc-no-access">
                              <span>Chưa có người truy cập thẻ</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Cột 6: Hành động */}
                      <td>
                        <div className="admin-nfc-actions">
                          {/* Xem Token & QR */}
                          {c.nfc_token && (
                            <button
                              type="button"
                              className="admin-nfc-action-btn"
                              onClick={() => setViewTokenCard(c)}
                              title="Xem Link Chip NFC & Mã QR"
                            >
                              <Eye size={15} />
                            </button>
                          )}

                          {/* Gán thẻ nếu chưa có chủ */}
                          {c.status !== "active" && !c.owner_user_id && (
                            <button
                              type="button"
                              className="admin-nfc-action-btn admin-nfc-action-btn--primary"
                              onClick={() => {
                                setAssignSerial(c.serial_code);
                                setShowAssignModal(true);
                                setShowUserDropdown(false);
                              }}
                              title="Gán thẻ này cho khách hàng"
                            >
                              <UserPlus size={15} />
                            </button>
                          )}

                          {/* Hủy gán thẻ nếu có chủ */}
                          {c.owner_user_id && (
                            <button
                              type="button"
                              className="admin-nfc-action-btn"
                              onClick={() => handleUnassignCard(c)}
                              title="Hủy gán thẻ khỏi khách hàng"
                            >
                              <UserMinus size={15} />
                            </button>
                          )}

                          {/* Khóa hoặc Mở khóa thẻ */}
                          {c.status === "disabled" ? (
                            <button
                              type="button"
                              className="admin-nfc-action-btn text-green"
                              onClick={() => handleToggleStatus(c, "active")}
                              title="Mở khóa thẻ này"
                            >
                              <Unlock size={15} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-nfc-action-btn text-red"
                              onClick={() => handleToggleStatus(c, "disabled")}
                              title="Khóa tạm thời thẻ này"
                            >
                              <Lock size={15} />
                            </button>
                          )}

                          {/* Xóa thẻ pending */}
                          {c.status === "pending" && !c.owner_user_id && (
                            <button
                              type="button"
                              className="admin-nfc-action-btn text-muted"
                              onClick={() => handleDeleteCard(c)}
                              title="Xóa thẻ chưa phát hành"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 📱 THẺ NFC MOBILE CARDS (MODERN MOBILE VIEW) */}
          <div className="admin-nfc-cards-mobile">
            {cards.map((c) => {
              const timeAgoText = formatTimeAgoWithMinutesSeconds(c.last_tapped_at);
              const dwellText = formatDurationMinutesSeconds(c.last_duration_seconds);

              return (
                <div key={c.id} className="admin-nfc-mobile-card">
                  {/* Dòng 1: Serial + Copy + Status Badge */}
                  <div className="nfc-m-row-top">
                    <div className="nfc-m-serial-wrap">
                      <CreditCard size={14} className="nfc-m-icon" />
                      <code className="nfc-m-serial">{c.serial_code}</code>
                      <button
                        type="button"
                        className="nfc-m-copy-btn"
                        onClick={() => copyToClipboard(c.serial_code, `m-serial-${c.id}`)}
                        title="Sao chép mã Serial"
                      >
                        {copiedId === `m-serial-${c.id}` ? (
                          <Check size={13} color="#16a34a" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                    <span
                      className={`admin-nfc-status admin-nfc-status--${
                        c.status === "active"
                          ? "active"
                          : c.status === "disabled"
                            ? "disabled"
                            : "pending"
                      }`}
                    >
                      {c.status === "active"
                        ? "Đã kích hoạt"
                        : c.status === "disabled"
                          ? "Đã khóa"
                          : "Chờ phát hành"}
                    </span>
                  </div>

                  {/* Dòng 2: Tỉnh Thành & Vùng */}
                  <div className="nfc-m-row-info">
                    <span className="nfc-m-prov">📍 {c.province_name || "Chưa gán tỉnh"}</span>
                    {c.province_region && (
                      <>
                        <span className="nfc-m-sep">•</span>
                        <span className="nfc-m-region">
                          {c.province_region === "north"
                            ? "Miền Bắc"
                            : c.province_region === "central"
                              ? "Miền Trung"
                              : c.province_region === "south"
                                ? "Miền Nam"
                                : "Biển Đảo"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Dòng 3: Chủ Sở Hữu */}
                  <div className="nfc-m-row-owner">
                    <span className="nfc-m-owner-label">Chủ thẻ:</span>
                    {c.owner_name || c.owner_email ? (
                      <span className="nfc-m-owner-val">
                        <strong>{c.owner_name || "Khách hàng"}</strong>{" "}
                        {c.owner_email ? `(${c.owner_email})` : ""}
                      </span>
                    ) : (
                      <span className="nfc-m-owner-none">Chưa có chủ sở hữu</span>
                    )}
                  </div>

                  {/* Dòng 4: TRUY CẬP (ĐÃ THÊM THỜI GIAN PHÚT GIÂY) */}
                  <div className="nfc-m-row-access">
                    <div className="nfc-m-access-header">
                      <span className="nfc-m-access-badge">
                        ⚡ {c.tap_count || 0} lượt chạm
                      </span>
                      <button
                        type="button"
                        className="nfc-m-btn-log-link"
                        onClick={() => handleOpenAccessLogs(c)}
                      >
                        <History size={12} /> Xem nhật ký
                      </button>
                    </div>

                    {c.last_tapped_at ? (
                      <div className="nfc-m-access-time-box">
                        <p className="nfc-m-time-text">
                          <Clock size={12} />
                          <span>
                            Người truy cập: <strong>{timeAgoText || "Vừa xong"}</strong>
                          </span>
                        </p>
                        {dwellText && (
                          <p className="nfc-m-dwell-text">
                            <Activity size={12} />
                            <span>Thời gian lưu lại: <strong>{dwellText}</strong></span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="nfc-m-no-access-text">Chưa có lượt truy cập nào</p>
                    )}
                  </div>

                  {/* Dòng 5: Quick Actions */}
                  <div className="nfc-m-row-actions">
                    {c.nfc_token && (
                      <button
                        type="button"
                        className="nfc-m-btn-view"
                        onClick={() => setViewTokenCard(c)}
                      >
                        <Eye size={13} /> <span>Xem Token & QR</span>
                      </button>
                    )}
                    {c.status !== "active" && !c.owner_user_id && (
                      <button
                        type="button"
                        className="nfc-m-btn-assign"
                        onClick={() => {
                          setAssignSerial(c.serial_code);
                          setShowAssignModal(true);
                          setShowUserDropdown(false);
                        }}
                      >
                        <UserPlus size={13} /> <span>Gán Thẻ</span>
                      </button>
                    )}
                    {c.status === "disabled" ? (
                      <button
                        type="button"
                        className="nfc-m-btn-unlock"
                        onClick={() => handleToggleStatus(c, "active")}
                      >
                        <Unlock size={13} /> <span>Mở Khóa</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="nfc-m-btn-lock"
                        onClick={() => handleToggleStatus(c, "disabled")}
                      >
                        <Lock size={13} /> <span>Khóa Thẻ</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── MODAL 1: BATCH GENERATOR ─── */}
      {showBatchModal && (
        <div
          className="admin-nfc-modal-backdrop"
          onClick={() => setShowBatchModal(false)}
        >
          <div
            className="card admin-nfc-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-nfc-modal__header">
              <h3>➕ Tạo Lô Mã Hành Trình Mới (Batch Generator)</h3>
              <button
                type="button"
                className="admin-nfc-modal__close"
                onClick={() => setShowBatchModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateBatch}>
              <label className="admin-nfc-field">
                <span>Sản Phẩm Hành Trình Cần Khởi Tạo *</span>
                <select
                  value={batchProductId}
                  onChange={(e) => {
                    setBatchProductId(e.target.value);
                    const found = products.find(
                      (p) => String(p.id) === e.target.value,
                    );
                    if (found) {
                      const clean = found.name
                        .replace(/^(Thẻ NFC Du Lịch|Thẻ NFC|Thẻ Du Lịch|Thẻ|Combo \d+ Thẻ NFC Du Lịch)\s*[-–:]*\s*/i, "")
                        .replace(/\s*[-–:]*\s*(Bản Đồ|Du Lịch|Thủ Đô|Sài Gòn|Năng Động|Mộng Mơ).*$/i, "")
                        .trim();
                      const pfx = clean
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "")
                        .slice(0, 4)
                        .toUpperCase();
                      setBatchPrefix(pfx || "VNT");
                    }
                  }}
                  required
                >
                  <option value="">-- Chọn Sản Phẩm Thẻ Đang Bán --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({new Intl.NumberFormat("vi-VN").format(p.price)}đ)
                    </option>
                  ))}
                </select>
                <span className="admin-nfc-field__hint">
                  Mã Serial và link nạp chip NFC sinh ra sẽ liên kết trực tiếp với sản phẩm này.
                </span>
              </label>

              <label className="admin-nfc-field">
                <span>Tiền tố Serial (Prefix) *</span>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={(e) =>
                    setBatchPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))
                  }
                  placeholder="VD: DN, HN, SG, QN"
                  maxLength={8}
                  required
                />
                <span className="admin-nfc-field__hint">
                  Định dạng chuẩn VinaTap: <strong>{batchPrefix || "DN"}-2026-X8K9-M4P7</strong>
                </span>
              </label>

              <div className="admin-nfc-field">
                <span>Số Lượng Thẻ Cần Khởi Tạo (1 - 500) *</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  required
                />
                <div className="quick-count-chips">
                  {[20, 50, 100, 200, 500].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`quick-chip ${Number(batchCount) === num ? "is-selected" : ""}`}
                      onClick={() => setBatchCount(num)}
                    >
                      {num} thẻ
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-nfc-modal__footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowBatchModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={batchSubmitting}
                  className="btn btn-primary"
                >
                  {batchSubmitting ? "Đang tạo mã..." : `Xác Nhận Tạo ${batchCount} Thẻ`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: GÁN THẺ CHO KHÁCH HÀNG ─── */}
      {showAssignModal && (
        <div
          className="admin-nfc-modal-backdrop"
          onClick={() => {
            setShowAssignModal(false);
            setShowUserDropdown(false);
          }}
        >
          <div
            className="card admin-nfc-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-nfc-modal__header">
              <h3>👤 Cấp Quyền Hành Trình Cho Khách Hàng</h3>
              <button
                type="button"
                className="admin-nfc-modal__close"
                onClick={() => {
                  setShowAssignModal(false);
                  setShowUserDropdown(false);
                }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAssignCard}>
              <label className="admin-nfc-field">
                <span>Mã Kích Hoạt Hành Trình *</span>
                <input
                  type="text"
                  value={assignSerial}
                  onChange={(e) => setAssignSerial(e.target.value.toUpperCase())}
                  placeholder="Nhập chính xác mã Serial (VD: DN-2026-X8K9-M4P7)"
                  required
                />
              </label>

              {/* Searchable User Combobox */}
              <div className="admin-nfc-field admin-nfc-combobox-wrap">
                <span>Email Khách Hàng Nhận Thẻ *</span>
                <div className="admin-nfc-combobox">
                  <input
                    type="text"
                    value={assignEmail}
                    onChange={(e) => {
                      setAssignEmail(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    placeholder="Gõ tìm Tên, Email hoặc SĐT..."
                    required
                  />
                  <ChevronDown
                    size={16}
                    className="admin-nfc-combobox__arrow"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                  />
                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div className="admin-nfc-dropdown">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="admin-nfc-dropdown-item"
                          onClick={() => {
                            setAssignEmail(u.email);
                            setShowUserDropdown(false);
                          }}
                        >
                          <div className="admin-nfc-dropdown-item__main">
                            <span className="admin-nfc-dropdown-name">{u.name}</span>
                            <span className="admin-nfc-dropdown-email">{u.email}</span>
                          </div>
                          {u.phone && (
                            <span className="admin-nfc-dropdown-phone">{u.phone}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="admin-nfc-field__hint">
                  Hệ thống sẽ liên kết thẻ với tài khoản này ngay lập tức.
                </span>
              </div>

              <label className="admin-nfc-field">
                <span>Tên Album Kỷ Niệm (Tùy chọn - Khởi tạo sẵn trước khi gửi thẻ)</span>
                <input
                  type="text"
                  value={assignAlbumTitle}
                  onChange={(e) => setAssignAlbumTitle(e.target.value)}
                  placeholder="VD: Kỷ niệm chuyến đi Đà Nẵng 2026..."
                />
              </label>

              <label className="admin-nfc-field">
                <span>Mô Tả Album (Tùy chọn)</span>
                <input
                  type="text"
                  value={assignAlbumDesc}
                  onChange={(e) => setAssignAlbumDesc(e.target.value)}
                  placeholder="VD: Hành trình khám phá phố cổ và biển..."
                />
              </label>

              <label className="admin-nfc-field">
                <span>Ghi Chú / Lý Do Gán Thủ Công</span>
                <input
                  type="text"
                  value={assignReason}
                  onChange={(e) => setAssignReason(e.target.value)}
                  placeholder="VD: Đơn hàng Shopee #98123 hoặc khách mua tại quầy"
                />
              </label>

              <div className="admin-nfc-modal__footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowAssignModal(false);
                    setShowUserDropdown(false);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={assignSubmitting}
                  className="btn btn-primary"
                >
                  {assignSubmitting ? "Đang xử lý..." : "Xác Nhận Gán Thẻ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: VIEW CHIP TOKEN LINK & QR ─── */}
      {viewTokenCard && (
        <div
          className="admin-nfc-modal-backdrop"
          onClick={() => setViewTokenCard(null)}
        >
          <div
            className="card admin-nfc-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-nfc-modal__header">
              <h3>🔗 Link Nạp Chip NFC & Mã QR VinaTap</h3>
              <button
                type="button"
                className="admin-nfc-modal__close"
                onClick={() => setViewTokenCard(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-nfc-token-view">
              <p className="admin-nfc-token-desc">
                Đường dẫn dưới đây được nạp trực tiếp vào chip NTAG213/215. Khi điện thoại chạm vào
                thẻ, liên kết sẽ tự động mở trang kỷ niệm và cẩm nang du lịch tương ứng.
              </p>

              <div className="admin-nfc-token-box">
                <code>{`${getAppUrl()}/t/${viewTokenCard.nfc_token}`}</code>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    copyToClipboard(
                      `${getAppUrl()}/t/${viewTokenCard.nfc_token}`,
                      "token-url",
                    )
                  }
                >
                  <Copy size={16} /> Sao chép Link
                </button>
              </div>

              {/* QR Preview Block */}
              <div className="admin-nfc-qr-box">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    `${getAppUrl()}/t/${viewTokenCard.nfc_token}`,
                  )}`}
                  alt="QR Code Chip NFC"
                  className="nfc-qr-img"
                  width={140}
                  height={140}
                />
                <div className="nfc-qr-info">
                  <p>
                    <strong>Mã Serial:</strong> <code>{viewTokenCard.serial_code}</code>
                  </p>
                  <p>
                    <strong>Tỉnh Thành:</strong> {viewTokenCard.province_name}
                  </p>
                  <p>
                    <strong>Số lượt chạm:</strong> {viewTokenCard.tap_count || 0} lượt
                  </p>
                </div>
              </div>

              <div className="admin-nfc-token-footer">
                <a
                  href={`/t/${viewTokenCard.nfc_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  <ExternalLink size={16} /> Trải Nghiệm Chạm Thẻ (Test Tap)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: NHẬT KÝ NGƯỜI TRUY CẬP (ACCESS LOGS MODAL) ─── */}
      {accessLogsCard && (
        <div
          className="admin-nfc-modal-backdrop"
          onClick={() => setAccessLogsCard(null)}
        >
          <div
            className="card admin-nfc-modal admin-nfc-modal--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-nfc-modal__header">
              <div>
                <h3>📊 Nhật Ký Người Truy Cập & Mở Khóa Hành Trình</h3>
                <p className="admin-nfc-modal-sub">
                  Mã Hành Trình: <strong>{accessLogsCard.serial_code}</strong> | Tỉnh:{" "}
                  <strong>{accessLogsCard.province_name}</strong> | Tổng lượt truy cập:{" "}
                  <strong>{accessLogsCard.tap_count || 0} lượt</strong>
                </p>
              </div>
              <button
                type="button"
                className="admin-nfc-modal__close"
                onClick={() => setAccessLogsCard(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-nfc-logs-body">
              {loadingLogs ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <DinoLoader
                    fullScreen={false}
                    size={150}
                    text="Đang giải mã nhật ký truy cập..."
                    subtext="Tính toán thời gian phút giây và thiết bị người dùng"
                  />
                </div>
              ) : cardLogs.length === 0 ? (
                <div className="admin-nfc-logs-empty">
                  <Activity size={36} style={{ margin: "0 auto 10px", opacity: 0.3 }} />
                  <p>Thẻ này chưa ghi nhận lượt truy cập nào từ khách hàng.</p>
                  <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 4 }}>
                    Khi khách chạm thẻ hoặc quét QR, nhật ký sẽ tự động hiển thị tại đây theo từng phút giây.
                  </p>
                </div>
              ) : (
                <div className="admin-nfc-logs-table-wrap">
                  <table className="admin-nfc-logs-table">
                    <thead>
                      <tr>
                        <th>Thời Điểm Truy Cập</th>
                        <th>Cách Đây (Phút Giây)</th>
                        <th>Thời Gian Lưu Lại</th>
                        <th>Thiết Bị</th>
                        <th>Địa Chỉ IP</th>
                        <th>Nguồn Đến</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardLogs.map((log) => {
                        const timeAgo = formatTimeAgoWithMinutesSeconds(log.created_at);
                        const durationText = formatDurationMinutesSeconds(log.duration_seconds);

                        return (
                          <tr key={log.id}>
                            <td>
                              <span className="log-time-full">
                                {formatDateTimeFull(log.created_at)}
                              </span>
                            </td>
                            <td>
                              <span className="log-time-ago-badge">
                                🕒 {timeAgo || "Vừa xong"}
                              </span>
                            </td>
                            <td>
                              {durationText ? (
                                <span className="log-duration-badge">
                                  ⏱ {durationText}
                                </span>
                              ) : (
                                <span className="text-muted">Đang xem</span>
                              )}
                            </td>
                            <td>
                              <div className="log-device-badge">
                                {log.device_type === "mobile" ? (
                                  <>
                                    <Smartphone size={13} color="#2563eb" />
                                    <span>Điện thoại</span>
                                  </>
                                ) : log.device_type === "tablet" ? (
                                  <>
                                    <Tablet size={13} color="#9333ea" />
                                    <span>Máy tính bảng</span>
                                  </>
                                ) : (
                                  <>
                                    <Monitor size={13} color="#475569" />
                                    <span>Máy tính</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <code className="log-ip">{log.ip_address || "127.0.0.1"}</code>
                            </td>
                            <td>
                              <span className="log-source">
                                {log.utm_source === "nfc"
                                  ? "🏷 Quét Chip NFC"
                                  : log.referrer
                                    ? "🔗 Liên kết web"
                                    : "🌐 Trực tiếp"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="admin-nfc-modal__footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setAccessLogsCard(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {toast && (
        <div className={`admin-nfc-toast admin-nfc-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
