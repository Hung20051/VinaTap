"use client";

import { useState, useEffect } from "react";
import { X, Gift, Clock, Sparkles, Ticket } from "lucide-react";
import { voucherAPI } from "../lib/api";
import { getUser } from "../lib/auth";
import "./VoucherWalletModal.css";

export default function VoucherWalletModal({ onClose, onSelectVoucher }) {
  const [myVouchers, setMyVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const user = getUser();
      if (user) {
        const data = await voucherAPI.getMyWallet();
        setMyVouchers(data.myVouchers || []);
      } else {
        setMyVouchers([]);
      }
    } catch (e) {
      console.error("Fetch wallet error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Vĩnh viễn";
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="voucher-modal-overlay" onClick={onClose}>
      <div className="voucher-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="voucher-modal-close" onClick={onClose} title="Đóng">
          <X size={20} />
        </button>

        <div className="voucher-modal-header">
          <div className="v-header-icon">
            <Gift size={24} />
          </div>
          <div>
            <h3>Ví Voucher & Ưu Đãi Của Tôi 🎟️</h3>
            <p className="text-muted">
              Danh sách các mã giảm giá & ưu đãi VinaTap gửi tặng riêng cho bạn
            </p>
          </div>
        </div>

        {/* DANH SÁCH VOUCHER TRONG VÍ CÁ NHÂN */}
        <div className="voucher-list-wrap">
          <h4 className="v-list-title">
            Voucher Khả Dụng ({myVouchers.length})
          </h4>

          {loading ? (
            <div className="v-empty">Đang tải Ví Voucher từ hệ thống...</div>
          ) : myVouchers.length === 0 ? (
            <div className="v-empty" style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <Ticket size={40} style={{ color: "#cbd5e1", marginBottom: "0.75rem" }} />
              <p style={{ fontWeight: 600, color: "#475569", margin: "0 0 0.25rem" }}>
                Hiện tại bạn chưa có Voucher nào trong Ví.
              </p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
                VinaTap sẽ gửi tặng bạn các ưu đãi và voucher hấp dẫn qua thông báo chuông 🔔. Hãy chú ý theo dõi nhé!
              </p>
            </div>
          ) : (
            <div className="v-grid">
              {myVouchers.map((v) => (
                <div key={v.id || v.code} className={`v-card ${v.isExpired ? "expired" : ""}`}>
                  <div className="v-card-left">
                    <span className="v-discount-badge">{v.discountText}</span>
                    <code className="v-code-text">{v.code}</code>
                  </div>
                  <div className="v-card-right">
                    <strong>{v.title}</strong>
                    <p>{v.description || "Ưu đãi đặc quyền VinaTap"}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "0.75rem", color: "#64748b", margin: "6px 0" }}>
                      <span><Clock size={12} /> Hạn: <strong>{formatDate(v.expires_at)}</strong></span>
                      {v.min_order_amount > 0 && (
                        <span>Đơn tối thiểu: <strong>{formatMoney(v.min_order_amount)}</strong></span>
                      )}
                    </div>
                    {onSelectVoucher && !v.isExpired && (
                      <button
                        className="btn-use-voucher"
                        onClick={() => {
                          onSelectVoucher(v.code);
                          onClose();
                        }}
                      >
                        Dùng Ngay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
