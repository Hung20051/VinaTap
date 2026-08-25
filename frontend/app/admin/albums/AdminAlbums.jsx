"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Folder,
  Lock,
  Globe,
  HardDrive,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  User,
  MapPin,
  Tag,
  Film,
  Image as ImageIcon,
  ExternalLink,
  Flag,
  ShieldAlert,
} from "lucide-react";
import { albumAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminAlbums.css";

export default function AdminAlbums() {
  const [activeTab, setActiveTab] = useState("management"); // management | reports | storage
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_albums: 0,
    private_albums: 0,
    public_albums: 0,
    total_photos: 0,
    total_videos: 0,
    estimated_bytes: 0,
  });

  // Table state (Tab 1: All Albums)
  const [albums, setAlbums] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all"); // all | private | public
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | archived

  // Reports state (Tab 2: Reported Albums)
  const [reports, setReports] = useState([]);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportStatusFilter, setReportStatusFilter] = useState("pending"); // pending | resolved | dismissed | all

  // Selected Album for Metadata Modal
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  
  // Lock Modal State
  const [lockModalTarget, setLockModalTarget] = useState(null); // { albumId, albumTitle, reportId? }
  const [lockReasonChoice, setLockReasonChoice] = useState("Nội dung phản cảm / Không phù hợp");
  const [lockReasonCustom, setLockReasonCustom] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === "management") {
      loadAlbums();
    } else if (activeTab === "reports") {
      loadReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, privacyFilter, statusFilter, activeTab, reportsPage, reportStatusFilter]);

  const loadStats = async () => {
    try {
      const res = await albumAPI.getAdminStats();
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Lỗi tải thống kê album:", err);
    }
  };

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const res = await albumAPI.getAdminList({
        page,
        limit: 15,
        search,
        privacy: privacyFilter,
        status: statusFilter,
      });
      setAlbums(res.albums || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Lỗi nạp danh sách album:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await albumAPI.getAdminReports({
        page: reportsPage,
        limit: 15,
        status: reportStatusFilter,
      });
      setReports(res.reports || []);
      setReportsTotal(res.total || 0);
    } catch (err) {
      console.error("Lỗi nạp danh sách báo cáo vi phạm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadAlbums();
  };

  const handleOpenLockModal = (album, reportId = null) => {
    setLockModalTarget({
      albumId: album.id || album.album_id,
      albumTitle: album.title || album.album_title || `Album #${album.id || album.album_id}`,
      reportId: reportId,
    });
    setLockReasonChoice("Nội dung phản cảm / Không phù hợp");
    setLockReasonCustom("");
  };

  const handleConfirmLock = async () => {
    if (!lockModalTarget) return;
    const finalReason = lockReasonChoice === "Khác" ? lockReasonCustom.trim() : lockReasonChoice;
    if (!finalReason) {
      alert("Vui lòng nhập lý do khóa album");
      return;
    }

    setActionLoading(true);
    try {
      if (lockModalTarget.reportId) {
        await albumAPI.resolveReport(lockModalTarget.reportId, {
          action: "lock",
          locked_reason: finalReason,
        });
        await loadReports();
      } else {
        await albumAPI.updateAdminStatus(lockModalTarget.albumId, {
          status: "archived",
          locked_reason: finalReason,
        });
        await loadAlbums();
      }
      await loadStats();
      setLockModalTarget(null);
      if (selectedAlbum?.id === lockModalTarget.albumId) {
        setSelectedAlbum((prev) => ({ ...prev, status: "archived", locked_reason: finalReason }));
      }
    } catch (err) {
      alert("Lỗi khi khóa album: " + (err.message || "Lỗi server"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnlockAlbum = async (album) => {
    const albumId = album.id || album.album_id;
    if (!confirm(`Bạn có chắc chắn muốn MỞ KHÓA HOẠT ĐỘNG cho Album #${albumId}?`)) return;

    setActionLoading(true);
    try {
      await albumAPI.updateAdminStatus(albumId, { status: "active", locked_reason: null });
      await loadAlbums();
      if (activeTab === "reports") await loadReports();
      await loadStats();
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum((prev) => ({ ...prev, status: "active", locked_reason: null }));
      }
    } catch (err) {
      alert("Lỗi khi mở khóa album");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismissReport = async (reportId) => {
    if (!confirm("Bạn có chắc muốn BÁC BỎ / BỎ QUA báo cáo này không?")) return;
    setActionLoading(true);
    try {
      await albumAPI.resolveReport(reportId, { action: "dismiss" });
      await loadReports();
    } catch (err) {
      alert("Lỗi khi bỏ qua báo cáo");
    } finally {
      setActionLoading(false);
    }
  };

  // Định dạng dung lượng MB / GB
  const formatStorage = (bytes) => {
    if (!bytes || bytes === 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="admin-albums-wrap">
      {/* Header */}
      <div className="admin-albums-header">
        <div>
          <h1 className="admin-albums-title">
            <span className="title-desktop">🖼️ Quản Lý Album &amp; Kiểm Duyệt</span>
            <span className="title-mobile">🖼️ Quản Lý Album</span>
          </h1>
          <p className="admin-albums-subtitle">
            Hệ thống quản trị Metadata &amp; Xử lý Báo cáo vi phạm — Bảo mật quyền riêng tư 🔒
          </p>
        </div>
        <button
          className="admin-albums-btn-refresh"
          onClick={() => {
            loadStats();
            if (activeTab === "management") loadAlbums();
            if (activeTab === "reports") loadReports();
          }}
          title="Tải lại dữ liệu"
        >
          <RefreshCw size={15} /> <span className="btn-refresh-text">Tải lại</span>
        </button>
      </div>

      {/* KPI Resource Cards Carousel */}
      <div className="admin-albums-kpis-carousel">
        <div className="admin-albums-kpi-grid">
          {/* Card 1: Total Albums */}
          <div className="card admin-albums-kpi-card">
            <div className="admin-albums-kpi-icon admin-albums-kpi-icon--blue">
              <Folder size={20} />
            </div>
            <div className="admin-albums-kpi-info">
              <span className="admin-albums-kpi-label">Tổng Số Album</span>
              <h3 className="admin-albums-kpi-value">
                {stats.total_albums.toLocaleString("vi-VN")}
              </h3>
              <span className="admin-albums-kpi-sub">Kỷ niệm đã tạo</span>
            </div>
          </div>

          {/* Card 2: Private Albums */}
          <div className="card admin-albums-kpi-card">
            <div className="admin-albums-kpi-icon admin-albums-kpi-icon--purple">
              <Lock size={20} />
            </div>
            <div className="admin-albums-kpi-info">
              <span className="admin-albums-kpi-label">Album Riêng Tư</span>
              <h3 className="admin-albums-kpi-value">
                {stats.private_albums.toLocaleString("vi-VN")}
              </h3>
              <span className="admin-albums-kpi-sub text-green">
                🔒 Bảo mật riêng tư
              </span>
            </div>
          </div>

          {/* Card 3: Public Albums */}
          <div className="card admin-albums-kpi-card">
            <div className="admin-albums-kpi-icon admin-albums-kpi-icon--orange">
              <Globe size={20} />
            </div>
            <div className="admin-albums-kpi-info">
              <span className="admin-albums-kpi-label">Album Công Khai</span>
              <h3 className="admin-albums-kpi-value">
                {stats.public_albums.toLocaleString("vi-VN")}
              </h3>
              <span className="admin-albums-kpi-sub">
                🌐 Bản đồ cộng đồng
              </span>
            </div>
          </div>

          {/* Card 4: Storage Used */}
          <div className="card admin-albums-kpi-card">
            <div className="admin-albums-kpi-icon admin-albums-kpi-icon--green">
              <HardDrive size={20} />
            </div>
            <div className="admin-albums-kpi-info">
              <span className="admin-albums-kpi-label">Dung Lượng Đã Dùng</span>
              <h3 className="admin-albums-kpi-value">
                {formatStorage(stats.estimated_bytes)}
              </h3>
              <span className="admin-albums-kpi-sub">
                🖼️ {stats.total_photos} ảnh • 🎥 {stats.total_videos} video
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Carousel */}
      <div className="admin-albums-tabs-carousel">
        <div className="admin-albums-tabs">
          <button
            className={`admin-albums-tab-btn ${activeTab === "management" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("management");
              setPage(1);
            }}
          >
            <Folder size={16} /> 📁 Quản Lý Metadata
          </button>
          <button
            className={`admin-albums-tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reports");
              setReportsPage(1);
            }}
          >
            <ShieldAlert size={16} /> 🚨 Báo Cáo Vi Phạm
          </button>
          <button
            className={`admin-albums-tab-btn ${activeTab === "storage" ? "active" : ""}`}
            onClick={() => setActiveTab("storage")}
          >
            <HardDrive size={16} /> 💾 Dung Lượng &amp; Hạ Tầng
          </button>
        </div>
      </div>

      {/* TAB 1: ALBUM MANAGEMENT METADATA */}
      {activeTab === "management" && (
        <div className="card admin-albums-tab-panel">
          {/* Controls Header */}
          <div className="admin-albums-controls">
            <form
              onSubmit={handleSearchSubmit}
              className="admin-albums-search-form"
            >
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm theo tên album, tỉnh thành, serial, chủ thẻ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-albums-search-input"
              />
              <button type="submit" className="admin-albums-btn-search">
                Tìm
              </button>
            </form>

            <div className="admin-albums-filters">
              <div className="filter-group">
                <select
                  value={privacyFilter}
                  onChange={(e) => {
                    setPrivacyFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">Tất cả Quyền Riêng Tư</option>
                  <option value="public">🌐 Công Khai (Public)</option>
                  <option value="private">🔒 Riêng Tư (Private)</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="active">Đang Hoạt Động</option>
                  <option value="archived">Đã Khóa / Tạm Ẩn</option>
                  <option value="all">Tất Cả Trạng Thái</option>
                </select>
              </div>
            </div>
          </div>

          {/* Album List Table */}
          {loading ? (
            <div style={{ padding: "3rem 1rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <DinoLoader fullScreen={false} size={200} text="Đang tải danh sách Album..." subtext="Đang kết nối kho ảnh Cloudinary" />
            </div>
          ) : albums.length === 0 ? (
            <div className="admin-albums-empty">
              <Folder size={40} className="text-muted" />
              <p>Không tìm thấy Album nào phù hợp bộ lọc.</p>
            </div>
          ) : (
            <>
              {/* 🖥️ Desktop Table View */}
              <div className="table-responsive admin-albums-desktop-table">
                <table className="admin-albums-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Album &amp; Tỉnh Thành</th>
                      <th>Chủ Sở Hữu</th>
                      <th>Thẻ NFC Serial</th>
                      <th>Media / Dung lượng</th>
                      <th>Quyền Riêng Tư</th>
                      <th>Trạng Thái</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {albums.map((album) => {
                      const estimatedMb = (
                        ((album.photo_count || 0) * 2 +
                          (album.video_count || 0) * 15)
                      ).toFixed(1);
                      return (
                        <tr key={album.id}>
                          <td>#{album.id}</td>
                          <td>
                            <div className="admin-album-cell">
                              <span className="admin-album-cell-title">
                                {album.title || `Album #${album.id}`}
                              </span>
                              <span className="admin-album-cell-sub">
                                <MapPin size={12} /> {album.province_name}
                              </span>
                              {album.report_count > 0 && (
                                <span style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 700, background: "#fee2e2", padding: "1px 6px", borderRadius: "4px", width: "fit-content" }}>
                                  ⚠️ {album.report_count} báo cáo vi phạm
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="admin-album-user-cell">
                              <span>{album.owner_name}</span>
                              <span className="text-muted text-sm">
                                {album.owner_email}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge-serial">
                              {album.serial_code}
                            </span>
                          </td>
                          <td>
                            <div className="admin-album-media-cell">
                              <span>
                                <ImageIcon size={12} /> {album.photo_count || 0}{" "}
                                ảnh • <Film size={12} /> {album.video_count || 0}{" "}
                                video
                              </span>
                              <span className="text-muted text-sm">
                                ~{estimatedMb} MB
                              </span>
                            </div>
                          </td>
                          <td>
                            {album.is_public ? (
                              <span className="badge-privacy badge-privacy--public">
                                <Globe size={12} /> Public 🌐
                              </span>
                            ) : (
                              <span className="badge-privacy badge-privacy--private">
                                <Lock size={12} /> Private 🔒
                              </span>
                            )}
                          </td>
                          <td>
                            {album.status === "active" ? (
                              <span className="status-badge active">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="status-badge banned" title={album.locked_reason || "Bị khóa do vi phạm"}>
                                Tạm khóa
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="admin-albums-actions" style={{ display: "flex", gap: "6px" }}>
                              {/* 👁️ Nút Xem Album nếu Public */}
                              {album.is_public ? (
                                <a
                                  href={`/album/${album.share_code || album.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-action btn-action--view"
                                  title="Mở Xem Album Công Khai (Tab mới)"
                                  style={{ color: "#0284c7" }}
                                >
                                  <ExternalLink size={15} />
                                </a>
                              ) : (
                                <button
                                  className="btn-action"
                                  title="Album riêng tư — Admin không truy cập ảnh cá nhân để bảo mật"
                                  disabled
                                  style={{ opacity: 0.35, cursor: "not-allowed" }}
                                >
                                  <Lock size={14} />
                                </button>
                              )}

                              {/* 📄 Nút Xem Metadata */}
                              <button
                                className="btn-action btn-action--view"
                                title="Xem Metadata Chi Tiết"
                                onClick={() => setSelectedAlbum(album)}
                              >
                                <FileText size={15} />
                              </button>

                              {/* 🚫 Nút Khóa / Mở Khóa */}
                              {album.status === "active" ? (
                                <button
                                  className="btn-action btn-action--lock"
                                  title="Tạm Khóa Album Vi Phạm"
                                  onClick={() => handleOpenLockModal(album)}
                                >
                                  <XCircle size={15} />
                                </button>
                              ) : (
                                <button
                                  className="btn-action btn-action--unlock"
                                  title="Mở Khóa Album"
                                  onClick={() => handleUnlockAlbum(album)}
                                >
                                  <CheckCircle size={15} />
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

              {/* 📱 Mobile Cards View */}
              <div className="admin-albums-mobile-cards">
                {albums.map((album) => {
                  const estimatedMb = (
                    ((album.photo_count || 0) * 2 +
                      (album.video_count || 0) * 15)
                  ).toFixed(1);
                  return (
                    <div key={album.id} className="admin-album-m-card">
                      <div className="album-m-row-top">
                        <div className="album-m-title-wrap">
                          <span className="album-m-id">#{album.id}</span>
                          <span className="album-m-title">
                            {album.title || `Album #${album.id}`}
                          </span>
                        </div>
                        {album.is_public ? (
                          <span className="badge-privacy badge-privacy--public">
                            <Globe size={11} /> Public
                          </span>
                        ) : (
                          <span className="badge-privacy badge-privacy--private">
                            <Lock size={11} /> Private
                          </span>
                        )}
                      </div>

                      <div className="album-m-row-info">
                        <span className="album-m-prov">📍 {album.province_name}</span>
                        <span className="album-m-sep">•</span>
                        <span className="album-m-media">
                          🖼️ {album.photo_count || 0} • 🎥 {album.video_count || 0} (~{estimatedMb}MB)
                        </span>
                      </div>

                      <div className="album-m-row-owner">
                        <span className="album-m-owner-label">Chủ thẻ:</span>
                        <span className="album-m-owner-val">
                          <strong>{album.owner_name}</strong> ({album.owner_email})
                        </span>
                      </div>

                      <div className="album-m-row-bottom">
                        <span className={`status-badge ${album.status === "active" ? "active" : "banned"}`}>
                          {album.status === "active" ? "Hoạt động" : "Tạm khóa"}
                        </span>
                        <div className="album-m-actions">
                          {album.is_public && (
                            <a
                              href={`/album/${album.share_code || album.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-action btn-action--view"
                              title="Xem Album"
                            >
                              <ExternalLink size={14} /> Xem
                            </a>
                          )}
                          <button
                            className="btn-action btn-action--view"
                            title="Metadata"
                            onClick={() => setSelectedAlbum(album)}
                          >
                            <FileText size={14} /> Metadata
                          </button>
                          {album.status === "active" ? (
                            <button
                              className="btn-action btn-action--lock"
                              title="Khóa"
                              onClick={() => handleOpenLockModal(album)}
                            >
                              <XCircle size={14} /> Khóa
                            </button>
                          ) : (
                            <button
                              className="btn-action btn-action--unlock"
                              title="Mở"
                              onClick={() => handleUnlockAlbum(album)}
                            >
                              <CheckCircle size={14} /> Mở
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: REPORTED ALBUMS QUEUE (Báo Cáo Vi Phạm) */}
      {activeTab === "reports" && (
        <div className="card admin-albums-tab-panel">
          <div className="moderation-header-box" style={{ background: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)", border: "1px solid #fecdd3" }}>
            <div className="moderation-header-info">
              <ShieldAlert size={26} style={{ color: "#e11d48" }} />
              <div>
                <h3 style={{ color: "#9f1239" }}>Hàng Đợi Xử Lý Báo Cáo Vi Phạm (Reported Albums)</h3>
                <p style={{ color: "#881337" }}>
                  Danh sách các Album công khai bị người xem gắn cờ hoặc báo cáo nội dung không phù hợp. Quản trị viên tiến hành thẩm định và xử lý khóa hoặc bác bỏ.
                </p>
              </div>
            </div>

            <div style={{ marginLeft: "auto" }}>
              <select
                value={reportStatusFilter}
                onChange={(e) => {
                  setReportStatusFilter(e.target.value);
                  setReportsPage(1);
                }}
                style={{ padding: "0.5rem 0.85rem", borderRadius: "10px", border: "1px solid #cbd5e1", fontWeight: 700, fontSize: "0.85rem" }}
              >
                <option value="pending">⚠️ Đang Chờ Xử Lý</option>
                <option value="resolved">🚫 Đã Khóa (Resolved)</option>
                <option value="dismissed">✅ Đã Bác Bỏ (Dismissed)</option>
                <option value="all">Tất Cả Trạng Thái</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "3rem 1rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <DinoLoader fullScreen={false} size={200} text="Đang kiểm tra báo cáo vi phạm..." subtext="Đang kết nối cơ sở dữ liệu" />
            </div>
          ) : reports.length === 0 ? (
            <div className="admin-albums-empty" style={{ padding: "3.5rem 1rem", textAlign: "center" }}>
              <CheckCircle size={48} style={{ color: "#059669", margin: "0 auto 1rem" }} />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>Hàng đợi kiểm duyệt sạch sẽ!</h3>
              <p style={{ color: "#64748b" }}>Hiện không có Album nào bị người dùng báo cáo vi phạm trong danh mục này.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              {reports.map((report) => (
                <div
                  key={report.report_id}
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid #fecdd3",
                    borderRadius: "18px",
                    padding: "1.35rem",
                    boxShadow: "0 4px 16px rgba(225, 29, 72, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.35rem" }}>
                        <span style={{ background: "#fee2e2", color: "#b91c1c", fontWeight: 800, fontSize: "0.75rem", padding: "2px 8px", borderRadius: "6px" }}>
                          LÝ DO: {report.reason}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          • Gửi lúc: {new Date(report.report_created_at).toLocaleString("vi-VN")}
                        </span>
                        <span className={`status-badge ${report.report_status === "pending" ? "banned" : report.report_status === "resolved" ? "active" : "muted"}`}>
                          {report.report_status === "pending" ? "Chờ xử lý" : report.report_status === "resolved" ? "Đã khóa" : "Đã bác bỏ"}
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                        Album #{report.album_id}: {report.album_title || `Kỷ niệm ${report.province_name}`}
                      </h3>
                      <div style={{ display: "flex", gap: "12px", fontSize: "0.82rem", color: "#475569" }}>
                        <span>📍 {report.province_name}</span>
                        <span>👤 Chủ album: <strong>{report.owner_name}</strong> ({report.owner_email})</span>
                        <span>🏷️ Thẻ: {report.serial_code}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <a
                        href={`/album/${report.share_code || report.album_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "0.55rem 0.95rem",
                          borderRadius: "10px",
                          background: "#f0f9ff",
                          color: "#0284c7",
                          border: "1px solid #bae6fd",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          textDecoration: "none",
                        }}
                      >
                        <ExternalLink size={14} /> Xem Album
                      </a>

                      {report.report_status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenLockModal(report, report.report_id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "0.55rem 1rem",
                              borderRadius: "10px",
                              background: "#e11d48",
                              color: "#fff",
                              border: "none",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            <XCircle size={15} /> Khóa Album
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDismissReport(report.report_id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "0.55rem 0.9rem",
                              borderRadius: "10px",
                              background: "#f1f5f9",
                              color: "#475569",
                              border: "1px solid #cbd5e1",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            <CheckCircle size={15} /> Bác bỏ
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {report.description && (
                    <div style={{ background: "#fff1f2", borderLeft: "3px solid #e11d48", padding: "0.6rem 0.85rem", borderRadius: "0 8px 8px 0", fontSize: "0.85rem", color: "#9f1239" }}>
                      <strong>Mô tả chi tiết từ người báo cáo:</strong> &ldquo;{report.description}&rdquo;
                    </div>
                  )}

                  {report.reporter_email && (
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                      Người gửi báo cáo: {report.reporter_name || report.reporter_email}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STORAGE ANALYTICS */}
      {activeTab === "storage" && (
        <div className="card admin-albums-tab-panel">
          <div className="storage-analytics-header">
            <HardDrive size={24} className="text-blue" />
            <div>
              <h3>Thống Kê Hạ Tầng Lưu Trữ (Storage Health Analytics)</h3>
              <p>Phân tích tài nguyên Cloudinary và hạn ngạch lưu trữ đám mây</p>
            </div>
          </div>

          <div className="storage-summary-boxes">
            <div className="storage-box">
              <span className="storage-box-label">
                Dung Lượng Ước Tính Đã Dùng
              </span>
              <h2 className="storage-box-value">
                {formatStorage(stats.estimated_bytes)}
              </h2>
              <span className="storage-box-sub text-green">
                ~{(stats.estimated_bytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                / 8.00 GB (Free Credit)
              </span>
            </div>

            <div className="storage-box">
              <span className="storage-box-label">Tổng File Đa Phương Tiện</span>
              <h2 className="storage-box-value">
                {(stats.total_photos + stats.total_videos).toLocaleString(
                  "vi-VN",
                )}
              </h2>
              <span className="storage-box-sub">
                {stats.total_photos} Ảnh • {stats.total_videos} Video HD
              </span>
            </div>

            <div className="storage-box">
              <span className="storage-box-label">Chỉ Số An Toàn Hạ Tầng</span>
              <h2 className="storage-box-value text-green">100% OK</h2>
              <span className="storage-box-sub">
                Auto WebP &amp; CDN Cloudinary Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KHÓA ALBUM KÈM LÝ DO */}
      {lockModalTarget && (
        <div
          className="admin-modal-overlay"
          onClick={() => setLockModalTarget(null)}
        >
          <div
            className="admin-modal-content"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header" style={{ borderBottom: "1px solid #fee2e2", background: "#fff1f2" }}>
              <h3 style={{ color: "#b91c1c", display: "flex", alignItems: "center", gap: "8px" }}>
                <XCircle size={20} /> Khóa Album #{lockModalTarget.albumId}
              </h3>
              <button
                className="admin-modal-close"
                onClick={() => setLockModalTarget(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: "1.25rem" }}>
              <p style={{ fontSize: "0.88rem", color: "#475569", marginBottom: "1rem" }}>
                Bạn đang thực hiện tạm khóa Album <strong>&ldquo;{lockModalTarget.albumTitle}&rdquo;</strong>. Album sẽ bị ẩn khỏi cộng đồng và người dùng sẽ nhận được thông báo lý do.
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.4rem", color: "#1e293b" }}>
                  Chọn lý do khóa *
                </label>
                <select
                  value={lockReasonChoice}
                  onChange={(e) => setLockReasonChoice(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "0.88rem", fontWeight: 600 }}
                >
                  <option value="Nội dung phản cảm / Không phù hợp">Nội dung phản cảm / Không phù hợp</option>
                  <option value="Hình ảnh 18+ / Nhạy cảm">Hình ảnh 18+ / Nhạy cảm</option>
                  <option value="Spam / Quảng cáo thương mại">Spam / Quảng cáo thương mại</option>
                  <option value="Ngôn từ thù địch / Xúc phạm">Ngôn từ thù địch / Xúc phạm</option>
                  <option value="Vi phạm bản quyền hình ảnh">Vi phạm bản quyền hình ảnh</option>
                  <option value="Yêu cầu từ cơ quan chức năng">Yêu cầu từ cơ quan chức năng</option>
                  <option value="Khác">Lý do khác (tự nhập)...</option>
                </select>
              </div>

              {lockReasonChoice === "Khác" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.4rem", color: "#1e293b" }}>
                    Nhập lý do cụ thể *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả lý do khóa album..."
                    value={lockReasonCustom}
                    onChange={(e) => setLockReasonCustom(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "0.88rem" }}
                  />
                </div>
              )}
            </div>

            <div className="admin-modal-footer" style={{ borderTop: "1px solid #f1f5f9" }}>
              <button
                type="button"
                className="btn-modal-secondary"
                onClick={() => setLockModalTarget(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-modal-primary btn-mod--ban"
                onClick={handleConfirmLock}
                disabled={actionLoading}
                style={{ background: "#e11d48", color: "#fff", border: "none" }}
              >
                {actionLoading ? "Đang khóa..." : "Xác Nhận Khóa Album"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METADATA DETAIL MODAL */}
      {selectedAlbum && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedAlbum(null)}
        >
          <div
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>
                <FileText size={18} /> Chi Tiết Metadata Album #
                {selectedAlbum.id}
              </h3>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedAlbum(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="privacy-safeguard-notice">
                <ShieldCheck size={20} className="text-green" />
                <div>
                  <strong>Chính Sách Quyền Riêng Tư (Privacy Shield)</strong>
                  <p>
                    {selectedAlbum.is_public
                      ? "Album này đang ở chế độ Công khai (Public). Admin có quyền xem trực tiếp album để thẩm định an toàn."
                      : "🔒 Album này đang ở chế độ Riêng tư (Private). Admin chỉ quản lý Metadata và tuyệt đối không thể truy cập ảnh/video cá nhân."}
                  </p>
                </div>
              </div>

              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="item-label">Tên Album:</span>
                  <span className="item-val fw-bold">
                    {selectedAlbum.title || `Album #${selectedAlbum.id}`}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="item-label">Chủ sở hữu:</span>
                  <span className="item-val">
                    {selectedAlbum.owner_name} ({selectedAlbum.owner_email})
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="item-label">Tỉnh Thành &amp; Serial:</span>
                  <span className="item-val">
                    <MapPin size={12} /> {selectedAlbum.province_name} • Serial:{" "}
                    <code>{selectedAlbum.serial_code}</code>
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="item-label">Số Lượng File Media:</span>
                  <span className="item-val">
                    {selectedAlbum.photo_count || 0} Ảnh •{" "}
                    {selectedAlbum.video_count || 0} Video
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="item-label">Dung Lượng Ước Tính:</span>
                  <span className="item-val fw-bold">
                    ~{(((selectedAlbum.photo_count || 0) * 2 + (selectedAlbum.video_count || 0) * 15)).toFixed(1)} MB
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="item-label">Trạng Thái Hiển Thị:</span>
                  <span className="item-val">
                    {selectedAlbum.is_public ? (
                      <span className="badge-privacy badge-privacy--public">
                        <Globe size={12} /> Public 🌐
                      </span>
                    ) : (
                      <span className="badge-privacy badge-privacy--private">
                        <Lock size={12} /> Private 🔒
                      </span>
                    )}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="item-label">Tổng Lượt Xem:</span>
                  <span className="item-val">
                    <Eye size={12} /> {selectedAlbum.view_count || 0} lượt xem
                  </span>
                </div>
                {selectedAlbum.locked_reason && (
                  <div className="metadata-item" style={{ gridColumn: "1 / -1", background: "#fee2e2", padding: "0.6rem 0.85rem", borderRadius: "10px" }}>
                    <span className="item-label" style={{ color: "#991b1b" }}>Lý Do Đang Bị Khóa:</span>
                    <span className="item-val fw-bold" style={{ color: "#b91c1c" }}>
                      ⚠️ {selectedAlbum.locked_reason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              {selectedAlbum.is_public && (
                <a
                  href={`/album/${selectedAlbum.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modal-secondary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "#0284c7" }}
                >
                  <ExternalLink size={15} /> Mở Xem Album Public
                </a>
              )}
              <button
                className="btn-modal-secondary"
                onClick={() => setSelectedAlbum(null)}
              >
                Đóng
              </button>
              {selectedAlbum.status === "active" ? (
                <button
                  className="btn-modal-primary btn-mod--ban"
                  onClick={() => {
                    setSelectedAlbum(null);
                    handleOpenLockModal(selectedAlbum);
                  }}
                  disabled={actionLoading}
                >
                  <XCircle size={15} /> Tạm Khóa Album
                </button>
              ) : (
                <button
                  className="btn-modal-primary btn-mod--hide"
                  onClick={() => handleUnlockAlbum(selectedAlbum)}
                  disabled={actionLoading}
                >
                  <CheckCircle size={15} /> Mở Khóa Album
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
