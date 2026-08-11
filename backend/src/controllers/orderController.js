const Order = require("../models/Order");

// 🔒 BACKEND IN-MEMORY RATE-LIMITER CHỐNG SPAM TOOL / POSTMAN ATTACK
// Lưu lịch sử timestamp order gần nhất của từng userId
const userOrderTimestamps = new Map();

const isSpammingOrders = (userId) => {
  const now = Date.now();
  const timestamps = userOrderTimestamps.get(userId) || [];
  
  // Lọc các timestamp trong vòng 60 giây gần đây
  const recentTimestamps = timestamps.filter((t) => now - t < 60000);
  
  if (recentTimestamps.length >= 5) {
    return true; // Đã đặt > 5 đơn trong 60 giây ➔ Phát hiện spam!
  }

  recentTimestamps.push(now);
  userOrderTimestamps.set(userId, recentTimestamps);
  return false;
};

// 1. Tạo đơn hàng mới (Dành cho Khách Hàng)
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Chặn Spam Request / Postman Attack
    if (isSpammingOrders(userId)) {
      return res.status(429).json({
        message: "Bạn đang tạo quá nhiều đơn hàng liên tục. Vui lòng đợi 1 phút trước khi thử lại!",
      });
    }

    const { items, shippingInfo, voucherCode, paymentMethod, note } = req.body;

    const orderData = await Order.create({
      userId,
      items,
      shippingInfo,
      voucherCode,
      paymentMethod,
      note,
    });

    res.status(201).json({
      message: "Tạo đơn hàng thành công!",
      order: orderData,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(400).json({ message: err.message || "Lỗi tạo đơn hàng" });
  }
};

// 2. Khách xem danh sách đơn hàng của mình
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.getByUser(req.user.id);
    res.json({ orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ message: "Lỗi nạp danh sách đơn hàng" });
  }
};

// 3. Admin xem tất cả đơn hàng hệ thống
const getAdminOrders = async (req, res) => {
  try {
    const { search, status, limit, offset } = req.query;
    const data = await Order.getAllAdmin({ search, status, limit, offset });
    res.json(data);
  } catch (err) {
    console.error("getAdminOrders error:", err);
    res.status(500).json({ message: "Lỗi nạp danh sách đơn hàng Admin" });
  }
};

// 4. Admin cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.updateStatus(id, status);

    // Nếu Admin chuyển sang paid → bắn thông báo cho Admin & Khách
    if (status === "paid") {
      try {
        const [rows] = await require("../config/db").execute(
          `SELECT order_code FROM orders WHERE id = ? LIMIT 1`,
          [id],
        );
        if (rows.length > 0) {
          await Order.markAsPaid(rows[0].order_code);
        }
      } catch (notifErr) {
        console.error("Lỗi bắn thông báo khi Admin duyệt đơn:", notifErr.message);
      }
    }

    res.json({ message: `Đã cập nhật trạng thái đơn hàng #${id} sang ${status}` });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(400).json({ message: err.message || "Lỗi cập nhật đơn hàng" });
  }
};

// 5. Kiểm tra trạng thái đơn hàng (Auto-Polling từ Frontend / Tra cứu đơn)
const checkOrderStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await Order.getByCode(orderCode);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const isOwner = req.user && (req.user.id === order.user_id || req.user.role === "admin");

    res.json({
      order_code: order.order_code,
      status: order.status,
      ...(isOwner && {
        total_amount: order.total_amount,
        payment_method: order.payment_method,
      }),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Webhook Nhận Thông Báo Chuyển Khoản Tự Động (Sepay / Casso / MBBank Webhook)
const paymentWebhook = async (req, res) => {
  try {
    // 🔒 1. Xác thực Webhook bằng Secret Key
    const sepayKey = process.env.SEPAY_WEBHOOK_KEY;
    if (sepayKey && sepayKey !== "your_sepay_webhook_api_key_here") {
      const authHeader = req.headers["authorization"] || req.headers["x-api-key"] || "";
      const isApikeyMatch =
        authHeader === `Apikey ${sepayKey}` ||
        authHeader === sepayKey ||
        req.query.apikey === sepayKey;

      if (!isApikeyMatch) {
        return res.status(401).json({ status: "error", message: "Unauthorized Webhook Request" });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        status: "error",
        message: "Webhook Secret Key chưa được cấu hình trên môi trường Production",
      });
    }

    const payload = req.body || {};
    const content = payload.content || payload.description || payload.transferContent || "";

    // 🔍 2. Tìm mã đơn VNTxxxxxx trong nội dung chuyển khoản
    const match = content.match(/VNT[A-Z0-9]{12,18}/i);
    if (!match) {
      return res.status(200).json({ status: "ignored", message: "Không tìm thấy mã đơn VNT" });
    }

    const orderCode = match[0].toUpperCase();
    const order = await Order.getByCode(orderCode);

    if (!order) {
      return res.status(404).json({ status: "error", message: `Không tìm thấy đơn hàng ${orderCode}` });
    }

    // 💰 3. Kiểm tra số tiền chuyển thực tế (chống chuyển thiếu tiền)
    const transferAmount = Number(payload.transferAmount || payload.amountIn || payload.amount || 0);
    if (transferAmount > 0 && transferAmount < Number(order.total_amount)) {
      return res.status(400).json({
        status: "error",
        message: `Số tiền chuyển (${transferAmount}đ) không đủ so với tổng giá trị đơn hàng (${order.total_amount}đ)`,
      });
    }

    // ✅ 4. Cập nhật trạng thái đơn sang "paid"
    const result = await Order.markAsPaid(orderCode, payload);

    res.json({
      status: "success",
      message: `Đã xác nhận thanh toán tự động cho đơn ${orderCode}!`,
      order: result,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
  checkOrderStatus,
  paymentWebhook,
};
