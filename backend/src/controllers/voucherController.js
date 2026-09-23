const Voucher = require("../models/Voucher");
const Notification = require("../models/Notification");
const db = require("../config/db");

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

// 🎁 Khách hàng nhận / lưu Voucher từ thông báo hoặc click nhận
exports.claimVoucher = async (req, res) => {
  try {
    const { voucherId, code } = req.body;
    if (!voucherId && !code) {
      return res.status(400).json({ message: "Thiếu thông tin mã Voucher cần nhận" });
    }
    const result = await Voucher.claimVoucher({
      userId: req.user.id,
      voucherId,
      code,
    });
    res.json(result);
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
    const { voucherId, targetType, userIds, groupTarget, sendNotification = true } = req.body;
    if (!voucherId) {
      return res.status(400).json({ message: "Thiếu mã Voucher cần tặng" });
    }

    const [vRows] = await db.execute(`SELECT * FROM vouchers WHERE id = ? LIMIT 1`, [voucherId]);
    if (vRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy thông tin Voucher" });
    }
    const voucher = Voucher.formatVoucher(vRows[0]);

    const { count, recipientIds } = await Voucher.sendToUsers(voucherId, targetType, userIds, groupTarget);

    // Tự động bắn thông báo cho đúng các khách hàng nhận được quà
    if (sendNotification && recipientIds && recipientIds.length > 0) {
      await Notification.send({
        recipient_type: targetType === "all" ? "all" : (targetType === "group" ? "group" : "users"),
        group_target: groupTarget || null,
        user_ids: targetType === "users" ? recipientIds : undefined,
        type: "promo",
        title: `🎁 Quà Tặng: Voucher ${voucher.discountText || voucher.title}!`,
        content: `Chúc mừng bạn! VinaTap vừa tặng bạn Voucher "${voucher.code}" (${voucher.discountText || voucher.title}) vào Ví Voucher. Nhận ngay để mua sắm!`,
        payload: {
          voucher_id: voucher.id,
          voucher_code: voucher.code,
          discount_amount: voucher.discountText,
          discount_type: voucher.discount_type,
          title: voucher.title,
        },
        link: "/shop",
        created_by: req.user.id,
      });
    }

    res.json({
      message: `Đã tặng Voucher thành công cho ${count} tài khoản!`,
      count,
      recipientIds,
      voucher,
    });
  } catch (err) {
    console.error("sendVoucherToUsers error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 👑 Admin: Xóa Voucher khỏi hệ thống
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    await Voucher.deleteAdmin(id);
    res.json({ success: true, message: "Đã xóa voucher thành công!" });
  } catch (err) {
    console.error("deleteVoucher error:", err);
    res.status(500).json({ message: err.message || "Lỗi xóa voucher" });
  }
};

