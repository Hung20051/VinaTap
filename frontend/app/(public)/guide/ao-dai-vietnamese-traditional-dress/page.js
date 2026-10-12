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
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const menuTimeoutRef = useRef(null);

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLang);
    return () => window.removeEventListener("vinatap:lang-updated", handleLang);
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
          style={{ textDecoration: "none", display: "block", width: "100%" }}
        >
          <div className="vnn-top-banner__inner">
            <img
              src="/guide/top-banner-companion.png"
              alt={
                isVi
                  ? "Trợ lý Du lịch AI VinaTap - Đồng hành mọi chuyến đi"
                  : "Free AI Travel Assistant - AI Companion"
              }
              className="vnn-top-banner__img"
            />
          </div>
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
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
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

            {/* 1. Wearing the ao dai as a uniform */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Mặc áo dài như đồng phục (Học sinh & Công sở)"
                  : "Wearing the ao dai as a uniform"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Việc lựa chọn <em>áo dài</em> làm đồng phục là nỗ lực của các nhà
                    quản lý nhằm gìn giữ nét đẹp truyền thống trong thế hệ trẻ. Áo dài
                    chủ yếu được mặc tại các trường trung học phổ thông và đại học,
                    thường mang sắc trắng tinh khôi, kết hợp cùng quần trắng hoặc đen.
                    Gần đây, nhiều doanh nghiệp và cơ quan chính phủ như ngân hàng, hãng
                    hàng không cũng lựa chọn áo dài làm hình ảnh đại diện thương hiệu.
                  </>
                ) : (
                  <>
                    The choice of the <em>ao dai</em> as a uniform is an effort made by
                    those in power to sustain its tradition among the younger
                    generation. It is mostly worn in high schools and universities,
                    typically in white, and can be paired with either white or black
                    trousers. Recently, various companies and government
                    organizations, such as banks and airlines, have also selected it as
                    a symbol of their institutions.
                  </>
                )}
              </p>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Điều này đóng góp to lớn vào việc bảo tồn và duy trì quốc phục trong
                    thời kỳ hội nhập và giao thoa mạnh mẽ với các xu hướng thời trang
                    phương Tây hiện đại.
                  </>
                ) : (
                  <>
                    This greatly contributes to the preservation of the dress during a
                    period of rapid adaptation and integration with Western fashion
                    styles.
                  </>
                )}
              </p>
            </div>

            {/* FEATURED PHOTO 3: STUDENTS & PHOENIX FLOWERS (HÌNH 1 & 2) */}
            <figure className="ad-figure">
              <div className="ad-figure__img-wrap">
                <picture>
                  <source
                    srcSet="/guide/ao-dai/ao-dai-students.webp"
                    type="image/webp"
                  />
                  <img
                    src="/guide/ao-dai/ao-dai-students.jpg"
                    alt="The ao dai is not just a costume, but also holds many cherished memories for generations of students"
                    className="ad-figure__img"
                    loading="lazy"
                  />
                </picture>
              </div>
              <figcaption className="ad-figure__caption">
                {isVi
                  ? "Tà áo dài không chỉ là một bộ trang phục, mà còn lưu giữ vô vàn ký ức tươi đẹp của biết bao thế hệ học sinh."
                  : "The ao dai is not just a costume, but also holds many cherished memories for generations of students."}
              </figcaption>
            </figure>

            {/* 2. Wearing the ao dai in engagement and wedding ceremonies */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Mặc áo dài trong lễ ăn hỏi và cưới xin"
                  : "Wearing the ao dai in engagement and wedding ceremonies"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Từ bao đời nay, <em>áo dài</em> luôn là phần không thể thiếu trong các
                    nghi lễ hôn lễ truyền thống của người Việt. Cô dâu và chú rể thường
                    khoác lên mình những bộ áo dài sắc màu rực rỡ như đỏ, hồng hoặc
                    trắng, tượng trưng cho tình yêu vĩnh cửu và hạnh phúc viên mãn. Khi
                    được diện làm trang phục cưới, áo dài thường được thêu tỉ mỉ hình
                    rồng phượng – hai linh vật thiêng liêng mang lại may mắn, bình an
                    trong văn hóa phương Đông, với niềm tin sẽ che chở cho hôn nhân bền
                    chặt. Chiếc <em>khăn đóng</em> truyền thống cũng được đội đầu để hoàn
                    thiện bộ lễ phục, biểu trưng cho sự gắn kết khăng khít của đôi lứa.
                    Không chỉ cô dâu chú rể, hai bên gia đình và đội bê tráp cũng chọn
                    áo dài để thể hiện sự trang trọng, tôn nghiêm.
                  </>
                ) : (
                  <>
                    For many years, the <em>ao dai</em> has been an integral part of
                    Vietnamese wedding ceremonies. Brides and grooms wear brightly
                    colored versions in red, pink, or white, symbolizing eternal love
                    and happiness. When worn as a wedding dress, it is often
                    embroidered with images of dragons and phoenixes, which are
                    considered sacred and powerful mascots in Eastern culture. The
                    belief is that they will protect the marriage forever. The
                    traditional turban (<em>khan dong</em>) is also worn to complete the
                    custom. This term translates directly to &quot;framed turban&quot;,
                    representing the tightly knotted relationship between the couple. Not
                    only the bride and groom, but also the entire wedding party often
                    choose to wear the <em>ao dai</em> to show formality.
                  </>
                )}
              </p>
            </div>

            {/* 3. Wearing the ao dai during the Tet holidays and other special occasions */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Mặc áo dài dịp Tết Nguyên Đán và các sự kiện đặc biệt"
                  : "Wearing the ao dai during the Tet holidays and other special occasions"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Tết Nguyên Đán là ngày lễ cổ truyền trọng đại nhất trong năm của
                    người Việt. Do đó, việc quốc phục được lựa chọn để diện trong dịp này
                    là điều vô cùng tự nhiên và thiêng liêng. Ý nghĩa ban đầu của việc
                    mặc áo dài ngày Tết là để trang trọng chào đón khoảnh khắc chuyển
                    giao năm mới và viếng chùa đầu xuân. Tuy nhiên theo thời gian, mọi
                    người còn diện áo dài nhiều hơn để chụp ảnh kỷ niệm du xuân. Người
                    Việt rất thích lưu lại những bức hình rực rỡ, và tà <em>áo dài</em>{" "}
                    càng làm cho những bức ảnh thêm lung linh sắc xuân. Dù với lý do
                    nào, việc trang phục truyền thống xuất hiện ngày càng phổ biến và các
                    giá trị văn hóa được hồi sinh mạnh mẽ trong giới trẻ là một tín hiệu
                    vô cùng đáng tự hào.
                  </>
                ) : (
                  <>
                    Tet, or Lunar New Year, is the most significant holiday in
                    Vietnam. It is, therefore, understandable that Vietnam&apos;s
                    traditional and national dress was chosen to be worn during this
                    time. The original purpose of wearing it during these holidays was
                    to formally celebrate the transition of the year. However, over
                    time, people have started wearing it more for photography
                    purposes. Vietnamese people love taking photos, and the{" "}
                    <em>ao dai</em> adds more color to them. Regardless of the reason,
                    it is important to see the traditional dress appearing more
                    frequently and the cultural values it holds once again thriving
                    among the young Vietnamese.
                  </>
                )}
              </p>
            </div>

            {/* 4. Wearing the ao dai in daily life */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Mặc áo dài trong đời sống thường nhật"
                  : "Wearing the ao dai in daily life"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Từng có thời gian <em>áo dài</em> ít được mặc thường xuyên trong đời
                    sống hàng ngày do sự lên ngôi của trang phục phương Tây. Tuy nhiên,
                    tà áo dài đã có sự trở lại ngoạn mục sau thành công vang dội của bộ
                    phim điện ảnh &quot;Cô Ba Sài Gòn&quot; (The Tailor) năm 2017. Bộ phim đã
                    tôn vinh sâu sắc vẻ đẹp của trang phục truyền thống cùng những mẫu
                    thiết kế đột phá của nhà thiết kế tài năng Thủy Nguyễn. Tác phẩm
                    nhanh chóng tạo nên một cơn sốt, kéo theo ngày càng nhiều người nổi
                    tiếng và giới trẻ chọn diện <em>áo dài</em> cách tân tại các hội
                    nghị, sự kiện truyền thông và buổi gặp gỡ cộng đồng như một cách
                    khẳng định phong cách thời trang tinh tế, dẫn đầu xu hướng.
                  </>
                ) : (
                  <>
                    There was a time when the <em>ao dai</em> was not widely worn due
                    to the popularity of Western wear. However, it saw a resurgence in
                    popularity after the release of the Vietnamese movie &quot;Co Ba
                    Sai Gon&quot; (The Tailor) in 2017. The film prominently featured
                    the traditional dress and its outstanding designs by talented
                    designer Thuy Nguyen, who played an important role in reviving its
                    beauty. The film quickly became a hit, and along with it, more and
                    more celebrities started wearing the <em>ao dai</em> to
                    conferences, press events, and public events as a way to showcase
                    their fashion sense and trendiness.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* ─── SECTION: THE MAKING OF AO DAI (HÌNH 3 & 4) ─── */}
          <section>
            <h2 className="ad-section-heading">
              {isVi ? "Nghệ thuật may đo áo dài" : "The making of ao dai"}
            </h2>

            <p className="ad-section-intro">
              {isVi ? (
                <>
                  Để một chiếc áo dài ôm trọn đường nét duyên dáng của cơ thể người mặc,
                  cách tuyệt vời nhất là đặt may riêng theo số đo của chính mình. Bản
                  thân quá trình may đo một chiếc <em>áo dài</em> cũng là một trải
                  nghiệm vô cùng thú vị.
                </>
              ) : (
                <>
                  For the dress to fit gracefully on a person, it should be best to
                  customize your own. The process of making the <em>ao dai</em> is fun
                  itself.
                </>
              )}
            </p>

            {/* Choosing materials */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "Lựa chọn chất liệu vải" : "Choosing materials"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Tùy thuộc vào dịp sử dụng, mục đích và sở thích cá nhân, bạn có thể
                    lựa chọn nhiều loại chất liệu vải khác nhau. Thông thường nhất,{" "}
                    <em>áo dài</em> nữ được may từ lụa tơ tằm (<em>lụa</em>), trong khi
                    vải gấm hoa (<em>gấm</em>) thường được ưa chuộng cho nam giới. Hiện
                    nay, áo dài hiện đại có vô vàn sự lựa chọn phong phú như vải đũi,
                    voan, chiffon và cả ren cao cấp. Người dân bản địa rất thích dạo qua
                    các chợ vải truyền thống để tự tay sờ, cảm nhận độ mềm mại của từng
                    thước vải trước khi mang đến tiệm may.
                  </>
                ) : (
                  <>
                    It depends on the occasion, purpose, and personal preference, which
                    allows you to choose different types of materials. Most commonly,
                    the <em>ao dai</em> for women is made from silk (<em>lua</em>), while
                    brocade (<em>gam</em>) is often used for men. A wider selection of
                    fabrics is now available for the modern <em>ao dai</em>, including
                    linen, chiffon, and even lace. Local people enjoy visiting the
                    fabric market to touch and feel the material to make sure it&apos;s
                    what they want before bringing it to the tailor.
                  </>
                )}
              </p>
            </div>

            {/* Measuring and tailoring */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "Đo đạc và may đo thủ công" : "Measuring and tailoring"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Tại tiệm may, thợ may sẽ dùng thước dây (<em>thước dây</em>) lấy số
                    đo tỉ mỉ từng chi tiết trên cơ thể bạn. Mọi góc cạnh đều được chăm
                    chút cẩn thận, từ vòng cổ, vai, ngực, hạ eo cho đến chiều dài chính
                    xác của tay áo và tà áo. Toàn bộ quy trình đo chỉ mất khoảng 5 phút.
                    Thợ may sẽ xác nhận lại phom dáng bạn mong muốn, các chi tiết hoa văn
                    đặc biệt và hẹn ngày bạn có thể đến nhận áo. Tùy thuộc vào độ phức
                    tạp của mẫu thiết kế, danh tiếng của nhà may và mùa cao điểm, thời
                    gian hoàn thành có thể từ vài ngày đến một tháng. Chi phí may cũng
                    dao động linh hoạt từ vài trăm nghìn đến vài triệu đồng (VND).
                  </>
                ) : (
                  <>
                    At the tailor, your measurements will be taken with a stripe ruler
                    (<em>thuoc day</em>). Every aspect will be taken seriously and
                    carefully noted, such as the exact length of the sleeves. The entire
                    measuring process takes only about five minutes. The tailor will
                    confirm the style you want and any special requirements, and
                    finally tell you the day when you can pick up your dress. Depending
                    on the complexity of the design, the popularity of the{" "}
                    <em>ao dai</em> house, and the high/low season, it can take
                    anywhere from a few days to a month. The corresponding price also
                    varies from a few hundred thousand to millions (VND).
                  </>
                )}
              </p>
            </div>

            {/* Where to tailor */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "Địa chỉ may áo dài uy tín" : "Where to tailor"}
              </h3>
              <ul className="ad-bullet-list">
                <li className="ad-bullet-item">
                  <strong>Ao Dai Custom Tailors</strong> (96 Nguyễn Thái Học,{" "}
                  <Link href="/province/quang-nam">Hội An</Link>)
                </li>
                <li className="ad-bullet-item">
                  <strong>Áo Dài Xưa &amp; Nay</strong> (601 Nguyễn Đình Chiểu, Quận 3,{" "}
                  <Link href="/province/ho-chi-minh">TP. Hồ Chí Minh</Link>)
                </li>
                <li className="ad-bullet-item">
                  <strong>Bambou Silk Tailors</strong> (06 Nhà Chung, Quận Hoàn Kiếm,{" "}
                  <Link href="/province/ha-noi">Hà Nội</Link>)
                </li>
                <li className="ad-bullet-item">
                  <strong>Tiệm may Áo dài Minh Tân</strong> (57 Nguyễn Sinh Cung,{" "}
                  <Link href="/province/thua-thien-hue">Huế</Link>)
                </li>
              </ul>
            </div>

            {/* Ready-made ao dai */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "Áo dài may sẵn tiện lợi" : "Ready-made ao dai"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Để đáp ứng nhu cầu trang phục thường ngày và du lịch ngắn ngày, áo
                    dài hiện nay được sản xuất may sẵn với số lượng lớn. Mặc dù phom
                    dáng có thể không ôm khít hoàn hảo như may đo riêng, nhưng nếu bạn
                    chỉ có nhu cầu mặc đi dạo phố, chụp ảnh du lịch thì áo dài may sẵn
                    là giải pháp vô cùng nhanh chóng. Bạn chỉ cần chọn kiểu dáng yêu
                    thích và có thể mặc ngay. Những mẫu áo dài may sẵn này cũng có giá
                    thành phải chăng hơn, dao động từ vài trăm nghìn đồng. Ngoài ra, bạn
                    cũng có thể thuê áo dài tại các điểm du lịch – một lựa chọn rất phổ
                    biến để tiết kiệm chi phí và thời gian.
                  </>
                ) : (
                  <>
                    To meet the demand for daily wear, the dress is now manufactured in
                    large quantities. Although it may not fit perfectly, if you only
                    plan to wear it for leisure, travel, or photography, a ready made
                    version will suffice. Simply choose your favorite design, and you
                    can put it on right away. These ready-made <em>ao dai</em> are also
                    more affordable, ranging from a few hundred thousand Vietnamese
                    Dong. Additionally, you can rent one, which is a common option for
                    performances or photography to save time and money.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* FEATURED PHOTO 4: HOI AN BLUE AO DAI (HÌNH 4 & 5) */}
          <figure className="ad-figure">
            <div className="ad-figure__img-wrap">
              <picture>
                <source
                  srcSet="/guide/ao-dai/ao-dai-custom-fit.webp"
                  type="image/webp"
                />
                <img
                  src="/guide/ao-dai/ao-dai-custom-fit.jpg"
                  alt="For a perfect fit, it's recommended to customize your ao dai"
                  className="ad-figure__img"
                  loading="lazy"
                />
              </picture>
            </div>
            <figcaption className="ad-figure__caption">
              {isVi
                ? "Để có được tà áo dài vừa vặn hoàn hảo nhất, bạn nên đặt may đo riêng cho chính mình."
                : "For a perfect fit, it's recommended to customize your ao dai."}
            </figcaption>
          </figure>

          {/* ─── SECTION: TIPS AND FACTS ABOUT AO DAI (HÌNH 5) ─── */}
          <section>
            <h2 className="ad-section-heading">
              {isVi
                ? "Mẹo và những điều thú vị về áo dài"
                : "Tips and facts about ao dai"}
            </h2>

            {/* Ao dai is worn by both genders */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Áo dài dành cho cả nam và nữ"
                  : "Ao dai is worn by both genders"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Một sự thật thú vị là <em>áo dài</em> ban đầu được sáng tạo và từng
                    là trang phục truyền thống của nam giới Việt Nam, đặc biệt là các
                    quan lại trong triều đình phong kiến. Theo dòng thời gian, truyền
                    thống mặc áo dài ở nam giới dần ít phổ biến hơn trong đời sống hàng
                    ngày. Chiếc <em>áo dài</em> nam có thiết kế hai vạt dài quá đầu gối,
                    cài cúc bên nách phải, thường được may bằng chất liệu vải gấm cứng
                    cáp, sang trọng.
                  </>
                ) : (
                  <>
                    It is a fact that the <em>ao dai</em> was originally created for and
                    was once the traditional costume of Vietnamese men, particularly
                    royal officers. Over time, however, the tradition of wearing it has
                    declined in men&apos;s daily life. The <em>ao dai</em> for men
                    features two flaps that reach below the knee and are buttoned on the
                    right side, typically sewn with brocade fabric.
                  </>
                )}
              </p>
            </div>

            {/* Choosing appropriate undergarments (Hình 1) */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Lựa chọn nội y phù hợp khi mặc áo dài"
                  : "Choosing appropriate undergarments"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Bởi tà <em>áo dài</em> được may từ chất liệu lụa mềm mại và thướt
                    tha, việc lựa chọn nội y mặc bên trong là điều vô cùng quan trọng
                    cần lưu ý. Khi diện áo dài màu trắng hoặc sáng màu, tốt nhất nên
                    tránh các màu tương phản mạnh như đen hoặc đỏ. Bạn nên ưu tiên chọn
                    nội y màu da (nude) không quá chật để tránh để lộ những đường hằn
                    không mong muốn và tôn vinh trọn vẹn nét đoan trang của tà quốc
                    phục.
                  </>
                ) : (
                  <>
                    Because the <em>ao dai</em> is made from silky and flowy material,
                    it is important to be mindful when choosing the undergarments to
                    wear underneath. When wearing a white or bright-colored{" "}
                    <em>ao dai</em>, it is best to avoid highly contrasting colors
                    such as black or red. It is recommended to wear nude-colored
                    undergarments that are not too tight in order to avoid revealing
                    unflattering features and to maximize the traditional dress
                    experience.
                  </>
                )}
              </p>
            </div>

            {/* Combining accessories (Hình 1) */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "Kết hợp phụ kiện truyền thống" : "Combining accessories"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Nếu bạn dự định chụp một bộ ảnh trong tà <em>áo dài</em>, việc kết
                    hợp cùng những phụ kiện mang tính biểu tượng của Việt Nam là một ý
                    tưởng tuyệt vời. Sự kết hợp giữa <em>áo dài</em> và <em>nón lá</em>{" "}
                    (chiếc nón lá truyền thống) luôn là lựa chọn hàng đầu. Phụ nữ cũng
                    thường cầm một bó hoa sen, hoa loa kèn nhỏ hoặc xách một chiếc làn
                    cói mộc mạc làm đạo cụ. Bông tai và vòng cổ ngọc trai là những món
                    trang sức lý tưởng giúp tôn lên vẻ quý phái, thanh lịch và nét nữ
                    tính dịu dàng.
                  </>
                ) : (
                  <>
                    If you&apos;re planning a photoshoot in <em>ao dai</em>, it can be
                    a great idea to pair it with symbolic Vietnamese items. The
                    combination of <em>ao dai</em> and <em>non la</em> (traditional
                    conical hat) is a popular choice. It&apos;s also common to see
                    women hold a small bouquet of flowers or carry a reed shopping
                    basket as props. Pearl earrings and necklaces are ideal
                    accessories to enhance the elegance and femininity of the dress.
                  </>
                )}
              </p>
            </div>

            {/* FEATURED PHOTO 5: INCENSE VILLAGE (HÌNH 1 & 2) */}
            <figure className="ad-figure">
              <div className="ad-figure__img-wrap">
                <picture>
                  <source
                    srcSet="/guide/ao-dai/ao-dai-incense.webp"
                    type="image/webp"
                  />
                  <img
                    src="/guide/ao-dai/ao-dai-incense.jpg"
                    alt="The ao dai and the non la are two iconic symbols associated with Vietnamese women"
                    className="ad-figure__img"
                    loading="lazy"
                  />
                </picture>
              </div>
              <figcaption className="ad-figure__caption">
                {isVi
                  ? "Áo dài và nón lá là hai biểu tượng gắn liền với nét đẹp duyên dáng của phụ nữ Việt Nam."
                  : "The ao dai and the non la are two iconic symbols associated with Vietnamese women."}
              </figcaption>
            </figure>

            {/* Ao dai museum (Hình 2 & 3) */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi ? "Bảo tàng Áo dài" : "Ao dai museum"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Bảo tàng duy nhất dành riêng cho việc trưng bày <em>áo dài</em>{" "}
                    không do nhà nước quản lý, mà thuộc sở hữu tư nhân của nhà thiết kế
                    tâm huyết Sĩ Hoàng. Tọa lạc tại thành phố Thủ Đức,{" "}
                    <Link href="/province/ho-chi-minh">TP. Hồ Chí Minh</Link>, bảo tàng
                    này trưng bày hơn 300 mẫu thiết kế áo dài độc đáo cho công chúng
                    chiêm ngưỡng. Du khách đến đây còn có thể tham gia các buổi workshop
                    làm áo dài để hiểu sâu hơn về từng công đoạn, từ lựa chọn vải cho đến
                    tự tay may chiếc áo dài của riêng mình.
                  </>
                ) : (
                  <>
                    The only known museum dedicated to the display of the{" "}
                    <em>ao dai</em> is not run by the government, but is privately
                    owned by a passionate designer named Sy Hoang. Located in Thu Duc,{" "}
                    <Link href="/province/ho-chi-minh">Ho Chi Minh City</Link>, this
                    museum showcases more than 300 designs of <em>ao dai</em> to the
                    general public. Visitors can also participate in an{" "}
                    <em>ao dai</em>-making workshop to gain an understanding of each
                    step of the process, from selecting materials to sewing their own
                    dress.
                  </>
                )}
              </p>
            </div>

            {/* Not mistake ao dai for cheongsam (Hình 3 & 4) */}
            <div className="ad-subitem">
              <h3 className="ad-subitem__title">
                {isVi
                  ? "Phân biệt áo dài với sườn xám"
                  : "Not mistake ao dai for cheongsam"}
              </h3>
              <p className="ad-subitem__p">
                {isVi ? (
                  <>
                    Nhiều người lầm tưởng rằng <em>áo dài</em> là một biến thể phỏng theo
                    sườn xám (<em>cheongsam</em>) – trang phục truyền thống của Trung
                    Quốc. Tuy nhiên, điều này hoàn toàn không chính xác. Mặc dù có những
                    điểm tương đồng ở hai vạt áo dài, <em>áo dài</em> có nguồn gốc lịch
                    sử lâu đời hơn sườn xám và mang phom dáng kết cấu độc bản hoàn toàn
                    riêng biệt. Vì vậy, nếu bạn là một người đam mê văn hóa và thời
                    trang, hãy lưu ý rằng <em>áo dài</em> không hề bắt nguồn từ sườn
                    xám.
                  </>
                ) : (
                  <>
                    Many people mistakenly believe that <em>ao dai</em> is an
                    adaptation of cheongsam, a Chinese traditional dress. However,
                    this is not accurate. Although there are similarities in the long
                    flaps, <em>ao dai</em> predates cheongsam and has its own unique
                    form. Therefore, if you are a culture and fashion enthusiast,
                    it&apos;s important to be aware that <em>ao dai</em> did not
                    originate from cheongsam.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* ─── RELATED ARTICLES (HÌNH 3 & 4) ─── */}
          <section className="ad-related-section">
            <h3 className="ad-related-title">
              {isVi ? "Bài viết liên quan" : "Related Articles"}
            </h3>
            <div className="ad-related-grid">
              {/* Card 1 */}
              <Link
                href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
                className="ad-related-card"
              >
                <div className="ad-related-card__img-wrap">
                  <img
                    src="/guide/megamenu/inspired-1.jpg"
                    alt="15 best places to visit in Vietnam in 2026"
                    className="ad-related-card__img"
                  />
                </div>
                <h4 className="ad-related-card__title">
                  {isVi
                    ? "15 địa điểm đẹp nhất Việt Nam năm 2026"
                    : "15 best places to visit in Vietnam in 2026"}
                </h4>
              </Link>

              {/* Card 2 */}
              <Link
                href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
                className="ad-related-card"
              >
                <div className="ad-related-card__img-wrap">
                  <img
                    src="/guide/megamenu/inspired-2.jpg"
                    alt="Plan Your Vietnam Trip with Just One Prompt"
                    className="ad-related-card__img"
                  />
                </div>
                <h4 className="ad-related-card__title">
                  {isVi
                    ? "Lên kế hoạch du lịch Việt Nam chỉ với một prompt"
                    : "Plan Your Vietnam Trip with Just One Prompt"}
                </h4>
              </Link>

              {/* Card 3 */}
              <Link
                href="/guide/the-complete-guide-to-vietnam"
                className="ad-related-card"
              >
                <div className="ad-related-card__img-wrap">
                  <img
                    src="/guide/megamenu/inspired-3.jpg"
                    alt="The Complete Guide to Vietnam"
                    className="ad-related-card__img"
                  />
                </div>
                <h4 className="ad-related-card__title">
                  {isVi
                    ? "Cẩm nang du lịch toàn diện Việt Nam"
                    : "The Complete Guide to Vietnam"}
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
