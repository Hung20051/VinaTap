const User = require("../models/User");

// GET /api/users?search=&role=&limit=&offset=
const getAllUsers = async (req, res) => {
  try {
    const { search, role, limit, offset } = req.query;
    const [users, total] = await Promise.all([
      User.findAllForAdmin({ search, role, limit, offset }),
      User.countForAdmin({ search, role }),
    ]);
    res.json({ users, total });
  } catch (err) {
    console.error("getAllUsers:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /api/users/:id/status  Body: { status: "active" | "banned" }
const setUserStatus = async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    // Chặn admin tự khóa chính tài khoản đang đăng nhập của mình — nếu
    // không chặn, admin bấm nhầm sẽ tự mất quyền truy cập, phải sửa
    // thẳng DB mới vào lại được. Chặn ở đây (backend) chứ không chỉ ở
    // UI, vì disable nút chỉ ngăn được người dùng bình thường, không
    // ngăn được ai gọi thẳng API.
    if (targetId === req.user.id) {
      return res
        .status(400)
        .json({ message: "Không thể tự khóa tài khoản đang đăng nhập" });
    }

    const { status } = req.body;
    if (!["active", "banned"].includes(status)) {
      return res.status(400).json({ message: "status không hợp lệ" });
    }

    const target = await User.findById(targetId);
    if (!target)
      return res.status(404).json({ message: "Không tìm thấy user" });

    await User.setStatus(targetId, status);
    res.json({ message: "Đã cập nhật trạng thái" });
  } catch (err) {
    console.error("setUserStatus:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /api/users/:id/role  Body: { role: "admin" | "customer" }
const setUserRole = async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    // Chặn tương tự — admin tự hạ role chính mình xuống customer sẽ tự
    // mất quyền truy cập /admin ngay lập tức (middleware requireRole
    // check lại DB mỗi request, không đợi token hết hạn).
    if (targetId === req.user.id) {
      return res
        .status(400)
        .json({ message: "Không thể tự đổi quyền tài khoản đang đăng nhập" });
    }

    const { role } = req.body;
    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({ message: "role không hợp lệ" });
    }

    const target = await User.findById(targetId);
    if (!target)
      return res.status(404).json({ message: "Không tìm thấy user" });

    await User.setRole(targetId, role);
    res.json({ message: "Đã cập nhật quyền" });
  } catch (err) {
    console.error("setUserRole:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /api/users/:id/detail
const getUserDetail = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const detail = await User.getDetailForAdmin(targetId);
    if (!detail)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(detail);
  } catch (err) {
    console.error("getUserDetail:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { getAllUsers, setUserStatus, setUserRole, getUserDetail };
