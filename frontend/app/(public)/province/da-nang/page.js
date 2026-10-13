"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { getLang } from "@/lib/prefs";
import HeaderSearch from "@/components/ui/HeaderSearch";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Calendar,
  Eye,
  ArrowRight,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  Bike,
  Hotel,
  Utensils,
} from "lucide-react";
import "@/styles/destination-danang.css";

// ─── MEGA MENUS DATA (UNIFIED ACROSS DESTINATIONS) ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
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
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "January 9, 2026",
        dateVi: "9 Tháng 1, 2026",
        badge: "Featured Articles",
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
        img: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
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
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "thing-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "thing-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
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
        link: "/guide/the-15-best-attractions-in-dalat",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon phải thử ở Hà Nội",
        date: "October 2, 2026",
        dateVi: "2 Tháng 10, 2026",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon nhất định phải thử tại Sài Gòn",
        date: "September 24, 2026",
        dateVi: "24 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Complete Guide to Vietnamese Noodle Soup",
        titleVi: "Phở – Cẩm nang trọn vẹn về món quốc hồn quốc túy",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon không thể bỏ qua ở Vũng Tàu",
        date: "September 30, 2026",
        dateVi: "30 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang thơm ngon",
        date: "September 8, 2026",
        dateVi: "8 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-5-nhatrang.jpg",
        link: "/guide/5-must-try-nha-trang-dishes",
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
        titleVi: "10 ngày khám phá Việt Nam",
        date: "September 16, 2026",
        dateVi: "16 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "2 tuần du lịch Việt Nam",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "1 tháng trọn vẹn tại Việt Nam",
        date: "September 14, 2026",
        dateVi: "14 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

const getBadgeLabel = (badge, isVi) => {
  if (!badge) return "";
  if (!isVi) return badge;
  const b = badge.toLowerCase();
  if (b.includes("trending")) return "#Xu hướng";
  if (b.includes("destination")) return "Điểm đến";
  if (b.includes("itinerary")) return "Lịch trình";
  if (b.includes("article")) return "Bài viết";
  return badge;
};

// ─── DA NANG RICH DETAILS MODAL DATA ───
const DANANG_DETAILS = {
  // Attractions (Screenshot 3)
  "danang-10-best-attractions": {
    titleEn: "The 10 best attractions in Da Nang",
    titleVi: "10 điểm tham quan đẹp nhất Đà Nẵng",
    badgeEn: "Top Attractions",
    badgeVi: "Điểm đến hàng đầu",
    img: "/guide/danang/danang-10-best-attractions-hd.jpg",
    paragraphsEn: [
      "Da Nang is the most famous coastal city in Vietnam as it is endowed with stunning natural assets and has invested in modern infrastructures.",
      "From the golden sands of My Khe Beach — voted one of the best beaches on the planet by Forbes — to the majestic Marble Mountains and the world-renowned Golden Bridge at Sun World Ba Na Hills, Da Nang offers an unforgettable mix of nature and human creativity.",
      "Other must-visit spots include the Son Tra Peninsula with Lady Buddha statue, the vibrant Dragon Bridge breathing fire on weekends, Museum of Cham Sculpture, and romantic Han River bridges.",
    ],
    paragraphsVi: [
      "Đà Nẵng là thành phố biển đáng sống nhất Việt Nam nhờ sở hữu thiên nhiên trù phú cùng hệ thống hạ tầng du lịch hiện đại bậc nhất.",
      "Từ bãi biển Mỹ Khê cát trắng mịn từng được tạp chí Forbes vinh danh là một trong những bãi biển quyến rũ nhất hành tinh, đến danh thắng Ngũ Hành Sơn huyền bí và Cầu Vàng nổi tiếng toàn cầu tại Sun World Bà Nà Hills.",
      "Những điểm đến không thể bỏ qua khác bao gồm bán đảo Sơn Trà với tượng Phật Bà uy nghiêm, Cầu Rồng phun lửa phun nước sống động vào dịp cuối tuần, Bảo tàng Điêu khắc Chăm và các cây cầu lung linh trên sông Hàn.",
    ],
    highlightsEn: [
      "Golden Bridge at Ba Na Hills (Cau Vang)",
      "My Khe Beach (Forbes top-rated beach)",
      "Marble Mountains (Ngu Hanh Son)",
      "Linh Ung Pagoda on Son Tra Peninsula",
      "Dragon Bridge fire & water breathing show",
    ],
    highlightsVi: [
      "Cầu Vàng Bà Nà Hills (Biểu tượng kiến trúc thế giới)",
      "Bãi biển Mỹ Khê (Bãi biển đẹp hàng đầu hành tinh)",
      "Quần thể danh thắng Ngũ Hành Sơn",
      "Chùa Linh Ứng Bãi Bụt trên bán đảo Sơn Trà",
      "Màn trình diễn Cầu Rồng phun lửa & phun nước",
    ],
  },

  "danang-son-tra-peninsula": {
    titleEn: "Son Tra Peninsula",
    titleVi: "Bán đảo Sơn Trà",
    badgeEn: "Nature & Wildlife",
    badgeVi: "Thiên nhiên hoang sơ",
    img: "/guide/danang/danang-son-tra-peninsula-hd.jpg",
    paragraphsEn: [
      "Son Tra Peninsula is a gift of nature bestowed on the city of Da Nang. Its pristine and charming beauty combines majestic mountains and crystal clear-water beaches, is always a hidden gem just waiting for you to discover!",
      "Rising 693 meters above sea level, Son Tra acts as a giant natural shield protecting Da Nang from oceanic storms. It is home to hundreds of rare animal and plant species, notably the endangered Red-shanked Douc Langur ('Queen of Primates').",
      "Highlights include Linh Ung Pagoda with the tallest Lady Buddha statue in Vietnam (67m), Ban Co Peak (Chessboard Peak) offering panoramic vistas of the entire city and bay, and scenic snorkeling beaches like Bai But and Bai Rang.",
    ],
    paragraphsVi: [
      "Bán đảo Sơn Trà là viên ngọc quý thiên nhiên ban tặng cho thành phố Đà Nẵng, nơi giao thoa tuyệt mỹ giữa núi rừng nguyên sinh và biển cả bao la.",
      "Với độ cao gần 700m so với mực nước biển, Sơn Trà như một bức bình phong khổng lồ che chở cho Đà Nẵng trước sóng gió đại dương. Nơi đây là vương quốc của loài Voọc chà vá chân nâu – 'Nữ hoàng linh trưởng' quý hiếm.",
      "Các điểm tham quan nổi bật bao gồm Chùa Linh Ứng với tượng Phật Bà Quán Thế Âm cao 67m hướng ra biển, Đỉnh Bàn Cờ ngắm toàn cảnh vịnh Đà Nẵng, Cây đa ngàn năm tuổi và các bãi lặn san hô nguyên sơ như Bãi Bụt, Bãi Rạng.",
    ],
    highlightsEn: [
      "Linh Ung Pagoda with 67m Lady Buddha Statue",
      "Ban Co Peak (Chessboard Peak) - Panoramic Viewpoint",
      "Habitat of Red-shanked Douc Langurs",
      "Pristine Beaches: Bai But, Bai Rang, Bai Bac",
    ],
    highlightsVi: [
      "Chùa Linh Ứng Sơn Trà và tượng Phật Bà cao 67m",
      "Đỉnh Bàn Cờ tiên cảnh nhìn bao quát Đà Nẵng",
      "Khu bảo tồn Voọc chà vá chân nâu quý hiếm",
      "Các bãi biển lặn ngắm san hô Bãi Bụt, Bãi Rạng",
    ],
  },

  "danang-ba-na-hills": {
    titleEn: "Ba Na Hills",
    titleVi: "Bà Nà Hills – Đường lên tiên cảnh",
    badgeEn: "Theme Park & Resort",
    badgeVi: "Khu du lịch sinh thái",
    img: "/guide/danang/danang-ba-na-hills-hd.jpg",
    paragraphsEn: [
      "Ba Na Hills is located in Hoa Ninh Commune, Hoa Vang District, about 25km from the center of Da Nang. It was built on the top of Nui Chua (Lord Mountain) with an altitude of 1,489 meters above sea level.",
      "Established originally as a French colonial hill station in 1919, Ba Na Hills today is a premier resort theme park operated by Sun World, featuring world-record cable car systems, the iconic French Village, Fantasy Park indoor amusement complex, and exquisite wine cellars.",
      "The iconic Golden Bridge (Cau Vang), held aloft by giant stone hands emerging from the cliffside into misty clouds, has captured global acclaim as one of the world's most spectacular architectural wonders.",
    ],
    paragraphsVi: [
      "Sun World Bà Nà Hills nằm cách trung tâm thành phố Đà Nẵng khoảng 25km, toạ lạc trên đỉnh núi Chúa ở độ cao 1.489m so với mực nước biển.",
      "Được người Pháp khai phá làm khu nghỉ dưỡng từ năm 1919, Bà Nà Hills ngày nay là tổ hợp du lịch nghỉ dưỡng hàng đầu thế giới với hệ thống cáp treo đạt nhiều kỷ lục Guinness, Làng Pháp cổ kính mang phong cách Gothic, hầm rượu cổ Debay và công viên giải trí Fantasy Park.",
      "Đặc biệt, Cầu Vàng (Golden Bridge) với hai bàn tay đá khổng lồ vươn ra giữa mây ngàn đã trở thành biểu tượng du lịch quốc tế, thu hút hàng triệu du khách trong và ngoài nước.",
    ],
    highlightsEn: [
      "World-Famous Golden Bridge (Cau Vang)",
      "Guinness Record Cable Car Experience",
      "Gothic French Village Architecture",
      "Fantasy Park & Alpine Coaster Thrill Rides",
    ],
    highlightsVi: [
      "Cầu Vàng nâng đỡ bởi đôi bàn tay khổng lồ",
      "Hệ thống cáp treo đạt kỷ lục Guinness",
      "Làng Pháp mang kiến trúc châu Âu cổ điển",
      "Khu vui chơi Fantasy Park và tàu lượn Alpine Coaster",
    ],
  },

  "danang-dragon-bridge": {
    titleEn: "Dragon Bridge",
    titleVi: "Cầu Rồng Đà Nẵng",
    badgeEn: "City Landmark",
    badgeVi: "Biểu tượng thành phố",
    img: "/guide/danang/danang-dragon-bridge-hd.jpg",
    paragraphsEn: [
      "Dragon Bridge is one of the three famous bridges in Da Nang along with Han River Bridge and Thuan Phuoc Bridge. Designed in the shape of a magnificent golden dragon soaring over the Han River, it commemorates the liberation of Da Nang.",
      "Spanning 666 meters with six traffic lanes, the steel dragon bridge was officially opened on March 29, 2013. The architecture represents the flourishing spirit and dynamic ambitions of Da Nang as Vietnam's modern maritime hub.",
      "Every Saturday and Sunday night at 9:00 PM, as well as during major national holidays, the dragon captivates thousands of spectators by breathing real fire and spraying water against dazzling LED light animations.",
    ],
    paragraphsVi: [
      "Cầu Rồng bắc qua sông Hàn thơ mộng là một trong những biểu tượng kiến trúc đáng tự hào nhất của Đà Nẵng, mô phỏng hình tượng con rồng thời Lý mạnh mẽ vươn mình ra biển lớn.",
      "Cây cầu dài 666m với 6 làn xe cơ giới, khánh thành vào ngày 29/3/2013 nhân dịp kỷ niệm 38 năm giải phóng thành phố Đà Nẵng. Toàn bộ thân rồng được lắp đặt hàng vạn bóng đèn LED biến đổi màu sắc ngoạn mục vào ban đêm.",
      "Đặc biệt, vào lúc 21:00 các tối Thứ Bảy và Chủ Nhật hằng tuần, Cầu Rồng sẽ trình diễn phun lửa và phun nước rực rỡ, thu hút đông đảo người dân và du khách tập trung hai bên bờ sông chiêm ngưỡng.",
    ],
    highlightsEn: [
      "Iconic 666m Dragon Structure Spanning Han River",
      "Fire & Water Breathing Show (Sat & Sun at 9 PM)",
      "Spectacular Dynamic LED Night Illumination",
      "Vibrant Riverfront Promenade & Love Lock Bridge Nearby",
    ],
    highlightsVi: [
      "Thân rồng thép dài 666m độc đáo uốn lượn qua sông Hàn",
      "Trình diễn phun lửa và phun nước (21:00 Thứ 7 & Chủ Nhật)",
      "Hệ thống đèn LED đổi màu lung linh về đêm",
      "Tản bộ ngắm sông Hàn và check-in Cầu Tình Yêu bên bờ",
    ],
  },

  "danang-hai-van-pass": {
    titleEn: "Hai Van Pass",
    titleVi: "Đèo Hải Vân – Thiên hạ đệ nhất hùng quan",
    badgeEn: "Scenic Coastal Drive",
    badgeVi: "Cung đường ven biển",
    img: "/guide/danang/danang-hai-van-pass-hd.jpg",
    paragraphsEn: [
      "Discover the Hai Van Pass, also known as Ocean Cloud Pass, a 20km mountain route between Da Nang and Hue renowned for its stunning scenery and challenging winding roads.",
      "Referred to by King Le Thanh Tong as 'The Most Monumental Pass Under Heaven', Hai Van Pass hugs the Truong Son range as it plunges directly into the East Sea. Top Gear famously proclaimed it 'one of the best coast roads in the world'.",
      "Travelers can explore the historical Hai Van Gate at the summit (496m above sea level), enjoy Vietnamese iced coffee while gazing down at Lang Co Bay and Da Nang coastline, or ride motorbikes through misty hairpin turns.",
    ],
    paragraphsVi: [
      "Đèo Hải Vân (Đèo Mây) dài 20km uốn lượn quanh sườn dãy Bạch Mã, nối liền thành phố Đà Nẵng với tỉnh Thừa Thiên Huế.",
      "Vua Lê Thánh Tông khi vi hành qua đây đã phong tặng nơi này là 'Thiên hạ đệ nhất hùng quan' bởi vẻ đẹp hùng vĩ ngút ngàn. Chương trình truyền hình nổi tiếng Top Gear cũng từng đánh giá cung đường này là một trong những cung đường ven biển ngoạn mục nhất thế giới.",
      "Lên đỉnh đèo ở độ cao gần 500m, du khách có thể check-in di tích lịch sử Hải Vân Quan, nhâm nhi ly cà phê ngắm nhìn vịnh Lăng Cô và toàn cảnh thành phố biển Đà Nẵng ẩn hiện trong mây trời.",
    ],
    highlightsEn: [
      "Hai Van Gate (Hai Van Quan) Historical Fortification",
      "Breathtaking Views of Lang Co Bay & Da Nang Bay",
      "Top Gear's Legendary Coastal Motorcycle Route",
      "Cloud Forest Scenery & Sunset Photo Spots",
    ],
    highlightsVi: [
      "Di tích lịch sử Hải Vân Quan trên đỉnh đèo",
      "Tầm nhìn ôm trọn vịnh Lăng Cô và bán đảo Sơn Trà",
      "Cung đường phượt xe máy huyền thoại",
      "Điểm săn mây và ngắm hoàng hôn biển tuyệt đẹp",
    ],
  },

  // Where to Stay (Screenshot 4)
  "danang-stay": {
    titleEn: "Stay in Da Nang",
    titleVi: "Lưu trú tại Đà Nẵng",
    badgeEn: "Accommodation Guide",
    badgeVi: "Cẩm nang khách sạn",
    img: "/guide/danang/danang-stay-hd.jpg",
    paragraphsEn: [
      "Da Nang features a great variety of places to stay — from beachfront luxury resorts along My Khe Beach to affordable boutique hotels and serviced apartments in the city center.",
      "Whether you prefer waking up to sunrise over the Pacific ocean waves, staying near vibrant Han River bridges and night markets, or retreating into peaceful hillside villas in Son Tra, Da Nang offers world-class hospitality for every travel style and budget.",
      "Recommended neighborhoods include My Khe Beachfront (Vo Nguyen Giap street) for beach lovers, Hai Chau District for culture, dining and nightlife, and Son Tra Peninsula for secluded luxury.",
    ],
    paragraphsVi: [
      "Đà Nẵng sở hữu hệ thống lưu trú đa dạng bậc nhất Việt Nam, từ các khu resort 5 sao quốc tế sát bãi biển Mỹ Khê đến những khách sạn boutique xinh xắn và căn hộ nghỉ dưỡng ven sông Hàn.",
      "Dù bạn muốn thức giấc đón bình minh rực rỡ bên bờ biển, hòa mình vào nhịp sống sôi động gần các cây cầu và chợ đêm, hay tìm kiếm sự tĩnh lặng tại các biệt thự trên bán đảo Sơn Trà, Đà Nẵng đều có lựa chọn hoàn hảo.",
      "Các khu vực lưu trú được khuyên dùng nhất: Tuyến đường Võ Nguyên Giáp (ven biển Mỹ Khê), Quận Hải Châu (trung tâm ẩm thực và giải trí) và Bán đảo Sơn Trà (nghỉ dưỡng cao cấp riêng tư).",
    ],
    highlightsEn: [
      "My Khe Beachfront: Ocean views & direct beach access",
      "Han Riverfront: City lights, bridges & night markets",
      "Son Tra & Non Nuoc: Exclusive private luxury villas",
      "Options for every budget: Hostels, boutique stays & 5-star resorts",
    ],
    highlightsVi: [
      "Tuyến biển Mỹ Khê: Tầm nhìn biển vô cực, tắm biển thuận tiện",
      "Khu vực ven sông Hàn: Gần cầu Rồng, chợ đêm và phố ẩm thực",
      "Sơn Trà & Non Nước: Biệt thự nghỉ dưỡng sang trọng, riêng tư",
      "Đầy đủ phân khúc: Homestay, khách sạn boutique đến resort 5 sao",
    ],
  },

  "danang-5-star-hotels": {
    titleEn: "Which is your favorite 5-star hotel in Da Nang",
    titleVi: "Khách sạn 5 sao được yêu thích nhất Đà Nẵng",
    badgeEn: "Luxury Hospitality",
    badgeVi: "Khách sạn cao cấp",
    img: "/guide/danang/danang-5-star-hotels-hd.jpg",
    paragraphsEn: [
      "In order to give our readers a more objective view of accommodation in Da Nang, we showcase the top-voted 5-star hotels and luxury beach resorts in Vietnam's coastal metropolis.",
      "Da Nang is home to premier international luxury hospitality brands including Novotel Danang Premier Han River, Hilton Da Nang, Sheraton Grand Da Nang Resort, Pullman Danang Beach Resort, Hyatt Regency Danang Resort and Spa, and Furama Resort Danang.",
      "These properties offer infinity pools overlooking the East Sea, world-class spas, private beachfronts, and Michelin-recognized dining.",
    ],
    paragraphsVi: [
      "Đà Nẵng hội tụ những thương hiệu khách sạn và resort 5 sao hàng đầu thế giới, mang đến chuẩn mực nghỉ dưỡng xa hoa và đẳng cấp.",
      "Các tên tuổi nổi bật bao gồm Novotel Danang Premier Han River và Hilton Da Nang bên dòng sông Hàn; cùng loạt resort ven biển danh tiếng như Sheraton Grand, Pullman, Hyatt Regency và Furama Resort Danang.",
      "Mỗi khách sạn đều trang bị hồ bơi vô cực hướng biển, trung tâm spa cao cấp, bãi tắm riêng biệt và chuỗi nhà hàng ẩm thực phong phú phục vụ tinh hoa Á - Âu.",
    ],
    highlightsEn: [
      "Novotel & Hilton Danang: Riverfront panorama & sky bars",
      "Hyatt Regency & Furama: Quintessential beachside luxury",
      "Sheraton Grand Danang: 250m longest outdoor infinity pool",
      "Pullman Danang Beach Resort: Active lifestyle & spa indulgence",
    ],
    highlightsVi: [
      "Novotel & Hilton: Tầm nhìn toàn cảnh sông Hàn và sky bar lộng lẫy",
      "Hyatt Regency & Furama: Nghỉ dưỡng biển sang trọng bậc nhất",
      "Sheraton Grand: Hồ bơi vô cực ngoài trời dài 250m ấn tượng",
      "Pullman Danang: Bãi biển riêng tuyệt đẹp và dịch vụ spa thư giãn",
    ],
  },

  "danang-intercontinental": {
    titleEn: "InterContinental Da Nang Sun Peninsula Resort",
    titleVi: "InterContinental Đà Nẵng Sun Peninsula Resort",
    badgeEn: "World Luxury Winner",
    badgeVi: "Khu nghỉ dưỡng đỉnh cao",
    img: "/guide/danang/danang-intercontinental-hd.jpg",
    paragraphsEn: [
      "The InterContinental Da Nang Sun Peninsula Resort is one of the finest five-star resorts in both Vietnam and Asia, offering a breathtaking panoramic view. Nestled against Son Tra mountain and overlooking the South China Sea, the resort boasts a stunning and picturesque terrain.",
      "Designed by legendary architect Bill Bensley, the resort spans four levels named Heaven, Sky, Earth, and Sea connected by a private funicular railway through lush rainforest.",
      "Home to La Maison 1888 — the first restaurant in Vietnam helmed by a three-star Michelin chef (Pierre Gagnaire) — and award-winning Mi Sol Spa, this resort has repeatedly won 'World's Leading Luxury Resort' at the World Travel Awards.",
    ],
    paragraphsVi: [
      "InterContinental Danang Sun Peninsula Resort là kiệt tác nghỉ dưỡng 5 sao sang trọng bậc nhất châu Á, tọa lạc tại vịnh biển riêng tư tuyệt đẹp thuộc bán đảo Sơn Trà.",
      "Được thiết kế bởi kiến trúc sư lừng danh thế giới Bill Bensley, khu nghỉ dưỡng tái hiện nét văn hóa cung đình Việt kết hợp kiến trúc hiện đại, phân tầng thành 4 tầng trải nghiệm: Heaven (Thiên đường), Sky (Bầu trời), Earth (Mặt đất) và Sea (Biển cả) kết nối bằng tàu điện cáp Nam Tram độc đáo.",
      "Nơi đây sở hữu nhà hàng La Maison 1888 do đầu bếp 3 sao Michelin Pierre Gagnaire dẫn dắt, cùng Mi Sol Spa danh tiếng và bãi biển riêng tư tuyệt đối.",
    ],
    highlightsEn: [
      "Masterpiece Design by Architect Bill Bensley",
      "Four Terrace Levels Connected by Nam Tram Funicular",
      "La Maison 1888 Restaurant by 3-Star Michelin Chef",
      "Private Secluded Bay with Pristine Coral Reefs",
    ],
    highlightsVi: [
      "Kiệt tác thiết kế của kiến trúc sư Bill Bensley",
      "Bốn tầng trải nghiệm kết nối bởi tàu điện cáp Nam Tram",
      "Nhà hàng La Maison 1888 của bếp trưởng 3 sao Michelin",
      "Vịnh biển biệt lập với rạn san hô nguyên sơ",
    ],
  },

  // Food (Screenshot 5)
  "danang-7-foods": {
    titleEn: "7 must-try foods in Da Nang",
    titleVi: "7 món ăn nhất định phải thử tại Đà Nẵng",
    badgeEn: "Culinary Highlights",
    badgeVi: "Đặc sản ẩm thực",
    img: "/guide/danang/danang-7-foods-hd.jpg",
    paragraphsEn: [
      "In addition to beautiful beaches, Da Nang has been known for its diverse and unique cuisine featuring Central Vietnam. The savory and flavorful dishes are among the best foods you could find in Vietnam and really add satisfaction to your experience in Da Nang.",
      "Top culinary essentials include Mi Quang (turmeric rice noodles with savory broth, pork, shrimp, herbs, and crispy sesame rice cracker), Banh Xeo (crispy golden savory pancake wrapped in rice paper with herbs and peanut dipping sauce), and Bun Cha Ca (flavorful fish cake noodle soup).",
      "Other must-try dishes include Banh Trang Cuon Thit Heo (boiled pork sliced thin and wrapped with fresh vegetables and seasoned fermented fish sauce - mam nem), Nem Lui (lemongrass pork skewers), and freshest seafood along the coast.",
    ],
    paragraphsVi: [
      "Bên cạnh những bãi biển tuyệt đẹp, Đà Nẵng còn được mệnh danh là thiên đường ẩm thực miền Trung với hương vị đậm đà, tươi ngon và phong phú.",
      "Bộ sưu tập đặc sản nhất định phải thử gồm có Mì Quảng tôm thịt trứng cút đậm đà, Bánh xèo miền Trung giòn rụm chấm nước sốt gan đậu phộng, và Bún chả cá thơm ngọt nước dùng tự nhiên.",
      "Ngoài ra còn có Bánh tráng cuốn thịt heo hai đầu da chấm mắm nêm đậm đà, Gỏi cá Nam Ô trứ danh, Bê thui Cầu Mống và các món hải sản tươi sống chế biến ngay tại bờ biển.",
    ],
    highlightsEn: [
      "Mi Quang: Iconic Central Vietnamese Noodle",
      "Banh Xeo & Nem Lui: Crispy pancake with savory dipping sauce",
      "Bun Cha Ca: Rich seafood broth and homemade fish patties",
      "Banh Trang Cuon Thit Heo: Pork belly with fermented anchovy sauce",
    ],
    highlightsVi: [
      "Mì Quảng: Tinh hoa ẩm thực xứ Quảng",
      "Bánh xèo & Nem lụi: Vàng giòn đậm đà chấm sốt tương đậu",
      "Bún chả cá: Nước dùng ngọt thanh từ cá biển tươi và bí đỏ, dứa",
      "Bánh tráng cuốn thịt heo: Chấm mắm nêm đậm vị khó quên",
    ],
  },

  "danang-mi-quang": {
    titleEn: "Mi Quang",
    titleVi: "Mì Quảng Đà Nẵng",
    badgeEn: "Iconic Noodle Dish",
    badgeVi: "Món ngon trứ danh",
    img: "/guide/danang/danang-mi-quang-hd.jpg",
    paragraphsEn: [
      "Mi Quang is the culinary soul of Quang Nam and Da Nang. Unlike pho or bun bo which are served with generous broth, Mi Quang features wide, flat yellow or white rice noodles bathed in just a shallow ladle of intensely rich, flavorful broth.",
      "Toppings typically include tender pork belly, shrimp, chicken, or snakehead fish, boiled quail eggs, roasted crushed peanuts, scallions, and a wedge of lime.",
      "It is always served alongside crispy grilled sesame rice crackers (banh trang me) and a plate of nine fresh herbs including banana blossom, mint, lettuce, and basil.",
    ],
    paragraphsVi: [
      "Mì Quảng là linh hồn của nền ẩm thực xứ Quảng và Đà Nẵng. Khác với phở hay bún bò chan ngập nước, mì Quảng chỉ có một lượng nước dùng xâm xấp cực kỳ đậm đà và béo ngậy được ninh từ tôm, thịt hoặc gà ta.",
      "Sợi mì vàng óng màu nghệ hoặc trắng ngần, ăn kèm thịt heo, tôm đất, trứng cút, đậu phộng rang giòn và hành ngò thơm lừng.",
      "Khi thưởng thức, thực khách bẻ vụn bánh tráng mè nướng giòn rụm vào tô mì, vắt chút chanh ớt và ăn kèm đĩa rau sống búp chuối tươi non.",
    ],
    highlightsEn: [
      "Signature Shallow Savory Turmeric Broth",
      "Topped with Shrimps, Pork, Peanuts & Quail Eggs",
      "Served with Crispy Grilled Rice Crackers",
      "Accompanied by Banana Flower & 9 Fresh Herbs",
    ],
    highlightsVi: [
      "Nước lèo xâm xấp đậm đà ngọt bùi tự nhiên",
      "Nhân tôm đất, thịt heo, trứng cút và đậu phộng rang",
      "Bánh tráng mè nướng giòn rụm ăn kèm",
      "Đĩa rau sống hoa chuối búp và các loại rau thơm",
    ],
  },

  "danang-banh-xeo": {
    titleEn: "Banh Xeo",
    titleVi: "Bánh xèo miền Trung",
    badgeEn: "Crispy Sizzling Pancake",
    badgeVi: "Bánh xèo vàng giòn",
    img: "/guide/danang/danang-banh-xeo-hd.jpg",
    paragraphsEn: [
      "Banh Xeo in Central Vietnam has a distinct smaller, crisper texture compared to Southern banh xeo. Made from rice flour batter lightly tinted with turmeric and coconut milk, it is fried until shatteringly crisp on the exterior.",
      "Filled with whole shrimp, pork belly slices, bean sprouts, and scallions, it is eaten by wrapping pieces into soft rice paper (banh trang) with aromatic herbs, cucumber, and green starfruit.",
      "What makes Da Nang's banh xeo truly legendary is the special dipping sauce (nuoc leo) made with pork liver paste, ground peanuts, and fermented soy bean sauce rather than simple fish sauce.",
    ],
    paragraphsVi: [
      "Bánh xèo miền Trung tại Đà Nẵng có kích thước vừa vặn, vỏ ngoài giòn tan vàng rộm được đúc trong những chiếc chảo gang nhỏ.",
      "Nhân bánh đầy đặn gồm tôm tươi, thịt ba chỉ xắt mỏng, giá đỗ và hành hoa. Bánh được cuốn trong bánh tráng mỏng cùng rau xà lách, rau cải con, dưa leo và chuối chát xắt mỏng.",
      "Điểm nhấn độc nhất vô nhị chính là chén nước lèo chấm bánh xèo nấu từ gan heo, mè, đậu phộng xay nhuyễn sánh mịn và đậm đà, khác biệt hoàn toàn với nước mắm chua ngọt thông thường.",
    ],
    highlightsEn: [
      "Crispy Golden Crust Made with Turmeric Batter",
      "Filled with Sweet Shrimps, Pork & Fresh Bean Sprouts",
      "Wrapped in Rice Paper with Herbs & Starfruit",
      "Legendary Rich Pork Liver & Peanut Dipping Sauce (Nuoc Leo)",
    ],
    highlightsVi: [
      "Vỏ bánh đúc gang giòn rụm, vàng ươm đẹp mắt",
      "Nhân tôm tươi ngọt thịt, thịt heo ba chỉ và giá đỗ",
      "Cuốn bánh tráng cùng rau thơm, khế chua, chuối chát",
      "Nước chấm sốt tương gan đậu phộng sánh ngậy trứ danh",
    ],
  },

  "danang-bun-ca": {
    titleEn: "Bun Ca",
    titleVi: "Bún chả cá Đà Nẵng",
    badgeEn: "Fish Cake Noodle Soup",
    badgeVi: "Bún chả cá đậm đà",
    img: "/guide/danang/danang-bun-ca-hd.jpg",
    paragraphsEn: [
      "Bun Cha Ca (Fish Cake Noodle Soup) is one of Da Nang's most celebrated breakfast and dinner dishes, capturing the essence of fresh seafood straight from the East Sea.",
      "The broth is simmered for hours using fish bones, sweet pumpkin, ripe pineapple, tomatoes, and cabbage, yielding a naturally sweet, aromatic, and tangy profile without artificial seasonings.",
      "The bowl is filled with chewy vermicelli noodles and topped with two types of freshly made fish cake: steamed (cha ca hap) and golden fried (cha ca chien), served with shallot pickles, shredded morning glory, and chili garlic paste.",
    ],
    paragraphsVi: [
      "Bún chả cá là món ăn sáng và ăn tối được người dân Đà Nẵng lẫn du khách yêu thích bậc nhất, mang hương vị biển cả đậm đà và thanh tao.",
      "Nước dùng bún chả cá được ninh kỹ từ xương cá biển, kết hợp bí đỏ ngọt dịu, thơm (dứa) chua thanh, cà chua và bắp cải, tạo nên vị ngọt thanh tao tự nhiên không hề bị tanh.",
      "Tô bún gồm cả hai loại chả cá: chả cá chiên vàng thơm ngậy và chả cá hấp mềm dai ngọt, ăn cùng hành chua muối, rau muống chẻ giòn và ớt tỏi băm thơm nồng.",
    ],
    highlightsEn: [
      "Naturally Sweet Broth Simmered with Pumpkin & Pineapple",
      "Tender Steamed and Golden Fried Fish Patties",
      "Served with Pickled Shallots & Chili Paste",
      "Best Enjoyed at Famous Da Nang Eateries (Ba Phien, Ba Lu)",
    ],
    highlightsVi: [
      "Nước dùng ngọt thanh tự nhiên từ xương cá, dứa và bí đỏ",
      "Miếng chả cá hấp và chả cá chiên dai giòn đậm vị",
      "Ăn kèm hành tím muối chua, mắm ruốc và ớt sa tế",
      "Những quán nổi tiếng: Bún chả cá Bà Phiến, Bà Lữ, Nguyễn Chí Thanh",
    ],
  },
};

// ─── HELPER FOR BADGE TRANSLATION ───
function translateBadge(badge, lang) {
  if (lang !== "vi") return badge;
  switch (badge) {
    case "#Trending":
      return "#Xu hướng";
    case "Featured Articles":
      return "Bài viết nổi bật";
    case "Destinations":
      return "Điểm đến";
    case "Central Vietnam":
      return "Miền Trung";
    case "Articles":
      return "Bài viết";
    case "Hanoi":
      return "Hà Nội";
    case "Eat & Drink":
      return "Ẩm thực";
    case "Itinerary":
      return "Lịch trình";
    default:
      return badge;
  }
}

export default function DaNangPage() {
  const [lang, setLang] = useState("en");
  const [activeMega, setActiveMega] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [readMoreExpanded, setReadMoreExpanded] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);

  const megaTimeoutRef = useRef(null);

  useEffect(() => {
    const current = getLang();
    setLang(current || "en");

    const handleLangChange = () => {
      setLang(getLang() || "en");
    };

    window.addEventListener("vina_language_change", handleLangChange);
    window.addEventListener("vinatap:lang-updated", handleLangChange);
    return () => {
      window.removeEventListener("vina_language_change", handleLangChange);
      window.removeEventListener("vinatap:lang-updated", handleLangChange);
      if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    };
  }, []);

  const handleMenuEnter = (menuKey) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(menuKey);
  };

  const handleMenuLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 200);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="vnn-danang-page">
      {/* ─── 1. TOP BANNER (SCREENSHOT 1) ─── */}
      <div className="vnn-danang-top-banner">
        <Link href="/">
          <img
            src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
            alt="VinaTap - AI Companion"
          />
        </Link>
      </div>

      {/* ─── 2. EDITORIAL NAVBAR (SCREENSHOT 1) ─── */}
      <header className="vnn-danang-header">
        <div className="vnn-danang-nav-inner">
          {/* Logo */}
          <Link href="/" className="vnn-danang-logo-wrap">
            <Logo size={32} showText={false} noLink href={null} as="span" />
          </Link>

          {/* Navigation Links with Mega Menus */}
          <nav>
            <ul className="vnn-danang-nav-menu">
              <li
                className="vnn-danang-nav-item"
                onMouseEnter={() => handleMenuEnter("inspired")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-danang-nav-link ${
                    activeMega === "inspired" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-danang-nav-item"
                onMouseEnter={() => handleMenuEnter("destinations")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-danang-nav-link ${
                    activeMega === "destinations" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-danang-nav-item"
                onMouseEnter={() => handleMenuEnter("things")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-danang-nav-link ${
                    activeMega === "things" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-danang-nav-item"
                onMouseEnter={() => handleMenuEnter("eat")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-danang-nav-link ${
                    activeMega === "eat" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-danang-nav-item"
                onMouseEnter={() => handleMenuEnter("itineraries")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-danang-nav-link ${
                    activeMega === "itineraries" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}
                  <ChevronDown size={14} />
                </button>
              </li>
            </ul>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
          </div>

          {/* MEGA MENU FLYOUT (MATCHING FIG 2) */}
          {activeMega && MEGA_MENUS_DATA[activeMega] && (
            <div
              className="vnn-megamenu"
              onMouseEnter={() => handleMenuEnter(activeMega)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="vnn-megamenu__grid">
                {MEGA_MENUS_DATA[activeMega].items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-megamenu__card"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="vnn-megamenu__thumb">
                      <img
                        src={item.img}
                        alt={lang === "vi" ? item.titleVi : item.title}
                        loading="eager"
                      />
                      {item.badge && (
                        <span className="vnn-megamenu__badge">
                          {getBadgeLabel(item.badge, lang === "vi")}
                        </span>
                      )}
                    </div>
                    <h4 className="vnn-megamenu__title">
                      {lang === "vi" ? item.titleVi : item.title}
                    </h4>
                    <span className="vnn-megamenu__date">
                      {lang === "vi" ? item.dateVi : item.date}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="vnn-megamenu__footer">
                <div className="vnn-megamenu__nav-btns">
                  <button
                    type="button"
                    className="vnn-megamenu__nav-btn"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    className="vnn-megamenu__nav-btn"
                    aria-label="Next"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── 3. HERO SECTION (SCREENSHOT 1) ─── */}
      <section className="vnn-danang-hero-section">
        <img
          src="/guide/danang/danang-hero-hd.jpg"
          alt="Da Nang Dragon Bridge and Han River"
          className="vnn-danang-hero-bg"
        />
        <div className="vnn-danang-hero-gradient" />

        <div className="vnn-danang-hero-content">
          <div className="vnn-danang-badges">
            <span className="vnn-danang-badge">
              {lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
            </span>
            <span className="vnn-danang-badge">
              {lang === "vi" ? "MIỀN TRUNG" : "CENTRAL VIETNAM"}
            </span>
            <span className="vnn-danang-badge">
              {lang === "vi" ? "ĐÀ NẴNG" : "DA NANG"}
            </span>
          </div>

          <h1 className="vnn-danang-hero-title">
            {lang === "vi" ? "Đà Nẵng" : "Da Nang"}
          </h1>

          <div className="vnn-danang-meta">
            <span>By VinaTap</span>
            <span>•</span>
            <span>{lang === "vi" ? "15 Tháng 9, 2026" : "September 15, 2026"}</span>
          </div>
        </div>
      </section>

      {/* ─── 4. QUICK NAVIGATION PILLS (SCREENSHOT 1 & 2) ─── */}
      <div className="vnn-danang-pills-bar">
        <div className="vnn-danang-pills-inner">
          <a
            href="#danang-guide"
            className="vnn-danang-pill-item"
            onClick={(e) => scrollToSection(e, "danang-guide")}
          >
            <Compass size={16} />
            <span>{lang === "vi" ? "Cẩm nang du lịch" : "Travel guide"}</span>
          </a>
          <a
            href="#danang-attractions"
            className="vnn-danang-pill-item"
            onClick={(e) => scrollToSection(e, "danang-attractions")}
          >
            <Bike size={16} />
            <span>{lang === "vi" ? "Điểm tham quan" : "Attractions"}</span>
          </a>
          <a
            href="#danang-stay"
            className="vnn-danang-pill-item"
            onClick={(e) => scrollToSection(e, "danang-stay")}
          >
            <Hotel size={16} />
            <span>{lang === "vi" ? "Lưu trú" : "Accommodation"}</span>
          </a>
          <a
            href="#danang-food"
            className="vnn-danang-pill-item"
            onClick={(e) => scrollToSection(e, "danang-food")}
          >
            <Utensils size={16} />
            <span>{lang === "vi" ? "Ẩm thực" : "Food"}</span>
          </a>
        </div>
      </div>

      {/* ─── 5. TRAVEL GUIDE & VIDEO SECTION (SCREENSHOT 2) ─── */}
      <section id="danang-guide" className="vnn-danang-guide-section">
        <div className="vnn-danang-guide-container">
          <h2 className="vnn-danang-section-title">
            {lang === "vi" ? "Cẩm nang du lịch Đà Nẵng" : "Da Nang travel guide"}
          </h2>
          <div className="vnn-danang-section-divider" />

          <div className="vnn-danang-guide-paragraphs">
            <p>
              {lang === "vi"
                ? "Thành phố Đà Nẵng nằm ở miền Trung Việt Nam, cách thủ đô Hà Nội 776 km về phía bắc và cách TP. Hồ Chí Minh 961 km về phía nam. Đà Nẵng giáp tỉnh Thừa Thiên Huế ở phía bắc, tỉnh Quảng Nam ở phía tây và nam, và biển Đông ở phía đông. Thành phố là vị trí trung tâm kết nối ba di sản văn hóa thế giới nổi tiếng của UNESCO, bao gồm Cố đô Huế, Thánh địa Mỹ Sơn và Phố cổ Hội An."
                : "Da Nang city is in the central part of Vietnam, which is 776 km from Hanoi to the north and 961 km from Ho Chi Minh City to the south. Da Nang borders Thua Thien Hue Province in the north, Quang Nam Province in the west and south, and the South China Sea in the east. The city is the central location connecting three famous UNESCO world heritage sites, including Hue Imperial Citadel, My Son Sanctuary, and Hoi An Ancient Town."}
            </p>

            <p>
              {lang === "vi"
                ? "Nhờ đó, Đà Nẵng là thành phố có vị trí đắc địa đóng vai trò then chốt trong việc phát triển và giữ vững du lịch, kinh tế, thương mại và an ninh quốc phòng; đối với du khách, thành phố này luôn là điểm đến hàng đầu tại Việt Nam."
                : "As a result, Da Nang is a city with a prime location that plays a crucial role in developing and maintaining tourism, the economy, trading, and military defense; for tourists, this city is always the top destination in Vietnam."}
            </p>
          </div>

          {/* Accordion Expand Button */}
          <div className="vnn-danang-expand-wrap">
            <button
              type="button"
              className="vnn-danang-expand-btn"
              onClick={() => setReadMoreExpanded(!readMoreExpanded)}
            >
              <span>
                {readMoreExpanded
                  ? lang === "vi"
                    ? "Thu gọn cẩm nang du lịch Đà Nẵng ▴"
                    : "Collapse ▴"
                  : lang === "vi"
                  ? "Xem thêm cẩm nang du lịch Đà Nẵng ▾"
                  : "Read more Da Nang travel guide ▾"}
              </span>
            </button>
          </div>

          {/* Expanded Accordion Content */}
          {readMoreExpanded && (
            <div className="vnn-danang-accordion-body">
              {/* 1. Tourist Map */}
              <div className="vnn-danang-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Bản đồ du lịch Đà Nẵng"
                    : "Da Nang tourist map"}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: "24px",
                    alignItems: "center",
                    margin: "16px 0",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => setMapModalOpen(true)}
                  >
                    <img
                      src="/guide/danang/danang-tourist-map-hd.jpg"
                      alt="Da Nang Tourist Map Full HD"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.65)",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {lang === "vi" ? "🔍 Phóng to" : "🔍 Click to expand"}
                    </div>
                  </div>
                  <div>
                    <p>
                      {lang === "vi"
                        ? "Để giúp bạn làm quen với cách di chuyển quanh thành phố, chúng tôi xin giới thiệu bản đồ du lịch Đà Nẵng, bao gồm các điểm đến nổi tiếng nhất cũng như các thông tin hữu ích khác như nhà hàng, quán bar và khu mua sắm. Nhấp vào bản đồ để phóng to hoặc tải xuống để sử dụng ngoại tuyến."
                        : "To familiarize you with the way of getting around the city, we would like to introduce you to the Da Nang tourist map, which includes its most popular destinations as well as other useful information such as restaurants, bars, and shopping. Download it for offline use and quick access."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setMapModalOpen(true)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: "6px",
                        border: "2px solid #00c2cb",
                        background: "transparent",
                        color: "#00c2cb",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {lang === "vi" ? "Xem bản đồ HD" : "Download"}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Weather */}
              <div className="vnn-danang-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Thời tiết & Thời điểm lý tưởng đến Đà Nẵng"
                    : "Da Nang weather"}
                </h3>
                <p>
                  {lang === "vi"
                    ? "Tọa lạc tại miền Trung, Đà Nẵng chịu ảnh hưởng của khí hậu nhiệt đới gió mùa với hai mùa rõ rệt: mùa mưa (từ tháng 8 đến tháng 12) và mùa khô (từ tháng 1 đến tháng 7). Đặc biệt, mùa mưa tại Đà Nẵng thường có những ngày mưa rào kéo dài. Tháng 10 là tháng có lượng mưa lớn nhất trong năm. Ngược lại, mùa khô nhiều nắng và trong xanh, tháng 6 nóng nhất với nhiệt độ trung bình khoảng 34 °C."
                    : "Positioned in the central part of the country, Da Nang experiences a tropical monsoon climate that has two distinct seasons: a rainy season (from August to December) and a dry season (from January to July). Particularly, the rainy season in Da Nang is synonymous with days of uninterrupted rain. October is the wettest month of the year with high precipitation. So, traveling in Da Nang in the rainy season may limit the range of outdoor activities. The dry season, in contrast, is often humidly hot and cloudy. The hottest month is reported in June, with the average temperature reaching 34 °C."}
                </p>
                <p>
                  {lang === "vi"
                    ? "• Từ cuối tháng 12 đến cuối tháng 3: Thời điểm hoàn hảo cho các hoạt động tham quan, khám phá vì thời tiết rất thuận lợi với bầu trời trong xanh, không mưa dầm, nhiệt độ dao động 18 °C - 27 °C. Tháng 2 là tháng lý tưởng nhất với các lễ hội đầu xuân rộn rã."
                    : "• Late December to late March is perfect for sightseeing and exploring activities because the weather is super advantageous with a transparent blue sky, the absence of lasting rains, and the average temperature fluctuating between 18 °C to 27 °C. February is the most recommended month with very pleasant weather."}
                </p>
                <p>
                  {lang === "vi"
                    ? "• Từ cuối tháng 2 đến cuối tháng 4: Thời điểm tuyệt vời nhất cho các hoạt động bơi lội và thể thao biển, khi nhiệt độ tăng nhẹ khoảng 32 °C vừa đủ ấm áp để đắm mình trong làn nước biển trong xanh của Mỹ Khê."
                    : "• For by-water and beach activities, late February to late April is the best time. This is when the temperature rises to around 32 °C, just hot enough for diving in the cool and clear water in Da Nang. Also, you get enough waves and wind for water sports such as surfing and kitesurfing."}
                </p>
              </div>

              {/* 3. Transportation */}
              <div className="vnn-danang-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Phương tiện & Di chuyển tại Đà Nẵng"
                    : "Transportation in Da Nang"}
                </h3>
                <h4>{lang === "vi" ? "Đến Đà Nẵng" : "Travel to Da Nang"}</h4>
                <p>
                  {lang === "vi"
                    ? "Đà Nẵng sở hữu hệ thống giao thông cực kỳ thuận lợi: Sân bay quốc tế Đà Nẵng chỉ cách trung tâm thành phố 3 km, ga xe lửa nằm ngay trung tâm và bến xe liên tỉnh kết nối khắp cả nước."
                    : "Da Nang is one of the most developed cities in Vietnam, which means a modern transport system. One of the highlights of Da Nang transportation, making it extremely accessible, is that its airport, train station, and central bus stations are located a short distance from the city center."}
                </p>
                <ul>
                  <li>
                    <strong>{lang === "vi" ? "Máy bay: " : "By planes: "}</strong>
                    {lang === "vi"
                      ? "Sân bay Quốc tế Đà Nẵng khai thác hàng chục đường bay nội địa và quốc tế trực tiếp, chỉ mất 10 phút taxi để vào trung tâm."
                      : "Da Nang International Airport is only 3 km away from the city center and is operated by many local and international airlines."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Tàu hỏa: " : "By trains: "}</strong>
                    {lang === "vi"
                      ? "Tuyến đường sắt Bắc - Nam đi qua Đà Nẵng với cung đường đèo Hải Vân ngắm cảnh tuyệt đẹp. Hành trình từ Hà Nội hoặc TP.HCM mất từ 16 - 19 giờ."
                      : "The national North-South Railway contributes 30 km of its line crossing Da Nang. From Hanoi and Ho Chi Minh City, it takes 16 to 19 hours, offering incredible scenic views."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Xe khách: " : "By buses: "}</strong>
                    {lang === "vi"
                      ? "Xe khách chất lượng cao từ Hội An, Huế, Nha Trang kết nối liên tục tại Bến xe Trung tâm Đà Nẵng (Phương Trang, The Sinh Tourist)."
                      : "From neighboring cities such as Hoi An and Hue, public and private buses (Phuong Trang, The Sinh Tourist) operate frequent daily departures."}
                  </li>
                </ul>

                <h4>{lang === "vi" ? "Di chuyển trong thành phố" : "Travel in Da Nang"}</h4>
                <ul>
                  <li>
                    <strong>{lang === "vi" ? "Xe buýt công cộng: " : "Buses: "}</strong>
                    {lang === "vi"
                      ? "Đà Nẵng có 14 tuyến xe buýt nội thành hiện đại, tra cứu dễ dàng trên danangbus.vn."
                      : "Da Nang provides 14 bus routes in town. You can check specific trips on danangbus.vn."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Taxi & Ứng dụng đặt xe: " : "Taxis & Ride-hailing: "}</strong>
                    {lang === "vi"
                      ? "Grab, Be, Gojek hoạt động sôi nổi và minh bạch về giá. Bạn cũng có thể thuê taxi trọn gói theo chuyến nửa ngày (khoảng 650.000 VNĐ) hoặc cả ngày (khoảng 1.800.000 VNĐ)."
                      : "Safe, reliable ride-hailing apps (Grab, Be, Gojek) are widespread. You can also charter a taxi for half-day (~650,000 VND) or full-day (~1,800,000 VND)."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Thuê xe máy: " : "Motorbikes: "}</strong>
                    {lang === "vi"
                      ? "Cách linh hoạt nhất để phượt đèo Hải Vân và bán đảo Sơn Trà. Giá thuê từ 100.000 - 200.000 VNĐ/ngày."
                      : "Renting a motorbike costs 100,000 - 200,000 VND/day, providing total freedom to cruise coastal boulevards and mountain passes."}
                  </li>
                </ul>
              </div>

              {/* 4. Festivals */}
              <div className="vnn-danang-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Lễ hội đặc sắc tại Đà Nẵng"
                    : "Festivals in Da Nang"}
                </h3>

                <h4>
                  {lang === "vi"
                    ? "Lễ hội Quán Thế Âm (Ngũ Hành Sơn)"
                    : "Festival of Avalokiteshvara"}
                </h4>
                <p>
                  {lang === "vi"
                    ? "Lễ hội tâm linh lớn tổ chức từ ngày 19 tháng 2 âm lịch hằng năm tại danh thắng Ngũ Hành Sơn, cầu mưa thuận gió hòa, quốc thái dân an với các nghi thức Phật giáo trang nghiêm cùng hoạt động hội hoa đăng, thư pháp, ca múa nhạc dân gian."
                    : "Avalokitesvara Festival is a spiritual celebration wishing for harmonic weather, health, and peace. Held on February 19 of the lunar calendar at Marble Mountains, it attracts thousands of Buddhist pilgrims."}
                </p>

                <h4>
                  {lang === "vi"
                    ? "Lễ hội Pháo hoa Quốc tế Đà Nẵng (DIFF)"
                    : "Fireworks Festival"}
                </h4>
                <p>
                  {lang === "vi"
                    ? "Sự kiện văn hóa du lịch tầm cỡ quốc tế bên bờ sông Hàn diễn ra vào dịp hè hằng năm. Quy tụ các đội pháo hoa hàng đầu thế giới từ Mỹ, Pháp, Ý, Nhật Bản, Úc... mang đến những màn trình diễn ánh sáng và âm nhạc ngoạn mục bên dòng sông Hàn."
                    : "The Fireworks Festival is an international-scale event taking place annually along the Han River. Competing teams from around the world create spectacular fireworks performances choreographed to music."}
                </p>

                <h4>
                  {lang === "vi"
                    ? "Lễ hội Cầu Ngư làng chài"
                    : "Cau Ngu Festival"}
                </h4>
                <p>
                  {lang === "vi"
                    ? "Lễ hội truyền thống lâu đời của ngư dân các làng ven biển Đà Nẵng diễn ra từ ngày 14 - 16 tháng Giêng âm lịch để tạ ơn thần Nam Hải (Cá Ông) đã che chở ngư dân bám biển thuận buồm xuôi gió."
                    : "A long-established traditional festival of coastal villages to show gratitude and respect towards whales — guardians of the sea. Held right after the Lunar New Year with colorful boat parades and rituals."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 6. TOP ATTRACTIONS IN DA NANG (SCREENSHOT 3) ─── */}
      <section id="danang-attractions" className="vnn-danang-section">
        <div className="vnn-danang-section-inner">
          <div className="vnn-danang-section-header">
            <h2 className="vnn-danang-section-heading">
              {lang === "vi"
                ? "Điểm tham quan hàng đầu tại Đà Nẵng"
                : "Top attractions in Da Nang"}
            </h2>
            <button
              type="button"
              className="vnn-danang-viewall-btn"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-10-best-attractions"])
              }
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="vnn-danang-section-divider" />

          <div className="vnn-danang-attractions-grid">
            {/* 1. Large Card (The 10 best attractions in Da Nang) */}
            <div
              className="vnn-danang-attraction-card large"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-10-best-attractions"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-10-best-attractions-hd.jpg"
                alt="The 10 best attractions in Da Nang"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi"
                    ? "10 điểm tham quan đẹp nhất Đà Nẵng"
                    : "The 10 best attractions in Da Nang"}
                </h3>
              </div>
            </div>

            {/* 2. Top-Left Small Card: Son Tra Peninsula */}
            <div
              className="vnn-danang-attraction-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-son-tra-peninsula"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-son-tra-peninsula-hd.jpg"
                alt="Son Tra Peninsula"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Bán đảo Sơn Trà" : "Son Tra Peninsula"}
                </h3>
              </div>
            </div>

            {/* 3. Top-Right Small Card: Ba Na Hills */}
            <div
              className="vnn-danang-attraction-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-ba-na-hills"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-ba-na-hills-hd.jpg"
                alt="Ba Na Hills"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Bà Nà Hills" : "Ba Na Hills"}
                </h3>
              </div>
            </div>

            {/* 4. Bottom-Left Small Card: Dragon Bridge */}
            <div
              className="vnn-danang-attraction-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-dragon-bridge"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-dragon-bridge-hd.jpg"
                alt="Dragon Bridge"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Cầu Rồng" : "Dragon Bridge"}
                </h3>
              </div>
            </div>

            {/* 5. Bottom-Right Small Card: Hai Van Pass */}
            <div
              className="vnn-danang-attraction-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-hai-van-pass"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-hai-van-pass-hd.jpg"
                alt="Hai Van Pass"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Đèo Hải Vân" : "Hai Van Pass"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. WHERE TO STAY IN DA NANG (SCREENSHOT 4) ─── */}
      <section id="danang-stay" className="vnn-danang-section">
        <div className="vnn-danang-section-inner">
          <div className="vnn-danang-section-header">
            <h2 className="vnn-danang-section-heading">
              {lang === "vi"
                ? "Nơi lưu trú tại Đà Nẵng"
                : "Where to stay in Da Nang"}
            </h2>
            <button
              type="button"
              className="vnn-danang-viewall-btn"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-stay"])
              }
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="vnn-danang-section-divider" />

          <div className="vnn-danang-stay-grid">
            {/* Card 1: Stay in Da Nang */}
            <div
              className="vnn-danang-stay-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-stay"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-stay-hd.jpg"
                alt="Stay in Da Nang"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Lưu trú tại Đà Nẵng" : "Stay in Da Nang"}
                </h3>
              </div>
            </div>

            {/* Card 2: Favorite 5-star hotel in Da Nang */}
            <div
              className="vnn-danang-stay-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-5-star-hotels"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-5-star-hotels-hd.jpg"
                alt="Which is your favorite 5-star hotel in Da Nang"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3
                  className="vnn-danang-card-title"
                  style={{ fontSize: "16px", lineHeight: "1.3" }}
                >
                  {lang === "vi"
                    ? "Khách sạn 5 sao được yêu thích nhất"
                    : "Which is your favorite 5-star hotel in Da Nang"}
                </h3>
              </div>
            </div>

            {/* Card 3: InterContinental Da Nang Sun Peninsula Resort */}
            <div
              className="vnn-danang-stay-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-intercontinental"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-intercontinental-hd.jpg"
                alt="InterContinental Da Nang Sun Peninsula Resort"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3
                  className="vnn-danang-card-title"
                  style={{ fontSize: "16px", lineHeight: "1.3" }}
                >
                  {lang === "vi"
                    ? "InterContinental Da Nang Sun Peninsula Resort"
                    : "InterContinental Da Nang Sun Peninsula Resort"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. MUST-TRY DISHES IN DA NANG (SCREENSHOT 5) ─── */}
      <section id="danang-food" className="vnn-danang-section">
        <div className="vnn-danang-section-inner">
          <div className="vnn-danang-section-header">
            <h2 className="vnn-danang-section-heading">
              {lang === "vi"
                ? "Món ngon phải thử tại Đà Nẵng"
                : "Must-try dishes in Da Nang"}
            </h2>
            <button
              type="button"
              className="vnn-danang-viewall-btn"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-7-foods"])
              }
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="vnn-danang-section-divider" />

          <div className="vnn-danang-dishes-grid">
            {/* Card 1: Large Left (7 must-try foods in Da Nang) */}
            <div
              className="vnn-danang-dish-card large"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-7-foods"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-7-foods-hd.jpg"
                alt="7 must-try foods in Da Nang"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi"
                    ? "7 món ăn nhất định phải thử tại Đà Nẵng"
                    : "7 must-try foods in Da Nang"}
                </h3>
              </div>
            </div>

            {/* Card 2: Right Top (Mi Quang) */}
            <div
              className="vnn-danang-dish-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-mi-quang"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-mi-quang-hd.jpg"
                alt="Mi Quang"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Mì Quảng" : "Mi Quang"}
                </h3>
              </div>
            </div>

            {/* Card 3: Right Middle (Banh Xeo) */}
            <div
              className="vnn-danang-dish-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-banh-xeo"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-banh-xeo-hd.jpg"
                alt="Banh Xeo"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Bánh Xèo" : "Banh Xeo"}
                </h3>
              </div>
            </div>

            {/* Card 4: Right Bottom (Bun Ca) */}
            <div
              className="vnn-danang-dish-card"
              onClick={() =>
                setDetailModalItem(DANANG_DETAILS["danang-bun-ca"])
              }
              role="button"
              tabIndex={0}
            >
              <img
                src="/guide/danang/danang-bun-ca-hd.jpg"
                alt="Bun Ca"
                className="vnn-danang-card-img"
              />
              <div className="vnn-danang-card-overlay">
                <h3 className="vnn-danang-card-title">
                  {lang === "vi" ? "Bún Chả Cá" : "Bun Ca"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. TAGS SECTION (SCREENSHOT 5) ─── */}
      <div className="vnn-danang-tags-section">
        <span className="vnn-danang-tag-label">TAGS</span>
        <Link href="/guide" className="vnn-danang-tag-pill">
          {lang === "vi" ? "Điểm đến" : "Destinations"}
        </Link>
      </div>

      {/* ─── 10. OTHER DESTINATIONS SECTION (HÌNH 1) ─── */}
      <div style={{ maxWidth: "1200px", margin: "40px auto 0 auto", padding: "0 24px" }}>
        <div className="vnn-danang-section-divider" />
      </div>

      <section className="vnn-danang-section" style={{ marginTop: "32px", marginBottom: "48px" }}>
        <div className="vnn-danang-section-inner">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#111111",
                margin: 0,
                textAlign: "center",
              }}
            >
              {lang === "vi" ? "Điểm đến khác" : "Other Destinations"}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "28px",
            }}
          >
            {/* Card 1: Ho Chi Minh City */}
            <Link
              href="/province/ho-chi-minh"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              className="vnn-danang-related-card"
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 10.5",
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#f0f0f0",
                }}
                className="vnn-danang-related-img-wrap"
              >
                <img
                  src="/guide/danang/danang-related-hcmc.jpg"
                  alt="Ho Chi Minh City"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    imageRendering: "-webkit-optimize-contrast",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: "1.25",
                  color: "#111111",
                  margin: "14px 0 0 0",
                  textAlign: "left",
                }}
                className="vnn-danang-related-title"
              >
                {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
              </h3>
            </Link>

            {/* Card 2: Nha Trang */}
            <Link
              href="/province/khanh-hoa"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              className="vnn-danang-related-card"
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 10.5",
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#f0f0f0",
                }}
                className="vnn-danang-related-img-wrap"
              >
                <img
                  src="/guide/danang/danang-related-nhatrang.jpg"
                  alt="Nha Trang"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    imageRendering: "-webkit-optimize-contrast",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: "1.25",
                  color: "#111111",
                  margin: "14px 0 0 0",
                  textAlign: "left",
                }}
                className="vnn-danang-related-title"
              >
                {lang === "vi" ? "Nha Trang" : "Nha Trang"}
              </h3>
            </Link>

            {/* Card 3: Marble Mountains */}
            <div
              onClick={() => setDetailModalItem(DANANG_DETAILS["danang-10-best-attractions"])}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              className="vnn-danang-related-card"
              role="button"
              tabIndex={0}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 10.5",
                  borderRadius: "4px",
                  overflow: "hidden",
                  backgroundColor: "#f0f0f0",
                }}
                className="vnn-danang-related-img-wrap"
              >
                <img
                  src="/guide/danang/danang-related-marble-mountains.jpg"
                  alt="Marble Mountains"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    imageRendering: "-webkit-optimize-contrast",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  lineHeight: "1.25",
                  color: "#111111",
                  margin: "14px 0 0 0",
                  textAlign: "left",
                }}
                className="vnn-danang-related-title"
              >
                {lang === "vi" ? "Ngũ Hành Sơn" : "Marble Mountains"}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="vnn-danang-section-divider" />
      </div>

      {/* ─── 11. FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "70px" }}>
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <span className="home-footer__name">VinaTap</span>
            <span className="home-footer__copy">
              © {new Date().getFullYear()} VinaTap.
            </span>
          </div>

          <div className="home-footer__socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="home-footer__social-link"
            >
              Facebook
            </a>
            <span>•</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="home-footer__social-link"
            >
              Instagram
            </a>
            <span>•</span>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="home-footer__social-link"
            >
              X
            </a>
            <span>•</span>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="home-footer__social-link"
            >
              YouTube
            </a>
            <span>•</span>
            <Link href="/terms" className="home-footer__social-link">
              {lang === "vi" ? "Điều khoản dịch vụ" : "Terms"}
            </Link>
            <span>•</span>
            <Link href="/policy" className="home-footer__social-link">
              {lang === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
            </Link>
          </div>
        </div>
      </footer>

      {/* ─── AI CHATBOT MODAL & FLOATING FAB ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        province={{
          name: lang === "vi" ? "Đà Nẵng" : "Da Nang",
          slug: "da-nang",
        }}
      />

      {/* ─── LIGHTBOX MODAL FOR DA NANG TOURIST MAP ─── */}
      {mapModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
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
              maxWidth: "1100px",
              width: "100%",
              maxHeight: "90vh",
              backgroundColor: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
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
                  ? "Bản đồ Du lịch Đà Nẵng (Độ nét cao)"
                  : "Da Nang Tourist Map (High Resolution)"}
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
                src="/guide/danang/danang-tourist-map-hd.jpg"
                alt="Da Nang Tourist Map Full HD"
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

      {/* ─── MODAL DETAIL POPUP FOR CARDS ─── */}
      {detailModalItem && (
        <div
          className="vnn-danang-modal-backdrop"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="vnn-danang-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vnn-danang-modal-close"
              onClick={() => setDetailModalItem(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="vnn-danang-detail-hero">
              <img
                src={detailModalItem.img}
                alt={lang === "vi" ? detailModalItem.titleVi : detailModalItem.titleEn}
              />
              <div className="vnn-danang-detail-hero-gradient" />
              <h2 className="vnn-danang-detail-hero-title">
                {lang === "vi" ? detailModalItem.titleVi : detailModalItem.titleEn}
              </h2>
            </div>

            <div className="vnn-danang-detail-content">
              <span className="vnn-danang-detail-badge">
                {lang === "vi" ? detailModalItem.badgeVi : detailModalItem.badgeEn}
              </span>

              <div className="vnn-danang-detail-paragraphs">
                {(lang === "vi"
                  ? detailModalItem.paragraphsVi
                  : detailModalItem.paragraphsEn
                ).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {((lang === "vi" && detailModalItem.highlightsVi) ||
                detailModalItem.highlightsEn) && (
                <div className="vnn-danang-detail-highlights">
                  <h5>
                    {lang === "vi"
                      ? "Điểm nổi bật & Trải nghiệm gợi ý"
                      : "Key Highlights & Recommended Experiences"}
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
