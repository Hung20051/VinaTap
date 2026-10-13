"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { getLang } from "@/lib/prefs";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import {
  ChevronDown,
  ChevronRight,
  Compass,
  MapPin,
  Calendar,
  Eye,
  ArrowRight,
  Play,
  X,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import "@/styles/destination-hoian.css";

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
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "December 31, 2024",
        dateVi: "31 Tháng 12, 2024",
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
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "November 14, 2024",
        dateVi: "14 Tháng 11, 2024",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "November 12, 2024",
        dateVi: "12 Tháng 11, 2024",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "July 25, 2024",
        dateVi: "25 Tháng 7, 2024",
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
        link: "/guide/the-complete-guide-to-vietnam",
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
        link: "/province/khanh-hoa",
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
        date: "May 19, 2025",
        dateVi: "19 Tháng 5, 2025",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "April 26, 2025",
        dateVi: "26 Tháng 4, 2025",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Complete Guide to Vietnamese Noodle Soup",
        titleVi: "Phở – Cẩm nang trọn vẹn về món quốc hồn quốc túy",
        date: "March 15, 2025",
        dateVi: "15 Tháng 3, 2025",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn tuyệt vời tại Vũng Tàu",
        date: "April 1, 2025",
        dateVi: "1 Tháng 4, 2025",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món ăn đặc sắc tại Nha Trang",
        date: "February 20, 2025",
        dateVi: "20 Tháng 2, 2025",
        badge: "Eat & Drink",
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
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Itinerary",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam Itinerary",
        titleVi: "Lịch trình 10 ngày khám phá Việt Nam",
        date: "August 15, 2025",
        dateVi: "15 Tháng 8, 2025",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam Itinerary",
        titleVi: "Lịch trình 2 tuần khám phá trọn vẹn",
        date: "September 2, 2025",
        dateVi: "2 Tháng 9, 2025",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam Itinerary",
        titleVi: "Lịch trình 1 tháng xuyên Việt từ Bắc vào Nam",
        date: "October 10, 2025",
        dateVi: "10 Tháng 10, 2025",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "itin-5",
        title: "Hoi An in 3 Days: Complete Itinerary",
        titleVi: "Lịch trình 3 ngày hoàn hảo tại phố cổ Hội An",
        date: "November 5, 2025",
        dateVi: "5 Tháng 11, 2025",
        badge: "Itinerary",
        img: "/guide/hoian/hoian-hero-hd.jpg",
        link: "/province/hoi-an",
      },
    ],
  },
};

function translateBadge(badge, lang) {
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

// ─── RICH DETAIL DATA FOR MODALS (FULL TEXT & HD ASSETS) ───
const HOIAN_DETAILS = {
  stay: {
    titleEn: "Where to stay in Hoi An",
    titleVi: "Nơi lưu trú ở Hội An",
    badgeEn: "Accommodation Guide",
    badgeVi: "Cẩm nang lưu trú",
    img: "/guide/hoian/hoian-stay-hd.jpg",
    paragraphsEn: [
      "Hoi An is internationally renowned for offering some of the most atmospheric and hospitable accommodations in Southeast Asia. Whether you wish to wake up to the sound of rooster crows beside lush emerald rice paddies, stay in a lovingly restored 200-year-old French-merchant shophouse, or unwind at a beachfront luxury resort overlooking the East Sea, Hoi An caters gracefully to every travel style.",
      "1. Old Town & Riverside Precinct: Ideal for travelers who want to immerse themselves in the evening lantern magic. Walking distance to the Japanese Covered Bridge, night markets, and hundreds of tailor shops and riverside bistros.",
      "2. Cam Chau & Cam Thanh (Rice Paddies & Coconut Forests): Perfect for bicycle lovers and nature seekers. Quiet eco-lodges and boutique boutique villas surrounded by water coconut waterways and green fields.",
      "3. An Bang Beach & Cua Dai: Just a 10-minute bicycle ride from the Old Town, offering beachfront villas, surf cafes, and soothing ocean breezes."
    ],
    paragraphsVi: [
      "Hội An được du khách quốc tế bình chọn là một trong những điểm đến có dịch vụ lưu trú quyến rũ và mến khách nhất Đông Nam Á. Dù bạn muốn thức giấc bên đồng lúa xanh ngát, nghỉ ngơi trong căn nhà cổ rêu phong 200 năm tuổi, hay thư giãn tại khu nghỉ dưỡng ven biển An Bàng sang trọng, Hội An đều đáp ứng trọn vẹn.",
      "1. Khu phố cổ & Ven sông Hoài: Lựa chọn hàng đầu để đắm chìm vào không gian lung linh đèn lồng về đêm. Vài bước chân là đến Chùa Cầu, chợ đêm, các tiệm may đo lụa là và quán cà phê ven sông.",
      "2. Cẩm Châu & Cẩm Thanh (Đồng lúa & Rừng dừa): Thích hợp cho du khách yêu thiên nhiên, đạp xe dạo quanh bờ kênh xanh mát và trải nghiệm chèo thuyền thúng rừng dừa Bảy Mẫu.",
      "3. Bãi biển An Bàng & Cửa Đại: Chỉ cách phố cổ 4km, tập trung các khu nghỉ dưỡng cao cấp, homestay sát biển và các quán bar ven bờ sóng rì rào."
    ],
    highlightsEn: [
      "Ancient Town: Heritage villas, lantern-lit streets, walking convenience.",
      "Cam Chau / Cam Thanh: Peaceful countryside villas, rice paddy views, eco-resorts.",
      "An Bang Beach: Sandy shores, beach bars, seafood restaurants, water sports."
    ],
    highlightsVi: [
      "Phố cổ Hội An: Khách sạn boutique cổ kính, thuận tiện dạo bộ ngắm đèn lồng.",
      "Cẩm Châu / Cẩm Thanh: Resort sinh thái ven đồng lúa, yên bình và đậm chất đồng quê.",
      "Biển An Bàng: Nghỉ dưỡng sát biển, ngắm bình minh và thưởng thức hải sản tươi ngon."
    ],
  },
  foods: {
    titleEn: "8 must-try foods in Hoi An",
    titleVi: "8 món ăn phải thử tại Hội An",
    badgeEn: "Culinary Highlights",
    badgeVi: "Đặc sản ẩm thực",
    img: "/guide/hoian/hoian-8-foods-hd.jpg",
    paragraphsEn: [
      "Hoi An's cuisine is a magnificent melting pot of ancient Vietnamese traditions, Cham influences, and culinary contributions from centuries of international trade with Chinese, Japanese, and Western merchants.",
      "1. Cao Lau: The undisputed crown jewel of Hoi An. Made with thick, chewy noodles soaked in lye water from Cham island wood ashes, paired with savory char siu pork, crispy fried dough squares, and fragrant herbs from Tra Que village.",
      "2. Mi Quang: Wide turmeric-tinted noodles in rich, aromatic broth with shrimp, pork ribs, quail eggs, topped with roasted peanuts and crunchy toasted rice crackers.",
      "3. Banh Mi Hoi An: Made famous globally by Anthony Bourdain at Banh Mi Phuong and Madam Khanh (The Banh Mi Queen), loaded with pate, roasted pork, pickled papaya, and secret herbal sauces.",
      "4. Banh Bao Banh Vac ('White Rose Dumplings'): Translucent rice dumplings shaped like delicate white roses, filled with minced spiced shrimp and pork, crowned with crispy shallots.",
      "5. Com Ga Hoi An (Hoi An Chicken Rice): Fragrant yellow rice cooked in rich chicken broth, topped with hand-shredded free-range chicken, onion, herbs, and spicy chili jam.",
      "6. Banh Beo: Delicate steamed rice cakes served in tiny ceramic saucers, topped with savory minced pork and shrimp paste, fried shallots, and crispy pork rinds.",
      "7. Banh Xeo & Nem Lui: Crispy golden rice crepes wrapped in fresh mustard greens and dipped into a signature savory peanut-liver dipping sauce.",
      "8. Che Bap (Sweet Corn Pudding): Made from sweet baby corn harvested along the fertile alluvium of the Thu Bon River, finished with rich coconut cream."
    ],
    paragraphsVi: [
      "Ẩm thực Hội An là sự giao thoa kỳ diệu giữa văn hóa truyền thống xứ Quảng cùng dấu ấn thương cảng quốc tế sầm uất với thương nhân Trung Hoa, Nhật Bản và phương Tây suốt nhiều thế kỷ:",
      "1. Cao Lầu: Linh hồn ẩm thực phố cổ. Sợi mì dai giòn ngâm nước tro củi Cù Lao Chàm, ăn kèm thịt xá xíu đậm đà, tóp mỡ chiên giòn rụm và rau sống Trà Quế thơm lừng.",
      "2. Mì Quảng: Sợi mì vàng óng màu nghệ, nước lèo ngọt thanh từ tôm thịt sườn non, rắc đậu phộng rang bùi béo và bánh tráng mè nướng giòn.",
      "3. Bánh mì Hội An: Danh tiếng vươn tầm thế giới (Bánh mì Phượng, Madam Khánh), vỏ bánh giòn tan ngập tràn pate béo ngậy, thịt xá xíu, dưa góp và sốt gia truyền đặc sắc.",
      "4. Bánh bao bánh vạc (Bông hồng trắng): Bánh bột gạo trong veo như cánh hoa hồng, nhân tôm thịt đậm đà, rắc hành phi vàng ươm chấm nước mắm ớt thanh tao.",
      "5. Cơm gà Hội An: Cơm nấu bằng nước luộc gà vàng ươm óng ả, thịt gà ta xé phay bóp gỏi hành tây chua ngọt cay nồng vị tương ớt phố Hội.",
      "6. Bánh bèo chén: Bánh bèo đổ trong từng chén sành nhỏ xíu, nhân tôm thịt xào sánh mịn, tóp mỡ giòn rụm chấm nước mắm cay ngọt hấp dẫn.",
      "7. Bánh xèo & Nem lụi: Vỏ bánh giòn rụm cuốn bánh tráng, rau rừng chấm nước sốt tương đậu phộng gan heo béo bùi trứ danh.",
      "8. Chè bắp Cẩm Nam: Nấu từ bắp non ngọt thơm phù sa sông Thu Bồn, chan nước cốt dừa béo ngậy ngọt lành."
    ],
    highlightsEn: [
      "Cao Lau: Quan Cao Lau Ba Be, Cao Lau Thanh (26 Thai Phien).",
      "Chicken Rice: Com Ga Ba Buoi (22 Phan Chu Trinh), Com Ga Ty.",
      "Banh Mi: Banh Mi Phuong (2B Phan Chu Trinh), Madam Khanh (115 Tran Cao Van).",
      "White Rose: Nha hang Bong Hong Trang (533 Hai Ba Trung)."
    ],
    highlightsVi: [
      "Cao Lầu ngon: Cao Lầu Bá Lễ, Cao Lầu Thanh (26 Thái Phiên).",
      "Cơm gà: Cơm gà Bà Buội (22 Phan Chu Trinh), Cơm gà Ty.",
      "Bánh mì: Bánh mì Phượng (2B Phan Chu Trinh), Madam Khánh (115 Trần Cao Vân).",
      "Bánh bao bánh vạc: Nhà hàng Bông Hồng Trắng (533 Hai Bà Trưng)."
    ],
  },
  miQuang: {
    titleEn: "Mi Quang Hoi An",
    titleVi: "Mì Quảng Phố Hội",
    badgeEn: "Quang Nam Signature",
    badgeVi: "Đặc sản xứ Quảng",
    img: "/guide/hoian/hoian-mi-quang-hd.jpg",
    paragraphsEn: [
      "Mi Quang is the culinary pride of Quang Nam province. Served with just a ladle of rich, savory broth, this dish features flat turmeric-tinted rice noodles paired with shrimp, pork, chicken, or snakehead fish.",
      "A proper bowl is crowned with roasted crushed peanuts, scallions, crispy sesame rice crackers, and a mountain of wild herbs including shredded banana blossoms, water mint, and lettuce.",
      "Mix well with a squeeze of fresh lime and spicy local chili jam for the authentic flavor explosion."
    ],
    paragraphsVi: [
      "Mì Quảng là niềm tự hào ẩm thực của người dân đất Quảng. Khác với phở hay bún bò, mì Quảng chỉ chan một vá nước lèo đậm đà vừa đủ làm ướt sợi mì dẻo dai màu vàng nghệ óng ả.",
      "Tô mì đầy đặn tôm tươi, thịt ba chỉ rim hoặc thịt gà ta săn chắc, trứng cút, rắc đậu phộng rang giòn thơm và bánh tráng mè nướng giòn rụm bẻ nhỏ.",
      "Ăn kèm đĩa rau sống đa dạng gồm bắp chuối thái mỏng, cải non, rau húng, vắt thêm lát chanh và thìa ớt rim cay nồng để cảm nhận trọn vẹn phong vị mộc mạc mà đượm tình xứ Quảng."
    ],
    highlightsEn: [
      "Best spots: Mi Quang Ong Hai (6A Truong Minh Luong), Mi Quang Ba Minh (Cam Ha).",
      "Price range: 30,000 – 45,000 VND per bowl."
    ],
    highlightsVi: [
      "Quán ngon gợi ý: Mì Quảng Ông Hai (6A Trương Minh Lượng), Mì Quảng Bà Minh (Cẩm Hà).",
      "Giá cả: Chỉ từ 30.000 – 45.000 VNĐ/tô."
    ],
  },
  caoLau: {
    titleEn: "Cao Lau: The Legendary Heritage Noodle",
    titleVi: "Cao Lầu: Nét Độc Bản Ẩm Thực Phố Cổ",
    badgeEn: "Heritage Icon",
    badgeVi: "Món ngon di sản",
    img: "/guide/hoian/hoian-cao-lau-hd.jpg",
    paragraphsEn: [
      "Cao Lau is a culinary marvel that can truly only be authentic in Hoi An. According to centuries-old tradition, the firm chewy noodles must be prepared using lye water derived from ashes of medicinal wood harvested on the Cham Islands, mixed with sweet mineral water drawn exclusively from the ancient thousand-year-old Ba Le Well.",
      "The noodles are layered with tender slices of five-spice char siu pork, golden crunchy squares of fried noodle dough (ram), scallions, and fresh aromatic herbs sourced directly from Tra Que vegetable village.",
      "No other town in the world can replicate Cao Lau, making it an absolute must-try experience for every visitor setting foot in Hoi An."
    ],
    paragraphsVi: [
      "Cao Lầu là tuyệt tác ẩm thực chỉ có thể tìm thấy đúng hương vị nguyên bản duy nhất tại Hội An. Theo truyền thuyết nhiều thế kỷ, sợi mì dai giòn đặc trưng bắt buộc phải ngâm trong nước tro đốt từ củi cây rừng Cù Lao Chàm và nhào bằng nguồn nước ngầm ngọt lành từ Giếng cổ Bá Lễ nghìn năm tuổi.",
      "Tô Cao Lầu xếp từng lát thịt xá xíu đậm đà gia vị ngũ vị hương, rưới chút nước sốt rim thịt nâu sóng sánh, rắc tóp mỡ hoặc da heo chiên giòn tan (ram) và ăn kèm rau ghém làng rau Trà Quế tươi non thanh khiết.",
      "Hương vị đậm đà, giòn sần sật và béo bùi của Cao Lầu mang theo cả hồn cốt lịch sử của thương cảng Hội An cổ xưa."
    ],
    highlightsEn: [
      "Best spots: Cao Lau Thanh (26 Thai Phien), Cao Lau Ba Be (inside central market).",
      "Price range: 35,000 – 50,000 VND per bowl."
    ],
    highlightsVi: [
      "Quán ngon gợi ý: Cao Lầu Thanh (26 Thái Phiên), Cao Lầu Bà Bé (trong chợ Hội An).",
      "Giá cả: 35.000 – 50.000 VNĐ/tô."
    ],
  },
  banhMi: {
    titleEn: "Banh Mi Hoi An",
    titleVi: "Bánh Mì Hội An",
    badgeEn: "World Famous Sandwich",
    badgeVi: "Bánh mì nức tiếng thế giới",
    img: "/guide/hoian/hoian-banh-mi-hd.jpg",
    paragraphsEn: [
      "World-famous travel chefs like Anthony Bourdain once proclaimed Banh Mi Hoi An 'a symphony in a sandwich'. With a slender, extra-crisp crust that crackles at first touch, the inside remains tender, airy, and bursting with flavor.",
      "Every shop boasts a closely guarded family recipe for their velvety liver pate, rich homemade mayonnaise, char siu pork, jambon, and aromatic sweet-spicy chili glaze, balanced by fresh cucumber, cilantro, and pickled papaya.",
      "Whether you wait in line at Banh Mi Phuong or savor the artisan craft of Madam Khanh (The Banh Mi Queen), it is guaranteed to be one of the best sandwiches of your life."
    ],
    paragraphsVi: [
      "Đầu bếp danh tiếng thế giới Anthony Bourdain từng ca ngợi bánh mì Hội An là 'bản giao hưởng tuyệt hảo trong từng ổ bánh'. Vỏ bánh mì Hội An thon dài, nướng trên than hồng giòn rụm đến mức chạm nhẹ cũng vỡ vụn, ruột bánh xốp mềm thơm mùi bơ sữa.",
      "Mỗi tiệm bánh mì đều sở hữu bí quyết gia truyền độc nhất vô nhị về lớp pate gan mịn màng béo ngậy, sốt bơ trứng vàng ươm, thịt xá xíu rim mềm ngọt, chả lụa và nước sốt tương ớt Hội An cay nồng, cân bằng hoàn hảo cùng dưa leo, rau răm và đu đủ chua ngọt.",
      "Dù là Bánh mì Phượng hay Bánh mì Madam Khánh (The Banh Mi Queen), đây chắc chắn sẽ là một trong những chiếc bánh mì ngon nhất mà bạn từng thưởng thức."
    ],
    highlightsEn: [
      "Best spots: Banh Mi Phuong (2B Phan Chu Trinh), Madam Khanh (115 Tran Cao Van).",
      "Price range: 25,000 – 40,000 VND per sandwich."
    ],
    highlightsVi: [
      "Địa chỉ nổi tiếng: Bánh mì Phượng (2B Phan Chu Trinh), Bánh mì Madam Khánh (115 Trần Cao Vân).",
      "Giá cả: Từ 25.000 – 40.000 VNĐ/ổ ngập tràn nhân."
    ],
  },
};

export default function HoiAnPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("travel-guide");

  // Lightbox modal for Hoi An Tourist Map
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
    <div className="vnn-hoian-page">
      {/* ─── 1. TOP PROMO BANNER ─── */}
      <div
        className="vnn-hoian-top-banner"
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
      <header className="vnn-hoian-header" onMouseLeave={handleMenuLeave}>
        <div className="vnn-hoian-nav-inner">
          <Link href="/" className="vnn-hoian-logo-wrap">
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

          <ul className="vnn-hoian-nav-menu">
            {/* BE INSPIRED */}
            <li
              className="vnn-hoian-nav-item"
              onMouseEnter={() => handleMenuEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-hoian-nav-link ${activeMegaMenu === "inspired" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* DESTINATIONS */}
            <li
              className="vnn-hoian-nav-item"
              onMouseEnter={() => handleMenuEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-hoian-nav-link ${activeMegaMenu === "destinations" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-hoian-nav-item"
              onMouseEnter={() => handleMenuEnter("things")}
            >
              <button
                type="button"
                className={`vnn-hoian-nav-link ${activeMegaMenu === "things" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-hoian-nav-item"
              onMouseEnter={() => handleMenuEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-hoian-nav-link ${activeMegaMenu === "eat" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-hoian-nav-item"
              onMouseEnter={() => handleMenuEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-hoian-nav-link ${activeMegaMenu === "itineraries" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} />
              </button>
            </li>
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HeaderSearch />
          </div>
        </div>

        {/* ─── EXPANDABLE MEGA MENUS DROPDOWN ─── */}
        {activeMegaMenu && MEGA_MENUS_DATA[activeMegaMenu] && (
          <div
            className="vnn-hoian-megamenu-panel"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMenuLeave}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #ebebeb",
              boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
              zIndex: 999,
              padding: "24px 0",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div
              style={{
                maxWidth: "1240px",
                margin: "0 auto",
                padding: "0 24px",
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "18px",
              }}
            >
              {MEGA_MENUS_DATA[activeMegaMenu].items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textDecoration: "none",
                    color: "inherit",
                    group: "true",
                  }}
                  onClick={() => setActiveMegaMenu(null)}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 10",
                      borderRadius: "6px",
                      overflow: "hidden",
                      position: "relative",
                      marginBottom: "10px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                    {item.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          backgroundColor: "#00c2cb",
                          color: "#ffffff",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {translateBadge(item.badge, lang)}
                      </span>
                    )}
                  </div>
                  <h4
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      lineHeight: "1.4",
                      margin: "0 0 6px 0",
                      color: "#1a1a1a",
                    }}
                  >
                    {lang === "vi" ? item.titleVi : item.title}
                  </h4>
                  <span style={{ fontSize: "12px", color: "#888888" }}>
                    {lang === "vi" ? item.dateVi : item.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION (SCREENSHOT 1) ─── */}
      <section className="vnn-hoian-hero-section">
        <img
          src="/guide/hoian/hoian-hero-hd.jpg"
          alt="Hoi An Ancient Town"
          className="vnn-hoian-hero-bg"
        />
        <div className="vnn-hoian-hero-gradient" />

        <div className="vnn-hoian-hero-content">
          <div className="vnn-hoian-badges">
            <span className="vnn-hoian-badge">
              {lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
            </span>
            <span className="vnn-hoian-badge">
              {lang === "vi" ? "MIỀN TRUNG" : "CENTRAL VIETNAM"}
            </span>
            <span className="vnn-hoian-badge">
              {lang === "vi" ? "ĐIỂM ĐẾN HÀNG ĐẦU" : "TOP DESTINATIONS"}
            </span>
          </div>

          <h1 className="vnn-hoian-hero-title">Hoi An</h1>

          <div className="vnn-hoian-hero-meta">
            <span>By Welcome To Vietnam</span>
            <span>•</span>
            <span>
              {lang === "vi" ? "12 Tháng 11, 2024" : "November 12, 2024"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. QUICK NAVIGATION PILL BAR (SCREENSHOT 1 & 2) ─── */}
      <nav className="vnn-hoian-nav-pills-bar">
        <div className="vnn-hoian-pills-container">
          <a
            href="#travel-guide"
            className={`vnn-hoian-pill-btn ${activeTab === "travel-guide" ? "active" : ""}`}
            onClick={() => setActiveTab("travel-guide")}
          >
            <Compass size={15} />
            <span>{lang === "vi" ? "Cẩm nang du lịch" : "Travel guide"}</span>
          </a>
          <a
            href="#attractions"
            className={`vnn-hoian-pill-btn ${activeTab === "attractions" ? "active" : ""}`}
            onClick={() => setActiveTab("attractions")}
          >
            <MapPin size={15} />
            <span>{lang === "vi" ? "Điểm tham quan" : "Attractions"}</span>
          </a>
          <a
            href="#accommodation"
            className={`vnn-hoian-pill-btn ${activeTab === "accommodation" ? "active" : ""}`}
            onClick={() => setActiveTab("accommodation")}
          >
            <Calendar size={15} />
            <span>{lang === "vi" ? "Nơi lưu trú" : "Accommodation"}</span>
          </a>
          <a
            href="#food"
            className={`vnn-hoian-pill-btn ${activeTab === "food" ? "active" : ""}`}
            onClick={() => setActiveTab("food")}
          >
            <Sparkles size={15} />
            <span>{lang === "vi" ? "Ẩm thực" : "Food"}</span>
          </a>
        </div>
      </nav>

      {/* ─── 5. MAIN CONTENT AREA ─── */}
      <main className="vnn-hoian-main-container">
        {/* ─── HOI AN TRAVEL GUIDE (SCREENSHOT 2) ─── */}
        <section id="travel-guide" className="vnn-hoian-guide-section">
          <h2 className="vnn-hoian-guide-title">
            {lang === "vi" ? "Cẩm nang du lịch Hội An" : "Hoi An travel guide"}
          </h2>

          <div className="vnn-hoian-guide-intro">
            <p>
              {lang === "vi"
                ? "Nằm cách Đà Nẵng khoảng 30 km về phía nam, vẻ đẹp thanh bình và bề dày lịch sử ngàn năm của Phố cổ Hội An (tỉnh Quảng Nam) đã biến nơi đây thành điểm đến mơ ước của hàng triệu du khách trong nước và quốc tế."
                : "Located approximately 30 km south of Da Nang, the serene beauty and ancient history of Hoi An Ancient Town in Quang Nam Province have made it a highly desirable destination for both domestic and international tourists."}
            </p>
            <p>
              {lang === "vi"
                ? "Vào tháng 7 năm 2019, tạp chí du lịch danh tiếng thế giới Travel and Leisure đã vinh danh Hội An là thành phố tuyệt vời nhất thế giới, vượt qua cả Tokyo (Nhật Bản) và Chiang Mai (Thái Lan)."
                : "In July 2019, the well-known travel magazine Travel and Leisure named Hoi An the best city in the world, surpassing Tokyo, Japan, and Chiang Mai, Thailand."}
            </p>
            <p>
              {lang === "vi"
                ? "Bạn đã sẵn sàng để khám phá những nét quyến rũ vượt thời gian của đô thị cổ này chưa?"
                : "Are you ready to discover the charms of this ancient town?"}
            </p>
          </div>

          {/* Video Player Box (Screenshot 2) */}
          <div className="vnn-hoian-video-box">
            {isVideoPlaying ? (
              <iframe
                className="vnn-hoian-video-iframe"
                src="https://www.youtube.com/embed/Nm0T5lPAT7U?autoplay=1&rel=0"
                title="Hoi An Travel Guide Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="vnn-hoian-video-custom-thumb"
                onClick={() => setIsVideoPlaying(true)}
                role="button"
                tabIndex={0}
              >
                <img
                  src="/guide/hoian/hoian-best-time-hd.jpg"
                  alt="Hoi An Travel Guide Video Thumbnail"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "24px 28px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#00c2cb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "12px",
                      }}
                    >
                      V
                    </div>
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          color: "#fff",
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                      >
                        Hoi An: A Guide to Visiting the Most Beautiful Ancient Town
                      </h4>
                      <p style={{ margin: 0, fontSize: "12px", opacity: 0.85, color: "#fff" }}>
                        Welcome To Vietnam
                      </p>
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
                    HOI AN
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
                    <span style={{ opacity: 0.8 }}>14:20</span>
                  </div>
                </div>

                <div className="vnn-hoian-video-play-btn">
                  <Play size={24} fill="#fff" />
                </div>
              </div>
            )}
          </div>

          {/* Expand Accordion Button */}
          <div className="vnn-hoian-expand-wrap">
            <button
              className="vnn-hoian-expand-btn"
              onClick={() => setIsGuideExpanded(!isGuideExpanded)}
            >
              <span>
                {isGuideExpanded
                  ? lang === "vi"
                    ? "Thu gọn cẩm nang du lịch ▲"
                    : "Collapse Hoi An travel guide ▲"
                  : lang === "vi"
                    ? "Đọc thêm cẩm nang du lịch Hội An ▾"
                    : "Read more Hoi An travel guide ▾"}
              </span>
            </button>
          </div>

          {/* Expanded Guide Content */}
          {isGuideExpanded && (
            <div className="vnn-hoian-accordion-body">
              <div className="vnn-hoian-guide-subblock">
                <h3>{lang === "vi" ? "Vị trí địa lý Hội An" : "Where is Hoi An?"}</h3>
                <p>
                  {lang === "vi"
                    ? "Hội An nằm ở trung tâm tỉnh Quảng Nam thuộc vùng Duyên hải Nam Trung Bộ, cách Hà Nội khoảng 860 km về phía bắc và cách TP.HCM khoảng 865 km về phía nam. Vị trí đắc địa dọc trục Bắc - Nam đã biến Hội An thành đô thị văn hóa đa dạng, nơi giao thoa của các nền văn minh Đông - Tây. Năm 1999, Đô thị cổ Hội An được UNESCO chính thức công nhận là Di sản Văn hóa Thế giới."
                    : "Hoi An, located in the heart of Quang Nam Province in central Vietnam, is approximately 860 km from Hanoi to the north and 865 km from Ho Chi Minh City to the south. The architectural and cultural values of Hoi An Ancient Town were officially designated as a UNESCO World Cultural Heritage Site in 1999."}
                </p>
              </div>

              <div className="vnn-hoian-guide-subblock">
                <h3>{lang === "vi" ? "Thời điểm lý tưởng du lịch Hội An" : "When you should travel to Hoi An?"}</h3>
                <p>
                  {lang === "vi"
                    ? "Hội An có khí hậu nhiệt đới với 2 mùa rõ rệt: mùa khô từ tháng 2 đến tháng 8 và mùa mưa từ tháng 9 đến tháng 1 năm sau. Thời điểm lý tưởng nhất để du lịch Hội An là từ tháng 2 đến tháng 4, khi tiết trời ấm áp, nắng nhẹ, không mưa bão và ít ngập lụt."
                    : "Hoi An is situated in a tropical climate with two seasons: the dry season from February to August and the rainy season from September to January. The best time to visit is from February to April, when the weather is agreeable with minimal rain and pleasant temperatures."}
                </p>
              </div>

              <div className="vnn-hoian-guide-subblock">
                <h3>{lang === "vi" ? "Phương tiện di chuyển đến Hội An" : "How to get to Hoi An?"}</h3>
                <h4>
                  {lang === "vi"
                    ? "1. Di chuyển từ Hà Nội hoặc TP. Hồ Chí Minh"
                    : "1. Getting to Hoi An from Hanoi or Ho Chi Minh City"}
                </h4>
                <p>
                  {lang === "vi"
                    ? "Do Hội An không có sân bay riêng, du khách sẽ bay tới Sân bay Quốc tế Đà Nẵng (cách Hội An 30 km). Các hãng hàng không Vietnam Airlines, Vietjet Air, Bamboo Airways khai thác hàng chục chuyến bay mỗi ngày. Ngoài ra, bạn có thể đi tàu hỏa Bắc - Nam đến ga Đà Nẵng hoặc xe khách giường nằm chất lượng cao."
                    : "Fly into Da Nang International Airport (30 km away) via Vietnam Airlines, Vietjet Air, or Bamboo Airways. You can also take the scenic North-South railway train or luxury overnight sleeper buses."}
                </p>

                <h4>
                  {lang === "vi"
                    ? "2. Di chuyển từ Đà Nẵng đến Hội An"
                    : "2. Getting to Hoi An from Da Nang"}
                </h4>
                <ul>
                  <li>
                    <strong>{lang === "vi" ? "Xe buýt liên tỉnh LK02:" : "Bus route LK02:"}</strong>{" "}
                    {lang === "vi"
                      ? "Tuyến xe buýt công cộng thuận tiện đưa đón từ bến xe Đà Nẵng thẳng đến bến xe Hội An."
                      : "Public bus connecting central Da Nang directly to Hoi An station."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Taxi & Xe đưa đón sân bay:" : "Taxis & Private Airport Transfers:"}</strong>{" "}
                    {lang === "vi"
                      ? "Thời gian di chuyển chỉ khoảng 45 phút, chi phí từ 250.000 – 350.000 VNĐ."
                      : "Direct 45-minute ride costing 250,000 – 350,000 VND ($11–15 USD)."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Xe máy:" : "Motorbike:"}</strong>{" "}
                    {lang === "vi"
                      ? "Cung đường ven biển Võ Nguyên Giáp - Lạc Long Quân tuyệt đẹp kết nối thẳng đến biển An Bàng và phố cổ."
                      : "A scenic coastal road connects My Khe beach to An Bang beach and Hoi An."}
                  </li>
                </ul>
              </div>

              <div className="vnn-hoian-guide-subblock">
                <h3>{lang === "vi" ? "Top 5 trải nghiệm hấp dẫn tại Hội An" : "Top 5 exciting activities in Hoi An"}</h3>
                <ul>
                  <li>
                    <strong>{lang === "vi" ? "1. Xem show diễn 'Ký ức Hội An':" : "1. Watch the Hoi An Memories Show:"}</strong>{" "}
                    {lang === "vi"
                      ? "Vở đại cảnh thực cảnh hoành tráng trên sân khấu 25.000 m² với hơn 500 diễn viên tái hiện 400 năm lịch sử phố Hội."
                      : "World-class outdoor visual spectacle on a 25,000 m² stage with over 500 actors."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "2. Thả đèn hoa đăng sông Hoài:" : "2. Release paper flower lanterns:"}</strong>{" "}
                    {lang === "vi"
                      ? "Thả những chiếc đèn hoa đăng lung linh cầu chúc bình an và may mắn trên dòng sông Hoài thơ mộng."
                      : "Purchase colorful candlelit paper lanterns and set them adrift on the tranquil Hoai River."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "3. Chèo thuyền ngắm hoàng hôn sông Hoài:" : "3. Take an evening boat ride on Hoai River:"}</strong>{" "}
                    {lang === "vi"
                      ? "Thời điểm vàng từ 16h30 đến 17h30 để bắt trọn khoảnh khắc hoàng hôn rực rỡ và ánh đèn lồng thắp sáng hai bờ sông."
                      : "Best from 4:30 PM to 5:30 PM before sunset to see the town ignite in magical lantern light."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "4. Hát Bài Chòi & Trò chơi dân gian:" : "4. Join in traditional games (Bai Choi):"}</strong>{" "}
                    {lang === "vi"
                      ? "Di sản văn hóa phi vật thể của nhân loại với những câu hò vui tươi, rộn rã bên bờ sông Hoài mỗi tối."
                      : "UNESCO-recognized folk singing game performed with traditional instruments."}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "5. Nhâm nhi cà phê phố cổ:" : "5. Savor the coffee:"}</strong>{" "}
                    {lang === "vi"
                      ? "Thưởng thức ly cà phê sữa đá đậm đà tại Faifo Coffee, Mot Hoi An, hay Roastery trên những tầng thượng ngắm mái ngói âm dương rêu phong."
                      : "Sit on rooftop balconies overlooking mossy terracotta tile roofs at Faifo Coffee or Mot Hoi An."}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ─── 6. TOP ATTRACTIONS MOSAIC GRID (SCREENSHOT 3) ─── */}
        <section id="attractions" className="vnn-hoian-section">
          <div className="vnn-hoian-section-header">
            <h2 className="vnn-hoian-section-title">
              {lang === "vi" ? "Điểm tham quan tại Hội An" : "Top attractions in Hoi An"}
            </h2>
            <Link href="/guide/15-best-places-to-visit-in-vietnam-in-2026" className="vnn-hoian-view-all">
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </Link>
          </div>
          <div className="vnn-hoian-divider" />

          <div className="vnn-hoian-attractions-grid">
            {/* Card 1: Map (Large Left - 2 Rows) */}
            <div
              className="vnn-hoian-attraction-card large"
              onClick={() => setMapModalOpen(true)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              title={lang === "vi" ? "Click phóng to Bản đồ Du lịch Hội An" : "Click to view full HD Hoi An map"}
            >
              <img
                src="/guide/hoian/hoian-tourist-map-hd.jpg"
                alt="Hoi An Tourist Map"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "Bản đồ du lịch Hội An" : "Hoi An Tourist Map"}
                </h3>
              </div>
            </div>

            {/* Card 2: Must-Visit Attractions in Hoi An (Middle Top) */}
            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="vnn-hoian-attraction-card"
            >
              <img
                src="/guide/hoian/hoian-must-visit-attractions-hd.jpg"
                alt="Must-Visit Attractions in Hoi An"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi"
                    ? "Các điểm tham quan phải ghé tại Hội An"
                    : "Must-Visit Attractions in Hoi An"}
                </h3>
              </div>
            </Link>

            {/* Card 3: An Bang Beach (Right Top) */}
            <Link
              href="/guide/20-best-things-to-do-in-vietnam"
              className="vnn-hoian-attraction-card"
            >
              <img
                src="/guide/hoian/hoian-an-bang-beach-hd.jpg"
                alt="An Bang Beach"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "Bãi biển An Bàng" : "An Bang Beach"}
                </h3>
              </div>
            </Link>

            {/* Placeholder 1 (Middle Bottom) */}
            <div className="vnn-hoian-placeholder-card" />

            {/* Placeholder 2 (Right Bottom) */}
            <div className="vnn-hoian-placeholder-card" />
          </div>
        </section>

        {/* ─── 7. WHERE TO STAY IN HOI AN (SCREENSHOT 4) ─── */}
        <section id="accommodation" className="vnn-hoian-section">
          <div className="vnn-hoian-section-header">
            <h2 className="vnn-hoian-section-title">
              {lang === "vi" ? "Nơi lưu trú ở Hội An" : "Where to stay in Hoi An"}
            </h2>
            <button
              type="button"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.stay)}
              className="vnn-hoian-view-all"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="vnn-hoian-divider" />

          <div className="vnn-hoian-stay-grid">
            <div
              className="vnn-hoian-stay-card"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.stay)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Nơi lưu trú ở Hội An" : "View Where to stay in Hoi An"}
            >
              <img
                src="/guide/hoian/hoian-stay-hd.jpg"
                alt="Stay In Hoi An"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "Nghỉ dưỡng tại Hội An" : "Stay In Hoi An"}
                </h3>
              </div>
            </div>
            <div className="vnn-hoian-stay-placeholder" />
            <div className="vnn-hoian-stay-placeholder" />
          </div>
        </section>

        {/* ─── 8. MUST-TRY DISHES IN HOI AN (SCREENSHOT 5) ─── */}
        <section id="food" className="vnn-hoian-section">
          <div className="vnn-hoian-section-header">
            <h2 className="vnn-hoian-section-title">
              {lang === "vi" ? "Món ngon phải thử ở Hội An" : "Must-try dishes in Hoi An"}
            </h2>
            <button
              type="button"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.foods)}
              className="vnn-hoian-view-all"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="vnn-hoian-divider" />

          <div className="vnn-hoian-dishes-grid">
            {/* Card 1: 8 Must-try foods in Hoi An (Large Left - 3 Rows) */}
            <div
              className="vnn-hoian-dish-card large"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.foods)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem 8 món ăn phải thử tại Hội An" : "View 8 must-try foods in Hoi An"}
            >
              <img
                src="/guide/hoian/hoian-8-foods-hd.jpg"
                alt="8 must-try foods in Hoi An"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "8 món ăn phải thử tại Hội An" : "8 must-try foods in Hoi An"}
                </h3>
              </div>
            </div>

            {/* Card 2: Mi Quang (Right Top) */}
            <div
              className="vnn-hoian-dish-card"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.miQuang)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Mì Quảng Phố Hội" : "View Mi Quang"}
            >
              <img
                src="/guide/hoian/hoian-mi-quang-hd.jpg"
                alt="Mi Quang"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "Mì Quảng" : "Mi Quang"}
                </h3>
              </div>
            </div>

            {/* Card 3: Cao Lau (Right Middle) */}
            <div
              className="vnn-hoian-dish-card"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.caoLau)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Cao Lầu Hội An" : "View Cao Lau"}
            >
              <img
                src="/guide/hoian/hoian-cao-lau-hd.jpg"
                alt="Cao Lau"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "Cao Lầu" : "Cao Lau"}
                </h3>
              </div>
            </div>

            {/* Card 4: Banh Mi (Right Bottom) */}
            <div
              className="vnn-hoian-dish-card"
              onClick={() => setDetailModalItem(HOIAN_DETAILS.banhMi)}
              role="button"
              tabIndex={0}
              title={lang === "vi" ? "Xem chi tiết Bánh Mì Hội An" : "View Banh Mi"}
            >
              <img
                src="/guide/hoian/hoian-banh-mi-hd.jpg"
                alt="Banh Mi"
                className="vnn-hoian-card-img"
              />
              <div className="vnn-hoian-card-overlay">
                <h3 className="vnn-hoian-card-title">
                  {lang === "vi" ? "Bánh Mì" : "Banh Mi"}
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 9. TAGS SECTION (SCREENSHOT 5) ─── */}
        <div className="vnn-hoian-tags-section">
          <span className="vnn-hoian-tag-label">TAGS</span>
          <Link href="/#top-destinations" className="vnn-hoian-tag-pill">
            Destinations
          </Link>
        </div>

        <div className="vnn-hoian-divider" style={{ margin: "32px 0 44px 0" }} />

        {/* ─── 10. OTHER DESTINATIONS SECTION ─── */}
        <section className="vnn-hoian-section">
          <h3 className="vnn-hoian-other-dest-title">
            {lang === "vi" ? "Các Điểm Đến Khác" : "Other Destinations"}
          </h3>

          <div className="vnn-hoian-related-grid">
            {/* Card 1: Ho Chi Minh City */}
            <Link
              href="/province/ho-chi-minh"
              className="vnn-hoian-related-card"
            >
              <div className="vnn-hoian-related-img-wrap">
                <img
                  src="/guide/hoian/hoian-related-hcmc.jpg"
                  alt="Ho Chi Minh City"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-hoian-related-title">
                {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
              </h4>
            </Link>

            {/* Card 2: Nha Trang */}
            <Link
              href="/province/khanh-hoa"
              className="vnn-hoian-related-card"
            >
              <div className="vnn-hoian-related-img-wrap">
                <img
                  src="/guide/hoian/hoian-related-nhatrang.jpg"
                  alt="Nha Trang"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-hoian-related-title">
                {lang === "vi" ? "Nha Trang" : "Nha Trang"}
              </h4>
            </Link>

            {/* Card 3: Dalat */}
            <Link
              href="/province/dalat"
              className="vnn-hoian-related-card"
            >
              <div className="vnn-hoian-related-img-wrap">
                <img
                  src="/guide/hoian/hoian-related-dalat.jpg"
                  alt="Dalat"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-hoian-related-title">
                {lang === "vi" ? "Đà Lạt" : "Dalat"}
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
              className="home-footer__social-link"
              title="Facebook"
            >
              Facebook
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

      {/* ─── FLOATING AI COMPANION BUTTON (EXACT POSITION IN SCREENSHOT) ─── */}
      <div
        className="vnn-hoian-floating-ai"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        title={lang === "vi" ? "Trò chuyện với AI Companion" : "Chat with AI Companion"}
      >
        <img
          src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
          alt="AI Companion"
        />
      </div>

      {/* ─── AI CHATBOT MODAL ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        provinceName={lang === "vi" ? "Hội An (Quảng Nam)" : "Hoi An (Quang Nam)"}
      />

      {/* ─── LIGHTBOX MODAL FOR HOI AN TOURIST MAP ─── */}
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
                  ? "Bản đồ Du lịch Hội An (Độ nét cao)"
                  : "Hoi An Tourist Map (High Resolution)"}
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
                src="/guide/hoian/hoian-tourist-map-hd.jpg"
                alt="Hoi An Tourist Map Full HD"
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
          className="vnn-hoian-detail-backdrop"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="vnn-hoian-detail-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vnn-hoian-detail-close"
              onClick={() => setDetailModalItem(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="vnn-hoian-detail-hero">
              <img
                src={detailModalItem.img}
                alt={lang === "vi" ? detailModalItem.titleVi : detailModalItem.titleEn}
              />
              <div className="vnn-hoian-detail-hero-gradient" />
              <h2 className="vnn-hoian-detail-hero-title">
                {lang === "vi" ? detailModalItem.titleVi : detailModalItem.titleEn}
              </h2>
            </div>

            <div className="vnn-hoian-detail-content">
              <span className="vnn-hoian-detail-badge">
                {lang === "vi" ? detailModalItem.badgeVi : detailModalItem.badgeEn}
              </span>

              <div className="vnn-hoian-detail-paragraphs">
                {(lang === "vi"
                  ? detailModalItem.paragraphsVi
                  : detailModalItem.paragraphsEn
                ).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {((lang === "vi" && detailModalItem.highlightsVi) ||
                detailModalItem.highlightsEn) && (
                <div className="vnn-hoian-detail-highlights">
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
