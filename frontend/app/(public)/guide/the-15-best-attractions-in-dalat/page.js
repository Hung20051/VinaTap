"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import { getLang } from "@/lib/prefs";
import { ChevronDown, Sparkles, MapPin } from "lucide-react";
import "@/styles/home.css";
import "@/styles/hcmc-10-things.css";

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
      {
        id: "insp-5",
        title: "Ao Dai: Vietnamese Traditional Dress",
        titleVi: "Áo Dài: Quốc phục truyền thống Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/ao-dai-vietnamese-traditional-dress",
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
          { name: "Quảng Ninh (Hạ Long)", slug: "quang-ninh" },
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
          { name: "Quảng Nam (Hội An)", slug: "quang-nam" },
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
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/guide/the-15-best-attractions-in-dalat",
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
        img: "/guide/megamenu/todo-1-3week.jpg",
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

// ─── 15 BEST DALAT ATTRACTIONS DATA ───
const DALAT_15_ATTRACTIONS = [
  {
    id: "xuan-huong-lake",
    index: 1,
    title: "1. Xuan Huong Lake",
    titleVi: "1. Hồ Xuân Hương",
    img: "/guide/dalat/dalat-xuan-huong-lake.jpg",
    alt: "Xuan Huong Lake Dalat",
    desc: (
      <>
        You know you are in Dalat city when a view of Xuan Huong Lake is in your sight. This is a man-made crescent lake, built by order of the French Ambassador in Dalat at that time by directing water from the nearby Cam Ly Waterfall. Back then, the lake was named Grand Lac, and not until 1953 was it renamed with a pure Vietnamese name – Xuan Huong. There are a few interpretations of this poetic name. However, our favorite is its direct translation which means &ldquo;The Spring Fragrance.&rdquo; Xuan Huong Lake is not only an ideal spot for sightseeing but also a complex with many iconic cafes and restaurants. We recommend you sit at one of the cafes to appreciate how the still lake reflects its natural surroundings on its glass surface and how the peaceful life of Dalat people revolves around this poetic waterbody. You will also find a boat station at one point of the lake, where you can rent a swan boat and paddle around the lake to enjoy the nice breeze and see the city from a different point of view. The cost of renting a boat ranges from 25,000 VND to 50,000 VND ($1.05 to $2.1) per hour, depending on the size of the boat.
      </>
    ),
    descVi: (
      <>
        Bạn sẽ nhận ra mình đã thực sự đặt chân đến Đà Lạt khi hình ảnh Hồ Xuân Hương hiện ra trước mắt. Đây là một hồ nước nhân tạo hình trăng khuyết, được xây dựng theo chỉ thị của quan chức Pháp thời bấy giờ bằng cách ngăn dòng chảy từ thác Cam Ly gần đó. Thời kỳ đầu, hồ mang tên Grand Lac, mãi đến năm 1953 mới được đổi sang tên thuần Việt – Xuân Hương. Có nhiều cách hiểu về cái tên đầy chất thơ này, nhưng đẹp nhất vẫn là ý nghĩa &ldquo;Hương sắc mùa xuân&rdquo;. Hồ Xuân Hương không chỉ là điểm ngắm cảnh lý tưởng mà còn là quần thể quy tụ nhiều quán cà phê và nhà hàng nổi tiếng. Hãy thử ngồi tại một quán ven hồ để chiêm ngưỡng mặt hồ phẳng lặng như gương phản chiếu mây trời và cảm nhận nhịp sống êm đềm của người dân phố núi. Bạn cũng có thể thuê thuyền đạp vịt dạo quanh hồ với chi phí từ 25.000 đến 50.000 VNĐ/giờ tùy kích cỡ thuyền.
      </>
    ),
    tip: "Best experienced in the early morning mist or at sunset when the lakeside lights reflect on the water.",
    tipVi: "Đẹp nhất vào sáng sớm mờ sương hoặc chiều hoàng hôn khi ánh đèn ven hồ lấp lánh trên mặt nước.",
    address: "City Center, Dalat",
    addressVi: "Trung tâm TP. Đà Lạt",
  },
  {
    id: "domaine-de-marie-church",
    index: 2,
    title: "2. Domaine De Marie Church",
    titleVi: "2. Nhà thờ Domaine De Marie",
    img: "/guide/dalat/dalat-domaine-de-marie.jpg",
    alt: "Domaine De Marie Church Dalat",
    desc: (
      <>
        The first impression this church will make on you is its vibrant pink color and its unique architecture. Interestingly, the church was built in the 1940s using natural adhesives such as plaster and molasses. Despite its humble campus, Domaine De Marie church boasts a beautiful surrounding with blooming flowers all year round, against the backdrop of the blue sky and green pine trees, which are a delight to the eyes. Visiting this church and enjoying some serene time should be on your to-do list.
      </>
    ),
    descVi: (
      <>
        Ấn tượng đầu tiên mà ngôi nhà thờ này mang lại chính là sắc hồng rực rỡ đặc trưng cùng lối kiến trúc độc đáo. Điều thú vị là nhà thờ được xây dựng từ những năm 1940 bằng các chất kết dính tự nhiên như vôi vữa và mật mía. Dù khuôn viên khiêm tốn, nhà thờ Domaine De Marie lại được bao bọc bởi vườn hoa nở rộ bốn mùa, nổi bật trên nền trời xanh biếc và những hàng thông reo bạt ngàn. Dành chút thời gian ghé thăm và tận hưởng không gian thanh tịnh nơi đây chắc chắn là trải nghiệm không thể bỏ qua.
      </>
    ),
    address: "01 Ngo Quyen St, Ward 6",
    addressVi: "01 Ngô Quyền, Phường 6",
  },
  {
    id: "dalat-railway-station",
    index: 3,
    title: "3. Dalat Railway Station",
    titleVi: "3. Ga xe lửa Đà Lạt",
    img: "/guide/dalat/dalat-railway-station.jpg",
    alt: "Dalat Railway Station",
    desc: (
      <>
        Built between 1932 and 1938 by French architects Moncet and Reveron, Dalat Railway Station is one of the oldest railway stations in Indochina. Its iconic Art Deco facade features three distinctive triangular roofs representing the three peaks of Lang Biang Mountain, while the interior retains vintage ticket counters and colorful stained glass windows. Today, visitors can hop aboard a charming 7-kilometer vintage wooden train ride to Trai Mat village, chugging slowly past rolling vegetable farms and flower greenhouses.
      </>
    ),
    descVi: (
      <>
        Được xây dựng từ năm 1932 đến 1938 bởi hai kiến trúc sư người Pháp Moncet và Reveron, Ga Đà Lạt là một trong những nhà ga cổ kính nhất Đông Dương. Mặt tiền Art Deco ấn tượng với ba chóp mái tam giác mô phỏng ba đỉnh núi Lang Biang hùng vĩ, kết hợp cùng kính màu rực rỡ bên trong. Ngày nay, du khách có thể trải nghiệm chuyến tàu gỗ cổ điển dài 7 km đưa bạn về thị trấn Trại Mát, thong thả ngắm nhìn những vườn rau và nhà kính trồng hoa bạt ngàn.
      </>
    ),
    address: "01 Quang Trung St, Ward 9",
    addressVi: "01 Quang Trung, Phường 9",
  },
  {
    id: "dalat-flower-garden",
    index: 4,
    title: "4. Dalat Flower Garden",
    titleVi: "4. Vườn hoa Thành phố Đà Lạt",
    img: "/guide/dalat/dalat-flower-garden.jpg",
    alt: "Dalat Flower Garden",
    desc: (
      <>
        Spanning over 7,000 square meters right at the northern tip of Xuan Huong Lake, the Dalat Flower Garden is widely considered the country&apos;s ultimate floral sanctuary. Established in 1966 and renovated over decades, it showcases more than 300 varieties of rare flowers—from hydrangeas, mimosa, and Dutch roses to exotic orchids and giant topiaries sculpted into horses and windmills. It&apos;s an irresistible stop for photography lovers and botanical enthusiasts.
      </>
    ),
    descVi: (
      <>
        Với diện tích hơn 7.000 m² tọa lạc ngay bờ bắc Hồ Xuân Hương, Vườn hoa Thành phố Đà Lạt được mệnh danh là thánh địa hoa của cả nước. Nơi đây quy tụ và bảo tồn hơn 300 loài hoa quý hiếm—từ cẩm tú cầu, hoa mimosa, hoa hồng Pháp cho đến các loài phong lan quý và những mô hình cây cảnh tạo hình cỗ xe ngựa, cối xay gió khổng lồ. Đây là điểm check-in không thể bỏ lỡ đối với những ai say mê nhiếp ảnh và vẻ đẹp thiên nhiên.
      </>
    ),
    address: "Tran Nhan Tong St, Ward 8",
    addressVi: "Đường Trần Nhân Tông, Phường 8",
  },
  {
    id: "dalat-night-market",
    index: 5,
    title: "5. Dalat Night Market",
    titleVi: "5. Chợ đêm Đà Lạt",
    img: "/guide/dalat/dalat-night-market.jpg",
    alt: "Dalat Night Market",
    desc: (
      <>
        As dusk falls over the mountain valley, the center of Dalat transforms into a bustling culinary carnival known locally as Cho Am Phu (Hell Market). Bundled up in cozy beanies and jackets, visitors wander along the wide amphitheater stairs surrounded by the aroma of sizzling charcoal grills. Don&apos;t miss <em>banh trang nuong</em> (crispy grilled rice paper topped with egg, scallions, and pork floss—dubbed &ldquo;Vietnamese pizza&rdquo;), skewers of grilled pork rolls, and steaming glasses of sweet hot soy milk.
      </>
    ),
    descVi: (
      <>
        Khi hoàng hôn buông xuống thung lũng sương mờ, khu vực trung tâm Đà Lạt bừng lên sức sống với Chợ Đêm (trước đây còn gọi là Chợ Âm Phủ). Khoác trên mình chiếc áo len ấm áp, du khách dạo bước qua các bậc thang rộng ngập tràn hương thơm của bếp than hồng. Đừng bỏ lỡ món <em>bánh tráng nướng</em> giòn rụm với trứng, hành lá và tép khô (được ví như &ldquo;pizza Việt Nam&rdquo;), những xiên nem nướng thơm lừng và ly sữa đậu nành nóng hổi ngọt ngào xua tan cái lạnh cao nguyên.
      </>
    ),
    address: "Nguyen Thi Minh Khai St, Ward 1",
    addressVi: "Đường Nguyễn Thị Minh Khai, Phường 1",
  },
  {
    id: "st-nicholas-cathedral",
    index: 6,
    title: "6. St. Nicholas Cathedral (The Chicken Church)",
    titleVi: "6. Nhà thờ Con Gà (Chính tòa Đà Lạt)",
    img: "/guide/dalat/dalat-chicken-church.jpg",
    alt: "St Nicholas Cathedral Dalat",
    desc: (
      <>
        Perched majestically on Tran Phu Street, St. Nicholas Cathedral is the largest Catholic church in Dalat and one of the most prominent French Romanesque legacies in Vietnam. Built between 1931 and 1942, the church is affectionately called &ldquo;Nha Tho Con Ga&rdquo; due to the distinctive copper rooster perched on top of its 47-meter bell tower, which serves as a weather vane. The interior is illuminated by 70 stained-glass panels crafted in France, casting ethereal hues across the stone nave.
      </>
    ),
    descVi: (
      <>
        Tọa lạc uy nghiêm trên đường Trần Phú, Nhà thờ Chính tòa Đà Lạt là ngôi thánh đường Công giáo lớn nhất thành phố và là di sản kiến trúc Roman Pháp tiêu biểu tại Việt Nam. Được khởi công từ năm 1931 và hoàn thành năm 1942, nhà thờ được người dân gọi thân thương là &ldquo;Nhà thờ Con Gà&rdquo; nhờ bức tượng chú gà trống bằng đồng nằm trên đỉnh tháp chuông cao 47 mét. Bên trong thánh đường là 70 tấm kính màu được chế tác tại Pháp, tạo nên hiệu ứng ánh sáng huyền ảo lung linh.
      </>
    ),
    address: "15 Tran Phu St, Ward 3",
    addressVi: "15 Trần Phú, Phường 3",
  },
  {
    id: "linh-phuoc-pagoda",
    index: 7,
    title: "7. Linh Phuoc Pagoda",
    titleVi: "7. Chùa Linh Phước (Chùa Ve Chai)",
    img: "/guide/dalat/dalat-linh-phuoc-pagoda.jpg",
    alt: "Linh Phuoc Pagoda Dalat",
    desc: (
      <>
        Located in Trai Mat, about 8 km from the city center, Linh Phuoc Pagoda is an extraordinary Buddhist temple that has earned multiple national records. Built in 1949 and continuously enriched, the entire complex is encrusted with millions of pieces of broken glazed pottery, porcelain bowls, and colorful glass bottles. Highlights include a 49-meter dragon sculpture crafted from 12,000 beer bottles, an 18-meter statue of Bodhisattva Avalokiteshvara covered in over 600,000 dried immortal flowers, and a 37-meter bell tower housing the heaviest bell in Central Vietnam.
      </>
    ),
    descVi: (
      <>
        Nằm tại Trại Mát, cách trung tâm khoảng 8 km, Chùa Linh Phước là công trình tâm linh độc nhất vô nhị nắm giữ nhiều kỷ lục quốc gia. Ngôi chùa được bao phủ hoàn toàn bởi hàng triệu mảnh sành sứ, chén đĩa vỡ và vỏ chai thủy tinh đầy màu sắc. Điểm nhấn bao gồm con rồng dài 49 mét uốn lượn được tạo nên từ 12.000 vỏ chai bia, tượng Bồ Tát Quán Thế Âm cao 18 mét kết từ hơn 600.000 bông hoa bất tử và tháp chuông 7 tầng cao 37 mét sở hữu Đại Hồng Chung nặng nhất miền Trung.
      </>
    ),
    address: "120 Tu Phuoc St, Trai Mat",
    addressVi: "120 Tự Phước, Trại Mát",
  },
  {
    id: "valley-of-love",
    index: 8,
    title: "8. Valley of Love",
    titleVi: "8. Thung Lũng Tình Yêu",
    img: "/guide/dalat/dalat-valley-of-love.jpg",
    alt: "Valley of Love Dalat",
    desc: (
      <>
        Originally christened Vallée d&apos;Amour by the French in the 1930s, this romantic park is nestled among undulating pine hills approximately 5 km north of downtown Dalat. Spanning hundreds of hectares around Da Thien Lake, the valley boasts romantic heart-shaped floral gardens, pedal boats, panoramic viewing platforms, and labyrinth hedges. It has long been a favored retreat for couples, newlyweds, and families seeking idyllic alpine leisure.
      </>
    ),
    descVi: (
      <>
        Được người Pháp đặt tên là Vallée d&apos;Amour từ thập niên 1930, Thung Lũng Tình Yêu là thắng cảnh lãng mạn bậc nhất nép mình bên những đồi thông trập trùng cách trung tâm khoảng 5 km. Bao quanh Hồ Đa Thiện trong vắt, nơi đây sở hữu những thảm hoa hình trái tim rực rỡ, bến thuyền thiên nga, cầu đáy kính ngắm cảnh và mê cung tình yêu độc đáo. Đây luôn là điểm hẹn ước lý tưởng của các cặp đôi và gia đình khi đến với Đà Lạt.
      </>
    ),
    address: "03-05-07 Mai Anh Dao St, Ward 8",
    addressVi: "03-05-07 Mai Anh Đào, Phường 8",
  },
  {
    id: "tuyen-lam-lake",
    index: 9,
    title: "9. Tuyen Lam Lake",
    titleVi: "9. Hồ Tuyền Lâm",
    img: "/guide/dalat/dalat-tuyen-lam-lake.jpg",
    alt: "Tuyen Lam Lake Dalat",
    desc: (
      <>
        Covering more than 350 hectares at the foot of Phoenix Mountain, Tuyen Lam Lake is the largest freshwater lake in Dalat and a designated national tourist area. Known as the &ldquo;Paradise Lake,&rdquo; its glassy emerald waters are framed by virgin pine forests, peaceful valleys, and luxury eco-resorts. Visitors can rent motorized boats or kayaks, try stand-up paddleboarding (SUP) at dawn, or embark on a pine forest trek to hidden camping grounds.
      </>
    ),
    descVi: (
      <>
        Trải rộng hơn 350 ha dưới chân núi Phụng Hoàng, Hồ Tuyền Lâm là hồ nước ngọt tự nhiên lớn nhất Đà Lạt và là khu du lịch quốc gia trọng điểm. Mặt hồ trong xanh như ngọc bích phẳng lặng in bóng những cánh rừng thông nguyên sinh bạt ngàn. Du khách có thể thuê cano dạo hồ, chèo thuyền SUP đón bình minh trong sương sớm, hay cắm trại dã ngoại bên bờ hồ thơ mộng.
      </>
    ),
    address: "Ward 4, Dalat City",
    addressVi: "Phường 4, TP. Đà Lạt",
  },
  {
    id: "truc-lam-zen-monastery",
    index: 10,
    title: "10. Truc Lam Zen Monastery",
    titleVi: "10. Thiền Viện Trúc Lâm",
    img: "/guide/dalat/dalat-truc-lam-monastery.jpg",
    alt: "Truc Lam Zen Monastery Dalat",
    desc: (
      <>
        Perched atop Phoenix Mountain overlooking Tuyen Lam Lake, Truc Lam Zen Monastery is the largest Zen Buddhist monastery in Lam Dong Province and one of Vietnam’s foremost spiritual sanctuaries. Built in 1993, the pagoda harmoniously combines traditional Vietnamese curved-tile temple architecture with meticulously manicured gardens boasting rare hydrangeas, purple orchids, and tranquil lotus ponds. Visitors can also reach the monastery via a scenic 2.3-km cable car ride from Robin Hill.
      </>
    ),
    descVi: (
      <>
        Tọa lạc trên đỉnh núi Phụng Hoàng nhìn thẳng ra Hồ Tuyền Lâm, Thiền Viện Trúc Lâm là thiền viện Phật giáo lớn nhất tỉnh Lâm Đồng thuộc phái Trúc Lâm Yên Tử. Khởi công năm 1993, quần thể kiến trúc hài hòa giữa nét chùa cổ truyền thống với vườn hoa bonsai, hồ sen tĩnh mặc và rừng thông vi vu. Du khách có thể trải nghiệm tuyến cáp treo dài 2,3 km từ Đồi Robin để thưởng ngoạn toàn cảnh rừng núi trước khi bước vào chốn thanh tịnh này.
      </>
    ),
    address: "Truc Lam Yen Tu St, Ward 3",
    addressVi: "Đường Trúc Lâm Yên Tử, Phường 3",
  },
  {
    id: "crazy-house",
    index: 11,
    title: "11. Crazy House (Hang Nga Guesthouse)",
    titleVi: "11. Biệt thự Hằng Nga (Crazy House)",
    img: "/guide/dalat/dalat-crazy-house.jpg",
    alt: "Crazy House Dalat",
    desc: (
      <>
        Listed by international travel magazines as one of the world’s ten most bizarre buildings, Crazy House (designed by Vietnamese architect Dang Viet Nga) is an awe-inspiring labyrinth of surreal expressionist art. Resembling a gargantuan decaying banyan tree, the complex features spiraling concrete bridges, sculpted spiderwebs, tree-trunk tunnels, and themed animal rooms (such as the Tiger, Kangaroo, and Eagle rooms). It&apos;s an imaginative fairy-tale dream brought to life in concrete and stone.
      </>
    ),
    descVi: (
      <>
        Được các tạp chí kiến trúc quốc tế bình chọn là một trong mười ngôi nhà kỳ dị nhất thế giới, Crazy House (do kiến trúc sư Đặng Việt Nga thiết kế) là một mê cung nghệ thuật siêu thực đầy kinh ngạc. Lấy cảm hứng từ gốc cây cổ thụ mục rỗng, công trình sở hữu những cây cầu bê tông uốn lượn giữa không trung, cửa sổ mạng nhện, đường hầm hang đá và các phòng nghỉ theo chủ đề muông thú. Một thế giới cổ tích kỳ ảo được hiện thực hóa giữa lòng Đà Lạt.
      </>
    ),
    address: "03 Huynh Thuc Khang St, Ward 4",
    addressVi: "03 Huỳnh Thúc Kháng, Phường 4",
  },
  {
    id: "datanla-waterfall",
    index: 12,
    title: "12. Datanla Waterfall",
    titleVi: "12. Thác Datanla",
    img: "/guide/dalat/dalat-datanla-falls-hd.jpg",
    alt: "Datanla Waterfall Dalat",
    desc: (
      <>
        Just 5 km south of the city center along Prenn Pass, Datanla is Dalat’s most popular waterfall for thrill-seekers and nature lovers alike. Cascading dramatically over smooth, multi-tiered stone ledges through a lush rainforest canyon, Datanla is legendary for the longest alpine coaster track in Southeast Asia (2,400 meters). Adventurous visitors can also participate in guided canyoning tours, zip-lining, and abseiling down roaring water curtains.
      </>
    ),
    descVi: (
      <>
        Nằm cách trung tâm chỉ 5 km trên đèo Prenn, Thác Datanla là con thác nổi tiếng và thu hút nhất Đà Lạt đối với những người yêu thích mạo hiểm. Dòng nước đổ qua các tầng đá ghềnh cuồn cuộn giữa hẻm núi rừng rậm xanh mát. Datanla nổi tiếng với hệ thống xe trượt máng (alpine coaster) dài nhất Đông Nam Á (2.400 mét), cùng các tour canyoning vượt thác đu dây và đu zipline băng qua tán rừng hùng vĩ.
      </>
    ),
    address: "National Road 20, Prenn Pass, Ward 3",
    addressVi: "Quốc lộ 20, Đèo Prenn, Phường 3",
  },
  {
    id: "langbiang-mountain",
    index: 13,
    title: "13. Langbiang Mountain",
    titleVi: "13. Đỉnh Núi Langbiang",
    img: "/guide/dalat/dalat-langbiang-mountain.jpg",
    alt: "Langbiang Mountain Dalat",
    desc: (
      <>
        Often hailed as the &ldquo;Roof of Dalat,&rdquo; Langbiang Mountain towers over 2,167 meters above sea level, approximately 12 km north of the city center in Lac Duong district. The mountain is steeped in the tragic, Romeo-and-Juliet-like folklore of K&apos;Lang and H&apos;Biang, heroes of the local K&apos;Ho ethnic minority. Visitors can ride Russian UAZ open-top military jeeps up the winding mountain road to Radar Peak (1,929m), where observation decks afford 360-degree vistas across the Golden Stream, Silver Stream, and emerald valleys.
      </>
    ),
    descVi: (
      <>
        Được ví như &ldquo;Nóc nhà của Đà Lạt&rdquo;, đỉnh núi Langbiang sừng sững ở độ cao 2.167 mét so với mực nước biển, thuộc huyện Lạc Dương cách trung tâm 12 km. Ngọn núi gắn liền với câu chuyện tình sử thi đầy xúc động của chàng K&apos;Lang và nàng H&apos;Biang thuộc bộ tộc người K&apos;Ho. Du khách có thể ngồi xe Jeep UAZ băng qua những cung đường đèo uốn lượn lên Đỉnh Ra-đa (1.929 m) để chiêm ngưỡng toàn cảnh Suối Vàng, Suối Bạc và thung lũng bạt ngàn thông reo.
      </>
    ),
    address: "Lac Duong Town, Lam Dong",
    addressVi: "Thị trấn Lạc Dương, Tỉnh Lâm Đồng",
  },
  {
    id: "elephant-waterfall",
    index: 14,
    title: "14. Elephant Waterfall (Thac Voi)",
    titleVi: "14. Thác Voi",
    img: "/guide/dalat/dalat-elephant-falls-hd.jpg",
    alt: "Elephant Waterfall Dalat",
    desc: (
      <>
        Situated approximately 25 km southwest of Dalat near Nam Ban town, Elephant Waterfall (Thac Lieng Rowoa) is one of the Central Highlands’ most untamed natural wonders. Plunging more than 30 meters over sheer basalt cliffs with deafening thunder, the falls crash into giant boulders resembling a herd of resting elephants. Adventurers can navigate wet, rocky staircases cut into the cliffside to discover Wind Cave (Hang Gio), a subterranean cavern behind the roaring curtain of water.
      </>
    ),
    descVi: (
      <>
        Tọa lạc cách Đà Lạt khoảng 25 km về hướng tây nam gần thị trấn Nam Ban, Thác Voi (Liêng Rơwoa) là một trong những kỳ quan thiên nhiên hoang sơ và hùng tráng nhất cao nguyên. Dòng thác cuộn trào từ độ cao hơn 30 mét trút xuống những phiến đá khổng lồ tựa đàn voi đang ngâm mình dưới nước. Du khách có thể men theo các bậc đá gập ghềnh len lỏi vào Hang Gió bí ẩn nằm ngay sau màn nước sương mù mịt.
      </>
    ),
    address: "Nam Ban Town, Lam Ha District",
    addressVi: "Thị trấn Nam Ban, Huyện Lâm Hà",
  },
  {
    id: "clay-tunnel",
    index: 15,
    title: "15. Clay Tunnel (Sculpture Tunnel)",
    titleVi: "15. Đường Hầm Điêu Khắc (Đường Hầm Đất Sét)",
    img: "/guide/dalat/dalat-clay-tunnel.jpg",
    alt: "Clay Tunnel Dalat",
    desc: (
      <>
        Meandering for over 1.2 kilometers along the banks of Tuyen Lam Lake, the Clay Tunnel is an open-air architectural museum sculpted entirely from local red basaltic clay mixed with eco-friendly binders. The route chronicles Dalat&apos;s history from its prehistoric wilderness to its French colonial belle époque, featuring clay replicas of the Cathedral, the Railway Station, traditional villas, and airplanes. At the tunnel&apos;s end sits the famous Infinity Lake (Ho Vo Cuc), where two monumental sculptured stone heads face each other across a reflecting pool surrounded by pines.
      </>
    ),
    descVi: (
      <>
        Trải dài hơn 1,2 km uốn lượn ven Hồ Tuyền Lâm, Đường Hầm Điêu Khắc là bảo tàng kiến trúc ngoài trời độc đáo được tạo tác hoàn toàn từ đất đỏ bazan địa phương kết hợp phụ gia thân thiện môi trường. Tuyến đường tái hiện sinh động lịch sử hình thành Đà Lạt từ thuở hoang sơ đến thời kỳ Pháp thuộc với các mô hình Nhà thờ Con Gà, Ga Đà Lạt, biệt thự cổ và máy bay thu nhỏ. Điểm nhấn cuối đường hầm là Hồ Vô Cực trứ danh với hai bức tượng điêu khắc gương mặt nhìn nhau soi bóng giữa rừng thông.
      </>
    ),
    address: "Ward 4, Dalat City",
    addressVi: "Phường 4, TP. Đà Lạt",
  },
];

export default function Dalat15AttractionsPage() {
  const [lang, setLang] = useState("en");
  const isVi = lang === "vi";

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    const handleLang = (e) => setLang(e?.detail || getLang());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("vinatap:lang-updated", handleLang);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("vinatap:lang-updated", handleLang);
    };
  }, []);

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);

  return (
    <div className="hcmc-page-wrap">
      {/* ── Top Companion Banner (Matching Screenshot 3 & 4) ── */}
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

      {/* ── Standard Editorial Navbar ── */}
      <header className="home-header" onMouseLeave={() => setActiveMegaMenu(null)}>
        <div className="home-header__container">
          <div className="home-header__left">
            <Logo variant="home" />
          </div>

          <nav className="home-header__nav">
            <ul className="home-nav-list">
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
            <LanguageSwitch />
          </div>
        </div>

        {/* ── Mega Menus Dropdown ── */}
        {activeMegaMenu && (
          <div
            className="home-megamenu"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="home-megamenu__container">
              {activeMegaMenu === "destinations" ? (
                <div className="home-megamenu__regions">
                  {MEGA_MENUS_DATA.destinations.regions.map((reg) => (
                    <div key={reg.name} className="home-megamenu__region">
                      <h4 className="home-megamenu__region-title">
                        {isVi ? reg.name : reg.nameEn}
                      </h4>
                      <ul className="home-megamenu__list">
                        {reg.provinces.map((prov) => (
                          <li key={prov.slug}>
                            <Link
                              href={`/province/${prov.slug}`}
                              className="home-megamenu__link"
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
                <div className="home-megamenu__grid">
                  {MEGA_MENUS_DATA[activeMegaMenu]?.items?.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="home-megamenu__card"
                    >
                      <div className="home-megamenu__img-wrap">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="home-megamenu__img"
                          loading="lazy"
                        />
                        {item.badge && (
                          <span className="home-megamenu__badge">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="home-megamenu__body">
                        <h4 className="home-megamenu__title">
                          {isVi && item.titleVi ? item.titleVi : item.title}
                        </h4>
                        <span className="home-megamenu__date">
                          {isVi && item.dateVi ? item.dateVi : item.date}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION (Screenshot 3 & 4) ─── */}
      <section
        className="hcmc-hero"
        style={{
          backgroundImage: "url('/guide/dalat/dalat-15-attractions-hd.jpg')",
          minHeight: "520px",
        }}
      >
        <div className="hcmc-hero__overlay" />
        <div className="hcmc-hero__content">
          <div className="hcmc-hero__badges">
            <span className="hcmc-badge">
              {isVi ? "BÀI VIẾT" : "ARTICLES"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "ĐÀ LẠT" : "DALAT"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="hcmc-hero__title" style={{ fontSize: "52px", letterSpacing: "-0.5px" }}>
            {isVi ? "15 điểm tham quan đẹp nhất Đà Lạt" : "The 15 best attractions in Dalat"}
          </h1>

          <p className="hcmc-hero__meta" style={{ fontSize: "14px", opacity: 0.9 }}>
            By Welcome to Vietnam &nbsp;·&nbsp; July 21, 2024
          </p>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER (Screenshot 5) ─── */}
      <main className="hcmc-container" style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 24px 60px" }}>
        {/* ACTION BUTTON (Screenshot 3 & 4) */}
        <div className="hcmc-action-wrap" style={{ margin: "36px 0 28px" }}>
          <Link
            href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
            className="hcmc-create-trip-btn"
            style={{
              background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
              borderRadius: "9999px",
              padding: "13px 36px",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isVi
                ? "Tạo chuyến du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </Link>
        </div>

        {/* INTRO PARAGRAPH (Screenshot 3 & 4) */}
        <p
          className="hcmc-intro"
          style={{
            fontSize: "15.5px",
            lineHeight: 1.76,
            color: "#334155",
            margin: "0 auto 44px",
            textAlign: "left",
          }}
        >
          {isVi
            ? "Đà Lạt là thành phố tuyệt đẹp trên cao nguyên miền Trung Việt Nam, cách TP. Hồ Chí Minh khoảng 300 km. Nơi đây nổi tiếng với khí hậu mát mẻ quanh năm, phong cảnh thiên nhiên ngoạn mục và nhịp sống bình yên, dịu dàng. Cùng khám phá 15 điểm đến hàng đầu tại Đà Lạt năm 2024."
            : "Dalat is a beautiful city in the Central Highlands of Vietnam, about 300 km from Ho Chi Minh City. The city is famous for its year-round cool climate, breathtaking scenery and gentle lifestyle. Check out these top 15 destinations in Dalat in 2024."}
        </p>

        {/* ─── 15 ATTRACTIONS LIST (Screenshot 5) ─── */}
        <div className="hcmc-list" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {DALAT_15_ATTRACTIONS.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="hcmc-item"
              style={{ paddingBottom: "36px", borderBottom: "1px solid #f1f5f9" }}
            >
              <h2
                className="hcmc-item__title"
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 16px 0",
                  lineHeight: 1.3,
                }}
              >
                {isVi ? item.titleVi : item.title}
              </h2>

              <div
                className="hcmc-item__layout"
                style={{
                  display: "flex",
                  gap: "28px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {/* Media Image (Crisp HD 4:3 Ratio) */}
                <div
                  className="hcmc-item__media"
                  style={{
                    flex: "0 0 340px",
                    maxWidth: "100%",
                    borderRadius: "6px",
                    overflow: "hidden",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    background: "#f8fafc",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Body Text */}
                <div
                  className="hcmc-item__body"
                  style={{
                    flex: "1 1 400px",
                    fontSize: "15px",
                    lineHeight: 1.76,
                    color: "#334155",
                  }}
                >
                  <p style={{ margin: "0 0 14px 0" }}>
                    {isVi ? item.descVi : item.desc}
                  </p>

                  {item.tip && (
                    <p style={{ margin: "0 0 12px 0", color: "#1e293b" }}>
                      <strong>{isVi ? "Mẹo:" : "Tip:"}</strong>{" "}
                      {isVi ? item.tipVi : item.tip}
                    </p>
                  )}

                  {item.address && (
                    <p
                      style={{
                        margin: "12px 0 0 0",
                        fontSize: "14px",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <MapPin size={15} style={{ color: "#00c2cb", flexShrink: 0 }} />
                      <span>
                        <strong>{isVi ? "Địa chỉ:" : "Address:"}</strong>{" "}
                        {isVi ? item.addressVi : item.address}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Closing Paragraph ── */}
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#334155", margin: "44px 0 24px" }}>
          {isVi ? (
            <>
              Từ những hồ nước tĩnh lặng nép mình giữa rừng thông cho tới những công trình kiến trúc Pháp cổ kính và các điểm vui chơi mạo hiểm, 15 thắng cảnh trên đây chính là những nét vẽ tinh tế nhất khắc họa nên vẻ đẹp mộng mơ của Đà Lạt. Dù là lần đầu đặt chân hay đã nhiều lần trở lại, xứ sở ngàn hoa vẫn luôn mang đến cho bạn những xúc cảm mới lạ và bình yên.
            </>
          ) : (
            <>
              From tranquil mountain lakes framed by misty pines to historic French colonial heritage and thrilling forest adventures, these 15 attractions capture the true poetic soul of Dalat. Whether it&apos;s your first visit or a nostalgic return, the City of Eternal Spring never ceases to amaze and inspire.
            </>
          )}
        </p>

        {/* ── Disclaimer Note ── */}
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#334155", margin: "0 0 28px", fontStyle: "italic" }}>
          {isVi
            ? "Note: Giá vé và thông tin tham quan có thể thay đổi tùy theo mùa vụ và thời điểm thực tế."
            : "Note: Admission fees and operating hours may vary depending on the season and local regulations."}
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
          <span
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {isVi ? "Điểm đến Đà Lạt" : "Dalat attractions"}
          </span>
          <span
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "9999px",
              padding: "5px 14px",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            {isVi ? "Trải nghiệm" : "Things to do"}
          </span>
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
            {/* Card 1 */}
            <Link
              href="/guide/3-week-vietnam-itinerary"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/megamenu/todo-1-3week.jpg"
                  alt="3-week Vietnam Itinerary"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "Lịch trình 3 tuần xuyên Việt" : "3-week Vietnam Itinerary"}
              </h3>
            </Link>

            {/* Card 2 */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/megamenu/todo-2-hcmc.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh" : "10 best things to do in Ho Chi Minh City"}
              </h3>
            </Link>

            {/* Card 3 */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", borderRadius: "8px", background: "#f1f5f9" }}>
                <img
                  src="/guide/hcmc/hcmc-12-foods-hd.jpg"
                  alt="12 must-try foods in Ho Chi Minh City"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "12px", lineHeight: 1.4 }}>
                {isVi ? "12 món ăn nhất định phải thử tại TP. Hồ Chí Minh" : "12 must-try foods in Ho Chi Minh City"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Full Public Footer ── */}
      <PublicFooter lang={lang} />

      {/* ── Floating AI Companion for Dalat ── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        province={{
          name: isVi ? "Đà Lạt" : "Dalat",
          slug: "dalat",
        }}
      />
    </div>
  );
}
