"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import HeaderSearch from "@/components/ui/HeaderSearch";
import { getLang } from "@/lib/prefs";
import {
  Search,
  ChevronDown,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/hcmc-10-things.css";

// ─── MEGAMENUS DATA ───
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
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "January 9, 2026",
        dateVi: "9 Tháng 1, 2026",
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
        date: "September 27, 2026",
        dateVi: "27 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Da Lat",
        titleVi: "Đà Lạt",
        date: "September 21, 2026",
        dateVi: "21 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "August 2, 2026",
        dateVi: "2 Tháng 8, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "July 28, 2026",
        dateVi: "28 Tháng 7, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "things-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần khám phá Việt Nam",
        date: "May 10, 2026",
        dateVi: "10 Tháng 5, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "things-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Things to do",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "things-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "April 28, 2026",
        dateVi: "28 Tháng 4, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "things-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "April 20, 2026",
        dateVi: "20 Tháng 4, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-4-20things.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "things-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan tuyệt nhất tại Đà Lạt",
        date: "April 15, 2026",
        dateVi: "15 Tháng 4, 2026",
        badge: "Things to do",
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
        titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
        date: "March 20, 2026",
        dateVi: "20 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon không thể bỏ lỡ tại TP. Hồ Chí Minh",
        date: "March 15, 2026",
        dateVi: "15 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Soul of Vietnamese Cuisine",
        titleVi: "Phở – Linh hồn ẩm thực Việt Nam",
        date: "March 10, 2026",
        dateVi: "10 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon độc đáo tại Vũng Tàu",
        date: "March 5, 2026",
        dateVi: "5 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản khó quên tại Nha Trang",
        date: "March 1, 2026",
        dateVi: "1 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-5-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-Week Vietnam Grand Tour",
        titleVi: "Hành trình 3 tuần xuyên Việt đỉnh cao",
        date: "February 20, 2026",
        dateVi: "20 Tháng 2, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10-Day Northern Vietnam Highlights",
        titleVi: "10 ngày khám phá tinh hoa miền Bắc",
        date: "February 15, 2026",
        dateVi: "15 Tháng 2, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "itin-3",
        title: "2-Week Heritage Trail: Hue to Hoi An",
        titleVi: "2 tuần con đường di sản: Huế đến Hội An",
        date: "February 10, 2026",
        dateVi: "10 Tháng 2, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/province/da-nang",
      },
      {
        id: "itin-4",
        title: "1-Month Complete Vietnam Odyssey",
        titleVi: "1 tháng khám phá trọn vẹn dải đất hình chữ S",
        date: "February 5, 2026",
        dateVi: "5 Tháng 2, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
    ],
  },
};

// ─── 10 BEST THINGS TO DO IN HCMC DATA ───
const HCMC_ITEMS = [
  {
    id: "item-1",
    num: 1,
    titleEn: "1. Discover Vietnam’s rich history",
    titleVi: "1. Khám phá bề dày lịch sử hào hùng của Việt Nam",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-War-Remnants-Museum-Vietnamnomad.jpg",
    captionEn: "War Remnants Museum",
    captionVi: "Bảo tàng Chứng tích Chiến tranh",
    paragraphsEn: [
      "History buffs will love Ho Chi Minh City’s range of museums. Start your journey at the Ho Chi Minh City Museum of History, where you’ll trace the story of the country from prehistoric times through to the Nguyen Dynasty. Keep an eye out for the one-of-a-kind mummy discovered in Saigon. The exhibits are well-curated and often overlooked by tourists, making it a peaceful place to start.",
      "Next, prepare for an emotional and thought-provoking visit to the War Remnants Museum, which focuses on the Vietnam War. Allow 1–2 hours, and note that some content may be intense.",
    ],
    paragraphsVi: [
      "Những ai đam mê lịch sử chắc chắn sẽ say mê hệ thống bảo tàng phong phú của TP. Hồ Chí Minh. Hãy bắt đầu hành trình tại Bảo tàng Lịch sử TP.HCM, nơi bạn sẽ lần theo dòng chảy lịch sử từ thời tiền sử đến triều Nguyễn. Đừng bỏ lỡ xác ướp Xóm Cải độc nhất vô nhị được phát hiện tại Sài Gòn. Các hiện vật được trưng bày công phu và không gian thanh bình, rất lý tưởng để khởi đầu chuyến đi.",
      "Tiếp theo, hãy chuẩn bị cho một chuyến tham quan đầy cảm xúc tại Bảo tàng Chứng tích Chiến tranh, nơi tái hiện chân thực cuộc chiến tranh Việt Nam. Hãy dành khoảng 1–2 giờ và lưu ý một số hình ảnh có thể gây xúc động mạnh.",
    ],
    tipEn: "Both museums are located in District 1 and are easily accessible by taxi or ride-hailing apps. Entry fees range from 30,000 VND to 40,000 VND ($1.20–$1.60).",
    tipVi: "Cả hai bảo tàng đều nằm tại Quận 1 và dễ dàng tiếp cận bằng taxi hoặc xe công nghệ. Giá vé vào cổng dao động từ 30.000 VNĐ đến 40.000 VNĐ (~$1.20–$1.60).",
  },
  {
    id: "item-2",
    num: 2,
    titleEn: "2. Visit iconic historical buildings",
    titleVi: "2. Tham quan các công trình kiến trúc lịch sử biểu tượng",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Reunification-Palace-Vietnamnomad.jpg",
    captionEn: "Reunification Palace",
    captionVi: "Dinh Độc Lập (Hội trường Thống Nhất)",
    paragraphsEn: [
      "Ho Chi Minh City’s heritage buildings are a visual treat. Start at the Reunification Palace (also known as the Independence Palace), where tours guide you through 1970s-era command bunkers and staterooms.",
      "Just a short walk away, admire the Central Post Office, a beautiful colonial building designed by Marie-Alfred Foulhoux; the neighboring Notre Dame Cathedral (currently under renovation until 2027, but still worth a photo); and the Opera House.",
    ],
    paragraphsVi: [
      "Các công trình di sản của TP. Hồ Chí Minh là một bữa tiệc thị giác tuyệt mỹ. Khởi đầu tại Dinh Độc Lập (Hội trường Thống Nhất), nơi các tour tham quan sẽ đưa bạn qua những căn hầm chỉ huy quân sự và các phòng khánh tiết tráng lệ thời kỳ thập niên 1970.",
      "Chỉ cách đó vài bước đi bộ, bạn sẽ chiêm ngưỡng Bưu điện Trung tâm Sài Gòn – kiệt tác kiến trúc thuộc địa do kiến trúc sư Marie-Alfred Foulhoux thiết kế; Nhà thờ Đức Bà cổ kính kế bên (đang trùng tu đến năm 2027 nhưng vẫn rất đẹp khi chụp ảnh từ bên ngoài); và Nhà hát Thành phố.",
    ],
    tipEn: "Everything is within walking distance in District 1, or hop on the Hop-On Hop-Off Bus for an air-conditioned city tour.",
    tipVi: "Tất cả các điểm tham quan này đều nằm trong cự ly đi bộ ở Quận 1, hoặc bạn có thể trải nghiệm xe buýt 2 tầng Hop-On Hop-Off máy lạnh thoáng mát.",
  },
  {
    id: "item-3",
    num: 3,
    titleEn: "3. Explore the dynamic food scene",
    titleVi: "3. Khám phá nền ẩm thực sôi động và phong phú",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Ca-Phe-Sua-Da-Vietnamnomad.jpg",
    captionEn: "Ca phe sua da",
    captionVi: "Cà phê sữa đá Sài Gòn",
    paragraphsEn: [
      "Ho Chi Minh City is a food paradise. Whether you’re after a hearty bowl of pho, spicy bun bo Hue, or just a quick banh mi paired with creamy ca phe sua da (Vietnamese iced coffee)—a must-try combo—you’ll find it here.",
      "But it’s not all street food—Vietnamese fine dining is having a moment. Book a table at Anan Saigon, where Chef Peter Cuong Franklin reinvents traditional dishes with modern flair. Or try Quince, a sleek space blending Vietnamese heritage with upscale presentation. For a truly immersive experience, NOIR. Dining in the Dark Saigon offers a multi-sensory meal prepared and served by visually impaired staff.",
    ],
    paragraphsVi: [
      "TP. Hồ Chí Minh thực sự là một thiên đường ẩm thực. Dù bạn muốn thưởng thức một tô phở đậm đà, bún bò Huế cay nồng thơm lừng, hay một ổ bánh mì giòn rụm kết hợp với ly cà phê sữa đá béo ngậy – combo nhất định phải thử – bạn đều có thể tìm thấy ngay tại đây.",
      "Không chỉ có ẩm thực đường phố, nền ẩm thực cao cấp (fine dining) của Sài Gòn cũng đang phát triển mạnh mẽ. Đặt bàn tại Anan Saigon, nơi đầu bếp Peter Cường Franklin làm mới các món ăn truyền thống với phong cách hiện đại. Hoặc ghé Quince, không gian tinh tế kết hợp di sản Việt Nam với nghệ thuật bài trí đẳng cấp. Để có trải nghiệm độc nhất, NOIR. Dining in the Dark mang đến bữa ăn đa giác quan do chính người khiếm thị phục vụ.",
    ],
    tipEn: "Skip your hotel breakfast and head out early; follow the locals to the busiest street stalls and you won’t be disappointed.",
    tipVi: "Hãy bỏ qua bữa sáng tại khách sạn và dậy sớm ra phố; đi theo người bản địa tới những quán ăn đường phố đông khách nhất, bạn chắc chắn sẽ không thất vọng.",
  },
  {
    id: "item-4",
    num: 4,
    titleEn: "4. Marvel at religious architecture",
    titleVi: "4. Chiêm ngưỡng kiến trúc tôn giáo độc đáo",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Tan-Dinh-Church-Vietnamnomad.jpg",
    captionEn: "Tan Dinh Church",
    captionVi: "Nhà thờ Tân Định (Nhà thờ màu hồng)",
    paragraphsEn: [
      "Vietnam is home to a unique blend of religions, and Ho Chi Minh City reflects that diversity. One striking example is the Tan Dinh Church, easily recognized by its vibrant pink facade—an architectural gem that has become a favorite for both photographers and history buffs. Not far away, the Jade Emperor Pagoda offers a more meditative experience; this atmospheric temple is filled with incense smoke, intricate carvings, and statues.",
      "For a glimpse into a lesser-seen side of Vietnam’s spiritual life, the Mariamman Hindu Temple stands out with its colorful exterior and detailed sculptures, offering a rare look into Hinduism in the country. These sacred sites provide a meaningful cultural lens and are generally open daily with no entrance fee.",
    ],
    paragraphsVi: [
      "Việt Nam sở hữu sự hòa quyện tôn giáo độc đáo, và Sài Gòn phản ánh rõ nét sự đa dạng đó. Ví dụ nổi bật là Nhà thờ Tân Định, dễ dàng nhận biết bởi màu sơn hồng rực rỡ – viên ngọc kiến trúc được cả nhiếp ảnh gia lẫn du khách yêu thích. Cách đó không xa, Chùa Ngọc Hoàng (Phước Hải Tự) mang đến cảm giác thanh tịnh; ngôi chùa cổ kính ngập tràn hương khói, những bức phù điêu chạm khắc tinh xảo và tượng Phật tôn nghiêm.",
      "Để ngắm nhìn một khía cạnh tâm linh độc đáo khác, Đền thờ Ấn Độ giáo Mariamman nổi bật với mặt tiền rực rỡ và các tác phẩm điêu khắc chi tiết. Các địa điểm tôn nghiêm này mở cửa miễn phí hàng ngày cho du khách ghé thăm.",
    ],
    tipEn: "Dress modestly when visiting religious sites, and be respectful of worshippers.",
    tipVi: "Hãy mặc trang phục lịch sự, kín đáo khi viếng thăm các nơi thờ tự tôn giáo và luôn tôn trọng người đi lễ.",
  },
  {
    id: "item-5",
    num: 5,
    titleEn: "5. Shop until you drop",
    titleVi: "5. Mua sắm thỏa thích từ bình dân đến cao cấp",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-the-Diamond-Plaza-Vietnamnomad.jpg",
    captionEn: "Diamond Plaza",
    captionVi: "Trung tâm thương mại Diamond Plaza",
    paragraphsEn: [
      "Whatever your budget, Ho Chi Minh City offers something for every kind of shopper. High-end fashionistas can head to Vincom Dong Khoi or Diamond Plaza, while bargain hunters should dive into Ben Thanh Market for souvenirs and snacks (just don’t forget to haggle!).",
      "Looking for something more unique? Browse flea markets at Nha Van Hoa Thanh Nien, especially during weekends, or head up to the boutique stores hidden in repurposed apartments, where you’ll find handmade crafts, vintage items, and local art.",
    ],
    paragraphsVi: [
      "Dù ngân sách của bạn là bao nhiêu, TP. Hồ Chí Minh đều có nơi mua sắm phù hợp. Những tín đồ thời trang cao cấp có thể ghé Vincom Đồng Khởi hoặc Diamond Plaza, trong khi người thích săn đồ lưu niệm và đặc sản có thể hòa mình vào không khí nhộn nhịp của Chợ Bến Thành (nhớ trả giá nhẹ nhàng!).",
      "Bạn muốn tìm kiếm điều gì đó độc đáo hơn? Hãy dạo các hội chợ cuối tuần tại Nhà Văn hóa Thanh Niên, hoặc khám phá các cửa hàng boutique ẩn mình trong các chung cư cổ cải tạo, nơi bày bán đồ thủ công, thời trang vintage và nghệ thuật bản địa.",
    ],
    tipEn: "Try to avoid bargaining early in the morning, as it is considered a bad omen for sellers.",
    tipVi: "Nên tránh trả giá quá gay gắt vào sáng sớm khi mở hàng, vì theo quan niệm buôn bán đây là điều kiêng kỵ của tiểu thương.",
  },
  {
    id: "item-6",
    num: 6,
    titleEn: "6. Take to the water",
    titleVi: "6. Trải nghiệm du ngoạn sông nước Sài Gòn",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Bach-Dang-Bus-Station-Vietnamnomad.jpg",
    captionEn: "Bach Dang Station",
    captionVi: "Ga tàu thủy Bạch Đằng (Saigon Waterbus)",
    paragraphsEn: [
      "Escape the chaos of the city streets and explore the city from its rivers. A relaxing ride on the Saigon Water Bus offers a glimpse of lesser-known neighborhoods, with a cool breeze to boot.",
      "If you’d like something more active, rent a SUP (stand-up paddleboard) or kayak and float along the Saigon River. Head out before 5 p.m. to catch the sunset, when the golden light reflects on the water.",
      "For something more romantic, book a dinner cruise featuring traditional musical performances and Vietnamese cuisine.",
    ],
    paragraphsVi: [
      "Rời xa sự hối hả của đường phố và ngắm nhìn Sài Gòn từ dòng sông là một trải nghiệm tuyệt vời. Chuyến đi thư thái trên Saigon Waterbus mang đến góc nhìn mới lạ về các khu dân cư ven sông cùng những làn gió mát rượi.",
      "Nếu bạn thích vận động, hãy thuê ván chèo đứng (SUP) hoặc thuyền kayak trên sông Sài Gòn. Hãy xuất phát trước 5 giờ chiều để đón hoàng hôn rực rỡ khi ánh nắng vàng óng phản chiếu trên mặt nước.",
      "Để có một buổi tối lãng mạn, bạn có thể đặt du thuyền ăn tối kết hợp thưởng thức biểu diễn âm nhạc dân tộc và ẩm thực Việt Nam tinh túy.",
    ],
    tipEn: "Always book tickets in advance to secure your best trip, as they tend to sell out quickly.",
    tipVi: "Nên đặt vé trước qua website hoặc quầy vé sớm, đặc biệt là các chuyến ngắm hoàng hôn vì vé thường hết rất nhanh.",
  },
  {
    id: "item-7",
    num: 7,
    titleEn: "7. Experience performing arts",
    titleVi: "7. Thưởng thức nghệ thuật biểu diễn đặc sắc",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Saigon-Opera-House-Vietnamnomad.jpg",
    captionEn: "Saigon Opera House",
    captionVi: "Nhà hát Thành phố (Saigon Opera House)",
    paragraphsEn: [
      "Whether you’re drawn to traditional or contemporary performance art, Ho Chi Minh City delivers memorable experiences for all tastes. A standout is the A O Show at the historic Saigon Opera House—a visually stunning blend of acrobatics, contemporary dance, and traditional Vietnamese music, all set against the backdrop of one of the city’s most iconic colonial-era buildings. Tickets are easy to secure either online or directly at the venue.",
      "If you’re looking for something more budget-friendly yet equally rich in culture, catch a water puppet show at the Golden Dragon Water Puppet Theater or the Ho Chi Minh City Museum of History. These lively performances bring ancient Vietnamese folk tales to life through a unique blend of puppetry, music, and humor—all performed on a water stage in a tradition that dates back centuries.",
    ],
    paragraphsVi: [
      "Dù bạn yêu thích nghệ thuật truyền thống hay đương đại, Sài Gòn đều mang đến những trải nghiệm biểu diễn khó quên. Nổi bật nhất là À Ố Show tại Nhà hát Thành phố – sự hòa quyện mãn nhãn giữa xiếc tre, múa đương đại và âm nhạc dân gian Việt Nam bên trong công trình kiến trúc Pháp cổ kính. Bạn có thể dễ dàng đặt vé trực tuyến hoặc mua trực tiếp tại sảnh.",
      "Nếu bạn muốn lựa chọn tiết kiệm hơn nhưng vẫn đậm đà bản sắc văn hóa, hãy xem múa rối nước tại Nhà hát Múa rối nước Rồng Vàng hoặc Bảo tàng Lịch sử. Những vở diễn sống động tái hiện truyện cổ tích và đời sống làng quê Việt Nam trên sân khấu nước hàng trăm năm tuổi.",
    ],
    tipEn: "Arrive early for the A O Show to admire the beautiful interiors of the Opera House.",
    tipVi: "Hãy đến sớm trước giờ biểu diễn À Ố Show khoảng 30 phút để chiêm ngưỡng kiến trúc nội thất lộng lẫy của Nhà hát Thành phố.",
  },
  {
    id: "item-8",
    num: 8,
    titleEn: "8. Dive into nightlife",
    titleVi: "8. Hòa mình vào nhịp sống về đêm náo nhiệt",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Bui-Vien-Street-Vietnamnomad.jpg",
    captionEn: "Bui Vien Street",
    captionVi: "Phố đi bộ Bùi Viện về đêm",
    paragraphsEn: [
      "As the sun sets, Ho Chi Minh City comes alive with energy. Start your evening with a stroll down Nguyen Hue Walking Street, where locals gather for music and street performances. Don’t miss the Cafe Apartment, a converted old building now packed with trendy cafés and bars.",
      "Families can head to Thu Thiem Park or Bach Dang Riverside Park for a relaxed vibe with plenty of outdoor games for all ages.",
      "If you’re looking for something wilder, head to Bui Vien Street, the city’s party central, where you’ll find backpacker bars, loud music, dance shows, and cold beer served until dawn.",
    ],
    paragraphsVi: [
      "Khi màn đêm buông xuống, TP. Hồ Chí Minh bừng sáng với nguồn năng lượng bất tận. Bắt đầu buổi tối bằng việc tản bộ dọc phố đi bộ Nguyễn Huệ, nơi người dân tụ họp nghe nhạc đường phố. Đừng quên ghé Chung cư Cà phê 42 Nguyễn Huệ – khối nhà cổ chứa đầy những quán cà phê và quán bar độc đáo.",
      "Các gia đình có thể đến Công viên Bến Bạch Đằng hoặc Công viên Bờ sông Thủ Thiêm để tận hưởng không gian thoáng mát ven sông.",
      "Nếu muốn không khí sôi động, cuồng nhiệt hơn, hãy tới Phố Tây Bùi Viện – tâm điểm tiệc tùng của thành phố với vô số quán bar, âm nhạc rộn rã, những màn biểu diễn đường phố và bia lạnh phục vụ xuyên đêm.",
    ],
    tipEn: "Keep your belongings close in crowded nightlife areas and always ask about prices before ordering.",
    tipVi: "Hãy giữ gìn tư trang cẩn thận ở những nơi đông người và luôn hỏi giá trước khi gọi đồ uống hoặc đồ ăn.",
  },
  {
    id: "item-9",
    num: 9,
    titleEn: "9. Explore Saigon Chinatown",
    titleVi: "9. Khám phá Khu phố người Hoa (Chợ Lớn)",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Chinatown-Vietnamnomad.jpg",
    captionEn: "Binh Tay Market",
    captionVi: "Chợ Bình Tây (Chợ Lớn Quận 5)",
    paragraphsEn: [
      "Saigon Chinatown in District 5 is a world unto itself. Dive into the sensory overload of Binh Tay Market, one of the oldest and largest wholesale markets in the city.",
      "Don’t miss ancient Chinese temples like Thien Hau Pagoda, and be sure to snack on authentic Chinese-Vietnamese cuisine—think sui cao (dumplings), xa xiu (Chinese barbecue pork), and sweet che desserts.",
    ],
    paragraphsVi: [
      "Khu phố người Hoa (Chợ Lớn) tại Quận 5 và Quận 6 như một thế giới riêng biệt đầy màu sắc. Hãy hòa mình vào không khí tấp nập của Chợ Bình Tây, một trong những khu chợ đầu mối lâu đời và quy mô bậc nhất thành phố.",
      "Đừng bỏ qua các ngôi miếu cổ như Chùa Bà Thiên Hậu, và hãy thưởng thức những món ăn gốc Hoa đậm đà khó cưỡng – như sủi cảo Hà Tôn Quyền, xá xíu thơm lừng, vịt quay và các món chè ngọt thanh mát.",
    ],
    tipEn: "Morning is the best time to visit markets and temples, before the midday heat sets in.",
    tipVi: "Buổi sáng sớm là thời điểm lý tưởng nhất để khám phá chợ và viếng chùa, trước khi nắng nóng giữa trưa gay gắt.",
  },
  {
    id: "item-10",
    num: 10,
    titleEn: "10. Take day trips from the city",
    titleVi: "10. Tham gia các chuyến đi trong ngày khám phá vùng phụ cận",
    img: "/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Cu-Chi-Tunnels-Vietnamnomad.jpg",
    captionEn: "Cu Chi Tunnels",
    captionVi: "Địa đạo Củ Chi",
    paragraphsEn: [
      "Ho Chi Minh City is ideally situated for some truly fascinating day trips that blend history, nature, and adventure. Just a couple of hours away, the Cu Chi Tunnels offer a powerful glimpse into Vietnam’s wartime past—you can even crawl through parts of the underground network.",
      "For a more tranquil experience, head to the Mekong Delta, where you can cruise along winding waterways, explore bustling floating markets, and take in the lush, green scenery.",
      "Nature lovers should also consider visiting Can Gio Mangrove Forest, an eco-paradise home to monkeys, crocodiles, and sprawling mangrove trees. These excursions are easy to arrange through most hotels or popular travel platforms.",
    ],
    paragraphsVi: [
      "TP. Hồ Chí Minh là điểm xuất phát lý tưởng cho những chuyến đi trong ngày kết hợp lịch sử, thiên nhiên và khám phá. Chỉ cách trung tâm khoảng 1,5 đến 2 giờ chạy xe, Địa đạo Củ Chi mang đến góc nhìn chân thực về thời kỳ chiến tranh – bạn thậm chí có thể trải nghiệm chui qua các đoạn hầm ngầm kiên cố.",
      "Nếu thích cảnh sắc thanh bình, hãy xuôi về Đồng bằng sông Cửu Long (Miền Tây sông nước), nơi bạn có thể xuôi thuyền qua những con rạch rợp bóng dừa nước, ghé chợ nổi và thưởng thức hoa quả nhiệt đới tươi ngon.",
      "Những ai yêu thiên nhiên có thể ghé thăm Rừng ngập mặn Cần Giờ – khu dự trữ sinh quyển thế giới với đàn khỉ tự nhiên và rừng đước bạt ngàn.",
    ],
    tipEn: "Pack snacks, sunscreen, and plenty of water for a full day of exploring.",
    tipVi: "Hãy chuẩn bị đồ ăn nhẹ, kem chống nắng và nhiều nước uống cho một ngày dài khám phá.",
  },
];

// Helper to render inline links and formatting
function renderInlineContent(text, isVi) {
  if (typeof text !== "string") return text;

  // Render food terms with italic formatting if present
  const foodItalics = ["sui cao", "xa xiu", "che", "pho", "bun bo Hue", "banh mi", "ca phe sua da"];
  
  const links = isVi
    ? [
        { key: "Dinh Độc Lập", href: "/province/ho-chi-minh" },
        { key: "Bưu điện Trung tâm Sài Gòn", href: "/province/ho-chi-minh" },
        { key: "Nhà thờ Tân Định", href: "/province/ho-chi-minh" },
        { key: "Chợ Bến Thành", href: "/province/ho-chi-minh" },
        { key: "Địa đạo Củ Chi", href: "/province/ho-chi-minh" },
        { key: "Bảo tàng Chứng tích Chiến tranh", href: "/province/ho-chi-minh" },
        { key: "TP. Hồ Chí Minh", href: "/province/ho-chi-minh" },
        { key: "Đồng bằng sông Cửu Long", href: "/province/can-tho" },
      ]
    : [
        { key: "Ho Chi Minh City", href: "/province/ho-chi-minh" },
        { key: "Reunification Palace", href: "/province/ho-chi-minh" },
        { key: "Central Post Office", href: "/province/ho-chi-minh" },
        { key: "Tan Dinh Church", href: "/province/ho-chi-minh" },
        { key: "Jade Emperor Pagoda", href: "/province/ho-chi-minh" },
        { key: "Ben Thanh Market", href: "/province/ho-chi-minh" },
        { key: "Saigon Opera House", href: "/province/ho-chi-minh" },
        { key: "Cu Chi Tunnels", href: "/province/ho-chi-minh" },
        { key: "Mekong Delta", href: "/province/can-tho" },
        { key: "food paradise", href: "/guide/12-must-try-foods-in-ho-chi-minh-city" },
      ];

  for (const item of links) {
    const idx = text.indexOf(item.key);
    if (idx !== -1) {
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + item.key.length);
      const after = text.slice(idx + item.key.length);
      return (
        <>
          {renderInlineContent(before, isVi)}
          <Link href={item.href} className="hcmc-inline-link">
            {match}
          </Link>
          {renderInlineContent(after, isVi)}
        </>
      );
    }
  }

  // Handle italics for culinary terms in English mode
  if (!isVi) {
    for (const term of foodItalics) {
      const termIdx = text.indexOf(term);
      if (termIdx !== -1) {
        const before = text.slice(0, termIdx);
        const match = text.slice(termIdx, termIdx + term.length);
        const after = text.slice(termIdx + term.length);
        return (
          <>
            {renderInlineContent(before, isVi)}
            <em>{match}</em>
            {renderInlineContent(after, isVi)}
          </>
        );
      }
    }
  }

  return text;
}

export default function TenBestThingsHCMCPage() {
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuTimeoutRef = useRef(null);

  const handleMouseEnter = (menuKey) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250);
  };

  return (
    <div className="hcmc-page-wrap">
      {/* ─── STICKY PROMO BANNER ─── */}
      <div className="vnn-promo-banner">
        <div className="vnn-promo-banner__content">
          <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/guide/hcmc/Vietnamnomad-header-banner-mobile-2026.jpg"
              />
              <img
                src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
                alt="Free AI Travel Assistant - AI Companion"
                className="vnn-promo-banner__img"
              />
            </picture>
          </Link>
        </div>
      </div>

      {/* ─── EDITORIAL HEADER & NAVBAR ─── */}
      <header className="vnn-navbar">
        <div className="vnn-navbar__inner">
          <div className="vnn-navbar__logo">
            <Logo />
          </div>

          <ul className="vnn-navbar__menu">
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

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("things")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "things" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "eat" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

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
                      <span className="vnn-megamenu__badge">{item.badge}</span>
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
        <div className="vnn-search-modal" onClick={() => setSearchOpen(false)}>
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
                      ? "Nhập tên điểm đến (Hồ Chí Minh, Hà Nội, Hội An...)..."
                      : "Search destination (Ho Chi Minh City, Hanoi, Hoi An...)..."
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

      {/* ─── HERO SECTION (Screenshot 1) ─── */}
      <section
        className="hcmc-hero"
        style={{
          backgroundImage: "url('/guide/hcmc/10-best-things-hcmc-hd.jpg')",
        }}
      >
        <div className="hcmc-hero__overlay" />
        <div className="hcmc-hero__content">
          <div className="hcmc-hero__badges">
            <span className="hcmc-badge">
              {isVi ? "BÀI VIẾT" : "ARTICLES"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "TP. HỒ CHÍ MINH" : "HO CHI MINH CITY"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="hcmc-hero__title">
            {isVi
              ? "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh"
              : "10 best things to do in Ho Chi Minh City"}
          </h1>

          <p className="hcmc-hero__meta">
            {isVi
              ? "Bởi Welcome to Vietnam   5 Tháng 5, 2025"
              : "By Welcome to Vietnam   May 5, 2025"}
          </p>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="hcmc-container">
        {/* ACTION BUTTON (Screenshot 1) */}
        <div className="hcmc-action-wrap">
          <Link
            href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
            className="hcmc-create-trip-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isVi
                ? "Tạo chuyến du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </Link>
        </div>

        {/* INTRO PARAGRAPH (Screenshots 1 & 2) */}
        <p className="hcmc-intro">
          {isVi
            ? "TP. Hồ Chí Minh, thường được người dân địa phương gọi thân thương là Sài Gòn, là sự giao thoa đầy lôi cuốn giữa nét cổ kính và hiện đại. Nơi đây kiến trúc thuộc địa Pháp tráng lệ đứng cạnh những tòa nhà chọc trời vút cao, và những ngôi chùa cổ kính ẩn mình giữa những quán cà phê thời thượng. Nếu bạn đang lên kế hoạch ghé thăm, dưới đây là 10 trải nghiệm tuyệt vời nhất mang đến cho bạn hương vị chân thực của thành phố sôi động, không ngừng chuyển mình này."
            : "Ho Chi Minh City, still fondly called Saigon by locals, is an exciting fusion of the old and new. It's where French colonial architecture stands beside soaring skyscrapers and ancient temples are nestled among trendy cafés. If you're planning a visit, here are the top 10 things to do that offer an authentic taste of this vibrant, ever-moving city."}
        </p>

        {/* ─── 10 ITEMS LIST (Screenshots 2, 3, 4, 5) ─── */}
        <div className="hcmc-list">
          {HCMC_ITEMS.map((item) => (
            <article key={item.id} id={item.id} className="hcmc-item">
              <h2 className="hcmc-item__title">
                {isVi ? item.titleVi : item.titleEn}
              </h2>

              <div className="hcmc-item__layout">
                {/* Left Column: Image + Caption */}
                <div className="hcmc-item__media">
                  <div className="hcmc-item__img-wrap">
                    <img
                      src={item.img}
                      alt={isVi ? item.captionVi : item.captionEn}
                      className="hcmc-item__img"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="hcmc-item__caption">
                    {isVi ? item.captionVi : item.captionEn}
                  </figcaption>
                </div>

                {/* Right Column: Paragraphs + Tip */}
                <div className="hcmc-item__body">
                  {(isVi ? item.paragraphsVi : item.paragraphsEn).map(
                    (p, pIdx) => (
                      <p key={pIdx}>{renderInlineContent(p, isVi)}</p>
                    )
                  )}

                  <p className="hcmc-item__tip">
                    <strong>Tip: </strong>
                    {isVi ? item.tipVi : item.tipEn}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ─── CLOSING PARAGRAPH (Screenshot 4) ─── */}
        <div className="hcmc-closing-wrap">
          <p className="hcmc-closing-text">
            {isVi ? (
              <>
                Chúng tôi hy vọng danh sách này sẽ giúp bạn có được trải nghiệm đa dạng và chân thực nhất trong khoảng thời gian tại TP. Hồ Chí Minh. Hãy cho chúng tôi biết hoạt động nào khiến bạn hào hứng nhất, và đừng ngần ngại chia sẻ những trải nghiệm tuyệt vời khác vào nhóm Facebook của chúng tôi,{" "}
                <a
                  href="https://www.facebook.com/groups/welcome2vietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Welcome to Vietnam
                </a>
                .
              </>
            ) : (
              <>
                We hope this list helps you enjoy a more diverse and authentic experience while making the most of your time in Ho Chi Minh City. Let us know which activity you’re most excited to try, and feel free to share any other awesome experiences you think we should add to the list in our Facebook group,{" "}
                <a
                  href="https://www.facebook.com/groups/welcome2vietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Welcome to Vietnam
                </a>
                .
              </>
            )}
          </p>
        </div>

        {/* ─── YOUTUBE VIDEO EMBED (Screenshot 4) ─── */}
        <div className="hcmc-video-container">
          <iframe
            src="https://www.youtube-nocookie.com/embed/wwDGC-pmKPw?rel=0"
            title="Ho Chi Minh City: A Guide to Visit Vietnam's Largest City"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="hcmc-video-iframe"
          />
        </div>

        {/* ─── TAGS ROW (Screenshot 4) ─── */}
        <div className="hcmc-tags-wrap">
          <span className="hcmc-tag-badge">TAGS</span>
          <Link href="/province/ho-chi-minh" className="hcmc-tag-pill">
            {isVi ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
          </Link>
          <Link href="/guide/20-best-things-to-do-in-vietnam" className="hcmc-tag-pill">
            {isVi ? "Trải nghiệm" : "Things to do"}
          </Link>
        </div>

        {/* ─── RELATED ARTICLES SECTION (Screenshots 4 & 5) ─── */}
        <section className="hcmc-related-section">
          <h2 className="hcmc-related-title">
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="hcmc-related-grid">
            {/* Card 1: Where to Stay in Ho Chi Minh City */}
            <Link
              href="/guide/where-to-stay-in-ho-chi-minh-city"
              className="hcmc-related-card"
            >
              <div className="hcmc-related-thumb">
                <img
                  src="/guide/hcmc/where-to-stay-in-hcmc-hd.jpg"
                  alt="Where to Stay in Ho Chi Minh City"
                  className="hcmc-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="hcmc-related-card-title">
                {isVi
                  ? "Nơi lưu trú tại TP. Hồ Chí Minh"
                  : "Where to Stay in Ho Chi Minh City"}
              </h3>
            </Link>

            {/* Card 2: 3-week Vietnam Itinerary */}
            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="hcmc-related-card"
            >
              <div className="hcmc-related-thumb">
                <img
                  src="/guide/megamenu/todo-1-3week.jpg"
                  alt="3-week Vietnam Itinerary"
                  className="hcmc-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="hcmc-related-card-title">
                {isVi
                  ? "Lịch trình 3 tuần khám phá Việt Nam"
                  : "3-week Vietnam Itinerary"}
              </h3>
            </Link>

            {/* Card 3: 8 must-try foods in Hanoi */}
            <Link
              href="/guide/8-must-try-foods-in-hanoi"
              className="hcmc-related-card"
            >
              <div className="hcmc-related-thumb">
                <img
                  src="/guide/megamenu/eat-1-hanoi.jpg"
                  alt="8 must-try foods in Hanoi"
                  className="hcmc-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="hcmc-related-card-title">
                {isVi
                  ? "8 món ngon nhất định phải thử tại Hà Nội"
                  : "8 must-try foods in Hanoi"}
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FOOTER BANNER & FOOTER ─── */}
      <footer className="vnn-footer">
        <div className="vnn-footer__banner">
          <picture>
            <img
              src="/guide/hcmc/Vietnamnomad-footer-banner-2026.jpg"
              alt="Vietnam Travel Community"
              className="vnn-footer__banner-img"
              loading="lazy"
            />
          </picture>
        </div>

        <div className="vnn-footer__bottom">
          <div className="vnn-footer__bottom-inner">
            <p className="vnn-footer__copyright">
              © 2026 VinaTap • Welcome to Vietnam. All rights reserved.
            </p>
            <div className="vnn-footer__socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING AI COMPANION ─── */}
      <ProvinceChatbot provinceName="Hồ Chí Minh" />
    </div>
  );
}
