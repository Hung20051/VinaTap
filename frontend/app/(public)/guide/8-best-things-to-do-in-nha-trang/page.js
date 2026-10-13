"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import NavbarAuthButton from "@/components/ui/NavbarAuthButton";
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
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
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

// ─── 8 BEST THINGS TO DO IN NHA TRANG DATA ───
const NHA_TRANG_ITEMS = [
  {
    id: "item-1",
    num: 1,
    titleEn: "1. Pick up new skills",
    titleVi: "1. Trải nghiệm thể thao biển & học thêm kỹ năng mới",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Paragliding.jpg",
    captionEn: "Paragliding at Bai Tranh Beach",
    captionVi: "Dù lượn ngắm biển tại Bãi Tranh",
    paragraphsEn: [
      "Nha Trang is a haven for water sports enthusiasts. Why not make the best out of your time and learn something new while you're here? For those who love adventure, the city offers world-class surfing and diving opportunities with stunning dive sites and accessible diving courses. Sailing Club Divers, Jeremy Stein's RAINBOW DIVERS, and Vietnam Nha Trang Active Diving Center are some of the qualified diving centers providing PADI scuba diving courses. These dive trips will take you to some of the best beaches in the region, like Hon Mun and Van Phong Bay.",
      "Besides, with advantageous weather conditions and a friendly surfer community, Nha Trang is a great place to catch your first waves. Talk to Surfing LIVE or Nha Trang Local Surf for professional and fun lessons, and, more importantly, Instagrammable photos. Their lessons take place at Bai Dai Beach, which has been voted the best beach in Nha Trang by many travel magazines.",
    ],
    paragraphsVi: [
      "Nha Trang là thiên đường đích thực cho những ai đam mê các môn thể thao dưới nước. Hãy tận dụng tối đa kỳ nghỉ để thử thách bản thân với một kỹ năng mới đầy hào hứng. Thành phố mang đến điều kiện lặn biển và lướt sóng đẳng cấp với các điểm lặn tráng lệ và khóa học chuyên nghiệp PADI từ Sailing Club Divers hay Rainbow Divers, đưa bạn đến Hòn Mun và Vịnh Vân Phong.",
      "Thêm vào đó, với thời tiết ôn hòa và cộng đồng lướt sóng thân thiện, Nha Trang là nơi hoàn hảo để bạn bắt những con sóng đầu tiên. Các câu lạc bộ như Surfing LIVE hay Nha Trang Local Surf mang đến các buổi học vui vẻ, an toàn tại Bãi Dài – bãi biển từng được nhiều tạp chí du lịch bình chọn đẹp nhất Nha Trang.",
    ],
  },
  {
    id: "item-2",
    num: 2,
    titleEn: "2. Explore the food scene",
    titleVi: "2. Khám phá thiên đường ẩm thực phong phú",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Nha-Trang-food.jpg",
    captionEn: "Banh Can – a local delicacy in Nha Trang",
    captionVi: "Bánh Căn – đặc sản trứ danh Nha Trang",
    paragraphsEn: [
      "Nha Trang cuisine deserves kudos for its variety. We're confident that you can try a new dish every day for at least a week without repetition. Restaurants are open from early morning until past nine in the evening, so feel free to venture out and cross some of the local dishes off your must-try list. Bun Ca (fish noodle soup) and Bun Sua (jellyfish noodle soup) are staples of Nha Trang, showcasing its seafood dynamics. Nem Nuong (grilled pork sausage platter) and Banh Can (mini pancakes grilled in clay molds) are other delights highlighting the region's palate. Consider Xoi Ca (caramelized fish sticky rice) for a more fulfilling kick that can hardly be replicated elsewhere outside Nha Trang. Seafood dinners are without question, but also make sure to pay a visit to Russian restaurants since there is a big Russian community in town, and they do a really great job introducing their cuisine here. There is no restriction on when to eat what, so just venture out with an open mind and, of course, an empty stomach.",
    ],
    paragraphsVi: [
      "Ẩm thực Nha Trang ghi điểm tuyệt đối bởi sự đa dạng và hương vị tươi ngon đậm chất miền biển. Bạn hoàn toàn có thể thưởng thức món mới mỗi ngày trong suốt tuần mà không hề lặp lại. Bún cá và bún sứa là hai món nước kinh điển thể hiện trọn vẹn vị ngọt thanh của hải sản vịnh ngọc.",
      "Nem nướng Ninh Hòa với nước chấm sệt béo ngậy và bánh căn nóng giòn nướng trên khuôn đất nung là những điểm nhấn ẩm thực bạn không thể bỏ lỡ. Hãy thử xôi cá cơm kho đậm đà, các bữa tiệc hải sản tươi sống bên bờ biển, hay trải nghiệm ẩm thực Nga độc đáo từ cộng đồng người Nga sinh sống lâu năm tại thành phố.",
    ],
  },
  {
    id: "item-3",
    num: 3,
    titleEn: "3. Hike to Co Tien Mountain",
    titleVi: "3. Trekking chinh phục Núi Cô Tiên",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Co-Tien-Mountain.jpg",
    captionEn: "Stunning view from Co Tien Mountain",
    captionVi: "Toàn cảnh tuyệt đẹp từ đỉnh Núi Cô Tiên",
    paragraphsEn: [
      "You've probably seen the crystal-clear waters of Nha Trang, but have you ever checked them out from the top of Mount Co Tien? The mountain is just a short drive from downtown and is a favorite spot for locals, especially in the early mornings when they come here for a quick workout and a dose of good vibes from Mother Nature. The hike is pretty straightforward, with a single trail, so you won't get lost. The first peak is fairly easy – just a short climb at the start and then a smooth, flat walk. You'll definitely want to snap a pic at the flagpole and the iconic motorbike that somehow ended up at the summit, thanks to some adventurous expats in Nha Trang. The other two peaks get steeper and rockier, so they'll require a bit more stamina and some mountain skills. Best to start early, ideally before 8 AM, to avoid the heat since there's not much shade on the mountain. Don't forget to bring plenty of water and some snacks, because you'll likely be hiking for at least 3 hours to hit all three peaks and head back down.",
    ],
    paragraphsVi: [
      "Bạn đã quen ngắm nhìn làn nước trong vắt của Nha Trang từ bờ biển, nhưng đã bao giờ chiêm ngưỡng thành phố từ đỉnh Núi Cô Tiên? Ngọn núi nằm cách trung tâm không xa và là điểm đến yêu thích của người bản địa vào sáng sớm để rèn luyện thể lực và hòa mình vào thiên nhiên.",
      "Cung đường leo núi gồm 3 đỉnh với tầm nhìn ngoạn mục hướng ra toàn cảnh vịnh biển. Đỉnh số 1 khá nhẹ nhàng, nơi bạn có thể check-in với cột cờ và chiếc xe máy biểu tượng. Hai đỉnh tiếp theo dốc hơn, đòi hỏi thể lực bền bỉ. Hãy bắt đầu trước 8 giờ sáng, mang theo nhiều nước và giày leo núi êm ái cho hành trình khoảng 3 tiếng cả đi lẫn về.",
    ],
  },
  {
    id: "item-4",
    num: 4,
    titleEn: "4. Retreat to indoor fun",
    titleVi: "4. Khám phá các điểm vui chơi trong nhà thú vị",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Museum-of-Oceanography.jpg",
    captionEn: "National oceanographic museum",
    captionVi: "Viện Hải dương học Nha Trang",
    paragraphsEn: [
      "If you happen to visit Nha Trang on a rainy day, don't worry – the city still has plenty to offer, just in a different way. Besides its lush natural beauty, Nha Trang is home to a bunch of cool indoor spots to check out. You can dive into the Museum of Oceanography or catch a traditional puppet show at the Do Theatre, where jaw-dropping performances are hailed in no less impressive a venue.",
    ],
    paragraphsVi: [
      "Nếu bạn ghé thăm Nha Trang vào một ngày mưa hay trưa nắng gắt, đừng lo – thành phố vẫn có rất nhiều điểm đến trong nhà hấp dẫn. Bạn có thể ghé thăm Viện Hải dương học với bể nuôi sinh vật biển khổng lồ và bộ xương cá voi lưng gù lịch sử.",
      "Hoặc thưởng thức vở diễn 'Rối Mơ' độc đáo tại Nhà hát Đó – công trình kiến trúc hình chiếc đó bắt cá ấn tượng kết hợp giữa rối nước, rối dây và âm nhạc dân gian đương đại.",
    ],
  },
  {
    id: "item-5",
    num: 5,
    titleEn: "5. Recover with holistic & natural therapies",
    titleVi: "5. Thư giãn & phục hồi với tắm bùn khoáng tự nhiên",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-mud-baths.jpg",
    captionEn: "Enjoy a relaxing mud bath",
    captionVi: "Tận hưởng cảm giác thư thái khi ngâm bùn khoáng",
    paragraphsEn: [
      "After days of soaking up the sun and sea, treat yourself to a full-body recovery with natural therapies unique to Nha Trang, like mud baths to detox and exfoliate, or hot mineral water soaks to boost circulation and rejuvenate your skin. Body massages, along with hair and scalp treatments, are also super popular here. Spas near the Po Nagar Cham Towers or the resorts on Hon Tam Island are perfect spots for these relaxing wellness activities.",
    ],
    paragraphsVi: [
      "Sau những ngày dài vui chơi dưới ánh nắng nhiệt đới, hãy tự thưởng cho mình liệu trình phục hồi toàn thân với các liệu pháp thiên nhiên trứ danh tại Nha Trang. Ngâm bùn khoáng nóng giúp thải độc, tẩy tế bào chết và suối khoáng nóng kích thích tuần hoàn máu, tái tạo làn da khỏe mạnh.",
      "Các khu du lịch khoáng bùn Tháp Bà, I-Resort hay khu nghỉ dưỡng Hòn Tằm là những thiên đường thư giãn hoàn hảo cùng các dịch vụ massage và chăm sóc sức khỏe toàn diện.",
    ],
  },
  {
    id: "item-6",
    num: 6,
    titleEn: "6. Venture into local architecture and beliefs",
    titleVi: "6. Khám phá di sản kiến trúc Chăm pa & văn hóa tâm linh",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Po-Nargar-Cham-Towers.jpg",
    captionEn: "Po Nagar Cham Towers",
    captionVi: "Quần thể Tháp Bà Ponagar cổ kính",
    paragraphsEn: [
      "One of the coolest things about Nha Trang is how the local architecture and religion are deeply influenced by the Champa Kingdom, along with a perfect blend of nature. While most people visit the famous Po Nagar Cham Towers, there are some lesser-known gems you should check out too, like Tu Ton Pagoda on Hon Do Island, just a 5-minute boat ride from the mainland, or the French-style architecture of the Mountain Church (Nha Tho Nui). These spots will give you a deeper understanding of the area's unique history and culture.",
    ],
    paragraphsVi: [
      "Nét đặc sắc của văn hóa Nha Trang là sự ảnh hưởng sâu sắc từ vương quốc Chăm pa cổ hòa quyện cùng thiên nhiên miền duyên hải. Địa điểm tiêu biểu nhất chính là Tháp Bà Ponagar – quần thể đền tháp bằng gạch nung ngàn năm tuổi đứng uy nghiêm trên đồi Cù Lao.",
      "Bên cạnh đó, bạn cũng có thể ghé thăm Chùa Từ Tôn thanh tịnh trên Hòn Đỏ (chỉ cách bờ 5 phút đi thuyền) hay Nhà thờ Núi (Nhà thờ Chánh tòa Kitô Vua) mang kiến trúc Gothic Pháp cổ kính uy nghiêm giữa lòng phố thị.",
    ],
  },
  {
    id: "item-7",
    num: 7,
    titleEn: "7. Hit up the amusement parks",
    titleVi: "7. Bùng nổ cảm xúc tại các khu vui chơi giải trí đỉnh cao",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Vinwonders-Nha-Trang.jpg",
    captionEn: "VinWonders Nha Trang",
    captionVi: "Công viên giải trí VinWonders Nha Trang trên đảo Hòn Tre",
    paragraphsEn: [
      "If you're looking for a fun day out (especially if you've got kids or you're part of a crew of young adventurers), a visit to an amusement park is a must! VinWonders is an awesome choice for both parents and kids, offering a ton of games and attractions to keep everyone entertained. But if you're more of a thrill-seeker, Kong Forest should be on your list. From Zipline Canopy rides to rafting through wild, twisting waters, or even ATV forest challenges, it's guaranteed to get your adrenaline pumping.",
    ],
    paragraphsVi: [
      "Nếu bạn đang tìm kiếm một ngày vui chơi trọn vẹn cùng gia đình hoặc nhóm bạn thân, các công viên giải trí ở Nha Trang chắc chắn sẽ không làm bạn thất vọng. VinWonders Nha Trang trên đảo Hòn Tre là điểm đến số một với hàng trăm trò chơi kỷ lục, công viên nước ven biển và show diễn thực cảnh Tata Show hoành tráng.",
      "Đối với những ai mê mạo hiểm, Công viên Kong Forest trên đỉnh Hòn Bà sẽ là lựa chọn tuyệt vời với đường trượt Zipline Canopy xuyên rừng, chèo bè vượt thác và lái xe địa hình ATV đầy phấn khích.",
    ],
  },
  {
    id: "item-8",
    num: 8,
    titleEn: "8. Savor sunsets in the coastal city",
    titleVi: "8. Thưởng ngoạn hoàng hôn lãng mạn trên vịnh biển",
    img: "/guide/nha-trang/Things-to-do-in-Nha-Trang-Nha-Trang-at-night.jpg",
    captionEn: "Tran Phu Beach at night",
    captionVi: "Phố biển Trần Phú rực rỡ khi đêm về",
    paragraphsEn: [
      "As the day winds down, take a moment to soak in the majestic sunset as the sun dips below the horizon. Whether you're sipping cocktails on a luxury cruise while enjoying a 5 course dinner and live music or catching the sunset on a stand-up paddleboard (with a more budget-friendly vibe), Nha Trang's sunsets radiate a magical light that'll stick with you long after your travels. Look up \"sunset cruise/yacht\" or \"sunset SUP\" and choose one that interests you.",
    ],
    paragraphsVi: [
      "Khi ánh ngày dần tắt, hãy dành những phút giây lắng đọng để ngắm mặt trời buông xuống sau rặng núi xa. Dù bạn chọn nhâm nhi ly cocktail trên du thuyền ngắm hoàng hôn sang trọng kết hợp bữa tối 5 món và violin sống động, hay chèo ván SUP lững lờ trên sóng biển, khoảnh khắc hoàng hôn Nha Trang luôn mang vẻ đẹp kỳ ảo khó quên. Tìm kiếm \"sunset cruise/yacht\" hoặc \"sunset SUP\" và chọn trải nghiệm mà bạn yêu thích nhất.",
    ],
  },
];

// Helper to render inline links
function renderInlineContent(text, isVi) {
  if (typeof text !== "string") return text;

  const links = isVi
    ? [
        { key: "Hòn Mun", href: "/province/khanh-hoa" },
        { key: "Vịnh Vân Phong", href: "/province/khanh-hoa" },
        { key: "Bãi Dài", href: "/province/khanh-hoa" },
        { key: "Tháp Bà Ponagar", href: "/province/khanh-hoa" },
        { key: "VinWonders", href: "/province/khanh-hoa" },
        { key: "Núi Cô Tiên", href: "/province/khanh-hoa" },
      ]
    : [
        { key: "Hon Mun", href: "/province/khanh-hoa" },
        { key: "Van Phong Bay", href: "/province/khanh-hoa" },
        { key: "Bai Dai Beach", href: "/province/khanh-hoa" },
        { key: "Po Nagar Cham Towers", href: "/province/khanh-hoa" },
        { key: "VinWonders", href: "/province/khanh-hoa" },
        { key: "Mount Co Tien", href: "/province/khanh-hoa" },
        { key: "Nha Trang cuisine", href: "/province/khanh-hoa" },
        { key: "Nha Trang", href: "/province/khanh-hoa" },
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

  return text;
}

export default function EightBestThingsNhaTrangPage() {
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
          <div className="vnn-navbar__brand">
            <Logo size={32} showText={true} />
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
            <NavbarAuthButton />
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
                      ? "Nhập tên điểm đến (Nha Trang, Đà Nẵng, Hà Nội...)..."
                      : "Search destination (Nha Trang, Da Nang, Hanoi...)..."
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
          backgroundImage:
            "url('/guide/nha-trang/Top-8-things-to-do-in-Nha-Trang-Vietnamnomad.jpg')",
        }}
      >
        <div className="hcmc-hero__overlay" />
        <div className="hcmc-hero__content">
          <div className="hcmc-hero__badges">
            <span className="hcmc-badge">
              {isVi ? "BÀI VIẾT" : "ARTICLES"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "NHA TRANG" : "NHA TRANG"}
            </span>
            <span className="hcmc-badge">
              {isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="hcmc-hero__title">
            {isVi
              ? "8 trải nghiệm tuyệt nhất tại Nha Trang"
              : "8 best things to do in Nha Trang"}
          </h1>

          <p className="hcmc-hero__meta">
            {isVi
              ? "Bởi VinaTap   1 Tháng 3, 2025"
              : "By VinaTap   March 1, 2025"}
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
            ? "Dù những bãi biển thơ mộng và các tour du ngoạn biển đảo chắc chắn là điểm nhấn khó quên, Nha Trang còn sở hữu một kho tàng trải nghiệm vượt xa những kỳ nghỉ dưỡng biển thông thường. Từ khám phá văn hóa bản địa, tắm khoáng bùn tự nhiên phục hồi cơ thể cho đến dạo quanh các khu chợ đêm sôi động và chiêm ngưỡng những công trình kiến trúc độc đáo, nơi đây có vô vàn điều thú vị để bạn khám phá. Dưới đây là 8 hoạt động tuyệt vời nhất tại Nha Trang giúp chuyến đi của bạn thêm phần trọn vẹn và đáng nhớ!"
            : "While the beach and island hopping are definitely highlights, Nha Trang offers a treasure trove of experiences beyond the usual beachside fun. From exploring local culture and soaking in natural hot springs to checking out vibrant markets and unique architectural gems, there's plenty to keep you entertained. Here are 8 must-do activities in Nha Trang that will make your trip even more unforgettable!"}
        </p>

        {/* ─── 8 ITEMS LIST (Screenshots 2, 3, 4, 5) ─── */}
        <div className="hcmc-list">
          {NHA_TRANG_ITEMS.map((item) => (
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

                {/* Right Column: Paragraphs */}
                <div className="hcmc-item__body">
                  {(isVi ? item.paragraphsVi : item.paragraphsEn).map(
                    (p, pIdx) => (
                      <p key={pIdx}>{renderInlineContent(p, isVi)}</p>
                    )
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ─── CLOSING PARAGRAPHS (Screenshots 1 & 2) ─── */}
        <div className="hcmc-closing-wrap">
          <p className="hcmc-closing-text">
            {isVi ? (
              <>
                Nha Trang mang đến nhiều trải nghiệm hơn là chỉ nằm dài thư giãn trên bãi biển hay đi thuyền thăm đảo. Sự hòa quyện giữa vẻ đẹp thiên nhiên ngoạn mục và chiều sâu văn hóa chắc chắn sẽ để lại trong bạn những kỷ niệm khó phai. Chúng tôi hy vọng 8 gợi ý trên sẽ giúp bạn có thêm nhiều lựa chọn vui chơi thú vị. Lần tới khi đến{" "}
                <Link href="/province/khanh-hoa" className="hcmc-inline-link">
                  Nha Trang
                </Link>
                , hãy thử bước chân khỏi bờ cát quen thuộc để tận hưởng những trải nghiệm tuyệt vời này nhé!
              </>
            ) : (
              <>
                Nha Trang offers so much more than just lounging on the beach or island hopping. The city’s mix of natural beauty and cultural richness will leave you with vivid memories. We hope these 8 activities give you more options for recreation. So, next time you’re in{" "}
                <Link href="/province/khanh-hoa" className="hcmc-inline-link">
                  Nha Trang
                </Link>
                , step off the beach and dive into these amazing experiences!
              </>
            )}
          </p>
          <p className="hcmc-closing-note">
            {isVi ? (
              <>
                <strong>Ghi chú:</strong> Mọi thương hiệu, địa điểm hoặc điểm tham quan được đề cập đều dựa trên gợi ý và trải nghiệm cá nhân của tác giả, hoàn toàn không phải quảng cáo.
              </>
            ) : (
              <>
                <strong>Note:</strong> Any brands, companies, or attractions mentioned are based on the author's recommendations and personal opinions, not advertisements.
              </>
            )}
          </p>
        </div>

        {/* ─── TAGS ROW (Screenshot 2) ─── */}
        <div className="hcmc-tags-wrap">
          <span className="hcmc-tag-badge">TAGS</span>
          <Link href="/province/khanh-hoa" className="hcmc-tag-pill">
            {isVi ? "Nha Trang" : "Nha Trang"}
          </Link>
          <Link href="/province/khanh-hoa" className="hcmc-tag-pill">
            {isVi ? "Điểm tham quan Nha Trang" : "Nha Trang attractions"}
          </Link>
        </div>

        {/* ─── RELATED ARTICLES SECTION ─── */}
        <section className="hcmc-related-section">
          <h2 className="hcmc-related-title">
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="hcmc-related-grid">
            {/* Card 1: 3-week Vietnam Itinerary */}
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

            {/* Card 2: 8 must-try foods in Hanoi */}
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

            {/* Card 3: 10 best things to do in Ho Chi Minh City */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="hcmc-related-card"
            >
              <div className="hcmc-related-thumb">
                <img
                  src="/guide/megamenu/todo-2-hcmc.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  className="hcmc-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="hcmc-related-card-title">
                {isVi
                  ? "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh"
                  : "10 best things to do in Ho Chi Minh City"}
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
              © 2026 VinaTap . All rights reserved.
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
      <ProvinceChatbot provinceName="Khánh Hòa" />
    </div>
  );
}
