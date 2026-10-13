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
        id: "th-1",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/todo-1.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "th-2",
        title: "8 Best Things to Do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "14 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/todo-2.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "th-3",
        title: "5 Best Beaches in Vung Tau",
        titleVi: "5 bãi biển đẹp nhất tại Vũng Tàu",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Experiences",
        img: "/guide/megamenu/todo-3.jpg",
        link: "/guide/5-best-vung-tau-beaches",
      },
      {
        id: "th-4",
        title: "Ao Dai: Vietnamese Traditional Dress",
        titleVi: "Áo Dài: Quốc phục truyền thống Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Culture",
        img: "/guide/megamenu/todo-4.jpg",
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

// ─── 6 DESTINATIONS DATA (10 DAYS IN VIETNAM) ───
const ITINERARY_6_DESTINATIONS = [
  {
    num: 1,
    name: "Ho Chi Minh City",
    nameVi: "TP. Hồ Chí Minh",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-1-hcmc.jpg",
    thingsToDo:
      "War Remnants Museum, Ben Thanh Market, Saigon Skydeck, Cu Chi Tunnels, Bui Vien Street.",
    thingsToDoVi:
      "Bảo tàng Chứng tích Chiến tranh, Chợ Bến Thành, Saigon Skydeck, Địa đạo Củ Chi, Phố Bùi Viện.",
    nextRoute: "Ho Chi Minh City → Nha Trang",
    nextRouteVi: "TP. Hồ Chí Minh → Nha Trang",
    transport: "Train",
    transportVi: "Tàu hỏa (Đường sắt Việt Nam)",
    time: "8 hr 30 min",
    timeVi: "8 giờ 30 phút",
    fare: "300,000 VND",
    fareVi: "300.000 VNĐ",
  },
  {
    num: 2,
    name: "Nha Trang",
    nameVi: "Nha Trang",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/10-day-dest-2-nhatrang.jpg",
    thingsToDo:
      "Nha Trang Beach, Hon Tre Island, Po Nagar Cham Towers, Long Son Pagoda.",
    thingsToDoVi:
      "Bãi biển Nha Trang, Đảo Hòn Tre, Tháp Bà Po Nagar, Chùa Long Sơn.",
    nextRoute: "Nha Trang → Da Nang",
    nextRouteVi: "Nha Trang → Đà Nẵng",
    transport: "Plane (Vietnam Airlines, Vietjet Air, Pacific Airlines, and Bamboo Airways)",
    transportVi: "Máy bay (Vietnam Airlines, Vietjet Air, Pacific Airlines và Bamboo Airways)",
    time: "1 hr 5 min",
    timeVi: "1 giờ 5 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ",
    isFlight: true,
  },
  {
    num: 3,
    name: "Da Nang",
    nameVi: "Đà Nẵng",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-3-danang.jpg",
    thingsToDo:
      "Ba Na Hills, My Khe Beach, Marble Mountains, Museum of Cham Sculpture.",
    thingsToDoVi:
      "Bà Nà Hills, Bãi biển Mỹ Khê, Ngũ Hành Sơn, Bảo tàng Điêu khắc Chăm.",
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
    num: 4,
    name: "Hoi An",
    nameVi: "Hội An",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-4-hoian.jpg",
    thingsToDo:
      "Hoi An Ancient Town, An Bang Beach, Bay Mau Coconut Forest.",
    thingsToDoVi:
      "Phố cổ Hội An, Biển An Bàng, Rừng dừa Bảy Mẫu.",
    nextRoute: "Hoi An → Ha Long Bay",
    nextRouteVi: "Hội An → Vịnh Hạ Long",
    transport: "Plane (Da Nang to Hai Phong / Van Don Airport)",
    transportVi: "Máy bay (Đà Nẵng đi Sân bay Cát Bi Hải Phòng hoặc Vân Đồn)",
    time: "1 hr 15 min",
    timeVi: "1 giờ 15 phút",
    fare: "800,000 – 1,200,000 VND",
    fareVi: "800.000 – 1.200.000 VNĐ",
    isFlight: true,
  },
  {
    num: 5,
    name: "Ha Long Bay",
    nameVi: "Vịnh Hạ Long",
    days: "1 day",
    daysVi: "1 ngày",
    image: "/guide/vietnam/10-day-dest-5-halong.jpg",
    thingsToDo:
      "Ha Long Bay, Tuan Chau Island, Sung Sot Cave.",
    thingsToDoVi:
      "Vịnh Hạ Long, Đảo Tuần Châu, Hang Sửng Sốt.",
    nextRoute: "Ha Long Bay → Hanoi",
    nextRouteVi: "Vịnh Hạ Long → Hà Nội",
    transport: "Bus (Limousine Express)",
    transportVi: "Xe Limousine cao tốc",
    time: "2 hr 30 min",
    timeVi: "2 giờ 30 phút",
    fare: "150,000 – 250,000 VND",
    fareVi: "150.000 – 250.000 VNĐ",
  },
  {
    num: 6,
    name: "Hanoi",
    nameVi: "Hà Nội",
    days: "2 days",
    daysVi: "2 ngày",
    image: "/guide/vietnam/10-day-dest-6-hanoi.jpg",
    thingsToDo:
      "Hoan Kiem Lake, Hanoi Old Quarter, Temple of Literature, Dong Xuan Market, Ho Chi Minh Mausoleum.",
    thingsToDoVi:
      "Hồ Hoàn Kiếm, Phố cổ Hà Nội, Văn Miếu – Quốc Tử Giám, Chợ Đồng Xuân, Lăng Chủ tịch Hồ Chí Minh.",
    isHanoiEnd: true,
    endNote:
      "You can take bus number 86 (35,000 VND) to Noi Bai International Airport from Hanoi city center, ending your 10-day itinerary in Vietnam.",
    endNoteVi:
      "Bạn có thể đi xe buýt số 86 (35.000 VNĐ) ra Sân bay Quốc tế Nội Bài từ trung tâm thành phố Hà Nội, kết thúc chuyến hành trình 10 ngày tại Việt Nam.",
  },
];

export default function TenDaysInVietnamPage() {
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
              onMouseEnter={() => setActiveMegaMenu("thingsToDo")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "thingsToDo" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => setActiveMegaMenu("eatDrink")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "eatDrink" ? "is-active" : ""}`}
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
                className={`vnn-navbar__link is-active`}
              >
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <HeaderSearch />
            <LanguageSwitch />
          </div>
        </div>

        {/* ─── MEGAMENU DROPDOWN ─── */}
        {activeMegaMenu && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <div className="vnn-megamenu__inner">
              {activeMegaMenu === "destinations" ? (
                <div className="vnn-megamenu__grid vnn-megamenu__grid--regions">
                  {MEGA_MENUS_DATA.destinations.regions.map((region, idx) => (
                    <div key={idx} className="vnn-megamenu__region-col">
                      <h4 className="vnn-megamenu__region-title">
                        {isVi ? region.name : region.nameEn}
                      </h4>
                      <ul className="vnn-megamenu__province-list">
                        {region.provinces.map((prov) => (
                          <li key={prov.slug}>
                            <Link
                              href={`/province/${prov.slug}`}
                              className="vnn-megamenu__province-link"
                              onClick={() => setActiveMegaMenu(null)}
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
                <div className="vnn-megamenu__grid">
                  {MEGA_MENUS_DATA[activeMegaMenu]?.items?.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="vnn-megamenu__card"
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      <div className="vnn-megamenu__img-wrap">
                        <img
                          src={item.img}
                          alt={isVi ? item.titleVi : item.title}
                          className="vnn-megamenu__img"
                          loading="lazy"
                        />
                        <span className="vnn-megamenu__badge">{item.badge}</span>
                      </div>
                      <div className="vnn-megamenu__card-body">
                        <span className="vnn-megamenu__date">
                          {isVi ? item.dateVi : item.date}
                        </span>
                        <h4 className="vnn-megamenu__card-title">
                          {isVi ? item.titleVi : item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO BANNER (SCREENSHOT 1) ─── */}
      <section className="omi-hero">
        <div className="omi-hero__media">
          <img
            src="/guide/vietnam/10-day-vietnam-hero.jpg"
            alt="10 Days in Vietnam - Coastal Train Hai Van Pass"
            className="omi-hero__img"
            priority="true"
          />
          <div className="omi-hero__overlay" />
        </div>

        <div className="omi-hero__content">
          <div className="omi-hero__badges">
            <span className="omi-hero__badge">ITINERARY</span>
            <span className="omi-hero__badge">THINGS TO DO</span>
          </div>

          <h1 className="omi-hero__title">
            {isVi ? "Lịch trình 10 ngày tại Việt Nam" : "10 Days in Vietnam"}
          </h1>

          <p className="omi-hero__byline">
            {isVi
              ? "Bởi Welcome to Vietnam   21 Tháng 5, 2024"
              : "By Welcome to Vietnam   May 21, 2024"}
          </p>

          <button
            type="button"
            className="omi-hero__cta"
            onClick={() => setAiCompanionOpen(true)}
          >
            <Sparkles size={16} />
            <span>
              {isVi
                ? "Tạo chuyến đi Việt Nam của bạn trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </button>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="omi-container">
        {/* ─── SECTION 2: MAP & INTRO (SCREENSHOT 2 & 3) ─── */}
        <section className="omi-map-section">
          <h2 className="omi-section-title">
            {isVi
              ? "Bản đồ lịch trình 10 ngày tại Việt Nam"
              : "10-day Vietnam itinerary map"}
          </h2>

          <p className="omi-map-intro">
            {isVi
              ? "Chúng tôi rất vui mừng giới thiệu đến bạn lịch trình 10 ngày đưa bạn đến những điểm đến quyến rũ nhất trải dọc khắp ba miền Bắc, Trung, Nam của Việt Nam. Lịch trình này bao gồm tổng cộng sáu điểm đến chính: TP. Hồ Chí Minh → Nha Trang → Đà Nẵng → Hội An → Vịnh Hạ Long → Hà Nội. Lựa chọn hành trình này, bạn sẽ được trải nghiệm trọn vẹn sự đa dạng, giàu bản sắc về văn hóa, lịch sử cùng những cảnh quan thiên nhiên tráng lệ nhất của Việt Nam."
              : "We are excited to offer you a 10-day itinerary that takes you to some of the most alluring destinations across Vietnam's North, Central, and South regions. This itinerary covers a total of six destinations, as outlined below: Ho Chi Minh City → Nha Trang → Da Nang → Hoi An → Ha Long Bay → Hanoi. By following this itinerary, you will get to experience the diverse and captivating culture, history, and landscapes that Vietnam has to offer."}
          </p>

          {/* Interactive Zoom Map Box */}
          <div
            className="omi-map-card"
            onClick={() => setIsMapModalOpen(true)}
            title={isVi ? "Nhấp để xem bản đồ phóng to" : "Click to view full map"}
          >
            <img
              src="/guide/vietnam/10-day-vietnam-itinerary-full-map.jpg"
              alt={
                isVi
                  ? "Bản đồ lịch trình 10 ngày khám phá Việt Nam 6 điểm đến"
                  : "10-day Vietnam itinerary route map"
              }
              className="omi-map-img"
              loading="lazy"
            />
            <div className="omi-map-badge">
              <Maximize2 size={16} />
              <span>{isVi ? "Xem bản đồ phóng to" : "Click to zoom"}</span>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: TRIPION AI PROMPT & PDF DOWNLOAD (SCREENSHOT 3) ─── */}
        <div className="omi-customize-box">
          <h3 className="omi-customize-title">
            {isVi ? "Bạn muốn tùy chỉnh theo ý mình?" : "Want to make it your own?"}
          </h3>

          <p className="omi-customize-text">
            {isVi ? (
              <>
                Mở{" "}
                <a
                  href="https://tripion.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="omi-link"
                >
                  Tripion.ai
                </a>{" "}
                và nhập prompt như: &ldquo;
                <strong>Lên lịch trình 10 ngày du lịch Việt Nam</strong>&rdquo;.
                Tripion sẽ xây dựng lộ trình liên thành phố cá nhân hóa, tối ưu
                tuyến đường và phương tiện, đồng thời điều chỉnh hoàn hảo theo
                phong cách du lịch của bạn.
              </>
            ) : (
              <>
                Open{" "}
                <a
                  href="https://tripion.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="omi-link"
                >
                  Tripion.ai
                </a>{" "}
                and enter a prompt such as &ldquo;
                <strong>Create a 10-day Vietnam itinerary.</strong>&rdquo; Tripion
                will build a personalized multi-city journey, help you optimize
                routes and transportation, and tailor the trip to your travel
                style.
              </>
            )}
          </p>

          <p className="omi-customize-text">
            {isVi
              ? "Khi đã ưng ý với lịch trình, bạn chỉ cần tải bản đồ và kế hoạch chi tiết dưới dạng tệp PDF lưu về máy."
              : "When you're happy with your itinerary, simply download your personalized travel map and detailed itinerary as a PDF."}
          </p>

          <div style={{ marginTop: "20px" }}>
            <button
              type="button"
              className="omi-btn-primary"
              onClick={handleDownloadPDF}
            >
              <Download size={18} />
              <span>
                {isVi ? "Tùy chỉnh & Tải về bản PDF" : "Customize & Download PDF"}
              </span>
            </button>
          </div>

          {/* ─── SUMMARY BOX (SCREENSHOT 4) ─── */}
          <div className="omi-summary-card">
            <h4 className="omi-summary-heading">
              {isVi ? "Tóm tắt hành trình" : "Summary"}
            </h4>
            <div className="omi-summary-item">
              <strong>{isVi ? "Số điểm đến: " : "Destinations: "}</strong>
              6
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Thời gian di chuyển (giờ): " : "Travel time (hr): "}
              </strong>
              14+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Chi phí phương tiện (USD): " : "Transportation costs (USD): "}
              </strong>
              110+
            </div>
            <div className="omi-summary-item">
              <strong>
                {isVi ? "Tổng chi phí ước tính (USD): " : "Total cost (USD): "}
              </strong>
              450+
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: ITINERARY DETAILS (SCREENSHOT 4 & 5) ─── */}
        <h2 className="omi-section-title">
          {isVi ? "Chi tiết lịch trình" : "Itinerary details"}
        </h2>

        <div className="omi-cards-grid">
          {ITINERARY_6_DESTINATIONS.map((dest) => (
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

                {dest.isHanoiEnd ? (
                  <p style={{ marginTop: "14px", fontSize: "14px", lineHeight: 1.6, color: "#334155" }}>
                    {isVi ? dest.endNoteVi : dest.endNote}
                  </p>
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
                ? "Tính đến năm 2024, tỷ giá hối đoái xấp xỉ từ USD sang VNĐ là 1 USD ≈ 25.000 VNĐ."
                : "As of 2024, the approximate exchange rate for USD to VND is 1 USD ≈ 25,000 VND."}
            </li>
            <li>
              {isVi
                ? "Thời gian di chuyển được đề cập cho từng phần của lịch trình không bao gồm thời gian cần thiết để làm thủ tục tại sân bay."
                : "The travel time mentioned for each part of the itinerary does not include the time required for airport check-in."}
            </li>
            <li>
              {isVi
                ? "10 ngày là một hành trình tinh gọn, tập trung vào những địa danh đặc sắc nhất trải dài khắp miền Nam, miền Trung và miền Bắc Việt Nam."
                : "10 days is a fast-paced trip through Vietnam, focusing on key signature highlights across South, Central, and North regions."}
            </li>
            <li>
              {isVi
                ? "Các khuyến nghị trên về khách sạn, đơn vị vận chuyển và hãng hàng không được lựa chọn dựa trên sự phù hợp, hoàn toàn không có quảng cáo hay tiếp thị liên kết, vì vậy bạn có thể hoàn toàn tin tưởng vào những gợi ý này."
                : "The above recommendations for hotels, bus operators, and airlines were selected based on suitability and without any advertising or affiliate marketing, so you can trust these suggestions."}
            </li>
            <li>
              {isVi
                ? "Nếu bạn khởi hành từ Hà Nội hoặc các tỉnh phía Bắc, bạn có thể đi ngược lại lịch trình này."
                : "If you are departing from Hanoi or the northern provinces, you can reverse the itinerary."}
            </li>
          </ul>
        </section>

        {/* ─── 10 DAYS IN VIETNAM COSTS ─── */}
        <section className="omi-costs-box">
          <h2 className="omi-section-title">
            {isVi ? "Chi phí du lịch Việt Nam 10 ngày" : "10 days in Vietnam costs"}
          </h2>
          <p className="omi-costs-intro" style={{ textAlign: "left", marginBottom: "16px" }}>
            {isVi
              ? "Nhiều du khách có thể dự trù chi tiêu khoảng 450 USD cho chuyến du lịch 10 ngày tại Việt Nam. Dưới đây là một số chi phí cố định ước tính giúp bạn lên kế hoạch ngân sách:"
              : "Many tourists can expect to spend around $450 for a 10-day trip to Vietnam. Here are some estimated fixed costs to help with your budget planning:"}
          </p>

          <ul className="omi-notes-list" style={{ marginTop: "12px" }}>
            <li>
              {isVi
                ? "Chi phí di chuyển khoảng 110 USD. Đặt vé máy bay và vé tàu sớm có thể giúp bạn có được mức giá thấp hơn."
                : "Transportation costs are approximately $110. Booking flights and trains in advance can help you secure lower prices."}
            </li>
            <li>
              {isVi ? (
                <>
                  Khách sạn riêng và homestay có giá khoảng 15–20 USD mỗi đêm. Du khách đi một mình có thể cân nhắc các hostel, một lựa chọn tiết kiệm hơn với giá khoảng 5 USD mỗi đêm. Tìm hiểu thêm về các lựa chọn{" "}
                  <Link href="/guide/where-to-stay-in-ho-chi-minh-city" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                    chỗ ở
                  </Link>{" "}
                  tại Việt Nam.
                </>
              ) : (
                <>
                  Private hotels and homestays cost around $15–$20 per night. Solo travelers can consider hostels, which are a more economical option at around $5 per night. Learn more about{" "}
                  <Link href="/guide/where-to-stay-in-ho-chi-minh-city" style={{ color: "#00c2cb", textDecoration: "underline" }}>
                    accommodation
                  </Link>{" "}
                  options in Vietnam.
                </>
              )}
            </li>
            <li>
              {isVi
                ? "Chi phí ăn uống ước tính khoảng 15 USD mỗi người mỗi ngày."
                : "Food expenses are estimated at $15 per person per day."}
            </li>
            <li>
              {isVi
                ? "Giá vé tham quan các di tích, viện bảo tàng và điểm du lịch thường dao động từ 1 đến 5 USD."
                : "Admission fees for monuments, museums, and attractions typically range from $1 to $5."}
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

            <Link
              href="/guide/1-month-in-vietnam"
              className="omi-other-itin-card"
            >
              <div className="omi-other-itin-img-wrap">
                <img
                  src="/guide/vietnam/1-month-in-vietnam-itinerary-map.jpg"
                  alt="1-month Vietnam Itinerary"
                  className="omi-other-itin-img"
                  loading="lazy"
                />
              </div>
              <span className="omi-other-itin-caption">
                {isVi ? "Lịch trình 1 tháng tại Việt Nam" : "1-month Vietnam Itinerary"}
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
              href="/guide/2-weeks-in-vietnam"
              className="omi-related-card"
            >
              <div className="omi-related-img-wrap">
                <img
                  src="/guide/megamenu/itin-3-2weeks.jpg"
                  alt="2 Weeks in Vietnam"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi ? "Lịch trình 2 tuần xuyên Việt" : "2 Weeks in Vietnam"}
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
                  src="/guide/hcmc/Top-8-things-to-do-in-Nha-Trang-Vietnamnomad.jpg"
                  alt="8 best things to do in Nha Trang"
                  className="omi-related-img"
                  loading="lazy"
                />
              </div>
              <h3 className="omi-related-card-title">
                {isVi
                  ? "8 trải nghiệm tuyệt nhất tại Nha Trang"
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
              src="/guide/vietnam/10-day-vietnam-itinerary-full-map.jpg"
              alt="Bản đồ hành trình 10 ngày khám phá Việt Nam 6 điểm đến"
              className="vnn-lightbox-img"
            />
            <p className="vnn-lightbox-caption">
              {isVi
                ? "Bản đồ hành trình 10 ngày khám phá 6 điểm đến nổi tiếng nhất Việt Nam"
                : "10-Day Vietnam Itinerary Map: 6 Signature Destinations from South to North"}
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
