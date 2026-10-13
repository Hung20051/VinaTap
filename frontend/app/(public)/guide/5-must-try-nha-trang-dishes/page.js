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
import "./nha-trang-food.css";

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

// ─── 5 MUST-TRY NHA TRANG DISHES DATA (MATCHING SCREENSHOTS 2, 3, 4, 5) ───
const NHA_TRANG_5_DISHES = [
  {
    id: "bun-ca",
    index: 1,
    title: "1. Bun Ca (Fish Noodle Soup)",
    titleVi: "1. Bún Cá (Fish Noodle Soup)",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Bun-Cha-Ca-Vietnamnomad.jpg",
    alt: "Bun Ca - Fish Noodle Soup Nha Trang",
    desc: (
      <>
        <span className="vnn-link-highlight">Bun Ca</span> is a beloved dish that showcases the abundant seafood of this region. The broth is simmered with fish bones, tomatoes, and pineapple, creating a beautiful balance of sweet and tangy flavors. Bun Ca is served in a bowl with rice noodles in a flavorful broth and topped with fish cakes, tuna or mackerel fillets, and fresh herbs for garnish. Fish cakes are made from fish puree mixed with spices such as dill and pepper before being steamed or fried (or steamed and then fried) until golden brown. Their chewiness adds texture to the dish and is a highlight of Bun Ca Nha Trang. This fish noodle soup is ideal for breakfast or lunch, given its light yet filling profile.
      </>
    ),
    descVi: (
      <>
        <span className="vnn-link-highlight">Bún cá</span> là món ăn được yêu thích hàng đầu, tôn vinh nguồn hải sản phong phú của vùng biển Nha Trang. Nước dùng được ninh từ xương cá biển, cà chua và dứa, tạo nên sự cân bằng tuyệt vời giữa vị ngọt thanh và chua nhẹ tự nhiên. Bún cá được phục vụ trong tô bún ngập nước dùng đậm đà, phủ lên trên là chả cá, phi lê cá ngừ hoặc cá cờ và các loại rau thơm. Chả cá được làm từ thịt cá tươi quết cùng thì là, hạt tiêu trước khi hấp hoặc chiên vàng ruộm. Độ dai giòn sần sật làm tăng thêm hương vị và là điểm nhấn đặc trưng của bún cá Nha Trang. Món bún này rất lý tưởng cho bữa sáng hoặc trưa bởi vị thanh nhẹ nhưng no lâu.
      </>
    ),
    tipsTitle: "Tips:",
    tipsTitleVi: "Tips:",
    tips: [
      "Go for Bun Cha Ca if you're keen on fish cakes or Bun Ca if you prefer only fish fillet.",
      "Apart from the typical rice noodles (Bun), you can opt for Banh Canh Cha Ca, which is served with thick, round noodles.",
    ],
    tipsVi: [
      "Hãy chọn Bún Chả Cá nếu bạn thích chả cá dai giòn hoặc Bún Cá nếu bạn thích phi lê cá nguyên miếng.",
      "Bên cạnh bún sợi thông thường, bạn có thể chọn Bánh Canh Chả Cá với sợi bánh canh to tròn, dẻo dai đặc trưng.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Bun Cha Ca Hanh Nhien (32c Le Dai Hanh): 35,000 VND – 55,000 VND ($1.4 – $2.2)",
    ],
    whereToTryVi: [
      "Bún Chả Cá Hạnh Nhiên (32c Lê Đại Hành): 35.000 VNĐ – 55.000 VNĐ ($1.4 – $2.2)",
    ],
  },
  {
    id: "bun-sua",
    index: 2,
    title: "2. Bun Sua (Jellyfish Noodle Soup)",
    titleVi: "2. Bún Sứa (Jellyfish Noodle Soup)",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Bun-Sua-by-Vietnamnomad.jpg",
    alt: "Bun Sua - Jellyfish Noodle Soup Nha Trang",
    desc: (
      <>
        Another traditional seafood noodle dish, but this time with a twist. Bun Sua is essentially an extension of Bun Ca, the fish noodle soup mentioned earlier. With a light yet flavorful broth as its base, the jellyfish adds an interesting crunch to contrast with the softness of the noodles. Diners can order Bun Sua or Bun Ca Sua, which includes both fish and jellyfish. Don't forget to add some fresh chili and a squeeze of lime juice for a burst of flavor. Bun Sua is a great choice for those looking for something unique and unexpectedly delicious.
      </>
    ),
    descVi: (
      <>
        Một món bún hải sản truyền thống khác nhưng mang nét biến tấu độc đáo. Bún sứa về cơ bản là khúc biến tấu mở rộng từ món bún cá. Với nền nước dùng thanh ngọt, từng miếng sứa biển trắng giòn sần sật tạo sự tương phản thú vị với sợi bún mềm mại. Thực khách có thể gọi Bún Sứa hoặc Bún Cá Sứa kết hợp cả chả cá lẫn sứa tươi. Đừng quên thêm chút ớt tươi và vắt lát chanh để hương vị bùng nổ. Bún sứa là lựa chọn tuyệt vời cho những ai tìm kiếm trải nghiệm ẩm thực độc đáo và ngon bất ngờ.
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Besides Bun Sua, the crunchy jellyfish is also used in many other regional dishes like Goi Sua (jellyfish salad).",
    ],
    tipsVi: [
      "Ngoài bún sứa, sứa biển giòn sần sật còn được dùng trong nhiều món đặc sản miền biển khác như Gỏi Sứa.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Nguyen Loan (123 Ngo Gia Tu): 45,000 VND",
      "Co Ba (105 Hoang Hoa Tham): 48,000 VND",
    ],
    whereToTryVi: [
      "Nguyên Loan (123 Ngô Gia Tự): 45.000 VNĐ",
      "Cô Ba (105 Hoàng Hoa Thám): 48.000 VNĐ",
    ],
  },
  {
    id: "banh-can",
    index: 3,
    title: "3. Banh Can (Mini Pancakes)",
    titleVi: "3. Bánh Căn (Mini Pancakes)",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Banh-Can-Vietnamnomad.jpg",
    alt: "Banh Can - Mini Rice Pancakes Nha Trang",
    desc: (
      <>
        <p style={{ margin: "0 0 14px" }}>
          Banh Can are small, savory rice flour pancakes that are a favorite all-day snack in Nha Trang. Cooked in small clay molds over a charcoal fire, they develop a crispy exterior and a soft, slightly fluffy interior. The toppings come in a great variety, including quail eggs, shrimp, minced pork or beef, and baby squid.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          The star of the Banh Can dish is the tangy dipping sauce, perfected with finely chopped green onions, fresh chili, and fried shallots. For a heartier meal, you can pair Banh Can with Xiu Mai, which consists of minced pork mixed with spices like red onion and pepper, combined with breadcrumbs. Another popular side dish is Cha Bo, steamed beef sausages wrapped in banana leaves. Breakfast and dinner are the perfect times to enjoy this bite-sized delight.
        </p>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px" }}>
          Bánh căn là những chiếc bánh bột gạo nhỏ tròn xoe, món ăn vặt được yêu thích suốt cả ngày tại Nha Trang. Được đổ trong các khuôn đất nung nhỏ trên lò than củi đỏ rực, bánh có lớp vỏ ngoài giòn rụm và phần ruột mềm xốp. Phần nhân topping rất phong phú, từ trứng cút, tôm tươi, thịt heo hoặc bò băm cho đến mực cơm tươi rói.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          Ngôi sao làm nên linh hồn món bánh căn là chén nước chấm thơm ngon, hòa quyện cùng mỡ hành thái nhỏ, ớt tươi và hành phi. Để bữa ăn thêm trọn vẹn, bạn có thể ăn kèm bánh căn với xíu mại thịt viên béo ngậy. Một món kèm phổ biến khác là chả bò gói lá chuối thơm lừng. Bữa sáng và bữa tối là thời điểm lý tưởng nhất để thưởng thức món ăn nóng hổi này.
        </p>
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      'When in doubt, look for "thap cam" or "day du" – both mean "a bit of everything", allowing you to sample a variety of Banh Can fillings.',
    ],
    tipsVi: [
      'Nếu phân vân, hãy gọi đĩa "thập cẩm" hoặc "đầy đủ" – nghĩa là có mỗi loại một ít, giúp bạn nếm thử trọn vẹn các loại nhân bánh căn.',
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Banh Xeo 134 (134 Tran Quy Cap): 30,000 VND – 50,000 VND",
      "Banh Can Ut Nam (19 Ngo Den): 25,000 VND – 60,000 VND",
    ],
    whereToTryVi: [
      "Bánh Xèo 134 (134 Trần Quý Cáp): 30.000 VNĐ – 50.000 VNĐ",
      "Bánh Căn Út Năm (19 Ngô Đến): 25.000 VNĐ – 60.000 VNĐ",
    ],
  },
  {
    id: "xoi-ca",
    index: 4,
    title: "4. Xoi Ca (Caramelized Fish Sticky Rice)",
    titleVi: "4. Xôi Cá (Caramelized Fish Sticky Rice)",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Xoi-Ca-Vietnamnomad.jpg",
    alt: "Xoi Ca - Caramelized Fish Sticky Rice Nha Trang",
    desc: (
      <>
        <p style={{ margin: "0 0 14px" }}>
          Xoi Ca is a true staple of Nha Trang City, rarely found anywhere else. It&apos;s a simple yet comforting and savory dish, bringing together the fragrance of the land and the taste of the sea. The <span className="vnn-link-highlight">sticky rice</span> is steamed with a bit of coconut milk for extra richness.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          The unbeatable hero of this dish is the caramelized fish, most likely mackerel or anchovy, that&apos;s been seasoned and cooked to perfection: it&apos;s sweet, salty, and spicy; all the flavors are there. The fish is slow-braised until the bones are soft and can be chewed easily. Xoi Ca is also topped with pickled carrots and fried shallots, creating a balanced overall flavor. This dish is quite filling, making it best suited for breakfast or lunch.
        </p>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px" }}>
          Xôi cá là món ngon đặc sản độc đáo của thành phố Nha Trang, hiếm thấy ở nơi nào khác. Đây là món ăn giản dị nhưng ấm lòng và đậm đà, kết hợp giữa hương thơm đồng bằng và vị mặn mòi của biển cả. Hạt <span className="vnn-link-highlight">gạo nếp</span> được đồ cùng chút nước cốt dừa để tăng thêm độ béo bùi dẻo thơm.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          Linh hồn không thể thay thế của món ăn là phần cá kho kẹo, thường là cá cơm hoặc cá nục tươi, được nêm nếm và kho đến độ hoàn hảo: ngọt, mặn và cay nồng hòa quyện. Cá được kho liu riu cho đến khi xương mềm nhừ có thể nhai tan. Xôi cá còn được ăn kèm cà rốt chua ngọt và hành phi vàng thơm, tạo nên hương vị cân bằng trọn vẹn. Món ăn này rất chắc bụng, lý tưởng cho bữa sáng hoặc bữa trưa.
        </p>
      </>
    ),
    tipsTitle: "Tip:",
    tipsTitleVi: "Tip:",
    tips: [
      "Xoi Ca is commonly a takeaway dish. You can either sit down at a café and order it through food delivery apps or buy a box (or two) to take with you to a café or the beach.",
    ],
    tipsVi: [
      "Xôi cá thường được bán mang đi. Bạn có thể ngồi ở quán cà phê và đặt qua app giao đồ ăn hoặc mua một hộp mang ra bãi biển hay quán cà phê vừa ngắm cảnh vừa thưởng thức.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Quan Xoi Sau Khai (1 Phat Hoc): 30,000 VND",
      "Xoi Ca Com (9 Ngo Si Lien): 20,000 VND",
    ],
    whereToTryVi: [
      "Quán Xôi Sáu Khải (1 Phật Học): 30.000 VNĐ",
      "Xôi Cá Cơm (9 Ngô Sĩ Liên): 20.000 VNĐ",
    ],
  },
  {
    id: "nem-nuong",
    index: 5,
    title: "5. Nem Nuong (Grilled Pork Platter)",
    titleVi: "5. Nem Nướng (Grilled Pork Platter)",
    img: "/guide/nha-trang/Top-Nha-Trang-Dishes-Nem-Nuong-Vietnamnomad.jpg",
    alt: "Nem Nuong - Nha Trang Grilled Pork Platter",
    desc: (
      <>
        <p style={{ margin: "0 0 14px" }}>
          Nem Nuong is the most well-known Nha Trang specialty that you won&apos;t want to miss. These are pork sausages skewered on wooden sticks, or ideally on lemongrass stems, and chargrilled, giving them a distinctive smoky and aromatic fragrance. A portion of Nem Nuong is served on a tray with crispy fried rice paper rolls, fresh vegetables, shredded green mango, cucumber, and chives.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          When eating, grab a sheet of rice paper, place all the ingredients on it, then roll it tightly and dip the roll in the sweet, purée-like dipping sauce. It&apos;s amazing how all the separate ingredients come together in a rich and delightful flavor and texture. If you&apos;re down for a hands-on dining experience, Nem Nuong is what to look for.
        </p>
      </>
    ),
    descVi: (
      <>
        <p style={{ margin: "0 0 14px" }}>
          Nem nướng là món đặc sản Nha Trang nổi tiếng nhất mà bạn chắc chắn không muốn bỏ lỡ. Thịt heo nạc được quết nhuyễn ghim vào que tre hoặc thân sả rồi nướng trên than hoa đỏ rực, mang đến mùi thơm khói quyến rũ đặc trưng. Một mẹt nem nướng dọn ra với nem nướng nóng hổi, ram chiên giòn rụm, đĩa rau sống tươi non, xoài xanh bào sợi, dưa leo và hẹ.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          Khi ăn, bạn lấy một miếng bánh tráng, đặt tất cả nguyên liệu lên trên, cuộn chặt tay rồi chấm ngập vào chén nước chấm sền sệt béo ngọt. Thật tuyệt vời khi từng nguyên liệu hòa quyện tạo nên hương vị thơm ngon khó quên. Nếu bạn thích trải nghiệm tự tay cuốn đồ ăn, nem nướng chính là lựa chọn số 1.
        </p>
      </>
    ),
    tipsTitle: "Tips:",
    tipsTitleVi: "Tips:",
    tips: [
      "Nem Nuong is a meat-based dish, but the dipping sauce is made from puréed shrimp. So if you're allergic to seafood, ask for another type of dipping sauce.",
      "Nem Nuong can also be served in a bowl with rice noodles. In case you don't want to touch the food with your bare hands, opt for Bun Nem Nuong.",
    ],
    tipsVi: [
      "Nem nướng là món từ thịt heo, nhưng nước chấm được nấu từ tôm xay nhuyễn. Nếu bạn dị ứng hải sản, hãy yêu cầu đổi sang nước mắm hoặc nước chấm khác.",
      "Nem nướng cũng có thể được phục vụ dưới dạng tô bún. Nếu không muốn ăn bốc bằng tay, bạn có thể gọi Bún Nem Nướng.",
    ],
    whereToTryTitle: "Where to try:",
    whereToTryTitleVi: "Where to try:",
    whereToTry: [
      "Nem Nuong Dang Van Quyen (16A Lan Ong): 52,000 VND",
      "Nem Nuong Ninh Hoa - To Huu (80 To Huu): 39,000 VND",
    ],
    whereToTryVi: [
      "Nem Nướng Đặng Văn Quyên (16A Lãn Ông): 52.000 VNĐ",
      "Nem Nướng Ninh Hòa - Tố Hữu (80 Tố Hữu): 39.000 VNĐ",
    ],
  },
];

export default function NhaTrangFoodGuidePage() {
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
      {/* ── Top Companion Banner (Screenshot 1) ── */}
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

      {/* ── FULL-BLEED HERO BANNER (SCREENSHOT 1) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag">ARTICLES</span>
            <span className="vnn-fullbleed-hero__tag">EAT & DRINK</span>
            <span className="vnn-fullbleed-hero__tag">NHA TRANG</span>
          </div>

          <h1 className="vnn-fullbleed-hero__title">
            {isVi ? "5 món ngon Nha Trang nhất định phải thử" : "5 must-try Nha Trang dishes"}
          </h1>

          <p className="vnn-fullbleed-hero__byline">
            {isVi
              ? "Bởi Welcome to Vietnam   17 Tháng 2, 2025"
              : "By Welcome to Vietnam   February 17, 2025"}
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT (SCREENSHOTS 1, 2, 3, 4, 5) ── */}
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
            {isVi
              ? "Từ những nồi nước dùng thơm ngọt đến những món nướng than hoa hấp dẫn, ẩm thực Nha Trang là sự hòa quyện hoàn hảo giữa nguyên liệu tươi ngon của biển cả và hương vị đậm đà. Hãy cùng khám phá ẩm thực đa dạng của phố biển này qua 5 món ăn đặc sản Nha Trang nhất định phải thử, đưa vị giác của bạn vào một hành trình khó quên."
              : "From aromatic broths to grilled delights, Nha Trang's food is a perfect blend of fresh ingredients and bold flavors. Let's dive into the diverse food scene of this coastal gem with 5 must-try Nha Trang dishes that will take your taste buds on a journey."}
          </p>
        </div>

        {/* ── 5 DISHES LISTING (SCREENSHOTS 2, 3, 4, 5) ── */}
        <div className="vnn-dishes-list">
          {NHA_TRANG_5_DISHES.map((dish) => (
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

        {/* ── Closing Paragraph (Image 1) ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "36px 0 24px" }}>
          {isVi ? (
            <>
              Năm món ăn kể trên sẽ mang đến cho du khách hương vị chân thực và sống động nhất về{" "}
              <Link href="/province/khanh-hoa" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                Nha Trang
              </Link>
              , dù bạn đang tìm kiếm một tô bún nóng hổi đậm đà, những món cuốn chấm hay các món ăn vặt đường phố. Nếu có dịp ghé thăm thành phố biển này, nhất định đừng bỏ lỡ những hương vị biểu tượng ấy.
            </>
          ) : (
            <>
              The five dishes listed above will offer visitors a dynamic and genuine taste of{" "}
              <Link href="/province/khanh-hoa" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                Nha Trang
              </Link>
              , whether you&apos;re in the mood for a hearty bowl of soup, a wrap-and-roll treat, or takeout snacks. If you find yourself in the city, make sure to try these iconic flavors.
            </>
          )}
        </p>

        {/* ── Disclaimer Note (Image 2) ── */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#334155", margin: "0 0 28px" }}>
          <strong>Note:</strong>{" "}
          {isVi
            ? "Các đề xuất nhà hàng chỉ dựa trên trải nghiệm của tác giả; giá cả thực tế có thể thay đổi tùy thời điểm."
            : "Restaurant recommendations are only suggestions based on the authors' experiences; prices may vary."}
        </p>

        {/* ── Tags (Image 2) ── */}
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
            href="/province/khanh-hoa"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Nha Trang
          </Link>
          <Link
            href="/guide/5-must-try-nha-trang-dishes"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Nha Trang Dishes
          </Link>
        </div>

        {/* ── Divider (Image 2) ── */}
        <hr style={{ border: 0, height: "1px", background: "#e2e8f0", margin: "40px 0" }} />

        {/* ── Related Articles (Image 2) ── */}
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
              href="/guide/8-must-try-foods-in-hanoi"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg"
                  alt="8 must-try foods in Hanoi"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "8 món ăn nhất định phải thử ở Hà Nội" : "8 must-try foods in Hanoi"}
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
          name: isVi ? "Khánh Hòa" : "Khanh Hoa",
          slug: "khanh-hoa",
        }}
      />
    </div>
  );
}
