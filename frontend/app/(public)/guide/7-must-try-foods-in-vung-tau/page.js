"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  Share2,
  MapPin,
  Lightbulb,
  CheckCircle,
  Sparkles,
  Maximize2,
  X,
} from "lucide-react";
import "@/styles/home.css";
import "./vung-tau-food.css";

// ─── MEGAMENUS DATA (STANDARDIZED VNN EDITORIAL NAVBAR) ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
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
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
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
        date: "October 11, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  thingsToDo: {
    items: [
      {
        id: "todo-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 11, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "todo-2",
        title: "10 Best Things to Do in HCMC",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP.HCM",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "todo-3",
        title: "5 Best Vung Tau Beaches",
        titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
        link: "/guide/5-best-vung-tau-beaches",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "10 Best Things to Do in Dalat",
        titleVi: "10 trải nghiệm tuyệt nhất tại Đà Lạt",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to Do",
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
        titleVi: "8 món ăn phải thử tại Hà Nội",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn nhất định phải thử ở Vũng Tàu",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/vung-tau/7-must-try-foods-vung-tau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
      {
        id: "eat-3",
        title: "8 must-try foods in Dalat",
        titleVi: "8 món ăn phải thử tại Đà Lạt",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "eat-4",
        title: "8 must-try foods in Hoi An",
        titleVi: "8 món ăn phải thử tại Hội An",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "eat-5",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 11, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "itin-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "itin-4",
        title: "10 Best Things to Do in HCMC",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP.HCM",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "itin-5",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
    ],
  },
};

// ─── 7 VUNG TAU DISHES DATA ───
const VUNG_TAU_DISHES = [
  {
    id: "hu-tieu-muc",
    index: 1,
    name: "Hu tieu muc (squid noodle soup)",
    nameVi: "Hủ tiếu mực (Squid noodle soup)",
    tag: "Đặc sản biển",
    tagEn: "Coastal specialty",
    img: "/guide/vung-tau/food-1-hu-tieu-muc.jpg",
    caption: "Tô hủ tiếu mực đầy đặn mực tươi giòn sần sật và nước dùng ngọt thanh",
    captionEn: "A hearty bowl of hu tieu muc with fresh crunchy squid and sweet broth",
    desc:
      "It’s hard to say exactly when hu tieu muc became Vung Tau’s signature dish, but it’s definitely one you won’t want to miss. Hu tieu is a beloved noodle dish found all over Vietnam, but in Vung Tau, it's taken to the next level by adding fresh local seafood, creating this one-of-a-kind squid noodle soup. A bowl of hu tieu muc features chewy, thin noodles, rings of squid, 1-2 quail eggs, and an aromatic mix of green onions, cilantro, and pepper that fills the air with fragrance even before it reaches your table. It’s served with bean sprouts, Vietnamese coriander, pickled radish, and a tangy seafood dipping sauce. What makes this dish so irresistible is the perfect harmony of the lightly sweet broth, smooth noodles, and slightly crunchy squid, all topped off with the refreshing, spicy, and sour sides.",
    descVi:
      "Khó ai có thể nói chính xác hủ tiếu mực trở thành đặc sản biểu tượng của Vũng Tàu từ bao giờ, nhưng chắc chắn đây là món ăn bạn nhất định không thể bỏ lỡ khi ghé thăm phố biển. Hủ tiếu vốn phổ biến khắp miền Nam, nhưng tại Vũng Tàu, nguồn hải sản tươi rói đã nâng tầm món ăn này lên một đẳng cấp hoàn toàn mới. Một tô hủ tiếu mực nóng hổi với những sợi hủ tiếu dai mềm đặc trưng, mực lá xắt khoanh dày trắng phau ngọt lịm, trứng cút bùi béo cùng hành lá, ngò rí và tiêu thơm nức mũi. Món ăn được dọn kèm đĩa giá sống, rau tần ô (cải cúc), củ cải ngâm chua và chén nước chấm muối ớt chanh hải sản chua cay đậm đà khó quên.",
    tip: "Don’t forget to wash it down with a glass of iced tea (trà đá) or lime tea (trà tắc) to cool off after enjoying the hot spicy broth!",
    tipVi: "Đừng quên gọi thêm ly trà đá hoặc trà tắc mát lạnh để giải nhiệt sau khi thưởng thức tô hủ tiếu nóng hổi, cay tê đầu lưỡi!",
    places: [
      {
        name: "Hủ Tiếu Mực Ông Mập",
        address: "97 Hoàng Hoa Thám, P. Thắng Tam, TP. Vũng Tàu",
        price: "78,000 VND (~$3.1)",
      },
      {
        name: "Hủ Tiếu Mực Ông Già Cali",
        address: "03 Lê Hồng Phong (nối dài), P. Thắng Tam, TP. Vũng Tàu",
        price: "79,000 VND (~$3.2)",
      },
    ],
  },
  {
    id: "banh-khot",
    index: 2,
    name: "Banh khot (mini seafood pancakes)",
    nameVi: "Bánh khọt (Mini seafood pancakes)",
    tag: "Món ăn quốc dân",
    tagEn: "Most iconic",
    img: "/guide/vung-tau/food-2-banh-khot.jpg",
    caption: "Bánh khọt Vũng Tàu vàng ruộm, tôm mực tươi rói ăn kèm rau rừng",
    captionEn: "Crispy golden banh khot topped with fresh shrimp and herbs",
    desc:
      "Among all the specialties in Vung Tau, banh khot might just be the most popular. These small, round pancakes are deep-fried to golden perfection in specialized cast-iron molds and topped with a variety of seafood, especially baby squid and fresh ocean shrimp. Once crispy, the pancakes are served with fresh lettuce or green mustard leaves to wrap them up with herbs like perilla and basil, and then dipped into a tangy, sweet-sour fish sauce, with a bit of chili and pickled papaya on the side. Take a big bite, and you’ll experience a burst of flavor in your mouth.",
    descVi:
      "Trong danh sách các món ngon Vũng Tàu, bánh khọt chắc chắn giữ ngôi vị số 1 về độ nổi tiếng và được du khách yêu thích nhất. Những chiếc bánh tròn xinh được đổ trong khuôn đất hoặc khuôn gang lửa hồng, chiên giòn rụm lớp vỏ ngoài vàng ươm nhưng lòng bánh vẫn giữ được độ mềm mịn béo bùi của nước cốt dừa. Nhân bánh thường là tôm biển tươi rói còn nguyên đuôi hoặc mực sữa giòn ngọt. Khi ăn, gắp chiếc bánh nóng hổi cuộn chặt trong lá cải xanh, xà lách, rau diếp cá, kinh giới rồi chấm ngập vào bát nước mắm chua ngọt pha tỏi ớt kèm đu đủ ngâm giòn sần sật.",
    tip: "Since this dish is deep-fried and a bit greasy, it’s best suited for a leisurely lunch or dinner rather than a light breakfast.",
    tipVi: "Bánh chiên ngập dầu giòn rụm nên rất thích hợp cho bữa trưa hoặc bữa tối no nê, tránh ăn quá no vào bữa sáng sớm.",
    places: [
      {
        name: "Bánh Khọt Cô Ba Vũng Tàu",
        address: "01 Hoàng Hoa Thám, P. 3, TP. Vũng Tàu",
        price: "70,000 VND (~$2.8)",
      },
      {
        name: "Bánh Khọt Cây Tre",
        address: "8B Lương Văn Can, P. 2, TP. Vũng Tàu",
        price: "65,000 VND (~$2.6)",
      },
      {
        name: "Bánh Khọt Gốc Vú Sữa",
        address: "14 Nguyễn Trường Tộ, P. 2, TP. Vũng Tàu",
        price: "60,000 - 80,000 VND",
      },
    ],
  },
  {
    id: "bun-rieu-tom",
    index: 3,
    name: "Bun rieu tom (shrimp noodle soup)",
    nameVi: "Bún riêu tôm (Shrimp noodle soup)",
    tag: "Độc đáo miền biển",
    tagEn: "Unique coastal flavor",
    img: "/guide/vung-tau/food-3-bun-rieu-tom.jpg",
    caption: "Tô bún riêu tôm Vũng Tàu với tảng riêu tôm biển thơm ngậy đậm đà",
    captionEn: "Rich shrimp noodle soup with dense savory ocean shrimp dumplings",
    desc:
      "When most people think of bun rieu, they imagine a bowl of rice noodles with ground crab meat, known for its distinctive crab flavor. However, in Vung Tau, where rice fields are sparse, locals have turned to the bounty of the sea, creating a unique version with shrimp instead of crab, known as bun rieu tom. The shrimp is finely ground and mixed with minced pork, eggs, and spices, then cooked until it floats in savory chunks. This noodle dish is light, with a subtle seafood aroma, and can be paired with various dipping sauces like sweet-sour fish sauce or chili salt. Other common toppings include shelled snails, pork roll slices, and whole fresh shrimp.",
    descVi:
      "Nhắc tới bún riêu, người ta thường nghĩ ngay đến riêu cua đồng của đồng bằng Bắc Bộ hay Nam Bộ. Thế nhưng tại Vũng Tàu, thiếu đồng ruộng trũng nhưng lại dồi dào tôm biển tươi, người dân địa phương đã sáng tạo nên món bún riêu tôm độc nhất vô nhị. Thịt tôm biển tươi được quết nhuyễn trộn cùng thịt nạc dăm, trứng gà và hành tiêu gia vị, tạo nên những tảng riêu tôm vàng cam béo ngậy, ngọt lịm tự nhiên. Nước dùng nấu từ vỏ tôm và xương thanh ngọt dịu, ăn kèm tôm nõn luộc, chả cá, ốc bươu hoặc ốc móng tay bóc vỏ giòn sần sật.",
    tip: "Huyet (blood cubes) are a traditional ingredient in the bowl; if you prefer not to eat them, simply ask the staff to leave them out when ordering!",
    tipVi: "Huyết luộc là thành phần quen thuộc trong tô bún riêu miền Nam; nếu không quen ăn, bạn chỉ cần nhắn phục vụ không lấy huyết là được!",
    places: [
      {
        name: "Bún Riêu Tôm Thuận Phúc",
        address: "94 Hoàng Hoa Thám, P. Thắng Tam, TP. Vũng Tàu",
        price: "63,000 VND (~$2.5)",
      },
    ],
  },
  {
    id: "hau-ne",
    index: 4,
    name: "Hau ne (sizzling oysters)",
    nameVi: "Hàu né (Sizzling oysters with baguette)",
    tag: "Món ngon đường phố",
    tagEn: "Local street hit",
    img: "/guide/vung-tau/food-4-hau-ne.jpg",
    caption: "Hàu né chảo gang sôi xèo xèo cùng phô mai, trứng ốp la và bánh mì nóng giòn",
    captionEn: "Sizzling cast-iron oysters with rich sauce, eggs, and crispy bread",
    desc:
      "A lesser-known but fascinating (and personally my favorite) dish in Vung Tau is hau ne. Think of it as the ocean’s answer to bo ne (sizzling steak), a breakfast favorite among locals and expats. Plump oysters are bathed in a savory tomato sauce and runny egg and served sizzling hot straight from the cast-iron pan. The dish comes with crusty bread, making it a truly hearty and delicious dining experience.",
    descVi:
      "Được xem là 'phiên bản biển khơi' của món bò né nức tiếng, hàu né là một trong những món ăn đường phố hấp dẫn bậc nhất Vũng Tàu. Những con hàu sữa béo núc ních, tươi rói được xếp lên chiếc chảo gang hình con bò đang nóng rực trên bếp than, rưới đẫm sốt cà chua tiêu đen hoặc sốt me cay ngọt, đập thêm quả trứng ốp la lòng đào và chút phô mai béo ngậy. Chảo hàu vừa bưng ra bàn vẫn còn reo xèo xèo thơm ngào ngạt, chấm cùng ổ bánh mì nóng giòn rụm thì không gì tuyệt bằng.",
    tip: "You can also explore other mouthwatering oyster dishes in Vung Tau, like hot oyster porridge (cháo hàu) or oysters grilled with green scallion oil and roasted peanuts (hàu nướng mỡ hành).",
    tipVi: "Bạn cũng có thể thử thêm các món cháo hàu ấm bụng hoặc hàu nướng mỡ hành đậu phộng, hàu nướng phô mai tan chảy tại các quán ốc đêm.",
    places: [
      {
        name: "Hàu Né Tâm Nguyên",
        address: "03 Hoàng Diệu, P. 1, TP. Vũng Tàu",
        price: "47,000 VND (~$1.9)",
      },
    ],
  },
  {
    id: "lau-ca-duoi",
    index: 5,
    name: "Lau ca duoi (stingray hotpot)",
    nameVi: "Lẩu cá đuối (Stingray hotpot)",
    tag: "Đỉnh cao bữa tối",
    tagEn: "Dinner highlight",
    img: "/guide/vung-tau/food-5-lau-ca-duoi.jpg",
    caption: "Nồi lẩu cá đuối sôi sùng sục bên đĩa bún tươi và rau bắp chuối thái mỏng",
    captionEn: "Bubbling stingray hotpot paired with sour bamboo shoots and fresh herbs",
    desc:
      "For dinner, nothing hits the spot like a hot, tangy, and spicy pot of lau ca duoi (stingray hotpot), especially on a windy evening by the coast. Stingray is a bit of a picky taste because of its strong odor, but Vung Tau’s hotpot version is made more approachable by carefully cooking it with sour bamboo shoots, herbs, and a rich broth. The dish is kept warm on the stove and served with rice noodles and fresh veggies, while the dipping sauce is all about fish sauce and chili. If you love bold flavors and spicy dishes, this hotpot will definitely hit your taste buds.",
    descVi:
      "Khi hoàng hôn buông xuống và những cơn gió biển mát rượi thổi qua từng góc phố, không gì tuyệt vời hơn khi tụ tập quanh nồi lẩu cá đuối sôi sùng sục, bốc khói nghi ngút. Cá đuối là loài cá biển đặc biệt: thịt ngọt mềm như lụa nhưng phần sụn lại giòn rụm có thể nhai cả xương. Người Vũng Tàu khéo léo nấu cá đuối cùng măng chua, cà chua, ngò gai, bắp chuối bào và me chua tạo nên thứ nước lèo chua cay thanh mát, hoàn toàn khử sạch mùi tanh. Gắp miếng cá đuối chấm vào chén nước mắm nhĩ ớt hiểm cay nồng rồi ăn cùng bún tươi thì ngon quên lối về.",
    tip: "Hotpot is traditionally a communal feast – make sure to bring friends or family along to share the generous pot and savor the breezy coastal night!",
    tipVi: "Lẩu là món ăn gia đình và hội nhóm; hãy rủ bạn bè quây quần bên nồi lẩu nóng hổi để cảm nhận trọn vẹn không khí đêm phố biển!",
    places: [
      {
        name: "Lẩu Cá Đuối Bà Sáu",
        address: "158 Hạ Long, P. 2, TP. Vũng Tàu",
        price: "250,000 VND (~$10.0)",
      },
      {
        name: "Lẩu Cá Đuối Cô Hoa",
        address: "61B Phan Chu Trinh, P. 2, TP. Vũng Tàu",
        price: "150,000 VND (~$6.0)",
      },
      {
        name: "Lẩu Cá Đuối Hoàng Minh",
        address: "44 Trương Công Định, P. 3, TP. Vũng Tàu",
        price: "180,000 - 250,000 VND",
      },
    ],
  },
  {
    id: "cha-gio-ca-trich",
    index: 6,
    name: "Cha gio ca trich (herring fish spring rolls)",
    nameVi: "Chả giò cá trích (Herring spring rolls)",
    tag: "Đặc sản sáng tạo",
    tagEn: "Creative delight",
    img: "/guide/vung-tau/food-6-cha-gio-ca-trich.jpg",
    caption: "Chả giò cá trích chiên vàng rụm cuốn bánh tráng rau rừng tươi non",
    captionEn: "Crisp golden herring spring rolls wrapped in fresh herbs and rice paper",
    desc:
      "Yes, you heard it right! In Vung Tau, people roll spring rolls with herring fish, and oh my, it’s unbelievably delicious. Herring is a nutritious fish with a strong flavor, and thanks to the skillful fishermen and creative chefs, this dish has a unique taste. The fish is filleted, marinated with traditional spices, then mixed with cassava and red radish before being tightly rolled in thin rice paper. The spring rolls are deep-fried until golden and crispy on the outside. When eating, you roll them in fresh greens and rice paper: the freshness of the veggies balances the rich, crispy spring rolls, dipped in a sweet and sour fish sauce. It’s perfect for adding fiber and enjoying on hot days when a bowl of soup is just too much to handle.",
    descVi:
      "Đúng vậy, bạn không nghe nhầm đâu! Tại Vũng Tàu, người ta cuốn chả giò bằng cá trích biển tươi rói, và hương vị của nó thì ngon khó cưỡng. Cá trích là loài cá giàu dinh dưỡng, thịt béo thơm đặc trưng. Các đầu bếp phố biển đã khéo léo phi lê tách xương sạch sẽ, tẩm ướp cùng gia vị thảo mộc, trộn cùng củ sắn (củ đậu) bào sợi và cà rốt để giữ độ ẩm ngọt rồi cuộn tròn trong lớp bánh tráng mỏng. Chả giò được chiên ngập dầu đến khi vàng ruộm. Khi ăn cuốn cùng bánh tráng dẻo, xà lách, rau rừng, chuối chát rồi chấm vào chén tương đậu phộng béo bùi pha mắm chua ngọt, ăn hoài không ngấy.",
    tip: "Enjoy them with a generous amount of fresh herbs and wild leaves to perfectly balance the rich, crispy texture of the fried rolls.",
    tipVi: "Hãy cuốn cùng thật nhiều rau rừng và rau thơm để vị tươi mát cân bằng hoàn hảo độ giòn béo của cuốn chả giò rán!",
    places: [
      {
        name: "Chàng Chả Giò",
        address: "43 Mạc Đĩnh Chi, P. 4, TP. Vũng Tàu",
        price: "70,000 VND (~$2.8)",
      },
    ],
  },
  {
    id: "banh-bong-lan-trung-muoi",
    index: 7,
    name: "Banh bong lan trung muoi (salted egg sponge cake)",
    nameVi: "Bánh bông lan trứng muối (Salted egg sponge cake)",
    tag: "Quà lưu niệm số 1",
    tagEn: "Top edible souvenir",
    img: "/guide/vung-tau/food-7-banh-bong-lan-trung-muoi.jpg",
    caption: "Những chiếc bánh bông lan trứng muối phô mai nướng than hoa thơm nức mũi",
    captionEn: "Fluffy charcoal-baked sponge cakes topped with salted egg and melted cheese",
    desc:
      "If you’re craving something sweet after all these savory dishes, banh bong lan trung muoi (salted egg sponge cake) is the perfect treat to end your meal. This simple yet addictive cake features a soft, fluffy sponge with a subtle egg flavor, topped with cheese, shredded pork floss, and salted egg. Despite its simplicity, this dessert will have you craving another bite, and another! The cakes are usually sold in sets of 10, each about the size of a spoonful, making them ideal for snacking on the go or as a souvenir gift.",
    descVi:
      "Sau khi đã thỏa thê với các món mặn hải sản cay nồng, bánh bông lan trứng muối chính là cái kết ngọt ngào và trọn vẹn nhất cho chuyến hành trình ẩm thực Vũng Tàu. Đây cũng là món quà lưu niệm ăn được nổi tiếng nhất mà hầu như bất kỳ ai trở về từ Vũng Tàu cũng xách theo vài hộp. Cốt bánh bông lan nướng bằng than hoa truyền thống nở phồng vàng óng, xốp mềm mịn màng và thơm ngậy mùi bơ trứng. Phía trên là lòng đỏ trứng muối mằn mặn bùi bùi, miếng phô mai con bò cười dẻo quánh cùng lớp chà bông (ruốc) thịt heo tơi xốp hòa quyện tạo nên vị ngon khó cưỡng.",
    tip: "These cakes are best eaten fresh! They can be kept in the fridge for 3-5 days, or 1-2 days at room temperature in a cool place.",
    tipVi: "Bánh ngon nhất khi ăn trong ngày; nếu mua làm quà bạn có thể để nhiệt độ phòng 1-2 ngày hoặc bảo quản tủ lạnh 3-5 ngày.",
    places: [
      {
        name: "Bánh Bông Lan Gốc Cột Điện",
        address: "17B Nguyễn Trường Tộ, P. 2, TP. Vũng Tàu",
        price: "45,000 VND (~$1.8)",
      },
      {
        name: "Golden Bakery",
        address: "195 Lê Hồng Phong, P. 8, TP. Vũng Tàu",
        price: "35,000 VND (~$1.4)",
      },
      {
        name: "Bánh Tấn Phát",
        address: "131 Lập Định, P. 2, TP. Vũng Tàu",
        price: "40,000 VND (~$1.6)",
      },
    ],
  },
];

// ─── RELATED ARTICLES (STANDARDIZED TO 2026) ───
const RELATED_ARTICLES = [
  {
    title: "5 best Vung Tau beaches",
    titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
    date: "October 13, 2026",
    dateVi: "13 Tháng 10, 2026",
    badge: "Things to Do",
    badgeVi: "Trải nghiệm",
    img: "/guide/vung-tau/hero-vung-tau-beaches.jpg",
    link: "/guide/5-best-vung-tau-beaches",
  },
  {
    title: "12 must-try foods in Ho Chi Minh City",
    titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
    date: "October 13, 2026",
    dateVi: "13 Tháng 10, 2026",
    badge: "Eat & Drink",
    badgeVi: "Ẩm thực",
    img: "/guide/megamenu/eat-2-hcmc.jpg",
    link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
  },
  {
    title: "8 must-try foods in Hanoi",
    titleVi: "8 món ăn phải thử tại Hà Nội",
    date: "October 12, 2026",
    dateVi: "12 Tháng 10, 2026",
    badge: "Eat & Drink",
    badgeVi: "Ẩm thực",
    img: "/guide/megamenu/eat-1-hanoi.jpg",
    link: "/guide/8-must-try-foods-in-hanoi",
  },
];

export default function VungTauFoodGuidePage() {
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const menuTimerRef = useRef(null);

  // Sync language with global VinaTap prefs
  useEffect(() => {
    setLang(getLang() || "vi");

    const handleLangUpdated = (e) => {
      if (e.detail) setLang(e.detail);
    };

    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    const onStorage = (e) => {
      if (e.key === "vinatap_lang" && e.newValue) setLang(e.newValue);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Safe Scroll Progress indicator (RAF-throttled)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          if (totalScroll > 0) {
            setScrollProgress(
              Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100))
            );
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleMenuEnter = (menuKey) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMegaMouseEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage(
        lang === "vi"
          ? "Đã sao chép liên kết vào bộ nhớ tạm!"
          : "Article link copied to clipboard!"
      );
    }
  };

  const handleCopyAddress = (address) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setToastMessage(
        lang === "vi"
          ? `Đã sao chép địa chỉ: ${address}`
          : `Copied address: ${address}`
      );
    }
  };

  return (
    <div className="vnn-article-page">
      {/* ── Reading Progress Bar ── */}
      <div
        className="vnn-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── Top Companion Banner ── */}
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
              alt="Vietnam Travel Companion 2026"
              className="vnn-top-banner__img"
            />
          </a>
        </div>
      </div>

      {/* ── Sticky Editorial Header Navbar ── */}
      <header className="vnn-navbar" onMouseLeave={handleMenuLeave}>
        <div className="vnn-navbar__inner">
          <Link href="/" className="vnn-navbar__brand">
            <div className="vnn-navbar__brand-vinatap">
              <Logo size={32} showText={false} noLink href={null} as="span" />
              <span>VinaTap</span>
            </div>
          </Link>

          <ul className="vnn-navbar__menu">
            {/* BE INSPIRED */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "inspired" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* DESTINATIONS */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "destinations" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("thingsToDo")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "thingsToDo" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "eat" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${
                  activeMenu === "itineraries" ? "is-active" : ""
                }`}
              >
                <span>{lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* ─── HOVER MEGAMENU CONTAINER ─── */}
        {activeMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="vnn-megamenu__grid">
              {(MEGA_MENUS_DATA[activeMenu]?.items || []).map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="vnn-megamenu__card"
                  onClick={() => setActiveMenu(null)}
                >
                  <div className="vnn-megamenu__thumb">
                    <img
                      src={item.img}
                      alt={lang === "vi" && item.titleVi ? item.titleVi : item.title}
                      className="vnn-megamenu__img"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="vnn-megamenu__badge">{item.badge}</span>
                    )}
                  </div>
                  <h4 className="vnn-megamenu__title">
                    {lang === "vi" && item.titleVi ? item.titleVi : item.title}
                  </h4>
                  <span className="vnn-megamenu__date">
                    {lang === "vi" && item.dateVi ? item.dateVi : item.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── FULL-BLEED HERO BANNER (ẢNH TO CẢ 1 HÀNG NGANG KHÔNG CÁCH) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag vnn-fullbleed-hero__tag--primary">
              {lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}
            </span>
            <span className="vnn-fullbleed-hero__tag">VŨNG TÀU</span>
            <span className="vnn-fullbleed-hero__tag">
              {lang === "vi" ? "CẨM NANG 2026" : "2026 GUIDE"}
            </span>
          </div>

          <h1 className="vnn-fullbleed-hero__title">
            {lang === "vi"
              ? "7 món ăn nhất định phải thử ở Vũng Tàu"
              : "7 Must-Try Foods in Vung Tau and Where to Eat Them"}
          </h1>

          <div className="vnn-fullbleed-hero__meta">
            <span className="vnn-fullbleed-hero__author">VinaTap Editorial</span>
            <span className="vnn-fullbleed-hero__dot">•</span>
            <span>{lang === "vi" ? "111 Tháng 10, 2026" : "October 14, 2026"}</span>
            <span className="vnn-fullbleed-hero__dot">•</span>
            <span>{lang === "vi" ? "6 phút đọc" : "6 mins read"}</span>
            <span className="vnn-fullbleed-hero__dot">•</span>
            <button
              type="button"
              onClick={handleShare}
              className="vnn-meta-share-btn"
              title="Share article"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "13.5px",
              }}
            >
              <Share2 size={15} />
              <span>{lang === "vi" ? "Chia sẻ" : "Share"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Editorial Content Section ── */}
      <main className="vnn-container">

        {/* Primary CTA Button to Tripion.ai */}
        <div className="vnn-pill-cta-wrap">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-pill-cta-btn"
          >
            <Sparkles size={18} />
            <span>
              {lang === "vi"
                ? "Lên kế hoạch du lịch Vũng Tàu chỉ trong 30 giây"
                : "Create your Vietnam trip in seconds with AI"}
            </span>
          </a>
        </div>

        {/* Lead Introduction */}
        <div className="vnn-article-lead">
          {lang === "vi" ? (
            <p>
              <strong>Vũng Tàu</strong> là điểm đến cuối tuần yêu thích của đông
              đảo du khách trong và ngoài nước. Không chỉ sở hữu vị trí địa lý đắc
              địa (chỉ cách trung tâm TP. Hồ Chí Minh khoảng 2 giờ lái xe), nơi
              đây còn làm say lòng người bởi nền ẩm thực ven biển phong phú, tươi
              rói và vô cùng độc đáo. Cùng <strong>VinaTap</strong> khám
              phá ngay <strong>7 món ăn đặc sản nhất định phải thử</strong> và
              danh sách các quán ăn uy tín nhất cho chuyến đi của bạn!
            </p>
          ) : (
            <p>
              <strong>Vung Tau</strong> is a favorite destination for both
              domestic and international travelers, not only for its convenient
              location (only about a 2-hour drive from Ho Chi Minh City center)
              but also for its incredibly diverse and unique coastal cuisine.
              Join <strong>VinaTap</strong> as we explore{" "}
              <strong>7 must-try local dishes</strong> along with the best verified
              eateries to bookmark for your trip!
            </p>
          )}
        </div>

        {/* ── 7 DETAILED DISH SECTIONS ── */}
        <div className="vnn-dishes-wrapper">
          {VUNG_TAU_DISHES.map((dish) => (
            <article key={dish.id} id={dish.id} className="vnn-dish-card">
              {/* Dish Header */}
              <div className="vnn-dish-header">
                <h2 className="vnn-dish-title">
                  {dish.index}. {lang === "vi" ? dish.nameVi : dish.name}
                </h2>
                <div className="vnn-dish-badges">
                  <span className="vnn-dish-badge vnn-dish-badge--sea">
                    {lang === "vi" ? dish.tag : dish.tagEn}
                  </span>
                  <span className="vnn-dish-badge">
                    {lang === "vi" ? "Vũng Tàu 2026" : "Vung Tau 2026"}
                  </span>
                </div>
              </div>

              {/* Dish 2-Column Layout */}
              <div className="vnn-dish-columns">
                {/* Left Column: Image with zoom lightbox */}
                <div className="vnn-dish-image-col">
                  <div
                    className="vnn-dish-image-wrap"
                    onClick={() =>
                      setLightboxImg({
                        src: dish.img,
                        caption: lang === "vi" ? dish.caption : dish.captionEn,
                      })
                    }
                  >
                    <img
                      src={dish.img}
                      alt={dish.name}
                      className="vnn-dish-img"
                      loading="lazy"
                    />
                    <div className="vnn-dish-img-overlay">
                      <Maximize2 size={18} />
                      <span>{lang === "vi" ? "Xem phóng to" : "Zoom photo"}</span>
                    </div>
                  </div>
                  <p className="vnn-dish-caption">
                    {lang === "vi" ? dish.caption : dish.captionEn}
                  </p>
                </div>

                {/* Right Column: Narrative, Tips & Places */}
                <div className="vnn-dish-body">
                  <p className="vnn-dish-desc">
                    {lang === "vi" ? dish.descVi : dish.desc}
                  </p>

                  {/* Local Insider Tip */}
                  <div className="vnn-tip-box">
                    <Lightbulb size={20} color="#ca8a04" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>{lang === "vi" ? "Bí quyết bản địa:" : "Local Tip:"} </strong>
                      <span>{lang === "vi" ? dish.tipVi : dish.tip}</span>
                    </div>
                  </div>

                  {/* Where to try list */}
                  <div className="vnn-places-box">
                    <h4 className="vnn-places-title">
                      <MapPin size={16} color="#00c2cb" />
                      <span>
                        {lang === "vi" ? "Địa chỉ quán ngon gợi ý:" : "Where to try:"}
                      </span>
                    </h4>
                    <ul className="vnn-places-list">
                      {dish.places.map((place, pIdx) => (
                        <li key={pIdx} className="vnn-place-item">
                          <div className="vnn-place-info">
                            <span className="vnn-place-name">{place.name}</span>
                            <span
                              className="vnn-place-address"
                              onClick={() => handleCopyAddress(place.address)}
                              style={{ cursor: "pointer" }}
                              title={
                                lang === "vi"
                                  ? "Nhấn để sao chép địa chỉ"
                                  : "Click to copy address"
                              }
                            >
                              <MapPin size={13} color="#94a3b8" />
                              <span>{place.address}</span>
                            </span>
                          </div>
                          <span className="vnn-place-price">{place.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Conclusion / Note */}
        <div
          style={{
            background: "#f0fbfb",
            border: "1px solid #b3eaea",
            borderRadius: "12px",
            padding: "24px 28px",
            margin: "40px 0",
            fontSize: "15.5px",
            lineHeight: "1.8",
            color: "#0f766e",
          }}
        >
          <p style={{ margin: "0 0 10px" }}>
            {lang === "vi" ? (
              <>
                Khám phá 7 món ngon trứ danh này chắc chắn sẽ mang đến cho bạn
                những trải nghiệm ẩm thực đa dạng, trọn vẹn và đậm đà phong vị
                miền biển. Đừng quên lưu lại danh sách này cho chuyến đi Vũng Tàu
                sắp tới nhé!
              </>
            ) : (
              <>
                Discovering these 7 delicious dishes will definitely enrich your
                travel experience with vibrant coastal memories. Make sure to
                bookmark these culinary gems for your upcoming getaway to Vung
                Tau!
              </>
            )}
          </p>
          <small style={{ color: "#64748b", fontStyle: "italic" }}>
            {lang === "vi"
              ? "* Lưu ý: Danh sách quán ăn dựa trên trải nghiệm thực tế và đánh giá của thực khách; mức giá có thể thay đổi nhẹ theo thời điểm."
              : "* Note: Recommendations are based on author experience and diner reviews; prices may vary slightly over time."}
          </small>
        </div>

        {/* Article Tags */}
        <div className="vnn-tags-section">
          <span style={{ fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>
            {lang === "vi" ? "Thẻ:" : "Tags:"}
          </span>
          <Link href="/province/ba-ria-vung-tau" className="vnn-tag-pill">
            {lang === "vi" ? "Ẩm thực Vũng Tàu" : "Vung Tau Food"}
          </Link>
          <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="vnn-tag-pill">
            {lang === "vi" ? "Ẩm thực đường phố Việt Nam" : "Vietnamese Street Food"}
          </Link>
          <Link href="/province/ba-ria-vung-tau" className="vnn-tag-pill">
            {lang === "vi" ? "Bà Rịa - Vũng Tàu" : "Ba Ria - Vung Tau"}
          </Link>
          <Link href="/guide/5-best-vung-tau-beaches" className="vnn-tag-pill">
            {lang === "vi" ? "Du lịch Vũng Tàu 2026" : "Vung Tau Travel 2026"}
          </Link>
        </div>

        {/* ── RELATED ARTICLES (LOWEST CONTENT POINT - NO FOOTER AS REQUESTED) ── */}
        <section className="vnn-related-section">
          <div className="vnn-related-header">
            <h3 className="vnn-related-title">
              {lang === "vi" ? "BÀI VIẾT LIÊN QUAN" : "RELATED ARTICLES"}
            </h3>
            <span className="vnn-related-bar" />
          </div>

          <div className="vnn-related-grid">
            {RELATED_ARTICLES.map((article, idx) => (
              <Link
                key={idx}
                href={article.link}
                className="vnn-related-card"
              >
                <div className="vnn-related-img-wrap">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="vnn-related-img"
                    loading="lazy"
                  />
                  <span className="vnn-related-badge">
                    {lang === "vi" ? (article.badgeVi || article.badge) : article.badge}
                  </span>
                </div>
                <div className="vnn-related-body">
                  <h4 className="vnn-related-card-title">
                    {lang === "vi" ? article.titleVi : article.title}
                  </h4>
                  <span className="vnn-related-date">
                    {lang === "vi" ? article.dateVi : article.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ── Lightbox Modal ── */}
      {lightboxImg && (
        <div
          className="vnn-lightbox-overlay"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="vnn-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vnn-lightbox-close"
              onClick={() => setLightboxImg(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <img
              src={lightboxImg.src}
              alt="Zoomed"
              className="vnn-lightbox-img"
            />
            {lightboxImg.caption && (
              <p className="vnn-lightbox-caption">{lightboxImg.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="vnn-toast" role="status">
          <CheckCircle size={18} color="#00c2cb" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Floating Province Chatbot (Bà Rịa - Vũng Tàu with Teal Theme) ── */}
      <ProvinceChatbot
        province={{
          name: lang === "vi" ? "Bà Rịa - Vũng Tàu" : "Ba Ria - Vung Tau",
          slug: "ba-ria-vung-tau",
        }}
      />
    </div>
  );
}
