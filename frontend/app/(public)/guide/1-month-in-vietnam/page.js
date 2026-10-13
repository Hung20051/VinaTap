"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import HeaderSearch from "@/components/ui/HeaderSearch";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Maximize2,
  X,
  Download,
  Share2,
  Check,
  Plane,
  Train,
  Car,
  Ship,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/one-month-itinerary.css";

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
        titleVi: "Thành phố Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Hanoi Capital",
        titleVi: "Thủ đô Hà Nội",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-hanoi.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "dest-3",
        title: "Da Nang Coastal Pearl",
        titleVi: "Đà Nẵng – Thành phố đáng sống",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-4",
        title: "Hoi An Ancient Town",
        titleVi: "Phố cổ Hội An",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-5",
        title: "Dalat Pine Hills",
        titleVi: "Đà Lạt ngàn hoa",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-dalat.jpg",
        link: "/province/dalat",
      },
    ],
  },
  things: {
    items: [
      {
        id: "th-1",
        title: "Top 10 Things in Saigon",
        titleVi: "10 Điều Tuyệt Nhất Tại Sài Gòn",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/itin-1-10things.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "th-2",
        title: "8 Best Things in Nha Trang",
        titleVi: "8 Trải Nghiệm Biển Đẹp Nha Trang",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "th-3",
        title: "5 Best Beaches in Vung Tau",
        titleVi: "5 Bãi Biển Đẹp Nhất Vũng Tàu",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/5-best-vung-tau-beaches",
      },
      {
        id: "th-4",
        title: "Hanoi Tourist Map & Heritage",
        titleVi: "Bản Đồ Du Lịch & Di Sản Hà Nội",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/dest-2-hanoi.jpg",
        link: "/guide/hanoi-tourist-map",
      },
      {
        id: "th-5",
        title: "Where to Stay in Saigon",
        titleVi: "Khách Sạn & Nơi Lưu Trú Sài Gòn",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/guide/where-to-stay-in-ho-chi-minh-city",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "Pho – The Complete Guide",
        titleVi: "Phở – Quốc Hồn Quốc Túy Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/eat-1-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-2",
        title: "12 Must-Try Foods in Saigon",
        titleVi: "12 Món Ăn Phải Thử Tại TP. Hồ Chí Minh",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/eat-2-streetfood.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "8 Must-Try Dishes in Hanoi",
        titleVi: "8 Món Ngon Nức Tiếng Thủ Đô Hà Nội",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/dest-2-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-4",
        title: "5 Must-Try Nha Trang Dishes",
        titleVi: "5 Món Ăn Phải Nếm Khi Đến Nha Trang",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/5-must-try-nha-trang-dishes",
      },
      {
        id: "eat-5",
        title: "7 Must-Try Foods in Vung Tau",
        titleVi: "7 Món Ăn Đặc Sản Vũng Tàu",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Cuisine",
        img: "/guide/megamenu/itin-2-3weeks.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-Week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt kinh điển",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-3weeks.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
      {
        id: "itin-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam 2026",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "itin-4",
        title: "Plan Trip with One Prompt",
        titleVi: "Lên kế hoạch với AI chỉ bằng một prompt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "AI Tool",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
    ],
  },
};

// ─── 17 DESTINATIONS DATA (SCREENSHOT 5) ───
const ITINERARY_17_DESTINATIONS = [
  {
    num: 1,
    name: "Ho Chi Minh City",
    nameVi: "Thành phố Hồ Chí Minh",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-1-ho-chi-minh-city.jpg",
    thingsToDo:
      "War Remnants Museum, Ben Thanh Market, Saigon Skydeck, Bui Vien Street, Cu Chi Tunnels.",
    thingsToDoVi:
      "Bảo tàng Chứng tích Chiến tranh, Chợ Bến Thành, Tòa nhà Bitexco Saigon Skydeck, Phố Tây Bùi Viện, Địa đạo Củ Chi.",
    nextRoute: "Ho Chi Minh City → Phu Quoc",
    nextRouteVi: "TP. Hồ Chí Minh → Phú Quốc",
    transport: "Plane (Vietnam Airlines, Vietjet Air, Pacific Airlines, and Bamboo Airways)",
    transportVi: "Máy bay (Vietnam Airlines, Vietjet Air, Bamboo Airways)",
    time: "1 hr 5 min",
    timeVi: "1 giờ 5 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ (~$32 - $48 USD)",
  },
  {
    num: 2,
    name: "Phu Quoc",
    nameVi: "Đảo Ngọc Phú Quốc",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-11-phu-quoc.jpg",
    thingsToDo:
      "Long Beach, Star Beach (Bai Sao), Hon Thom, Phu Quoc Prison, Phu Quoc Night Market, Vinpearl Safari.",
    thingsToDoVi:
      "Bãi Dài, Bãi Sao, Cáp treo Hòn Thơm vượt biển, Nhà tù Phú Quốc, Chợ đêm Phú Quốc, Vinpearl Safari.",
    nextRoute: "Phu Quoc → Ha Tien",
    nextRouteVi: "Phú Quốc → Hà Tiên",
    transport: "Ferry (Superdong)",
    transportVi: "Tàu cao tốc (Superdong / Phú Quốc Express)",
    time: "1 hr 15 min",
    timeVi: "1 giờ 15 phút",
    fare: "185,000 VND",
    fareVi: "185.000 VNĐ (~$7.5 USD)",
  },
  {
    num: 3,
    name: "Ha Tien",
    nameVi: "Hà Tiên",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/20-best-things/4-mekong-delta.jpg",
    thingsToDo:
      "Phu Dung Pagoda, Da Dung Mountain, Mac Family Temple, Ha Tien Night Market, Mui Nai Beach.",
    thingsToDoVi:
      "Chùa Phù Dung, Núi Đá Dựng, Đền thờ họ Mạc, Chợ đêm Hà Tiên, Bãi biển Mũi Nai hoang sơ.",
    nextRoute: "Ha Tien → Can Tho",
    nextRouteVi: "Hà Tiên → Cần Thơ",
    transport: "Bus (Tan Nien)",
    transportVi: "Xe khách liên tỉnh (Tân Niên / Phương Trang)",
    time: "5 hr",
    timeVi: "5 giờ",
    fare: "130,000 VND",
    fareVi: "130.000 VNĐ (~$5 USD)",
  },
  {
    num: 4,
    name: "Can Tho",
    nameVi: "Cần Thơ (Tây Đô)",
    days: "1-2 days",
    daysVi: "1-2 ngày",
    image: "/guide/15-best-places/place-13-can-tho.jpg",
    thingsToDo:
      "Cai Rang Floating Market, Ninh Kieu Wharf, Binh Thuy Ancient House, Phong Dien Floating Market, Fruit Orchards.",
    thingsToDoVi:
      "Chợ nổi Cái Răng lúc bình minh, Bến Ninh Kiều về đêm, Nhà cổ Bình Thủy, Vườn trái cây trĩu quả.",
    nextRoute: "Can Tho → Mui Ne",
    nextRouteVi: "Cần Thơ → Mũi Né",
    transport: "Sleeper Bus",
    transportVi: "Xe khách giường nằm cao cấp",
    time: "7 hr",
    timeVi: "7 giờ",
    fare: "250,000 – 350,000 VND",
    fareVi: "250.000 – 350.000 VNĐ (~$10 - $14 USD)",
  },
  {
    num: 5,
    name: "Mui Ne",
    nameVi: "Mũi Né (Phan Thiết)",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-12-mui-ne.jpg",
    thingsToDo:
      "White Sand Dunes, Red Sand Dunes, Fairy Stream (Suoi Tien), Mui Ne Fishing Village, Po Shanu Cham Towers.",
    thingsToDoVi:
      "Đồi Cát Trắng (Bàu Trắng), Đồi Cát Bay, Suối Tiên Mũi Né, Làng chài Mũi Né, Tháp Chàm Po Shanu.",
    nextRoute: "Mui Ne → Dalat",
    nextRouteVi: "Mũi Né → Đà Lạt",
    transport: "Bus / Limousine",
    transportVi: "Xe Limousine / Xe khách tuyến đèo",
    time: "4 - 5 hr",
    timeVi: "4 - 5 giờ",
    fare: "160,000 – 220,000 VND",
    fareVi: "160.000 – 220.000 VNĐ (~$6.5 - $9 USD)",
  },
  {
    num: 6,
    name: "Dalat",
    nameVi: "Đà Lạt (Thành Phố Ngàn Hoa)",
    days: "2-3 days",
    daysVi: "2-3 ngày",
    image: "/guide/15-best-places/place-9-da-lat.jpg",
    thingsToDo:
      "Xuan Huong Lake, Crazy House, Datanla Falls, Linh Phuoc Pagoda, Dalat Railway Station, Tuyen Lam Lake.",
    thingsToDoVi:
      "Hồ Xuân Hương, Biệt thự Hằng Nga (Crazy House), Thác Datanla máng trượt, Chùa Linh Phước, Ga Đà Lạt cổ.",
    nextRoute: "Dalat → Nha Trang",
    nextRouteVi: "Đà Lạt → Nha Trang",
    transport: "Bus / Limousine",
    transportVi: "Xe Limousine vượt đèo Khánh Lê",
    time: "3 - 4 hr",
    timeVi: "3 - 4 giờ",
    fare: "180,000 – 250,000 VND",
    fareVi: "180.000 – 250.000 VNĐ (~$7 - $10 USD)",
  },
  {
    num: 7,
    name: "Nha Trang",
    nameVi: "Nha Trang (Vịnh Ngọc)",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-10-nha-trang.jpg",
    thingsToDo:
      "Ponagar Cham Towers, Long Son Pagoda, Hon Mun Island Snorkeling, VinWonders, Bai Dai Beach.",
    thingsToDoVi:
      "Tháp Bà Ponagar, Chùa Long Sơn tượng Phật trắng, Lặn ngắm san hô Hòn Mun, VinWonders, Bãi Dài lướt sóng.",
    nextRoute: "Nha Trang → Quy Nhon",
    nextRouteVi: "Nha Trang → Quy Nhơn",
    transport: "Train / Bus",
    transportVi: "Tàu hỏa đường sắt ven biển / Xe khách",
    time: "4 - 5 hr",
    timeVi: "4 - 5 giờ",
    fare: "150,000 – 220,000 VND",
    fareVi: "150.000 – 220.000 VNĐ (~$6 - $9 USD)",
  },
  {
    num: 8,
    name: "Quy Nhon",
    nameVi: "Quy Nhơn (Bình Định)",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/20-best-things/15-quy-nhon.jpg",
    thingsToDo:
      "Eo Gio Cliff, Ky Co Beach, Twin Cham Towers (Thap Doi), Ghenh Rang Tien Sa, Queen Beach.",
    thingsToDoVi:
      "Eo Gió ngắm hoàng hôn, Bãi biển Kỳ Co trong vắt, Tháp Đôi Chămpa cổ kính, Ghềnh Ráng Tiên Sa.",
    nextRoute: "Quy Nhon → Da Nang",
    nextRouteVi: "Quy Nhơn → Đà Nẵng",
    transport: "Train (Reunification Express)",
    transportVi: "Tàu hỏa Thống Nhất Bắc - Nam",
    time: "5 - 6 hr",
    timeVi: "5 - 6 giờ",
    fare: "200,000 – 350,000 VND",
    fareVi: "200.000 – 350.000 VNĐ (~$8 - $14 USD)",
  },
  {
    num: 9,
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    days: "2-3 days",
    daysVi: "2-3 ngày",
    image: "/guide/15-best-places/place-4-da-nang.jpg",
    thingsToDo:
      "Golden Bridge at Ba Na Hills, My Khe Beach, Marble Mountains, Dragon Bridge Fire Show, Son Tra Peninsula.",
    thingsToDoVi:
      "Cầu Vàng Bà Nà Hills, Bãi biển Mỹ Khê, Danh thắng Ngũ Hành Sơn, Cầu Rồng phun lửa, Bán đảo Sơn Trà.",
    nextRoute: "Da Nang → Hoi An",
    nextRouteVi: "Đà Nẵng → Hội An",
    transport: "Taxi / Private Car / Bus",
    transportVi: "Taxi / Xe đưa đón riêng / Xe buýt",
    time: "45 min",
    timeVi: "45 phút",
    fare: "200,000 – 300,000 VND",
    fareVi: "200.000 – 300.000 VNĐ (~$8 - $12 USD)",
  },
  {
    num: 10,
    name: "Hoi An",
    nameVi: "Hội An (Di Sản Thế Giới)",
    days: "2-3 days",
    daysVi: "2-3 ngày",
    image: "/guide/15-best-places/place-2-hoi-an.jpg",
    thingsToDo:
      "Ancient Town Walking Tour, Japanese Covered Bridge, Lantern Boat Ride on Hoai River, An Bang Beach, Cam Thanh Coconut Village.",
    thingsToDoVi:
      "Dạo bộ Phố Cổ Hội An, Chùa Cầu, Thả hoa đăng sông Hoài, Biển An Bàng, Thuyền thúng Rừng dừa Bảy Mẫu.",
    nextRoute: "Hoi An → Hue",
    nextRouteVi: "Hội An → Huế",
    transport: "Train via Hai Van Pass / Bus",
    transportVi: "Tàu du lịch ngắm cảnh Đèo Hải Vân / Xe du lịch",
    time: "3 - 4 hr",
    timeVi: "3 - 4 giờ",
    fare: "120,000 – 200,000 VND",
    fareVi: "120.000 – 200.000 VNĐ (~$5 - $8 USD)",
  },
  {
    num: 11,
    name: "Hue",
    nameVi: "Cố Đô Huế",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-8-hue.jpg",
    thingsToDo:
      "Hue Imperial Citadel, Thien Mu Pagoda, Royal Tombs (Khai Dinh, Tu Duc), Perfume River Cruise, Dong Ba Market.",
    thingsToDoVi:
      "Đại Nội Huế, Chùa Thiên Mụ, Lăng Khải Định & Lăng Tự Đức, Du thuyền ca Huế sông Hương, Chợ Đông Ba.",
    nextRoute: "Hue → Quang Binh",
    nextRouteVi: "Huế → Quảng Bình (Phong Nha)",
    transport: "Train / Bus",
    transportVi: "Tàu hỏa / Xe khách chất lượng cao",
    time: "4 hr",
    timeVi: "4 giờ",
    fare: "150,000 – 250,000 VND",
    fareVi: "150.000 – 250.000 VNĐ (~$6 - $10 USD)",
  },
  {
    num: 12,
    name: "Quang Binh",
    nameVi: "Quảng Bình (Vương Quốc Hang Động)",
    days: "2-3 days",
    daysVi: "2-3 ngày",
    image: "/guide/20-best-things/12-quang-binh.jpg",
    thingsToDo:
      "Phong Nha Cave, Paradise Cave, Dark Cave Zipline & Mud Bath, Phong Nha-Ke Bang National Park.",
    thingsToDoVi:
      "Động Phong Nha ngồi thuyền, Động Thiên Đường tráng lệ, Zipline và tắm bùn Hang Tối, Vườn quốc gia Phong Nha.",
    nextRoute: "Quang Binh → Ninh Binh",
    nextRouteVi: "Quảng Bình → Ninh Bình",
    transport: "Overnight Sleeper Train",
    transportVi: "Tàu hỏa giường nằm đêm Thống Nhất",
    time: "7 - 8 hr",
    timeVi: "7 - 8 giờ",
    fare: "350,000 – 600,000 VND",
    fareVi: "350.000 – 600.000 VNĐ (~$14 - $24 USD)",
  },
  {
    num: 13,
    name: "Ninh Binh",
    nameVi: "Ninh Bình (Hạ Long Trên Cạn)",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-5-ninh-binh.jpg",
    thingsToDo:
      "Trang An Scenic Landscape Boat Tour, Hang Mua Peak Viewpoint, Tam Coc, Bai Dinh Pagoda, Hoa Lu Ancient Capital.",
    thingsToDoVi:
      "Chèo đò Quần thể Tràng An, Chinh phục đỉnh Hang Múa, Tam Cốc Bích Động mùa lúa, Chùa Bái Đính, Cố đô Hoa Lư.",
    nextRoute: "Ninh Binh → Cat Ba Island",
    nextRouteVi: "Ninh Bình → Đảo Cát Bà",
    transport: "Tourist Bus + Speed Ferry",
    transportVi: "Xe du lịch trọn gói + Phà cao tốc",
    time: "4 - 5 hr",
    timeVi: "4 - 5 giờ",
    fare: "300,000 – 400,000 VND",
    fareVi: "300.000 – 400.000 VNĐ (~$12 - $16 USD)",
  },
  {
    num: 14,
    name: "Cat Ba Island",
    nameVi: "Đảo Cát Bà (Hải Phòng)",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/20-best-things/14-cat-ba.jpg",
    thingsToDo:
      "Lan Ha Bay Boat Cruise & Kayaking, Cat Ba National Park Trekking, Cannon Fort, Hospital Cave, Monkey Island.",
    thingsToDoVi:
      "Du thuyền Vịnh Lan Hạ chèo kayak, Trekking Rừng Quốc Gia Cát Bà, Pháo đài Thần công, Hang Quân Y.",
    nextRoute: "Cat Ba Island → Ha Long Bay",
    nextRouteVi: "Cát Bà → Vịnh Hạ Long",
    transport: "Ferry / Speedboat",
    transportVi: "Phà biển Tuần Châu / Tàu cao tốc",
    time: "1 hr",
    timeVi: "1 giờ",
    fare: "150,000 – 250,000 VND",
    fareVi: "150.000 – 250.000 VNĐ (~$6 - $10 USD)",
  },
  {
    num: 15,
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long (Kỳ Quan Thiên Nhiên)",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-6-ha-long.jpg",
    thingsToDo:
      "Overnight Luxury Cruise, Sung Sot Cave, Ti Top Island Beach & Viewpoint, Kayaking in Luon Cave, Floating Fishing Villages.",
    thingsToDoVi:
      "Du thuyền nghỉ đêm trên Vịnh, Hang Sửng Sốt, Ngắm toàn cảnh đỉnh Ti Tốp, Chèo thuyền Hang Luồn, Làng chài nổi Cửa Vạn.",
    nextRoute: "Ha Long Bay → Hanoi",
    nextRouteVi: "Vịnh Hạ Long → Hà Nội",
    transport: "Expressway Limousine Van",
    transportVi: "Xe Limousine cao tốc Hạ Long - Hà Nội",
    time: "2.5 hr",
    timeVi: "2.5 giờ",
    fare: "200,000 – 300,000 VND",
    fareVi: "200.000 – 300.000 VNĐ (~$8 - $12 USD)",
  },
  {
    num: 16,
    name: "Hanoi",
    nameVi: "Thủ Đô Hà Nội (Nghìn Năm Văn Hiến)",
    days: "2-3 days",
    daysVi: "2-3 ngày",
    image: "/guide/15-best-places/place-3-hanoi.jpg",
    thingsToDo:
      "Hanoi Old Quarter 36 Guild Streets, Hoan Kiem Lake & Ngoc Son Temple, Temple of Literature, Train Street, Hanoi Street Food Tour.",
    thingsToDoVi:
      "36 Phố Phường Phố Cổ, Hồ Hoàn Kiếm & Đền Ngọc Sơn, Văn Miếu Quốc Tử Giám, Phố đường tàu, Thưởng thức ẩm thực Phở & Bún Chả.",
    nextRoute: "Hanoi → Sapa",
    nextRouteVi: "Hà Nội → Sa Pa",
    transport: "Sleeper Bus / Luxury Cabin Bus or Chapa Train to Lao Cai",
    transportVi: "Xe Cabin Cung Điện / Tàu hỏa du lịch Hà Nội - Lào Cai",
    time: "5.5 - 6 hr",
    timeVi: "5.5 - 6 giờ",
    fare: "300,000 – 450,000 VND",
    fareVi: "300.000 – 450.000 VNĐ (~$12 - $18 USD)",
  },
  {
    num: 17,
    name: "Sapa",
    nameVi: "Sa Pa (Thị Xã Trong Mây)",
    days: "2-3 days",
    daysVi: "2-3 ngày",
    image: "/guide/15-best-places/place-7-sapa.jpg",
    thingsToDo:
      "Fansipan Legend Cable Car to Indochina Peak, Cat Cat Village, Muong Hoa Valley Terraced Fields, Silver Waterfall, Ta Van Trekking.",
    thingsToDoVi:
      "Chinh phục Đỉnh Fansipan 3.143m (Nóc nhà Đông Dương), Bản Cát Cát, Thung lũng Mường Hoa ruộng bậc thang, Thác Bạc, Trekking Tả Van.",
    nextRoute: "Sapa → Hanoi Airport (HAN)",
    nextRouteVi: "Sa Pa → Sân bay Nội Bài (HAN)",
    transport: "Expressway Limousine directly to Noi Bai International Airport",
    transportVi: "Xe Limousine cao tốc chạy thẳng về Sân bay Quốc tế Nội Bài",
    time: "5 hr",
    timeVi: "5 giờ",
    fare: "350,000 – 450,000 VND",
    fareVi: "350.000 – 450.000 VNĐ (~$14 - $18 USD)",
  },
];

export default function OneMonthInVietnamPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setLang(getLang());
    const handleStorage = () => setLang(getLang());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isVi = lang === "vi";

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="omi-page">
      {/* ─── STANDARDIZED NAVBAR ─── */}
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
              onMouseEnter={() => setActiveMegaMenu("things")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "things" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "eat" ? "is-active" : ""}`}
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
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* ─── HOVER MEGAMENU CONTAINER ─── */}
        {activeMegaMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="vnn-megamenu__grid">
              {MEGA_MENUS_DATA[activeMegaMenu]?.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="vnn-megamenu__card"
                  onClick={() => setActiveMegaMenu(null)}
                >
                  <div className="vnn-megamenu__img-wrap">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="vnn-megamenu__img"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="vnn-megamenu__badge">{item.badge}</span>
                    )}
                  </div>
                  <h4 className="vnn-megamenu__title">
                    {isVi && item.titleVi ? item.titleVi : item.title}
                  </h4>
                  <span className="vnn-megamenu__date">
                    {isVi && item.dateVi ? item.dateVi : item.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION (SCREENSHOT 1) ─── */}
      <section className="omi-hero">
        <img
          src="/guide/megamenu/itin-4-1month.jpg"
          alt="1 Month in Vietnam - Golden Bridge Ba Na Hills"
          className="omi-hero__bg"
        />
        <div className="omi-hero__overlay" />

        <div className="omi-hero__content">
          <div className="omi-hero__badges">
            <span className="omi-hero__badge">
              {isVi ? "LỊCH TRÌNH" : "ITINERARY"}
            </span>
            <span className="omi-hero__badge">
              {isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="omi-hero__title">
            {isVi
              ? "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam"
              : "1 Month in Vietnam"}
          </h1>

          <div className="omi-hero__byline">
            {isVi
              ? "Biên tập bởi VinaTap Editorial • 14 Tháng 10, 2026"
              : "By Welcome to Vietnam • May 18, 2024"}
          </div>
        </div>
      </section>

      {/* ─── CTA PILL BUTTON (SCREENSHOT 1 & 2) ─── */}
      <div className="omi-cta-bar">
        <button
          type="button"
          className="omi-cta-pill"
          onClick={() => setAiCompanionOpen(true)}
        >
          <Sparkles size={16} />
          <span>
            {isVi
              ? "Tạo chuyến đi Việt Nam trong vài giây với AI"
              : "Create your Vietnam trip in seconds"}
          </span>
        </button>
      </div>

      {/* ─── MAIN ARTICLE BODY ─── */}
      <main className="omi-container">
        {/* ─── SECTION 1: MAP (SCREENSHOT 2 & 3) ─── */}
        <h2 className="omi-section-title">
          {isVi
            ? "Bản đồ lịch trình 1 tháng xuyên Việt"
            : "1-month Vietnam itinerary map"}
        </h2>

        <p className="omi-intro-text">
          {isVi
            ? "Lịch trình gợi ý 1 tháng của chúng tôi bao gồm 17 điểm đến nổi tiếng và đẹp nhất Việt Nam, trải dài từ Nam ra Bắc: TP. Hồ Chí Minh, Phú Quốc, Hà Tiên, Cần Thơ, Mũi Né, Đà Lạt, Nha Trang, Quy Nhơn, Đà Nẵng, Hội An, Huế, Quảng Bình, Ninh Bình, Đảo Cát Bà, Vịnh Hạ Long, Hà Nội và Sa Pa."
            : "Our recommended 1-month itinerary covers 17 of Vietnam's most popular destinations, including Ho Chi Minh City, Phu Quoc, Ha Tien, Can Tho, Mui Ne, Dalat, Nha Trang, Quy Nhon, Da Nang, Hoi An, Hue, Quang Binh, Ninh Binh, Cat Ba Island, Ha Long Bay, Hanoi, and Sapa."}
        </p>

        <div className="omi-map-wrap">
          <img
            src="/guide/vietnam/travel-routes-map.jpg"
            alt="1-month Vietnam itinerary map with 17 destinations"
            className="omi-map-img"
            onClick={() => setIsMapModalOpen(true)}
            title={isVi ? "Nhấp để xem phóng to độ nét cao" : "Click to view full size"}
          />
          <div className="omi-map-hint">
            <Maximize2 size={13} />
            <span>
              {isVi
                ? "Nhấp vào bản đồ để phóng to chi tiết độ phân giải cao"
                : "Click map to expand high-resolution view"}
            </span>
          </div>
        </div>

        {/* ─── SECTION 2: WANT TO MAKE IT YOUR OWN? (SCREENSHOT 3 & 4) ─── */}
        <div className="omi-custom-box">
          <h3>
            {isVi ? "Bạn muốn tùy chỉnh lịch trình theo ý mình?" : "Want to make it your own?"}
          </h3>
          <p>
            {isVi
              ? 'Mở Trợ lý Du lịch Ảo VinaTap AI và nhập một câu lệnh như: "Tạo lịch trình 1 tháng du lịch Việt Nam theo phong cách của tôi". Trợ lý AI sẽ tự động phân tích tuyến đường, tối ưu phương tiện di chuyển và cá nhân hóa lịch trình theo sở thích.'
              : 'Open Tripion.ai and enter a prompt such as "Create a 1-month Vietnam itinerary." Tripion will build a personalized multi-city journey, help you optimize routes and transportation, and tailor the trip to your travel style.'}
          </p>
          <p>
            {isVi
              ? "Khi bạn hài lòng với hành trình, dễ dàng tải về bản đồ du lịch cùng lịch trình chi tiết dưới dạng tệp PDF hoàn chỉnh."
              : "When you're happy with your itinerary, simply download your personalized travel map and detailed itinerary as a PDF."}
          </p>

          <button
            type="button"
            className="omi-custom-btn"
            onClick={handleDownloadPDF}
          >
            <Download size={16} />
            <span>
              {isVi
                ? "Tùy chỉnh & Tải về bản PDF"
                : "Customize & Download PDF"}
            </span>
          </button>
        </div>

        {/* ─── SECTION 3: SUMMARY (SCREENSHOT 4) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Tổng quan hành trình" : "Summary"}
        </h2>

        <div className="omi-summary-card">
          <div className="omi-summary-list">
            <div className="omi-summary-item">
              <strong>{isVi ? "Số điểm đến: " : "Destinations: "}</strong>17
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng thời gian di chuyển (giờ): " : "Travel time (hr): "}
              </strong>
              75+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Chi phí phương tiện (USD): " : "Transportation costs (USD): "}
              </strong>
              250+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng chi phí ước tính (USD): " : "Total cost (USD): "}
              </strong>
              1,000+
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: ITINERARY DETAILS (SCREENSHOT 5) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Chi tiết lịch trình 17 điểm đến" : "Itinerary details"}
        </h2>

        <div className="omi-cards-grid">
          {ITINERARY_17_DESTINATIONS.map((dest) => (
            <article key={dest.num} className="omi-card">
              <div className="omi-card__img-wrap">
                <img
                  src={dest.image}
                  alt={isVi ? dest.nameVi : dest.name}
                  className="omi-card__img"
                  loading="lazy"
                />
              </div>

              <div className="omi-card__body">
                <h3 className="omi-card__title">
                  {dest.num}. {isVi ? dest.nameVi : dest.name}
                </h3>
                <div className="omi-card__days">
                  ({isVi ? dest.daysVi : dest.days})
                </div>

                <div className="omi-card__section">
                  <span className="omi-card__label">
                    {isVi ? "Điểm tham quan & Trải nghiệm: " : "Things to do: "}
                  </span>
                  <span>{isVi ? dest.thingsToDoVi : dest.thingsToDo}</span>
                </div>

                <div className="omi-card__transit-title">
                  <ArrowRight size={14} color="#00a8b5" />
                  <span>{isVi ? dest.nextRouteVi : dest.nextRoute}:</span>
                </div>

                <ul className="omi-card__transit-list">
                  <li>
                    <strong>{isVi ? "Phương tiện: " : "Transportation: "}</strong>
                    {isVi ? dest.transportVi : dest.transport}
                  </li>
                  <li>
                    <strong>{isVi ? "Thời gian: " : "Travel time: "}</strong>
                    {isVi ? dest.timeVi : dest.time}
                  </li>
                  <li>
                    <strong>{isVi ? "Giá vé: " : "Fare: "}</strong>
                    {isVi ? dest.fareVi : dest.fare}
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ─── LIGHTBOX MODAL BẢN ĐỒ ─── */}
      {isMapModalOpen && (
        <div
          className="vnn-lightbox-overlay"
          onClick={() => setIsMapModalOpen(false)}
        >
          <div
            className="vnn-lightbox-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "880px" }}
          >
            <button
              type="button"
              className="vnn-lightbox-close"
              onClick={() => setIsMapModalOpen(false)}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <img
              src="/guide/vietnam/travel-routes-map.jpg"
              alt="Bản đồ hành trình 1 tháng xuyên Việt 17 điểm đến"
              className="vnn-lightbox-img"
            />
            <p className="vnn-lightbox-caption">
              {isVi
                ? "Bản đồ hành trình 1 tháng trọn vẹn khám phá 17 điểm đến nổi tiếng nhất Việt Nam"
                : "1-Month Vietnam Itinerary Map: 17 Signature Destinations from South to North"}
            </p>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="vnn-toast" role="status">
          <Check size={18} color="#00c2cb" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── PUBLIC FOOTER ─── */}
      <PublicFooter lang={lang} />

      {/* ─── AI TRAVEL COMPANION FLOATING CHATBOT ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        province={{
          name: isVi ? "Việt Nam" : "Vietnam",
          slug: "viet-nam",
        }}
      />
    </div>
  );
}
