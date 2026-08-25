"use client";

import { useState, useRef } from "react";
import { nfcAPI } from "@/lib/api";

// Props:
//   cardId   — id của nfc_card
//   cardName — tên tỉnh để hiện trong modal
//   onClose  — callback đóng modal (không reload)
//   onSuccess— callback khi chuyển nhượng thành công (reload dữ liệu)
export default function TransferModal({ cardId, cardName, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle|loading|success|error
  const [msg, setMsg] = useState("");
  const inFlightRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || inFlightRef.current || status === "loading") return;
    inFlightRef.current = true;
    setStatus("loading");
    try {
      const res = await nfcAPI.initiateTransfer(cardId, {
        email: email.trim(),
        note,
      });
      setMsg(res.message || "Đã gửi lời mời chuyển nhượng thành công!");
      setStatus("success");
    } catch (err) {
      setMsg(err.message || "Gửi thất bại");
      setStatus("error");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (status === "success" && onSuccess) {
      onSuccess();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={handleClose}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "1.75rem",
          borderRadius: 20,
          background: "#ffffff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {status !== "success" ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h2 style={{ fontWeight: 800, fontSize: "1.15rem", color: "#0f172a", margin: 0 }}>
                🎁 Chuyển nhượng mảnh {cardName}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.3rem",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                color: "#64748b",
                fontSize: ".85rem",
                marginBottom: "1.25rem",
                lineHeight: 1.5,
              }}
            >
              Nhập email người bạn muốn tặng. Họ sẽ nhận được link xác nhận qua
              email trong vòng <b>7 ngày</b>. Sau khi họ xác nhận, thẻ và album
              sẽ chuyển sang tài khoản của họ.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".85rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: ".82rem",
                    fontWeight: 700,
                    color: "#334155",
                    display: "block",
                    marginBottom: ".35rem",
                  }}
                >
                  Email người nhận *
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: ".82rem",
                    fontWeight: 700,
                    color: "#334155",
                    display: "block",
                    marginBottom: ".35rem",
                  }}
                >
                  Lời nhắn (tùy chọn)
                </label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="VD: Chúc bạn có nhiều chuyến đi vui vẻ..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "10px", border: "1px solid #cbd5e1", resize: "vertical" }}
                />
              </div>

              {msg && status === "error" && (
                <p style={{ color: "#ef4444", fontSize: ".85rem", margin: 0, fontWeight: 600 }}>
                  ⚠️ {msg}
                </p>
              )}

              <div
                style={{ display: "flex", gap: ".6rem", marginTop: ".5rem" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "0.75rem 1rem", borderRadius: "12px", background: "#ea580c", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                  disabled={status === "loading" || !email.trim()}
                >
                  {status === "loading" ? "Đang gửi..." : "📨 Gửi lời mời"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleClose}
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "12px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Hủy
                </button>
              </div>
            </form>

            <p
              style={{
                color: "#94a3b8",
                fontSize: ".75rem",
                marginTop: "1rem",
                marginBottom: 0,
                lineHeight: 1.5,
              }}
            >
              ⚠️ Sau khi người nhận xác nhận, bạn sẽ mất quyền sở hữu thẻ
              và album này.
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>📨</div>
            <h2 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f172a", marginBottom: ".5rem" }}>
              Đã gửi lời mời tặng thẻ!
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "1.5rem",
                fontSize: ".9rem",
                lineHeight: 1.5,
              }}
            >
              {msg}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
              style={{ width: "100%", justifyContent: "center", padding: "0.75rem", borderRadius: "12px", background: "#059669", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
            >
              Hoàn tất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
