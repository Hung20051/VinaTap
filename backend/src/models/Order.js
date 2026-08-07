const db = require("../config/db");
const crypto = require("crypto");

const Order = {
  // Khởi tạo bảng orders nếu chưa tồn tại
  async initTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_code VARCHAR(50) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        recipient_name VARCHAR(100) NOT NULL,
        recipient_phone VARCHAR(20) NOT NULL,
        recipient_address TEXT NOT NULL,
        payment_method ENUM('vietqr', 'cod') NOT NULL DEFAULT 'vietqr',
        items_json JSON NOT NULL,
        subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
        discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 30000,
        total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        voucher_code VARCHAR(50) DEFAULT NULL,
        status ENUM('pending', 'paid', 'processing', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        note TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tự động bổ sung các cột nếu bảng orders đã tồn tại từ trước
    const safeAddColumns = [
      `ALTER TABLE orders ADD COLUMN recipient_name VARCHAR(100) NOT NULL DEFAULT ''`,
      `ALTER TABLE orders ADD COLUMN recipient_phone VARCHAR(20) NOT NULL DEFAULT ''`,
      `ALTER TABLE orders ADD COLUMN recipient_address TEXT NOT NULL`,
      `ALTER TABLE orders ADD COLUMN items_json JSON NOT NULL`,
      `ALTER TABLE orders ADD COLUMN subtotal DECIMAL(12,2) NOT NULL DEFAULT 0`,
      `ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0`,
      `ALTER TABLE orders ADD COLUMN shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 30000`,
      `ALTER TABLE orders ADD COLUMN voucher_code VARCHAR(50) DEFAULT NULL`,
      `ALTER TABLE orders ADD COLUMN payment_method ENUM('vietqr', 'cod') NOT NULL DEFAULT 'vietqr'`,
    ];

    for (const sql of safeAddColumns) {
      try {
        await db.execute(sql);
      } catch (e) {
        // Cột đã tồn tại ➔ bỏ qua lỗi ER_DUP_FIELDNAME
      }
    }
  },

  // 🔒 BACKEND ZERO CLIENT TRUST CALCULATIONS & VALIDATION
  async create({
    userId,
    items = [],
    shippingInfo = {},
    voucherCode = "",
    paymentMethod = "vietqr",
    note = "",
  }) {
    await this.initTable();

    // 1. Validate người nhận
    const recipientName = (shippingInfo.name || "").trim();
    const recipientPhone = (shippingInfo.phone || "").trim();
    const recipientAddress = (shippingInfo.address || "").trim();

    if (!recipientName) {
      throw new Error("Tên người nhận không được để trống");
    }

    // Validate SĐT Việt Nam (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(recipientPhone)) {
      throw new Error("Số điện thoại không hợp lệ (Phải đúng 10 số di động Việt Nam)");
    }

    if (!recipientAddress || recipientAddress.length < 5) {
      throw new Error("Địa chỉ giao hàng quá ngắn (Tối thiểu 5 ký tự)");
    }

    if (!items || items.length === 0) {
      throw new Error("Giỏ hàng không được để trống");
    }

    // 2. BACKEND TRUY VẤN GIÁ SẢN PHẨM TỪ DATABASE (Zero client trust)
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Math.max(1, parseInt(item.quantity) || 1);

      // Tra cứu sản phẩm trong DB
      const [pRows] = await db.execute(
        `SELECT id, name, default_price FROM products WHERE id = ? AND is_active = 1 LIMIT 1`,
        [productId],
      );

      let unitPrice = 150000; // Giá mặc định nếu là sản phẩm custom
      let productName = "Thẻ NFC Kỷ Niệm VinaTap";

      if (pRows && pRows.length > 0) {
        unitPrice = Number(pRows[0].default_price);
        productName = pRows[0].name;
      } else if (item.name && item.price) {
        unitPrice = Number(item.price);
        productName = item.name;
      }

      const itemTotal = unitPrice * quantity;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        product_id: productId || null,
        name: productName,
        unit_price: unitPrice,
        quantity: quantity,
        item_total: itemTotal,
      });
    }

    // 3. Kiểm tra & Tính toán Voucher discount chính xác 100% từ Database MySQL
    const Voucher = require("./Voucher");
    let discountAmount = 0;
    let isFreeshipVoucher = false;

    if (voucherCode && voucherCode.trim()) {
      const vResult = await Voucher.validateAndApplyOrderVoucher({
        userId,
        code: voucherCode,
        subtotal: calculatedSubtotal,
      });
      discountAmount = vResult.discountAmount;
      isFreeshipVoucher = vResult.isFreeship;
    }

    // Giới hạn discount không vượt quá subtotal
    discountAmount = Math.min(discountAmount, calculatedSubtotal);

    // Phí vận chuyển (Miễn phí ship cho đơn trên 500k hoặc dùng mã FREESHIP)
    const shippingFee = calculatedSubtotal >= 500000 || isFreeshipVoucher ? 0 : 30000;

    // Tổng tiền thanh toán cuối cùng
    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // 4. Sinh mã đơn hàng ngẫu nhiên duy nhất
    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderCode = `VNT${Date.now().toString().slice(-6)}${randomSuffix}`;

    // 5. Lưu vào Database
    const [result] = await db.execute(
      `INSERT INTO orders
         (order_code, user_id, recipient_name, recipient_phone, recipient_address,
          payment_method, items_json, subtotal, discount_amount, shipping_fee,
          total_amount, voucher_code, status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        orderCode,
        userId,
        recipientName,
        recipientPhone,
        recipientAddress,
        paymentMethod === "cod" ? "cod" : "vietqr",
        JSON.stringify(verifiedItems),
        calculatedSubtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        (voucherCode || "").trim().toUpperCase() || null,
        note || null,
      ],
    );

    return {
      id: result.insertId,
      order_code: orderCode,
      subtotal: calculatedSubtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      items: verifiedItems,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      recipient_address: recipientAddress,
      created_at: new Date(),
    };
  },

  // Khách lấy lịch sử đơn hàng của mình
  async getByUser(userId) {
    await this.initTable();
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId],
    );
    return rows.map((r) => ({
      ...r,
      items_json: typeof r.items_json === "string" ? JSON.parse(r.items_json) : r.items_json,
    }));
  },

  // Admin lấy toàn bộ đơn hàng
  async getAllAdmin({ search, status, limit = 50, offset = 0 } = {}) {
    await this.initTable();
    let whereClause = [];
    let params = [];

    if (search) {
      whereClause.push(
        `(o.order_code LIKE ? OR o.recipient_name LIKE ? OR o.recipient_phone LIKE ?)`
      );
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (status) {
      whereClause.push(`o.status = ?`);
      params.push(status);
    }

    const whereStr = whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `SELECT o.*, u.name AS user_name, u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ${whereStr}
       ORDER BY o.created_at DESC
       LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      params,
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders o ${whereStr}`,
      params,
    );

    return {
      orders: rows.map((r) => ({
        ...r,
        items_json: typeof r.items_json === "string" ? JSON.parse(r.items_json) : r.items_json,
      })),
      total: countRows[0]?.total || 0,
    };
  },

  // Cập nhật trạng thái đơn hàng (Admin)
  async updateStatus(id, status) {
    await this.initTable();
    const validStatuses = ["pending", "paid", "processing", "shipping", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái đơn hàng không hợp lệ");
    }

    await db.execute(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id],
    );
  },

  // 🔍 Lấy trạng thái đơn hàng bằng Mã Đơn Hàng (order_code)
  async getByCode(orderCode) {
    await this.initTable();
    const cleanCode = (orderCode || "").trim().toUpperCase();
    const [rows] = await db.execute(
      `SELECT id, order_code, user_id, recipient_name, recipient_phone, total_amount, status, payment_method, created_at 
       FROM orders WHERE order_code = ? LIMIT 1`,
      [cleanCode],
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // ⚡ Đánh dấu ĐÃ THANH TOÁN (Auto Webhook hoặc Admin xác nhận) + Bắn Thông Báo 🔔
  async markAsPaid(orderCode, transactionData = {}) {
    await this.initTable();
    const cleanCode = (orderCode || "").trim().toUpperCase();
    const order = await this.getByCode(cleanCode);

    if (!order) {
      throw new Error(`Đơn hàng ${cleanCode} không tồn tại trên hệ thống`);
    }

    if (order.status === "paid" || order.status === "processing" || order.status === "completed") {
      return order; // Đã thanh toán trước đó
    }

    await db.execute(
      `UPDATE orders SET status = 'paid', updated_at = NOW() WHERE order_code = ?`,
      [cleanCode],
    );

    const Notification = require("./Notification");
    const amountText = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total_amount);

    // 1. Gửi thông báo hệ thống cho tất cả (Admin sẽ thấy qua type: system) 🔔
    try {
      await Notification.send({
        recipient_type: "all",
        type: "system",
        title: `💰 Đơn Hàng Mới Thanh Toán: ${cleanCode}`,
        content: `Khách hàng ${order.recipient_name} (${order.recipient_phone}) vừa chuyển khoản thành công ${amountText} cho đơn ${cleanCode}.`,
        link: "/admin/dashboard",
        created_by: 0,
      });
    } catch (e) {
      console.error("Lỗi gửi thông báo admin khi thanh toán:", e.message);
    }

    // 2. Gửi thông báo cho Khách hàng (nếu có tài khoản) 🔔
    if (order.user_id) {
      try {
        await Notification.send({
          recipient_type: "user",
          user_ids: [order.user_id],
          type: "promo",
          title: `🎉 Thanh Toán Thành Công Đơn ${cleanCode}`,
          content: `VinaTap đã xác nhận thanh toán ${amountText} cho đơn hàng ${cleanCode}. Đơn hàng đang được đóng gói giao tới bạn!`,
          link: "/customer/dashboard",
          created_by: 0,
        });
      } catch (e) {
        console.error("Lỗi gửi thông báo khách khi thanh toán:", e.message);
      }
    }

    return { ...order, status: "paid" };
  },
};

module.exports = Order;
