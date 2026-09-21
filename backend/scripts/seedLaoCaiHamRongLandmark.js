require("dotenv").config();

const db = require("../src/config/db");

const landmark = {
  name: "Núi Hàm Rồng",
  address: "Khu du lịch Núi Hàm Rồng, Sa Pa, tỉnh Lào Cai",
  description:
    "Núi Hàm Rồng là điểm ngắm cảnh nổi tiếng gần trung tâm Sa Pa, với những khu vườn hoa, khối đá tự nhiên và tầm nhìn rộng ra thung lũng mây.",
  thumbnailUrl: "/lao-cai-nui-ham-rong.jpg",
};

async function seedHamRongLandmark() {
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
    console.log("Đã thêm/cập nhật Núi Hàm Rồng cho Lào Cai.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
}

seedHamRongLandmark().catch((error) => {
  console.error("Không thể thêm Núi Hàm Rồng:", error.message);
  process.exitCode = 1;
});
