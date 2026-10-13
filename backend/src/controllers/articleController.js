const Article = require("../models/Article");

// GET /api/articles (Public & Admin)
const getAllArticles = async (req, res) => {
  try {
    const { category, search, status, limit, offset } = req.query;
    // Guest chỉ được xem bài đã xuất bản, admin xem tất cả hoặc theo status lọc
    const role = req.user?.role;
    const filterStatus =
      role === "admin"
        ? status === "all" || !status
          ? undefined
          : status
        : "published";

    const data = await Article.findAll({
      category: category === "all" ? undefined : category,
      search,
      status: filterStatus,
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    });

    res.json(data);
  } catch (err) {
    console.error("getAllArticles error:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách bài viết" });
  }
};

// GET /api/articles/:slug
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: "Thiếu slug bài viết" });
    }

    const article = await Article.findBySlug(slug);
    if (!article) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Tăng views count không chặn response
    Article.incrementViews(slug).catch((e) =>
      console.warn("incrementViews warn:", e.message),
    );

    res.json({ article });
  } catch (err) {
    console.error("getArticleBySlug error:", err);
    res.status(500).json({ message: "Lỗi lấy thông tin bài viết" });
  }
};

// POST /api/articles (Admin only)
const createArticle = async (req, res) => {
  try {
    const {
      slug,
      category,
      province_slug,
      title_en,
      title_vi,
      hero_image,
      author_name,
      published_date,
      status,
      items,
    } = req.body;

    // Validation
    if (!title_en || !title_vi) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ tiêu đề EN và VI" });
    }

    const cleanSlug = (
      slug ||
      title_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    ).trim();

    if (!cleanSlug) {
      return res.status(400).json({ message: "Slug bài viết không hợp lệ" });
    }

    // Kiểm tra trùng lặp slug
    const existing = await Article.findBySlug(cleanSlug);
    if (existing) {
      return res.status(400).json({ message: "Đường dẫn (slug) này đã tồn tại" });
    }

    const id = await Article.create({
      slug: cleanSlug,
      category: category || "things-to-do",
      province_slug,
      title_en: title_en.trim(),
      title_vi: title_vi.trim(),
      hero_image: hero_image || "/guide/megamenu/todo-2-hcmc.jpg",
      author_name: author_name || "VinaTap",
      published_date: published_date || new Date(),
      status: ["draft", "published", "archived"].includes(status)
        ? status
        : "published",
      items: Array.isArray(items) ? items : [],
    });

    const created = await Article.findById(id);
    res.status(201).json({ success: true, article: created });
  } catch (err) {
    console.error("createArticle error:", err);
    res.status(500).json({ message: err.message || "Lỗi tạo bài viết mới" });
  }
};

// PUT /api/articles/:id (Admin only)
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      slug,
      category,
      province_slug,
      title_en,
      title_vi,
      hero_image,
      author_name,
      published_date,
      status,
      items,
    } = req.body;

    const existing = await Article.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Nếu sửa slug, kiểm tra không được trùng với bài khác
    if (slug && slug !== existing.slug) {
      const duplicate = await Article.findBySlug(slug);
      if (duplicate && duplicate.id !== Number(id)) {
        return res.status(400).json({ message: "Slug đã được sử dụng bởi bài viết khác" });
      }
    }

    await Article.update(
      id,
      {
        slug: slug?.trim(),
        category,
        province_slug,
        title_en: title_en?.trim(),
        title_vi: title_vi?.trim(),
        hero_image,
        author_name,
        published_date,
        status,
      },
      items,
    );

    const updated = await Article.findById(id);
    res.json({ success: true, article: updated });
  } catch (err) {
    console.error("updateArticle error:", err);
    res.status(500).json({ message: err.message || "Lỗi cập nhật bài viết" });
  }
};

// DELETE /api/articles/:id (Admin only)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Article.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    await Article.delete(id);
    res.json({ success: true, message: "Đã xóa bài viết thành công" });
  } catch (err) {
    console.error("deleteArticle error:", err);
    res.status(500).json({ message: "Lỗi xóa bài viết" });
  }
};

module.exports = {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};
