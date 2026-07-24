const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  register,
  login,
  googleCallback,
  getMe,
  updateMe,
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
  registerLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
  updateProfileLimiter,
} = require("../middleware/rateLimit");

// Email / password (giữ lại — không dùng ở frontend hiện tại vì đã chuyển
// sang luồng có OTP bên dưới, nhưng vẫn hữu ích cho test/API khác)
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

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

// Đổi ảnh đại diện — upload lên Cloudinary, lưu URL vào users.avatar_url
router.post("/me/avatar", protect, updateProfileLimiter, uploadAvatar);

module.exports = router;
