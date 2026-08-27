const jwt = require("jsonwebtoken");
const db = require("../config/db");

// JWT chỉ chứng minh token được ký hợp lệ tại THỜI ĐIỂM ĐĂNG NHẬP, không
// phản ánh trạng thái tài khoản hiện tại. Nếu chỉ verify chữ ký, một tài
// khoản bị admin "ban" hoặc đổi role sau khi đã đăng nhập vẫn dùng được
// bình thường cho tới khi token hết hạn (mặc định 7 ngày). Hàm này query
// lại DB 1 lần để lấy status + role mới nhất, chặn ngay nếu đã bị khóa.
const getFreshUser = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, role, status FROM users WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
};

// Bắt buộc phải có JWT hợp lệ VÀ tài khoản còn active
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ message: "Chưa đăng nhập" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getFreshUser(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Tài khoản không tồn tại" });

    if (user.status !== "active")
      return res
        .status(403)
        .json({ message: "Tài khoản đã bị khóa hoặc vô hiệu hóa" });

    req.user = { id: user.id, role: user.role }; // role lấy mới nhất từ DB, không tin theo token cũ

    next();
  } catch (err) {
    console.error("[AUTH PROTECT ERROR]:", err.name, err.message);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Cho phép cả có lẫn không có JWT
// Nếu có JWT hợp lệ VÀ tài khoản còn active thì gắn req.user, ngược lại
// (không có token, token lỗi, hoặc tài khoản đã bị khóa) vẫn cho đi tiếp
// như guest chứ không chặn — route dùng middleware này (vd xem album công
// khai) vốn cho phép cả guest truy cập.
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getFreshUser(decoded.id);
      if (user && user.status === "active") {
        req.user = { id: user.id, role: user.role };
      }
    }
  } catch (_) {
    // token lỗi → coi như guest, không chặn
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Yêu cầu quyền Quản trị viên (Admin)" });
  }
  next();
};

module.exports = { protect, optionalAuth, requireAdmin };
