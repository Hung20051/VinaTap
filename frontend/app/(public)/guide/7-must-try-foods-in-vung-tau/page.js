"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import { ChevronDown, Sparkles } from "lucide-react";
import "@/styles/home.css";
import "./vung-tau-food.css";

// ─── STANDARDIZED MEGAMENUS DATA ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "insp-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
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
    ],
  },
  destinations: {
    regions: [
      {
        name: "Miền Bắc",
        nameEn: "Northern Vietnam",
        provinces: [
          { name: "Hà Nội", slug: "ha-noi" },
          { name: "Hải Phòng", slug: "hai-phong" },
          { name: "Quảng Ninh", slug: "quang-ninh" },
          { name: "Ninh Bình", slug: "ninh-binh" },
          { name: "Hà Giang", slug: "ha-giang" },
          { name: "Lào Cai (Sa Pa)", slug: "lao-cai" },
          { name: "Cao Bằng", slug: "cao-bang" },
          { name: "Mai Châu (Hòa Bình)", slug: "hoa-binh" },
        ],
      },
      {
        name: "Miền Trung",
        nameEn: "Central Vietnam",
        provinces: [
          { name: "Đà Nẵng", slug: "da-nang" },
          { name: "Quảng Nam (Hội An)", slug: "hoi-an" },
          { name: "Thừa Thiên Huế", slug: "thua-thien-hue" },
          { name: "Khánh Hòa (Nha Trang)", slug: "khanh-hoa" },
          { name: "Lâm Đồng (Đà Lạt)", slug: "dalat" },
          { name: "Bình Định (Quy Nhơn)", slug: "binh-dinh" },
          { name: "Phú Yên", slug: "phu-yen" },
          { name: "Quảng Bình (Phong Nha)", slug: "quang-binh" },
        ],
      },
      {
        name: "Miền Nam",
        nameEn: "Southern Vietnam",
        provinces: [
          { name: "TP. Hồ Chí Minh", slug: "ho-chi-minh" },
          { name: "Bà Rịa - Vũng Tàu", slug: "ba-ria-vung-tau" },
          { name: "Kiên Giang (Phú Quốc)", slug: "kien-giang" },
          { name: "Cần Thơ", slug: "can-tho" },
          { name: "An Giang (Châu Đốc)", slug: "an-giang" },
          { name: "Bến Tre", slug: "ben-tre" },
          { name: "Tây Ninh", slug: "tay-ninh" },
          { name: "Cà Mau", slug: "ca-mau" },
        ],
      },
    ],
  },
  thingsToDo: {
    items: [
      {
        id: "th-1",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/todo-1.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "th-2",
        title: "8 Best Things to Do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/todo-2.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "th-3",
        title: "5 Best Beaches in Vung Tau",
        titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/todo-3.jpg",
        link: "/guide/5-best-vung-tau-beaches",
      },
      {
        id: "th-4",
        title: "Ao Dai: Vietnamese Traditional Dress",
        titleVi: "Áo Dài: Quốc phục truyền thống Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Culture",
        img: "/guide/megamenu/todo-4.jpg",
        link: "/guide/ao-dai-vietnamese-traditional-dress",
      },
    ],
  },
  eatDrink: {
    items: [
      {
        id: "eat-1",
        title: "Pho: The Complete Guide to Vietnam's National Dish",
        titleVi: "Phở: Cẩm nang trọn vẹn về quốc hồn ẩm thực Việt Nam",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/eat-1-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-2",
        title: "12 Must-Try Foods in Ho Chi Minh City",
        titleVi: "12 món ăn nhất định phải thử tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "8 Must-Try Foods in Hanoi",
        titleVi: "8 món ngon nức tiếng tại Hà Nội",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/eat-3-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-4",
        title: "5 Must-Try Nha Trang Dishes",
        titleVi: "5 món ăn đặc sản không thể bỏ qua tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/eat-4-nhatrang.jpg",
        link: "/guide/5-must-try-nha-trang-dishes",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-Week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-1-3weeks.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

// ─── 7 MUST-TRY VUNG TAU FOODS DATA (MATCHING SCREENSHOTS 4, 5) ───
const VUNG_TAU_7_DISHES = [
  {
    id: "hu-tieu-muc",
    index: 1,
    title: "1. Hu tieu muc (squid noodle soup)",
    titleVi: "1. Hủ tiếu mực (Squid noodle soup)",
    img: "/guide/vung-tau/food-1-hu-tieu-muc.jpg",
    alt: "Hu tieu muc - squid noodle soup Vung Tau",
    desc: (
      <>
        It&apos;s hard to say exactly when <em>hu tieu muc</em> became Vung Tau&apos;s signature dish, but it&apos;s definitely one you won&apos;t want to miss. <span className="vnn-link-highlight">Hu tieu</span> is a beloved noodle dish found all over Vietnam, but in Vung Tau, it&apos;s taken to the next level by adding fresh local seafood, creating this one-of-a-kind squid noodle soup. A bowl of <em>hu tieu muc</em> features chewy, thin noodles, rings of squid, 1-2 quail eggs, and an aromatic mix of green onions, cilantro, and pepper that fills the air with fragrance even before it reaches your table. It&apos;s served with bean sprouts, Vietnamese coriander, pickled radish, and a tangy seafood dipping sauce. What makes this dish so irresistible is the perfect harmony of the lightly sweet broth, smooth noodles, and slightly crunchy squid, all topped off with the refreshing, spicy, and sour sides.
      </>
    ),
    descVi: (
      <>
        Khó ai có thể nói chính xác <em>hủ tiếu mực</em> trở thành đặc sản biểu tượng của Vũng Tàu từ bao giờ, nhưng chắc chắn đây là món ăn bạn không thể bỏ lỡ. <span className="vnn-link-highlight">Hủ tiếu</span> vốn phổ biến khắp miền Nam, nhưng tại Vũng Tàu, nguồn hải sản tươi rói đã nâng tầm món ăn này với những con mực giòn sần sật. Một tô hủ tiếu mực nóng hổi với sợi hủ tiếu dai mềm, khoanh mực dày trắng phau ngọt lịm, 1-2 quả trứng cút cùng hành lá, ngò rí và tiêu thơm nức mũi. Món ăn được dọn kèm giá sống, rau thơm, củ cải ngâm chua và chén nước chấm muối ớt chanh hải sản đậm đà khó quên.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Don't forget to wash it down with a glass of iced tea or lime tea to cool off!",
    ],
    tipsVi: [
      "Đừng quên gọi thêm ly trà đá hoặc trà tắc mát lạnh để giải nhiệt sau khi thưởng thức tô hủ tiếu nóng hổi!",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Hu Tieu Muc Ong Map (97 Hoang Hoa Tham): 78,000 VND ($3.1)",
      "Hu Tieu Muc Ong Gia Cali (03 Le Hong Phong Extended Section): 79,000 VND",
    ],
    whereToTryVi: [
      "Hủ Tiếu Mực Ông Mập (97 Hoàng Hoa Thám): 78.000 VNĐ ($3.1)",
      "Hủ Tiếu Mực Ông Già Cali (03 Lê Hồng Phong nối dài): 79.000 VNĐ",
    ],
  },
  {
    id: "banh-khot",
    index: 2,
    title: "2. Banh khot (mini seafood pancakes)",
    titleVi: "2. Bánh khọt (Mini seafood pancakes)",
    img: "/guide/vung-tau/food-2-banh-khot.jpg",
    alt: "Banh khot - mini seafood pancakes Vung Tau",
    desc: (
      <>
        Among all the specialties in Vung Tau, <em>banh khot</em> might just be the most popular. These small, round pancakes are deep-fried to golden perfection and topped with a variety of seafood, especially baby squid and shrimp. Once crispy, the pancakes are served with fresh lettuce or green mustard leaves to wrap them up with herbs like perilla and basil, and then dipped into a tangy, sweet-sour fish sauce, with a bit of chili and pickled papaya on the side. Take a big bite, and you&apos;ll experience a burst of flavor in your mouth.
      </>
    ),
    descVi: (
      <>
        Trong danh sách các món đặc sản Vũng Tàu, <em>bánh khọt</em> chắc chắn giữ ngôi vị số 1 về độ nổi tiếng. Những chiếc bánh tròn xinh được chiên giòn rụm đến độ vàng ươm hoàn hảo, phủ lên trên là các loại hải sản tươi rói, đặc biệt là tôm biển và mực sữa. Khi ăn, gắp chiếc bánh nóng hổi cuộn chặt trong lá xà lách hoặc cải xanh cùng rau thơm, rồi chấm ngập vào bát nước mắm chua ngọt pha tỏi ớt kèm đu đủ ngâm giòn sần sật. Cắn một miếng lớn, bạn sẽ cảm nhận trọn vẹn hương vị bùng nổ trong khoang miệng.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Since this dish is a bit greasy, it's better suited for lunch or dinner rather than breakfast.",
    ],
    tipsVi: [
      "Vì bánh chiên dầu giòn ngậy nên sẽ thích hợp cho bữa trưa hoặc bữa tối hơn là bữa sáng sớm.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Banh Khot Co Ba (1 Hoang Hoa Tham): 70,000 VND",
      "Banh Khot Cay Tre (8B Luong Van Can): 65,000 VND",
    ],
    whereToTryVi: [
      "Bánh Khọt Cô Ba (1 Hoàng Hoa Thám): 70.000 VNĐ",
      "Bánh Khọt Cây Tre (8B Lương Văn Can): 65.000 VNĐ",
    ],
  },
  {
    id: "bun-rieu-tom",
    index: 3,
    title: "3. Bun rieu tom (shrimp noodle soup)",
    titleVi: "3. Bún riêu tôm (Shrimp noodle soup)",
    img: "/guide/vung-tau/food-3-bun-rieu-tom.jpg",
    alt: "Bun rieu tom - shrimp noodle soup Vung Tau",
    desc: (
      <>
        When most people think of <em>bun rieu</em>, they imagine a bowl of rice noodles with ground crab meat, known for its distinctive crab flavor. However, in Vung Tau, where rice fields are sparse, locals have turned to the bounty of the sea, creating a unique version with shrimp instead of crab, known as <em>bun rieu tom</em>. The shrimp is finely ground and mixed with minced pork, eggs, and spices, then cooked until it floats in savory chunks. This noodle dish is light, with a subtle seafood aroma, and can be paired with various dipping sauces like sweet-sour fish sauce or chili salt. Other common toppings include shelled snails, pork roll slices, and shrimp.
      </>
    ),
    descVi: (
      <>
        Khi nhắc đến <em>bún riêu</em>, hầu hết mọi người đều nghĩ đến riêu cua đồng với hương vị cua đặc trưng. Tuy nhiên tại Vũng Tàu, nơi đồng ruộng ít nhưng lại dồi dào tôm biển, người dân đã tạo nên phiên bản độc nhất vô nhị: <em>bún riêu tôm</em>. Tôm biển tươi được quết nhuyễn trộn cùng thịt nạc dăm, trứng và gia vị, nấu thành những tảng riêu tôm ngọt đậm đà nổi trên mặt nước dùng. Món bún này thanh nhẹ, mang hương vị đại dương tinh tế, ăn kèm các loại nước chấm mắm chua ngọt hoặc muối ớt. Các loại topping khác gồm ốc bóc vỏ, chả lụa và tôm tươi nguyên con.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Huyet, or blood cubes, are a common ingredient, but if you're not into it, you can ask the vendor to leave it out.",
    ],
    tipsVi: [
      "Huyết luộc là nguyên liệu phổ biến trong tô bún riêu, nhưng nếu bạn không quen ăn, hãy nhắn chủ quán bỏ qua.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Bun Rieu Tom Thuan Phuc (94 Hoang Hoa Tham): 65,000 VND",
      "Bun Rieu Tom 75 (75 Nguyen Truong To): 45,000 VND",
    ],
    whereToTryVi: [
      "Bún Riêu Tôm Thuận Phúc (94 Hoàng Hoa Thám): 65.000 VNĐ",
      "Bún Riêu Tôm 75 (75 Nguyễn Trường Tộ): 45.000 VNĐ",
    ],
  },
  {
    id: "hau-ne",
    index: 4,
    title: "4. Hau ne (sizzling oysters)",
    titleVi: "4. Hàu né (Sizzling oysters)",
    img: "/guide/vung-tau/food-4-hau-ne.jpg",
    alt: "Hau ne - sizzling oysters Vung Tau",
    desc: (
      <>
        A lesser-known but fascinating (and personally my favorite) dish in Vung Tau is <em>hau ne</em>. Think of it as the ocean&apos;s answer to <em>bo ne</em> (sizzling steak), a breakfast favorite among locals and expats. Plump oysters are bathed in a savory tomato sauce and runny egg and served sizzling hot straight from the cast-iron pan. The dish comes with crusty bread, making it a truly hearty and delicious dining experience.
      </>
    ),
    descVi: (
      <>
        Một món ăn ít phổ biến hơn với du khách phương xa nhưng cực kỳ lôi cuốn là <em>hàu né</em>. Hãy tưởng tượng đây là phiên bản biển khơi của món bò né trứ danh. Những con hàu sữa béo ngậy được đun sôi trong sốt cà chua tiêu đen đậm đà và trứng ốp la lòng đào, phục vụ ngay trên chảo gang reo xèo xèo bốc khói nghi ngút. Món ăn dọn kèm bánh mì nóng giòn rụm, mang đến trải nghiệm ăn uống vô cùng ấm áp và thỏa mãn.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "You can also explore other mouthwatering oyster dishes in Vung Tau, like hot oyster porridge (chao hau) or oysters grilled with green scallion oil and roasted peanuts (hau nuong mo hanh).",
    ],
    tipsVi: [
      "Bạn cũng có thể khám phá thêm các món hàu hấp dẫn khác tại Vũng Tàu như cháo hàu ấm bụng hoặc hàu nướng mỡ hành đậu phộng béo ngậy.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Hau Ne Tam Nguyen (03 Hoang Dieu): 47,000 VND (~$1.9)",
      "Quan Hao Long Son (Quoc Lo 51, Long Son): 50,000 VND",
    ],
    whereToTryVi: [
      "Hàu Né Tâm Nguyên (03 Hoàng Diệu): 47.000 VNĐ (~$1.9)",
      "Quán Hàu Long Sơn (Quốc lộ 51, Long Sơn): 50.000 VNĐ",
    ],
  },
  {
    id: "lau-ca-duoi",
    index: 5,
    title: "5. Lau ca duoi (stingray hotpot)",
    titleVi: "5. Lẩu cá đuối (Stingray hotpot)",
    img: "/guide/vung-tau/food-5-lau-ca-duoi.jpg",
    alt: "Lau ca duoi - stingray hotpot Vung Tau",
    desc: (
      <>
        For dinner, nothing hits the spot like a hot, tangy, and spicy pot of <em>lau ca duoi</em> (stingray hotpot), especially on a windy evening by the coast. Stingray is a bit of a picky taste because of its strong odor, but Vung Tau&apos;s hotpot version is made more approachable by carefully cooking it with sour bamboo shoots, herbs, and a rich broth. The dish is kept warm on the stove and served with rice noodles and fresh veggies, while the dipping sauce is all about fish sauce and chili. If you love bold flavors and spicy dishes, this hotpot will definitely hit your taste buds.
      </>
    ),
    descVi: (
      <>
        Vào buổi tối, không gì tuyệt vời hơn một nồi <em>lẩu cá đuối</em> chua cay nóng hổi, đặc biệt trong những buổi tối gió biển mát rượi. Cá đuối có thịt mềm ngọt và sụn giòn sần sật, được người dân Vũng Tàu nấu khéo léo cùng măng chua, cà chua, ngò gai và me tạo nên thứ nước lèo chua thanh đậm đà, khử sạch mùi tanh. Nồi lẩu sôi sùng sục trên bếp, ăn kèm bún tươi, đĩa rau muống bắp chuối và chén nước mắm ớt hiểm cay nồng.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Hotpot is traditionally a communal feast – make sure to bring friends or family along to share the generous pot and savor the breezy coastal night!",
    ],
    tipsVi: [
      "Lẩu là món ăn dành cho đông người – hãy rủ bạn bè hoặc gia đình cùng quây quần bên nồi lẩu để tận hưởng trọn vẹn không khí đêm phố biển!",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Lau Ca Duoi Ba Sau (158 Ha Long): 250,000 VND (~$10.0)",
      "Lau Ca Duoi Co Hoa (61B Phan Chu Trinh): 150,000 VND (~$6.0)",
    ],
    whereToTryVi: [
      "Lẩu Cá Đuối Bà Sáu (158 Hạ Long): 250.000 VNĐ (~$10.0)",
      "Lẩu Cá Đuối Cô Hoa (61B Phan Chu Trinh): 150.000 VNĐ (~$6.0)",
    ],
  },
  {
    id: "cha-gio-ca-trich",
    index: 6,
    title: "6. Cha gio ca trich (herring fish spring rolls)",
    titleVi: "6. Chả giò cá trích (Herring fish spring rolls)",
    img: "/guide/vung-tau/food-6-cha-gio-ca-trich.jpg",
    alt: "Cha gio ca trich - herring fish spring rolls Vung Tau",
    desc: (
      <>
        Yes, you heard it right! In Vung Tau, people roll spring rolls with herring fish, and oh my, it&apos;s unbelievably delicious. Herring is a nutritious fish with a strong flavor, and thanks to the skillful fishermen and creative chefs, this dish has a unique taste. The fish is filleted, marinated with traditional spices, then mixed with cassava and red radish before being tightly rolled in thin rice paper. The spring rolls are deep-fried until golden and crispy on the outside. When eating, you roll them in fresh greens and rice paper: the freshness of the veggies balances the rich, crispy spring rolls, dipped in a sweet and sour fish sauce. It&apos;s perfect for adding fiber and enjoying on hot days when a bowl of soup is just too much to handle.
      </>
    ),
    descVi: (
      <>
        Đúng vậy, tại Vũng Tàu, người ta cuốn chả giò bằng cá trích biển tươi rói, và hương vị của nó thì ngon khó cưỡng. Cá trích giàu dinh dưỡng được phi lê sạch xương, tẩm ướp cùng gia vị, trộn cùng củ sắn và cà rốt bào sợi rồi cuộn chặt trong lớp bánh tráng mỏng. Chả giò được chiên ngập dầu đến khi vàng ruộm. Khi ăn cuốn cùng bánh tráng dẻo, xà lách, rau rừng rồi chấm vào chén nước mắm chua ngọt hoặc tương đậu phộng béo bùi, ăn mãi không ngấy.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Enjoy them with a generous amount of fresh herbs and wild leaves to perfectly balance the rich, crispy texture of the fried rolls.",
    ],
    tipsVi: [
      "Hãy cuốn cùng thật nhiều rau rừng và rau sống tươi để cân bằng hoàn hảo vị giòn béo của chả giò rán!",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Chang Cha Gio (43 Mac Dinh Chi): 70,000 VND (~$2.8)",
    ],
    whereToTryVi: [
      "Chàng Chả Giò (43 Mạc Đĩnh Chi): 70.000 VNĐ (~$2.8)",
    ],
  },
  {
    id: "banh-bong-lan-trung-muoi",
    index: 7,
    title: "7. Banh bong lan trung muoi (salted egg sponge cake)",
    titleVi: "7. Bánh bông lan trứng muối (Salted egg sponge cake)",
    img: "/guide/vung-tau/food-7-banh-bong-lan-trung-muoi.jpg",
    alt: "Banh bong lan trung muoi - salted egg sponge cake Vung Tau",
    desc: (
      <>
        If you&apos;re craving something sweet after all these savory dishes, <em>banh bong lan trung muoi</em> (salted egg sponge cake) is the perfect treat to end your meal. This simple yet addictive cake features a soft, fluffy sponge with a subtle egg flavor, topped with cheese, shredded pork floss, and salted egg. Despite its simplicity, this dessert will have you craving another bite, and another! The cakes are usually sold in sets of 10, each about the size of a spoonful, making them ideal for snacking on the go or as a souvenir gift.
      </>
    ),
    descVi: (
      <>
        Sau khi đã thỏa thê với các món mặn hải sản cay nồng, <em>bánh bông lan trứng muối</em> là món ngọt hoàn hảo để khép lại bữa ăn. Đây cũng là món quà ăn vặt trứ danh mà hầu như ai ghé Vũng Tàu cũng mua về làm quà. Cốt bánh bông lan nướng than xốp mềm mịn màng, thơm ngậy mùi bơ trứng, bên trên là lòng đỏ trứng muối bùi bùi mằn mặn, phô mai dẻo quánh cùng lớp chà bông heo tơi xốp hòa quyện tạo nên vị ngon khó cưỡng.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "These cakes are best eaten fresh! They can be kept in the fridge for 3-5 days, or 1-2 days at room temperature in a cool place.",
    ],
    tipsVi: [
      "Bánh ngon nhất khi ăn trong ngày; nếu mua làm quà có thể để ở nhiệt độ phòng thoáng mát 1-2 ngày hoặc trong tủ lạnh 3-5 ngày.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Banh Bong Lan Goc Cot Dien (17B Nguyen Truong To): 45,000 VND (~$1.8)",
      "Golden Bakery (195 Le Hong Phong): 35,000 VND (~$1.4)",
    ],
    whereToTryVi: [
      "Bánh Bông Lan Gốc Cột Điện (17B Nguyễn Trường Tộ): 45.000 VNĐ (~$1.8)",
      "Golden Bakery (195 Lê Hồng Phong): 35.000 VNĐ (~$1.4)",
    ],
  },
];

export default function VungTauFoodGuidePage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isVi = lang === "vi";

  return (
    <div className="vnn-article-page">
      {/* ── Top Companion Banner (Screenshot 3) ── */}
      <div className="vnn-top-banner">
        <div className="vnn-top-banner__container">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-top-banner__link"
          >
            <img
              src="/guide/top-banner-companion.png"
              alt="Vietnam Travel Companion"
              className="vnn-top-banner__img"
            />
          </a>
        </div>
      </div>

      {/* ── Sticky Standard Navbar ── */}
      <header
        className="vnn-navbar"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="vnn-navbar__inner">
          <Link href="/" className="vnn-navbar__brand">
            <div className="vnn-navbar__brand-vinatap">
              <Logo size={32} showText={false} noLink href={null} as="span" />
              <span>VinaTap</span>
            </div>
          </Link>

          <ul className="vnn-navbar__menu">
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("inspired")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "inspired" ? "is-active" : ""}`}
              >
                <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("destinations")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "destinations" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("thingsToDo")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "thingsToDo" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("eatDrink")}
            >
              <button
                type="button"
                className={`vnn-navbar__link is-active`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("itineraries")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "itineraries" ? "is-active" : ""}`}
              >
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <HeaderSearch />
            <LanguageSwitch />
          </div>
        </div>

        {/* ─── MEGAMENU DROPDOWN ─── */}
        {activeMegaMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="vnn-megamenu__inner">
              {activeMegaMenu === "destinations" ? (
                <div className="vnn-megamenu__grid vnn-megamenu__grid--regions">
                  {MEGA_MENUS_DATA.destinations.regions.map((region, idx) => (
                    <div key={idx} className="vnn-megamenu__region-col">
                      <h4 className="vnn-megamenu__region-title">
                        {isVi ? region.name : region.nameEn}
                      </h4>
                      <ul className="vnn-megamenu__province-list">
                        {region.provinces.map((prov) => (
                          <li key={prov.slug}>
                            <Link
                              href={`/province/${prov.slug}`}
                              className="vnn-megamenu__province-link"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              {prov.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vnn-megamenu__grid">
                  {MEGA_MENUS_DATA[activeMegaMenu]?.items?.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="vnn-megamenu__card"
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      <div className="vnn-megamenu__img-wrap">
                        <img
                          src={item.img}
                          alt={isVi ? item.titleVi : item.title}
                          className="vnn-megamenu__img"
                          loading="lazy"
                        />
                        <span className="vnn-megamenu__badge">{item.badge}</span>
                      </div>
                      <div className="vnn-megamenu__card-body">
                        <span className="vnn-megamenu__date">
                          {isVi ? item.dateVi : item.date}
                        </span>
                        <h4 className="vnn-megamenu__card-title">
                          {isVi ? item.titleVi : item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── FULL-BLEED HERO BANNER (SCREENSHOT 3) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag">ARTICLES</span>
            <span className="vnn-fullbleed-hero__tag">EAT & DRINK</span>
            <span className="vnn-fullbleed-hero__tag">VUNG TAU</span>
          </div>

          <h1 className="vnn-fullbleed-hero__title">
            {isVi ? "7 món ăn nhất định phải thử ở Vũng Tàu" : "7 must-try foods in Vung Tau"}
          </h1>

          <p className="vnn-fullbleed-hero__byline">
            {isVi
              ? "Bởi Welcome to Vietnam   1 Tháng 4, 2025"
              : "By Welcome to Vietnam   April 1, 2025"}
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT (SCREENSHOTS 3, 4, 5) ── */}
      <main className="vnn-container">
        {/* Pill Button: Create your Vietnam trip in seconds */}
        <div className="vnn-pill-cta-wrap">
          <button
            type="button"
            className="vnn-pill-cta-btn"
            onClick={() => setAiCompanionOpen(true)}
          >
            <Sparkles size={16} />
            <span>
              {isVi
                ? "Tạo chuyến đi Việt Nam của bạn trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </button>
        </div>

        {/* Lead Introduction Paragraph */}
        <div className="vnn-article-lead">
          <p>
            {isVi ? (
              <>
                Vũng Tàu là điểm đến yêu thích của đông đảo du khách trong và ngoài nước, không chỉ nhờ vị trí thuận tiện (chỉ khoảng 2 giờ lái xe từ trung tâm{" "}
                <Link href="/province/ho-chi-minh" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                  TP. Hồ Chí Minh
                </Link>
                ) mà còn bởi nền ẩm thực vô cùng phong phú và độc đáo. Hãy cùng Welcome to Vietnam khám phá 7 món ăn địa phương nhất định phải thử khi bạn ghé thăm Vũng Tàu.
              </>
            ) : (
              <>
                Vung Tau is a favorite destination for many travelers, both domestic and international, not just because of its convenient location (only about a 2-hour drive from{" "}
                <Link href="/province/ho-chi-minh" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                  Ho Chi Minh City
                </Link>{" "}
                center) but also due to its incredibly diverse and unique cuisine. Join Welcome to Vietnam as we explore 7 must-try local foods when you visit Vung Tau.
              </>
            )}
          </p>
        </div>

        {/* ── 7 DISHES LISTING (SCREENSHOTS 4, 5) ── */}
        <div className="vnn-dishes-list">
          {VUNG_TAU_7_DISHES.map((dish) => (
            <article key={dish.id} id={dish.id} className="vnn-dish-item">
              <h2 className="vnn-dish-title">
                {isVi ? dish.titleVi : dish.title}
              </h2>

              <div className="vnn-dish-layout">
                {/* Left Column: Dish Image */}
                <div className="vnn-dish-img-col">
                  <img
                    src={dish.img}
                    alt={dish.alt}
                    className="vnn-dish-img"
                    loading="lazy"
                  />
                </div>

                {/* Right Column: Dish Content */}
                <div className="vnn-dish-content-col">
                  <div className="vnn-dish-text">
                    {isVi ? dish.descVi : dish.desc}
                  </div>

                  <div className="vnn-dish-tips-block">
                    <strong className="vnn-dish-subhead">
                      {isVi ? dish.tipsTitleVi : dish.tipsTitle}
                    </strong>
                    <ul className="vnn-dish-bullets">
                      {(isVi ? dish.tipsVi : dish.tips).map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="vnn-dish-whereto-block">
                    <strong className="vnn-dish-subhead">
                      {isVi ? dish.whereToTryTitleVi : dish.whereToTryTitle}
                    </strong>
                    <ul className="vnn-dish-bullets">
                      {(isVi ? dish.whereToTryVi : dish.whereToTry).map((place, idx) => (
                        <li key={idx}>{place}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Closing Paragraph ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "36px 0 24px" }}>
          {isVi ? (
            <>
              7 món ăn kể trên đại diện cho văn hóa ẩm thực đặc sắc và phong phú của{" "}
              <Link href="/province/ba-ria-vung-tau" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                Vũng Tàu
              </Link>
              , kết hợp hài hòa giữa hải sản tươi ngon và nét mộc mạc của dải đất phương Nam. Hãy nhớ lưu lại danh sách này cho chuyến đi tiếp theo của bạn!
            </>
          ) : (
            <>
              The seven foods listed above highlight the rich culinary tradition of{" "}
              <Link href="/province/ba-ria-vung-tau" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                Vung Tau
              </Link>
              , blending fresh seafood with unique coastal flavors. If you visit this seaside town, make sure to taste these iconic dishes for an unforgettable gastronomic journey.
            </>
          )}
        </p>

        {/* ── Disclaimer Note ── */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#334155", margin: "0 0 28px" }}>
          <strong>Note:</strong>{" "}
          {isVi
            ? "Các đề xuất nhà hàng chỉ dựa trên trải nghiệm của tác giả; giá cả thực tế có thể thay đổi tùy thời điểm."
            : "Restaurant recommendations are only suggestions based on the authors' experiences; prices may vary."}
        </p>

        {/* ── Tags ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "24px 0 40px", flexWrap: "wrap" }}>
          <span
            style={{
              background: "#00c2cb",
              color: "#ffffff",
              padding: "5px 14px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            TAGS
          </span>
          <Link
            href="/province/ba-ria-vung-tau"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Vung Tau
          </Link>
          <Link
            href="/guide/7-must-try-foods-in-vung-tau"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Vung Tau Foods
          </Link>
        </div>

        {/* ── Divider ── */}
        <hr style={{ border: 0, height: "1px", background: "#e2e8f0", margin: "40px 0" }} />

        {/* ── Related Articles ── */}
        <section style={{ margin: "40px 0 60px" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "26px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "32px",
            }}
          >
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            <Link
              href="/guide/5-best-vung-tau-beaches"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/vung-tau/hero-vung-tau-beaches.jpg"
                  alt="5 Best Vung Tau Beaches"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "5 bãi biển đẹp nhất tại Vũng Tàu" : "5 Best Vung Tau Beaches"}
              </h3>
            </Link>

            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/megamenu/eat-2-hcmc.jpg"
                  alt="12 must-try foods in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "12 món ăn nhất định phải thử tại TP. Hồ Chí Minh" : "12 must-try foods in Ho Chi Minh City"}
              </h3>
            </Link>

            <Link
              href="/guide/8-must-try-foods-in-hanoi"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/megamenu/eat-3-hanoi.jpg"
                  alt="8 must-try foods in Hanoi"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "8 món ăn nhất định phải thử ở Hà Nội" : "8 must-try foods in Hanoi"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ── PUBLIC FOOTER FROM HOMEPAGE ── */}
      <PublicFooter lang={lang} />

      {/* ── FLOATING PROVINCE CHATBOT ── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        province={{
          name: isVi ? "Bà Rịa - Vũng Tàu" : "Ba Ria - Vung Tau",
          slug: "ba-ria-vung-tau",
        }}
      />
    </div>
  );
}
