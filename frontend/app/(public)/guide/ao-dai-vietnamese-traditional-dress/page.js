"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
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
  Heart,
  Share2,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/complete-guide.css";
import "@/styles/twenty-best-things.css";
import "@/styles/ao-dai-article.css";

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
        titleVi: "20 trải nghiệm tuyệt vời nhất tại Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "December 31, 2024",
        dateVi: "31 Tháng 12, 2024",
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
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Ha Long Bay",
        titleVi: "Vịnh Hạ Long",
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2.jpg",
        link: "/province/quang-ninh",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3.jpg",
        link: "/province/quang-nam",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  thingsToDo: {
    items: [
      {
        id: "ttd-1",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt vời nhất tại Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "ttd-2",
        title: "10 Best Things to Do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "May 20, 2025",
        dateVi: "20 Tháng 5, 2025",
        badge: "Things to Do",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "ttd-3",
        title: "10 Best Things to Do in Da Nang",
        titleVi: "10 trải nghiệm tuyệt nhất tại Đà Nẵng",
        date: "May 20, 2025",
        dateVi: "20 Tháng 5, 2025",
        badge: "Things to Do",
        img: "/guide/megamenu/dest-4.jpg",
        link: "/province/da-nang",
      },
      {
        id: "ttd-4",
        title: "10 Best Things to Do in Hanoi",
        titleVi: "10 trải nghiệm tuyệt nhất tại Hà Nội",
        date: "May 20, 2025",
        dateVi: "20 Tháng 5, 2025",
        badge: "Things to Do",
        img: "/guide/megamenu/dest-5.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "ttd-5",
        title: "10 Best Things to Do in Hoi An",
        titleVi: "10 trải nghiệm tuyệt nhất tại Hội An",
        date: "May 20, 2025",
        dateVi: "20 Tháng 5, 2025",
        badge: "Things to Do",
        img: "/guide/megamenu/dest-3.jpg",
        link: "/province/quang-nam",
      },
    ],
  },
  eatDrink: {
    items: [
      {
        id: "ed-1",
        title: "Vietnam Food: 10 Best Dishes You Must Try",
        titleVi: "Ẩm thực Việt Nam: 10 món ngon nhất định phải thử",
        date: "January 14, 2025",
        dateVi: "14 Tháng 1, 2025",
        badge: "Must Try",
        img: "/guide/megamenu/eat-1.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "ed-2",
        title: "A Guide to Vietnamese Coffee",
        titleVi: "Khám phá hương vị cà phê Việt Nam",
        date: "January 12, 2025",
        dateVi: "12 Tháng 1, 2025",
        badge: "Culture",
        img: "/guide/megamenu/eat-2.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "ed-3",
        title: "Top 10 Street Foods in Hanoi",
        titleVi: "Top 10 món ăn đường phố Hà Nội",
        date: "February 2, 2025",
        dateVi: "2 Tháng 2, 2025",
        badge: "Street Food",
        img: "/guide/megamenu/eat-3.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "ed-4",
        title: "Saigon Street Food Tour Guide",
        titleVi: "Cẩm nang ẩm thực hè phố Sài Gòn",
        date: "February 5, 2025",
        dateVi: "5 Tháng 2, 2025",
        badge: "Street Food",
        img: "/guide/megamenu/eat-4.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "ed-5",
        title: "Central Vietnam Culinary Delights",
        titleVi: "Tinh hoa ẩm thực miền Trung",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Culinary",
        img: "/guide/megamenu/eat-5.jpg",
        link: "/province/thua-thien-hue",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        date: "April 1, 2026",
        dateVi: "1 Tháng 4, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "itin-2",
        title: "2-Week Vietnam Itinerary for First-Timers",
        titleVi: "Lịch trình 2 tuần khám phá Việt Nam cho người đi lần đầu",
        date: "February 10, 2025",
        dateVi: "10 Tháng 2, 2025",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-1.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "itin-3",
        title: "10-Day Northern Vietnam Highlights",
        titleVi: "Hành trình 10 ngày khám phá tinh hoa miền Bắc",
        date: "February 15, 2025",
        dateVi: "15 Tháng 2, 2025",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "itin-4",
        title: "7-Day Central Vietnam Heritage Trail",
        titleVi: "Con đường di sản miền Trung 7 ngày",
        date: "February 20, 2025",
        dateVi: "20 Tháng 2, 2025",
        badge: "Heritage",
        img: "/guide/megamenu/itin-3.jpg",
        link: "/province/quang-nam",
      },
      {
        id: "itin-5",
        title: "5-Day Mekong Delta & Southern Escapes",
        titleVi: "5 ngày du ngoạn miền Tây & sông nước Nam Bộ",
        date: "February 25, 2025",
        dateVi: "25 Tháng 2, 2025",
        badge: "Adventure",
        img: "/guide/megamenu/itin-4.jpg",
        link: "/province/can-tho",
      },
    ],
  },
};

export default function AoDaiArticlePage() {
  const [lang, setLang] = useState("en");
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuTimeoutRef = useRef(null);

  useEffect(() => {
    setLang(getLang());
    const onStorage = () => setLang(getLang());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isVi = lang === "vi";

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
    <div className="vnn-page-wrapper" style={{ backgroundColor: "#ffffff" }}>
      {/* ─── TOP BANNER ─── */}
      <div className="vnn-top-banner">
        <Link
          href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
          className="vnn-top-banner__link"
          style={{ textDecoration: "none" }}
        >
          <img
            src="/guide/top-banner-companion.png"
            alt="Free AI Travel Assistant - AI Companion"
            className="vnn-top-banner__img"
          />
        </Link>
      </div>

      {/* ─── NAVBAR ─── */}
      <header className="vnn-navbar">
        <div className="vnn-navbar__inner">
          <div className="vnn-navbar__brand">
            <Link href="/" className="vnn-navbar__logo-link">
              <Logo />
            </Link>
          </div>

          <nav className="vnn-navbar__menu">
            {/* BE INSPIRED */}
            <div
              className={`vnn-menu-item ${activeMenu === "inspired" ? "vnn-menu-item--active" : ""}`}
              onMouseEnter={() => handleMouseEnter("inspired")}
              onMouseLeave={handleMouseLeave}
            >
              <button type="button" className="vnn-menu-item__btn">
                <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-menu-chevron" />
              </button>
            </div>

            {/* DESTINATIONS */}
            <div
              className={`vnn-menu-item ${activeMenu === "destinations" ? "vnn-menu-item--active" : ""}`}
              onMouseEnter={() => handleMouseEnter("destinations")}
              onMouseLeave={handleMouseLeave}
            >
              <button type="button" className="vnn-menu-item__btn">
                <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-menu-chevron" />
              </button>
            </div>

            {/* THINGS TO DO */}
            <div
              className={`vnn-menu-item ${activeMenu === "thingsToDo" ? "vnn-menu-item--active" : ""}`}
              onMouseEnter={() => handleMouseEnter("thingsToDo")}
              onMouseLeave={handleMouseLeave}
            >
              <button type="button" className="vnn-menu-item__btn">
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-menu-chevron" />
              </button>
            </div>

            {/* EAT & DRINK */}
            <div
              className={`vnn-menu-item ${activeMenu === "eatDrink" ? "vnn-menu-item--active" : ""}`}
              onMouseEnter={() => handleMouseEnter("eatDrink")}
              onMouseLeave={handleMouseLeave}
            >
              <button type="button" className="vnn-menu-item__btn">
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-menu-chevron" />
              </button>
            </div>

            {/* ITINERARIES */}
            <div
              className={`vnn-menu-item ${activeMenu === "itineraries" ? "vnn-menu-item--active" : ""}`}
              onMouseEnter={() => handleMouseEnter("itineraries")}
              onMouseLeave={handleMouseLeave}
            >
              <button type="button" className="vnn-menu-item__btn">
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-menu-chevron" />
              </button>
            </div>
          </nav>

          <div className="vnn-navbar__actions">
            <button
              type="button"
              className="vnn-search-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <div className="vnn-navbar__lang">
              <LanguageSwitch />
            </div>
          </div>
        </div>

        {/* ─── MEGAMENU DROPDOWN ─── */}
        {activeMenu && (
          <div
            className="vnn-megamenu-dropdown"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="vnn-megamenu-grid">
              {MEGA_MENUS_DATA[activeMenu]?.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="vnn-megamenu-card"
                  onClick={() => setActiveMenu(null)}
                >
                  <div className="vnn-megamenu-card__img-wrap">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="vnn-megamenu-card__img"
                    />
                    <span className="vnn-megamenu-card__badge">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="vnn-megamenu-card__title">
                    {isVi ? item.titleVi : item.title}
                  </h4>
                  <p className="vnn-megamenu-card__date">
                    {isVi ? item.dateVi : item.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── SEARCH MODAL ─── */}
      {searchOpen && (
        <div className="vnn-search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="vnn-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vnn-search-modal__header">
              <Search size={22} className="vnn-search-modal__icon" />
              <input
                type="text"
                className="vnn-search-modal__input"
                placeholder={
                  isVi
                    ? "Tìm kiếm cẩm nang, điểm đến, trải nghiệm..."
                    : "Search guides, destinations, things to do..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="vnn-search-modal__close"
                onClick={() => setSearchOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main>
        {/* HERO BANNER (HÌNH 1) */}
        <section
          className="ad-hero"
          style={{
            backgroundImage: "url('/guide/ao-dai/hero-ao-dai.webp')",
          }}
        >
          <div className="ad-hero__overlay" />
          <div className="ad-hero__content">
            <span className="ad-badge">
              {isVi ? "BÀI VIẾT NỔI BẬT" : "FEATURED ARTICLES"}
            </span>
            <h1 className="ad-hero__title">
              {isVi
                ? "Áo Dài – Quốc phục & Nét đẹp truyền thống Việt Nam"
                : "Ao Dai – Vietnamese Traditional Dress"}
            </h1>
            <p className="ad-hero__meta">
              {isVi
                ? "Bởi Welcome to Vietnam    31 Tháng 12, 2024"
                : "By Welcome to Vietnam    December 31, 2024"}
            </p>
          </div>
        </section>

        {/* ARTICLE CONTAINER */}
        <div className="ad-article-container">
          {/* CTA BUTTON (HÌNH 1 & 2) */}
          <div className="ad-action-wrap">
            <Link
              href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
              className="ad-create-trip-btn"
            >
              <Sparkles size={18} />
              <span>
                {isVi
                  ? "Tạo chuyến đi Việt Nam trong vài giây"
                  : "Create your Vietnam trip in seconds"}
              </span>
            </Link>
          </div>

          {/* INTRO PARAGRAPH (HÌNH 2) */}
          <p className="ad-intro-text">
            {isVi ? (
              <>
                Trải qua hàng trăm năm lịch sử, tà <em>áo dài</em> (/ &apos;aʊ,daɪ/) đã
                trở thành biểu tượng sâu sắc của văn hóa Việt Nam và là hình ảnh đại diện
                tiêu biểu cho người phụ nữ Việt Nam. Áo dài giữ một vị trí quan trọng
                trong bản sắc văn hóa và ngoại giao của dân tộc Việt Nam giữa muôn vàn
                nền văn hóa phong phú trên thế giới. Nếu bạn dự định ghé thăm đất nước
                hình chữ S hoặc đơn giản muốn tìm hiểu thêm về nét đẹp nơi đây, việc thấu
                hiểu về trang phục ý nghĩa này sẽ là một trải nghiệm tuyệt vời. Bài viết
                này sẽ mang đến cho bạn toàn bộ kiến thức cần thiết về quốc phục Việt Nam,
                từ các dịp mặc áo dài cho đến những địa chỉ may áo dài uy tín nhất.
              </>
            ) : (
              <>
                For a span of hundreds of years, the <em>ao dai</em> (/ &apos;aʊ,daɪ/) has been
                a symbol of Vietnamese culture and an iconic representation of Vietnamese
                women. It holds a significant place in the cultural and diplomatic identity
                of the Vietnamese people among the rich and diverse cultures of the world.
                If you plan to visit the country or if you simply want to learn more about
                it, it is worth having a brief understanding of this meaningful image.
                This article will provide you with all the necessary knowledge about
                Vietnam&apos;s national dress, including when to wear it and where to have one
                tailored for yourself.
              </>
            )}
          </p>

          {/* FEATURED PHOTO 1: KHAI DINH TOMB (HÌNH 2) */}
          <figure className="ad-figure">
            <div className="ad-figure__img-wrap">
              <picture>
                <source
                  srcSet="/guide/ao-dai/ao-dai-national-garment.webp"
                  type="image/webp"
                />
                <img
                  src="/guide/ao-dai/ao-dai-national-garment.jpg"
                  alt="Ao dai – the Vietnamese national garment"
                  className="ad-figure__img"
                  loading="lazy"
                />
              </picture>
            </div>
            <figcaption className="ad-figure__caption">
              {isVi
                ? "Áo dài – quốc phục thiêng liêng của dân tộc Việt Nam."
                : "Ao dai – the Vietnamese national garment."}
            </figcaption>
          </figure>

          {/* ─── SECTION: THE HISTORY AND CREATION OF AO DAI (HÌNH 3 & 4) ─── */}
          <section>
            <h2 className="ad-section-heading">
              {isVi
                ? "Lịch sử và sự hình thành của áo dài"
                : "The history and creation of ao dai"}
            </h2>

            <p className="ad-section-intro">
              {isVi ? (
                <>
                  Qua những hình ảnh trên mạng, <em>áo dài</em> trông có vẻ mang thiết kế
                  đơn giản; tuy nhiên, để có được vóc dáng thanh thoát như ngày hôm nay,
                  tà áo dài đã trải qua một hành trình phát triển dài và gắn liền mật
                  thiết với từng giai đoạn lịch sử của đất nước.
                </>
              ) : (
                <>
                  From the images on the internet, the <em>ao dai</em> appears to be a
                  simple design; however, to get to how the dress looks today, it has
                  gone through a long journey and is closely connected with the
                  historical development of the country.
                </>
              )}
            </p>

            {/* 1. Ao giao lanh */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "1. Phiên bản đầu tiên của áo dài – áo giao lãnh"
                  : "1. The very first version of the ao dai – ao giao lanh"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Nguồn gốc chính xác của <em>áo dài</em> vẫn chưa thể xác định chắc
                    chắn, nhưng <em>áo giao lãnh</em> được xem là phiên bản sơ khai nhất.
                    Đó là một chiếc áo vạt dài rộng, xẻ hai bên hông từ eo xuống chân,
                    mặc kèm với thắt lưng vải và váy yếm đen bên trong. Để phân biệt
                    trang phục Đàng Trong với Đàng Ngoài, Chúa Nguyễn Phúc Khoát đã ban
                    sắc lệnh yêu cầu tất cả quan lại triều đình phải mặc áo lụa bên trong.
                    Nhiều nhà nghiên cứu cho rằng đây chính là khởi nguồn của tà{" "}
                    <em>áo dài</em>.
                  </>
                ) : (
                  <>
                    The exact origin of the <em>ao dai</em> is not known, but it is
                    believed that the <em>ao giao lanh</em> was the earliest version. It
                    was a long, loose dress cut on two sides from the waist to the legs
                    and worn with a fabric belt and a black underdress. To distinguish
                    the costume of the South from that of the North, Lord Nguyen Phuc
                    Khoat ordered all royal officers to wear a silk blouse underneath.
                    It is said that this was the start of the <em>ao dai</em>.
                  </>
                )}
              </p>
            </div>

            {/* 2. Ao tu than */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "2. Áo tứ thân" : "2. Ao tu than"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Vào thế kỷ 18, nhu cầu tăng cường lao động nông nghiệp đã dẫn đến
                    việc <em>áo giao lãnh</em> được tách thành bốn tà: hai tà trước và
                    hai tà sau có thể buộc gọn gàng khi làm việc đồng áng. Bốn tà áo còn
                    tượng trưng cho tứ thân phụ mẫu: cha mẹ của người vợ và cha mẹ của
                    người chồng.
                  </>
                ) : (
                  <>
                    In the 18th century, the need for increased agricultural work led to
                    the <em>ao giao lanh</em> being split into four pieces: two in front
                    and two in back that could be tightened during fieldwork. The four
                    flaps represent the parents of the wife and the husband.
                  </>
                )}
              </p>
            </div>

            {/* 3. Ao ngu than */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "3. Áo ngũ thân" : "3. Ao ngu than"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    <em>Áo ngũ thân</em> là phiên bản biến tấu nhẹ từ <em>áo tứ thân</em>,
                    được bổ sung thêm một tà áo lót bên trong phía trước nhằm phân biệt
                    giới quý tộc, quan chức với tầng lớp dân thường.
                  </>
                ) : (
                  <>
                    The <em>ao ngu than</em> was a slightly modified version of the{" "}
                    <em>ao tu than</em>, with an added flap in front to distinguish
                    royalty from the general population.
                  </>
                )}
              </p>
            </div>

            {/* 4. Ao dai Lemur */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "4. Áo dài Lemur" : "4. Ao dai Lemur"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Giai đoạn này được xem là bước đột phá trong quá trình tiến hóa của{" "}
                    <em>áo dài</em>, định hình tiền đề cho thiết kế hiện đại. Năm 1939,
                    dựa trên nền tảng của <em>áo ngũ thân</em>, một họa sĩ tên là Cát Tường
                    đã cách tân chiếc áo để phản ánh tầm ảnh hưởng của văn hóa Pháp vào
                    thời điểm đó. Tên gọi <em>áo dài Lemur</em> được đặt theo tên tiếng
                    Pháp của bà. Bà đã kết hợp bốn tà áo lại thành hai tà và thêm một
                    hàng cúc bấm bên sườn, thể hiện phong cách phương Tây trong thời
                    trang Việt Nam. Đáng tiếc, thiết kế này dần mất đi sự thịnh hành sau
                    năm 1943.
                  </>
                ) : (
                  <>
                    This period is considered a breakthrough in the evolution of the{" "}
                    <em>ao dai</em>, leading to its modern design. In 1939, based on the
                    foundation of the <em>ao ngu than</em>, an artist named Cat Tuong
                    updated the dress to reflect the French influence at the time. The{" "}
                    <em>ao dai Lemur</em> was named after her French name. She combined
                    the four flaps into two and added a line of buttons, reflecting
                    Western style in Vietnamese fashion. Unfortunately, this design lost
                    popularity after 1943.
                  </>
                )}
              </p>
            </div>

            {/* 5. Ao dai Le Pho */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "5. Áo dài Lê Phổ" : "5. Ao dai Le Pho"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Không lâu sau, họa sĩ Lê Phổ đã làm mới lại <em>áo dài</em> bằng
                    cách lược bỏ các yếu tố phương Tây, điều chỉnh lại kích cỡ cho vừa
                    vặn hơn và gia tăng nét yêu kiều, duyên dáng cho từng đường cong.
                    Phiên bản này rất được lòng các phu nhân quan chức trong khoảng 5 năm
                    trước khi tiếp tục chuyển biến sang giai đoạn tiếp theo.
                  </>
                ) : (
                  <>
                    Not long after, painter Le Pho revitalized the <em>ao dai</em> by
                    removing Western elements, resizing the design for a better fit, and
                    adding grace to its curves. This version was favored by government
                    officials for about five years before evolving into the next stage
                    of the iconic dress.
                  </>
                )}
              </p>
            </div>

            {/* 6. Ao dai Tran Le Xuan */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "6. Áo dài Trần Lệ Xuân" : "6. Ao dai Tran Le Xuan"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Trần Lệ Xuân, thường được biết đến với tên gọi Madame Nhu, là Đệ nhất
                    Phu nhân miền Nam Việt Nam từ năm 1955 đến năm 1963 và là phu nhân
                    của cố vấn Ngô Đình Nhu. Bà đã nhờ nhà may Thái Trúc Nha tổ chức một
                    buổi trình diễn thời trang <em>áo dài</em> trên đường Đồng Khởi – con
                    phố sầm uất nhất Sài Gòn lúc bấy giờ. Mẫu áo dài nổi bật với cổ thuyền
                    (cổ hở) tôn vinh phần cổ thon gọn và xương quai xanh thanh tú của phụ
                    nữ. Thiết kế này được Madame Nhu diện tại hầu hết các cuộc gặp gỡ
                    ngoại giao và dạ tiệc quốc tế, đưa hình ảnh áo dài đến gần hơn với
                    bạn bè thế giới.
                  </>
                ) : (
                  <>
                    Tran Le Xuan, also known as Madame Nhu, was the First Lady of South
                    Vietnam from 1955 to 1963 and the wife of the chief advisor Ngo Dinh
                    Nhu. She had Thai Truc Nha organize an <em>ao dai</em> fashion show on
                    Dong Khoi Street, the busiest street in Saigon at the time. The{" "}
                    <em>ao dai</em> featured a bateau neckline to highlight the
                    women&apos;s necklines and collarbones. This design, which was biased and
                    worn by Madame Nhu at all international meetings and parties, became
                    more visible to international friends.
                  </>
                )}
              </p>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Ban đầu, dư luận chưa sẵn sàng đón nhận phiên bản này vì cho rằng
                    tinh thần phóng khoáng của chiếc áo đi ngược với các giá trị truyền
                    thống. Tuy nhiên, thị hiếu dần dần chuyển sang yêu thích mẫu áo này
                    nhờ vào sự thanh thoát, quý phái và thoải mái mà nó mang lại.
                  </>
                ) : (
                  <>
                    At first, the public rejected this version of the <em>ao dai</em>,
                    as they believed the liberal spirit of the dress went against
                    traditional values. However, preferences eventually shifted towards
                    the dress due to its simplicity, elegance, and comfort.
                  </>
                )}
              </p>
            </div>

            {/* 7. Ao dai Raglan */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "7. Áo dài Raglan" : "7. Ao dai Raglan"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    <em>Áo dài Raglan</em> (giáp lăng) được coi là phiên bản hoàn thiện
                    nhất của tà <em>áo dài</em> hiện đại. Mẫu áo do nhà may Dũng sáng tạo
                    bằng cách nối cánh tay áo ở góc 45 độ hướng về cổ áo, mang lại sự linh
                    hoạt và cử động thoải mái hơn cho người mặc. Mẫu thiết kế ra đời từ
                    cuối thập niên 70 này đến nay vẫn là trang phục dân tộc của Việt Nam
                    và được người dân trong nước cũng như những người yêu mến thời trang,
                    văn hóa khắp thế giới tôn vinh.
                  </>
                ) : (
                  <>
                    The <em>ao dai Raglan</em> is considered the most complete version of
                    the modern <em>ao dai</em>. It was created by Tailor Dung by
                    attaching the sleeves at a 45-degree angle to the neckline, allowing
                    for more flexibility. This design, which dates back to the end of the
                    70s, remains the Vietnamese national dress and is appreciated not
                    only by the Vietnamese people, but also by fashion and culture
                    lovers around the world.
                  </>
                )}
              </p>
            </div>

            {/* 8. Modern ao dai */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "8. Áo dài hiện đại" : "8. Modern ao dai"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Trong nhịp sống hiện đại hối hả, <em>áo dài</em> tiếp tục biến chuyển
                    để hòa nhịp cùng thị hiếu đương thời. Ngày nay, áo dài đã trở nên
                    tiện dụng hơn và trải qua nhiều cuộc đổi mới sáng tạo, song vẫn giữ
                    trọn vẹn linh hồn và cốt cách nguyên bản.
                  </>
                ) : (
                  <>
                    In the fast-paced modern world, the <em>ao dai</em> has evolved to
                    keep up with changing tastes. Today, it is more practical and has
                    undergone many renovations, yet still retains its original essence.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* FEATURED PHOTO 2: STONE WALL CITADEL (HÌNH 5) */}
          <figure className="ad-figure">
            <div className="ad-figure__img-wrap">
              <picture>
                <source
                  srcSet="/guide/ao-dai/ao-dai-modern.webp"
                  type="image/webp"
                />
                <img
                  src="/guide/ao-dai/ao-dai-modern.jpg"
                  alt="The ao dai has adapted to meet the changing tastes of the people"
                  className="ad-figure__img"
                  loading="lazy"
                />
              </picture>
            </div>
            <figcaption className="ad-figure__caption">
              {isVi
                ? "Tà áo dài không ngừng biến chuyển để hòa nhịp cùng thị hiếu đương đại của người dân."
                : "The ao dai has adapted to meet the changing tastes of the people."}
            </figcaption>
          </figure>

          {/* ─── SECTION: THE PRACTICE OF WEARING AO DAI (HÌNH 5) ─── */}
          <section>
            <h2 className="ad-section-heading">
              {isVi
                ? "Tập quán và các dịp mặc áo dài"
                : "The practice of wearing ao dai"}
            </h2>

            <p className="ad-section-intro">
              {isVi ? (
                <>
                  Những năm gần đây, một xu hướng rất tích cực là ngày càng có nhiều
                  người, đặc biệt là giới trẻ, yêu thích và tự hào tôn vinh tà{" "}
                  <em>áo dài</em> bằng cách lựa chọn trang phục này cho các sự kiện trọng
                  đại. Bên cạnh đó, có những dịp trang trọng mà <em>áo dài</em> được quy
                  định như một đồng phục bắt buộc hơn là trang phục tùy chọn. Dưới đây
                  là những hoàn cảnh tiêu biểu tà áo dài luôn hiện diện:
                </>
              ) : (
                <>
                  In recent years, it has been a positive trend to see more and more
                  people, especially the young, celebrating the <em>ao dai</em> by
                  choosing it for their important events. Nevertheless, there are certain
                  occasions where the <em>ao dai</em> is worn as a mandatory dress code
                  rather than a dress of choice. Here are some situations where the
                  dress is worn:
                </>
              )}
            </p>

            <div className="ad-practice-grid">
              <div className="ad-practice-card">
                <h4 className="ad-practice-card__title">
                  <Heart size={18} />
                  {isVi ? "Lễ cưới hỏi truyền thống" : "Weddings & Engagements"}
                </h4>
                <p className="ad-practice-card__desc">
                  {isVi
                    ? "Tại lễ dạm ngõ, ăn hỏi và rước dâu, cô dâu chú rể cùng hai họ đều diện áo dài truyền thống với sắc đỏ, vàng, trắng thêu họa tiết long phụng trang nhã."
                    : "During Vietnamese engagement and wedding ceremonies, the bride, groom, and family members proudly wear elaborate ceremonial ao dai embroidered with dragons, phoenixes, or floral motifs."}
                </p>
              </div>

              <div className="ad-practice-card">
                <h4 className="ad-practice-card__title">
                  <Calendar size={18} />
                  {isVi ? "Dịp Tết Nguyên Đán" : "Lunar New Year (Tet Holiday)"}
                </h4>
                <p className="ad-practice-card__desc">
                  {isVi
                    ? "Vào dịp đầu xuân năm mới, dạo phố du xuân, viếng chùa đầu năm và chúc Tết trong tà áo dài rực rỡ đã trở thành nét đẹp văn hóa không thể thiếu của mọi thế hệ."
                    : "During the first days of Spring, strolling down festive streets, visiting temples, and wishing elders Happy New Year in vibrant ao dai has become an indispensable tradition for generations."}
                </p>
              </div>

              <div className="ad-practice-card">
                <h4 className="ad-practice-card__title">
                  <Sparkles size={18} />
                  {isVi ? "Đồng phục nữ sinh trung học" : "High School Uniforms"}
                </h4>
                <p className="ad-practice-card__desc">
                  {isVi
                    ? "Tà áo dài trắng tinh khôi bay trong gió chiều tan trường là hình ảnh biểu tượng gắn liền với nét đẹp ngây thơ, thuần khiết của nữ sinh Việt Nam."
                    : "The pure white ao dai flowing gently on school bicycles after class remains one of the most poetic and timeless symbols of Vietnamese youth and education."}
                </p>
              </div>

              <div className="ad-practice-card">
                <h4 className="ad-practice-card__title">
                  <Compass size={18} />
                  {isVi ? "Ngoại giao & Hội nghị quốc tế" : "Diplomatic & State Events"}
                </h4>
                <p className="ad-practice-card__desc">
                  {isVi
                    ? "Tại các diễn đàn ngoại giao, hội nghị thượng đỉnh quốc tế (như APEC) và các cuộc gặp cấp cao, áo dài luôn là quốc phục đại diện cho thể diện quốc gia."
                    : "At global diplomatic summits, cultural exchanges, and official receptions, the ao dai represents Vietnam's sovereign pride, poise, and dignified elegance on the world stage."}
                </p>
              </div>
            </div>
          </section>

          {/* ─── EXPLORE MORE GUIDES ─── */}
          <section className="ad-related-section">
            <h3 className="ad-related-title">
              {isVi ? "Khám phá thêm cẩm nang du lịch" : "Explore More Guides"}
            </h3>
            <div className="ad-related-grid">
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
                <h4 className="cg-explore-card__title">
                  {isVi
                    ? "Cẩm nang du lịch toàn diện Việt Nam"
                    : "The Complete Guide to Vietnam"}
                </h4>
              </Link>

              <Link
                href="/guide/20-best-things-to-do-in-vietnam"
                className="cg-explore-card"
              >
                <div className="cg-explore-card__img-wrap">
                  <img
                    src="/guide/megamenu/inspired-4.jpg"
                    alt="20 Best Things to Do in Vietnam"
                    className="cg-explore-card__img"
                  />
                </div>
                <h4 className="cg-explore-card__title">
                  {isVi
                    ? "20 trải nghiệm tuyệt vời nhất tại Việt Nam"
                    : "20 Best Things to Do in Vietnam"}
                </h4>
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
                <h4 className="cg-explore-card__title">
                  {isVi
                    ? "15 địa điểm đẹp nhất Việt Nam năm 2026"
                    : "15 best places to visit in Vietnam in 2026"}
                </h4>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "60px" }}>
        <div className="home-footer__bottom">
          <p>
            {isVi
              ? "© 2026 VinaTap. Tất cả quyền được bảo lưu. Cẩm nang du lịch 34 tỉnh thành Việt Nam."
              : "© 2026 VinaTap. All rights reserved. Travel guide to 34 provinces of Vietnam."}
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

      {/* ─── FLOATING CHATBOT ─── */}
      <ProvinceChatbot />
    </div>
  );
}
