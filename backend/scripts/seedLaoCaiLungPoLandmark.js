require("dotenv").config();

const db = require("../src/config/db");

const landmark = {
  name: "Cột cờ Lũng Pô",
  address: "Xã A Mú Sung, huyện Bát Xát, tỉnh Lào Cai",
  description:
    "Cột cờ Lũng Pô là điểm đến giàu ý nghĩa ở vùng biên giới Lào Cai, nơi du khách có thể ngắm cảnh núi rừng và tìm hiểu thêm về chủ quyền biên cương.",
  thumbnailUrl: "/lao-cai-cot-co-lung-po.avif",
};

async function seedLungPoLandmark() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[province]] = await connection.execute(
      "SELECT id FROM provinces WHERE slug = 'lao-cai' LIMIT 1",
    );

    if (!province) throw new Error("Không tìm thấy tỉnh Lào Cai.");

    const [[existing]] = await connection.execute(
      "SELECT id FROM landmarks WHERE province_id = ? AND name = ? LIMIT 1",
      [province.id, landmark.name],
    );

    if (existing) {
      await connection.execute(
        `UPDATE landmarks
         SET address = ?, thumbnail_url = ?, description = ?, category = 'attraction', status = 'active'
         WHERE id = ?`,
        [landmark.address, landmark.thumbnailUrl, landmark.description, existing.id],
      );
    } else {
      const [[{ nextSortOrder }]] = await connection.execute(
        "SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextSortOrder FROM landmarks WHERE province_id = ?",
        [province.id],
      );
      await connection.execute(
        `INSERT INTO landmarks (province_id, name, address, thumbnail_url, description, category, sort_order, status)
         VALUES (?, ?, ?, ?, ?, 'attraction', ?, 'active')`,
        [
          province.id,
          landmark.name,
          landmark.address,
          landmark.thumbnailUrl,
          landmark.description,
          nextSortOrder,
        ],
      );
    }

    await connection.commit();
    console.log("Đã thêm/cập nhật Cột cờ Lũng Pô cho Lào Cai.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
}

seedLungPoLandmark().catch((error) => {
  console.error("Không thể thêm Cột cờ Lũng Pô:", error.message);
  process.exitCode = 1;
});
