const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Escape HTML — ngăn injection khi nhúng input người dùng vào email
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const BASE = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── SHARE ALBUM ─────────────────────────────────────────────
const sendShareRequestEmail = async (
  toEmail,
  { ownerName, requesterName, albumTitle, albumId },
) => {
  const safe = {
    owner: escapeHtml(ownerName),
    requester: escapeHtml(requesterName),
    album: escapeHtml(albumTitle),
  };
  await transporter.sendMail({
    from: `"VinaTap" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${safe.requester} muốn cùng đóng góp vào album "${safe.album}"`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#e85d04">🗺 VinaTap</h2>
        <p>Xin chào <b>${safe.owner}</b>,</p>
        <p><b>${safe.requester}</b> vừa gửi yêu cầu xin quyền thêm ảnh vào album <b>"${safe.album}"</b> của bạn.</p>
        <a href="${BASE}/dashboard"
           style="display:inline-block;padding:10px 20px;background:#e85d04;color:#fff;border-radius:6px;text-decoration:none;margin-top:12px">
          Xem và duyệt yêu cầu
        </a>
        <p style="color:#999;font-size:12px;margin-top:20px">VinaTap © 2025</p>
      </div>`,
  });
};

const sendShareApprovedEmail = async (
  toEmail,
  { userName, albumTitle, albumId },
) => {
  const safe = { user: escapeHtml(userName), album: escapeHtml(albumTitle) };
  await transporter.sendMail({
    from: `"VinaTap" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Bạn đã được duyệt quyền edit album "${safe.album}"`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#e85d04">🗺 VinaTap</h2>
        <p>Xin chào <b>${safe.user}</b>,</p>
        <p>Yêu cầu của bạn đã được chấp nhận! Bạn có thể thêm ảnh vào album <b>"${safe.album}"</b> ngay bây giờ.</p>
        <a href="${BASE}/album/${albumId}"
           style="display:inline-block;padding:10px 20px;background:#e85d04;color:#fff;border-radius:6px;text-decoration:none;margin-top:12px">
          Mở album
        </a>
        <p style="color:#999;font-size:12px;margin-top:20px">VinaTap © 2025</p>
      </div>`,
  });
};

// ─── OTP ─────────────────────────────────────────────────────
const OTP_COPY = {
  register: {
    subject: "Mã xác thực đăng ký tài khoản VinaTap",
    heading: "Xác thực đăng ký tài khoản",
    intro:
      "Bạn (hoặc ai đó dùng email này) vừa yêu cầu đăng ký tài khoản VinaTap.",
  },
  forgot_password: {
    subject: "Mã xác thực đặt lại mật khẩu VinaTap",
    heading: "Đặt lại mật khẩu",
    intro:
      "Bạn (hoặc ai đó dùng email này) vừa yêu cầu đặt lại mật khẩu VinaTap.",
  },
};

const sendOtpEmail = async (toEmail, { otp, purpose, minutes = 10 }) => {
  const copy = OTP_COPY[purpose] || OTP_COPY.register;
  await transporter.sendMail({
    from: `"VinaTap" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: copy.subject,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#e85d04">🗺 VinaTap</h2>
        <p>${copy.intro}</p>
        <p>Mã xác thực (OTP) của bạn là:</p>
        <div style="font-size:32px;font-weight:800;letter-spacing:8px;
                    background:#f5f5f4;padding:16px 20px;border-radius:10px;
                    text-align:center;color:#0f172a;margin:16px 0">
          ${otp}
        </div>
        <p style="color:#666;font-size:14px">
          Mã có hiệu lực trong ${minutes} phút. Không chia sẻ mã này cho bất kỳ ai,
          kể cả nhân viên VinaTap.
        </p>
        <p style="color:#999;font-size:12px;margin-top:20px">
          Nếu không phải bạn thực hiện yêu cầu này, vui lòng bỏ qua email.
        </p>
        <p style="color:#999;font-size:12px">VinaTap © 2025</p>
      </div>`,
  });
};

// ─── CHUYỂN NHƯỢNG THẺ ───────────────────────────────────────
const sendTransferRequestEmail = async (
  toEmail,
  { senderName, provinceName, token, note },
) => {
  const safe = {
    sender: escapeHtml(senderName),
    province: escapeHtml(provinceName),
    note: escapeHtml(note || ""),
  };
  const acceptUrl = `${BASE}/transfer/accept?token=${token}`;
  await transporter.sendMail({
    from: `"VinaTap" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${safe.sender} muốn tặng bạn mảnh ghép "${safe.province}"`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#e85d04">🗺 VinaTap</h2>
        <p><b>${safe.sender}</b> muốn chuyển nhượng mảnh ghép NFC tỉnh <b>${safe.province}</b> cho bạn.</p>
        ${safe.note ? `<p style="color:#666;font-style:italic">"${safe.note}"</p>` : ""}
        <p>Bấm nút bên dưới để nhận thẻ (link có hiệu lực trong <b>7 ngày</b>):</p>
        <a href="${acceptUrl}"
           style="display:inline-block;padding:12px 24px;background:#e85d04;color:#fff;
                  border-radius:8px;text-decoration:none;margin-top:12px;font-weight:700">
          Nhận mảnh ghép ${safe.province}
        </a>
        <p style="color:#999;font-size:11px;margin-top:24px">
          Nếu bạn không biết về yêu cầu này, hãy bỏ qua email này.
        </p>
        <p style="color:#999;font-size:12px">VinaTap © 2025</p>
      </div>`,
  });
};

const sendTransferAcceptedEmail = async (
  toEmail,
  { ownerName, recipientName },
) => {
  const safe = {
    owner: escapeHtml(ownerName),
    recipient: escapeHtml(recipientName),
  };
  await transporter.sendMail({
    from: `"VinaTap" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${safe.recipient} đã nhận mảnh ghép của bạn`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#e85d04">🗺 VinaTap</h2>
        <p>Xin chào <b>${safe.owner}</b>,</p>
        <p><b>${safe.recipient}</b> đã chấp nhận nhận mảnh ghép NFC từ bạn. Chuyển nhượng hoàn tất!</p>
        <a href="${BASE}/dashboard"
           style="display:inline-block;padding:10px 20px;background:#e85d04;color:#fff;
                  border-radius:6px;text-decoration:none;margin-top:12px">
          Xem Dashboard
        </a>
        <p style="color:#999;font-size:12px;margin-top:20px">VinaTap © 2025</p>
      </div>`,
  });
};

module.exports = {
  sendShareRequestEmail,
  sendShareApprovedEmail,
  sendOtpEmail,
  sendTransferRequestEmail,
  sendTransferAcceptedEmail,
};
