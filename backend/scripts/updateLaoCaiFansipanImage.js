require("dotenv").config();

const db = require("../src/config/db");

async function updateFansipanImage() {
  try {
    const [result] = await db.execute(
      `UPDATE landmarks AS l
       INNER JOIN provinces AS p ON p.id = l.province_id
       SET l.thumbnail_url = ?
       WHERE p.slug = 'lao-cai'
         AND l.name = 'Đỉnh Fansipan - Nóc Nhà Đông Dương'`,
      ["/lao-cai-fansipan.jpg"],
    );

    if (!result.affectedRows) {
      throw new Error("Không tìm thấy địa danh Đỉnh Fansipan - Nóc Nhà Đông Dương của Lào Cai.");
    }

    console.log("Đã cập nhật ảnh cho Đỉnh Fansipan - Nóc Nhà Đông Dương.");
  } finally {
    await db.end();
  }
}

updateFansipanImage().catch((error) => {
  console.error("Không thể cập nhật ảnh Fansipan:", error.message);
  process.exitCode = 1;
});
