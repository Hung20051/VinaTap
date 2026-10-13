require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const pool = require("../config/db");

const ARTICLES_SEED = [
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
    views_count: 5320,
    items: [
      {
        item_number: 1,
        title_vi: "1. TP. Hồ Chí Minh - Siêu đô thị rực rỡ và tràn đầy năng lượng",
        title_en: "1. Ho Chi Minh City - Dynamic and vibrant metropolis",
        image_url: "/guide/15-best-places/place-1-ho-chi-minh-city.jpg",
        caption_vi: "Toàn cảnh trung tâm TP. Hồ Chí Minh hiện đại",
        caption_en: "Modern skyline of Ho Chi Minh City",
        paragraphs_vi: [
          "Siêu đô thị năng động bậc nhất Việt Nam với sự giao thoa kỳ diệu giữa những tòa cao ốc chọc trời lung linh, kiến trúc Pháp cổ điển và văn hóa ẩm thực đường phố độc đáo."
        ],
        paragraphs_en: [
          "Vietnam's vibrant commercial hub where illuminated skyscrapers tango with French colonial landmarks and world-class street food."
        ]
      },
      {
        item_number: 2,
        title_vi: "2. Hội An - Phố cổ đèn lồng huyền ảo bên dòng sông Hoài",
        title_en: "2. Hoi An - Enchanting ancient lantern town",
        image_url: "/guide/15-best-places/place-2-hoi-an.jpg",
        caption_vi: "Phố cổ Hội An lung linh sắc đèn lồng",
        caption_en: "Magical lantern lights in Hoi An ancient town",
        paragraphs_vi: [
          "Di sản Văn hóa Thế giới UNESCO với những con ngõ vàng ươm rêu phong, hoa đăng lung linh trên dòng sông Hoài và thiên đường may đo thời trang thủ công."
        ],
        paragraphs_en: [
          "A UNESCO World Heritage gem famous for golden heritage shophouses, floating lanterns on Hoai river, and custom tailoring."
        ]
      },
      {
        item_number: 3,
        title_vi: "3. Hà Nội - Thủ đô ngàn năm văn hiến và 36 phố phường",
        title_en: "3. Hanoi - Timeless thousand-year-old capital",
        image_url: "/guide/15-best-places/place-3-hanoi.jpg",
        caption_vi: "Hồ Hoàn Kiếm thơ mộng giữa lòng thủ đô",
        caption_en: "Hoan Kiem Lake in the center of Hanoi",
        paragraphs_vi: [
          "Trái tim văn hóa lịch sử của cả nước, nổi bật với Hồ Gươm thanh bình, khu phố cổ trầm mặc và văn hóa cà phê vỉa hè sâu lắng."
        ],
        paragraphs_en: [
          "The soulful capital of Vietnam with deep historical roots, iconic Old Quarter alleys, and legendary sidewalk coffee culture."
        ]
      },
      {
        item_number: 4,
        title_vi: "4. Đà Nẵng - Thành phố đáng sống và bãi biển Mỹ Khê quyến rũ",
        title_en: "4. Da Nang - Livable city and stunning My Khe Beach",
        image_url: "/guide/15-best-places/place-4-da-nang.jpg",
        caption_vi: "Cầu Rồng phun lửa biểu tượng của Đà Nẵng",
        caption_en: "Iconic Dragon Bridge of Da Nang",
        paragraphs_vi: [
          "Thành phố biển hiện đại với cầu Rồng biểu tượng, dãy núi Ngũ Hành Sơn hùng vĩ và bãi biển Mỹ Khê cát trắng trải dài."
        ],
        paragraphs_en: [
          "Coastal hub featuring modern dragon bridges, Marble Mountains, and pristine white sandy shores."
        ]
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
    views_count: 4890,
    items: [
      {
        item_number: 1,
        title_vi: "1. Thưởng thức một tô Phở nóng hổi lúc sáng sớm",
        title_en: "1. Savor an authentic steaming bowl of Pho at dawn",
        image_url: "/guide/pho/where-was-pho-first-created-vietnamnomad.jpg",
        caption_vi: "Tô phở bò truyền thống thơm lừng thảo mộc",
        caption_en: "Traditional Vietnamese beef noodle soup",
        paragraphs_vi: [
          "Không có gì khởi đầu một ngày du lịch Việt Nam tuyệt vời hơn là ngồi quán ven đường và thưởng thức hương vị nước dùng phở ninh từ xương ống đậm đà."
        ],
        paragraphs_en: [
          "Nothing starts a Vietnam morning better than a steaming bowl of fragrant Pho prepared with rich broth and fresh herbs."
        ]
      },
      {
        item_number: 2,
        title_vi: "2. Du thuyền qua những hòn đảo đá vôi Vịnh Hạ Long",
        title_en: "2. Cruise through limestone karsts in Ha Long Bay",
        image_url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
        caption_vi: "Kỳ quan thiên nhiên thế giới Vịnh Hạ Long",
        caption_en: "UNESCO natural wonder Ha Long Bay",
        paragraphs_vi: [
          "Trải nghiệm nghỉ đêm trên du thuyền giữa hàng nghìn đảo đá vôi nhấp nhô trên mặt nước ngọc bích phẳng lặng."
        ],
        paragraphs_en: [
          "Overnight cruise experience gliding across emerald waters and towering emerald limestone towers."
        ]
      }
    ]
  },
  {
    slug: "3-week-vietnam-itinerary",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lịch trình 3 tuần xuyên Việt trọn vẹn từ Bắc vào Nam",
    title_en: "3-Week Complete Vietnam Itinerary: North to South",
    hero_image: "/guide/hcmc/Vietnamnomad-header-banner-2026.jpg",
    author_name: "VinaTap Expert",
    published_date: "2026-10-11",
    status: "published",
    views_count: 3650,
    items: [
      {
        item_number: 1,
        title_vi: "Tuần 1: Khám phá miền Bắc kỳ vĩ (Hà Nội - Ninh Bình - Hạ Long - Sapa)",
        title_en: "Week 1: Majestic Northern Vietnam (Hanoi - Ninh Binh - Ha Long)",
        image_url: "/guide/hanoi/hanoi-tourist-map-2026.jpg",
        caption_vi: "Vùng đất di sản văn hóa miền Bắc",
        caption_en: "Northern cultural heritage journey",
        paragraphs_vi: [
          "Khởi hành từ thủ đô Hà Nội, chèo thuyền qua quần thể Tràng An Ninh Bình và lênh đênh trên vịnh Hạ Long kỳ ảo."
        ],
        paragraphs_en: [
          "Embark from Hanoi, paddle through Trang An caves in Ninh Binh, and sail through magnificent Ha Long Bay."
        ]
      },
      {
        item_number: 2,
        title_vi: "Tuần 2: Cung đường di sản miền Trung (Huế - Đà Nẵng - Hội An)",
        title_en: "Week 2: Central Heritage Trail (Hue - Da Nang - Hoi An)",
        image_url: "/guide/15-best-places/place-2-hoi-an.jpg",
        caption_vi: "Phố cổ Hội An thơ mộng",
        caption_en: "Charming Hoi An ancient streets",
        paragraphs_vi: [
          "Chiêm ngưỡng Cố đô Huế trầm mặc, chinh phục đèo Hải Vân hùng vĩ và đắm mình trong không gian cổ tích của phố cổ Hội An."
        ],
        paragraphs_en: [
          "Explore imperial citadel of Hue, conquer Hai Van pass, and unwind in romantic lantern-lit Hoi An."
        ]
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
    views_count: 4120,
    items: [
      {
        item_number: 1,
        title_vi: "1. Cơm Tấm Sườn Bì Chả Sài Gòn",
        title_en: "1. Broken Rice with Grilled Pork Chops (Com Tam)",
        image_url: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
        caption_vi: "Đĩa cơm tấm sườn nướng thơm lừng mỡ hành",
        caption_en: "Quintessential Saigon Com Tam with scallion oil",
        paragraphs_vi: [
          "Món ăn linh hồn của Sài Gòn với hạt gạo tấm dẻo bùi, miếng sườn nướng xém cạnh thơm phức, chả trứng béo ngậy và mỡ hành giòn thơm."
        ],
        paragraphs_en: [
          "The culinary soul of Saigon featuring charred marinated pork chops, steamed egg meatloaf, and rich scallion oil."
        ]
      },
      {
        item_number: 2,
        title_vi: "2. Hủ Tiếu Nam Vang trứ danh",
        title_en: "2. Nam Vang Clear Noodle Soup (Hu Tieu)",
        image_url: "/guide/megamenu/todo-2-hcmc.jpg",
        caption_vi: "Tô hủ tiếu khô trộn tóp mỡ giòn rụm",
        caption_en: "Savory dry Hu Tieu noodles",
        paragraphs_vi: [
          "Hủ tiếu sợi dai hòa cùng nước dùng tôm mực ngọt thanh hoặc dùng kiểu khô với sốt tương tỏi phi tóp mỡ hấp dẫn."
        ],
        paragraphs_en: [
          "Chewy clear noodles served in a savory pork-seafood broth or tossed dry with garlic soy sauce and crispy pork cracklings."
        ]
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
    views_count: 3870,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bún Chả Hà Nội nướng than hoa",
        title_en: "1. Charcoal-Grilled Bun Cha Hanoi",
        image_url: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
        caption_vi: "Bún chả nướng than đượm vị truyền thống",
        caption_en: "Hanoi Bun Cha with grilled pork patties",
        paragraphs_vi: [
          "Thịt ba chỉ và chả viên nướng xém than hoa thả vào bát nước mắm chua ngọt ấm nóng kèm đu đủ giòn và rau thơm."
        ],
        paragraphs_en: [
          "Charcoal-grilled pork patties served in warm sweet-and-sour fish sauce with fresh herbs and vermicelli."
        ]
      },
      {
        item_number: 2,
        title_vi: "2. Cà Phê Trứng béo ngậy phố cổ",
        title_en: "2. Silky Hanoi Egg Coffee (Ca Phe Trung)",
        image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
        caption_vi: "Ly cà phê trứng ngậy mịn huyền thoại Giảng",
        caption_en: "Legendary egg coffee in Hanoi Old Quarter",
        paragraphs_vi: [
          "Sự kết hợp hoàn hảo giữa lòng đỏ trứng gà đánh bông mịn màng như kem tươi và cốt cà phê Robusta đen đậm đà."
        ],
        paragraphs_en: [
          "Whipped creamy egg yolk foam floating atop bold Vietnamese dark roast Robusta coffee."
        ]
      }
    ]
  },
  {
    slug: "5-must-try-nha-trang-dishes",
    category: "eat-drink",
    province_slug: "khanh-hoa",
    title_vi: "5 món ăn phải nếm khi đến Nha Trang",
    title_en: "5 Must-Try Dishes in Nha Trang",
    hero_image: "/guide/top-banner-companion.png",
    author_name: "VinaTap Team",
    published_date: "2026-10-12",
    status: "published",
    views_count: 2240,
    items: [
      {
        item_number: 1,
        title_vi: "1. Nem Nướng Ninh Hòa bánh tráng cuốn",
        title_en: "1. Ninh Hoa Grilled Pork Rolls (Nem Nuong)",
        image_url: "/guide/nha-trang/Hon-Mun-Island-snorkeling-Nha-Trang.jpg",
        caption_vi: "Mẹt nem nướng Nha Trang đủ sắc màu",
        caption_en: "Nha Trang Nem Nuong platter with dipping sauce",
        paragraphs_vi: [
          "Từng xiên nem nướng thơm lừng cuộn cùng bánh tráng chiên giòn, xoài non chua dịu và chấm nước sốt tương nếp gia truyền."
        ],
        paragraphs_en: [
          "Smoky grilled pork rolls wrapped with crispy rice paper, tart mango slices, and secret sweet dipping sauce."
        ]
      }
    ]
  },
  {
    slug: "7-must-try-foods-in-vung-tau",
    category: "eat-drink",
    province_slug: "ba-ria-vung-tau",
    title_vi: "7 món ăn nhất định phải thử ở Vũng Tàu",
    title_en: "7 Must-Try Foods in Vung Tau",
    hero_image: "/guide/top-banner-companion.png",
    author_name: "VinaTap Team",
    published_date: "2026-10-13",
    status: "published",
    views_count: 2150,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bánh Khọt giòn rụm tôm tươi Vũng Tàu",
        title_en: "1. Crispy Banh Khot with Fresh Shrimp",
        image_url: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
        caption_vi: "Bánh khọt Vũng Tàu giòn tan ăn kèm rau sống",
        caption_en: "Crispy Vung Tau Banh Khot with herbs",
        paragraphs_vi: [
          "Chiếc bánh tròn nhỏ chiên vàng giòn rụm, điểm xuyết con tôm tươi roi rói, bột tôm đỏ au và cuốn cùng cải bẹ xanh thơm nồng."
        ],
        paragraphs_en: [
          "Mini savory crispy pancakes topped with juicy sea prawns, shrimp powder, and eaten wrapped in mustard greens."
        ]
      }
    ]
  },
  {
    slug: "5-best-vung-tau-beaches",
    category: "things-to-do",
    province_slug: "ba-ria-vung-tau",
    title_vi: "5 Bãi Biển Đẹp Nhất Tại Vũng Tàu Bạn Không Nên Bỏ Lỡ",
    title_en: "5 Best Beaches in Vung Tau You Shouldn't Miss",
    hero_image: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
    author_name: "VinaTap Beach Guide",
    published_date: "2026-10-13",
    status: "published",
    views_count: 2980,
    items: [
      {
        item_number: 1,
        title_vi: "1. Bãi Sau (Bãi Thùy Vân) - Bờ cát thoai thoải dài vô tận",
        title_en: "1. Back Beach (Bai Sau) - Endless sandy stretch",
        image_url: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
        caption_vi: "Bãi Sau nhộn nhịp du khách tắm biển",
        caption_en: "Lively Back Beach in Vung Tau",
        paragraphs_vi: [
          "Bãi biển dài hơn 8km với sóng êm, bờ cát thoai thoải lý tưởng cho các hoạt động tắm biển và thể thao dưới nước."
        ],
        paragraphs_en: [
          "An 8km long stretch of coast with gentle surf and wide beaches perfect for swimming."
        ]
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
    views_count: 5120,
    items: [
      {
        item_number: 1,
        title_vi: "Nguồn gốc lịch sử và sự khác biệt giữa Phở Bắc và Phở Nam",
        title_en: "History and contrast between Northern and Southern Pho",
        image_url: "/guide/pho/where-was-pho-first-created-vietnamnomad.jpg",
        caption_vi: "Nước dùng phở trong veo tinh tế",
        caption_en: "Clear and aromatic Pho broth",
        paragraphs_vi: [
          "Khám phá hành trình hơn 100 năm của bát phở từ đất Nam Định, Hà Nội đến sự phong phú đậm đà của phở miền Nam."
        ],
        paragraphs_en: [
          "Uncover the century-long heritage of Vietnam's national dish from subtle Northern origins to robust Southern styles."
        ]
      }
    ]
  },
  {
    slug: "ao-dai-vietnamese-traditional-dress",
    category: "inspired",
    province_slug: null,
    title_vi: "Áo Dài – Quốc phục & Nét đẹp truyền thống Việt Nam",
    title_en: "Ao Dai: Vietnamese Traditional Dress and Elegance",
    hero_image: "/guide/top-banner-companion.png",
    author_name: "VinaTap Culture",
    published_date: "2026-10-13",
    status: "published",
    views_count: 3410,
    items: [
      {
        item_number: 1,
        title_vi: "Biểu tượng duyên dáng của phụ nữ và văn hóa Việt qua các thời kỳ",
        title_en: "Graceful symbol of Vietnamese women and heritage",
        image_url: "/guide/top-banner-companion.png",
        caption_vi: "Nét thướt tha của tà áo dài truyền thống",
        caption_en: "Graceful lines of traditional Ao Dai",
        paragraphs_vi: [
          "Tà áo dài thướt tha tôn vinh vẻ đẹp kín đáo mà thanh thoát của người phụ nữ Việt Nam, xuất hiện rạng rỡ trong mọi dịp lễ hội và đời thường."
        ],
        paragraphs_en: [
          "A stunning national attire embodying subtle elegance and deep cultural identity through centuries."
        ]
      }
    ]
  },
  {
    slug: "where-to-stay-in-ho-chi-minh-city",
    category: "itineraries",
    province_slug: "ho-chi-minh",
    title_vi: "Khách Sạn & Khu Vực Nên Ở Tại TP. Hồ Chí Minh",
    title_en: "Where to Stay in Ho Chi Minh City: Best Neighborhoods",
    hero_image: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
    author_name: "VinaTap Stay Guide",
    published_date: "2026-10-14",
    status: "published",
    views_count: 2780,
    items: [
      {
        item_number: 1,
        title_vi: "Quận 1 - Trái tim sôi động gần mọi điểm tham quan chính",
        title_en: "District 1 - The pulsing heart close to all attractions",
        image_url: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
        caption_vi: "Khu vực trung tâm Quận 1",
        caption_en: "Vibrant District 1 center",
        paragraphs_vi: [
          "Lựa chọn số 1 cho du khách lần đầu đến Sài Gòn, dễ dàng đi bộ đến phố đi bộ Nguyễn Huệ, chợ Bến Thành và các nhà hàng cao cấp."
        ],
        paragraphs_en: [
          "The prime choice for first-time visitors within walking distance to Ben Thanh, Nguyen Hue, and top restaurants."
        ]
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
    views_count: 3120,
    items: [
      {
        item_number: 1,
        title_vi: "Các điểm tham quan trọng điểm tại khu vực Ba Đình & Hoàn Kiếm",
        title_en: "Key highlights around Ba Dinh and Hoan Kiem districts",
        image_url: "/guide/hanoi/hanoi-tourist-map-2026.jpg",
        caption_vi: "Bản đồ các địa danh nổi tiếng thủ đô",
        caption_en: "Map of famous Hanoi landmarks",
        paragraphs_vi: [
          "Cẩm nang định vị nhanh Văn Miếu Quốc Tử Giám, Hoàng thành Thăng Long, Lăng Bác và phố cổ Hà Nội."
        ],
        paragraphs_en: [
          "Quick navigational breakdown of the Temple of Literature, Imperial Citadel, and Old Quarter."
        ]
      }
    ]
  },
  {
    slug: "plan-your-vietnam-trip-with-just-one-prompt",
    category: "itineraries",
    province_slug: null,
    title_vi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt AI",
    title_en: "Plan Your Vietnam Trip with Just One Prompt",
    hero_image: "/guide/megamenu/inspired-2.jpg",
    author_name: "VinaTap AI Lab",
    published_date: "2026-10-14",
    status: "published",
    views_count: 4210,
    items: [
      {
        item_number: 1,
        title_vi: "Trợ lý du lịch AI VinaTap lên lộ trình chi tiết theo sở thích",
        title_en: "VinaTap AI Travel Assistant builds customized itineraries",
        image_url: "/guide/megamenu/inspired-2.jpg",
        caption_vi: "Công nghệ lập kế hoạch thông minh",
        caption_en: "Smart AI trip generation interface",
        paragraphs_vi: [
          "Chỉ cần nhập thời gian, ngân sách và phong cách du lịch, hệ thống AI sẽ tự động xuất lịch trình từng ngày kèm dự toán chi phí chính xác."
        ],
        paragraphs_en: [
          "Simply input your duration, budget and travel style, and the AI generates day-by-day itineraries with exact estimates."
        ]
      }
    ]
  },
  {
    slug: "the-complete-guide-to-vietnam",
    category: "inspired",
    province_slug: null,
    title_vi: "Cẩm nang du lịch toàn diện Việt Nam 2026",
    title_en: "The Complete Guide to Vietnam 2026",
    hero_image: "/guide/megamenu/inspired-3.jpg",
    author_name: "VinaTap Chief Editor",
    published_date: "2026-10-14",
    status: "published",
    views_count: 6540,
    items: [
      {
        item_number: 1,
        title_vi: "Tất cả những gì bạn cần biết: Visa, thời tiết, tiền tệ và văn hóa",
        title_en: "Everything you need to know: Visa, weather, currency and culture",
        image_url: "/guide/megamenu/inspired-3.jpg",
        caption_vi: "Bức tranh toàn cảnh du lịch Việt Nam",
        caption_en: "Complete panorama of Vietnam travel",
        paragraphs_vi: [
          "Hướng dẫn từ A đến Z dành cho du khách quốc tế và nội địa: thủ tục E-visa, khí hậu các mùa, phương tiện di chuyển và ứng xử văn hóa."
        ],
        paragraphs_en: [
          "Comprehensive A-to-Z primer covering E-visas, regional climates, transportation tips, and local etiquette."
        ]
      }
    ]
  }
];

async function seed() {
  console.log("=== Bắt đầu nạp toàn bộ danh mục bài viết vào MySQL ===");

  for (const art of ARTICLES_SEED) {
    // Kiểm tra xem bài đã tồn tại chưa
    const [existing] = await pool.query(
      "SELECT id FROM articles WHERE slug = ? LIMIT 1",
      [art.slug]
    );

    let articleId;
    if (existing && existing.length > 0) {
      articleId = existing[0].id;
      console.log(`Cập nhật bài viết hiện có: ${art.slug} (ID: ${articleId})`);
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
    } else {
      console.log(`Thêm mới bài viết: ${art.slug}`);
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
    }

    // Cập nhật các items
    if (art.items && art.items.length > 0) {
      await pool.query("DELETE FROM article_items WHERE article_id = ?", [articleId]);

      for (let i = 0; i < art.items.length; i++) {
        const it = art.items[i];
        await pool.query(
          `INSERT INTO article_items 
           (article_id, sort_order, item_number, title_en, title_vi, image_url, caption_en, caption_vi, paragraphs_en, paragraphs_vi)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            articleId,
            i,
            it.item_number || i + 1,
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

  const [all] = await pool.query("SELECT COUNT(*) as count FROM articles");
  console.log(`🎉 Hoàn tất! Tổng số bài viết hiện tại trong database: ${all[0].count}`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Lỗi seed articles:", err);
  process.exit(1);
});
