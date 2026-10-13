"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import { getLang } from "@/lib/prefs";
import {
  Search,
  ChevronDown,
  Sparkles,
  Compass,
  MapPin,
  Calendar,
  Utensils,
  X,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/complete-guide.css";
import "@/styles/twenty-best-things.css";

// ─── MEGAMENUS DATA ───
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
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
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
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Da Lat",
        titleVi: "Đà Lạt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 12, 2026",
        dateVi: "213 Tháng 10, 2026",
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
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "todo-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/province/dalat",
      },
    ],
  },
  eatAndDrink: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon nhất định phải thử ở Hà Nội",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "Saigon Culinary Highlights",
        titleVi: "Tinh hoa ẩm thực Sài Gòn",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "eat-3",
        title: "Top 10 Vietnamese Pho Varieties",
        titleVi: "Top 10 món phở ngon nhất Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "Seafood Feast in Vung Tau",
        titleVi: "Hải sản tươi ngon Vũng Tàu",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "Nha Trang Coastal Delicacies",
        titleVi: "Ẩm thực biển đảo Nha Trang",
        date: "October 14, 2026",
        dateVi: "2111 Tháng 10, 2026",
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
        title: "3-Week Vietnam Grand Tour",
        titleVi: "Hành trình 3 tuần xuyên Việt đỉnh cao",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10-Day Northern Vietnam Highlights",
        titleVi: "10 ngày khám phá tinh hoa miền Bắc",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "itin-3",
        title: "2-Week Heritage Trail: Hue to Hoi An",
        titleVi: "2 tuần con đường di sản: Huế đến Hội An",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1-Month Complete Vietnam Odyssey",
        titleVi: "1 tháng khám phá trọn vẹn dải đất hình chữ S",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

// ─── 20 ITEMS DATA ───
const THINGS_ITEMS = [
  {
    "id": "1-hoi-an",
    "num": 1,
    "titleEn": "1. Visit one of the most beautiful ancient towns in the world: Hoi An",
    "titleVi": "1. Khám phá một trong những phố cổ đẹp nhất thế giới: Hội An",
    "img": "/guide/20-best-things/1-hoi-an.jpg",
    "webp": "/guide/20-best-things/1-hoi-an.webp",
    "alt": "Hoi An Ancient Town with lanterns and boats on Hoai River",
    "provinceLink": "/province/da-nang",
    "paragraphsEn": [
      "Hoi An, a UNESCO World Heritage Site located in Central Vietnam, is well-known for its rich cultural influences from China, Japan, and France, which can be seen in its architectural attractions and residential housing. This ancient town offers a unique blend of bustling shophouses and the relaxed lifestyle of the local people. In Hoi An, you can enjoy a variety of cuisine, including some of the best dishes in the country, such as mi Quang and cao lau. The town is also a shopping paradise, offering tailored suits, unique patterned clothing, handcrafted items, and much more. To truly experience Hoi An, rent a bicycle and explore the town, where you'll be amazed by the small surprises hidden in every alleyway and corner. Although small in size, Hoi An has much to offer."
    ],
    "paragraphsVi": [
      "Hội An, di sản văn hóa thế giới được UNESCO công nhận tại miền Trung Việt Nam, nổi tiếng với sự giao thoa văn hóa đặc sắc từ Trung Hoa, Nhật Bản và Pháp thể hiện qua kiến trúc cổ kính và những nếp nhà truyền thống. Phố cổ mang đến nét quyến rũ hài hòa giữa những dãy nhà buôn sầm uất và nhịp sống thanh bình, thư thái của người dân địa phương. Tại Hội An, bạn có thể thưởng thức nền ẩm thực phong phú bậc nhất cả nước với các món trứ danh như mì Quảng và cao lầu. Nơi đây cũng là thiên đường mua sắm đồ thủ công mỹ nghệ, may mặc lấy ngay và lồng đèn rực rỡ. Để cảm nhận trọn vẹn vẻ đẹp phố cổ, hãy thuê một chiếc xe đạp dạo quanh từng ngõ nhỏ rêu phong."
    ]
  },
  {
    "id": "2-con-dao",
    "num": 2,
    "titleEn": "2. Embrace the tranquility on Con Dao Islands",
    "titleVi": "2. Tận hưởng sự thanh bình hoang sơ tại Côn Đảo",
    "img": "/guide/20-best-things/2-con-dao.jpg",
    "webp": "/guide/20-best-things/2-con-dao.webp",
    "alt": "Con Dao Islands pristine coastline and turquoise sea",
    "provinceLink": "/province/ba-ria-vung-tau",
    "paragraphsEn": [
      "Con Dao is a secluded destination off the Southern Coast and is easily accessible from Ho Chi Minh City (Saigon). Despite being underappreciated, Con Dao is a hidden paradise, offering a tropical island with turquoise coastlines that are both beautiful and quaint. In the eyes of the locals, however, Con Dao is a historical witness, home to the Con Dao Prison, also known as “Hell on Earth” to the prisoners of war who were held there. Vietnamese people now travel to Con Dao as part of their spiritual journey, often visiting the graveyards of iconic national heroes. As a result, the beautiful beaches are left to nature lovers. If you're a culture vulture who wants the best of both worlds – tourism and history – then Con Dao is the place to be."
    ],
    "paragraphsVi": [
      "Côn Đảo là quần đảo biệt lập ngoài khơi bờ biển phía Nam, dễ dàng tiếp cận từ TP. Hồ Chí Minh. Nơi đây được ví như một thiên đường ẩn mình với những bãi biển xanh ngọc bích phẳng lặng, bờ cát vàng mịn màng cùng hệ sinh thái biển nguyên sơ. Bên cạnh vẻ đẹp thiên nhiên ngoạn mục, Côn Đảo còn là một chứng nhân lịch sử thiêng liêng với Di tích Nhà tù Côn Đảo và Nghĩa trang Hàng Dương – nơi yên nghỉ của hàng vạn chiến sĩ cách mạng kiên trung. Côn Đảo mang đến sự hòa quyện trọn vẹn giữa du lịch nghỉ dưỡng biển đảo đẳng cấp và chiều sâu lịch sử tâm linh sâu sắc."
    ]
  },
  {
    "id": "3-ha-long-bay",
    "num": 3,
    "titleEn": "3. Stay at least one night in Ha Long Bay",
    "titleVi": "3. Nghỉ dưỡng ít nhất một đêm trên du thuyền Vịnh Hạ Long",
    "img": "/guide/20-best-things/3-ha-long-bay.jpg",
    "webp": "/guide/20-best-things/3-ha-long-bay.webp",
    "alt": "Ha Long Bay majestic limestone karsts at sunrise",
    "provinceLink": "/province/quang-ninh",
    "paragraphsEn": [
      "Visiting Ha Long Bay is a must-do while traveling in Vietnam. To fully embrace the mystique and majesty of the bay, we suggest you stay on a cruise ship for at least one night. The cruise will take you through the meandering waterways, allowing you to get up close to the giant limestone formations. You can watch the sunrise and sunset from the boat, surrounded by thousands of limestone karsts of all shapes and sizes. The boat provides beds, food, and other necessities. If you're looking for more active activities, you can go kayaking or swim in the bay. This trip is a treat for nature lovers, providing an enjoyable and immersive experience.",
      "For travelers who want to explore different cruise routes and overnight options, you can find more details here."
    ],
    "paragraphsVi": [
      "Khám phá Vịnh Hạ Long là trải nghiệm không thể bỏ lỡ khi đến Việt Nam. Để cảm nhận trọn vẹn vẻ đẹp kỳ vĩ và huyền ảo của kỳ quan thiên nhiên thế giới, bạn nhất định nên trải nghiệm ngủ đêm trên du thuyền. Du thuyền sẽ đưa bạn len lỏi qua làn nước xanh màu ngọc bích, chiêm ngưỡng cận cảnh hàng ngàn đảo đá vôi tráng lệ với muôn hình vạn trạng.",
      "Thức giấc đón bình minh huyền ảo giữa vịnh biển hay ngắm hoàng hôn buông xuống từ boong tàu là những khoảnh khắc vô giá. Bạn còn có thể chèo kayak khám phá các hang động kỳ bí, bơi lội giữa làn nước trong vắt hoặc câu mực đêm trên biển."
    ]
  },
  {
    "id": "4-mekong-delta",
    "num": 4,
    "titleEn": "4. Experience floating markets in the Mekong Delta",
    "titleVi": "4. Trải nghiệm nét văn hóa chợ nổi độc đáo tại miền Tây sông nước",
    "img": "/guide/20-best-things/4-mekong-delta.jpg",
    "webp": "/guide/20-best-things/4-mekong-delta.webp",
    "alt": "Bustling floating market boats in the Mekong Delta",
    "provinceLink": "/province/can-tho",
    "paragraphsEn": [
      "Compared to other parts of Vietnam, the Mekong Delta may seem a bit lacking in natural landscapes, but it is rich in unique trade customs and practices. The well-linked system of water bodies allows sellers and buyers to sell their fresh produce. Merchants from all over the region gather here at dawn to prepare for a busy day of trade. The best time to experience authentic vibes is around 6 AM to 7 AM. Nowhere else can you eat a bowl of hu tieu on a canoe while watching the motorboats crisscrossing by and be served food from boat to boat. The noise of the mini boats' engines and the clear calls of the vendor ladies create a lively and bustling atmosphere, truly reflecting life in the Mekong Delta."
    ],
    "paragraphsVi": [
      "Đồng bằng sông Cửu Long sở hữu nét văn hóa giao thương đường thủy độc nhất vô nhị. Mạng lưới sông ngòi, kênh rạch chằng chịt đã hình thành nên những khu chợ nổi tấp nập từ tờ mờ sáng. Thời điểm tuyệt vời nhất để ghé thăm là từ 6h đến 7h sáng. Không gì thi vị bằng việc ngồi trên xuồng ba lá bồng bềnh, thưởng thức một tô hủ tiếu nóng hổi, nhâm nhi ly cà phê sáng và ngắm nhìn những chiếc ghe đầy ắp trái cây tươi ngon cùng tiếng rao vang vọng sông nước."
    ]
  },
  {
    "id": "5-golden-bridge",
    "num": 5,
    "titleEn": "5. See the Golden Bridge",
    "titleVi": "5. Chiêm ngưỡng Cầu Vàng Bà Nà Hills kỳ vĩ",
    "img": "/guide/20-best-things/5-golden-bridge.jpg",
    "webp": "/guide/20-best-things/5-golden-bridge.webp",
    "alt": "Golden Bridge held by giant stone hands in Da Nang",
    "provinceLink": "/province/da-nang",
    "paragraphsEn": [
      "The bridge at Ba Na Hills (Da Nang) is an attraction that doesn't cross any rivers. Recently added to the complex, it has garnered attention not only from travelers, but also from the architectural community due to its eccentric design. The pedestrian bridge hovers over 1,400 meters above sea level, offering a breathtaking view of both the mountains and the sea. One special feature of the bridge is its 150-meter length of metallic yellow paint, adorned with flowers, which inspired its name. The highlight of the attraction is the weathered and mossy-looking hands supporting the bridge, a metaphorical representation of nature's protection. Walking on the bridge in the early morning mist creates a sense of walking on clouds. The combination of landscapes and architecture makes it a must-see photography experience."
    ],
    "paragraphsVi": [
      "Cây cầu tại Bà Nà Hills (Đà Nẵng) là một kiệt tác kiến trúc thu hút sự chú ý của truyền thông toàn cầu. Nằm ở độ cao hơn 1.400 mét so với mực nước biển, cây cầu đi bộ dài 150 mét dát vàng rực rỡ uốn lượn mềm mại giữa mây ngàn. Điểm nhấn ấn tượng nhất là hai bàn tay đá khổng lồ rêu phong nâng đỡ thân cầu, tượng trưng cho bàn tay của thần núi bảo bọc con người. Dạo bước trên cầu giữa làn sương sớm bồng bềnh tựa như đang bước đi trên chốn bồng lai tiên cảnh."
    ]
  },
  {
    "id": "6-pho-hanoi",
    "num": 6,
    "titleEn": "6. Eat a bowl of Pho in Hanoi",
    "titleVi": "6. Thưởng thức một tô Phở chuẩn vị tại Hà Nội",
    "img": "/guide/20-best-things/6-pho-hanoi.jpg",
    "webp": "/guide/20-best-things/6-pho-hanoi.webp",
    "alt": "Steaming hot bowl of authentic Hanoi beef pho with scallions",
    "provinceLink": "/province/ha-noi",
    "paragraphsEn": [
      "Pho can be found anywhere in Vietnam, but there’s nothing like eating pho in Hanoi. Pho Hanoi has its own charm: the broth is light and has no side veggies. The right bowl of pho should have lots of blanched green onions and a side egg (chen trung tran), accompanied by deep-fried Vietnamese-style churros (banh quay). Hanoi boasts pho vendors that have been operating for generations. Some of the most authentic places consist of just a simple pair of bamboo yokes and a couple of small stools. They open very early in the morning (4 AM to 5 AM) or late at night (1 AM to 2 AM). So, the best feeling is to snuggle down in your warm jacket while waiting for a steaming bowl of pho in the chilly weather of the capital city. Make sure you don’t miss out."
    ],
    "paragraphsVi": [
      "Phở có mặt ở khắp mọi miền đất nước, nhưng không đâu sánh bằng việc thưởng thức một bát phở nóng hổi ngay giữa lòng Hà Nội. Phở Hà Nội có nước dùng trong, ngọt thanh từ xương hầm kỹ, thơm nức mùi gừng nướng, hoa hồi và thảo quả. Tô phở chuẩn vị có thật nhiều hành lá xắt nhỏ, ăn kèm quẩy giòn tan hoặc trứng chần béo ngậy. Thưởng thức phở sáng trên những chiếc ghế con nơi góc phố cổ trong tiết trời se lạnh của Thủ đô là một trải nghiệm ẩm thực đỉnh cao khó quên."
    ]
  },
  {
    "id": "7-cu-chi-tunnels",
    "num": 7,
    "titleEn": "7. Visit the Cu Chi Tunnels",
    "titleVi": "7. Khám phá Di tích Địa đạo Củ Chi huyền thoại",
    "img": "/guide/20-best-things/7-cu-chi-tunnels.jpg",
    "webp": "/guide/20-best-things/7-cu-chi-tunnels.webp",
    "alt": "Cu Chi Tunnels historical shelter entrance in the forest",
    "provinceLink": "/province/ho-chi-minh",
    "paragraphsEn": [
      "A mere 70 km from Ho Chi Minh City (Saigon) lies the renowned historical destination – Cu Chi Tunnels, attracting millions of visitors annually. This network of over 200 kilometers of tunnels, known as the \"underground city\", was designed with functional spaces such as meeting rooms, emergency rooms, kitchens, and more. It took over 20 years to complete the system, which is divided into three levels, with the deepest reaching 12 meters. During the war, all daily and military activities took place within these tunnels. When visiting Cu Chi Tunnels, you will have the opportunity to explore a portion of the tunnels (which have been expanded for tourists' safety) and gain an understanding of the living and combat conditions faced by Vietnamese soldiers and what contributed to their victory. You can also try the unique snacks that used to serve as the main diet of the tunnel dwellers. Come and find out!"
    ],
    "paragraphsVi": [
      "Cách trung tâm TP. Hồ Chí Minh khoảng 70 km, Địa đạo Củ Chi là di tích lịch sử nổi tiếng toàn cầu thu hút hàng triệu du khách mỗi năm. Hệ thống địa đạo dài hơn 200 km trong lòng đất như một 'thành phố ngầm' hoàn chỉnh với phòng hội họp, trạm cứu thương, bếp Hoàng Cầm, kho chứa và khu sinh hoạt. Trực tiếp chui vào những đoạn đường hầm và nếm thử món khoai mì chấm muối mè sẽ giúp bạn thấu hiểu ý chí kiên cường và tài trí phi thường của quân dân Việt Nam."
    ]
  },
  {
    "id": "8-ca-phe-sua-da",
    "num": 8,
    "titleEn": "8. Drink a cup of Ca Phe Sua Da in Saigon",
    "titleVi": "8. Nhâm nhi ly Cà phê sữa đá đặc trưng Sài Gòn",
    "img": "/guide/20-best-things/8-ca-phe-sua-da.jpg",
    "webp": "/guide/20-best-things/8-ca-phe-sua-da.webp",
    "alt": "Iced milk coffee Ca Phe Sua Da in Saigon",
    "provinceLink": "/province/ho-chi-minh",
    "paragraphsEn": [
      "It's often said that Saigon is a multicultural city, gathering the highlights of cuisine from across the country and lacking its own specialty. However, we would argue that Saigon excels in one particular dish: milk coffee (ca phe sua). Coffee shops are abundant in Saigon, but the best ca phe sua recipes all have one thing in common: strong black coffee made from high-quality beans, mixed with condensed milk, and served over ice (ca phe sua da). It's no exaggeration to say that this drink is beloved by the Vietnamese people and can be considered the national drink. It's delicious any time of day, goes well with all types of food, and serves as a perfect wake-up call. You can even customize your cup by asking for more or less milk. One sip of this amazing drink will surely leave you in awe."
    ],
    "paragraphsVi": [
      "Cà phê sữa đá Sài Gòn đã được nhiều tạp chí ẩm thực danh giá thế giới bầu chọn là một trong những thức uống cà phê ngon nhất hành tinh. Cà phê nguyên chất đậm đà được pha phin truyền thống, hòa quyện cùng vị ngọt béo ngậy của sữa đặc và đá viên mát lạnh. Ngồi bên một quán cà phê vỉa hè ven đường rợp bóng cây, lắng nghe nhịp sống đô thị sôi động của Sài Gòn và nhâm nhi ly cà phê là phong cách sống đặc sắc của người dân phương Nam."
    ]
  },
  {
    "id": "9-hue-citadel",
    "num": 9,
    "titleEn": "9. Visit the Imperial Citadel of Hue",
    "titleVi": "9. Tham quan Quần thể Di tích Cố đô Huế",
    "img": "/guide/20-best-things/9-hue-citadel.jpg",
    "webp": "/guide/20-best-things/9-hue-citadel.webp",
    "alt": "Imperial Citadel of Hue ancient architecture",
    "provinceLink": "/province/thua-thien-hue",
    "paragraphsEn": [
      "Talking about history, during the course of a thousand-year feudal regime, Hue served as the former capital of the Nguyen Dynasty in the 19th and early 20th centuries. There still remains spectacular royal architecture from that era, including a collection of well-preserved palaces and tombs of royalty, each with its own unique layout and architectural design, designed to meet the strict requirements of Feng Shui principles. The site was recognized by UNESCO in 1994. To fully explore the immense complex and experience its solemn yet peaceful atmosphere, a full day is recommended."
    ],
    "paragraphsVi": [
      "Nhắc về dòng chảy lịch sử qua hàng ngàn năm phong kiến, Cố đô Huế từng là kinh đô của triều đại nhà Nguyễn trong thế kỷ 19 và đầu thế kỷ 20. Nơi đây lưu giữ quần thể kiến trúc hoàng gia tráng lệ gồm các cung điện nguy nga và lăng tẩm hoàng gia được bảo tồn nguyên vẹn, mỗi công trình mang một bố cục và thiết kế độc đáo, tuân thủ nghiêm ngặt các nguyên tắc Phong Thủy. Quần thể di tích được UNESCO công nhận vào năm 1994. Để khám phá trọn vẹn khu di tích rộng lớn và cảm nhận bầu không khí trang nghiêm mà thanh bình nơi đây, bạn nên dành trọn một ngày."
    ]
  },
  {
    "id": "10-saigon-nightlife",
    "num": 10,
    "titleEn": "10. Enjoy the nightlife in the unsleeping city – Saigon",
    "titleVi": "10. Tận hưởng nhịp sống đêm tại thành phố không ngủ – Sài Gòn",
    "img": "/guide/20-best-things/10-saigon-nightlife.jpg",
    "webp": "/guide/20-best-things/10-saigon-nightlife.webp",
    "alt": "Saigon vibrant nightlife street",
    "provinceLink": "/province/ho-chi-minh",
    "paragraphsEn": [
      "Saigoneers work hard, but they also know how to fully enjoy life. Saigon's nights are full of activities to suit every mood, from the bustling backpacker street of Bui Vien, to rooftop beer gardens and hidden cocktail bars. The city also offers countless options of delicious local street food to cater to all palates. Saigon at night is unmatched in energy, making it the perfect place to embrace a young, wild, and free spirit."
    ],
    "paragraphsVi": [
      "Người Sài Gòn làm việc hết mình, nhưng cũng biết cách tận hưởng cuộc sống trọn vẹn. Đêm Sài Gòn luôn ngập tràn hoạt động phù hợp với mọi tâm trạng, từ con phố Tây Bùi Viện náo nhiệt, đến các quán bia sân thượng lộng gió và những quán cocktail ẩn mình. Thành phố còn mang đến vô số lựa chọn ẩm thực đường phố thơm ngon chiều lòng mọi khẩu vị. Sài Gòn về đêm sở hữu nguồn năng lượng bất tận, là điểm đến hoàn hảo để đón nhận tinh thần trẻ trung, phóng khoáng và tự do."
    ]
  },
  {
    "id": "11-phu-quoc",
    "num": 11,
    "titleEn": "11. Visit Phu Quoc Island",
    "titleVi": "11. Khám phá Đảo Ngọc Phú Quốc",
    "img": "/guide/20-best-things/11-phu-quoc.jpg",
    "webp": "/guide/20-best-things/11-phu-quoc.webp",
    "alt": "Phu Quoc Island tropical beach paradise",
    "provinceLink": "/province/kien-giang",
    "paragraphsEn": [
      "No matter how much time you have to spend in Vietnam, Phu Quoc should definitely be added to your travel list. It offers direct international flights and a visa-free stay of up to 30 days. Phu Quoc boasts a diverse marine life, making it an ideal location for diving, and there are also numerous hidden waterfalls in its lush forests waiting to be explored. You can even take a look at traditional fish sauce-making villages to see the unique condiment being made. In addition to its natural beauty, Phu Quoc also has a rich history and cultural festivals that cannot be found anywhere else. This island is truly a paradise for sea lovers, not only for its own charm, but also for the collection of unspoiled remote islands that surround it, in case you want to extend your stay."
    ],
    "paragraphsVi": [
      "Dù bạn có bao nhiêu thời gian cho chuyến đi Việt Nam, Phú Quốc chắc chắn là điểm đến không thể bỏ qua trong danh sách của bạn. Hòn đảo có các chuyến bay quốc tế thẳng và chính sách miễn thị thực lên tới 30 ngày. Phú Quốc sở hữu hệ sinh vật biển phong phú lý tưởng cho hoạt động lặn biển, cùng nhiều thác nước ẩn mình trong những cánh rừng xanh tươi đang chờ bạn khám phá. Bạn còn có thể ghé thăm các làng nghề làm nước mắm truyền thống để tận mắt chứng kiến quy trình làm ra loại gia vị độc đáo này. Bên cạnh vẻ đẹp thiên nhiên, Phú Quốc còn có bề dày lịch sử và các lễ hội văn hóa đặc sắc. Hòn đảo thực sự là thiên đường cho những ai yêu biển, không chỉ bởi vẻ quyến rũ riêng mà còn bởi chuỗi đảo hoang sơ tuyệt đẹp bao quanh nếu bạn muốn kéo dài kỳ nghỉ."
    ]
  },
  {
    "id": "12-quang-binh",
    "num": 12,
    "titleEn": "12. Explore the land of caves – Quang Binh",
    "titleVi": "12. Thám hiểm vương quốc hang động – Quảng Bình",
    "img": "/guide/20-best-things/12-quang-binh.jpg",
    "webp": "/guide/20-best-things/12-quang-binh.webp",
    "alt": "Quang Binh cave Phong Nha Ke Bang National Park",
    "provinceLink": "/province/quang-binh",
    "paragraphsEn": [
      "Quang Binh, specifically Phong Nha-Ke Bang National Park, is home to a vast array of caves of varying shapes and sizes. There are several \"baby caves\" that cater to all ages and physical abilities, including Phong Nha Cave, Paradise Cave, Dark Cave, among others. You can take a rowing boat to venture deep into the caves and admire the stunning formations of stalactites, a creation of Mother Nature. For those seeking a more challenging experience, professionally organized treks are available for your safety. Some of the most popular options include Hang En (Swallow Cave), Hang Tu Lan (Tu Lan Cave), and the world's largest cave, Son Doong Cave. This cave is a true test of one's limits, as you will trek through the pristine forest, cross underground rivers, camp in massive caves, and witness one of the planet's greatest natural wonders.",
      "Entering the land of caves is a giant leap into the wonderland that you won't want to miss."
    ],
    "paragraphsVi": [
      "Quảng Bình, đặc biệt là Vườn quốc gia Phong Nha – Kẻ Bàng, là ngôi nhà của vô số hang động với muôn hình vạn trạng và kích cỡ khác nhau. Nơi đây có những hang động dễ tiếp cận phù hợp cho mọi lứa tuổi và thể lực, bao gồm Động Phong Nha, Động Thiên Đường, Hang Tối cùng nhiều hang khác. Bạn có thể chèo thuyền len lỏi vào sâu trong hang để chiêm ngưỡng những khối thạch nhũ tráng lệ do Mẹ Thiên Nhiên kiến tạo. Với những ai tìm kiếm trải nghiệm thử thách hơn, các tour trekking chuyên nghiệp được tổ chức bài bản để đảm bảo an toàn tuyệt đối. Một số lựa chọn nổi tiếng nhất bao gồm Hang Én, Hang Tú Làn và hang động tự nhiên lớn nhất thế giới – Hang Sơn Đoòng. Nơi đây là bài kiểm tra thực sự cho giới hạn của bạn khi băng qua rừng nguyên sinh, lội sông ngầm, cắm trại trong lòng hang kỳ vĩ và chiêm ngưỡng một trong những kỳ quan thiên nhiên vĩ đại nhất hành tinh.",
      "Bước vào vương quốc hang động là bước chân vào chốn thần tiên kỳ ảo mà bạn chắc chắn không muốn bỏ lỡ."
    ]
  },
  {
    "id": "13-sapa",
    "num": 13,
    "titleEn": "13. Fall in love in Sapa",
    "titleVi": "13. Say đắm trước vẻ đẹp mộng mơ của Sa Pa",
    "img": "/guide/20-best-things/13-sapa.jpg",
    "webp": "/guide/20-best-things/13-sapa.webp",
    "alt": "Sapa terraced rice fields and mountain landscape",
    "provinceLink": "/province/lao-cai",
    "paragraphsEn": [
      "Sapa is a city that holds a special place in the hearts of many Vietnamese people, and is often a must-see destination for travelers. It's no surprise, given the city's breathtaking landscapes and unique cultural influences. While the center of Sapa has modern amenities to accommodate tourists, the surrounding villages have maintained their traditional beauty and customs. Sapa is a popular destination for couples, thanks to its chilly and misty weather (with occasional snow in the winter) and an abundance of seasonal flowers, creating a romantic atmosphere. It is also home to the highest peak in Indochina, nicknamed \"the roof of Indochina\" – Fansipan Peak. Sapa offers a unique and different experience compared to other highland cities you may have visited."
    ],
    "paragraphsVi": [
      "Sa Pa giữ một vị trí đặc biệt trong trái tim của nhiều người Việt Nam và luôn là điểm đến không thể bỏ lỡ của du khách. Điều này không hề bất ngờ trước cảnh quan ngoạn mục cùng sự giao thoa văn hóa độc đáo nơi đây. Trong khi trung tâm Sa Pa có đầy đủ tiện nghi hiện đại phục vụ du khách, các bản làng xung quanh vẫn gìn giữ vẹn nguyên nét đẹp truyền thống và phong tục tập quán lâu đời. Sa Pa là điểm hẹn lý tưởng cho các cặp đôi nhờ tiết trời se lạnh trong sương mờ (đôi khi có tuyết rơi vào mùa đông) và muôn hoa khoe sắc rực rỡ, tạo nên bầu không khí vô cùng lãng mạn. Nơi đây còn sở hữu đỉnh Fansipan – 'Nóc nhà Đông Dương'. Sa Pa mang lại trải nghiệm độc đáo và khác biệt hoàn toàn so với bất kỳ thành phố vùng cao nào bạn từng ghé thăm."
    ]
  },
  {
    "id": "14-cat-ba",
    "num": 14,
    "titleEn": "14. Explore Cat Ba Island",
    "titleVi": "14. Khám phá Đảo Cát Bà",
    "img": "/guide/20-best-things/14-cat-ba.jpg",
    "webp": "/guide/20-best-things/14-cat-ba.webp",
    "alt": "Lan Ha Bay Cat Ba Island serene emerald water",
    "provinceLink": "/province/hai-phong",
    "paragraphsEn": [
      "Cat Ba Island is the largest island in Lan Ha Bay, which is located just beyond Ha Long Bay and boasts similarly stunning scenery. Visitors can participate in a variety of water activities such as fishing, kayaking, swimming, and sunbathing on isolated islands in the bay. For a break from the ocean, they can explore Monkey Island or Trung Trang Cave, which contains historic Vietnamese artifacts. Finally, they can take a trip up to the hilltop fortress for a breathtaking panoramic view of the island and its fishing villages at sunset. Don't miss out on this hidden gem."
    ],
    "paragraphsVi": [
      "Đảo Cát Bà là hòn đảo lớn nhất trên Vịnh Lan Hạ, nằm liền kề Vịnh Hạ Long và sở hữu cảnh sắc thiên nhiên kỳ vĩ không hề kém cạnh. Du khách có thể tham gia nhiều hoạt động dưới nước như câu cá, chèo thuyền kayak, bơi lội và tắm nắng trên những hòn đảo vắng thanh bình giữa vịnh. Đổi gió rời xa mặt biển, bạn có thể khám phá Đảo Khỉ hoặc Hang Trung Trang – nơi lưu giữ những dấu tích lịch sử quý giá. Cuối cùng, hãy lên Pháo đài Thần công trên đỉnh đồi để ngắm nhìn toàn cảnh hòn đảo và các làng chài lúc hoàng hôn buông xuống. Đừng bỏ lỡ viên ngọc ẩn giấu tuyệt vời này."
    ]
  },
  {
    "id": "15-quy-nhon",
    "num": 15,
    "titleEn": "15. Immerse yourself in Quy Nhon",
    "titleVi": "15. Đắm mình trong vẻ đẹp thành phố biển Quy Nhơn",
    "img": "/guide/20-best-things/15-quy-nhon.jpg",
    "webp": "/guide/20-best-things/15-quy-nhon.webp",
    "alt": "Quy Nhon coastline Eo Gio Ky Co",
    "provinceLink": "/province/binh-dinh",
    "paragraphsEn": [
      "Quy Nhon is a rising coastal city in Vietnam that is gaining recognition for its stunning beauty. The city is peaceful yet offers fascinating surprises, from its empty sandy beaches to its unique statues and monasteries. Ky Co Beach and Eo Gio are two must-visit attractions with a small entrance fee. Quy Nhon provides a comfortable atmosphere with open spaces and public areas where you can sit and relax while enjoying the ocean breeze. The city also offers enjoyable travel, with wide, newly-built roads along the shoreline. Additionally, the seafood noodles in Quy Nhon are exceptional, as seafood is freshly caught from the sea. As Quy Nhon continues to become more popular, we suggest visiting this city before it becomes too touristy."
    ],
    "paragraphsVi": [
      "Quy Nhơn là thành phố biển đang lên của Việt Nam, ngày càng được nhiều du khách biết đến bởi vẻ đẹp ngoạn mục. Thành phố mang lại cảm giác bình yên nhưng luôn đem đến những bất ngờ thú vị, từ những bãi cát vắng người đến các bức tượng độc đáo và chùa chiền thanh tịnh. Bãi Kỳ Co và Eo Gió là hai điểm đến nhất định phải ghé thăm với chi phí vé vào cổng rất nhỏ. Quy Nhơn mang lại bầu không khí thư thái với không gian thoáng đãng và các khu vực công cộng nơi bạn có thể ngồi thảnh thơi đón gió biển. Đi lại trong thành phố cũng rất thuận tiện với các cung đường ven biển mới mở rộng rãi. Ngoài ra, món bún chả cá và hải sản tại Quy Nhơn ngon xuất sắc vì hải sản được đánh bắt tươi rói mỗi ngày. Khi Quy Nhơn đang ngày càng thu hút khách du lịch, hãy đến trải nghiệm ngay trước khi nơi đây trở nên quá đông đúc."
    ]
  },
  {
    "id": "16-mu-cang-chai",
    "num": 16,
    "titleEn": "16. Visit the terraced rice fields in Mu Cang Chai",
    "titleVi": "16. Chiêm ngưỡng ruộng bậc thang Mù Cang Chải",
    "img": "/guide/20-best-things/16-mu-cang-chai.jpg",
    "webp": "/guide/20-best-things/16-mu-cang-chai.webp",
    "alt": "Mu Cang Chai golden terraced rice fields",
    "provinceLink": "/province/yen-bai",
    "paragraphsEn": [
      "Mu Cang Chai is a small mountain village in northwest Vietnam known for its agriculture, particularly terrace farming. Visit during the summer or autumn (July to October) to see the lush rice terraces turn into enchanting golden fields. The area is also home to the thriving Black H'mong people, an indigenous ethnic tribe known for their vibrant traditional clothing. Observing them as they harvest the crops gives a glimpse into the rich culture of the town. If you want to see stunning paddy fields on hillsides, Mu Cang Chai is a must-visit."
    ],
    "paragraphsVi": [
      "Mù Cang Chải là một vùng núi non vùng Tây Bắc Việt Nam nổi tiếng với nền nông nghiệp canh tác ruộng bậc thang độc đáo. Ghé thăm nơi đây vào mùa hè hoặc mùa thu (từ tháng 7 đến tháng 10) để tận mắt thấy những thửa ruộng bậc thang xanh mướt chuyển mình thành thảm lúa vàng óng ả mê hoặc. Vùng đất này còn là nơi sinh sống của đồng bào dân tộc H'Mông Đen với những bộ trang phục thổ cẩm rực rỡ sắc màu. Ngắm nhìn họ trong mùa thu hoạch mang lại cái nhìn sâu sắc về nét đẹp văn hóa vùng cao. Nếu bạn muốn chiêm ngưỡng những thửa ruộng bậc thang tuyệt mỹ uốn lượn quanh sườn núi, Mù Cang Chải là điểm đến không thể bỏ qua."
    ]
  },
  {
    "id": "17-dalat",
    "num": 17,
    "titleEn": "17. Find a relaxing moment in Dalat",
    "titleVi": "17. Tìm khoảng lặng bình yên tại Đà Lạt",
    "img": "/guide/20-best-things/17-dalat.jpg",
    "webp": "/guide/20-best-things/17-dalat.webp",
    "alt": "Dalat pine forests flower gardens and mist",
    "provinceLink": "/province/dalat",
    "paragraphsEn": [
      "Dalat is a highly sought-after getaway destination that captivates our hearts no matter how many times we visit. That's why we want to highly recommend you visit this city of flowers and pines. Although it has become quite touristy in recent times, it is so spacious that you can easily find quiet spots for yourself. A recommended itinerary for your trip would be:",
      "1. Rent a motorbike and explore the scenic roads that wind through the oval-shaped pine hills.",
      "2. Make a list of the many excellent coffee shops in Dalat that you would like to visit, each offering unique and Instagram-worthy decor.",
      "3. Stay at a cozy homestay with a scenic view, a specialty of Dalat, and gaze at the illuminated farms on the horizon. If you're feeling adventurous, treat yourself to a glass of wine and some chocolate.",
      "4. Snuggle into the comfortable bed and have a good night's sleep while listening to the wind sing.",
      "Dalat is where you can immerse yourself in nature and appreciate the slow pace of life."
    ],
    "paragraphsVi": [
      "Đà Lạt là điểm đến nghỉ dưỡng được săn đón hàng đầu, luôn chiếm trọn trái tim chúng tôi dù đã ghé thăm biết bao lần. Đó là lý do chúng tôi nhiệt tình khuyên bạn nên đến với thành phố của ngàn hoa và rừng thông này. Dù thời gian gần đây đã phát triển du lịch khá nhiều, thành phố vẫn rất rộng lớn để bạn dễ dàng tìm thấy những góc tĩnh lặng cho riêng mình. Một gợi ý lịch trình tuyệt vời cho chuyến đi của bạn là:",
      "1. Thuê một chiếc xe máy và khám phá những cung đường thơ mộng uốn lượn giữa đồi thông chập chùng hình oval.",
      "2. Lên danh sách những quán cà phê tuyệt vời tại Đà Lạt bạn muốn ghé thăm, mỗi quán đều sở hữu phong cách độc đáo và góc check-in tuyệt đẹp.",
      "3. Nghỉ tại một căn homestay ấm cúng có view thung lũng thơ mộng – nét đặc trưng của Đà Lạt – và ngắm nhìn những nhà lồng rực sáng phía chân trời. Nếu muốn chút thi vị, hãy tự thưởng cho mình một ly rượu vang và chút socola ngọt ngào.",
      "4. Cuộn mình trong chiếc giường êm ái và tận hưởng giấc ngủ ngon lành trong tiếng gió reo rì rào.",
      "Đà Lạt chính là nơi bạn hòa mình vào thiên nhiên và trân quý từng khoảnh khắc của nhịp sống chậm rãi."
    ]
  },
  {
    "id": "18-tam-coc-ninh-binh",
    "num": 18,
    "titleEn": "18. Admire Tam Coc, Ninh Binh",
    "titleVi": "18. Chiêm ngưỡng vẻ đẹp Tam Cốc, Ninh Bình",
    "img": "/guide/20-best-things/18-tam-coc-ninh-binh.jpg",
    "webp": "/guide/20-best-things/18-tam-coc-ninh-binh.webp",
    "alt": "Tam Coc Ninh Binh karst landscape and river boats",
    "provinceLink": "/province/ninh-binh",
    "paragraphsEn": [
      "It is hard to describe Tam Coc in words. This place seems straight out of a fairy tale and is best viewed from a rowing boat, with water splashing against the sides and oars. You'll journey through breathtaking karst mountains, surrounded by lush paddy fields and stunning lotus and water lily ponds. Along the way, you'll encounter grottos filled with sparkling stalactites. After the boat ride, you'll reach Bai Dinh Pagoda, one of the largest pagodas in Vietnam and a true representation of Buddhist tradition. Here, you can relax and admire the grandeur of nature or get lost in your own book in this hidden fairy site. Tam Coc is considered \"Ha Long Bay on land\" and is sure to attract more attention from travelers in the future. So, add it to your itinerary."
    ],
    "paragraphsVi": [
      "Thật khó để diễn tả Tam Cốc bằng lời. Nơi đây tựa như bước ra từ một câu chuyện cổ tích và đẹp nhất khi được chiêm ngưỡng từ một chiếc thuyền nan, với tiếng nước khua róc rách mạn thuyền. Bạn sẽ lướt qua những dãy núi đá vôi kỳ vĩ, bao quanh bởi những cánh đồng lúa xanh mướt và những đầm sen, súng ngát hương. Dọc đường đi, bạn sẽ khám phá các hang động lung linh với muôn vàn thạch nhũ lấp lánh. Sau chuyến du ngoạn bằng thuyền, bạn có thể ghé thăm Chùa Bái Đính – một trong những ngôi chùa lớn nhất Việt Nam và là biểu tượng sâu sắc của truyền thống Phật giáo. Tại đây, bạn có thể thư thái ngắm nhìn sự hùng vĩ của thiên nhiên hay thả hồn vào một cuốn sách nơi chốn tiên cảnh ẩn mình. Tam Cốc được ví như 'Vịnh Hạ Long trên cạn' và chắc chắn sẽ ngày càng thu hút du khách. Hãy thêm điểm đến này vào lịch trình của bạn."
    ]
  },
  {
    "id": "19-nha-trang",
    "num": 19,
    "titleEn": "19. Visit Nha Trang",
    "titleVi": "19. Khám phá thành phố biển Nha Trang",
    "img": "/guide/20-best-things/19-nha-trang.jpg",
    "webp": "/guide/20-best-things/19-nha-trang.webp",
    "alt": "Nha Trang tropical bay beach and resorts",
    "provinceLink": "/province/khanh-hoa",
    "paragraphsEn": [
      "Nha Trang may not be new, but it remains one of the most popular beach cities in the country due to its pleasant weather, warm water, and resort facilities that stretch along the shoreline. The best reason to visit Nha Trang is to completely relax and lounge on the beach while sipping cocktails and enjoying the sun. There is a wide range of food options available, including both local and international dishes. In Nha Trang, you can also experience the unique experience of a mud bath, which is said to have healing properties. You can also see the influence of the Champa culture through the Cham towers. Overall, it's a place to have fun and unwind."
    ],
    "paragraphsVi": [
      "Nha Trang có thể không còn là điểm đến mới mẻ, nhưng vẫn luôn là một trong những thành phố biển được yêu thích nhất cả nước nhờ thời tiết dễ chịu quanh năm, làn nước biển ấm áp và chuỗi khu nghỉ dưỡng tiện nghi trải dài dọc bờ biển. Lý do tuyệt vời nhất để ghé thăm Nha Trang là hoàn toàn thư giãn, nằm dài trên bãi biển nhâm nhi ly cocktail và tận hưởng ánh nắng vàng. Nơi đây có vô vàn lựa chọn ẩm thực phong phú từ món ăn địa phương đến quốc tế. Tại Nha Trang, bạn còn có thể trải nghiệm tắm bùn khoáng độc đáo với nhiều lợi ích cho sức khỏe. Bạn cũng sẽ cảm nhận được dấu ấn văn hóa Chăm pa đặc sắc qua các tháp Chàm cổ kính. Tựu trung lại, đây là nơi hoàn hảo để vui chơi và xả hơi."
    ]
  },
  {
    "id": "20-ha-giang",
    "num": 20,
    "titleEn": "20. Marvel in Ha Giang",
    "titleVi": "20. Chiêm ngưỡng kỳ quan hùng vĩ Hà Giang",
    "img": "/guide/20-best-things/20-ha-giang.jpg",
    "webp": "/guide/20-best-things/20-ha-giang.webp",
    "alt": "Lung Cu Flag Tower Ha Giang panoramic mountain view",
    "provinceLink": "/province/ha-giang",
    "paragraphsEn": [
      "Ha Giang is considered to be one of the most captivating motorbike routes in Vietnam. Make sure to keep your eyes wide open and take in as much as possible, as every turn in the road presents a stunning view of towering mountains and scenic rivers running through deep valleys. It is an exciting experience to drive through Hmong villages and see the residents in their vibrant outfits. But the highlight of the trip is the Ma Pi Leng Pass, where mountains, rivers, and skies come together to create breathtaking scenery, making it a must-visit destination at least once in your lifetime. The beauty of Ha Giang is indescribable, so you must go there and witness it for yourself."
    ],
    "paragraphsVi": [
      "Hà Giang được coi là một trong những cung đường phượt xe máy mê hoặc nhất tại Việt Nam. Hãy mở to mắt và thu trọn nhiều nhất có thể vào tầm nhìn, bởi mỗi khúc cua trên đường đều mở ra khung cảnh ngoạn mục của những dãy núi cao chót vót và những dòng sông thơ mộng chảy qua các thung lũng sâu thẳm. Lái xe qua các bản làng người H'Mông và ngắm nhìn người dân địa phương trong những bộ trang phục rực rỡ sắc màu là một trải nghiệm vô cùng phấn khích. Nhưng điểm nhấn của chuyến đi chính là Đèo Mã Pí Lèng – nơi núi non, sông nước và mây trời hội tụ tạo nên cảnh sắc tráng lệ đến nghẹt thở, khiến nơi đây trở thành điểm đến nhất định phải ghé thăm ít nhất một lần trong đời. Vẻ đẹp của Hà Giang là không lời nào tả xiết, vì vậy bạn phải đích thân đến đó và tận mắt chiêm ngưỡng."
    ]
  }
];

function renderParagraphContent(text, isVi) {
  if (typeof text !== "string") return text;

  // Check for numbered sub-steps like "1. Rent a motorbike..."
  const numMatch = text.match(/^(\d+\.\s)(.*)$/);
  if (numMatch) {
    return (
      <div className="things-item__substep">
        <span className="things-item__substep-num">{numMatch[1]}</span>
        <span>{numMatch[2]}</span>
      </div>
    );
  }

  const keywordMap = isVi
    ? [
        { key: "Cố đô Huế", href: "/province/thua-thien-hue" },
        { key: "Huế", href: "/province/thua-thien-hue" },
        { key: "Phú Quốc", href: "/province/kien-giang" },
        { key: "Vườn quốc gia Phong Nha – Kẻ Bàng", href: "/province/quang-binh" },
        { key: "Quảng Bình", href: "/province/quang-binh" },
        { key: "Sa Pa", href: "/province/lao-cai" },
        { key: "Đảo Cát Bà", href: "/province/hai-phong" },
        { key: "Cát Bà", href: "/province/hai-phong" },
        { key: "Quy Nhơn", href: "/province/binh-dinh" },
        { key: "Mù Cang Chải", href: "/province/yen-bai" },
        { key: "Đà Lạt", href: "/province/dalat" },
        { key: "Tam Cốc", href: "/province/ninh-binh" },
        { key: "Nha Trang", href: "/province/khanh-hoa" },
        { key: "Hà Giang", href: "/province/ha-giang" },
        { key: "Hội An", href: "/province/da-nang" },
        { key: "Côn Đảo", href: "/province/ba-ria-vung-tau" },
        { key: "Vịnh Hạ Long", href: "/province/quang-ninh" },
        { key: "Đồng bằng sông Cửu Long", href: "/province/can-tho" },
        { key: "Bà Nà Hills", href: "/province/da-nang" },
        { key: "Hà Nội", href: "/province/ha-noi" },
        { key: "Địa đạo Củ Chi", href: "/province/ho-chi-minh" },
        { key: "Sài Gòn", href: "/province/ho-chi-minh" },
      ]
    : [
        { key: "Hue", href: "/province/thua-thien-hue" },
        { key: "Phu Quoc", href: "/province/kien-giang" },
        { key: "Phong Nha-Ke Bang National Park", href: "/province/quang-binh" },
        { key: "Quang Binh", href: "/province/quang-binh" },
        { key: "Sapa", href: "/province/lao-cai" },
        { key: "Cat Ba Island", href: "/province/hai-phong" },
        { key: "Quy Nhon", href: "/province/binh-dinh" },
        { key: "Mu Cang Chai", href: "/province/yen-bai" },
        { key: "Dalat", href: "/province/dalat" },
        { key: "Tam Coc", href: "/province/ninh-binh" },
        { key: "Nha Trang", href: "/province/khanh-hoa" },
        { key: "Ha Giang", href: "/province/ha-giang" },
        { key: "Hoi An", href: "/province/da-nang" },
        { key: "Con Dao", href: "/province/ba-ria-vung-tau" },
        { key: "Ha Long Bay", href: "/province/quang-ninh" },
        { key: "Mekong Delta", href: "/province/can-tho" },
        { key: "Ba Na Hills", href: "/province/da-nang" },
        { key: "Hanoi", href: "/province/ha-noi" },
        { key: "Cu Chi Tunnels", href: "/province/ho-chi-minh" },
        { key: "Saigon", href: "/province/ho-chi-minh" },
      ];

  for (const item of keywordMap) {
    const idx = text.indexOf(item.key);
    if (idx !== -1) {
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + item.key.length);
      const after = text.slice(idx + item.key.length);
      return (
        <>
          {before}
          <Link href={item.href} className="things-inline-link">
            {match}
          </Link>
          {after}
        </>
      );
    }
  }

  return text;
}

export default function TwentyBestThingsPage() {
  const [lang, setLang] = useState("en");
  const isVi = lang === "vi";

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => setLang(e?.detail || getLang());
    window.addEventListener("vinatap:lang-updated", handleLang);
    window.addEventListener("storage", handleLang);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLang);
      window.removeEventListener("storage", handleLang);
    };
  }, []);

  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const menuTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (menuKey) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  return (
    <div className="vnn-page">
      {/* ─── PROVINCE CHATBOT AI COMPANION ─── */}
      <ProvinceChatbot
        province={{
          name: isVi ? "Việt Nam" : "Vietnam",
          nameVi: "Việt Nam",
          slug: "vietnam",
        }}
      />

      {/* ─── 1. TOP BANNER ─── */}
      <div
        className="vnn-top-banner"
        role="button"
        tabIndex={0}
        title="FREE AI TRAVEL ASSISTANT • AI COMPANION"
      >
        <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt" className="vnn-top-banner__inner">
          <img
            src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
            alt="VinaTap AI Travel Assistant - AI Companion"
            className="vnn-top-banner__img"
          />
        </Link>
      </div>

      {/* ─── 2. EDITORIAL NAVBAR WITH MEGAMENUS ─── */}
      <header className="vnn-navbar" onMouseLeave={handleMouseLeave}>
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
              onMouseEnter={() => handleMouseEnter("inspired")}
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
              onMouseEnter={() => handleMouseEnter("destinations")}
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
              onMouseEnter={() => handleMouseEnter("thingsToDo")}
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
              onMouseEnter={() => handleMouseEnter("eatAndDrink")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "eatAndDrink" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("itineraries")}
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
        {activeMenu && MEGA_MENUS_DATA[activeMenu] && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="vnn-megamenu__grid">
              {MEGA_MENUS_DATA[activeMenu].items.map((item) => (
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
                  <div className="vnn-megamenu__content">
                    <h4 className="vnn-megamenu__title">
                      {isVi && item.titleVi ? item.titleVi : item.title}
                    </h4>
                    <span className="vnn-megamenu__date">
                      {isVi && item.dateVi ? item.dateVi : item.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── SEARCH MODAL OVERLAY ─── */}
      {searchOpen && (
        <div
          className="vnn-search-modal"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="vnn-search-modal__box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vnn-search-modal__header">
              <h3 className="vnn-search-modal__title">
                {isVi ? "Tìm kiếm cẩm nang du lịch" : "Search Vietnam Travel Guide"}
              </h3>
              <button
                type="button"
                className="vnn-search-modal__close"
                onClick={() => setSearchOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="vnn-search-modal__body">
              <div className="vnn-search-input-wrap">
                <Search size={18} className="vnn-search-icon" />
                <input
                  type="text"
                  placeholder={
                    isVi
                      ? "Nhập tên điểm đến (Hà Nội, Hội An, Sapa, Đà Nẵng...)..."
                      : "Search destination (Hanoi, Hoi An, Sapa, Da Nang...)..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO SECTION (HÌNH 1) ─── */}
      <section
        className="things-hero"
        style={{
          backgroundImage: "url('/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg')",
        }}
      >
        <div className="things-hero__overlay" />
        <div className="things-hero__content">
          <div className="things-hero__badges">
            <span className="things-badge">#TRENDING</span>
            <span className="things-badge">FEATURED ARTICLES</span>
            <span className="things-badge">THINGS TO DO</span>
          </div>
          <h1 className="things-hero__title">
            {isVi ? "20 trải nghiệm tuyệt nhất tại Việt Nam" : "20 Best Things to Do in Vietnam"}
          </h1>
          <p className="things-hero__meta">
            {isVi ? "Bởi VinaTap • 10 Tháng 10, 2026" : "By VinaTap • October 10, 2026"}
          </p>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="things-container">
        {/* ACTION BUTTON (HÌNH 1) */}
        <div className="things-action-wrap">
          <Link
            href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
            className="things-create-trip-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isVi
                ? "Tạo chuyến du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </Link>
        </div>

        {/* INTRO PARAGRAPH (HÌNH 1 & 2) */}
        <p className="things-intro">
          {isVi ? (
            <>
              Rất nhiều du khách đến Việt Nam với dự định một kỳ nghỉ ngắn ngày nhưng cuối cùng lại ở lại lâu hơn dự kiến. Đất nước này quá đỗi quyến rũ – có vô vàn cảnh đẹp để thưởng ngoạn, hoạt động thú vị để trải nghiệm và món ăn ngon để thưởng thức đến mức gần như không thể gói gọn tất cả vào một lịch trình ba tuần. Để giúp bạn, chúng tôi đã chọn lọc 20 điều tuyệt vời nhất bạn không nên bỏ lỡ khi khám phá Việt Nam, giúp bạn tận dụng tối đa thời gian và có được những trải nghiệm đáng nhớ nhất về thiên nhiên, văn hóa và con người nơi đây.
            </>
          ) : (
            <>
              Many people travel to Vietnam intending to take a short holiday but end up staying longer than planned. The country is to blame – there are so many sights to see, activities to enjoy, and foods to try that it's nearly impossible to fit everything into a three-week itinerary. To help, we've highlighted 20 things you shouldn't miss while exploring Vietnam. This way, you can make the most of your time while having the best possible experience with the landscapes, people, and cuisine.
            </>
          )}
        </p>

        {/* ─── 20 ITEMS LIST (HÌNH 2, 3, 4, 5) ─── */}
        <div className="things-list">
          {THINGS_ITEMS.map((item) => (
            <article key={item.id} id={item.id} className="things-item">
              <h2 className="things-item__title">
                {isVi ? item.titleVi : item.titleEn}
              </h2>
              <div className="things-item__layout">
                <div className="things-item__img-wrap">
                  <picture>
                    <source srcSet={item.webp} type="image/webp" />
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="things-item__img"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="things-item__desc">
                  {(isVi ? item.paragraphsVi : item.paragraphsEn).map(
                    (p, pIdx) => {
                      if (
                        p.startsWith("1. ") ||
                        p.startsWith("2. ") ||
                        p.startsWith("3. ") ||
                        p.startsWith("4. ")
                      ) {
                        return (
                          <div key={pIdx}>
                            {renderParagraphContent(p, isVi)}
                          </div>
                        );
                      }
                      return (
                        <p key={pIdx}>
                          {renderParagraphContent(p, isVi)}
                        </p>
                      );
                    }
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ─── RELATED GUIDES SECTION ─── */}
        <section className="cg-explore-more" style={{ marginTop: "60px" }}>
          <h2 className="cg-explore-more__title">
            {isVi ? "Các bài viết hướng dẫn du lịch nổi bật khác" : "Other Featured Vietnam Travel Guides"}
          </h2>
          <div className="cg-explore-grid">
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="cg-explore-card"
            >
              <div className="cg-explore-card__img-wrap">
                <img
                  src="/guide/megamenu/inspired-3.jpg"
                  alt="The Complete Guide to Vietnam"
                  className="cg-explore-card__img"
                />
              </div>
              <h3 className="cg-explore-card__title">
                {isVi ? "Cẩm nang du lịch toàn diện Việt Nam" : "The Complete Guide to Vietnam"}
              </h3>
            </Link>

            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="cg-explore-card"
            >
              <div className="cg-explore-card__img-wrap">
                <img
                  src="/guide/megamenu/inspired-1.jpg"
                  alt="15 best places to visit in Vietnam in 2026"
                  className="cg-explore-card__img"
                />
              </div>
              <h3 className="cg-explore-card__title">
                {isVi
                  ? "15 địa điểm đẹp nhất Việt Nam năm 2026"
                  : "15 best places to visit in Vietnam in 2026"}
              </h3>
            </Link>

            <Link
              href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
              className="cg-explore-card"
            >
              <div className="cg-explore-card__img-wrap">
                <img
                  src="/guide/megamenu/inspired-2.jpg"
                  alt="Plan Your Vietnam Trip with Just One Prompt"
                  className="cg-explore-card__img"
                />
              </div>
              <h3 className="cg-explore-card__title">
                {isVi
                  ? "Lên kế hoạch du lịch Việt Nam chỉ với một prompt"
                  : "Plan Your Vietnam Trip with Just One Prompt"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <PublicFooter lang={lang} />
    </div>
  );
}
