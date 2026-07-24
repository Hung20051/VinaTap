"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { albumAPI, mediaAPI } from "../../../lib/api";
import { getUser, isLoggedIn } from "../../../lib/auth";
import "../../../styles/album.css";

export default function AlbumPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const user = getUser();

  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null); // { status, message }
  const [toast, setToast] = useState(null); // { type, text }

  const [uploading, setUploading] = useState(false);

  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({ title: "", description: "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const [newTag, setNewTag] = useState({ label: "", color: "#e85d04" });
  const [addingTag, setAddingTag] = useState(false);

  const [collaborators, setCollaborators] = useState(null); // null = chưa tải
  const [requestingEdit, setRequestingEdit] = useState(false);

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
    } catch {
      // im lặng — không phải lỗi nghiêm trọng với trải nghiệm chính
    }
  };

  // ─── Upload ảnh/video ──────────────────────────────────────
  const handlePickFiles = () => fileInputRef.current?.click();

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // cho phép chọn lại cùng file lần sau
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("album_id", id);
      files.forEach((f) => formData.append("files", f));
      const res = await mediaAPI.uploadMultiple(formData);
      showToast("success", `Đã tải lên ${res.media.length} ảnh/video`);
      await loadAlbum();
    } catch (err) {
      showToast(
        "error",
        err.message ||
          "Tải ảnh lên thất bại. Bạn có thể cần xin quyền chỉnh sửa album này.",
      );
    } finally {
      setUploading(false);
    }
  };

  // ─── Sửa thông tin album ──────────────────────────────────
  const handleSaveInfo = async () => {
    setSavingInfo(true);
    try {
      await albumAPI.update(id, infoForm);
      setEditingInfo(false);
      showToast("success", "Đã cập nhật album");
      await loadAlbum();
    } catch (err) {
      showToast("error", err.message || "Không lưu được thay đổi");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      await albumAPI.update(id, { is_public: album.is_public ? 0 : 1 });
      showToast(
        "success",
        album.is_public
          ? "Album đã chuyển sang riêng tư"
          : "Album đã công khai",
      );
      await loadAlbum();
    } catch (err) {
      showToast("error", err.message || "Không cập nhật được");
    }
  };

  const handleDeleteAlbum = async () => {
    if (!confirm("Xóa album này? Hành động không thể hoàn tác.")) return;
    try {
      await albumAPI.delete(id);
      router.push("/dashboard");
    } catch (err) {
      showToast("error", err.message || "Không xóa được album");
    }
  };

  // ─── Media ───────────────────────────────────────────────
  const handleDeleteMedia = async (mediaId) => {
    if (!confirm("Xóa ảnh/video này?")) return;
    try {
      await mediaAPI.delete(mediaId);
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      showToast("error", err.message || "Không xóa được");
    }
  };

  const handleSaveCaption = async (mediaId, caption_user) => {
    try {
      await mediaAPI.update(mediaId, { caption_user });
      showToast("success", "Đã lưu caption");
    } catch (err) {
      showToast("error", err.message || "Không lưu được caption");
    }
  };

  // ─── Tag ─────────────────────────────────────────────────
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTag.label.trim()) return;
    setAddingTag(true);
    try {
      const res = await albumAPI.createTag(id, newTag);
      setTags((prev) => [
        ...prev,
        { id: res.id, label: res.label, color: res.color },
      ]);
      setNewTag({ label: "", color: "#e85d04" });
    } catch (err) {
      showToast("error", err.message || "Không thêm được tag");
    } finally {
      setAddingTag(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await albumAPI.deleteTag(id, tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (err) {
      showToast("error", err.message || "Không xóa được tag");
    }
  };

  const handleToggleTagOnMedia = async (mediaItem, tagId, isTagged) => {
    try {
      if (isTagged) {
        await mediaAPI.removeTag(mediaItem.id, tagId);
      } else {
        await mediaAPI.addTag(mediaItem.id, tagId);
      }
      // Cập nhật state cục bộ thay vì gọi lại loadAlbum() (tải lại toàn bộ
      // album + tất cả ảnh) — tránh round-trip mạng + render lại cả lưới
      // ảnh mỗi khi chỉ bấm tag trên 1 ảnh.
      const tagLabel = tags.find((t) => t.id === tagId)?.label;
      if (tagLabel) {
        setMedia((prev) =>
          prev.map((m) => {
            if (m.id !== mediaItem.id) return m;
            const current = (m.tags || "").split(",").filter(Boolean);
            const next = isTagged
              ? current.filter((l) => l !== tagLabel)
              : [...current, tagLabel];
            return { ...m, tags: next.join(",") };
          }),
        );
      }
    } catch (err) {
      showToast("error", err.message || "Không cập nhật được tag ảnh");
    }
  };

  // ─── Chia sẻ / cộng tác ────────────────────────────────────
  const handleRequestEdit = async () => {
    setRequestingEdit(true);
    try {
      const res = await albumAPI.requestEdit(id);
      showToast("success", res.message);
    } catch (err) {
      showToast("error", err.message || "Không gửi được yêu cầu");
    } finally {
      setRequestingEdit(false);
    }
  };

  const handleReviewRequest = async (shareId, action) => {
    try {
      await albumAPI.reviewRequest(id, shareId, action);
      showToast(
        "success",
        action === "approve" ? "Đã duyệt quyền edit" : "Đã từ chối yêu cầu",
      );
      loadCollaborators();
    } catch (err) {
      showToast("error", err.message || "Không xử lý được yêu cầu");
    }
  };

  const handleRevoke = async (shareId) => {
    try {
      await albumAPI.revokeAccess(id, shareId);
      showToast("success", "Đã thu hồi quyền truy cập");
      loadCollaborators();
    } catch (err) {
      showToast("error", err.message || "Không thu hồi được");
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("success", "Đã sao chép link album");
    } catch {
      showToast("info", window.location.href);
    }
  };

  // ─── Render trạng thái loading / lỗi ───────────────────────
  if (loading) {
    return (
      <div className="album-page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="album-error-state">
        <p className="album-error-icon">🔒</p>
        <h1 className="album-error-title">{loadError.message}</h1>
        {!isLoggedIn() && (
          <Link href="/auth" className="btn btn-primary">
            Đăng nhập để xem
          </Link>
        )}
        <Link href="/" className="btn btn-ghost">
          Về trang chủ
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

  return (
    <>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Link href="/" className="navbar__logo">
            Vina<span>Tap</span> 🗺
          </Link>
          <div className="navbar__links">
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.text}</div>
      )}

      <div className="container album-page">
        {/* Header album */}
        <div className="card album-header">
          <div className="album-header__thumb">
            {album.province_thumbnail ? (
              <img src={album.province_thumbnail} alt={album.province_name} />
            ) : (
              <div className="album-header__thumb-placeholder">🗺</div>
            )}
          </div>

          <div className="album-header__info">
            {editingInfo ? (
              <div className="album-edit-form">
                <input
                  className="input"
                  placeholder="Tiêu đề album"
                  value={infoForm.title}
                  onChange={(e) =>
                    setInfoForm({ ...infoForm, title: e.target.value })
                  }
                />
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Mô tả ngắn về chuyến đi..."
                  value={infoForm.description}
                  onChange={(e) =>
                    setInfoForm({ ...infoForm, description: e.target.value })
                  }
                />
                <div className="album-edit-form__actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveInfo}
                    disabled={savingInfo}
                  >
                    {savingInfo ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    className="btn btn-ghost"
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
                  <span className="badge badge-primary">
                    {album.province_name}
                  </span>
                  <span
                    className={`badge ${album.is_public ? "badge-success" : "badge-danger"}`}
                  >
                    {album.is_public ? "Công khai" : "Riêng tư"}
                  </span>
                </div>
                {album.description && (
                  <p className="album-desc">{album.description}</p>
                )}
                <p className="album-meta">
                  Chủ album: {album.owner_name} · {album.view_count} lượt xem
                </p>
              </>
            )}
          </div>

          {/* Hành động */}
          <div className="album-header__actions">
            <button className="btn btn-outline" onClick={handleShareLink}>
              🔗 Chia sẻ
            </button>
            {isOwner && !editingInfo && (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => setEditingInfo(true)}
                >
                  ✏️ Sửa
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleTogglePublic}
                >
                  {album.is_public ? "🔒 Ẩn album" : "🌐 Công khai"}
                </button>
                <button className="btn btn-ghost" onClick={handleDeleteAlbum}>
                  🗑 Xóa
                </button>
              </>
            )}
            {!isOwner && isLoggedIn() && (
              <button
                className="btn btn-outline"
                onClick={handleRequestEdit}
                disabled={requestingEdit}
              >
                {requestingEdit ? "Đang gửi..." : "🙋 Xin quyền chỉnh sửa"}
              </button>
            )}
          </div>
        </div>

        {/* Cộng tác viên (chỉ chủ album) */}
        {isOwner && collaborators && collaborators.length > 0 && (
          <div className="card album-panel">
            <h2 className="album-panel-title">👥 Cộng tác viên</h2>

            {pendingRequests.length > 0 && (
              <div className="album-collab-pending">
                {pendingRequests.map((c) => (
                  <div
                    key={c.id}
                    className="album-collab-row album-collab-row--bordered"
                  >
                    <span className="album-collab-text">
                      <b>{c.name}</b> ({c.email}) muốn tham gia đóng góp ảnh
                    </span>
                    <div className="album-collab-actions">
                      <button
                        className="btn btn-primary album-btn-xs"
                        onClick={() => handleReviewRequest(c.id, "approve")}
                      >
                        Duyệt
                      </button>
                      <button
                        className="btn btn-ghost album-btn-xs"
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
              <div key={c.id} className="album-collab-row">
                <span className="album-collab-text">
                  {c.name} <span className="badge badge-success">edit</span>
                </span>
                <button
                  className="btn btn-ghost album-btn-xs"
                  onClick={() => handleRevoke(c.id)}
                >
                  Thu hồi
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tag chuyến đi */}
        <div className="card album-panel">
          <h2 className="album-panel-title">🏷 Tag chuyến đi</h2>
          <div className="album-tag-list">
            {tags.map((t) => (
              <span
                key={t.id}
                className="badge album-tag-chip"
                style={{
                  background: (t.color || "#e85d04") + "22",
                  color: t.color || "#e85d04",
                }}
              >
                {t.label}
                <button
                  onClick={() => handleDeleteTag(t.id)}
                  className="album-tag-chip__remove"
                  title="Xóa tag"
                >
                  ✕
                </button>
              </span>
            ))}
            {!tags.length && (
              <span className="album-tag-empty">
                Chưa có tag nào — thêm tag để lọc kỷ niệm theo chủ đề (VD: Tết
                2026, Cùng gia đình)
              </span>
            )}
          </div>
          <form onSubmit={handleCreateTag} className="album-tag-form">
            <input
              className="input album-tag-form__input"
              placeholder="Tên tag mới..."
              value={newTag.label}
              onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
            />
            <input
              type="color"
              value={newTag.color}
              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
              className="album-tag-form__color"
            />
            <button className="btn btn-outline" disabled={addingTag}>
              {addingTag ? "..." : "+ Thêm"}
            </button>
          </form>
        </div>

        {/* Upload */}
        <div className="card album-panel album-upload-panel">
          <div>
            <h2 className="album-upload-title">
              📸 Ảnh & video ({media.length})
            </h2>
            <p className="album-upload-sub">
              AI sẽ tự viết caption cho ảnh bạn tải lên
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
              className="album-hidden-input"
              onChange={handleFilesSelected}
            />
            <button
              className="btn btn-primary"
              onClick={handlePickFiles}
              disabled={uploading}
            >
              {uploading ? "Đang tải lên..." : "⬆ Tải ảnh/video lên"}
            </button>
          </div>
        </div>

        {/* Media grid */}
        {media.length === 0 ? (
          <div className="card album-empty">
            Album chưa có ảnh nào. Hãy là người đầu tiên tải lên kỷ niệm! 📷
          </div>
        ) : (
          <div className="album-media-grid">
            {media.map((m) => (
              <MediaCard
                key={m.id}
                item={m}
                tags={tags}
                onDelete={() => handleDeleteMedia(m.id)}
                onSaveCaption={(caption) => handleSaveCaption(m.id, caption)}
                onToggleTag={(tagId, isTagged) =>
                  handleToggleTagOnMedia(m, tagId, isTagged)
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Component: 1 ô ảnh/video trong lưới ─────────────────────
function MediaCard({ item, tags, onDelete, onSaveCaption, onToggleTag }) {
  const [caption, setCaption] = useState(
    item.caption_user || item.caption_ai || "",
  );
  const [editingCaption, setEditingCaption] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const mediaTags = (item.tags || "").split(",").filter(Boolean);

  return (
    <div className="card media-card">
      <div className="media-card__media-wrap">
        {item.media_type === "video" ? (
          <video
            src={item.file_url}
            poster={item.thumbnail_url}
            controls
            preload="metadata"
            className="media-card__media media-card__media--video"
          />
        ) : (
          // Dùng thumbnail_url (400px, Cloudinary tạo sẵn khi upload) thay vì
          // file_url gốc — ảnh gốc có thể vài MB, tải cả trăm ảnh trong lưới
          // cùng lúc là nguyên nhân chính khiến trang album bị chậm/nặng.
          <a href={item.file_url} target="_blank" rel="noopener noreferrer">
            <img
              src={item.thumbnail_url || item.file_url}
              alt={caption}
              loading="lazy"
              className="media-card__media media-card__media--image"
            />
          </a>
        )}
      </div>

      <div className="media-card__body">
        {editingCaption ? (
          <div className="media-card__caption-edit-row">
            <input
              className="input media-card__caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              className="btn btn-primary media-card__caption-save-btn"
              onClick={() => {
                onSaveCaption(caption);
                setEditingCaption(false);
              }}
            >
              ✓
            </button>
          </div>
        ) : (
          <p
            className="media-card__caption-text"
            onClick={() => setEditingCaption(true)}
            title="Bấm để sửa caption"
          >
            {caption || (
              <span className="media-card__caption-placeholder">
                Thêm caption cho ảnh này...
              </span>
            )}
          </p>
        )}

        <div className="media-card__tags-row">
          {mediaTags.map((label) => (
            <span
              key={label}
              className="badge badge-primary media-card__tag-badge"
            >
              {label}
            </span>
          ))}
          <button
            onClick={() => setShowTagPicker((v) => !v)}
            className="media-card__add-tag-btn"
          >
            + tag
          </button>
        </div>

        {showTagPicker && (
          <div className="media-card__tag-picker">
            {tags.length === 0 && (
              <span className="media-card__tag-picker-empty">
                Album chưa có tag nào
              </span>
            )}
            {tags.map((t) => {
              const isTagged = mediaTags.includes(t.label);
              return (
                <button
                  key={t.id}
                  className="badge media-card__tag-picker-btn"
                  style={{
                    background: isTagged
                      ? t.color || "var(--primary)"
                      : "var(--border)",
                    color: isTagged ? "#fff" : "var(--text-secondary)",
                  }}
                  onClick={() => onToggleTag(t.id, isTagged)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        <button
          className="btn btn-ghost media-card__delete-btn"
          onClick={onDelete}
        >
          🗑 Xóa
        </button>
      </div>
    </div>
  );
}
