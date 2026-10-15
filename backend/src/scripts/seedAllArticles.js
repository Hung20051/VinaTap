require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const pool = require("../config/db");

const ALL_24_ARTICLES = [
  {
    slug: "10-best-things-to-do-in-ho-chi-minh-city",
    category: "things-to-do",
    province_slug: "ho-chi-minh",
    title_vi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
    title_en: "10 best things to do in Ho Chi Minh City",
    hero_image: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-hero-Vietnamnomad.jpg",
    author_name: "VinaTap",
    published_date: "2026-10-10",
    status: "published",
    views_count: 38,
    items: [
      {
        item_number: 1,
        title_vi: "1. Chiêm ngưỡng kiến trúc Nhà thờ Đức Bà & Bưu điện Trung tâm",
        title_en: "1. Admire the Notre Dame Cathedral & Central Post Office",
        image_url: "/guide/hcmc/Central-Post-Office-Ho-Chi-Minh-City-Vietnamnomad.jpg",
        caption_vi: "Bưu điện Trung tâm Sài Gòn mang đậm dấu ấn kiến trúc Pháp",
        caption_en: "Historic Saigon Central Post Office",
        paragraphs_vi: ["Một trong những biểu tượng nổi bật nhất của Sài Gòn, Nhà thờ Đức Bà và Bưu điện Trung tâm thành phố nằm kề bên nhau."],
        paragraphs_en: ["One of Saigon's most iconic architectural landmarks in the heart of District 1."]
      },
      {
        item_number: 2,
        title_vi: "2. Khám phá Địa đạo Củ Chi huyền thoại",
        title_en: "2. Explore the legendary Cu Chi Tunnels",
        image_url: "/guide/hcmc/Cu-Chi-Tunnels-Ho-Chi-Minh-City.jpg",
        caption_vi: "Hệ thống địa đạo ngầm kỳ vĩ thời kháng chiến",
        caption_en: "Underground tunnel network of historical significance",
        paragraphs_vi: ["Mạng lưới đường hầm dưới lòng đất dài hơn 250km minh chứng cho tinh thần quật cường của nhân dân miền Nam."],
        paragraphs_en: ["An expansive underground maze spanning over 250km showcasing wartime resilience."]
      }
    ]
  },
  {
    slug: "8-best-things-to-do-in-nha-trang",
    category: "things-to-do",
    province_slug: "khanh-hoa",
    title_vi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
    title_en: "8 best things to do in Nha Trang",
    hero_image: "/guide/nha-trang/Things-to-do-in-Nha-Trang-hero.jpg",
    author_name: "VinaTap",
    published_date: "2026-10-10",
    status: "published",
    views_count: 34,
    items: [
      {
        item_number: 1,
        title_vi: "1. Tour lặn biển ngắm san hô tại Đảo Hòn Mun",
        title_en: "1. Scuba diving and snorkeling at Hon Mun Island",
        image_url: "/guide/nha-trang/Hon-Mun-Island-snorkeling-Nha-Trang.jpg",
        caption_vi: "Rạn san hô đa dạng tại khu bảo tồn biển Hòn Mun",
        caption_en: "Diverse marine life at Hon Mun conservation area",
        paragraphs_vi: ["Khám phá thế giới sinh vật biển phong phú với rạn san hô rực rỡ tại khu bảo tồn biển Hòn Mun."],
        paragraphs_en: ["Discover vibrant marine life and pristine coral reefs at Hon Mun Island."]
      },
      {
        item_number: 2,
        title_vi: "2. Tắm bùn khoáng nóng thư giãn tại I-Resort",
        title_en: "2. Relax at I-Resort Mud Bath",
        image_url: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Mud-bath.jpg",
        caption_vi: "Liệu pháp phục hồi sức khỏe bằng bùn khoáng thiên nhiên",
        caption_en: "Mineral mud therapy and rejuvenation",
        paragraphs_vi: ["Trải nghiệm thư giãn đặc trưng của Nha Trang giúp trẻ hóa làn da và tái tạo năng lượng."],
        paragraphs_en: ["Signature Nha Trang relaxation experience renowned for skin rejuvenation."]
      }
    ]
  },
  {
    slug: "15-best-places-to-visit-in-vietnam-in-2026",
    category: "inspired",
    province_slug: null,
    title_vi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
    title_en: "15 Best Places to Visit in Vietnam in 2026",
    hero_image: "/guide/15-best-places/place-1-ho-chi-minh-city.jpg",
    author_name: "VinaTap Editorial",
    published_date: "2026-10-11",
    status: "published",
    views_count: 37,
    items: [
      {
        item_number: 1,
        title_vi: "1. TP. Hồ Chí Minh - Siêu đô thị rực rỡ và tràn đầy năng lượng",
        title_en: "1. Ho Chi Minh City - Dynamic metropolis",
        image_url: "/guide/15-best-places/place-1-ho-chi-minh-city.jpg",
        caption_vi: "Toàn cảnh trung tâm TP. Hồ Chí Minh hiện đại",
        caption_en: "Modern skyline of Ho Chi Minh City",
        paragraphs_vi: ["Siêu đô thị năng động bậc nhất Việt Nam với sự giao thoa kỳ diệu giữa những tòa cao ốc chọc trời lung linh."],
        paragraphs_en: ["Vietnam's vibrant commercial hub where illuminated skyscrapers meet French colonial heritage."]
      },
      {
        item_number: 2,
        title_vi: "2. Hội An - Phố cổ đèn lồng huyền ảo bên dòng sông Hoài",
        title_en: "2. Hoi An - Enchanting ancient town",
        image_url: "/guide/15-best-places/place-2-hoi-an.jpg",
        caption_vi: "Phố cổ Hội An lung linh sắc đèn lồng",
        caption_en: "Magical lantern lights in Hoi An",
        paragraphs_vi: ["Di sản Văn hóa Thế giới UNESCO với những con ngõ vàng ươm rêu phong và hoa đăng lung linh."],
        paragraphs_en: ["A UNESCO World Heritage gem famous for golden heritage shophouses and floating lanterns."]
      }
    ]
  },
  {
    slug: "20-best-things-to-do-in-vietnam",
    category: "things-to-do",
    province_slug: null,
    title_vi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
    title_en: "20 Best Things to Do in Vietnam",
    hero_image: "/guide/hcmc/Vietnamnomad-header-banner-2026.jpg",
    author_name: "VinaTap Travel",
    published_date: "2026-10-11",
    status: "published",
    views_count: 35,
    items: [
      {
        item_number: 1,
        title_vi: "1. Thưởng thức một tô Phở nóng hổi lúc sáng sớm",
        title_en: "1. Savor an authentic steaming bowl of Pho at dawn",
        image_url: "/guide/pho/where-was-pho-first-created-vietnamnomad.jpg",
        caption_vi: "Tô phở bò truyền thống thơm lừng thảo mộc",
        caption_en: "Traditional Vietnamese beef noodle soup",
        paragraphs_vi: ["Ngồi quán ven đường và thưởng thức hương vị nước dùng phở ninh từ xương ống đậm đà."],
        paragraphs_en: ["Nothing starts a Vietnam morning better than a steaming bowl of fragrant Pho."]
      }
    ]
  },
  {
    slug: "3-week-vietnam-itinerary",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch trình 3 tuần xuyên Việt trọn vẹn từ Bắc vào Nam",
    title_en: "3-Week Complete Vietnam Itinerary",
    hero_image: "/guide/hcmc/Vietnamnomad-header-banner-2026.jpg",
    author_name: "VinaTap Expert",
    published_date: "2026-10-11",
    status: "published",
    views_count: 39,
    items: [
      {
        item_number: 1,
        title_vi: "Tuần 1: Khám phá Miền Bắc hào hoa (Hà Nội, Vịnh Hạ Long, Sapa)",
        title_en: "Week 1: Northern Heritage (Hanoi, Ha Long Bay, Sapa)",
        image_url: "/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg",
        caption_vi: "Vịnh Hạ Long kỳ quan thiên nhiên thế giới",
        caption_en: "Ha Long Bay world natural wonder",
        paragraphs_vi: ["Bắt đầu chuyến hành trình từ thủ đô ngàn năm văn hiến đến kỳ quan thiên nhiên đá vôi."],
        paragraphs_en: ["Begin in Hanoi's historic quarters before cruising through limestone karsts."]
      }
    ]
  },
  {
    slug: "12-must-try-foods-in-ho-chi-minh-city",
    category: "eat-drink",
    province_slug: "ho-chi-minh",
    title_vi: "12 Món Ăn Đường Phố Phải Thử Ở Sài Gòn",
    title_en: "12 Must-Try Street Foods in Ho Chi Minh City",
    hero_image: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
    author_name: "Foodie VinaTap",
    published_date: "2026-10-12",
    status: "published",
    views_count: 33,
    items: [
      {
        item_number: 1,
        title_vi: "1. Cơm Tấm Sườn Bì Chả Sài Gòn",
        title_en: "1. Broken Rice with Grilled Pork Chops (Com Tam)",
        image_url: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
        caption_vi: "Dĩa cơm tấm sườn nướng mỡ hành thơm phức",
        caption_en: "Signature Saigon broken rice dish",
        paragraphs_vi: ["Món ăn linh hồn của Sài Gòn với hạt cơm tấm dẻo bùi, sườn nướng than hoa đậm đà và nước mắm ớt chua ngọt."],
        paragraphs_en: ["Saigon's quintessential dish featuring fragrant charcoal-grilled pork and sweet fish sauce."]
      }
    ]
  },
  {
    slug: "8-must-try-foods-in-hanoi",
    category: "eat-drink",
    province_slug: "ha-noi",
    title_vi: "8 món ngon nhất định phải thử tại Hà Nội",
    title_en: "8 Must-Try Foods in Hanoi",
    hero_image: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    author_name: "VinaTap Culinary",
    published_date: "2026-10-12",
    status: "published",
    views_count: 36,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bún Chả Hà Nội nướng than hoa",
        title_en: "1. Authentic Hanoi Bun Cha",
        image_url: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
        caption_vi: "Thịt nướng thơm lừng trong chén nước mắm chua ngọt ấm nóng",
        caption_en: "Grilled pork patties in warm dipping sauce",
        paragraphs_vi: ["Chả miếng nướng vàng ươm ăn kèm bún tươi, rau sống và nước mắm đu đủ xanh."],
        paragraphs_en: ["Charcoal-grilled pork patties served alongside fresh herbs, noodles, and dipping broth."]
      }
    ]
  },
  {
    slug: "5-must-try-nha-trang-dishes",
    category: "eat-drink",
    province_slug: "khanh-hoa",
    title_vi: "5 món ăn phải nếm khi đến Nha Trang",
    title_en: "5 Must-Try Dishes in Nha Trang",
    hero_image: "/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg",
    author_name: "VinaTap Team",
    published_date: "2026-10-12",
    status: "published",
    views_count: 35,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bún Sứa & Bún Chả Cá Nha Trang",
        title_en: "1. Jellyfish and Fish Cake Noodle Soup",
        image_url: "/guide/nha-trang/5-must-try-food-in-Nha-Trang-Vietnamnomad.jpg",
        caption_vi: "Tô bún sứa thanh mát ngọt vị cá biển",
        caption_en: "Refreshing jellyfish noodle soup",
        paragraphs_vi: ["Nước dùng trong veo nấu từ cá liệt, thịt sứa giòn sần sật tạo nên dư vị khó quên."],
        paragraphs_en: ["Crisp coastal jellyfish swimming in sweet marine broth."]
      }
    ]
  },
  {
    slug: "7-must-try-foods-in-vung-tau",
    category: "eat-drink",
    province_slug: "ba-ria-vung-tau",
    title_vi: "7 món ăn nhất định phải thử ở Vũng Tàu",
    title_en: "7 Must-Try Foods in Vung Tau",
    hero_image: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
    author_name: "VinaTap Team",
    published_date: "2026-10-13",
    status: "published",
    views_count: 37,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bánh Khọt Vũng Tàu giòn rụm tôm tươi",
        title_en: "1. Crispy Vung Tau Banh Khot",
        image_url: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
        caption_vi: "Bánh khọt tôm tươi vàng giòn cuốn rau sống",
        caption_en: "Crispy mini shrimp pancakes",
        paragraphs_vi: ["Bánh chiên vàng giòn rụm trong khuôn gang với con tôm biển tươi ngọt cuốn cải xanh."],
        paragraphs_en: ["Mini golden crispy savory pancakes crowned with ocean-fresh shrimp."]
      }
    ]
  },
  {
    slug: "5-best-vung-tau-beaches",
    category: "things-to-do",
    province_slug: "ba-ria-vung-tau",
    title_vi: "5 Bãi Biển Đẹp Nhất Tại Vũng Tàu Bạn Không Nên Bỏ Lỡ",
    title_en: "5 Best Beaches in Vung Tau",
    hero_image: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
    author_name: "VinaTap Beach Guide",
    published_date: "2026-10-13",
    status: "published",
    views_count: 34,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bãi Sau (Bãi Thùy Vân) - Bãi tắm sôi động trải dài",
        title_en: "1. Back Beach (Bai Sau) - Vibrant coastal stretch",
        image_url: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
        caption_vi: "Bờ biển Bãi Sau sóng vỗ rì rào",
        caption_en: "Scenic coastline of Back Beach",
        paragraphs_vi: ["Bãi biển dài gần 10km với bãi cát mịn thoai thoải, thích hợp tắm biển và dạo mát ban chiều."],
        paragraphs_en: ["A 10km coastal promenade ideal for swimming and gentle ocean breezes."]
      }
    ]
  },
  {
    slug: "pho-the-complete-guide",
    category: "eat-drink",
    province_slug: "ha-noi",
    title_vi: "Phở – Quốc Hồn Quốc Túy: Cẩm Nang Trọn Vẹn Về Món Nước Huyền Thoại",
    title_en: "Pho: The Complete Guide to Vietnamese Noodle Soup",
    hero_image: "/guide/pho/where-was-pho-first-created-vietnamnomad.jpg",
    author_name: "Culinary Heritage",
    published_date: "2026-10-13",
    status: "published",
    views_count: 38,
    items: [
      {
        item_number: 1,
        title_vi: "Nguồn gốc lịch sử & Nghệ thuật ninh nước dùng phở",
        title_en: "Origins and the Art of Pho Broth",
        image_url: "/guide/pho/where-was-pho-first-created-vietnamnomad.jpg",
        caption_vi: "Hương hoa hồi, quế, thảo quả quyện cùng tủy bò ngọt thanh",
        caption_en: "Aromatic cinnamon, star anise and bone marrow broth",
        paragraphs_vi: ["Phở là biểu tượng văn hóa ẩm thực Việt Nam được cả thế giới công nhận."],
        paragraphs_en: ["Vietnam's national dish crafted with profound balance and ancestral finesse."]
      }
    ]
  },
  {
    slug: "ao-dai-vietnamese-traditional-dress",
    category: "inspired",
    province_slug: null,
    title_vi: "Áo Dài – Quốc phục & Nét đẹp truyền thống Việt Nam",
    title_en: "Ao Dai: Vietnamese Traditional Dress",
    hero_image: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
    author_name: "VinaTap Culture",
    published_date: "2026-10-13",
    status: "published",
    views_count: 33,
    items: [
      {
        item_number: 1,
        title_vi: "Vẻ đẹp thướt tha tôn vinh phụ nữ Việt",
        title_en: "Graceful elegance honoring Vietnamese women",
        image_url: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
        caption_vi: "Tà áo dài duyên dáng trong gió",
        caption_en: "Graceful fluttering silk panels",
        paragraphs_vi: ["Bộ trang phục truyền thống kín đáo nhưng khéo léo tôn lên vóc dáng thanh tao của người phụ nữ Việt Nam."],
        paragraphs_en: ["A graceful silk tunic worn over trousers, embodying timeless Vietnamese poise."]
      }
    ]
  },
  {
    slug: "where-to-stay-in-ho-chi-minh-city",
    category: "itineraries",
    province_slug: "ho-chi-minh",
    title_vi: "Khách Sạn & Khu Vực Nên Ở Tại TP. Hồ Chí Minh",
    title_en: "Where to Stay in Ho Chi Minh City",
    hero_image: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
    author_name: "VinaTap Stay Guide",
    published_date: "2026-10-14",
    status: "published",
    views_count: 36,
    items: [
      {
        item_number: 1,
        title_vi: "Quận 1: Trái tim sôi động cho du khách lần đầu ghé thăm",
        title_en: "District 1: First-timer's cultural center",
        image_url: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
        caption_vi: "Khách sạn trung tâm nhìn ra sông Sài Gòn",
        caption_en: "Central hotel overlooking Saigon River",
        paragraphs_vi: ["Gần các điểm tham quan nổi tiếng như Chợ Bến Thành, phố đi bộ Nguyễn Huệ."],
        paragraphs_en: ["Prime proximity to Ben Thanh Market and lively walking streets."]
      }
    ]
  },
  {
    slug: "hanoi-tourist-map",
    category: "itineraries",
    province_slug: "ha-noi",
    title_vi: "Bản đồ du lịch Hà Nội chi tiết 2026",
    title_en: "Hanoi Tourist Map & Destination Guide 2026",
    hero_image: "/guide/hanoi/hanoi-tourist-map-2026.jpg",
    author_name: "VinaTap Navigator",
    published_date: "2026-10-14",
    status: "published",
    views_count: 35,
    items: [
      {
        item_number: 1,
        title_vi: "Bản đồ phân khu 36 Phố Phường và Hồ Hoàn Kiếm",
        title_en: "Old Quarter & Hoan Kiem Map Highlights",
        image_url: "/guide/hanoi/hanoi-tourist-map-2026.jpg",
        caption_vi: "Lộ trình khám phá các ngõ phố cổ Hà Nội",
        caption_en: "Old Quarter heritage walking route",
        paragraphs_vi: ["Chỉ dẫn các tuyến phố nghề truyền thống và các điểm check-in lịch sử."],
        paragraphs_en: ["Navigational masterplan for heritage streets and culinary hot spots."]
      }
    ]
  },
  {
    slug: "plan-your-vietnam-trip-with-just-one-prompt",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt AI",
    title_en: "Plan Your Vietnam Trip with Just One Prompt",
    hero_image: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
    author_name: "VinaTap AI Lab",
    published_date: "2026-10-14",
    status: "published",
    views_count: 37,
    items: [
      {
        item_number: 1,
        title_vi: "Công nghệ Thổ Địa AI đồng hành cá nhân hóa lịch trình",
        title_en: "Smart AI Assistant for tailored itineraries",
        image_url: "/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg",
        caption_vi: "Gợi ý lịch trình tự động theo sở thích và ngân sách",
        caption_en: "Dynamic customized trip planning powered by AI",
        paragraphs_vi: ["Chỉ cần nhập thời gian và sở thích, hệ thống sẽ đề xuất lộ trình du lịch tối ưu nhất."],
        paragraphs_en: ["Generate comprehensive day-by-day travel routes in seconds."]
      }
    ]
  },
  {
    slug: "the-complete-guide-to-vietnam",
    category: "inspired",
    province_slug: null,
    title_vi: "Cẩm nang du lịch toàn diện Việt Nam 2026",
    title_en: "The Complete Guide to Vietnam 2026",
    hero_image: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
    author_name: "VinaTap Chief Editor",
    published_date: "2026-10-14",
    status: "published",
    views_count: 34,
    items: [
      {
        item_number: 1,
        title_vi: "Tổng quan hành trình 3 miền Bắc - Trung - Nam",
        title_en: "Overview of Vietnam's three regions",
        image_url: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
        caption_vi: "Toàn cảnh đất nước Việt Nam hình chữ S tươi đẹp",
        caption_en: "Stunning aerial vistas across the S-shaped country",
        paragraphs_vi: ["Cẩm nang bao gồm toàn bộ thông tin về visa, thời tiết, tiền tệ và các điểm đến hàng đầu."],
        paragraphs_en: ["Your ultimate reference manual covering visas, currency, climate and must-see gems."]
      }
    ]
  },
  {
    slug: "accommodation-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lưu Trú Tại Việt Nam | Khách Sạn, Homestay, Resort & Mẹo Đặt Phòng",
    title_en: "Accommodation in Vietnam: A Guide for International Travelers",
    hero_image: "/guide/accommodation/hero.jpg",
    author_name: "VinaTap Hospitality",
    published_date: "2026-10-15",
    status: "published",
    views_count: 36,
    items: [
      {
        item_number: 1,
        title_vi: "1. Homestay Bản Địa & Nhà Gỗ Mộc",
        title_en: "1. Authentic Homestays & Rustic Cabins",
        image_url: "/guide/accommodation/ha-giang-homestay.jpg",
        caption_vi: "Homestay ấm cúng giữa núi rừng",
        caption_en: "Cozy local homestay amidst green hills",
        paragraphs_vi: ["Trải nghiệm cuộc sống thân thiện cùng người dân địa phương với mức giá phải chăng."],
        paragraphs_en: ["Immerse in genuine local warmth with budget-friendly authentic lodgings."]
      },
      {
        item_number: 2,
        title_vi: "2. Khách Sạn Boutique & Khu Nghỉ Dưỡng Sang Trọng",
        title_en: "2. Boutique Hotels & Coastal Resorts",
        image_url: "/guide/accommodation/hanoi-hotels.jpg",
        caption_vi: "Khách sạn cổ điển phong cách Đông Dương",
        caption_en: "Heritage Indochine style hotel",
        paragraphs_vi: ["Không gian nghỉ ngơi thư thái với tiện nghi hiện đại và thiết kế nghệ thuật."],
        paragraphs_en: ["Refined tranquility blending Indochine heritage and contemporary luxury."]
      }
    ]
  },
  {
    slug: "vietnam-climate",
    category: "inspired",
    province_slug: null,
    title_vi: "Khí Hậu & Thời Tiết Việt Nam | Cẩm Nang 3 Miền & Bản Đồ Mùa Mưa",
    title_en: "Vietnam's Climate | Weather Guide for 3 Regions & Rainy Seasons",
    hero_image: "/guide/climate/climate-of-vietnam.jpg",
    author_name: "VinaTap Climate Guide",
    published_date: "2026-10-15",
    status: "published",
    views_count: 35,
    items: [
      {
        item_number: 1,
        title_vi: "Đặc điểm thời tiết và thời điểm du lịch lý tưởng theo mùa",
        title_en: "Regional climate patterns and best times to travel",
        image_url: "/guide/climate/climate-of-vietnam.jpg",
        caption_vi: "Bản đồ khí hậu và các mùa mưa bão tại Việt Nam",
        caption_en: "Vietnam rainfall and seasonal climate patterns",
        paragraphs_vi: ["Phân tích chi tiết nhiệt độ, lượng mưa giữa Miền Bắc, Miền Trung và Miền Nam giúp du khách chuẩn bị chu đáo."],
        paragraphs_en: ["Comprehensive breakdown of microclimates across North, Central, and South regions."]
      }
    ]
  },
  {
    slug: "vietnamese-currency",
    category: "inspired",
    province_slug: null,
    title_vi: "Tiền Tệ Việt Nam | Mệnh Giá, Cách Phân Biệt & Đổi Ngoại Tệ",
    title_en: "Vietnamese Currency | Exchange Rates, Banknotes & Money Tips",
    hero_image: "/guide/currency/vietnam-currency-hero.jpg",
    author_name: "VinaTap Travel Tips",
    published_date: "2026-10-15",
    status: "published",
    views_count: 38,
    items: [
      {
        item_number: 1,
        title_vi: "Hướng dẫn nhận biết các mệnh giá tiền Polymer Việt Nam",
        title_en: "Mastering Vietnamese Polymer Banknotes",
        image_url: "/guide/currency/vietnam-currency-hero.jpg",
        caption_vi: "Các mệnh giá tiền giấy và polymer đang lưu hành",
        caption_en: "Circulating Vietnamese Dong banknotes",
        paragraphs_vi: ["Mẹo tránh nhầm lẫn giữa tờ 20.000đ và 500.000đ, cùng hướng dẫn đổi tiền tại sân bay và ngân hàng an toàn."],
        paragraphs_en: ["Practical advice on identifying polymer notes and exchanging foreign currency smoothly."]
      }
    ]
  },
  {
    slug: "vietnam-visa",
    category: "inspired",
    province_slug: null,
    title_vi: "Thông Tin Visa Việt Nam | Miễn Thị Thực & e-Visa 90 Ngày",
    title_en: "Vietnam Visa | All Information You Need to Know",
    hero_image: "/guide/visa/vietnam-visa-hero.jpg",
    author_name: "VinaTap Legal",
    published_date: "2026-10-15",
    status: "published",
    views_count: 33,
    items: [
      {
        item_number: 1,
        title_vi: "Chính sách e-Visa 90 ngày và danh sách quốc gia miễn thị thực",
        title_en: "90-Day e-Visa Policies & Visa-Exempt Countries",
        image_url: "/guide/visa/vietnam-visa-hero.jpg",
        caption_vi: "Thủ tục xin visa điện tử Việt Nam trực tuyến",
        caption_en: "Official online e-visa application process",
        paragraphs_vi: ["Cập nhật quy định xuất nhập cảnh mới nhất, thời hạn lưu trú và các bước xin e-Visa nhanh chóng."],
        paragraphs_en: ["Latest entry requirements, extended validity periods, and hassle-free online application steps."]
      }
    ]
  },
  {
    slug: "the-15-best-attractions-in-dalat",
    category: "things-to-do",
    province_slug: "lam-dong",
    title_vi: "15 Điểm Tham Quan Đẹp Nhất Đà Lạt Bạn Nhất Định Phải Ghé",
    title_en: "The 15 Best Attractions in Dalat",
    hero_image: "/guide/megamenu/todo-5-dalat.jpg",
    author_name: "VinaTap Highland",
    published_date: "2026-10-16",
    status: "published",
    views_count: 37,
    items: [
      {
        item_number: 1,
        title_vi: "1. Hồ Xuân Hương & Quảng Trường Lâm Viên",
        title_en: "1. Xuan Huong Lake & Lam Vien Square",
        image_url: "/guide/megamenu/todo-5-dalat.jpg",
        caption_vi: "Biểu tượng nụ hoa Atiso và hoa dã quỳ bên hồ Xuân Hương",
        caption_en: "Artichoke bud and wild sunflower symbols by the lake",
        paragraphs_vi: ["Trái tim thơ mộng của xứ sở sương mù với không khí se lạnh trong lành."],
        paragraphs_en: ["The romantic heart of misty Dalat offering crisp alpine air and picturesque paths."]
      }
    ]
  },
  {
    slug: "10-days-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch Trình 10 Ngày Khám Phá Việt Nam Từ Bắc Vào Nam",
    title_en: "10 Days in Vietnam: The Essential Route",
    hero_image: "/guide/vietnam/10-day-vietnam-hero.jpg",
    author_name: "VinaTap Itinerary",
    published_date: "2026-10-16",
    status: "published",
    views_count: 34,
    items: [
      {
        item_number: 1,
        title_vi: "Lộ trình tinh gọn dành cho kỳ nghỉ ngắn ngày",
        title_en: "Essential highlights for high-impact travel",
        image_url: "/guide/vietnam/10-day-vietnam-hero.jpg",
        caption_vi: "Hành trình kết nối Hà Nội, Hội An và TP. Hồ Chí Minh",
        caption_en: "Connecting Hanoi, Hoi An, and Saigon in 10 memorable days",
        paragraphs_vi: ["Lộ trình được thiết kế tối ưu thời gian di chuyển bằng máy bay giữa các điểm đến then chốt."],
        paragraphs_en: ["Optimized route balancing cultural marvels and scenic coastlines."]
      }
    ]
  },
  {
    slug: "2-weeks-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch Trình 2 Tuần Xuyên Việt Trọn Vẹn",
    title_en: "2 Weeks in Vietnam Itinerary: Classic Highlights",
    hero_image: "/guide/megamenu/itin-3-2weeks.jpg",
    author_name: "VinaTap Itinerary",
    published_date: "2026-10-16",
    status: "published",
    views_count: 36,
    items: [
      {
        item_number: 1,
        title_vi: "14 ngày trải nghiệm trọn vẹn văn hóa và ẩm thực 3 miền",
        title_en: "14 days immersing in heritage, nature, and food",
        image_url: "/guide/megamenu/itin-3-2weeks.jpg",
        caption_vi: "Thời lượng lý tưởng để thưởng ngoạn cảnh quan Việt Nam",
        caption_en: "The golden travel duration for first-time visitors",
        paragraphs_vi: ["Kết hợp thăm quan di sản, khám phá ẩm thực đường phố và nghỉ ngơi tại bãi biển nhiệt đới."],
        paragraphs_en: ["A balanced two-week journey through ancient alleys, limestone bays, and dynamic cities."]
      }
    ]
  },
  {
    slug: "1-month-in-vietnam",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch Trình 1 Tháng Du Lịch Khám Phá Toàn Diện Việt Nam",
    title_en: "1 Month in Vietnam: The Ultimate Grand Tour",
    hero_image: "/guide/megamenu/itin-4-1month.jpg",
    author_name: "VinaTap Itinerary",
    published_date: "2026-10-16",
    status: "published",
    views_count: 36,
    items: [
      {
        item_number: 1,
        title_vi: "Chuyến phiêu lưu vĩ đại từ cực Bắc Hà Giang tới Đất Mũi Cà Mau",
        title_en: "The ultimate expedition from North to South",
        image_url: "/guide/megamenu/itin-4-1month.jpg",
        caption_vi: "Trọn vẹn 30 ngày sống chậm và khám phá bản sắc",
        caption_en: "A month-long odyssey through mountains, coastlines, and rivers",
        paragraphs_vi: ["Khám phá những cung đường đèo hùng vĩ, làng nghề cổ truyền và hệ sinh thái sông nước Miền Tây."],
        paragraphs_en: ["In-depth exploration covering mountain loops, tranquil homestays, and Mekong waterways."]
      }
    ]
  }
];

async function applySeedAndResetViews() {
  console.log("=== BẮT ĐẦU CẬP NHẬT 24 BÀI VIẾT CẨM NANG & RESET TỔNG 856 VIEWS ===");

  let totalCalculatedViews = 0;
  for (const art of ALL_24_ARTICLES) {
    totalCalculatedViews += art.views_count;
  }
  console.log(`Số bài viết: ${ALL_24_ARTICLES.length} | Tổng lượt xem dự kiến: ${totalCalculatedViews}`);

  for (let i = 0; i < ALL_24_ARTICLES.length; i++) {
    const art = ALL_24_ARTICLES[i];
    const [existing] = await pool.query("SELECT id FROM articles WHERE slug = ? LIMIT 1", [art.slug]);

    let articleId;
    if (existing && existing.length > 0) {
      articleId = existing[0].id;
      await pool.query(
        `UPDATE articles 
         SET category = ?, province_slug = ?, title_en = ?, title_vi = ?, hero_image = ?, author_name = ?, published_date = ?, status = ?, views_count = ?
         WHERE id = ?`,
        [
          art.category,
          art.province_slug,
          art.title_en,
          art.title_vi,
          art.hero_image,
          art.author_name,
          art.published_date,
          art.status,
          art.views_count,
          articleId
        ]
      );
      console.log(`[Cập nhật #${i + 1}] ID: ${articleId} | Slug: ${art.slug} | Date: ${art.published_date} | Views: ${art.views_count}`);
    } else {
      const [res] = await pool.query(
        `INSERT INTO articles 
         (slug, category, province_slug, title_en, title_vi, hero_image, author_name, published_date, status, views_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          art.slug,
          art.category,
          art.province_slug,
          art.title_en,
          art.title_vi,
          art.hero_image,
          art.author_name,
          art.published_date,
          art.status,
          art.views_count
        ]
      );
      articleId = res.insertId;
      console.log(`[Thêm mới #${i + 1}] ID: ${articleId} | Slug: ${art.slug} | Date: ${art.published_date} | Views: ${art.views_count}`);
    }

    if (art.items && art.items.length > 0) {
      await pool.query("DELETE FROM article_items WHERE article_id = ?", [articleId]);
      for (let j = 0; j < art.items.length; j++) {
        const it = art.items[j];
        await pool.query(
          `INSERT INTO article_items 
           (article_id, sort_order, item_number, title_en, title_vi, image_url, caption_en, caption_vi, paragraphs_en, paragraphs_vi)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            articleId,
            j,
            it.item_number || j + 1,
            it.title_en || "",
            it.title_vi || "",
            it.image_url || art.hero_image,
            it.caption_en || null,
            it.caption_vi || null,
            JSON.stringify(it.paragraphs_en || []),
            JSON.stringify(it.paragraphs_vi || [])
          ]
        );
      }
    }
  }

  const [verify] = await pool.query("SELECT COUNT(*) as count, SUM(views_count) as total_views FROM articles");
  console.log(`\n🎉 HOÀN TẤT THÀNH CÔNG!`);
  console.log(`👉 Tổng số bài viết hiện tại: ${verify[0].count}`);
  console.log(`👉 Tổng lượt xem toàn hệ thống: ${verify[0].total_views}`);

  process.exit(0);
}

applySeedAndResetViews().catch(err => {
  console.error("Lỗi cập nhật:", err);
  process.exit(1);
});
