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
  Maximize2,
  X,
  Download,
  Check,
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
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt cân bằng",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-3",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
      {
        id: "itin-4",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam 2026",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
    ],
  },
};

// ─── 8 DESTINATIONS DATA (2 WEEKS IN VIETNAM) ───
const ITINERARY_8_DESTINATIONS = [
  {
    num: 1,
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/hcmc/hcmc-10-things-bitexco.jpg",
    subNote: "From Tan Son Nhat International Airport, you can take bus 109 to get to the center (District 1).",
    subNoteVi: "Từ Sân bay Quốc tế Tân Sơn Nhất, bạn có thể bắt tuyến xe buýt 109 để vào trung tâm Quận 1.",
    thingsToDo:
      "War Remnants Museum, Ben Thanh Market, Saigon Skydeck, Bui Vien Street, Cu Chi Tunnels.",
    thingsToDoVi:
      "Bảo tàng Chứng tích Chiến tranh, Chợ Bến Thành, Saigon Skydeck (Bitexco), Phố Tây Bùi Viện, Địa đạo Củ Chi.",
    nextRoute: "Ho Chi Minh City → Dalat",
    nextRouteVi: "TP. Hồ Chí Minh → Đà Lạt",
    transport: "Bus (Thanh Buoi, Phuong Trang)",
    transportVi: "Xe khách (Thành Bưởi, Phương Trang)",
    time: "7 hr",
    timeVi: "7 giờ",
    fare: "290,000 VND",
    fareVi: "290.000 VNĐ",
  },
  {
    num: 2,
    name: "Dalat",
    nameVi: "Đà Lạt",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/dalat/dalat-how-to-get-hd.jpg",
    subNote: "All buses offer free shuttle service to your hotel.",
    subNoteVi: "Các nhà xe đều có xe trung chuyển miễn phí đưa đón về tận khách sạn của bạn.",
    thingsToDo:
      "Xuan Huong Lake area, Dalat Railway Station, Chicken Church, Linh Phuoc Pagoda.",
    thingsToDoVi:
      "Khu vực Hồ Xuân Hương, Ga Đà Lạt cổ, Nhà thờ Con Gà, Chùa Linh Phước.",
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
    num: 3,
    name: "Nha Trang",
    nameVi: "Nha Trang",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/15-best-places/place-10-nha-trang.jpg",
    subNote: "All buses offer free shuttle service to your hotel.",
    subNoteVi: "Các nhà xe đều có xe trung chuyển miễn phí đưa đón về tận khách sạn của bạn.",
    thingsToDo:
      "Nha Trang Beach, Vinpearl Land, Po Nagar Cham Towers, Dam Market.",
    thingsToDoVi:
      "Bãi biển Nha Trang, Vinpearl Land, Tháp Bà Po Nagar, Chợ Đầm.",
    nextRoute: "Nha Trang → Da Nang",
    nextRouteVi: "Nha Trang → Đà Nẵng",
    transport: "Plane (Vietnam Airlines, Vietjet Air, Pacific Airlines, and Bamboo Airways)",
    transportVi: "Máy bay (Vietnam Airlines, Vietjet Air, Pacific Airlines, Bamboo Airways)",
    time: "1 hr 5 min",
    timeVi: "1 giờ 5 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ",
    isFlight: true,
  },
  {
    num: 4,
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/hcmc/top-dest-danang.jpg",
    subNote: "You can take a Grab or taxi directly from Da Nang Airport to your hotel in the city center or beach.",
    subNoteVi: "Bạn có thể bắt Grab hoặc taxi từ Sân bay Quốc tế Đà Nẵng về khách sạn trung tâm hoặc bãi biển Mỹ Khê.",
    thingsToDo:
      "My Khe Beach, Ba Na Hills, Marble Mountains, Museum of Cham Sculpture.",
    thingsToDoVi:
      "Bãi biển Mỹ Khê, Cầu Vàng Bà Nà Hills, Danh thắng Ngũ Hành Sơn, Bảo tàng Điêu khắc Chăm.",
    nextRoute: "Da Nang → Hoi An",
    nextRouteVi: "Đà Nẵng → Hội An",
    transport: "Bus (01)",
    transportVi: "Tuyến xe buýt (01)",
    time: "45 min",
    timeVi: "45 phút",
    fare: "30,000 VND",
    fareVi: "30.000 VNĐ",
  },
  {
    num: 5,
    name: "Hoi An",
    nameVi: "Hội An",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-2-hoi-an.jpg",
    subNote: "Rent a bicycle to explore the peaceful pedestrian streets and surrounding lantern villages.",
    subNoteVi: "Thuê xe đạp thong dong khám phá các tuyến phố đi bộ thanh bình và làng dừa xung quanh.",
    thingsToDo:
      "Hoi An Ancient Town, An Bang Beach, Bay Mau Coconut Forest.",
    thingsToDoVi:
      "Phố cổ Hội An, Biển An Bàng, Thuyền thúng Rừng dừa Bảy Mẫu.",
    nextRoute: "Hoi An → Ha Long Bay",
    nextRouteVi: "Hội An → Vịnh Hạ Long",
    transport: "Plane (Da Nang to Hai Phong / Van Don Airport)",
    transportVi: "Máy bay (Đà Nẵng đi Sân bay Cát Bi Hải Phòng hoặc Vân Đồn)",
    time: "1 hr 15 min",
    timeVi: "1 giờ 15 phút",
    fare: "800,000 – 1,300,000 VND",
    fareVi: "800.000 – 1.300.000 VNĐ",
    isFlight: true,
  },
  {
    num: 6,
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-6-ha-long.jpg",
    subNote: "Most cruise operators provide shuttle transfers from the port.",
    subNoteVi: "Hầu hết các hãng du thuyền đều có dịch vụ xe đón trả tại bến cảng Tuần Châu.",
    thingsToDo:
      "Overnight Luxury Cruise, Sung Sot Cave, Ti Top Island Beach & Viewpoint, Kayaking in Luon Cave.",
    thingsToDoVi:
      "Du thuyền nghỉ đêm trên Vịnh, Hang Sửng Sốt, Chinh phục đỉnh Ti Tốp, Chèo kayak ngắm Hang Luồn.",
    nextRoute: "Ha Long Bay → Ninh Binh",
    nextRouteVi: "Vịnh Hạ Long → Ninh Bình",
    transport: "Bus (The Sinh Tourist, Limousine)",
    transportVi: "Xe du lịch / Limousine cao tốc",
    time: "3 hr 30 min",
    timeVi: "3 giờ 30 phút",
    fare: "220,000 VND",
    fareVi: "220.000 VNĐ",
  },
  {
    num: 7,
    name: "Ninh Binh",
    nameVi: "Ninh Bình",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/15-best-places/place-5-ninh-binh.jpg",
    subNote: "Rent a motorbike or bicycle to visit Trang An and Tam Coc caves.",
    subNoteVi: "Thuê xe máy hoặc xe đạp thuận tiện khám phá Quần thể danh thắng Tràng An và Tam Cốc.",
    thingsToDo:
      "Tam Coc – Bich Dong, Mua Cave, Trang An Landscape Complex, Bai Dinh Pagoda.",
    thingsToDoVi:
      "Tam Cốc – Bích Động, Chinh phục đỉnh Hang Múa, Quần thể danh thắng Tràng An, Chùa Bái Đính.",
    nextRoute: "Ninh Binh → Hanoi",
    nextRouteVi: "Ninh Bình → Hà Nội",
    transport: "Bus / Train",
    transportVi: "Xe Limousine / Tàu hỏa",
    time: "1 hr 30 min",
    timeVi: "1 giờ 30 phút",
    fare: "100,000 – 150,000 VND",
    fareVi: "100.000 – 150.000 VNĐ",
  },
  {
    num: 8,
    name: "Hanoi",
    nameVi: "Hà Nội",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/15-best-places/place-3-hanoi.jpg",
    subNote: "You take bus number 86 (35,000 VND) to Noi Bai International Airport from Hanoi city center.",
    subNoteVi: "Bạn bắt xe buýt số 86 (35.000 VNĐ) từ trung tâm Hà Nội đến Sân bay Quốc tế Nội Bài.",
    thingsToDo:
      "Hoan Kiem Lake, Hanoi Old Quarter, Temple of Literature, Dong Xuan Market, Ho Chi Minh Mausoleum.",
    thingsToDoVi:
      "Hồ Hoàn Kiếm, 36 Phố Phường Hà Nội, Văn Miếu – Quốc Tử Giám, Chợ Đồng Xuân, Lăng Chủ tịch Hồ Chí Minh.",
    nextRoute: "Hanoi → Noi Bai International Airport (HAN)",
    nextRouteVi: "Hà Nội → Sân bay Quốc tế Nội Bài (HAN)",
    directTransit: "Bus 86 (Fansipan Express / Airport Express)",
    directTransitVi: "Xe buýt số 86 (Tuyến xe buýt chất lượng cao ra Sân bay)",
    isDirectTransitLine: true,
    airportNote:
      "You take bus number 86 (35,000 VND) to Noi Bai International Airport from Hanoi city center, ending your 2-week itinerary in Vietnam.",
    airportNoteVi:
      "Bạn bắt xe buýt số 86 (35.000 VNĐ) từ trung tâm Hà Nội đến Sân bay Quốc tế Nội Bài, khép lại trọn vẹn hành trình 2 tuần khám phá Việt Nam.",
  },
];

export default function TwoWeeksInVietnamPage() {
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
          src="/guide/megamenu/itin-3-2weeks.jpg"
          alt="2 Weeks in Vietnam - Hai Van Pass Train Viaduct"
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
              ? "Lịch trình 2 tuần xuyên Việt hoàn hảo"
              : "2 Weeks in Vietnam"}
          </h1>

          <div className="omi-hero__byline">
            {isVi
              ? "Biên tập bởi VinaTap Editorial • 14 Tháng 10, 2026"
              : "By Welcome to Vietnam • May 20, 2024"}
          </div>
        </div>
      </section>

      {/* ─── CTA PILL BUTTON (SCREENSHOT 1) ─── */}
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
            ? "Bản đồ lịch trình 2 tuần xuyên Việt"
            : "2-week Vietnam itinerary map"}
        </h2>

        <p className="omi-intro-text">
          {isVi
            ? "Khám phá những điểm đến quyến rũ bậc nhất trải dài khắp ba miền Bắc, Trung, Nam của Việt Nam với lịch trình 2 tuần được tuyển chọn kỹ lưỡng qua 8 điểm đến: TP. Hồ Chí Minh, Đà Lạt, Nha Trang, Đà Nẵng, Hội An, Vịnh Hạ Long, Ninh Bình và Hà Nội."
            : "Discover the most alluring destinations across Vietnam's North, Central, and South regions with our 2-week itinerary. This carefully crafted itinerary covers a total of six must-visit destinations, including Ho Chi Minh City, Dalat, Nha Trang, Da Nang, Hoi An, Ha Long Bay, Ninh Binh, and Hanoi."}
        </p>

        <div className="omi-map-wrap">
          <img
            src="/guide/vietnam/2-week-vietnam-itinerary-full-map.jpg"
            alt="2-week Vietnam itinerary map with 8 destinations"
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

        {/* ─── SECTION 2: WANT TO MAKE IT YOUR OWN? (SCREENSHOT 4) ─── */}
        <div className="omi-custom-box">
          <h3>
            {isVi ? "Bạn muốn tùy chỉnh lịch trình theo ý mình?" : "Want to make it your own?"}
          </h3>
          <p>
            {isVi
              ? 'Mở Trợ lý Du lịch Ảo VinaTap AI và nhập một câu lệnh như: "Tạo lịch trình 2 tuần du lịch Việt Nam". Trợ lý AI sẽ tự động phân tích tuyến đường, tối ưu phương tiện di chuyển và cá nhân hóa lịch trình theo sở thích.'
              : 'Open Tripion.ai and enter a prompt such as "Create a 2-week Vietnam itinerary." Tripion will build a personalized multi-city journey, help you optimize routes and transportation, and tailor the trip to your travel style.'}
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
              <strong>{isVi ? "Số điểm đến: " : "Destinations: "}</strong>8
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng thời gian di chuyển (giờ): " : "Travel time (hr): "}
              </strong>
              22+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Chi phí phương tiện (USD): " : "Transportation costs (USD): "}
              </strong>
              125+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng chi phí ước tính (USD): " : "Total cost (USD): "}
              </strong>
              550+
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: ITINERARY DETAILS (SCREENSHOT 5) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Chi tiết lịch trình" : "Itinerary details"}
        </h2>

        <div className="omi-cards-grid">
          {ITINERARY_8_DESTINATIONS.map((dest) => (
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

                {dest.subNote && (
                  <p className="omi-card__airport-note" style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748b" }}>
                    {isVi && dest.subNoteVi ? dest.subNoteVi : dest.subNote}
                  </p>
                )}

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

        {/* ─── A FEW NOTES ─── */}
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

        {/* ─── 2 WEEKS IN VIETNAM COSTS ─── */}
        <section className="omi-costs-box">
          <h2 className="omi-section-title">
            {isVi ? "Chi phí du lịch Việt Nam 2 tuần" : "2 weeks in Vietnam costs"}
          </h2>
          <p className="omi-costs-intro" style={{ textAlign: "left", marginBottom: "16px" }}>
            {isVi
              ? "Nếu bạn đang lên kế hoạch cho chuyến du lịch 2 tuần tại Việt Nam, việc chuẩn bị ngân sách dự kiến là rất cần thiết. Trung bình, nhiều du khách chi tiêu khoảng 550 USD cho chuyến đi của mình. Dưới đây là bảng phân bổ chi phí cố định ước tính giúp bạn lên kế hoạch:"
              : "If you're planning a 2-week trip to Vietnam, it's helpful to have an estimated budget in mind. On average, many tourists spend around $550 on their trip. Here's a breakdown of estimated fixed costs to help you plan:"}
          </p>

          <ul className="omi-notes-list" style={{ marginTop: "12px" }}>
            <li>
              {isVi
                ? "Chi phí phương tiện di chuyển ước tính khoảng 125 USD."
                : "Transportation costs are approximately $125."}
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

        {/* ─── OTHER ITINERARIES ─── */}
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

            <Link
              href="/guide/1-month-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/travel-routes-map.jpg"
                  alt="1-Month Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 1 tháng tại Việt Nam" : "1 Month in Vietnam"}
              </span>
            </Link>
          </div>
        </section>

        {/* ─── HORIZONTAL DIVIDER ─── */}
        <hr className="omi-divider" />

        {/* ─── RELATED ARTICLES ─── */}
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
              href="/guide/1-month-in-vietnam"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/megamenu/itin-4-1month.jpg"
                  alt="1 Month in Vietnam"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi
                  ? "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam"
                  : "1 Month in Vietnam"}
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
              src="/guide/vietnam/2-week-vietnam-itinerary-full-map.jpg"
              alt="Bản đồ hành trình 2 tuần xuyên Việt 8 điểm đến"
              className="vnn-lightbox-img"
            />
            <p className="vnn-lightbox-caption">
              {isVi
                ? "Bản đồ hành trình 2 tuần khám phá 8 điểm đến nổi tiếng nhất Việt Nam"
                : "2-Week Vietnam Itinerary Map: 8 Signature Destinations from South to North"}
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

      {/* ─── PUBLIC FOOTER (CHUẨN HOMEPAGE) ─── */}
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
