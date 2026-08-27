const NfcCard = require("../models/NfcCard");
const Album = require("../models/Album");
const { generateBatch, generateNfcToken } = require("../utils/serialGen");
const {
  sendTransferRequestEmail,
  sendTransferAcceptedEmail,
} = require("../utils/email");
const crypto = require("crypto");
const db = require("../config/db");

// ─── TAP NFC (GET /api/nfc/t/:token) — PUBLIC ────────────────
const tapCard = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT n.*, p.name AS province_name, p.slug AS province_slug,
              p.description, p.youtube_url, p.thumbnail_url,
              u.name AS owner_name
       FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       LEFT JOIN users u ON u.id = n.owner_user_id
       WHERE n.nfc_token = ? LIMIT 1`,
      [req.params.token],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Thẻ không tồn tại" });

    const c = rows[0];
    res.json({
      card: {
        id: c.id,
        nfc_token: c.nfc_token,
        serial_code: c.serial_code,
        status: c.status,
        province_name: c.province_name,
        province_slug: c.province_slug,
        description: c.description,
        youtube_url: c.youtube_url,
        thumbnail_url: c.thumbnail_url,
        has_owner: !!c.owner_user_id,
        owner_name: c.owner_name || null,
      },
    });
  } catch (err) {
    console.error("tapCard:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── CLAIM (POST /api/nfc/t/:token/claim) ────────────────────
const claimCard = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM nfc_cards WHERE nfc_token = ? LIMIT 1`,
      [req.params.token],
    );
    if (!rows.length)
      return res.status(404).json({ message: "Thẻ không tồn tại" });

    const card = rows[0];

    if (card.status === "disabled")
      return res.status(403).json({ message: "Thẻ bị vô hiệu hóa" });

    if (card.owner_user_id)
      return res.status(409).json({
        message: "Thẻ đã có chủ",
        is_owner: card.owner_user_id === req.user.id,
      });

    // ⚠️ RACE CONDITION FIX: nếu 2 request cùng chạm/claim 1 thẻ gần như
    // đồng thời, cả 2 đều có thể đọc owner_user_id = NULL ở bước check
    // phía trên trước khi ai kịp UPDATE (TOCTOU). Điều kiện
    // "WHERE owner_user_id IS NULL" đảm bảo chỉ 1 trong 2 UPDATE thực sự
    // ghi được dữ liệu — nhưng nếu không kiểm tra affectedRows, request
    // thua cuộc đua vẫn nhận response "Kích hoạt thành công" kèm dữ liệu
    // thẻ (giờ thuộc về người thắng), gây hiểu nhầm là mình đã sở hữu thẻ.
    const [result] = await db.execute(
      `UPDATE nfc_cards
       SET owner_user_id = ?, activated_at = NOW(), status = 'active'
       WHERE nfc_token = ? AND owner_user_id IS NULL`,
      [req.user.id, req.params.token],
    );

    if (!result.affectedRows)
      return res.status(409).json({
        message: "Thẻ vừa được người khác kích hoạt, vui lòng tải lại trang",
      });

    const updated = await NfcCard.findByToken(req.params.token);
    res.json({ message: "Kích hoạt thành công", card: updated });
  } catch (err) {
    console.error("claimCard:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ACTIVATE BY SERIAL (dự phòng chip hỏng) ─────────────────
// POST /api/nfc/activate
const activateSerial = async (req, res) => {
  try {
    const { serial_code } = req.body;
    if (!serial_code)
      return res.status(400).json({ message: "Thiếu serial code" });

    const card = await NfcCard.findBySerial(serial_code);
    if (!card) return res.status(404).json({ message: "Serial không tồn tại" });

    if (card.owner_user_id)
      return res
        .status(409)
        .json({ message: "Serial này đã được kích hoạt và có người sở hữu" });

    if (card.status === "disabled")
      return res.status(403).json({ message: "Serial này đã bị vô hiệu hóa" });

    const ok = await NfcCard.activate(serial_code, req.user.id);
    if (!ok)
      return res
        .status(400)
        .json({ message: "Kích hoạt thất bại hoặc thẻ đã được kích hoạt" });

    const updated = await NfcCard.findBySerial(serial_code);
    res.json({
      message: "Kích hoạt thành công",
      card: {
        id: updated.id,
        serial_code: updated.serial_code,
        province_name: updated.province_name,
        province_slug: updated.province_slug,
        province_id: updated.province_id,
      },
    });
  } catch (err) {
    console.error("activateSerial:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── MY CARDS ─────────────────────────────────────────────────
// GET /api/nfc/my-cards
const getMyCards = async (req, res) => {
  try {
    const cards = await NfcCard.findByOwner(req.user.id);
    res.json({ cards });
  } catch (err) {
    console.error("getMyCards:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── GET PENDING TRANSFERS FOR CURRENT USER (GET /api/nfc/transfers/pending) ───
const getPendingTransfers = async (req, res) => {
  try {
    const [user] = await db.execute(`SELECT email FROM users WHERE id = ?`, [
      req.user.id,
    ]);
    if (!user.length)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const userEmail = user[0].email.toLowerCase().trim();

    const [transfers] = await db.execute(
      `SELECT 
         ct.id,
         ct.nfc_card_id,
         ct.token,
         ct.status,
         ct.note,
         ct.created_at,
         ct.expires_at,
         n.serial_code,
         p.id AS province_id,
         p.name AS province_name,
         p.region AS province_region,
         p.thumbnail_url,
         u.name AS sender_name,
         u.email AS sender_email,
         u.avatar_url AS sender_avatar
       FROM card_transfers ct
       JOIN nfc_cards n ON n.id = ct.nfc_card_id
       JOIN provinces p ON p.id = n.province_id
       JOIN users u ON u.id = ct.from_user_id
       WHERE LOWER(ct.to_email) = LOWER(?)
         AND ct.status = 'pending'
         AND ct.expires_at > NOW()
         AND n.status = 'active'
       ORDER BY ct.created_at DESC`,
      [userEmail],
    );

    res.json({ transfers });
  } catch (err) {
    console.error("getPendingTransfers:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách quà tặng" });
  }
};

// ─── REJECT TRANSFER (POST /api/nfc/transfers/reject) ───────────
const rejectTransfer = async (req, res) => {
  try {
    const { transfer_id, token } = req.body;
    const [user] = await db.execute(`SELECT email FROM users WHERE id = ?`, [
      req.user.id,
    ]);
    if (!user.length)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const userEmail = user[0].email.toLowerCase().trim();

    let query = `UPDATE card_transfers SET status = 'rejected' WHERE status = 'pending' AND LOWER(to_email) = LOWER(?) AND `;
    const params = [userEmail];
    if (transfer_id) {
      query += `id = ?`;
      params.push(transfer_id);
    } else if (token) {
      query += `token = ?`;
      params.push(token);
    } else {
      return res.status(400).json({ message: "Thiếu transfer_id hoặc token" });
    }

    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Lời mời không tồn tại hoặc đã được xử lý" });
    }

    res.json({ message: "Đã từ chối nhận thẻ thành công" });
  } catch (err) {
    console.error("rejectTransfer:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── INITIATE TRANSFER (POST /api/nfc/:id/transfer) ──────────
const initiateTransfer = async (req, res) => {
  let conn = null;
  try {
    const cardId = req.params.id;
    const { email, note } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Thiếu email người nhận" });
    }

    const targetEmail = email.trim().toLowerCase();

    // Không chuyển cho chính mình
    const [self] = await db.execute(
      `SELECT id, email FROM users WHERE id = ?`,
      [req.user.id],
    );
    if (self.length && self[0].email.toLowerCase() === targetEmail) {
      return res
        .status(400)
        .json({ message: "Bạn không thể tự chuyển nhượng thẻ cho chính mình" });
    }

    conn = await db.getConnection();
    await conn.beginTransaction();

    // Khóa hàng thẻ nfc_cards bằng FOR UPDATE để chống spam click race condition
    const [cards] = await conn.execute(
      `SELECT n.*, p.name AS province_name FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       WHERE n.id = ? AND n.owner_user_id = ? AND n.status = 'active' FOR UPDATE`,
      [cardId, req.user.id],
    );

    if (!cards.length) {
      await conn.rollback();
      return res
        .status(403)
        .json({ message: "Thẻ không thuộc về bạn hoặc đã bị vô hiệu hóa" });
    }

    // Hủy toàn bộ transfer pending cũ của thẻ này (chỉ giữ 1 lời mời mới nhất)
    await conn.execute(
      `UPDATE card_transfers SET status = 'cancelled'
       WHERE nfc_card_id = ? AND status = 'pending'`,
      [cardId],
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await conn.execute(
      `INSERT INTO card_transfers
         (nfc_card_id, from_user_id, to_email, token, status, note, expires_at)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [
        cardId,
        req.user.id,
        targetEmail,
        token,
        note ? note.trim() : null,
        expires,
      ],
    );

    await conn.commit();

    // Gửi email thông báo cho người nhận (nếu email lỗi vẫn không crash transaction)
    const [sender] = await db.execute(`SELECT name FROM users WHERE id = ?`, [
      req.user.id,
    ]);
    sendTransferRequestEmail(targetEmail, {
      senderName: sender[0]?.name || "Người dùng VinaTap",
      provinceName: cards[0].province_name,
      token,
      note: note || "",
    }).catch((emailErr) => {
      console.warn(
        "Gửi email transfer thất bại (nhưng record trên web vẫn tạo thành công):",
        emailErr.message,
      );
    });

    res.json({
      message: `Đã gửi lời mời chuyển nhượng thành công đến ${targetEmail}`,
    });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch (rbErr) {
        console.error("Rollback error:", rbErr);
      }
    }
    console.error("initiateTransfer:", err);
    res.status(500).json({ message: "Lỗi server khi chuyển nhượng thẻ" });
  } finally {
    if (conn) conn.release();
  }
};

// ─── ACCEPT TRANSFER (POST /api/nfc/transfer/accept) ─────────
const acceptTransfer = async (req, res) => {
  const { token, transfer_id } = req.body;
  if (!token && !transfer_id) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin token hoặc transfer_id" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Khóa hàng transfer bằng FOR UPDATE để chống nhiều người cùng click nhận cùng 1 lúc
    let query = `SELECT * FROM card_transfers WHERE status = 'pending' AND expires_at > NOW() AND `;
    const params = [];
    if (transfer_id) {
      query += `id = ? FOR UPDATE`;
      params.push(transfer_id);
    } else {
      query += `token = ? FOR UPDATE`;
      params.push(token);
    }

    const [transfers] = await conn.execute(query, params);
    if (!transfers.length) {
      await conn.rollback();
      return res.status(400).json({
        message:
          "Lời mời chuyển nhượng không hợp lệ, đã hết hạn hoặc đã được nhận bởi người khác",
      });
    }

    const tr = transfers[0];

    // Xác thực email người nhận khớp với tài khoản hiện tại
    const [me] = await conn.execute(
      `SELECT email, name FROM users WHERE id = ?`,
      [req.user.id],
    );
    if (!me.length || me[0].email.toLowerCase() !== tr.to_email.toLowerCase()) {
      await conn.rollback();
      return res.status(403).json({
        message: `Lời mời này được gửi đến email ${tr.to_email}. Vui lòng đăng nhập đúng tài khoản này để nhận.`,
      });
    }

    // Khóa hàng thẻ nfc_cards
    const [cards] = await conn.execute(
      `SELECT * FROM nfc_cards WHERE id = ? FOR UPDATE`,
      [tr.nfc_card_id],
    );
    if (!cards.length) {
      await conn.rollback();
      return res
        .status(404)
        .json({ message: "Không tìm thấy thẻ NFC tương ứng" });
    }
    if (cards[0].status !== "active") {
      await conn.rollback();
      return res.status(403).json({
        message: "Thẻ NFC này đã bị vô hiệu hóa hoặc bị khóa bởi quản trị viên",
      });
    }

    // 1. Chuyển quyền sở hữu thẻ NFC sang người nhận
    await conn.execute(`UPDATE nfc_cards SET owner_user_id = ? WHERE id = ?`, [
      req.user.id,
      tr.nfc_card_id,
    ]);

    // 2. Chuyển quyền sở hữu album tương ứng sang người nhận (kể cả active hoặc archived)
    await conn.execute(
      `UPDATE albums SET owner_id = ? WHERE nfc_card_id = ? AND status != 'deleted'`,
      [req.user.id, tr.nfc_card_id],
    );

    // 3. Cập nhật trạng thái card_transfers thành accepted
    await conn.execute(
      `UPDATE card_transfers
       SET status = 'accepted', to_user_id = ?, accepted_at = NOW()
       WHERE id = ?`,
      [req.user.id, tr.id],
    );

    // 4. Hủy mọi lời mời pending khác liên quan đến thẻ này
    await conn.execute(
      `UPDATE card_transfers SET status = 'cancelled'
       WHERE nfc_card_id = ? AND id != ? AND status = 'pending'`,
      [tr.nfc_card_id, tr.id],
    );

    await conn.commit();

    // Gửi email cảm ơn/thông báo cho người tặng cũ
    const [fromUser] = await db.execute(
      `SELECT u.email, u.name FROM users u WHERE u.id = ?`,
      [tr.from_user_id],
    );
    if (fromUser[0]) {
      sendTransferAcceptedEmail(fromUser[0].email, {
        ownerName: fromUser[0].name,
        recipientName: me[0]?.name || tr.to_email,
      }).catch(() => {});
    }

    res.json({
      message:
        "🎉 Nhận thẻ thành công! Mảnh bản đồ và album kỷ niệm đã thuộc về bạn.",
    });
  } catch (err) {
    await conn.rollback();
    console.error("acceptTransfer:", err);
    res.status(500).json({ message: "Lỗi server khi tiếp nhận thẻ" });
  } finally {
    conn.release();
  }
};

// ─── CANCEL TRANSFER (DELETE /api/nfc/:id/transfer) ──────────
const cancelTransfer = async (req, res) => {
  try {
    const [result] = await db.execute(
      `UPDATE card_transfers SET status = 'cancelled'
       WHERE nfc_card_id = ? AND from_user_id = ? AND status = 'pending'`,
      [req.params.id, req.user.id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy yêu cầu chuyển nhượng đang chờ xử lý để hủy",
      });
    }
    res.json({ message: "Đã hủy yêu cầu chuyển nhượng thẻ" });
  } catch (err) {
    console.error("cancelTransfer:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: TẠO BATCH ─────────────────────────────────────────
// POST /api/nfc/batch
const createBatch = async (req, res) => {
  try {
    let { province_id, product_id, prefix, count } = req.body;

    // Nếu truyền product_id thay vì province_id -> tìm hoặc tạo province tương ứng
    if (product_id && !province_id) {
      const [prodRows] = await db.execute(
        `SELECT * FROM products WHERE id = ? LIMIT 1`,
        [product_id],
      );
      if (prodRows.length > 0) {
        const prod = prodRows[0];
        // Tìm tỉnh theo tên tương đồng
        const [provRows] = await db.execute(
          `SELECT id FROM provinces WHERE name LIKE ? OR ? LIKE CONCAT('%', name, '%') LIMIT 1`,
          [`%${prod.name}%`, prod.name],
        );
        if (provRows.length > 0) {
          province_id = provRows[0].id;
        } else {
          // Tự động tạo bản ghi tỉnh thành tương ứng cho sản phẩm
          const rawName =
            prod.name
              .replace(/^(Mảnh ghép NFC 3D\s*[-–:]*|Mảnh\s*[-–:]*)/i, "")
              .trim() || prod.name;
          const slug = rawName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

          const lowerName = rawName.toLowerCase();
          let detectedRegion = "north";
          if (
            /đà nẵng|quảng|huế|nghệ an|hà tĩnh|thanh hóa|bình định|phú yên|khánh hòa|ninh thuận|bình thuận/i.test(
              lowerName,
            )
          ) {
            detectedRegion = "central";
          } else if (
            /hồ chí minh|sài gòn|cần thơ|bình dương|đồng nai|long an|tiền giang|bến tre|vĩnh long|trà vinh|hậu giang|sóc trăng|bạc liêu|cà mau|kiên giang|an giang|đồng tháp|tây ninh|bình phước|bà rịa/i.test(
              lowerName,
            )
          ) {
            detectedRegion = "south";
          } else if (/trường sa|hoàng sa|phú quốc|côn đảo/i.test(lowerName)) {
            detectedRegion = "island";
          }

          const [insProv] = await db.execute(
            `INSERT INTO provinces (name, slug, region, description, status) VALUES (?, ?, ?, ?, 'active')`,
            [
              rawName,
              slug,
              detectedRegion,
              `Khám phá văn hóa & địa danh ${rawName}`,
            ],
          );
          province_id = insProv.insertId;
        }
      }
    }

    if (province_id) {
      const [prov] = await db.execute(
        `SELECT id FROM provinces WHERE id = ? LIMIT 1`,
        [province_id],
      );
      if (!prov.length) {
        return res
          .status(400)
          .json({
            message: "Tỉnh thành (province_id) không tồn tại trong hệ thống",
          });
      }
    }

    if (!province_id || !prefix || !count)
      return res
        .status(400)
        .json({
          message: "Thiếu thông tin sản phẩm/tỉnh thành, prefix hoặc count",
        });

    if (count > 500)
      return res.status(400).json({ message: "Tối đa 500 serial mỗi lần" });

    const serials = generateBatch(prefix, count).map((serial_code) => ({
      serial_code,
      nfc_token: generateNfcToken(), // Token riêng cho URL chip NFC
      province_id,
    }));

    await NfcCard.createBatch(serials);

    res.status(201).json({
      message: `Tạo ${count} serial cho sản phẩm thành công!`,
      sample: serials.slice(0, 5).map((s) => s.serial_code),
    });
  } catch (err) {
    console.error("createBatch:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: TRA CỨU & DANH SÁCH (GET /api/nfc/admin/search) ──
const adminSearchCards = async (req, res) => {
  try {
    const { q, province_id, status, limit = 50, offset = 0 } = req.query;

    const where = [];
    const params = [];

    if (q && q.trim().length > 0) {
      const kw = `%${q.trim()}%`;
      where.push(
        "(n.serial_code LIKE ? OR n.nfc_token LIKE ? OR u.email LIKE ? OR u.name LIKE ?)",
      );
      params.push(kw, kw, kw, kw);
    }

    if (province_id) {
      where.push("n.province_id = ?");
      params.push(province_id);
    }

    if (status && ["pending", "active", "disabled"].includes(status)) {
      where.push("n.status = ?");
      params.push(status);
    }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 50, 200));
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

    const [cards] = await db.execute(
      `SELECT n.id, n.serial_code, n.nfc_token, n.province_id, n.status, n.activated_at, n.created_at,
              p.name AS province_name,
              u.name AS owner_name, u.email AS owner_email
       FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       LEFT JOIN users u ON u.id = n.owner_user_id
       ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params,
    );

    const [totalRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM nfc_cards n
       LEFT JOIN users u ON u.id = n.owner_user_id
       ${whereClause}`,
      params,
    );

    res.json({ cards, total: totalRows[0]?.total || 0 });
  } catch (err) {
    console.error("adminSearchCards:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: GÁN THỦ CÔNG (POST /api/nfc/admin/assign) ────────
const adminAssignCard = async (req, res) => {
  try {
    const { serial_code, nfc_card_id, user_email, user_id, reason } = req.body;

    // Tìm thẻ
    let card;
    if (nfc_card_id) {
      const [r] = await db.execute(
        `SELECT * FROM nfc_cards WHERE id = ? LIMIT 1`,
        [nfc_card_id],
      );
      card = r[0];
    } else if (serial_code) {
      card = await NfcCard.findBySerial(serial_code);
    }
    if (!card) return res.status(404).json({ message: "Không tìm thấy thẻ" });

    if (card.status === "disabled") {
      return res.status(400).json({ message: "Thẻ này đã bị vô hiệu hóa (disabled), không thể gán cho người dùng" });
    }

    // Tìm user nhận
    let target;
    if (user_id) {
      const [r] = await db.execute(
        `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
        [user_id],
      );
      target = r[0];
    } else if (user_email) {
      const [r] = await db.execute(
        `SELECT id, name, email FROM users WHERE email = ? LIMIT 1`,
        [user_email],
      );
      target = r[0];
    }
    if (!target)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    await db.execute(
      `UPDATE nfc_cards
       SET owner_user_id = ?, activated_at = NOW(), status = 'active'
       WHERE id = ?`,
      [target.id, card.id],
    );

    // Ghi log vào card_transfers
    // ⚠️ FIX: cột `token` có ràng buộc UNIQUE. Trước đây hard-code chuỗi
    // 'ADMIN_ASSIGN' cho MỌI lần gán thủ công -> lần thứ 2 trở đi luôn lỗi
    // "Duplicate entry" vì đụng unique constraint. Sinh token ngẫu nhiên
    // (không dùng để gửi email, chỉ để lưu log) giống cách các luồng
    // transfer khác đang làm.
    const adminToken = `ADMIN_ASSIGN_${crypto.randomBytes(16).toString("hex")}`;
    await db.execute(
      `INSERT INTO card_transfers
         (nfc_card_id, from_user_id, to_email, to_user_id, token, status, note, expires_at, accepted_at)
       VALUES (?, ?, ?, ?, ?, 'accepted', ?, NOW(), NOW())`,
      [
        card.id,
        req.user.id,
        target.email,
        target.id,
        adminToken,
        reason ? `[Admin] ${reason}` : "[Admin gán thủ công]",
      ],
    );

    res.json({
      message: `Đã gán thẻ ${card.serial_code} cho ${target.name} (${target.email})`,
    });
  } catch (err) {
    console.error("adminAssignCard:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: XEM THEO TỈNH ─────────────────────────────────────
// GET /api/nfc/province/:provinceId
const getCardsByProvince = async (req, res) => {
  try {
    const [cards] = await db.execute(
      `SELECT n.id, n.serial_code, n.status, n.activated_at,
              u.name AS owner_name, u.email AS owner_email
       FROM nfc_cards n
       LEFT JOIN users u ON u.id = n.owner_user_id
       WHERE n.province_id = ?
       ORDER BY n.created_at DESC`,
      [req.params.provinceId],
    );
    res.json({ cards });
  } catch (err) {
    console.error("getCardsByProvince:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: TẠO NỘI DUNG SẴN + GÁN LINK VÀO THẺ ──────────────
// POST /api/nfc/admin/provision
// Dùng khi khách đã đặt/mua thẻ ở kênh khác (Shopee, TikTok Shop...)
// và đội ngũ cần chuẩn bị sẵn album (tiêu đề, mô tả, ảnh...) rồi mới
// giao/ghi link vào thẻ NFC vật lý cho khách — thay vì để album trống
// và bắt khách tự tạo sau khi kích hoạt.
//
// Body:
//   serial_code | nfc_card_id   — thẻ cần chuẩn bị
//   owner_email | owner_id      — chỉ bắt buộc nếu thẻ CHƯA có chủ
//   title, description, is_public (tuỳ chọn) — nội dung album
//   reason (tuỳ chọn) — ghi chú lý do gán, lưu vào log card_transfers
const provisionCard = async (req, res) => {
  try {
    const {
      serial_code,
      nfc_card_id,
      owner_email,
      owner_id,
      title,
      description,
      is_public,
      reason,
    } = req.body;

    // ── 1. Tìm thẻ ──────────────────────────────────────────
    let card;
    if (nfc_card_id) {
      const [r] = await db.execute(
        `SELECT * FROM nfc_cards WHERE id = ? LIMIT 1`,
        [nfc_card_id],
      );
      card = r[0];
    } else if (serial_code) {
      card = await NfcCard.findBySerial(serial_code);
    }
    if (!card) return res.status(404).json({ message: "Không tìm thấy thẻ" });

    if (card.status === "disabled")
      return res.status(403).json({ message: "Thẻ bị vô hiệu hóa" });

    // ── 2. Xác định chủ sở hữu cuối cùng ────────────────────
    let finalOwnerId = card.owner_user_id;

    if (!finalOwnerId) {
      // Thẻ chưa có chủ -> bắt buộc phải cho biết gán cho ai
      let target;
      if (owner_id) {
        const [r] = await db.execute(
          `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
          [owner_id],
        );
        target = r[0];
      } else if (owner_email) {
        const [r] = await db.execute(
          `SELECT id, name, email FROM users WHERE email = ? LIMIT 1`,
          [owner_email],
        );
        target = r[0];
      }
      if (!target)
        return res.status(400).json({
          message:
            "Thẻ chưa có chủ — cần cung cấp owner_email hoặc owner_id hợp lệ",
        });

      await db.execute(
        `UPDATE nfc_cards
         SET owner_user_id = ?, activated_at = NOW(), status = 'active'
         WHERE id = ?`,
        [target.id, card.id],
      );

      const provisionToken = `PROVISION_${crypto.randomBytes(16).toString("hex")}`;
      await db.execute(
        `INSERT INTO card_transfers
           (nfc_card_id, from_user_id, to_email, to_user_id, token, status, note, expires_at, accepted_at)
         VALUES (?, ?, ?, ?, ?, 'accepted', ?, NOW(), NOW())`,
        [
          card.id,
          req.user.id,
          target.email,
          target.id,
          provisionToken,
          reason
            ? `[Admin] ${reason}`
            : "[Admin chuẩn bị album trước khi giao]",
        ],
      );

      finalOwnerId = target.id;
    }

    // ── 3. Tạo hoặc cập nhật album gắn với thẻ ──────────────
    let album = await Album.findByNfcCard(card.id);
    if (!album) {
      const albumId = await Album.create({
        nfc_card_id: card.id,
        owner_id: finalOwnerId,
        title,
      });
      await Album.update(albumId, { description, is_public });
      album = await Album.findById(albumId);
    } else {
      await Album.update(album.id, { title, description, is_public });
      album = await Album.findById(album.id);
    }

    const updatedCard = await NfcCard.findByToken(card.nfc_token);

    res.status(200).json({
      message: "Đã chuẩn bị nội dung và gán link cho thẻ thành công",
      card: updatedCard,
      album,
      // Link cần ghi vào chip NFC vật lý (qua app ghi NFC, ví dụ NFC Tools)
      tap_link: `${process.env.FRONTEND_URL}/t/${card.nfc_token}`,
    });
  } catch (err) {
    console.error("provisionCard:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  tapCard,
  claimCard,
  activateSerial,
  getMyCards,
  getPendingTransfers,
  rejectTransfer,
  initiateTransfer,
  acceptTransfer,
  cancelTransfer,
  createBatch,
  adminSearchCards,
  adminAssignCard,
  provisionCard,
  getCardsByProvince,
};
