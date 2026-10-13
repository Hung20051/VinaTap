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

                <p>
                  {lang === "vi"
                    ? "Bạn sẽ chỉ phải trả vé 30.000 VNĐ ($1.5) nếu vào bên trong Đền Ngọc Sơn (đi qua Cầu Thê Húc vẫn hoàn toàn miễn phí)."
                    : "You will only be charged 30,000 VND ($1.5) if you go inside Ngoc Son Temple (crossing The Huc Bridge is still free)."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Đường Đinh Tiên Hoàng, Quận Hoàn Kiếm" : "Dinh Tien Hoang Street, Hoan Kiem District"}
                </p>

                {/* WEST LAKE (SCREENSHOT 1) */}
                <h4 className="vnn-hanoi-attraction-subh4">
                  {lang === "vi" ? "Hồ Tây (West Lake)" : "West Lake"}
                </h4>

                <p>
                  {lang === "vi"
                    ? "Hồ Tây là hồ nước ngọt tự nhiên lớn nhất ở Hà Nội. Cảnh sắc hồ tuyệt đẹp đến mức từng được chọn làm nơi xây dựng các cung điện nghỉ dưỡng của hoàng tộc. Điều này lý giải vì sao bạn vẫn có thể tìm thấy rất nhiều di tích lịch sử quanh hồ."
                    : "West Lake is the largest natural freshwater lake in Hanoi. The lake view is so magnificent that it was chosen as a base for royal holiday palaces. It explains why you can still find a lot of historical remains around the lake."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Hồ Tây mang vẻ đẹp quyến rũ bất kể thời điểm nào bạn ghé thăm: yên bình và mờ sương vào sáng sớm, trong khi buổi chiều lại sôi động và ngập tràn hoạt động. Gần đây, rất nhiều trò chơi dưới nước thú vị được bổ sung, biến nơi đây không chỉ là chốn dừng chân ngắm cảnh tĩnh lặng mà còn là điểm đến lý tưởng cho các hoạt động ngoài trời."
                    : "West Lake holds its own beauty regardless of the time you visit: tranquil and misty in the early morning while lively and activity-packed in the afternoon. Recently, there is a wide range of water activities added, making it not only a place to sit down and quietly enjoy the view but also a place to take part in outdoor activities."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Thuê thuyền đạp vịt có giá từ 60.000 VNĐ đến 120.000 VNĐ (tùy kích thước thuyền)."
                    : "Swan boats rental costs from 60,000 VND to 120,000 VND (varying according to the boat sizes)."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Thuê ván SUP có giá 150.000 VNĐ (nửa ngày trong tuần) và 300.000 VNĐ (cả ngày trong tuần); 200.000 VNĐ (nửa ngày cuối tuần) và 400.000 VNĐ (cả ngày cuối tuần)."
                    : "SUP rental costs 150,000 VND (half weekdays) and 300,000 VND (full weekdays); 200,000 VND (half weekends) and 400,000 VND (full weekends)."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Nếu bạn có xe đạp, đạp một vòng quanh hồ và đón hoàng hôn buông xuống cũng là một trải nghiệm tuyệt hảo."
                    : "If you have your bicycle with you, riding around the lake and catching the sunset is also a good choice."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Đường Thanh Niên, Quận Tây Hồ" : "Thanh Nien Street, Tay Ho District"}
                </p>

                {/* TRUC BACH LAKE (SCREENSHOT 1 & 2) */}
                <h4 className="vnn-hanoi-attraction-subh4">
                  {lang === "vi" ? "Hồ Trúc Bạch (Truc Bach Lake)" : "Truc Bach Lake"}
                </h4>

                <p>
                  {lang === "vi"
                    ? "Hồ Trúc Bạch (vốn là một phần tách ra từ Hồ Tây) có diện tích nhỏ hơn so với hai hồ kể trên và được người dân địa phương vô cùng yêu thích; tuy vậy hồ chứa đựng bề dày lịch sử không hề kém cạnh bất kỳ danh thắng nào."
                    : "Truc Bach Lake (originally a part of West Lake) is relatively smaller compared to the other two mentioned lakes, and somehow more locally preferred; however, it carries a breadth of history no less than any other location."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Về phía tây của hồ là Đền Quán Thánh linh thiêng được xây dựng từ thế kỷ 11. Ngôi đền thờ Thánh Trấn Vũ (Thánh Trấn Vũ) – vị thần tương truyền đã nhiều lần giúp các triều vua bảo vệ đất nước."
                    : "To the west of the lake stands the sacred Quan Thanh Temple which was built in the 11th century. This temple worships Saint Tran Vu (Thánh Trấn Vũ) who was said to assist many kings to defend the country."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Phía đông của hồ là Chùa Châu Long (Chùa Châu Long), nơi thờ một vị công chúa thời nhà Trần."
                    : "To the east of the lake is Chau Long Pagoda (Chùa Châu Long) where a princess of the Tran Dynasty is worshiped."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Và phía bắc hồ tọa lạc Chùa Thần Quang (Chùa Thần Quang) nổi tiếng với pho tượng đồng đúc liền khối lớn bậc nhất."
                    : "And to the north of the lake is located Than Quang Pagoda (Chùa Thần Quang) with the largest bronze statue carved in one piece."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Chính nhờ quy mô vừa phải, Hồ Trúc Bạch mang lại cảm giác gần gũi, thân thuộc khi bạn có thể dễ dàng dõi theo mọi nhịp sống quanh hồ. Đây cũng là điểm tập thể dục ưa thích của người dân và là nơi giới trẻ tụ tập tại các quán cà phê, ngồi trên những chiếc ghế con ngắm trọn mặt hồ êm ả."
                    : "Probably due to its decent size, Truc Bach Lake gives a sense of intimacy, when you can watch all the activities taking place around the lake. This is also a favorite spot for locals coming for exercise and the young people gathering at the cafes, on little stools overlooking the lake view."}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 2: TEMPLE OF LITERATURE (SCREENSHOT 2 & 3) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "2. Văn Miếu – Quốc Tử Giám (Temple of Literature)" : "2. Temple of Literature"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-vanmieu-hd.jpg"
                    alt="Temple of Literature Khue Van Cac"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Khuê Văn Các – Văn Miếu Quốc Tử Giám" : "Temple of Literature"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Văn Miếu – Quốc Tử Giám được coi là một trong những điểm đến du lịch nổi tiếng hàng đầu tại Hà Nội. Được xây dựng vào năm 1070 dưới thời vua Lý Thánh Tông, đây là nơi thờ Khổng Tử, các bậc hiền triết Nho học. Văn Miếu cũng được công nhận là trường đại học đầu tiên của Việt Nam, nơi đào tạo nhân tài cho đất nước. Cho đến nay, Văn Miếu đã trở thành biểu tượng ngàn năm văn hiến của dân tộc. Các sĩ tử luôn tin rằng ngôi trường sẽ mang lại may mắn trong thi cử; đó là lý do vào dịp Tết và mùa thi, nơi đây luôn tấp nập người dân đến cầu may và xin chữ may mắn."
                    : "Temple of Literature is considered as one of the famous tourist destinations in Hanoi. Built in 1070 under King Ly Thanh Tong, it is a place of worship of Confucius, Confucian scholars, scholars and sages. Temple of Literature is also considered as the first university in Vietnam, which trained talented people for the country. Up to now, the temple has become a symbol of the thousand-years civilization cradle of Vietnam. The students religiously believe that this temple is going to bring them luck for their exams. That's why during Tet (Lunar New Year) and examination time, the temple is packed with people praying and waiting for lucky calligraphy."}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "58 Phố Quốc Tử Giám, Quận Đống Đa" : "58 Quoc Tu Giam Street, Dong Da District"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé: " : "Ticket price: "}</strong>
                    {lang === "vi" ? "30.000 VNĐ, miễn phí cho trẻ em dưới 15 tuổi" : "30,000 VND, free for children under 15 years old"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giờ mở cửa: " : "Opening hours: "}</strong>
                    {lang === "vi" ? "Mùa hè từ 7:30 – 18:00, mùa đông từ 8:00 – 18:00" : "summer from 7:30 AM – 6:00 PM, winter from 8:00 AM – 6:00 PM"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ITEM 3: HO CHI MINH MAUSOLEUM (SCREENSHOT 3, 4, 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "3. Lăng Chủ tịch Hồ Chí Minh (Ho Chi Minh Mausoleum)" : "3. Ho Chi Minh Mausoleum"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-langbac-hd.jpg"
                    alt="Ho Chi Minh Mausoleum Ba Dinh Square"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Lăng Chủ tịch Hồ Chí Minh tại Quảng trường Ba Đình" : "Ho Chi Minh Mausoleum"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Lăng Chủ tịch Hồ Chí Minh giữ vị trí đặc biệt về chính trị và lịch sử tại Thủ đô Hà Nội cũng như trong trái tim mỗi người dân Việt Nam – nơi lưu giữ thi hài của vị Chủ tịch vĩ đại. Công trình lịch sử này được xây dựng trên Quảng trường Ba Đình rợp bóng cây xanh và thảm cỏ bát ngát, mang lại cho bạn cảm giác trang nghiêm và thanh bình ngay khi đặt chân đến."
                    : "Ho Chi Minh Mausoleum plays a political and historical role in Hanoi Capital and also in the heart of every Vietnamese - where our great former President's corpse is preserved and remembered. The historical attraction was built on Ba Dinh Square covered with a vast green of grass and trees, giving you an instant feeling of peace and solemnity."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Tại đây, mỗi buổi sáng vào lúc 6:00 và buổi tối lúc 21:00 đều diễn ra nghi lễ thượng cờ và hạ cờ thiêng liêng mà bạn rất nên chứng kiến. Trải nghiệm này sẽ mang đến sự thấu hiểu sâu sắc và lòng biết ơn chân thành đối với vị Cha già của dân tộc."
                    : "At this place, every morning at 6:00 AM and evening at 9:00 PM holds the flag-salute ceremony which is highly recommended to you. This experience will give a deeper understanding about how profound and sincere our gratitude is towards the Father of the country."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Du khách bắt buộc phải mặc trang phục lịch sự (không mặc áo sát nách, quần ngắn) và giữ trật tự trang nghiêm trong suốt buổi lễ. Bạn nên có mặt tại quảng trường trước khoảng 5:45 – 5:50 sáng để chọn vị trí quan sát đẹp, theo dõi trọn vẹn đoàn tiêu binh diễu hành và lễ thượng cờ trên nền quốc ca vang vọng."
                    : "You are required to dress formally (no tank top and shorts are allowed) and remain silent during the ceremony. It is suggested that you arrive at the square at around 5:45 AM – 5:50 AM to find a good spot to watch the whole scene of the ceremony with soldiers marching, the flag being raised with the national anthem in the background."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Để vào viếng bên trong lăng, có những quy định cụ thể về thời gian theo từng mùa như sau:"
                    : "To see inside the mausoleum, there are some specific regulations for opening and visiting times. The opening and visiting times vary each season as follows:"}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Mùa nóng (từ 1/4 đến 31/10): " : "The hot season (from 1st April to 31st October): "}</strong>
                    {lang === "vi"
                      ? "từ 7:30 – 10:30 các ngày trong tuần (trừ Thứ Hai và Thứ Sáu); từ 7:30 – 11:00 vào các ngày cuối tuần và lễ tết."
                      : "from 7:30 AM – 10:30 AM on weekdays (excluding Mondays and Fridays) and from 7:30 AM – 11:00 AM on weekends and public holidays"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Mùa lạnh (từ 1/11 đến 31/3): " : "The cold season (from 1st November to 31st March): "}</strong>
                    {lang === "vi"
                      ? "từ 8:00 – 11:00 các ngày trong tuần (trừ Thứ Hai và Thứ Sáu); từ 8:00 – 11:30 vào các ngày cuối tuần và lễ tết."
                      : "from 8:00 AM – 11:00 AM on weekdays (excluding Mondays and Fridays) and from 8:00 AM – 11:30 AM on weekends and public holidays"}
                  </li>
                </ul>

                <p>
                  <em>
                    {lang === "vi"
                      ? "Lưu ý: Nếu các dịp lễ đặc biệt như ngày Mùng 1 Tết Âm lịch, ngày sinh nhật Bác (19/5) và ngày Quốc khánh (2/9) trùng vào Thứ Hai hoặc Thứ Sáu thì lăng vẫn mở cửa phục vụ đồng bào và du khách."
                      : "Note: If special occasions such as the first day of Lunar New Year, Uncle Ho's birthday (19th May) and Independence Day (2nd September) fall on Mondays and Fridays, the attraction will be open to the public."}
                  </em>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "19 Phố Ngọc Hà, Quận Ba Đình" : "19 Ngoc Ha Street, Ba Dinh District"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé: " : "Ticket price: "}</strong>
                    {lang === "vi" ? "25.000 VNĐ (miễn phí cho công dân Việt Nam)" : "25,000 VND"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ITEM 4: HANOI 36 STREETS (SCREENSHOT 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "4. Hà Nội 36 phố phường – Phố Cổ (Hanoi 36 Streets)" : "4. Hanoi 36 Streets (Hanoi Old Quarter)"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-oldquarter-aerial-hd.jpg"
                    alt="Hanoi 36 Streets Old Quarter aerial view"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Khu phố cổ Hà Nội 36 phố phường nhìn từ trên cao" : "Hanoi 36 Streets (Hanoi Old Quarter)"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Vì sao lại là 36 phố phường mà không phải con số khác? Theo quan niệm dân gian, 36 là con số tài lộc mang lại sự thịnh vượng và trù phú. Điều đó lý giải vì sao cái tên Hà Nội 36 phố phường luôn gắn liền qua bao thế hệ, dù thực tế số lượng phố không hoàn toàn cố định ở con số 36."
                    : "Why 36 streets but not another number? According to folk beliefs, 36 is a lucky number that attracts prosperity and abundance. That explains why it permanently goes with the name Hanoi 36 Streets although the number does not exactly reflect the real number of the streets."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Nét đặc trưng hấp dẫn nhất của khu phố là mỗi con phố (bắt đầu bằng chữ Hàng) chuyên doanh một mặt hàng truyền thống và tên phố chính là sản phẩm được buôn bán. Ví dụ, Hàng Tre là nơi bày bán các cây tre cao vút và mọi vật dụng từ tre nứa; Hàng Bạc chuyên vàng bạc trang sức tinh xảo;..."
                    : "The highlight of the area is that each street (or Hàng) specializes in one characteristic product and each street name indicates what products are sold. For example, Hàng Tre (Bamboo Street) is where you will find all the tall bamboo poles and all kinds of items made from bamboo; Hàng Bạc (Silver Street) sells gold and silver jewelry; etc."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Quy hoạch các tuyến phố không chỉ tái hiện nét văn hóa buôn bán truyền thống lâu đời mà còn phô diễn phong cách kiến trúc độc nhất vô nhị với hàng trăm công trình lịch sử cổ kính như đền, chùa, đình hội quán và những ngôi nhà ống cổ. Đây cũng là thiên đường ẩm thực đường phố đặc sắc. Bạn nên chọn xích lô, xe đạp hoặc đi bộ để trải nghiệm trọn vẹn nhất không gian này."
                    : "The setting of streets not only shows you a traditional trading culture but also displays the unique and iconic style of architecture including a hundred of long-standing architectural and historical buildings such as temples, pagodas, assemblies and ordinary residential housing. This is also where you can sample a great variety of local foods. Cyclos, bicycles or walking are recommended to explore this area."}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 5: HANOI CATHEDRAL (SCREENSHOT 2) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "5. Nhà thờ Lớn Hà Nội (Hanoi Cathedral)" : "5. Hanoi Cathedral"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-nhatho-hd.jpg"
                    alt="Hanoi Cathedral St. Joseph Cathedral"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Nhà thờ Lớn Hà Nội (Nhà thờ Chính tòa Thánh Giuse)" : "Hanoi Cathedral"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Tọa lạc tại trung tâm thành phố lân cận hồ Hoàn Kiếm, Nhà thờ Lớn Hà Nội (hay Nhà thờ Chính tòa Thánh Giuse) là một công trình kiến trúc lịch sử tuyệt mỹ mang phong cách Gothic cổ điển. Nhà thờ được người Pháp xây dựng trên nền đất cũ của Chùa Báo Thiên sau khi tiến vào Hà Nội năm 1882."
                    : "Located in the city center neighboring Hoan Kiem Lake, Hanoi Cathedral (or St.Joseph's Cathedral) is a beautiful and historic architecture with Gothic style. The cathedral was built on the original site of Bao Thien Pagoda by the French after they entered Hanoi in 1882."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Dù có ý kiến cho rằng diện mạo sau trùng tu đã vơi bớt vẻ rêu phong cổ kính của thời gian, nơi đây vẫn là điểm hẹn yêu thích với rất nhiều quán cà phê, nhà hàng trang trí xinh xắn xung quanh. Vào dịp Giáng sinh, cả khu vực bừng sáng với những ánh đèn lung linh và cây thông trang hoàng lộng lẫy. Nếu thời gian cho phép, bạn nên ghé thăm vào cả ban ngày lẫn ban đêm để cảm nhận trọn vẹn những nét quyến rũ rất riêng."
                    : "Although it is claimed to lose its vintage and weather-beaten look after the renovation, it remains a favorite gathering spot with many goods and well-decorated cafes and restaurants around. During Christmas time, the whole area is lit up with glorious lights and ornaments. If time allows, you should pay a visit at day and night time to see the different vibes it offers."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "40 Phố Nhà Chung, Quận Hoàn Kiếm" : "40 Nha Chung Street, Hoan Kiem District"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 6: HOA LO PRISON (SCREENSHOT 2 & 3) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "6. Di tích Nhà tù Hỏa Lò (Hoa Lo Prison)" : "6. Hoa Lo Prison"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-hoalo-hd.jpg"
                    alt="Hoa Lo Prison Maison Centrale"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Cổng vào Di tích Lịch sử Nhà tù Hỏa Lò – Maison Centrale" : "Hoa Lo Prison"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Nhà tù Hỏa Lò, còn được gọi với cái tên tiếng Pháp \"Maison Centrale\", được thực dân Pháp xây dựng năm 1896 để giam giữ các chiến sĩ cách mạng kiên trung chống lại chế độ thực dân. Tổng diện tích khu trại giam trước đây rộng hơn 12.000 m2; tuy nhiên hiện tại chỉ còn 2.434 m2 được bảo tồn phục vụ mục đích tham quan du lịch. Khuôn viên được chia làm 4 phân khu: A và B (dành cho tù nhân phạm tội nhẹ hoặc cảnh cáo), C (dành cho phạm nhân người Pháp và nước ngoài), và D (dành cho phạm nhân trọng tội và án tử hình). Bạn sẽ được tận mắt chứng kiến điều kiện giam cầm khắc nghiệt cùng những hình phạt tàn bạo mà các chiến sĩ đã phải trải qua, từ đó thấu hiểu sâu sắc vì sao người dân Việt Nam luôn trân trọng hòa bình và lòng yêu nước nồng nàn trong bất kỳ sự kiện nào."
                    : "Hoa Lo Prison, also goes with the name \"Maison Centrale\", was built in 1896 by the French to capture revolutionary soldiers against the colonial regime. The total area of the former prison is more than 12,000 m2. However, only 2,434 m2 is used for tourist purposes. The campus is divided into 4 zones: A and B (for minor crimes and warning sentences), C (for French and foreign perpetrators), and D (for serious and death-sentenced perpetrators). You will have to see with your own eyes the extreme conditions that the soldiers had to go through and how cruel the punishments were so that you can understand why the Vietnamese so explicitly and passionately show appreciation and patriotism in any events possible."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Với vai trò lịch sử quan trọng, Nhà tù Hỏa Lò đã trở thành một điểm đến hấp dẫn đầy ý nghĩa tại Hà Nội, thu hút đông đảo du khách trong nước và quốc tế."
                    : "With its significant historical role, Hoa Lo Prison has become an exciting place to visit in Hanoi, attracting many domestic and foreign tourists."}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Giờ mở cửa: " : "Opening hours: "}</strong>
                    8:00 AM – 5:00 PM
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé: " : "Tickets: "}</strong>
                    30,000 VND
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "1 Phố Hỏa Lò, Quận Hoàn Kiếm" : "1 Hoa Lo, Hoan Kiem District"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ITEM 7: DONG XUAN MARKET (SCREENSHOT 3 & 4) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "7. Chợ Đồng Xuân (Dong Xuan Market)" : "7. Dong Xuan Market"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-dongxuan-hd.jpg"
                    alt="Dong Xuan Market Cho Dong Xuan"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Chợ Đồng Xuân – Khu chợ đầu mối lâu đời nhất Hà Nội" : "Dong Xuan Market"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Chợ Đồng Xuân là khu mua sắm sầm uất và lâu đời nhất ở Hà Nội, được xây dựng từ năm 1889 dưới triều Nguyễn. Chợ Đồng Xuân là chợ đầu mối bán buôn hàng đầu ở miền Bắc. Nơi đây bày bán bạt ngàn các mặt hàng đa dạng từ vải vóc, quần áo, thổ cẩm lụa là, đồ khô, mứt, bánh kẹo, đồ ăn, quà lưu niệm đến các thiết bị điện tử gia dụng. Dù đây là nơi tuyệt vời để tìm hiểu đời sống giao thương thường nhật của người dân, chúng tôi không khuyến khích bạn mua sắm đồ lưu niệm lẻ tại đây vì mục đích chính của chợ là bán buôn nên bạn khó có thể có được mức giá tốt nhất."
                    : "Dong Xuan Market is the busiest and oldest shopping area in Hanoi, which was built in 1889 under the Nguyen Dynasty. Dong Xuan Market is the leading wholesale market in the North. There is a wide variety of items on sale here, ranging from fabrics, clothes, silk brocade, dry food, jam, confectionery, food and souvenirs to electronic appliances. Although it is a good way to learn about the trading activities of the locals, it is not recommended for souvenir shopping since, as mentioned, it aims at wholesale, so you would probably not get the best prices."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Nếu bạn vẫn muốn trải nghiệm mua sắm thú vị tại Chợ Đồng Xuân, dưới đây là một số mẹo hữu ích:"
                    : "If you are still keen on having an experience shopping at Dong Xuan Market, here are some tips:"}
                </p>

                <p style={{ marginBottom: "6px" }}>
                  {lang === "vi"
                    ? "1. Bạn hoàn toàn có thể mặc cả (và nên trả giá khéo léo nhưng không vượt quá 50% so với giá người bán đưa ra ban đầu)."
                    : "1. It is acceptable to bargain (and bargain hard but not exceed 50% off the initial price)."}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  {lang === "vi"
                    ? "2. Bạn nên đi theo nhóm vì số lượng hàng mua càng lớn thì mức chiết khấu bạn có thể đề xuất càng cao."
                    : "2. You should go in groups and the bigger the quantity is, the bigger discount you could possibly ask for."}
                </p>
                <p style={{ marginBottom: "16px" }}>
                  {lang === "vi"
                    ? "3. Kẻ gian móc túi có thể lợi dụng khung cảnh đông đúc, tấp nập, hãy luôn chú ý giữ gìn tư trang và đồ dùng cá nhân."
                    : "3. Pickpockets could take advantage of the busy and crowded scene, so make sure you always keep an eye on your belongings."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Phố Đồng Xuân, Quận Hoàn Kiếm" : "Dong Xuan Street, Hoan Kiem District"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 8: IMPERIAL CITADEL OF THANG LONG (SCREENSHOT 4 & 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "8. Hoàng thành Thăng Long (Imperial Citadel of Thang Long)" : "8. Imperial Citadel of Thang Long"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-hoangthanh-hd.jpg"
                    alt="Imperial Citadel of Thang Long Doan Mon"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Cửa Đoan Môn – Hoàng thành Thăng Long" : "Imperial Citadel of Thang Long"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Hoàng thành Thăng Long là di tích lịch sử và văn hóa đặc biệt quan trọng của Việt Nam, được UNESCO vinh danh là Di sản Văn hóa Thế giới vào năm 2010 đúng dịp đại lễ kỷ niệm 1.000 năm Thăng Long – Hà Nội. Khuôn viên này là nơi tọa lạc của nhiều cung điện hoàng gia và các công trình cổ kính trải qua hàng ngàn năm triều đại phong kiến, đồng thời tiếp tục giữ vai trò trung tâm chính trị của đất nước cho đến tận ngày nay. Một số điểm nhấn nổi bật bao gồm:"
                    : "Hoang Thanh Thang Long (Imperial Citadel of Thang Long) is an important historical and cultural relic of Vietnam, which was recognized by UNESCO as a World Heritage Site in 2010 when it celebrated its 1,000th anniversary. This campus is home to various imperial palaces and other ancient royal constructions under thousands of years of feudal regime and continues to be the political center of the country up to now. Some of the highlighted attractions are listed below (just to name a few):"}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    {lang === "vi"
                      ? "Cột cờ Hà Nội: được xây dựng từ thế kỷ 19 với cầu thang xoắn ốc dẫn lên đỉnh, nơi bạn có thể phóng tầm mắt ngắm nhìn 360 độ toàn cảnh Hoàng thành."
                      : "The Flagpole (or Hanoi Flagtower) was built in the 19th century with spiral stairs leading to the top where you can have a 360-degree view of the whole Imperial Citadel of Thang Long."}
                  </li>
                  <li>
                    {lang === "vi"
                      ? "Các cổng thành: được xây dựng theo 4 hướng phản ánh vẻ uy nghiêm và phong cách kiến trúc đặc sắc thời bấy giờ."
                      : "The gates were built to the four directions which reflect the magnificence and iconic architectural style at the time."}
                  </li>
                  <li>
                    {lang === "vi"
                      ? "Điện Kính Thiên: tòa thành di tích và nơi ngự triều cũ của hoàng gia, nơi diễn ra các đại lễ trang trọng bậc nhất của triều đình."
                      : "Dien Kinh Thien (Kinh Thien Palace) is a historic fort and former royal residence where all the significant ceremonies of the royalty took place."}
                  </li>
                </ul>

                <p>
                  <strong>{lang === "vi" ? "Một số lưu ý & mẹo hữu ích:" : "Some tips and notes:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "1. Đầu năm 2022, tour đêm kéo dài 90 phút mang tên \"Giải mã Hoàng Thành Thăng Long\" đã chính thức ra mắt – đưa bạn khám phá mọi di tích lịch sử quan trọng với nhiều hoạt động dâng hương và biểu diễn nghệ thuật đặc sắc. Tour đêm này rất được khuyến khích vì vừa là thời điểm lý tưởng mát mẻ để tản bộ, vừa mang đến trải nghiệm ánh sáng vàng lung linh và sự thanh tịnh huyền bí khác biệt."
                    : "1. In early 2022, a 90-minute night tour \"Giải mã Hoàng Thành Thăng Long\" (Decoding the Imperial Citadel of Thang Long) was launched – which takes you through all the significant landmarks with many worshiping and performing activities along the way. This is highly recommended not only because it is the best time to walk the citadel but also because the golden light and the tranquility yet mystique of the night will bring up a whole new experience."}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Thời gian: " : "Time: "}</strong>
                    {lang === "vi" ? "Tour khởi hành từ 19:00 các ngày Thứ Sáu và cuối tuần" : "Tour starts from 7:00 PM on Fridays and weekends"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé tour đêm: " : "Tickets: "}</strong>
                    {lang === "vi" ? "300.000 VNĐ ($13) cho người lớn và 150.000 VNĐ ($6.5) cho trẻ em" : "300,000 VND ($13) for adults and 150,000 VND ($6.5) for children"}
                  </li>
                  <li>
                    {lang === "vi" ? (
                      <>
                        Xem thêm thông tin chi tiết tại{" "}
                        <a href="http://hoangthanhthanglong.com" target="_blank" rel="noopener noreferrer" style={{ color: "#008b94", textDecoration: "underline" }}>
                          trang web chính thức
                        </a>
                      </>
                    ) : (
                      <>
                        Check out their{" "}
                        <a href="http://hoangthanhthanglong.com" target="_blank" rel="noopener noreferrer" style={{ color: "#008b94", textDecoration: "underline" }}>
                          website
                        </a>{" "}
                        for more information
                      </>
                    )}
                  </li>
                </ul>

                <p style={{ marginBottom: "8px" }}>
                  {lang === "vi"
                    ? "2. Hoàng thành Thăng Long nằm trong một khuôn viên rộng lớn, vì vậy nếu tham quan vào ban ngày, hãy nhớ mang theo đồ chống nắng (mũ, nón hoặc ô) và nước uống."
                    : "2. The Imperial Citadel sits on a large campus, so if you visit it during the daytime, make sure you have your sun protection (hats or umbrellas) and water."}
                </p>

                <p style={{ marginBottom: "16px" }}>
                  {lang === "vi"
                    ? "3. Trong khuôn viên có một số quán cà phê xinh xắn dưới bóng cây cổ thụ mát rượi, nơi bạn có thể ngồi thưởng thức đồ uống và tận hưởng bầu không khí thanh bình."
                    : "3. There are some lovely cafes on the campus where you can sit down under the shade of big trees to enjoy a drink while embracing the peaceful vibes in the air."}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "19 Phố Hoàng Diệu, Quận Ba Đình" : "19 Hoang Dieu Street, Ba Dinh District"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé ban ngày: " : "Tickets: "}</strong>
                    30,000 VND
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giờ mở cửa: " : "Opening Hours: "}</strong>
                    8:00 AM – 5:00 PM
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ITEM 9: HANOI OPERA HOUSE (SCREENSHOT 1 & 2) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "9. Nhà hát Lớn Hà Nội (Hanoi Opera House)" : "9. Hanoi Opera House"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-operahouse-hd.jpg"
                    alt="Hanoi Opera House Nha Hat Lon"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Nhà hát Lớn Hà Nội – Biểu tượng kiến trúc nghệ thuật thủ đô" : "Hanoi Opera House"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Nhà hát Lớn Hà Nội được biết đến như một biểu tượng nghệ thuật và văn hóa của thành phố. Đây cũng là điểm đến du lịch tại Hà Nội được đông đảo du khách yêu thích. Nơi đây là thánh đường của nhiều buổi biểu diễn nghệ thuật cấp quốc gia cũng như các chương trình biểu diễn nghệ thuật quốc tế đỉnh cao. Đến đây, bạn sẽ được thưởng thức nhiều loại hình nghệ thuật đặc sắc, từ các vở tuồng, chèo, cải lương kinh điển của Việt Nam cho đến opera Pháp, opera cổ điển Ý, kinh kịch và múa Ballet."
                    : "Hanoi Opera House is known as an artistic and cultural symbol of the city. It's also a tourist destination in Hanoi that is loved by many visitors. Hanoi Opera House is the place for many national-level performances, as well as international art performances. Coming here, you will enjoy many unique art forms, not only famous Vietnamese plays such as Tuong, Cheo and Cai Luong but also the French opera, classical Italian opera, Chinese opera and Ballet."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Đáng tiếc là nhà hát không mở cửa tự do cho công chúng vào tham quan thông thường. Tuy nhiên, vé xem các chương trình nghệ thuật được bán từ 400.000 VNĐ, cho phép bạn chiêm ngưỡng trọn vẹn vẻ đẹp lộng lẫy của kiến trúc, văn hóa cũng như không gian âm nhạc nghệ thuật hàn lâm nơi đây. Hãy truy cập trang web để cập nhật lịch biểu diễn mới nhất và đặt vé sớm để có vị trí ngồi đẹp."
                    : "Unfortunately, it is not open for public visits. However, art show tickets are available from 400,000 VND, which allows you to fully enjoy the beauty of architecture and culture as well as the music and art space here. Please visit the website to update information about the performance schedule. Also, you can book early to get a good position."}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "1 Phố Tràng Tiền, Quận Hoàn Kiếm" : "1 Trang Tien Street, Hoan Kiem District"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Trang web: " : "Website: "}</strong>
                    <a href="http://hanoioperahouse.org.vn" target="_blank" rel="noopener noreferrer" style={{ color: "#008b94", textDecoration: "underline" }}>
                      hanoioperahouse.org.vn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ITEM 10: LONG BIEN BRIDGE (SCREENSHOT 2 & 3) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "10. Cầu Long Biên (Long Bien Bridge)" : "10. Long Bien Bridge"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-longbien-hd.jpg"
                    alt="Long Bien Bridge Red River"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Cầu Long Biên – Chứng nhân lịch sử bắc qua sông Hồng" : "Long Bien Bridge"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Đây là cây cầu thép đầu tiên được xây dựng bắc qua sông Hồng, ban đầu nhằm phục vụ công cuộc khai thác thuộc địa của thực dân Pháp. Có thể bạn chưa biết công trình lịch sử này từng là cây cầu dài thứ hai trên thế giới (chỉ xếp sau Cầu Brooklyn ở Mỹ) và thậm chí còn được ví von như tháp Eiffel nằm ngang giữa lòng Hà Nội."
                    : "This is the first steel bridge built across the Red River initially to facilitate the process of colonial exploitation under the French invasion. Little did you know about this historical construction is that it used to be the second-longest bridge in the world (just ranked after Brooklyn Bridge in the U.S) and even called the horizontal version of the Eiffel in Hanoi."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Giữa vô vàn công trình cầu tại thủ đô, Cầu Long Biên vẫn là biểu tượng đặc sắc nhất và được ưu ái gọi bằng cái tên \"chứng nhân lịch sử\". Bởi lẽ cây cầu đã chứng kiến trọn vẹn những thăng trầm buồn vui của dân tộc: kiên cường đứng vững qua các đợt ném bom ác liệt và là nhịp cầu nối hàng ngàn người từ khắp các vùng miền đổ về Quảng trường Ba Đình ngày Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập."
                    : "Among countless bridge constructions, Long Bien Bridge remains the most iconic and is favorably nicknamed \"the historical witness\". This is because the bridge witnessed all the bittersweet the nation went through: it survived several bombing campaigns and it bridged thousands of people from all remote and inaccessible areas to Hanoi's Ba Dinh Square where President Ho Chi Minh read the Declaration of Independence."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Cầu Long Biên được chia làm hai làn đường chủ yếu dành cho phương tiện thô sơ, người đi bộ và tuyến đường sắt chạy ở giữa. Đứng trên cầu ngắm nhìn đoàn tàu hỏa chạy lướt qua là một trải nghiệm đầy mê hoặc, và việc tản bộ trên cầu sẽ mang lại góc nhìn toàn cảnh Hà Nội từ xa. Phía dưới cầu là bãi bồi chuối xanh mướt ngập tràn phong cảnh làng quê thanh bình mà bạn có thể tiếp cận bằng những bậc thang bí mật ở giữa cầu (xe đạp cũng có thể dắt xuống)."
                    : "Long Bien Bridge is divided into two traffic lanes mostly used for light vehicles and pedestrians and a railway in the middle. Being on the bridge when the trains go by is a fascinating experience and walking on the bridge will give you a panorama view of Hanoi from a distance. Under the bridge is a lush banana island with peaceful countryside landscapes which you can access by taking the secret stairs in the middle of the bridge (possible for bicycles also)."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Cầu Long Biên, Quận Hoàn Kiếm" : "Long Bien, Hoan Kiem District"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 11: THANG LONG WATER PUPPET THEATER (SCREENSHOT 3 & 4) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "11. Nhà hát Múa rối nước Thăng Long (Thang Long Water Puppet Theater)" : "11. Thang Long Water Puppet Theater"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-waterpuppet-hd.jpg"
                    alt="Thang Long Water Puppet Theater"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Nghệ thuật Múa rối nước Thăng Long trên sân khấu nước" : "Thang Long Water Puppet Theater"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Năm 1969, Nhà hát Múa rối nước Thăng Long được thành lập và nhanh chóng trở thành một trong những điểm biểu diễn nghệ thuật múa rối nước nổi tiếng nhất tại Việt Nam. Những câu chuyện cổ tích và truyền thuyết lịch sử Việt Nam được tái hiện sống động qua những con rối gỗ biểu diễn độc đáo trên mặt nước. Đây là một trải nghiệm kỳ thú không thể bỏ lỡ đối với du khách khi ghé thăm Hà Nội. Thưởng thức múa rối nước sẽ giúp bạn hiểu sâu sắc hơn về văn hóa và các loại hình nghệ thuật dân gian truyền thống. Vé có thể đặt trước và thông tin chi tiết có trên trang web của nhà hát."
                    : "In 1969, Thang Long Water Puppet Theater was established, and it quickly became one of the most famous water puppet art venues in Vietnam. The fairy tales and Vietnam historical legends are vividly reproduced by wooden puppets and uniquely performed on water. It is an exciting experience not to be missed for visitors when visiting Hanoi. Watching a water puppet show will help you learn more about Vietnam's traditional culture and art forms. Tickets can be booked in advance and more information can be found on the website."}
                </p>

                <p>
                  <em>
                    {lang === "vi"
                      ? "Lưu ý: Có phụ thu nhỏ 20.000 VNĐ và 60.000 VNĐ nếu mang theo máy chụp ảnh hoặc quay phim."
                      : "Note: small charges of 20,000 VND and 60,000 VND are applied for taking pictures and recording videos."}
                  </em>
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "49 Phố Đinh Tiên Hoàng, Quận Hoàn Kiếm" : "49 Dinh Tien Hoang, Hoan Kiem District"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 12: QUANG BA FLOWER MARKET (SCREENSHOT 4 & 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "12. Chợ hoa đêm Quảng Bá (Quang Ba Flower Market)" : "12. Quang Ba Flower Market"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-flowermarket-hd.jpg"
                    alt="Quang Ba Flower Market night"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Chợ hoa đêm Quảng Bá lung linh sắc hoa giữa đêm khuya" : "Quang Ba Flower Market"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Nếu bạn là một người yêu hoa hoặc đơn giản muốn tìm kiếm một hoạt động về đêm mang đậm hơi thở bản địa, Chợ hoa Quảng Bá chắc chắn sẽ khiến bạn choáng ngợp. Khác với các khu chợ truyền thống họp suốt cả ngày, Chợ hoa Quảng Bá bắt đầu dọn hàng và xếp các bó hoa rực rỡ từ khoảng 23:00 đêm và tan chợ vào rạng sáng khoảng 6:00 sáng. Khoảng thời gian nhộn nhịp và sống động nhất là từ 1:00 – 2:00 sáng. Khi phần còn lại của thành phố chìm vào giấc ngủ, Chợ Quảng Bá bắt đầu thức giấc, rộn rã tiếng cười nói, ngã giá mặc cả cùng hương thơm ngào ngạt đánh thức mọi giác quan của bạn. Vì là chợ đầu mối nên hoa được bán theo bó lớn với mức giá cực kỳ phải chăng."
                    : "If you are a flower lover or simply looking for a night-life activity with a local breath, Quang Ba Flower Market will definitely blow your mind. Unlike other traditional markets which open throughout the day, Quang Ba Flower Market starts setting and stacking up flowers around 11:00 PM and closing at dawn at around 6:00 AM. The most bustling and lively time is from 1:00 AM – 2:00 AM. When the rest of the city is falling asleep, Quang Ba Market starts waking up, filled with laughter, bargains and fragrance, which will stimulate all your senses. Since this is a wholesale market, flowers are sold in bulk and very reasonably priced."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Tùy thuộc vào việc bạn là người dậy sớm hay cú đêm, bạn có thể chọn ghé thăm chợ vào khoảng nửa đêm hoặc lúc 5:00 sáng. Đây là trải nghiệm rất đáng để thức giấc và chắc chắn sẽ mang đến cho bạn kỷ niệm độc nhất vô nhị."
                    : "Depending on whether you are an early riser or a night owl, you can choose to visit the market around midnight or around 5:00 AM. This is worth getting up for and will surely bring you a unique experience."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Nghi Tàm, Đường Âu Cơ, Quận Tây Hồ" : "Nghi Tam, Au Co, Tay Ho District"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 13: ONE PILLAR PAGODA (SCREENSHOT 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "13. Chùa Một Cột (One Pillar Pagoda)" : "13. One Pillar Pagoda"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-chuamotcot-hd.jpg"
                    alt="One Pillar Pagoda Chua Mot Cot"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Chùa Một Cột – Kiến trúc đóa sen độc nhất vô nhị" : "One Pillar Pagoda"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Chùa Một Cột (tên chữ Diên Hựu tự) được xây dựng vào năm 1049 dưới thời vua Lý Thái Tông và đã trải qua nhiều lần trùng tu do sự tàn phá của chiến tranh. Tương truyền vua Lý Thái Tông mộng thấy Phật Bà Quan Âm ngự trên tòa sen dắt vua lên tòa; sau giấc mơ, ngài đã truyền lệnh dựng ngôi chùa tựa như một đóa sen ngát hương vươn lên khỏi mặt nước – biểu tượng Phật giáo của sự thanh tịnh và giác ngộ. Đây là nơi nhà vua thường xuyên lui tới hành lễ và đạo Phật cũng chứng kiến thời kỳ hưng thịnh rực rỡ từ đó."
                    : "One-pillar Pagoda or Chua Mot Cot as it is locally known was built in 1049 by Emperor Ly Thai Tong and has undergone many restorations due to the destruction of wars. Legend has it that the Emperor dreamed of Deity Quan Am (or Lady Buddha) sitting on a blooming lotus and asking him to join her enlightenment journey; after the dream, he ordered to build this pagoda which resembles a lotus blossom – a Buddhist symbol for purity and enlightenment. This is where the Emperor practiced his religion and Buddhism also witnessed its flourishing and prosperity since then."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Dù ngôi chùa không có quy mô bề thế hoành tráng, kiến trúc độc bản tựa đài sen trên một cột đá duy nhất giữa hồ sen đã biến nơi đây thành biểu tượng kiến trúc văn hóa vang danh toàn cầu của Việt Nam."
                    : "Although the pagoda is not a spectacular and large-scale complex, its unique architecture shaped like a lotus blossom emerging from the water makes it a world-renowned architectural icon of Vietnam."}
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "Phố Chùa Một Cột, Đội Cấn, Quận Ba Đình" : "Chua Mot Cot Street, Doi Can, Ba Dinh District"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giờ mở cửa: " : "Opening hours: "}</strong>
                    7:00 AM – 6:00 PM
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé: " : "Ticket price: "}</strong>
                    {lang === "vi" ? "Miễn phí (25.000 VNĐ cho khách quốc tế)" : "Free for Vietnamese, 25,000 VND for foreign visitors"}
                  </li>
                </ul>
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
