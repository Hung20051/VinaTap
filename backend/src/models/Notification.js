const db = require("../config/db");

const Notification = {
  async initTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          recipient_type ENUM('all', 'group', 'users', 'user') NOT NULL DEFAULT 'all',
          group_target VARCHAR(50) NULL,
          type ENUM('system', 'promo', 'feature', 'custom') NOT NULL DEFAULT 'custom',
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          payload JSON NULL,
          link VARCHAR(255) NULL,
          created_by INT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_recipient_type (recipient_type),
          INDEX idx_type (type),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS notification_recipients (
          notification_id INT NOT NULL,
          user_id INT NOT NULL,
          PRIMARY KEY (notification_id, user_id),
          INDEX idx_user_id (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS notification_reads (
          notification_id INT NOT NULL,
          user_id INT NOT NULL,
          read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (notification_id, user_id),
          INDEX idx_read_user (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (err) {
      console.error("Notification initTable error:", err.message);
    }
  },

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
    await this.initTable();

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
    if (recipient_type === "users" && Array.isArray(user_ids) && user_ids.length > 0) {
      for (const uid of user_ids) {
        await db.execute(
          `INSERT IGNORE INTO notification_recipients (notification_id, user_id) VALUES (?, ?)`,
          [notificationId, uid],
        );
      }
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
      }

      if (query) {
        const [targetUsers] = await db.execute(query);
        for (const u of targetUsers) {
          if (u.id) {
            await db.execute(
              `INSERT IGNORE INTO notification_recipients (notification_id, user_id) VALUES (?, ?)`,
              [notificationId, u.id],
            );
          }
        }
      }
    }

    return { success: true, notificationId };
  },

  // Customer & Admin lấy danh sách thông báo dành cho mình
  async getForUser(userId, role) {
    await this.initTable();

    // Admin không nhận các thông báo quà tặng Voucher dành cho Khách Hàng
    const promoFilter = role === "admin" ? "AND n.type != 'promo'" : "";

    // 1. Lấy thông báo gửi cho @ALL
    // 2. Lấy thông báo gửi trực tiếp qua notification_recipients
    const [rows] = await db.execute(
      `SELECT n.*,
              (CASE WHEN nr.read_at IS NOT NULL THEN 1 ELSE 0 END) AS is_read,
              u.name AS sender_name
       FROM notifications n
       LEFT JOIN notification_recipients rec ON rec.notification_id = n.id
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
       LEFT JOIN users u ON u.id = n.created_by
       WHERE (n.recipient_type = 'all' OR rec.user_id = ?) ${promoFilter}
       ORDER BY n.created_at DESC
       LIMIT 30`,
      [userId, userId],
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
    await this.initTable();

    if (notificationId === "all") {
      // Đánh dấu tất cả là đã đọc cho user này
      const [allNotifs] = await db.execute(
        `SELECT n.id
         FROM notifications n
         LEFT JOIN notification_recipients rec ON rec.notification_id = n.id
         WHERE (n.recipient_type = 'all' OR rec.user_id = ?)`,
        [userId],
      );
      for (const n of allNotifs) {
        await db.execute(
          `INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)`,
          [n.id, userId],
        );
      }
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
    await this.initTable();

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

  // Xóa thông báo
  async delete(id) {
    await db.execute(`DELETE FROM notifications WHERE id = ?`, [id]);
    await db.execute(`DELETE FROM notification_recipients WHERE notification_id = ?`, [id]);
    await db.execute(`DELETE FROM notification_reads WHERE notification_id = ?`, [id]);
    return { success: true };
  },
};

module.exports = Notification;
