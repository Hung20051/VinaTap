const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OtpCode = require("../models/OtpCode");
const SystemSetting = require("../models/SystemSetting");
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tạo JWT token
const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET chưa được cấu hình trong biến môi trường (.env)");
  }
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

// Rút gọn user object trả ra ngoài API — loại bỏ password_hash/google_id
// (nhạy cảm), giữ lại MỌI field còn lại (kể cả phone/address/avatar_url).
// Trước đây login()/verifyRegisterOtp()/resetPassword() tự tay liệt kê
// {id, name, email, role} — thiếu mất phone/address/avatar_url, khiến
// mỗi lần đăng nhập lại (ghi đè localStorage bằng response này) avatar
// biến mất dù DB vẫn còn nguyên, phải đợi 1 lần gọi /auth/me khác mới
// tự khôi phục lại. Dùng chung hàm này để không lặp lại lỗi tương tự.
const toPublicUser = (user) => {
  if (!user) return null;
  const { password_hash, google_id, ...publicData } = user;
  return publicData;
};

// ⚠️ ĐÃ XÓA: register() bằng email/mật khẩu thuần (không OTP) — tạo user
// ngay không xác minh email, bypass được luồng OTP bên dưới. Đăng ký giờ
// bắt buộc đi qua requestRegisterOtp/verifyRegisterOtp.
//
// login() vẫn giữ nguyên: đây KHÔNG tạo tài khoản mới, chỉ xác thực một
// tài khoản đã tồn tại (được tạo qua OTP hoặc Google) rồi cấp JWT — không
// phải lỗ hổng, và là endpoint frontend dùng thật mỗi lần người dùng đăng
// nhập lại.

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
      user: toPublicUser(user),
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: err.message || "Lỗi server" });
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
    const settings = await SystemSetting.getAll();
    if (settings.allow_registration === "false") {
      return res.status(403).json({
        message: "Hệ thống hiện đang tạm ngưng mở đăng ký tài khoản mới!",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });

    if (!EMAIL_REGEX.test(email))
      return res.status(400).json({ message: "Định dạng email không hợp lệ" });

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
      user: toPublicUser(user),
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

    if (!EMAIL_REGEX.test(email))
      return res.status(400).json({ message: "Định dạng email không hợp lệ" });

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

    // resetToken dùng secret key riêng biệt (JWT_SECRET + "_reset_pwd") để
    // hoàn toàn tách biệt khỏi login token, đảm bảo không thể tráo đổi.
    const resetToken = jwt.sign(
      { email: user.email, purpose: "reset_password" },
      process.env.JWT_SECRET + "_reset_pwd",
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
      payload = jwt.verify(resetToken, process.env.JWT_SECRET + "_reset_pwd");
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
      user: toPublicUser(freshUser),
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
      // Tìm theo email KHÔNG lọc status — nếu dùng findByEmail (chỉ tìm
      // active) thì tài khoản đã bị khóa sẽ bị coi là "chưa tồn tại",
      // rơi xuống nhánh tạo mới bên dưới và vỡ UNIQUE(email) ở DB vì
      // email đó thật ra đã có (chỉ là đang banned).
      const byEmail = await User.findByEmailAny(email);
      if (byEmail && byEmail.status !== "active") {
        // Tài khoản email này đã bị khóa — không link Google, không tạo
        // mới đè lên, báo lỗi rõ ràng thay vì để crash ở bước INSERT.
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth?error=account_banned`,
        );
      }
      if (byEmail) {
        // Đã đăng ký bằng email/pass trước đó -> link Google vào tài khoản có sẵn
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

    res.json({ user: toPublicUser(user) });
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

    res.json({ message: "Cập nhật hồ sơ thành công", user: toPublicUser(user) });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ĐỔI MẬT KHẨU (khi đã đăng nhập) ──────────────────────────
// PATCH /api/auth/change-password  (cần JWT)
// Body: { currentPassword, newPassword }
// Khác với luồng "quên mật khẩu" (OTP qua email) — chỗ này yêu cầu nhập
// đúng mật khẩu HIỆN TẠI, dùng khi user vẫn nhớ mật khẩu và chỉ muốn đổi.
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mới" });
    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải ít nhất 6 ký tự" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Tài khoản đăng ký bằng Google thuần (chưa từng đặt mật khẩu) —
    // không có password_hash để so sánh, phải hướng qua "Quên mật khẩu"
    // (OTP) để ĐẶT mật khẩu lần đầu, không phải "đổi" mật khẩu đang có.
    //
    // LƯU Ý: User.findById() (bản trả ra ngoài API) không SELECT
    // password_hash — phải query lại qua findByEmail() (bản đầy đủ) để
    // có password_hash thật sự so sánh, nếu không sẽ luôn undefined và
    // rơi vào nhánh lỗi này bất kể tài khoản có mật khẩu hay chưa.
    const fullUser = await User.findByEmail(user.email);
    if (!fullUser || !fullUser.password_hash)
      return res.status(400).json({
        message:
          "Tài khoản này đăng nhập bằng Google, chưa có mật khẩu — dùng 'Quên mật khẩu' để đặt mật khẩu lần đầu",
      });

    const match = await bcrypt.compare(currentPassword, fullUser.password_hash);
    if (!match)
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });

    const password_hash = await bcrypt.hash(newPassword, 12);
    await User.setPassword(user.id, password_hash);

    res.json({ message: "Đã đổi mật khẩu thành công" });
  } catch (err) {
    console.error("changePassword error:", err);
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
      return res.status(400).json({
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

    res.json({ message: "Cập nhật ảnh đại diện thành công", user: toPublicUser(user) });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    res
      .status(500)
      .json({ message: "Lỗi upload ảnh đại diện: " + err.message });
  }
};

module.exports = {
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
};
