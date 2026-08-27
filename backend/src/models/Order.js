const db = require("../config/db");
const crypto = require("crypto");

const Order = {
  // 🔒 BACKEND ZERO CLIENT TRUST CALCULATIONS & VALIDATION
  async create({
    userId,
    items = [],
    shippingInfo = {},
    voucherCode = "",
    paymentMethod = "vietqr",
    note = "",
  }) {
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
      throw new Error(
        "Số điện thoại không hợp lệ (Phải đúng 10 số di động Việt Nam)",
      );
    }

    if (!recipientAddress || recipientAddress.length < 5) {
      throw new Error("Địa chỉ giao hàng quá ngắn (Tối thiểu 5 ký tự)");
    }

    if (!items || items.length === 0) {
      throw new Error("Giỏ hàng không được để trống");
    }

    // 🛡️ CHỐNG SPAM ĐƠN HÀNG (COD & VIETQR):
    // 1. Chống Spam COD: Giới hạn tối đa 3 đơn COD đang chờ xử lý
    if (paymentMethod === "cod") {
      const [pendingCodRows] = await db.execute(
        `SELECT COUNT(*) AS count FROM orders WHERE (user_id = ? OR recipient_phone = ?) AND payment_method = 'cod' AND status IN ('pending', 'processing')`,
        [userId, recipientPhone],
      );
      if (pendingCodRows && pendingCodRows[0] && pendingCodRows[0].count >= 3) {
        throw new Error(
          "Bạn đang có 3 đơn hàng COD đang chờ xử lý. Vui lòng đợi cửa hàng giao các đơn hiện tại trước khi đặt thêm!",
        );
      }
    }

    // 2. Chống Rác VietQR: Tự động hủy các đơn VietQR pending cũ chưa thanh toán của user này
    if (paymentMethod === "vietqr" && userId) {
      await db.execute(
        `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE user_id = ? AND payment_method = 'vietqr' AND status = 'pending'`,
        [userId],
      );
    }

    // 2. BACKEND TRUY VẤN GIÁ SẢN PHẨM TỪ DATABASE (Zero client trust)
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Math.max(1, parseInt(item.quantity) || 1);

      // Tra cứu sản phẩm trong DB — KHÔNG chấp nhận giá từ client, KHÔNG
      // dùng giá fallback hardcode. Nếu product_id không tìm thấy hoặc đã
      // bị tắt → throw error ngay, buộc client gửi đúng sản phẩm hợp lệ.
      const [pRows] = await db.execute(
        `SELECT id, name, price FROM products WHERE id = ? AND is_active = 1 LIMIT 1`,
        [productId],
      );

      if (!pRows || pRows.length === 0) {
        throw new Error(
          `Sản phẩm "${item.name || productId}" không tồn tại hoặc đã ngừng kinh doanh. Vui lòng tải lại trang và thử lại.`,
        );
      }

      const unitPrice = Number(pRows[0].price);
      const productName = pRows[0].name;

      const itemTotal = unitPrice * quantity;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        product_id: productId,
        name: productName,
        unit_price: unitPrice,
        quantity: quantity,
        item_total: itemTotal,
      });
    }

    // 3. Kiểm tra & Tính toán Voucher discount chính xác 100% từ Database MySQL
    // CHỈ VALIDATE — chưa tăng used_count. Tăng used_count sau khi INSERT
    // đơn hàng thành công (tránh user mất voucher nếu INSERT fail).
    const Voucher = require("./Voucher");
    let discountAmount = 0;
    let isFreeshipVoucher = false;
    let voucherForApply = null; // Lưu lại voucher record để apply sau

    if (voucherCode && voucherCode.trim()) {
      const vResult = await Voucher.validateOrderVoucherOnly({
        userId,
        code: voucherCode,
        subtotal: calculatedSubtotal,
      });
      discountAmount = vResult.discountAmount;
      isFreeshipVoucher = vResult.isFreeship;
      voucherForApply = vResult.voucher;
    }

    // Giới hạn discount không vượt quá subtotal
    discountAmount = Math.min(discountAmount, calculatedSubtotal);

    // Phí vận chuyển từ bảng shipping_rules:
    // - Đơn >= freeThreshold → miễn phí vận chuyển
    // - Có voucher freeship → miễn phí vận chuyển
    const ShippingRule = require("./ShippingRule");
    const shipRule = await ShippingRule.getRule();
    const baseShipFee = Number(shipRule.base_fee || 30000);
    const freeThreshold = Number(shipRule.free_shipping_threshold || 500000);

    const shippingFee =
      calculatedSubtotal >= freeThreshold || isFreeshipVoucher
        ? 0
        : baseShipFee;

    // Tổng tiền thanh toán cuối cùng
    const totalAmount = Math.max(
      0,
      calculatedSubtotal - discountAmount + shippingFee,
    );

    // 4. Sinh mã đơn hàng ngẫu nhiên duy nhất (retry nếu trùng UNIQUE constraint)
    const generateOrderCode = () => {
      const randomSuffix = crypto.randomBytes(4).toString("hex").toUpperCase();
      return `VNT${Date.now().toString().slice(-6)}${randomSuffix}`;
    };

    // 5. Lưu vào Database — WRAP TRONG TRANSACTION để đảm bảo atomicity
    // (nếu INSERT order thất bại → không tăng used_count voucher)
    const MAX_RETRIES = 3;
    let orderCode;
    let result;
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Nếu tạo đơn VietQR mới, tự động hủy các đơn VietQR "pending" cũ của user để dọn sạch đơn nháp
      if (paymentMethod === "vietqr" && userId) {
        await conn.execute(
          `UPDATE orders SET status = 'cancelled', updated_at = NOW() 
           WHERE user_id = ? AND payment_method = 'vietqr' AND status = 'pending'`,
          [userId],
        );
      }

      // Retry INSERT nếu trùng order_code (xác suất cực thấp với 4 byte random)
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        orderCode = generateOrderCode();
        try {
          [result] = await conn.execute(
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
          break; // INSERT thành công → thoát retry loop
        } catch (insertErr) {
          if (insertErr.code === "ER_DUP_ENTRY" && attempt < MAX_RETRIES - 1) {
            continue; // Trùng mã → thử lại với mã mới
          }
          throw insertErr; // Lỗi khác hoặc hết retry → throw ra ngoài
        }
      }

      // Chỉ tăng used_count + đánh dấu user đã dùng voucher ngay khi tạo đơn với COD.
      // Với VietQR (pending), voucher chỉ bị trừ khi khách thực sự chuyển tiền (markAsPaid).
      // Điều này giúp khách có thể sử dụng lại mã Voucher ngay lập tức nếu lỡ tắt modal QR.
      if (voucherForApply && voucherForApply.id && paymentMethod === "cod") {
        await conn.execute(
          `UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?`,
          [voucherForApply.id],
        );
        if (userId) {
          await conn.execute(
            `INSERT INTO user_vouchers (user_id, voucher_id, status, used_at)
             VALUES (?, ?, 'used', NOW())
             ON DUPLICATE KEY UPDATE status = 'used', used_at = NOW()`,
            [userId, voucherForApply.id],
          );
        }
      }

      await conn.commit();

      // 🔔 BẮN THÔNG BÁO HỆ THỐNG:
      // - Chỉ bắn thông báo ngay khi tạo đơn với COD (đã xác nhận đặt hàng thành công)
      // - Với VietQR, chỉ bắn thông báo khi khách thực sự quét QR thanh toán thành công (trong markAsPaidByWebhookOrAdmin)
      //   để tránh spam thông báo nếu khách tắt popup QR hoặc tạo đơn nháp.
      if (paymentMethod === "cod") {
        try {
          const Notification = require("./Notification");
          const amountText = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalAmount);

          // 1. Gửi cho Admin hệ thống
          await Notification.send({
            recipient_type: "group",
            group_target: "admin",
            type: "system",
            title: `🛒 Đơn Hàng COD Mới #${orderCode}`,
            content: `Khách hàng ${recipientName} (${recipientPhone}) vừa đặt đơn hàng COD trị giá ${amountText}. Giao tới: ${recipientAddress}.`,
            link: "/admin/revenue",
            payload: {
              order_code: orderCode,
              total_amount: totalAmount,
              payment_method: "cod",
              recipient_name: recipientName,
              recipient_phone: recipientPhone,
            },
            created_by: userId,
          });

          // 2. Gửi cho Khách hàng vừa đặt
          if (userId) {
            await Notification.send({
              recipient_type: "user",
              user_ids: [userId],
              type: "feature",
              title: `🎉 Đặt Hàng COD Thành Công #${orderCode}`,
              content: `Cảm ơn bạn đã đặt hàng tại VinaTap! Đơn hàng COD trị giá ${amountText} đang được xử lý và sẽ sớm giao tới bạn.`,
              link: "/customer/orders",
              payload: { order_code: orderCode, total_amount: totalAmount },
              created_by: 0,
            });
          }
        } catch (notifErr) {
          console.error(
            "Lỗi gửi thông báo đơn hàng COD mới:",
            notifErr.message,
          );
        }
      }

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
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // ⚡ TỰ ĐỘNG HỦY ĐƠN HÀNG VIETQR "PENDING" Quá 24 Giờ
  // ⚠️ CHỈ ÁP DỤNG CHO VIETQR (payment_method = 'vietqr'). KHÔNG HỦY ĐƠN COD!
  // VietQR pending CHƯA BAO GIỜ bị trừ voucher khi tạo đơn → KHÔNG hoàn trả used_count
  async autoCancelExpiredOrders() {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Chuyển trạng thái đơn VietQR quá 24h chưa thanh toán sang cancelled
      await conn.execute(
        `UPDATE orders 
         SET status = 'cancelled', updated_at = NOW() 
         WHERE status = 'pending' AND payment_method = 'vietqr' 
           AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      console.error(
        "Lỗi tự động hủy đơn VietQR quá hạn:",
        err.message,
      );
    } finally {
      conn.release();
    }
  },

  // Khách lấy lịch sử đơn hàng của mình
  async getByUser(userId) {
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId],
    );
    return rows.map((r) => {
      const parsedItems =
        typeof r.items_json === "string"
          ? JSON.parse(r.items_json)
          : r.items_json || [];
      return {
        ...r,
        items: parsedItems,
        items_json: parsedItems,
      };
    });
  },

  // Tự động hủy các đơn VietQR pending quá hạn kèm hoàn trả voucher
  async cleanExpiredPendingOrders() {
    await this.autoCancelExpiredOrders();
  },

  // Admin lấy toàn bộ đơn hàng
  async getAllAdmin({
    search,
    status = "active",
    limit = 50,
    offset = 0,
  } = {}) {
    let whereClause = [];
    let params = [];

    if (search) {
      whereClause.push(
        `(o.order_code LIKE ? OR o.recipient_name LIKE ? OR o.recipient_phone LIKE ?)`,
      );
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (status === "active") {
      // Đơn thực tế cần xử lý: COD (mới/đang xử lý) + VietQR đã thanh toán
      whereClause.push(
        `((o.payment_method = 'cod' AND o.status IN ('pending', 'processing')) OR (o.status IN ('paid', 'processing', 'shipping')))`,
      );
    } else if (status === "pending_qr") {
      // Chỉ xem đơn VietQR đang chờ khách quét mã
      whereClause.push(
        `(o.payment_method = 'vietqr' AND o.status = 'pending')`,
      );
    } else if (status && status !== "all") {
      whereClause.push(`o.status = ?`);
      params.push(status);
    }

    const whereStr =
      whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "";

    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 50, 100));
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

    const [rows] = await db.execute(
      `SELECT o.*, u.name AS user_name, u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ${whereStr}
       ORDER BY o.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params,
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders o ${whereStr}`,
      params,
    );

    return {
      orders: rows.map((r) => {
        const parsedItems =
          typeof r.items_json === "string"
            ? JSON.parse(r.items_json)
            : r.items_json || [];
        return {
          ...r,
          items: parsedItems,
          items_json: parsedItems,
        };
      }),
      total: countRows[0]?.total || 0,
    };
  },

  // Cập nhật trạng thái đơn hàng (Admin) — Nếu chuyển sang 'cancelled' thì HOÀN TRẢ VOUCHER
  async updateStatus(id, status) {
    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipping",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái đơn hàng không hợp lệ");
    }

    const [existing] = await db.execute(
      `SELECT user_id, voucher_code, status FROM orders WHERE id = ? LIMIT 1`,
      [id],
    );

    if (
      existing.length > 0 &&
      status === "cancelled" &&
      existing[0].status !== "cancelled"
    ) {
      const ord = existing[0];
      if (ord.voucher_code) {
        const [vRows] = await db.execute(
          `SELECT id FROM vouchers WHERE UPPER(code) = ? LIMIT 1`,
          [ord.voucher_code.toUpperCase()],
        );
        if (vRows.length > 0) {
          const vId = vRows[0].id;
          await db.execute(
            `UPDATE vouchers SET used_count = GREATEST(0, used_count - 1) WHERE id = ?`,
            [vId],
          );
          if (ord.user_id) {
            await db.execute(
              `UPDATE user_vouchers SET status = 'available', used_at = NULL WHERE user_id = ? AND voucher_id = ?`,
              [ord.user_id, vId],
            );
          }
        }
      }
    }

    await db.execute(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id],
    );
  },

  // 🔍 Lấy trạng thái đơn hàng bằng Mã Đơn Hàng (order_code)
  async getByCode(orderCode) {
    const cleanCode = (orderCode || "").trim().toUpperCase();
    if (cleanCode.length > 30 || cleanCode.length === 0) return null;
    const [rows] = await db.execute(
      `SELECT id, order_code, user_id, recipient_name, recipient_phone, total_amount, status, payment_method, created_at 
       FROM orders WHERE order_code = ? LIMIT 1`,
      [cleanCode],
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // ⚡ Đánh dấu ĐÃ THANH TOÁN (Auto Webhook hoặc Admin xác nhận) + Bắn Thông Báo 🔔
  // FIX #1 + #2: Bọc trong transaction + tăng voucher used_count cho CẢ đơn VietQR
  // (trước đây chỉ COD mới tăng used_count lúc create, VietQR không bao giờ tăng)
  async markAsPaid(orderCode, transactionData = {}) {
    const cleanCode = (orderCode || "").trim().toUpperCase();

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. SELECT FOR UPDATE trong Transaction để khóa dòng đơn hàng, tránh Race Condition
      const [fullRows] = await conn.execute(
        `SELECT * FROM orders WHERE order_code = ? LIMIT 1 FOR UPDATE`,
        [cleanCode],
      );
      const order = fullRows[0] || null;

      if (!order) {
        await conn.rollback();
        throw new Error(`Đơn hàng ${cleanCode} không tồn tại trên hệ thống`);
      }

      if (
        order.status === "paid" ||
        order.status === "processing" ||
        order.status === "completed"
      ) {
        await conn.rollback();
        return order; // Đã thanh toán trước đó (idempotent)
      }

      // 2. Chỉ UPDATE nếu trạng thái hiện tại là pending hoặc cancelled
      const [updateResult] = await conn.execute(
        `UPDATE orders SET status = 'paid', updated_at = NOW() WHERE order_code = ? AND status IN ('pending', 'cancelled')`,
        [cleanCode],
      );

      if (updateResult.affectedRows === 0) {
        await conn.rollback();
        return { ...order, status: "paid" };
      }

      // 3. Xử lý voucher: tăng used_count + đánh dấu user đã dùng (chỉ tăng nếu user chưa từng dùng voucher này)
      if (order.voucher_code) {
        const [vRows] = await conn.execute(
          `SELECT id FROM vouchers WHERE UPPER(code) = ? LIMIT 1`,
          [order.voucher_code.toUpperCase()],
        );
        if (vRows.length > 0) {
          const vId = vRows[0].id;
          let alreadyUsed = false;
          if (order.user_id) {
            const [uvCheck] = await conn.execute(
              `SELECT status FROM user_vouchers WHERE user_id = ? AND voucher_id = ? LIMIT 1`,
              [order.user_id, vId],
            );
            if (uvCheck.length > 0 && uvCheck[0].status === "used") {
              alreadyUsed = true;
            }
          }

          if (!alreadyUsed) {
            await conn.execute(
              `UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?`,
              [vId],
            );
            if (order.user_id) {
              await conn.execute(
                `INSERT INTO user_vouchers (user_id, voucher_id, status, used_at)
                 VALUES (?, ?, 'used', NOW())
                 ON DUPLICATE KEY UPDATE status = 'used', used_at = NOW()`,
                [order.user_id, vId],
              );
              // Gỡ bỏ voucher khỏi các đơn nháp/đã hủy khác của cùng user để tránh bị dùng lặp lại
              await conn.execute(
                `UPDATE orders 
                 SET voucher_code = NULL, discount_amount = 0, total_amount = subtotal + shipping_fee, updated_at = NOW()
                 WHERE user_id = ? AND id != ? AND UPPER(voucher_code) = ? AND status IN ('pending', 'cancelled')`,
                [order.user_id, order.id, order.voucher_code.toUpperCase()],
              );
            }
          }
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    // ── Gửi notification (ngoài transaction — không critical) ────
    const Notification = require("./Notification");
    const amountText = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(order.total_amount);

    // 1. Gửi thông báo hệ thống CHỈ CHO ADMIN (không gửi cho @all) 🔔
    const notifTitle = isLatePayment
      ? `⚡ [CHUYỂN TIỀN MUỘN] Đơn Hàng #${cleanCode} Đã Khôi Phục & Thanh Toán!`
      : `💰 Đơn Hàng Đã Thanh Toán: #${cleanCode}`;

    try {
      await Notification.send({
        recipient_type: "group",
        group_target: "admin",
        type: "system",
        title: notifTitle,
        content: `Khách hàng ${order.recipient_name} (${order.recipient_phone}) vừa chuyển khoản ${amountText} cho đơn #${cleanCode}${isLatePayment ? " (Đơn này trước đó bị quá hạn 24h & đã được tự động khôi phục)" : ""}.`,
        link: "/admin/revenue",
        payload: { order_code: cleanCode, total_amount: order.total_amount },
        created_by: order.user_id || 0,
      });
    } catch (e) {
      console.error("Lỗi gửi thông báo admin khi thanh toán:", e.message);
    }

    // 2. Gửi thông báo riêng cho Khách hàng đã mua 🔔
    if (order.user_id) {
      try {
        await Notification.send({
          recipient_type: "user",
          user_ids: [order.user_id],
          type: "promo",
          title: `🎉 Thanh Toán Thành Công Đơn #${cleanCode}`,
          content: `VinaTap đã xác nhận thanh toán ${amountText} cho đơn hàng #${cleanCode}. Đơn hàng đang được chuẩn bị & đóng gói giao tới bạn!`,
          link: "/customer/orders",
          payload: { order_code: cleanCode, total_amount: order.total_amount },
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
