const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const pool = require('../config/db');

async function main() {
  // 1. Check old page_views
  const [oldRows] = await pool.query("SELECT COUNT(*) AS c FROM page_views WHERE created_at < '2026-10-10 00:00:00'");
  console.log("Old page_views (< 2026-10-10):", oldRows[0].c);

  if (oldRows[0].c > 0) {
    await pool.query("DELETE FROM page_views WHERE created_at < '2026-10-10 00:00:00'");
    console.log("Deleted old page_views successfully.");
  }

  // 2. Check timeline grouping
  const [timeline] = await pool.query(`
    SELECT DATE_FORMAT(created_at, '%d/%m') AS time_label, COUNT(*) AS views, COUNT(DISTINCT ip_address) AS visitors
    FROM page_views
    WHERE created_at >= '2026-10-10 00:00:00'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d'), DATE_FORMAT(created_at, '%d/%m')
    ORDER BY DATE_FORMAT(created_at, '%Y-%m-%d') ASC
  `);
  console.log("Updated timeline starting from 10/10:", timeline);

  // 3. Seed affiliate clicks if empty
  const [affiliateRows] = await pool.query("SELECT COUNT(*) AS c FROM affiliate_clicks");
  console.log("Current affiliate_clicks:", affiliateRows[0].c);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
