"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { nfcAPI, provinceAPI, adminStatsAPI, userAPI, productAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminNfcCards.css";

export default function AdminNfcCards() {
  const [cards, setCards] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [viewTokenCard, setViewTokenCard] = useState(null);

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
    loadProvincesAndStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCards();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedProvince, selectedStatus]);

  const loadProvincesAndStats = async () => {
    try {
      const [provRes, overviewRes, userRes, prodRes] = await Promise.all([
        provinceAPI.getAll(),
        adminStatsAPI.getOverview(),
        userAPI.getAll({ limit: 200 }),
        productAPI.getAll(true),
      ]);
      setProvinces(provRes.provinces || []);
      setUsers(userRes.users || []);
      setProducts(prodRes.products || (Array.isArray(prodRes) ? prodRes : []));
      if (overviewRes.overview) {
        const ov = overviewRes.overview;
        setStats({
          total: ov.nfc_total || 0,
          active: ov.nfc_activated || 0,
          pending: (ov.nfc_total || 0) - (ov.nfc_activated || 0),
        });
      }
    } catch (err) {
      console.error("loadProvincesAndStats:", err);
    }
  };

  const loadCards = async () => {
    setLoading(true);
    try {
      const res = await nfcAPI.adminSearch({
        q: search.trim(),
        province_id: selectedProvince,
        status: selectedStatus,
        limit: 100,
      });
      setCards(res.cards || []);
    } catch (err) {
      showToast(err.message || "Lỗi tải danh sách thẻ NFC", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!batchProductId) {
      showToast("Vui lòng chọn Sản Phẩm cần tạo lô thẻ", "error");
      return;
    }
    setBatchSubmitting(true);
    try {
      const res = await nfcAPI.createBatch({
        product_id: batchProductId,
        prefix: batchPrefix.trim().toUpperCase() || "VNT",
        count: parseInt(batchCount, 10) || 50,
      });
      showToast(res.message || "Đã tạo lô thẻ thành công!");
      setShowBatchModal(false);
      setBatchProductId("");
      loadProvincesAndStats();
      loadCards();
    } catch (err) {
      showToast(err.message || "Lỗi tạo lô thẻ NFC", "error");
    } finally {
      setBatchSubmitting(false);
    }
  };

  const handleAssignCard = async (e) => {
    e.preventDefault();
    if (!assignSerial.trim() || !assignEmail.trim()) {
      showToast("Vui lòng nhập Mã Serial và Email nhận thẻ", "error");
      return;
    }
    setAssignSubmitting(true);
    try {
      let res;
      if (assignAlbumTitle.trim()) {
        res = await nfcAPI.provisionCard({
          serial_code: assignSerial.trim(),
          owner_email: assignEmail.trim(),
          title: assignAlbumTitle.trim(),
          description: assignAlbumDesc.trim(),
          reason: assignReason.trim(),
        });
      } else {
        res = await nfcAPI.adminAssignCard({
          serial_code: assignSerial.trim(),
          user_email: assignEmail.trim(),
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
      loadProvincesAndStats();
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
    return process.env.NEXT_PUBLIC_APP_URL || "https://vinatap.vercel.app";
  };

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
      "Tỉnh thành",
      "Trạng thái",
      "Chủ sở hữu Email",
      "Ngày kích hoạt",
    ];
    const rows = cards.map((c, i) => [
      i + 1,
      c.serial_code || "",
      c.nfc_token ? `${baseUrl}/t/${c.nfc_token}` : "",
      c.province_name || "",
      c.status === "active" ? "Đã kích hoạt" : "Chờ phát hành",
      c.owner_email || "",
      c.activated_at ? new Date(c.activated_at).toLocaleString("vi-VN") : "",
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

  const filteredUsers = users.filter((u) => {
    const q = assignEmail.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  return (
    <div className="admin-nfc-shell">
      <div className="admin-nfc-sticky-header">
        <div className="admin-nfc-header">
          <div className="admin-nfc-header-title-wrap">
            <h1 className="admin-dash-title">
              <span className="title-desktop">🎫 Serial NFC & Nạp Chip</span>
              <span className="title-mobile">🎫 Thẻ NFC</span>
            </h1>
            <p className="admin-dash-subtitle">
              Quản lý danh sách Serial, khởi tạo lô thẻ in và gán thẻ khách hàng
            </p>
          </div>
          <div className="admin-nfc-header__actions">
            <button
              className="btn btn-outline btn-export-csv"
              onClick={exportCSV}
              title="Tải file CSV danh sách mã để gửi xưởng in & nạp chip"
            >
              <Download size={15} /> <span className="btn-text-desktop">Xuất File Nạp Chip</span>
            </button>
            <button
              className="btn btn-ghost btn-assign-header"
              onClick={() => {
                setShowAssignModal(true);
                setShowUserDropdown(false);
              }}
              title="Gán thẻ cho khách hàng"
            >
              <UserPlus size={15} /> <span className="btn-text-desktop">Gán thẻ</span>
            </button>
            <button
              className="btn btn-primary btn-create-batch"
              onClick={() => setShowBatchModal(true)}
              title="Tạo lô thẻ mới"
            >
              <Plus size={16} /> <span className="btn-text-desktop">Tạo Lô Thẻ Mới</span><span className="btn-text-mobile">Tạo Lô</span>
            </button>
          </div>
        </div>

        {/* Top KPIs Carousel */}
        <div className="admin-nfc-kpis-carousel">
          <div className="admin-nfc-kpis">
            <div className="admin-nfc-kpi-card">
              <span className="admin-nfc-kpi-label">Tổng Serial NFC</span>
              <span className="admin-nfc-kpi-value">{stats.total}</span>
            </div>
            <div className="admin-nfc-kpi-card admin-nfc-kpi-card--active">
              <span className="admin-nfc-kpi-label">Đã Kích Hoạt</span>
              <span className="admin-nfc-kpi-value text-green">{stats.active}</span>
            </div>
            <div className="admin-nfc-kpi-card admin-nfc-kpi-card--pending">
              <span className="admin-nfc-kpi-label">Chờ Phát Hành</span>
              <span className="admin-nfc-kpi-value text-orange">{stats.pending}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter bar */}
        <div className="admin-nfc-filters">
          <div className="admin-nfc-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Tra cứu Serial, Token, Email..."
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
              <option value="">Tất cả Sản Phẩm ({products.length} SP)</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
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
              <option value="pending">Chờ phát hành</option>
              <option value="active">Đã kích hoạt</option>
            </select>

            <button
              className="btn btn-ghost btn-reload-nfc"
              onClick={loadCards}
              title="Tải lại danh sách"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card admin-nfc-table-wrap" style={{ padding: "2.5rem 1rem" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang tải danh sách thẻ NFC..." subtext="Đang giải mã token và kiểm tra kích hoạt" />
        </div>
      ) : cards.length === 0 ? (
        <div className="card admin-nfc-empty">
          Chưa có thẻ NFC nào phù hợp bộ lọc
        </div>
      ) : (
        <>
          {/* 💻 BẢNG DỮ LIỆU DESKTOP */}
          <div className="card admin-nfc-table-wrap">
            <table className="admin-nfc-table">
              <thead>
                <tr>
                  <th>Mã Serial NFC</th>
                  <th>Tỉnh Thành</th>
                  <th>Trạng Thái</th>
                  <th>Chủ Sở Hữu</th>
                  <th>Ngày Kích Hoạt</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-nfc-serial-cell">
                        <CreditCard size={15} className="admin-nfc-serial-icon" />
                        <span className="admin-nfc-serial-code">
                          {c.serial_code}
                        </span>
                        <button
                          type="button"
                          className="admin-nfc-icon-btn"
                          onClick={() => copyToClipboard(c.serial_code, c.id)}
                          title="Sao chép mã Serial"
                        >
                          {copiedId === c.id ? (
                            <Check size={14} color="#16a34a" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="admin-nfc-province">
                        {c.province_name || "Chưa gán tỉnh"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-nfc-status admin-nfc-status--${c.status === "active" ? "active" : "pending"}`}
                      >
                        {c.status === "active" ? "Đã kích hoạt" : "Chờ phát hành"}
                      </span>
                    </td>
                    <td>
                      {c.owner_name || c.owner_email ? (
                        <div>
                          <p className="admin-nfc-owner-name">{c.owner_name}</p>
                          <p className="admin-nfc-owner-email">
                            {c.owner_email}
                          </p>
                        </div>
                      ) : (
                        <span className="admin-nfc-no-owner">Chưa có chủ</span>
                      )}
                    </td>
                    <td>
                      {c.activated_at
                        ? new Date(c.activated_at).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      <div className="admin-nfc-actions">
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
                        {c.status !== "active" && (
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 THẺ NFC MOBILE CARDS (MODERN MOBILE VIEW) */}
          <div className="admin-nfc-cards-mobile">
            {cards.map((c) => (
              <div key={c.id} className="admin-nfc-mobile-card">
                {/* Dòng 1: Serial + Copy + Status Badge */}
                <div className="nfc-m-row-top">
                  <div className="nfc-m-serial-wrap">
                    <CreditCard size={14} className="nfc-m-icon" />
                    <code className="nfc-m-serial">{c.serial_code}</code>
                    <button
                      type="button"
                      className="nfc-m-copy-btn"
                      onClick={() => copyToClipboard(c.serial_code, c.id)}
                      title="Sao chép mã Serial"
                    >
                      {copiedId === c.id ? (
                        <Check size={13} color="#16a34a" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                  <span
                    className={`admin-nfc-status admin-nfc-status--${c.status === "active" ? "active" : "pending"}`}
                  >
                    {c.status === "active" ? "Đã kích hoạt" : "Chờ phát hành"}
                  </span>
                </div>

                {/* Dòng 2: Tỉnh Thành & Ngày kích hoạt */}
                <div className="nfc-m-row-info">
                  <span className="nfc-m-prov">📍 {c.province_name || "Chưa gán tỉnh"}</span>
                  <span className="nfc-m-sep">•</span>
                  <span className="nfc-m-date">
                    {c.activated_at ? `Kích hoạt: ${new Date(c.activated_at).toLocaleDateString("vi-VN")}` : "Chưa kích hoạt"}
                  </span>
                </div>

                {/* Dòng 3: Chủ Sở Hữu */}
                <div className="nfc-m-row-owner">
                  <span className="nfc-m-owner-label">Chủ thẻ:</span>
                  {c.owner_name || c.owner_email ? (
                    <span className="nfc-m-owner-val">
                      <strong>{c.owner_name}</strong> {c.owner_email ? `(${c.owner_email})` : ""}
                    </span>
                  ) : (
                    <span className="nfc-m-owner-none">Chưa có chủ sở hữu</span>
                  )}
                </div>

                {/* Dòng 4: Quick Action Buttons */}
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
                  {c.status !== "active" && (
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
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal 1: Batch Generator */}
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
              <h3>➕ Tạo Lô Thẻ NFC Mới (Batch Generator)</h3>
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
                <span>Sản Phẩm Cần Nạp Chip *</span>
                <select
                  value={batchProductId}
                  onChange={(e) => {
                    setBatchProductId(e.target.value);
                    const found = products.find(
                      (p) => String(p.id) === e.target.value,
                    );
                    if (found) {
                      const clean = found.name
                        .replace(/^(Mảnh ghép NFC 3D\s*[-–:]*|Mảnh\s*[-–:]*)/i, "")
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
                  <option value="">-- Chọn Sản Phẩm Đang Bán --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({new Intl.NumberFormat("vi-VN").format(p.price)}đ)
                    </option>
                  ))}
                </select>
                <span className="admin-nfc-field__hint">
                  Mã Serial và link Token chip NFC sinh ra sẽ liên kết với sản phẩm này.
                </span>
              </label>

              <label className="admin-nfc-field">
                <span>Tiền tố Serial (Prefix)</span>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={(e) => setBatchPrefix(e.target.value)}
                  placeholder="VD: DN hoặc VNT-DN"
                  required
                />
                <span className="admin-nfc-field__hint">
                  Mã sẽ được sinh ngẫu nhiên bảo mật cao (VD:{" "}
                  {batchPrefix || "DN"}-2026-X8K9-M4P7)
                </span>
              </label>

              <label className="admin-nfc-field">
                <span>Số Lượng Thẻ Cần Tạo (Tối đa 500)</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  required
                />
              </label>

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
                  {batchSubmitting ? "Đang khởi tạo..." : "Tạo Lô Thẻ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Card */}
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
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="admin-nfc-modal__header">
              <h3>👤 Gán Thẻ NFC Cho Khách Hàng</h3>
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
                <span>Mã Serial NFC</span>
                <input
                  type="text"
                  value={assignSerial}
                  onChange={(e) => setAssignSerial(e.target.value)}
                  placeholder="Nhập chính xác mã Serial (VD: DN-2026-X8K9-M4P7)"
                  required
                />
              </label>

              {/* Searchable User Combobox */}
              <div className="admin-nfc-field admin-nfc-combobox-wrap">
                <span>Email Khách Hàng Nhận Thẻ</span>
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
                            <span className="admin-nfc-dropdown-name">
                              {u.name}
                            </span>
                            <span className="admin-nfc-dropdown-email">
                              {u.email}
                            </span>
                          </div>
                          {u.phone && (
                            <span className="admin-nfc-dropdown-phone">
                              {u.phone}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="admin-nfc-field__hint">
                  Gõ để lọc danh sách tài khoản hoặc tự nhập Email bất kỳ
                </span>
              </div>

              <label className="admin-nfc-field">
                <span>Tên Album kỷ niệm (Tùy chọn - Tạo album sẵn trước khi giao thẻ)</span>
                <input
                  type="text"
                  value={assignAlbumTitle}
                  onChange={(e) => setAssignAlbumTitle(e.target.value)}
                  placeholder="VD: Kỷ niệm Đà Nẵng 2026..."
                />
              </label>

              <label className="admin-nfc-field">
                <span>Mô tả Album (Tùy chọn)</span>
                <input
                  type="text"
                  value={assignAlbumDesc}
                  onChange={(e) => setAssignAlbumDesc(e.target.value)}
                  placeholder="VD: Chuyến du lịch đáng nhớ cùng gia đình..."
                />
              </label>

              <label className="admin-nfc-field">
                <span>Ghi chú / Lý do gán thủ công</span>
                <input
                  type="text"
                  value={assignReason}
                  onChange={(e) => setAssignReason(e.target.value)}
                  placeholder="VD: Đơn bán sỉ qua Shopee #98123"
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
                  {assignSubmitting ? "Đang gán..." : "Xác Nhận Gán Thẻ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: View Chip Token Link */}
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
              <h3>🔗 Link Mã Hóa Chip NFC</h3>
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
                Đường dẫn dưới đây được nạp trực tiếp vào chip NTAG213/215. Khi
                điện thoại chạm vào chip, link sẽ tự động mở ra.
              </p>
              <div className="admin-nfc-token-box">
                <code>{`${getAppUrl()}/t/${viewTokenCard.nfc_token}`}</code>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    copyToClipboard(
                      `${getAppUrl()}/t/${viewTokenCard.nfc_token}`,
                      "token",
                    )
                  }
                >
                  <Copy size={16} /> Sao chép Link
                </button>
              </div>
              <p className="admin-nfc-token-note">
                <HelpCircle size={14} /> Mã Serial:{" "}
                <strong>{viewTokenCard.serial_code}</strong> | Tỉnh:{" "}
                <strong>{viewTokenCard.province_name}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`admin-nfc-toast admin-nfc-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
