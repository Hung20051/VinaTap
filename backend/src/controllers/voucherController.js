const Voucher = require("../models/Voucher");
const Notification = require("../models/Notification");

// 🛍️ Lấy Ví Voucher của khách hàng đang đăng nhập
exports.getMyWallet = async (req, res) => {
  try {
    const data = await Voucher.getUserWallet(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎟️ Nhập mã quà tặng đổi Voucher lưu vào Ví
exports.redeemCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Vui lòng nhập mã Voucher" });
    }
    const voucher = await Voucher.redeemCode(req.user.id, code);
    res.json({ message: "Đã lưu Voucher vào Ví thành công!", voucher });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 👑 Admin: Lấy toàn bộ Voucher
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.getAllAdmin();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👑 Admin: Tạo Voucher mới
exports.createVoucher = async (req, res) => {
  try {
    const { code, title, discount_type, discount_value } = req.body;
    if (!code || !title || discount_value === undefined) {
      return res.status(400).json({ message: "Thiếu thông tin tạo Voucher" });
    }

    const voucher = await Voucher.createAdmin(req.body);
    res.status(201).json({ message: "Tạo Voucher thành công!", voucher });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 👑 Admin: Tặng Voucher cho Khách Hàng + Bắn Thông Báo 🔔
exports.sendVoucherToUsers = async (req, res) => {
  try {
    const { voucherId, targetType, userIds, sendNotification = true } = req.body;
    if (!voucherId) {
      return res.status(400).json({ message: "Thiếu mã Voucher cần tặng" });
    }

    const count = await Voucher.sendToUsers(voucherId, targetType, userIds);

    // Tự động bắn thông báo cho khách hàng nhận được quà
    if (sendNotification && count > 0) {
      await Notification.send({
        recipient_type: targetType === "all" ? "all" : "users",
        user_ids: targetType === "all" ? [] : userIds,
        type: "promo",
        title: "🎁 Bạn Nhận Được Voucher Quà Tặng Mới!",
        content: `Chúc mừng bạn! VinaTap vừa tặng bạn 1 Voucher ưu đãi mới vào Ví Voucher. Mở Ví xem ngay!`,
        link: "/shop",
        created_by: req.user.id,
      });
    }

    res.json({
      message: `Đã tặng Voucher thành công cho ${count} khách hàng!`,
      count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
