"use client";

import { useEffect, useState } from "react";
import {
  X,
  Phone,
  MapPin,
  Mail,
  Calendar,
  CreditCard,
  FolderArchive,
} from "lucide-react";
import { userAPI } from "@/lib/api";

export default function UserDetailModal({ userId, onClose, showToast }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await userAPI.getDetail(userId);
        if (isMounted) setDetail(data);
      } catch (err) {
        if (isMounted) {
          showToast(err.message || "Lỗi tải thông tin chi tiết", "error");
          onClose();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <div className="admin-users-modal-backdrop" onClick={onClose}>
      <div
        className="card admin-users-modal admin-users-modal--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-users-modal__header">
          <h3>Chi tiết người dùng</h3>
          <button
            type="button"
            className="admin-users-modal__close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="admin-dash-loading" style={{ padding: "3rem 0" }}>
            <div className="spinner" />
          </div>
        ) : !detail ? (
          <div className="admin-users-empty">Không tìm thấy dữ liệu</div>
        ) : (
          <div className="admin-users-detail-content">
            {/* Profile Info */}
            <div className="admin-users-detail-profile">
              <div className="admin-users-detail-avatar">
                {detail.avatar_url ? (
                  <img src={detail.avatar_url} alt="" />
                ) : (
                  detail.name.trim().charAt(0).toUpperCase()
                )}
              </div>
              <div className="admin-users-detail-main">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
                    {detail.name}
                  </h2>
                  <span
                    className={`badge ${
                      detail.role === "admin" ? "badge-primary" : ""
                    }`}
                  >
                    {detail.role === "admin" ? "Admin" : "Customer"}
                  </span>
                  <span
                    className={`admin-users-status admin-users-status--${
                      detail.status === "banned" ? "banned" : "active"
                    }`}
                  >
                    {detail.status === "banned" ? "Đã khóa" : "Hoạt động"}
                  </span>
                </div>

                <div className="admin-users-detail-contacts">
                  <div className="admin-users-detail-contact-item">
                    <Mail size={14} /> <span>{detail.email}</span>
                  </div>
                  <div className="admin-users-detail-contact-item">
                    <Phone size={14} />{" "}
                    <span>{detail.phone || "Chưa cập nhật SĐT"}</span>
                  </div>
                  <div className="admin-users-detail-contact-item">
                    <MapPin size={14} />{" "}
                    <span>{detail.address || "Chưa cập nhật địa chỉ"}</span>
                  </div>
                  <div className="admin-users-detail-contact-item">
                    <Calendar size={14} />{" "}
                    <span>
                      Đăng ký:{" "}
                      {new Date(detail.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-sections: NFC Cards & Albums */}
            <div className="admin-users-detail-sections">
              {/* NFC Cards list */}
              <div className="admin-users-detail-box">
                <div className="admin-users-detail-box__title">
                  <CreditCard size={16} /> Thẻ NFC (
                  {detail.nfc_cards?.length || 0})
                </div>
                {!detail.nfc_cards?.length ? (
                  <p className="admin-users-detail-box__empty">
                    Chưa kích hoạt thẻ NFC nào
                  </p>
                ) : (
                  <div className="admin-users-detail-list">
                    {detail.nfc_cards.map((card) => (
                      <div
                        key={card.id}
                        className="admin-users-detail-card-item"
                      >
                        <span className="admin-users-detail-card-code">
                          {card.serial_code || card.nfc_token}
                        </span>
                        <span className="admin-users-detail-card-status">
                          {card.status || "active"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Albums list */}
              <div className="admin-users-detail-box">
                <div className="admin-users-detail-box__title">
                  <FolderArchive size={16} /> Album đã tạo (
                  {detail.albums?.length || 0})
                </div>
                {!detail.albums?.length ? (
                  <p className="admin-users-detail-box__empty">
                    Chưa tạo album nào
                  </p>
                ) : (
                  <div className="admin-users-detail-list">
                    {detail.albums.map((album) => (
                      <div
                        key={album.id}
                        className="admin-users-detail-album-item"
                      >
                        <span className="admin-users-detail-album-title">
                          {album.title}
                        </span>
                        <span className="admin-users-detail-album-meta">
                          {album.view_count || 0} lượt xem •{" "}
                          {album.is_public ? "Công khai" : "Riêng tư"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
