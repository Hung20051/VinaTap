"use client";

import { useState } from "react";
import { nfcAPI } from "@/lib/api";

// Props:
//   cardId  — id của nfc_card
//   cardName — tên tỉnh để hiện trong modal
//   onClose  — callback đóng modal
export default function TransferModal({ cardId, cardName, onClose }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle|loading|success|error
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await nfcAPI.initiateTransfer(cardId, {
        email: email.trim(),
        note,
      });
      setMsg(res.message);
      setStatus("success");
    } catch (err) {
      setMsg(err.message || "Gửi thất bại");
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: 420, padding: "1.75rem" }}
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
              <h2 style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                🎁 Chuyển nhượng mảnh {cardName}
              </h2>
              <button
                onClick={onClose}
                style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}
              >
                ✕
              </button>
            </div>

            <p
              style={{
                color: "var(--text-secondary)",
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
                gap: ".75rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: ".3rem",
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
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: ".3rem",
                  }}
                >
                  Lời nhắn (tùy chọn)
                </label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="VD: Chúc bạn có nhiều chuyến đi vui..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>

              {msg && status === "error" && (
                <p style={{ color: "var(--danger)", fontSize: ".85rem" }}>
                  {msg}
                </p>
              )}

              <div
                style={{ display: "flex", gap: ".5rem", marginTop: ".25rem" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                  disabled={status === "loading" || !email.trim()}
                >
                  {status === "loading" ? "Đang gửi..." : "📨 Gửi lời mời"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                >
                  Hủy
                </button>
              </div>
            </form>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: ".75rem",
                marginTop: "1rem",
                lineHeight: 1.5,
              }}
            >
              ⚠️ Sau khi người nhận xác nhận, bạn sẽ mất quyền truy cập vào thẻ
              và album này. Hành động không thể hoàn tác.
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📨</div>
            <h2 style={{ fontWeight: 700, marginBottom: ".5rem" }}>
              Đã gửi lời mời!
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
                fontSize: ".9rem",
              }}
            >
              {msg}
            </p>
            <button
              className="btn btn-primary"
              onClick={onClose}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
