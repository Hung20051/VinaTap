// Dùng SAU middleware protect
// Ví dụ: router.delete('/:id', protect, requireRole('admin'), controller)

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    if (!roles.includes(req.user.role))
      return res
        .status(403)
        .json({ message: "Không có quyền thực hiện thao tác này" });

    next();
  };

module.exports = { requireRole };
