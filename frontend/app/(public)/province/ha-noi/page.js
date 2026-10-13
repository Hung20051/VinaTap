"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { getLang } from "@/lib/prefs";
import HeaderSearch from "@/components/ui/HeaderSearch";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import {
  ChevronDown,
  ChevronRight,
  List,
  Compass,
  MapPin,
  Calendar,
  X,
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Train,
  Bus,
  Car,
  Navigation,
} from "lucide-react";
import "@/styles/destination-hanoi.css";

// ─── MEGA MENUS DATA ───
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
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "January 9, 2026",
        dateVi: "9 Tháng 1, 2026",
        badge: "Featured Articles",
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
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
        date: "December 31, 2024",
        dateVi: "31 Tháng 12, 2024",
        badge: "Featured Articles",
        img: "/guide/hcmc/Ao-Dai-Vietnamese-Traditional-Dress.jpg",
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
        date: "April 19, 2025",
        dateVi: "19 Tháng 4, 2025",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "November 14, 2024",
        dateVi: "14 Tháng 11, 2024",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "November 12, 2024",
        dateVi: "12 Tháng 11, 2024",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "July 25, 2024",
        dateVi: "25 Tháng 7, 2024",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "June 15, 2022",
        dateVi: "15 Tháng 6, 2022",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "thing-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/things-1.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "thing-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/things-2.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "thing-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Articles",
        img: "/guide/megamenu/things-3.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "thing-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/things-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "thing-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "July 21, 2024",
        dateVi: "21 Tháng 7, 2024",
        badge: "Articles",
        img: "/guide/megamenu/things-5.jpg",
        link: "/province/dalat",
      },
    ],
  },
  eat: {
    items: [
      {
        id: "eat-1",
        title: "8 must-try foods in Hanoi",
        titleVi: "8 món ngon phải thử ở Hà Nội",
        date: "May 19, 2025",
        dateVi: "19 Tháng 5, 2025",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1.jpg",
        link: "/province/ha-noi#hanoi-dishes",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon nhất định phải thử tại Sài Gòn",
        date: "April 25, 2025",
        dateVi: "25 Tháng 4, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-2.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Complete Guide to Vietnamese Noodle Soup",
        titleVi: "Phở – Cẩm nang trọn vẹn về món quốc hồn quốc túy",
        date: "April 8, 2025",
        dateVi: "8 Tháng 4, 2025",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon không thể bỏ qua ở Vũng Tàu",
        date: "April 1, 2025",
        dateVi: "1 Tháng 4, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-4.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang thơm ngon",
        date: "February 17, 2025",
        dateVi: "17 Tháng 2, 2025",
        badge: "Articles",
        img: "/guide/megamenu/eat-5.jpg",
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
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/itin-1.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "10 ngày khám phá Việt Nam",
        date: "May 21, 2024",
        dateVi: "21 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "2 tuần du lịch Việt Nam",
        date: "May 20, 2024",
        dateVi: "20 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "1 tháng trọn vẹn tại Việt Nam",
        date: "May 18, 2024",
        dateVi: "18 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

export default function HanoiPage() {
  const [lang, setLang] = useState("en");
  const [activeMega, setActiveMega] = useState(null);
  const [tocExpanded, setTocExpanded] = useState(true);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);

  const megaTimeoutRef = useRef(null);

  useEffect(() => {
    const current = getLang();
    setLang(current || "en");

    const handleLangChange = () => {
      setLang(getLang() || "en");
    };

    window.addEventListener("vina_language_change", handleLangChange);
    window.addEventListener("vinatap:lang-updated", handleLangChange);
    return () => {
      window.removeEventListener("vina_language_change", handleLangChange);
      window.removeEventListener("vinatap:lang-updated", handleLangChange);
      if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    };
  }, []);

  const handleMenuEnter = (menuKey) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(menuKey);
  };

  const handleMenuLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 200);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="vnn-hanoi-page">
      {/* ─── 1. TOP PROMO BANNER (SCREENSHOT 2) ─── */}
      <div className="vnn-hanoi-top-banner">
        <Link href="/">
          <img
            src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
            alt="Welcome To Vietnam - Free AI Travel Assistant AI-Companion"
          />
        </Link>
      </div>

      {/* ─── 2. EDITORIAL NAVBAR (SCREENSHOT 2) ─── */}
      <header className="vnn-hanoi-header">
        <div className="vnn-hanoi-nav-inner">
          <Link href="/" className="vnn-hanoi-logo-wrap">
            <Logo />
          </Link>

          <nav>
            <ul className="vnn-hanoi-nav-menu">
              <li
                className="vnn-hanoi-nav-item"
                onMouseEnter={() => handleMenuEnter("inspired")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-hanoi-nav-link ${
                    activeMega === "inspired" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-hanoi-nav-item"
                onMouseEnter={() => handleMenuEnter("destinations")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-hanoi-nav-link ${
                    activeMega === "destinations" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-hanoi-nav-item"
                onMouseEnter={() => handleMenuEnter("things")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-hanoi-nav-link ${
                    activeMega === "things" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-hanoi-nav-item"
                onMouseEnter={() => handleMenuEnter("eat")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-hanoi-nav-link ${
                    activeMega === "eat" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}
                  <ChevronDown size={14} />
                </button>
              </li>

              <li
                className="vnn-hanoi-nav-item"
                onMouseEnter={() => handleMenuEnter("itineraries")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  className={`vnn-hanoi-nav-link ${
                    activeMega === "itineraries" ? "active" : ""
                  }`}
                >
                  {lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}
                  <ChevronDown size={14} />
                </button>
              </li>
            </ul>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* MEGA MENU FLYOUT */}
        {activeMega && MEGA_MENUS_DATA[activeMega] && (
          <div
            className="vnn-hanoi-megamenu-panel"
            onMouseEnter={() => handleMenuEnter(activeMega)}
            onMouseLeave={handleMenuLeave}
          >
            <div
              style={{
                maxWidth: "1240px",
                margin: "0 auto",
                padding: "0 24px",
                display: "grid",
                gridTemplateColumns: `repeat(${MEGA_MENUS_DATA[activeMega].items.length}, 1fr)`,
                gap: "20px",
              }}
            >
              {MEGA_MENUS_DATA[activeMega].items.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={() => setActiveMega(null)}
                >
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "6px",
                      overflow: "hidden",
                      height: "150px",
                      marginBottom: "10px",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  </div>
                  <h4
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      lineHeight: "1.4",
                      margin: "0 0 6px 0",
                      color: "#1a1a1a",
                    }}
                  >
                    {lang === "vi" ? item.titleVi : item.title}
                  </h4>
                  <span style={{ fontSize: "12px", color: "#888888" }}>
                    {lang === "vi" ? item.dateVi : item.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION (SCREENSHOT 2) ─── */}
      <section className="vnn-hanoi-hero-section">
        <img
          src="/guide/hanoi/hanoi-hero-hd.jpg"
          alt="Hanoi Train Street Diesel Locomotive D19E-946"
          className="vnn-hanoi-hero-bg"
        />
        <div className="vnn-hanoi-hero-gradient" />

        <div className="vnn-hanoi-hero-content">
          <div className="vnn-hanoi-badges">
            <span className="vnn-hanoi-badge">
              {lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}
            </span>
            <span className="vnn-hanoi-badge">
              {lang === "vi" ? "MIỀN BẮC" : "NORTHERN VIETNAM"}
            </span>
            <span className="vnn-hanoi-badge">
              {lang === "vi" ? "HÀ NỘI" : "HANOI"}
            </span>
          </div>

          <h1 className="vnn-hanoi-hero-title">
            {lang === "vi" ? "Hà Nội" : "Hanoi"}
          </h1>

          <div className="vnn-hanoi-meta">
            <span>By Welcome to Vietnam</span>
            <span>•</span>
            <span>June 15, 2022</span>
          </div>
        </div>
      </section>

      {/* ─── 4. TRIP PLANNER CTA BUTTON (SCREENSHOT 2 & 3) ─── */}
      <div className="vnn-hanoi-cta-wrap">
        <button
          type="button"
          className="vnn-hanoi-cta-btn"
          onClick={() => setAiCompanionOpen(true)}
        >
          {lang === "vi"
            ? "Lên kế hoạch du lịch Việt Nam chỉ trong vài giây"
            : "Create your Vietnam trip in seconds"}
        </button>
      </div>

      <main className="vnn-hanoi-content-container">
        {/* ─── 5. HANOI AT A GLANCE & TOC (SCREENSHOT 3) ─── */}
        <section id="hanoi-glance">
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "Tổng quan về Hà Nội" : "Hanoi at a glance"}
          </h2>

          <div className="vnn-hanoi-glance-grid">
            <div className="vnn-hanoi-glance-text">
              <p>
                {lang === "vi"
                  ? "Hà Nội – thủ đô ngàn năm văn hiến của Việt Nam – tọa lạc tại trung tâm đồng bằng sông Hồng trù phú với dân số hơn 8,5 triệu người. Hà Nội luôn được khắc họa như một kinh thành cổ kính, trầm mặc; tuy nhiên, nơi đây không chỉ có những công trình kiến trúc lịch sử lâu đời mà còn ngập tràn nhịp sống sôi động và trẻ trung. Hãy theo dõi cẩm nang này để hiểu vì sao Hà Nội là điểm giao thoa hoàn hảo giữa nét đẹp văn hóa nghìn năm và sức sống hiện đại, rực rỡ sắc màu."
                  : "Hanoi – the capital city of Vietnam – is located in the Red River Delta and home to a population of more than 8.5 million inhabitants. Hanoi has been pictured as a tranquil and ancient capital; however, it is not only about long-standing and historically cultural buildings but also active and lively activities. Follow this guide and you will understand why Hanoi is a perfect coming together of the timeless cultural value of the old and the dynamic and colorful vibes of the new."}
              </p>
            </div>

            <div className="vnn-hanoi-toc-box">
              <div
                className="vnn-hanoi-toc-header"
                onClick={() => setTocExpanded(!tocExpanded)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <List size={18} />
                  <span>{lang === "vi" ? "Mục lục" : "Contents"}</span>
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    transform: tocExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>

              {tocExpanded && (
                <ul className="vnn-hanoi-toc-list">
                  <li className="vnn-hanoi-toc-item">
                    <a
                      href="#hanoi-glance"
                      className="vnn-hanoi-toc-link"
                      onClick={(e) => scrollToSection(e, "hanoi-glance")}
                    >
                      <span>›</span>
                      <span>{lang === "vi" ? "Tổng quan về Hà Nội" : "Hanoi at a glance"}</span>
                    </a>
                  </li>
                  <li className="vnn-hanoi-toc-item">
                    <a
                      href="#hanoi-transportation"
                      className="vnn-hanoi-toc-link"
                      onClick={(e) => scrollToSection(e, "hanoi-transportation")}
                    >
                      <span>›</span>
                      <span>{lang === "vi" ? "Phương tiện di chuyển tại Hà Nội" : "Transportation in Hanoi"}</span>
                    </a>
                  </li>
                  <li className="vnn-hanoi-toc-item">
                    <a
                      href="#hanoi-weather"
                      className="vnn-hanoi-toc-link"
                      onClick={(e) => scrollToSection(e, "hanoi-weather")}
                    >
                      <span>›</span>
                      <span>{lang === "vi" ? "Thời tiết Hà Nội" : "Hanoi weather"}</span>
                    </a>
                  </li>
                  <li className="vnn-hanoi-toc-item">
                    <a
                      href="#hanoi-stay"
                      className="vnn-hanoi-toc-link"
                      onClick={(e) => scrollToSection(e, "hanoi-stay")}
                    >
                      <span>›</span>
                      <span>{lang === "vi" ? "Khách sạn & Lưu trú tại Hà Nội" : "Accommodation in Hanoi"}</span>
                    </a>
                  </li>
                  <li className="vnn-hanoi-toc-item">
                    <a
                      href="#hanoi-attractions"
                      className="vnn-hanoi-toc-link"
                      onClick={(e) => scrollToSection(e, "hanoi-attractions")}
                    >
                      <span>›</span>
                      <span>{lang === "vi" ? "15 điểm tham quan phải đến tại Hà Nội" : "15 must-visit attractions in Hanoi"}</span>
                    </a>
                  </li>
                  <li className="vnn-hanoi-toc-item">
                    <a
                      href="#hanoi-dishes"
                      className="vnn-hanoi-toc-link"
                      onClick={(e) => scrollToSection(e, "hanoi-dishes")}
                    >
                      <span>›</span>
                      <span>{lang === "vi" ? "10 món ngon phải thử ở Hà Nội" : "10 must-try dishes in Hanoi"}</span>
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ─── 6. HANOI TOURIST MAP (SCREENSHOT 3) ─── */}
        <section id="hanoi-map" style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "Bản đồ du lịch Hà Nội" : "Hanoi tourist map"}
          </h2>

          <div className="vnn-hanoi-map-grid">
            <div
              className="vnn-hanoi-map-thumb"
              onClick={() => setMapModalOpen(true)}
              title={lang === "vi" ? "Nhấp để xem bản đồ HD" : "Click to expand HD map"}
            >
              <img
                src="/guide/hanoi/hanoi-tourist-map-hd.jpg"
                alt="Hanoi Centre Tourist Map"
              />
            </div>

            <div className="vnn-hanoi-map-info">
              <p>
                {lang === "vi"
                  ? "Trước khi bắt đầu hành trình khám phá thủ đô, chúng tôi xin giới thiệu bản đồ du lịch Hà Nội. Bản đồ tổng hợp các điểm tham quan nổi tiếng nhất cũng như thông tin hữu ích về nhà hàng, quán bar và khu mua sắm đặc sắc. Hy vọng bản đồ sẽ giúp bạn tiết kiệm thời gian và tối ưu hóa trải nghiệm khi ở Hà Nội. Nhấp tải xuống để truy cập nhanh và sử dụng ngoại tuyến khi di chuyển."
                  : "Before starting the journey to explore Hanoi, we would like to introduce you to the Hanoi tourist map. The map includes Hanoi’s most popular destinations as well as other useful information such as restaurants, bars, and shopping addresses. We hope this will save you time and maximize your experience when you are in Hanoi. Click download for easy access and offline use when you are on the move."}
              </p>

              <button
                type="button"
                className="vnn-hanoi-download-btn"
                onClick={() => setMapModalOpen(true)}
              >
                {lang === "vi" ? "Tải xuống bản đồ HD" : "Download"}
              </button>
            </div>
          </div>
        </section>

        {/* ─── 7. TRANSPORTATION IN HANOI (SCREENSHOT 4 & 5) ─── */}
        <section id="hanoi-transportation" className="vnn-hanoi-transport-section">
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "Phương tiện di chuyển tại Hà Nội" : "Transportation in Hanoi"}
          </h2>

          <div style={{ textAlign: "left" }}>
            <a
              href="#hanoi-transportation"
              className="vnn-hanoi-transport-sublink"
            >
              {lang === "vi" ? "Cách đến Hà Nội >" : "How to get to Hanoi >"}
            </a>
          </div>

          <p>
            {lang === "vi"
              ? "Có rất nhiều phương tiện giao thông để bạn lựa chọn khi di chuyển quanh Hà Nội. Tùy thuộc vào lịch trình, ngân sách và mục đích chuyến đi, bạn có thể dễ dàng chọn giải pháp phù hợp nhất. Dưới đây là các phương án thuận tiện nhất dành cho bạn."
              : "There are many types of transportation that you can choose to go around Hanoi. It all depends on your itinerary, budget and purpose to pick the most suitable one. Below are all the possible options."}
          </p>

          {/* BUSES */}
          <h3 className="vnn-hanoi-transport-h3">
            {lang === "vi" ? "Xe buýt công cộng (Buses)" : "Buses"}
          </h3>
          <p>
            {lang === "vi"
              ? "Xe buýt là phương tiện giao thông công cộng phổ biến và dễ tiếp cận nhất tại Hà Nội với mạng lưới rộng khắp hơn 100 tuyến kết nối tất cả các quận nội thành và các tỉnh lân cận. Hầu hết du khách thường dành nhiều thời gian quanh khu vực phố cổ, vì vậy việc đón xe buýt từ hồ Hoàn Kiếm, chợ Đồng Xuân hoặc Ô Quan Chưởng sẽ cực kỳ thuận tiện."
              : "Buses are the most common and accessible public transportation in Hanoi with a spread-out network of more than 100 routes connecting all the districts in Hanoi and its neighboring provinces. You would probably like to spend time around the old quarter, so starting from Hoan Kiem Lake, Dong Xuan Market or O Quan Chuong Gate (Old East Gate) would be convenient."}
          </p>

          <ul className="vnn-hanoi-bullets">
            <li>
              <strong>{lang === "vi" ? "Đến hồ Hoàn Kiếm: " : "To go to Hoan Kiem Lake: "}</strong>
              bus number 9, 14 or 36
            </li>
            <li>
              <strong>{lang === "vi" ? "Đến chợ Đồng Xuân: " : "To go to Dong Xuan Market: "}</strong>
              bus number 31
            </li>
            <li>
              <strong>{lang === "vi" ? "Đến Ô Quan Chưởng: " : "To go to O Quan Chuong Gate: "}</strong>
              bus number 03, 11, 14, 22, 18, 34, 40
            </li>
          </ul>

          <p>
            {lang === "vi"
              ? "Giá vé xe buýt rất rẻ (chỉ từ 7.000 VNĐ – 9.000 VNĐ/lượt) và thanh toán trực tiếp cho nhân viên bán vé trên xe. Ngoài các khung giờ cao điểm, xe buýt chạy tương đối thoáng và đều đặn theo lịch trình. Hãy chuẩn bị một ít tiền lẻ để sẵn sàng nhảy lên xe buýt vi vu khắp phố phường."
              : "Bus tickets are cheap (7,000 VND – 9,000 VND) and paid directly to the bus driver individually. Apart from the peak hours, buses are quite empty and operate regularly. Keep some small banknotes ready and hop on the bus to get around."}
          </p>

          {/* METRO */}
          <h3 className="vnn-hanoi-transport-h3">
            {lang === "vi" ? "Tàu điện đô thị (Metro)" : "Metro"}
          </h3>
          <p>
            {lang === "vi"
              ? "Một hình thức giao thông công cộng hiện đại đã đi vào vận hành tại Hà Nội là hệ thống tàu điện đường sắt trên cao Metro. Hiện tại, tuyến 2A Cát Linh – Hà Đông đang hoạt động phục vụ đông đảo người dân và du khách."
              : "Another form of public transportation that has recently been brought into use is the Metro system. At the moment, there is only one operational route which is Route 2A."}
          </p>
          <p>
            {lang === "vi"
              ? "Tuyến này đưa bạn từ ga Cát Linh (Quận Đống Đa) – gần Văn Miếu Quốc Tử Giám – đến ga Yên Nghĩa (Quận Hà Đông), cách trung tâm khoảng 12 km. Từ đây, bạn có thể dễ dàng ghé thăm các làng nghề truyền thống nổi tiếng như Làng lụa Vạn Phúc."
              : "This route takes you from Cat Linh (Dong Da District) – where you can find the Temple of Literature – to Yen Nghia (Ha Dong District) which is 12km from Hanoi city center. Here, you can visit different traditional craft villages."}
          </p>
          <p>
            <strong>{lang === "vi" ? "Các loại vé tàu điện:" : "Ticket options:"}</strong>
          </p>
          <ul className="vnn-hanoi-bullets">
            <li>
              {lang === "vi"
                ? "Vé lượt: từ 8.000 VNĐ – 15.000 VNĐ (tùy cự ly di chuyển giữa các ga)"
                : "Tickets by turn: cost 8,000 VND – 15,000 VND (ranging from the 2 nearest stations to the whole route)"}
            </li>
            <li>
              {lang === "vi"
                ? "Vé ngày: 30.000 VNĐ không giới hạn số lượt đi lại trong ngày"
                : "Daily tickets: cost 30,000 VND with an unlimited number of trips per day"}
            </li>
          </ul>
          <p>
            {lang === "vi"
              ? "Dù tuyến tàu điện hiện tại chưa bao phủ toàn bộ các điểm du lịch phố cổ, nhưng đây chắc chắn là một trải nghiệm đáng thử để ngắm nhìn toàn cảnh một Hà Nội hiện đại từ trên cao."
              : "Metro may not be the most convenient option, but it's still worth giving it a try as an experience watching Hanoi from above."}
          </p>

          {/* RIDE-HAILING APPS */}
          <h3 className="vnn-hanoi-transport-h3">
            {lang === "vi" ? "Ứng dụng đặt xe công nghệ (Ride-hailing apps)" : "Ride-hailing apps"}
          </h3>
          <p>
            {lang === "vi"
              ? "Thị trường gọi xe công nghệ tại Việt Nam cực kỳ phát triển với đa dạng ứng dụng để lựa chọn. Dịch vụ này được cả người dân địa phương lẫn khách du lịch tin dùng bởi tính minh bạch về cước phí, an toàn và tiết kiệm thời gian so với taxi truyền thống. Tại Hà Nội, ba nền tảng cạnh tranh sôi nổi nhất gồm: Grab, Gojek và Be."
              : "Ride-hailing market in Vietnam is generally very active with many apps for you to choose from. These services are highly trusted by locals as they save both costs and time compared to using a traditional taxi. In Hanoi, there are 3 different competitors operating: Grab, Gojek and Be."}
          </p>
          <p>
            {lang === "vi"
              ? "Trong đó, Grab có số lượng đối tác tài xế đông đảo nhất, giúp bạn rút ngắn tối đa thời gian chờ xe. Tuy nhiên, giá cước Grab vào giờ cao điểm có thể nhỉnh hơn đôi chút so với hai đối thủ còn lại. Lời khuyên hữu ích là bạn nên cài đặt cả 3 ứng dụng và so sánh giá trước khi đặt xe."
              : "Among the three apps, Grab is considered the most used which will shorten your waiting time as available drivers are possibly ready nearby. However, they often charge a bit higher than the other two competitors. So, it is recommended that you install all three and compare the fares before you book to get the cheapest and fastest ride."}
          </p>
          <p>
            <em>
              {lang === "vi"
                ? "Lưu ý: Đối với chặng di chuyển giữa sân bay quốc tế Nội Bài và trung tâm thành phố, đặt taxi trọn gói sân bay tại quầy ga đến thường tiết kiệm và tiện lợi hơn."
                : "Note: Only in the case of going between Noi Bai Airport and the city center, it is more economical to go by traditional taxis as they are cheaper and ready at the airport."}
            </em>
          </p>

          {/* MOTORBIKES (SCREENSHOT 1) */}
          <h3 className="vnn-hanoi-transport-h3">
            {lang === "vi" ? "Thuê xe máy (Motorbikes)" : "Motorbikes"}
          </h3>
          <p>
            {lang === "vi"
              ? "Nếu bạn đã quen với việc lái xe máy, đây chắc chắn là phương tiện tuyệt vời nhất để khám phá bất kỳ thành phố nào ở Việt Nam. Bạn có toàn quyền chủ động lịch trình và dễ dàng len lỏi qua các con ngõ nhỏ, phố hẹp để hòa mình trọn vẹn vào nhịp sống thường nhật của người dân địa phương."
              : "If you are comfortable riding a motorbike then it should be the best way to explore any city in Vietnam. This gives you total freedom to go on your own schedule and easy access to go through small alleys and narrow streets to fully embrace the local lifestyle."}
          </p>
          <p>
            {lang === "vi"
              ? "Xe máy có thể thuê rất dễ dàng ngay tại nơi lưu trú (hoặc khách sạn sẽ giới thiệu điểm thuê gần nhất) và được giao tận nơi. Tùy thuộc vào loại xe (xe số hay xe tay ga), mức giá dao động từ 120.000 VNĐ – 200.000 VNĐ (/ngày)."
              : "Motorbikes can be rented easily from your accommodation (or the hotels will surely recommend you where is the nearest place to get one) and delivered to wherever you are. Depending on the type of bikes (manual bikes or automatic bikes), the prices range from 120,000 VND - 200,000 VND (/day)."}
          </p>
          <p>
            {lang === "vi"
              ? "Bạn sẽ cần có giấy phép lái xe và lý tưởng hơn là bảo hiểm du lịch khi tham gia giao thông. Đa phần các điểm thuê không yêu cầu đặt cọc tiền mặt; tuy nhiên hãy lưu ý rằng vẫn hoàn toàn bình thường nếu bạn được yêu cầu (1) đặt cọc một khoản tiền nhỏ hoặc (2) thanh toán trước hoặc (3) chụp ảnh hộ chiếu (người bản địa cũng làm thủ tục tương tự)."
              : "You will need a driving license and, more ideally, travel insurance to go on the road. Most of the time, you do not have to pay a deposit; however, be mindful that it is still reasonable if you are asked to (1) pay a small amount of money for a deposit or (2) to pay upfront or (3) have your passport's photo taken (as it also works the same way for us locals)."}
          </p>

          {/* BICYCLES (SCREENSHOT 1 & 2) */}
          <h3 className="vnn-hanoi-transport-h3">
            {lang === "vi" ? "Xe đạp & Đi bộ (Bicycles & Walking)" : "Bicycles"}
          </h3>
          <p>
            {lang === "vi"
              ? "Nếu phạm vi di chuyển chỉ quanh khu vực phố cổ, xe đạp sẽ là lựa chọn tuyệt vời nhất để dạo quanh và hòa mình vào đời sống địa phương. Nhịp sống Hà Nội nổi tiếng với sự thư thái, thong thả; bạn sẽ bắt gặp hình ảnh mình đạp xe cạnh một người phụ nữ Hà thành lớn tuổi mặc bộ đồ ngủ hoa hay dừng chân trên vỉa hè chỉ để ngắm nhìn dòng người xe qua lại. Thời tiết Hà Nội rất thích hợp để đạp xe (ngoại trừ mùa hè mưa bão từ tháng 5 đến tháng 9 khi tiết trời có thể rất nóng bức). Giá thuê xe đạp dao động từ 50.000 VNĐ – 100.000 VNĐ (/ngày)."
              : "If you are only bound around the old quarter, bicycles would be the best choice to go around and immerse in the local activities. Hanoian lifestyle is known for its chill and relaxing vibes; you will find yourself riding next to an old Vietnamese lady in her floral pyjama or parking on the sidewalk just to watch the flow of traffic and people passing by. The weather in Hanoi is convenient for riding a bike (except for the rainy summer season from May to September when the weather could be very uncomfortably hot and dry). The prices for a bicycle rent range from 50,000 VND - 100,000 VND (/day)."}
          </p>
          <p>
            {lang === "vi"
              ? "Các con phố nhỏ ở trung tâm Hà Nội cũng rất lý tưởng cho việc đi bộ. Nếu bạn không vội vã, việc tản bộ qua khu 36 phố phường để chiêm ngưỡng sự biến chuyển về sắc màu và các mặt hàng buôn bán sẽ là một trải nghiệm tuyệt vời. Tóm lại, chúng tôi khuyên bạn nên đi bộ và đạp xe để khám phá phố cổ; đi xe máy và các ứng dụng đặt xe công nghệ cho những chặng đường xa hơn."
              : "The narrow streets in Hanoi downtown are ideal for walking as well. If you are not in a hurry, taking a walk through the 36-street area to see the transition in the color and the goods sold would be a great experience. All in all, we recommend walking and biking to explore the old quarter; motorbikes, and ride-hailing apps for longer distances."}
          </p>

          {/* STREET IMAGE (SCREENSHOT 1 & 2) */}
          <div className="vnn-hanoi-editorial-img-box">
            <img
              src="/guide/hanoi/hanoi-old-quarter-walking-hd.jpg"
              alt="The narrow streets in Hanoi downtown are ideal for walking as well"
              className="vnn-hanoi-editorial-img"
            />
            <p className="vnn-hanoi-editorial-caption">
              {lang === "vi"
                ? "Những con phố nhỏ ở trung tâm Hà Nội rất lý tưởng để tản bộ ngắm cảnh"
                : "The narrow streets in Hanoi downtown are ideal for walking as well"}
            </p>
          </div>
        </section>

        {/* ─── 8. HANOI WEATHER (SCREENSHOT 2 & 3) ─── */}
        <section id="hanoi-weather" style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "Thời tiết Hà Nội" : "Hanoi weather"}
          </h2>
          <p style={{ fontSize: "15.5px", lineHeight: "1.85", color: "#333", textAlign: "justify", marginBottom: "16px" }}>
            {lang === "vi"
              ? "Thời tiết ở Hà Nội được chia thành bốn mùa rõ rệt, mỗi mùa mang một cảnh sắc thiên nhiên rất đặc trưng. Tuy nhiên, do chịu ảnh hưởng của khí hậu nhiệt đới gió mùa, hình thái thời tiết nổi bật với hai mùa khô và mùa mưa."
              : "The weather in Hanoi is divided into four distinct seasons with each one characterizing very typical landscapes. However, being affected by the tropical monsoon, the weather patterns feature dry and rainy seasons."}
          </p>
          <p style={{ fontSize: "15.5px", lineHeight: "1.85", color: "#333", textAlign: "justify", marginBottom: "16px" }}>
            {lang === "vi" ? (
              <>
                Thời điểm lý tưởng nhất để đến thăm Hà Nội là từ <strong>tháng 1 đến cuối tháng 3</strong> và từ <strong>tháng 10 đến tháng 12</strong>. Trong khoảng thời gian này, thời tiết vô cùng dễ chịu và phù hợp cho mọi hoạt động tham quan ngoài trời. Nhiệt độ thường không vượt quá 30 °C cùng bầu trời trong xanh và mây thoáng đãng.
              </>
            ) : (
              <>
                The best time to visit Hanoi, though, is from <strong>January to the end of March</strong> and from <strong>October to December</strong>. During this time, the weather is pleasant and suitable for all types of activities. The temperature normally does not exceed 30 °C with a clear blue sky and a high level of cloud coverage.
              </>
            )}
          </p>
          <p style={{ fontSize: "15.5px", lineHeight: "1.85", color: "#333", textAlign: "justify", marginBottom: "16px" }}>
            {lang === "vi"
              ? "Khoảng thời gian từ tháng 5 đến cuối tháng 9 được xem là giai đoạn thời tiết khắc nghiệt nhất trong năm. Trời cực kỳ nắng nóng, oi bức kèm theo gió khô và những cơn mưa rào như trút nước càng làm tăng thêm sự ngột ngạt."
              : "May to the end of September is considered to be the harshest time of the year. The weather is extremely hot and humid with the dry wind and pouring rains making it worse."}
          </p>
          <p style={{ fontSize: "15.5px", lineHeight: "1.85", color: "#333", textAlign: "justify", marginBottom: "16px" }}>
            {lang === "vi"
              ? "Thời tiết trong giai đoạn giao mùa tháng 4 và tháng 5 thường rất khó dự đoán. Bất kỳ sự thay đổi thời tiết nào cũng có thể xảy ra trong những tháng này, vì vậy hãy đảm bảo chuẩn bị trang phục chu đáo cho mọi điều kiện thời tiết."
              : "The weather in the transitional time of April and May is hardly predicted. Anything is possible during these months so make sure you are well prepared for all the conditions."}
          </p>
        </section>

        {/* ─── 9. ACCOMMODATION IN HANOI (SCREENSHOT 3 & 4) ─── */}
        <section id="hanoi-stay" style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "Khách sạn & Lưu trú tại Hà Nội" : "Accommodation in Hanoi"}
          </h2>
          <p style={{ fontSize: "15.5px", lineHeight: "1.85", color: "#333", textAlign: "justify", marginBottom: "16px" }}>
            {lang === "vi"
              ? "Tại các thành phố lớn ở Việt Nam như Hà Nội, có rất nhiều lựa chọn lưu trú phục vụ mọi sở thích và ngân sách. Điểm lưu trú thuận tiện nhất để dạo chơi là khu vực 36 phố phường. Dù tọa lạc tại khu vực sầm uất nhất thành phố, bạn vẫn hoàn toàn có thể tìm thấy những nơi ở rất vừa túi tiền và tươm tất ngay khi vừa đặt chân đến."
              : "In such major cities in Vietnam like Hanoi, there are many options of accommodation that cater for all preferences and budgets. The most convenient base to explore around is the 36-street area. Although located in the most bustling part of the city, it is possible to find very affordable and decent accommodations even on your arrival."}
          </p>
          <p style={{ fontSize: "15.5px", lineHeight: "1.85", color: "#333", textAlign: "justify", marginBottom: "20px" }}>
            {lang === "vi" ? (
              <>
                Dưới đây là một số gợi ý khách sạn & nơi lưu trú tại Hà Nội, được trích xuất từ cẩm nang{" "}
                <a href="https://tripion.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#008b94", textDecoration: "underline" }}>
                  Vietnam travel guide book
                </a>.
              </>
            ) : (
              <>
                Here are some recommendations for accommodation in Hanoi, which are excerpted from the{" "}
                <a href="https://tripion.ai" target="_blank" rel="noopener noreferrer" style={{ color: "#008b94", textDecoration: "underline" }}>
                  Vietnam travel guide book
                </a>.
              </>
            )}
          </p>

          {/* ACCOMMODATION INFOGRAPHIC CARD (SCREENSHOT 4) */}
          <div className="vnn-hanoi-stay-infographic-card">
            <div className="vnn-hanoi-stay-info-left">
              <img
                src="/guide/hanoi/hanoi-accommodation-hoankiem-hd.jpg"
                alt="Hoan Kiem Lake Hanoi Accommodation"
              />
            </div>
            <div className="vnn-hanoi-stay-info-right">
              <div className="vnn-hanoi-stay-card-header">
                <h4 className="vnn-hanoi-stay-card-title">ACCOMMODATION</h4>
                <div className="vnn-hanoi-stay-card-subtitle">Hanoi</div>
                <div className="vnn-hanoi-stay-card-divider"></div>
              </div>

              <div className="vnn-hanoi-stay-tier-group">
                <div>
                  <div className="vnn-hanoi-stay-tier-price">$ 5 - 10</div>
                  <ul className="vnn-hanoi-stay-hotel-list">
                    <li className="vnn-hanoi-stay-hotel-item">Vietnam Cheers Hostel (28 Nguyen Sieu)</li>
                    <li className="vnn-hanoi-stay-hotel-item">Hanoi Buffalo Hostel (44 Hang Giay)</li>
                  </ul>
                </div>

                <div>
                  <div className="vnn-hanoi-stay-tier-price">$ 10 - 20</div>
                  <ul className="vnn-hanoi-stay-hotel-list">
                    <li className="vnn-hanoi-stay-hotel-item">Hanoi Golden Hostel (51 Nguyen Sieu)</li>
                    <li className="vnn-hanoi-stay-hotel-item">Little Charm Hanoi Hostel (44 Hang Bo)</li>
                  </ul>
                </div>

                <div>
                  <div className="vnn-hanoi-stay-tier-price">$ 20 - 50</div>
                  <ul className="vnn-hanoi-stay-hotel-list">
                    <li className="vnn-hanoi-stay-hotel-item">Dragon Pearl Hotel (17E Phan Dinh Phung)</li>
                    <li className="vnn-hanoi-stay-hotel-item">Rising Dragon Palace Hotel (24 Hang Ga)</li>
                  </ul>
                </div>

                <div>
                  <div className="vnn-hanoi-stay-tier-price">$ 50 - 100</div>
                  <ul className="vnn-hanoi-stay-hotel-list">
                    <li className="vnn-hanoi-stay-hotel-item">Acoustic Hotel & Spa (39 Tho Nhuom)</li>
                    <li className="vnn-hanoi-stay-hotel-item">Grande Collection Hotel & Spa (46 - 48 Bat Su)</li>
                  </ul>
                </div>

                <div>
                  <div className="vnn-hanoi-stay-tier-price">$ 100 - 200</div>
                  <ul className="vnn-hanoi-stay-hotel-list">
                    <li className="vnn-hanoi-stay-hotel-item">Peridot Grand Hotel & Spa by AIRA (33 Duong Thanh)</li>
                    <li className="vnn-hanoi-stay-hotel-item">The Oriental Jade Hotel (92 - 94 Hang Trong)</li>
                  </ul>
                </div>

                <div>
                  <div className="vnn-hanoi-stay-tier-price">$ 200 +</div>
                  <ul className="vnn-hanoi-stay-hotel-list">
                    <li className="vnn-hanoi-stay-hotel-item">JW Marriott Hotel Hanoi (8 Do Duc Duc)</li>
                  </ul>
                </div>
              </div>

              <div className="vnn-hanoi-stay-page-num">67</div>
            </div>
          </div>

          <p className="vnn-hanoi-editorial-caption" style={{ textAlign: "center", marginBottom: "40px" }}>
            {lang === "vi"
              ? "Gợi ý điểm lưu trú tại Hà Nội | Sách hướng dẫn du lịch Việt Nam"
              : "Recommend places to stay in Hanoi | Vietnam travel guide book"}
          </p>
        </section>

        {/* ─── 10. 15 MUST-VISIT ATTRACTIONS IN HANOI (SCREENSHOT 5) ─── */}
        <section id="hanoi-attractions" style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "15 điểm tham quan phải đến tại Hà Nội" : "15 must-visit attractions in Hanoi"}
          </h2>

          <p style={{ fontStyle: "italic", fontSize: "15px", lineHeight: "1.8", color: "#555", textAlign: "justify", marginBottom: "28px" }}>
            {lang === "vi"
              ? "Điều tuyệt vời nhất ở Hà Nội là phần lớn các điểm tham quan hấp dẫn đều tập trung ngay tại trung tâm thành phố và các điểm còn lại cũng không nằm quá xa. Khoảng cách hoàn toàn có thể đi bộ, đạp xe hoặc chạy xe máy. Dưới đây là top 15 điểm tham quan không thể bỏ qua được giới thiệu cho bạn."
              : "What is great about Hanoi is that most of the must-see attractions assemble in the city center and the rest does not stretch out too far away. The distances are totally walkable and accessible by bicycle or motorbike. Here are the top 15 must-visit attractions recommended to you."}
          </p>

          {/* ITEM 1: THE THREE LAKES (SCREENSHOT 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "1. Ba hồ nước nổi tiếng (The Three Lakes)" : "1. The Three Lakes"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              {/* LEFT COLUMN: 2 STACKED IMAGES */}
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-hoankiem-turtle-tower-hd.jpg"
                    alt="Hoan Kiem Lake"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Hồ Hoàn Kiếm" : "Hoan Kiem Lake"}
                  </p>
                </div>

                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-westlake-trucbach-hd.jpg"
                    alt="Truc Bach Lake (left) and West Lake (right)"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi"
                      ? "Hồ Trúc Bạch (trái) và Hồ Tây (phải)"
                      : "Truc Bach Lake (left) and West Lake (right)"}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: TEXT */}
              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi" ? (
                    <>
                      Nếu <a href="/province/ho-chi-minh" style={{ color: "#008b94", textDecoration: "underline" }}>Sài Gòn</a> và các tỉnh miền Nam nổi tiếng với hệ thống sông rạch chằng chịt, thì Hà Nội lại được biết đến với những hồ nước thơ mộng, hữu tình rải rác khắp phố phường. Ba hồ nước mang tính biểu tượng và dễ tiếp cận nhất từ trung tâm Hà Nội là Hồ Hoàn Kiếm, Hồ Tây và Hồ Trúc Bạch.
                    </>
                  ) : (
                    <>
                      If <a href="/province/ho-chi-minh" style={{ color: "#008b94", textDecoration: "underline" }}>Saigon</a> and other southern provinces are famous for a dense system of rivers, Hanoi itself is well known for its poetic and scenic lakes scattered around the city. The three most iconic and accessible from the Hanoi center are Hoan Kiem Lake, West Lake and Truc Bach Lake.
                    </>
                  )}
                </p>

                <h4 className="vnn-hanoi-attraction-subh4">
                  {lang === "vi" ? "Hồ Hoàn Kiếm" : "Hoan Kiem Lake"}
                </h4>

                <p>
                  {lang === "vi"
                    ? "Hồ Hoàn Kiếm (còn gọi là Hồ Gươm) tọa lạc ngay trái tim Hà Nội và ở giữa lòng phố cổ, cực kỳ thuận tiện cho chuyến tham quan của bạn."
                    : "Hoan Kiem Lake (also known as Guom Lake) is located in the heart of Hanoi and in the middle of the old quarter, which means it is super convenient for your visit."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Tên gọi của hồ mang ý nghĩa hồ Trả Gươm gắn liền với truyền thuyết lịch sử ngàn năm trước. Tương truyền rùa vàng thần linh đã trao cho vua Lê Thái Tổ thanh gươm thần để đánh thắng giặc ngoại xâm; sau khi đại thắng, nhà vua đã hoàn trả gươm báu cho Rùa Vàng ngay trên chính hồ nước này."
                    : "The name which literally means Sword-returning Lake (or Sword Lake) has been linked to a historical myth dating back thousand years ago. Legend has it that a divine Golden Turtle had lent King Le Thai To a magical sword to fight and win against the invaders; and after the victory, the King returned the sword to the Golden Turtle on this very lake."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Khi ghé thăm hồ, bạn không chỉ cảm nhận hơi thở của lịch sử mà còn bị cuốn hút bởi các công trình kiến trúc tuyệt mỹ tại đây. Nổi bật giữa lòng hồ là Tháp Rùa cổ kính và cây Cầu Thê Húc đỏ son dẫn vào Đền Ngọc Sơn với kiến trúc và khung cảnh độc đáo."
                    : "When visiting this lake, you will not only feel the breath of history but also be amazed by other attractions built within it. In the middle of the lake are Thap Rua (the Turtle Tower) and the beautiful The Huc Bridge leading to Ngoc Son Temple which has unique architecture and setting."}
                </p>
              </div>
            </div>
          </div>

          {/* MORE ATTRACTIONS CARDS GRID */}
          <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#222", marginBottom: "16px" }}>
            {lang === "vi" ? "Các điểm đến biểu tượng tiếp theo:" : "More iconic attractions in Hanoi:"}
          </h4>
          <div className="vnn-hanoi-cards-grid">
            {/* 1. Hoan Kiem Lake */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-hoankiem-hd.jpg"
                  alt="Hoan Kiem Lake and Ngoc Son Temple"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Hồ Hoàn Kiếm & Đền Ngọc Sơn" : "Hoan Kiem Lake & Ngoc Son Temple"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Trái tim lịch sử của thủ đô với Cầu Thê Húc đỏ son, Tháp Rùa cổ kính và huyền tích vua Lê Thái Tổ trả gươm thần."
                    : "The emerald heart of the capital featuring the iconic red The Huc Bridge, Turtle Tower, and ancient legend of King Le Loi."}
                </p>
              </div>
            </div>

            {/* 2. Hanoi Train Street */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-hero-hd.jpg"
                  alt="Hanoi Train Street"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Phố đường tàu Hà Nội" : "Hanoi Train Street"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Trải nghiệm nhâm nhi ly cà phê trứng bên đường ray khi đoàn tàu hỏa chạy lướt qua cách chỉ vài bước chân."
                    : "World-famous railway corridor where trains pass through inches from vintage cafes, lanterns, and colorful shophouses."}
                </p>
              </div>
            </div>

            {/* 3. Temple of Literature */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-vanmieu-hd.jpg"
                  alt="Temple of Literature"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Văn Miếu – Quốc Tử Giám" : "Temple of Literature"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Trường đại học đầu tiên của Việt Nam xây dựng từ năm 1070, biểu tượng ngàn năm hiếu học của dân tộc."
                    : "Vietnam's first national university established in 1070, featuring peaceful courtyards and ancient Doctor stelae."}
                </p>
              </div>
            </div>

            {/* 4. St. Joseph's Cathedral */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-nhatho-hd.jpg"
                  alt="St. Joseph's Cathedral"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Nhà thờ Lớn Hà Nội" : "St. Joseph's Cathedral"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Kiến trúc Gothic cổ kính tráng lệ giữa lòng phố cổ, điểm thưởng thức trà chanh chém gió quen thuộc của giới trẻ."
                    : "Neo-Gothic architectural masterpiece dating from 1886 surrounded by lively sidewalk cafes and iced lemon tea stalls."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 11. 10 MUST-TRY DISHES IN HANOI ─── */}
        <section id="hanoi-dishes" style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "10 món ngon nhất định phải thử ở Hà Nội" : "10 must-try dishes in Hanoi"}
          </h2>

          <div className="vnn-hanoi-cards-grid">
            {/* 1. Pho Hanoi */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-pho-hd.jpg"
                  alt="Traditional Pho Hanoi"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Phở Hà Nội" : "Pho Hanoi"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Món quốc hồn quốc túy với nước dùng thanh ngọt ninh kỹ từ xương bò, bánh phở mềm mướt và hành hoa thơm nức."
                    : "Vietnam's quintessential national dish with clear, aromatic bone broth, tender beef slices, and fresh herbs."}
                </p>
              </div>
            </div>

            {/* 2. Bun Cha */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-buncha-hd.jpg"
                  alt="Bun Cha Hanoi"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Bún Chả Hà Nội" : "Bun Cha Hanoi"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Chả nướng than hoa thơm lừng chấm cùng bát nước mắm chua ngọt ấm nóng, bún tươi và rau sống giòn mát."
                    : "Charcoal-grilled pork patties and belly slices served in sweet-tangy dipping broth with vermicelli and herbs."}
                </p>
              </div>
            </div>

            {/* 3. Cha Ca La Vong */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-chaca-hd.jpg"
                  alt="Cha Ca La Vong"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Chả Cá Lã Vọng" : "Cha Ca La Vong"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Cá lăng ướp riềng nghệ nướng xém xèo xèo cùng thì là, hành hoa trên chảo mỡ sôi sùng sục, ăn kèm mắm tôm bùi béo."
                    : "Turmeric-marinated river fish sizzled table-side with fresh dill, spring onions, peanuts, and fermented shrimp paste."}
                </p>
              </div>
            </div>

            {/* 4. Ca Phe Trung */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-caphetrung-hd.jpg"
                  alt="Hanoi Egg Coffee"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Cà Phê Trứng" : "Hanoi Egg Coffee"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Sự sáng tạo tuyệt hảo với lớp kem trứng đánh bông mịn như nhung trên nền cà phê Robusta đậm đà thơm ngậy."
                    : "Rich Robusta drip coffee topped with velvety whipped egg yolk and condensed milk cream foam."}
                </p>
              </div>
            </div>

            {/* 5. Banh Cuon */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-banhcuon-hd.jpg"
                  alt="Banh Cuon Hanoi"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Bánh Cuốn Thanh Trì" : "Banh Cuon"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Bánh tráng mỏng mềm mướt nhân thịt băm mộc nhĩ giòn sần sật, rắc hành phi vàng ruộm chấm nước mắm cà cuống thơm lừng."
                    : "Delicate steamed rice paper rolls stuffed with minced pork and wood-ear mushrooms, topped with crispy shallots."}
                </p>
              </div>
            </div>

            {/* 6. Bun Thang */}
            <div className="vnn-hanoi-article-card">
              <div className="vnn-hanoi-card-img-wrap">
                <img
                  src="/guide/hanoi/hanoi-bunthang-hd.jpg"
                  alt="Bun Thang Hanoi"
                />
              </div>
              <div className="vnn-hanoi-card-body">
                <h3 className="vnn-hanoi-card-title">
                  {lang === "vi" ? "Bún Thang" : "Bun Thang"}
                </h3>
                <p className="vnn-hanoi-card-desc">
                  {lang === "vi"
                    ? "Bát bún tinh tế tựa bức tranh ngũ sắc với giò lụa thái chỉ, thịt gà xé, trứng tráng mỏng, củ cải khô và tinh dầu cà cuống."
                    : "An intricate culinary mosaic featuring shredded chicken, silk sausage, paper-thin egg shreds, and dry radish."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TAGS SECTION ─── */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "48px 0 24px 0" }}>
          <span
            style={{
              background: "#00bcc6",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "3px",
              letterSpacing: "0.5px",
            }}
          >
            TAGS
          </span>
          <Link
            href="/guide"
            style={{
              background: "#fff",
              border: "1px solid #dcdcdc",
              padding: "5px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              color: "#555",
              textDecoration: "none",
            }}
          >
            {lang === "vi" ? "Điểm đến" : "Destinations"}
          </Link>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "40px" }}>
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <span className="home-footer__name">VinaTap</span>
            <span className="home-footer__copy">
              © {new Date().getFullYear()} VinaTap. Welcome to Vietnam.
            </span>
          </div>

          <div className="home-footer__socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="home-footer__social-link">
              Facebook
            </a>
            <span>•</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="home-footer__social-link">
              Instagram
            </a>
            <span>•</span>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="home-footer__social-link">
              YouTube
            </a>
            <span>•</span>
            <Link href="/terms" className="home-footer__social-link">
              {lang === "vi" ? "Điều khoản dịch vụ" : "Terms"}
            </Link>
            <span>•</span>
            <Link href="/policy" className="home-footer__social-link">
              {lang === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
            </Link>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING TABLE OF CONTENTS QUICK BUTTON (SCREENSHOT 4 & 5) ─── */}
      <div
        className="vnn-hanoi-floating-toc-btn"
        onClick={() => {
          const el = document.getElementById("hanoi-glance");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        title={lang === "vi" ? "Xem mục lục" : "Table of contents"}
      >
        <List size={22} />
      </div>

      {/* ─── FLOATING CIRCULAR AI COMPANION (SCREENSHOT 2, 3, 4, 5) ─── */}
      <div
        className="vnn-hanoi-floating-ai"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        title={lang === "vi" ? "Trò chuyện với AI Companion" : "Chat with AI Companion"}
      >
        <img
          src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
          alt="AI Companion"
        />
      </div>

      {/* ─── AI COMPANION CHATBOT MODAL ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        provinceName={lang === "vi" ? "Hà Nội" : "Hanoi"}
      />

      {/* ─── MAP LIGHTBOX MODAL ─── */}
      {mapModalOpen && (
        <div
          className="vnn-hanoi-modal-backdrop"
          onClick={() => setMapModalOpen(false)}
        >
          <div
            className="vnn-hanoi-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vnn-hanoi-modal-header">
              <h3>
                {lang === "vi"
                  ? "Bản đồ du lịch trung tâm Hà Nội (Độ nét cao HD)"
                  : "Hanoi Centre Tourist Map (High Resolution)"}
              </h3>
              <button
                type="button"
                className="vnn-hanoi-modal-close"
                onClick={() => setMapModalOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <div className="vnn-hanoi-modal-body">
              <img
                src="/guide/hanoi/hanoi-tourist-map-hd.jpg"
                alt="Hanoi Tourist Map Full HD"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
