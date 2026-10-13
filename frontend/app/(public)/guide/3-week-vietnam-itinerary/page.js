"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import VietnamItineraryMap from "@/components/itinerary/VietnamItineraryMap";
import VietnamExtendedItineraryMap from "@/components/itinerary/VietnamExtendedItineraryMap";
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
  Clock,
  Navigation,
  ArrowRight,
  Download,
  Share2,
  Train,
  Bus,
  Plane,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/three-week-itinerary.css";

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
        date: "September 18, 2026",
        dateVi: "18 Tháng 9, 2026",
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
        titleVi: "Thành phố Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "September 25, 2026",
        dateVi: "25 Tháng 9, 2026",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "September 22, 2026",
        dateVi: "22 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 8, 2026",
        dateVi: "8 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "September 29, 2026",
        dateVi: "29 Tháng 9, 2026",
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
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "todo-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "July 21, 2024",
        dateVi: "21 Tháng 7, 2024",
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
        date: "March 15, 2026",
        dateVi: "15 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "Saigon Culinary Highlights",
        titleVi: "Tinh hoa ẩm thực Sài Gòn",
        date: "March 10, 2026",
        dateVi: "10 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "eat-3",
        title: "Top 10 Vietnamese Pho Varieties",
        titleVi: "Top 10 món phở ngon nhất Việt Nam",
        date: "March 5, 2026",
        dateVi: "5 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "Seafood Feast in Vung Tau",
        titleVi: "Hải sản tươi ngon Vũng Tàu",
        date: "March 1, 2026",
        dateVi: "1 Tháng 3, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "Nha Trang Coastal Delicacies",
        titleVi: "Ẩm thực biển đảo Nha Trang",
        date: "February 25, 2026",
        dateVi: "25 Tháng 2, 2026",
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
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "September 16, 2026",
        dateVi: "16 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "September 12, 2026",
        dateVi: "12 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "itin-4",
        title: "1 Month Vietnam Grand Tour",
        titleVi: "Hành trình 1 tháng khám phá toàn diện",
        date: "September 8, 2026",
        dateVi: "8 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
    ],
  },
};

// ─── 7 TOP DESTINATIONS DATA (SCREENSHOT 4 & 5) ───
const ITINERARY_DESTINATIONS = [
  {
    id: "dest-hcmc",
    num: 1,
    title: "Ho Chi Minh City",
    titleVi: "TP. Hồ Chí Minh",
    nights: "(3 nights)",
    nightsVi: "(3 đêm)",
    image: "/guide/hcmc/hcmc-hero-aerial-hd.jpg",
    alt: "Ho Chi Minh City Skyline",
    thingsToDo:
      "Things to do: War Remnants Museum, Ben Thanh Market, Bui Vien Street, Cu Chi Tunnels.",
    thingsToDoVi:
      "Hoạt động nổi bật: Bảo tàng Chứng tích Chiến tranh, Chợ Bến Thành, Phố đi bộ Bùi Viện, Địa đạo Củ Chi.",
    routeFrom: "Ho Chi Minh City",
    routeTo: "Nha Trang",
    routeFromVi: "TP. Hồ Chí Minh",
    routeToVi: "Nha Trang",
    transportation: "Train",
    transportationVi: "Tàu hỏa",
    fare: "$11 – $25",
    fareVi: "270.000₫ – 620.000₫ ($11 – $25)",
    travelTime: "7h",
    travelTimeVi: "7 giờ",
    link: "/province/ho-chi-minh",
  },
  {
    id: "dest-nhatrang",
    num: 2,
    title: "Nha Trang",
    titleVi: "Nha Trang",
    nights: "(3 nights)",
    nightsVi: "(3 đêm)",
    image: "/guide/15-best-places/place-10-nha-trang.jpg",
    alt: "Nha Trang Coastal Bay",
    thingsToDo:
      "Things to do: Nha Trang Beach, Hon Tre Island, Po Nagar Cham Towers, Dam Market.",
    thingsToDoVi:
      "Hoạt động nổi bật: Bãi biển Nha Trang, Đảo Hòn Tre, Tháp Bà Ponagar, Chợ Đầm.",
    routeFrom: "Nha Trang",
    routeTo: "Da Nang",
    routeFromVi: "Nha Trang",
    routeToVi: "Đà Nẵng",
    transportation: "Train",
    transportationVi: "Tàu hỏa",
    fare: "$16 – $55",
    fareVi: "400.000₫ – 1.350.000₫ ($16 – $55)",
    travelTime: "9h30m",
    travelTimeVi: "9 giờ 30 phút",
    link: "/province/khanh-hoa",
  },
  {
    id: "dest-danang",
    num: 3,
    title: "Da Nang",
    titleVi: "Đà Nẵng",
    nights: "(3 nights)",
    nightsVi: "(3 đêm)",
    image: "/guide/danang/danang-hero-hd.jpg",
    alt: "Da Nang Cityscape & Coast",
    thingsToDo:
      "Things to do: My Khe Beach, Ba Na Hills, Marble Mountains, Museum of Cham Sculpture, Con Market.",
    thingsToDoVi:
      "Hoạt động nổi bật: Bãi biển Mỹ Khê, Bà Nà Hills, Ngũ Hành Sơn, Bảo tàng Điêu khắc Chăm, Chợ Cồn.",
    routeFrom: "Da Nang",
    routeTo: "Hoi An",
    routeFromVi: "Đà Nẵng",
    routeToVi: "Hội An",
    transportation: "Bus (LK02)",
    transportationVi: "Xe buýt (LK02)",
    fare: "$1.4",
    fareVi: "35.000₫ ($1.4)",
    travelTime: "45m",
    travelTimeVi: "45 phút",
    link: "/province/da-nang",
  },
  {
    id: "dest-hoian",
    num: 4,
    title: "Hoi An",
    titleVi: "Hội An",
    nights: "(3 nights)",
    nightsVi: "(3 đêm)",
    image: "/guide/hcmc/hoi-an-lantern-boats.jpg",
    alt: "Hoi An Ancient Town Lantern River",
    thingsToDo:
      "Things to do: An Bang Beach, the ancient town, Bay Mau Coconut Forest, My Son Sanctuary, Thanh Ha Pottery Village.",
    thingsToDoVi:
      "Hoạt động nổi bật: Bãi biển An Bàng, Phố cổ Hội An, Rừng dừa Bảy Mẫu, Thánh địa Mỹ Sơn, Làng gốm Thanh Hà.",
    routeFrom: "Hoi An → Da Nang",
    routeTo: "Hanoi",
    routeFromVi: "Hội An → Đà Nẵng",
    routeToVi: "Hà Nội",
    transportation: "Plane",
    transportationVi: "Máy bay",
    fare: "$40 – $80",
    fareVi: "1.000.000₫ – 2.000.000₫ ($40 – $80)",
    travelTime: "1h30m",
    travelTimeVi: "1 giờ 30 phút",
    link: "/province/hoi-an",
  },
  {
    id: "dest-hanoi",
    num: 5,
    title: "Hanoi",
    titleVi: "Hà Nội",
    nights: "(3 nights)",
    nightsVi: "(3 đêm)",
    image: "/guide/15-best-places/place-3-hanoi.jpg",
    alt: "Hanoi West Lake Aerial View",
    thingsToDo:
      "Things to do: Hoan Kiem Lake, Hanoi Old Quarter, Temple of Literature, Dong Xuan Market, Ho Chi Minh Mausoleum.",
    thingsToDoVi:
      "Hoạt động nổi bật: Hồ Hoàn Kiếm, Phố cổ Hà Nội, Văn Miếu - Quốc Tử Giám, Chợ Đồng Xuân, Lăng Chủ tịch Hồ Chí Minh.",
    routeFrom: "Hanoi",
    routeTo: "Ha Long",
    routeFromVi: "Hà Nội",
    routeToVi: "Hạ Long",
    transportation: "Bus",
    transportationVi: "Xe khách / Limousine",
    fare: "$12 – $14",
    fareVi: "300.000₫ – 350.000₫ ($12 – $14)",
    travelTime: "2h50m",
    travelTimeVi: "2 giờ 50 phút",
    link: "/province/ha-noi",
  },
  {
    id: "dest-halong",
    num: 6,
    title: "Ha Long",
    titleVi: "Hạ Long",
    nights: "(2 nights)",
    nightsVi: "(2 đêm)",
    image: "/guide/15-best-places/place-6-ha-long.jpg",
    alt: "Ha Long Bay Emerald Waters",
    thingsToDo:
      "Things to do: Ha Long Bay Cruise, Sung Sot Cave, Ti Top Island, Luon Cave kayaking, Bai Chay Beach.",
    thingsToDoVi:
      "Hoạt động nổi bật: Du thuyền Vịnh Hạ Long, Hang Sửng Sốt, Đảo Ti Tốp, Chèo kayak Hang Luồn, Bãi Cháy.",
    routeFrom: "Ha Long",
    routeTo: "Ninh Binh",
    routeFromVi: "Hạ Long",
    routeToVi: "Ninh Bình",
    transportation: "Bus",
    transportationVi: "Xe khách / Limousine",
    fare: "$10 – $15",
    fareVi: "250.000₫ – 380.000₫ ($10 – $15)",
    travelTime: "3h30m",
    travelTimeVi: "3 giờ 30 phút",
    link: "/province/quang-ninh",
  },
  {
    id: "dest-ninhbinh",
    num: 7,
    title: "Ninh Binh",
    titleVi: "Ninh Bình",
    nights: "(3 nights)",
    nightsVi: "(3 đêm)",
    image: "/guide/15-best-places/place-5-ninh-binh.jpg",
    alt: "Ninh Binh Trang An Tam Coc",
    thingsToDo:
      "Things to do: Trang An Scenic Landscape Complex, Tam Coc - Bich Dong, Hang Mua peak, Bai Dinh Pagoda, Hoa Lu Ancient Capital.",
    thingsToDoVi:
      "Hoạt động nổi bật: Quần thể danh thắng Tràng An, Tam Cốc - Bích Động, Đỉnh Hang Múa, Chùa Bái Đính, Cố đô Hoa Lư.",
    routeFrom: "Ninh Binh",
    routeTo: "Hanoi",
    routeFromVi: "Ninh Bình",
    routeToVi: "Hà Nội",
    transportation: "Train / Bus",
    transportationVi: "Tàu hỏa / Xe Limousine",
    fare: "$5 – $10",
    fareVi: "130.000₫ – 250.000₫ ($5 – $10)",
    travelTime: "1h30m",
    travelTimeVi: "1 giờ 30 phút",
    link: "/province/ninh-binh",
  },
];

export default function ThreeWeekVietnamItineraryPage() {
  const [langState, setLangState] = useState("en");
  const lang = langState === "vi" ? "vi" : "en";

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState(null);
  const megaMenuTimeoutRef = useRef(null);

  useEffect(() => {
    setLangState(getLang());
    const handleLangUpdated = (e) => {
      setLangState(e.detail);
    };
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
    };
  }, []);

  const handleMenuEnter = (menuKey) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuKey);
  };

  const handleMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 140);
  };

  const handleMegaMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
  };

  const handleSelectDestination = (id) => {
    setActiveTargetId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("is-active-target");
      setTimeout(() => el.classList.remove("is-active-target"), 2000);
    }
  };

  const handleCustomizeClick = () => {
    setAiCompanionOpen(true);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="itin-page">
      {/* ─── 1. TOP BANNER (SCREENSHOT 1) ─── */}
      <div
        className="vnn-top-banner"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        title="FREE AI TRAVEL ASSISTANT • AI COMPANION"
      >
        <div className="vnn-top-banner__inner">
          <img
            src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
            alt="VinaTap AI Travel Assistant - AI Companion"
            className="vnn-top-banner__img"
          />
        </div>
      </div>

      {/* ─── 2. EDITORIAL NAVBAR WITH MEGAMENUS ─── */}
      <header className="vnn-navbar" onMouseLeave={handleMenuLeave}>
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
              onMouseEnter={() => handleMenuEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "inspired" ? "is-active" : ""}`}
              >
                <span>{lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* DESTINATIONS */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "destinations" ? "is-active" : ""}`}
              >
                <span>{lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("thingsToDo")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "thingsToDo" ? "is-active" : ""}`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("eatAndDrink")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "eatAndDrink" ? "is-active" : ""}`}
              >
                <span>{lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "itineraries" ? "is-active" : ""}`}
              >
                <span>{lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <LanguageSwitch />
            <button
              type="button"
              className="vnn-navbar__search-btn"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* ─── DROPDOWN MEGAMENU CONTENT ─── */}
        {activeMegaMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="vnn-megamenu__grid">
              {(MEGA_MENUS_DATA[activeMegaMenu]?.items || []).map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="vnn-megamenu__card"
                  onClick={() => setActiveMegaMenu(null)}
                >
                  <div className="vnn-megamenu__thumb">
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
                    {lang === "vi" ? item.titleVi || item.title : item.title}
                  </h4>
                  <p className="vnn-megamenu__date">
                    {lang === "vi" ? item.dateVi || item.date : item.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION (SCREENSHOT 1) ─── */}
      <section
        className="itin-hero"
        style={{
          backgroundImage: `url("/guide/hcmc/3-week-vietnam-itinerary.jpg")`,
        }}
      >
        <div className="itin-hero__content">
          <div className="itin-hero__badges">
            <span className="itin-badge-pill">
              {lang === "vi" ? "BÀI VIẾT" : "ARTICLES"}
            </span>
            <span className="itin-badge-pill">
              {lang === "vi" ? "LỊCH TRÌNH" : "ITINERARY"}
            </span>
            <span className="itin-badge-pill">
              {lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}
            </span>
          </div>

          <h1 className="itin-hero__title">
            {lang === "vi"
              ? "Lịch trình 3 tuần xuyên Việt"
              : "3-week Vietnam Itinerary"}
          </h1>

          <div className="itin-hero__meta">
            {lang === "vi"
              ? "Bởi VinaTap   20 Tháng 7, 2025"
              : "By VinaTap   July 20, 2025"}
          </div>
        </div>
      </section>

      {/* ─── FLOATING CTA (BOTTOM OF HERO) ─── */}
      <div className="itin-cta-wrap">
        <button
          type="button"
          className="itin-cta-btn"
          onClick={handleCustomizeClick}
        >
          <Sparkles size={17} />
          <span>
            {lang === "vi"
              ? "Tạo chuyến đi Việt Nam trong vài giây"
              : "Create your Vietnam trip in seconds"}
          </span>
        </button>
      </div>

      <div className="itin-container">
        {/* ─── 4. 3-WEEK VIETNAM ITINERARY MAP ─── */}
        <section className="itin-map-section">
          <div className="itin-section-header">
            <h2 className="itin-section-title">
              {lang === "vi"
                ? "Bản đồ lịch trình 3 tuần xuyên Việt"
                : "3-week Vietnam itinerary map"}
            </h2>
            <p className="itin-map-intro">
              {lang === "vi"
                ? "Đây là lịch trình 3 tuần được khuyến nghị đưa bạn qua 7 điểm đến nổi tiếng nhất tại Việt Nam: Ho Chi Minh City → Nha Trang → Da Nang → Hoi An → Hanoi → Ha Long → Ninh Binh."
                : "This is our recommended 3-week itinerary that takes you through 7 of the most popular destinations in Vietnam: Ho Chi Minh City → Nha Trang → Da Nang → Hoi An → Hanoi → Ha Long → Ninh Binh."}
            </p>
          </div>

          <VietnamItineraryMap
            onSelectDestination={handleSelectDestination}
            activeId={activeTargetId}
            lang={lang}
          />
        </section>

        {/* ─── 5. TOP DESTINATIONS CALLOUT & AI ASSISTANT BOX ─── */}
        <section className="itin-top-destinations-section">
          <div className="itin-top-banner-bar">
            {lang === "vi"
              ? "LỊCH TRÌNH 3 TUẦN DU LỊCH VIỆT NAM: CÁC ĐIỂM ĐẾN HÀNG ĐẦU"
              : "3-WEEK VIETNAM ITINERARY: TOP DESTINATIONS"}
          </div>

          <div className="itin-banner-breadcrumb">
            {lang === "vi"
              ? "Lịch trình 3 tuần xuyên Việt: Các điểm đến hàng đầu"
              : "3-week Vietnam Itinerary: Top destinations"}
          </div>

          <div className="itin-ai-box">
            <h3 className="itin-ai-box__title">
              {lang === "vi"
                ? "Bạn muốn tạo lịch trình riêng cho mình?"
                : "Want to make it your own?"}
            </h3>

            <p className="itin-ai-box__desc">
              {lang === "vi" ? (
                <>
                  Hãy mở <strong>Trợ lý AI VinaTap</strong> và nhập câu lệnh như{" "}
                  <em>&ldquo;Tạo lịch trình du lịch Việt Nam 3 tuần.&rdquo;</em> Trợ lý
                  sẽ giúp bạn lựa chọn điểm đến, tối ưu hóa tuyến đường di chuyển và
                  cá nhân hóa chuyến đi theo phong cách du lịch của riêng bạn.
                </>
              ) : (
                <>
                  Open <strong>Tripion.ai</strong> and enter a prompt such as{" "}
                  <em>&ldquo;Create a 3-week Vietnam itinerary.&rdquo;</em> Tripion will
                  help you choose destinations, optimize your route, and tailor
                  the journey to your travel style.
                </>
              )}
            </p>

            <p className="itin-ai-box__desc">
              {lang === "vi"
                ? "Khi bạn đã hài lòng với lịch trình của mình, chỉ cần tải xuống bản đồ hành trình cá nhân hóa và cẩm nang chi tiết dưới dạng tệp PDF."
                : "When you're happy with your itinerary, simply download your personalized travel map and detailed itinerary as a PDF."}
            </p>

            <div className="itin-ai-box__action">
              <button
                type="button"
                className="itin-btn-cyan"
                onClick={handleDownloadPDF}
              >
                <Download size={16} />
                <span>
                  {lang === "vi"
                    ? "Tùy chỉnh & Tải file PDF"
                    : "Customize & Download PDF"}
                </span>
              </button>

              <button
                type="button"
                className="itin-btn-cyan"
                style={{
                  backgroundColor: "#0284c7",
                }}
                onClick={handleCustomizeClick}
              >
                <Sparkles size={16} />
                <span>
                  {lang === "vi" ? "Mở Trợ lý AI" : "Open AI Assistant"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── 6. ITINERARY DETAILS (7 DESTINATION CARDS) ─── */}
        <section className="itin-details-section">
          <h2 className="itin-details-title">
            {lang === "vi" ? "Chi tiết lịch trình" : "Itinerary details"}
          </h2>

          <div className="itin-grid">
            {ITINERARY_DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                id={dest.id}
                className={`itin-card ${activeTargetId === dest.id ? "is-active-target" : ""}`}
              >
                <div className="itin-card__thumb-wrap">
                  <img
                    src={dest.image}
                    alt={dest.alt}
                    className="itin-card__thumb"
                    loading="lazy"
                  />
                </div>

                <div className="itin-card__body">
                  <div className="itin-card__header">
                    <h3 className="itin-card__title">
                      <Link href={dest.link} style={{ color: "inherit", textDecoration: "none" }}>
                        {lang === "vi" ? dest.titleVi : dest.title}
                      </Link>
                    </h3>
                    <p className="itin-card__nights">
                      {lang === "vi" ? dest.nightsVi : dest.nights}
                    </p>
                  </div>

                  <p className="itin-card__activities">
                    {lang === "vi" ? dest.thingsToDoVi : dest.thingsToDo}
                  </p>

                  <div className="itin-card__route">
                    <div className="itin-card__route-head">
                      <span>
                        {lang === "vi" ? dest.routeFromVi : dest.routeFrom} →{" "}
                        {lang === "vi" ? dest.routeToVi : dest.routeTo}
                      </span>
                    </div>
                    <ul className="itin-card__route-list">
                      <li>
                        <strong>
                          {lang === "vi" ? "Phương tiện: " : "Transportation: "}
                        </strong>
                        {lang === "vi" ? dest.transportationVi : dest.transportation}
                      </li>
                      <li>
                        <strong>{lang === "vi" ? "Giá vé: " : "Fare: "}</strong>
                        {lang === "vi" ? dest.fareVi : dest.fare}
                      </li>
                      <li>
                        <strong>
                          {lang === "vi" ? "Thời gian di chuyển: " : "Travel time: "}
                        </strong>
                        {lang === "vi" ? dest.travelTimeVi : dest.travelTime}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 7. NOTES (IMAGE 1) ─── */}
        <section className="itin-notes-section">
          <h3 className="itin-notes-title">
            {lang === "vi" ? "Ghi chú quan trọng" : "Notes"}
          </h3>
          <ul className="itin-bullets-list">
            <li>
              {lang === "vi"
                ? "Tỷ giá quy đổi giữa USD và VND năm 2026 xấp xỉ 1 USD ≈ 26.000 VNĐ."
                : "The exchange rate between USD and VND in 2026 is approximately 1 USD ≈ 26,000 VND."}
            </li>
            <li>
              {lang === "vi" ? (
                <>
                  Đối với di chuyển bằng tàu hỏa, chúng tôi khuyến nghị bạn nên đặt vé trên trang web chính thức của Tổng công ty Đường sắt Việt Nam:{" "}
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
              {lang === "vi"
                ? "Giá vé các phương tiện giao thông được cung cấp để tham khảo. Giá thực tế có thể thay đổi tùy thuộc vào loại chỗ ngồi, hạng vé và thời điểm đi vào cuối tuần hoặc ngày lễ."
                : "The transportation prices are provided as a reference. Actual prices may vary based on seat type, ticket class, and whether you're traveling on weekends or holidays."}
            </li>
            <li>
              {lang === "vi" ? (
                <>
                  Bạn có thể tham khảo{" "}
                  <Link href="/guide/the-complete-guide-to-vietnam">
                    bản đồ du lịch (tourist maps)
                  </Link>{" "}
                  của từng thành phố để chuyến đi thuận tiện và trọn vẹn hơn.
                </>
              ) : (
                <>
                  You can refer to{" "}
                  <Link href="/guide/the-complete-guide-to-vietnam">
                    tourist maps
                  </Link>{" "}
                  of each city to make your travel more convenient.
                </>
              )}
            </li>
          </ul>
        </section>

        {/* ─── 8. 3 WEEKS IN VIETNAM COSTS (IMAGE 1) ─── */}
        <section className="itin-costs-section">
          <h3 className="itin-costs-title">
            {lang === "vi"
              ? "Dự toán chi phí 3 tuần du lịch Việt Nam"
              : "3 weeks in Vietnam costs"}
          </h3>
          <p className="itin-costs-intro">
            {lang === "vi"
              ? "Đối với chuyến đi 3 tuần tại Việt Nam, mức chi tiêu trung bình của đa số du khách rơi vào khoảng $900 (~23.400.000 VNĐ). Dưới đây là các khoản chi phí cố định ước tính giúp bạn lên kế hoạch ngân sách:"
              : "For a 3-week trip to Vietnam, the average expenditure for many tourists is around $900. Here are some estimated fixed costs to help you plan your budget:"}
          </p>
          <ul className="itin-bullets-list">
            <li>
              {lang === "vi"
                ? "Chi phí đi lại (phương tiện giao thông) khoảng $100."
                : "Transportation costs are approximately $100."}
            </li>
            <li>
              {lang === "vi"
                ? "Chỗ ở tại khách sạn riêng hoặc homestay khoảng $15 đến $20 mỗi đêm. Với người đi một mình, phòng hostel là lựa chọn tiết kiệm hơn với giá từ $5 mỗi đêm."
                : "Accommodation in a private hotel or homestay will cost around $15 to $20 per night. For solo travelers, hostels can be a more affordable option, with prices starting at around $5 per night."}
            </li>
            <li>
              {lang === "vi"
                ? "Chi phí ăn uống thông thường khoảng $15 mỗi người mỗi ngày."
                : "Food costs are typically around $15 per person per day."}
            </li>
            <li>
              {lang === "vi"
                ? "Vé vào cổng các di tích, bảo tàng và danh lam thắng cảnh khoảng $1 – $5."
                : "Admission to monuments, museums, and attractions costs around $1 – $5."}
            </li>
          </ul>
        </section>

        {/* ─── 9. 3-WEEK VIETNAM ITINERARY INFOGRAPHIC (IMAGES 2, 3, 4) ─── */}
        <section className="itin-infographic-section">
          <div className="itin-infographic-header">
            <h2 className="itin-infographic-title">
              {lang === "vi"
                ? "Infographic lịch trình 3 tuần xuyên Việt"
                : "3-week Vietnam itinerary infographic"}
            </h2>
            <p className="itin-infographic-disclaimer">
              {lang === "vi"
                ? "Lưu ý: Các dịch vụ vận chuyển và thương hiệu được nhắc đến là gợi ý dựa trên trải nghiệm cá nhân của tác giả, không mang tính chất tài trợ hay quảng cáo."
                : "Note: The transportation services and brands mentioned are suggestions based on the author's personal experience, without any sponsorships or endorsements."}
            </p>
          </div>

          {/* Detailed Itinerary Hero Strip */}
          <div
            className="itin-detailed-hero"
            style={{
              backgroundImage: `url("/guide/hcmc/hoi-an-lantern-boats.jpg")`,
            }}
          >
            <h3 className="itin-detailed-hero__title">
              {lang === "vi" ? "Lịch Trình Chi Tiết" : "Detailed Itinerary"}
            </h3>
            <div className="itin-detailed-hero__route">
              HO CHI MINH CITY → NHA TRANG → DA NANG → HOI AN → DA NANG → HANOI → HA LONG → NINH BINH
            </div>
          </div>

          {/* SUMMARY TABLE BOX */}
          <div className="itin-summary-table-box">
            <div className="itin-summary-table-header">
              {lang === "vi" ? "BẢNG TỔNG HỢP / SUMMARY" : "SUMMARY"}
            </div>
            <div className="itin-summary-table-body">
              <div className="itin-summary-table-item">
                <span>{lang === "vi" ? "Điểm đến:" : "Destinations:"}</span>
                <strong>7</strong>
              </div>
              <div className="itin-summary-table-item">
                <span>{lang === "vi" ? "Chi phí đi lại (USD):" : "Transportation Costs (USD):"}</span>
                <strong>100+</strong>
              </div>
              <div className="itin-summary-table-item">
                <span>{lang === "vi" ? "Thời gian di chuyển (giờ):" : "Travel Time (hrs):"}</span>
                <strong>27+</strong>
              </div>
              <div className="itin-summary-table-item">
                <span>{lang === "vi" ? "Tổng chi phí ước tính (USD):" : "Estimated Total Cost (USD):"}</span>
                <strong>900+</strong>
              </div>
            </div>
          </div>

          {/* VERTICAL TIMELINE INFOGRAPHIC */}
          <div className="itin-timeline">
            {/* 1. Ho Chi Minh City */}
            <div className="itin-timeline-item">
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/hcmc/hcmc-hero-aerial-hd.jpg"
                    alt="Ho Chi Minh City"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}{" "}
                    <span>{lang === "vi" ? "(3 đêm)" : "(3 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>(*) Cu Chi Tunnels</li>
                      <li>War Remnants Museum</li>
                      <li>Ben Thanh Market</li>
                      <li>Chinatown</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Independence Palace</li>
                      <li>Notre Dame Cathedral</li>
                      <li>Jade Emperor Pagoda</li>
                      <li>Bui Vien Street</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transit: HCMC -> Nha Trang */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-train" />
                <div className="itin-transit-badge is-train">
                  <div className="itin-transit-icon-circle is-train">
                    <Train size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">$11 - $28 (7h**)</span>
                    <span className="itin-transit-sub">SE2, SE6, SE8, SE22</span>
                  </div>
                </div>
                <div className="itin-transit-line is-train" />
              </div>
            </div>

            {/* 2. Nha Trang */}
            <div className="itin-timeline-item">
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/15-best-places/place-10-nha-trang.jpg"
                    alt="Nha Trang"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    Nha Trang{" "}
                    <span>{lang === "vi" ? "(3 đêm)" : "(3 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>Nha Trang Beach</li>
                      <li>Dam Market</li>
                      <li>Hon Chong Promontory</li>
                      <li>Po Nagar Cham Towers</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Long Son Pagoda</li>
                      <li>Oceanographic Museum</li>
                      <li>Hon Tre Island</li>
                      <li>Hon Mieu Island</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transit: Nha Trang -> Da Nang */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-train" />
                <div className="itin-transit-badge is-train">
                  <div className="itin-transit-icon-circle is-train">
                    <Train size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">$16 - $58 (9h30m)</span>
                    <span className="itin-transit-sub">SE2, SE4, SE6, SE8</span>
                  </div>
                </div>
                <div className="itin-transit-line is-train" />
              </div>
            </div>

            {/* 3. Da Nang */}
            <div className="itin-timeline-item">
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/danang/danang-hero-hd.jpg"
                    alt="Da Nang"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    {lang === "vi" ? "Đà Nẵng" : "Da Nang"}{" "}
                    <span>{lang === "vi" ? "(3 đêm)" : "(3 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>My Khe Beach</li>
                      <li>Son Tra Peninsula</li>
                      <li>Linh Ung Pagoda</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Con Market</li>
                      <li>Marble Mountains</li>
                      <li>Ba Na Hills</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transit: Da Nang -> Hoi An */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-bus" />
                <div className="itin-transit-badge is-bus">
                  <div className="itin-transit-icon-circle is-bus">
                    <Bus size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">$1.4 (45m)</span>
                    <span className="itin-transit-sub">LK02</span>
                  </div>
                </div>
                <div className="itin-transit-line is-bus" />
              </div>
            </div>

            {/* 4. Hoi An */}
            <div className="itin-timeline-item" style={{ position: "relative" }}>
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/hcmc/hoi-an-lantern-boats.jpg"
                    alt="Hoi An"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    {lang === "vi" ? "Hội An" : "Hoi An"}{" "}
                    <span>{lang === "vi" ? "(3 đêm)" : "(3 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>Hoi An Ancient Town</li>
                      <li>An Bang Beach</li>
                      <li>My Son Sanctuary</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Thanh Ha Pottery Village</li>
                      <li>Bay Mau Coconut Forest</li>
                      <li>Cham Islands</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Plane flight curve trajectory on the left */}
              <div className="itin-flight-loop" />
              <div className="itin-flight-badge-wrap">
                <div className="itin-transit-icon-circle is-plane" style={{ width: 22, height: 22 }}>
                  <Plane size={12} />
                </div>
                <strong style={{ color: "#0284c7" }}>$40 - $60</strong>
                <span style={{ fontSize: 10, color: "#475569" }}>(1h30m)</span>
                <span style={{ fontSize: 9.5, color: "#64748b" }}>Vietnam Airlines</span>
              </div>

              {/* Transit down connector */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-bus" />
                <div className="itin-transit-badge is-bus">
                  <div className="itin-transit-icon-circle is-plane">
                    <Plane size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">Hoi An → Da Nang → Hanoi</span>
                    <span className="itin-transit-sub">Flight / Máy bay</span>
                  </div>
                </div>
                <div className="itin-transit-line is-bus" />
              </div>
            </div>

            {/* 5. Hanoi */}
            <div className="itin-timeline-item">
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/15-best-places/place-3-hanoi.jpg"
                    alt="Hanoi"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    {lang === "vi" ? "Hà Nội" : "Hanoi"}{" "}
                    <span>{lang === "vi" ? "(3 đêm)" : "(3 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>Hanoi Old Quarter</li>
                      <li>Hoan Kiem Lake</li>
                      <li>Temple of Literature</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Ho Chi Minh Mausoleum</li>
                      <li>Dong Xuan Market</li>
                      <li>Hoa Lo Prison</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transit: Hanoi -> Ha Long */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-bus" />
                <div className="itin-transit-badge is-bus">
                  <div className="itin-transit-icon-circle is-bus">
                    <Bus size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">$12 (2h30m)</span>
                    <span className="itin-transit-sub">Ha Long Travel Limousine / Phuc Xuyen</span>
                  </div>
                </div>
                <div className="itin-transit-line is-bus" />
              </div>
            </div>

            {/* 6. Ha Long */}
            <div className="itin-timeline-item">
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/15-best-places/place-6-ha-long.jpg"
                    alt="Ha Long"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    {lang === "vi" ? "Hạ Long" : "Ha Long"}{" "}
                    <span>{lang === "vi" ? "(2 đêm)" : "(2 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>Ha Long Bay</li>
                      <li>Tuan Chau Island</li>
                      <li>Bai Chay Beach</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Quang Ninh Museum</li>
                      <li>Long Tien Pagoda</li>
                      <li>Bai Tho Mountain</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transit: Ha Long -> Ninh Binh */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-bus" />
                <div className="itin-transit-badge is-bus">
                  <div className="itin-transit-icon-circle is-bus">
                    <Bus size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">$12 - $14 (3h30m)</span>
                    <span className="itin-transit-sub">Ninh Binh Travel / Cat Ba Express</span>
                  </div>
                </div>
                <div className="itin-transit-line is-bus" />
              </div>
            </div>

            {/* 7. Ninh Binh */}
            <div className="itin-timeline-item">
              <div className="itin-timeline-card">
                <div className="itin-timeline-thumb-wrap">
                  <img
                    src="/guide/15-best-places/place-5-ninh-binh.jpg"
                    alt="Ninh Binh"
                    className="itin-timeline-thumb"
                  />
                </div>
                <div className="itin-timeline-content">
                  <h4 className="itin-timeline-title">
                    {lang === "vi" ? "Ninh Bình" : "Ninh Binh"}{" "}
                    <span>{lang === "vi" ? "(3 đêm)" : "(3 nights)"}</span>
                  </h4>
                  <div className="itin-timeline-columns">
                    <ul className="itin-timeline-column-list">
                      <li>Tam Coc - Bich Dong</li>
                      <li>Mua Caves</li>
                      <li>Hoa Lu Ancient Capital</li>
                    </ul>
                    <ul className="itin-timeline-column-list">
                      <li>Trang An Landscape Complex</li>
                      <li>Bai Dinh Pagoda</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Return transit: Ninh Binh -> Hanoi */}
              <div className="itin-transit-connector">
                <div className="itin-transit-line is-bus" />
                <div className="itin-transit-badge is-bus">
                  <div className="itin-transit-icon-circle is-bus">
                    <Bus size={14} />
                  </div>
                  <div className="itin-transit-info">
                    <span className="itin-transit-cost">$7 (1h30m)</span>
                    <span className="itin-transit-sub">X.E Viet Nam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="itin-timeline-footnotes">
            <p>(*) {lang === "vi" ? "Điểm tham quan nổi tiếng tại thành phố." : "Popular attractions in the city."}</p>
            <p>(**) {lang === "vi" ? "Thời gian di chuyển ước tính." : "Approximate travel time."}</p>
          </div>
        </section>

        {/* ─── 10. 3-WEEK VIETNAM ITINERARY: EXTENDED EXPLORATION (IMAGE 5) ─── */}
        <section className="itin-extended-section">
          <div className="itin-section-header">
            <h2 className="itin-section-title">
              {lang === "vi"
                ? "Lịch trình 3 tuần xuyên Việt: Mở rộng khám phá"
                : "3-Week Vietnam itinerary: Extended exploration"}
            </h2>
            <p className="itin-map-intro">
              {lang === "vi"
                ? "Chúng tôi cũng cung cấp một lịch trình 3 tuần xuyên Việt khác để bạn tham khảo, được thiết kế dành cho những du khách yêu thích khám phá thêm nhiều điểm đến đa dạng."
                : "We also offer another 3-week Vietnam itinerary for your reference, designed for those who enjoy exploring more destinations."}
            </p>
          </div>

          {/* Extended Vector Map */}
          <VietnamExtendedItineraryMap lang={lang} />

          <div className="itin-top-banner-bar" style={{ marginTop: 24 }}>
            {lang === "vi"
              ? "LỊCH TRÌNH 3 TUẦN DU LỊCH VIỆT NAM: MỞ RỘNG KHÁM PHÁ"
              : "3-WEEK VIETNAM ITINERARY: EXTENDED EXPLORATION"}
          </div>

          <div className="itin-banner-breadcrumb">
            {lang === "vi"
              ? "Lịch trình 3 tuần xuyên Việt: Mở rộng khám phá"
              : "3-week Vietnam Itinerary: Extended exploration"}
          </div>
        </section>

        {/* ─── 11. RELATED ARTICLES (IMAGE 2) ─── */}
        <hr className="itin-divider" />
        <section className="itin-related-section">
          <h3 className="itin-related-title">
            {lang === "vi" ? "Bài viết liên quan" : "Related Articles"}
          </h3>
          <div className="itin-related-grid">
            <Link href="/guide/8-must-try-foods-in-hanoi" className="itin-related-card">
              <div className="itin-related-card__thumb-wrap">
                <img
                  src="/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg"
                  alt="8 must-try foods in Hanoi"
                  className="itin-related-card__thumb"
                  loading="lazy"
                />
              </div>
              <h4 className="itin-related-card__title">
                {lang === "vi"
                  ? "8 món ngon nhất định phải thử tại Hà Nội"
                  : "8 must-try foods in Hanoi"}
              </h4>
            </Link>

            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="itin-related-card"
            >
              <div className="itin-related-card__thumb-wrap">
                <img
                  src="/guide/hcmc/hcmc-hero-aerial-hd.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  className="itin-related-card__thumb"
                  loading="lazy"
                />
              </div>
              <h4 className="itin-related-card__title">
                {lang === "vi"
                  ? "10 trải nghiệm tuyệt nhất tại TP.HCM"
                  : "10 best things to do in Ho Chi Minh City"}
              </h4>
            </Link>

            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="itin-related-card"
            >
              <div className="itin-related-card__thumb-wrap">
                <img
                  src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Goi-Cuon.jpg"
                  alt="12 must-try foods in Ho Chi Minh City"
                  className="itin-related-card__thumb"
                  loading="lazy"
                />
              </div>
              <h4 className="itin-related-card__title">
                {lang === "vi"
                  ? "12 món ngon nhất định phải thử tại TP.HCM"
                  : "12 must-try foods in Ho Chi Minh City"}
              </h4>
            </Link>
          </div>
        </section>
      </div>

      {/* ─── FLOATING AI TRAVEL COMPANION ─── */}
      <div className="vnn-floating-widget">
        <button
          type="button"
          className="vnn-floating-widget__btn"
          onClick={() => setAiCompanionOpen(!aiCompanionOpen)}
          title="Trợ lý du lịch AI VinaTap"
        >
          <span className="vnn-floating-widget__icon-wrap">
            <img
              src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
              alt="AI Travel Companion"
              className="vnn-floating-widget__logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="vnn-floating-widget__pulse" />
          </span>
        </button>
      </div>

      <ProvinceChatbot
        province={{
          name: "Lịch trình 3 tuần xuyên Việt",
          slug: "3-week-vietnam-itinerary",
        }}
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        hideFab={true}
      />

      {/* ─── SEARCH MODAL ─── */}
      {searchModalOpen && (
        <div
          className="vnn-search-modal"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="vnn-search-modal__box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vnn-search-modal__header">
              <h3>
                {lang === "vi"
                  ? "Tìm kiếm cẩm nang & điểm đến"
                  : "Search guides & destinations"}
              </h3>
              <button
                type="button"
                className="vnn-search-modal__close"
                onClick={() => setSearchModalOpen(false)}
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
                    lang === "vi"
                      ? "Nhập tên thành phố (Hà Nội, Hội An, Sapa, Đà Nẵng...)..."
                      : "Type city name (Hanoi, Hoi An, Nha Trang, Da Nang...)..."
                  }
                  value={searchModalText}
                  onChange={(e) => setSearchModalText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="vnn-search-quick-tags">
                <span>{lang === "vi" ? "Gợi ý:" : "Suggestions:"}</span>
                {[
                  "Ho Chi Minh",
                  "Nha Trang",
                  "Da Nang",
                  "Hoi An",
                  "Hanoi",
                  "Ha Long",
                  "Ninh Binh",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchModalText(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDITORIAL FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "60px" }}>
        <div className="home-footer__bottom">
          <p>
            © 2026 VinaTap. Tất cả quyền được bảo lưu. Cẩm nang du lịch 34 tỉnh thành
            Việt Nam.
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
