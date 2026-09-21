require("dotenv").config();

const db = require("../src/config/db");

async function updateLaoCaiCoverImage() {
  try {
    const [result] = await db.execute(
      "UPDATE provinces SET thumbnail_url = ? WHERE slug = 'lao-cai'",
      ["/lao-cai-cover.jpg"],
    );

    if (!result.affectedRows) throw new Error("Không tìm thấy tỉnh Lào Cai.");
    console.log("Đã cập nhật ảnh bìa tỉnh Lào Cai.");
  } finally {
    await db.end();
  }
}

updateLaoCaiCoverImage().catch((error) => {
  console.error("Không thể cập nhật ảnh bìa Lào Cai:", error.message);
  process.exitCode = 1;
});
