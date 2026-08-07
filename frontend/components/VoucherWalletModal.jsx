"use client";

import { useState, useEffect } from "react";
import { X, Ticket, Gift, Sparkles, Clock, Check, AlertCircle } from "lucide-react";
import { voucherAPI } from "../lib/api";
import { getUser } from "../lib/auth";
import "./VoucherWalletModal.css";

export default function VoucherWalletModal({ onClose, onSelectVoucher }) {
  const [myVouchers, setMyVouchers] = useState([]);
  const [publicVouchers, setPublicVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemInput, setRedeemInput] = useState("");
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const user = getUser();
      if (user) {
        const data = await voucherAPI.getMyWallet();
        setMyVouchers(data.myVouchers || []);
        setPublicVouchers(data.publicVouchers || []);
      } else {
        // Nếu chưa đăng nhập thì dùng local fallback
        setMyVouchers([]);
        setPublicVouchers([]);
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

  const handleRedeem = async (e) => {
    e.preventDefault();
    const cleanCode = redeemInput.trim().toUpperCase();
    if (!cleanCode) return;

    setError("");
    setSubmitting(true);

    try {
      const user = getUser();
      if (!user) {
        throw new Error("Vui lòng đăng nhập để lưu Voucher vào Ví cá nhân");
      }

      const res = await voucherAPI.redeemCode(cleanCode);
      setToast({
        type: "success",
        title: "🎉 Chúc Mừng Bạn!",
        text: `Đã lưu thành công ${res.voucher.title} (${res.voucher.discountText}) vào Ví`,
      });
      setRedeemInput("");
      fetchWallet();
    } catch (err) {
      setError(err.message || "Không thể đổi mã quà tặng");
    } finally {
      setSubmitting(false);
    }
  };

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
        <button className="voucher-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="voucher-modal-header">
          <div className="v-header-icon">
            <Gift size={24} />
          </div>
          <div>
            <h3>Ví Voucher & Ưu Đãi Của Tôi 🎟️</h3>
            <p className="text-muted">
              Nhập mã quà tặng hoặc chọn Voucher từ Database để sử dụng khi thanh toán
            </p>
          </div>
        </div>

        {toast && (
          <div className="voucher-toast-banner">
            <Sparkles size={18} />
            <div>
              <strong>{toast.title}</strong>
              <p>{toast.text}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="voucher-error-banner" style={{ display: "flex", gap: "8px", background: "#fef2f2", color: "#b91c1c", padding: "10px 14px", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.85rem" }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* FORM NHẬP MÃ ĐỔI QUÀ */}
        <form onSubmit={handleRedeem} className="voucher-redeem-form">
          <div className="redeem-input-wrap">
            <Ticket size={18} className="r-icon" />
            <input
              type="text"
              placeholder="Nhập mã Voucher quà tặng (VD: VINATAP2026)..."
              value={redeemInput}
              onChange={(e) => setRedeemInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-redeem" disabled={submitting}>
            {submitting ? "Đang đổi..." : "Đổi Quà"}
          </button>
        </form>

        {/* DANH SÁCH VOUCHER TRONG VÍ CÁ NHÂN */}
        <div className="voucher-list-wrap">
          <h4 className="v-list-title">Danh Sách Voucher Trong Ví Của Tôi ({myVouchers.length})</h4>

          {loading ? (
            <div className="v-empty">Đang tải Ví Voucher từ hệ thống...</div>
          ) : myVouchers.length === 0 ? (
            <div className="v-empty">Ví của bạn chưa có Voucher nào. Nhập mã quà tặng ở trên để nhận ưu đãi!</div>
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
                    <div style={{ display: "flex", gap: "10px", fontSize: "0.75rem", color: "#64748b", margin: "4px 0" }}>
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
