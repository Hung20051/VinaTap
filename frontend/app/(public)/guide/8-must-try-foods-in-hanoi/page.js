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
import "./hanoi-food.css";

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
        id: "todo-1",
        title: "10 Best Things to Do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Guide",
        img: "/guide/megamenu/todo-1-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-2",
        title: "8 Best Things to Do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Guide",
        img: "/guide/megamenu/todo-2-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "todo-3",
        title: "Hanoi Tourist Map: Essential Guide for Travelers",
        titleVi: "Bản đồ du lịch Hà Nội cho du khách",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Map Guide",
        img: "/guide/megamenu/todo-3-hanoimap.jpg",
        link: "/guide/hanoi-tourist-map",
      },
      {
        id: "todo-4",
        title: "Ao Dai: Vietnamese Traditional Dress",
        titleVi: "Áo Dài: Trang phục truyền thống Việt Nam",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Culture",
        img: "/guide/megamenu/todo-4-aodai.jpg",
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

// ─── 8 MUST-TRY HANOI FOODS DATA (MATCHING SCREENSHOTS 3, 4, 5) ───
const HANOI_8_DISHES = [
  {
    id: "pho",
    index: 1,
    title: "1. Pho",
    titleVi: "1. Phở",
    img: "/guide/hcmc/Top-Hanoi-foods-Pho-Vietnamnomad.jpg",
    alt: "Pho - Hanoi Traditional Noodle Soup",
    desc: (
      <>
        I live in the South, so trust me when I say <span className="vnn-link-highlight"><em>pho</em></span> in Hanoi is amazing—and I&apos;m not biased. Even though you can eat <em>pho</em> anywhere, you&apos;ll regret skipping it in Hanoi. <em>Pho</em> here is all about keeping the ingredients true to their original taste. No extra lime, herbs, or sauces like in the South. The broth is clear, the noodles are soft, and the beef is plentiful. Your taste buds will love the garlic vinegar and spring onions. Eating <em>pho</em> in Hanoi is like drinking coffee in{" "}
        <Link href="/province/ho-chi-minh" style={{ color: "#00c2cb", textDecoration: "none" }}>
          Saigon
        </Link>
        —it&apos;s more than food, it&apos;s a lifestyle. There&apos;s nothing more authentic and immersive than eating <em>pho</em> on little plastic stools on the sidewalks alongside the locals.
      </>
    ),
    descVi: (
      <>
        Dù bạn có thể ăn phở ở bất kỳ nơi nào trên thế giới, nhưng bỏ lỡ phở tại Hà Nội sẽ là điều vô cùng đáng tiếc. Phở Hà Nội chú trọng giữ trọn vẹn hương vị nguyên bản của nguyên liệu: không rau thơm dày đặc, không thêm tương đen ngọt ngào như miền Nam. Nước dùng trong thanh ngọt từ xương hầm, bánh phở mềm mướt và những lát thịt bò tươi ngon. Hương vị bùng nổ khi kết hợp cùng chút giấm tỏi và hành hoa. Ăn phở trên những chiếc ghế nhựa con ven vỉa hè phố cổ cùng người bản địa là một nét văn hóa sống động và chân thực nhất.
      </>
    ),
    tip: "Order a side of fried dough sticks (quay) and dip them in the broth. They soak up the soup and add carbs to your meal, enhancing the overall flavor.",
    tipVi: "Gọi thêm một đĩa bánh quẩy giòn và nhúng ngập vào bát nước dùng nóng hổi. Quẩy ngấm nước dùng thanh ngọt sẽ giúp bữa ăn của bạn no tròn và đậm đà hơn.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Pho Thin Bo Ho (61 Dinh Tien Hoang): 60,000 VND ($2.30, 1 USD ~ 26,000 VND)",
      "Pho 10 Ly Quoc Su (10 Ly Quoc Su): 65,000 VND",
    ],
    whereToEatVi: [
      "Phở Thìn Bờ Hồ (61 Đinh Tiên Hoàng): 60.000 VNĐ ($2.30)",
      "Phở 10 Lý Quốc Sư (10 Lý Quốc Sư): 65.000 VNĐ",
    ],
  },
  {
    id: "bun-cha",
    index: 2,
    title: "2. Bun Cha Hanoi",
    titleVi: "2. Bún Chả Hà Nội",
    img: "/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg",
    alt: "Bun Cha Hanoi - Grilled Pork with Vermicelli",
    desc: (
      <>
        The name says it all—this dish is the culinary representative of{" "}
        <Link href="/province/ha-noi" style={{ color: "#00c2cb", textDecoration: "none" }}>
          Hanoi
        </Link>
        . It&apos;s not just <span className="vnn-link-highlight"><em>bun cha</em></span>, it&apos;s <em>bun cha Hanoi</em>. Maybe because it started here, or maybe because nowhere else does it as well. After Anthony Bourdain and Barack Obama shared a meal of <em>bun cha</em> in 2016, the dish became world-famous. <em>Bun cha</em> is served in a unique way: grilled pork belly and meatballs, fresh herbs, cold noodles, and a bowl of sweet-and-sour dipping sauce with pickled papaya—all placed on one tray. You take some noodles and herbs, dip them into the sauce, bite the juicy meat, and enjoy. Every element is served separately, allowing you to mix it your way.
      </>
    ),
    descVi: (
      <>
        Cái tên đã nói lên tất cả—món ăn này chính là đại diện ẩm thực của thủ đô Hà Nội. Không chỉ đơn thuần là bún chả, mà phải là bún chả Hà Nội. Kể từ khi cố đầu bếp Anthony Bourdain và cựu Tổng thống Barack Obama cùng nhau thưởng thức bún chả vào năm 2016, món ăn này đã trở nên nổi tiếng toàn cầu. Bún chả được dọn theo cách rất riêng: thịt ba chỉ và chả viên nướng than hoa thơm nức mũi, rổ rau sống tươi non, đĩa bún sợi nhỏ mát lành và một bát nước mắm chua ngọt ấm nóng thả vài lát đu đủ giòn sần sật.
      </>
    ),
    tip: (
      <>
        <em>Bun cha</em> is usually eaten at lunch. Try it at a street-side spot where puffs of aromatic smoke linger, and don&apos;t forget to get an extra <span className="vnn-link-highlight"><em>nem ran</em></span>—the deep-fried spring rolls that go excellently with the dish.
      </>
    ),
    tipVi: "Bún chả thường được ăn vào bữa trưa. Hãy chọn một quán ven đường thoang thoảng làn khói nướng than hoa thơm lừng và đừng quên gọi thêm một chiếc nem rán giòn rụm ăn kèm.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Cha Huong Lien (24 Le Van Huu): 60,000 VND",
      "Bun Cha Hang Quat (74 Hang Quat): 50,000 VND",
    ],
    whereToEatVi: [
      "Bún Chả Hương Liên (24 Lê Văn Hưu): 60.000 VNĐ",
      "Bún Chả Hàng Quạt (74 Hàng Quạt): 50.000 VNĐ",
    ],
  },
  {
    id: "banh-cuon",
    index: 3,
    title: "3. Banh Cuon",
    titleVi: "3. Bánh Cuốn Nóng",
    img: "/guide/hcmc/Top-Hanoi-foods-Banh-Cuon-Vietnamnomad.jpg",
    alt: "Banh Cuon - Steamed Rice Rolls Hanoi",
    desc: (
      <>
        <span className="vnn-link-highlight"><em>Banh cuon</em></span> (steamed rice rolls) is a light but tasty dish that recently gained attention after being mentioned in the Michelin Guide. It&apos;s made of thin steamed rice rolls filled with ground pork and wood ear mushrooms. The soft wrapper and crunchy filling make a fun combo. Though it&apos;s a steamed dish, the flavor is rich thanks to the smoky grilled pork and sweet dipping sauce. It&apos;s often served with pork sausage, especially the cinnamon-flavored kind. You can eat it any time of the day. The skillful steaming process and smooth texture are a big part of its charm.
      </>
    ),
    descVi: (
      <>
        Bánh cuốn là một món ăn thanh nhã nhưng vô cùng đậm đà đã nhận được nhiều sự chú ý khi xuất hiện trong Cẩm nang Michelin Guide. Bánh được làm từ những tấm bột gạo tráng mỏng tang cuộn lấy nhân thịt băm xào mộc nhĩ giòn rụm. Lớp vỏ mềm mướt kết hợp với nhân thịt giòn sần sật tạo nên cảm giác rất thú vị khi ăn. Dù là món hấp, hương vị lại đậm đà nhờ chả quế ăn kèm và chén nước chấm chua ngọt ấm áp.
      </>
    ),
    tip: "Order a glass of herbal tea (tra da) or warm corn milk—both pair really well with banh cuon.",
    tipVi: "Gọi thêm một cốc trà đá mát lạnh hoặc sữa ngô non ấm áp – cả hai đều là thức uống kèm hoàn hảo cho đĩa bánh cuốn thanh nhẹ.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Banh Cuon Ba Hoanh (66 To Hien Thanh): 35,000 VND",
      "Banh Cuon Ba Xuan (16 Doc Hoe Nhai): 30,000 VND",
    ],
    whereToEatVi: [
      "Bánh Cuốn Bà Hoành (66 Tô Hiến Thành): 35.000 VNĐ",
      "Bánh Cuốn Bà Xuân (16 Dốc Hòe Nhai): 30.000 VNĐ",
    ],
  },
  {
    id: "bun-thang",
    index: 4,
    title: "4. Bun Thang",
    titleVi: "4. Bún Thang",
    img: "/guide/hcmc/Hanoi-food-Bun-Thang-Vietnamnomad.jpg",
    alt: "Bun Thang - Traditional Hanoi Chicken Noodle Soup",
    desc: (
      <>
        Not many tourists know <span className="vnn-link-highlight"><em>bun thang</em></span>, but it&apos;s one of Hanoi&apos;s best noodle dishes. &ldquo;Thang&rdquo; means soup, and the highlight here is the clear, sweet broth made from bones and vegetables. It&apos;s topped with thin slices of egg, pork sausage, chicken, mushrooms, and fried onions, all neatly arranged. It looks beautiful and tastes light but filling—perfect for breakfast and a great way to start a day of exploring. It&apos;s a true showcase of balance, care, and flavor, with a touch of elegance in every bowl.
      </>
    ),
    descVi: (
      <>
        Không nhiều du khách biết đến bún thang, nhưng đây là một trong những món bún tinh túy nhất của Hà Nội. &ldquo;Thang&rdquo; có nghĩa là canh súp, và điểm sáng ở đây chính là nồi nước dùng thanh ngọt nấu từ xương gà và tôm he trong vắt. Bát bún được phủ đều những sợi trứng tráng mỏng thái chỉ, giò lụa thái nhỏ, thịt gà xé phay, nấm hương và hành hoa, tất cả xếp đối xứng đẹp như một bông hoa ngũ sắc.
      </>
    ),
    tip: "Add a tiny dab of shrimp paste (mam tom) or a squeeze of lime/kumquat juice for extraordinary depth of flavor.",
    tipVi: "Thêm một đầu đũa mắm tôm đánh tan vào bát nước dùng nóng và vắt một lát quất tươi để đánh thức trọn vẹn tầng tầng lớp lớp hương vị sâu lắng của món bún thang.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Quan Cu Restaurant (31A Phan Dinh Phung): 60,000 VND",
      "Bun Thang Ba Tong (56 Ngo Si Lien): 50,000 VND",
    ],
    whereToEatVi: [
      "Quán Cũ (31A Phan Đình Phùng): 60.000 VNĐ",
      "Bún Thang Bà Tống (56 Ngô Sĩ Liên): 50.000 VNĐ",
    ],
  },
  {
    id: "cha-ca-la-vong",
    index: 5,
    title: "5. Cha Ca La Vong",
    titleVi: "5. Chả Cá Lã Vọng",
    img: "/guide/hcmc/Top-Hanoi-foods-Cha-Ca-Vietnamnomad.jpg",
    alt: "Cha Ca La Vong - Grilled Turmeric Fish with Dill",
    desc: (
      <>
        <span className="vnn-link-highlight"><em>Cha ca La Vong</em></span> (La Vong grilled fish) is not only a Hanoi treasure but also one of Vietnam&apos;s culinary highlights. The star is ca lang (bagrid catfish)—a freshwater fish known for being tender, flavorful, and nutritious. It&apos;s cooked in a way that eliminates any fishiness while preserving its juicy texture. When served, it&apos;s heated in a pan with lots of dill and spring onions—simple ingredients that bring out the best in each other. It&apos;s eaten with rice noodles, roasted peanuts, and shrimp paste for extra flavor. The sizzling sound and aroma as it cooks at the table make the meal even better.
      </>
    ),
    descVi: (
      <>
        Chả cá Lã Vọng không chỉ là một báu vật của Hà Nội mà còn là một trong những điểm nhấn ẩm thực lớn nhất của Việt Nam. Ngôi sao của món ăn là cá lăng—loài cá nước ngọt nổi tiếng với thịt ngọt mềm, ít xương và giàu dinh dưỡng. Cá được ướp với riềng, nghệ, mẻ rồi nướng sơ để khử mùi tanh mà vẫn giữ được độ ngọt mọng. Khi phục vụ, cá được xào ngay trên chảo mỡ nóng cùng hàng núi thì là tươi và hành hoa.
      </>
    ),
    tip: "If shrimp paste is too strong for you, you can use fish sauce instead. Ask for both if you're curious and want to compare.",
    tipVi: "Nếu mắm tôm quá nồng đối với bạn, bạn có thể xin đổi sang nước mắm chua ngọt. Tuy nhiên, nếu tò mò, hãy thử cả hai để cảm nhận trọn vẹn sự khác biệt.",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Cha Ca Thang Long (6B Duong Thanh): 120,000 VND",
      "Cha Ca Phan (14 Nguyen Binh Khiem): 135,000 VND",
    ],
    whereToEatVi: [
      "Chả Cá Thăng Long (6B Đường Thành): 120.000 VNĐ",
      "Chả Cá Phan (14 Nguyễn Bỉnh Khiêm): 135.000 VNĐ",
    ],
  },
  {
    id: "pho-cuon",
    index: 6,
    title: "6. Pho Cuon & Pho Ran",
    titleVi: "6. Phở Cuốn & Phở Rán Ngũ Xã",
    img: "/guide/hcmc/Pho-Cuon-Hanoi-food.jpg",
    alt: "Pho Cuon & Pho Ran - Rolled & Fried Pho Hanoi",
    desc: (
      <>
        To cool down in Hanoi&apos;s summer, locals created dry versions of pho: <span className="vnn-link-highlight"><em>pho cuon</em></span> and <em>pho ran</em> (pho rolls and deep-fried pho). These dishes still use pho noodles, beef, and herbs. Pho cuon wraps stir-fried beef and herbs in wide rice noodle sheets, like a soft spring roll. It&apos;s eaten with a tangy dipping sauce and is light and refreshing. Pho ran is different—it fries the noodles until crispy, then adds stir-fried beef and veggies. There&apos;s also pho chien phong, where noodle squares are fried into golden puffs and topped with beef and onions. Each version gives you the classic pho flavor in a fun, new way.
      </>
    ),
    descVi: (
      <>
        Để giải nhiệt cho những ngày hè oi bức ở Hà Nội, người dân địa phương tại làng đúc đồng Ngũ Xã ven hồ Trúc Bạch đã sáng tạo ra các phiên bản phở &ldquo;khô&rdquo;: phở cuốn và phở rán. Những món ăn này vẫn sử dụng bánh phở, thịt bò và rau thơm. Phở cuốn cuộn chặt thịt bò xào lăn cùng xà lách, rau mùi trong lá phở mềm mướt như một chiếc gỏi cuốn, chấm cùng nước mắm tỏi ớt chua ngọt thanh mát.
      </>
    ),
    tip: "These dishes come in big portions—great for sharing. If eating alone, just pick one. Make sure to try 'Ngo chien bo' (popcorn-style sweet corn fritters) as a side snack!",
    tipVi: "Các món ăn này thường được làm theo đĩa lớn—rất thích hợp để đi ăn cùng bạn bè hoặc gia đình chia sẻ. Nếu đi một mình, hãy chọn một món và đừng quên gọi thêm đĩa 'Ngô chiên bơ' thơm giòn ngọt bùi ăn kèm!",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Pho Cuon 31 Ngu Xa (31 Ngu Xa): 48,000 VND",
      "Pho Cuon Chinh Thang (7 Mac Dinh Chi): 80,000 VND",
    ],
    whereToEatVi: [
      "Phở Cuốn 31 Ngũ Xã (31 Ngũ Xã): 48.000 VNĐ",
      "Phở Cuốn Chinh Thắng (7 Mạc Đĩnh Chi): 80.000 VNĐ",
    ],
  },
  {
    id: "ngan-chay-toi",
    index: 7,
    title: "7. Ngan Chay Toi",
    titleVi: "7. Ngan Cháy Tỏi",
    img: "/guide/hcmc/Ngan-chay-toi-Hanoi-Vietnamnomad.jpg",
    alt: "Ngan Chay Toi - Garlic Crispy Duck Hanoi",
    desc: (
      <>
        <span className="vnn-link-highlight"><em>Ngan chay toi</em></span> is crispy duck fried with garlic. The duck is marinated, then fried with lots of garlic until golden and crunchy. You get juicy duck with crispy garlic that&apos;s hard to resist. A full meal comes with duck (fried or boiled—or both), your choice of noodles (rice vermicelli or glass noodles), bamboo shoot soup, fresh herbs, and a strong garlic-ginger fish sauce. It&apos;s served on a tray with low stools—just like locals eat. This dish is hearty, flavorful, and perfect for cooler evenings in Hanoi.
      </>
    ),
    descVi: (
      <>
        Ngan cháy tỏi là món thịt ngan chiên già lửa cùng hàng vốc tép tỏi ta thơm nức. Thịt ngan được tẩm ướp đậm đà, sau đó chiên cùng rất nhiều tỏi cho đến khi thịt chuyển màu vàng nâu óng ả và tỏi giòn tan khó cưỡng. Bạn sẽ có những miếng thịt ngan mọng nước ăn kèm từng lát tỏi giòn rụm. Một suất ăn đầy đủ thường gồm thịt ngan, bún tươi hoặc miến, một bát canh măng tiết nóng hổi và chén nước chấm gừng tỏi ớt cay nồng đậm vị.
      </>
    ),
    tip: "A full combo of half a duck, noodles, and bamboo shoot soup is ideal for 2-3 people!",
    tipVi: "Một phần nửa con ngan cháy tỏi kèm bún và canh măng tiết là khẩu phần lý tưởng cho nhóm từ 2 đến 3 người ăn no nê!",
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Ngan Chay Toi Hang Thiec (71 Hang Thiec): 150,000 - 250,000 VND",
      "Ngan Chay Toi Thuy Ngan (51 Hang Luoc): 160,000 - 280,000 VND",
    ],
    whereToEatVi: [
      "Ngan Cháy Tỏi Hàng Thiếc (71 Hàng Thiếc): 150.000 - 250.000 VNĐ",
      "Ngan Cháy Tỏi Thủy Ngan (51 Hàng Lược): 160.000 - 280.000 VNĐ",
    ],
  },
  {
    id: "ca-phe-trung",
    index: 8,
    title: "8. Ca Phe Trung (Egg Coffee)",
    titleVi: "8. Cà Phê Trứng Hà Nội",
    img: "/guide/hcmc/Top-Hanoi-foods-Ca-Phe-Trung-Vietnamnomad.jpg",
    alt: "Ca Phe Trung - Vietnamese Egg Coffee Hanoi",
    desc: (
      <>
        You cannot leave Hanoi without trying <span className="vnn-link-highlight"><em>ca phe trung</em></span> (egg coffee). Invented in the late 1940s by Mr. Nguyen Van Giang when milk was scarce, egg yolks are whipped with sugar and condensed milk into an airy, custardy foam that floats atop strong Vietnamese drip coffee. It tastes like a warm liquid tiramisu—sweet, velvety, and deeply aromatic.
      </>
    ),
    descVi: (
      <>
        Bạn không thể rời Hà Nội mà chưa từng nếm thử <span className="vnn-link-highlight"><em>cà phê trứng</em></span>. Được sáng tạo vào cuối những năm 1940 bởi cụ Nguyễn Văn Giảng khi nguồn sữa còn khan hiếm, lòng đỏ trứng gà được đánh bông xốp mịn cùng đường và sữa đặc, nổi bồng bềnh trên lớp cà phê phin đậm đặc nóng hổi. Hương vị béo ngậy ngọt ngào như một ly tiramisu dạng lỏng quyến rũ lòng người.
      </>
    ),
    tip: "Keep the cup in the small bowl of hot water provided to keep the egg foam silky and warm until the last sip.",
    tipVi: "Hãy luôn để cốc cà phê trong chiếc bát nước nóng đi kèm để lớp kem trứng luôn giữ được độ ấm nóng mịn màng đến giọt cuối cùng.",
    whereToEatTitle: "Where to try:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Cafe Giang (39 Nguyen Huu Huan): 35,000 VND",
      "Cafe Dinh (13 Dinh Tien Hoang, 2nd floor): 30,000 VND",
    ],
    whereToEatVi: [
      "Cà Phê Giảng (39 Nguyễn Hữu Huân): 35.000 VNĐ",
      "Cà Phê Đinh (13 Đinh Tiên Hoàng, tầng 2): 30.000 VNĐ",
    ],
  },
];

export default function HanoiFoodGuidePage() {
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
              alt="Free AI Travel Assistant - AI Companion"
              className="vnn-top-banner__img"
            />
          </a>
        </div>
      </div>

      {/* ── Standard Navbar Header ── */}
      <header className="home-header" onMouseLeave={() => setActiveMegaMenu(null)}>
        <div className="home-header__container">
          <div className="home-header__left">
            <Logo variant="home" />
          </div>

          <nav className="home-header__nav">
            <ul className="home-nav-list">
              {/* BE INSPIRED */}
              <li
                className="home-nav-item home-nav-item--has-dropdown"
                onMouseEnter={() => setActiveMegaMenu("inspired")}
              >
                <button
                  type="button"
                  className={`home-nav-link ${activeMegaMenu === "inspired" ? "home-nav-link--active" : ""}`}
                >
                  <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                  <ChevronDown className="home-nav-link__icon" size={14} />
                </button>
              </li>

              {/* DESTINATIONS */}
              <li
                className="home-nav-item home-nav-item--has-dropdown"
                onMouseEnter={() => setActiveMegaMenu("destinations")}
              >
                <button
                  type="button"
                  className={`home-nav-link ${activeMegaMenu === "destinations" ? "home-nav-link--active" : ""}`}
                >
                  <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                  <ChevronDown className="home-nav-link__icon" size={14} />
                </button>
              </li>

              {/* THINGS TO DO */}
              <li
                className="home-nav-item home-nav-item--has-dropdown"
                onMouseEnter={() => setActiveMegaMenu("thingsToDo")}
              >
                <button
                  type="button"
                  className={`home-nav-link ${activeMegaMenu === "thingsToDo" ? "home-nav-link--active" : ""}`}
                >
                  <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                  <ChevronDown className="home-nav-link__icon" size={14} />
                </button>
              </li>

              {/* EAT & DRINK */}
              <li
                className="home-nav-item home-nav-item--has-dropdown"
                onMouseEnter={() => setActiveMegaMenu("eatDrink")}
              >
                <button
                  type="button"
                  className={`home-nav-link ${activeMegaMenu === "eatDrink" ? "home-nav-link--active" : ""}`}
                >
                  <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                  <ChevronDown className="home-nav-link__icon" size={14} />
                </button>
              </li>

              {/* ITINERARIES */}
              <li
                className="home-nav-item home-nav-item--has-dropdown"
                onMouseEnter={() => setActiveMegaMenu("itineraries")}
              >
                <button
                  type="button"
                  className={`home-nav-link ${activeMegaMenu === "itineraries" ? "home-nav-link--active" : ""}`}
                >
                  <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                  <ChevronDown className="home-nav-link__icon" size={14} />
                </button>
              </li>
            </ul>
          </nav>

          <div className="home-header__right">
            <HeaderSearch />
            <LanguageSwitch currentLang={lang} onLangChange={setLang} />
          </div>
        </div>

        {/* ── MEGAMENUS DROPDOWNS ── */}
        {activeMegaMenu === "inspired" && (
          <div className="home-megamenu home-megamenu--grid" onMouseEnter={() => setActiveMegaMenu("inspired")}>
            <div className="home-megamenu__container">
              <div className="home-megamenu__grid">
                {MEGA_MENUS_DATA.inspired.items.map((item) => (
                  <Link key={item.id} href={item.link} className="home-megamenu-card">
                    <div className="home-megamenu-card__img-wrap">
                      <img src={item.img} alt={item.title} className="home-megamenu-card__img" />
                      <span className="home-megamenu-card__badge">{item.badge}</span>
                    </div>
                    <div className="home-megamenu-card__body">
                      <span className="home-megamenu-card__date">{isVi ? item.dateVi : item.date}</span>
                      <h4 className="home-megamenu-card__title">{isVi ? item.titleVi : item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMegaMenu === "destinations" && (
          <div className="home-megamenu home-megamenu--destinations" onMouseEnter={() => setActiveMegaMenu("destinations")}>
            <div className="home-megamenu__container">
              <div className="home-megamenu__regions">
                {MEGA_MENUS_DATA.destinations.regions.map((region) => (
                  <div key={region.name} className="home-megamenu__region-col">
                    <h4 className="home-megamenu__region-title">{isVi ? region.name : region.nameEn}</h4>
                    <ul className="home-megamenu__province-list">
                      {region.provinces.map((prov) => (
                        <li key={prov.slug}>
                          <Link href={`/province/${prov.slug}`} className="home-megamenu__province-link">
                            {prov.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMegaMenu === "thingsToDo" && (
          <div className="home-megamenu home-megamenu--grid" onMouseEnter={() => setActiveMegaMenu("thingsToDo")}>
            <div className="home-megamenu__container">
              <div className="home-megamenu__grid">
                {MEGA_MENUS_DATA.thingsToDo.items.map((item) => (
                  <Link key={item.id} href={item.link} className="home-megamenu-card">
                    <div className="home-megamenu-card__img-wrap">
                      <img src={item.img} alt={item.title} className="home-megamenu-card__img" />
                      <span className="home-megamenu-card__badge">{item.badge}</span>
                    </div>
                    <div className="home-megamenu-card__body">
                      <span className="home-megamenu-card__date">{isVi ? item.dateVi : item.date}</span>
                      <h4 className="home-megamenu-card__title">{isVi ? item.titleVi : item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMegaMenu === "eatDrink" && (
          <div className="home-megamenu home-megamenu--grid" onMouseEnter={() => setActiveMegaMenu("eatDrink")}>
            <div className="home-megamenu__container">
              <div className="home-megamenu__grid">
                {MEGA_MENUS_DATA.eatDrink.items.map((item) => (
                  <Link key={item.id} href={item.link} className="home-megamenu-card">
                    <div className="home-megamenu-card__img-wrap">
                      <img src={item.img} alt={item.title} className="home-megamenu-card__img" />
                      <span className="home-megamenu-card__badge">{item.badge}</span>
                    </div>
                    <div className="home-megamenu-card__body">
                      <span className="home-megamenu-card__date">{isVi ? item.dateVi : item.date}</span>
                      <h4 className="home-megamenu-card__title">{isVi ? item.titleVi : item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMegaMenu === "itineraries" && (
          <div className="home-megamenu home-megamenu--grid" onMouseEnter={() => setActiveMegaMenu("itineraries")}>
            <div className="home-megamenu__container">
              <div className="home-megamenu__grid">
                {MEGA_MENUS_DATA.itineraries.items.map((item) => (
                  <Link key={item.id} href={item.link} className="home-megamenu-card">
                    <div className="home-megamenu-card__img-wrap">
                      <img src={item.img} alt={item.title} className="home-megamenu-card__img" />
                      <span className="home-megamenu-card__badge">{item.badge}</span>
                    </div>
                    <div className="home-megamenu-card__body">
                      <span className="home-megamenu-card__date">{isVi ? item.dateVi : item.date}</span>
                      <h4 className="home-megamenu-card__title">{isVi ? item.titleVi : item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Full-Bleed Hero Banner (Screenshot 3) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag">HANOI</span>
            <span className="vnn-fullbleed-hero__tag">ARTICLES</span>
            <span className="vnn-fullbleed-hero__tag">EAT &amp; DRINK</span>
          </div>
          <h1 className="vnn-fullbleed-hero__title">
            {isVi ? "8 món ngon nhất định phải thử tại Hà Nội" : "8 must-try foods in Hanoi"}
          </h1>
          <p className="vnn-fullbleed-hero__byline">
            By Welcome to Vietnam &nbsp;&nbsp;&nbsp; May 19, 2025
          </p>
        </div>
      </section>

      {/* ── Article Content Container ── */}
      <main className="vnn-article-container">
        {/* Pill CTA Button (Screenshot 3 & 4) */}
        <div className="vnn-pill-cta-container">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-pill-cta-btn"
          >
            <Sparkles size={16} />
            {isVi ? "Tạo kế hoạch du lịch Việt Nam chỉ trong vài giây" : "Create your Vietnam trip in seconds"}
          </a>
        </div>

        {/* Lead Intro Paragraph (Screenshot 3 & 4) */}
        <p className="vnn-article-lead">
          {isVi ? (
            <>
              Hà Nội là nơi ẩm thực gắn liền với truyền thống và sự tỉ mỉ. Những món ăn ở đây càng trở nên đặc sắc nhờ nét cổ kính của mảnh đất kinh kỳ và sự kiên định của những người đầu bếp với phương pháp nấu nướng thủ công. Họ từ chối các lối tắt nhanh gọn để giữ trọn vẹn hương vị xưa cũ. Mỗi bữa ăn ở Hà Nội đều kể một câu chuyện riêng, phản ánh bề dày lịch sử, văn hóa và niềm tự hào về bản sắc ẩm thực dân tộc. Cùng Vietnamnomad khám phá 8 đặc sản làm nên nét cuốn hút đặc biệt của ẩm thực Hà Nội.
            </>
          ) : (
            <>
              Hanoi is where food means tradition and care. Dishes here are made better by the city&apos;s old charm and the chefs&apos; loyalty to handmade cooking. These chefs refuse shortcuts and prefer to do things the traditional way. Every meal in Hanoi tells a story, reflecting the city&apos;s history, culture, and pride in its culinary identity. Let&apos;s explore 8 specialties that make Hanoi&apos;s food scene so special with Vietnamnomad.
            </>
          )}
        </p>

        {/* ── 8 Dishes List (Screenshots 4 & 5) ── */}
        <div className="vnn-dishes-list">
          {HANOI_8_DISHES.map((dish) => (
            <article key={dish.id} className="vnn-dish-item" id={dish.id}>
              <h2 className="vnn-dish-title">{isVi ? dish.titleVi : dish.title}</h2>
              <div className="vnn-dish-layout">
                {/* Column 1: Crisp Sharp Image (420px) */}
                <div className="vnn-dish-img-col">
                  <img
                    src={dish.img}
                    alt={dish.alt}
                    className="vnn-dish-img"
                    loading="lazy"
                  />
                </div>

                {/* Column 2: Detailed Text Content */}
                <div className="vnn-dish-content-col">
                  <p className="vnn-dish-text">
                    {isVi ? dish.descVi : dish.desc}
                  </p>

                  {/* Tip */}
                  {dish.tip && (
                    <p style={{ margin: "14px 0", color: "#334155", lineHeight: 1.6 }}>
                      <strong>Tip:</strong> {isVi ? dish.tipVi : dish.tip}
                    </p>
                  )}

                  {/* Where to eat / Địa chỉ */}
                  <span className="vnn-dish-subhead">
                    {isVi ? dish.whereToEatTitleVi : dish.whereToEatTitle}
                  </span>

                  <ul className="vnn-dish-bullets">
                    {(isVi ? dish.whereToEatVi : dish.whereToEat)?.map((spot, idx) => (
                      <li key={idx}>{spot}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Closing Paragraph ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "36px 0 24px" }}>
          {isVi ? (
            <>
              Nền ẩm thực Hà Nội là minh chứng sống động cho sự kiên nhẫn, di sản và tính cân bằng tinh tế. Từ những nồi nước phở bốc khói nghi ngút trong sương sớm cho đến tiếng xèo xèo của chảo chả cá trong những ngôi nhà cổ, 8 món ăn kể trên mở ra hành trình khám phá chân thực nhất về linh hồn của thủ đô ngàn năm văn hiến.
            </>
          ) : (
            <>
              Hanoi&apos;s culinary scene is a living testament to patience, heritage, and balance. From steaming pho cauldrons in the dawn mist to the sizzle of cha ca in historic shophouses, these 8 dishes offer an authentic journey into the soul of Vietnam&apos;s capital.
            </>
          )}
        </p>

        {/* ── Disclaimer Note ── */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#334155", margin: "0 0 28px", fontStyle: "italic" }}>
          {isVi
            ? "Note: Các gợi ý nhà hàng chỉ dựa trên trải nghiệm của tác giả; giá cả thực tế có thể thay đổi tùy thời điểm."
            : "Note: Restaurant recommendations are based on the authors' experiences; prices may vary."}
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
            href="/province/ha-noi"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Hanoi
          </Link>
          <Link
            href="/guide/8-must-try-foods-in-hanoi"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Hanoi Food
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
              href="/guide/3-week-vietnam-itinerary"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/hcmc/3-week-vietnam-itinerary.jpg"
                  alt="3-week Vietnam Itinerary"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "Lịch trình 3 tuần xuyên Việt" : "3-week Vietnam Itinerary"}
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
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/hcmc/hcmc-10-things-bitexco.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh" : "10 best things to do in Ho Chi Minh City"}
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
          name: isVi ? "Hà Nội" : "Hanoi",
          slug: "ha-noi",
        }}
      />
    </div>
  );
}
