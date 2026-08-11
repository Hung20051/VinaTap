"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ShieldAlert,
  Save,
  RefreshCw,
  Package,
  ExternalLink,
  CreditCard,
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
    bank_id: "MBBANK",
    bank_name: "MBBank (NH Quân Đội)",
    bank_account_no: "0813607311",
    bank_account_name: "VINATAP VIETNAM CO LTD",
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
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Top Header */}
      <div className="admin-sets-header">
        <div>
          <h1 className="admin-dash-title">⚙️ Cài Đặt Hệ Thống</h1>
          <p className="admin-dash-subtitle">
            Cấu hình thông tin thương hiệu VinaTap, tài khoản VietQR, trợ lý AI &amp; chế độ vận hành sàn
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
            type="submit"
            form="system-settings-form"
            className="btn btn-primary"
            disabled={submitting}
          >
            <Save size={16} /> {submitting ? "Đang lưu..." : "Lưu Cài Đặt"}
          </button>
        </div>
      </div>

      {/* Banner thông báo chuyển trang Quản Lý Sản Phẩm */}
      <div style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", border: "1px solid #fed7aa", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Package size={24} className="text-orange" />
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#9a3412" }}>
              Cài đặt Giá Sản Phẩm &amp; Phí Ship đã được tách biệt hẳn!
            </h4>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#c2410c" }}>
              Để sửa giá bán thực tế, giá gốc gạch đi hoặc phí vận chuyển toàn quốc, vui lòng sử dụng trang Quản Lý Sản Phẩm.
            </p>
          </div>
        </div>
        <Link
          href="/admin/products"
          className="btn btn-primary"
          style={{ background: "#ea580c", borderColor: "#ea580c", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}
        >
          Đến Trang Sản Phẩm <ExternalLink size={14} />
        </Link>
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
          className={`admin-sets-tab ${activeTab === "bank" ? "is-active" : ""}`}
          onClick={() => setActiveTab("bank")}
        >
          <CreditCard size={16} /> Tài Khoản Ngân Hàng (VietQR)
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
        <form id="system-settings-form" onSubmit={handleSubmit} className="admin-sets-content">
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
                  <span>Hotline Hỗ Trợ *</span>
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
                  <span>Email CSKH *</span>
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

                <label className="admin-sets-field">
                  <span>Địa Chỉ Showroom / Trụ Sở *</span>
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

          {/* TAB: Ngân hàng & VietQR */}
          {activeTab === "bank" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <CreditCard size={18} /> Cấu Hình Tài Khoản Nhận Thanh Toán VietQR
              </h3>
              <p className="admin-sets-card-sub">
                Mã QR và thông tin tài khoản này sẽ tự động xuất hiện trên màn hình thanh toán của khách hàng
              </p>

              <div className="admin-sets-grid" style={{ marginTop: "1rem" }}>
                <label className="admin-sets-field">
                  <span>Mã Ngân Hàng (VietQR Bank ID) *</span>
                  <div className="admin-sets-input-icon">
                    <CreditCard size={16} />
                    <input
                      type="text"
                      value={settings.bank_id}
                      onChange={(e) =>
                        handleInputChange("bank_id", e.target.value.toUpperCase())
                      }
                      placeholder="VD: MBBANK, VCB, TCB, VPB, ACB, CTG..."
                      required
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
                    Mã chuẩn VietQR (MBBANK, VCB, TCB, VPB, ACB, CTG, BIDV, STB, TPB...)
                  </span>
                </label>

                <label className="admin-sets-field">
                  <span>Tên Ngân Hàng Hiển Thị *</span>
                  <div className="admin-sets-input-icon">
                    <CreditCard size={16} />
                    <input
                      type="text"
                      value={settings.bank_name}
                      onChange={(e) =>
                        handleInputChange("bank_name", e.target.value)
                      }
                      placeholder="VD: MBBank (NH Quân Đội)"
                      required
                    />
                  </div>
                </label>

                <label className="admin-sets-field">
                  <span>Số Tài Khoản Nhận Tiền *</span>
                  <div className="admin-sets-input-icon">
                    <CreditCard size={16} />
                    <input
                      type="text"
                      value={settings.bank_account_no}
                      onChange={(e) =>
                        handleInputChange("bank_account_no", e.target.value)
                      }
                      placeholder="VD: 0813607311"
                      required
                    />
                  </div>
                </label>

                <label className="admin-sets-field">
                  <span>Tên Chủ Tài Khoản (In hoa không dấu) *</span>
                  <div className="admin-sets-input-icon">
                    <Building2 size={16} />
                    <input
                      type="text"
                      value={settings.bank_account_name}
                      onChange={(e) =>
                        handleInputChange("bank_account_name", e.target.value.toUpperCase())
                      }
                      placeholder="VD: VINATAP VIETNAM CO LTD"
                      required
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: AI Gemini */}
          {activeTab === "ai" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <Sparkles size={18} /> Cấu Hình Trợ Lý AI Gemini
              </h3>
              <p className="admin-sets-card-sub">
                Prompt mẫu điều khiển AI tự động gợi ý caption cảm xúc khi khách tải ảnh du lịch
              </p>

              <div className="admin-sets-field" style={{ marginTop: "1rem" }}>
                <span>System Prompt gợi ý Caption du lịch *</span>
                <textarea
                  rows={5}
                  value={settings.ai_caption_prompt}
                  onChange={(e) =>
                    handleInputChange("ai_caption_prompt", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 3: Trạng thái & Bảo trì */}
          {activeTab === "system" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <ShieldAlert size={18} /> Chế Độ Vận Hành &amp; Bảo Trì
              </h3>
              <p className="admin-sets-card-sub">
                Tạm dừng dịch vụ hoặc bật/tắt đăng ký tài khoản khách hàng mới
              </p>

              <div className="admin-sets-switches" style={{ marginTop: "1rem" }}>
                <label className="admin-sets-switch-row">
                  <div>
                    <strong>Chế độ Bảo Trì Hệ Thống</strong>
                    <p>Khi bật, tất cả khách hàng sẽ thấy trang thông báo bảo trì</p>
                  </div>
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
                </label>

                <label className="admin-sets-switch-row">
                  <div>
                    <strong>Cho Phép Đăng Ký Tài Khoản Mới</strong>
                    <p>Mở công khai form đăng ký người dùng mới trên sàn</p>
                  </div>
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
                </label>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
