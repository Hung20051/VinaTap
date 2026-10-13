"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  ChevronRight,
  Compass,
  MapPin,
  Utensils,
  Hotel,
  Play,
  X,
  Facebook,
  Instagram,
  Youtube,
  Gift,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/destination-dalat.css";

// ─── MEGAMENUS DATA ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
        date: "June 16, 2026",
        dateVi: "16 Tháng 6, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "insp-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "April 1, 2026",
        dateVi: "1 Tháng 4, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "January 9, 2026",
        dateVi: "9 Tháng 1, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "insp-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "September 18, 2026",
        dateVi: "18 Tháng 9, 2026",
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/ao-dai-vietnamese-traditional-dress",
      },
    ],
  },
  destinations: {
    items: [
      {
        id: "dest-1",
        title: "Ho Chi Minh City",
        titleVi: "TP. Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "September 25, 2026",
        dateVi: "25 Tháng 9, 2026",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "September 22, 2026",
        dateVi: "22 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "June 15, 2022",
        dateVi: "15 Tháng 6, 2022",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "thing-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "thing-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 hoạt động tuyệt nhất tại TP.HCM",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "thing-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 hoạt động không thể bỏ lỡ tại Nha Trang",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "thing-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "thing-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "July 21, 2024",
        dateVi: "21 Tháng 7, 2024",
        badge: "Articles",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/province/dalat",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ăn nhất định phải thử tại Hà Nội",
        date: "October 2, 2026",
        dateVi: "2 Tháng 10, 2026",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "September 24, 2026",
        dateVi: "24 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở Việt Nam",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon nổi tiếng tại Vũng Tàu",
        date: "September 30, 2026",
        dateVi: "30 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
        date: "September 8, 2026",
        dateVi: "8 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-5-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "September 16, 2026",
        dateVi: "16 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "September 14, 2026",
        dateVi: "14 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
};

function formatBadge(badge, lang) {
  if (!badge) return "";
  if (lang !== "vi") return badge;
  const map = {
    "#Trending": "#Thịnh hành",
    "Featured Articles": "Bài nổi bật",
    Destinations: "Điểm đến",
    "Central Vietnam": "Miền Trung",
    Articles: "Bài viết",
    Itinerary: "Lịch trình",
    "Eat & Drink": "Ẩm thực",
    Hanoi: "Hà Nội",
  };
  return map[badge] || badge;
}

const DALAT_DETAILS = {
  stay: {
    titleEn: "Where to stay in Dalat",
    titleVi: "Nơi lưu trú ở Đà Lạt",
    badgeEn: "Accommodation Guide",
    badgeVi: "Cẩm nang lưu trú",
    img: "/guide/dalat/dalat-stay-hd.jpg",
    paragraphsEn: [
      "Nestled in the lush pine-covered Langbiang plateau at an altitude of 1,500 meters, Dalat offers some of the most charming, romantic, and varied accommodation choices anywhere in Vietnam. From historic French-colonial heritage villas with working brick fireplaces to contemporary glass cabins perched on misty valleys and luxury lakeside eco-resorts, where you choose to stay will profoundly shape your Dalat experience.",
      "For first-timers and active explorers, the Xuan Huong Lake and City Center district provides unmatched walkability. You are steps away from the bustling Dalat Night Market, colonial landmarks like the Dalat Railway Station and St. Nicholas Cathedral, and an endless array of cozy cafes.",
      "If you crave silence, serenity, and nature, head southwest to the Tuyen Lam Lake precinct. Here, secluded 5-star lakeside resorts and wellness retreats are surrounded by endless pine forests and serene waters, perfect for kayaking, forest trekking, and stargazing.",
      "For photography lovers and couples seeking the iconic 'cloud-hunting' experience, hillside homestays in Trai Mat, Cau Dat, and Da Quy valley offer private wooden decks overlooking terraced flower farms and greenhouse valleys that illuminate magically like constellations once the sun sets."
    ],
    paragraphsVi: [
      "Tọa lạc trên cao nguyên Lâm Viên xanh ngát ở độ cao 1.500m so với mực nước biển, Đà Lạt mang đến những trải nghiệm lưu trú lãng mạn và đa dạng bậc nhất Việt Nam. Từ những căn biệt thự Pháp cổ kính với lò sưởi củi ấm cúng, những căn homestay nhà kính ngắm thung lũng mây bồng bềnh, cho đến các khu resort nghỉ dưỡng sinh thái ven hồ tĩnh lặng.",
      "Nếu bạn đến Đà Lạt lần đầu và yêu thích sự nhộn nhịp, khu vực quanh hồ Xuân Hương và trung tâm thành phố là lựa chọn số một. Tại đây, bạn chỉ mất vài bước chân để dạo chợ đêm Đà Lạt, ga xe lửa cổ, nhà thờ Con Gà và hàng trăm quán cà phê xinh xắn.",
      "Nếu tìm kiếm không gian thanh bình và hòa mình vào thiên nhiên hoang sơ, khu vực hồ Tuyền Lâm là điểm đến lý tưởng với các resort cao cấp nép mình giữa rừng thông bạt ngàn, phù hợp cho chèo thuyền SUP, trekking và nghỉ dưỡng phục hồi sức khỏe.",
      "Dành cho các cặp đôi và tín đồ mê 'săn mây', các homestay triền đồi tại Trại Mát, Cầu Đất hay thung lũng Dã Quỳ sẽ mang đến góc nhìn bao trọn biển mây sớm và thung lũng đèn lồng rực sáng lung linh như ngàn vì sao khi đêm về."
    ],
    highlightsEn: [
      "Xuan Huong Lake & Center: Best for nightlife, street food, and walking convenience.",
      "Tuyen Lam Lake: Best for luxury resorts, nature lovers, and peaceful retreats.",
      "Trai Mat & Cau Dat: Best for sunrise cloud hunting, valley views, and romantic homestays.",
      "French Quarter (Tran Hung Dao): Best for French colonial architecture and heritage boutique villas."
    ],
    highlightsVi: [
      "Khu trung tâm & Hồ Xuân Hương: Tiện lợi đi lại, gần chợ đêm và ngập tràn ẩm thực đường phố.",
      "Khu vực Hồ Tuyền Lâm: Không gian sinh thái biệt lập, resort 5 sao sang trọng giữa rừng thông.",
      "Trại Mát & Đồi Cầu Đất: Cung đường săn mây đắt giá, view thung lũng nhà đèn kỳ ảo về đêm.",
      "Khu biệt thự cổ Trần Hưng Đạo: Kiến trúc Pháp cổ điển hoài niệm, yên bình và đậm chất thơ."
    ]
  },
  foods: {
    titleEn: "8 must-try foods in Dalat",
    titleVi: "8 món ăn phải thử tại Đà Lạt",
    badgeEn: "Culinary Highlights",
    badgeVi: "Đặc sản ẩm thực",
    img: "/guide/dalat/dalat-8-foods-hd.jpg",
    paragraphsEn: [
      "The chilly highland climate of Dalat creates the ultimate atmosphere for enjoying hot, steaming, and soul-comforting street foods. From sizzling earthenware stoves tucked inside misty alleyways to bustling night-market charcoal braziers, Dalat's food culture is an irresistible celebration of fresh local produce and warm companionship.",
      "1. Banh Can (Mini Rice Pancakes): Cooked in traditional clay molds over glowing coals, these bite-sized crispy cakes are filled with quail eggs or minced pork, dipped into a hot bowl of scallion oil, savory pork meatballs (xiu mai), and chili.",
      "2. Banh Trang Nuong ('Vietnamese Pizza'): Crispy grilled rice paper layered with quail eggs, butter, cheese, minced scallions, dried shrimp, and sausage, toasted over charcoal until golden and crunchy.",
      "3. Lau Ga La E (Chicken Hotpot with É Leaves): A signature Dalat comfort specialty featuring tender chicken simmered in a mildly spicy, aromatic broth packed with indigenous é herb leaves, bamboo shoots, and mushrooms.",
      "4. Lau Bo Ba Toa (Ba Toa Beef Hotpot): A legendary cold-weather feast featuring hearty clay pots overflowing with succulent beef cuts, tendon, tofu, and fresh highland mountain greens.",
      "5. Banh Uot Long Ga: Delicate steamed rice crepes paired with shredded organic free-range chicken and seasoned innards, tossed in sweet-tangy fish sauce and fresh Vietnamese coriander.",
      "6. Hot Soy Milk & Pastries: An iconic night-time ritual around Tang Bat Ho street, sipping warm frothy soy or mung-bean milk alongside fresh pastries like banh tieu and croissants.",
      "7. Kem Bo (Avocado Ice Cream): Ultra-creamy ripe Dalat avocado blended smooth, crowned with a scoop of coconut milk ice cream and toasted coconut flakes.",
      "8. Night Market Grilled Skewers: Sizzling arrays of grilled pork, beef rolls with enoki mushrooms, sweet potatoes, and roasted corn right by the market steps."
    ],
    paragraphsVi: [
      "Tiết trời se lạnh quanh năm biến Đà Lạt thành thiên đường của những món ngon nóng hổi, xì xụp ấm lòng. Từ những gánh hàng rong nghi ngút khói bên vách đá đến khu chợ đêm nhộn nhịp than hồng, ẩm thực Đà Lạt làm say lòng bất cứ ai:",
      "1. Bánh căn Đà Lạt: Đổ trong khuôn đất nung mộc mạc trên than hồng đỏ rực, bánh giòn rụm bên ngoài, béo ngậy trứng cút hoặc thịt bằm, chấm cùng chén xíu mại ngập mỡ hành thơm phức.",
      "2. Bánh tráng nướng ('Pizza Việt Nam'): Bánh tráng nướng giòn rụm trên than hoa, phết bơ, mỡ hành, trứng cút, phô mai, xúc xích và tép khô đậm đà khó cưỡng.",
      "3. Lẩu gà lá é: Đặc sản nức tiếng với nước dùng ngọt thanh cay nồng ấm bụng, thịt gà ta dai ngon hòa cùng vị thơm đặc trưng the mát của lá é vùng cao.",
      "4. Lẩu bò Ba Toa (Quán Gỗ): Nồi lẩu đất nghi ngút khói đầy đặn thịt bò nạm, gân, đuôi bò mềm rục, ăn kèm đĩa rau cải non xanh mướt của nhà vườn Đà Lạt.",
      "5. Bánh ướt lòng gà: Bánh ướt tráng mỏng mềm mượt, kết hợp thịt gà xé phay, lòng gà xào đậm đà và nước mắm chua ngọt thanh tao cùng rau răm.",
      "6. Sữa đậu nành nóng & Bánh tiêu: Thú vui tao nhã khi đêm xuống dạo phố Tăng Bạt Hổ, ôm ly sữa đậu nóng hổi thơm bùi và thưởng thức cùng bánh tiêu giòn ngọt.",
      "7. Kem bơ sáp: Bơ sáp dẻo quánh xay mịn không pha đá, ăn cùng viên kem dừa béo ngậy và dừa khô giòn rụm.",
      "8. Xiên nướng & Khoai nướng chợ đêm: Vô vàn xiên thịt bò cuốn nấm kim châm, chân gà nướng, bắp nướng mỡ hành tỏa hương thơm quyến rũ khắp các bậc thang."
    ],
    highlightsEn: [
      "Best spots for Banh Can: Nha Chung Street, Tang Bat Ho Street.",
      "Best spots for Lau Ga La E: Tao Ngo (3/4 Street), 664 Hai Ba Trung.",
      "Best spots for Kem Bo: Thanh Thao (Nguyen Van Troi Street).",
      "Best spots for Lau Bo: Quan Go Ba Toa (Hoang Dieu Alley)."
    ],
    highlightsVi: [
      "Địa chỉ bánh căn ngon: Dốc Nhà Chung, đường Tăng Bạt Hổ.",
      "Địa chỉ lẩu gà lá é: Quán Tao Ngộ (đầu đường 3/4), Quán 664 Hai Bà Trưng.",
      "Địa chỉ kem bơ: Kem bơ Thanh Thảo (đường Nguyễn Văn Trỗi).",
      "Địa chỉ lẩu bò: Lẩu bò Ba Toa Quán Gỗ (hẻm Hoàng Diệu)."
    ]
  },
  banhMi: {
    titleEn: "Banh Mi Dalat",
    titleVi: "Bánh Mì Xíu Mại Đà Lạt",
    badgeEn: "Iconic Breakfast",
    badgeVi: "Bữa sáng đặc sản",
    img: "/guide/dalat/dalat-banh-mi-hd.jpg",
    paragraphsEn: [
      "In Dalat, banh mi is enjoyed differently than in Saigon or Hanoi. Rather than a pre-stuffed sandwich to take on the go, Dalat's signature style is 'Banh Mi Xiu Mai' (Baguette with Meatball Dipping Soup), meant to be savored slowly at low wooden tables in the cool morning air.",
      "You receive a fresh, extra-crispy baguette warmed by the stove alongside a steaming small ceramic bowl of savory broth. Inside the broth float two plump, melt-in-your-mouth pork meatballs, stewed pork skin with gelatinous richness, a slice of cha lua, and a generous layer of fragrant scallion oil.",
      "To eat like a local, tear off a piece of crusty bread, submerge it into the peppery soup to absorb the flavors, add a touch of fiery fresh chili sauce, and take a blissful bite."
    ],
    paragraphsVi: [
      "Tại Đà Lạt, món bánh mì mang một phong cách thưởng thức rất riêng biệt so với Sài Gòn hay Hà Nội. Thay vì kẹp nhân mang đi, người Đà Lạt chuộng bánh mì xíu mại chén nóng hổi, ngồi nhâm nhi bên những chiếc bàn gỗ nhỏ giữa làn sương sớm.",
      "Mỗi phần ăn gồm một ổ bánh mì mới ra lò giòn rụm kèm chén nước súp xíu mại nghi ngút khói. Trong chén là hai viên xíu mại thịt nạc băm mềm ngọt, miếng da heo giòn sần sật béo ngậy, chả lụa và ngập tràn mỡ hành thơm nức.",
      "Cách ăn chuẩn điệu là xé từng miếng bánh mì giòn tan chấm ngập vào chén nước dùng cay nồng, húp một ngụm súp ngọt thanh để cảm nhận hơi ấm lan tỏa khắp cơ thể giữa sớm mai lạnh giá."
    ],
    highlightsEn: [
      "Best spots: Banh Mi Xiu Mai Hoang Dieu (26 Hoang Dieu), Co Suong (Anh Sang hamlet).",
      "Price range: 15,000 – 30,000 VND per set.",
      "Pro tip: Pair with a warm glass of fresh soy milk for the complete morning ritual."
    ],
    highlightsVi: [
      "Quán ngon gợi ý: Bánh mì xíu mại Hoàng Diệu (26 Hoàng Diệu), Bánh mì Cô Sương (Ấp Ánh Sáng).",
      "Giá cả: Chỉ từ 15.000 – 30.000 VNĐ/phần đầy đặn.",
      "Mẹo nhỏ: Gọi thêm một ly sữa đậu nành nóng ăn kèm để có bữa sáng chuẩn phong vị người bản địa."
    ]
  },
  banhCuon: {
    titleEn: "Banh Cuon & Banh Uot Dalat",
    titleVi: "Bánh Cuốn Nóng & Bánh Ướt Lòng Gà",
    badgeEn: "Local Delicacy",
    badgeVi: "Món ngon dân dã",
    img: "/guide/dalat/dalat-banh-cuon-hd.jpg",
    paragraphsEn: [
      "Freshly made steamed rice rolls in Dalat come in two distinct beloved varieties: traditional hot Banh Cuon filled with minced wood-ear mushrooms and pork, and Dalat's very own regional innovation — Banh Uot Long Ga (Steamed Rice Crepes with Shredded Chicken and Innards).",
      "The rice batter is freshly ground and steamed paper-thin on fabric stretched over boiling water. While ordinary banh uot is served with pork roll, Dalat chefs cleverly combined it with free-range hill chicken, marinated chicken gizzards and hearts, crispy golden shallots, and fragrant Vietnamese coriander.",
      "The soul of the dish lies in the dipping sauce: a light, tangy, and sweet fish sauce infused with garlic and lime that ties together the smooth rice crepes and tender, savory chicken."
    ],
    paragraphsVi: [
      "Món bánh tráng mỏng cuốn nóng ở Đà Lạt nổi tiếng với hai biến tấu làm say đắm thực khách: Bánh cuốn nóng truyền thống nhân thịt mộc nhĩ và niềm tự hào ẩm thực phố núi mang tên Bánh ướt lòng gà.",
      "Bột gạo tẻ được ngâm xay mịn, tráng trên nồi hơi nước bốc nghi ngút tạo nên từng lớp bánh mỏng mềm êm ái. Thay vì chỉ ăn với chả lụa thông thường, người Đà Lạt khéo léo kết hợp bánh ướt cùng thịt gà đồi săn chắc xé phay, lòng gà mề gà xào thơm lừng và hành phi vàng ươm.",
      "Linh hồn của món ăn nằm ở chén nước mắm chua ngọt pha khéo léo với tỏi ớt băm nhuyễn và chanh tươi, hòa quyện tuyệt vời với hương thơm nồng ấm của rau răm."
    ],
    highlightsEn: [
      "Best spots: Banh Uot Long Ga Trang (15F Tang Bat Ho), Long (Hem 202 Phan Dinh Phung).",
      "Price range: 35,000 – 50,000 VND per portion.",
      "Best time to eat: Ideal for late breakfast or afternoon snacks."
    ],
    highlightsVi: [
      "Quán ngon gợi ý: Bánh ướt lòng gà Trang (15F Tăng Bạt Hổ), Quán Long (Hẻm 202 Phan Đình Phùng).",
      "Giá cả: Khoảng 35.000 – 50.000 VNĐ/tô thập cẩm.",
      "Thời điểm thưởng thức: Thích hợp nhất cho bữa điểm tâm muộn hoặc lót dạ xế chiều."
    ]
  },
  miQuang: {
    titleEn: "Mi Quang Dalat Style",
    titleVi: "Mì Quảng Đà Lạt",
    badgeEn: "Central-Highland Fusion",
    badgeVi: "Đặc sản giao thoa",
    img: "/guide/dalat/dalat-mi-quang-hd.jpg",
    paragraphsEn: [
      "Though originating in Central Vietnam's Quang Nam province, Mi Quang in Dalat has developed a unique highland character that surprises even travelers familiar with the lowland original.",
      "Unlike the relatively dry version in Central Vietnam, Dalat's Mi Quang features a richer, soupier broth tinted a brilliant reddish-orange from cashew oil. The thick yellow turmeric noodles are accompanied by slow-simmered tender pork ribs, shrimp, and quail eggs.",
      "What truly sets Dalat's version apart is the mountain of fresh vegetables served on the side: finely shredded banana blossoms, fragrant herbs, and mountain greens grown right in the fertile soils of the surrounding valleys, topped with crunchy toasted sesame rice crackers."
    ],
    paragraphsVi: [
      "Dù có nguồn gốc từ xứ Quảng miền Trung, khi du nhập lên vùng đất cao nguyên lạnh giá, Mì Quảng Đà Lạt đã biến tấu mang một sắc thái và hương vị rất riêng làm nức lòng thực khách.",
      "Khác với mì Quảng truyền thống ăn khô ít nước, mì Quảng Đà Lạt có lượng nước lèo ngập hơn, màu đỏ cam óng ánh đẹp mắt từ dầu hạt điều. Sợi mì màu vàng nghệ dai mềm kết hợp cùng sườn heo hầm nhừ, tôm tươi và trứng cút thấm đẫm gia vị.",
      "Điểm đặc sắc nhất chính là rổ rau sống tươi non ngút ngàn ăn kèm: bắp chuối thái mỏng, xà lách giòn ngọt đặc sản Đà Lạt và rau thơm xanh tươi, rắc thêm đậu phộng rang giòn bùi và bánh tráng mè nướng rụm."
    ],
    highlightsEn: [
      "Best spots: Mi Quang Hoi An (14 Yersin), Mi Quang Ba Xi (Mac Dinh Chi Street).",
      "Price range: 35,000 – 50,000 VND per bowl.",
      "Pro tip: Mix in lime juice and fresh sliced chili for authentic bold flavor."
    ],
    highlightsVi: [
      "Quán ngon gợi ý: Mì Quảng Hội An (14 Yersin), Mì Quảng Bà Xí (đường Mạc Đĩnh Chi).",
      "Giá cả: 35.000 – 50.000 VNĐ/tô.",
      "Mẹo nhỏ: Vắt thêm lát chanh và chút ớt tươi để làm bùng nổ hương vị thơm cay đậm đà."
    ]
  }
};

export default function DalatPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("travel-guide");

  // Lightbox modal for Dalat Tourist Map
  const [mapModalOpen, setMapModalOpen] = useState(false);
  // Rich detail article modal for Stay, Food, and Dishes
  const [detailModalItem, setDetailModalItem] = useState(null);

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLang);
    return () => window.removeEventListener("vinatap:lang-updated", handleLang);
  }, []);

  const handleMenuEnter = (menuKey) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuKey);
  };

  const handleMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 140);
  };

  const handleMegaMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
  };

  return (
    <div className="vnn-dalat-page">
      {/* ─── 1. TOP PROMO BANNER ─── */}
      <div
        className="vnn-dalat-top-banner"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        title={
          lang === "vi"
            ? "TRỢ LÝ DU LỊCH AI MIỄN PHÍ • BẠN ĐỒNG HÀNH THÔNG MINH"
            : "FREE AI TRAVEL ASSISTANT • AI COMPANION"
        }
      >
        <img
          src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
          alt="FREE AI TRAVEL ASSISTANT AI-COMPANION"
        />
      </div>

      {/* ─── 2. EDITORIAL NAVBAR WITH MEGAMENUS ─── */}
      <header className="vnn-dalat-header" onMouseLeave={handleMenuLeave}>
        <div className="vnn-dalat-nav-inner">
          <Link href="/" className="vnn-dalat-logo-wrap">
            <Logo size={32} showText={false} noLink href={null} as="span" />
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                color: "#111",
              }}
            >
              VinaTap
            </span>
          </Link>

          <ul className="vnn-dalat-nav-menu">
            {/* BE INSPIRED */}
            <li
              className="vnn-dalat-nav-item"
              onMouseEnter={() => handleMenuEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-dalat-nav-link ${activeMegaMenu === "inspired" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* DESTINATIONS */}
            <li
              className="vnn-dalat-nav-item"
              onMouseEnter={() => handleMenuEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-dalat-nav-link ${activeMegaMenu === "destinations" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-dalat-nav-item"
              onMouseEnter={() => handleMenuEnter("things")}
            >
              <button
                type="button"
                className={`vnn-dalat-nav-link ${activeMegaMenu === "things" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-dalat-nav-item"
              onMouseEnter={() => handleMenuEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-dalat-nav-link ${activeMegaMenu === "eat" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-dalat-nav-item"
              onMouseEnter={() => handleMenuEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-dalat-nav-link ${activeMegaMenu === "itineraries" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} />
              </button>
            </li>
          </ul>

          <div className="vnn-dalat-nav-actions">
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* HOVER MEGAMENU CONTAINER */}
        {activeMegaMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="vnn-megamenu__grid">
              {(MEGA_MENUS_DATA[activeMegaMenu]?.items || []).map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="vnn-megamenu__card"
                  onClick={() => setActiveMegaMenu(null)}
                >
                  <div className="vnn-megamenu__thumb">
                    <img
                      src={item.img}
                      alt={
                        lang === "vi" && item.titleVi
                          ? item.titleVi
                          : item.title
                      }
                      className="vnn-megamenu__img"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="vnn-megamenu__badge">
                        {formatBadge(item.badge, lang)}
                      </span>
                    )}
                  </div>
                  <h4 className="vnn-megamenu__title">
                    {lang === "vi" && item.titleVi ? item.titleVi : item.title}
                  </h4>
                  <p className="vnn-megamenu__date">
                    {lang === "vi" && item.dateVi ? item.dateVi : item.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION (SCREENSHOT 1) ─── */}
      <section className="vnn-dalat-hero">
        <img
          src="/guide/dalat/dalat-hero-hd.jpg"
          alt="Dalat Travel Guide Cathedral View"
          className="vnn-dalat-hero-bg"
        />
        <div className="vnn-dalat-hero-overlay" />
        <div className="vnn-dalat-hero-content">
          <div className="vnn-dalat-hero-badges">
            <Link href="/#top-destinations" className="vnn-dalat-pill-tag">
              DESTINATIONS
            </Link>
            <Link href="/#regional-destinations" className="vnn-dalat-pill-tag">
              CENTRAL VIETNAM
            </Link>
            <span className="vnn-dalat-pill-tag">TOP DESTINATIONS</span>
          </div>

          <h1 className="vnn-dalat-hero-title">
            {lang === "vi" ? "Đà Lạt" : "Dalat"}
          </h1>

          <div className="vnn-dalat-hero-meta">
            <span className="author">By VinaTap</span>
            <span>•</span>
            <span className="date">September 25, 2026</span>
          </div>
        </div>
      </section>

      {/* ─── 4. QUICK NAVIGATION PILLS BAR (SCREENSHOT 1 & 2) ─── */}
      <div className="vnn-dalat-quicknav-wrap">
        <div className="vnn-dalat-quicknav-bar">
          <a
            href="#travel-guide"
            className={`vnn-dalat-quick-btn ${activeTab === "travel-guide" ? "active" : ""}`}
            onClick={() => setActiveTab("travel-guide")}
          >
            <MapPin size={15} />
            <span>{lang === "vi" ? "Cẩm nang du lịch" : "Travel guide"}</span>
          </a>
          <a
            href="#attractions"
            className={`vnn-dalat-quick-btn ${activeTab === "attractions" ? "active" : ""}`}
            onClick={() => setActiveTab("attractions")}
          >
            <Compass size={15} />
            <span>{lang === "vi" ? "Điểm tham quan" : "Attractions"}</span>
          </a>
          <a
            href="#accommodation"
            className={`vnn-dalat-quick-btn ${activeTab === "accommodation" ? "active" : ""}`}
            onClick={() => setActiveTab("accommodation")}
          >
            <Hotel size={15} />
            <span>{lang === "vi" ? "Lưu trú" : "Accommodation"}</span>
          </a>
          <a
            href="#food"
            className={`vnn-dalat-quick-btn ${activeTab === "food" ? "active" : ""}`}
            onClick={() => setActiveTab("food")}
          >
            <Utensils size={15} />
            <span>{lang === "vi" ? "Ẩm thực" : "Food"}</span>
          </a>
        </div>
      </div>

      <main className="vnn-dalat-container">
        {/* ─── 5. TRAVEL GUIDE SECTION (SCREENSHOT 2 & 3) ─── */}
        <section id="travel-guide" className="vnn-dalat-section">
          <div className="vnn-dalat-section-header">
            <h2 className="vnn-dalat-section-title">
              {lang === "vi" ? "Cẩm nang du lịch Đà Lạt" : "Dalat travel guide"}
            </h2>
          </div>
          <div className="vnn-dalat-divider" />

          {/* Full paragraphs matching user request */}
          <div className="vnn-dalat-intro-text">
            <p>
              {lang === "vi"
                ? "Đà Lạt thường được trìu mến gọi là Thành phố Ngàn hoa, Thành phố Tình yêu hay Xứ sở Mộng mơ. Từ \"Đà\" trong tiếng bản địa chỉ nguồn nước nơi cộng đồng sinh sống, còn \"Lạt\" (hay Lạch) là tên bộ tộc người Lạch cư ngụ trên cao nguyên Lâm Viên. Đà Lạt có nghĩa là \"con suối của người Lạch\". Tọa lạc trên cao nguyên Lâm Viên (tỉnh Lâm Đồng) ở độ cao 1.500 mét so với mực nước biển, Đà Lạt sở hữu phong cảnh thơ mộng hữu tình và khí hậu mát lành quanh năm, trở thành điểm đến nghỉ dưỡng hàng đầu phương Nam."
                : "Dalat is affectionately referred to as the City of Thousands of Flowers, the City of Love, or the City of Romance. Da refers to the water bodies that the community was built around and Lat (or Lach) is the name of a tribe settled on Lam Vien Highlands. Dalat means the stream of the Lat people. Located on Lam Vien Highlands (Lam Dong Province) at an altitude of 1,500 meters above sea level, Dalat boasts poetic landscapes and pleasant weather, making it a top holiday destination in the South."}
            </p>
            <p>
              {lang === "vi"
                ? "Sự hình thành của Đà Lạt gắn liền với những chuyến thám hiểm của người Pháp. Dưới lệnh của Toàn quyền Paul Doumer vào cuối thế kỷ 19, một đoàn thám hiểm do Bác sĩ Alexandre Yersin dẫn đầu đã tiến vào vùng Cao nguyên Trung phần Việt Nam, ngược dòng các con sông để khám phá vùng đất hoang sơ. Họ ngay lập tức bị mê hoặc bởi những cánh rừng thông xanh ngắt bạt ngàn và bầu không khí trong lành, gợi nhớ đến quê hương nước Pháp. Điều này thôi thúc họ chọn nơi đây làm khu nghỉ dưỡng, phục hồi sức khỏe cho các sĩ quan và binh lính. Vài năm sau, khi quay trở lại, họ phát hiện ra một cao nguyên rộng lớn trên đỉnh Lâm Viên vô cùng thích hợp cho việc định cư lâu dài, và từ đó, Đà Lạt chính thức được thành lập. Đóng góp to lớn của người Pháp, đặc biệt là Bác sĩ Alexandre Yersin – người vẫn được người dân Việt Nam tôn kính cho đến ngày nay – giải thích cho nét quyến rũ mang đậm kiến trúc và phong cách sống Pháp hiện diện trong từng hơi thở của Đà Lạt."
                : "The establishment of Dalat is largely attributed to French exploration. Under the order of Governor-General Paul Doumer in the late nineteenth century, an expedition led by Doctor Alexandre Yersin ventured into the Central Highlands of Vietnam, traveling against the river courses to explore the uninhabited land. They were immediately captivated by the vast green pine forests and the climate, which reminded them of their homeland, France. This led them to choose the area as a campsite for military leaders and soldiers to rest and recover. However, when the group returned a few years later, they discovered a plateau atop the Lam Vien Highlands that was even more suitable for a residential settlement, and thus, Dalat was founded. The significant contribution of the French, particularly Doctor Alexandre Yersin – who is still revered by the Vietnamese today – explains the charming French influence evident in the lifestyle, architecture, and nearly everything in Dalat."}
            </p>
          </div>

          {/* YouTube Video Player Embed / Card */}
          <div className="vnn-dalat-video-container">
            {isVideoPlaying ? (
              <iframe
                src="https://www.youtube.com/embed/wW6qIb0nCiE?autoplay=1&rel=0"
                title="Da Lat: A Guide to Visiting Vietnam's Little Paris"
                className="vnn-dalat-video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="vnn-dalat-video-poster"
                onClick={() => setIsVideoPlaying(true)}
              >
                <img
                  src="/guide/dalat/dalat-hero-hd.jpg"
                  alt="Dalat Travel Guide Video Cover"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "24px",
                  }}
                >
                  <div style={{ color: "#fff", textAlign: "left" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/logo.png"
                        alt="VinaTap"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#fff",
                          padding: "2px",
                          objectFit: "contain",
                        }}
                      />
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Da Lat: A Guide to Visiting Vietnam&apos;s Little Paris
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            opacity: 0.85,
                          }}
                        >
                          VinaTap
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontSize: "30px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                    }}
                  >
                    DA LAT
                    <br />
                    <span style={{ fontSize: "18px", color: "#ffd200" }}>
                      TRAVEL GUIDE
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                  >
                    <span>Xem trên YouTube</span>
                    <span style={{ opacity: 0.8 }}>12:45</span>
                  </div>
                </div>

                <div className="vnn-dalat-video-play-btn">
                  <Play size={24} fill="#fff" />
                </div>
              </div>
            )}
          </div>

          {/* Expand Accordion Button */}
          <div className="vnn-dalat-expand-wrap">
            <button
              className="vnn-dalat-expand-btn"
              onClick={() => setIsGuideExpanded(!isGuideExpanded)}
            >
              <span>
                {isGuideExpanded
                  ? lang === "vi"
                    ? "Thu gọn cẩm nang du lịch ▲"
                    : "Collapse Dalat travel guide ▲"
                  : lang === "vi"
                    ? "Đọc thêm cẩm nang du lịch Đà Lạt ▾"
                    : "Read more Dalat travel guide ▾"}
              </span>
            </button>
          </div>

          {/* Expanded Guide Content */}
          {isGuideExpanded && (
            <div className="vnn-dalat-accordion-body">
              <div className="vnn-dalat-guide-subblock">
                <h3>
                  {lang === "vi" ? "Khí hậu & 4 Mùa ở Đà Lạt" : "Dalat Weather"}
                </h3>
                <p>
                  {lang === "vi"
                    ? "Với độ cao 1.500m, Đà Lạt sở hữu khí hậu ôn đới quanh năm với nhiệt độ hiếm khi vượt quá 25°C. Thành phố có 4 mùa hoa rực rỡ:"
                    : "At an altitude of 1,500m, Dalat enjoys a temperate climate year-round with temperatures rarely exceeding 25°C:"}
                </p>
                <ul>
                  <li>
                    <strong>
                      {lang === "vi" ? "Mùa xuân (Tháng 1 – 3):" : "Spring (January – March):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Mùa hoa mai anh đào nở rộ nhuộm hồng khắp các triền đồi, thời tiết khô ráo, se lạnh vào ban sáng."
                      : "Cherry blossoms bloom across pine hills; crisp cool mornings with vibrant flower festivals."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi" ? "Mùa hè (Tháng 4 – 9):" : "Summer (April – September):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Mùa mưa với những cơn mưa rào bất chợt làm tươi tốt những đồi chè Cầu Đất và vườn cẩm tú cầu bát ngát."
                      : "Fresh afternoon rains nourish the lush pine forests, tea plantations, and hydrangea valleys."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi" ? "Mùa thu (Tháng 10 – 11):" : "Autumn (October – November):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Mùa hoa dã quỳ vàng rực trải dài các cung đường đèo, mây trắng bồng bềnh phủ kín thung lũng sáng sớm."
                      : "Golden wild sunflowers carpet the mountain passes and white mist blankets valleys."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi" ? "Mùa đông (Tháng 12):" : "Winter (December):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Mùa lễ hội hoa Đà Lạt và mùa cỏ hồng lãng mạn bên hồ Đan Kia - Suối Vàng, nhiệt độ xuống thấp từ 10-14°C."
                      : "Pink grass covers hill slopes; Festive Flower Biennale with temperatures dipping to 10°C."}
                  </li>
                </ul>
              </div>

              <div className="vnn-dalat-guide-subblock">
                <h3>
                  {lang === "vi" ? "Phương tiện di chuyển đến & tại Đà Lạt" : "Transportation in Dalat"}
                </h3>
                <ul>
                  <li>
                    <strong>
                      {lang === "vi" ? "Đường hàng không:" : "By Air (Lien Khuong Airport):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Sân bay Liên Khương cách trung tâm 30km, có xe buýt sân bay (40.000 VNĐ) hoặc taxi trọn gói (~250.000 - 300.000 VNĐ)."
                      : "Lien Khuong Airport (30 km away) offers shuttle buses (40,000 VND) and airport taxis (~250,000 VND)."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi" ? "Xe khách giường nằm chất lượng cao:" : "Intercity Sleeper Bus:"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Các hãng xe Thành Bưởi và Phương Trang (Futa) phục vụ các chuyến Limousine và phòng nằm VIP chạy xuyên đêm từ TP.HCM, Nha Trang, Đà Nẵng."
                      : "Thanh Buoi and Phuong Trang (Futa) operate comfortable VIP sleeper limousines overnight from Saigon and Nha Trang."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi" ? "Xe máy & Xe buýt điện:" : "Motorbikes & Electric Buses:"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Thuê xe máy chỉ từ 100.000 - 150.000 VNĐ/ngày là cách tuyệt nhất để tự do khám phá các triền đồi. Ngoài ra xe buýt điện 5 tuyến đưa đón quanh hồ Xuân Hương và Thung Lũng Tình Yêu."
                      : "Motorbike rentals start from 100,000 VND/day. 5 electric hop-on-hop-off routes tour around Xuan Huong Lake and local sights."}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ─── 6. TOP ATTRACTIONS MOSAIC GRID (SCREENSHOT 3 & 4) ─── */}
        <section id="attractions" className="vnn-dalat-section">
          <div className="vnn-dalat-section-header">
            <h2 className="vnn-dalat-section-title">
              {lang === "vi" ? "Điểm tham quan tại Đà Lạt" : "Top attractions in Dalat"}
            </h2>
            <Link href="/guide/15-best-places-to-visit-in-vietnam-in-2026" className="vnn-dalat-view-all">
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </Link>
          </div>
          <div className="vnn-dalat-divider" />

          <div className="vnn-dalat-attractions-grid">
            {/* Card 1: Map (Large Left - 2 Rows) */}
            <div
              className="vnn-dalat-attraction-card large"
              onClick={() => setMapModalOpen(true)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              title="Click to view full HD Dalat map"
            >
              <img
                src="/guide/dalat/dalat-tourist-map-hd.jpg"
                alt="Dalat Tourist Map"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Bản đồ du lịch Đà Lạt" : "Dalat Tourist Map"}
                </h3>
              </div>
            </div>

            {/* Card 2: The 15 best attractions in Dalat (Middle Top) */}
            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="vnn-dalat-attraction-card"
            >
              <img
                src="/guide/dalat/dalat-15-attractions-hd.jpg"
                alt="The 15 best attractions in Dalat"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi"
                    ? "15 điểm tham quan đẹp nhất Đà Lạt"
                    : "The 15 best attractions in Dalat"}
                </h3>
              </div>
            </Link>

            {/* Card 3: Elephant Falls Dalat (Right Top) */}
            <Link
              href="/guide/20-best-things-to-do-in-vietnam"
              className="vnn-dalat-attraction-card"
            >
              <img
                src="/guide/dalat/dalat-elephant-falls-hd.jpg"
                alt="Elephant Falls Dalat"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Thác Voi Đà Lạt" : "Elephant Falls Dalat"}
                </h3>
              </div>
            </Link>

            {/* Card 4: Datanla Waterfall Dalat (Middle Bottom) */}
            <Link
              href="/guide/20-best-things-to-do-in-vietnam"
              className="vnn-dalat-attraction-card"
            >
              <img
                src="/guide/dalat/dalat-datanla-falls-hd.jpg"
                alt="Datanla Waterfall Dalat"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Thác Datanla Đà Lạt" : "Datanla Waterfall Dalat"}
                </h3>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 7. WHERE TO STAY IN DALAT (SCREENSHOT 1) ─── */}
        <section id="accommodation" className="vnn-dalat-section">
          <div className="vnn-dalat-section-header">
            <h2 className="vnn-dalat-section-title">
              {lang === "vi" ? "Nơi lưu trú ở Đà Lạt" : "Where to stay in Dalat"}
            </h2>
            <button
              type="button"
              onClick={() => setDetailModalItem(DALAT_DETAILS.stay)}
              className="vnn-dalat-view-all"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="vnn-dalat-divider" />

          <div className="vnn-dalat-stay-grid">
            <div
              className="vnn-dalat-stay-card"
              onClick={() => setDetailModalItem(DALAT_DETAILS.stay)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Nơi lưu trú ở Đà Lạt" : "View Where to stay in Dalat"}
            >
              <img
                src="/guide/dalat/dalat-stay-hd.jpg"
                alt="Stay in Dalat"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Nghỉ dưỡng tại Đà Lạt" : "Stay in Dalat"}
                </h3>
              </div>
            </div>
            <div className="vnn-dalat-stay-placeholder" />
            <div className="vnn-dalat-stay-placeholder" />
          </div>
        </section>

        {/* ─── 8. MUST-TRY DISHES IN DALAT (SCREENSHOT 2) ─── */}
        <section id="food" className="vnn-dalat-section">
          <div className="vnn-dalat-section-header">
            <h2 className="vnn-dalat-section-title">
              {lang === "vi" ? "Món ngon phải thử ở Đà Lạt" : "Must-try dishes in Dalat"}
            </h2>
            <button
              type="button"
              onClick={() => setDetailModalItem(DALAT_DETAILS.foods)}
              className="vnn-dalat-view-all"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="vnn-dalat-divider" />

          <div className="vnn-dalat-dishes-grid">
            {/* Card 1: 8 Must-try foods in Dalat (Large Left - 3 Rows) */}
            <div
              className="vnn-dalat-dish-card large"
              onClick={() => setDetailModalItem(DALAT_DETAILS.foods)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem 8 món ăn phải thử tại Đà Lạt" : "View 8 must-try foods in Dalat"}
            >
              <img
                src="/guide/dalat/dalat-8-foods-hd.jpg"
                alt="8 must-try foods in Dalat"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "8 món ăn phải thử tại Đà Lạt" : "8 must-try foods in Dalat"}
                </h3>
              </div>
            </div>

            {/* Card 2: Banh Mi (Right Top) */}
            <div
              className="vnn-dalat-dish-card"
              onClick={() => setDetailModalItem(DALAT_DETAILS.banhMi)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Bánh Mì Xíu Mại Đà Lạt" : "View Banh Mi Dalat"}
            >
              <img
                src="/guide/dalat/dalat-banh-mi-hd.jpg"
                alt="Banh Mi"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Bánh Mì" : "Banh Mi"}
                </h3>
              </div>
            </div>

            {/* Card 3: Banh Cuon (Right Middle) */}
            <div
              className="vnn-dalat-dish-card"
              onClick={() => setDetailModalItem(DALAT_DETAILS.banhCuon)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Bánh Cuốn / Bánh Ướt Lòng Gà" : "View Banh Cuon & Banh Uot"}
            >
              <img
                src="/guide/dalat/dalat-banh-cuon-hd.jpg"
                alt="Banh Cuon"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Bánh Cuốn" : "Banh Cuon"}
                </h3>
              </div>
            </div>

            {/* Card 4: Mi Quang (Right Bottom) */}
            <div
              className="vnn-dalat-dish-card"
              onClick={() => setDetailModalItem(DALAT_DETAILS.miQuang)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Mì Quảng Đà Lạt" : "View Mi Quang Dalat"}
            >
              <img
                src="/guide/dalat/dalat-mi-quang-hd.jpg"
                alt="Mi Quang"
                className="vnn-dalat-card-img"
              />
              <div className="vnn-dalat-card-overlay">
                <h3 className="vnn-dalat-card-title">
                  {lang === "vi" ? "Mì Quảng" : "Mi Quang"}
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 9. TAGS SECTION (SCREENSHOT 2) ─── */}
        <div className="vnn-dalat-tags-section">
          <span className="vnn-dalat-tag-label">TAGS</span>
          <Link href="/#top-destinations" className="vnn-dalat-tag-pill">
            Destinations
          </Link>
        </div>

        <div className="vnn-dalat-divider" style={{ margin: "32px 0 44px 0" }} />

        {/* ─── 10. OTHER DESTINATIONS SECTION (SCREENSHOT 3) ─── */}
        <section className="vnn-dalat-section">
          <h3 className="vnn-dalat-other-dest-title">
            {lang === "vi" ? "Các Điểm Đến Khác" : "Other Destinations"}
          </h3>

          <div className="vnn-dalat-related-grid">
            {/* Card 1: Ho Chi Minh City */}
            <Link
              href="/province/ho-chi-minh"
              className="vnn-dalat-related-card"
            >
              <div className="vnn-dalat-related-img-wrap">
                <img
                  src="/guide/dalat/dalat-related-hcmc.jpg"
                  alt="Ho Chi Minh City"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-dalat-related-title">
                {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
              </h4>
            </Link>

            {/* Card 2: Nha Trang */}
            <Link
              href="/province/khanh-hoa"
              className="vnn-dalat-related-card"
            >
              <div className="vnn-dalat-related-img-wrap">
                <img
                  src="/guide/dalat/dalat-related-nhatrang.jpg"
                  alt="Nha Trang"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-dalat-related-title">
                {lang === "vi" ? "Nha Trang" : "Nha Trang"}
              </h4>
            </Link>

            {/* Card 3: Hoi An */}
            <Link
              href="/province/hoi-an"
              className="vnn-dalat-related-card"
            >
              <div className="vnn-dalat-related-img-wrap">
                <img
                  src="/guide/dalat/dalat-related-hoian.jpg"
                  alt="Hoi An"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-dalat-related-title">
                {lang === "vi" ? "Hội An" : "Hoi An"}
              </h4>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── 11. FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "40px" }}>
        <div className="home-footer__bottom">
          <p>
            {lang === "vi"
              ? "© 2026 VinaTap. Tất cả quyền được bảo lưu. Cẩm nang du lịch 34 tỉnh thành Việt Nam."
              : "© 2026 VinaTap. All rights reserved. Travel guide to 34 provinces of Vietnam."}
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </footer>

      {/* ─── 12. AI CHATBOT MODAL & FLOATING FAB ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        province={{
          name: lang === "vi" ? "Đà Lạt" : "Dalat",
          slug: "dalat",
        }}
      />

      {/* ─── DALAT TOURIST MAP LIGHTBOX MODAL ─── */}
      {mapModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setMapModalOpen(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "1000px",
              width: "100%",
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                {lang === "vi"
                  ? "Bản đồ Du lịch Đà Lạt (Độ nét cao)"
                  : "Dalat Tourist Map (High Resolution)"}
              </h3>
              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  display: "flex",
                  padding: "4px",
                }}
              >
                <X size={22} />
              </button>
            </div>
            <div
              style={{
                overflow: "auto",
                maxHeight: "calc(90vh - 70px)",
                textAlign: "center",
                background: "#f9f9f9",
                padding: "10px",
              }}
            >
              <img
                src="/guide/dalat/dalat-tourist-map-hd.jpg"
                alt="Dalat Tourist Map Full HD"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "inline-block",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── DETAIL ARTICLE MODAL (HIỂN THỊ ĐẦY ĐỦ ĐOẠN TEXT) ─── */}
      {detailModalItem && (
        <div
          className="vnn-dalat-detail-backdrop"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="vnn-dalat-detail-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vnn-dalat-detail-close"
              onClick={() => setDetailModalItem(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="vnn-dalat-detail-hero">
              <img
                src={detailModalItem.img}
                alt={lang === "vi" ? detailModalItem.titleVi : detailModalItem.titleEn}
              />
              <div className="vnn-dalat-detail-hero-gradient" />
              <h2 className="vnn-dalat-detail-hero-title">
                {lang === "vi" ? detailModalItem.titleVi : detailModalItem.titleEn}
              </h2>
            </div>

            <div className="vnn-dalat-detail-content">
              <span className="vnn-dalat-detail-badge">
                {lang === "vi" ? detailModalItem.badgeVi : detailModalItem.badgeEn}
              </span>

              <div className="vnn-dalat-detail-paragraphs">
                {(lang === "vi"
                  ? detailModalItem.paragraphsVi
                  : detailModalItem.paragraphsEn
                ).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {((lang === "vi" && detailModalItem.highlightsVi) ||
                detailModalItem.highlightsEn) && (
                <div className="vnn-dalat-detail-highlights">
                  <h5>
                    {lang === "vi"
                      ? "Điểm nổi bật & Địa chỉ gợi ý"
                      : "Key Highlights & Recommended Spots"}
                  </h5>
                  <ul>
                    {(lang === "vi"
                      ? detailModalItem.highlightsVi
                      : detailModalItem.highlightsEn
                    ).map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
