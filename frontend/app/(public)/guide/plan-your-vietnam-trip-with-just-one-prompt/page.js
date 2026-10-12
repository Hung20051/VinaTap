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
        titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
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
        date: "December 31, 2024",
        dateVi: "31 Tháng 12, 2024",
        badge: "Featured Articles",
        img: "/guide/megamenu/inspired-5.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
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
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
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
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
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

function formatBadge(badge, lang) {
  if (!badge) return "";
  if (lang !== "vi") return badge;
  const map = {
    "#Trending": "#Thịnh hành",
    "#trending": "#Thịnh hành",
    "Featured Articles": "Bài nổi bật",
    "Destinations": "Điểm đến",
    "Central Vietnam": "Miền Trung",
    "Articles": "Bài viết",
    "Itinerary": "Lịch trình",
    "Eat & Drink": "Ẩm thực",
    "Hanoi": "Hà Nội",
  };
  return map[badge] || badge;
}

export default function PlanYourVietnamTripPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [promptInput, setPromptInput] = useState(
    "Tôi muốn đi du lịch 3 tuần tại Việt Nam khởi hành từ ngày 11/12, tập trung vào các thành phố biển."
  );
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
    const handleLang = (e) => {
      setLang(e.detail);
      if (e.detail === "en") {
        setPromptInput(
          "I want to spend 3 weeks in Vietnam starting December 11, focusing on coastal cities."
        );
      } else {
        setPromptInput(
          "Tôi muốn đi du lịch 3 tuần tại Việt Nam khởi hành từ ngày 11/12, tập trung vào các thành phố biển."
        );
      }
    };
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

  const handlePromptSubmit = (e) => {
    e?.preventDefault();
    if (!promptInput.trim()) return;
    const userText = promptInput.trim();
    setCompanionMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      {
        role: "bot",
        content:
          lang === "vi"
            ? `Tôi đã phân tích prompt của bạn: "${userText}". Đang tạo lịch trình thông minh: Hà Nội (3 đêm) ➔ Hạ Long (1 đêm du thuyền) ➔ Đà Nẵng / Hội An (4 đêm) ➔ Nha Trang (3 đêm) ➔ TP. Hồ Chí Minh & Miền Tây (3 đêm). Bạn có muốn tải bản đồ PDF hoặc tùy chỉnh thêm không?`
            : `I have analyzed your prompt: "${userText}". Generating smart itinerary: Hanoi (3 nights) ➔ Ha Long Bay (1 night cruise) ➔ Da Nang / Hoi An (4 nights) ➔ Nha Trang (3 nights) ➔ Ho Chi Minh City & Mekong Delta (3 nights). Would you like to customize or download the route map PDF?`,
      },
    ]);
    setAiCompanionOpen(true);
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
        content:
          lang === "vi"
            ? `Cảm ơn bạn! Với yêu cầu "${userText}", hệ thống VinaTap AI sẽ tối ưu hóa tuyến đường theo thời gian và chi phí hợp lý nhất cho bạn.`
            : `Thank you! Based on "${userText}", VinaTap AI will optimize your routes and timings for the most rewarding journey.`,
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
            <LanguageSwitch variant="navbar" />
            <button
              type="button"
              className="vnn-navbar__search-btn"
              onClick={() => setSearchModalOpen(true)}
              aria-label={lang === "vi" ? "Tìm kiếm cẩm nang" : "Search guide"}
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
                      alt={lang === "vi" && item.titleVi ? item.titleVi : item.title}
                      className="vnn-megamenu__img"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="vnn-megamenu__badge">
                        {formatBadge(item.badge, lang)}
                      </span>
                    )}
                  </div>
                  <h4 className="vnn-megamenu__title">
                    {lang === "vi" && item.titleVi ? item.titleVi : item.title}
                  </h4>
                  <p className="vnn-megamenu__date">
                    {lang === "vi" && item.dateVi ? item.dateVi : item.date}
                  </p>
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
          alt={
            lang === "vi"
              ? "Lên kế hoạch du lịch Việt Nam chỉ với một prompt"
              : "Plan Your Vietnam Trip with Just One Prompt"
          }
          className="plan-trip-hero__bg"
        />
        <div className="plan-trip-hero__overlay" />
        <div className="plan-trip-hero__content">
          <div className="plan-trip-hero__badges">
            <span className="plan-trip-hero__badge">
              {lang === "vi" ? "#XU HƯỚNG" : "#TRENDING"}
            </span>
            <span className="plan-trip-hero__badge">
              {lang === "vi" ? "BÀI NỔI BẬT" : "FEATURED ARTICLES"}
            </span>
          </div>
          <h1 className="plan-trip-hero__title">
            {lang === "vi"
              ? "Lên kế hoạch du lịch Việt Nam chỉ với một prompt"
              : "Plan Your Vietnam Trip with Just One Prompt"}
          </h1>
          <div className="plan-trip-hero__meta">
            <span className="plan-trip-hero__author">
              {lang === "vi" ? "Ban Biên Tập VinaTap" : "By VinaTap"}
            </span>
            <span className="plan-trip-hero__date">
              {lang === "vi" ? "1 Tháng 4, 2026" : "April 1, 2026"}
            </span>
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
            <span>
              {lang === "vi"
                ? "Lên kế hoạch du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </button>
        </div>

        <div className="plan-trip-body">
          {lang === "vi" ? (
            <>
              <p>
                Việc lên kế hoạch cho chuyến đi du lịch Việt Nam có thể tiêu tốn hàng giờ
                đồng hồ: tìm kiếm các điểm đến hấp dẫn, so sánh tuyến đường, chọn phương tiện di chuyển và ước tính ngân sách.
              </p>
              <p>Điều gì sẽ xảy ra nếu bạn có thể hoàn thành tất cả những việc đó… chỉ trong vài giây?</p>
              <p>
                Tính năng <strong>Hành Trình Của Tôi (My Journey)</strong> là giải pháp lập kế hoạch du lịch thông minh
                được tích hợp ngay trong{" "}
                <a
                  href="#ai-companion"
                  onClick={(e) => {
                    e.preventDefault();
                    setAiCompanionOpen(true);
                  }}
                  style={{ color: "#00aab2", fontWeight: 600, textDecoration: "underline" }}
                >
                  Trợ lý AI VinaTap
                </a>
                , được thiết kế chuyên sâu dành riêng cho du khách khám phá Việt Nam. Công cụ này giúp bạn khởi tạo, tối ưu hóa và quản lý trọn vẹn toàn bộ hành trình chỉ bằng một câu prompt duy nhất.
              </p>
            </>
          ) : (
            <>
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
                  VinaTap AI
                </a>
                , designed specifically for Vietnam. It helps you create, optimize,
                and manage your entire itinerary with just one prompt.
              </p>
            </>
          )}

          {/* ─── VIDEO PLAYER SECTION (SCREENSHOT 2) ─── */}
          <div className="plan-trip-video-card">
            {!isVideoPlaying ? (
              <div
                className="plan-trip-video-cover"
                onClick={() => setIsVideoPlaying(true)}
              >
                <img
                  src="/guide/plan-trip/video-cover.jpg"
                  alt={
                    lang === "vi"
                      ? "Lên kế hoạch du lịch Việt Nam chỉ với 1 prompt - Video YouTube"
                      : "Plan your Vietnam trip with just 1 prompt - YouTube Video Cover"
                  }
                  className="plan-trip-video-img"
                />
                <div className="plan-trip-video-header">
                  <div className="plan-trip-video-avatar">
                    <Logo size={24} showText={false} noLink />
                  </div>
                  <div className="plan-trip-video-channel">
                    <span className="plan-trip-video-channel-name">
                      {lang === "vi"
                        ? "Lên kế hoạch du lịch Việt Nam chỉ với 1 câu prompt"
                        : "Plan your Vietnam trip with just 1 prompt"}
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
                    {lang === "vi"
                      ? "LẬP LỊCH TRÌNH VIỆT NAM CHỈ VỚI 1 PROMPT"
                      : "PLAN VIETNAM ITINERARY IN 1 PROMPT"}
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/watch?v=DRYGz-p6d3U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="plan-trip-video-yt-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{lang === "vi" ? "Xem trên YouTube" : "Watch on YouTube"}</span>
                </a>
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/DRYGz-p6d3U?autoplay=1"
                title={
                  lang === "vi"
                    ? "Lên kế hoạch du lịch Việt Nam chỉ với 1 prompt"
                    : "Plan your Vietnam trip with just 1 prompt"
                }
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            )}
          </div>

          {/* ─── SECTION 1: CREATE YOUR ITINERARY INSTANTLY (SCREENSHOT 3) ─── */}
          <h2>
            {lang === "vi"
              ? "1. Khởi Tạo Lịch Trình Ngay Tức Thì"
              : "Create Your Itinerary Instantly"}
          </h2>
          <p>
            {lang === "vi"
              ? "Chỉ cần nhập yêu cầu mong muốn của bạn, ví dụ như:"
              : "Simply type your request, for example:"}
          </p>

          <div className="plan-trip-prompt-quote">
            {lang === "vi"
              ? "“Tôi muốn dành 3 tuần du lịch Việt Nam khởi hành từ ngày 11 tháng 12, tập trung khám phá các thành phố biển.”"
              : "“I want to spend 3 weeks in Vietnam starting December 11, focusing on coastal cities.”"}
          </div>

          <p>
            {lang === "vi"
              ? "Hệ thống tự động phân tích dữ liệu đầu vào và đề xuất một lịch trình được cá nhân hóa sát nhất theo sở thích và thời gian của bạn."
              : "The system automatically analyzes your input and generates a personalized itinerary tailored to your preferences."}
          </p>

          <div style={{ margin: "24px 0 36px 0" }}>
            <button
              type="button"
              className="plan-trip-cta-btn plan-trip-cta-btn--secondary"
              onClick={() => setAiCompanionOpen(true)}
            >
              {lang === "vi" ? "Khởi tạo lịch trình của bạn" : "Create Your Itinerary"}
            </button>
          </div>

          {/* ─── SECTION 2: VISUALIZE YOUR JOURNEY ON THE MAP (SCREENSHOT 3 & 4) ─── */}
          <h2>
            {lang === "vi"
              ? "2. Trực Quan Hóa Hành Trình Trên Bản Đồ"
              : "Visualize Your Journey on the Map"}
          </h2>
          <p>
            {lang === "vi"
              ? "Toàn bộ lịch trình của bạn được trực quan hóa trên bản đồ tương tác với các tuyến đường nối liền mạch giữa các điểm đến."
              : "Your itinerary is displayed on an interactive map with routes drawn directly between destinations."}
          </p>
          <p>
            {lang === "vi"
              ? "Các phương tiện giao thông được phân biệt bằng màu sắc rõ ràng dễ nắm bắt:"
              : "Transportation is clearly color-coded for easy understanding:"}
          </p>

          <ul className="plan-trip-list">
            <li>
              <strong>{lang === "vi" ? "Màu xanh dương" : "Blue"}</strong>{" "}
              {lang === "vi" ? "cho đường hàng không (chuyến bay)" : "for flights"}
            </li>
            <li>
              <strong>{lang === "vi" ? "Màu xanh lá" : "Green"}</strong>{" "}
              {lang === "vi" ? "cho đường sắt (tàu hỏa ngắm cảnh)" : "for trains"}
            </li>
            <li>
              <strong>{lang === "vi" ? "Màu cam" : "Orange"}</strong>{" "}
              {lang === "vi" ? "cho đường bộ (xe khách, ô tô, xe máy)" : "for roads"}
            </li>
            <li>
              <strong>{lang === "vi" ? "Màu xanh ngọc" : "Cyan"}</strong>{" "}
              {lang === "vi" ? "cho đường thủy (cano, du thuyền, phà biển)" : "for waterways"}
            </li>
          </ul>

          <p>
            {lang === "vi" ? "Ngay bên cạnh bản đồ, bạn sẽ theo dõi được:" : "Alongside the map, you’ll see:"}
          </p>

          <ul className="plan-trip-list">
            <li>
              {lang === "vi"
                ? "Danh sách các điểm đến theo trình tự thời gian hợp lý"
                : "A structured list of destinations in order"}
            </li>
            <li>
              {lang === "vi"
                ? "Số đêm gợi ý lưu trú lý tưởng tại từng địa điểm"
                : "Suggested number of nights at each location"}
            </li>
          </ul>

          <p>{lang === "vi" ? "Bạn cũng hoàn toàn có thể chủ động:" : "You can also:"}</p>

          <ul className="plan-trip-list">
            <li>
              {lang === "vi"
                ? "Thêm các địa danh lân cận hoặc các điểm dừng chân trên tuyến đường"
                : "Add nearby destinations or places along your route"}
            </li>
            <li>
              {lang === "vi"
                ? "Xóa bỏ các điểm đến bạn không muốn ghé thăm"
                : "Remove destinations you don’t want"}
            </li>
          </ul>

          {/* UI SCREENSHOT CARD (SCREENSHOT 4) */}
          <div className="plan-trip-ui-card">
            <div className="plan-trip-ui-img-wrap">
              <img
                src="/guide/plan-trip/tripion-ai-ui.jpg"
                alt={
                  lang === "vi"
                    ? "Giao diện Trợ lý Du lịch VinaTap AI - Bản đồ tương tác và Lịch trình tuyến đường thông minh"
                    : "Triplon AI Platform for Multi-City Travel in Asia - Interactive Route Map and Itinerary"
                }
                className="plan-trip-ui-img"
              />
            </div>
            <p className="plan-trip-ui-caption">
              {lang === "vi"
                ? "VinaTap AI — Nền tảng AI du lịch thông minh đa điểm đến tại Việt Nam"
                : "Triplon — The AI Platform for Multi-City Travel in Asia"}
            </p>
          </div>

          {/* ─── SECTION 3: DETAILED TRANSPORT INFORMATION (SCREENSHOT 4 & 5) ─── */}
          <h2>
            {lang === "vi"
              ? "3. Thông Tin Chi Tiết Về Phương Tiện Di Chuyển"
              : "Detailed Transport Information"}
          </h2>
          <p>
            {lang === "vi"
              ? "Trong tab Phương tiện (Transport), từng chặng đường được bóc tách chi tiết:"
              : "In the Transport tab, each route is broken down with:"}
          </p>

          <ul className="plan-trip-list">
            <li>{lang === "vi" ? "Khoảng cách địa lý chính xác" : "Distance"}</li>
            <li>{lang === "vi" ? "Loại hình di chuyển" : "Transport type"}</li>
            <li>
              {lang === "vi"
                ? "Nhà xe / Hãng vận chuyển (hãng hàng không, xe khách, tàu hỏa...)"
                : "Carrier (airlines, buses, trains, etc.)"}
            </li>
            <li>{lang === "vi" ? "Thời gian di chuyển dự kiến" : "Travel duration"}</li>
            <li>{lang === "vi" ? "Tần suất chuyến trong ngày" : "Frequency"}</li>
            <li>{lang === "vi" ? "Mức giá vé tham khảo" : "Estimated price"}</li>
          </ul>

          <p>
            {lang === "vi"
              ? "Nhờ đó, bạn nắm rõ và chủ động lên kế hoạch cho từng chặng trong suốt chuyến đi mà không lo bỡ ngỡ."
              : "This allows you to understand and plan every part of your journey with clarity."}
          </p>

          {/* ─── SECTION 4: OVERVIEW OF YOUR ENTIRE TRIP (SCREENSHOT 5) ─── */}
          <h2>
            {lang === "vi"
              ? "4. Tổng Quan Toàn Diện Về Chuyến Đi"
              : "Overview of Your Entire Trip"}
          </h2>
          <p>
            {lang === "vi"
              ? "Hệ thống cung cấp bảng tóm tắt nhanh gọn về chuyến đi của bạn, bao gồm:"
              : "My Journey provides a quick summary of your itinerary, including:"}
          </p>

          <ul className="plan-trip-list">
            <li>{lang === "vi" ? "Tổng số lượng điểm đến" : "Total number of destinations"}</li>
            <li>{lang === "vi" ? "Tổng số đêm lưu trú" : "Total number of nights"}</li>
            <li>{lang === "vi" ? "Tổng thời lượng di chuyển trên đường" : "Total travel time"}</li>
            <li>{lang === "vi" ? "Dự toán chi phí phương tiện đi lại" : "Estimated transport cost"}</li>
          </ul>

          <p>
            {lang === "vi"
              ? "Mọi thông tin cốt lõi — hiển thị gói gọn trong chớp mắt."
              : "Everything you need — at a glance."}
          </p>

          {/* ─── SECTION 5: FLEXIBLE EDITING AND SMART OPTIMIZATION (SCREENSHOT 5) ─── */}
          <h2>
            {lang === "vi"
              ? "5. Chỉnh Sửa Linh Hoạt Và Tối Ưu Hóa Tuyến Đường Thông Minh"
              : "Flexible Editing and Smart Optimization"}
          </h2>
          <p>
            {lang === "vi"
              ? "Bạn luôn là người làm chủ lịch trình của mình:"
              : "You are always in control of your itinerary."}
          </p>

          <ul className="plan-trip-list">
            <li>
              {lang === "vi"
                ? "Kéo thả sắp xếp lại thứ tự các điểm đến"
                : "Drag and drop destinations to reorder your trip"}
            </li>
            <li>
              {lang === "vi"
                ? "Cập nhật tức thì tuyến đường và phương tiện thay thế"
                : "Instantly update routes and transport options"}
            </li>
          </ul>

          <p>
            {lang === "vi"
              ? "Sử dụng tính năng Tối Ưu Hóa (Optimize) để hoàn thiện chuyến đi:"
              : "Use the Optimize feature to refine your journey:"}
          </p>

          <ul className="plan-trip-list">
            <li>
              {lang === "vi"
                ? "Tìm kiếm các chặng bay và tuyến đường tiết kiệm chi phí nhất"
                : "Find the cheapest routes"}
            </li>
            <li>
              {lang === "vi"
                ? "Lựa chọn các kết nối nhanh nhất để tiết kiệm thời gian"
                : "Choose the fastest connections"}
            </li>
            <li>
              {lang === "vi"
                ? "Sử dụng Tuyến Đường Thông Minh (Smart Routes) để tự động sắp xếp cung đường tối ưu nhất"
                : "Use Smart Routes to automatically generate the most efficient plan"}
            </li>
          </ul>

          <p>
            {lang === "vi"
              ? "Bạn có thể chạy tối ưu hóa nhiều lần để tìm ra phương án phù hợp nhất với phong cách của mình."
              : "You can optimize multiple times to find what works best for you."}
          </p>

          {/* ─── SECTION 6: PLAN WHAT TO DO IN EACH DESTINATION ─── */}
          <h2>
            {lang === "vi"
              ? "6. Lên Kế Hoạch Chi Tiết Từng Điểm Đến"
              : "Plan What to Do in Each Destination"}
          </h2>
          <p>
            {lang === "vi" ? "Không dừng lại ở việc chọn thành phố." : "Go beyond just destinations."}
          </p>
          <p>
            {lang === "vi"
              ? "Tại mỗi điểm đến, bạn có thể lựa chọn các danh thắng, quán ăn, trải nghiệm văn hóa để xây dựng lịch trình chi tiết theo từng ngày."
              : "For each location, you can select places to visit and build a detailed exploration plan for every city."}
          </p>

          {/* ─── SECTION 7: DOWNLOAD AND SHARE YOUR PLAN ─── */}
          <h2>
            {lang === "vi"
              ? "7. Tải Về Và Chia Sẻ Lịch Trình Của Bạn"
              : "Download and Share Your Plan"}
          </h2>
          <p>
            {lang === "vi"
              ? "Khi lịch trình đã hoàn thiện, bạn có thể dễ dàng tải xuống dưới nhiều định dạng:"
              : "Once your itinerary is ready, you can download it in multiple formats:"}
          </p>

          <ul className="plan-trip-list">
            <li>{lang === "vi" ? "Tóm tắt nhanh (ảnh infographic)" : "Quick overview (image)"}</li>
            <li>
              {lang === "vi"
                ? "Toàn bộ lịch trình chi tiết (kèm lộ trình, phương tiện và bảng giá vé)"
                : "Full itinerary (including routes, transport, and pricing)"}
            </li>
            <li>
              {lang === "vi"
                ? "Bản đồ du lịch với các điểm đến bạn đã chọn"
                : "Travel maps with your selected places"}
            </li>
          </ul>

          <p>
            {lang === "vi"
              ? "Bạn cũng có thể chia sẻ liên kết lịch trình với bạn bè hoặc gia đình để cùng nhau bàn bạc và đồng hành suôn sẻ."
              : "You can also share your itinerary with friends, making it easy to plan together and stay aligned."}
          </p>

          <p style={{ fontSize: "14px", color: "#6b7280", fontStyle: "italic", marginTop: "24px" }}>
            {lang === "vi"
              ? "Lưu ý: Các kế hoạch mang tính tham khảo. Vui lòng kiểm tra lại thông tin chi tiết thực tế trước khi khởi hành."
              : "Note: Plans are for reference. Please verify details before traveling."}
          </p>

          {/* ─── INTERACTIVE TRIP PROMPT GENERATOR BOX ─── */}
          <div className="plan-trip-prompt-box">
            <h3 className="plan-trip-prompt-box-title">
              {lang === "vi" ? "Thử nghiệm AI Prompt Builder" : "Try AI Prompt Builder"}
            </h3>
            <p className="plan-trip-prompt-box-desc">
              {lang === "vi"
                ? "Nhập yêu cầu chuyến đi của bạn để Trợ lý AI tạo lịch trình cá nhân hóa ngay lập tức:"
                : "Enter your trip request to instantly generate a personalized itinerary:"}
            </p>
            <form onSubmit={handlePromptSubmit} className="plan-trip-prompt-form">
              <input
                type="text"
                className="plan-trip-prompt-input"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={
                  lang === "vi"
                    ? "Ví dụ: Tôi muốn đi du lịch 10 ngày từ Hà Nội đến Hội An..."
                    : "E.g., I want to spend 3 weeks in Vietnam starting Dec 11 focusing on coastal cities..."
                }
              />
              <button type="submit" className="plan-trip-prompt-submit">
                <Sparkles size={16} />
                <span>{lang === "vi" ? "Tạo lịch trình ngay" : "Generate Itinerary"}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ─── 5. FLOATING AI COMPANION BUTTON & MODAL (Hình 1) ─── */}
      <div className="vnn-floating-widget">
        <button
          type="button"
          className="vnn-floating-widget__btn"
          onClick={() => setAiCompanionOpen((prev) => !prev)}
          aria-label="Open AI Travel Companion"
          title={
            lang === "vi"
              ? "Trợ lý Du lịch Thông minh VinaTap"
              : "AI Travel Companion - Smart Travel Assistant"
          }
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
        province={{ name: lang === "vi" ? "Việt Nam" : "Vietnam", slug: "viet-nam" }}
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
              <h3>
                {lang === "vi"
                  ? "Tìm kiếm cẩm nang & điểm đến"
                  : "Search Guides & Destinations"}
              </h3>
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
                    lang === "vi"
                      ? "Nhập tên thành phố (Hà Nội, Hội An, Sapa, Đà Nẵng...)..."
                      : "Search a city (Hanoi, Hoi An, Sapa, Da Nang...)..."
                  }
                  value={searchModalText}
                  onChange={(e) => setSearchModalText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="vnn-search-quick-tags">
                <span>{lang === "vi" ? "Gợi ý:" : "Suggestions:"}</span>
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
          <p>
            {lang === "vi"
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
