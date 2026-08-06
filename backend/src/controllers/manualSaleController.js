const ManualSale = require("../models/ManualSale");
const Product = require("../models/Product");

// GET /api/manual-sales?search=&fromDate=&toDate=&limit=&offset=
const getAllSales = async (req, res) => {
  try {
    const { search, fromDate, toDate, limit, offset } = req.query;
    const sales = await ManualSale.findAll({
      search,
      fromDate,
      toDate,
      limit,
      offset,
    });
    res.json({ sales });
  } catch (err) {
    console.error("getAllSales:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/manual-sales
// Body: { product_id, quantity, unit_price, buyer_name, note }
// unit_price nhập tay (không tự lấy default_price của product) — để xử lý
// voucher/giảm giá/mua sỉ như đã bàn với Hưng.
const createSale = async (req, res) => {
  try {
    const { product_id, quantity, unit_price, buyer_name, note } = req.body;

    if (!buyer_name || !buyer_name.trim())
      return res.status(400).json({ message: "Thiếu tên người mua" });
    if (!quantity || Number(quantity) < 1)
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    if (unit_price === undefined || Number(unit_price) < 0)
      return res.status(400).json({ message: "Đơn giá không hợp lệ" });

    // Snapshot tên sản phẩm NGAY LÚC BÁN — nếu sau này sản phẩm bị đổi
    // tên/ẩn/xóa thì đơn cũ vẫn hiển thị đúng tên đã bán lúc đó.
    let productNameSnapshot = req.body.product_name_snapshot;
    let validProductId = null;

    if (product_id && !isNaN(product_id)) {
      const product = await Product.findById(product_id);
      if (product) {
        validProductId = product.id;
        if (!productNameSnapshot) productNameSnapshot = product.name;
      }
    }

    if (!productNameSnapshot || !productNameSnapshot.trim())
      return res.status(400).json({ message: "Thiếu tên sản phẩm" });

    const sale = await ManualSale.create({
      product_id: validProductId,
      product_name_snapshot: productNameSnapshot.trim(),
      unit_price,
      quantity,
      buyer_name: buyer_name.trim(),
      created_by: req.user.id,
      note,
    });

    res.status(201).json({ message: "Đã tạo đơn", sale });
  } catch (err) {
    console.error("createSale:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /api/manual-sales/:id
const updateSale = async (req, res) => {
  try {
    const existing = await ManualSale.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy đơn" });

    const {
      product_id,
      product_name_snapshot,
      unit_price,
      quantity,
      buyer_name,
      note,
    } = req.body;

    if (!buyer_name || !buyer_name.trim())
      return res.status(400).json({ message: "Thiếu tên người mua" });
    if (!quantity || Number(quantity) < 1)
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    if (unit_price === undefined || Number(unit_price) < 0)
      return res.status(400).json({ message: "Đơn giá không hợp lệ" });

    await ManualSale.update(req.params.id, {
      product_id: product_id || null,
      product_name_snapshot:
        product_name_snapshot || existing.product_name_snapshot,
      unit_price,
      quantity,
      buyer_name: buyer_name.trim(),
      note,
    });

    res.json({ message: "Đã cập nhật đơn" });
  } catch (err) {
    console.error("updateSale:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// DELETE /api/manual-sales/:id  (soft delete)
const deleteSale = async (req, res) => {
  try {
    const existing = await ManualSale.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy đơn" });

    await ManualSale.softDelete(req.params.id);
    res.json({ message: "Đã xóa đơn" });
  } catch (err) {
    console.error("deleteSale:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /api/manual-sales/summary — KPI cards cho AdminDashboard
const getSummary = async (req, res) => {
  try {
    const summary = await ManualSale.getSummary();
    res.json({ summary });
  } catch (err) {
    console.error("getSummary:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /api/manual-sales/daily-revenue?days=30 — data cho chart AdminDashboard
const getDailyRevenue = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const daily = await ManualSale.getDailyRevenue(days);
    res.json({ daily });
  } catch (err) {
    console.error("getDailyRevenue:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /api/manual-sales/export — tải file .csv (Excel/Sheets mở được bình
// thường). Tự build chuỗi CSV thủ công, KHÔNG dùng thư viện xlsx/exceljs
// — cả 2 đều dính cảnh báo bảo mật (npm audit) từ dependency gián tiếp,
// trong khi nhu cầu chỉ là xuất bảng dữ liệu thô, không cần style/màu.
const exportCsv = async (req, res) => {
  try {
    const { search, fromDate, toDate } = req.query;
    const sales = await ManualSale.findAll({
      search,
      fromDate,
      toDate,
      limit: 100000, // xuất hết, không phân trang
      offset: 0,
    });

    const header = [
      "Mã đơn",
      "Sản phẩm",
      "Số lượng",
      "Đơn giá",
      "Thành tiền",
      "Người mua",
      "Ghi chú",
      "Người tạo",
      "Ngày tạo",
    ];

    // Escape theo chuẩn CSV: nếu ô chứa dấu phẩy/ngoặc kép/xuống dòng thì
    // bọc trong ngoặc kép, và tự nhân đôi ngoặc kép có sẵn bên trong.
    const escapeCsvCell = (value) => {
      const str = value === null || value === undefined ? "" : String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = sales.map((s) =>
      [
        s.sale_code,
        s.product_name_snapshot,
        s.quantity,
        s.unit_price,
        s.total_amount,
        s.buyer_name,
        s.note || "",
        s.created_by_name,
        new Date(s.created_at).toLocaleString("vi-VN"),
      ]
        .map(escapeCsvCell)
        .join(","),
    );

    // \uFEFF (BOM) ở đầu file — bắt buộc để Excel nhận đúng encoding
    // UTF-8, nếu không tiếng Việt có dấu sẽ hiển thị lỗi font khi mở
    // bằng Excel (Google Sheets/LibreOffice thì không cần, nhưng thêm
    // vào không hại gì).
    const csvContent = "\uFEFF" + [header.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="doanh-thu-${Date.now()}.csv"`,
    );
    res.send(csvContent);
  } catch (err) {
    console.error("exportCsv:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  getSummary,
  getDailyRevenue,
  exportCsv,
};
