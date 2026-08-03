const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  login,
  googleCallback,
  getMe,
  updateMe,
  changePassword,
  uploadAvatar,
  requestRegisterOtp,
  verifyRegisterOtp,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
  updateProfileLimiter,
} = require("../middleware/rateLimit");

// Đăng nhập bằng email/password — dùng thật bởi frontend (/auth) mỗi lần
// người dùng đăng nhập. Không liên quan tới OTP (OTP chỉ áp dụng cho lúc
// ĐĂNG KÝ và QUÊN MẬT KHẨU, không áp dụng cho mỗi lần đăng nhập).
router.post("/login", loginLimiter, login);

// ⚠️ ĐÃ TẮT: POST /register (đăng ký không qua OTP)
// Route này tạo tài khoản tức thì chỉ cần email/password, không xác minh
// email — hoàn toàn bỏ qua luồng OTP 2 bước bên dưới. Frontend không hề
// gọi route này (chỉ dùng register/request-otp + verify-otp), nên đây là
// lỗ hổng cho phép ai đó gọi thẳng API để tạo tài khoản spam/giả không
// qua xác minh. Nếu thật sự cần 1 API tạo tài khoản không-OTP cho mục
// đích test nội bộ, hãy thêm lại có kèm requireRole("admin") thay vì để
// public như trước.
//
// const { register } = require("../controllers/authController");
// const { registerLimiter } = require("../middleware/rateLimit");
// router.post("/register", registerLimiter, register);

// Đăng ký có xác thực OTP qua email (2 bước)
router.post("/register/request-otp", otpRequestLimiter, requestRegisterOtp);
router.post("/register/verify-otp", otpVerifyLimiter, verifyRegisterOtp);

// Quên mật khẩu — xác thực OTP qua email (2 bước)
router.post(
  "/forgot-password/request-otp",
  otpRequestLimiter,
  requestForgotPasswordOtp,
);
router.post(
  "/forgot-password/verify-otp",
  otpVerifyLimiter,
  verifyForgotPasswordOtp,
);
// Quên mật khẩu — bước 3: đặt mật khẩu mới bằng resetToken (tách khỏi
// verify-otp để không bị ràng buộc bởi hạn 10 phút của mã OTP)
router.post("/forgot-password/reset-password", otpVerifyLimiter, resetPassword);

// Google OAuth
// Bước 1: redirect sang Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Bước 2: Google redirect về đây
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth?error=oauth_failed",
  }),
  googleCallback,
);

// Lấy thông tin user đang đăng nhập
router.get("/me", protect, getMe);

// Cập nhật hồ sơ (tên, SĐT, địa chỉ) — lưu thật vào DB, dùng cho ship thẻ NFC
router.patch("/me", protect, updateProfileLimiter, updateMe);

// Đổi mật khẩu khi đã đăng nhập (khác luồng quên mật khẩu/OTP)
router.patch("/change-password", protect, updateProfileLimiter, changePassword);

// Đổi ảnh đại diện — upload lên Cloudinary, lưu URL vào users.avatar_url
router.post("/me/avatar", protect, updateProfileLimiter, uploadAvatar);

module.exports = router;
