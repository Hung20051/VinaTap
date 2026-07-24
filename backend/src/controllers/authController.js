const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OtpCode = require("../models/OtpCode");
const cloudinary = require("../config/cloudinary");
const { uploadSingle, runMiddleware } = require("../middleware/upload");
const {
  MAX_ATTEMPTS,
  OTP_TTL_MINUTES,
  generateOtp,
  hashOtp,
  compareOtp,
  getExpiryDate,
} = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");

// Tạo JWT token
const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ─── REGISTER ────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, password }
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate cơ bản
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });

    if (password.length < 6)
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự" });

    // Kiểm tra email đã tồn tại
    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email đã được sử dụng" });

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Tạo user
    const userId = await User.create({ name, email, password_hash });
    const user = await User.findById(userId);

    const token = signToken(user);

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });

    // Tìm user
    const user = await User.findByEmail(email);
    if (!user)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    // User đăng ký bằng Google không có password_hash
    if (!user.password_hash)
      return res
        .status(401)
        .json({ message: "Tài khoản này đăng nhập bằng Google" });

    // So sánh password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    const token = signToken(user);

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── REGISTER — BƯỚC 1: GỬI OTP ─────────────────────────────
// POST /api/auth/register/request-otp
// Body: { name, email, password }
// Không tạo user ngay — chỉ hash password + lưu tạm vào otp_codes.payload,
// user thật sự chỉ được tạo SAU KHI xác thực OTP (verifyRegisterOtp), để
// tránh rác tài khoản chưa xác minh email trong bảng users.
const requestRegisterOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });

    if (password.length < 6)
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự" });

    const existing = await User.findByEmail(email);

    let linking = false;
    let userId = null;

    if (existing) {
      if (existing.password_hash) {
        // Email đã có tài khoản đăng nhập bằng email/mật khẩu — chặn đăng
        // ký trùng, hướng người dùng qua đăng nhập.
        return res
          .status(409)
          .json({ message: "Email đã được sử dụng, vui lòng đăng nhập" });
      }
      // Email đã tồn tại nhưng trước đó chỉ đăng nhập bằng Google (chưa có
      // mật khẩu) → cho phép "link" thêm mật khẩu vào ĐÚNG tài khoản này
      // sau khi xác thực OTP, thay vì báo lỗi trùng hoặc tạo tài khoản thứ
      // hai trùng email.
      linking = true;
      userId = existing.id;
    }

    const password_hash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otp_hash = await hashOtp(otp);

    await OtpCode.invalidateByEmailPurpose(email, "register");
    await OtpCode.create({
      email,
      purpose: "register",
      otp_hash,
      payload: { name, password_hash, linking, userId },
      expires_at: getExpiryDate(),
    });

    await sendOtpEmail(email, {
      otp,
      purpose: "register",
      minutes: OTP_TTL_MINUTES,
    });

    res.json({
      message: linking
        ? "Email này đã có tài khoản đăng nhập bằng Google. Mã OTP đã được gửi để thiết lập mật khẩu cho tài khoản đó."
        : "Mã OTP đã được gửi đến email của bạn",
      linking,
    });
  } catch (err) {
    console.error("requestRegisterOtp error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── REGISTER — BƯỚC 2: XÁC THỰC OTP & TẠO TÀI KHOẢN ────────
// POST /api/auth/register/verify-otp
// Body: { email, otp }
const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Vui lòng nhập mã OTP" });

    const record = await OtpCode.findLatestPending(email, "register");
    if (!record || new Date(record.expires_at) < new Date())
      return res.status(400).json({
        message: "Mã OTP không hợp lệ hoặc đã hết hạn, vui lòng yêu cầu mã mới",
      });

    if (record.attempts >= MAX_ATTEMPTS)
      return res.status(400).json({
        message: "Bạn nhập sai quá nhiều lần, vui lòng yêu cầu mã mới",
      });

    const match = await compareOtp(otp, record.otp_hash);
    if (!match) {
      await OtpCode.incrementAttempts(record.id);
      return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    await OtpCode.markConsumed(record.id);

    const payload =
      typeof record.payload === "string"
        ? JSON.parse(record.payload)
        : record.payload || {};

    let user;
    if (payload.linking && payload.userId) {
      // Link mật khẩu vào tài khoản Google đã tồn tại
      await User.setPassword(payload.userId, payload.password_hash);
      user = await User.findById(payload.userId);
    } else {
      // Kiểm tra lại lần cuối phòng trường hợp email vừa được đăng ký bởi
      // luồng khác trong lúc chờ người dùng nhập OTP (race condition).
      const existing = await User.findByEmail(email);
      if (existing && existing.password_hash)
        return res
          .status(409)
          .json({ message: "Email đã được sử dụng, vui lòng đăng nhập" });

      const newId = await User.create({
        name: payload.name,
        email,
        password_hash: payload.password_hash,
      });
      user = await User.findById(newId);
    }

    const token = signToken(user);

    res.status(201).json({
      message: payload.linking
        ? "Thiết lập mật khẩu thành công, bạn đã có thể đăng nhập bằng email lẫn Google"
        : "Đăng ký thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("verifyRegisterOtp error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── QUÊN MẬT KHẨU — BƯỚC 1: GỬI OTP ────────────────────────
// POST /api/auth/forgot-password/request-otp
// Body: { email }
const requestForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

    const user = await User.findByEmail(email);

    // Luôn trả response giống nhau dù email có tồn tại hay không, tránh lộ
    // thông tin email nào đã đăng ký (user enumeration). Chỉ thực sự gửi
    // mail nếu tìm thấy tài khoản. Tài khoản Google-only vẫn được gửi OTP
    // bình thường — xác thực xong sẽ THIẾT LẬP (không phải "khôi phục")
    // mật khẩu đăng nhập bằng email cho tài khoản đó.
    if (user) {
      const otp = generateOtp();
      const otp_hash = await hashOtp(otp);

      await OtpCode.invalidateByEmailPurpose(email, "forgot_password");
      await OtpCode.create({
        email,
        purpose: "forgot_password",
        otp_hash,
        payload: null,
        expires_at: getExpiryDate(),
      });

      await sendOtpEmail(email, {
        otp,
        purpose: "forgot_password",
        minutes: OTP_TTL_MINUTES,
      });
    }

    res.json({
      message:
        "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi đến hộp thư của bạn",
    });
  } catch (err) {
    console.error("requestForgotPasswordOtp error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thời gian sống của reset token (bước 3) — tách riêng khỏi TTL của OTP để
// người dùng có đủ thời gian nhập mật khẩu mới sau khi đã xác thực OTP
// xong, mà không lo OTP (đã bị consume) hết hạn giữa chừng.
const RESET_TOKEN_TTL = "10m";

// ─── QUÊN MẬT KHẨU — BƯỚC 2: XÁC THỰC OTP ───────────────────
// POST /api/auth/forgot-password/verify-otp
// Body: { email, otp }
// Chỉ xác thực mã OTP — KHÔNG đổi mật khẩu ở bước này. Nếu đúng, trả về
// một resetToken (JWT ngắn hạn, riêng biệt với OTP) để FE dùng ở bước 3
// (nhập mật khẩu mới). Tách 2 bước này ra để lỡ người dùng nhập mật khẩu
// mới chậm thì không bị ảnh hưởng bởi hạn 10 phút của mã OTP — OTP chỉ
// cần xác thực đúng 1 lần duy nhất tại bước này.
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Vui lòng nhập mã OTP" });

    const record = await OtpCode.findLatestPending(email, "forgot_password");
    if (!record || new Date(record.expires_at) < new Date())
      return res.status(400).json({
        message: "Mã OTP không hợp lệ hoặc đã hết hạn, vui lòng yêu cầu mã mới",
      });

    if (record.attempts >= MAX_ATTEMPTS)
      return res.status(400).json({
        message: "Bạn nhập sai quá nhiều lần, vui lòng yêu cầu mã mới",
      });

    const match = await compareOtp(otp, record.otp_hash);
    if (!match) {
      await OtpCode.incrementAttempts(record.id);
      return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    await OtpCode.markConsumed(record.id);

    const user = await User.findByEmail(email);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    // resetToken riêng, KHÔNG dùng chung JWT_SECRET kiểu login token — vẫn
    // ký bằng JWT_SECRET nhưng có purpose riêng để reset-password không
    // thể bị nhầm/dùng thay cho token đăng nhập ở nơi khác.
    const resetToken = jwt.sign(
      { email: user.email, purpose: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: RESET_TOKEN_TTL },
    );

    res.json({
      message: "Xác thực OTP thành công",
      resetToken,
    });
  } catch (err) {
    console.error("verifyForgotPasswordOtp error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── QUÊN MẬT KHẨU — BƯỚC 3: ĐẶT MẬT KHẨU MỚI ───────────────
// POST /api/auth/forgot-password/reset-password
// Body: { resetToken, newPassword }
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword)
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự" });

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        message:
          "Phiên đặt lại mật khẩu đã hết hạn, vui lòng thực hiện lại từ đầu",
      });
    }

    if (payload.purpose !== "reset_password" || !payload.email)
      return res.status(400).json({ message: "Yêu cầu không hợp lệ" });

    const user = await User.findByEmail(payload.email);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    const password_hash = await bcrypt.hash(newPassword, 12);
    await User.setPassword(user.id, password_hash);

    const freshUser = await User.findById(user.id);
    const token = signToken(freshUser);

    res.json({
      message: "Đặt lại mật khẩu thành công",
      token,
      user: {
        id: freshUser.id,
        name: freshUser.name,
        email: freshUser.email,
        role: freshUser.role,
      },
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── GOOGLE OAUTH CALLBACK ───────────────────────────────────
// GET /api/auth/google/callback  (do Passport gọi)
const googleCallback = async (req, res) => {
  try {
    const { id, displayName, emails } = req.user; // từ passport profile
    const email = emails[0].value;
    const google_id = id;

    // Tìm user theo google_id
    let user = await User.findByGoogleId(google_id);

    if (!user) {
      // Tìm theo email — nếu đã register bằng email/pass thì link Google vào
      const byEmail = await User.findByEmail(email);
      if (byEmail) {
        await User.updateGoogleId(byEmail.id, google_id);
        user = await User.findById(byEmail.id);
      } else {
        // Tạo tài khoản mới
        const newId = await User.createWithGoogle({
          name: displayName,
          email,
          google_id,
        });
        user = await User.findById(newId);
      }
    }

    const token = signToken(user);

    // Redirect về frontend kèm token
    res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  } catch (err) {
    console.error("googleCallback error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth?error=oauth_failed`);
  }
};

// ─── GET ME ──────────────────────────────────────────────────
// GET /api/auth/me  (cần JWT)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── UPDATE ME ───────────────────────────────────────────────
// PATCH /api/auth/me  (cần JWT)
// Body: { name?, phone?, address? }
// Cập nhật hồ sơ thật vào DB — thay cho việc chỉ lưu ở localStorage
// (updateUser() phía frontend). name/phone/address dùng chung cho mục
// đích ship thẻ NFC vật lý nên cần chính xác, có validate độ dài/định
// dạng cơ bản ở đây; validate chi tiết hơn (vd bắt buộc điền trước khi
// đặt hàng) nên làm ở tầng order khi module đó được xây.
const PHONE_REGEX = /^[0-9+()\-.\s]{8,20}$/;

const updateMe = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const patch = {};

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed)
        return res
          .status(400)
          .json({ message: "Họ và tên không được để trống" });
      if (trimmed.length > 100)
        return res
          .status(400)
          .json({ message: "Họ và tên quá dài (tối đa 100 ký tự)" });
      patch.name = trimmed;
    }

    if (phone !== undefined) {
      const trimmed = String(phone).trim();
      if (trimmed && !PHONE_REGEX.test(trimmed))
        return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
      patch.phone = trimmed || null;
    }

    if (address !== undefined) {
      const trimmed = String(address).trim();
      if (trimmed.length > 500)
        return res
          .status(400)
          .json({ message: "Địa chỉ quá dài (tối đa 500 ký tự)" });
      patch.address = trimmed || null;
    }

    if (!Object.keys(patch).length)
      return res
        .status(400)
        .json({ message: "Không có thông tin nào để cập nhật" });

    await User.updateProfile(req.user.id, patch);
    const user = await User.findById(req.user.id);

    res.json({ message: "Cập nhật hồ sơ thành công", user });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── UPLOAD AVATAR ───────────────────────────────────────────
// POST /api/auth/me/avatar  (cần JWT)
// Form-data: file (ảnh)
// Dùng riêng multer/Cloudinary helper có sẵn ở middleware/upload +
// config/cloudinary (vốn dùng cho album_media) nhưng KHÔNG ghi vào bảng
// album_media — chỉ lưu URL thẳng vào users.avatar_url, vì avatar không
// thuộc album/tỉnh nào cả.
const uploadAvatar = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadSingle);

    if (!req.file)
      return res.status(400).json({ message: "Không tìm thấy file ảnh" });

    if (!req.file.mimetype.startsWith("image/"))
      return res
        .status(400)
        .json({
          message: "Ảnh đại diện chỉ chấp nhận file ảnh (jpg, png, webp, gif)",
        });

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "vinatap/avatars",
          public_id: `user_${req.user.id}`, // ghi đè avatar cũ của cùng user thay vì tạo file rác mới mỗi lần đổi
          overwrite: true,
          resource_type: "image",
          transformation: [
            { width: 300, height: 300, crop: "fill", gravity: "face" },
          ],
        },
        (err, result) => (err ? reject(err) : resolve(result)),
      );
      stream.end(req.file.buffer);
    });

    await User.updateProfile(req.user.id, { avatar_url: uploaded.secure_url });
    const user = await User.findById(req.user.id);

    res.json({ message: "Cập nhật ảnh đại diện thành công", user });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    res
      .status(500)
      .json({ message: "Lỗi upload ảnh đại diện: " + err.message });
  }
};

module.exports = {
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
};
