"use client";

import { useEffect, useRef, useState } from "react";
import { chatbotAPI } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function Chatbot({ albumId }) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // Tạo session khi mở lần đầu
  useEffect(() => {
    if (!open || sessionId || !isLoggedIn()) return;
    chatbotAPI
      .createSession(albumId)
      .then((res) => {
        setSessionId(res.session_id);
        // Tin nhắn chào mở đầu
        setMessages([
          {
            role: "assistant",
            content: albumId
              ? "👋 Xin chào! Mình là trợ lý du lịch VinaTap. Mình có thể giúp bạn gợi ý địa điểm, viết caption ảnh hoặc kể về văn hóa địa phương tỉnh này. Bạn cần gì?"
              : "👋 Xin chào! Mình là trợ lý du lịch VinaTap. Bạn muốn khám phá tỉnh thành nào của Việt Nam?",
          },
        ]);
      })
      .catch(() => setError("Không khởi tạo được chatbot"));
  }, [open, sessionId, albumId]);

  // Cuộn xuống khi có tin mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !sessionId || sending) return;

    setInput("");
    setSending(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await chatbotAPI.sendMessage(sessionId, text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
    } catch (err) {
      setError(err.message || "Không gửi được tin nhắn");
    } finally {
      setSending(false);
    }
  };

  if (!isLoggedIn()) return null;

  return (
    <>
      {/* Nút mở chatbot */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "1.3rem",
          boxShadow: "0 4px 16px rgba(232,93,4,.4)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Trợ lý du lịch VinaTap"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Cửa sổ chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            width: 340,
            maxHeight: 480,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: ".85rem 1rem",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".95rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            🗺 Trợ lý VinaTap
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: ".75rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: ".6rem",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: ".55rem .85rem",
                    borderRadius:
                      m.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      m.role === "user" ? "var(--primary)" : "#f3f4f6",
                    color: m.role === "user" ? "#fff" : "var(--text-primary)",
                    fontSize: ".85rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: ".55rem .85rem",
                    borderRadius: "16px 16px 16px 4px",
                    background: "#f3f4f6",
                    fontSize: ".85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Đang soạn...
                </div>
              </div>
            )}

            {error && (
              <p
                style={{
                  fontSize: ".8rem",
                  color: "var(--danger)",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: ".6rem .75rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: ".5rem",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              disabled={sending || !sessionId}
              style={{
                flex: 1,
                padding: ".5rem .75rem",
                borderRadius: 999,
                border: "1.5px solid var(--border)",
                fontSize: ".85rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending || !input.trim() || !sessionId}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                fontSize: ".9rem",
                opacity: !input.trim() || sending ? 0.5 : 1,
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
