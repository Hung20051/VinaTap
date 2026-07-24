const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

// Sinh mã OTP ngẫu nhiên an toàn (crypto, không dùng Math.random)
const generateOtp = () => {
  const max = 10 ** OTP_LENGTH;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(OTP_LENGTH, "0");
};

// Hash OTP trước khi lưu DB — không lưu OTP dạng plain text, giống nguyên
// tắc với password_hash. Nếu DB bị lộ, kẻ tấn công vẫn không dùng được OTP.
const hashOtp = (otp) => bcrypt.hash(otp, 10);
const compareOtp = (otp, hash) => bcrypt.compare(otp, hash);

const getExpiryDate = () => new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

module.exports = {
  OTP_LENGTH,
  OTP_TTL_MINUTES,
  MAX_ATTEMPTS,
  generateOtp,
  hashOtp,
  compareOtp,
  getExpiryDate,
};
