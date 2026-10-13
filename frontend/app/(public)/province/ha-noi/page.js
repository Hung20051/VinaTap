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
  ChevronLeft,
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
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Featured Articles",
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
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
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
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "thing-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "thing-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "thing-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "thing-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-5-dalat.jpg",
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
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon nhất định phải thử tại Sài Gòn",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Complete Guide to Vietnamese Noodle Soup",
        titleVi: "Phở – Cẩm nang trọn vẹn về món quốc hồn quốc túy",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon không thể bỏ qua ở Vũng Tàu",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang thơm ngon",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
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
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "10 ngày khám phá Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "2 tuần du lịch Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "1 tháng trọn vẹn tại Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

const getBadgeLabel = (badge, isVi) => {
  if (!badge) return "";
  if (!isVi) return badge;
  const b = badge.toLowerCase();
  if (b.includes("trending")) return "#Xu hướng";
  if (b.includes("destination")) return "Điểm đến";
  if (b.includes("itinerary")) return "Lịch trình";
  if (b.includes("article")) return "Bài viết";
  return badge;
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
            alt="VinaTap - Free AI Travel Assistant AI-Companion"
          />
        </Link>
      </div>

      {/* ─── 2. EDITORIAL NAVBAR (SCREENSHOT 2) ─── */}
      <header className="vnn-hanoi-header">
        <div className="vnn-hanoi-nav-inner">
          <Link href="/" className="vnn-hanoi-logo-wrap">
            <Logo size={32} showText={false} noLink href={null} as="span" />
            <span
              style={{
                fontSize: "20px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
                color: "#111",
              }}
            >
              VinaTap
            </span>
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

          {/* MEGA MENU FLYOUT (MATCHING FIG 2) */}
          {activeMega && MEGA_MENUS_DATA[activeMega] && (
            <div
              className="vnn-megamenu"
              onMouseEnter={() => handleMenuEnter(activeMega)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="vnn-megamenu__grid">
                {MEGA_MENUS_DATA[activeMega].items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-megamenu__card"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="vnn-megamenu__thumb">
                      <img
                        src={item.img}
                        alt={lang === "vi" ? item.titleVi : item.title}
                        loading="eager"
                      />
                      {item.badge && (
                        <span className="vnn-megamenu__badge">
                          {getBadgeLabel(item.badge, lang === "vi")}
                        </span>
                      )}
                    </div>
                    <h4 className="vnn-megamenu__title">
                      {lang === "vi" ? item.titleVi : item.title}
                    </h4>
                    <span className="vnn-megamenu__date">
                      {lang === "vi" ? item.dateVi : item.date}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="vnn-megamenu__footer">
                <div className="vnn-megamenu__nav-btns">
                  <button
                    type="button"
                    className="vnn-megamenu__nav-btn"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    className="vnn-megamenu__nav-btn"
                    aria-label="Next"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
            <span>By VinaTap</span>
            <span>•</span>
            <span>October 11, 2026</span>
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
                    ? "Dù ngôi chùa không phải là một công trình bề thế, quy mô lớn, nơi đây lại sở hữu giá trị lịch sử và tâm linh tôn giáo đặc biệt sâu sắc, rất xứng đáng để ghé thăm."
                    : "Although the pagoda is not a spectacular and large-scale construction, it has a particular historical and religious value that is totally worth a visit."}
                </p>

                <p>
                  <em>
                    {lang === "vi"
                      ? "Lưu ý: Vào ngày mùng 1 và ngày 14 Âm lịch hàng tháng, tại chùa diễn ra các nghi lễ Phật giáo trang trọng, giúp bạn cảm nhận trọn vẹn nhất không khí linh thiêng nơi đây."
                      : "Note: on the 1st and 14th monthly (lunar calendar), there will be Buddhist ceremonies which will allow you to have a full picture of the place."}
                  </em>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                    {lang === "vi" ? "Chùa Một Cột, Đội Cấn, Quận Ba Đình" : "Chua Mot Cot, Doi Can, Ba Dinh District"}
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giá vé: " : "Price: "}</strong>
                    25,000 VND
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Giờ mở cửa: " : "Opening Hours: "}</strong>
                    7:00 AM – 6:00 PM
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ITEM 14: BAT TRANG CERAMIC VILLAGE (SCREENSHOT 1 & 2) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "14. Làng gốm Bát Tràng (Bat Trang Ceramic Village)" : "14. Bat Trang Ceramic Village"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-battrang-hd.jpg"
                    alt="Bat Trang Ceramic Village"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Làng gốm cổ Bát Tràng – Nghệ thuật thủ công nghìn năm" : "Bat Trang Ceramic Village"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Suốt hàng ngàn năm qua, gốm sứ đã trở thành biểu tượng gắn liền với Bát Tràng, minh chứng cho chất lượng tuyệt hảo và trình độ thủ công xuất chúng. Nằm ở bờ đông sông Hồng và chỉ cách trung tâm Hà Nội 15km, Làng gốm Bát Tràng là một quần thể gồm các bảo tàng gốm, xưởng chế tác, nhà cổ và chợ gốm sầm uất. Từng góc nhỏ trong làng đều mang nét cổ kính, rực rỡ sắc màu làm phông nền hoàn hảo cho những bức ảnh kỷ niệm của bạn. Bạn có thể đăng ký tham gia các buổi trải nghiệm vuốt gốm, tự tay tạo hình và sáng tạo nên tác phẩm gốm của riêng mình. Chợ gốm là nơi bạn dễ dàng tìm thấy những món đồ gốm tinh xảo độc nhất vô nhị vì mỗi sản phẩm đều được các nghệ nhân tỉ mỉ vẽ tay hàng giờ đồng hồ."
                    : "For thousands of years, ceramic has been synonymous with Bat Trang, which is a testimony to its excellent quality and outstanding handicraft quality. Located on the east side of the Red River and only 15km from Hanoi center, Bat Trang Ceramic Village is a complex of ceramic museums, workshops, ancient houses and markets. Every corner of the village sets up a colorful and vintage background for your photographs. You can sign up for ceramic-making workshops, which will give you hands-on experience and help you create your own piece of ceramic. The ceramic market is where you can get lovely and one-and-only ceramic items since each of them takes hours to be painted by hand by the artisans."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Điểm tham quan vào cửa hoàn toàn miễn phí, bạn chỉ phải trả phí nếu muốn tự tay tham gia hoạt động nặn gốm (chi phí bắt đầu từ 30.000 VNĐ)."
                    : "The attraction allows free entrance, and you are only charged if you want to take part in ceramic-making activities (the cost starts at 30,000 VND)."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Từ trung tâm Hà Nội, bạn có thể đón xe buýt số 47A hoặc 52B để đến Bát Tràng. Làng gốm cũng rất dễ dàng di chuyển bằng xe máy, hoặc bạn có thể đặt tour trọn gói tại các công ty du lịch để chuyến đi thêm phần thuận tiện."
                    : "From Hanoi, you can check out bus number 47A or bus 52B to go to Bat Trang. It is also easily accessed by motorbikes and there are many tourist agencies that offer a full-package tour to Bat Trang Ceramic Village which will save you from all the hassle."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Huyện Gia Lâm, Hà Nội" : "Gia Lam District"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM 15: HANOI TRAIN STREET (SCREENSHOT 2 & 3) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "15. Phố đường tàu Hà Nội (Hanoi Train Street)" : "15. Hanoi Train Street"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-hero-hd.jpg"
                    alt="Hanoi Train Street Phung Hung"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Phố đường tàu Phùng Hưng – Lê Duẩn" : "Hanoi Train Street"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Phố đường tàu Hà Nội (hay Phố đường tàu Phùng Hưng) nổi tiếng nhất với đoạn dài 2 km nối từ phố Phùng Hưng đến phố Lê Duẩn, chạy cắt ngang qua phố Trần Phú và phố Cửa Đông. Nơi đây đã trở thành điểm đến độc nhất vô nhị thu hút du khách trải nghiệm sự hòa quyện giữa kiến trúc Pháp và Việt Nam, cùng nhịp sống đời thường của người dân sinh sống sát mép đường ray. Vào cuối năm 2019, tuyến phố từng bị tạm dừng hoạt động vì lý do an toàn đường sắt. Đến giữa năm 2022, tuyến tham quan này đã được phục hồi phục vụ du lịch, nhưng du khách luôn phải tuân thủ nghiêm ngặt các quy định an toàn."
                    : "Hanoi Train Street (or Phung Hung Train Street) is most famous with the 2-kilometer section from Phung Hung Street to Le Duan Street, running across Tran Phu Street and Cua Dong Street. This has been recognized as a unique attraction for tourists to experience the coming together between French and Vietnamese architecture and also the local life of those residing along the railway. At the end of 2019, the street was closed down for safety purposes. In mid-2022, this route was restored to tourist activity, but visitors must ensure strict safety guidelines."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Địa chỉ: " : "Address: "}</strong>
                  {lang === "vi" ? "Phố Phùng Hưng, Quận Hoàn Kiếm" : "Phung Hung Street"}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Giờ tàu chạy (Train times):" : "Train times:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>
                    <strong>{lang === "vi" ? "Ngày trong tuần (Weekdays): " : "Weekdays: "}</strong>
                    7:00 PM, 7:45 PM, 8:30 PM, 10:00 PM
                  </li>
                  <li>
                    <strong>{lang === "vi" ? "Cuối tuần (Weekends): " : "Weekends: "}</strong>
                    9:15 AM, 11:20 AM, 3:20 PM, 5:30 PM, 6:00 PM, 7:00 PM, 7:45 PM, 8:30 PM, 9:00 PM, 11:00 PM
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 11. 10 MUST-TRY DISHES IN HANOI (SCREENSHOT 3, 4, 5) ─── */}
        <section id="hanoi-dishes" style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {lang === "vi" ? "10 món ngon nhất định phải thử ở Hà Nội" : "10 must-try dishes in Hanoi"}
          </h2>

          <p style={{ fontStyle: "italic", fontSize: "15px", lineHeight: "1.8", color: "#555", textAlign: "justify", marginBottom: "20px" }}>
            {lang === "vi"
              ? "Hà Nội – thủ đô ngàn năm văn hiến, là cái nôi của tinh hoa ẩm thực Việt Nam. Bên cạnh những món ăn đã vang danh thế giới như Phở hay Bún chả, Hà Nội vẫn còn rất nhiều món ăn đặc sắc mang đậm hương vị truyền thống. Dưới đây là top 10 món ăn hàng đầu bạn không thể bỏ lỡ trong hành trình ẩm thực tại Hà Nội."
              : "Hanoi – the capital of a thousand years of civilization, is the cradle of Vietnamese cuisine. In addition to the dishes that have made Vietnam famous such as Pho or Bun Cha, Hanoi still has very typical dishes. Here are the top 10 dishes you should not miss on your culinary journey in Hanoi."}
          </p>

          <div style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
            border: "1px solid #99f6e4",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0f766e", fontSize: "15px" }}>
                {lang === "vi" ? "👉 Cẩm nang chuyên sâu ẩm thực Phố Cổ:" : "👉 Signature Hanoi Food Editorial:"}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {lang === "vi"
                  ? "8 món ngon nhất định phải thử tại Hà Nội (kèm địa chỉ quán gia truyền & giá cả chi tiết)"
                  : "8 Must-Try Foods in Hanoi & Where to Eat Them (with authentic addresses & transparent prices)"}
              </div>
            </div>
            <Link
              href="/guide/8-must-try-foods-in-hanoi"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                background: "#00c2cb",
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <span>{lang === "vi" ? "Xem bài viết chi tiết" : "Read Full Article"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* DISH 1: PHO (SCREENSHOT 3 & 4) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "1. Phở Hà Nội (Pho)" : "1. Pho"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-pho-hd.jpg"
                    alt="Traditional Pho Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Phở bò Hà Nội thơm lừng hương vị truyền thống" : "Traditional Pho Hanoi"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi" ? (
                    <>
                      Không cần phải bàn cãi, Phở đã được toàn thế giới công nhận là linh hồn của{" "}
                      <a href="/guide/the-complete-guide-to-vietnam" style={{ color: "#008b94", textDecoration: "underline" }}>
                        ẩm thực Việt Nam
                      </a>{" "}
                      và là một phần không thể thiếu gắn bó với người dân Việt Nam từ thế hệ này sang thế hệ khác. Dù bạn có thể thưởng thức phở ở bất cứ nơi đâu, không thể phủ nhận rằng Phở Hà Nội – nơi cội nguồn sinh ra món ăn này – vẫn là chuẩn mực thơm ngon nhất.
                    </>
                  ) : (
                    <>
                      Needless to say, Pho has been recognized all around the world as the soul of{" "}
                      <a href="/guide/the-complete-guide-to-vietnam" style={{ color: "#008b94", textDecoration: "underline" }}>
                        Vietnamese cuisine
                      </a>{" "}
                      and is one of the indispensable parts associated with Vietnamese people from generation to generation. Although Pho can be found anywhere you go, it cannot be denied that Pho Hanoi – where it was originally from – is at its best.
                    </>
                  )}
                </p>

                <p>
                  {lang === "vi"
                    ? "Một bát phở chuẩn vị đòi hỏi quy trình chuẩn bị và ninh nấu vô cùng tỉ mỉ. Phở được chế biến từ các nguyên liệu chính gồm nước dùng ninh xương bò ngọt thanh, bánh phở mềm mướt và những lát thịt bò thái mỏng. Điểm khác biệt giữa Phở Hà Nội và Phở miền Nam là bát phở Bắc ngập tràn hành hoa thái nhỏ và không kèm đĩa rau thơm sống riêng biệt (thay vào đó, phở luôn ăn kèm với bánh quẩy vàng giòn nóng hổi)."
                    : "A decent bowl of Pho requires a meticulous preparation and cooking process. Pho is made from the main ingredients such as bone-beef broth, noodles, and thinly sliced beef. What makes Pho Hanoi different from Pho in the south is that you will find lots of green onion in your bowl and there are no side green herbs (instead, it is sided with \"bánh quẩy\" or hot finger-shaped soufflé)."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Thực đơn phở thường có rất nhiều lựa chọn phần thịt bò, có thể khiến bạn phân vân trong lần đầu trải nghiệm. Một lựa chọn an toàn và ngon nhất để gọi là \"Phở tái nạm\" – phở với thịt bò tái mềm và nạm giòn thơm (bạn có thể gọi thêm bò viên tùy khẩu vị cá nhân)."
                    : "Oftentimes, there are many types of beef you can choose from the menu, which could be confusing for your first experience. A safe option to stick to is \"Phở tái nạm\" – Pho with rare lean & brisket beef (with or without \"bò viên\" – meatballs depending on your preference)."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Khi ăn, bạn hãy thêm một chút giấm tỏi ớt và tương ớt truyền thống vào bát, trộn đều, nhúng miếng bánh quẩy ngập vào nước dùng nóng hổi rồi thưởng thức một miếng đầy đặn để cảm nhận sự bùng nổ hương vị thơm ngậy trong vòm họng."
                    : "When eating, you can add a bit of pickled garlic and homemade chili sauce to the bowl, mix it up, dip \"bánh quẩy\" in the broth then have a big bite of everything and the explosion of flavors in your mouth."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Một số quán phở ngon nức tiếng tại Hà Nội:" : "Some famous delicious Pho restaurants in Hanoi:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>49 Phố Bát Đàn, Quận Hoàn Kiếm (30,000 VND – 55,000 VND)</li>
                  <li>13 Phố Lò Đúc, Quận Hoàn Kiếm (40,000 VND – 60,000 VND)</li>
                  <li>10 Phố Lý Quốc Sư, Quận Hoàn Kiếm (50,000 VND – 80,000 VND)</li>
                </ul>
                <p style={{ marginTop: "12px" }}>
                  <Link href="/guide/pho-the-complete-guide" style={{ color: "#008b94", fontWeight: "600", textDecoration: "underline" }}>
                    {lang === "vi" ? "👉 Xem Cẩm nang chi tiết về Phở Việt Nam" : "👉 Read The Complete Guide to Vietnamese Pho"}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* DISH 2: BUN CHA (SCREENSHOT 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "2. Bún Chả Hà Nội (Bun Cha)" : "2. Bun Cha"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-buncha-hd.jpg"
                    alt="Bun Cha Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Bún chả nướng than hoa thơm nức đậm đà Hà Nội" : "Bun Cha Hanoi"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Bún Chả thực tế còn gắn liền với ẩm thực thủ đô sâu đậm hơn cả Phở, đúng như tên gọi của nó. Một suất bún chả bao gồm đĩa bún sợi nhỏ mềm mát, bát thịt nướng và chả miếng ngập trong nước mắm chua ngọt ấm nóng kèm đu đủ giòn, cùng một rổ rau sống tươi non để cân bằng dinh dưỡng."
                    : "Bun Cha is actually even more synonymous with Hanoi cuisine than Pho, which is suggested in its name. One portion of Bun Cha consists of thin noodles, grilled pork in sweet and vinegary broth, and a small basket of green herbs to balance out the meaty protein."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Tinh hoa của Bún Chả Hà Nội nằm ở những miếng thịt chả nướng than hoa: thịt phải được chọn theo tỷ lệ nạc mỡ hài hòa, tẩm ướp vừa vặn với các loại gia vị hành tỏi rồi nướng xém vàng trên vỉ than hồng đỏ rực."
                    : "The essence of Bun Cha Hanoi lies among the BBQ pork which has to meet the balanced proportion of lean meat and fat before being seasoned with the right amount of herbs and spices then grilled on an open coal-fire."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Khi ăn bún chả, bạn sẽ được phục vụ một chiếc bát nhỏ riêng. Hãy gắp một chút bún tươi, thêm miếng thịt nướng và ít rau thơm rồi chan một thìa nước mắm chua ngọt vào. Món ăn ngon nhất khi bạn thưởng thức đầy đủ các thành phần cùng một lúc."
                    : "When eating Bun Cha Hanoi, you will be given an extra small bowl. Take a bit of noodle, add grilled pork and some herbs, then pour in a bit of the broth. It tastes best when you have a bit of everything at the same time."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Bún chả được bán cả ngày, tuy nhiên thời điểm lý tưởng nhất để thưởng thức là vào bữa trưa, vì thịt nướng có thể hơi nhiều đạm cho bữa sáng và khẩu phần một suất rất đầy đặn – cung cấp dồi dào năng lượng cho phần còn lại trong ngày của bạn. Bạn cũng rất nên gọi thêm Nem Rán (chả giò rán giòn rụm) để bữa ăn thêm trọn vị."
                    : "Bun Cha is available all day, however, it is ideal to eat Bun Cha for lunch, as it could be a bit too fatty for breakfast and its serving portion is huge and very filling – which will give you energy for the rest of the day. It is also recommended to order Nem Ran – a square version of spring rolls."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Một số địa chỉ gợi ý dành cho bạn:" : "Some recommendations for you:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>1 Hang Manh Street, Hoan Kiem District (50,000 VND – 60,000 VND)</li>
                  <li>74 Hang Quat Street, Hoan Kiem District (30,000 VND – 50,000 VND)</li>
                  <li>24 Le Van Huu Street, Hoan Kiem District (40,000 VND – 60,000 VND)</li>
                </ul>
                <p style={{ marginTop: "12px" }}>
                  <Link href="/guide/8-must-try-foods-in-hanoi" style={{ color: "#008b94", fontWeight: "600", textDecoration: "underline" }}>
                    {lang === "vi" ? "👉 Khám phá thêm: 8 món ngon nhất định phải thử tại Hà Nội" : "👉 Explore more: 8 Must-Try Foods in Hanoi"}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* DISH 3: BUN THANG (SCREENSHOT 1 & 2) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "3. Bún Thang Hà Nội (Bun Thang)" : "3. Bun Thang"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-bunthang-hd.jpg"
                    alt="Bun Thang Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Bát bún thang cầu kỳ, thanh tao và rực rỡ sắc màu của ẩm thực Hà thành" : "Bun Thang Hanoi"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Trái ngược với vị ngọt thanh tao, dịu nhẹ và giản dị của nước dùng, bạn sẽ vô cùng kinh ngạc khi biết rằng cần đến hơn 20 loại nguyên liệu khác nhau để làm nên một bát Bún Thang trọn vẹn."
                    : "In contrast with the light sweetness and simple taste of the broth, you will be amazed that it requires more than 20 different ingredients to make up a bowl of Bun Thang."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Khi được bưng ra phục vụ, bát bún thang được bày biện tỉ mỉ với trứng rán thái chỉ mỏng như sợi tơ, thịt gà xé, nấm hương, hành hoa, giò lụa thái sợi, tôm khô/ruốc tôm... Mọi thứ đều được thái chỉ sợi nhỏ đều tăm tắp và xếp đặt gọn gàng, đan xen rực rỡ trên nền bún trắng ngần. Nhờ vậy, Bún Thang không chỉ thơm ngon bổ dưỡng mà còn vô cùng bắt mắt như một bức tranh ẩm thực đa sắc màu."
                    : "When being served, Bun Thang will be presented with fried eggs, chicken, shiitake mushrooms, green onions, pork cake, dried shrimp and so on. Everything is sliced up and neatly placed on the bed of rice noodles. So, Bun Thang is not only tasty but also eye catching with all the colorful ingredients."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Hương vị của Bún Thang đối với một số người có thể khá \"thanh nhẹ và tinh tế\", vì vậy món ăn này đặc biệt thích hợp cho bữa điểm tâm sáng. Nếu bạn muốn vị đậm đà hơn một chút, hãy nêm thêm vài giọt nước mắm ngon nguyên chất."
                    : "The taste of Bun Thang is, for some people, quite \"light and plain\"; so, it will be suitable for breakfast. If you like it a bit more savory, add a tiny bit of fish sauce."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Bạn có thể thưởng thức Bún Thang tại một số địa chỉ sau:" : "You can try Bun Thang in some of the following locations:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>48 Cau Go Street, Hoan Kiem District (35,000 VND – 50,000 VND)</li>
                  <li>29 Hang Hanh Street, Hoan Kiem District (35,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 4: BANH MI (SCREENSHOT 2 & 3) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "4. Bánh Mì Hà Nội (Banh Mi)" : "4. Banh Mi"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-banhmi-hd.jpg"
                    alt="Banh Mi Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Bánh mì kẹp pa-tê gan béo ngậy đặc trưng của Hà Nội" : "Banh Mi Hanoi"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Bánh mì ngày càng khẳng định vị thế vững chắc trong nền văn hóa ẩm thực Việt Nam, khi nhà báo David Farley của đài BBC từng hết lời ca ngợi Bánh mì Việt Nam là món bánh mì kẹp ngon nhất thế giới."
                    : "Banh Mi gradually asserts its position in Vietnamese culinary culture, as the BBC's David Farley once praised Banh Mi of Vietnam as the best sandwich in the world."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Có thể bạn đã quen thuộc với Bánh mì vì danh tiếng lan tỏa khắp toàn cầu; nhưng khác với Bánh mì ở Sài Gòn thường chú trọng vào nước sốt đậm đà, Bánh mì ở Hà Nội lại đặc biệt và dễ nhận biết nhất nhờ lớp pa-tê gan béo ngậy đặc trưng. Lớp pa-tê thơm lừng, đậm vị được phết khéo léo bên trong ổ bánh mì vừa ra lò vàng ruộm – ruột mềm xốp và lớp vỏ giòn rụm bên ngoài."
                    : "You may already be familiar with Banh Mi as it is quite globally widespread; but unlike Banh Mi in Saigon which emphasizes the sauce, Banh Mi in Hanoi is special and recognizable for its pâté. The rich and flavorful pâté is spread between a freshly-baked baguette that is soft inside and crispy outside."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Ngày nay, bạn có thể tìm thấy Bánh mì theo hai phiên bản: bánh mì kẹp truyền thống và bánh mì chảo (thịt, xúc xích, trứng ốp la nóng hổi trên chảo gang phục vụ kèm bánh mì). Bánh mì kẹp truyền thống chắc chắn là lựa chọn bạn nên trải nghiệm trước tiên vì đó là cách ăn nguyên bản để cảm nhận trọn vẹn mọi phong vị chỉ trong một miếng cắn."
                    : "Now, you can find Banh Mi in two versions: Banh Mi sandwiches and one-pan toppings served with Banh Mi on the side. Traditional Banh Mi sandwiches are definitely recommended as it is how Banh Mi is originally eaten and how you fully taste Banh Mi in one bite."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Trải nghiệm thưởng thức bánh mì sẽ chưa thể trọn vẹn nếu thiếu đi một ly cà phê đen hoặc cà phê sữa đậm đà kiểu Việt Nam. Đây là bộ đôi bất hủ đi cùng năm tháng."
                    : "A Banh Mi experience is not complete without being combined with Vietnamese black / milk coffee. This is the all time go to combo."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Một số gợi ý quán ngon dành cho bạn:" : "Some suggestions for you:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>25 Hang Ca, Hoan Kiem District (15,000 VND – 25,000 VND)</li>
                  <li>38 Dinh Liet Street, Hoan Kiem District (15,000 VND – 35,000 VND)</li>
                  <li>34 Lo Su Street, Hoan Kiem District (15,000 VND – 25,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 5: LA VONG GRILLED FISH (SCREENSHOT 3 & 4) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "5. Chả Cá Lã Vọng (La Vong Grilled Fish)" : "5. La Vong Grilled Fish"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-chaca-hd.jpg"
                    alt="Cha Ca La Vong Grilled Fish"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Chả cá Lã Vọng xèo xèo trên chảo nóng cùng thì là và hành hoa" : "La Vong Grilled Fish"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Chả Cá từ lâu đã là một món ăn đặc sản tinh hoa của Hà Nội. Đây là món ăn cầu kỳ ngay từ khâu tuyển chọn nguyên liệu. Thịt cá được lấy từ cá lăng tươi ngon nhất hoặc cá quả thịt chắc nịch để giữ được độ dai ngọt tự nhiên. Khi từng miếng cá tẩm nghệ đã chín vàng xèo xèo trên chảo mỡ sôi, hành hoa cắt khúc và thì là tươi non được trút ngập vào chảo đảo đều hòa quyện cùng các nguyên liệu khác."
                    : "Cha Ca (grilled fish cakes) has long been a specialty of Hanoi. It is a complicated dish right from the stage of selecting ingredients. Made from the freshest Hemibagrus fish and Snakehead fish so the texture will be firm and chewy. When the fish is almost cooked, green onion and dill are added to the hot pan and well mixed with other ingredients."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Thật thú vị, quán Chả Cá Lã Vọng đầu tiên do gia tộc họ Đoàn gây dựng đã trải qua hơn 5 thế hệ tiếp nối, và chính con phố nơi quán tọa lạc xưa kia đã được đổi tên theo món ăn biểu tượng này (Phố Chả Cá)."
                    : "Interestingly, the first Cha Ca La Vong restaurant has been surviving for 5 generations and the street on which it is located now was renamed after this iconic food (Cha Ca Street)."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Chả cá Lã Vọng được ăn kèm với bún rối, lạc rang giòn bùi và \"mắm tôm\" đánh sủi bọt – thứ nước chấm có thể hơi nồng đối với những ai chưa quen. Bạn hãy vắt thêm nước cốt chanh hoặc quất tươi, thêm chút đường và vài lát ớt rồi đánh bông mắm tôm lên để làm dịu mùi nồng và dậy lên vị chua cay mặn ngọt hài hòa tuyệt hảo."
                    : "Cha Ca La Vong is eaten with noodles, roasted peanuts and \"mắm tôm\" – shrimp paste which could be too strong for those who are not familiar with it. It is suggested that you add a bit of lime or kumquat juice to the paste and well mix it to reduce the strong smell and taste."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Chúng tôi gợi ý các nhà hàng sau để bạn thưởng thức món ăn này tại Hà Nội:" : "We recommend these restaurants for you to enjoy this dish in Hanoi:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>14 Cha Ca Street and 107 Nguyen Truong To Street, Hoan Kiem District (170,000 VND)</li>
                  <li>120 K1 Giang Vo Street, Ba Dinh District (140,000 VND)</li>
                  <li>171 Thai Ha Street, Hoan Kiem District (139,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 6: PHO CUON AND PHO CHIEN (SCREENSHOT 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "6. Phở Cuốn & Phở Chiên (Pho Cuon and Pho Chien)" : "6. Pho Cuon and Pho Chien"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-phocuon-hd.jpg"
                    alt="Pho Cuon and Pho Chien Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Hộp phở cuốn thanh mát ăn kèm nước mắm chấm chua ngọt" : "Pho Cuon and Pho Chien"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Như chúng tôi đã đề cập trước đó, mùa hè ở Hà Nội vô cùng oi ả và nắng nóng. Vì vậy, dù rất yêu thích phở, việc xì xụp một bát phở nước nóng hổi giữa tiết trời hè đôi khi không phải là lựa chọn hấp dẫn nhất. Đó chính là lý do người Hà Nội đã sáng tạo nên món Phở Cuốn và Phở Chiên vô cùng tài tình – những phiên bản \"khô\" độc đáo kế thừa tinh hoa của phở truyền thống."
                    : "As we mentioned before, the summer in Hanoi is extremely unpleasantly hot. And so, although we love Pho, the idea of slurping a hot bowl of Pho under that weather condition does not sound very tempting. That's why Hanoians came up with the genius creation of Pho Cuon and Pho Chien (Pho rolls and pan-fried Pho) – which is somehow the dry version of traditional Pho."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Bạn vẫn sẽ bắt gặp các nguyên liệu chủ đạo của phở gồm bánh phở, thịt bò và rau thơm. Tuy nhiên, thay vì thái sợi nhỏ, người ta dùng nguyên lá bánh phở vuông mềm mỏng cuốn tròn bên trong thịt bò xào lăn đậm đà cùng các loại rau thơm tươi mát. Phở cuốn chấm cùng bát nước mắm chua ngọt thanh dịu là món ăn mùa hè tuyệt vời nhất mà bạn từng trải nghiệm. Phở chiên cũng dùng những nguyên liệu này, nhưng thịt bò và rau cải ngọt được xào sốt đậm đà rồi trút lên trên đĩa bánh phở chiên giòn rụm."
                    : "You can still find the star ingredients of Pho which are noodles, beef and herbs. However, instead of being cut into stripes, they use Pho sheets to wrap seasoned and stir-fried together with green herbs inside. Pho Cuon is complemented by dipping in light, vinegary sauce, which is the best summery food you could ever have. Pho Chien also uses the same ingredients but beef and vegetables are stir-fried and top on a bed of deep-fried, crispy Pho noodles."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Một biến thể nổi tiếng khác của phở chiên là Phở Chiên Phồng (bánh phở hình vuông phồng rộp). Những lá bánh phở được cắt vuông vức rồi thả vào chảo dầu sôi già cho đến khi phồng căng xốp như những chiếc gối nhỏ – giòn rụm bên ngoài và mềm xốp rỗng bên trong. Món này ăn kèm với thịt bò xào mềm thơm nức, hành tây và rau cải xanh sốt sánh mịn."
                    : "Another version of Pho Chien is Pho Chien Phong (Pho crackers in squared-shape). Pho sheets are cut into squares and deep-fried until they turn into Pho crackers – airy in the middle and crispy outside. These are again stir-fried with tender beef, onion and green vegetables."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Ghi chú & Mẹo thưởng thức (Notes and tips):" : "Notes and tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Tại các quán Phở Cuốn (đặc biệt quanh khu làng Ngũ Xã), thường phục vụ món ăn vặt kèm theo là \"Ngô chiên bơ\" – hạt ngô ngọt tẩm bột chiên bơ vàng ươm, thơm ngậy như bắp rang bơ kiểu Việt Nam. Bạn sẽ khó tìm thấy món này ở nơi nào khác và chúng tôi phải thừa nhận đây là món ăn vặt cực kỳ gây nghiện. Hãy chắc chắn rằng bạn sẽ gọi thử một đĩa."
                    : "At Pho Cuon restaurants, there is often a snack called \"Ngô chiên bơ\" – which is basically popcorn but in Vietnamese style. You could not find it anywhere else and we have to admit that it is a very addictive snack. Make sure you will give it a try."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Các món ăn này thường được phục vụ theo đĩa lớn đủ cho 2-3 người ăn chung. Do đó, bạn nên gọi món lần lượt từng đĩa một để tránh bị quá tải thức ăn, đồng thời luôn được thưởng thức món ăn khi vừa mới nấu xong còn nóng giòn tươi ngon."
                    : "These dishes are served in big portions which are enough for 2-3 people. So, it is recommended that you order one by one to make sure you are not overloaded with foods and also can enjoy them while they are freshly cooked and served."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Một số địa chỉ gợi ý dành cho bạn:" : "Some recommendations for you:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>29B Ngu Xa, Ba Dinh District (25,000 VND – 75,000 VND)</li>
                  <li>31 Ngu Xa, Ba Dinh District (25,000 VND – 75,000 VND)</li>
                  <li>108B1 Tran Huy Lieu, Ba Dinh District (25,000 VND – 80,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 7: NGAN CHAY TOI (SCREENSHOT 1 & 2) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "7. Ngan Cháy Tỏi (Ngan Chay Toi)" : "7. Ngan Chay Toi"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-nganchaytoi-hd.jpg"
                    alt="Ngan Chay Toi Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Mẹt ngan cháy tỏi thơm lừng ăn kèm bún, canh măng và nước chấm gừng ớt" : "Ngan Chay Toi"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Ngan Cháy Tỏi (thịt ngan chiên ngập tỏi) là một \"ngôi sao đang lên\" rực rỡ trên bản đồ ẩm thực thủ đô. Được tình cờ sáng tạo bởi một người đầu bếp gia đình – người chỉ đang tìm cách nấu lại phần thịt ngan còn thừa cho bữa cơm người nhà, món ăn này đã nhanh chóng bùng nổ danh tiếng và trở thành một trong những món khoái khẩu được người dân Hà Nội mê mẩn nhất."
                    : "Ngan Chay Toi (duck fried with garlic) is a rising star on the Hanoian culinary map. Accidentally invented by a home cook chef – who was trying to cook up the leftovers for her family, this dish soon took off and became one of the most favorable dishes of the Hanoi people."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Thịt ngan được tẩm ướp đậm đà và chiên già lửa cùng bạt ngàn tép tỏi cho đến khi miếng thịt khoác lên sắc nâu caramel tuyệt đẹp cùng những lát tỏi giòn tan bùi ngậy. Một mẹt ngan cháy tỏi đầy đủ thường gồm 1/4 đến 1/2 con ngan (bạn có thể gọi nửa đĩa \"cháy tỏi\" và nửa đĩa \"luộc\"); một bát bún tươi hoặc miến tùy chọn; một bát canh măng tiết nóng hổi; rổ rau sống tươi non và bát nước mắm gừng tỏi ớt chua cay đậm đà. Tất cả được bày biện trên chiếc mâm tròn đặt trên ghế nhựa, trong khi thực khách quây quần trên những chiếc ghế nhựa nhỏ xung quanh để thưởng thức."
                    : "Duck meat is well seasoned and deep-fried with lots of garlic until they get that beautiful caramel color and crispy texture (for the garlic). A full combo of Ngan Chay Toi locally goes with a quarter to a half of a duck (you could ask for half \"cháy tỏi\" – deep-fried and half \"luộc\" – boiled); a bowl of noodles of your choice (could be \"bún\" – rice noodles or \"miến\" – glass vermicelli); a bowl of bamboo shoot soup; a small basket of fresh herbs; and of course a small bowl of ginger, garlic and chili fish sauce. All of these are served on a round serving platter which is set up on a plastic stool while you will be given even smaller plastic stools to sit around and enjoy your meal."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Ghi chú & Mẹo thưởng thức (Notes and tips):" : "Notes and tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Đây là món ăn sinh ra để chia sẻ cùng bạn bè, người thân. Một phần 1/4 con ngan là vừa vặn cho 2 người, và 1/2 con ngan sẽ đủ no nê cho nhóm ít nhất 3-4 người."
                    : "This is supposed to be a shared dish. A combo of 1/4 a duck is sufficient for 2 people and 1/2 a duck should be enough for at least 3-4 people."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Bạn sẽ ngồi trên những chiếc ghế nhựa con kê sát nhau; vì vậy hãy cân nhắc nếu bạn là người thích có không gian riêng tư và trải nghiệm ăn uống rộng rãi, êm ái hơn."
                    : "You will be sitting on little stools and quite close to each other; so consider if you feel like having your personal space and more comfortable dining space."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Dưới đây là một số địa chỉ gợi ý dành cho bạn:" : "Here are some suggested addresses for you:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>71 Hang Thiec, Hoan Kiem District (120,000 VND – 250,000 VND)</li>
                  <li>51 Hang Luoc, Hoan Kiem District (40,000 VND – 265,000 VND)</li>
                  <li>16 Hang Can, Hoan Kiem District (40,000 VND – 260,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 8: CHAO SUON (SCREENSHOT 2 & 3) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "8. Cháo Sườn (Chao Suon)" : "8. Chao Suon"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-chaosun-hd.jpg"
                    alt="Chao Suon Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Bát cháo sườn sánh mịn ăn kèm quẩy giòn và ruốc thịt đậm đà" : "Chao Suon"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Cháo Sườn dường như ít được du khách quốc tế biết đến hơn, nhưng lại là món ăn được những người bạn Hà Nội bản địa nhiệt tình tiến cử nhất. Đây đích thực là món \"comfort food\" (món ăn vỗ về tâm hồn) ấm áp tột cùng mà bạn tìm kiếm bấy lâu, ngay khi bạn nếm thử miếng đầu tiên."
                    : "Chao Suon (pork rib porridge) is somehow less recognized by tourists but highly recommended by our local Hanoian friends. This could be the ultimate comfort food that you have been looking for as long as you give it a try."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Cháo chính là linh hồn của món ăn này. Một nồi cháo chuẩn vị phải được ninh hoàn toàn từ nước hầm xương sườn ngọt lịm với tỷ lệ hoàn hảo giữa gạo tẻ và gạo nếp đã ngâm qua đêm trong nước sạch. Bột gạo xay nhuyễn được quấy đều tay và ninh nhỏ lửa cho đến khi đạt được độ sánh mịn như kem mượt mà. Sườn lợn và sườn sụn được ninh nhừ đến mức róc xương và tan ngay trong miệng. Một bát cháo sườn hoàn hảo là sự hòa quyện nhịp nhàng giữa cháo sánh mịn, ruốc thịt heo xé sợi bông xốp, thịt băm xào thơm và dĩ nhiên không thể thiếu những miếng sườn sụn mềm giòn."
                    : "Chao (or rice porridge) is the soul of this dish. A good one needs to be cooked in pork rib broth with the right proportion of rice and sticky rice which are already soaked in fresh water overnight. This porridge is then blended and slow-cooked until it gets a finely smooth and creamy texture. Pork ribs, meanwhile, are slow-cooked until they can be easily deboned and melts in your mouth. A perfect bowl of Chao Suon is a combination of rice porridge, shredded pork floss, minced pork and tender pork ribs of course."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Món cháo này thường được ăn vào bữa sáng hoặc những bữa ăn khuya ấm bụng. Bạn cũng có thể gọi thêm bánh quẩy giòn cắt nhỏ và trứng bắc thảo để tăng thêm hương vị đậm đà cho món ăn."
                    : "This dish is often eaten for breakfast or late-night meals. You can also order \"bánh quẩy\" (hot finger-shaped soufflé) and century eggs to add even more flavors to the dish."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Các địa chỉ ăn Cháo Sườn gợi ý:" : "Recommended addresses to eat Chao Suon:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>14 Dong Xuan, Hoan Kiem District (25,000 VND – 55,000 VND)</li>
                  <li>61A Ngo Huyen, Hoan Kiem District (30,000 VND – 50,000 VND)</li>
                  <li>55 Hong Tien, Long Bien District (45,000 VND – 70,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 9: BANH GOI AND BANH RAN MAN (SCREENSHOT 4) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "9. Bánh Gối & Bánh Rán Mặn (Banh Goi and Banh Ran Man)" : "9. Banh Goi and Banh Ran Man"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-banhgoi-hd.jpg"
                    alt="Banh Goi and Banh Ran Man Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Bánh gối vàng ươm giòn rụm với nhân thịt băm mộc nhĩ thơm ngon" : "Banh Goi and Banh Ran Man"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Dù tên tiếng Anh mang nghĩa \"bánh ngọt\" (bánh gối chiên giòn & bánh rán mặn), những món ăn này hoàn toàn không phải bánh tráng miệng thông thường (mà tựa như bánh bao chiên giòn kiểu Việt) và cách thưởng thức chúng cũng khác xa so với hình dung của bạn. Vỏ bánh gối và bánh rán mặn được làm từ bột mì và bột nếp, còn phần nhân bên trong là hỗn hợp thịt băm, mộc nhĩ, hành tây, cà rốt và miến dong."
                    : "Although the names suggest \"cakes\" (deep-fried pillow cakes & savory cakes), these dishes are not your typical dessert cakes (but more like Vietnamese deep-fried dumplings) and the way to eat them is nothing as in your imagination. Pillow cakes and savory cakes' skins are made with wheat flour and sticky rice powder and the fillings are a mixture of minced pork, wood ear mushrooms, onions, carrots and glass vermicelli."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Thông thường, các loại bánh sẽ được bày biện bắt mắt theo phong cách tự chọn. Bạn chỉ cần chỉ vào những món bánh mình ưng ý, chọn chỗ ngồi và người bán sẽ chiên nóng giòn lại rồi mang ra phục vụ. Tại bàn, bánh đã được cắt thành từng miếng vừa ăn và dọn kèm một bát nước chấm chua ngọt có thả đu đủ xanh giòn sần sật cùng rổ rau sống tươi non. Khi ăn, bạn hãy lấy một lá xà lách hoặc rau thơm, kẹp miếng bánh giòn rụm bên trong, cuộn tròn lại rồi chấm ngập vào bát nước mắm chua ngọt."
                    : "Typically, all the cakes will be displayed in a buffet style. You can simply point at whatever you feel like, go take a seat and they will serve you the exact ones but freshly cooked. At your table, the cakes are already cut up for you and they will be served with a small bowl of sweet and sour dipping sauce with green papaya sliced inside and some fresh leaves on the side. To eat this, you take a green leaf and add a piece of the cake together with some other herbs, wrap them up and dip in the sweet and sour sauce."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Món bánh này chiên ngập dầu nhiều lần nên vỏ rất giòn nhưng cũng có độ béo ngậy nhất định. Bạn sẽ cảm thấy món ăn ngon và hấp dẫn hơn gấp bội vào những ngày mưa lạnh; hoặc khi bạn đang đặc biệt thèm những món chiên giòn rụm."
                    : "This food is quite oily as it is deep fried several times so that the skins are crispy. You would probably find it more enjoyable to eat on a cold and rainy day; or when you particularly crave for some fried dishes."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Một số địa chỉ gợi ý dành cho bạn:" : "Some recommendations for you:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>52 Ly Quoc Su, Hoan Kiem District (13,000 VND)</li>
                  <li>112K Thai Thinh, Dong Da District (13,000 VND)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DISH 10: CA PHE TRUNG (SCREENSHOT 5) */}
          <div style={{ marginBottom: "44px" }}>
            <h3 className="vnn-hanoi-attraction-title">
              {lang === "vi" ? "10. Cà Phê Trứng (Ca Phe Trung)" : "10. Ca Phe Trung"}
            </h3>

            <div className="vnn-hanoi-attraction-split">
              <div className="vnn-hanoi-attraction-imgs-col">
                <div className="vnn-hanoi-attraction-img-item">
                  <img
                    src="/guide/hanoi/hanoi-caphetrung-nest-hd.jpg"
                    alt="Ca Phe Trung Egg Coffee Hanoi"
                  />
                  <p className="vnn-hanoi-editorial-caption">
                    {lang === "vi" ? "Tách cà phê trứng béo ngậy ấm nóng đặt trong tổ rơm mộc mạc" : "Ca Phe Trung"}
                  </p>
                </div>
              </div>

              <div className="vnn-hanoi-attraction-text-col">
                <p>
                  {lang === "vi"
                    ? "Có thể sẽ có đôi chút băn khoăn khi khép lại danh sách bằng một món đồ uống; nhưng thật khó để phân định Cà Phê Trứng là món tráng miệng hay thức uống. Vì vậy, tốt nhất bạn đừng bao giờ bỏ lỡ. Được ca ngợi nồng nhiệt trên hàng loạt tạp chí du lịch quốc tế, Cà Phê Trứng là sự sáng tạo trác tuyệt kết hợp giữa cà phê đen và lòng đỏ trứng gà. Đây là bản hòa tấu cân bằng hoàn mỹ giữa vị đắng nồng nàn của cà phê đen và lớp kem trứng đánh bông béo ngậy, ngọt dịu như nhung. Cà phê trứng ngon nhất khi thưởng thức lúc còn nóng hổi bằng cách: (1) khuấy đều và nhấp từng ngụm nhỏ, hoặc (2) múc thìa từ đáy cốc lên để cảm nhận trọn vẹn từng tầng hương vị bùng nổ."
                    : "It may be a bit controversial to end the list with a drink; but, it is hard to decide whether Ca Phe Trung (egg coffee) should be categorized as a dessert or a drink. So here it is, better not miss it. Having been praised by many international travel pages, Ca Phe Trung is a creative drink of black coffee and egg yolk. This is a perfectly balanced combination of bitter black coffee and creamy, lightly-sweet whisked egg yolk. Ca Phe Trung must be enjoyed while it is still hot by (1) mixing it up and sipping in small sips or (2) letting the spoon go from the bottom of the cup so you can experience a full layer of flavors."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Mẹo thưởng thức (Tips):" : "Tips:"}</strong>
                </p>

                <p>
                  {lang === "vi"
                    ? "Bạn cũng có thể lựa chọn Cà Phê Trứng Lạnh hoặc Ca Cao Trứng."
                    : "You can also choose Ca Phe Trung Lanh (iced egg coffee) or Cacao Trung (egg cocoa drink)."}
                </p>

                <p>
                  {lang === "vi"
                    ? "Thức uống này vô cùng béo ngậy, mịn màng và có thể chính là món giải khát sảng khoái mát lành mà bạn đang tìm kiếm trong những ngày hè nắng nóng."
                    : "This drink is super rich and creamy and probably the refreshing drink you are looking for on a hot summer day."}
                </p>

                <p>
                  <strong>{lang === "vi" ? "Thưởng thức một tách cà phê trứng trứ danh tại các quán sau:" : "Enjoy a cup of Egg coffee at the following coffee shops:"}</strong>
                </p>

                <ul className="vnn-hanoi-attraction-bullets">
                  <li>39 Nguyen Huu Huan Street, Hoan Kiem District (39,000 VND)</li>
                  <li>13 Dinh Tien Hoang Street, Hoan Kiem District (25,000 VND)</li>
                </ul>
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
              © {new Date().getFullYear()} VinaTap.
            </span>
          </div>

          <div className="home-footer__socials">
            <a href="https://www.facebook.com/profile.php?id=61594864803399&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="home-footer__social-link">
              Facebook
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

      {/* ─── AI COMPANION CHATBOT MODAL & FLOATING FAB ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onToggleOpen={setAiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        province={{
          name: lang === "vi" ? "Hà Nội" : "Hanoi",
          slug: "ha-noi",
        }}
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
