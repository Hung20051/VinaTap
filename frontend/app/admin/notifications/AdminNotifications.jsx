"use client";

import { useEffect, useState } from "react";
import {
  Send,
  Bell,
  Users,
  Megaphone,
  Gift,
  Zap,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Tag,
  Calendar,
  AlertTriangle,
  UserCheck,
  Globe,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { notificationAPI, userAPI, voucherAPI } from "@/lib/api";
import "./AdminNotifications.css";

export default function AdminNotifications() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");
  const initialVoucherId = searchParams.get("voucherId");

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [dbVouchers, setDbVouchers] = useState([]);

  // Form State
  const [notifType, setNotifType] = useState(initialType || "system"); // system | promo | feature | custom
  const [recipientType, setRecipientType] = useState("all"); // all | group | users | user
  const [groupTarget, setGroupTarget] = useState("new_7days"); // new_7days | activated_nfc | unactivated_nfc

  // Users multi-select state
  const [userList, setUserList] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // Base Fields
  const [title, setTitle] = useState("[BẢO TRÌ] VinaTap Nâng Cấp Hệ Thống");
  const [content, setContent] = useState(
    "Hệ thống VinaTap sẽ tiến hành nâng cấp hạ tầng nhằm tối ưu tốc độ và độ ổn định.",
  );
  const [link, setLink] = useState("/");

  // Dynamic Fields
  // 1. System Maintenance fields
  const [mStart, setMStart] = useState("01:00 AM");
  const [mEnd, setMEnd] = useState("03:00 AM (2 tiếng)");

  // 2. Voucher / Promo fields
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  const [discountAmount, setDiscountAmount] = useState("Giảm 20%");
  const [expiryDate, setExpiryDate] = useState("");

  // 3. Feature fields
  const [featureName, setFeatureName] = useState("Bản Đồ 3D Tương Tác V2");

  useEffect(() => {
    loadHistory();
    loadUsers();
    loadDbVouchers();
  }, []);

  const loadDbVouchers = async () => {
    try {
      const data = await voucherAPI.getAdminList();
      // 🛑 CHỈ LẤY MÃ CÒN HẠN SỬ DỤNG VÀ DANG ACTIVE
      const activeVouchers = (data || []).filter((v) => !v.isExpired && v.status === "active");
      setDbVouchers(activeVouchers);

      if (activeVouchers.length > 0) {
        let targetVoucher = activeVouchers[0];
        if (initialVoucherId) {
          const found = activeVouchers.find((v) => String(v.id) === String(initialVoucherId));
          if (found) targetVoucher = found;
        }

        setSelectedVoucherId(targetVoucher.id);
        setVoucherCode(targetVoucher.code);
        setDiscountAmount(targetVoucher.discountText);

        if (initialType === "promo" || initialVoucherId) {
          setNotifType("promo");
          setTitle(`[QUÀ TẶNG THÀNH VIÊN] Tặng Bạn Voucher ${targetVoucher.discountText}`);
          setContent(
            `Chúc mừng bạn! VinaTap vừa tặng bạn Voucher ${targetVoucher.code} (${targetVoucher.discountText}). Vào Ví xem ngay!`,
          );
          setLink("/shop");
        }
      }
    } catch (err) {
      console.error("Lỗi nạp danh sách voucher:", err);
    }
  };

  // Đổi mẫu tiêu đề & nội dung tự động khi chọn loại thông báo
  const handleTypeChange = (type) => {
    setNotifType(type);
    if (type === "system") {
      setTitle("[BẢO TRÌ HỆ THỐNG] VinaTap Nâng Cấp Tốc Độ");
      setContent(
        "Hệ thống VinaTap sẽ bảo trì hạ tầng ngầm để nâng cấp tốc độ và tối ưu trải nghiệm.",
      );
      setLink("/");
    } else if (type === "promo") {
      setTitle("[QUÀ TẶNG THÀNH VIÊN] Tặng Bạn Voucher Giảm 20%");
      setContent(
        "Nhập ngay mã Voucher VINATAP2026 khi thanh toán để nhận ngay ưu đãi 20% cho tất cả đơn hàng!",
      );
      setLink("/shop");
    } else if (type === "feature") {
      setTitle("[TÍNH NĂNG MỚI] Trải Nghiệm Giao Diện Mới");
      setContent(
        "VinaTap vừa cập nhật tính năng mới giúp bạn theo dõi lịch trình và kỷ niệm du lịch tuyệt vời hơn.",
      );
      setLink("/customer/dashboard");
    } else {
      setTitle("");
      setContent("");
      setLink("");
    }
  };

  const loadHistory = async () => {
    try {
      const res = await notificationAPI.getAdminSentHistory();
      if (res.history) {
        setHistory(res.history);
      }
    } catch (err) {
      console.error("Lỗi nạp lịch sử thông báo:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll({ limit: 200 });
      if (res.users) {
        setUserList(res.users);
      }
    } catch (err) {
      console.error("Lỗi nạp danh sách user:", err);
    }
  };

  const handleToggleUserSelect = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Vui lòng điền Tiêu đề và Nội dung");
      return;
    }

    if (
      recipientType === "users" &&
      selectedUserIds.length === 0
    ) {
      alert("Vui lòng chọn ít nhất 1 khách hàng từ danh sách");
      return;
    }

    // Xây dựng payload động
    let payload = {};
    if (notifType === "system") {
      payload = { m_start: mStart, m_end: mEnd };
    } else if (notifType === "promo") {
      payload = {
        voucher_code: voucherCode,
        discount_amount: discountAmount,
        expiry_date: expiryDate,
      };
    } else if (notifType === "feature") {
      payload = { feature_name: featureName };
    }

    if (
      !confirm(
        `Bạn có chắc chắn muốn gửi thông báo này tới ${
          recipientType === "all"
            ? "TOÀN BỘ KHÁCH HÀNG (@ALL)"
            : recipientType === "group"
              ? "Nhóm khách hàng phân loại"
              : `${selectedUserIds.length} khách hàng đã chọn`
        }?`,
      )
    )
      return;

    setLoading(true);
    try {
      await notificationAPI.sendAdmin({
        recipient_type: recipientType,
        group_target: groupTarget,
        user_ids: selectedUserIds,
        type: notifType,
        title,
        content,
        payload,
        link,
      });

      // Tự động lưu Voucher vào Ví cá nhân của Khách nhận thông báo
      if (notifType === "promo" && selectedVoucherId) {
        await voucherAPI.sendToUsers({
          voucherId: selectedVoucherId,
          targetType: recipientType,
          userIds: selectedUserIds,
          sendNotification: false,
        });
      }

      alert("🚀 Đã phát thông báo & lưu Voucher vào Ví khách hàng thành công!");
      setSelectedUserIds([]);
      loadHistory();
    } catch (err) {
      alert(err.message || "Lỗi gửi thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa thông báo này khỏi lịch sử?")) return;
    try {
      await notificationAPI.deleteAdmin(id);
      loadHistory();
    } catch (err) {
      alert("Lỗi xóa thông báo");
    }
  };

  const filteredUserList = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="admin-notif-wrap">
      {/* Top Header */}
      <div className="admin-notif-header">
        <div>
          <h1 className="admin-notif-title">📢 Trung Tâm Gửi Thông Báo</h1>
          <p className="admin-notif-subtitle">
            Phát tin tức, thông báo bảo trì &amp; tặng Voucher tới Khách Hàng và
            toàn hệ thống (@ALL)
          </p>
        </div>
        <button className="admin-notif-btn-refresh" onClick={loadHistory}>
          <RefreshCw size={16} /> Tải lại lịch sử
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="admin-notif-main-grid">
        {/* Left Form Column */}
        <div className="card admin-notif-form-card">
          <h3 className="form-card-title">
            <Send size={18} className="text-blue" /> Soạn Thông Báo Mới
          </h3>

          <form onSubmit={handleSend} className="admin-notif-form">
            {/* Step 1: Chọn Loại Thông Báo (Form Động) */}
            <div className="form-section">
              <label className="form-label">1. Chọn Loại Thông Báo</label>
              <div className="type-selector-grid">
                <button
                  type="button"
                  className={`type-btn ${notifType === "system" ? "active" : ""}`}
                  onClick={() => handleTypeChange("system")}
                >
                  <Megaphone size={18} /> 📢 Bảo Trì Hệ Thống
                </button>
                <button
                  type="button"
                  className={`type-btn ${notifType === "promo" ? "active" : ""}`}
                  onClick={() => handleTypeChange("promo")}
                >
                  <Gift size={18} /> 🎁 Tặng Voucher
                </button>
                <button
                  type="button"
                  className={`type-btn ${notifType === "feature" ? "active" : ""}`}
                  onClick={() => handleTypeChange("feature")}
                >
                  <Zap size={18} /> ⚡ Tính Năng Mới
                </button>
                <button
                  type="button"
                  className={`type-btn ${notifType === "custom" ? "active" : ""}`}
                  onClick={() => handleTypeChange("custom")}
                >
                  <Tag size={18} /> ✍️ Tùy Chọn Tự Do
                </button>
              </div>
            </div>

            {/* Step 2: Đối Tượng Nhận (Multi-Targeting) */}
            <div className="form-section">
              <label className="form-label">2. Chọn Đối Tượng Nhận Tin</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="form-select"
              >
                <option value="all">
                  🌐 Gửi Toàn Bộ Khách Hàng (@ALL Users)
                </option>
                <option value="group">
                  👥 Gửi Theo Nhóm Khách Hàng Phân Loại
                </option>
                <option value="users">
                  ☑️ Tích Chọn Nhiều Khách Hàng Cụ Thể (Multi-Select)
                </option>
              </select>

              {/* Giao diện chọn Nhóm */}
              {recipientType === "group" && (
                <div className="sub-target-box">
                  <label className="sub-label">Chọn Nhóm Mục Tiêu:</label>
                  <select
                    value={groupTarget}
                    onChange={(e) => setGroupTarget(e.target.value)}
                    className="form-select"
                  >
                    <option value="new_7days">
                      👶 Khách hàng mới đăng ký (7 ngày qua)
                    </option>
                    <option value="activated_nfc">
                      🏆 Khách hàng ĐÃ kích hoạt thẻ NFC
                    </option>
                    <option value="unactivated_nfc">
                      🔑 Khách hàng CHƯA kích hoạt thẻ NFC nào
                    </option>
                  </select>
                </div>
              )}

              {/* Giao diện Tích Chọn Nhiều Người (Multi-Select User Picker) */}
              {recipientType === "users" && (
                <div className="sub-target-box user-picker-box">
                  <div className="user-picker-search">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                    <span className="selected-count-badge">
                      Đã chọn: {selectedUserIds.length} người
                    </span>
                  </div>

                  <div className="user-picker-list">
                    {filteredUserList.length === 0 ? (
                      <div className="text-muted text-sm p-2 text-center">
                        Không tìm thấy người dùng nào trong hệ thống.
                      </div>
                    ) : (
                      filteredUserList.map((u) => {
                        const isSelected = selectedUserIds.includes(u.id);
                        return (
                          <div
                            key={u.id}
                            className={`user-picker-item ${isSelected ? "selected" : ""}`}
                            onClick={() => handleToggleUserSelect(u.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <div className="user-picker-info">
                              <span className="u-name">{u.name}</span>
                              <span className="u-email">{u.email}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: DYNAMIC FORM FIELDS (Form Động Theo Loại) */}
            <div className="form-section dynamic-fields-box">
              <label className="form-label">3. Nội Dung Chi Tiết</label>

              {/* DYNAMIC FIELD A: MAINTENANCE */}
              {notifType === "system" && (
                <div className="dynamic-row">
                  <div className="form-field">
                    <label>Giờ Bắt Đầu:</label>
                    <input
                      type="text"
                      value={mStart}
                      onChange={(e) => setMStart(e.target.value)}
                      placeholder="VD: 01:00 AM"
                    />
                  </div>
                  <div className="form-field">
                    <label>Giờ Dự Kiến Kết Thúc:</label>
                    <input
                      type="text"
                      value={mEnd}
                      onChange={(e) => setMEnd(e.target.value)}
                      placeholder="VD: 03:00 AM (2 tiếng)"
                    />
                  </div>
                </div>
              )}

              {/* DYNAMIC FIELD B: PROMO VOUCHER */}
              {notifType === "promo" && (
                <div className="dynamic-row">
                  <div className="form-field">
                    <label>Chọn Mã Voucher Tặng Khách (Từ Database):</label>
                    <select
                      value={selectedVoucherId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setSelectedVoucherId(selectedId);
                        const found = dbVouchers.find((v) => String(v.id) === String(selectedId));
                        if (found) {
                          setVoucherCode(found.code);
                          setDiscountAmount(found.discountText);
                          setTitle(`[QUÀ TẶNG THÀNH VIÊN] Tặng Bạn Voucher ${found.discountText}`);
                          setContent(
                            `Chúc mừng bạn! VinaTap vừa tặng bạn Voucher ${found.code} (${found.discountText}). Vào Ví xem ngay!`,
                          );
                        }
                      }}
                    >
                      {dbVouchers.length === 0 ? (
                        <option value="">-- Chưa có mã voucher nào (Vui lòng tạo trước) --</option>
                      ) : (
                        dbVouchers.map((v) => (
                          <option key={v.id} value={v.id}>
                            🎟️ {v.code} — {v.title} ({v.discountText})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Mức Giảm Giá:</label>
                    <input
                      type="text"
                      readOnly
                      value={discountAmount}
                      placeholder="VD: Giảm 20% hoặc Giảm 50k"
                    />
                  </div>
                </div>
              )}

              {/* Base Title & Content */}
              <div className="form-field">
                <label>Tiêu Đề Thông Báo:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề thông báo ngắn gọn..."
                />
              </div>

              <div className="form-field">
                <label>Nội Dung Thông Báo:</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung chi tiết gửi khách..."
                />
              </div>

              <div className="form-field">
                <label>Đường Dẫn Chuyển Trang Khi Bấm Vào (Link):</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="VD: /shop, /customer/dashboard, /province/ha-noi"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-send-notif"
              disabled={loading}
            >

              {loading ? (
                "Đang phát thông báo..."
              ) : (
                <>
                  <Send size={16} /> 🚀 Phát Thông Báo Ngay
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right History Audit Column */}
        <div className="card admin-notif-history-card">
          <h3 className="history-card-title">
            <Clock size={18} className="text-purple" /> Lịch Sử Thông Báo Đã
            Gửi
          </h3>

          <div className="history-list">
            {history.length === 0 ? (
              <div className="history-empty">
                <Bell size={36} className="text-muted" />
                <p>Chưa có thông báo nào được phát đi.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="history-item-card">
                  <div className="history-item-top">
                    <span
                      className={`badge-type badge-type--${item.type || "custom"}`}
                    >
                      {item.type === "system" && "📢 System"}
                      {item.type === "promo" && "🎁 Voucher"}
                      {item.type === "feature" && "⚡ Feature"}
                      {item.type === "custom" && "✍️ Custom"}
                    </span>
                    <span className="history-time">
                      {new Date(item.created_at).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h4 className="history-item-title">{item.title}</h4>
                  <p className="history-item-content">{item.content}</p>

                  <div className="history-item-meta">
                    <span className="target-badge">
                      Target:{" "}
                      {item.recipient_type === "all"
                        ? "🌐 @ALL Users"
                        : item.recipient_type === "group"
                          ? `👥 Group (${item.group_target})`
                          : "👤 Specific User"}
                    </span>
                    <button
                      className="btn-delete-history"
                      onClick={() => handleDelete(item.id)}
                      title="Xóa thông báo khỏi lịch sử"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
