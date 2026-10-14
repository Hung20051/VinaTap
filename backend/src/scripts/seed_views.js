const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { applyPresetViews } = require("../utils/seedPresetViews");

async function main() {
  console.log("🌱 Bắt đầu chuẩn hóa dữ liệu lượt xem...");
  const res = await applyPresetViews(true);
  console.log("✅ Kết quả:", res);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
