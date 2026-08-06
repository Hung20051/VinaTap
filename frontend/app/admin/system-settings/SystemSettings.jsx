"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Tag,
  Truck,
  Sparkles,
  ShieldAlert,
  Save,
  RefreshCw,
  Sliders,
  CheckCircle,
} from "lucide-react";
import { systemSettingAPI } from "@/lib/api";
import "./SystemSettings.css";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [settings, setSettings] = useState({
    company_name: "VinaTap - Bản Đồ Du Lịch NFC Việt Nam",
    company_hotline: "1900 888 999",
    company_email: "support@vinatap.vn",
    company_address: "Số 108 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
    default_nfc_price: "150000",
    combo_34_price: "4500000",
    shipping_fee: "30000",
    free_shipping_min: "500000",
    ai_caption_prompt:
      "Bạn là trợ lý du lịch Việt Nam. Hãy viết 1 caption ngắn gọn, cảm xúc bằng tiếng Việt (tối đa 2 câu) mô tả bức ảnh du lịch này. Chỉ trả về caption, không thêm gì khác.",
    maintenance_mode: "false",
    allow_registration: "true",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await systemSettingAPI.get();
      if (res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
    } catch (err) {
      showToast("Lỗi tải cấu hình hệ thống", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await systemSettingAPI.update(settings);
      showToast("Đã lưu tất cả cài đặt hệ thống thành công!");
    } catch (err) {
      showToast(err.message || "Lỗi lưu cài đặt hệ thống", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-sets-container">
      {/* Top Header */}
      <div className="admin-sets-header">
        <div>
          <h1 className="admin-dash-title">⚙️ Cài Đặt Hệ Thống</h1>
          <p className="admin-dash-subtitle">
            Cấu hình thông tin thương hiệu VinaTap, bảng giá NFC, trợ lý AI &amp; chế độ vận hành
          </p>
        </div>
        <div className="admin-sets-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={loadSettings}
            disabled={loading}
          >
            <RefreshCw size={16} /> Tải lại
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            <Save size={16} /> {submitting ? "Đang lưu..." : "Lưu Cài Đặt"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-sets-tabs">
        <button
          type="button"
          className={`admin-sets-tab ${activeTab === "general" ? "is-active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <Building2 size={16} /> Thương Hiệu &amp; Liên Hệ
        </button>
        <button
          type="button"
          className={`admin-sets-tab ${activeTab === "pricing" ? "is-active" : ""}`}
          onClick={() => setActiveTab("pricing")}
        >
          <Tag size={16} /> Giá NFC &amp; Vận Chuyển
        </button>
        <button
          type="button"
          className={`admin-sets-tab ${activeTab === "ai" ? "is-active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          <Sparkles size={16} /> Trợ Lý AI Gemini
        </button>
        <button
          type="button"
          className={`admin-sets-tab ${activeTab === "system" ? "is-active" : ""}`}
          onClick={() => setActiveTab("system")}
        >
          <ShieldAlert size={16} /> Trạng Thái &amp; Bảo Trì
        </button>
      </div>

      {loading ? (
        <div className="admin-dash-loading">
          <div className="spinner" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="admin-sets-content">
          {/* TAB 1: Thương hiệu & Liên hệ */}
          {activeTab === "general" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <Building2 size={18} /> Thông Tin Thương Hiệu &amp; Showroom VinaTap
              </h3>
              <p className="admin-sets-card-sub">
                Thông tin này sẽ hiển thị ở chân trang web và chân email gửi cho khách hàng
              </p>

              <div className="admin-sets-grid">
                <label className="admin-sets-field">
                  <span>Tên Công Ty / Thương Hiệu *</span>
                  <div className="admin-sets-input-icon">
                    <Building2 size={16} />
                    <input
                      type="text"
                      value={settings.company_name}
                      onChange={(e) =>
                        handleInputChange("company_name", e.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label className="admin-sets-field">
                  <span>Hotline Hỗ Trợ Khách Hàng *</span>
                  <div className="admin-sets-input-icon">
                    <Phone size={16} />
                    <input
                      type="text"
                      value={settings.company_hotline}
                      onChange={(e) =>
                        handleInputChange("company_hotline", e.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label className="admin-sets-field">
                  <span>Email Liên Hệ / CSKH *</span>
                  <div className="admin-sets-input-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      value={settings.company_email}
                      onChange={(e) =>
                        handleInputChange("company_email", e.target.value)
                      }
                      required
                    />
                  </div>
                </label>

                <label className="admin-sets-field admin-sets-field--full">
                  <span>Địa Chỉ Trụ Sở / Showroom *</span>
                  <div className="admin-sets-input-icon">
                    <MapPin size={16} />
                    <input
                      type="text"
                      value={settings.company_address}
                      onChange={(e) =>
                        handleInputChange("company_address", e.target.value)
                      }
                      required
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Bảng giá & Vận chuyển */}
          {activeTab === "pricing" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <Tag size={18} /> Bảng Giá Thẻ NFC Mặc Định &amp; Chính Sách Vận Chuyển
              </h3>
              <p className="admin-sets-card-sub">
                Đơn giá gợi ý khi tạo đơn bán mới và chính sách vận chuyển trên toàn quốc
              </p>

              <div className="admin-sets-grid">
                <label className="admin-sets-field">
                  <span>Giá Thẻ Mảnh Lẻ NFC Mặc Định (VNĐ)</span>
                  <div className="admin-sets-input-icon">
                    <Tag size={16} />
                    <input
                      type="number"
                      value={settings.default_nfc_price}
                      onChange={(e) =>
                        handleInputChange("default_nfc_price", e.target.value)
                      }
                    />
                  </div>
                  <span className="admin-sets-hint">
                    Giá áp dụng cho 1 thẻ gỗ NFC mảnh lẻ đại diện cho 1 tỉnh thành.
                  </span>
                </label>

                <label className="admin-sets-field">
                  <span>Giá Trọn Bộ Combo 34 Tỉnh Thành (VNĐ)</span>
                  <div className="admin-sets-input-icon">
                    <Tag size={16} />
                    <input
                      type="number"
                      value={settings.combo_34_price}
                      onChange={(e) =>
                        handleInputChange("combo_34_price", e.target.value)
                      }
                    />
                  </div>
                  <span className="admin-sets-hint">
                    Giá trọn bộ 34 mảnh ghép VinaTap đóng hộp Fullbox.
                  </span>
                </label>

                <label className="admin-sets-field">
                  <span>Phí Vận Chuyển Chuẩn Toàn Quốc (VNĐ)</span>
                  <div className="admin-sets-input-icon">
                    <Truck size={16} />
                    <input
                      type="number"
                      value={settings.shipping_fee}
                      onChange={(e) =>
                        handleInputChange("shipping_fee", e.target.value)
                      }
                    />
                  </div>
                </label>

                <label className="admin-sets-field">
                  <span>Hạn Mức Miễn Phí Vận Chuyển (Freeship)</span>
                  <div className="admin-sets-input-icon">
                    <Truck size={16} />
                    <input
                      type="number"
                      value={settings.free_shipping_min}
                      onChange={(e) =>
                        handleInputChange("free_shipping_min", e.target.value)
                      }
                    />
                  </div>
                  <span className="admin-sets-hint">
                    Đơn hàng từ giá trị này sẽ được miễn phí giao hàng.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: AI Gemini Assistant */}
          {activeTab === "ai" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <Sparkles size={18} /> Cấu Hình Trợ Lý AI Gemini Auto-Caption
              </h3>
              <p className="admin-sets-card-sub">
                Định hướng phong cách ngôn từ khi AI phân tích bức ảnh du lịch của khách hàng
              </p>

              <label className="admin-sets-field admin-sets-field--full">
                <span>Câu Lệnh Hướng Dẫn AI (System Prompt)</span>
                <textarea
                  rows={4}
                  value={settings.ai_caption_prompt}
                  onChange={(e) =>
                    handleInputChange("ai_caption_prompt", e.target.value)
                  }
                />
                <span className="admin-sets-hint">
                  AI sẽ dựa trên câu lệnh này để viết lời bình cảm xúc bằng tiếng Việt cho mỗi bức ảnh du lịch được tải lên.
                </span>
              </label>

              <div className="admin-sets-status-box">
                <CheckCircle size={18} color="#16a34a" />
                <span>Mô hình Gemini 1.5 Flash Vision đang hoạt động bình thường trên hệ thống.</span>
              </div>
            </div>
          )}

          {/* TAB 4: Trạng thái & Bảo trì */}
          {activeTab === "system" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <ShieldAlert size={18} /> Vận Hành &amp; Chế Độ Bảo Trì Hệ Thống
              </h3>
              <p className="admin-sets-card-sub">
                Kiểm soát trạng thái truy cập ứng dụng và đăng ký tài khoản mới
              </p>

              <div className="admin-sets-toggle-grid">
                <div className="admin-sets-toggle-card">
                  <div>
                    <h4>Chế Độ Bảo Trì Hệ Thống (Maintenance Mode)</h4>
                    <p>
                      Khi bật, toàn bộ giao diện khách hàng sẽ hiển thị thông báo đang nâng cấp. Chỉ Admin mới vào được.
                    </p>
                  </div>
                  <label className="admin-sets-switch">
                    <input
                      type="checkbox"
                      checked={settings.maintenance_mode === "true"}
                      onChange={(e) =>
                        handleInputChange(
                          "maintenance_mode",
                          e.target.checked ? "true" : "false",
                        )
                      }
                    />
                    <span className="admin-sets-slider" />
                  </label>
                </div>

                <div className="admin-sets-toggle-card">
                  <div>
                    <h4>Cho Phép Đăng Ký Tài Khoản Mới</h4>
                    <p>
                      Bật/Tắt tính năng tạo tài khoản mới từ trang đăng ký / đăng nhập Google.
                    </p>
                  </div>
                  <label className="admin-sets-switch">
                    <input
                      type="checkbox"
                      checked={settings.allow_registration === "true"}
                      onChange={(e) =>
                        handleInputChange(
                          "allow_registration",
                          e.target.checked ? "true" : "false",
                        )
                      }
                    />
                    <span className="admin-sets-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Submit Footer */}
          <div className="admin-sets-footer">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              <Save size={16} /> {submitting ? "Đang lưu..." : "Lưu Thay Đổi Cài Đặt"}
            </button>
          </div>
        </form>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`admin-sets-toast admin-sets-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
