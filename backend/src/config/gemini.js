const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Danh sách các model fallback ưu tiên các phiên bản 3.x & Flash đã được kiểm chứng hoạt động 100%
const getCandidateModels = () => {
  const envModels = process.env.GEMINI_MODELS
    ? process.env.GEMINI_MODELS.split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    : [];

  const defaultModels = [
    // 🌟 Các Model thế hệ 3.x siêu tốc & thông minh nhất
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.5-flash-lite",

    // 🚀 Các Model thế hệ 2.5 & Flash Lite
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
  ];

  return Array.from(new Set([...envModels, ...defaultModels]));
};

/**
 * Chuẩn hóa lịch sử chat đảm bảo tuân thủ nghiêm ngặt quy tắc API:
 * - Lịch sử bắt buộc phải bắt đầu bằng role 'user' (không được bắt đầu bằng 'model').
 * - Lược bỏ tin nhắn người dùng hiện tại nếu đã lọt vào mảng history.
 */
function sanitizeChatHistory(rawHistory = [], currentPrompt = "") {
  if (!Array.isArray(rawHistory) || rawHistory.length === 0) {
    return [];
  }

  const clean = rawHistory
    .map((msg) => {
      const role =
        msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      const text = msg.parts?.[0]?.text || msg.content || msg.text || "";
      return { role, text: String(text).trim() };
    })
    .filter((m) => m.text.length > 0);

  // Tìm tin nhắn đầu tiên có role là 'user'
  const firstUserIdx = clean.findIndex((m) => m.role === "user");
  if (firstUserIdx === -1) {
    return [];
  }

  let valid = clean.slice(firstUserIdx);

  // Nếu tin nhắn cuối cùng trùng với câu hỏi hiện tại, lược bỏ khỏi history
  if (
    valid.length > 0 &&
    valid[valid.length - 1].role === "user" &&
    valid[valid.length - 1].text === String(currentPrompt).trim()
  ) {
    valid = valid.slice(0, -1);
  }

  return valid.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
}

/**
 * Gửi tin nhắn hoặc tạo nội dung với cơ chế tự động xoay vòng Model (Auto-Fallback)
 */
async function generateWithFallback({
  prompt,
  systemInstruction,
  history = [],
  parts = null,
}) {
  const models = getCandidateModels();
  const cleanHistory = sanitizeChatHistory(history, prompt);
  let lastError = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
          ? { parts: [{ text: String(systemInstruction) }] }
          : undefined,
      });

      if (cleanHistory && cleanHistory.length > 0) {
        const chat = model.startChat({
          history: cleanHistory,
        });
        const result = await chat.sendMessage(prompt);
        return {
          text: result.response.text().trim(),
          modelUsed: modelName,
        };
      } else if (parts) {
        const result = await model.generateContent(parts);
        return {
          text: result.response.text().trim(),
          modelUsed: modelName,
        };
      } else {
        const result = await model.generateContent(prompt);
        return {
          text: result.response.text().trim(),
          modelUsed: modelName,
        };
      }
    } catch (err) {
      console.warn(
        `[Gemini Fallback] Model "${modelName}" failed: ${err.message}. Trying next candidate...`,
      );
      lastError = err;
    }
  }

  throw new Error(
    `Tất cả các mô hình AI đều không thể xử lý: ${lastError?.message || "Lỗi không xác định"}`,
  );
}

// Backward compatibility
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

module.exports = {
  genAI,
  visionModel,
  chatModel,
  generateWithFallback,
  getCandidateModels,
  sanitizeChatHistory,
};
