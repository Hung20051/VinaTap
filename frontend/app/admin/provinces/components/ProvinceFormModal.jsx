import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Globe,
  Image as ImageIcon,
  Video,
  MapPin,
  Sparkles,
  Check,
  Trash2,
} from "lucide-react";
import {
  REGIONS,
  generateSlug,
  detectRegion,
  queryNominatim,
} from "./provinceConstants";
import { provinceAPI } from "@/lib/api";

export default function ProvinceFormModal({
  editingProvince,
  onClose,
  onSaved,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState("info"); // "info" | "media" | "geo"

  const [form, setForm] = useState({
    name: editingProvince?.name || "",
    slug: editingProvince?.slug || "",
    region: editingProvince?.region || "north",
    description: editingProvince?.description || "",
    thumbnail_url: editingProvince?.thumbnail_url || "",
    youtube_url: editingProvince?.youtube_url || "",
    population: editingProvince?.population || "",
    area_km2: editingProvince?.area_km2 || "",
    specialties: editingProvince?.specialties || "",
    lat: editingProvince?.lat || "",
    lng: editingProvince?.lng || "",
    status: editingProvince?.status || "active",
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  // Dual mode upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [imageMode, setImageMode] = useState("file"); // "file" | "url"
  const [videoMode, setVideoMode] = useState("url"); // "url" | "file"

  // Autocomplete Suggestions State
  const [provinceSuggestions, setProvinceSuggestions] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const provinceAutocompleteRef = useRef(null);
  const provinceTimeoutRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        provinceAutocompleteRef.current &&
        !provinceAutocompleteRef.current.contains(e.target)
      ) {
        setShowSuggestionsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = async (file, targetField) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (targetField === "thumbnail_url") setUploadingImage(true);
    if (targetField === "youtube_url") setUploadingVideo(true);

    try {
      const res = await provinceAPI.uploadFile(formData);
      showToast("Tải file lên Cloudinary thành công!");
      setForm((prev) => ({
        ...prev,
        [targetField]: res.url,
      }));
    } catch (err) {
      showToast(err.message || "Lỗi tải file lên Cloudinary", "error");
    } finally {
      setUploadingImage(false);
      setUploadingVideo(false);
    }
  };

  const handleProvinceNameChange = (query) => {
    const val = query;
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: editingProvince ? prev.slug : generateSlug(val),
    }));

    if (provinceTimeoutRef.current) {
      clearTimeout(provinceTimeoutRef.current);
    }

    if (!query || query.trim().length < 2) {
      setProvinceSuggestions([]);
      setShowSuggestionsDropdown(false);
      return;
    }

    provinceTimeoutRef.current = setTimeout(async () => {
      setIsSearchingPlaces(true);
      try {
        let data = await queryNominatim(query.trim());
        if (!data || data.length === 0) {
          data = await queryNominatim(`${query.trim()}, Vietnam`);
        }

        const items = (Array.isArray(data) ? data : []).map((item) => {
          const region = detectRegion(item.display_name, item.name, item.lat);
          return {
            name: item.name || query,
            displayName: item.display_name || item.name,
            lat: Number(item.lat || 0).toFixed(6),
            lng: Number(item.lon || item.lng || 0).toFixed(6),
            region: region,
          };
        });

        setProvinceSuggestions(items);
        setShowSuggestionsDropdown(items.length > 0);
      } catch (err) {
        console.error("Fetch province suggestions error:", err);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 400);
  };

  const handleSelectProvinceSuggestion = (sug) => {
    setForm((prev) => ({
      ...prev,
      name: sug.name,
      slug: editingProvince ? prev.slug : generateSlug(sug.name),
      region: sug.region || prev.region,
      lat: sug.lat || prev.lat,
      lng: sug.lng || prev.lng,
    }));
    setProvinceSuggestions([]);
    setShowSuggestionsDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.region) {
      showToast("Vui lòng nhập Tên tỉnh và chọn Vùng miền", "error");
      return;
    }
    const finalSlug = form.slug.trim() || generateSlug(form.name);

    setFormSubmitting(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: finalSlug,
        population: form.population ? Number(form.population) : null,
        area_km2: form.area_km2 ? Number(form.area_km2) : null,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      };

      if (editingProvince) {
        await provinceAPI.update(editingProvince.id, payload);
        showToast(`Đã cập nhật tỉnh ${payload.name} thành công!`);
      } else {
        await provinceAPI.create(payload);
        showToast(`Đã thêm tỉnh mới ${payload.name} thành công!`);
      }
      onSaved();
    } catch (err) {
      showToast(err.message || "Lỗi lưu tỉnh thành", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="admin-prov-modal-backdrop" onClick={onClose}>
      <div
        className="card admin-prov-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-prov-modal__header">
          <div>
            <h3>
              {editingProvince
                ? `✏️ Chỉnh Sửa: ${editingProvince.name}`
                : "➕ Thêm Tỉnh Thành Mới"}
            </h3>
            <p className="admin-prov-modal__sub">
              Cập nhật thông tin bản đồ số, ảnh bìa mảnh ghép và đặc sản
            </p>
          </div>
          <button
            type="button"
            className="admin-prov-modal__close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Studio Segmented Navigation Tabs */}
        <div className="admin-prov-nav-tabs">
          <button
            type="button"
            className={`admin-prov-nav-tab ${activeTab === "info" ? "is-active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <Sparkles size={14} /> Thông Tin Chính
          </button>
          <button
            type="button"
            className={`admin-prov-nav-tab ${activeTab === "media" ? "is-active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            <ImageIcon size={14} /> Ảnh & Video
          </button>
          <button
            type="button"
            className={`admin-prov-nav-tab ${activeTab === "geo" ? "is-active" : ""}`}
            onClick={() => setActiveTab("geo")}
          >
            <MapPin size={14} /> Thống Kê & GPS
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-prov-modal-form">
          {/* TAB 1: THÔNG TIN CHÍNH */}
          {activeTab === "info" && (
            <div className="admin-prov-tab-pane">
              <div className="admin-prov-form-grid">
                <label
                  className="admin-prov-field"
                  style={{ position: "relative" }}
                  ref={provinceAutocompleteRef}
                >
                  <span>Tên Tỉnh / Thành Phố *</span>
                  <div className="admin-prov-input-with-spinner">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleProvinceNameChange(e.target.value)}
                      onFocus={() => {
                        if (provinceSuggestions.length > 0)
                          setShowSuggestionsDropdown(true);
                      }}
                      placeholder="VD: Hà Nội, Đà Nẵng..."
                      required
                      autoComplete="off"
                    />
                    {isSearchingPlaces && (
                      <span className="admin-prov-spinner-sm" />
                    )}
                  </div>

                  {/* Dropdown Suggestions */}
                  {showSuggestionsDropdown &&
                    provinceSuggestions.length > 0 && (
                      <div className="admin-prov-autocomplete-dropdown">
                        <div className="admin-prov-autocomplete-head">
                          📍 Gợi ý Tỉnh / Thành Phố:
                        </div>
                        {provinceSuggestions.map((sug, idx) => (
                          <div
                            key={idx}
                            className="admin-prov-autocomplete-item"
                            onClick={() => handleSelectProvinceSuggestion(sug)}
                          >
                            <Globe
                              size={16}
                              className="admin-prov-autocomplete-icon"
                            />
                            <div className="admin-prov-autocomplete-info">
                              <div className="admin-prov-autocomplete-title">
                                {sug.name} (
                                {REGIONS[sug.region]?.label || sug.region})
                              </div>
                              <div className="admin-prov-autocomplete-addr">
                                {sug.displayName}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </label>

                <label className="admin-prov-field">
                  <span>Mã Slug (URL) *</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="VD: ha-noi"
                    required
                  />
                </label>
              </div>

              <div className="admin-prov-form-grid">
                <label className="admin-prov-field">
                  <span>Vùng Miền *</span>
                  <select
                    value={form.region}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="north">Miền Bắc</option>
                    <option value="central">Miền Trung</option>
                    <option value="south">Miền Nam</option>
                    <option value="island">Hải Đảo</option>
                  </select>
                </label>

                <label className="admin-prov-field">
                  <span>Trạng Thái Mở Bán *</span>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="active">🟢 Đang mở bán (Active)</option>
                    <option value="inactive">🔴 Tạm ẩn (Hết hàng)</option>
                  </select>
                </label>
              </div>

              <label className="admin-prov-field">
                <span>Món Ăn / Đặc Sản Nổi Tiếng</span>
                <input
                  type="text"
                  value={form.specialties}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      specialties: e.target.value,
                    }))
                  }
                  placeholder="VD: Phở Hà Nội, Bún Chả, Cốm Làng Vòng..."
                />
              </label>

              <label className="admin-prov-field">
                <span>Mô Tả Ngắn Giới Thiệu</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Giới thiệu đôi nét về lịch sử, văn hóa, danh lam thắng cảnh..."
                />
              </label>
            </div>
          )}

          {/* TAB 2: ẢNH BÌA & VIDEO */}
          {activeTab === "media" && (
            <div className="admin-prov-tab-pane">
              {/* Box Ảnh Bìa */}
              <div className="admin-prov-media-card">
                <div className="admin-prov-mode-header">
                  <span className="admin-prov-media-title">
                    🖼️ Ảnh Bìa Mảnh Ghép / Thumbnail:
                  </span>
                  <div className="admin-prov-mode-tabs">
                    <button
                      type="button"
                      className={`admin-prov-tab-btn ${imageMode === "file" ? "is-active" : ""}`}
                      onClick={() => setImageMode("file")}
                    >
                      Tải file
                    </button>
                    <button
                      type="button"
                      className={`admin-prov-tab-btn ${imageMode === "url" ? "is-active" : ""}`}
                      onClick={() => setImageMode("url")}
                    >
                      Dán Link
                    </button>
                  </div>
                </div>

                {imageMode === "file" ? (
                  <div className="admin-prov-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      id="province-img-file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(file, "thumbnail_url");
                      }}
                    />
                    <label
                      htmlFor="province-img-file"
                      className="admin-prov-dropzone"
                    >
                      {uploadingImage ? (
                        <div className="admin-prov-uploading">
                          <div
                            className="spinner"
                            style={{ width: 16, height: 16 }}
                          />
                          <span>Đang tải ảnh lên Cloudinary...</span>
                        </div>
                      ) : (
                        <div className="admin-prov-dropzone-text">
                          <Upload size={18} />
                          <span>Bấm để chọn file ảnh (JPG, PNG, WebP)</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={form.thumbnail_url}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        thumbnail_url: e.target.value,
                      }))
                    }
                    placeholder="https://res.cloudinary.com/..."
                    className="admin-prov-url-input"
                  />
                )}

                {/* Preview Thumbnail */}
                {form.thumbnail_url && (
                  <div className="admin-prov-preview-thumb-card">
                    <img
                      src={form.thumbnail_url}
                      alt="Thumbnail Preview"
                      className="admin-prov-preview-img-display"
                    />
                    <div className="admin-prov-preview-meta">
                      <span className="admin-prov-preview-ok">
                        ✓ Đã có ảnh bìa
                      </span>
                      <button
                        type="button"
                        className="admin-prov-thumb-remove-btn"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, thumbnail_url: "" }))
                        }
                        title="Xóa ảnh"
                      >
                        <Trash2 size={13} /> Xóa ảnh
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Box Video Giới Thiệu */}
              <div className="admin-prov-media-card">
                <div className="admin-prov-mode-header">
                  <span className="admin-prov-media-title">
                    🎬 Video Giới Thiệu (YouTube):
                  </span>
                  <div className="admin-prov-mode-tabs">
                    <button
                      type="button"
                      className={`admin-prov-tab-btn ${videoMode === "url" ? "is-active" : ""}`}
                      onClick={() => setVideoMode("url")}
                    >
                      Link YouTube
                    </button>
                    <button
                      type="button"
                      className={`admin-prov-tab-btn ${videoMode === "file" ? "is-active" : ""}`}
                      onClick={() => setVideoMode("file")}
                    >
                      Tải MP4
                    </button>
                  </div>
                </div>

                {videoMode === "file" ? (
                  <div className="admin-prov-upload-box">
                    <input
                      type="file"
                      accept="video/*"
                      id="province-video-file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(file, "youtube_url");
                      }}
                    />
                    <label
                      htmlFor="province-video-file"
                      className="admin-prov-dropzone"
                    >
                      {uploadingVideo ? (
                        <div className="admin-prov-uploading">
                          <div
                            className="spinner"
                            style={{ width: 16, height: 16 }}
                          />
                          <span>Đang tải video lên Cloudinary...</span>
                        </div>
                      ) : (
                        <div className="admin-prov-dropzone-text">
                          <Upload size={18} />
                          <span>Bấm để chọn file video (MP4, MOV)</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={form.youtube_url}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        youtube_url: e.target.value,
                      }))
                    }
                    placeholder="VD: https://www.youtube.com/watch?v=..."
                    className="admin-prov-url-input"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 3: THỐNG KÊ & GPS */}
          {activeTab === "geo" && (
            <div className="admin-prov-tab-pane">
              <div className="admin-prov-form-grid">
                <label className="admin-prov-field">
                  <span>Dân Số (Người)</span>
                  <input
                    type="number"
                    value={form.population}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        population: e.target.value,
                      }))
                    }
                    placeholder="VD: 8500000"
                  />
                </label>

                <label className="admin-prov-field">
                  <span>Diện Tích (km²)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={form.area_km2}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        area_km2: e.target.value,
                      }))
                    }
                    placeholder="VD: 3358.6"
                  />
                </label>
              </div>

              <div className="admin-prov-form-grid">
                <label className="admin-prov-field">
                  <span>Vĩ Độ GPS (Latitude)</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.lat}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lat: e.target.value,
                      }))
                    }
                    placeholder="VD: 21.028511"
                  />
                </label>

                <label className="admin-prov-field">
                  <span>Kinh Độ GPS (Longitude)</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={form.lng}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lng: e.target.value,
                      }))
                    }
                    placeholder="VD: 105.854444"
                  />
                </label>
              </div>
              <p className="admin-prov-geo-hint">
                💡{" "}
                <em>
                  Mẹo: Tọa độ GPS giúp hệ thống hiển thị bản đồ số và chỉ đường
                  chính xác khi khách hàng quét thẻ NFC.
                </em>
              </p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="admin-prov-modal__footer">
            <button
              type="button"
              className="btn btn-ghost-prov"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="btn btn-submit-prov"
            >
              {formSubmitting
                ? "Đang lưu..."
                : editingProvince
                  ? "✓ Lưu Thay Đổi"
                  : "✓ Tạo Tỉnh Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
