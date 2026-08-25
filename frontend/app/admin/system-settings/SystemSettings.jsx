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
  FileText,
  Info,
} from "lucide-react";
import { systemSettingAPI } from "@/lib/api";
import DinoLoader from "@/components/ui/DinoLoader";
import "./SystemSettings.css";

const VIETQR_BANKS = [
  { id: "MBBANK", name: "MBBank (Ngân Hàng Quân Đội)" },
  { id: "VCB", name: "Vietcombank (Ngoại Thương Việt Nam)" },
  { id: "TCB", name: "Techcombank (Kỹ Thương Việt Nam)" },
  { id: "VPB", name: "VPBank (Việt Nam Thịnh Vượng)" },
  { id: "ACB", name: "ACB (Á Châu)" },
  { id: "CTG", name: "VietinBank (Công Thương Việt Nam)" },
  { id: "BIDV", name: "BIDV (Đầu Tư & Phát Triển)" },
  { id: "TPB", name: "TPBank (Tiên Phong)" },
  { id: "STB", name: "Sacombank (Sài Gòn Thương Tín)" },
  { id: "HDB", name: "HDBank (Phát Triển TP.HCM)" },
  { id: "VIB", name: "VIB (Quốc Tế)" },
  { id: "SHB", name: "SHB (Sài Gòn - Hà Nội)" },
  { id: "MSB", name: "MSB (Hàng Hải)" },
  { id: "OCB", name: "OCB (Phương Đông)" },
  { id: "LPB", name: "LPBank (Lộc Phát Việt Nam)" },
  { id: "SEAB", name: "SeABank (Đông Nam Á)" },
  { id: "ABB", name: "ABBANK (An Bình)" },
  { id: "NAB", name: "Nam A Bank (Nam Á)" },
  { id: "VAB", name: "VietABank (Việt Á)" },
  { id: "BAB", name: "Bac A Bank (Bắc Á)" },
  { id: "CAKE", name: "CAKE by VPBank" },
  { id: "TIMO", name: "Timo by BVBank" },
];

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
    bank_name: "MBBank (Ngân Hàng Quân Đội)",
    bank_account_no: "0813607311",
    bank_account_name: "VINATAP VIETNAM CO LTD",
    ai_caption_prompt:
      "Bạn là trợ lý du lịch Việt Nam. Hãy viết 1 caption ngắn gọn, cảm xúc bằng tiếng Việt (tối đa 2 câu) mô tả bức ảnh du lịch này. Chỉ trả về caption, không thêm gì khác.",
    maintenance_mode: "false",
    allow_registration: "true",
    terms_content:
      "Bằng việc sử dụng VinaTap, bạn đồng ý chỉ kích hoạt thẻ NFC do chính bạn sở hữu hoặc được chuyển nhượng hợp lệ qua tính năng chuyển thẻ trong app.\n\nNội dung album (ảnh, video, ghi chú) do bạn tải lên thuộc quyền sở hữu của bạn. VinaTap không chịu trách nhiệm với nội dung vi phạm pháp luật hoặc quyền sở hữu trí tuệ của bên thứ ba.\n\nAlbum đặt ở chế độ công khai (public) có thể được người khác xem mà không cần đăng nhập — vui lòng cân nhắc trước khi bật chế độ này.",
    privacy_content:
      "VinaTap thu thập: tên, email, số điện thoại, địa chỉ (nếu bạn cung cấp), ảnh đại diện, và nội dung album bạn tạo. Dữ liệu được lưu trữ bảo mật trên máy chủ VinaTap.\n\nMật khẩu được mã hóa một chiều (bcrypt), VinaTap không bao giờ lưu hoặc xem được mật khẩu gốc của bạn.\n\nVinaTap không chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba ngoài mục đích vận hành dịch vụ.",
    app_version: "1.0",
    about_desc: "VinaTap giúp bạn lưu giữ từng khoảnh khắc đáng nhớ qua từng mảnh ghép bản đồ Việt Nam.",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      if (tabParam && ["general", "bank", "ai", "system", "legal", "about"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
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
          <h1 className="admin-sets-title">
            <span className="title-desktop">⚙️ Cài Đặt Hệ Thống</span>
            <span className="title-mobile">⚙️ Cài Đặt</span>
          </h1>
          <p className="admin-sets-subtitle">
            Cấu hình thông tin thương hiệu VinaTap, tài khoản VietQR, trợ lý AI &amp; chế độ vận hành sàn
          </p>
        </div>
        <div className="admin-sets-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={loadSettings}
            disabled={loading}
            title="Tải lại cài đặt"
          >
            <RefreshCw size={15} /> <span className="btn-text-desktop">Tải lại</span>
          </button>
          <button
            type="submit"
            form="system-settings-form"
            className="btn btn-primary"
            disabled={submitting}
          >
            <Save size={15} />{" "}
            <span>{submitting ? "Đang lưu..." : "Lưu Cài Đặt"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Carousel */}
      <div className="admin-sets-tabs-wrap">
        <div className="admin-sets-tabs">
          <button
            type="button"
            className={`admin-sets-tab ${activeTab === "general" ? "is-active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <Building2 size={15} /> <span>Thương Hiệu &amp; Showroom</span>
          </button>
          <button
            type="button"
            className={`admin-sets-tab ${activeTab === "bank" ? "is-active" : ""}`}
            onClick={() => setActiveTab("bank")}
          >
            <CreditCard size={15} /> <span>Tài Khoản VietQR</span>
          </button>
          <button
            type="button"
            className={`admin-sets-tab ${activeTab === "ai" ? "is-active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            <Sparkles size={15} /> <span>Trợ Lý AI Gemini</span>
          </button>
          <button
            type="button"
            className={`admin-sets-tab ${activeTab === "system" ? "is-active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <ShieldAlert size={15} /> <span>Vận Hành &amp; Bảo Trì</span>
          </button>
          <button
            type="button"
            className={`admin-sets-tab ${activeTab === "legal" ? "is-active" : ""}`}
            onClick={() => setActiveTab("legal")}
          >
            <FileText size={15} /> <span>Điều Khoản &amp; Bảo Mật</span>
          </button>
          <button
            type="button"
            className={`admin-sets-tab ${activeTab === "about" ? "is-active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <Info size={15} /> <span>Giới Thiệu &amp; Phiên Bản</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "3rem 1rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <DinoLoader fullScreen={false} size={200} text="Đang tải cấu hình hệ thống..." subtext="Đang lấy thông tin ngân hàng VietQR và thương hiệu" />
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
                <label className="admin-sets-field admin-sets-field--full">
                  <span>Chọn Ngân Hàng Thụ Hưởng (VietQR Chuẩn) *</span>
                  <div className="admin-sets-input-icon">
                    <CreditCard size={16} />
                    <select
                      value={settings.bank_id}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const found = VIETQR_BANKS.find((b) => b.id === selectedId);
                        if (found) {
                          setSettings((prev) => ({
                            ...prev,
                            bank_id: found.id,
                            bank_name: found.name,
                          }));
                        } else {
                          handleInputChange("bank_id", selectedId);
                        }
                      }}
                      className="admin-sets-select"
                    >
                      {VIETQR_BANKS.map((b) => (
                        <option key={b.id} value={b.id}>
                          🏦 {b.id} — {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-sets-bank-preview">
                    <span>Mã VietQR: <strong>{settings.bank_id}</strong></span>
                    <span>•</span>
                    <span>Hiển thị: <strong>{settings.bank_name}</strong></span>
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

          {/* TAB 5: Điều khoản & Bảo mật */}
          {activeTab === "legal" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <FileText size={18} /> Quản Lý Văn Bản Pháp Lý &amp; Bảo Mật
              </h3>
              <p className="admin-sets-card-sub">
                Nội dung hiển thị tại trang Điều khoản sử dụng và Chính sách bảo mật của khách hàng
              </p>

              <div className="admin-sets-field" style={{ marginTop: "1rem" }}>
                <span>Điều Khoản Sử Dụng (Terms of Service) *</span>
                <textarea
                  rows={8}
                  value={settings.terms_content || ""}
                  onChange={(e) => handleInputChange("terms_content", e.target.value)}
                  required
                />
              </div>

              <div className="admin-sets-field" style={{ marginTop: "1rem" }}>
                <span>Chính Sách Bảo Mật (Privacy Policy) *</span>
                <textarea
                  rows={8}
                  value={settings.privacy_content || ""}
                  onChange={(e) => handleInputChange("privacy_content", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 6: Giới thiệu & Phiên bản */}
          {activeTab === "about" && (
            <div className="card admin-sets-card">
              <h3 className="admin-sets-card-title">
                <Info size={18} /> Giới Thiệu Nền Tảng &amp; Phiên Bản
              </h3>
              <p className="admin-sets-card-sub">
                Cập nhật phiên bản phát hành và lời giới thiệu VinaTap hiển thị cho người dùng
              </p>

              <div className="admin-sets-field" style={{ marginTop: "1rem" }}>
                <span>Phiên Bản Ứng Dụng (App Version) *</span>
                <input
                  type="text"
                  value={settings.app_version || ""}
                  onChange={(e) => handleInputChange("app_version", e.target.value)}
                  required
                />
              </div>

              <div className="admin-sets-field" style={{ marginTop: "1rem" }}>
                <span>Mô Tả Giới Thiệu VinaTap *</span>
                <textarea
                  rows={4}
                  value={settings.about_desc || ""}
                  onChange={(e) => handleInputChange("about_desc", e.target.value)}
                  required
                />
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
