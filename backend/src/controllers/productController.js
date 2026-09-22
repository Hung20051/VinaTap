const Product = require("../models/Product");

// GET /api/products?includeInactive=1
const getAllProducts = async (req, res) => {
  try {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const includeInactive = req.query.includeInactive === "1";
    const rawProducts = await Product.findAll(includeInactive);

    // Chuẩn hóa bảo vệ dữ liệu: đảm bảo bảng giá thống nhất tuyệt đối
    const products = rawProducts.map((p) => {
      let price = Number(p.price || 0);
      let orig = Number(p.original_price || 0);
      const name = p.name || "";

      if (p.category === "combo" || name.includes("Combo")) {
        if (name.includes("3") && !name.includes("34")) {
          price = 139000;
          orig = 147000;
        } else if (name.includes("5")) {
          price = 239000;
          orig = 245000;
        } else if (name.includes("34")) {
          price = 1400000;
          orig = 1700000;
        }
      } else {
        // Thẻ lẻ: chuẩn 49.000đ, giá gốc 59.000đ
        if (price < 10000) price = 49000;
        if (orig < 10000) orig = 59000;
      }

      return {
        ...p,
        price,
        original_price: orig,
      };
    });

    res.json({ products });
  } catch (err) {
    console.error("getAllProducts:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, category, price, original_price, image, tag, description } = req.body;
    if (!name || price === undefined)
      return res.status(400).json({ message: "Thiếu name hoặc price" });
    if (Number(price) < 0)
      return res.status(400).json({ message: "Giá không được âm" });

    const id = await Product.create({
      name,
      category: category || "single",
      price: Number(price),
      original_price: Number(original_price || 0),
      image: image || "",
      tag: tag || "",
      description: description || "",
    });
    res.status(201).json({ message: "Đã tạo sản phẩm thành công!", id });
  } catch (err) {
    console.error("createProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const { name, category, price, original_price, image, tag, description } = req.body;
    await Product.update(req.params.id, {
      name: name || existing.name,
      category: category || existing.category || "single",
      price: price !== undefined ? Number(price) : existing.price,
      original_price: original_price !== undefined ? Number(original_price) : existing.original_price,
      image: image !== undefined ? image : existing.image,
      tag: tag !== undefined ? tag : existing.tag,
      description: description !== undefined ? description : existing.description,
    });
    res.json({ message: "Đã cập nhật sản phẩm thành công!" });
  } catch (err) {
    console.error("updateProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /api/products/:id/active
const setProductActive = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Product.setActive(req.params.id, !!req.body.is_active);
    res.json({ message: "Đã cập nhật trạng thái sản phẩm" });
  } catch (err) {
    console.error("setProductActive:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Product.delete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm thành công!" });
  } catch (err) {
    console.error("deleteProduct:", err);
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm" });
  }
};

// POST /api/products/sync-standard-prices (Admin)
const syncStandardPrices = async (req, res) => {
  try {
    const db = require("../config/db");

    // 1. Cập nhật tất cả thẻ lẻ 34 tỉnh thành: 49.000đ (giá gốc 59.000đ)
    await db.execute(
      `UPDATE products 
       SET price = 49000.00, original_price = 59000.00 
       WHERE category = 'single'`
    );

    // 2. Cập nhật Combo 3 thẻ: 139.000đ (giá gốc 147.000đ)
    await db.execute(
      `UPDATE products 
       SET price = 139000.00, original_price = 147000.00 
       WHERE name LIKE '%Combo 3%'`
    );

    // 3. Cập nhật Combo 5 thẻ: 239.000đ (giá gốc 245.000đ)
    await db.execute(
      `UPDATE products 
       SET price = 239000.00, original_price = 245000.00 
       WHERE name LIKE '%Combo 5%'`
    );

    // 4. Cập nhật Trọn bộ 34 thẻ: 1.400.000đ (giá gốc 1.700.000đ)
    await db.execute(
      `UPDATE products 
       SET price = 1400000.00, original_price = 1700000.00 
       WHERE name LIKE '%Trọn Bộ 34%'`
    );

    // 5. Đảm bảo Combo 3 tồn tại trong hệ thống
    const [c3] = await db.execute(
      "SELECT id FROM products WHERE name LIKE '%Combo 3%' LIMIT 1"
    );
    if (c3.length === 0) {
      await db.execute(
        `INSERT INTO products (name, category, price, original_price, image, tag, description, is_active)
         VALUES ('Combo 3 Thẻ NFC Du Lịch Tự Chọn', 'combo', 139000.00, 147000.00, 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60', 'Hot', 'Combo 3 thẻ NFC du lịch tự chọn tỉnh thành bất kỳ theo sở thích của bạn.', 1)`
      );
    }

    const [rows] = await db.execute("SELECT id FROM products");
    res.json({
      message:
        "Đã đồng bộ toàn bộ bảng giá chuẩn (1 thẻ: 49k, Combo 3: 139k, Combo 5: 239k, Bộ 34 thẻ: 1.400k) thành công!",
      count: rows.length,
    });
  } catch (err) {
    console.error("syncStandardPrices:", err);
    res.status(500).json({ message: "Lỗi đồng bộ giá sản phẩm" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
  syncStandardPrices,
};

