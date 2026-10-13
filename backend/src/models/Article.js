const db = require("../config/db");

const Article = {
  // Lấy danh sách bài viết (guest chỉ thấy 'published', admin thấy cả 'draft')
  async findAll({ category, status, search, limit = 50, offset = 0 } = {}) {
    let conditions = [];
    let params = [];

    if (status && status !== "all") {
      conditions.push("a.status = ?");
      params.push(status);
    }

    if (category && category !== "all") {
      conditions.push("a.category = ?");
      params.push(category);
    }

    if (search) {
      conditions.push(
        "(a.title_en LIKE ? OR a.title_vi LIKE ? OR a.slug LIKE ?)",
      );
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query(
      `SELECT a.*, 
              (SELECT COUNT(*) FROM article_items WHERE article_id = a.id) AS item_count
       FROM articles a
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)],
    );

    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM articles a ${whereClause}`,
      params,
    );

    return {
      articles: rows,
      total: countResult[0]?.total || 0,
    };
  },

  // Lấy chi tiết 1 bài viết theo slug
  async findBySlug(slug) {
    const [rows] = await db.execute(
      `SELECT * FROM articles WHERE slug = ? LIMIT 1`,
      [slug],
    );
    if (!rows[0]) return null;

    const article = rows[0];
    const [items] = await db.execute(
      `SELECT * FROM article_items WHERE article_id = ? ORDER BY sort_order ASC, item_number ASC`,
      [article.id],
    );

    return {
      ...article,
      items: items.map((it) => {
        const pEn =
          typeof it.paragraphs_en === "string"
            ? JSON.parse(it.paragraphs_en || "[]")
            : it.paragraphs_en || [];
        const pVi =
          typeof it.paragraphs_vi === "string"
            ? JSON.parse(it.paragraphs_vi || "[]")
            : it.paragraphs_vi || [];
        return {
          ...it,
          paragraphs_en: pEn,
          paragraphs_vi: pVi,
          content_en: pEn,
          content_vi: pVi,
        };
      }),
    };
  },

  // Lấy chi tiết 1 bài viết theo id
  async findById(id) {
    const [rows] = await db.execute(`SELECT * FROM articles WHERE id = ? LIMIT 1`, [
      id,
    ]);
    if (!rows[0]) return null;

    const article = rows[0];
    const [items] = await db.execute(
      `SELECT * FROM article_items WHERE article_id = ? ORDER BY sort_order ASC, item_number ASC`,
      [article.id],
    );

    return {
      ...article,
      items: items.map((it) => {
        const pEn =
          typeof it.paragraphs_en === "string"
            ? JSON.parse(it.paragraphs_en || "[]")
            : it.paragraphs_en || [];
        const pVi =
          typeof it.paragraphs_vi === "string"
            ? JSON.parse(it.paragraphs_vi || "[]")
            : it.paragraphs_vi || [];
        return {
          ...it,
          paragraphs_en: pEn,
          paragraphs_vi: pVi,
          content_en: pEn,
          content_vi: pVi,
        };
      }),
    };
  },

  // Tạo bài viết mới + các mục nội dung
  async create({
    slug,
    category = "things-to-do",
    province_slug,
    title_en,
    title_vi,
    hero_image,
    author_name = "VinaTap",
    published_date,
    status = "published",
    items = [],
  }) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const formattedDate =
        typeof published_date === "string" && published_date.trim()
          ? published_date.trim()
          : new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

      const [res] = await conn.execute(
        `INSERT INTO articles 
         (slug, category, province_slug, title_en, title_vi, hero_image, author_name, published_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          slug || null,
          category || "things-to-do",
          province_slug || null,
          title_en || "",
          title_vi || "",
          hero_image || "/guide/megamenu/todo-2-hcmc.jpg",
          author_name || "VinaTap",
          formattedDate,
          status || "published",
        ],
      );

      const articleId = res.insertId;

      if (Array.isArray(items) && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const rawEn = it.paragraphs_en ?? it.content_en ?? [];
          const rawVi = it.paragraphs_vi ?? it.content_vi ?? [];
          const pEn = Array.isArray(rawEn) ? rawEn : [String(rawEn || "")];
          const pVi = Array.isArray(rawVi) ? rawVi : [String(rawVi || "")];

          await conn.execute(
            `INSERT INTO article_items 
             (article_id, sort_order, item_number, title_en, title_vi, image_url, caption_en, caption_vi, paragraphs_en, paragraphs_vi, tip_en, tip_vi, affiliate_url, affiliate_partner)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              articleId,
              it.sort_order ?? i,
              it.item_number ?? i + 1,
              it.title_en || "",
              it.title_vi || "",
              it.image_url || "/guide/megamenu/todo-2-hcmc.jpg",
              it.caption_en || null,
              it.caption_vi || null,
              JSON.stringify(pEn),
              JSON.stringify(pVi),
              it.tip_en || null,
              it.tip_vi || null,
              it.affiliate_url || null,
              it.affiliate_partner || null,
            ],
          );
        }
      }

      await conn.commit();
      return articleId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Cập nhật bài viết
  async update(id, fields, items) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const allowedFields = [
        "slug",
        "category",
        "province_slug",
        "title_en",
        "title_vi",
        "hero_image",
        "author_name",
        "published_date",
        "status",
      ];

      const sets = [];
      const values = [];

      for (const key of allowedFields) {
        if (fields[key] !== undefined) {
          sets.push(`${key} = ?`);
          values.push(fields[key] === undefined ? null : fields[key]);
        }
      }

      if (sets.length > 0) {
        values.push(id);
        await conn.execute(
          `UPDATE articles SET ${sets.join(", ")} WHERE id = ?`,
          values,
        );
      }

      // Nếu truyền kèm items, thay thế các mục con
      if (Array.isArray(items)) {
        await conn.execute(`DELETE FROM article_items WHERE article_id = ?`, [id]);

        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const rawEn = it.paragraphs_en ?? it.content_en ?? [];
          const rawVi = it.paragraphs_vi ?? it.content_vi ?? [];
          const pEn = Array.isArray(rawEn) ? rawEn : [String(rawEn || "")];
          const pVi = Array.isArray(rawVi) ? rawVi : [String(rawVi || "")];

          await conn.execute(
            `INSERT INTO article_items 
             (article_id, sort_order, item_number, title_en, title_vi, image_url, caption_en, caption_vi, paragraphs_en, paragraphs_vi, tip_en, tip_vi, affiliate_url, affiliate_partner)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              id,
              it.sort_order ?? i,
              it.item_number ?? i + 1,
              it.title_en || "",
              it.title_vi || "",
              it.image_url || "/guide/megamenu/todo-2-hcmc.jpg",
              it.caption_en || null,
              it.caption_vi || null,
              JSON.stringify(pEn),
              JSON.stringify(pVi),
              it.tip_en || null,
              it.tip_vi || null,
              it.affiliate_url || null,
              it.affiliate_partner || null,
            ],
          );
        }
      }

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },


  // Xóa bài viết
  async delete(id) {
    const [res] = await db.execute(`DELETE FROM articles WHERE id = ?`, [id]);
    return res.affectedRows > 0;
  },

  // Tăng lượt xem
  async incrementViews(slug) {
    await db.execute(
      `UPDATE articles SET views_count = views_count + 1 WHERE slug = ?`,
      [slug],
    );
  },
};

module.exports = Article;
