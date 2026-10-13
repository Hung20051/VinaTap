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

// ─── 17 DESTINATIONS DATA (SCREENSHOTS 1, 2, 3, 4, 5) ───
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
    transportVi: "Máy bay (Vietnam Airlines, Vietjet Air, Pacific Airlines, Bamboo Airways)",
    time: "1 hr 5 min",
    timeVi: "1 giờ 5 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ",
    isFlight: true,
  },
  {
    num: 2,
    name: "Phu Quoc",
    nameVi: "Phú Quốc",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-11-phu-quoc.jpg",
    thingsToDo:
      "Long Beach, Star Beach, Hon Thom, Phu Quoc Prison, Phu Quoc Night Market, Vinpearl Safari.",
    thingsToDoVi:
      "Bãi Dài, Bãi Sao, Cáp treo Hòn Thơm, Nhà tù Phú Quốc, Chợ đêm Phú Quốc, Vinpearl Safari.",
    nextRoute: "Phu Quoc → Ha Tien",
    nextRouteVi: "Phú Quốc → Hà Tiên",
    transport: "Ferry (Superdong)",
    transportVi: "Tàu cao tốc (Superdong)",
    time: "1 hr 15 min",
    timeVi: "1 giờ 15 phút",
    fare: "185,000 VND",
    fareVi: "185.000 VNĐ",
  },
  {
    num: 3,
    name: "Ha Tien",
    nameVi: "Hà Tiên",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/20-best-things/4-mekong-delta.jpg",
    thingsToDo:
      "Phu Dung Pagoda, Da Dung Mountain, Mac Family Temple, Ha Tien Night Market.",
    thingsToDoVi:
      "Chùa Phù Dung, Núi Đá Dựng, Đền thờ họ Mạc, Chợ đêm Hà Tiên.",
    nextRoute: "Ha Tien → Can Tho",
    nextRouteVi: "Hà Tiên → Cần Thơ",
    transport: "Bus (Tan Nien)",
    transportVi: "Xe khách (Tân Niên)",
    time: "5 hr",
    timeVi: "5 giờ",
    fare: "130,000 VND",
    fareVi: "130.000 VNĐ",
  },
  {
    num: 4,
    name: "Can Tho",
    nameVi: "Cần Thơ",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/15-best-places/place-13-can-tho.jpg",
    thingsToDo:
      "Cai Rang Floating Market, Ong Temple, Binh Thuy Ancient House, Muoi Cuong Cocoa Farm.",
    thingsToDoVi:
      "Chợ nổi Cái Răng, Chùa Ông, Nhà cổ Bình Thủy, Vườn cacao Mười Cương.",
    nextRoute: "Can Tho → Mui Ne",
    nextRouteVi: "Cần Thơ → Mũi Né",
    transport: "Bus (Lien Hung)",
    transportVi: "Xe khách (Liên Hưng)",
    time: "10 hr 30 min",
    timeVi: "10 giờ 30 phút",
    fare: "400,000 VND",
    fareVi: "400.000 VNĐ",
  },
  {
    num: 5,
    name: "Mui Ne",
    nameVi: "Mũi Né",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/15-best-places/place-12-mui-ne.jpg",
    thingsToDo:
      "Mui Ne Beach, Ta Cu Mountain, Sand Dunes, Po Shanu Cham Towers.",
    thingsToDoVi:
      "Bãi biển Mũi Né, Núi Tà Cú, Đồi cát bay, Tháp Chàm Po Shanu.",
    nextRoute: "Mui Ne → Dalat",
    nextRouteVi: "Mũi Né → Đà Lạt",
    transport: "Bus (An Phu Bus)",
    transportVi: "Xe khách (An Phú Bus)",
    time: "3 h 45 min",
    timeVi: "3 giờ 45 phút",
    fare: "150,000 VND",
    fareVi: "150.000 VNĐ",
  },
  {
    num: 6,
    name: "Dalat",
    nameVi: "Đà Lạt",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-9-da-lat.jpg",
    thingsToDo:
      "Xuan Huong Lake, Dalat Railway Station, Chicken Church, Linh Phuoc Pagoda, Dalat Night Market.",
    thingsToDoVi:
      "Hồ Xuân Hương, Ga Đà Lạt, Nhà thờ Con Gà, Chùa Linh Phước, Chợ đêm Đà Lạt.",
    nextRoute: "Dalat → Nha Trang",
    nextRouteVi: "Đà Lạt → Nha Trang",
    transport: "Bus (Phuong Trang, The Sinh Bus)",
    transportVi: "Xe khách (Phương Trang, The Sinh Bus)",
    time: "3 hr",
    timeVi: "3 giờ",
    fare: "250,000 VND",
    fareVi: "250.000 VNĐ",
  },
  {
    num: 7,
    name: "Nha Trang",
    nameVi: "Nha Trang",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-10-nha-trang.jpg",
    thingsToDo:
      "Nha Trang Beach, Vinpearl Land, Po Nagar Cham Towers, Dam Market.",
    thingsToDoVi:
      "Bãi biển Nha Trang, Vinpearl Land, Tháp Bà Po Nagar, Chợ Đầm.",
    nextRoute: "Nha Trang → Quy Nhon",
    nextRouteVi: "Nha Trang → Quy Nhơn",
    transport: "Bus (Thanh Thuy)",
    transportVi: "Xe khách (Thanh Thủy)",
    time: "5 hr",
    timeVi: "5 giờ",
    fare: "200,000 VND",
    fareVi: "200.000 VNĐ",
  },
  {
    num: 8,
    name: "Quy Nhon",
    nameVi: "Quy Nhơn",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/20-best-things/15-quy-nhon.jpg",
    thingsToDo:
      "Ky Co, Eo Gio, Twin Towers, Queen's Beach.",
    thingsToDoVi:
      "Kỳ Co, Eo Gió, Tháp Đôi, Bãi tắm Hoàng Hậu.",
    nextRoute: "Quy Nhon → Da Nang",
    nextRouteVi: "Quy Nhơn → Đà Nẵng",
    transport: "Bus (Phuong Trang, Lien Hung)",
    transportVi: "Xe khách (Phương Trang, Liên Hưng)",
    time: "6 hr 30 min",
    timeVi: "6 giờ 30 phút",
    fare: "250,000 VND",
    fareVi: "250.000 VNĐ",
  },
  {
    num: 9,
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-4-da-nang.jpg",
    thingsToDo:
      "My Khe Beach, Ba Na Hills, Marble Mountains, Museum of Cham Sculpture.",
    thingsToDoVi:
      "Bãi biển Mỹ Khê, Bà Nà Hills, Ngũ Hành Sơn, Bảo tàng Điêu khắc Chăm.",
    nextRoute: "Da Nang → Hoi An",
    nextRouteVi: "Đà Nẵng → Hội An",
    transport: "Bus (01)",
    transportVi: "Xe buýt (tuyến 01)",
    time: "45 min",
    timeVi: "45 phút",
    fare: "30,000 VND",
    fareVi: "30.000 VNĐ",
  },
  {
    num: 10,
    name: "Hoi An",
    nameVi: "Hội An",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/15-best-places/place-2-hoi-an.jpg",
    thingsToDo:
      "Hoi An Ancient Town, An Bang Beach, Bay Mau Coconut Forest.",
    thingsToDoVi:
      "Phố cổ Hội An, Biển An Bàng, Rừng dừa Bảy Mẫu.",
    nextRoute: "Hoi An → Hue",
    nextRouteVi: "Hội An → Huế",
    transport: "Bus (Hanh Cafe, The Sinh Bus)",
    transportVi: "Xe khách (Hạnh Cafe, The Sinh Bus)",
    time: "3 hr 45 min",
    timeVi: "3 giờ 45 phút",
    fare: "180,000 VND",
    fareVi: "180.000 VNĐ",
  },
  {
    num: 11,
    name: "Hue",
    nameVi: "Huế",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/15-best-places/place-8-hue.jpg",
    thingsToDo:
      "The Imperial Citadel of Hue, Thien Mu Pagoda, Khai Dinh Tomb, Tu Duc Tomb, Dong Ba Market.",
    thingsToDoVi:
      "Đại Nội Huế, Chùa Thiên Mụ, Lăng Khải Định, Lăng Tự Đức, Chợ Đông Ba.",
    nextRoute: "Hue → Quang Binh",
    nextRouteVi: "Huế → Quảng Bình",
    transport: "Bus (Camel Travel)",
    transportVi: "Xe khách (Camel Travel)",
    time: "4 hr",
    timeVi: "4 giờ",
    fare: "400,000 VND",
    fareVi: "400.000 VNĐ",
  },
  {
    num: 12,
    name: "Quang Binh",
    nameVi: "Quảng Bình",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/20-best-things/12-quang-binh.jpg",
    thingsToDo:
      "Phong Nha – Ke Bang National Park, Paradise Cave, Nhat Le Beach.",
    thingsToDoVi:
      "Vườn quốc gia Phong Nha – Kẻ Bàng, Động Thiên Đường, Biển Nhật Lệ.",
    nextRoute: "Quang Binh → Ninh Binh",
    nextRouteVi: "Quảng Bình → Ninh Bình",
    transport: "Train (Dong Hoi – Ninh Binh)",
    transportVi: "Tàu hỏa (Đồng Hới – Ninh Bình)",
    time: "8 hr",
    timeVi: "8 giờ",
    fare: "300,000 VND",
    fareVi: "300.000 VNĐ",
  },
  {
    num: 13,
    name: "Ninh Binh",
    nameVi: "Ninh Bình",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-5-ninh-binh.jpg",
    thingsToDo:
      "Tam Coc – Bich Dong, Mua Cave, Trang An Landscape Complex, Bai Dinh Pagoda.",
    thingsToDoVi:
      "Tam Cốc – Bích Động, Hang Múa, Quần thể danh thắng Tràng An, Chùa Bái Đính.",
    nextRoute: "Ninh Binh → Cat Ba Island",
    nextRouteVi: "Ninh Bình → Đảo Cát Bà",
    transport: "Bus (Cat Ba Express)",
    transportVi: "Xe khách (Cát Bà Express)",
    time: "5 hr",
    timeVi: "5 giờ",
    fare: "280,000 VND",
    fareVi: "280.000 VNĐ",
  },
  {
    num: 14,
    name: "Cat Ba Island",
    nameVi: "Đảo Cát Bà",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/20-best-things/14-cat-ba.jpg",
    thingsToDo:
      "Lan Ha Bay, Monkey Island, Cat Ba National Park.",
    thingsToDoVi:
      "Vịnh Lan Hạ, Đảo Khỉ, Vườn quốc gia Cát Bà.",
    nextRoute: "Cat Ba Island → Ha Long Bay",
    nextRouteVi: "Đảo Cát Bà → Vịnh Hạ Long",
    transport: "Ferry (Cat Ba – Tuan Chau)",
    transportVi: "Phà biển (Cát Bà – Tuần Châu)",
    time: "45 min",
    timeVi: "45 phút",
    fare: "80,000 VND",
    fareVi: "80.000 VNĐ",
  },
  {
    num: 15,
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-6-ha-long.jpg",
    thingsToDo:
      "Ha Long Bay, Tuan Chau Island, Bai Chay Beach.",
    thingsToDoVi:
      "Vịnh Hạ Long, Đảo Tuần Châu, Bãi Cháy.",
    nextRoute: "Ha Long Bay → Hanoi",
    nextRouteVi: "Vịnh Hạ Long → Hà Nội",
    transport: "Bus (Trung Thanh Limousine)",
    transportVi: "Xe Limousine (Trung Thành Limousine)",
    time: "1 hr 30 min",
    timeVi: "1 giờ 30 phút",
    fare: "260,000 VND",
    fareVi: "260.000 VNĐ",
  },
  {
    num: 16,
    name: "Hanoi",
    nameVi: "Hà Nội",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-3-hanoi.jpg",
    thingsToDo:
      "Hoan Kiem Lake, Hanoi Old Quarter, Temple of Literature, Dong Xuan Market, Ho Chi Minh Mausoleum.",
    thingsToDoVi:
      "Hồ Hoàn Kiếm, Phố cổ Hà Nội, Văn Miếu – Quốc Tử Giám, Chợ Đồng Xuân, Lăng Chủ tịch Hồ Chí Minh.",
    nextRoute: "Hanoi → Sapa",
    nextRouteVi: "Hà Nội → Sa Pa",
    transport: "Bus (Fansipan Express Bus)",
    transportVi: "Xe khách (Fansipan Express Bus)",
    time: "6 hr 10 min",
    timeVi: "6 giờ 10 phút",
    fare: "250,000 VND",
    fareVi: "250.000 VNĐ",
  },
  {
    num: 17,
    name: "Sapa",
    nameVi: "Sa Pa",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-7-sapa.jpg",
    thingsToDo:
      "Sapa Stone Church, Ham Rong Mountain, Cat Cat Village, Ta Van Village.",
    thingsToDoVi:
      "Nhà thờ Đá Sa Pa, Núi Hàm Rồng, Bản Cát Cát, Bản Tả Van.",
    nextRoute: "Sapa → Hanoi",
    nextRouteVi: "Sa Pa → Hà Nội",
    directTransit: "Bus (Fansipan Express Bus)",
    directTransitVi: "Xe khách (Fansipan Express Bus)",
    isDirectTransitLine: true,
    airportNote:
      "You take bus number 86 (35,000 VND) to Noi Bai International Airport from Hanoi city center, ending your 1-month itinerary in Vietnam.",
    airportNoteVi:
      "Bạn bắt xe buýt số 86 (35.000 VNĐ) từ trung tâm Hà Nội đến Sân bay Quốc tế Nội Bài, kết thúc chuyến hành trình 1 tháng tại Việt Nam.",
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

        {/* ─── SECTION 4: ITINERARY DETAILS (SCREENSHOTS 1 TO 5) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Chi tiết lịch trình" : "Itinerary details"}
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
                  {isVi && dest.nameVi ? dest.nameVi : dest.name}
                </h3>
                <div className="omi-card__days">
                  ({isVi && dest.daysVi ? dest.daysVi : dest.days})
                </div>

                <div className="omi-card__section">
                  <span className="omi-card__label">
                    {isVi ? "Things to do: " : "Things to do: "}
                  </span>
                  <span>{isVi && dest.thingsToDoVi ? dest.thingsToDoVi : dest.thingsToDo}</span>
                </div>

                {dest.isDirectTransitLine ? (
                  <>
                    <div className="omi-card__direct-transit">
                      <strong>{isVi ? dest.nextRouteVi : dest.nextRoute}:</strong>{" "}
                      {isVi && dest.directTransitVi ? dest.directTransitVi : dest.directTransit}
                    </div>
                    {dest.airportNote && (
                      <p className="omi-card__airport-note">
                        {isVi && dest.airportNoteVi ? dest.airportNoteVi : dest.airportNote}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="omi-card__transit-title">
                      <strong>{isVi ? dest.nextRouteVi : dest.nextRoute}:</strong>
                    </div>

                    <ul className="omi-card__transit-list">
                      <li>
                        <strong>{isVi ? "Transportation: " : "Transportation: "}</strong>
                        {isVi && dest.transportVi ? dest.transportVi : dest.transport}
                      </li>
                      <li>
                        <strong>
                          {dest.isFlight
                            ? (isVi ? "Flying time: " : "Flying time: ")
                            : (isVi ? "Travel time: " : "Travel time: ")}
                        </strong>
                        {isVi && dest.timeVi ? dest.timeVi : dest.time}
                      </li>
                      <li>
                        <strong>
                          {dest.isFlight
                            ? (isVi ? "Airfare: " : "Airfare: ")
                            : (isVi ? "Fare: " : "Fare: ")}
                        </strong>
                        {isVi && dest.fareVi ? dest.fareVi : dest.fare}
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ─── A FEW NOTES (SCREENSHOT 5) ─── */}
        <section className="omi-notes-box">
          <h2 className="omi-section-title">
            {isVi ? "Một số lưu ý quan trọng" : "A few notes"}
          </h2>
          <ul className="omi-notes-list">
            <li>
              {isVi
                ? "Tỷ giá hối đoái USD sang VNĐ dao động quanh mức 1 USD ≈ 25.000 VNĐ."
                : "The USD to VND exchange rate in 2024 is around 1 USD ≈ 25,000 VND."}
            </li>
            <li>
              {isVi ? (
                <>
                  Đối với việc đi tàu hỏa, chúng tôi khuyên bạn nên đặt vé trên trang web chính thức của Tổng công ty Đường sắt Việt Nam:{" "}
                  <a href="https://dsvn.vn" target="_blank" rel="noopener noreferrer">
                    dsvn.vn
                  </a>
                  .
                </>
              ) : (
                <>
                  For train travel, we recommend booking tickets on the official website of the Vietnam Railway Corporation:{" "}
                  <a href="https://dsvn.vn" target="_blank" rel="noopener noreferrer">
                    dsvn.vn
                  </a>
                  .
                </>
              )}
            </li>
            <li>
              {isVi
                ? "Các khuyến nghị trên về tour, khách sạn, nhà xe và hãng hàng không được chọn lọc dựa trên sự thuận tiện, chất lượng dịch vụ, hoàn toàn không có quảng cáo hay tiếp thị liên kết, giúp bạn hoàn toàn an tâm khi tham khảo."
                : "The above recommendations for tours, hotels, bus operators, and airlines were selected based on suitability, without any advertising or affiliate marketing, so you can rest assured of these suggestions."}
            </li>
          </ul>
        </section>

        {/* ─── 1 MONTH IN VIETNAM COSTS (IMAGE 1) ─── */}
        <section className="omi-costs-box">
          <h2 className="omi-section-title">
            {isVi ? "Chi phí du lịch Việt Nam 1 tháng" : "1 month in Vietnam costs"}
          </h2>
          <p className="omi-costs-intro" style={{ textAlign: "left", marginBottom: "16px" }}>
            {isVi
              ? "Nếu bạn đang lên kế hoạch cho chuyến du lịch 1 tháng tại Việt Nam, việc chuẩn bị ngân sách dự kiến là rất cần thiết. Trung bình, nhiều du khách chi tiêu khoảng 1.000 USD cho chuyến đi của mình. Dưới đây là bảng phân bổ chi phí cố định ước tính giúp bạn lên kế hoạch:"
              : "If you're planning a 1-month trip to Vietnam, it's helpful to have an estimated budget in mind. On average, many tourists spend around $1,000 on their trip. Here's a breakdown of estimated fixed costs to help you plan:"}
          </p>

          <ul className="omi-notes-list" style={{ marginTop: "12px" }}>
            <li>
              {isVi
                ? "Chi phí phương tiện di chuyển ước tính khoảng 250 USD."
                : "Transportation costs are approximately $250."}
            </li>
            <li>
              {isVi
                ? "Chi phí lưu trú tại khách sạn riêng hoặc homestay dao động khoảng 15 đến 20 USD mỗi đêm. Đối với du khách đi một mình, phòng ký túc xá (hostel) là lựa chọn tiết kiệm hơn với mức giá từ khoảng 5 USD mỗi đêm."
                : "Accommodation in a private hotel or homestay will cost around $15 to $20 per night. For solo travelers, hostels can be a more affordable option, with prices starting at around $5 per night."}
            </li>
            <li>
              {isVi
                ? "Chi phí ăn uống thông thường khoảng 15 USD mỗi người mỗi ngày."
                : "Food costs are typically around $15 per person per day."}
            </li>
            <li>
              {isVi
                ? "Vé vào cổng các di tích lịch sử, bảo tàng và danh lam thắng cảnh dao động khoảng 1 – 5 USD."
                : "Admission to monuments, museums, and attractions costs around $1 – $5."}
            </li>
          </ul>
        </section>

        {/* ─── OTHER ITINERARIES (IMAGE 1) ─── */}
        <section className="omi-other-itin-section">
          <h2 className="omi-section-title">
            {isVi ? "Các lịch trình khác" : "Other itineraries"}
          </h2>
          <div className="omi-other-itin-grid">
            <Link
              href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/10-day-vietnam-itinerary-map.jpg"
                  alt="10-day Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 10 ngày tại Việt Nam" : "10-day Vietnam Itinerary"}
              </span>
            </Link>

            <Link
              href="/guide/2-weeks-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/2-week-vietnam-itinerary-map.jpg"
                  alt="2-week Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 2 tuần tại Việt Nam" : "2-week Vietnam Itinerary"}
              </span>
            </Link>

            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/3-week-vietnam-itinerary-map.jpg"
                  alt="3-week Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 3 tuần tại Việt Nam" : "3-week Vietnam Itinerary"}
              </span>
            </Link>
          </div>
        </section>

        {/* ─── HORIZONTAL DIVIDER (IMAGE 2) ─── */}
        <hr className="omi-divider" />

        {/* ─── RELATED ARTICLES (IMAGE 2) ─── */}
        <section className="omi-related-section">
          <h2 className="omi-related-title">
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="omi-related-grid">
            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/hcmc/3-week-vietnam-itinerary.jpg"
                  alt="3-week Vietnam Itinerary"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi ? "Lịch trình 3 tuần xuyên Việt hoàn hảo" : "3-week Vietnam Itinerary"}
              </h3>
            </Link>

            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/hcmc/hcmc-10-things-bitexco.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi
                  ? "10 trải nghiệm tuyệt nhất ở TP. Hồ Chí Minh"
                  : "10 best things to do in Ho Chi Minh City"}
              </h3>
            </Link>

            <Link
              href="/guide/8-best-things-to-do-in-nha-trang"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/nha-trang/Top-8-things-to-do-in-Nha-Trang-Vietnamnomad.jpg"
                  alt="8 best things to do in Nha Trang"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi
                  ? "8 trải nghiệm hấp dẫn nhất tại Nha Trang"
                  : "8 best things to do in Nha Trang"}
              </h3>
            </Link>
          </div>
        </section>
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
