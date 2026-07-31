const db = require("../config/db");
const crypto = require("crypto");

// Sinh mã đơn dạng HD-000001 — đệm 6 số 0 từ id tự tăng trong DB. Nếu id
// vượt quá 6 chữ số thì padStart tự động không đệm nữa (không lỗi, chỉ
// đơn giản là mã dài hơn 1 chút — xem giải thích đã trao đổi với Hưng).
// Việc sắp xếp/tìm kiếm thật sự luôn dựa vào cột `id` số nguyên phía sau,
// không dựa vào so sánh chuỗi của sale_code.
const formatSaleCode = (id) => `HD-${String(id).padStart(6, "0")}`;

const ManualSale = {
  // Tạo đơn — 2 bước: INSERT trước để lấy id tự tăng (chưa thể biết id
  // trước khi INSERT), rồi UPDATE lại sale_code dựa trên chính id đó.
  // sale_code có UNIQUE KEY, nên bước INSERT đầu KHÔNG được để trống/giống
  // nhau — nếu 2 admin bấm tạo đơn cùng lúc mà cả 2 cùng insert sale_code=""
  // thì request thứ 2 sẽ bị lỗi duplicate-key ngay lập tức. Dùng 1 chuỗi
  // tạm random (không bao giờ trùng) làm placeholder cho an toàn.
  async create({
    product_id,
    product_name_snapshot,
    unit_price,
    quantity,
    buyer_name,
    created_by,
    note,
  }) {
    const total_amount = Number(unit_price) * Number(quantity);
    const tempCode = `TMP-${crypto.randomBytes(8).toString("hex")}`;

    const [result] = await db.execute(
      `INSERT INTO manual_sales
         (sale_code, product_id, product_name_snapshot, unit_price,
          quantity, total_amount, buyer_name, created_by, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        tempCode,
        product_id || null,
        product_name_snapshot,
        unit_price,
        quantity,
        total_amount,
        buyer_name,
        created_by,
        note || null,
      ],
    );

    const saleCode = formatSaleCode(result.insertId);
    await db.execute(`UPDATE manual_sales SET sale_code = ? WHERE id = ?`, [
      saleCode,
      result.insertId,
    ]);

    return { id: result.insertId, sale_code: saleCode, total_amount };
  },

  // Danh sách đơn — filter theo mã đơn HOẶC tên người mua (tìm gần đúng),
  // cộng thêm khoảng ngày nếu có. Chỉ lấy status='active' (ẩn đơn đã xóa mềm).
  async findAll({ search, fromDate, toDate, limit = 50, offset = 0 } = {}) {
    const where = ["ms.status = 'active'"];
    const params = [];

    if (search) {
      where.push("(ms.sale_code = ? OR ms.buyer_name LIKE ?)");
      params.push(search, `%${search}%`);
    }
    if (fromDate) {
      where.push("ms.created_at >= ?");
      params.push(fromDate);
    }
    if (toDate) {
      where.push("ms.created_at <= ?");
      params.push(toDate);
    }

    // db.execute() (prepared statement) của mysql2 báo lỗi ER_WRONG_ARGUMENTS
    // với 1 số phiên bản MySQL khi dùng "?" cho LIMIT/OFFSET — đây là lỗi
    // tương thích driver đã biết, không phải lỗi cú pháp SQL. Ép về số
    // nguyên an toàn (parseInt + fallback) rồi chèn thẳng vào chuỗi SQL
    // thay vì qua placeholder — vẫn an toàn vì đã ép kiểu số, không nhận
    // chuỗi tùy ý từ client.
    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 50, 500));
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

    const [rows] = await db.execute(
      `SELECT ms.*, u.name AS created_by_name
       FROM manual_sales ms
       JOIN users u ON u.id = ms.created_by
       WHERE ${where.join(" AND ")}
       ORDER BY ms.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params,
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM manual_sales WHERE id = ? AND status = 'active' LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  },

  async update(
    id,
    {
      product_id,
      product_name_snapshot,
      unit_price,
      quantity,
      buyer_name,
      note,
    },
  ) {
    const total_amount = Number(unit_price) * Number(quantity);
    await db.execute(
      `UPDATE manual_sales
       SET product_id = ?, product_name_snapshot = ?, unit_price = ?,
           quantity = ?, total_amount = ?, buyer_name = ?, note = ?
       WHERE id = ?`,
      [
        product_id || null,
        product_name_snapshot,
        unit_price,
        quantity,
        total_amount,
        buyer_name,
        note || null,
        id,
      ],
    );
  },

  // Xóa mềm — đơn vẫn nằm trong DB, chỉ ẩn khỏi danh sách + không tính
  // vào tổng doanh thu nữa. Admin bấm nhầm xóa vẫn khôi phục được (chưa
  // làm nút khôi phục ở UI, nhưng dữ liệu không mất).
  async softDelete(id) {
    await db.execute(
      `UPDATE manual_sales SET status = 'deleted' WHERE id = ?`,
      [id],
    );
  },

  // Tổng doanh thu theo từng ngày, trong N ngày gần nhất — dùng vẽ chart
  // ở AdminDashboard. Trả về mảng rỗng cho ngày không có đơn nào (JS tự
  // điền 0 ở phía frontend, đỡ phải điền ở SQL cho phức tạp).
  //
  // Dùng DATE_FORMAT() ép trả về CHUỖI "YYYY-MM-DD" thay vì DATE(created_at)
  // — nếu để DATE(), driver mysql2 tự convert cột đó thành object Date của
  // JS theo timezone cấu hình ở config/db.js (+07:00), rồi khi res.json()
  // serialize, object Date đó gọi .toISOString() ra chuỗi UTC đầy đủ dạng
  // "2026-07-30T17:00:00.000Z" (lùi mất 1 ngày so với ngày thật ở DB).
  // Trong khi đó AdminDashboard.jsx lại so khớp bằng key rút gọn 10 ký tự
  // "2026-07-31" -> không bao giờ trùng -> map.get() luôn undefined ->
  // chart luôn hiện "chưa có đơn bán nào" dù DB có dữ liệu thật.
  async getDailyRevenue(days = 30) {
    const [rows] = await db.execute(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
              SUM(total_amount) AS revenue, SUM(quantity) AS cards_sold
       FROM manual_sales
       WHERE status = 'active' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
       ORDER BY date ASC`,
      [days],
    );
    return rows;
  },

  // Tổng doanh thu + số thẻ đã bán, all-time — cho KPI card ở AdminDashboard
  async getSummary() {
    const [rows] = await db.execute(
      `SELECT
         COALESCE(SUM(total_amount), 0) AS total_revenue,
         COALESCE(SUM(quantity), 0)     AS total_cards_sold,
         COUNT(*)                       AS total_orders
       FROM manual_sales
       WHERE status = 'active'`,
    );
    return rows[0];
  },
};

module.exports = ManualSale;
