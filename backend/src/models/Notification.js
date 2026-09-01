const db = require("../config/db");

const Notification = {
  // Admin gửi thông báo (Đa dạng đối tượng & Form động)
  async send({
    recipient_type,
    group_target,
    user_ids,
    type,
    title,
    content,
    payload,
    link,
    created_by,
  }) {

    const [result] = await db.execute(
      `INSERT INTO notifications (recipient_type, group_target, type, title, content, payload, link, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipient_type || "all",
        group_target || null,
        type || "custom",
        title,
        content,
        payload ? JSON.stringify(payload) : null,
        link || null,
        created_by,
      ],
    );

    const notificationId = result.insertId;

    // Nếu chọn đối tượng cụ thể (users hoặc user) hoặc nhóm người dùng
    // FIX #8: Batch INSERT thay vì N queries riêng lẻ (O(1) thay vì O(N))
    if (recipient_type === "users" && Array.isArray(user_ids) && user_ids.length > 0) {
      const placeholders = user_ids.map(() => "(?, ?)").join(", ");
      const values = user_ids.flatMap((uid) => [notificationId, uid]);
      await db.execute(
        `INSERT IGNORE INTO notification_recipients (notification_id, user_id) VALUES ${placeholders}`,
        values,
      );
    } else if (recipient_type === "user" && user_ids) {
      const uid = Array.isArray(user_ids) ? user_ids[0] : user_ids;
      await db.execute(
        `INSERT IGNORE INTO notification_recipients (notification_id, user_id) VALUES (?, ?)`,
        [notificationId, uid],
      );
    } else if (recipient_type === "group" && group_target) {
      let query = "";
      if (group_target === "new_7days") {
        query = `SELECT id FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
      } else if (group_target === "activated_nfc") {
        query = `SELECT DISTINCT owner_user_id AS id FROM nfc_cards WHERE owner_user_id IS NOT NULL AND status = 'active'`;
      } else if (group_target === "unactivated_nfc") {
        query = `SELECT id FROM users WHERE id NOT IN (SELECT owner_user_id FROM nfc_cards WHERE owner_user_id IS NOT NULL)`;
      } else if (group_target === "admin") {
        query = `SELECT id FROM users WHERE role = 'admin'`;
      }

      if (query) {
        const [targetUsers] = await db.execute(query);
        const validUsers = targetUsers.filter((u) => u.id);
        if (validUsers.length > 0) {
          const placeholders = validUsers.map(() => "(?, ?)").join(", ");
          const values = validUsers.flatMap((u) => [notificationId, u.id]);
          await db.execute(
            `INSERT IGNORE INTO notification_recipients (notification_id, user_id) VALUES ${placeholders}`,
            values,
          );
        }
      }
    }

    return { success: true, notificationId };
  },

  // Customer & Admin lấy danh sách thông báo dành cho mình
  async getForUser(userId, role) {

    // Admin không nhận các thông báo quà tặng Voucher dành cho Khách Hàng
    const promoFilter = role === "admin" ? "AND n.type != 'promo'" : "";

    // 1. Lấy thông báo gửi cho @ALL (nhưng CHỈ lấy những thông báo gửi TỪ LÚC USER TẠO TÀI KHOẢN trở đi)
    // 2. Lấy thông báo gửi trực tiếp qua notification_recipients
    const [rows] = await db.execute(
      `SELECT n.*,
              MAX(CASE WHEN nr.read_at IS NOT NULL THEN 1 ELSE 0 END) AS is_read,
              MAX(u.name) AS sender_name
       FROM notifications n
       LEFT JOIN notification_recipients rec ON rec.notification_id = n.id
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
       LEFT JOIN users u ON u.id = n.created_by
       JOIN users cur_u ON cur_u.id = ?
       WHERE (
         (n.recipient_type = 'all' AND n.created_at >= cur_u.created_at)
         OR rec.user_id = ?
       ) ${promoFilter}
       GROUP BY n.id
       ORDER BY n.created_at DESC
       LIMIT 30`,
      [userId, userId, userId],
    );

    // Tính số thông báo chưa đọc
    const unreadCount = rows.filter((r) => !r.is_read).length;

    // Parse JSON payload nếu có
    const formattedRows = rows.map((r) => ({
      ...r,
      payload: typeof r.payload === "string" ? JSON.parse(r.payload) : r.payload,
    }));

    return { notifications: formattedRows, unreadCount };
  },

  // Đánh dấu đã đọc
  async markAsRead(notificationId, userId) {

    if (notificationId === "all") {
      // Đánh dấu tất cả là đã đọc cho user này bằng 1 câu lệnh batch tối ưu duy nhất
      await db.execute(
        `INSERT IGNORE INTO notification_reads (notification_id, user_id)
         SELECT n.id, ?
         FROM notifications n
         LEFT JOIN notification_recipients rec ON rec.notification_id = n.id
         JOIN users cur_u ON cur_u.id = ?
         WHERE (
           (n.recipient_type = 'all' AND n.created_at >= cur_u.created_at)
           OR rec.user_id = ?
         )`,
        [userId, userId, userId],
      );
      return { success: true };
    } else {
      await db.execute(
        `INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)`,
        [notificationId, userId],
      );
      return { success: true };
    }
  },

  // Admin xem lịch sử thông báo đã gửi
  async getAdminSentHistory() {

    const [rows] = await db.execute(
      `SELECT n.*, u.name AS sender_name,
              (SELECT COUNT(*) FROM notification_reads nr WHERE nr.notification_id = n.id) AS read_count
       FROM notifications n
       LEFT JOIN users u ON u.id = n.created_by
       ORDER BY n.created_at DESC
       LIMIT 50`,
    );

    return rows.map((r) => ({
      ...r,
      payload: typeof r.payload === "string" ? JSON.parse(r.payload) : r.payload,
    }));
  },

  // Xóa thông báo (có transaction tránh orphan data)
  async delete(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(`DELETE FROM notification_reads WHERE notification_id = ?`, [id]);
      await conn.execute(`DELETE FROM notification_recipients WHERE notification_id = ?`, [id]);
      await conn.execute(`DELETE FROM notifications WHERE id = ?`, [id]);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    return { success: true };
  },
};

module.exports = Notification;
