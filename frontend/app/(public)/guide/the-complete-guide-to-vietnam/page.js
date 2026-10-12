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
  Play,
  X,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/complete-guide.css";

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
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/province/thua-thien-hue",
      },
    ],
  },
  destinations: {
    items: [
      {
        id: "dest-1",
        title: "Ho Chi Minh City",
        titleVi: "TP. Hồ Chí Minh",
        date: "June 25, 2025",
        dateVi: "25 Tháng 6, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Da Lat",
        titleVi: "Đà Lạt",
        date: "June 20, 2025",
        dateVi: "20 Tháng 6, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/lam-dong",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "June 17, 2025",
        dateVi: "17 Tháng 6, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/quang-nam",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "June 16, 2025",
        dateVi: "16 Tháng 6, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "June 10, 2025",
        dateVi: "10 Tháng 6, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "todo-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "June 22, 2025",
        dateVi: "22 Tháng 6, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/the-complete-guide-to-vietnam#itineraries",
      },
      {
        id: "todo-2",
        title: "10 Best Things to Do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "June 15, 2025",
        dateVi: "15 Tháng 6, 2025",
        badge: "HCMC",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "todo-3",
        title: "10 Best Things to Do in Nha Trang",
        titleVi: "10 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "June 12, 2025",
        dateVi: "12 Tháng 6, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm hấp dẫn nhất Việt Nam",
        date: "May 29, 2025",
        dateVi: "29 Tháng 5, 2025",
        badge: "Vietnam",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "todo-5",
        title: "10 Best Things to Do in Da Lat",
        titleVi: "10 trải nghiệm tuyệt nhất tại Đà Lạt",
        date: "May 24, 2025",
        dateVi: "24 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-5-dalat.jpg",
        link: "/province/lam-dong",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon nhất định phải thử ở Hà Nội",
        date: "May 19, 2025",
        dateVi: "19 Tháng 5, 2025",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "April 26, 2025",
        dateVi: "26 Tháng 4, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở truyền thống",
        date: "April 3, 2025",
        dateVi: "3 Tháng 4, 2025",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn tuyệt vời tại Vũng Tàu",
        date: "April 1, 2025",
        dateVi: "1 Tháng 4, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
        date: "February 17, 2025",
        dateVi: "17 Tháng 2, 2025",
        badge: "Articles",
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
        date: "June 22, 2025",
        dateVi: "22 Tháng 6, 2025",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/the-complete-guide-to-vietnam#itineraries",
      },
      {
        id: "itin-2",
        title: "10-day Vietnam Itinerary",
        titleVi: "Lịch trình 10 ngày khám phá Việt Nam",
        date: "June 16, 2025",
        dateVi: "16 Tháng 6, 2025",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/the-complete-guide-to-vietnam#itineraries",
      },
      {
        id: "itin-3",
        title: "2-week Vietnam Itinerary",
        titleVi: "Lịch trình 2 tuần tinh hoa Việt Nam",
        date: "June 10, 2025",
        dateVi: "10 Tháng 6, 2025",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/the-complete-guide-to-vietnam#itineraries",
      },
      {
        id: "itin-4",
        title: "1-month Vietnam Itinerary",
        titleVi: "Lịch trình 1 tháng trải nghiệm trọn vẹn Việt Nam",
        date: "June 6, 2025",
        dateVi: "6 Tháng 6, 2025",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/the-complete-guide-to-vietnam#itineraries",
      },
    ],
  },
};

export default function TheCompleteGuideToVietnamPage() {
  const [lang, setLangState] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  const isVi = lang === "vi";

  return (
    <div className="complete-guide-page">
      {/* ─── 1. TOP BANNER (HÌNH 1) ─── */}
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

      {/* ─── 2. EDITORIAL NAVBAR WITH MEGAMENUS (HÌNH 1) ─── */}
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
                <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
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
                <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("things")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "things" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMenuEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "eat" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
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
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <button
              type="button"
              className="vnn-navbar__search-btn"
              onClick={() => setSearchModalOpen(true)}
              aria-label={isVi ? "Tìm kiếm cẩm nang" : "Search guides"}
            >
              <Search size={18} />
            </button>
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* ─── HOVER MEGAMENU CONTAINER ─── */}
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
                    {isVi ? item.titleVi : item.title}
                  </h4>
                  <p className="vnn-megamenu__date">
                    {isVi ? item.dateVi : item.date}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO COVER SECTION (HÌNH 1) ─── */}
      <section className="cg-hero">
        <img
          src="/guide/the-complete-guide/hero.jpg"
          alt="The Complete Guide to Vietnam"
          className="cg-hero__bg"
        />
        <div className="cg-hero__overlay" />
        <div className="cg-hero__content">
          <div className="cg-hero__badges">
            <span className="cg-hero__badge">#TRENDING</span>
            <span className="cg-hero__badge">
              {isVi ? "BÀI NỔI BẬT" : "FEATURED ARTICLES"}
            </span>
          </div>
          <h1 className="cg-hero__title">
            {isVi
              ? "Cẩm nang du lịch toàn diện Việt Nam"
              : "The Complete Guide to Vietnam"}
          </h1>
          <div className="cg-hero__meta">
            <span className="cg-hero__author">
              {isVi ? "Bởi VinaTap" : "By VinaTap"}
            </span>
            <span className="cg-hero__date">
              {isVi ? "9 Tháng 1, 2026" : "January 9, 2026"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. MAIN EDITORIAL CONTAINER (HÌNH 1, 2, 3, 4, 5) ─── */}
      <main className="cg-container">
        {/* QUICK NAVIGATION PILLS (HÌNH 1 & 2) */}
        <div className="cg-quick-pills">
          <a href="#travel-guide" className="cg-quick-pill">
            <Compass size={16} />
            <span>{isVi ? "Cẩm nang du lịch" : "Travel guide"}</span>
          </a>
          <a href="#destinations" className="cg-quick-pill">
            <MapPin size={16} />
            <span>{isVi ? "Điểm đến" : "Destinations"}</span>
          </a>
          <a href="#itineraries" className="cg-quick-pill">
            <Calendar size={16} />
            <span>{isVi ? "Lịch trình" : "Itineraries"}</span>
          </a>
          <a href="#food" className="cg-quick-pill">
            <Utensils size={16} />
            <span>{isVi ? "Ẩm thực" : "Food"}</span>
          </a>
        </div>

        {/* CTA BUTTON (HÌNH 2) */}
        <div className="cg-cta-wrap">
          <button
            type="button"
            className="cg-cta-btn"
            onClick={() => setAiCompanionOpen(true)}
          >
            <Sparkles size={16} />
            <span>
              {isVi
                ? "Lên kế hoạch du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </button>
        </div>

        {/* ─── SECTION 1: VIETNAM TRAVEL GUIDE (HÌNH 2 & 3) ─── */}
        <section id="travel-guide" className="cg-section">
          <div className="cg-section__header">
            <h2 className="cg-section__title">
              {isVi ? "Cẩm nang du lịch Việt Nam" : "Vietnam travel guide"}
            </h2>
          </div>

          <p className="cg-paragraph">
            {isVi ? (
              <>
                Việt Nam là quốc gia Đông Nam Á nổi tiếng với phong cảnh thiên nhiên tuyệt đẹp, nền ẩm thực phong phú, văn hóa giàu bản sắc cùng chi phí du lịch vô cùng hợp lý. Những năm gần đây, Việt Nam trở thành điểm đến yêu thích của du khách từ khắp nơi trên thế giới. Trong cẩm nang này, chúng tôi cung cấp cho bạn những thông tin du lịch thiết yếu nhất về Việt Nam, bao gồm địa lý, khí hậu, visa, phương tiện di chuyển, điểm đến, ẩm thực và các lịch trình gợi ý.
              </>
            ) : (
              <>
                Vietnam is a Southeast Asian country renowned for its stunning natural landscapes, diverse cuisine, rich culture, and affordable prices. In recent years, Vietnam has become a popular destination for tourists from all over the world. In this post, we'll provide you with essential travel information about Vietnam, covering geography, climate, visas, transportation, destinations, food, and suggested itineraries.
              </>
            )}
          </p>

          {/* YOUTUBE VIDEO CARD (HÌNH 2 & 3) */}
          <div className="cg-video-card">
            {!isVideoPlaying ? (
              <div
                className="cg-video-cover"
                onClick={() => setIsVideoPlaying(true)}
                role="button"
                tabIndex={0}
                title="Watch Vietnam Travel Guide"
              >
                <img
                  src="/guide/the-complete-guide/video-thumb.jpg"
                  alt="Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips"
                  className="cg-video-img"
                />
                <div className="cg-video-overlay">
                  <div className="cg-video-play-btn">
                    <Play size={24} fill="#ffffff" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/BvP3G1Xfth8?autoplay=1"
                title="Vietnam Travel Guide: Climate, Visas, Destinations, Cuisine & Tips"
                className="cg-video-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </section>

        {/* ─── SECTION 2: TOPOGRAPHY AND CLIMATE (HÌNH 4) ─── */}
        <section className="cg-section">
          <div className="cg-section__header">
            <h2 className="cg-section__title">
              {isVi ? "Địa hình và khí hậu" : "Topography and climate"}
            </h2>
          </div>

          <p className="cg-paragraph">
            {isVi ? (
              <>
                Việt Nam được chia thành ba miền chính: Miền Bắc, Miền Trung và Miền Nam, bao gồm 34 tỉnh thành và các đô thị trọng điểm. Mỗi vùng miền đều có khí hậu, cảnh quan và bản sắc văn hóa đặc trưng riêng, tạo nên sự đa dạng phong phú cho trải nghiệm du lịch trên khắp mọi miền đất nước.
              </>
            ) : (
              <>
                Vietnam is divided into three main regions: Northern Vietnam, Central Vietnam, and Southern Vietnam, comprising 34 provinces and major cities. Each region has its own distinct climate, landscape, and cultural identity, creating a rich variety of travel experiences across the country.
              </>
            )}
          </p>

          {/* REGIONAL MAP CARD (HÌNH 4) */}
          <div className="cg-map-card">
            <picture>
              <source
                srcSet="/guide/the-complete-guide/vietnam-regions-map.webp"
                type="image/webp"
              />
              <img
                src="/guide/the-complete-guide/vietnam-regions-map.png"
                alt="Map of Regions, Provinces, and Cities - Vietnam Travel Guide"
                className="cg-map-img"
              />
            </picture>
          </div>
          <p className="cg-map-caption">
            {isVi
              ? "Bản đồ phân vùng 3 miền, các tỉnh thành và đô thị trung tâm Việt Nam"
              : "Map of regions, provinces, and cities in Vietnam"}
          </p>
        </section>

        {/* ─── SECTION 3: REGIONAL BREAKDOWN (HÌNH 5) ─── */}
        <section id="destinations" className="cg-section">
          <Link
            href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
            className="cg-see-more-link"
          >
            <span>
              {isVi
                ? "Xem thêm bản đồ du lịch hữu ích Việt Nam >"
                : "See more useful Vietnam travel maps >"}
            </span>
          </Link>

          {/* 1. NORTHERN VIETNAM (HÌNH 5) */}
          <div className="cg-region-item">
            <h3 className="cg-region-item__title">
              {isVi ? "1. Miền Bắc Việt Nam" : "1. Northern Vietnam"}
            </h3>
            <div className="cg-region-item__layout">
              <div className="cg-region-item__img-wrap">
                <img
                  src="/guide/the-complete-guide/northern-vietnam.jpg"
                  alt="Northern Vietnam - Ha Long Bay"
                  className="cg-region-item__img"
                  loading="eager"
                />
              </div>
              <div className="cg-region-item__desc">
                <p>
                  {isVi ? (
                    <>
                      Miền Bắc Việt Nam bao gồm 15 tỉnh và thành phố: Hà Nội, Hải Phòng, Bắc Ninh, Hưng Yên, Quảng Ninh, Lạng Sơn, Lào Cai, Lai Châu, Điện Biên, Sơn La, Cao Bằng, Tuyên Quang, Thái Nguyên, Phú Thọ và Ninh Bình.
                    </>
                  ) : (
                    <>
                      Northern Vietnam consists of 15 provinces and cities: Hanoi, Hai Phong, Bac Ninh, Hung Yen, Quang Ninh, Lang Son, Lao Cai, Lai Chau, Dien Bien, Son La, Cao Bang, Tuyen Quang, Thai Nguyen, Phu Tho, and Ninh Binh.
                    </>
                  )}
                </p>
                <p>
                  {isVi ? (
                    <>
                      Các điểm du lịch nổi tiếng bao gồm <Link href="/province/ha-noi">Hà Nội</Link>, <Link href="/province/quang-ninh">Vịnh Hạ Long</Link> (Quảng Ninh), Sa Pa & đỉnh Fansipan (Lào Cai), Quần thể Tràng An và Tam Cốc (Ninh Bình), Thác Bản Giốc (Cao Bằng), Mộc Châu (Sơn La) và Mai Châu (Hòa Bình). Khu vực trải dài từ đồng bằng trù phú đến những dãy núi non hùng vĩ phía Bắc giáp biên giới, mang đến cảnh quan ấn tượng, những thửa ruộng bậc thang kỳ vĩ, núi đá vôi tráng lệ cùng nền văn hóa đa dạng của các dân tộc.
                    </>
                  ) : (
                    <>
                      Famous tourist destinations include <Link href="/province/ha-noi">Hanoi</Link>, <Link href="/province/quang-ninh">Ha Long Bay</Link> (Quang Ninh), Sapa & Fansipan (Lao Cai), Ninh Binh's Trang An and Tam Coc, Ban Gioc Waterfall (Cao Bang), Moc Chau (Son La), and Mai Chau (Hoa Binh). The region ranges from lowland deltas to majestic northern mountains bordering China and Laos, offering dramatic landscapes, terraced rice fields, limestone karsts, and rich cultural diversity.
                    </>
                  )}
                </p>
                <p>
                  {isVi ? (
                    <>
                      Miền Bắc có sự kết hợp đặc trưng của bốn mùa rõ rệt. Mùa hè (tháng 5 đến tháng 9) nóng ẩm mưa nhiều, trong khi mùa đông (tháng 11 đến tháng 2) se lạnh, nhiều mây và có mưa phùn ở đồng bằng. Vùng núi cao có thể xuống xấp xỉ hoặc dưới 0°C vào những đợt rét đậm. Mùa xuân và mùa thu mát mẻ, dễ chịu, là thời điểm lý tưởng nhất để du lịch.
                    </>
                  ) : (
                    <>
                      Northern Vietnam has a combination of four distinct seasons. Summer (May to September) is hot and humid with heavy rainfall, while winter (November to February) is cool to cold, often cloudy, and characterized by drizzle in the lowlands. Mountainous areas can experience temperatures approaching or even dropping below 0°C during the coldest months. Spring and autumn are mild and comfortable, making them ideal for travel.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 2. CENTRAL VIETNAM */}
          <div className="cg-region-item">
            <h3 className="cg-region-item__title">
              {isVi ? "2. Miền Trung Việt Nam" : "2. Central Vietnam"}
            </h3>
            <div className="cg-region-item__layout">
              <div className="cg-region-item__img-wrap">
                <img
                  src="/guide/the-complete-guide/central-vietnam.jpg"
                  alt="Central Vietnam - Da Nang & Hoi An"
                  className="cg-region-item__img"
                  loading="lazy"
                />
              </div>
              <div className="cg-region-item__desc">
                <p>
                  {isVi ? (
                    <>
                      Miền Trung Việt Nam là dải đất duyên hải hẹp kẹp giữa dãy Trường Sơn hùng vĩ và Biển Đông, bao gồm các thành phố di sản và bãi biển danh tiếng như <Link href="/province/thua-thien-hue">Huế</Link>, <Link href="/province/da-nang">Đà Nẵng</Link>, <Link href="/province/quang-nam">Hội An</Link>, Quy Nhơn và <Link href="/province/khanh-hoa">Nha Trang</Link>, cùng vùng cao nguyên <Link href="/province/lam-dong">Đà Lạt</Link>.
                    </>
                  ) : (
                    <>
                      Central Vietnam is a narrow coastal strip framed by the Annamite Mountain Range and the East Sea, home to renowned heritage cities and world-class beaches such as <Link href="/province/thua-thien-hue">Hue</Link>, <Link href="/province/da-nang">Da Nang</Link>, <Link href="/province/quang-nam">Hoi An</Link>, Quy Nhon, <Link href="/province/khanh-hoa">Nha Trang</Link>, and the misty plateau of <Link href="/province/lam-dong">Da Lat</Link>.
                    </>
                  )}
                </p>
                <p>
                  {isVi ? (
                    <>
                      Khu vực này sở hữu mật độ di sản thế giới UNESCO cao nhất cả nước, nổi bật với Cố đô Huế, Phố cổ Hội An và Thánh địa Mỹ Sơn, cùng những bãi biển cát trắng mịn trải dài bất tận và ẩm thực cay nồng, đậm đà khó quên.
                    </>
                  ) : (
                    <>
                      The region boasts the highest concentration of UNESCO World Heritage Sites in Vietnam, featuring the Imperial Citadel of Hue, the ancient lantern town of Hoi An, and My Son Sanctuary, coupled with pristine white-sand shorelines and exquisite spicy cuisine.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 3. SOUTHERN VIETNAM */}
          <div className="cg-region-item">
            <h3 className="cg-region-item__title">
              {isVi ? "3. Miền Nam Việt Nam" : "3. Southern Vietnam"}
            </h3>
            <div className="cg-region-item__layout">
              <div className="cg-region-item__img-wrap">
                <img
                  src="/guide/the-complete-guide/southern-vietnam.jpg"
                  alt="Southern Vietnam - Ho Chi Minh City & Mekong"
                  className="cg-region-item__img"
                  loading="lazy"
                />
              </div>
              <div className="cg-region-item__desc">
                <p>
                  {isVi ? (
                    <>
                      Miền Nam Việt Nam là đầu tàu kinh tế năng động và vựa lúa trù phú của đất nước, bao gồm siêu đô thị <Link href="/province/ho-chi-minh">TP. Hồ Chí Minh</Link> (Sài Gòn), bán đảo <Link href="/province/ba-ria-vung-tau">Vũng Tàu</Link>, đồi cát <Link href="/province/binh-thuan">Mũi Né</Link>, miền sông nước <Link href="/province/can-tho">Cần Thơ</Link> và đảo ngọc <Link href="/province/kien-giang">Phú Quốc</Link>.
                    </>
                  ) : (
                    <>
                      Southern Vietnam is the economic powerhouse and lush agricultural bowl of the nation, comprising the vibrant metropolis of <Link href="/province/ho-chi-minh">Ho Chi Minh City</Link>, coastal <Link href="/province/ba-ria-vung-tau">Vung Tau</Link>, desert dunes of <Link href="/province/binh-thuan">Mui Ne</Link>, floating markets of <Link href="/province/can-tho">Can Tho</Link>, and paradise island of <Link href="/province/kien-giang">Phu Quoc</Link>.
                    </>
                  )}
                </p>
                <p>
                  {isVi ? (
                    <>
                      Với khí hậu nhiệt đới gió mùa nắng ấm quanh năm (chia làm 2 mùa: mùa khô từ tháng 12 đến tháng 4 và mùa mưa từ tháng 5 đến tháng 11), Miền Nam luôn đón chào du khách bằng sự nồng hậu, phóng khoáng cùng nhịp sống sôi động cả ngày lẫn đêm.
                    </>
                  ) : (
                    <>
                      With a warm tropical climate year-round (split into dry season from December to April and rainy season from May to November), the South welcomes travelers with warm hospitality, fruitful waterways, and buzzing 24/7 urban energy.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: ITINERARIES ─── */}
        <section id="itineraries" className="cg-section">
          <div className="cg-section__header">
            <h2 className="cg-section__title">
              {isVi ? "Lịch trình du lịch kinh điển" : "Classic Vietnam Itineraries"}
            </h2>
          </div>
          <div className="cg-highlights-grid">
            <div className="cg-highlight-card">
              <h4>{isVi ? "Lịch trình 10 ngày" : "10-Day Highlights"}</h4>
              <p>
                {isVi
                  ? "Hà Nội ➔ Vịnh Hạ Long ➔ Hội An / Đà Nẵng ➔ TP. Hồ Chí Minh."
                  : "Hanoi ➔ Ha Long Bay ➔ Hoi An / Da Nang ➔ Ho Chi Minh City."}
              </p>
            </div>
            <div className="cg-highlight-card">
              <h4>{isVi ? "Lịch trình 2 tuần" : "2-Week Classic"}</h4>
              <p>
                {isVi
                  ? "Hà Nội ➔ Sa Pa ➔ Hạ Long ➔ Ninh Bình ➔ Huế ➔ Hội An ➔ Sài Gòn."
                  : "Hanoi ➔ Sapa ➔ Ha Long ➔ Ninh Binh ➔ Hue ➔ Hoi An ➔ Saigon."}
              </p>
            </div>
            <div className="cg-highlight-card">
              <h4>{isVi ? "Lịch trình 3 tuần" : "3-Week Grand Tour"}</h4>
              <p>
                {isVi
                  ? "Hà Giang ➔ Vịnh Hạ Long ➔ Phong Nha ➔ Huế ➔ Đà Nẵng ➔ Nha Trang ➔ Miền Tây ➔ Phú Quốc."
                  : "Ha Giang ➔ Ha Long Bay ➔ Phong Nha ➔ Hue ➔ Da Nang ➔ Nha Trang ➔ Mekong ➔ Phu Quoc."}
              </p>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: FOOD ─── */}
        <section id="food" className="cg-section">
          <div className="cg-section__header">
            <h2 className="cg-section__title">
              {isVi ? "Ẩm thực tinh hoa Việt Nam" : "Must-try Vietnamese Food"}
            </h2>
          </div>
          <div className="cg-highlights-grid">
            <div className="cg-highlight-card">
              <h4>{isVi ? "Phở & Bún Chả" : "Pho & Bun Cha"}</h4>
              <p>
                {isVi
                  ? "Món ngon tinh túy đất Tràng An với nước dùng thanh ngọt, thịt nướng than hoa thơm lừng."
                  : "Signature dishes from Hanoi with deeply fragrant broth and charcoal-grilled pork."}
              </p>
            </div>
            <div className="cg-highlight-card">
              <h4>{isVi ? "Bánh Mì & Cơm Tấm" : "Banh Mi & Broken Rice"}</h4>
              <p>
                {isVi
                  ? "Ẩm thực đường phố đỉnh cao của Sài Gòn nức tiếng toàn cầu với hương vị đậm đà khó quên."
                  : "World-famous street food culture with crispy baguettes and savory grilled pork cutlets."}
              </p>
            </div>
            <div className="cg-highlight-card">
              <h4>{isVi ? "Cà Phê Trứng & Cà Phê Muối" : "Egg Coffee & Salt Coffee"}</h4>
              <p>
                {isVi
                  ? "Nghệ thuật pha chế cà phê độc bản của Hà Nội và xứ Huế làm say đắm mọi tín đồ cà phê."
                  : "Unique Vietnamese coffee craft blending frothy whipped egg yolk or savory salted cream."}
              </p>
            </div>
          </div>
        </section>

        {/* ─── RELATED ARTICLES SECTION ─── */}
        <hr className="cg-divider" />
        <section className="cg-related">
          <h2 className="cg-related__title">
            {isVi ? "Bài viết liên quan" : "Related Articles"}
          </h2>
          <div className="cg-related__grid">
            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="cg-related__card"
            >
              <div className="cg-related__img-wrap">
                <img
                  src="/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg"
                  alt="15 best places to visit in Vietnam in 2026"
                  className="cg-related__img"
                />
              </div>
              <h3 className="cg-related__card-title">
                15 best places to visit in Vietnam in 2026
              </h3>
            </Link>

            <Link
              href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
              className="cg-related__card"
            >
              <div className="cg-related__img-wrap">
                <img
                  src="/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg"
                  alt="Plan Your Vietnam Trip with Just One Prompt"
                  className="cg-related__img"
                />
              </div>
              <h3 className="cg-related__card-title">
                Plan Your Vietnam Trip with Just One Prompt
              </h3>
            </Link>

            <Link
              href="/province/ha-noi"
              className="cg-related__card"
            >
              <div className="cg-related__img-wrap">
                <img
                  src="/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg"
                  alt="20 Best Things to Do in Vietnam"
                  className="cg-related__img"
                />
              </div>
              <h3 className="cg-related__card-title">
                20 Best Things to Do in Vietnam
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── 5. FLOATING AI COMPANION BUTTON & MODAL ─── */}
      <div className="vnn-floating-widget">
        <button
          type="button"
          className="vnn-floating-widget__btn"
          onClick={() => setAiCompanionOpen((prev) => !prev)}
          aria-label="Open AI Travel Companion"
          title="AI Travel Companion - Trợ lý Du lịch Thông minh"
        >
          <span className="vnn-floating-widget__halo-outer" />
          <span className="vnn-floating-widget__halo-mid" />
          <span className="vnn-floating-widget__avatar">
            <img
              src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
              alt="AI Companion"
              className="vnn-floating-widget__avatar-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="vnn-floating-widget__pulse" />
          </span>
        </button>
      </div>

      <ProvinceChatbot
        province={{ name: "Việt Nam", slug: "viet-nam" }}
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        hideFab={true}
      />

      {/* ─── 6. SEARCH MODAL ─── */}
      {searchModalOpen && (
        <div className="vnn-search-modal" onClick={() => setSearchModalOpen(false)}>
          <div
            className="vnn-search-modal__box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vnn-search-modal__header">
              <h3>{isVi ? "Tìm kiếm cẩm nang & điểm đến" : "Search guides & destinations"}</h3>
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
                    isVi
                      ? "Nhập tên thành phố (Hà Nội, Hội An, Sapa, Đà Nẵng...)..."
                      : "Type destination name (Hanoi, Hoi An, Sapa, Da Nang...)..."
                  }
                  value={searchModalText}
                  onChange={(e) => setSearchModalText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="vnn-search-quick-tags">
                <span>{isVi ? "Gợi ý:" : "Suggestions:"}</span>
                {["Hạ Long", "Hội An", "Đà Nẵng", "Ninh Bình", "Sapa", "Hà Giang"].map((tag) => (
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

      {/* ─── 7. EDITORIAL FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "60px" }}>
        <div className="home-footer__bottom">
          <p>© 2026 VinaTap. Tất cả quyền được bảo lưu. Cẩm nang du lịch 34 tỉnh thành Việt Nam.</p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9ca3af" }}
            >
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }}>
              <Instagram size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af" }}>
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
