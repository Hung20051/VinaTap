"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import { ChevronDown, Share2, ArrowLeft } from "lucide-react";
import "@/styles/home.css";
import "./hanoi-food.css";

// ─── MEGAMENUS DATA (CHUẨN TOÀN HỆ THỐNG LANDING PAGE) ───
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
        title: "Nha Trang",
        titleVi: "Nha Trang",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
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
        title: "10 Best Things to Do in Nha Trang",
        titleVi: "10 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Things to Do",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/province/khanh-hoa",
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
        title: "8 must-try foods in Dalat",
        titleVi: "8 món ăn phải thử tại Đà Lạt",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "eat-3",
        title: "8 must-try foods in Hoi An",
        titleVi: "8 món ăn phải thử tại Hội An",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "eat-4",
        title: "8 must-try foods in Nha Trang",
        titleVi: "8 món ăn phải thử tại Nha Trang",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/dest-4-nhatrang.jpg",
        link: "/province/khanh-hoa",
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
    ],
  },
};

// ─── 8 MÓN ĂN ĐẶC SẮC HÀ NỘI (THEO NGUYÊN BẢN VIETNAMNOMAD) ───
const HANOI_DISHES = [
  {
    num: "1",
    titleVi: "1. Phở Bò Hà Nội",
    titleEn: "1. Pho",
    image: "/guide/hanoi/hanoi-pho-hd.jpg",
    descVi:
      "Dù bạn có thể ăn phở ở bất kỳ nơi nào trên thế giới, nhưng bỏ lỡ phở tại Hà Nội sẽ là điều vô cùng đáng tiếc. Phở Hà Nội chú trọng giữ trọn vẹn hương vị nguyên bản của nguyên liệu: không rau thơm dày đặc, không thêm tương đen ngọt ngào như miền Nam. Nước dùng trong thanh ngọt từ xương hầm, bánh phở mềm mướt và những lát thịt bò tươi ngon. Hương vị bùng nổ khi kết hợp cùng chút giấm tỏi và hành hoa. Ăn phở trên những chiếc ghế nhựa con ven vỉa hè phố cổ cùng người bản địa là một nét văn hóa sống động và chân thực nhất.",
    descEn:
      "I live in the South, so trust me when I say pho in Hanoi is amazing—and I’m not biased. Even though you can eat pho anywhere, you’ll regret skipping it in Hanoi. Pho here is all about keeping the ingredients true to their original taste. No extra lime, herbs, or sauces like in the South. The broth is clear, the noodles are soft, and the beef is plentiful. Your taste buds will love the garlic vinegar and spring onions. Eating pho in Hanoi is like drinking coffee in Saigon—it’s more than food, it’s a lifestyle. There’s nothing more authentic and immersive than eating pho on little plastic stools on the sidewalks alongside the locals.",
    tipVi:
      "Gọi thêm một đĩa bánh quẩy giòn và nhúng ngập vào bát nước dùng nóng hổi. Quẩy ngấm nước dùng thanh ngọt sẽ giúp bữa ăn của bạn no tròn và đậm đà hơn.",
    tipEn:
      "Order a side of fried dough sticks (quay) and dip them in the broth. They soak up the soup and add carbs to your meal, enhancing the overall flavor.",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Pho Thin Bo Ho", address: "61 Dinh Tien Hoang", price: "60,000 VND ($2.30, 1 USD ≈ 26,000 VND)" },
      { name: "Pho 10 Ly Quoc Su", address: "10 Ly Quoc Su", price: "65,000 VND" },
    ],
  },
  {
    num: "2",
    titleVi: "2. Bún Chả Hà Nội",
    titleEn: "2. Bun Cha Hanoi",
    image: "/guide/hanoi/hanoi-buncha-hd.jpg",
    descVi:
      "Cái tên đã nói lên tất cả—món ăn này chính là đại diện ẩm thực của thủ đô Hà Nội. Không chỉ đơn thuần là bún chả, mà phải là bún chả Hà Nội. Kể từ khi cố đầu bếp Anthony Bourdain và cựu Tổng thống Barack Obama cùng nhau thưởng thức bún chả vào năm 2016, món ăn này đã trở nên nổi tiếng toàn cầu. Bún chả được dọn theo cách rất riêng: thịt ba chỉ và chả viên nướng than hoa thơm nức mũi, rổ rau sống tươi non, đĩa bún sợi nhỏ mát lành và một bát nước mắm chua ngọt ấm nóng thả vài lát đu đủ giòn sần sật. Bạn gắp một nhúm bún cùng rau sống, chấm vào bát nước mắm, cắn miếng thịt nướng mọng nước và cảm nhận trọn vẹn sự hòa quyện tuyệt vời.",
    descEn:
      "The name says it all—this dish is the culinary representative of Hanoi. It’s not just bun cha, it’s bun cha Hanoi. Maybe because it started here, or maybe because nowhere else does it as well. After Anthony Bourdain and Barack Obama shared a meal of bun cha in 2016, the dish became world-famous. Bun cha is served in a unique way: grilled pork belly and meatballs, fresh herbs, cold noodles, and a bowl of sweet-and-sour dipping sauce with pickled papaya—all placed on one tray. You take some noodles and herbs, dip them into the sauce, bite the juicy meat, and enjoy. Every element is served separately, allowing you to mix it your way.",
    tipVi:
      "Bún chả thường được ăn vào bữa trưa. Hãy chọn một quán ven đường thoang thoảng làn khói nướng than hoa thơm lừng và đừng quên gọi thêm một chiếc nem rán giòn rụm ăn kèm.",
    tipEn:
      "Bun cha is usually eaten at lunch. Try it at a street-side spot where puffs of aromatic smoke linger, and don’t forget to get an extra nem ran—the deep-fried spring rolls that go excellently with the dish.",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Bun Cha Huong Lien", address: "24 Le Van Huu", price: "60,000 VND" },
      { name: "Bun Cha Hang Quat", address: "74 Hang Quat", price: "50,000 VND" },
    ],
  },
  {
    num: "3",
    titleVi: "3. Bánh Cuốn Nóng",
    titleEn: "3. Banh Cuon",
    image: "/guide/hanoi/hanoi-banhcuon-hd.jpg",
    descVi:
      "Bánh cuốn là một món ăn thanh nhã nhưng vô cùng đậm đà đã nhận được nhiều sự chú ý khi xuất hiện trong Cẩm nang Michelin Guide. Bánh được làm từ những tấm bột gạo tráng mỏng tang cuộn lấy nhân thịt băm xào mộc nhĩ giòn rụm. Lớp vỏ mềm mướt kết hợp với nhân thịt giòn sần sật tạo nên cảm giác rất thú vị khi ăn. Dù là món hấp, hương vị lại đậm đà nhờ chả quế ăn kèm và chén nước chấm chua ngọt ấm áp. Bạn có thể thưởng thức món này vào bất kỳ thời điểm nào trong ngày. Kỹ thuật tráng bánh khéo léo trên nồi hơi nước nóng là một phần quyến rũ không thể thiếu của món ăn.",
    descEn:
      "Banh cuon (steamed rice rolls) is a light but tasty dish that recently gained attention after being mentioned in the Michelin Guide. It’s made of thin steamed rice rolls filled with ground pork and wood ear mushrooms. The soft wrapper and crunchy filling make a fun combo. Though it’s a steamed dish, the flavor is rich thanks to the smoky grilled pork and sweet dipping sauce. It’s often served with pork sausage, especially the cinnamon-flavored kind. You can eat it any time of the day. The skillful steaming process and smooth texture are a big part of its charm.",
    tipVi:
      "Gọi thêm một cốc trà đá mát lạnh hoặc sữa ngô non ấm áp – cả hai đều là thức uống kèm hoàn hảo cho đĩa bánh cuốn thanh nhẹ.",
    tipEn:
      "Order a glass of herbal tea (tra da) or warm corn milk—both pair really well with banh cuon.",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Banh Cuon Ba Hoanh", address: "66 To Hien Thanh", price: "35,000 VND" },
      { name: "Banh Cuon Ba Xuan", address: "16 Doc Hoe Nhai", price: "30,000 VND" },
    ],
  },
  {
    num: "4",
    titleVi: "4. Bún Thang",
    titleEn: "4. Bun Thang",
    image: "/guide/hanoi/hanoi-bunthang-hd.jpg",
    descVi:
      "Không nhiều du khách biết đến bún thang, nhưng đây là một trong những món bún tinh túy nhất của Hà Nội. 'Thang' có nghĩa là canh súp, và điểm sáng ở đây chính là nồi nước dùng thanh ngọt nấu từ xương gà và tôm he trong vắt. Bát bún được phủ đều những sợi trứng tráng mỏng thái chỉ, giò lụa thái nhỏ, thịt gà xé phay, nấm hương và hành hoa, tất cả xếp đối xứng đẹp như một bông hoa ngũ sắc. Bát bún nhìn thanh lịch và có vị nhẹ nhàng nhưng rất tròn vị—thích hợp cho bữa sáng khởi đầu ngày mới. Đây là biểu tượng của sự khéo léo, cân bằng và tỉ mỉ trong ẩm thực kinh kỳ.",
    descEn:
      "Not many tourists know bun thang, but it’s one of Hanoi’s best noodle dishes. 'Thang' means soup, and the highlight here is the clear, sweet broth made from bones and vegetables. It’s topped with thin slices of egg, pork sausage, chicken, mushrooms, and fried onions, all neatly arranged. It looks beautiful and tastes light but filling—perfect for breakfast and a great way to start a day of exploring. It’s a true showcase of balance, care, and flavor, with a touch of elegance in every bowl.",
    tipVi:
      "Thêm một đầu đũa mắm tôm đánh tan vào bát nước dùng nóng và vắt một lát quất tươi để đánh thức trọn vẹn tầng tầng lớp lớp hương vị sâu lắng của món bún thang.",
    tipEn:
      "Add a tiny dab of shrimp paste (mam tom) or a squeeze of lime/kumquat juice for extraordinary depth of flavor.",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Quan Cu Restaurant", address: "31A Phan Dinh Phung", price: "60,000 VND" },
      { name: "Bun Thang Ba Tong", address: "56 Ngo Si Lien", price: "50,000 VND" },
    ],
  },
  {
    num: "5",
    titleVi: "5. Chả Cá Lã Vọng",
    titleEn: "5. Cha Ca La Vong",
    image: "/guide/hanoi/hanoi-chaca-hd.jpg",
    descVi:
      "Chả cá Lã Vọng không chỉ là một báu vật của Hà Nội mà còn là một trong những điểm nhấn ẩm thực lớn nhất của Việt Nam. Ngôi sao của món ăn là cá lăng—loài cá nước ngọt nổi tiếng với thịt ngọt mềm, ít xương và giàu dinh dưỡng. Cá được ướp với riềng, nghệ, mẻ rồi nướng sơ để khử mùi tanh mà vẫn giữ được độ ngọt mọng. Khi phục vụ, cá được xào ngay trên chảo mỡ nóng cùng hàng núi thì là tươi và hành hoa. Ăn kèm bún rối, lạc rang bùi béo và chấm vào chén mắm tôm đánh sủi bọt dậy mùi chanh ớt. Âm thanh xèo xèo và mùi thơm lan tỏa ngay tại bàn khiến bữa ăn trở nên đặc biệt hơn bao giờ hết.",
    descEn:
      "Cha ca La Vong (La Vong grilled fish) is not only a Hanoi treasure but also one of Vietnam’s culinary highlights. The star is ca lang (bagrid catfish)—a freshwater fish known for being tender, flavorful, and nutritious. It’s cooked in a way that eliminates any fishiness while preserving its juicy texture. When served, it’s heated in a pan with lots of dill and spring onions—simple ingredients that bring out the best in each other. It’s eaten with rice noodles, roasted peanuts, and shrimp paste for extra flavor. The sizzling sound and aroma as it cooks at the table make the meal even better.",
    tipVi:
      "Nếu mắm tôm quá nồng đối với bạn, bạn có thể xin đổi sang nước mắm chua ngọt. Tuy nhiên, nếu tò mò, hãy thử cả hai để cảm nhận trọn vẹn sự khác biệt.",
    tipEn:
      "If shrimp paste is too strong for you, you can use fish sauce instead. Ask for both if you’re curious and want to compare.",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Cha Ca Thang Long", address: "6B Duong Thanh", price: "120,000 VND" },
      { name: "Cha Ca Phan", address: "14 Nguyen Binh Khiem", price: "135,000 VND" },
    ],
  },
  {
    num: "6",
    titleVi: "6. Phở Cuốn & Phở Rán Ngũ Xã",
    titleEn: "6. Pho Cuon & Pho Ran",
    image: "/guide/hanoi/hanoi-phocuon-hd.jpg",
    descVi:
      "Để giải nhiệt cho những ngày hè oi bức ở Hà Nội, người dân địa phương tại làng đúc đồng Ngũ Xã ven hồ Trúc Bạch đã sáng tạo ra các phiên bản phở 'khô': phở cuốn và phở rán. Những món ăn này vẫn sử dụng bánh phở, thịt bò và rau thơm. Phở cuốn cuộn chặt thịt bò xào lăn cùng xà lách, rau mùi trong lá phở mềm mướt như một chiếc gỏi cuốn, chấm cùng nước mắm tỏi ớt chua ngọt thanh mát. Phở rán lại khác biệt: bánh phở được chiên giòn rụm rồi phủ lên sốt thịt bò và rau cải xào sánh mịn. Ngoài ra còn có phở chiên phồng với những miếng bánh phở phồng to như gối nhỏ vàng ruộm. Mỗi biến thể đem lại một trải nghiệm phở cổ điển đầy mới lạ.",
    descEn:
      "To cool down in Hanoi’s summer, locals created dry versions of pho: pho cuon and pho ran (pho rolls and deep-fried pho). These dishes still use pho noodles, beef, and herbs. Pho cuon wraps stir-fried beef and herbs in wide rice noodle sheets, like a soft spring roll. It’s eaten with a tangy dipping sauce and is light and refreshing. Pho ran is different—it fries the noodles until crispy, then adds stir-fried beef and veggies. There’s also pho chien phong, where noodle squares are fried into golden puffs and topped with beef and onions. Each version gives you the classic pho flavor in a fun, new way.",
    tipVi:
      "Các món ăn này thường được làm theo đĩa lớn—rất thích hợp để đi ăn cùng bạn bè hoặc gia đình chia sẻ. Nếu đi một mình, hãy chọn một món và đừng quên gọi thêm đĩa 'Ngô chiên bơ' thơm giòn ngọt bùi ăn kèm!",
    tipEn:
      "These dishes come in big portions—great for sharing. If eating alone, just pick one. Make sure to try 'Ngo chien bo' (popcorn-style sweet corn fritters) as a side snack!",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Pho Cuon 31 Ngu Xa", address: "31 Ngu Xa", price: "48,000 VND" },
      { name: "Pho Cuon Chinh Thang", address: "7 Mac Dinh Chi", price: "80,000 VND" },
    ],
  },
  {
    num: "7",
    titleVi: "7. Ngan Cháy Tỏi",
    titleEn: "7. Ngan Chay Toi",
    image: "/guide/hanoi/hanoi-nganchaytoi-hd.jpg",
    descVi:
      "Ngan cháy tỏi là món thịt ngan chiên già lửa cùng hàng vốc tép tỏi ta thơm nức. Thịt ngan được tẩm ướp đậm đà, sau đó chiên cùng rất nhiều tỏi cho đến khi thịt chuyển màu vàng nâu óng ả và tỏi giòn tan khó cưỡng. Bạn sẽ có những miếng thịt ngan mọng nước ăn kèm từng lát tỏi giòn rụm. Một suất ăn đầy đủ thường gồm thịt ngan (cháy tỏi hoặc luộc—hoặc cả hai), bún tươi hoặc miến, một bát canh măng tiết nóng hổi và chén nước chấm gừng tỏi ớt cay nồng đậm vị. Ngồi trên chiếc ghế nhựa con ven đường thưởng thức món ăn ấm nóng này vào những buổi chiều se lạnh là một trải nghiệm đậm chất Hà thành.",
    descEn:
      "Ngan chay toi is crispy duck fried with garlic. The duck is marinated, then fried with lots of garlic until golden and crunchy. You get juicy duck with crispy garlic that’s hard to resist. A full meal comes with duck (fried or boiled—or both), your choice of noodles (rice vermicelli or glass noodles), bamboo shoot soup, fresh herbs, and a strong garlic-ginger fish sauce. It’s served on a tray with low stools—just like locals eat. This dish is hearty, flavorful, and perfect for cooler evenings in Hanoi.",
    tipVi:
      "Nên gọi suất nửa cháy tỏi và nửa luộc nếu đi từ 2 người trở lên để thử trọn vẹn cả hai hương vị. Trộn thịt cùng bún và chấm ngập nước sốt để cảm nhận sự cân bằng vị giác tốt nhất.",
    tipEn:
      "Get half-fried and half-boiled duck to try both styles. Mix the meat with the noodles and dip for the best balance of taste.",
    whereLabelVi: "Địa chỉ ăn ngon:",
    whereLabelEn: "Where to eat:",
    places: [
      { name: "Ngan Chay Toi Thuy Luong", address: "61 Hang Luoc", price: "230,000 VND" },
      { name: "Bun Ngan Hang Thiec Dung Huyen", address: "61 Hang Thiec", price: "250,000 VND" },
    ],
  },
  {
    num: "8",
    titleVi: "8. Cà Phê Trứng",
    titleEn: "8. Ca Phe Trung",
    image: "/guide/hanoi/hanoi-caphetrung-hd.jpg",
    descVi:
      "Dù không phải là một món ăn, cà phê trứng lại là mảnh ghép linh hồn không thể thiếu trong bức tranh ẩm thực Hà Nội. Thức uống này trở nên nổi tiếng nhờ sự hòa quyện độc đáo giữa lòng đỏ trứng gà đánh bông mịn màng và cà phê phin đen nóng hổi đậm đà. Lớp bọt kem bồng bềnh, ngọt ngào, béo ngậy như một món tráng miệng kiểu Âu. Chỉ với nguyên liệu mộc mạc gồm trứng, sữa và cà phê robusta, người thợ pha chế đã khéo léo tạo nên thức uống trứ danh theo công thức bí truyền lưu truyền qua nhiều thế hệ. Ngọt ngào, thơm nồng và khác biệt hoàn toàn với bất kỳ món cà phê nào khác trên thế giới.",
    descEn:
      "It’s not food, but ca phe trung (egg coffee) is a key part of Hanoi’s food scene. This drink stands out because of its unique mix: whipped egg yolk and hot black coffee. Some people think it tastes like dessert because it’s rich and creamy, like whipped cream. It’s simple—just eggs and coffee—but balanced perfectly to create a famous Hanoi drink. Many cafes use a hidden recipe that has been passed down for generations. It’s sweet, strong, and unlike anything else.",
    tipVi:
      "Hãy thưởng thức cà phê trứng ngay khi còn nóng hổi! Nếu để nguội, hương vị trứng sẽ giảm đi độ ngon. Với người lần đầu uống, hãy khuấy nhẹ và nhấp từng ngụm chậm rãi để tận hưởng lớp kem mềm như nhung hòa tan cùng cà phê đen đậm đà.",
    tipEn:
      "Drink it while it’s still hot. If it cools down, it can taste a little eggy. For first-timers, stir gently and sip slowly to enjoy the velvety texture.",
    whereLabelVi: "Địa chỉ thưởng thức:",
    whereLabelEn: "Where to drink:",
    places: [
      { name: "Cafe Giang", address: "39 Nguyen Huu Huan", price: "40,000 VND" },
      { name: "Cafe Dinh", address: "13 Dinh Tien Hoang", price: "30,000 VND" },
    ],
  },
];

export default function MustTryFoodsInHanoiPage() {
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const menuTimerRef = useRef(null);

  const isVi = lang === "vi";

  useEffect(() => {
    setLang(getLang());
    const handleLangUpdated = (e) => {
      setLang(e.detail || getLang());
    };
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  useEffect(() => {
    document.title =
      lang === "vi"
        ? "8 món ngon nhất định phải thử tại Hà Nội | VinaTap"
        : "8 Must-Try Foods in Hanoi | VinaTap";
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuEnter = (menuKey) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleMegaMouseEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lang === "vi" ? "8 món ngon nhất định phải thử tại Hà Nội" : "8 must-try foods in Hanoi",
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(lang === "vi" ? "Đã sao chép liên kết bài viết!" : "Article link copied!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    }
  };

  return (
    <div className="vnn-article-page">
      {/* ── Reading Progress Bar ── */}
      <div className="vnn-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* ─── 1. UNIVERSAL EDITORIAL NAVBAR (CHUẨN HỆ THỐNG VINATAP) ─── */}
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
                className={`vnn-navbar__link ${activeMenu === "inspired" ? "is-active" : ""}`}
              >
                <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
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
                className={`vnn-navbar__link ${activeMenu === "destinations" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
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
                className={`vnn-navbar__link ${activeMenu === "thingsToDo" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
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
                className={`vnn-navbar__link ${activeMenu === "eat" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
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
                className={`vnn-navbar__link ${activeMenu === "itineraries" ? "is-active" : ""}`}
              >
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
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
                      alt={isVi && item.titleVi ? item.titleVi : item.title}
                      className="vnn-megamenu__img"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="vnn-megamenu__badge">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="vnn-megamenu__title">
                    {isVi && item.titleVi ? item.titleVi : item.title}
                  </h4>
                  <p className="vnn-megamenu__date">
                    {isVi && item.dateVi ? item.dateVi : item.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Main Editorial Container ── */}
      <main className="vnn-container">

        {/* Article Header */}
        <div className="vnn-post-header">
          <h1 className="vnn-post-title">
            {lang === "vi" ? "8 món ngon nhất định phải thử tại Hà Nội" : "8 must-try foods in Hanoi"}
          </h1>
          <div className="vnn-post-meta">
            <div className="vnn-author-wrap">
              <span className="vnn-author-avatar">VT</span>
              <span className="vnn-author-name">
                {lang === "vi" ? "VinaTap" : "VinaTap"}
              </span>
            </div>
            <span className="vnn-meta-dot">•</span>
            <span>{lang === "vi" ? "Ngày 2 tháng 10, 2026" : "October 12, 2026"}</span>
            <span className="vnn-meta-dot">•</span>
            <span>{lang === "vi" ? "8 phút đọc" : "8 min read"}</span>

            <button type="button" className="vnn-share-btn" onClick={handleShare}>
              <Share2 size={13} />
              <span>{lang === "vi" ? "Chia sẻ" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="vnn-featured-image-wrap">
          <img
            src="/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg"
            alt="8 must-try foods in Hanoi"
            className="vnn-featured-image"
          />
        </div>

        {/* Lead Intro Paragraph */}
        <div className="vnn-intro-paragraph">
          {lang === "vi" ? (
            <p>
              Hà Nội là nơi ẩm thực gắn liền với <strong>truyền thống và sự tỉ mỉ</strong>. Những món ăn ở đây càng trở nên đặc sắc nhờ nét cổ kính của mảnh đất kinh kỳ và sự kiên định của những người đầu bếp với phương pháp nấu nướng thủ công. Họ từ chối các lối tắt nhanh gọn để giữ trọn vẹn hương vị xưa cũ. Mỗi bữa ăn ở Hà Nội đều kể một câu chuyện riêng, phản ánh bề dày lịch sử, văn hóa và niềm tự hào về bản sắc ẩm thực dân tộc. Dưới đây là <strong>8 món ăn đặc sản</strong> làm nên nét cuốn hút độc đáo của ẩm thực thủ đô kèm theo địa chỉ và giá cả để bạn trải nghiệm.
            </p>
          ) : (
            <p>
              Hanoi is where food means <strong>tradition and care</strong>. Dishes here are made better by the city’s old charm and the chefs’ loyalty to handmade cooking. These chefs refuse shortcuts and prefer to do things the traditional way. Every meal in Hanoi tells a story, reflecting the city’s history, culture, and pride in its culinary identity. Let’s explore <strong>8 specialties</strong> that make Hanoi’s food scene so special.
            </p>
          )}
        </div>

        {/* ── 8 Dishes in 2-Column VietnamNomad Layout ── */}
        <div className="vnn-dishes-wrapper">
          {HANOI_DISHES.map((dish) => (
            <article key={dish.num} className="vnn-dish-section" id={`dish-${dish.num}`}>
              {/* Dish Title */}
              <h2 className="vnn-dish-heading">
                {lang === "vi" ? dish.titleVi : dish.titleEn}
              </h2>

              {/* 2-Column Row: Left Image (~35%), Right Content (~65%) */}
              <div className="vnn-dish-columns">
                <div className="vnn-column-image">
                  <figure className="vnn-figure">
                    <img
                      src={dish.image}
                      alt={lang === "vi" ? dish.titleVi : dish.titleEn}
                      className="vnn-dish-img"
                      loading="lazy"
                    />
                  </figure>
                </div>

                <div className="vnn-column-text">
                  <p className="vnn-paragraph">
                    {lang === "vi" ? dish.descVi : dish.descEn}
                  </p>

                  {/* Tip */}
                  <div className="vnn-tip-box">
                    <strong>{lang === "vi" ? "Mẹo:" : "Tip:"}</strong>{" "}
                    {lang === "vi" ? dish.tipVi : dish.tipEn}
                  </div>

                  {/* Where to Eat */}
                  <div className="vnn-where-label">
                    {lang === "vi" ? dish.whereLabelVi : dish.whereLabelEn}
                  </div>
                  <ul className="vnn-where-list">
                    {dish.places.map((place, idx) => (
                      <li key={idx} className="vnn-where-item">
                        <span className="vnn-restaurant-name">{place.name}</span>{" "}
                        <span className="vnn-restaurant-address">({place.address}):</span>{" "}
                        <span className="vnn-restaurant-price">{place.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Related Articles Section (Matching screenshot) ── */}
        <hr className="vnn-related-divider" />
        <section className="vnn-related-section">
          <h2 className="vnn-related-title">
            {lang === "vi" ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="vnn-related-grid">
            <Link
              href="/guide/pho-the-complete-guide"
              className="vnn-related-card"
            >
              <div className="vnn-related-img-wrap">
                <img
                  src="/guide/pho/pho-ha-noi.jpg"
                  alt="Pho Complete Guide"
                  className="vnn-related-img"
                  onError={(e) => {
                    e.currentTarget.src = "/guide/hanoi/dish-1-pho-bo.jpg";
                  }}
                  loading="lazy"
                />
              </div>
              <h3 className="vnn-related-card-title">
                {lang === "vi"
                  ? "Phở – Quốc hồn quốc túy ẩm thực Việt Nam"
                  : "Pho – The Complete Guide to Vietnam's National Dish"}
              </h3>
            </Link>

            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="vnn-related-card"
            >
              <div className="vnn-related-img-wrap">
                <img
                  src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                  alt="The Complete Guide to Vietnam"
                  className="vnn-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="vnn-related-card-title">
                {lang === "vi"
                  ? "Cẩm nang du lịch toàn diện Việt Nam"
                  : "The Complete Guide to Vietnam"}
              </h3>
            </Link>

            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="vnn-related-card"
            >
              <div className="vnn-related-img-wrap">
                <img
                  src="/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg"
                  alt="15 best places to visit in Vietnam in 2026"
                  className="vnn-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="vnn-related-card-title">
                {lang === "vi"
                  ? "15 điểm đến tuyệt nhất Việt Nam năm 2026"
                  : "15 best places to visit in Vietnam in 2026"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang={lang} />

      {/* ─── AI TRAVEL COMPANION (CHATBOT) ─── */}
      <ProvinceChatbot
        province={{
          name: lang === "vi" ? "Hà Nội" : "Hanoi",
          slug: "ha-noi",
        }}
      />

      {/* Toast */}
      {toastVisible && <div className="vnn-toast">{toastMessage}</div>}
    </div>
  );
}
