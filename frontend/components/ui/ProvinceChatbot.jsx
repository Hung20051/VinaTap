"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { chatbotAPI } from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import "@/styles/province-chatbot.css";

// Hàm parse Markdown an toàn, mượt mà cho văn bản chatbot
function renderMarkdown(content = "") {
  if (!content) return "";

  let html = content
    // 1. Xử lý ảnh Markdown: ![alt](url) -> card ảnh đẹp (chỉ nhận link http/https hợp lệ)
    .replace(
      /!\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
      (match, alt, url) => {
        if (!url || url.length < 10 || url.includes("example.com")) return "";
        return `<div class="prov-ai-img-card" title="Xem ảnh gốc"><img src="${url}" alt="${alt || "Ảnh du lịch"}" class="prov-ai-rendered-img" loading="lazy" onerror="if(this.closest('.prov-ai-img-card')) this.closest('.prov-ai-img-card').remove();" /><span class="prov-ai-img-tag">📸 ${alt || "Ảnh minh họa"}</span></div>`;
      },
    )
    // 2. Xử lý link thông thường: [text](url) -> thẻ <a> an toàn
    .replace(
      /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="prov-ai-map-link">$1 ↗</a>',
    )
    // 3. Xử lý tiêu đề Markdown: ### Title hoặc ## Title
    .replace(/(?:^|\n)###\s+(.+)/g, '<h4 class="prov-ai-h4">$1</h4>')
    .replace(/(?:^|\n)##\s+(.+)/g, '<h3 class="prov-ai-h3">$1</h3>')
    // 4. Xử lý đường kẻ ngang
    .replace(/(?:^|\n)---(?:\n|$)/g, '<hr class="prov-ai-divider" />')
    // In đậm: **text** hoặc __text__
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // In nghiêng: *text* hoặc _text_
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Gạch đầu dòng: - item hoặc * item
    .replace(/(?:^|\n)[-*]\s+(.+)/g, "<br/>• $1")
    // Số thứ tự: 1. item
    .replace(/(?:^|\n)(\d+)\.\s+(.+)/g, "<br/><strong>$1.</strong> $2")
    // Xuống dòng
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");

  return html;
}

// Component Memo hóa từng tin nhắn để khi gõ bàn phím KHÔNG bị re-render giật lag
const ChatMessageBubble = memo(function ChatMessageBubble({ message, userAvatar, userName }) {
  const isAi = message.role === "assistant" || message.role === "model";
  return (
    <div className={`prov-ai-msg-row ${isAi ? "is-ai" : "is-user"}`}>
      <div className="prov-ai-msg-avatar">
        {isAi ? (
          <Sparkles size={14} />
        ) : userAvatar ? (
          <img
            src={userAvatar}
            alt={userName || "User"}
            className="prov-ai-user-avatar-img"
            onError={(e) => {
              // Nếu ảnh avatar tải lỗi thì fallback về ký tự hoặc icon
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.innerText = userName ? userName.charAt(0).toUpperCase() : "👤";
            }}
          />
        ) : userName ? (
          <span className="prov-ai-user-initial">{userName.charAt(0).toUpperCase()}</span>
        ) : (
          "👤"
        )}
      </div>
      <div
        className="prov-ai-msg-bubble"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(message.content),
        }}
      />
    </div>
  );
});

export default function ProvinceChatbot({
  province,
  provinceName,
  spots = [],
  specialties = "",
  isOpen: externalIsOpen,
  onToggleOpen,
  onClose,
  hideFab = false,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Sync internal state with externalIsOpen if passed
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(Boolean(externalIsOpen));
    }
  }, [externalIsOpen]);

  const isOpen = externalIsOpen !== undefined && onToggleOpen ? externalIsOpen : internalIsOpen;

  const setIsOpen = (val) => {
    const nextVal = typeof val === "function" ? val(isOpen) : val;
    setInternalIsOpen(nextVal);
    if (onToggleOpen) {
      onToggleOpen(nextVal);
    }
    if (onClose && !nextVal) {
      onClose();
    }
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Đếm giây khi đang tải để hiển thị gợi ý thông minh
  useEffect(() => {
    let timer = null;
    if (loading) {
      setLoadingSeconds(0);
      timer = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  const getLoadingHint = (sec) => {
    if (sec < 4) return null;
    if (sec < 8) return "🔍 Đang tra cứu thông tin địa phương & hình ảnh...";
    if (sec < 12) return "⚡ Đang xử lý & tổng hợp dữ liệu chuẩn xác nhất...";
    if (sec < 17) return "✨ Sắp xong rồi, Thổ Địa đang chuẩn bị câu trả lời cho bạn...";
    return "⏳ Máy chủ đang phân tích chi tiết, bạn đợi thêm vài giây nhé...";
  };

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const user = getUser();
    setCurrentUser(user);

    // Lắng nghe sự kiện cập nhật profile / đăng nhập / đăng xuất
    const handleUserUpdate = (e) => {
      setCurrentUser(e?.detail || getUser());
    };
    const handleStorage = () => {
      setCurrentUser(getUser());
    };

    window.addEventListener("vinatap:user-updated", handleUserUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("vinatap:user-updated", handleUserUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const pName = province?.name || provinceName || "Việt Nam";
  const pSlug =
    province?.slug ||
    (provinceName
      ? provinceName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "general");
  const userId = currentUser?.id || "guest";
  const storageKey = `vinatap_chat_${userId}_${pSlug}`;

  // 1. Tải lịch sử chat từ LocalStorage riêng biệt theo từng user/guest và từng tỉnh
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load chat history from LocalStorage", e);
    }

    // Tin nhắn chào mở đầu chuẩn AI Travel Companion
    const initialGreeting = {
      role: "assistant",
      content:
        pSlug === "viet-nam" || pName === "Việt Nam"
          ? `👋 **Xin chào! Mình là AI Travel Companion — Trợ lý Du lịch Thông minh VinaTap** 🌟\n\nMình có thể giúp bạn **lên lịch trình tức thì chỉ với một câu prompt** (Plan your Vietnam trip with just one prompt), gợi ý 34 tỉnh thành đẹp nhất, món ngon đặc sản kèm toạ độ Maps, khách sạn và phương tiện di chuyển tối ưu nhất.\n\nBạn muốn lên kế hoạch cho chuyến đi sắp tới như thế nào?`
          : `👋 **Xin chào! Mình là AI Travel Companion tại ${pName}** 🌟\n\nMình có thể hỗ trợ bạn lên lịch trình, tìm hiểu địa danh nổi tiếng, quán ăn ngon đặc sản kèm chỉ đường Google Maps, khách sạn & phương tiện di chuyển tối ưu tại ${pName}. Bạn cần tư vấn thông tin gì hôm nay?`,
      timestamp: Date.now(),
    };
    setMessages([initialGreeting]);
  }, [pSlug, pName, storageKey]);

  // 2. Lưu vào LocalStorage khi messages thay đổi
  useEffect(() => {
    if (typeof window === "undefined" || messages.length === 0) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save chat history to LocalStorage", e);
    }
  }, [messages, storageKey]);

  // 3. Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // 4. Gửi tin nhắn
  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    setError("");

    const userMsg = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await chatbotAPI.chatProvince({
        provinceSlug: pSlug,
        provinceName: pName,
        message: text,
        userInfo: currentUser
          ? {
              id: currentUser.id,
              name: currentUser.name || currentUser.full_name || currentUser.username,
              email: currentUser.email,
              role: currentUser.role,
            }
          : null,
        history: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        provinceData: {
          name: pName,
          region: province?.region,
          description: province?.description,
          specialties: specialties || province?.specialties,
          spots: spots || province?.spots,
        },
      });

      const aiReply = {
        role: "assistant",
        content: res.reply || "Xin lỗi, mình đang cập nhật dữ liệu. Bạn thử hỏi lại nhé!",
        modelUsed: res.modelUsed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setError(err.message || "Không thể kết nối tới AI. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 5. Xóa lịch sử chat
  const handleClearHistory = () => {
    if (window.confirm(`Bạn có muốn xóa toàn bộ lịch sử trò chuyện về ${pName}?`)) {
      const resetGreeting = {
        role: "assistant",
        content: `👋 **Chào bạn trở lại! Mình là AI Travel Companion tại ${pName}** 🌟\n\nBạn muốn lên lịch trình du lịch hoặc tìm hiểu thông tin địa danh nào tiếp theo?`,
        timestamp: Date.now(),
      };
      setMessages([resetGreeting]);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {}
    }
  };

  // Các gợi ý câu hỏi nhanh (Chuẩn chủ đề Du lịch & Lập lịch trình 1 prompt)
  const quickPrompts = [
    { label: "✨ Lịch trình 1 prompt", prompt: `Lên giúp mình lịch trình du lịch ${pName} tối ưu và chi tiết nhất chỉ với 1 prompt?` },
    { label: "🍜 Quán ăn ngon & Maps", prompt: `${pName} có món gì ngon nhất và những quán ăn nào nổi tiếng kèm địa chỉ Google Maps?` },
    { label: "🚗 Phương tiện & Di chuyển", prompt: `Tư vấn phương tiện di chuyển (máy bay, tàu hỏa, xe khách) đến và đi lại tại ${pName}?` },
    { label: "📸 Điểm check-in đẹp", prompt: `Top những địa điểm check-in sống ảo đẹp và nổi tiếng nhất ở ${pName}?` },
    { label: "🏨 Khách sạn & Homestay", prompt: `Gợi ý khách sạn hoặc homestay view đẹp, giá tốt và vị trí thuận tiện tại ${pName}?` },
  ];

  const userAvatar = currentUser?.avatar_url || currentUser?.avatar || null;
  const userName = currentUser?.name || currentUser?.full_name || "";

  return (
    <>
      {/* ─── NÚT NỔI FAB (BONG BÓNG GÓC MÀN HÌNH - CHUẨN GIAO DIỆN HÌNH 1) ─── */}
      {!isOpen && !hideFab && (
        <div className="vnn-floating-widget">
          <button
            type="button"
            className="vnn-floating-widget__btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Travel Companion"
            title={`AI Travel Companion • ${pName}`}
          >
            <span className="vnn-floating-widget__halo-outer" />
            <span className="vnn-floating-widget__halo-mid" />
            <span className="vnn-floating-widget__avatar">
              <img
                src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
                alt="AI Companion"
                className="vnn-floating-widget__avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="vnn-floating-widget__pulse" />
            </span>
          </button>
        </div>
      )}

      {/* ─── CỬA SỔ CHAT MODAL ───────────────────────────────────── */}
      {isOpen && (
        <div className={`prov-ai-chat-window ${isExpanded ? "is-expanded" : ""}`}>
          {/* Header */}
          <div className="prov-ai-header">
            <div className="prov-ai-header-left">
              <div className="prov-ai-header-icon" style={{ background: "rgba(255, 255, 255, 0.2)", color: "#ffffff" }}>
                <Sparkles size={20} />
              </div>
              <div className="prov-ai-header-info">
                <span className="prov-ai-header-name">
                  AI Travel Companion • {pName}
                </span>
                <span className="prov-ai-online-badge">
                  <span className="prov-ai-online-dot" /> Trợ lý du lịch thông minh
                </span>
              </div>
            </div>

            <div className="prov-ai-header-actions">
              <button
                type="button"
                className="prov-ai-header-btn"
                onClick={handleClearHistory}
                title="Xóa cuộc trò chuyện này"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                className="prov-ai-header-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Thu nhỏ về kích thước chuẩn" : "Mở rộng cửa sổ rộng rãi"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                type="button"
                className="prov-ai-header-btn"
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="prov-ai-chips-wrap">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="prov-ai-chip"
                onClick={() => handleSend(chip.prompt)}
                disabled={loading}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="prov-ai-messages-area">
            {messages.map((m, idx) => (
              <ChatMessageBubble
                key={idx}
                message={m}
                userAvatar={userAvatar}
                userName={userName}
              />
            ))}

            {/* Hiệu ứng đang suy nghĩ & gợi ý trạng thái thông minh */}
            {loading && (
              <div className="prov-ai-loading-container">
                <div className="prov-ai-msg-row is-ai">
                  <div className="prov-ai-msg-avatar">
                    <Sparkles size={14} />
                  </div>
                  <div className="prov-ai-msg-bubble prov-ai-typing">
                    <span className="prov-ai-typing-dot" />
                    <span className="prov-ai-typing-dot" />
                    <span className="prov-ai-typing-dot" />
                  </div>
                </div>
                {loadingSeconds >= 4 && (
                  <div className="prov-ai-loading-hint">
                    {getLoadingHint(loadingSeconds)}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "0.82rem",
                  textAlign: "center",
                  padding: "4px 8px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            className="prov-ai-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="prov-ai-input-field"
              placeholder={`Hỏi bất kỳ điều gì về ${pName}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="prov-ai-send-btn"
              disabled={loading || !input.trim()}
              title="Gửi tin nhắn"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
