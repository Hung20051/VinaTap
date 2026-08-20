const db = require("../config/db");

const Voucher = {
  async initTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS vouchers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(50) NOT NULL UNIQUE,
          title VARCHAR(200) NOT NULL,
          description TEXT NULL,
          discount_type ENUM('percent', 'amount', 'freeship') NOT NULL DEFAULT 'percent',
          discount_value DECIMAL(12,2) NOT NULL DEFAULT 0,
          min_order_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
          max_discount_amount DECIMAL(12,2) NULL,
          usage_limit INT NULL,
          used_count INT NOT NULL DEFAULT 0,
          expires_at DATETIME NULL,
          status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_voucher_code (code),
          INDEX idx_voucher_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS user_vouchers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          voucher_id INT NOT NULL,
          status ENUM('available', 'used', 'expired') NOT NULL DEFAULT 'available',
          assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          used_at DATETIME NULL,
          UNIQUE KEY uq_user_voucher (user_id, voucher_id),
          INDEX idx_user_voucher_user (user_id),
          INDEX idx_user_voucher_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (err) {
      console.error("Voucher initTable error:", err.message);
    }
  },

  // 🛍️ Lấy danh sách Voucher trong Ví người dùng (+ Voucher công khai chưa lưu)
  async getUserWallet(userId) {

    // Query các voucher đã có trong ví của user (chỉ lấy voucher còn khả dụng)
    const [myRows] = await db.execute(
      `SELECT v.*, uv.status AS user_voucher_status, uv.assigned_at
       FROM user_vouchers uv
       JOIN vouchers v ON v.id = uv.voucher_id
       WHERE uv.user_id = ? AND v.status = 'active' AND uv.status = 'available'
       ORDER BY uv.assigned_at DESC`,
      [userId],
    );

    // Query các voucher công khai chưa hết hạn mà user chưa đổi
    const [publicRows] = await db.execute(
      `SELECT v.*
       FROM vouchers v
       WHERE v.status = 'active'
         AND (v.expires_at IS NULL OR v.expires_at >= NOW())
         AND (v.usage_limit IS NULL OR v.used_count < v.usage_limit)
         AND v.id NOT IN (
           SELECT voucher_id FROM user_vouchers WHERE user_id = ?
         )
       ORDER BY v.created_at DESC`,
      [userId],
    );

    return {
      myVouchers: myRows.map(this.formatVoucher),
      publicVouchers: publicRows.map(this.formatVoucher),
    };
  },

  // 🎟️ Đổi / Lưu mã voucher vào Ví cá nhân
  async redeemCode(userId, code) {
    const cleanCode = (code || "").trim().toUpperCase();

    const [vouchers] = await db.execute(
      `SELECT * FROM vouchers WHERE UPPER(code) = ? LIMIT 1`,
      [cleanCode],
    );

    if (vouchers.length === 0) {
      throw new Error("Mã Voucher không tồn tại hoặc không hợp lệ");
    }

    const voucher = vouchers[0];
    if (voucher.status !== "active") {
      throw new Error("Mã Voucher này đã bị vô hiệu hóa");
    }

    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      throw new Error("Mã Voucher này đã hết hạn sử dụng");
    }

    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      throw new Error("Mã Voucher này đã hết lượt sử dụng trên hệ thống");
    }

    // Kiểm tra xem user đã lưu mã này chưa
    const [exist] = await db.execute(
      `SELECT id FROM user_vouchers WHERE user_id = ? AND voucher_id = ? LIMIT 1`,
      [userId, voucher.id],
    );

    if (exist.length > 0) {
      throw new Error("Bạn đã lưu Voucher này trong Ví từ trước rồi");
    }

    await db.execute(
      `INSERT INTO user_vouchers (user_id, voucher_id, status) VALUES (?, ?, 'available')`,
      [userId, voucher.id],
    );

    return this.formatVoucher(voucher);
  },

  // 👑 Admin lấy danh sách toàn bộ Voucher
  async getAllAdmin() {
    const [rows] = await db.execute(
      `SELECT v.*, 
        (SELECT COUNT(*) FROM user_vouchers WHERE voucher_id = v.id) AS total_assigned
       FROM vouchers v
       ORDER BY v.id DESC`,
    );
    return rows.map(this.formatVoucher);
  },

  // 👑 Admin tạo Voucher mới
  async createAdmin(data) {
    const cleanCode = data.code.trim().toUpperCase();

    if (data.expires_at) {
      const expDate = new Date(data.expires_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate < today) {
        throw new Error("Hạn sử dụng Voucher không thể chọn ngày trong quá khứ!");
      }
    }

    const [result] = await db.execute(
      `INSERT INTO vouchers (
        code, title, description, discount_type, discount_value, 
        min_order_amount, max_discount_amount, usage_limit, expires_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanCode,
        data.title,
        data.description || null,
        data.discount_type || "percent",
        data.discount_value || 0,
        data.min_order_amount || 0,
        data.max_discount_amount || null,
        data.usage_limit || null,
        data.expires_at ? new Date(data.expires_at) : null,
        data.status || "active",
      ],
    );

    return { id: result.insertId, ...data, code: cleanCode };
  },

  // 👑 Admin xóa Voucher (xóa cả user_vouchers liên kết)
  async deleteAdmin(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(`DELETE FROM user_vouchers WHERE voucher_id = ?`, [id]);
      await conn.execute(`DELETE FROM vouchers WHERE id = ?`, [id]);
      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // 👑 Admin tặng Voucher cho danh sách User
  async sendToUsers(voucherId, targetType, userIds = []) {
    let targetUserIds = [];
    if (targetType === "all") {
      const [users] = await db.execute(`SELECT id FROM users WHERE status = 'active' AND role != 'admin'`);
      targetUserIds = users.map((u) => u.id);
    } else {
      targetUserIds = userIds;
    }

    if (targetUserIds.length === 0) return { count: 0, recipientIds: [] };

    const recipientIds = [];
    let count = 0;
    for (const uId of targetUserIds) {
      try {
        const [res] = await db.execute(
          `INSERT IGNORE INTO user_vouchers (user_id, voucher_id, status) VALUES (?, ?, 'available')`,
          [uId, voucherId],
        );
        if (res.affectedRows > 0) {
          recipientIds.push(uId);
          count++;
        }
      } catch (e) {}
    }
    return { count, recipientIds };
  },

  // Format Voucher thành object JSON chuẩn cho Frontend
  formatVoucher(v) {
    let isExpired = false;
    if (v.expires_at && new Date(v.expires_at) < new Date()) {
      isExpired = true;
    }

    let discountText = "";
    if (v.discount_type === "percent") {
      discountText = `Giảm ${v.discount_value}%`;
    } else if (v.discount_type === "amount") {
      discountText = `Giảm ${new Intl.NumberFormat("vi-VN").format(v.discount_value)}đ`;
    } else {
      discountText = "Free Ship";
    }

    return {
      ...v,
      discountText,
      isExpired,
      isPermanent: !v.expires_at,
    };
  },

  // 🛍️ CHỈ KIỂM TRA Voucher (Không tự động tăng used_count)
  // Dùng khi tạo đơn hàng để validate trước khi mở DB Transaction
  async validateOrderVoucherOnly({ userId, code, subtotal }) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) {
      return { discountAmount: 0, isFreeship: false, voucher: null };
    }

    const [rows] = await db.execute(
      `SELECT * FROM vouchers WHERE UPPER(code) = ? LIMIT 1`,
      [cleanCode],
    );

    if (rows.length === 0) {
      throw new Error(`Mã Voucher "${cleanCode}" không tồn tại trên hệ thống`);
    }

    const v = rows[0];

    if (v.status !== "active") {
      throw new Error(`Mã Voucher "${cleanCode}" hiện đang bị tạm khóa`);
    }

    if (v.expires_at && new Date(v.expires_at) < new Date()) {
      throw new Error(`Mã Voucher "${cleanCode}" đã hết hạn sử dụng`);
    }

    if (v.min_order_amount > 0 && subtotal < parseFloat(v.min_order_amount)) {
      const minText = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v.min_order_amount);
      throw new Error(`Mã Voucher "${cleanCode}" chỉ áp dụng cho đơn hàng từ ${minText} trở lên`);
    }

    if (v.usage_limit && v.used_count >= v.usage_limit) {
      throw new Error(`Mã Voucher "${cleanCode}" đã hết lượt sử dụng trên hệ thống`);
    }

    if (userId) {
      const [uvRows] = await db.execute(
        `SELECT status FROM user_vouchers WHERE user_id = ? AND voucher_id = ? LIMIT 1`,
        [userId, v.id],
      );
      if (uvRows.length > 0 && uvRows[0].status === "used") {
        throw new Error(`Bạn đã sử dụng mã Voucher "${cleanCode}" cho đơn hàng trước đó rồi!`);
      }

      // Chỉ chặn nếu người dùng đã có đơn hàng ĐÃ MUA THỰC SỰ dùng voucher này
      // (paid, processing, shipping, completed, hoặc COD pending)
      const [orderRows] = await db.execute(
        `SELECT id FROM orders 
         WHERE user_id = ? AND UPPER(voucher_code) = ? 
           AND (status IN ('paid', 'processing', 'shipping', 'completed') OR (payment_method = 'cod' AND status != 'cancelled'))
         LIMIT 1`,
        [userId, cleanCode],
      );
      if (orderRows.length > 0) {
        throw new Error(`Bạn đã sử dụng mã Voucher "${cleanCode}" cho đơn hàng trước đó rồi!`);
      }
    }

    let discountAmount = 0;
    let isFreeship = false;

    if (v.discount_type === "percent") {
      discountAmount = Math.round(subtotal * (parseFloat(v.discount_value) / 100));
      if (v.max_discount_amount) {
        discountAmount = Math.min(discountAmount, parseFloat(v.max_discount_amount));
      }
    } else if (v.discount_type === "amount") {
      discountAmount = parseFloat(v.discount_value);
    } else if (v.discount_type === "freeship") {
      isFreeship = true;
      discountAmount = 0;
    }

    return { discountAmount, isFreeship, voucher: v };
  },

  // ⚠️ ĐÃ XÓA: validateAndApplyOrderVoucher() — tăng used_count NGOÀI transaction.
  // Order.create() đã thay bằng validateOrderVoucherOnly() + tăng count TRONG
  // transaction để đảm bảo atomicity. Không dùng hàm này nữa.
};

module.exports = Voucher;
