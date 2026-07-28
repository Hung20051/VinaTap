"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "../../components/Logo";
import { useRouter } from "next/navigation";
import { provinceAPI, stickerAPI, nfcAPI } from "../../lib/api";
import { requireAdmin, clearAuth } from "../../lib/auth";
import "../../styles/admin.css";

const TABS = ["provinces", "landmarks", "stickers", "nfc"];
const TAB_LABEL = {
  provinces: "🗺 Tỉnh thành",
  landmarks: "📍 Địa danh",
  stickers: "✨ Sticker",
  nfc: "🔑 NFC Serial",
};

// Các cặp [key, label] dùng để render nhanh những field text đơn giản
// (input value={form[key]}) bằng .map thay vì viết tay từng ô.
const PROVINCE_FIELDS = [
  ["name", "Tên tỉnh *"],
  ["slug", "Slug (URL) *"],
  ["youtube_url", "YouTube URL"],
  ["thumbnail_url", "Thumbnail URL"],
  ["lat", "Vĩ độ"],
  ["lng", "Kinh độ"],
  ["population", "Dân số"],
  ["area_km2", "Diện tích (km²)"],
];
const REGION_OPTIONS = [
  ["north", "Miền Bắc"],
  ["central", "Miền Trung"],
  ["south", "Miền Nam"],
  ["island", "Hải đảo"],
];
const LANDMARK_FIELDS = [
  ["name", "Tên địa danh *"],
  ["address", "Địa chỉ"],
  ["latitude", "Vĩ độ"],
  ["longitude", "Kinh độ"],
  ["maps_place_id", "Google Maps Place ID"],
  ["thumbnail_url", "Thumbnail URL"],
];
const LANDMARK_CATEGORIES = [
  ["attraction", "Tham quan"],
  ["food", "Ẩm thực"],
  ["stay", "Lưu trú"],
  ["beach", "Biển"],
  ["temple", "Đền chùa"],
  ["market", "Chợ"],
  ["other", "Khác"],
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState("provinces");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Provinces
  const [provinces, setProvinces] = useState([]);
  const [provForm, setProvForm] = useState(null); // null = ẩn form

  // Landmarks
  const [selProvince, setSelProvince] = useState("");
  const [landmarks, setLandmarks] = useState([]);
  const [landmarkForm, setLandmarkForm] = useState(null);

  // Stickers
  const [stickers, setStickers] = useState([]);
  const [stickerFile, setStickerFile] = useState(null);
  const [stickerName, setStickerName] = useState("");
  const [stickerCat, setStickerCat] = useState("");

  // NFC
  const [nfcProvince, setNfcProvince] = useState("");
  const [nfcPrefix, setNfcPrefix] = useState("");
  const [nfcCount, setNfcCount] = useState(10);
  const [nfcResult, setNfcResult] = useState(null);

  // NFC — chuẩn bị nội dung sẵn + gán link vào thẻ (provision)
  const [provSerial, setProvSerial] = useState("");
  const [provOwnerEmail, setProvOwnerEmail] = useState("");
  const [provTitle, setProvTitle] = useState("");
  const [provDescription, setProvDescription] = useState("");
  const [provIsPublic, setProvIsPublic] = useState(true);
  const [provLoading, setProvLoading] = useState(false);
  const [provResult, setProvResult] = useState(null);

  useEffect(() => {
    if (!requireAdmin(router)) return;
    loadProvinces();
  }, [router]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProvinces = async () => {
    setLoading(true);
    try {
      const res = await provinceAPI.getAll();
      setProvinces(res.provinces || []);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLandmarks = async (provinceId) => {
    if (!provinceId) return;
    try {
      const res = await provinceAPI.getOne(
        provinces.find((p) => p.id == provinceId)?.slug,
      );
      setLandmarks(res.landmarks || []);
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const loadStickers = async () => {
    try {
      const res = await stickerAPI.getAll();
      setStickers(res.stickers || []);
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === "stickers") loadStickers();
  };

  // ─── Province CRUD ──────────────────────────────────────────
  const handleSaveProvince = async () => {
    try {
      const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}`;
      const token = localStorage.getItem("vinatap_token");
      const method = provForm.id ? "PUT" : "POST";
      const url = provForm.id
        ? `${BASE}/provinces/${provForm.id}`
        : `${BASE}/provinces`;
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(provForm),
      });
      showToast("success", provForm.id ? "Đã cập nhật tỉnh" : "Đã thêm tỉnh");
      setProvForm(null);
      loadProvinces();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleDeleteProvince = async (id) => {
    if (!confirm("Ẩn tỉnh này?")) return;
    try {
      const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}`;
      const token = localStorage.getItem("vinatap_token");
      await fetch(`${BASE}/provinces/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("success", "Đã ẩn tỉnh");
      loadProvinces();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  // ─── Landmark CRUD ──────────────────────────────────────────
  const handleSaveLandmark = async () => {
    try {
      const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}`;
      const token = localStorage.getItem("vinatap_token");
      const method = landmarkForm.id ? "PUT" : "POST";
      const url = landmarkForm.id
        ? `${BASE}/provinces/landmarks/${landmarkForm.id}`
        : `${BASE}/provinces/${selProvince}/landmarks`;
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(landmarkForm),
      });
      showToast("success", "Đã lưu địa danh");
      setLandmarkForm(null);
      loadLandmarks(selProvince);
    } catch (err) {
      showToast("error", err.message);
    }
  };

  // ─── Sticker upload ─────────────────────────────────────────
  const handleUploadSticker = async () => {
    if (!stickerFile || !stickerName) {
      showToast("error", "Cần chọn file và tên");
      return;
    }
    try {
      const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}`;
      const token = localStorage.getItem("vinatap_token");
      const form = new FormData();
      form.append("file", stickerFile);
      form.append("name", stickerName);
      form.append("category", stickerCat);
      await fetch(`${BASE}/stickers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      showToast("success", "Đã thêm sticker");
      setStickerFile(null);
      setStickerName("");
      setStickerCat("");
      loadStickers();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  // ─── NFC Batch ──────────────────────────────────────────────
  const handleCreateBatch = async () => {
    if (!nfcProvince || !nfcPrefix) {
      showToast("error", "Cần chọn tỉnh và prefix");
      return;
    }
    try {
      const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}`;
      const token = localStorage.getItem("vinatap_token");
      const res = await fetch(`${BASE}/nfc/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          province_id: nfcProvince,
          prefix: nfcPrefix,
          count: nfcCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNfcResult(data);
      showToast("success", data.message);
    } catch (err) {
      showToast("error", err.message);
    }
  };

  // ─── NFC Provision: gán chủ (nếu cần) + điền sẵn nội dung album ──
  const handleProvisionCard = async () => {
    if (!provSerial) {
      showToast("error", "Cần nhập serial code của thẻ");
      return;
    }
    setProvLoading(true);
    try {
      const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}`;
      const token = localStorage.getItem("vinatap_token");
      const res = await fetch(`${BASE}/nfc/admin/provision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serial_code: provSerial.trim(),
          owner_email: provOwnerEmail.trim() || undefined,
          title: provTitle.trim() || undefined,
          description: provDescription.trim() || undefined,
          is_public: provIsPublic,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProvResult(data);
      showToast("success", data.message);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setProvLoading(false);
    }
  };

  const handleCopyTapLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("success", "Đã copy link");
    } catch {
      showToast("error", "Không copy được, hãy tự bôi đen link");
    }
  };

  if (loading)
    return (
      <div className="admin-page-loading">
        <div className="spinner" />
      </div>
    );

  return (
    <>
      <nav className="navbar">
        <div className="container navbar__inner">
          <Logo className="navbar__logo" />
          <div className="navbar__links">
            <Link href="/dashboard">Dashboard</Link>
            <button
              className="btn btn-outline"
              onClick={() => {
                clearAuth();
                router.push("/");
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.text}</div>
      )}

      <div className="container admin-page">
        <h1 className="admin-title">⚙️ Quản trị hệ thống</h1>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`btn ${tab === t ? "btn-primary" : "btn-ghost"}`}
              onClick={() => handleTabChange(t)}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>

        {/* ── Tab: Provinces ── */}
        {tab === "provinces" && (
          <div>
            <div className="admin-toolbar-end">
              <button
                className="btn btn-primary"
                onClick={() =>
                  setProvForm({
                    name: "",
                    slug: "",
                    region: "north",
                    description: "",
                    youtube_url: "",
                    lat: "",
                    lng: "",
                  })
                }
              >
                + Thêm tỉnh
              </button>
            </div>

            {provForm && (
              <div className="card admin-panel">
                <h3 className="admin-panel-title">
                  {provForm.id ? "Sửa tỉnh" : "Thêm tỉnh mới"}
                </h3>
                <div className="admin-form-grid">
                  {PROVINCE_FIELDS.map(([key, label]) => (
                    <div key={key}>
                      <label className="admin-field__label">{label}</label>
                      <input
                        className="input"
                        value={provForm[key] || ""}
                        onChange={(e) =>
                          setProvForm({ ...provForm, [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <label className="admin-field__label">Vùng *</label>
                    <select
                      className="input"
                      value={provForm.region}
                      onChange={(e) =>
                        setProvForm({ ...provForm, region: e.target.value })
                      }
                    >
                      {REGION_OPTIONS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field--full">
                    <label className="admin-field__label">Mô tả</label>
                    <textarea
                      className="input"
                      rows={2}
                      value={provForm.description || ""}
                      onChange={(e) =>
                        setProvForm({
                          ...provForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="admin-field--full">
                    <label className="admin-field__label">
                      Đặc sản / lễ hội (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      className="input"
                      value={provForm.specialties || ""}
                      onChange={(e) =>
                        setProvForm({
                          ...provForm,
                          specialties: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveProvince}
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setProvForm(null)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            <div className="admin-list">
              {provinces.map((p) => (
                <div key={p.id} className="card admin-list-item">
                  <div>
                    <span className="admin-list-item__name">{p.name}</span>
                    <span className="admin-list-item__meta">/{p.slug}</span>
                  </div>
                  <div className="admin-list-item__actions">
                    <button
                      className="btn btn-outline admin-btn-sm"
                      onClick={() => setProvForm({ ...p })}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-ghost admin-btn-sm"
                      onClick={() => handleDeleteProvince(p.id)}
                    >
                      🗑 Ẩn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Landmarks ── */}
        {tab === "landmarks" && (
          <div>
            <div className="admin-toolbar">
              <select
                className="input admin-select-narrow"
                value={selProvince}
                onChange={(e) => {
                  setSelProvince(e.target.value);
                  loadLandmarks(e.target.value);
                }}
              >
                <option value="">Chọn tỉnh...</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {selProvince && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    setLandmarkForm({
                      name: "",
                      address: "",
                      latitude: "",
                      longitude: "",
                      maps_place_id: "",
                      category: "attraction",
                      description: "",
                    })
                  }
                >
                  + Thêm địa danh
                </button>
              )}
            </div>

            {landmarkForm && (
              <div className="card admin-panel">
                <h3 className="admin-panel-title">
                  {landmarkForm.id ? "Sửa địa danh" : "Thêm địa danh mới"}
                </h3>
                <div className="admin-form-grid">
                  {LANDMARK_FIELDS.map(([key, label]) => (
                    <div key={key}>
                      <label className="admin-field__label">{label}</label>
                      <input
                        className="input"
                        value={landmarkForm[key] || ""}
                        onChange={(e) =>
                          setLandmarkForm({
                            ...landmarkForm,
                            [key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                  <div>
                    <label className="admin-field__label">Loại</label>
                    <select
                      className="input"
                      value={landmarkForm.category}
                      onChange={(e) =>
                        setLandmarkForm({
                          ...landmarkForm,
                          category: e.target.value,
                        })
                      }
                    >
                      {LANDMARK_CATEGORIES.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field--full">
                    <label className="admin-field__label">Mô tả</label>
                    <textarea
                      className="input"
                      rows={2}
                      value={landmarkForm.description || ""}
                      onChange={(e) =>
                        setLandmarkForm({
                          ...landmarkForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="admin-form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveLandmark}
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setLandmarkForm(null)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            <div className="admin-list">
              {landmarks.map((l) => (
                <div key={l.id} className="card admin-list-item">
                  <div>
                    <span className="admin-list-item__name">{l.name}</span>
                    <span className="badge badge-primary admin-badge-sm">
                      {l.category}
                    </span>
                    {l.address && (
                      <p className="admin-list-item__desc">{l.address}</p>
                    )}
                  </div>
                  <button
                    className="btn btn-outline admin-btn-sm"
                    onClick={() => setLandmarkForm({ ...l })}
                  >
                    ✏️ Sửa
                  </button>
                </div>
              ))}
              {selProvince && !landmarks.length && (
                <p className="admin-empty">Tỉnh này chưa có địa danh nào</p>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Stickers ── */}
        {tab === "stickers" && (
          <div>
            <div className="card admin-panel">
              <h3 className="admin-panel-title">Upload sticker mới</h3>
              <div className="admin-form-row">
                <div>
                  <label className="admin-field__label">File PNG *</label>
                  <input
                    type="file"
                    accept="image/png,image/webp"
                    onChange={(e) => setStickerFile(e.target.files[0])}
                  />
                </div>
                <div>
                  <label className="admin-field__label">Tên sticker *</label>
                  <input
                    className="input admin-field--w180"
                    value={stickerName}
                    onChange={(e) => setStickerName(e.target.value)}
                    placeholder="VD: Hoa sen"
                  />
                </div>
                <div>
                  <label className="admin-field__label">Danh mục</label>
                  <input
                    className="input admin-field--w140"
                    value={stickerCat}
                    onChange={(e) => setStickerCat(e.target.value)}
                    placeholder="VD: nature"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleUploadSticker}
                >
                  Upload
                </button>
              </div>
            </div>

            <div className="admin-sticker-grid">
              {stickers.map((s) => (
                <div key={s.id} className="card admin-sticker-card">
                  <img src={s.image_url} alt={s.name} />
                  <p className="admin-sticker-card__name">{s.name}</p>
                  {s.category && (
                    <p className="admin-sticker-card__cat">{s.category}</p>
                  )}
                </div>
              ))}
              {!stickers.length && (
                <p className="admin-empty">Chưa có sticker nào</p>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: NFC ── */}
        {tab === "nfc" && (
          <div>
            <div className="card admin-panel admin-panel--narrow">
              <h3 className="admin-panel-title">Tạo serial NFC hàng loạt</h3>
              <div className="admin-form-grid--column">
                <div>
                  <label className="admin-field__label">Tỉnh *</label>
                  <select
                    className="input"
                    value={nfcProvince}
                    onChange={(e) => setNfcProvince(e.target.value)}
                  >
                    <option value="">Chọn tỉnh...</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-field__label">
                    Prefix (viết tắt tỉnh) *
                  </label>
                  <input
                    className="input"
                    value={nfcPrefix}
                    onChange={(e) => setNfcPrefix(e.target.value.toUpperCase())}
                    placeholder="VD: HAN, SGN, DAN"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="admin-field__label">
                    Số lượng (tối đa 500)
                  </label>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    max={500}
                    value={nfcCount}
                    onChange={(e) => setNfcCount(Number(e.target.value))}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleCreateBatch}>
                  Tạo serial
                </button>
              </div>
            </div>

            {nfcResult && (
              <div className="card admin-nfc-result">
                <p className="admin-nfc-result__title">
                  ✅ {nfcResult.message}
                </p>
                <p className="admin-nfc-result__label">5 serial đầu tiên:</p>
                {nfcResult.sample?.map((s, i) => (
                  <p key={i} className="admin-nfc-result__serial">
                    {s}
                  </p>
                ))}
              </div>
            )}

            {/* ── Chuẩn bị nội dung sẵn + gán link vào thẻ ── */}
            <div className="card admin-panel admin-panel--narrow">
              <h3 className="admin-panel-title">
                Chuẩn bị album sẵn &amp; lấy link gán vào thẻ
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted, #888)",
                  marginBottom: 12,
                }}
              >
                Dùng khi khách đã mua thẻ ở kênh khác (Shopee, TikTok Shop...):
                nhập serial thẻ + nội dung album trước, hệ thống trả về link để
                ghi vào chip NFC. Nếu thẻ đã có chủ rồi thì bỏ trống ô email.
              </p>
              <div className="admin-form-grid--column">
                <div>
                  <label className="admin-field__label">
                    Serial code thẻ *
                  </label>
                  <input
                    className="input"
                    value={provSerial}
                    onChange={(e) =>
                      setProvSerial(e.target.value.toUpperCase())
                    }
                    placeholder="VD: DAN-2025-D4E5F6A7B8"
                  />
                </div>
                <div>
                  <label className="admin-field__label">
                    Email khách hàng (chỉ cần nếu thẻ chưa có chủ)
                  </label>
                  <input
                    className="input"
                    type="email"
                    value={provOwnerEmail}
                    onChange={(e) => setProvOwnerEmail(e.target.value)}
                    placeholder="khach@example.com"
                  />
                </div>
                <div>
                  <label className="admin-field__label">Tiêu đề album</label>
                  <input
                    className="input"
                    value={provTitle}
                    onChange={(e) => setProvTitle(e.target.value)}
                    placeholder="VD: Chuyến đi Đà Nẵng tặng bạn Long"
                  />
                </div>
                <div>
                  <label className="admin-field__label">Mô tả / lời nhắn</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={provDescription}
                    onChange={(e) => setProvDescription(e.target.value)}
                    placeholder="Chúc mừng sinh nhật! Đây là album kỷ niệm..."
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    id="prov-is-public"
                    type="checkbox"
                    checked={provIsPublic}
                    onChange={(e) => setProvIsPublic(e.target.checked)}
                  />
                  <label
                    htmlFor="prov-is-public"
                    className="admin-field__label"
                    style={{ marginBottom: 0 }}
                  >
                    Công khai (ai chạm thẻ cũng xem được, không cần đăng nhập)
                  </label>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleProvisionCard}
                  disabled={provLoading}
                >
                  {provLoading ? "Đang xử lý..." : "Chuẩn bị & lấy link"}
                </button>
              </div>
            </div>

            {provResult && (
              <div className="card admin-nfc-result">
                <p className="admin-nfc-result__title">
                  ✅ {provResult.message}
                </p>
                <p className="admin-nfc-result__label">
                  Chủ sở hữu: {provResult.card?.owner_name || "—"} (
                  {provResult.card?.serial_code})
                </p>
                <p className="admin-nfc-result__label">
                  Album: {provResult.album?.title || "(chưa đặt tiêu đề)"}
                </p>
                <p className="admin-nfc-result__label">
                  Link ghi vào chip NFC:
                </p>
                <p className="admin-nfc-result__serial">
                  {provResult.tap_link}{" "}
                  <button
                    className="btn btn-ghost"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleCopyTapLink(provResult.tap_link)}
                  >
                    Copy
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
