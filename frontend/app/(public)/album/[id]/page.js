"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { useParams, useRouter } from "next/navigation";
import {
  Share2,
  Edit3,
  Lock,
  Unlock,
  Trash2,
  Plus,
  Tag as TagIcon,
  UploadCloud,
  Sparkles,
  Eye,
  Check,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Globe,
  Maximize2,
  ChevronLeft,
  UserCheck,
  UserPlus,
  Smile,
  Layers,
} from "lucide-react";
import { albumAPI, mediaAPI } from "@/lib/api";
import { getUser, isLoggedIn } from "@/lib/auth";
import "@/styles/album.css";

export default function AlbumPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const user = getUser();

  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [toast, setToast] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'image' | 'video'

  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({ title: "", description: "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const [newTag, setNewTag] = useState({ label: "", color: "#ea580c" });
  const [addingTag, setAddingTag] = useState(false);

  const [collaborators, setCollaborators] = useState(null);
  const [requestingEdit, setRequestingEdit] = useState(false);

  // Lightbox State
  const [lightboxItem, setLightboxItem] = useState(null);

  const isOwner = !!(user && album && user.id === album.owner_id);

  useEffect(() => {
    loadAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isOwner) loadCollaborators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, album?.id]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAlbum = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await albumAPI.getOne(id);
      setAlbum(res.album);
      setMedia(res.media || []);
      setTags(res.tags || []);
      setInfoForm({
        title: res.album.title || "",
        description: res.album.description || "",
      });
    } catch (err) {
      setLoadError({ message: err.message || "Không tải được album" });
    } finally {
      setLoading(false);
    }
  };

  const loadCollaborators = async () => {
    try {
      const res = await albumAPI.getCollaborators(id);
      setCollaborators(res.collaborators || []);
    } catch (err) {
      console.error("Lỗi nạp cộng tác viên:", err);
    }
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast("success", "Đã sao chép đường dẫn Album!");
  };

  const handleSaveInfo = async () => {
    if (!infoForm.title.trim()) {
      showToast("error", "Tiêu đề không được để trống");
      return;
    }
    setSavingInfo(true);
    try {
      await albumAPI.update(id, infoForm);
      setAlbum({ ...album, ...infoForm });
      setEditingInfo(false);
      showToast("success", "Đã cập nhật thông tin Album!");
    } catch (err) {
      showToast("error", err.message || "Lỗi cập nhật");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleTogglePublic = async () => {
    const nextPublic = album.is_public ? 0 : 1;
    try {
      await albumAPI.update(id, { is_public: nextPublic });
      setAlbum({ ...album, is_public: nextPublic });
      showToast(
        "success",
        nextPublic ? "Đã bật chế độ Công khai!" : "Đã chuyển sang Riêng tư!",
      );
    } catch (err) {
      showToast("error", err.message || "Lỗi cập nhật");
    }
  };

  const handleDeleteAlbum = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa Album này? Tất cả ảnh & video lưu trong thẻ sẽ bị ẩn!",
      )
    )
      return;
    try {
      await albumAPI.delete(id);
      showToast("success", "Đã xóa Album thành công");
      router.push("/customer/dashboard");
    } catch (err) {
      showToast("error", err.message || "Lỗi xóa album");
    }
  };

  const handleRequestEdit = async () => {
    setRequestingEdit(true);
    try {
      await albumAPI.requestCollaborator(id);
      showToast("success", "Đã gửi yêu cầu đóng góp ảnh cho chủ Album!");
    } catch (err) {
      showToast("error", err.message || "Lỗi gửi yêu cầu");
    } finally {
      setRequestingEdit(false);
    }
  };

  const handleReviewRequest = async (collabId, status) => {
    try {
      await albumAPI.reviewCollaborator(id, collabId, status);
      showToast(
        "success",
        status === "approve" ? "Đã duyệt cộng tác viên!" : "Đã từ chối",
      );
      loadCollaborators();
    } catch (err) {
      showToast("error", err.message || "Lỗi xử lý");
    }
  };

  const handleRevoke = async (collabId) => {
    if (!confirm("Thu hồi quyền đóng góp của người này?")) return;
    try {
      await albumAPI.revokeCollaborator(id, collabId);
      showToast("success", "Đã thu hồi quyền");
      loadCollaborators();
    } catch (err) {
      showToast("error", err.message || "Lỗi thu hồi");
    }
  };

  // ─── XỬ LÝ TAGS ──────────────────────────────────────────────
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTag.label.trim()) return;
    setAddingTag(true);
    try {
      const res = await albumAPI.createTag(id, newTag);
      setTags([res.tag, ...tags]);
      setNewTag({ label: "", color: "#ea580c" });
      showToast("success", "Đã thêm tag mới!");
    } catch (err) {
      showToast("error", err.message || "Lỗi tạo tag");
    } finally {
      setAddingTag(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await albumAPI.deleteTag(id, tagId);
      setTags(tags.filter((t) => t.id !== tagId));
      showToast("success", "Đã xóa tag");
    } catch (err) {
      showToast("error", err.message || "Lỗi xóa tag");
    }
  };

  // ─── XỬ LÝ MEDIA ─────────────────────────────────────────────
  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("album_id", id);
      files.forEach((f) => formData.append("files", f));

      const res = await mediaAPI.upload(formData);
      setMedia([...(res.items || []), ...media]);
      showToast("success", `Đã tải lên ${files.length} tệp thành công!`);
    } catch (err) {
      showToast("error", err.message || "Lỗi tải tệp lên");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm("Bạn có chắc muốn xóa tệp này khỏi album?")) return;
    try {
      await mediaAPI.delete(mediaId);
      setMedia(media.filter((m) => m.id !== mediaId));
      showToast("success", "Đã xóa tệp!");
    } catch (err) {
      showToast("error", err.message || "Lỗi xóa tệp");
    }
  };

  const handleSaveCaption = async (mediaId, caption) => {
    try {
      await mediaAPI.updateCaption(mediaId, caption);
      setMedia(
        media.map((m) =>
          m.id === mediaId ? { ...m, caption_user: caption } : m,
        ),
      );
      showToast("success", "Đã lưu caption!");
    } catch (err) {
      showToast("error", err.message || "Lỗi lưu caption");
    }
  };

  const handleToggleTagOnMedia = async (mediaItem, tagId, isTagged) => {
    try {
      if (isTagged) {
        await mediaAPI.removeTag(mediaItem.id, tagId);
      } else {
        await mediaAPI.attachTag(mediaItem.id, tagId);
      }
      const tagObj = tags.find((t) => t.id === tagId);
      if (!tagObj) return;

      const currentTags = (mediaItem.tags || "").split(",").filter(Boolean);
      let nextTags = [];
      if (isTagged) {
        nextTags = currentTags.filter((l) => l !== tagObj.label);
      } else {
        nextTags = [...currentTags, tagObj.label];
      }

      setMedia(
        media.map((m) =>
          m.id === mediaItem.id ? { ...m, tags: nextTags.join(",") } : m,
        ),
      );
    } catch (err) {
      showToast("error", err.message || "Lỗi cập nhật tag");
    }
  };

  if (loading) {
    return (
      <div className="album-page-loading">
        <div className="album-spinner"></div>
        <p>Đang nạp Album Kỷ Niệm VinaTap...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="album-error-state">
        <span className="album-error-icon">🔒</span>
        <h2 className="album-error-title">{loadError.message}</h2>
        <Link href="/" className="album-action-btn album-action-btn--primary">
          <ChevronLeft size={16} /> Về Trang Chủ VinaTap
        </Link>
      </div>
    );
  }

  const pendingRequests = (collaborators || []).filter(
    (c) => c.status === "pending",
  );
  const approvedCollaborators = (collaborators || []).filter(
    (c) => c.status === "approved",
  );

  const filteredMedia = media.filter((m) => {
    if (activeFilter === "image") return m.media_type === "image";
    if (activeFilter === "video") return m.media_type === "video";
    return true;
  });

  const presetColors = ["#ea580c", "#16a34a", "#2563eb", "#9333ea", "#e11d48"];

  return (
    <>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 99999,
            padding: "12px 20px",
            borderRadius: "14px",
            background: toast.type === "error" ? "#ef4444" : "#10b981",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.9rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toast.type === "error" ? <X size={18} /> : <Check size={18} />}
          {toast.text}
        </div>
      )}

      {/* Header bar */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
        }}
      >
        <Logo href="/" />
        <Link
          href="/customer/dashboard"
          className="album-action-btn"
          style={{ fontSize: "0.85rem" }}
        >
          <ChevronLeft size={16} /> Trang Cá Nhân Dashboard
        </Link>
      </header>

      <div className="album-page">
        {/* HERO BANNER CARD */}
        <div className="album-hero-card">
          <div className="album-hero-banner"></div>
          <div className="album-hero-content">
            <div className="album-hero-thumb-wrap">
              <div className="album-hero-thumb">
                {album.province_thumbnail ? (
                  <img
                    src={album.province_thumbnail}
                    alt={album.province_name}
                  />
                ) : (
                  <div className="album-hero-thumb-placeholder">🗺️</div>
                )}
              </div>
            </div>

            <div className="album-hero-details">
              {editingInfo ? (
                <div className="album-edit-form">
                  <input
                    type="text"
                    value={infoForm.title}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, title: e.target.value })
                    }
                    placeholder="Tên Album..."
                  />
                  <textarea
                    rows={2}
                    value={infoForm.description}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, description: e.target.value })
                    }
                    placeholder="Mô tả chuyến đi..."
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="album-action-btn album-action-btn--primary"
                      onClick={handleSaveInfo}
                      disabled={savingInfo}
                    >
                      <Check size={16} /> {savingInfo ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                    <button
                      className="album-action-btn"
                      onClick={() => setEditingInfo(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="album-title-row">
                    <h1 className="album-title">
                      {album.title || album.province_name}
                    </h1>
                    <span className="album-badge-pill album-badge-province">
                      <Globe size={13} /> {album.province_name}
                    </span>
                    <span
                      className={`album-badge-pill ${album.is_public ? "album-badge-public" : "album-badge-private"}`}
                    >
                      {album.is_public ? (
                        <>
                          <Unlock size={13} /> Công Khai
                        </>
                      ) : (
                        <>
                          <Lock size={13} /> Riêng Tư
                        </>
                      )}
                    </span>
                  </div>
                  {album.description && (
                    <p className="album-desc">{album.description}</p>
                  )}
                  <div className="album-meta-row">
                    <span className="album-meta-item">
                      <Smile size={15} className="text-orange" /> Chủ Album:{" "}
                      <strong>{album.owner_name}</strong>
                    </span>
                    <span className="album-meta-item">
                      <Eye size={15} /> {album.view_count || 0} Lượt Xem
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="album-hero-actions">
              <button
                className="album-action-btn"
                onClick={handleShareLink}
                title="Chia sẻ liên kết"
              >
                <Share2 size={16} /> Chia Sẻ
              </button>
              {isOwner && !editingInfo && (
                <>
                  <button
                    className="album-action-btn"
                    onClick={() => setEditingInfo(true)}
                  >
                    <Edit3 size={16} /> Sửa
                  </button>
                  <button
                    className="album-action-btn"
                    onClick={handleTogglePublic}
                  >
                    {album.is_public ? (
                      <>
                        <Lock size={16} /> Ẩn Album
                      </>
                    ) : (
                      <>
                        <Globe size={16} /> Công Khai
                      </>
                    )}
                  </button>
                  <button
                    className="album-action-btn album-action-btn--danger"
                    onClick={handleDeleteAlbum}
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </>
              )}
              {!isOwner && isLoggedIn() && (
                <button
                  className="album-action-btn album-action-btn--primary"
                  onClick={handleRequestEdit}
                  disabled={requestingEdit}
                >
                  <UserPlus size={16} />{" "}
                  {requestingEdit ? "Đang gửi..." : "Xin Quyền Đóng Góp"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CỘNG TÁC VIÊN (CHỈ CHỦ ALBUM) */}
        {isOwner && collaborators && collaborators.length > 0 && (
          <div className="album-panel-card">
            <div className="album-panel-header">
              <h2 className="album-panel-title">
                <UserCheck size={20} style={{ color: "#2563eb" }} /> Cộng Tác
                Viên Đóng Góp Ảnh
              </h2>
            </div>
            {pendingRequests.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                {pendingRequests.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      <b>{c.name}</b> ({c.email}) muốn tham gia đóng góp
                    </span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="album-action-btn album-action-btn--primary"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        onClick={() => handleReviewRequest(c.id, "approve")}
                      >
                        <Check size={14} /> Duyệt
                      </button>
                      <button
                        className="album-action-btn"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        onClick={() => handleReviewRequest(c.id, "reject")}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {approvedCollaborators.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>
                  {c.name} (Đã duyệt)
                </span>
                <button
                  className="album-action-btn album-action-btn--danger"
                  style={{ padding: "4px 10px", fontSize: "0.78rem" }}
                  onClick={() => handleRevoke(c.id)}
                >
                  Thu hồi
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAG CHUYẾN ĐI PANEL */}
        <div className="album-panel-card">
          <div className="album-panel-header">
            <h2 className="album-panel-title">
              <TagIcon size={20} style={{ color: "#ea580c" }} /> Tag Kỷ Niệm
              Chuyến Đi
            </h2>
          </div>

          <div className="album-tag-list">
            {tags.map((t) => (
              <span
                key={t.id}
                className="album-tag-chip"
                style={{
                  background: (t.color || "#ea580c") + "18",
                  color: t.color || "#ea580c",
                  border: `1px solid ${(t.color || "#ea580c")}44`,
                }}
              >
                #{t.label}
                <button
                  onClick={() => handleDeleteTag(t.id)}
                  className="album-tag-chip__remove"
                  title="Xóa tag"
                >
                  ✕
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <span
                style={{
                  fontSize: "0.88rem",
                  color: "#94a3b8",
                  fontStyle: "italic",
                }}
              >
                Chưa có tag nào — thêm tag để dễ dàng lọc kỷ niệm theo chủ đề
                (VD: Tết 2026, Cùng gia đình, Ẩm thực...)
              </span>
            )}
          </div>

          {/* Form thêm Tag */}
          <form onSubmit={handleCreateTag} className="album-tag-form">
            <div className="album-tag-input-wrap">
              <input
                className="album-tag-input"
                placeholder="Tên tag mới..."
                value={newTag.label}
                onChange={(e) =>
                  setNewTag({ ...newTag, label: e.target.value })
                }
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {presetColors.map((color) => (
                <div
                  key={color}
                  onClick={() => setNewTag({ ...newTag, color })}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: color,
                    cursor: "pointer",
                    border:
                      newTag.color === color
                        ? "2px solid #0f172a"
                        : "2px solid transparent",
                  }}
                />
              ))}
              <input
                type="color"
                value={newTag.color}
                onChange={(e) =>
                  setNewTag({ ...newTag, color: e.target.value })
                }
                className="album-tag-color-picker"
                title="Tự chọn màu"
              />
            </div>
            <button
              className="album-action-btn album-action-btn--primary"
              disabled={addingTag}
              type="submit"
            >
              <Plus size={16} /> {addingTag ? "Đang thêm..." : "Thêm Tag"}
            </button>
          </form>
        </div>

        {/* UPLOAD BANNER */}
        <div className="album-upload-card">
          <div>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 4px 0",
              }}
            >
              📸 Thư Viện Kỷ Niệm ({media.length} tệp)
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#64748b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Sparkles size={15} style={{ color: "#ea580c" }} /> Trí tuệ nhân
              tạo AI sẽ tự động phân tích & viết Caption độc đáo cho ảnh của bạn.
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
              style={{ display: "none" }}
              onChange={handleFilesSelected}
            />
            <button
              className="album-upload-btn-lg"
              onClick={handlePickFiles}
              disabled={uploading}
            >
              <UploadCloud size={20} />
              {uploading ? "Đang Tải Lên..." : "⬆ Tải Ảnh / Video Lên"}
            </button>
          </div>
        </div>

        {/* FILTER TABS & MEDIA GRID */}
        {media.length > 0 && (
          <div className="album-filter-tabs">
            <button
              className={`album-filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              <Layers size={14} style={{ display: "inline", marginRight: "4px" }} /> Tất Cả ({media.length})
            </button>
            <button
              className={`album-filter-btn ${activeFilter === "image" ? "active" : ""}`}
              onClick={() => setActiveFilter("image")}
            >
              <ImageIcon size={14} style={{ display: "inline", marginRight: "4px" }} /> Ảnh ({media.filter((m) => m.media_type === "image").length})
            </button>
            <button
              className={`album-filter-btn ${activeFilter === "video" ? "active" : ""}`}
              onClick={() => setActiveFilter("video")}
            >
              <VideoIcon size={14} style={{ display: "inline", marginRight: "4px" }} /> Video ({media.filter((m) => m.media_type === "video").length})
            </button>
          </div>
        )}

        {filteredMedia.length === 0 ? (
          <div
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
          >
            <ImageIcon size={48} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
            <p style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
              Chưa có ảnh hoặc video nào trong mục này.
            </p>
            <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "4px" }}>
              Hãy bấm nút tải lên để lưu giữ những khoảnh khắc tuyệt vời! 📷
            </p>
          </div>
        ) : (
          <div className="album-media-grid">
            {filteredMedia.map((m) => (
              <MediaCard
                key={m.id}
                item={m}
                tags={tags}
                onDelete={() => handleDeleteMedia(m.id)}
                onSaveCaption={(caption) => handleSaveCaption(m.id, caption)}
                onToggleTag={(tagId, isTagged) =>
                  handleToggleTagOnMedia(m, tagId, isTagged)
                }
                onOpenLightbox={() => setLightboxItem(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxItem && (
        <div
          className="album-lightbox-overlay"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="album-lightbox-close"
            onClick={() => setLightboxItem(null)}
          >
            <X size={24} />
          </button>
          <div
            className="album-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.media_type === "video" ? (
              <video
                src={lightboxItem.file_url}
                controls
                autoPlay
                className="album-lightbox-media"
              />
            ) : (
              <img
                src={lightboxItem.file_url}
                alt=""
                className="album-lightbox-media"
              />
            )}
            {(lightboxItem.caption_user || lightboxItem.caption_ai) && (
              <p className="album-lightbox-caption">
                {lightboxItem.caption_user || lightboxItem.caption_ai}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Component: 1 ô ảnh/video trong lưới ─────────────────────
function MediaCard({
  item,
  tags,
  onDelete,
  onSaveCaption,
  onToggleTag,
  onOpenLightbox,
}) {
  const [caption, setCaption] = useState(
    item.caption_user || item.caption_ai || "",
  );
  const [editingCaption, setEditingCaption] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const mediaTags = (item.tags || "").split(",").filter(Boolean);

  return (
    <div className="media-card">
      <div className="media-card__media-wrap" onClick={onOpenLightbox}>
        {item.media_type === "video" ? (
          <>
            <video
              src={item.file_url}
              poster={item.thumbnail_url}
              preload="metadata"
              className="media-card__media media-card__media--video"
            />
            <span className="media-card__badge-type">
              <VideoIcon size={12} /> Video
            </span>
          </>
        ) : (
          <>
            <img
              src={item.thumbnail_url || item.file_url}
              alt={caption}
              loading="lazy"
              className="media-card__media media-card__media--image"
            />
            <span className="media-card__badge-type">
              <ImageIcon size={12} /> Ảnh
            </span>
          </>
        )}
        <div className="media-card__overlay-btn">
          <Maximize2 size={24} />
        </div>
      </div>

      <div className="media-card__body">
        {editingCaption ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
              }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              autoFocus
            />
            <button
              className="album-action-btn album-action-btn--primary"
              style={{ padding: "6px 10px" }}
              onClick={() => {
                onSaveCaption(caption);
                setEditingCaption(false);
              }}
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <p
            className="media-card__caption-text"
            onClick={() => setEditingCaption(true)}
            title="Bấm để chỉnh sửa caption"
          >
            <Sparkles size={14} style={{ color: "#ea580c", flexShrink: 0, marginTop: "2px" }} />
            {caption || (
              <span className="media-card__caption-placeholder">
                Thêm caption cho ảnh này...
              </span>
            )}
          </p>
        )}

        <div className="media-card__tags-row">
          {mediaTags.map((label) => (
            <span key={label} className="media-card__tag-badge">
              #{label}
            </span>
          ))}
          <button
            onClick={() => setShowTagPicker((v) => !v)}
            className="media-card__add-tag-btn"
          >
            + Tag
          </button>
        </div>

        {showTagPicker && (
          <div
            style={{
              padding: "8px",
              background: "#f8fafc",
              borderRadius: "10px",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              border: "1px solid #e2e8f0",
            }}
          >
            {tags.length === 0 && (
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Album chưa có tag nào
              </span>
            )}
            {tags.map((t) => {
              const isTagged = mediaTags.includes(t.label);
              return (
                <button
                  key={t.id}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: isTagged
                      ? t.color || "#ea580c"
                      : "#e2e8f0",
                    color: isTagged ? "#ffffff" : "#475569",
                    cursor: "pointer",
                  }}
                  onClick={() => onToggleTag(t.id, isTagged)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="media-card__footer">
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : ""}
          </span>
          <button
            className="media-card__delete-btn"
            onClick={onDelete}
            title="Xóa tệp"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
