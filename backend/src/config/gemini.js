const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model dùng cho caption ảnh (vision)
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Model dùng cho chatbot (text)
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = { visionModel, chatModel };
