/**
 * Dữ liệu & Hàm tạo Cẩm nang Du lịch Chuẩn MIA.vn cho 34+ Tỉnh thành Việt Nam
 * Hỗ trợ đầy đủ: Điểm tham quan, Quán ăn nổi tiếng, Cẩm nang 3 cột (Di chuyển, Lịch trình, Kinh nghiệm), Góc review, Lễ hội.
 */

export const DANANG_GUIDE_DATA = {
  landmarks: [
    {
      id: "mikazuki",
      name: "Công viên nước Mikazuki Đà Nẵng",
      category: "attraction",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
      address: "Khu du lịch Xuân Thiều, Đ. Nguyễn Tất Thành, Q. Liên Chiểu, Đà Nẵng",
      desc: "Tổ hợp công viên nước trong nhà và suối khoáng nóng chuẩn Onsen Nhật Bản lớn nhất miền Trung.",
    },
    {
      id: "mykhe",
      name: "Bãi biển Mỹ Khê Đà Nẵng",
      category: "beach",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      address: "Đường Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
      desc: "Top bãi biển quyến rũ nhất hành tinh do Forbes bình chọn với bờ cát trắng mịn và làn nước trong xanh.",
    },
    {
      id: "suoiluong",
      name: "Khu du lịch Suối Lương Đà Nẵng",
      category: "attraction",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      address: "Phường Hòa Hiệp Bắc, Liên Chiểu, Đà Nẵng (dưới chân đèo Hải Vân)",
      desc: "Không gian sinh thái thiên nhiên xanh ngát với dòng suối mát lành và các nhà sàn dân tộc độc đáo.",
    },
    {
      id: "bana",
      name: "Cầu Vàng Bà Nà Hills",
      category: "attraction",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
      address: "Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, Đà Nẵng",
      desc: "Kỳ quan kiến trúc bàn tay khổng lồ giữa mây ngàn và quần thể nghỉ dưỡng giải trí đẳng cấp quốc tế.",
    },
    {
      id: "nguhanhson",
      name: "Danh thắng Ngũ Hành Sơn",
      category: "temple",
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
      address: "81 Huyền Trân Công Chúa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng",
      desc: "Quần thể 5 ngọn núi đá vôi mang tên Kim Mộc Thủy Hỏa Thổ với hệ thống hang động và chùa chiền linh thiêng.",
    },
    {
      id: "caurong",
      name: "Cầu Rồng Đà Nẵng",
      category: "attraction",
      image: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80",
      address: "Đường Nguyễn Văn Linh, Phước Ninh, Hải Châu, Đà Nẵng",
      desc: "Biểu tượng hiện đại của thành phố với màn phun lửa, phun nước rực rỡ vào mỗi dịp cuối tuần.",
    },
  ],

  culinary: {
    list: [
      {
        id: "c1",
        title: "Chip chip hấp sả - Đậm đà hương vị miền Trung",
        date: "08/07/2026",
        views: "128,632",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80",
        address: "Các quán hải sản ven biển đường Võ Nguyên Giáp & Hoàng Sa",
        desc: "Món ốc chip chip tươi ngọt hấp cùng sả ớt cay nồng, ăn kèm muối tiêu chanh chuẩn vị biển Đà Nẵng.",
      },
      {
        id: "c2",
        title: "Lưu ngay list 10 quán bánh tráng kẹp Đà Nẵng càng ăn càng ghiền",
        date: "08/07/2026",
        views: "102,306",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
        address: "Bánh tráng kẹp Dì Hoa (Núi Thành), Bánh tráng kẹp Dì Hoàng (K142/46/09 Điện Biên Phủ)",
        desc: "Món ăn vặt trứ danh với nhân pate, trứng cút béo ngậy được nướng giòn rụm chấm nước sốt bò khô đặc sánh.",
      },
      {
        id: "c3",
        title: "Top 11 quán bánh bèo Đà Nẵng ngon chuẩn vị nổi tiếng nhất",
        date: "09/09/2026",
        views: "98,889",
        image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
        address: "Quán Bà Bé (100 Hoàng Văn Thụ), Quán Tâm (291 Nguyễn Chí Thanh)",
        desc: "Bánh bèo chén bột gạo mềm mướt, phủ tôm chấy đỏ cam, mỡ hành thơm phức chan nước mắm chua ngọt.",
      },
      {
        id: "c4",
        title: "Muốn tìm quán bánh tráng cuốn thịt heo Đà Nẵng chuẩn vị phải bỏ túi ngay danh sách này",
        date: "05/06/2026",
        views: "98,277",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
        address: "Bánh tráng cuốn thịt heo Đại Lộc Nhỏ (27/2 Thái Phiên), Quán Mậu (35 Đỗ Thúc Tịnh)",
        desc: "Thịt heo hai đầu da luộc mềm béo cuộn bánh tráng Đại Lộc, rau rừng tươi non chấm mắm nêm đậm đà.",
      },
    ],
    featuredMain: {
      id: "f1",
      title: "Hải sản Năm Đảnh - Quán hải sản nổi tiếng nhất Đà Nẵng có ngon như lời đồn?",
      image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80",
      address: "K139/H59/38 Trần Quang Khải, Thọ Quang, Sơn Trà, Đà Nẵng",
      desc: "Thiên đường hải sản đồng giá tươi rói nổi tiếng được đông đảo tín đồ ẩm thực săn đón khi tới Đà Nẵng.",
    },
    featuredSub: {
      id: "f2",
      title: "Bê thui Cầu Mống - Đặc sản không thể bỏ qua trong hành trình trải nghiệm món ngon Đà Nẵng",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      address: "Bê thui Rô (895 Ngô Quyền), Bê thui Kim Chi (490 Trưng Nữ Vương)",
      desc: "Thịt bê quay than hồng da giòn thịt mềm ngọt thái lát mỏng chấm tương mè mắm cái trứ danh.",
    },
  },

  guides: {
    transport: {
      title: "Di chuyển",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
      articles: [
        { id: "t1", title: "Top 6 nhà xe Đà Nẵng Sài Gòn tốt nhất 2026 cùng lịch trình, giá vé", link: "#" },
        { id: "t2", title: "Hướng dẫn di chuyển từ TP.HCM đến Đà Nẵng thuận tiện nhất", link: "#" },
        { id: "t3", title: "Di chuyển từ Hà Nội đến Đà Nẵng như thế nào nhanh và tiết kiệm?", link: "#" },
        { id: "t4", title: "Top 9 hãng taxi Đà Nẵng uy tín, chuyên nghiệp và tận tâm nhất", link: "#" },
        { id: "t5", title: "Review đoàn tàu chất lượng cao Hà Nội - Đà Nẵng SE19 và SE20", link: "#" },
      ],
    },
    itineraries: {
      title: "Gợi ý lịch trình",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
      articles: [
        { id: "i1", title: "Lịch trình khám phá Bà Nà Hills tự túc trong 1 ngày trọn vẹn", link: "#" },
        { id: "i2", title: "Lịch trình khám phá Đà Nẵng tự túc trong 1 ngày vô cùng thú vị", link: "#" },
        { id: "i3", title: "Lịch trình Đà Nẵng 4N3Đ tự túc lý tưởng nhất cho nhóm bạn & gia đình", link: "#" },
        { id: "i4", title: "Lịch trình du lịch Đà Nẵng 4 ngày 3 đêm chi tiết từ A đến Z", link: "#" },
        { id: "i5", title: "Gợi ý lịch trình du lịch Đà Nẵng 3 ngày 2 đêm siêu chi tiết 2026", link: "#" },
      ],
    },
    tips: {
      title: "Kinh nghiệm đi tự túc",
      image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
      articles: [
        { id: "tp1", title: "Kinh nghiệm đi Bà Nà Hills tự túc: Đi đâu, chơi gì, giá vé 2026", link: "#" },
        { id: "tp2", title: "Kinh nghiệm đi bán đảo Sơn Trà tự túc bạn đã biết chưa?", link: "#" },
        { id: "tp3", title: "Kinh nghiệm vui chơi vòng quay Mặt Trời Sun Wheel Đà Nẵng", link: "#" },
        { id: "tp4", title: "Kinh nghiệm tham quan Chùa Nam Sơn Đà Nẵng, xem ngay kẻo lỡ", link: "#" },
        { id: "tp5", title: "Kinh nghiệm đi Đà Nẵng mua gì về làm quà vừa tiết kiệm lại ý nghĩa?", link: "#" },
      ],
    },
  },

  reviews: {
    list: [
      {
        id: "r1",
        title: "Cầu Rồng phun lửa mấy giờ, thứ mấy? Review chi tiết 2026",
        date: "03/01/2026",
        views: "74,452",
        image: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=400&q=80",
        desc: "Lịch phun lửa & phun nước vào 21:00 thứ Bảy, Chủ Nhật hàng tuần cùng những góc ngắm đẹp nhất.",
      },
      {
        id: "r2",
        title: "Phá đảo khu vui chơi Fantasy Park Bà Nà Hills từ A đến Z",
        date: "15/10/2024",
        views: "59,496",
        image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
        desc: "Tổng hợp hơn 105 trò chơi mạo hiểm cảm giác mạnh đỉnh cao trong nhà lớn nhất Việt Nam.",
      },
      {
        id: "r3",
        title: "Oanh tạc chợ Bắc Mỹ An thưởng thức trọn vẹn đặc sản Đà Nẵng",
        date: "09/11/2024",
        views: "44,532",
        image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
        desc: "Khu chợ thiên đường ẩm thực sinh viên với kem bơ cô Vân trứ danh, ốc hút và bánh căn giòn rụm.",
      },
      {
        id: "r4",
        title: "Da Nang Downtown tổ hợp vui chơi giải trí đẳng cấp bên sông Hàn",
        date: "05/09/2025",
        views: "37,512",
        image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80",
        desc: "Không gian đêm náo nhiệt với show nghệ thuật Rực rỡ sông Hàn và chợ đêm sầm uất Vui Phết.",
      },
    ],
    featuredMain: {
      id: "rf1",
      title: "Top 7 khu vui chơi trẻ em ở Đà Nẵng an toàn, hấp dẫn cho gia đình",
      image: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&q=80",
      desc: "Những điểm vui chơi giải trí giáo dục bổ ích lý tưởng cho các gia đình có con nhỏ khi du lịch Đà Nẵng.",
    },
    featuredSub: {
      id: "rf2",
      title: "Chèo SUP ở bãi Mân Thái, trải nghiệm cực mới lạ đón bình minh ở Đà Nẵng",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      desc: "Thả mình trên ván chèo lênh đênh giữa biển ngắm mặt trời mọc rạng ngời dưới chân bán đảo Sơn Trà.",
    },
  },

  festivals: [
    {
      id: "fe1",
      title: "Lễ hội Cầu Ngư Đà Nẵng",
      image: "/festivals/le-hoi-cau-ngu-da-nang.jpg",
      date: "Tháng Giêng âm lịch",
      desc: "Di sản văn hóa phi vật thể quốc gia thể hiện đạo lý uống nước nhớ nguồn và lời cầu chúc mưa thuận gió hòa của ngư dân miền biển.",
    },
    {
      id: "fe2",
      title: "Lễ hội đua thuyền Đà Nẵng",
      image: "/festivals/le-hoi-dua-thuyen-da-nang.jpg",
      date: "Dịp Tết & Ngày lễ lớn",
      desc: "Sự kiện thể thao sông nước rộn rã trên sông Hàn quy tụ những tay chèo dũng mãnh và hàng vạn khán giả cổ vũ.",
    },
    {
      id: "fe3",
      title: "Lễ hội Quán Thế Âm Ngũ Hành Sơn Đà Nẵng",
      image: "/festivals/le-hoi-quan-the-am-da-nang.jpg",
      date: "19/2 âm lịch hàng năm",
      desc: "Lễ hội tâm linh Phật giáo linh thiêng thu hút đông đảo phật tử và du khách thập phương chiêm bái, cầu an.",
    },
  ],
};

export const LANDMARK_IMAGE_OVERRIDES = {
  "nhà thờ đức bà sài gòn": "/landmarks/nha-tho-duc-ba-sai-gon.jpg",
  "nhà thờ đức bà": "/landmarks/nha-tho-duc-ba-sai-gon.jpg",
  "bưu điện trung tâm thành phố": "/landmarks/buu-dien-trung-tam-thanh-pho.jpg",
  "bưu điện trung tâm sài gòn": "/landmarks/buu-dien-trung-tam-thanh-pho.jpg",
  "bưu điện trung tâm": "/landmarks/buu-dien-trung-tam-thanh-pho.jpg",
  "bưu điện thành phố": "/landmarks/buu-dien-trung-tam-thanh-pho.jpg",
  "dinh độc lập (hội trường thống nhất)": "/landmarks/dinh-doc-lap.jpg",
  "dinh độc lập": "/landmarks/dinh-doc-lap.jpg",
  "hội trường thống nhất": "/landmarks/dinh-doc-lap.jpg",
};

export function getLandmarkThumbnail(landmark, defaultFallback = "") {
  if (!landmark) return defaultFallback;
  const name = (landmark.name || "").toLowerCase().trim();
  return LANDMARK_IMAGE_OVERRIDES[name] || landmark.thumbnail_url || landmark.image || defaultFallback;
}

export const ARTICLE_IMAGE_OVERRIDES = {
  "lên tầng 81 landmark 81 ngắm toàn cảnh sài gòn lung linh về đêm": "/reviews/landmark-81-ve-dem.jpg",
  "lên tầng 81 landmark 81": "/reviews/landmark-81-ve-dem.jpg",
  "landmark 81": "/reviews/landmark-81-ve-dem.jpg",
};

export function getArticleImage(art, fallback = "") {
  if (!art) return fallback;
  const title = (art.title || art.name || "").toLowerCase().trim();
  for (const [key, val] of Object.entries(ARTICLE_IMAGE_OVERRIDES)) {
    if (title.includes(key)) return val;
  }
  return art.image_url || art.image || fallback;
}

export const FESTIVAL_IMAGE_OVERRIDES = {
  "lễ hội cầu ngư đà nẵng": "/festivals/le-hoi-cau-ngu-da-nang.jpg",
  "lễ hội đua thuyền đà nẵng": "/festivals/le-hoi-dua-thuyen-da-nang.jpg",
  "lễ hội quán thế âm ngũ hành sơn đà nẵng": "/festivals/le-hoi-quan-the-am-da-nang.jpg",
  "lễ hội sông nước tp. hồ chí minh": "/festivals/le-hoi-song-nuoc-tphcm.jpg",
  "lễ hội sông nước tphcm": "/festivals/le-hoi-song-nuoc-tphcm.jpg",
  "lễ hội sông nước": "/festivals/le-hoi-song-nuoc-tphcm.jpg",
  "lễ hội nghinh ông cần giờ": "/festivals/le-hoi-nghinh-ong-can-gio.jpg",
  "lễ hội nghinh ông": "/festivals/le-hoi-nghinh-ong-can-gio.jpg",
};

export function getFestivalImage(fe, fallback = "/festivals/le-hoi-cau-ngu-da-nang.jpg") {
  if (!fe) return fallback;
  const title = (fe.title || fe.name || "").toLowerCase().trim();
  for (const [key, val] of Object.entries(FESTIVAL_IMAGE_OVERRIDES)) {
    if (title.includes(key)) return val;
  }
  return fe.image_url || fe.image || fallback;
}

/**
 * Tạo dữ liệu Cẩm nang du lịch tự động hoặc từ dữ liệu MySQL cho bất kỳ tỉnh thành nào
 */
export function getProvinceGuideData(
  province,
  dbLandmarks = [],
  dbFoods = [],
  dbArticles = [],
  dbFestivals = [],
) {
  const pName = province?.name || "Tỉnh thành";

  // 1. LANDMARKS
  let landmarks = [];
  if (dbLandmarks && dbLandmarks.length > 0) {
    landmarks = dbLandmarks.map((l, i) => {
      const cleanName = (l.name || "").toLowerCase().trim();
      const overrideImg = LANDMARK_IMAGE_OVERRIDES[cleanName];
      return {
        id: l.id || `l-${i}`,
        name: l.name,
        category: l.category || "attraction",
        image:
          overrideImg ||
          l.thumbnail_url ||
          l.image ||
          `https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80`,
        address: l.address || `${pName}, Việt Nam`,
        desc: l.description || l.desc || `Danh lam thắng cảnh tiêu biểu tại ${pName}.`,
        maps_place_id: l.maps_place_id,
        latitude: l.latitude,
        longitude: l.longitude,
      };
    });
  } else if (province?.slug === "da-nang") {
    landmarks = DANANG_GUIDE_DATA.landmarks;
  }

  // 2. FOODS (QUÁN ĂN & MÓN NGON)
  let culinary = null;
  if (dbFoods && dbFoods.length > 0) {
    const feat = dbFoods.filter((f) => f.is_featured);
    const nonFeat = dbFoods.filter((f) => !f.is_featured);

    const fMainRaw =
      feat[0] ||
      (nonFeat.length >= 2 ? nonFeat[nonFeat.length - 2] : dbFoods[0]);
    const fSubRaw =
      feat[1] ||
      (nonFeat.length >= 1 ? nonFeat[nonFeat.length - 1] : dbFoods[1] || dbFoods[0]);
    
    // Nếu có feat thì list là nonFeat, nếu không có feat thì list loại trừ 2 món đã đưa lên card lớn
    const listRaw =
      feat.length > 0
        ? nonFeat
        : nonFeat.length > 2
        ? nonFeat.slice(0, nonFeat.length - 2)
        : nonFeat;

    culinary = {
      list: listRaw.map((f, i) => ({
        id: f.id || `f-${i}`,
        title: f.title,
        date: f.published_date || f.date || "01/01/2026",
        views: f.view_count || f.views || "100,000+",
        image: f.image_url || f.image || "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
        address: f.address || `${pName}`,
        desc: f.description || f.desc || "",
      })),
      featuredMain: {
        id: fMainRaw.id || "fmain",
        title: fMainRaw.title,
        image: fMainRaw.image_url || fMainRaw.image || "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80",
        address: fMainRaw.address || `${pName}`,
        desc: fMainRaw.description || fMainRaw.desc || "",
      },
      featuredSub: {
        id: fSubRaw.id || "fsub",
        title: fSubRaw.title,
        image: fSubRaw.image_url || fSubRaw.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        address: fSubRaw.address || `${pName}`,
        desc: fSubRaw.description || fSubRaw.desc || "",
      },
    };
  } else if (province?.slug === "da-nang") {
    culinary = DANANG_GUIDE_DATA.culinary;
  }

  // 3. ARTICLES (Transport, Itineraries, Tips)
  let guides = null;
  if (dbArticles && dbArticles.length > 0) {
    const transportArts = dbArticles.filter((a) => a.category === "transport");
    const itinArts = dbArticles.filter((a) => a.category === "itinerary");
    const tipsArts = dbArticles.filter((a) => a.category === "tips");

    guides = {
      transport: {
        title: "Di chuyển",
        image: transportArts[0]?.image_url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
        articles: transportArts.map((a, i) => ({
          id: a.id || `t-${i}`,
          title: a.title,
          desc: a.description,
          link: "#",
        })),
      },
      itineraries: {
        title: "Gợi ý lịch trình",
        image: itinArts[0]?.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
        articles: itinArts.map((a, i) => ({
          id: a.id || `i-${i}`,
          title: a.title,
          desc: a.description,
          link: "#",
        })),
      },
      tips: {
        title: "Kinh nghiệm đi tự túc",
        image: tipsArts[0]?.image_url || "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
        articles: tipsArts.map((a, i) => ({
          id: a.id || `tp-${i}`,
          title: a.title,
          desc: a.description,
          link: "#",
        })),
      },
    };
  } else if (province?.slug === "da-nang") {
    guides = DANANG_GUIDE_DATA.guides;
  }

  // 4. REVIEWS (GÓC REVIEW TRẢI NGHIỆM)
  let reviews = null;
  const reviewArts = (dbArticles || []).filter((a) => a.category === "review");
  if (reviewArts.length > 0) {
    const featRev = reviewArts.filter((r) => r.is_featured);
    const nonFeatRev = reviewArts.filter((r) => !r.is_featured);

    const rMainRaw =
      featRev[0] ||
      (nonFeatRev.length >= 2 ? nonFeatRev[nonFeatRev.length - 2] : reviewArts[0]);
    const rSubRaw =
      featRev[1] ||
      (nonFeatRev.length >= 1 ? nonFeatRev[nonFeatRev.length - 1] : reviewArts[1] || reviewArts[0]);
    
    const listRevRaw =
      featRev.length > 0
        ? nonFeatRev
        : nonFeatRev.length > 2
        ? nonFeatRev.slice(0, nonFeatRev.length - 2)
        : nonFeatRev;

    reviews = {
      list: listRevRaw.map((r, i) => ({
        id: r.id || `r-${i}`,
        title: r.title,
        date: r.published_date || r.date || "01/01/2026",
        views: r.view_count || r.views || "50,000+",
        image: getArticleImage(r, "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=400&q=80"),
        desc: r.description || r.desc || "",
      })),
      featuredMain: {
        id: rMainRaw.id || "rmain",
        title: rMainRaw.title,
        image: getArticleImage(rMainRaw, "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&q=80"),
        desc: rMainRaw.description || rMainRaw.desc || "",
      },
      featuredSub: {
        id: rSubRaw.id || "rsub",
        title: rSubRaw.title,
        image: getArticleImage(rSubRaw, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"),
        desc: rSubRaw.description || rSubRaw.desc || "",
      },
    };
  } else if (province?.slug === "da-nang") {
    reviews = DANANG_GUIDE_DATA.reviews;
  }

  // 5. FESTIVALS
  let festivals = null;
  if (dbFestivals && dbFestivals.length > 0) {
    festivals = dbFestivals.map((fe, i) => ({
      id: fe.id || `fe-${i}`,
      title: fe.title,
      image: getFestivalImage(fe, "/festivals/le-hoi-cau-ngu-da-nang.jpg"),
      date: fe.event_time || fe.date || "Hàng năm",
      desc: fe.description || fe.desc || "",
    }));
  } else if (province?.slug === "da-nang") {
    festivals = DANANG_GUIDE_DATA.festivals;
  }

  // If anything is still missing, fallback to generic province templates
  const fallbackData = getGenericFallback(pName, province);

  return {
    landmarks: landmarks.length > 0 ? landmarks : fallbackData.landmarks,
    culinary: culinary || fallbackData.culinary,
    guides: guides || fallbackData.guides,
    reviews: reviews || fallbackData.reviews,
    festivals: festivals || fallbackData.festivals,
  };
}

function getGenericFallback(pName, province) {
  const fallbackLandmarks = [
    {
      id: "g1",
      name: `Quần thể danh thắng ${pName}`,
      category: "attraction",
      image:
        province?.thumbnail_url ||
        "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
      address: `Trung tâm ${pName}`,
      desc: `Điểm du lịch nổi tiếng gắn liền với vẻ đẹp thiên nhiên và lịch sử của ${pName}.`,
    },
    {
      id: "g2",
      name: `Khu du lịch sinh thái ${pName}`,
      category: "attraction",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      address: `${pName}, Việt Nam`,
      desc: `Không gian thiên nhiên trong lành, điểm check-in hấp dẫn cho du khách.`,
    },
    {
      id: "g3",
      name: `Di tích lịch sử văn hóa ${pName}`,
      category: "temple",
      image:
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
      address: `${pName}, Việt Nam`,
      desc: `Công trình kiến trúc cổ kính lưu giữ những nét đẹp văn hóa truyền thống.`,
    },
  ];

  return {
    landmarks: fallbackLandmarks,
    culinary: {
      list: [
        {
          id: "c1",
          title: `Đặc sản ẩm thực truyền thống ${pName} đậm đà khó quên`,
          date: "12/08/2026",
          views: "85,420",
          image:
            "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
          address: `Các khu chợ ẩm thực truyền thống tại ${pName}`,
          desc: `Món ăn đặc sản dân dã mang đậm nét văn hóa địa phương của vùng đất ${pName}.`,
        },
        {
          id: "c2",
          title: `Top quán ăn ngon nức tiếng tại ${pName} đông khách mỗi ngày`,
          date: "10/08/2026",
          views: "62,110",
          image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
          address: `Trung tâm thành phố ${pName}`,
          desc: `Địa chỉ ăn uống quen thuộc được cả người bản địa và khách du lịch yêu thích.`,
        },
        {
          id: "c3",
          title: `Khám phá các món ăn vặt đường phố siêu ngon tại ${pName}`,
          date: "05/08/2026",
          views: "48,930",
          image:
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
          address: `Chợ đêm & phố đi bộ ${pName}`,
          desc: `Những món ăn vặt thơm ngon, giá cả bình dân cho bạn tha hồ thưởng thức.`,
        },
        {
          id: "c4",
          title: `Mua gì làm quà khi du lịch ${pName}? Gợi ý đặc sản trứ danh`,
          date: "01/08/2026",
          views: "53,200",
          image:
            "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80",
          address: `Các cửa hàng đặc sản ${pName}`,
          desc: `Các món quà đặc sản đóng gói tiện lợi, ý nghĩa dành tặng bạn bè và người thân.`,
        },
      ],
      featuredMain: {
        id: "f1",
        title: `Món ngon đặc sản số 1 tại ${pName} khiến du khách mê mẩn`,
        image:
          "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80",
        address: `Khu ẩm thực trung tâm ${pName}`,
        desc: `Hương vị độc đáo hòa quyện từ những nguyên liệu tươi ngon nhất của đất trời ${pName}.`,
      },
      featuredSub: {
        id: "f2",
        title: `Quán ăn lâu đời nổi tiếng giữ trọn tinh hoa ẩm thực ${pName}`,
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        address: `Phố ẩm thực ${pName}`,
        desc: `Điểm hẹn ẩm thực truyền thống với công thức gia truyền nức tiếng gần xa.`,
      },
    },
    guides: {
      transport: {
        title: "Di chuyển",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
        articles: [
          {
            id: "t1",
            title: `Hướng dẫn di chuyển đến ${pName} thuận tiện và tiết kiệm nhất 2026`,
            link: "#",
          },
          {
            id: "t2",
            title: `Tổng hợp các tuyến xe khách chất lượng cao đi ${pName}`,
            link: "#",
          },
          {
            id: "t3",
            title: `Kinh nghiệm thuê xe máy tự túc vi vu ${pName} từ A-Z`,
            link: "#",
          },
          {
            id: "t4",
            title: `Bản đồ giao thông và các phương tiện đi lại phổ biến tại ${pName}`,
            link: "#",
          },
        ],
      },
      itineraries: {
        title: "Gợi ý lịch trình",
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
        articles: [
          {
            id: "i1",
            title: `Gợi ý lịch trình du lịch ${pName} 3 ngày 2 đêm tự túc chi tiết`,
            link: "#",
          },
          {
            id: "i2",
            title: `Lịch trình khám phá trọn vẹn ${pName} trong 2 ngày 1 đêm cuối tuần`,
            link: "#",
          },
          {
            id: "i3",
            title: `Tour du lịch 1 ngày check-in các điểm hot nhất tại ${pName}`,
            link: "#",
          },
          {
            id: "i4",
            title: `Lịch trình du lịch nghỉ dưỡng gia đình tại ${pName} lý tưởng`,
            link: "#",
          },
        ],
      },
      tips: {
        title: "Kinh nghiệm đi tự túc",
        image:
          "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
        articles: [
          {
            id: "tp1",
            title: `Thời điểm đẹp nhất trong năm để đi du lịch ${pName}?`,
            link: "#",
          },
          {
            id: "tp2",
            title: `Kinh nghiệm chuẩn bị hành lý và trang phục khi đến ${pName}`,
            link: "#",
          },
          {
            id: "tp3",
            title: `Bỏ túi bí kíp săn vé và đặt phòng khách sạn view đẹp tại ${pName}`,
            link: "#",
          },
          {
            id: "tp4",
            title: `Những lưu ý quan trọng cần biết trước khi khởi hành đi ${pName}`,
            link: "#",
          },
        ],
      },
    },
    reviews: {
      list: [
        {
          id: "r1",
          title: `Review chân thực chuyến đi ${pName} tự túc cùng hội bạn thân`,
          date: "14/06/2026",
          views: "52,180",
          image:
            "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80",
          desc: `Tất tần tật chi phí, địa điểm ăn chơi và những bức ảnh check-in siêu đẹp.`,
        },
        {
          id: "r2",
          title: `Khám phá những góc check-in bí mật ít người biết tại ${pName}`,
          date: "20/05/2026",
          views: "43,910",
          image:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
          desc: `Những tọa độ sống ảo hoang sơ mang lại những khung hình đẹp như tranh vẽ.`,
        },
        {
          id: "r3",
          title: `Trải nghiệm văn hóa chợ phiên và nhịp sống địa phương ở ${pName}`,
          date: "11/04/2026",
          views: "38,240",
          image:
            "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
          desc: `Cảm nhận sự thân thiện, mến khách và những nét sinh hoạt thường nhật bình dị.`,
        },
        {
          id: "r4",
          title: `Check-in ngắm hoàng hôn cực chill tại những quán cafe đẹp ở ${pName}`,
          date: "02/03/2026",
          views: "31,450",
          image:
            "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80",
          desc: `Không gian thư giãn lý tưởng để ngắm nhìn thành phố lúc lên đèn.`,
        },
      ],
      featuredMain: {
        id: "rf1",
        title: `Tổng hợp những trải nghiệm độc đáo nhất định phải thử khi đến ${pName}`,
        image:
          "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=800&q=80",
        desc: `Những hoạt động vui chơi khám phá đáng nhớ nhất trong chuyến du lịch của bạn.`,
      },
      featuredSub: {
        id: "rf2",
        title: `Hành trình săn mây và đón bình minh ngoạn mục tại ${pName}`,
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        desc: `Khoảnh khắc đất trời giao thoa rực rỡ khiến bất kỳ ai cũng phải ngỡ ngàng.`,
      },
    },
    festivals: [
      {
        id: "fe1",
        title: `Lễ hội văn hóa truyền thống ${pName}`,
        image:
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
        date: "Mùa Xuân hàng năm",
        desc: `Không gian lễ hội rực rỡ sắc màu với các nghi thức cổ truyền và trò chơi dân gian đặc sắc.`,
      },
      {
        id: "fe2",
        title: `Lễ hội ẩm thực & du lịch ${pName}`,
        image:
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
        date: "Dịp hè hàng năm",
        desc: `Quy tụ tinh hoa ẩm thực và các hoạt động biểu diễn nghệ thuật sôi động của địa phương.`,
      },
      {
        id: "fe3",
        title: `Lễ hội di sản văn hóa tâm linh ${pName}`,
        image:
          "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80",
        date: "Rằm tháng Giêng & tháng Bảy",
        desc: `Nơi du khách thập phương hướng về cội nguồn, chiêm bái và gửi gắm những ước nguyện bình an.`,
      },
    ],
  };
}
