const Notification = require("../models/Notification");

// Admin gửi thông báo
const sendNotification = async (req, res) => {
  try {
    const {
      recipient_type,
      group_target,
      user_ids,
      type,
      title,
      content,
      payload,
      link,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Vui lòng nhập Tiêu đề và Nội dung" });
    }

    const result = await Notification.send({
      recipient_type,
      group_target,
      user_ids,
      type,
      title,
      content,
      payload,
      link,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: "Đã gửi thông báo thành công",
      notificationId: result.notificationId,
    });
  } catch (err) {
    console.error("sendNotification error:", err);
    res.status(500).json({ message: "Lỗi gửi thông báo" });
  }
};

// Customer lấy danh sách thông báo cho mình
const getMyNotifications = async (req, res) => {
  try {
    const data = await Notification.getForUser(req.user.id, req.user.role);
    res.json(data);
  } catch (err) {
    console.error("getMyNotifications error:", err);
    res.status(500).json({ message: "Lỗi nạp thông báo" });
  }
};

// Customer đánh dấu đã đọc
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.markAsRead(notificationId || "all", req.user.id);
    res.json({ message: "Đã cập nhật trạng thái đọc" });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái đọc" });
  }
};

// Admin xem lịch sử đã gửi
const getAdminSentHistory = async (req, res) => {
  try {
    const history = await Notification.getAdminSentHistory();
    res.json({ history });
  } catch (err) {
    console.error("getAdminSentHistory error:", err);
    res.status(500).json({ message: "Lỗi nạp lịch sử thông báo" });
  }
};

// Admin xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    await Notification.delete(req.params.id);
    res.json({ message: "Đã xóa thông báo" });
  } catch (err) {
    console.error("deleteNotification error:", err);
    res.status(500).json({ message: "Lỗi xóa thông báo" });
  }
};

module.exports = {
  sendNotification,
  getMyNotifications,
  markAsRead,
  getAdminSentHistory,
  deleteNotification,
};
