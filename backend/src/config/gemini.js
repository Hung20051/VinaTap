const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model dùng cho caption ảnh (vision) và chatbot (text)
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

module.exports = { visionModel, chatModel };
