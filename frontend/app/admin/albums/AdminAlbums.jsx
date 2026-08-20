"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { albumAPI } from "@/lib/api";
import "./AdminAlbums.css";

export default function AdminAlbums() {
  const [activeTab, setActiveTab] = useState("management"); // management | moderation | storage
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_albums: 0,
    private_albums: 0,
    public_albums: 0,
    total_photos: 0,
    total_videos: 0,
    estimated_bytes: 0,
  });

  // Table state
  const [albums, setAlbums] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all"); // all | private | public
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | archived

  // Selected Album for Metadata Modal
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, privacyFilter, statusFilter, activeTab]);

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
        privacy: activeTab === "moderation" ? "public" : privacyFilter,
        status: activeTab === "moderation" ? "active" : statusFilter,
      });
      setAlbums(res.albums || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Lỗi nạp danh sách album:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadAlbums();
  };

  const handleToggleStatus = async (album, newStatus) => {
    const actionText = newStatus === "archived" ? "TẠM KHÓA / TẠM ẨN" : "MỞ KHÓA HOẠT ĐỘNG";
    if (
      !confirm(
        `Bạn có chắc chắn muốn ${actionText} Album "${album.title || "Album #" + album.id}" không?`,
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await albumAPI.updateAdminStatus(album.id, { status: newStatus });
      await loadAlbums();
      await loadStats();
      if (selectedAlbum?.id === album.id) {
        setSelectedAlbum((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Lỗi cập nhật trạng thái album");
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
            Hệ thống quản trị Metadata &amp; Kiểm duyệt an toàn — Bảo mật quyền riêng tư 🔒
          </p>
        </div>
        <button
          className="admin-albums-btn-refresh"
          onClick={() => {
            loadStats();
            loadAlbums();
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
                🔒 Khóa 100%
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
            className={`admin-albums-tab-btn ${activeTab === "moderation" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("moderation");
              setPage(1);
            }}
          >
            <ShieldCheck size={16} /> 🚩 Kiểm Duyệt Public
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

          {/* Album List Table / Cards */}
          {loading ? (
            <div className="admin-dash-loading">
              <div className="spinner" />
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
                              <span className="status-badge banned">Tạm ẩn</span>
                            )}
                          </td>
                          <td>
                            <div className="admin-albums-actions">
                              <button
                                className="btn-action btn-action--view"
                                title="Xem Metadata Chi Tiết"
                                onClick={() => setSelectedAlbum(album)}
                              >
                                <FileText size={15} />
                              </button>
                              {album.status === "active" ? (
                                <button
                                  className="btn-action btn-action--lock"
                                  title="Tạm Khóa Album Vi Phạm"
                                  onClick={() =>
                                    handleToggleStatus(album, "archived")
                                  }
                                >
                                  <XCircle size={15} />
                                </button>
                              ) : (
                                <button
                                  className="btn-action btn-action--unlock"
                                  title="Mở Khóa Album"
                                  onClick={() =>
                                    handleToggleStatus(album, "active")
                                  }
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
                      {/* Top Row: Title + Privacy Badge */}
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

                      {/* Info Row: Province & Serial & Media */}
                      <div className="album-m-row-info">
                        <span className="album-m-prov">📍 {album.province_name}</span>
                        <span className="album-m-sep">•</span>
                        <span className="album-m-media">
                          🖼️ {album.photo_count || 0} • 🎥 {album.video_count || 0} (~{estimatedMb}MB)
                        </span>
                      </div>

                      {/* Owner Row */}
                      <div className="album-m-row-owner">
                        <span className="album-m-owner-label">Chủ thẻ:</span>
                        <span className="album-m-owner-val">
                          <strong>{album.owner_name}</strong> {album.owner_email ? `(${album.owner_email})` : ""}
                        </span>
                      </div>

                      {/* Bottom Row: Status + Actions */}
                      <div className="album-m-row-bottom">
                        <span className={`status-badge ${album.status === "active" ? "active" : "banned"}`}>
                          {album.status === "active" ? "Hoạt động" : "Tạm ẩn"}
                        </span>
                        <div className="album-m-actions">
                          <button
                            className="btn-action btn-action--view"
                            title="Xem Metadata"
                            onClick={() => setSelectedAlbum(album)}
                          >
                            <FileText size={14} /> Chi tiết
                          </button>
                          {album.status === "active" ? (
                            <button
                              className="btn-action btn-action--lock"
                              title="Tạm Khóa Album"
                              onClick={() => handleToggleStatus(album, "archived")}
                            >
                              <XCircle size={14} /> Khóa
                            </button>
                          ) : (
                            <button
                              className="btn-action btn-action--unlock"
                              title="Mở Khóa"
                              onClick={() => handleToggleStatus(album, "active")}
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

      {/* TAB 2: MODERATION QUEUE FOR PUBLIC ALBUMS */}
      {activeTab === "moderation" && (
        <div className="card admin-albums-tab-panel">
          <div className="moderation-header-box">
            <div className="moderation-header-info">
              <ShieldCheck size={24} className="text-green" />
              <div>
                <h3>Kiểm Duyệt Nội Dung Công Khai &amp; Báo Cáo Vi Phạm</h3>
                <p>
                  Danh sách Album Public mở trên bản đồ cộng đồng. Quản trị
                  viên hỗ trợ ẩn bớt nội dung rác hoặc vi phạm thuần phong mỹ
                  tục.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="admin-dash-loading">
              <div className="spinner" />
            </div>
          ) : albums.length === 0 ? (
            <div className="admin-albums-empty">
              <CheckCircle size={40} className="text-green" />
              <p>Hàng đợi kiểm duyệt sạch sẽ! Không có Album Public vi phạm.</p>
            </div>
          ) : (
            <div className="admin-albums-moderation-grid">
              {albums.map((album) => (
                <div key={album.id} className="admin-moderation-card">
                  <div className="moderation-card-top">
                    <span className="badge-privacy badge-privacy--public">
                      <Globe size={12} /> Public 🌐
                    </span>
                    <span className="badge-serial">{album.serial_code}</span>
                  </div>
                  <h4 className="moderation-album-title">
                    {album.title || `Album #${album.id}`}
                  </h4>
                  <div className="moderation-meta-info">
                    <span>
                      <User size={12} /> {album.owner_name}
                    </span>
                    <span>
                      <MapPin size={12} /> {album.province_name}
                    </span>
                    <span>
                      <ImageIcon size={12} /> {album.photo_count || 0} ảnh •{" "}
                      <Film size={12} /> {album.video_count || 0} video
                    </span>
                  </div>

                  <div className="moderation-actions">
                    <button
                      className="btn-mod btn-mod--hide"
                      onClick={() => setSelectedAlbum(album)}
                    >
                      <FileText size={14} /> Xem Metadata Chi Tiết
                    </button>
                    {album.status === "active" ? (
                      <button
                        className="btn-mod btn-mod--ban"
                        onClick={() => handleToggleStatus(album, "archived")}
                      >
                        <XCircle size={14} /> Tạm Khóa Album
                      </button>
                    ) : (
                      <button
                        className="btn-mod btn-mod--hide"
                        onClick={() => handleToggleStatus(album, "active")}
                      >
                        <CheckCircle size={14} /> Mở Khóa Album
                      </button>
                    )}
                  </div>
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
              <p>Phân tích tài nguyên Cloudinary và hạn ngạch 25 Credits</p>
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

      {/* METADATA MODAL (PRIVACY SAFEGUARDED) */}
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
                      ? "Album này đang ở chế độ Công khai (Public)."
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
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn-modal-secondary"
                onClick={() => setSelectedAlbum(null)}
              >
                Đóng
              </button>
              {selectedAlbum.status === "active" ? (
                <button
                  className="btn-modal-primary btn-mod--ban"
                  onClick={() =>
                    handleToggleStatus(selectedAlbum, "archived")
                  }
                  disabled={actionLoading}
                >
                  <XCircle size={15} /> Tạm Khóa Album
                </button>
              ) : (
                <button
                  className="btn-modal-primary btn-mod--hide"
                  onClick={() =>
                    handleToggleStatus(selectedAlbum, "active")
                  }
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
