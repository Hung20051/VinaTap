"use client";

import { useEffect, useState } from "react";
import { provinceAPI } from "@/lib/api";
import ProvinceHeader from "./components/ProvinceHeader";
import ProvinceKpiCards from "./components/ProvinceKpiCards";
import ProvinceFilterBar from "./components/ProvinceFilterBar";
import ProvinceCard from "./components/ProvinceCard";
import ProvinceFormModal from "./components/ProvinceFormModal";
import LandmarkManagerModal from "./components/LandmarkManagerModal";
import ProvincePreviewModal from "./components/ProvincePreviewModal";
import DinoLoader from "@/components/ui/DinoLoader";
import "./AdminProvinces.css";

export default function AdminProvinces() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toast, setToast] = useState(null);

  // Modals & Drawers State
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [editingProvince, setEditingProvince] = useState(null);
  const [managingLandmarksProvince, setManagingLandmarksProvince] = useState(null);
  const [previewProvince, setPreviewProvince] = useState(null);

  useEffect(() => {
    loadProvinces(true);
  }, []);

  const loadProvinces = async (showSpinner = false) => {
    if (showSpinner || provinces.length === 0) {
      setLoading(true);
    }
    try {
      const res = await provinceAPI.getAll(true);
      setProvinces(res.provinces || []);
    } catch (err) {
      showToast(err.message || "Lỗi tải danh sách tỉnh thành", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = async (prov, e) => {
    e.stopPropagation();
    e.preventDefault();
    const newStatus = prov.status === "active" ? "inactive" : "active";

    // Optimistic UI update
    setProvinces((prev) =>
      prev.map((item) =>
        item.id === prov.id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      await provinceAPI.update(prov.id, { status: newStatus });
      showToast(
        `Đã ${newStatus === "active" ? "mở bán lại" : "tạm ẩn (hết hàng)"} ${prov.name}!`,
      );
    } catch (err) {
      // Revert state on error
      setProvinces((prev) =>
        prev.map((item) =>
          item.id === prov.id ? { ...item, status: prov.status } : item,
        ),
      );
      showToast(err.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const filteredProvinces = provinces.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.specialties?.toLowerCase().includes(q);

    const matchesRegion =
      selectedRegion === "all" || p.region === selectedRegion;
    const matchesStatus =
      selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="admin-prov-container">
      {/* Sticky Header & Navigation */}
      <div className="admin-prov-sticky-header">
        <ProvinceHeader
          onRefresh={() => loadProvinces(false)}
          onCreateClick={() => {
            setEditingProvince(null);
            setShowProvinceModal(true);
          }}
        />

        <ProvinceKpiCards provinces={provinces} />

        <ProvinceFilterBar
          search={search}
          setSearch={setSearch}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>

      {/* Main Province Grid Cards */}
      {loading ? (
        <div style={{ padding: "3rem 1rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang tải danh sách 63 tỉnh thành..." subtext="Đang lấy dữ liệu danh lam và toạ độ bản đồ" />
        </div>
      ) : filteredProvinces.length === 0 ? (
        <div className="card admin-prov-empty">
          Không tìm thấy tỉnh thành nào phù hợp với bộ lọc
        </div>
      ) : (
        <div className="admin-prov-grid">
          {filteredProvinces.map((prov) => (
            <ProvinceCard
              key={prov.id}
              prov={prov}
              onToggleStatus={handleToggleStatus}
              onOpenLandmarks={setManagingLandmarksProvince}
              onOpenEdit={(p) => {
                setEditingProvince(p);
                setShowProvinceModal(true);
              }}
              onPreview={setPreviewProvince}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Create / Edit Province Form */}
      {showProvinceModal && (
        <ProvinceFormModal
          editingProvince={editingProvince}
          onClose={() => setShowProvinceModal(false)}
          onSaved={() => {
            setShowProvinceModal(false);
            loadProvinces(false);
          }}
          showToast={showToast}
        />
      )}

      {/* Modal 2: Landmark Sights Manager */}
      {managingLandmarksProvince && (
        <LandmarkManagerModal
          province={managingLandmarksProvince}
          onClose={() => setManagingLandmarksProvince(null)}
          showToast={showToast}
        />
      )}

      {/* Modal 3: Quick Preview Drawer */}
      {previewProvince && (
        <ProvincePreviewModal
          province={previewProvince}
          onClose={() => setPreviewProvince(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`admin-prov-toast admin-prov-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
