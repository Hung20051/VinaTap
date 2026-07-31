const db = require("../config/db");

const AdminStats = {
  // Gộp nhiều query đếm nhỏ vào 1 lần gọi — dùng Promise.all để chạy song
  // song thay vì tuần tự, giảm thời gian chờ khi load trang Tổng quan.
  async getOverview() {
    const [
      [[nfcTotal]],
      [[nfcActivated]],
      [[userTotal]],
      [[userNew7d]],
      [[albumTotal]],
      [[albumPublic]],
      [[pendingShares]],
      [hotProvinces],
    ] = await Promise.all([
      db.execute(`SELECT COUNT(*) AS count FROM nfc_cards`),
      db.execute(
        `SELECT COUNT(*) AS count FROM nfc_cards WHERE status = 'active'`,
      ),
      db.execute(
        `SELECT COUNT(*) AS count FROM users WHERE status != 'banned'`,
      ),
      db.execute(
        `SELECT COUNT(*) AS count FROM users
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      ),
      db.execute(
        `SELECT COUNT(*) AS count FROM albums WHERE status = 'active'`,
      ),
      db.execute(
        `SELECT COUNT(*) AS count FROM albums
         WHERE status = 'active' AND is_public = 1`,
      ),
      db.execute(
        `SELECT COUNT(*) AS count FROM album_shares WHERE status = 'pending'`,
      ),
      // Top 5 tỉnh có nhiều serial kích hoạt nhất — tỉnh nào "hot"
      db.execute(
        `SELECT p.name, COUNT(*) AS activated_count
         FROM nfc_cards nc
         JOIN provinces p ON p.id = nc.province_id
         WHERE nc.status = 'active'
         GROUP BY p.id, p.name
         ORDER BY activated_count DESC
         LIMIT 5`,
      ),
    ]);

    return {
      nfc_total: nfcTotal.count,
      nfc_activated: nfcActivated.count,
      nfc_pending: nfcTotal.count - nfcActivated.count,
      user_total: userTotal.count,
      user_new_7d: userNew7d.count,
      album_total: albumTotal.count,
      album_public: albumPublic.count,
      pending_share_requests: pendingShares.count,
      hot_provinces: hotProvinces,
    };
  },
};

module.exports = AdminStats;
