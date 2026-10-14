"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import NavbarAuthButton from "@/components/ui/NavbarAuthButton";
import HeaderSearch from "@/components/ui/HeaderSearch";
import { getLang } from "@/lib/prefs";
import { ChevronDown } from "lucide-react";
import "@/styles/home.css";
import "@/styles/climate-of-vietnam.css";

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
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
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
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "things-2",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "things-3",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-4-20things.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "things-4",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan tuyệt nhất tại Đà Lạt",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/guide/the-15-best-attractions-in-dalat",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon không thể bỏ lỡ tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Soul of Vietnamese Cuisine",
        titleVi: "Phở – Linh hồn ẩm thực Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon độc đáo tại Vũng Tàu",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-Week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-1-3weeks.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam Itinerary",
        titleVi: "Lịch trình 10 ngày khám phá Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam Itinerary",
        titleVi: "Lịch trình 2 tuần khám phá trọn vẹn",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam Itinerary",
        titleVi: "Lịch trình 1 tháng trải nghiệm Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

// ─── RELATED WEATHER MAP ARTICLES (MATCHING SCREENSHOT 2 & 3) ───
const RELATED_WEATHER_ARTICLES = [
  {
    id: "weather-september",
    title: "Vietnam Weather Map for September",
    titleVi: "Bản Đồ Thời Tiết Việt Nam Tháng 9",
    img: "/guide/climate/vietnam-weather-map-september.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
  },
  {
    id: "weather-august",
    title: "Vietnam Weather Map for August",
    titleVi: "Bản Đồ Thời Tiết Việt Nam Tháng 8",
    img: "/guide/climate/vietnam-weather-map-august.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
  },
  {
    id: "weather-july",
    title: "Vietnam Weather Map for July",
    titleVi: "Bản Đồ Thời Tiết Việt Nam Tháng 7",
    img: "/guide/climate/vietnam-weather-map-july.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
  },
];

export default function ClimateOfVietnamPage() {
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
    <div className="climate-page-wrap">
      {/* ─── STICKY PROMO TOP BANNER ─── */}
      <div className="climate-promo-banner">
        <div className="climate-promo-banner__content">
          <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/guide/hcmc/Vietnamnomad-header-banner-mobile-2026.jpg"
              />
              <img
                src="/guide/top-banner-companion.png"
                alt="Free AI Travel Assistant - AI Companion"
                className="climate-promo-banner__img"
              />
            </picture>
          </Link>
        </div>
      </div>

      {/* ─── EDITORIAL NAVBAR ─── */}
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
            <div className="vnn-navbar__divider" />
            <LanguageSwitch />
            <NavbarAuthButton />
          </div>
        </div>

        {/* ─── MEGAMENU DROPDOWN ─── */}
        {activeMenu && MEGA_MENUS_DATA[activeMenu] && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="vnn-megamenu__container">
              <div className="vnn-megamenu__grid">
                {MEGA_MENUS_DATA[activeMenu].items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-megamenu__card group"
                    onClick={() => setActiveMenu(null)}
                  >
                    <div className="vnn-megamenu__thumb">
                      <img src={item.img} alt={item.title} loading="lazy" />
                      {item.badge && (
                        <span className="vnn-megamenu__badge">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="vnn-megamenu__info">
                      <span className="vnn-megamenu__date">
                        {isVi ? item.dateVi : item.date}
                      </span>
                      <h4 className="vnn-megamenu__title">
                        {isVi ? item.titleVi : item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION (MATCHING SCREENSHOT 1) ─── */}
      <section
        className="climate-hero"
        style={{
          backgroundImage: "url('/guide/climate/climate-of-vietnam-hero.jpg')",
        }}
      >
        <div className="climate-hero__overlay" />
        <div className="climate-hero__content">
          <div className="climate-badges-wrap">
            <span className="climate-badge">{isVi ? "THỜI TIẾT" : "WEATHER"}</span>
            <span className="climate-badge">WIKI</span>
          </div>
          <h1 className="climate-hero__title">
            {isVi ? "Khí Hậu Việt Nam" : "Climate of Vietnam"}
          </h1>
          <div className="climate-hero__meta">
            {isVi
              ? "Bởi Welcome to Vietnam  |  27 Tháng 7, 2024"
              : "By Welcome to Vietnam    July 27, 2024"}
          </div>
        </div>
      </section>

      {/* ─── FLOATING ACTION BUTTON ─── */}
      <div className="climate-cta-wrap">
        <Link
          href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
          className="climate-cta-btn"
        >
          {isVi
            ? "Tạo chuyến đi Việt Nam trong vài giây"
            : "Create your Vietnam trip in seconds"}
        </Link>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="climate-body">
        {/* INTRO PARAGRAPH */}
        <p className="climate-intro-text">
          {isVi ? (
            <>
              Việt Nam có diện tích hơn 331.000 km², trải dài theo phương kinh tuyến
              từ Bắc vào Nam hơn 1.650 km với đường bờ biển dài hơn 3.260 km. Về mặt
              hành chính,{" "}
              <Link
                href="/guide/the-complete-guide-to-vietnam"
                className="climate-intro-highlight"
              >
                Việt Nam
              </Link>{" "}
              được chia thành ba miền: Bắc, Trung và Nam, với 63 tỉnh thành. Dưới
              đây là tổng quan nhanh về địa lý và khí hậu của từng vùng.
            </>
          ) : (
            <>
              Vietnam covers an area of over 331,000 square kilometers, stretching
              longitudinally from north to south over 1,650 kilometers with a coastline
              of more than 3,260 kilometers. Administratively,{" "}
              <Link
                href="/guide/the-complete-guide-to-vietnam"
                className="climate-intro-highlight"
              >
                Vietnam
              </Link>{" "}
              is divided into three regions: North, Central, and South, with 63
              provinces and cities. Here is a quick overview of the geography and
              climate of each region.
            </>
          )}
        </p>

        {/* THREE REGIONS (MATCHING SCREENSHOT 2) */}
        <div className="climate-regions">
          {/* REGION 1: NORTHERN VIETNAM */}
          <div className="climate-region-block">
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="climate-region-title"
            >
              {isVi ? "Miền Bắc Việt Nam" : "Northern Vietnam"}
            </Link>
            <p className="climate-region-desc">
              {isVi
                ? "Miền Bắc Việt Nam bao gồm ba tiểu vùng: Tây Bắc, Đông Bắc và Đồng bằng sông Hồng, với 25 tỉnh thành. Địa hình đa dạng bao gồm núi non, đồng bằng, bờ biển và thềm lục địa. Vùng Tây Bắc và Đông Bắc chủ yếu là đồi núi, trong khi các đồng bằng rộng lớn nằm ở lưu vực sông Hồng. Miền Bắc mang đặc trưng khí hậu cận nhiệt đới ẩm với bốn mùa rõ rệt: mùa hè nóng ẩm từ tháng 4 đến tháng 10, và mùa đông mát mẻ, khô ráo từ tháng 11 đến tháng 3 năm sau, đôi khi có mưa phùn."
                : "Northern Vietnam consists of three sub-regions: Northwest, Northeast, and the Red River Delta, comprising 25 provinces. The terrain is diverse, including mountains, plains, coastline, and continental shelf. The Northwest and Northeast regions are mainly mountainous, while the vast plains lie in the Red River basin. The North experiences a humid subtropical climate with four distinct seasons: hot and humid summers from April to October, and cool, dry winters from November to March, with occasional drizzle."}
            </p>
          </div>

          {/* REGION 2: CENTRAL VIETNAM */}
          <div className="climate-region-block">
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="climate-region-title"
            >
              {isVi ? "Miền Trung Việt Nam" : "Central Vietnam"}
            </Link>
            <p className="climate-region-desc">
              {isVi
                ? "Miền Trung Việt Nam được chia thành ba tiểu vùng: Bắc Trung Bộ, Duyên hải Nam Trung Bộ và Tây Nguyên, gồm 19 tỉnh thành. Địa hình phong phú với núi cao ở phía tây và dải đồng bằng ven biển hẹp ở phía đông. Khí hậu có sự khác biệt giữa Bắc Trung Bộ và Nam Trung Bộ, trong đó Nam Trung Bộ khô ráo hơn. Một điểm đặc trưng của khí hậu miền Trung là mùa mưa và mùa khô không trùng khớp với miền Bắc và miền Nam. Nhìn chung, miền Trung ít mưa vào mùa hè và mưa nhiều vào mùa đông. Khu vực Tây Nguyên có khí hậu tương tự như miền Nam Việt Nam."
                : "Central Vietnam is divided into three sub-regions: North Central Coast, South Central Coast, and Central Highlands, comprising 19 provinces. The terrain is varied, with mountains in the west and narrow coastal plains in the east. The climate differs between the North Central Coast and the South Central Coast, with the latter being drier. A distinctive feature of Central Vietnam's climate is that its rainy and dry seasons do not coincide with those of the northern and southern regions. Generally, Central Vietnam experiences less rain in the summer and more rain in the winter. The Central Highlands share a climate similar to that of Southern Vietnam."}
            </p>
          </div>

          {/* REGION 3: SOUTHERN VIETNAM */}
          <div className="climate-region-block">
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="climate-region-title"
            >
              {isVi ? "Miền Nam Việt Nam" : "Southern Vietnam"}
            </Link>
            <p className="climate-region-desc">
              {isVi
                ? "Miền Nam Việt Nam chia thành hai tiểu vùng: Đông Nam Bộ và Đồng bằng sông Cửu Long, gồm 19 tỉnh thành. Địa hình nhìn chung bằng phẳng, chủ yếu là các đồng bằng phù sa màu mỡ do hệ thống sông Đồng Nai và sông Mê Kông bồi đắp. Đồng bằng sông Cửu Long là vùng đất trũng thấp, một số khu vực thấp hơn mực nước biển, thường xuyên chịu ngập lụt theo mùa. Miền Nam có khí hậu nhiệt đới gió mùa điển hình với hai mùa rõ rệt: mùa mưa từ tháng 5 đến tháng 11 và mùa khô từ tháng 12 đến tháng 4, nhiệt độ cao duy trì quanh năm với mức trung bình khoảng 27°C."
                : "Southern Vietnam is divided into two sub-regions: Southeast and the Mekong River Delta, comprising 19 provinces. The terrain is generally flat, mainly consisting of alluvial plains formed by the Dong Nai and Mekong Rivers. The Mekong Delta is a low-lying region, with some areas below sea level, prone to frequent flooding. The South has a tropical monsoon climate with two distinct seasons: the rainy season from May to November and the dry season from December to April, with high temperatures year-round, averaging about 27°C."}
            </p>
          </div>
        </div>

        {/* TAGS SECTION (MATCHING SCREENSHOT 2) */}
        <div className="climate-tags-wrap">
          <span className="climate-tag-label">{isVi ? "THẺ" : "TAGS"}</span>
          <Link
            href="/guide/climate-of-vietnam"
            className="climate-tag-btn"
          >
            {isVi ? "Khí hậu Việt Nam" : "Vietnam climate"}
          </Link>
          <Link
            href="/guide/climate-of-vietnam"
            className="climate-tag-btn"
          >
            {isVi ? "Thời tiết Việt Nam" : "Vietnam weather"}
          </Link>
        </div>

        {/* RELATED ARTICLES SECTION (MATCHING SCREENSHOT 2 & 3) */}
        <section className="climate-related-section">
          <h2 className="climate-related-title">
            {isVi ? "Bài Viết Liên Quan" : "Related Articles"}
          </h2>
          <div className="climate-related-grid">
            {RELATED_WEATHER_ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={article.link}
                className="climate-related-card group"
              >
                <div className="climate-related-thumb">
                  <img
                    src={article.img}
                    alt={isVi ? article.titleVi : article.title}
                    loading="lazy"
                  />
                </div>
                <h3 className="climate-related-card-title">
                  {isVi ? article.titleVi : article.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ─── AI CHATBOT & FOOTER ─── */}
      <ProvinceChatbot />
      <PublicFooter />
    </div>
  );
}
