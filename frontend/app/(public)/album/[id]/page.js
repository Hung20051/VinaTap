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
  ChevronRight,
  UserCheck,
  UserPlus,
  Smile,
  Layers,
  Calendar,
  Camera,
  Play,
  Pause,
  Heart,
  Flag,
  Stamp,
  Volume2,
  VolumeX,
} from "lucide-react";
import StickerCanvas from "@/components/ui/StickerCanvas";
import Dino404 from "@/components/ui/Dino404";
import DinoLoader from "@/components/ui/DinoLoader";
import { albumAPI, mediaAPI } from "@/lib/api";
import { getUser, isLoggedIn } from "@/lib/auth";
import { getSocket, joinAlbumRoom, leaveAlbumRoom } from "@/lib/socket";
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

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Hình ảnh phản cảm / 18+");
  const [reportDesc, setReportDesc] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Sticker Canvas & Story Slideshow State
  const [stickerEditingItem, setStickerEditingItem] = useState(null);
  const [storyModeIndex, setStoryModeIndex] = useState(null);

  const isOwner = !!(user && album && user.id === album.owner_id);
  const isCollaborator = album?.user_role === "collaborator";
  const isPendingCollaborator = album?.user_role === "pending_collaborator";
  const canEdit = isOwner || isCollaborator || !!album?.can_edit;

  useEffect(() => {
    loadAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isOwner) loadCollaborators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, album?.id]);

  // ─── REAL-TIME SYNC (SOCKET.IO) ──────────────────────────────
  useEffect(() => {
    if (!album?.id) return;

    joinAlbumRoom(album.id);
    if (album.share_code) joinAlbumRoom(album.share_code);

    const socket = getSocket();
    if (!socket) return;

    // 📸 Có ảnh/video mới được tải lên
    const handleMediaAdded = ({ items, uploaderName }) => {
      setMedia((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newUniqueItems = (items || []).filter(
          (it) => !existingIds.has(it.id),
        );
        return [...newUniqueItems, ...prev];
      });
      showToast(
        "success",
        `📸 ${uploaderName || "Cộng tác viên"} vừa thêm ${(items || []).length} khoảnh khắc mới!`,
      );
    };

    // 🗑️ Có ảnh bị xóa
    const handleMediaDeleted = ({ mediaId }) => {
      setMedia((prev) => prev.filter((m) => m.id !== mediaId));
    };

    // ✏️ Có ảnh được sửa caption
    const handleMediaUpdated = ({ mediaId, caption_user }) => {
      setMedia((prev) =>
        prev.map((m) => (m.id === mediaId ? { ...m, caption_user } : m)),
      );
    };

    // 🏷️ Tag mới được tạo
    const handleTagCreated = ({ tag }) => {
      setTags((prev) => {
        if (prev.some((t) => t.id === tag.id)) return prev;
        return [tag, ...prev];
      });
    };

    // ✕ Tag bị xóa
    const handleTagDeleted = ({ tagId }) => {
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    };

    // 📝 Thông tin album thay đổi
    const handleAlbumUpdated = ({ album: updatedAlbum }) => {
      if (updatedAlbum) {
        setAlbum((prev) => ({ ...prev, ...updatedAlbum }));
      }
    };

    // 🤝 Quyền cộng tác viên thay đổi
    const handleCollaboratorEvent = () => {
      loadAlbum();
      if (isOwner) loadCollaborators();
    };

    socket.on("media_added", handleMediaAdded);
    socket.on("media_deleted", handleMediaDeleted);
    socket.on("media_updated", handleMediaUpdated);
    socket.on("tag_created", handleTagCreated);
    socket.on("tag_deleted", handleTagDeleted);
    socket.on("album_updated", handleAlbumUpdated);
    socket.on("collaborator_requested", handleCollaboratorEvent);
    socket.on("collaborator_reviewed", handleCollaboratorEvent);
    socket.on("collaborator_revoked", handleCollaboratorEvent);

    return () => {
      leaveAlbumRoom(album.id);
      if (album.share_code) leaveAlbumRoom(album.share_code);
      socket.off("media_added", handleMediaAdded);
      socket.off("media_deleted", handleMediaDeleted);
      socket.off("media_updated", handleMediaUpdated);
      socket.off("tag_created", handleTagCreated);
      socket.off("tag_deleted", handleTagDeleted);
      socket.off("album_updated", handleAlbumUpdated);
      socket.off("collaborator_requested", handleCollaboratorEvent);
      socket.off("collaborator_reviewed", handleCollaboratorEvent);
      socket.off("collaborator_revoked", handleCollaboratorEvent);
    };
  }, [album?.id, album?.share_code, isOwner]);

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
      const uniqueMedia = (res.media || []).filter(
        (m, idx, arr) => arr.findIndex((x) => x.id === m.id) === idx,
      );
      setMedia(uniqueMedia);
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
    const slug = album?.share_code || album?.id || id;
    const url = `${window.location.origin}/album/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast("success", "Đã sao chép liên kết Album bí mật!");
    }
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
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      await albumAPI.update(albumTargetId, { is_public: nextPublic });
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
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      await albumAPI.delete(albumTargetId);
      showToast("success", "Đã xóa Album thành công");
      router.push("/customer/dashboard");
    } catch (err) {
      showToast("error", err.message || "Lỗi xóa album");
    }
  };

  const handleRequestEdit = async () => {
    setRequestingEdit(true);
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      await albumAPI.requestCollaborator(albumTargetId);
      showToast("success", "Đã gửi yêu cầu đóng góp ảnh cho chủ Album!");
    } catch (err) {
      showToast("error", err.message || "Lỗi gửi yêu cầu");
    } finally {
      setRequestingEdit(false);
    }
  };

  const handleReviewRequest = async (collabId, status) => {
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      await albumAPI.reviewCollaborator(albumTargetId, collabId, status);
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
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      await albumAPI.revokeCollaborator(albumTargetId, collabId);
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
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      const res = await albumAPI.createTag(albumTargetId, newTag);
      const createdTag = res.tag || (res.id ? res : null);
      if (createdTag) {
        setTags((prev) => {
          if (prev.some((t) => t && t.id === createdTag.id)) return prev;
          return [createdTag, ...prev.filter(Boolean)];
        });
      }
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
    const albumTargetId = album?.share_code || album?.id || id;
    try {
      await albumAPI.deleteTag(albumTargetId, tagId);
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
      const albumTargetId = album?.share_code || album?.id || id;
      formData.append("album_id", albumTargetId);

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
      setMedia((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueToAdd = newItems.filter((it) => it?.id && !existingIds.has(it.id));
        return [...uniqueToAdd, ...prev];
      });
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

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportReason) return;
    setSubmittingReport(true);
    try {
      const res = await albumAPI.report(album.id, {
        reason: reportReason,
        description: reportDesc.trim(),
      });
      showToast("success", res.message || "Đã gửi báo cáo vi phạm thành công!");
      setShowReportModal(false);
      setReportDesc("");
    } catch (err) {
      showToast("error", err.message || "Lỗi khi gửi báo cáo");
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <DinoLoader
        text="Đang nạp Album Kỷ Niệm VinaTap..."
        subtext="Vui lòng chờ trong giây lát"
        size={280}
        fullScreen={true}
      />
    );
  }

  if (loadError) {
    return (
      <Dino404
        title="Không Tìm Thấy Album Kỷ Niệm"
        message={loadError.message || "Album này có thể ở chế độ riêng tư, đã bị xóa hoặc đường dẫn không chính xác."}
        backBtnText="Quay Lại"
      />
    );
  }

  const pendingRequests = (collaborators || []).filter(
    (c) => c.status === "pending",
  );
  const approvedCollaborators = (collaborators || []).filter(
    (c) => c.status === "approved",
  );

  const filteredMedia = media.filter((m) => {
    const isVideo = m.media_type === "video";
    const isPhoto = m.media_type === "photo" || m.media_type === "image" || !isVideo;
    if (activeFilter === "image" && !isPhoto) return false;
    if (activeFilter === "video" && !isVideo) return false;
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

            {(isOwner || isCollaborator) && album.status === "active" && (
              <button
                className="album-icon-btn album-icon-btn--primary"
                onClick={handlePickFiles}
                disabled={uploading}
                title="Thêm ảnh"
              >
                <Camera size={16} />
                <span className="btn-text-desktop">{uploading ? "Đang tải..." : "Thêm ảnh"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ⚠️ Locked Notice Banner */}
      {album?.status === "archived" && (
        <div
          style={{
            background: "linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)",
            border: "2px solid #fca5a5",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            margin: "1.5rem auto",
            maxWidth: "1100px",
            color: "#991b1b",
            boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.1)",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#dc2626",
              color: "#fff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "1.1rem",
            }}
          >
            🔒
          </div>
          <div>
            <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.1rem", fontWeight: 800, color: "#b91c1c" }}>
              Album Này Đang Bị Tạm Khóa Bởi Quản Trị Viên
            </h3>
            <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.9rem", color: "#7f1d1d", lineHeight: 1.5 }}>
              <strong>Lý do khóa:</strong> {album.locked_reason || "Nội dung vi phạm chính sách cộng đồng hoặc thuần phong mỹ tục"}.
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#991b1b" }}>
              Album đã được tạm ẩn khỏi bản đồ du lịch công cộng. Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ bộ phận CSKH để được hỗ trợ mở khóa.
            </p>
          </div>
        </div>
      )}

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
                    placeholder="Viết vài dòng kỷ niệm về chuyến đi này..."
                    className="album-edit-textarea"
                  />
                  <div className="album-edit-btn-row">
                    <button
                      className="album-pill-btn album-pill-btn--primary"
                      onClick={handleSaveInfo}
                      disabled={savingInfo}
                    >
                      <Check size={14} /> {savingInfo ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button
                      className="album-pill-btn"
                      onClick={() => setEditingInfo(false)}
                    >
                      <X size={14} /> Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="album-meta-badge-row">
                    <span className="album-meta-badge album-meta-badge--province">
                      📍 {album.province_name}
                    </span>
                    {album.is_public ? (
                      <span className="album-meta-badge album-meta-badge--public">
                        <Globe size={12} /> Công Khai
                      </span>
                    ) : (
                      <span className="album-meta-badge album-meta-badge--private">
                        <Lock size={12} /> Riêng Tư
                      </span>
                    )}
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

              {/* Owner & Collaborator Action Buttons */}
              <div className="album-hero-actions-bar">
                {isOwner && (
                  <>
                    {album.status === "active" && !editingInfo && (
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
                      </>
                    )}
                    <button
                      className="album-pill-btn album-pill-btn--danger"
                      onClick={handleDeleteAlbum}
                    >
                      <Trash2 size={14} /> Xóa Album
                    </button>
                  </>
                )}

                {!isOwner && isCollaborator && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(22, 163, 74, 0.12)",
                      color: "#16a34a",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      border: "1px solid rgba(22, 163, 74, 0.3)",
                    }}
                  >
                    <UserCheck size={16} /> Bạn là Cộng Tác Viên
                  </div>
                )}

                {!isOwner && isPendingCollaborator && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(234, 88, 12, 0.12)",
                      color: "#ea580c",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      border: "1px solid rgba(234, 88, 12, 0.3)",
                    }}
                  >
                    ⏳ Đang Chờ Chủ Album Duyệt
                  </div>
                )}

                {!isOwner && !isCollaborator && !isPendingCollaborator && album.status === "active" && isLoggedIn() && (
                  <button
                    className="album-pill-btn album-pill-btn--primary"
                    onClick={handleRequestEdit}
                    disabled={requestingEdit}
                  >
                    <UserPlus size={14} />{" "}
                    {requestingEdit ? "Đang gửi..." : "Xin Quyền Đóng Góp"}
                  </button>
                )}

                {!isOwner && album.status === "active" && (
                  <button
                    type="button"
                    className="album-pill-btn"
                    style={{ color: "#ef4444", borderColor: "#fca5a5" }}
                    onClick={() => setShowReportModal(true)}
                    title="Báo cáo nội dung vi phạm"
                  >
                    <Flag size={14} /> Báo Cáo
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
          <div
            className="album-tags-scroll"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            <button
              className={`album-story-tag ${selectedTagFilter === null ? "active" : ""}`}
              onClick={() => setSelectedTagFilter(null)}
            >
              <span>✨ Tất Cả</span>
            </button>

            {tags.filter(Boolean).map((t) => (
              <span
                key={t?.id}
                className={`album-story-tag ${selectedTagFilter === t?.id ? "active" : ""}`}
                style={{
                  "--tag-color": t?.color || "#ea580c",
                }}
                onClick={() =>
                  setSelectedTagFilter(selectedTagFilter === t?.id ? null : t?.id)
                }
              >
                <span>#{t?.label}</span>
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(t?.id);
                    }}
                    className="album-story-tag-del"
                    title="Xóa tag"
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}

            {(isOwner || isCollaborator) && album.status === "active" && (
              <button
                className="album-story-tag album-story-tag--add"
                onClick={() => setShowTagModal(true)}
              >
                <Plus size={13} /> Thêm Tag
              </button>
            )}
          </div>

          {filteredMedia.length > 0 && (
            <div className="album-tags-action-side">
              <button
                className="album-story-tag album-story-tag--play"
                onClick={() => setStoryModeIndex(0)}
                title="Trình chiếu Story hành trình"
              >
                <Play size={13} fill="currentColor" />
                <span>
                  Trình Chiếu Story{" "}
                  {selectedTagFilter
                    ? `(#${tags.find((t) => t?.id === selectedTagFilter)?.label || ""})`
                    : ""}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. COLLABORATOR REQUESTS (CHỈ CHỦ ALBUM) ───────────── */}
      {isOwner && (pendingRequests.length > 0 || approvedCollaborators.length > 0) && (
        <section className="album-collab-section">
          <div className="album-collab-card">
            <div className="album-collab-header">
              <UserCheck size={18} style={{ color: "#2563eb" }} />
              <h3>Cộng Tác Viên Đóng Góp ({approvedCollaborators.length + pendingRequests.length})</h3>
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
              {
                media.filter(
                  (m) =>
                    m.media_type === "photo" ||
                    m.media_type === "image" ||
                    m.media_type !== "video",
                ).length
              }
              )
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
            {(isOwner || isCollaborator) && album.status === "active" && (
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
            {(isOwner || isCollaborator) && album.status === "active" && (
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
                key={m.id ? `media-${m.id}` : `media-idx-${idx}`}
                item={m}
                tags={tags}
                isOwner={isOwner}
                canEdit={canEdit && album.status === "active"}
                canDelete={isOwner || (user && user.id === m.uploader_id)}
                onDelete={() => handleDeleteMedia(m.id)}
                onSaveCaption={(caption) => handleSaveCaption(m.id, caption)}
                onToggleTag={(tagId, isTagged) =>
                  handleToggleTagOnMedia(m, tagId, isTagged)
                }
                onOpenLightbox={() => setLightboxIndex(idx)}
                onOpenSticker={(it) => setStickerEditingItem(it)}
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
            <div className="album-lightbox-media-wrap" style={{ position: "relative" }}>
              {currentLightboxItem.media_type === "video" ? (
                <video
                  src={currentLightboxItem.file_url}
                  controls
                  autoPlay
                  className="album-lightbox-video"
                />
              ) : (
                <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", maxHeight: "72vh" }}>
                  <img
                    src={currentLightboxItem.file_url}
                    alt=""
                    className="album-lightbox-img"
                  />
                  {/* Sticker overlays inside lightbox */}
                  {(Array.isArray(currentLightboxItem.stickers)
                    ? currentLightboxItem.stickers
                    : (() => {
                        try {
                          return JSON.parse(currentLightboxItem.stickers || "[]");
                        } catch (e) {
                          return [];
                        }
                      })()
                  ).map((ov, sIdx) => (
                    <img
                      key={ov.id || sIdx}
                      src={ov.image_url}
                      alt=""
                      className="album-card-sticker-overlay"
                      style={{
                        left: `${ov.pos_x}%`,
                        top: `${ov.pos_y}%`,
                        transform: `translate(-50%, -50%) rotate(${ov.rotation_deg || 0}deg) scale(${ov.scale || 1})`,
                        zIndex: ov.z_index || 5,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="album-lightbox-info-bar">
              <div className="album-lightbox-caption">
                <h4>
                  {currentLightboxItem.caption_user ||
                    currentLightboxItem.caption_ai ||
                    "Khoảnh khắc kỷ niệm"}
                </h4>
                {currentLightboxItem.tags && (
                  <div className="album-lightbox-tags">
                    {currentLightboxItem.tags.split(",").map((t) => (
                      <span key={t} className="album-lightbox-tag-chip">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="album-lightbox-actions" style={{ display: "flex", gap: "8px" }}>
                {canEdit && currentLightboxItem.media_type !== "video" && (
                  <button
                    className="album-lightbox-action-btn"
                    onClick={() => {
                      setStickerEditingItem(currentLightboxItem);
                      setLightboxIndex(null);
                    }}
                    title="Dán Con Dấu / Sticker Du Lịch"
                  >
                    <Stamp size={16} />
                  </button>
                )}
                <a
                  href={currentLightboxItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="album-lightbox-action-btn"
                  title="Mở gốc"
                >
                  <Maximize2 size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. STICKER CANVAS MODAL ─────────────────────────────── */}
      {stickerEditingItem && (
        <StickerCanvas
          mediaItem={stickerEditingItem}
          onClose={() => setStickerEditingItem(null)}
          onSaved={() => {
            setStickerEditingItem(null);
            loadAlbum();
          }}
        />
      )}

      {/* ─── 7. IMMERSIVE STORY SLIDESHOW VIEWER ──────────────────── */}
      {storyModeIndex !== null && (
        <StoryViewer
          items={filteredMedia}
          initialIndex={storyModeIndex}
          albumName={album?.title || album?.province_name}
          ownerName={album?.owner_name}
          provinceThumb={album?.province_thumbnail}
          onClose={() => setStoryModeIndex(null)}
        />
      )}

      {/* ─── 6. CREATE TAG MODAL ─────────────────────────────────── */}
      {showTagModal && (
        <div
          className="album-modal-overlay"
          onClick={() => setShowTagModal(false)}
        >
          <div className="album-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="album-modal-header">
              <h3>
                <TagIcon size={18} /> Tạo Tag / Chủ Đề Kỷ Niệm
              </h3>
              <button
                className="album-modal-close"
                onClick={() => setShowTagModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTag} className="album-modal-form">
              <label className="album-form-label">Tên Tag (Ví dụ: Ăn Uống, Check-in...):</label>
              <input
                type="text"
                placeholder="Nhập tên tag..."
                className="album-form-input"
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

      {/* Modal Báo Cáo Vi Phạm */}
      {showReportModal && (
        <div
          className="album-modal-overlay"
          onClick={() => setShowReportModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 440,
              padding: "1.75rem",
              borderRadius: 20,
              background: "#ffffff",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Flag size={18} /> Báo Cáo Album Vi Phạm
              </h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                lineHeight: 1.5,
                marginBottom: "1.25rem",
              }}
            >
              Nếu bạn nhận thấy Album này chứa nội dung đồi trụy, spam, lừa đảo,
              phản cảm hoặc vi phạm bản quyền, vui lòng gửi báo cáo để Ban Quản
              Trị VinaTap xử lý.
            </p>

            <form
              onSubmit={handleSendReport}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.35rem",
                  }}
                >
                  Lý do báo cáo *
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                  }}
                >
                  <option value="Hình ảnh phản cảm / 18+">
                    Hình ảnh phản cảm / 18+
                  </option>
                  <option value="Spam / Quảng cáo trái phép">
                    Spam / Quảng cáo trái phép
                  </option>
                  <option value="Ngôn từ thù địch / Xúc phạm">
                    Ngôn từ thù địch / Xúc phạm
                  </option>
                  <option value="Vi phạm bản quyền hình ảnh">
                    Vi phạm bản quyền hình ảnh
                  </option>
                  <option value="Khác">Lý do khác...</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.35rem",
                  }}
                >
                  Mô tả chi tiết (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Ảnh số 2 có nội dung không phù hợp..."
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.88rem",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="submit"
                  disabled={submittingReport}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {submittingReport ? "Đang gửi báo cáo..." : "Gửi Báo Cáo"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "12px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Hủy
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
  canEdit,
  canDelete,
  onDelete,
  onSaveCaption,
  onToggleTag,
  onOpenLightbox,
  onOpenSticker,
}) {
  const [caption, setCaption] = useState(
    item.caption_user || item.caption_ai || "",
  );
  const [editingCaption, setEditingCaption] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const mediaTags = (item.tags || "").split(",").filter(Boolean);

  const stickerList = Array.isArray(item.stickers)
    ? item.stickers
    : (() => {
        try {
          return JSON.parse(item.stickers || "[]");
        } catch (e) {
          return [];
        }
      })();

  return (
    <div className="album-media-item">
      {/* Media Thumbnail Container */}
      <div
        className="album-media-visual"
        onClick={onOpenLightbox}
        style={{ position: "relative" }}
      >
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

        {/* Sticker overlays rendered on thumbnail */}
        {stickerList.map((ov, sIdx) => (
          <img
            key={ov.id || sIdx}
            src={ov.image_url}
            alt=""
            className="album-card-sticker-overlay"
            style={{
              left: `${ov.pos_x}%`,
              top: `${ov.pos_y}%`,
              transform: `translate(-50%, -50%) rotate(${ov.rotation_deg || 0}deg) scale(${ov.scale || 1})`,
              zIndex: ov.z_index || 5,
            }}
          />
        ))}

        {/* Hover Action Overlay */}
        <div className="album-media-hover-overlay">
          <div className="album-hover-zoom-btn">
            <Maximize2 size={18} />
          </div>
        </div>
      </div>

      {/* Caption & Tag Row */}
      <div className="album-media-details" onClick={(e) => e.stopPropagation()}>
        {editingCaption ? (
          <div className="album-edit-caption-row" onClick={(e) => e.stopPropagation()}>
            <input
              className="album-caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
            <button
              type="button"
              className="album-btn-save-cap"
              onClick={(e) => {
                e.stopPropagation();
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
            onClick={(e) => {
              e.stopPropagation();
              if (canEdit) setEditingCaption(true);
            }}
            title={canEdit ? "Bấm để sửa ghi chú" : ""}
          >
            <Sparkles size={13} className="album-sparkle-icon" />
            <span>
              {caption || (
                <em className="album-caption-empty">
                  {canEdit ? "+ Thêm ghi chú..." : "Khoảnh khắc kỷ niệm"}
                </em>
              )}
            </span>
          </p>
        )}

        {/* Tags & Stamp Actions Row */}
        <div className="album-card-tags-row" onClick={(e) => e.stopPropagation()}>
          {mediaTags.map((label) => (
            <span key={label} className="album-card-tag-pill">
              #{label}
            </span>
          ))}

          {canEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTagPicker((v) => !v);
              }}
              className="album-card-add-tag-btn"
            >
              + Tag
            </button>
          )}

          {canEdit && item.media_type !== "video" && (
            <button
              type="button"
              className="album-card-stamp-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSticker?.(item);
              }}
              title="Dán Con Dấu / Sticker du lịch"
            >
              <Stamp size={12} /> Dán Sticker
            </button>
          )}
        </div>

        {/* Tag Selection Popup */}
        {showTagPicker && canEdit && (
          <div className="album-tag-picker-popover" onClick={(e) => e.stopPropagation()}>
            {tags.length === 0 && (
              <span className="album-no-tag-hint">Chưa có tag nào</span>
            )}
            {tags.map((t) => {
              const isTagged = mediaTags.includes(t.label);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`album-tag-picker-chip ${isTagged ? "active" : ""}`}
                  style={{ "--chip-color": t.color || "#ea580c" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTag(t.id, isTagged);
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Meta: Date & Delete */}
        <div className="album-card-footer" onClick={(e) => e.stopPropagation()}>
          <span className="album-card-date">
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString("vi-VN")
              : ""}
          </span>

          {canDelete && (
            <button
              type="button"
              className="album-card-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
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

// ─── Component: Immersive Fullscreen Story Slideshow ──────────
function StoryViewer({
  items = [],
  initialIndex = 0,
  albumName = "",
  ownerName = "",
  provinceThumb = "",
  onClose,
}) {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef(null);
  const PHOTO_DURATION = 5000; // 5 giây cho ảnh
  const currentItem = items[index];
  const isVideo = currentItem?.media_type === "video";

  // Bộ đếm thời gian cho Ảnh (5s)
  useEffect(() => {
    if (isVideo) return;
    if (isPaused) return;

    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / PHOTO_DURATION) * 100);
      setProgress(pct);

      if (elapsed >= PHOTO_DURATION) {
        clearInterval(interval);
        handleNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [index, isPaused, isVideo, items.length]);

  // Điều khiển Video Tạm dừng / Tiếp tục theo trạng thái Hold hoặc nút Pause
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  }, [isPaused, isVideo]);

  // Cập nhật thanh tiến trình Story theo thời gian thực tế của Video
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    if (v.duration > 0) {
      const pct = (v.currentTime / v.duration) * 100;
      setProgress(Math.min(100, pct));
    }
  };

  // Khi Video phát xong -> tự động chuyển sang slide Story tiếp theo
  const handleVideoEnded = () => {
    setProgress(100);
    handleNext();
  };

  const handleNext = () => {
    setProgress(0);
    if (index < items.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      onClose?.();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  // Phím tắt điều hướng bàn phím
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight" || e.key === " ") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, items.length]);

  if (!currentItem) return null;

  const currentStickers = Array.isArray(currentItem.stickers)
    ? currentItem.stickers
    : (() => {
        try {
          return JSON.parse(currentItem.stickers || "[]");
        } catch (e) {
          return [];
        }
      })();

  const currentTags = (currentItem.tags || "").split(",").filter(Boolean);

  return (
    <div className="album-story-viewer-overlay">
      <div
        className="album-story-container"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Progress Segments */}
        <div className="album-story-progress-bar-row">
          {items.map((it, idx) => (
            <div key={it.id || idx} className="album-story-progress-track">
              <div
                className="album-story-progress-fill"
                style={{
                  width:
                    idx < index
                      ? "100%"
                      : idx === index
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="album-story-header">
          <div className="album-story-user-info">
            {provinceThumb ? (
              <img
                src={provinceThumb}
                alt=""
                className="album-story-avatar"
              />
            ) : (
              <div
                className="album-story-avatar"
                style={{
                  background: "#ea580c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "1.1rem",
                }}
              >
                🗺️
              </div>
            )}
            <div className="album-story-meta">
              <h4>{albumName}</h4>
              <span>
                {ownerName ? `Bởi ${ownerName}` : "Kỷ niệm VinaTap"} •{" "}
                {index + 1}/{items.length}
                {isVideo && " • 🎬 Video"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Nút Bật/Tắt Âm Thanh khi đang chiếu Video */}
            {isVideo && (
              <button
                className="album-story-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((m) => {
                    const next = !m;
                    if (videoRef.current) videoRef.current.muted = next;
                    return next;
                  });
                }}
                title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}

            <button
              className="album-story-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused((p) => !p);
              }}
              title={isPaused ? "Tiếp tục" : "Tạm dừng"}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>

            <button
              className="album-story-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              title="Đóng Story"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Story Content & Tap Zones */}
        <div className="album-story-content">
          {isVideo ? (
            <video
              ref={videoRef}
              key={currentItem.file_url}
              src={currentItem.file_url}
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              className="album-story-media"
            />
          ) : (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <img
                src={currentItem.file_url}
                alt=""
                className="album-story-media"
              />
              {/* Sticker overlays inside story */}
              {currentStickers.map((ov, sIdx) => (
                <img
                  key={ov.id || sIdx}
                  src={ov.image_url}
                  alt=""
                  className="album-card-sticker-overlay"
                  style={{
                    left: `${ov.pos_x}%`,
                    top: `${ov.pos_y}%`,
                    transform: `translate(-50%, -50%) rotate(${ov.rotation_deg || 0}deg) scale(${ov.scale || 1})`,
                    zIndex: ov.z_index || 5,
                  }}
                />
              ))}
            </div>
          )}

          {/* Tap Zones for Next & Prev */}
          <div className="album-story-tap-zone">
            <div
              className="album-story-tap-prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            />
            <div
              className="album-story-tap-next"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            />
          </div>

          {/* Bottom Story Caption & Tags */}
          {(currentItem.caption_user ||
            currentItem.caption_ai ||
            currentTags.length > 0) && (
            <div className="album-story-caption-overlay">
              {(currentItem.caption_user || currentItem.caption_ai) && (
                <p className="album-story-caption-text">
                  ✨ {currentItem.caption_user || currentItem.caption_ai}
                </p>
              )}
              {currentTags.length > 0 && (
                <div className="album-story-tags-row">
                  {currentTags.map((t) => (
                    <span key={t} className="album-story-tag-pill">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
