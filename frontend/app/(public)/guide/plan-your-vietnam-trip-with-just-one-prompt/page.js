"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
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
        link: "/province/lam-dong",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "November 12, 2024",
        dateVi: "12 Tháng 11, 2024",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/quang-nam",
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
        id: "todo-1",
        title: "3 week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 điều tuyệt nhất ở TP. Hồ Chí Minh",
        date: "May 5, 2025",
        dateVi: "5 Tháng 5, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 hoạt động không thể bỏ qua tại Nha Trang",
        date: "March 1, 2025",
        dateVi: "1 Tháng 3, 2025",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm hàng đầu ở Việt Nam",
        date: "January 1, 2025",
        dateVi: "1 Tháng 1, 2025",
        badge: "#Trending",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan tuyệt nhất Đà Lạt",
        date: "July 21, 2024",
        dateVi: "21 Tháng 7, 2024",
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
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city?tab=foods",
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
        date: "July 20, 2025",
        dateVi: "20 Tháng 7, 2025",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "May 21, 2024",
        dateVi: "21 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "May 20, 2024",
        dateVi: "20 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "May 18, 2024",
        dateVi: "18 Tháng 5, 2024",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
    ],
  },
};

export default function PlanYourVietnamTripPage() {
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
                <span>BE INSPIRED</span>
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
                <span>DESTINATIONS</span>
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
                <span>THINGS TO DO</span>
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
                <span>EAT & DRINK</span>
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
                <span>ITINERARIES</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <button
              type="button"
              className="vnn-navbar__search-btn"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>
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
            <span className="plan-trip-hero__date">April 1, 2026</span>
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

          {/* ─── VIDEO PLAYER SECTION (SCREENSHOT 2) ─── */}
          <div className="plan-trip-video-card">
            {!isVideoPlaying ? (
              <div
                className="plan-trip-video-cover"
                onClick={() => setIsVideoPlaying(true)}
              >
                <img
                  src="/guide/plan-trip/video-cover.jpg"
                  alt="Plan your Vietnam trip with just 1 prompt - YouTube Video Cover"
                  className="plan-trip-video-img"
                />
                <div className="plan-trip-video-header">
                  <div className="plan-trip-video-avatar">
                    <Logo size={24} showText={false} noLink />
                  </div>
                  <div className="plan-trip-video-channel">
                    <span className="plan-trip-video-channel-name">
                      Plan your Vietnam trip with just 1 prompt
                    </span>
                    <span className="plan-trip-video-channel-sub">
                      VinaTap
                    </span>
                  </div>
                </div>

                <div className="plan-trip-video-center-btn">
                  <div className="plan-trip-video-play-icon">
                    <Play size={28} fill="#ffffff" />
                  </div>
                  <div className="plan-trip-video-badge-banner">
                    PLAN VIETNAM ITINERARY IN 1 PROMPT
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/watch?v=DRYGz-p6d3U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="plan-trip-video-yt-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Xem trên YouTube</span>
                </a>
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/DRYGz-p6d3U?autoplay=1"
                title="Plan your Vietnam trip with just 1 prompt"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            )}
          </div>

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
