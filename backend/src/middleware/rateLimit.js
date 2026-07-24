const rateLimit = require("express-rate-limit");

// Dùng cho POST /api/nfc/activate — serial code dù đã tăng entropy vẫn nên
// giới hạn số lần thử theo IP để chống dò (brute-force).
const activateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20, // tối đa 20 lần thử / IP / 15 phút
  message: { message: "Bạn thử quá nhiều lần, vui lòng thử lại sau ít phút" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dùng cho POST /api/auth/login — chống dò mật khẩu
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Bạn thử quá nhiều lần, vui lòng thử lại sau ít phút" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dùng cho POST /api/auth/register — trước đây không có, dễ bị spam tạo
// tài khoản hàng loạt hoặc dò xem email nào đã tồn tại (qua response 409)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Bạn thử quá nhiều lần, vui lòng thử lại sau ít phút" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dùng cho POST /chatbot/sessions/:sessionId/messages — trước đây route
// này chỉ yêu cầu đăng nhập mà không giới hạn tần suất, 1 user có thể spam
// gọi Gemini API liên tục (tốn quota/chi phí, có thể ảnh hưởng tới các
// user khác dùng chung free tier). Giới hạn theo user_id (không theo IP,
// vì route đã có req.user từ middleware protect) để công bằng hơn giữa
// các user và không bị ảnh hưởng bởi NAT/wifi công cộng dùng chung IP.
const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 20, // tối đa 20 tin nhắn / user / phút
  message: {
    message: "Bạn gửi tin nhắn quá nhanh, vui lòng chờ một chút",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user ? String(req.user.id) : req.ip),
});

// Dùng cho các endpoint YÊU CẦU gửi OTP (register/request-otp,
// forgot-password/request-otp) — mỗi lần gọi tốn 1 email gửi đi nên giới
// hạn chặt hơn để chống spam gửi mail hàng loạt tới 1 hộp thư nạn nhân.
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Bạn yêu cầu mã OTP quá nhiều lần, vui lòng thử lại sau ít phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dùng cho endpoint XÁC THỰC OTP — chống dò mã 6 số bằng brute-force.
// Giới hạn theo IP ở tầng route; số lần thử sai theo từng mã còn được
// kiểm soát riêng trong OtpCode (attempts) ở tầng controller.
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Bạn thử quá nhiều lần, vui lòng thử lại sau ít phút" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dùng cho PATCH /api/auth/me — endpoint đã có protect (cần đăng nhập)
// nên giới hạn theo user_id thay vì IP, tương tự chatMessageLimiter.
// Không cần chặt như OTP vì đây chỉ là sửa hồ sơ, nhưng vẫn nên giới hạn
// để tránh 1 tài khoản spam ghi DB liên tục.
const updateProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Bạn cập nhật hồ sơ quá nhiều lần, vui lòng thử lại sau ít phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user ? String(req.user.id) : req.ip),
});

module.exports = {
  activateLimiter,
  loginLimiter,
  registerLimiter,
  chatMessageLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
  updateProfileLimiter,
};
