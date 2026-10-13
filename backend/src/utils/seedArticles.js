require("dotenv").config();
const pool = require("../config/db");

async function seedInitialArticles() {
  console.log("Seeding initial articles for CMS...");

  // 1. Article: 8 best things to do in Nha Trang
  const [existingNhaTrang] = await pool.query(
    "SELECT id FROM articles WHERE slug = ?",
    ["8-best-things-to-do-in-nha-trang"],
  );

  if (existingNhaTrang.length === 0) {
    const [res] = await pool.execute(
      `INSERT INTO articles 
       (slug, category, province_slug, title_en, title_vi, hero_image, author_name, published_date, status, views_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "8-best-things-to-do-in-nha-trang",
        "things-to-do",
        "khanh-hoa",
        "8 best things to do in Nha Trang",
        "8 trải nghiệm tuyệt nhất tại Nha Trang",
        "/guide/megamenu/todo-3-nhatrang.jpg",
        "VinaTap",
        "2025-03-01",
        "published",
        186,
      ],
    );

    const articleId = res.insertId;

    const items = [
      {
        num: 1,
        titleEn: "1. Dive into the islands and coral reefs",
        titleVi: "1. Khám phá các hòn đảo thơ mộng và lặn ngắm san hô",
        img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Hon-Mun-island.jpg",
        captionEn: "Hon Mun Island",
        captionVi: "Đảo Hòn Mun – Thiên đường san hô",
        contentEn: [
          "Nha Trang is famous for its stunning coastlines and lively coral reefs. You can head out on a boat tour to explore popular islands like Hon Mun, Hon Tam, and Hon Mot.",
        ],
        contentVi: [
          "Nha Trang nổi tiếng với những vịnh biển tuyệt đẹp và rạn san hô trù phú. Các tour du ngoạn khám phá Hòn Mun, Hòn Tằm và Hòn Một là lựa chọn không thể bỏ qua.",
        ],
      },
      {
        num: 2,
        titleEn: "2. Rejuvenate at natural hot springs and mud baths",
        titleVi: "2. Phục hồi năng lượng với tắm bùn khoáng tự nhiên",
        img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Mud-bath.jpg",
        captionEn: "I-Resort Nha Trang",
        captionVi: "Trải nghiệm tắm bùn khoáng thư giãn",
        contentEn: [
          "After a day in the sun, there's nothing better than soaking in warm mineral mud. Places like Thap Ba Hot Springs or I-Resort offer total relaxation.",
        ],
        contentVi: [
          "Tắm bùn khoáng nóng tự nhiên là trải nghiệm trị liệu phục hồi sức khỏe đặc trưng của phố biển Nha Trang tại Suối khoáng Tháp Bà và I-Resort.",
        ],
      },
      {
        num: 7,
        titleEn: "7. Hit up the amusement parks",
        titleVi: "7. Bùng nổ cảm xúc tại các khu vui chơi giải trí đỉnh cao",
        img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Vinwonders-Nha-Trang.jpg",
        captionEn: "VinWonders Nha Trang",
        captionVi: "VinWonders Nha Trang trên đảo Hòn Tre",
        contentEn: [
          "VinWonders is an awesome choice for both parents and kids, offering a ton of games and attractions to keep everyone entertained.",
        ],
        contentVi: [
          "VinWonders Nha Trang là điểm đến giải trí hàng đầu với công viên nước, trò chơi mạo hiểm và Tata Show hoành tráng.",
        ],
      },
      {
        num: 8,
        titleEn: "8. Savor sunsets in the coastal city",
        titleVi: "8. Thưởng ngoạn hoàng hôn lãng mạn trên vịnh biển",
        img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Nha-Trang-at-night.jpg",
        captionEn: "Tran Phu Beach at night",
        captionVi: "Phố biển Trần Phú rực rỡ khi đêm về",
        contentEn: [
          "As the day winds down, take a moment to soak in the majestic sunset as the sun dips below the horizon on a sunset cruise or SUP board.",
        ],
        contentVi: [
          "Khoảnh khắc hoàng hôn Nha Trang lung linh kỳ ảo khi ngắm nhìn từ du thuyền sang trọng hoặc chèo SUP lững lờ trên sóng biếc.",
        ],
      },
    ];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await pool.execute(
        `INSERT INTO article_items 
         (article_id, sort_order, item_number, title_en, title_vi, image_url, caption_en, caption_vi, content_en, content_vi)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          articleId,
          i,
          it.num,
          it.titleEn,
          it.titleVi,
          it.img,
          it.captionEn,
          it.captionVi,
          JSON.stringify(it.contentEn),
          JSON.stringify(it.contentVi),
        ],
      );
    }

    console.log("✅ Seeded Nha Trang article");
  }

  // 2. Article: 10 best things to do in Ho Chi Minh City
  const [existingHCMC] = await pool.query(
    "SELECT id FROM articles WHERE slug = ?",
    ["10-best-things-to-do-in-ho-chi-minh-city"],
  );

  if (existingHCMC.length === 0) {
    const [res] = await pool.execute(
      `INSERT INTO articles 
       (slug, category, province_slug, title_en, title_vi, hero_image, author_name, published_date, status, views_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "10-best-things-to-do-in-ho-chi-minh-city",
        "things-to-do",
        "ho-chi-minh",
        "10 best things to do in Ho Chi Minh City",
        "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        "/guide/megamenu/todo-2-hcmc.jpg",
        "VinaTap",
        "2025-05-05",
        "published",
        342,
      ],
    );

    const articleId = res.insertId;

    const items = [
      {
        num: 1,
        titleEn: "1. Discover Vietnam's rich history",
        titleVi: "1. Khám phá bề dày lịch sử Việt Nam",
        img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-War-Remnants-Museum-Vietnamnomad.jpg",
        captionEn: "War Remnants Museum",
        captionVi: "Bảo tàng Chứng tích Chiến tranh",
        contentEn: [
          "History buffs will love Ho Chi Minh City's range of museums, from the Museum of History to the War Remnants Museum.",
        ],
        contentVi: [
          "Hành trình tìm hiểu lịch sử hào hùng qua Bảo tàng Lịch sử và Bảo tàng Chứng tích Chiến tranh nổi tiếng.",
        ],
      },
    ];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await pool.execute(
        `INSERT INTO article_items 
         (article_id, sort_order, item_number, title_en, title_vi, image_url, caption_en, caption_vi, content_en, content_vi)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          articleId,
          i,
          it.num,
          it.titleEn,
          it.titleVi,
          it.img,
          it.captionEn,
          it.captionVi,
          JSON.stringify(it.contentEn),
          JSON.stringify(it.contentVi),
        ],
      );
    }

    console.log("✅ Seeded HCMC article");
  }

  console.log("Seeding finished successfully!");
}

if (require.main === module) {
  seedInitialArticles()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}

module.exports = seedInitialArticles;
