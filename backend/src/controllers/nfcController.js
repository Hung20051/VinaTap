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

    if (card.status === "active")
      return res.status(409).json({ message: "Serial này đã được kích hoạt" });

    if (card.status === "disabled")
      return res.status(403).json({ message: "Serial bị vô hiệu hóa" });

    const ok = await NfcCard.activate(serial_code, req.user.id);
    if (!ok) return res.status(400).json({ message: "Kích hoạt thất bại" });

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

// ─── INITIATE TRANSFER (POST /api/nfc/:id/transfer) ──────────
const initiateTransfer = async (req, res) => {
  try {
    const { email, note } = req.body;
    if (!email)
      return res.status(400).json({ message: "Thiếu email người nhận" });

    const [cards] = await db.execute(
      `SELECT n.*, p.name AS province_name FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       WHERE n.id = ? AND n.owner_user_id = ? AND n.status = 'active'`,
      [req.params.id, req.user.id],
    );
    if (!cards.length)
      return res.status(403).json({ message: "Thẻ không thuộc về bạn" });

    // Không chuyển cho chính mình
    const [self] = await db.execute(
      `SELECT id FROM users WHERE email = ? AND id = ?`,
      [email, req.user.id],
    );
    if (self.length)
      return res
        .status(400)
        .json({ message: "Không thể chuyển cho chính mình" });

    // Hủy transfer pending cũ
    await db.execute(
      `UPDATE card_transfers SET status = 'cancelled'
       WHERE nfc_card_id = ? AND status = 'pending'`,
      [req.params.id],
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.execute(
      `INSERT INTO card_transfers
         (nfc_card_id, from_user_id, to_email, token, status, note, expires_at)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
      [req.params.id, req.user.id, email, token, note || null, expires],
    );

    const [sender] = await db.execute(`SELECT name FROM users WHERE id = ?`, [
      req.user.id,
    ]);
    await sendTransferRequestEmail(email, {
      senderName: sender[0]?.name || "Người dùng VinaTap",
      provinceName: cards[0].province_name,
      token,
      note: note || "",
    });

    res.json({ message: `Đã gửi lời mời chuyển nhượng đến ${email}` });
  } catch (err) {
    console.error("initiateTransfer:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ACCEPT TRANSFER (POST /api/nfc/transfer/accept) ─────────
const acceptTransfer = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Thiếu token" });

    const [transfers] = await db.execute(
      `SELECT * FROM card_transfers
       WHERE token = ? AND status = 'pending' AND expires_at > NOW() LIMIT 1`,
      [token],
    );
    if (!transfers.length)
      return res
        .status(400)
        .json({ message: "Link không hợp lệ hoặc đã hết hạn" });

    const tr = transfers[0];

    const [me] = await db.execute(`SELECT email FROM users WHERE id = ?`, [
      req.user.id,
    ]);
    if (!me.length || me[0].email !== tr.to_email)
      return res
        .status(403)
        .json({ message: "Link này không dành cho tài khoản của bạn" });

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(
        `UPDATE nfc_cards SET owner_user_id = ? WHERE id = ?`,
        [req.user.id, tr.nfc_card_id],
      );
      await conn.execute(
        `UPDATE albums SET owner_id = ? WHERE nfc_card_id = ? AND status = 'active'`,
        [req.user.id, tr.nfc_card_id],
      );
      await conn.execute(
        `UPDATE card_transfers
         SET status = 'accepted', to_user_id = ?, accepted_at = NOW()
         WHERE id = ?`,
        [req.user.id, tr.id],
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    // Thông báo cho người chuyển
    const [from] = await db.execute(
      `SELECT u.email, u.name FROM users u
       WHERE u.id = ?`,
      [tr.from_user_id],
    );
    const [recipient] = await db.execute(
      `SELECT name FROM users WHERE id = ?`,
      [req.user.id],
    );
    if (from[0]) {
      await sendTransferAcceptedEmail(from[0].email, {
        ownerName: from[0].name,
        recipientName: recipient[0]?.name || tr.to_email,
      });
    }

    res.json({ message: "Chuyển nhượng thành công! Thẻ đã thuộc về bạn." });
  } catch (err) {
    console.error("acceptTransfer:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── CANCEL TRANSFER (DELETE /api/nfc/:id/transfer) ──────────
const cancelTransfer = async (req, res) => {
  try {
    await db.execute(
      `UPDATE card_transfers SET status = 'cancelled'
       WHERE nfc_card_id = ? AND from_user_id = ? AND status = 'pending'`,
      [req.params.id, req.user.id],
    );
    res.json({ message: "Đã hủy yêu cầu chuyển nhượng" });
  } catch (err) {
    console.error("cancelTransfer:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: TẠO BATCH ─────────────────────────────────────────
// POST /api/nfc/batch
const createBatch = async (req, res) => {
  try {
    const { province_id, prefix, count } = req.body;

    if (!province_id || !prefix || !count)
      return res
        .status(400)
        .json({ message: "Thiếu province_id, prefix hoặc count" });

    if (count > 500)
      return res.status(400).json({ message: "Tối đa 500 serial mỗi lần" });

    const serials = generateBatch(prefix, count).map((serial_code) => ({
      serial_code,
      nfc_token: generateNfcToken(), // Token riêng cho URL chip NFC
      province_id,
    }));

    await NfcCard.createBatch(serials);

    res.status(201).json({
      message: `Tạo ${count} serial thành công`,
      sample: serials.slice(0, 5).map((s) => s.serial_code),
    });
  } catch (err) {
    console.error("createBatch:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: TRA CỨU (GET /api/nfc/admin/search?q=...) ────────
const adminSearchCards = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 3)
      return res.status(400).json({ message: "Nhập ít nhất 3 ký tự" });

    const kw = `%${q.trim()}%`;
    const [cards] = await db.execute(
      `SELECT n.id, n.serial_code, n.nfc_token, n.status, n.activated_at,
              p.name AS province_name,
              u.name AS owner_name, u.email AS owner_email
       FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       LEFT JOIN users u ON u.id = n.owner_user_id
       WHERE n.serial_code LIKE ? OR n.nfc_token LIKE ?
          OR u.email LIKE ? OR u.name LIKE ?
       ORDER BY n.created_at DESC LIMIT 20`,
      [kw, kw, kw, kw],
    );
    res.json({ cards });
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
  initiateTransfer,
  acceptTransfer,
  cancelTransfer,
  createBatch,
  adminSearchCards,
  adminAssignCard,
  provisionCard,
  getCardsByProvince,
};
