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
        If you want to dive into southern Vietnam&apos;s noodle culture, start with <span className="vnn-link-highlight"><em>hu tieu</em></span>. The chewy, clear noodles bathe in a sweet-savory broth made from pork bones and daikon. You can go for the dry version with sauce or the classic soupy style. Toppings vary from sliced pork, shrimp, and quail eggs to crispy shallots and greens. Versions like <em>hu tieu Sadec</em>, <em>hu tieu My Tho</em>, and <em>hu tieu Nam Vang</em> (Phnom Penh style), each tied to a specific city, add an exciting twist to the dish. You&apos;ll find legendary <em>hu tieu</em> shops run by generations of the same family, each with its own secret recipe.
      </>
    ),
    descVi: (
      <>
        Nếu bạn muốn đắm mình vào văn hóa mì nước phương Nam, hãy bắt đầu bằng <span className="vnn-link-highlight"><em>hủ tiếu</em></span>. Sợi hủ tiếu trong suốt, dai sần sật chan trong làn nước lèo ngọt thanh ninh từ xương heo và củ cải. Bạn có thể chọn ăn hủ tiếu khô trộn nước sốt đậm đà hoặc hủ tiếu nước truyền thống. Topping phong phú từ thịt nạc thái mỏng, tôm tươi, trứng cút đến hành phi vàng ruộm và rau thơm xanh mướt.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Hu Tieu Thanh Xuan My Tho (62 Ton That Thiep): 75,000 VND",
      "Hu Tieu Nhan Quan (122D Cach Mang Thang Tam): 90,000 VND",
    ],
    whereToEatVi: [
      "Hủ Tiếu Thanh Xuân Mỹ Tho (62 Tôn Thất Thiệp): 75.000 VNĐ",
      "Hủ Tiếu Nhân Quán (122D Cách Mạng Tháng Tám): 90.000 VNĐ",
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
        <em>Bun rieu</em> is absolutely not for the faint of heart. This tangy, tomato-based broth is layered with crab paste, tofu, tomatoes, and sometimes snails or pork. The <em>rieu</em> (crab mixture) is made by grinding crabs into a paste and simmering it until it forms tender, fluffy clumps. Served with thin rice vermicelli noodles, fresh herbs, shredded banana blossom, and a squeeze of lime, this dish hits the spot—especially on a rainy day.
      </>
    ),
    descVi: (
      <>
        <em>Bún riêu</em> chắc chắn không dành cho người sợ hương vị đậm đà. Nước dùng cà chua chua thanh đậm đà hòa quyện cùng riêu cua đồng thơm bùi, đậu hũ chiên, cà chua và đôi khi có thêm ốc bươu giòn sần sật hay thịt heo. Riêu cua được giã nhuyễn rồi nấu chín tới khi kết thành những mảng xốp mềm nổi bồng bềnh. Ăn cùng bún tươi, rau sống, bắp chuối bào sợi và vắt miếng chanh tươi, món ăn đặc biệt ấm lòng trong những ngày mưa.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Rieu Ganh Cho Ben Thanh (163 Le Thanh Ton): 65,000 VND",
      "Bun Rieu Goc (TK18/5 Nguyen Canh Chan): 75,000 VND",
    ],
    whereToEatVi: [
      "Bún Riêu Gánh Chợ Bến Thành (163 Lê Thánh Tôn): 65.000 VNĐ",
      "Bún Riêu Gốc (TK18/5 Nguyễn Cảnh Chân): 75.000 VNĐ",
    ],
  },
  {
    id: "bun-mam",
    index: 8,
    title: "8. Bun Mam",
    titleVi: "8. Bún Mắm",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Mam.jpg",
    alt: "Bun Mam - Mekong Fermented Fish Noodle Soup",
    desc: (
      <>
        <span className="vnn-link-highlight"><em>Bun mam</em></span> is one of the specialties of Southern Vietnam, featuring a broth made from fermented fish. To prepare it, the fermented fish sauce is boiled, the bones are removed to extract the liquid, and then shallots, lemongrass, eggplant, and spices are added. A bowl of <em>bun mam</em> typically includes thick rice vermicelli, shrimp, squid, grilled pork, and eggplant. It&apos;s usually served with a variety of vegetables like shredded water spinach, bitter herbs, and water lily stems.
      </>
    ),
    descVi: (
      <>
        <span className="vnn-link-highlight"><em>Bún mắm</em></span> là một trong những đặc sản độc đáo nhất của miền Nam, nổi bật với làn nước dùng nấu từ mắm cá linh, cá sặc ủ kỹ. Mắm cá được nấu sôi, lọc bỏ xương lấy nước cốt trong rồi ninh cùng sả băm, hành tím, cà tím và gia vị. Một tô bún mắm thường đầy đặn với tôm tươi, mực giòn, heo quay giòn rụm và cà tím. Món ăn được dọn kèm dĩa rau sống phong phú như rau muống chẻ, rau đắng và cọng bông súng giòn ngọt.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Mam Mien Tay (124 Tran Khac Chan): 50,000 VND",
      "Di Sau Mien Tay (25/22 Ton That Tung): 59,000 VND",
    ],
    whereToEatVi: [
      "Bún Mắm Miền Tây (124 Trần Khắc Chân): 50.000 VNĐ",
      "Dì Sáu Miền Tây (25/22 Tôn Thất Tùng): 59.000 VNĐ",
    ],
  },
  {
    id: "bun-thit-nuong",
    index: 9,
    title: "9. Bun Thit Nuong",
    titleVi: "9. Bún Thịt Nướng",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Bun-Thit-Nuong.jpg",
    alt: "Bun Thit Nuong - Grilled Pork Vermicelli",
    desc: (
      <>
        Don&apos;t overlook this flavor-packed dry noodle dish. <em>Bun thit nuong</em> is a beautiful bowl of grilled pork, vermicelli noodles, fresh herbs, pickled vegetables, and crispy spring rolls, all brought together with a sweet-sour fish sauce dressing. It&apos;s a light yet filling meal that&apos;s perfect for Saigon&apos;s tropical heat. Every element adds something: smokiness from the meat, crunch from the rolls, and freshness from the greens. Stir it up for a mouthful of texture and flavor in every bite.
      </>
    ),
    descVi: (
      <>
        Đừng bỏ lỡ món bún khô ngập tràn hương vị này. <em>Bún thịt nướng</em> là một tô bún hấp dẫn với thịt nướng thơm lừng, bún tươi, rau sống mát lành, đồ chua và chả giò giòn rụm, tất cả hòa quyện cùng nước mắm chua ngọt pha khéo. Đây là bữa ăn nhẹ nhàng nhưng chắc dạ, hoàn hảo cho tiết trời nhiệt đới Sài Gòn. Mỗi nguyên liệu đều đóng góp vào sự thăng hoa: mùi khói quyến rũ từ thịt, độ giòn rụm của chả giò và sự tươi mát của rau ghém.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEat: [
      "Bun Thit Nuong Cha Gio (01 Nguyen Trung Truc): 70,000 VND",
      "Quan Bun Thit Nuong (88 Mac Dinh Chi): 48,000 VND",
    ],
    whereToEatVi: [
      "Bún Thịt Nướng Chả Giò (01 Nguyễn Trung Trực): 70.000 VNĐ",
      "Quán Bún Thịt Nướng (88 Mạc Đĩnh Chi): 48.000 VNĐ",
    ],
  },
  {
    id: "oc",
    index: 10,
    title: "10. Oc",
    titleVi: "10. Ốc",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Shellfish.jpg",
    alt: "Oc - Snails & Shellfish Saigon",
    desc: (
      <>
        Eating shellfish in Saigon isn&apos;t just about food—it&apos;s an experience. From stir-fried snails to grilled oysters, clams steamed with lemongrass to scallops with green onion oil, each bite bursts with bold seasoning. <em>Oc</em> joints are often crowded, lively places where friends gather over beer, laughter, and endless small plates. There&apos;s even an entire street—Vinh Khanh in District 4—dedicated to this seafood. Don&apos;t be shy about trying new varieties or dipping everything into sweet tamarind or salted egg yolk sauce. Order a cold beer and just like that, you&apos;re experiencing Saigon&apos;s night scene like a true local.
      </>
    ),
    descVi: (
      <>
        Thưởng thức ốc ở Sài Gòn không chỉ đơn thuần là ăn uống — đó là cả một trải nghiệm văn hóa. Từ ốc xào me, hàu nướng phô mai, nghêu hấp sả cho đến sò điệp nướng mỡ hành đậu phộng, mỗi món đều bùng nổ hương vị đậm đà. Các quán ốc vỉa hè luôn tấp nập, náo nhiệt, nơi bạn bè quây quần bên ly bia, tiếng cười rộn rã và vô vàn đĩa ốc nhỏ xinh. Thậm chí có cả một con phố — Vĩnh Khánh ở Quận 4 — dành riêng cho thiên đường hải sản này.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEatText: "This street food favorite can be found along lively streets like Bui Vien (District 1) and Vinh Khanh (District 4).",
    whereToEatTextVi: "Món ăn đường phố được yêu thích này có thể dễ dàng tìm thấy dọc theo các con phố sôi động như Bùi Viện (Quận 1) và phố ốc Vĩnh Khánh (Quận 4).",
  },
  {
    id: "xoi-man",
    index: 11,
    title: "11. Xoi Man",
    titleVi: "11. Xôi Mặn",
    img: "/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Xoi-Man.jpg",
    alt: "Xoi Man - Savory Sticky Rice",
    desc: (
      <>
        You want something for breakfast, dinner, or post-party hunger? <span className="vnn-link-highlight"><em>Xoi man</em></span>, please! <em>Xoi man</em>, savory sticky rice, is Saigon&apos;s ultimate comfort food. Made with glutinous rice and topped with sausage, pork floss, pickled radish, quail eggs, and slices of pork roll, it&apos;s a complete meal in one portable package. Often wrapped in banana leaves to lock in flavor, this dish is especially popular among night owls and early risers alike. Whether you&apos;re recovering from a late night or grabbing something to-go before exploring the city, <em>xoi man</em> has your back with its warm, savory goodness.
      </>
    ),
    descVi: (
      <>
        Bạn muốn một món ăn chắc dạ cho bữa sáng, bữa tối hay sau những cuộc vui đêm? <span className="vnn-link-highlight"><em>Xôi mặn</em></span> chính là lựa chọn hoàn hảo! Xôi mặn là món ăn an ủi tâm hồn thân thương bậc nhất của người Sài Gòn. Từng hạt nếp dẻo thơm được phủ đầy lạp xưởng, chà bông heo, củ cải ngâm, trứng cút và chả lụa thái lát — một bữa ăn trọn vẹn gói gọn trong lớp lá chuối xanh thơm lừng. Rất được lòng cả những cú đêm lẫn những người dậy sớm.
      </>
    ),
    whereToEatTitle: "Where to eat:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEatText: "This popular street food is priced at 15,000–30,000 VND. You'll find it at street stalls and sidewalk vendors all over the city.",
    whereToEatTextVi: "Món ăn đường phố bình dân này có giá từ 15.000 – 30.000 VNĐ. Bạn sẽ dễ dàng tìm thấy tại các gánh hàng rong và quầy xôi vỉa hè trên khắp các con phố.",
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
        We&apos;re ending this list with a drink that helped put Saigon on the map: <span className="vnn-link-highlight"><em>ca phe sua da</em></span>. This bold blend of Vietnamese coffee and sweetened condensed milk poured over ice is the drink that fuels the city. Locals sip it slowly at sidewalk cafes while people-watching or chatting with friends. It&apos;s versatile enough to pair with any meal and gives you that perfect energy kick. Don&apos;t forget to stir well before sipping for that creamy finish. Whether you&apos;re new to coffee or a die-hard fan, this drink will leave a lasting impression—and probably start a new addiction.
      </>
    ),
    descVi: (
      <>
        Chúng ta khép lại danh sách với thức uống đã đưa tên tuổi Sài Gòn ra thế giới: <span className="vnn-link-highlight"><em>cà phê sữa đá</em></span>. Sự hòa quyện đậm đà giữa cà phê Robusta rang đậm và sữa đặc béo ngọt rót trên lớp đá bi mát lạnh chính là nguồn năng lượng nuôi dưỡng nhịp đập thành phố. Người dân địa phương nhâm nhi từng ngụm chậm rãi tại các quán cà phê cóc vỉa hè trong lúc ngắm phố phường hoặc trò chuyện cùng bạn bè. Dù bạn mới thử cà phê hay là tín đồ sành sỏi, ly cà phê sữa đá chắc chắn sẽ để lại ấn tượng sâu đậm.
      </>
    ),
    whereToEatTitle: "Where to try:",
    whereToEatTitleVi: "Địa chỉ gợi ý:",
    whereToEatText: "Ca phe sua da is so popular in Ho Chi Minh City that you can find it on nearly every street corner, with prices typically ranging from 15,000–50,000 VND.",
    whereToEatTextVi: "Cà phê sữa đá phổ biến đến mức bạn có thể tìm thấy ở hầu như mọi góc phố tại TP. Hồ Chí Minh, với mức giá thường dao động từ 15.000 – 50.000 VNĐ.",
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

        {/* ── Closing Paragraph (Screenshot 1 & 2) ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "36px 0 24px" }}>
          {isVi ? (
            <>
              Ẩm thực tại{" "}
              <Link href="/province/ho-chi-minh" style={{ color: "#00c2cb", textDecoration: "none" }}>
                TP. Hồ Chí Minh
              </Link>{" "}
              không chỉ là dinh dưỡng—đó là một ngày hội thường nhật rực rỡ của hương vị, văn hóa và sự kết nối. 12 món ăn này phản ánh trọn vẹn tinh thần của thành phố. Dù bạn ở đây vài ngày hay vài tháng, việc đắm mình vào nền ẩm thực địa phương sẽ là một trong những chuyến phiêu lưu đáng nhớ nhất. Hãy để TP. Hồ Chí Minh cho bạn thấy thế nào là ẩm thực nuôi dưỡng tâm hồn.
            </>
          ) : (
            <>
              Food in{" "}
              <Link href="/province/ho-chi-minh" style={{ color: "#00c2cb", textDecoration: "none" }}>
                Ho Chi Minh City
              </Link>{" "}
              is more than nourishment—it&apos;s a vibrant, daily celebration of flavor, culture, and connection. These 12 foods reflect the spirit of the city. Whether you&apos;re here for a few days or a few months, diving into the local food scene will be one of your most unforgettable adventures. Let Ho Chi Minh City show you what soul food truly means.
            </>
          )}
        </p>

        {/* ── Disclaimer Note (Screenshot 1 & 2) ── */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#334155", margin: "0 0 28px", fontStyle: "italic" }}>
          {isVi
            ? "Note: Các gợi ý nhà hàng chỉ dựa trên trải nghiệm của tác giả; giá cả thực tế có thể thay đổi tùy thời điểm."
            : "Note: Restaurant recommendations are based on the authors' experiences; prices may vary."}
        </p>

        {/* ── Tags (Screenshot 1 & 2: TAGS + Ho Chi Minh City + Saigon food) ── */}
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
            Saigon food
          </Link>
        </div>

        {/* ── Divider (Screenshot 2) ── */}
        <hr style={{ border: 0, height: "1px", background: "#e2e8f0", margin: "40px 0" }} />

        {/* ── Related Articles (Screenshot 2: Where to Stay, 3-week, 8 must-try foods in Hanoi) ── */}
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
              href="/guide/where-to-stay-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/hcmc/where-to-stay-in-hcmc-hd.jpg"
                  alt="Where to Stay in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "Nơi lưu trú tốt nhất tại TP. Hồ Chí Minh" : "Where to Stay in Ho Chi Minh City"}
              </h3>
            </Link>

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
