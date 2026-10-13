"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import HeaderSearch from "@/components/ui/HeaderSearch";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { getLang } from "@/lib/prefs";
import {
  Search,
  ChevronDown,
  Sparkles,
  Bot,
  Send,
  X,
  Facebook,
  Instagram,
  Youtube,
  Play,
  MapPin,
  ExternalLink,
  ArrowRight,
  Plane,
  Train,
  Car,
  Compass,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/plan-trip.css";

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
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
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
        id: "todo-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 11, 2026",
        dateVi: "11 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "todo-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 hoạt động không thể bỏ qua ở Việt Nam",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
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
        titleVi: "8 món ngon nhất định phải thử ở Hà Nội",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở truyền thống",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn tuyệt vời tại Vũng Tàu",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
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
        dateVi: "12 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
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
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
};

export default function PlanYourVietnamTripPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [companionInput, setCompanionInput] = useState("");
  const [companionMessages, setCompanionMessages] = useState([
    {
      role: "bot",
      content:
        "Xin chào! Tôi là Trợ lý AI Du lịch VinaTap. Bạn có thể nhập 1 câu prompt đơn giản (ví dụ: 'Lên lịch trình 2 tuần khám phá vịnh Hạ Long, Hội An và miền Tây') để tôi lập kế hoạch tức thì!",
    },
  ]);

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => setLang(e.detail);
    window.addEventListener("vinatap:lang-updated", handleLang);
    return () => window.removeEventListener("vinatap:lang-updated", handleLang);
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


  const handleSendCompanion = (e) => {
    e?.preventDefault();
    if (!companionInput.trim()) return;
    const userText = companionInput.trim();
    setCompanionMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      {
        role: "bot",
        content: `Cảm ơn bạn! Với yêu cầu "${userText}", hệ thống My Journey AI sẽ tối ưu hóa tuyến đường theo thời gian và chi phí hợp lý nhất cho bạn.`,
      },
    ]);
    setCompanionInput("");
  };

  return (
    <div className="plan-trip-page">
      {/* ─── 1. TOP BANNER (SCREENSHOT 1) ─── */}
      <div
        className="vnn-top-banner"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        title={
          lang === "vi"
            ? "TRỢ LÝ DU LỊCH AI MIỄN PHÍ • BẠN ĐỒNG HÀNH THÔNG MINH"
            : "FREE AI TRAVEL ASSISTANT • AI COMPANION"
        }
      >
        <div className="vnn-top-banner__inner">
          <img
            src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
            alt={
              lang === "vi"
                ? "Trợ lý Du lịch AI VinaTap - Đồng hành mọi chuyến đi"
                : "VinaTap AI Travel Assistant - AI Companion"
            }
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
              onMouseEnter={() => handleMenuEnter("things")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMegaMenu === "things" ? "is-active" : ""}`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
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
            <HeaderSearch />
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
                  <h4 className="vnn-megamenu__title">{item.title}</h4>
                  <p className="vnn-megamenu__date">{item.date}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO COVER SECTION (SCREENSHOT 1) ─── */}
      <section className="plan-trip-hero">
        <img
          src="/guide/hcmc/Plan-Your-Vietnam-Trip-with-Just-One-Prompt.jpg"
          alt="Plan Your Vietnam Trip with Just One Prompt"
          className="plan-trip-hero__bg"
        />
        <div className="plan-trip-hero__overlay" />
        <div className="plan-trip-hero__content">
          <div className="plan-trip-hero__badges">
            <span className="plan-trip-hero__badge">#TRENDING</span>
            <span className="plan-trip-hero__badge">FEATURED ARTICLES</span>
          </div>
          <h1 className="plan-trip-hero__title">
            Plan Your Vietnam Trip with Just One Prompt
          </h1>
          <div className="plan-trip-hero__meta">
            <span className="plan-trip-hero__author">By VinaTap</span>
            <span className="plan-trip-hero__date">October 11, 2026</span>
          </div>
        </div>
      </section>

      {/* ─── 4. MAIN ARTICLE CONTENT CONTAINER (SCREENSHOTS 2, 3, 4, 5) ─── */}
      <main className="plan-trip-container">
        {/* CTA PILL BUTTON (SCREENSHOT 2) */}
        <div className="plan-trip-cta-wrap">
          <button
            type="button"
            className="plan-trip-cta-btn"
            onClick={() => setAiCompanionOpen(true)}
          >
            <Sparkles size={16} />
            <span>Create your Vietnam trip in seconds</span>
          </button>
        </div>

        <div className="plan-trip-body">
          <p>
            Planning a trip to Vietnam can take hours, researching destinations,
            routes, transport options, and costs.
          </p>
          <p>What if you could do it all… in seconds?</p>
          <p>
            My Journey is a smart travel planning feature inside{" "}
            <a
              href="#ai-companion"
              onClick={(e) => {
                e.preventDefault();
                setAiCompanionOpen(true);
              }}
              style={{ color: "#00aab2", fontWeight: 600, textDecoration: "underline" }}
            >
              Tripion AI
            </a>
            , designed specifically for Vietnam. It helps you create, optimize,
            and manage your entire itinerary with just one prompt.
          </p>


          {/* ─── SECTION 1: CREATE YOUR ITINERARY INSTANTLY (SCREENSHOT 3) ─── */}
          <h2>Create Your Itinerary Instantly</h2>
          <p>Simply type your request, for example:</p>

          <div className="plan-trip-prompt-quote">
            “I want to spend 3 weeks in Vietnam starting December 11, focusing on
            coastal cities.”
          </div>

          <p>
            The system automatically analyzes your input and generates a
            personalized itinerary tailored to your preferences.
          </p>

          <div style={{ margin: "24px 0 36px 0" }}>
            <button
              type="button"
              className="plan-trip-cta-btn plan-trip-cta-btn--secondary"
              onClick={() => setAiCompanionOpen(true)}
            >
              Create Your Itinerary
            </button>
          </div>

          {/* ─── SECTION 2: VISUALIZE YOUR JOURNEY ON THE MAP (SCREENSHOT 3 & 4) ─── */}
          <h2>Visualize Your Journey on the Map</h2>
          <p>
            Your itinerary is displayed on an interactive map with routes drawn
            directly between destinations.
          </p>
          <p>Transportation is clearly color-coded for easy understanding:</p>

          <ul className="plan-trip-list">
            <li><strong>Blue</strong> for flights</li>
            <li><strong>Green</strong> for trains</li>
            <li><strong>Orange</strong> for roads</li>
            <li><strong>Cyan</strong> for waterways</li>
          </ul>

          <p>Alongside the map, you’ll see:</p>

          <ul className="plan-trip-list">
            <li>A structured list of destinations in order</li>
            <li>Suggested number of nights at each location</li>
          </ul>

          <p>You can also:</p>

          <ul className="plan-trip-list">
            <li>Add nearby destinations or places along your route</li>
            <li>Remove destinations you don’t want</li>
          </ul>

          {/* UI SCREENSHOT CARD (SCREENSHOT 4) */}
          <div className="plan-trip-ui-card">
            <div className="plan-trip-ui-img-wrap">
              <img
                src="/guide/plan-trip/tripion-ai-ui.jpg"
                alt="Triplon AI Platform for Multi-City Travel in Asia - Interactive Route Map and Itinerary"
                className="plan-trip-ui-img"
              />
            </div>
            <p className="plan-trip-ui-caption">
              Triplon — The AI Platform for Multi-City Travel in Asia
            </p>
          </div>

          {/* ─── SECTION 3: DETAILED TRANSPORT INFORMATION (SCREENSHOT 4 & 5) ─── */}
          <h2>Detailed Transport Information</h2>
          <p>In the Transport tab, each route is broken down with:</p>

          <ul className="plan-trip-list">
            <li>Distance</li>
            <li>Transport type</li>
            <li>Carrier (airlines, buses, trains, etc.)</li>
            <li>Travel duration</li>
            <li>Frequency</li>
            <li>Estimated price</li>
          </ul>

          <p>
            This allows you to understand and plan every part of your journey with
            clarity.
          </p>

          {/* ─── SECTION 4: OVERVIEW OF YOUR ENTIRE TRIP (SCREENSHOT 5) ─── */}
          <h2>Overview of Your Entire Trip</h2>
          <p>My Journey provides a quick summary of your itinerary, including:</p>

          <ul className="plan-trip-list">
            <li>Total number of destinations</li>
            <li>Total number of nights</li>
            <li>Total travel time</li>
            <li>Estimated transport cost</li>
          </ul>

          <p>Everything you need — at a glance.</p>

          {/* ─── SECTION 5: FLEXIBLE EDITING AND SMART OPTIMIZATION (SCREENSHOT 5) ─── */}
          <h2>Flexible Editing and Smart Optimization</h2>
          <p>You are always in control of your itinerary.</p>

          <ul className="plan-trip-list">
            <li>Drag and drop destinations to reorder your trip</li>
            <li>Instantly update routes and transport options</li>
          </ul>

          <p>Use the Optimize feature to refine your journey:</p>

          <ul className="plan-trip-list">
            <li>Find the cheapest routes</li>
            <li>Choose the fastest connections</li>
            <li>Use Smart Routes to automatically generate the most efficient plan</li>
          </ul>

          <p>You can optimize multiple times to find what works best for you.</p>

          {/* ─── SECTION 6: PLAN WHAT TO DO IN EACH DESTINATION ─── */}
          <h2>Plan What to Do in Each Destination</h2>
          <p>Go beyond just destinations.</p>
          <p>
            For each location, you can select places to visit and build a detailed
            exploration plan for every city.
          </p>

          {/* ─── SECTION 7: DOWNLOAD AND SHARE YOUR PLAN ─── */}
          <h2>Download and Share Your Plan</h2>
          <p>Once your itinerary is ready, you can download it in multiple formats:</p>

          <ul className="plan-trip-list">
            <li>Quick overview (image)</li>
            <li>Full itinerary (including routes, transport, and pricing)</li>
            <li>Travel maps with your selected places</li>
          </ul>

          <p>
            You can also share your itinerary with friends, making it easy to plan
            together and stay aligned.
          </p>

          <p style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic", marginTop: "24px" }}>
            Note: Plans are for reference. Please verify details before traveling.
          </p>

          <hr className="plan-trip-divider" />

          {/* ─── RELATED ARTICLES (Hình 2) ─── */}
          <section className="plan-trip-related">
            <h2 className="plan-trip-related__title">Related Articles</h2>
            <div className="plan-trip-related__grid">
              <Link
                href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
                className="plan-trip-related__card"
              >
                <div className="plan-trip-related__img-wrap">
                  <img
                    src="/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg"
                    alt="15 best places to visit in Vietnam in 2026"
                    className="plan-trip-related__img"
                  />
                </div>
                <h3 className="plan-trip-related__card-title">
                  15 best places to visit in Vietnam in 2026
                </h3>
              </Link>

              <Link
                href="/guide/the-complete-guide-to-vietnam"
                className="plan-trip-related__card"
              >
                <div className="plan-trip-related__img-wrap">
                  <img
                    src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                    alt="The Complete Guide to Vietnam"
                    className="plan-trip-related__img"
                  />
                </div>
                <h3 className="plan-trip-related__card-title">
                  The Complete Guide to Vietnam
                </h3>
              </Link>

              <Link
                href="/guide/20-best-things-to-do-in-vietnam"
                className="plan-trip-related__card"
              >
                <div className="plan-trip-related__img-wrap">
                  <img
                    src="/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg"
                    alt="20 Best Things to Do in Vietnam"
                    className="plan-trip-related__img"
                  />
                </div>
                <h3 className="plan-trip-related__card-title">
                  20 Best Things to Do in Vietnam
                </h3>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ─── 5. FLOATING AI COMPANION BUTTON & MODAL (Hình 1) ─── */}
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
              src="/logo.png"
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

      {/* Hộp Chat AI Travel Companion */}
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
              <h3>Tìm kiếm cẩm nang & điểm đến</h3>
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
                  placeholder="Nhập tên thành phố (Hà Nội, Hội An, Sapa, Đà Nẵng...)..."
                  value={searchModalText}
                  onChange={(e) => setSearchModalText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="vnn-search-quick-tags">
                <span>Gợi ý:</span>
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
      <PublicFooter lang={lang} />
    </div>
  );
}
