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
import "./hcmc-food.css";

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

// ─── 12 MUST-TRY FOODS DATA (MATCHING SCREENSHOTS 1 TO 5) ───
const HCMC_12_DISHES = [
  {
    id: "com-tam",
    index: 1,
    title: "1. Com Tam",
    titleVi: "1. Cơm Tấm",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg",
    alt: "Com Tam - Broken Rice Ho Chi Minh City",
    desc: (
      <>
        <em><span className="vnn-link-highlight">Com tam</span></em>, or broken rice, is the beating heart of Saigonese cuisine—a dish so iconic you simply can&apos;t leave the city without trying it. Whether for breakfast, lunch, dinner, or a midnight craving, this flexible dish always delivers. The classic combo includes grilled pork chop, shredded pork skin, steamed egg meatloaf, and a sunny side up egg atop fragrant, broken rice. It&apos;s usually served with pickled veggies and a drizzle of sweet savory fish sauce. Add some scallion oil and crispy pork fat, and you&apos;ve got yourself a heavenly bite. Best enjoyed with a cold drink in a bustling local eatery.
      </>
    ),
    descVi: (
      <>
        <em><span className="vnn-link-highlight">Cơm tấm</span></em>, hay cơm nấu từ hạt gạo tấm vỡ, là nhịp đập của ẩm thực Sài Gòn — món ăn biểu tượng mà bạn nhất định không thể bỏ qua khi ghé thăm thành phố. Dù cho bữa sáng, bữa trưa, bữa tối hay cơn đói lúc nửa đêm, đĩa cơm tấm luôn chiều lòng thực khách. Đĩa cơm kinh điển gồm sườn nướng than hoa thơm lừng, bì dai giòn, chả trứng bùi béo và quả trứng ốp la lòng đào trên đĩa cơm tấm thơm phức. Món ăn thường kèm đồ chua và thìa nước mắm chua ngọt sóng sánh. Thêm chút mỡ hành và tóp mỡ giòn rụm, bạn sẽ có ngay một bữa ăn tuyệt hảo.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Com Tam Moc (85 Ly Tu Trong): 95,000 VND ($3.65, 1 USD ~ 26,000 VND)",
      "Com Tam Chi Hang (28 Do Quang Dau): 82,000 VND",
    ],
    whereToEatVi: [
      "Cơm Tấm Mộc (85 Lý Tự Trọng): 95.000 VNĐ ($3.65)",
      "Cơm Tấm Chị Hằng (28 Đỗ Quang Đẩu): 82.000 VNĐ",
    ],
  },
  {
    id: "banh-mi",
    index: 2,
    title: "2. Banh Mi",
    titleVi: "2. Bánh Mì",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Mi.jpg",
    alt: "Banh Mi - Vietnamese Baguette Sandwich",
    desc: (
      <>
        <em><span className="vnn-link-highlight">Banh mi</span></em> isn&apos;t just a sandwich; it&apos;s a full-on flavor explosion in a crispy baguette. With its roots in French colonial times, this Vietnamese sandwich has evolved into something truly unique. The crusty bread holds an endless mix of fillings—cold cuts, pate, grilled meat, fried egg, or even sardines—topped with pickled carrots, cucumbers, coriander, and a splash of soy or chili sauce. It&apos;s perfect for on the go munching. Some vendors even offer vegetarian options, so feel free to ask (and if they don&apos;t have it, chances are they&apos;ll point you to someone who does).
      </>
    ),
    descVi: (
      <>
        <em><span className="vnn-link-highlight">Bánh mì</span></em> không chỉ đơn thuần là bánh kẹp; đó là sự bùng nổ hương vị trọn vẹn trong ổ baguette giòn rụm. Bắt nguồn từ thời Pháp thuộc, ổ bánh mì Việt Nam đã biến chuyển thành di sản ẩm thực độc nhất vô nhị. Vỏ bánh nướng giòn tan ôm trọn lớp nhân phong phú: chả lụa, pate béo bùi, thịt nướng thơm lừng, trứng ốp la, dưa leo tươi mát, đồ chua, ngò rí và chút nước tương hay tương ớt cay nồng. Cực kỳ tiện lợi để ăn nhanh khi đang dạo phố.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Banh Mi Huynh Hoa (26 Le Thi Rieng): 68,000 VND",
      "Banh Mi Pho Co 159 (31/1 Ton That Tung): 49,000 VND",
    ],
    whereToEatVi: [
      "Bánh Mì Huỳnh Hoa (26 Lê Thị Riêng): 68.000 VNĐ",
      "Bánh Mì Phố Cổ 159 (31/1 Tôn Thất Tùng): 49.000 VNĐ",
    ],
  },
  {
    id: "banh-xeo",
    index: 3,
    title: "3. Banh Xeo",
    titleVi: "3. Bánh Xèo",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Xeo.jpg",
    alt: "Banh Xeo - Crispy Vietnamese Pancake",
    desc: (
      <>
        Watching <em><span className="vnn-link-highlight">banh xeo</span></em> cook is half the fun. These crispy golden pancakes are made in large, sizzling pans, with a batter of rice flour, turmeric, and coconut milk. The filling—shrimp, pork, and bean sprouts—is folded inside the thin, crackling shell. But that&apos;s just the beginning. Wrap it in mustard greens or lettuce, add fresh herbs, and dip it in tangy fish sauce for a bite that&apos;s crunchy, savory, and fresh all at once. It&apos;s a communal dish that invites sharing, storytelling, and the pure joy of messy, delicious eating. Don&apos;t be afraid to get your hands dirty—it&apos;s part of the <em>banh xeo</em> fun.
      </>
    ),
    descVi: (
      <>
        Ngắm nhìn chảo <em><span className="vnn-link-highlight">bánh xèo</span></em> sôi xèo xèo trên lửa là một trải nghiệm thú vị. Chiếc bánh vàng ươm giòn rụm được làm từ bột gạo, bột nghệ và nước cốt dừa béo ngậy. Phần nhân gồm tôm tươi ngọt thịt, thịt ba rọi và giá đỗ được gói ghém khéo léo trong lớp vỏ giòn tan. Cuộn một miếng bánh xèo vào lá cải bẹ xanh hay xà lách cùng rau rừng, rồi chấm ngập trong chén nước mắm tỏi ớt chua ngọt.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Hoang Tam Restaurant (TK22/1 Nguyen Canh Chan): 179,000 VND",
      "Banh Xeo An Ghien (74 Suong Nguyet Anh): 85,000 VND",
    ],
    whereToEatVi: [
      "Nhà Hàng Hoàng Tâm (TK22/1 Nguyễn Cảnh Chân): 179.000 VNĐ",
      "Bánh Xèo Ăn Là Ghiền (74 Sương Nguyệt Ánh): 85.000 VNĐ",
    ],
  },
  {
    id: "goi-cuon",
    index: 4,
    title: "4. Goi Cuon & Bo Bia",
    titleVi: "4. Gỏi Cuốn & Bò Bía",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg",
    alt: "Goi Cuon & Bo Bia - Fresh Spring Rolls",
    desc: (
      <>
        When you want something light but full of flavor, <em><span className="vnn-link-highlight">goi cuon</span></em> and <em><span className="vnn-link-highlight">bo bia</span></em> (spring rolls & Chinese-style spring rolls) are your go-to. These fresh rolls are wrapped in soft rice paper and packed with herbs, vermicelli noodles, pork, and shrimp for the former, or Chinese sausage with jicama for the latter. They&apos;re refreshing, low-calorie, and served with a thick, savory peanut-hoisin dipping sauce that takes them to the next level. Perfect as an afternoon snack, a starter, or a healthy bite between sightseeing stops.
      </>
    ),
    descVi: (
      <>
        Khi bạn muốn một món ăn thanh mát nhưng ngập tràn hương vị, <em><span className="vnn-link-highlight">gỏi cuốn</span></em> và <em><span className="vnn-link-highlight">bò bía</span></em> chính là lựa chọn số 1. Từng cuốn bánh tráng dẻo mềm bọc lấy bún tươi, tôm luộc đỏ au, thịt ba rọi nạc mỡ đan xen cùng rau thơm mát lành, hoặc lạp xưởng và củ sắn ngọt dịu đối với bò bía. Món cuốn chấm cùng tương đen đậu phộng béo bùi rắc thêm ớt hiểm cay nồng sẽ khiến bạn say đắm.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEatText: "This is a popular street food priced at 10,000-20,000 VND per roll. You'll find it at markets and sidewalk vendors all over the city.",
    whereToEatTextVi: "Đây là món ăn vặt đường phố phổ biến có giá chỉ 10.000 - 20.000 VNĐ một cuốn. Bạn có thể dễ dàng tìm thấy tại các khu chợ truyền thống và quầy hàng rong trên khắp các con phố Sài Gòn.",
  },
  {
    id: "bo-ne",
    index: 5,
    title: "5. Bo Ne",
    titleVi: "5. Bò Né",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bo-Ne.jpg",
    alt: "Bo Ne - Sizzling Beef Steak Ho Chi Minh City",
    desc: (
      <>
        You want steak and eggs? We have them—served to you still sizzling. <em>Bo ne</em> features thin slices of beef, often paired with egg, pate, sausage, or even meatballs, all cooking on a hot cast iron skillet. The name &ldquo;ne&rdquo; (meaning &ldquo;to dodge&rdquo;) comes from dodging the hot oil splatters! Served with a baguette or French fries to soak up the juicy sauces, it&apos;s hearty, indulgent, and truly delicious. Add a bit of chili sauce, fresh tomato slices, and cucumber on the side for the full experience. Ideal for brunch or a protein packed dinner with a twist of local flair.
      </>
    ),
    descVi: (
      <>
        Bạn thèm món bít tết kèm trứng? Sài Gòn có món ăn phục vụ ngay trên chảo gang reo xèo xèo. <em>Bò né</em> gồm những lát thịt bò mềm ướp sốt đậm đà, ăn cùng trứng ốp la lòng đào, pate gan béo ngậy, xúc xích hay xíu mại. Cái tên &ldquo;né&rdquo; xuất phát từ việc thực khách phải hơi né người ra để tránh dầu bơ bắn nhẹ khi chảo vừa bưng ra bàn! Dùng kèm ổ bánh mì nóng giòn quệt sạch lớp nước sốt thịt bơ óng ả, đem lại bữa ăn đậm đà khó quên.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bo Ne Ba Ngon (18 Dinh Tien Hoang): 68,000 VND",
      "Bo Ne Ba Nui (94 Nguyen Thai Binh): 68,000 VND",
    ],
    whereToEatVi: [
      "Bò Né Ba Ngon (18 Đinh Tiên Hoàng): 68.000 VNĐ",
      "Bò Né Bà Núi (94 Nguyễn Thái Bình): 68.000 VNĐ",
    ],
  },
  {
    id: "hu-tieu",
    index: 6,
    title: "6. Hu Tieu",
    titleVi: "6. Hủ Tiếu",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Hu-Tieu.jpg",
    alt: "Hu Tieu - Southern Clear Noodle Soup",
    desc: (
      <>
        If you want to understand the depth of southern Vietnamese noodle culture, start with a bowl of <em>hu tieu</em>. Chewy rice noodles are served in a clear, delicately sweet pork and dried squid broth, topped with shrimp, minced pork, quail eggs, and golden crispy garlic. You can enjoy it as a piping hot soup or &ldquo;dry&rdquo; (<em>hu tieu kho</em>), tossed in a savory soy-based sauce with the broth on the side.
      </>
    ),
    descVi: (
      <>
        Để thấu hiểu văn hóa ẩm thực sợi phương Nam, hãy bắt đầu bằng một tô <em>hủ tiếu</em>. Sợi hủ tiếu dai mướt chan trong nước lèo ngọt thanh ninh từ xương heo và mực nướng, đầy ắp tôm tươi, thịt nạc, thịt băm, trứng cút và tỏi phi thơm lừng. Bạn có thể chọn ăn nước hoặc ăn khô trộn sốt tương đen đậm vị.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Hu Tieu My Tho Thanh Xuan (62 Ton That Thiep): 75,000 VND",
      "Hu Tieu Nam Vang Nhan Quan (122 Nguyen Trai): 85,000 VND",
    ],
    whereToEatVi: [
      "Hủ Tiếu Mỹ Tho Thanh Xuân (62 Tôn Thất Thiệp): 75.000 VNĐ",
      "Hủ Tiếu Nam Vang Nhân Quán (122 Nguyễn Trãi): 85.000 VNĐ",
    ],
  },
  {
    id: "bun-rieu",
    index: 7,
    title: "7. Bun Rieu",
    titleVi: "7. Bún Riêu",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Rieu.jpg",
    alt: "Bun Rieu - Crab Paste Noodle Soup",
    desc: (
      <>
        A colorful, savory feast in a bowl, <em>bun rieu</em> showcases sweet freshwater crab meat cooked into savory floating clusters alongside fried tofu, blood cubes, and ripe tomatoes in a tart tamarind-scented broth. Served with shredded morning glory, banana blossoms, and a dab of pungent shrimp paste to elevate every spoonful.
      </>
    ),
    descVi: (
      <>
        Bát <em>bún riêu</em> rực rỡ sắc màu với từng tảng riêu cua đồng thơm bùi nổi bồng bềnh, đậu hũ chiên vàng ươm mọng nước, cà chua tươi và nước lèo chua thanh mát dịu từ me chín. Thêm muỗng mắm tôm nồng nàn và dĩa rau muống chẻ xanh mướt là đúng chuẩn phong vị Sài Gòn.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Rieu Ganh Ben Thanh (163 Le Thanh Ton): 65,000 VND",
      "Bun Rieu Cua Oc 66 (66 Nguyen Thai Binh): 60,000 VND",
    ],
    whereToEatVi: [
      "Bún Riêu Gánh Bến Thành (163 Lê Thánh Tôn): 65.000 VNĐ",
      "Bún Riêu Cua Ốc 66 (66 Nguyễn Thái Bình): 60.000 VNĐ",
    ],
  },
  {
    id: "bun-thit-nuong",
    index: 8,
    title: "8. Bun Thit Nuong",
    titleVi: "8. Bún Thịt Nướng",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Thit-Nuong.jpg",
    alt: "Bun Thit Nuong - Grilled Pork Vermicelli",
    desc: (
      <>
        Smoky chargrilled pork slices and crispy fried spring rolls piled atop a bed of soft rice vermicelli, fresh herbs, pickled carrots, and crushed peanuts. Drizzle generously with sweet garlic chili fish sauce and toss everything together for a balanced, texturally thrilling meal that epitomizes Saigon street gastronomy.
      </>
    ),
    descVi: (
      <>
        Tô <em>bún thịt nướng</em> thơm nức mũi với từng lát thịt heo ướp sả nướng than hoa vàng óng, chả giò giòn rụm xếp trên lớp bún tươi, rau sống mát lành và đậu phộng rang giòn. Chan ngập chén nước mắm tỏi ớt chua ngọt rồi trộn đều, vị béo ngọt giòn tươi hòa quyện khó cưỡng.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Thit Nuong Chi Tuyen (175 Co Giang): 65,000 VND",
      "Bun Thit Nuong Hai Dang (149 Chan Hung): 55,000 VND",
    ],
    whereToEatVi: [
      "Bún Thịt Nướng Chị Tuyền (175 Cô Giang): 65.000 VNĐ",
      "Bún Thịt Nướng Hải Đăng (149 Chấn Hưng): 55.000 VNĐ",
    ],
  },
  {
    id: "bun-mam",
    index: 9,
    title: "9. Bun Mam",
    titleVi: "9. Bún Mắm",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Mam.jpg",
    alt: "Bun Mam - Mekong Fermented Fish Noodle Soup",
    desc: (
      <>
        Known as the &ldquo;gumbo of Vietnam,&rdquo; <em>bun mam</em> features a deeply flavorful fermented fish broth simmered with lemongrass and eggplant. Laden with peeled prawns, squid, crispy roast pork belly, and fish fillets, it is served alongside an abundant platter of water lilies, bitter herbs, and banana blossoms.
      </>
    ),
    descVi: (
      <>
        Được ví như món súp gumbo của phương Nam, <em>bún mắm</em> sở hữu làn nước lèo nấu từ mắm cá linh, cá sặc đậm đà thơm ngát hương sả và cà tím. Topping ngập tràn với tôm sú tươi ngọt, mực ống giòn sần sật, heo quay giòn bì và đĩa rau miệt vườn với bông súng, kèo nèo xanh mướt.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Mam Co Ba (59 Chau Van Liem): 85,000 VND",
      "Bun Mam 444 (375 Huynh Tan Phat): 75,000 VND",
    ],
    whereToEatVi: [
      "Bún Mắm Cô Ba (59 Châu Văn Liêm): 85.000 VNĐ",
      "Bún Mắm 444 (375 Huỳnh Tấn Phát): 75.000 VNĐ",
    ],
  },
  {
    id: "oc",
    index: 10,
    title: "10. Oc (Snails & Shellfish)",
    titleVi: "10. Ốc & Hải Sản Vỉa Hè",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Shellfish.jpg",
    alt: "Oc - Snails & Shellfish Saigon",
    desc: (
      <>
        An evening snail feast is an quintessential Saigon rite of passage. Sidewalk stalls showcase dozens of fresh shellfish stir-fried in salted egg sauce, roasted with chili salt, sautéed in garlic butter, or grilled with scallion oil and peanuts. Dip crusty baguettes into the rich gravies and wash it down with a cold local lager.
      </>
    ),
    descVi: (
      <>
        Ăn ốc đêm vỉa hè là nét văn hóa đặc trưng nhất của Sài Gòn. Hàng chục loại ốc và hải sản tươi sống được biến tấu tài tình: sốt trứng muối béo ngậy, rang muối ớt cay nồng, xào bơ tỏi thơm lừng hay nướng mỡ hành đậu phộng. Chấm bánh mì nóng giòn vào nước sốt và nhâm nhi cùng ly bia mát lạnh.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Oc Dao (212B/C79 Nguyen Trai): 80,000 - 150,000 VND",
      "Oc Oanh (534 Vinh Khanh, District 4): 90,000 - 180,000 VND",
    ],
    whereToEatVi: [
      "Ốc Đào (212B/C79 Nguyễn Trãi): 80.000 - 150.000 VNĐ",
      "Ốc Oanh (534 Vĩnh Khánh, Quận 4): 90.000 - 180.000 VNĐ",
    ],
  },
  {
    id: "xoi-man",
    index: 11,
    title: "11. Xoi Man",
    titleVi: "11. Xôi Mặn Thập Cẩm",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Xoi-Man.jpg",
    alt: "Xoi Man - Savory Sticky Rice",
    desc: (
      <>
        Steaming savory sticky rice packed inside banana leaves, loaded with Chinese sausage (<em>lap xuong</em>), shredded chicken, pork floss, quail eggs, scallion oil, and crunchy peanuts, all tied together by a ladle of rich braised chicken reduction. Hearty, portable, and utterly delicious.
      </>
    ),
    descVi: (
      <>
        Gói <em>xôi mặn</em> bọc trong lá chuối xanh mộc mạc bốc khói nghi ngút. Từng hạt nếp dẻo thơm bóng bẩy quyện cùng lạp xưởng Mai Quế Lộ chiên bóng, gà xé đậm vị, chà bông tơi xốp, trứng cút, mỡ hành và chan thìa nước sốt rim đậm đà chắc dạ cho buổi sáng sớm.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Xoi Ga Ba Chieu (Ba Chieu Market, Binh Thanh): 40,000 VND",
      "Xoi Binh Tien (88 Minh Phung): 25,000 VND",
    ],
    whereToEatVi: [
      "Xôi Gà Bà Chiểu (Chợ Bà Chiểu, Bình Thạnh): 40.000 VNĐ",
      "Xôi Bình Tiên (88 Minh Phụng): 25.000 VNĐ",
    ],
  },
  {
    id: "ca-phe-sua-da",
    index: 12,
    title: "12. Ca Phe Sua Da",
    titleVi: "12. Cà Phê Sữa Đá",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Ca-Phe-Sua-Da.jpg",
    alt: "Ca Phe Sua Da - Vietnamese Iced Coffee",
    desc: (
      <>
        Finishing the list with Saigon&apos;s liquid obsession: Vietnamese iced coffee with sweetened condensed milk. Slow-dripped dark Robusta coffee mixed with rich condensed milk and poured over crushed ice. Bold, sweet, creamy, and revitalizing, it is sipped leisurely at street corners and chic cafes alike.
      </>
    ),
    descVi: (
      <>
        Khép lại danh sách bằng thức uống đại diện cho linh hồn và nhịp sống của người Sài Gòn: <em>cà phê sữa đá</em>. Từng giọt cà phê Robusta đen đậm nhỏ giọt tí tách từ phin nhôm xuống lớp sữa đặc ngọt ngào béo ngậy, khuấy đều cùng đá bi mát lạnh, đánh thức mọi giác quan trong sớm mai.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Ca Phe Vot Cheo Leo (109/36 Nguyen Thien Thuat - Since 1938): 20,000 VND",
      "Ca Phe Bet (30/4 Park, District 1): 20,000 VND",
    ],
    whereToEatVi: [
      "Cà Phê Vợt Cheo Leo (109/36 Nguyễn Thiện Thuật - Từ 1938): 20.000 VNĐ",
      "Cà Phê Bệt Công Viên 30/4 (Quận 1): 20.000 VNĐ",
    ],
  },
];

export default function MustTryFoodsInHCMCPage() {
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

      {/* ── Full-Bleed Hero Banner (Screenshot 1) ── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag">ARTICLES</span>
            <span className="vnn-fullbleed-hero__tag">EAT &amp; DRINK</span>
            <span className="vnn-fullbleed-hero__tag">HO CHI MINH CITY</span>
          </div>
          <h1 className="vnn-fullbleed-hero__title">
            {isVi ? "12 món ăn nhất định phải thử tại TP. Hồ Chí Minh" : "12 must-try foods in Ho Chi Minh City"}
          </h1>
          <p className="vnn-fullbleed-hero__byline">
            By Welcome to Vietnam &nbsp;&nbsp;&nbsp; April 25, 2025
          </p>
        </div>
      </section>

      {/* ── Article Content Container ── */}
      <main className="vnn-article-container">
        {/* Pill CTA Button (Screenshot 1 & 2) */}
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

        {/* Lead Intro Paragraph (Screenshot 1 & 2) */}
        <p className="vnn-article-lead">
          {isVi ? (
            <>
              TP. Hồ Chí Minh là thiên đường ẩm thực dành cho những tín đồ đam mê ăn uống, nơi mỗi góc phố đều ẩn chứa những bất ngờ thơm ngon. Thành phố này luôn biết cách chinh phục trái tim du khách qua đường dạ dày. Bạn có thể dành cả hai tuần chỉ để la cà ăn uống khắp nơi mà không hề trùng lặp một món ăn nào. Dưới đây là danh sách 12 món ăn đặc sắc nhất định bạn phải thử để có trải nghiệm ẩm thực trọn vẹn nhất.
            </>
          ) : (
            <>
              Ho Chi Minh City is a paradise for food lovers, where every street corner offers a delicious surprise. This city captures the hearts of visitors through their stomachs. You could spend two weeks just eating out without repeating a single dish. Here&apos;s a guide to 12 signature foods you absolutely must try to get the full experience.
            </>
          )}
        </p>

        {/* ── 12 Dishes List (Screenshots 2 to 5) ── */}
        <div className="vnn-dishes-list">
          {HCMC_12_DISHES.map((dish) => (
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

                  {/* Where to eat / Địa chỉ */}
                  <span className="vnn-dish-subhead">
                    {isVi ? dish.whereToEatTitleVi : dish.whereToEatTitle}
                  </span>

                  {dish.whereToEatText ? (
                    <p style={{ margin: "4px 0 16px", color: "#334155", lineHeight: 1.6 }}>
                      {isVi ? dish.whereToEatTextVi : dish.whereToEatText}
                    </p>
                  ) : (
                    <ul className="vnn-dish-bullets">
                      {(isVi ? dish.whereToEatVi : dish.whereToEat)?.map((spot, idx) => (
                        <li key={idx}>{spot}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Closing Paragraph ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "36px 0 24px" }}>
          {isVi ? (
            <>
              Từ những chảo gang sôi xèo xèo, những con hẻm ốc đêm nhộn nhịp cho đến những tô bún ngọt thanh và ổ bánh mì giòn tan, nền ẩm thực TP. Hồ Chí Minh cũng sôi động và phong phú như chính nhịp sống của thành phố này. Hãy tự do len lỏi vào các ngõ ngách để hương thơm quyến rũ của các quầy quán đường phố dẫn lối cho hành trình ẩm thực của bạn.
            </>
          ) : (
            <>
              From sizzling skillets and bustling snail alleys to soothing noodle broths and crispy baguettes, Ho Chi Minh City&apos;s food culture is as dynamic and vibrant as the metropolis itself. Make sure to wander off the beaten track and let the aromas of street stalls guide your culinary adventure.
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
            href="/province/ho-chi-minh"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Ho Chi Minh City
          </Link>
          <Link
            href="/guide/12-must-try-foods-in-ho-chi-minh-city"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
              textDecoration: "none",
            }}
          >
            Saigon Food
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
          name: isVi ? "TP. Hồ Chí Minh" : "Ho Chi Minh City",
          slug: "ho-chi-minh",
        }}
      />
    </div>
  );
}
