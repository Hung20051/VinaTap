require("dotenv").config();

const db = require("../src/config/db");

const islands = [
  {
    name: "Hoàng Sa",
    slug: "hoang-sa",
    description:
      "Quần đảo Hoàng Sa là phần lãnh thổ thiêng liêng của Việt Nam trên Biển Đông, mang dấu ấn lịch sử, chủ quyền và văn hóa biển đảo.",
    thumbnail: "/hoang-sa-bien-dao.jpg",
    landmarks: [
      [
        "Quần đảo Hoàng Sa",
        "Biển Đông, Việt Nam",
        "Quần đảo có vị trí chiến lược, là một phần không thể tách rời của lãnh thổ Việt Nam.",
      ],
      [
        "Hải đội Hoàng Sa",
        "Lý Sơn, Quảng Ngãi",
        "Không gian lưu giữ ký ức về đội hùng binh Hoàng Sa đã vượt biển thực thi chủ quyền từ nhiều thế kỷ.",
      ],
      [
        "Nhà trưng bày Hoàng Sa",
        "Đường Hoàng Sa, Sơn Trà, Đà Nẵng",
        "Nơi giới thiệu tư liệu, bản đồ và hiện vật khẳng định chủ quyền của Việt Nam đối với quần đảo Hoàng Sa.",
      ],
    ],
    articles: [
      ["transport", "Tìm hiểu hành trình ra với biển đảo Việt Nam", "Các chuyến công tác, nghiên cứu và hoạt động hướng về biển đảo góp phần kết nối đất liền với vùng biển quê hương."],
      ["itinerary", "Gợi ý hành trình tìm hiểu chủ quyền biển đảo", "Kết hợp tham quan Nhà trưng bày Hoàng Sa tại Đà Nẵng và các điểm tư liệu biển đảo tại miền Trung."],
      ["tips", "Lưu ý khi tìm hiểu tư liệu về Hoàng Sa", "Ưu tiên các nguồn tư liệu chính thống, tôn trọng không gian trưng bày và gìn giữ tinh thần hướng về biển đảo."],
      ["review", "Hoàng Sa trong trái tim người Việt", "Mỗi tư liệu về Hoàng Sa là một lát cắt lịch sử, nhắc nhớ tình yêu và trách nhiệm với biển đảo quê hương."],
    ],
  },
  {
    name: "Trường Sa",
    slug: "truong-sa",
    description:
      "Quần đảo Trường Sa là phần lãnh thổ thiêng liêng của Việt Nam, nơi hội tụ vẻ đẹp kiên cường của biển xanh, đảo xa và những người lính canh giữ chủ quyền.",
    thumbnail: "/truong-sa-cot-moc.jpg",
    landmarks: [
      [
        "Quần đảo Trường Sa",
        "Biển Đông, Việt Nam",
        "Quần đảo giữ vị trí quan trọng trên Biển Đông, là một phần không thể tách rời của lãnh thổ Việt Nam.",
      ],
      [
        "Cột mốc chủ quyền Trường Sa",
        "Đảo Trường Sa, huyện Trường Sa, Khánh Hòa",
        "Biểu tượng khẳng định chủ quyền biển đảo và ý chí bền bỉ của Việt Nam nơi đầu sóng ngọn gió.",
      ],
      [
        "Chùa Trường Sa",
        "Đảo Trường Sa, huyện Trường Sa, Khánh Hòa",
        "Không gian văn hóa tâm linh giữa biển khơi, gửi gắm ước nguyện bình an cho quân dân trên đảo.",
      ],
    ],
    articles: [
      ["transport", "Hành trình hướng về Trường Sa", "Thông tin về Trường Sa nên được tìm hiểu qua các nguồn chính thống và hoạt động giáo dục chủ quyền biển đảo."],
      ["itinerary", "Gợi ý hành trình tìm hiểu Trường Sa", "Bạn có thể ghé các không gian tư liệu biển đảo ở Khánh Hòa, Đà Nẵng và nhiều địa phương trên cả nước."],
      ["tips", "Những điều cần biết về Trường Sa", "Tôn trọng quy định tại các khu trưng bày và chọn lọc thông tin từ nguồn đáng tin cậy khi tìm hiểu về biển đảo."],
      ["review", "Trường Sa – nơi đầu sóng ngọn gió", "Câu chuyện về người lính đảo và cuộc sống trên Trường Sa luôn là nguồn cảm hứng về tình yêu Tổ quốc."],
    ],
  },
];

async function seed() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    for (const island of islands) {
      await connection.execute(
        `INSERT INTO provinces (name, slug, region, description, thumbnail_url, status)
         VALUES (?, ?, 'island', ?, ?, 'active')
         ON DUPLICATE KEY UPDATE
           name = VALUES(name), region = VALUES(region), description = VALUES(description),
           thumbnail_url = VALUES(thumbnail_url), status = 'active'`,
        [island.name, island.slug, island.description, island.thumbnail],
      );

      const [[province]] = await connection.execute(
        "SELECT id FROM provinces WHERE slug = ? LIMIT 1",
        [island.slug],
      );

      const [[{ total: landmarkTotal }]] = await connection.execute(
        "SELECT COUNT(*) AS total FROM landmarks WHERE province_id = ?",
        [province.id],
      );
      if (!landmarkTotal) {
        for (const [name, address, description] of island.landmarks) {
          await connection.execute(
            `INSERT INTO landmarks (province_id, name, address, thumbnail_url, description, category, sort_order, status)
             VALUES (?, ?, ?, ?, ?, 'attraction', ?, 'active')`,
            [province.id, name, address, island.thumbnail, description, island.landmarks.indexOf(island.landmarks.find((item) => item[0] === name)) + 1],
          );
        }
      }

      const [[{ total: articleTotal }]] = await connection.execute(
        "SELECT COUNT(*) AS total FROM province_articles WHERE province_id = ?",
        [province.id],
      );
      if (!articleTotal) {
        for (const [category, title, description] of island.articles) {
          await connection.execute(
            `INSERT INTO province_articles (province_id, category, title, image_url, description, view_count, published_date, is_featured, sort_order, status)
             VALUES (?, ?, ?, ?, ?, '0', CURDATE(), 0, ?, 'active')`,
            [province.id, category, title, island.thumbnail, description, island.articles.indexOf(island.articles.find((item) => item[1] === title)) + 1],
          );
        }
      }
    }

    await connection.commit();
    console.log("Đã thêm/cập nhật Hoàng Sa và Trường Sa.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await db.end();
  }
}

seed().catch((error) => {
  console.error("Không thể thêm dữ liệu hải đảo:", error.message);
  process.exitCode = 1;
});
