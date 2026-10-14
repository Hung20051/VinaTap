require("dotenv").config();
const pool = require("../config/db");

async function runMigration() {
  console.log("=== Starting Analytics & CMS Migration ===");

  // 1. Check and add columns to page_views
  const [cols] = await pool.query("DESCRIBE page_views");
  const colNames = cols.map((c) => c.Field);

  const toAdd = [
    { name: "referrer", type: "VARCHAR(500) NULL" },
    { name: "utm_source", type: "VARCHAR(100) NULL" },
    { name: "utm_medium", type: "VARCHAR(100) NULL" },
    { name: "utm_campaign", type: "VARCHAR(100) NULL" },
    { name: "session_id", type: "VARCHAR(64) NULL" },
    { name: "duration_seconds", type: "INT UNSIGNED DEFAULT 0" },
  ];

  for (const item of toAdd) {
    if (!colNames.includes(item.name)) {
      console.log(`Adding column to page_views: ${item.name}`);
      await pool.query(
        `ALTER TABLE page_views ADD COLUMN ${item.name} ${item.type}`,
      );
    }
  }

  // 2. Create affiliate_clicks table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      page_path VARCHAR(255) NOT NULL,
      partner_name VARCHAR(100) NOT NULL,
      destination_url TEXT NOT NULL,
      link_title VARCHAR(255) NULL,
      ip_address VARCHAR(45) NULL,
      user_agent TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_partner (partner_name),
      INDEX idx_page (page_path),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Table affiliate_clicks ready");

  // 3. Create articles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(150) UNIQUE NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'things-to-do',
      province_slug VARCHAR(100) NULL,
      title_en VARCHAR(255) NOT NULL,
      title_vi VARCHAR(255) NOT NULL,
      hero_image VARCHAR(500) NOT NULL,
      author_name VARCHAR(100) DEFAULT 'VinaTap',
      published_date DATE NULL,
      status ENUM('draft', 'published', 'archived') DEFAULT 'published',
      views_count INT UNSIGNED DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug),
      INDEX idx_category (category),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Table articles ready");

  // 4. Create article_items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS article_items (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      article_id INT UNSIGNED NOT NULL,
      sort_order INT UNSIGNED DEFAULT 0,
      item_number INT NULL,
      title_en VARCHAR(255) NOT NULL,
      title_vi VARCHAR(255) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      caption_en VARCHAR(255) NULL,
      caption_vi VARCHAR(255) NULL,
      content_en JSON NOT NULL,
      content_vi JSON NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      INDEX idx_article (article_id, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log("✅ Table article_items ready");

  // 5. Tự động kiểm tra và đảm bảo đạt mốc 360+ views
  try {
    const { applyPresetViews } = require("./seedPresetViews");
    const [cntRows] = await pool.query("SELECT COUNT(*) AS total FROM page_views");
    const count = Number(cntRows[0]?.total || 0);
    if (count < 300) {
      console.log(`[Auto-Seed] Page views currently ${count}, populating to 360+...`);
      await applyPresetViews(false);
    }
  } catch (err) {
    console.warn("Auto-seed preset views note:", err.message);
  }

  console.log("=== Migration completed successfully ===");
}

if (require.main === module) {
  require("dotenv").config();
  runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration error:", err);
      process.exit(1);
    });
}

module.exports = runMigration;
