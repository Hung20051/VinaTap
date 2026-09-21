require("dotenv").config();

const db = require("../src/config/db");

async function updateCatCatImage() {
  try {
    const [result] = await db.execute(
      `UPDATE landmarks AS l
       INNER JOIN provinces AS p ON p.id = l.province_id
       SET l.thumbnail_url = ?
       WHERE p.slug = 'lao-cai'
         AND l.name = 'Bản Cát Cát Sa Pa'`,
      ["/lao-cai-ban-cat-cat.jpg"],
    );

    if (!result.affectedRows) {
      throw new Error("Không tìm thấy địa danh Bản Cát Cát Sa Pa của Lào Cai.");
    }

    console.log("Đã cập nhật ảnh cho Bản Cát Cát Sa Pa.");
  } finally {
    await db.end();
  }
}

updateCatCatImage().catch((error) => {
  console.error("Không thể cập nhật ảnh Bản Cát Cát:", error.message);
  process.exitCode = 1;
});
