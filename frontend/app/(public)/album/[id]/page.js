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
  Calendar,
  Camera,
  Play,
  Heart,
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
  const [selectedTagFilter, setSelectedTagFilter] = useState(null);

  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({ title: "", description: "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState({ label: "", color: "#ea580c" });
  const [addingTag, setAddingTag] = useState(false);

  const [collaborators, setCollaborators] = useState(null);
  const [requestingEdit, setRequestingEdit] = useState(false);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
      setShowTagModal(false);
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
      if (selectedTagFilter === tagId) setSelectedTagFilter(null);
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

      let res;
      if (files.length === 1) {
        formData.append("file", files[0]);
        res = await mediaAPI.upload(formData);
      } else {
        files.forEach((f) => formData.append("files", f));
        res = await mediaAPI.uploadMultiple(formData);
      }

      const newItems =
        res.items ||
        (res.media ? (Array.isArray(res.media) ? res.media : [res.media]) : []);
      setMedia((prev) => [...newItems, ...prev]);
      showToast("success", `Đã lưu ${files.length} khoảnh khắc vào Album!`);
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
      showToast("success", "Đã lưu ghi chú!");
    } catch (err) {
      showToast("error", err.message || "Lỗi lưu ghi chú");
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
        <Link href="/" className="album-btn album-btn--primary">
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
    if (activeFilter === "image" && m.media_type !== "image") return false;
    if (activeFilter === "video" && m.media_type !== "video") return false;
    if (selectedTagFilter) {
      const tagObj = tags.find((t) => t.id === selectedTagFilter);
      if (tagObj) {
        const itemTags = (m.tags || "").split(",").filter(Boolean);
        if (!itemTags.includes(tagObj.label)) return false;
      }
    }
    return true;
  });

  const presetColors = ["#ea580c", "#16a34a", "#2563eb", "#9333ea", "#e11d48"];

  const currentLightboxItem =
    lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div className="album-app-shell">
      {/* Toast Alert */}
      {toast && (
        <div className={`album-toast album-toast--${toast.type}`}>
          {toast.type === "error" ? <X size={18} /> : <Check size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Floating Glass Navigation */}
      <header className="album-nav-glass">
        <div className="album-nav-inner">
          <div className="album-nav-left">
            <Link href="/customer/dashboard" className="album-back-link">
              <ChevronLeft size={18} />
              <span>Dashboard</span>
            </Link>
            <div className="album-nav-divider" />
            <Logo href="/" />
          </div>

          <div className="album-nav-right">
            <button
              className="album-icon-btn"
              onClick={handleShareLink}
              title="Chia sẻ Album"
            >
              <Share2 size={16} />
              <span className="btn-text-desktop">Chia sẻ</span>
            </button>

            {isOwner && (
              <button
                className="album-icon-btn album-icon-btn--primary"
                onClick={handlePickFiles}
                disabled={uploading}
              >
                <Camera size={16} />
                <span>{uploading ? "Đang tải..." : "Thêm ảnh"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── 1. HERO COVER & STORY INTRO (Apple Photos Style) ───── */}
      <section className="album-hero-section">
        <div className="album-hero-backdrop">
          <div className="album-hero-ambient" />
        </div>

        <div className="album-hero-container">
          <div className="album-hero-card">
            {/* Province Map Piece 3D Badge */}
            <div className="album-hero-badge-wrap">
              <div className="album-nfc-piece-card">
                {album.province_thumbnail ? (
                  <img
                    src={album.province_thumbnail}
                    alt={album.province_name}
                    className="album-piece-img"
                  />
                ) : (
                  <div className="album-piece-placeholder">🗺️</div>
                )}
              </div>
            </div>

            {/* Album Titles & Meta */}
            <div className="album-hero-meta">
              {editingInfo ? (
                <div className="album-inline-edit-box">
                  <input
                    type="text"
                    value={infoForm.title}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, title: e.target.value })
                    }
                    placeholder="Tên Album kỷ niệm..."
                    className="album-edit-input"
                  />
                  <textarea
                    rows={2}
                    value={infoForm.description}
                    onChange={(e) =>
                      setInfoForm({ ...infoForm, description: e.target.value })
                    }
                    placeholder="Mô tả cảm xúc, chuyến đi..."
                    className="album-edit-textarea"
                  />
                  <div className="album-edit-actions">
                    <button
                      className="album-btn album-btn--primary album-btn--sm"
                      onClick={handleSaveInfo}
                      disabled={savingInfo}
                    >
                      <Check size={14} /> {savingInfo ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                    <button
                      className="album-btn album-btn--ghost album-btn--sm"
                      onClick={() => setEditingInfo(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="album-badge-pills-row">
                    <span className="album-pill album-pill--province">
                      <Globe size={13} /> {album.province_name}
                    </span>
                    <span
                      className={`album-pill ${album.is_public ? "album-pill--public" : "album-pill--private"}`}
                    >
                      {album.is_public ? (
                        <>
                          <Unlock size={12} /> Công Khai
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Riêng Tư
                        </>
                      )}
                    </span>
                  </div>

                  <h1 className="album-hero-title">
                    {album.title || album.province_name}
                  </h1>

                  {album.description ? (
                    <p className="album-hero-quote">"{album.description}"</p>
                  ) : (
                    <p className="album-hero-empty-desc">
                      Hành trình chạm thẻ NFC và lưu giữ những kỷ niệm quý giá tại {album.province_name}.
                    </p>
                  )}

                  <div className="album-meta-stats-row">
                    <span className="album-meta-tag">
                      <Smile size={14} /> Chủ Album: <strong>{album.owner_name}</strong>
                    </span>
                    <span className="album-meta-tag">
                      <Camera size={14} /> {media.length} Khoảnh khắc
                    </span>
                    <span className="album-meta-tag">
                      <Eye size={14} /> {album.view_count || 0} Lượt xem
                    </span>
                  </div>
                </>
              )}

              {/* Owner Action Buttons */}
              <div className="album-hero-actions-bar">
                {isOwner && !editingInfo && (
                  <>
                    <button
                      className="album-pill-btn"
                      onClick={() => setEditingInfo(true)}
                    >
                      <Edit3 size={14} /> Sửa Tên
                    </button>
                    <button
                      className="album-pill-btn"
                      onClick={handleTogglePublic}
                    >
                      {album.is_public ? (
                        <>
                          <Lock size={14} /> Ẩn Riêng Tư
                        </>
                      ) : (
                        <>
                          <Globe size={14} /> Công Khai
                        </>
                      )}
                    </button>
                    <button
                      className="album-pill-btn album-pill-btn--danger"
                      onClick={handleDeleteAlbum}
                    >
                      <Trash2 size={14} /> Xóa Album
                    </button>
                  </>
                )}

                {!isOwner && isLoggedIn() && (
                  <button
                    className="album-pill-btn album-pill-btn--primary"
                    onClick={handleRequestEdit}
                    disabled={requestingEdit}
                  >
                    <UserPlus size={14} />{" "}
                    {requestingEdit ? "Đang gửi..." : "Xin Quyền Đóng Góp"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TAGS & STORIES FILTER BAR ───────────────────────── */}
      <section className="album-tags-section">
        <div className="album-tags-container">
          <div className="album-tags-scroll">
            <button
              className={`album-story-tag ${selectedTagFilter === null ? "active" : ""}`}
              onClick={() => setSelectedTagFilter(null)}
            >
              <span>✨ Tất Cả</span>
            </button>

            {tags.map((t) => (
              <span
                key={t.id}
                className={`album-story-tag ${selectedTagFilter === t.id ? "active" : ""}`}
                style={{
                  "--tag-color": t.color || "#ea580c",
                }}
                onClick={() =>
                  setSelectedTagFilter(selectedTagFilter === t.id ? null : t.id)
                }
              >
                <span>#{t.label}</span>
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(t.id);
                    }}
                    className="album-story-tag-del"
                    title="Xóa tag"
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}

            {isOwner && (
              <button
                className="album-story-tag album-story-tag--add"
                onClick={() => setShowTagModal(true)}
              >
                <Plus size={13} /> Thêm Tag
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── 3. COLLABORATOR REQUESTS (CHỈ CHỦ ALBUM) ───────────── */}
      {isOwner && collaborators && collaborators.length > 0 && (
        <section className="album-collab-section">
          <div className="album-collab-card">
            <div className="album-collab-header">
              <UserCheck size={18} style={{ color: "#2563eb" }} />
              <h3>Cộng Tác Viên Đóng Góp ({collaborators.length})</h3>
            </div>

            {pendingRequests.length > 0 && (
              <div className="album-collab-pending-list">
                {pendingRequests.map((c) => (
                  <div key={c.id} className="album-collab-item">
                    <span>
                      <b>{c.name}</b> ({c.email}) muốn cùng đăng ảnh
                    </span>
                    <div className="album-collab-btns">
                      <button
                        className="album-btn album-btn--primary album-btn--xs"
                        onClick={() => handleReviewRequest(c.id, "approve")}
                      >
                        <Check size={13} /> Duyệt
                      </button>
                      <button
                        className="album-btn album-btn--ghost album-btn--xs"
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
              <div key={c.id} className="album-collab-approved-row">
                <span>👤 {c.name} ({c.email})</span>
                <button
                  className="album-btn-text-del"
                  onClick={() => handleRevoke(c.id)}
                >
                  Thu hồi quyền
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. MEDIA GALLERY & FILTER TABS ─────────────────────── */}
      <main className="album-gallery-section">
        <div className="album-gallery-header">
          <div className="album-media-type-tabs">
            <button
              className={`album-type-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              <Layers size={15} /> Tất Cả ({media.length})
            </button>
            <button
              className={`album-type-tab ${activeFilter === "image" ? "active" : ""}`}
              onClick={() => setActiveFilter("image")}
            >
              <ImageIcon size={15} /> Ảnh (
              {media.filter((m) => m.media_type === "image").length})
            </button>
            <button
              className={`album-type-tab ${activeFilter === "video" ? "active" : ""}`}
              onClick={() => setActiveFilter("video")}
            >
              <VideoIcon size={15} /> Video (
              {media.filter((m) => m.media_type === "video").length})
            </button>
          </div>

          <div className="album-gallery-actions">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
              style={{ display: "none" }}
              onChange={handleFilesSelected}
            />
            {isOwner && (
              <button
                className="album-btn-upload-cta"
                onClick={handlePickFiles}
                disabled={uploading}
              >
                <UploadCloud size={17} />
                <span>{uploading ? "Đang tải ảnh..." : "Tải Kỷ Niệm Lên"}</span>
              </button>
            )}
          </div>
        </div>

        {/* GALLERY GRID */}
        {filteredMedia.length === 0 ? (
          <div className="album-empty-state">
            <div className="album-empty-icon-wrap">
              <Camera size={38} />
            </div>
            <h3>Chưa Có Khoảnh Khắc Nào</h3>
            <p>
              Chạm thẻ NFC hoặc tải lên những bức ảnh & video đầu tiên của chuyến đi {album.province_name}!
            </p>
            {isOwner && (
              <button
                className="album-btn album-btn--primary album-btn--lg"
                onClick={handlePickFiles}
                disabled={uploading}
              >
                <UploadCloud size={18} />
                <span>{uploading ? "Đang xử lý..." : "Tải Lên Khoảnh Khắc Đầu Tiên"}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="album-masonry-grid">
            {filteredMedia.map((m, idx) => (
              <MediaCard
                key={m.id}
                item={m}
                tags={tags}
                isOwner={isOwner}
                onDelete={() => handleDeleteMedia(m.id)}
                onSaveCaption={(caption) => handleSaveCaption(m.id, caption)}
                onToggleTag={(tagId, isTagged) =>
                  handleToggleTagOnMedia(m, tagId, isTagged)
                }
                onOpenLightbox={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ─── 5. FULLSCREEN CINEMATIC LIGHTBOX ───────────────────── */}
      {currentLightboxItem && (
        <div
          className="album-lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="album-lightbox-close"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={22} />
          </button>

          <div
            className="album-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="album-lightbox-media-wrap">
              {currentLightboxItem.media_type === "video" ? (
                <video
                  src={currentLightboxItem.file_url}
                  controls
                  autoPlay
                  className="album-lightbox-video"
                />
              ) : (
                <img
                  src={currentLightboxItem.file_url}
                  alt=""
                  className="album-lightbox-img"
                />
              )}
            </div>

            <div className="album-lightbox-info-bar">
              <div className="album-lightbox-caption-text">
                <Sparkles size={16} style={{ color: "#ea580c", flexShrink: 0 }} />
                <span>
                  {currentLightboxItem.caption_user ||
                    currentLightboxItem.caption_ai ||
                    "Khoảnh khắc kỷ niệm VinaTap"}
                </span>
              </div>
              <span className="album-lightbox-date">
                {currentLightboxItem.created_at
                  ? new Date(currentLightboxItem.created_at).toLocaleDateString(
                      "vi-VN",
                    )
                  : ""}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. MODAL THÊM TAG MỚI ─────────────────────────────── */}
      {showTagModal && (
        <div
          className="album-modal-backdrop"
          onClick={() => setShowTagModal(false)}
        >
          <div
            className="album-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="album-modal-header">
              <h3>🏷️ Thêm Tag Kỷ Niệm Mới</h3>
              <button
                className="album-modal-close"
                onClick={() => setShowTagModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTag} className="album-tag-modal-form">
              <label className="album-form-label">Tên Tag (Chủ đề):</label>
              <input
                type="text"
                className="album-form-input"
                placeholder="Ví dụ: Tết 2026, Ẩm thực, Gia đình..."
                value={newTag.label}
                onChange={(e) =>
                  setNewTag({ ...newTag, label: e.target.value })
                }
                autoFocus
                required
              />

              <label className="album-form-label">Chọn Màu Nhận Diện:</label>
              <div className="album-color-preset-row">
                {presetColors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewTag({ ...newTag, color })}
                    className={`album-color-dot ${newTag.color === color ? "active" : ""}`}
                    style={{ background: color }}
                  />
                ))}
                <input
                  type="color"
                  value={newTag.color}
                  onChange={(e) =>
                    setNewTag({ ...newTag, color: e.target.value })
                  }
                  className="album-custom-color-input"
                  title="Tự chọn màu"
                />
              </div>

              <div className="album-modal-actions">
                <button
                  type="button"
                  className="album-btn album-btn--ghost"
                  onClick={() => setShowTagModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="album-btn album-btn--primary"
                  disabled={addingTag || !newTag.label.trim()}
                >
                  <Plus size={16} /> {addingTag ? "Đang thêm..." : "Tạo Tag Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Component: Media Card Gallery Item ───────────────────────
function MediaCard({
  item,
  tags,
  isOwner,
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
    <div className="album-media-item">
      <div className="album-media-visual" onClick={onOpenLightbox}>
        {item.media_type === "video" ? (
          <>
            <video
              src={item.file_url}
              poster={item.thumbnail_url}
              preload="metadata"
              className="album-media-file"
            />
            <div className="album-play-icon-badge">
              <Play size={18} fill="#ffffff" color="#ffffff" />
            </div>
          </>
        ) : (
          <img
            src={item.thumbnail_url || item.file_url}
            alt={caption}
            loading="lazy"
            className="album-media-file"
          />
        )}

        {/* Hover Action Overlay */}
        <div className="album-media-hover-overlay">
          <div className="album-hover-zoom-btn">
            <Maximize2 size={18} />
          </div>
        </div>
      </div>

      {/* Caption & Tag Row */}
      <div className="album-media-details">
        {editingCaption ? (
          <div className="album-edit-caption-row">
            <input
              className="album-caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              autoFocus
            />
            <button
              className="album-btn-save-cap"
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
            className="album-caption-text"
            onClick={() => isOwner && setEditingCaption(true)}
            title={isOwner ? "Bấm để sửa ghi chú" : ""}
          >
            <Sparkles size={13} className="album-sparkle-icon" />
            <span>
              {caption || (
                <em className="album-caption-empty">
                  {isOwner ? "+ Thêm ghi chú..." : "Khoảnh khắc kỷ niệm"}
                </em>
              )}
            </span>
          </p>
        )}

        {/* Tags Row */}
        <div className="album-card-tags-row">
          {mediaTags.map((label) => (
            <span key={label} className="album-card-tag-pill">
              #{label}
            </span>
          ))}

          {isOwner && (
            <button
              onClick={() => setShowTagPicker((v) => !v)}
              className="album-card-add-tag-btn"
            >
              + Tag
            </button>
          )}
        </div>

        {/* Tag Selection Popup */}
        {showTagPicker && isOwner && (
          <div className="album-tag-picker-popover">
            {tags.length === 0 && (
              <span className="album-no-tag-hint">Chưa có tag nào</span>
            )}
            {tags.map((t) => {
              const isTagged = mediaTags.includes(t.label);
              return (
                <button
                  key={t.id}
                  className={`album-tag-picker-chip ${isTagged ? "active" : ""}`}
                  style={{ "--chip-color": t.color || "#ea580c" }}
                  onClick={() => onToggleTag(t.id, isTagged)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Meta: Date & Delete */}
        <div className="album-card-footer">
          <span className="album-card-date">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("vi-VN")
              : ""}
          </span>

          {isOwner && (
            <button
              className="album-card-delete-btn"
              onClick={onDelete}
              title="Xóa tệp"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
