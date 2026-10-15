const db = require("../config/db");

let cachedItemColumns = null;

async function getArticleItemColumns(conn) {
  if (cachedItemColumns && cachedItemColumns.size > 0) {
    return cachedItemColumns;
  }
  try {
    const [cols] = await conn.query("DESCRIBE article_items");
    const colSet = new Set(cols.map((c) => c.Field));

    const toEnsure = [
      { name: "paragraphs_en", type: "JSON NULL" },
      { name: "paragraphs_vi", type: "JSON NULL" },
      { name: "content_en", type: "JSON NULL" },
      { name: "content_vi", type: "JSON NULL" },
      { name: "tip_en", type: "TEXT NULL" },
      { name: "tip_vi", type: "TEXT NULL" },
      { name: "affiliate_url", type: "VARCHAR(500) NULL" },
      { name: "affiliate_partner", type: "VARCHAR(100) NULL" },
    ];

    for (const col of toEnsure) {
      if (!colSet.has(col.name)) {
        try {
          await conn.query(`ALTER TABLE article_items ADD COLUMN ${col.name} ${col.type}`);
          colSet.add(col.name);
        } catch (_) {}
      }
    }

    cachedItemColumns = colSet;
    return colSet;
  } catch (err) {
    return new Set([
      "article_id",
      "sort_order",
      "item_number",
      "title_en",
      "title_vi",
      "image_url",
      "caption_en",
      "caption_vi",
      "paragraphs_en",
      "paragraphs_vi",
      "content_en",
      "content_vi",
      "tip_en",
      "tip_vi",
      "affiliate_url",
      "affiliate_partner",
    ]);
  }
}

function buildArticleItemInsert(availCols, articleId, it, index) {
  const rawEn = it.paragraphs_en ?? it.content_en ?? [];
  const rawVi = it.paragraphs_vi ?? it.content_vi ?? [];
  const pEn = Array.isArray(rawEn) ? rawEn : [String(rawEn || "")];
  const pVi = Array.isArray(rawVi) ? rawVi : [String(rawVi || "")];

  const colData = {
    article_id: articleId,
    sort_order: it.sort_order ?? index,
    item_number: it.item_number ?? index + 1,
    title_en: it.title_en || "",
    title_vi: it.title_vi || "",
    image_url: it.image_url || "/guide/megamenu/todo-2-hcmc.jpg",
    caption_en: it.caption_en || null,
    caption_vi: it.caption_vi || null,
    tip_en: it.tip_en || null,
    tip_vi: it.tip_vi || null,
    affiliate_url: it.affiliate_url || null,
    affiliate_partner: it.affiliate_partner || null,
  };

  if (availCols.has("paragraphs_en")) {
    colData.paragraphs_en = JSON.stringify(pEn);
  }
  if (availCols.has("paragraphs_vi")) {
    colData.paragraphs_vi = JSON.stringify(pVi);
  }
  if (availCols.has("content_en")) {
    colData.content_en = JSON.stringify(pEn);
  }
  if (availCols.has("content_vi")) {
    colData.content_vi = JSON.stringify(pVi);
  }

  const keys = [];
  const vals = [];
  for (const [k, v] of Object.entries(colData)) {
    if (availCols.has(k)) {
      keys.push(k);
      vals.push(v);
    }
  }

  const placeholders = keys.map(() => "?").join(", ");
  return {
    sql: `INSERT INTO article_items (${keys.join(", ")}) VALUES (${placeholders})`,
    values: vals,
  };
}

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

  // Lấy chi tiết 1 bài viết theo slug hoặc id
  async findBySlug(slug) {
    if (!slug) return null;
    let [rows] = await db.execute(
      `SELECT * FROM articles WHERE slug = ? LIMIT 1`,
      [String(slug)],
    );
    if (!rows[0] && !isNaN(Number(slug))) {
      const [r] = await db.execute(`SELECT * FROM articles WHERE id = ? LIMIT 1`, [
        Number(slug),
      ]);
      rows = r;
    }
    if (!rows[0]) return null;

    const article = rows[0];
    const [items] = await db.execute(
      `SELECT * FROM article_items WHERE article_id = ? ORDER BY sort_order ASC, item_number ASC`,
      [article.id],
    );

    return {
      ...article,
      items: items.map((it) => {
        const rawEn = it.paragraphs_en ?? it.content_en ?? [];
        const rawVi = it.paragraphs_vi ?? it.content_vi ?? [];
        const pEn =
          typeof rawEn === "string"
            ? JSON.parse(rawEn || "[]")
            : rawEn || [];
        const pVi =
          typeof rawVi === "string"
            ? JSON.parse(rawVi || "[]")
            : rawVi || [];
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

  // Lấy chi tiết 1 bài viết theo id hoặc slug
  async findById(id) {
    if (!id) return null;
    let rows;
    if (!isNaN(Number(id))) {
      const [r] = await db.execute(`SELECT * FROM articles WHERE id = ? LIMIT 1`, [
        Number(id),
      ]);
      rows = r;
    }
    if (!rows || !rows[0]) {
      const [r] = await db.execute(`SELECT * FROM articles WHERE slug = ? LIMIT 1`, [
        String(id),
      ]);
      rows = r;
    }
    if (!rows || !rows[0]) return null;

    const article = rows[0];
    const [items] = await db.execute(
      `SELECT * FROM article_items WHERE article_id = ? ORDER BY sort_order ASC, item_number ASC`,
      [article.id],
    );

    return {
      ...article,
      items: items.map((it) => {
        const rawEn = it.paragraphs_en ?? it.content_en ?? [];
        const rawVi = it.paragraphs_vi ?? it.content_vi ?? [];
        const pEn =
          typeof rawEn === "string"
            ? JSON.parse(rawEn || "[]")
            : rawEn || [];
        const pVi =
          typeof rawVi === "string"
            ? JSON.parse(rawVi || "[]")
            : rawVi || [];
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
        const availCols = await getArticleItemColumns(conn);
        for (let i = 0; i < items.length; i++) {
          const { sql, values } = buildArticleItemInsert(availCols, articleId, items[i], i);
          await conn.execute(sql, values);
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
        const availCols = await getArticleItemColumns(conn);

        for (let i = 0; i < items.length; i++) {
          const { sql, values } = buildArticleItemInsert(availCols, id, items[i], i);
          await conn.execute(sql, values);
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


  // Xóa bài viết theo id hoặc slug
  async delete(id) {
    if (!id) return false;
    let res;
    if (!isNaN(Number(id))) {
      const [r] = await db.execute(`DELETE FROM articles WHERE id = ?`, [Number(id)]);
      res = r;
    } else {
      const [r] = await db.execute(`DELETE FROM articles WHERE slug = ?`, [String(id)]);
      res = r;
    }
    return res?.affectedRows > 0;
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
