import { useState, useEffect, useRef } from "react";
import { X, Plus, MapPin, Edit3, Trash2 } from "lucide-react";
import {
  LANDMARK_CATEGORIES,
  parseProvinceNames,
  queryNominatim,
} from "./provinceConstants";
import { provinceAPI } from "@/lib/api";

export default function LandmarkManagerModal({ province, onClose, showToast }) {
  const [landmarksList, setLandmarksList] = useState([]);
  const [landmarkLoading, setLandmarkLoading] = useState(true);

  // Landmark form state
  const [showAddLandmarkForm, setShowAddLandmarkForm] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState(null);
  const [landmarkForm, setLandmarkForm] = useState({
    name: "",
    category: "attraction",
    address: "",
    latitude: "",
    longitude: "",
    maps_place_id: "",
    description: "",
  });
  const [landmarkSubmitting, setLandmarkSubmitting] = useState(false);

  // Autocomplete Suggestions State
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);

  const autocompleteRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(e.target)
      ) {
        setShowSuggestionsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (province?.slug) {
      loadLandmarks();
    }
  }, [province]);

  const loadLandmarks = async () => {
    setLandmarkLoading(true);
    try {
      const res = await provinceAPI.getBySlug(province.slug);
      setLandmarksList(res.landmarks || []);
    } catch (err) {
      showToast("Lỗi tải danh sách địa danh", "error");
    } finally {
      setLandmarkLoading(false);
    }
  };

  const handleLandmarkNameChange = (query) => {
    setLandmarkForm((prev) => ({ ...prev, name: query }));

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query || query.trim().length < 2) {
      setPlaceSuggestions([]);
      setShowSuggestionsDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchPlaceSuggestions(query);
    }, 320);
  };

  const fetchPlaceSuggestions = async (query) => {
    const rawProvName = province?.name || "";
    const provParts = parseProvinceNames(rawProvName);
    setIsSearchingPlaces(true);
    try {
      let rawResults = [];

      for (const pName of provParts) {
        const searchQuery = `${query.trim()}, ${pName}, Việt Nam`;
        const data = await queryNominatim(searchQuery);
        if (data && data.length > 0) {
          rawResults = data;
          break;
        }
      }

      if (rawResults.length === 0) {
        const fallbackQuery = `${query.trim()}, Việt Nam`;
        rawResults = await queryNominatim(fallbackQuery);
      }

      if (rawResults.length === 0) {
        rawResults = await queryNominatim(query.trim());
      }

      const items = (rawResults || []).map((item) => {
        const addrParts = [];
        if (item.address) {
          if (item.address.road || item.address.pedestrian)
            addrParts.push(item.address.road || item.address.pedestrian);
          if (
            item.address.village ||
            item.address.suburb ||
            item.address.quarter
          )
            addrParts.push(
              item.address.village ||
                item.address.suburb ||
                item.address.quarter,
            );
          if (
            item.address.city_district ||
            item.address.district ||
            item.address.county
          )
            addrParts.push(
              item.address.city_district ||
                item.address.district ||
                item.address.county,
            );
          if (
            item.address.city ||
            item.address.town ||
            item.address.province ||
            item.address.state
          )
            addrParts.push(
              item.address.city ||
                item.address.town ||
                item.address.province ||
                item.address.state,
            );
        }
        const formattedAddress =
          addrParts.length > 0 ? addrParts.join(", ") : item.display_name;

        return {
          name: item.name || query,
          address: formattedAddress,
          lat: Number(item.lat).toFixed(6),
          lng: Number(item.lon).toFixed(6),
          place_id: String(item.place_id),
          displayName: item.display_name,
        };
      });

      setPlaceSuggestions(items);
      setShowSuggestionsDropdown(items.length > 0);
    } catch (err) {
      console.error("Fetch place suggestions error:", err);
    } finally {
      setIsSearchingPlaces(false);
    }
  };

  const handleSelectSuggestion = (sug) => {
    setLandmarkForm((prev) => ({
      ...prev,
      name: sug.name,
      address: sug.address,
      latitude: sug.lat,
      longitude: sug.lng,
      maps_place_id: sug.place_id,
    }));
    setPlaceSuggestions([]);
    setShowSuggestionsDropdown(false);
    showToast(`📍 Đã tự động điền thông tin địa danh "${sug.name}"!`);
  };

  const handleSaveLandmark = async (e) => {
    e.preventDefault();
    if (!landmarkForm.name.trim()) {
      showToast("Vui lòng nhập Tên địa danh", "error");
      return;
    }
    setLandmarkSubmitting(true);
    try {
      const payload = {
        ...landmarkForm,
        name: landmarkForm.name.trim(),
        latitude: landmarkForm.latitude ? Number(landmarkForm.latitude) : null,
        longitude: landmarkForm.longitude
          ? Number(landmarkForm.longitude)
          : null,
      };

      if (editingLandmark) {
        await provinceAPI.updateLandmark(editingLandmark.id, payload);
        showToast("Đã cập nhật địa danh thành công!");
      } else {
        await provinceAPI.createLandmark(province.id, payload);
        showToast("Đã thêm địa danh mới thành công!");
      }

      setShowAddLandmarkForm(false);
      setEditingLandmark(null);
      setLandmarkForm({
        name: "",
        category: "attraction",
        address: "",
        latitude: "",
        longitude: "",
        maps_place_id: "",
        description: "",
      });
      loadLandmarks();
    } catch (err) {
      showToast(err.message || "Lỗi lưu địa danh", "error");
    } finally {
      setLandmarkSubmitting(false);
    }
  };

  const handleDeleteLandmark = async (landmarkId, landmarkName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa địa danh "${landmarkName}"?`))
      return;
    try {
      await provinceAPI.deleteLandmark(landmarkId);
      showToast(`Đã xóa địa danh "${landmarkName}"!`);
      setLandmarksList((prev) => prev.filter((l) => l.id !== landmarkId));
    } catch (err) {
      showToast(err.message || "Lỗi xóa địa danh", "error");
    }
  };

  return (
    <div className="admin-prov-modal-backdrop" onClick={onClose}>
      <div
        className="card admin-prov-modal admin-prov-modal--lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-prov-modal__header">
          <div>
            <h3>📍 Quản Lý Địa Danh: {province.name}</h3>
            <p className="admin-prov-modal__sub">
              Các điểm du lịch nổi tiếng hiển thị cho khách khi quét NFC
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

        {/* List + Add Form */}
        <div className="admin-prov-landmarks-wrap">
          <div className="admin-prov-landmarks-head">
            <h4>Danh Sách Điểm Đến ({landmarksList.length})</h4>
            {!showAddLandmarkForm && (
              <button
                type="button"
                className="btn btn-add-landmark"
                onClick={() => {
                  setEditingLandmark(null);
                  setPlaceSuggestions([]);
                  setShowSuggestionsDropdown(false);
                  setLandmarkForm({
                    name: "",
                    category: "attraction",
                    address: "",
                    latitude: "",
                    longitude: "",
                    maps_place_id: "",
                    description: "",
                  });
                  setShowAddLandmarkForm(true);
                }}
              >
                <Plus size={15} /> Thêm Điểm Đến
              </button>
            )}
          </div>

          {/* Add / Edit Landmark Form */}
          {showAddLandmarkForm && (
            <form
              onSubmit={handleSaveLandmark}
              className="admin-prov-landmark-form"
            >
              <div className="admin-prov-landmark-form-head">
                <h5>
                  {editingLandmark
                    ? `✏️ Sửa Địa Danh: ${editingLandmark.name}`
                    : "➕ Thêm Điểm Đến Mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close-subform"
                  onClick={() => {
                    setShowAddLandmarkForm(false);
                    setEditingLandmark(null);
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              <div className="admin-prov-form-grid">
                <label
                  className="admin-prov-field"
                  style={{ position: "relative" }}
                  ref={autocompleteRef}
                >
                  <span>Tên Địa Danh * (Gợi ý tự động 📍)</span>
                  <div className="admin-prov-input-with-spinner">
                    <input
                      type="text"
                      value={landmarkForm.name}
                      onChange={(e) => handleLandmarkNameChange(e.target.value)}
                      onFocus={() => {
                        if (placeSuggestions.length > 0)
                          setShowSuggestionsDropdown(true);
                      }}
                      placeholder="VD: Chùa Linh Ứng, Cầu Rồng..."
                      required
                      autoComplete="off"
                    />
                    {isSearchingPlaces && (
                      <span className="admin-prov-spinner-sm" />
                    )}
                  </div>

                  {/* Dropdown Suggestions */}
                  {showSuggestionsDropdown && placeSuggestions.length > 0 && (
                    <div className="admin-prov-autocomplete-dropdown">
                      <div className="admin-prov-autocomplete-head">
                        📍 Gợi ý địa danh tại {province?.name}:
                      </div>
                      {placeSuggestions.map((sug, idx) => (
                        <div
                          key={idx}
                          className="admin-prov-autocomplete-item"
                          onClick={() => handleSelectSuggestion(sug)}
                        >
                          <MapPin
                            size={16}
                            className="admin-prov-autocomplete-icon"
                          />
                          <div className="admin-prov-autocomplete-info">
                            <div className="admin-prov-autocomplete-title">
                              {sug.name}
                            </div>
                            <div className="admin-prov-autocomplete-addr">
                              {sug.address}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </label>

                <label className="admin-prov-field">
                  <span>Phân Loại *</span>
                  <select
                    value={landmarkForm.category}
                    onChange={(e) =>
                      setLandmarkForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    {Object.entries(LANDMARK_CATEGORIES).map(
                      ([catKey, catVal]) => (
                        <option key={catKey} value={catKey}>
                          {catVal.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>

              <label className="admin-prov-field">
                <span>Địa Chỉ Chi Tiết</span>
                <input
                  type="text"
                  value={landmarkForm.address}
                  onChange={(e) =>
                    setLandmarkForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="VD: Bãi Bụt, Hoàng Sa, Thọ Quang, Sơn Trà, Đà Nẵng"
                />
              </label>

              <div className="admin-prov-form-grid">
                <label className="admin-prov-field">
                  <span>Tọa Độ Lat (Vĩ độ)</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={landmarkForm.latitude}
                    onChange={(e) =>
                      setLandmarkForm((prev) => ({
                        ...prev,
                        latitude: e.target.value,
                      }))
                    }
                    placeholder="VD: 16.10028"
                  />
                </label>
                <label className="admin-prov-field">
                  <span>Tọa Độ Lng (Kinh độ)</span>
                  <input
                    type="number"
                    step="0.000001"
                    value={landmarkForm.longitude}
                    onChange={(e) =>
                      setLandmarkForm((prev) => ({
                        ...prev,
                        longitude: e.target.value,
                      }))
                    }
                    placeholder="VD: 108.27778"
                  />
                </label>
              </div>

              <div className="admin-prov-modal__footer">
                <button
                  type="button"
                  className="btn btn-ghost-prov"
                  onClick={() => {
                    setShowAddLandmarkForm(false);
                    setEditingLandmark(null);
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={landmarkSubmitting}
                  className="btn btn-submit-prov"
                >
                  {landmarkSubmitting
                    ? "Đang lưu..."
                    : editingLandmark
                      ? "✓ Cập Nhật"
                      : "✓ Thêm Ngay"}
                </button>
              </div>
            </form>
          )}

          {/* Landmark Items List */}
          {landmarkLoading ? (
            <div className="admin-dash-loading">
              <div className="spinner" />
            </div>
          ) : landmarksList.length === 0 ? (
            <div className="admin-prov-empty-landmarks">
              <div className="empty-landmark-icon">📍</div>
              <h5>Chưa có điểm du lịch nào</h5>
              <p>
                Thêm các danh lam thắng cảnh, di tích lịch sử hoặc ẩm thực đặc
                sắc để khách khám phá khi quét chip NFC.
              </p>
              {!showAddLandmarkForm && (
                <button
                  type="button"
                  className="btn btn-submit-prov"
                  onClick={() => {
                    setEditingLandmark(null);
                    setShowAddLandmarkForm(true);
                  }}
                >
                  <Plus size={14} /> Thêm Điểm Đầu Tiên
                </button>
              )}
            </div>
          ) : (
            <div className="admin-prov-landmark-list">
              {landmarksList.map((lm) => {
                const catInfo =
                  LANDMARK_CATEGORIES[lm.category] || LANDMARK_CATEGORIES.other;
                const IconComp = catInfo.icon;
                return (
                  <div key={lm.id} className="admin-prov-landmark-item">
                    <div
                      className="admin-prov-landmark-icon"
                      style={{
                        color: catInfo.color,
                        background: `${catInfo.color}15`,
                      }}
                    >
                      <IconComp size={18} />
                    </div>
                    <div className="admin-prov-landmark-info">
                      <div className="admin-prov-landmark-name">
                        <span>{lm.name}</span>
                        <span
                          className="admin-prov-cat-badge"
                          style={{
                            color: catInfo.color,
                            borderColor: catInfo.color,
                          }}
                        >
                          {catInfo.label}
                        </span>
                      </div>
                      {lm.address && (
                        <p className="admin-prov-landmark-addr">
                          📍 {lm.address}
                        </p>
                      )}
                    </div>
                    <div className="admin-prov-landmark-actions">
                      <button
                        type="button"
                        className="admin-prov-icon-btn"
                        onClick={() => {
                          setEditingLandmark(lm);
                          setLandmarkForm({
                            name: lm.name || "",
                            category: lm.category || "attraction",
                            address: lm.address || "",
                            latitude: lm.latitude || "",
                            longitude: lm.longitude || "",
                            maps_place_id: lm.maps_place_id || "",
                            description: lm.description || "",
                          });
                          setShowAddLandmarkForm(true);
                        }}
                        title="Sửa địa danh"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        className="admin-prov-icon-btn admin-prov-icon-btn--danger"
                        onClick={() => handleDeleteLandmark(lm.id, lm.name)}
                        title="Xóa địa danh"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
