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
  CheckCircle2,
  MapPin,
  ExternalLink,
  Heart,
  Share2,
} from "lucide-react";
import { PLACES_ARTICLE_DATA } from "@/lib/placesArticleData";
import "@/styles/home.css";
import "@/styles/places-article.css";

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

const CITY_NAMES_MAP = {
  "Da Nang": { vi: "Đà Nẵng", en: "Da Nang" },
  "Hoi An": { vi: "Hội An", en: "Hoi An" },
  "Ha Long": { vi: "Hạ Long", en: "Ha Long" },
  "Hanoi": { vi: "Hà Nội", en: "Hanoi" },
  "Ninh Binh": { vi: "Ninh Bình", en: "Ninh Binh" },
  "Ho Chi Minh City": { vi: "TP. Hồ Chí Minh", en: "Ho Chi Minh City" },
  "Sapa": { vi: "Sa Pa", en: "Sapa" },
  "Ha Giang": { vi: "Hà Giang", en: "Ha Giang" },
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

// Helper function to turn markdown links [text](url) into React components
function renderTextWithLinks(text) {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    parts.push(
      <Link key={match.index} href={href} className="place-item__link">
        {label}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export default function BestPlaces2026Page() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [companionInput, setCompanionInput] = useState("");
  const [companionMessages, setCompanionMessages] = useState([
    {
      role: "bot",
      content:
        "Xin chào! Tôi là Trợ lý AI Du lịch VinaTap. Bạn muốn khám phá hoặc lên kế hoạch cho địa điểm nào trong danh sách 15 điểm đến tuyệt nhất Việt Nam 2026 này?",
    },
  ]);
  const [votedPlace, setVotedPlace] = useState(null);
  const [votes, setVotes] = useState({
    "Da Nang": 1840,
    "Hoi An": 1620,
    "Ha Long": 1450,
    "Hanoi": 1390,
    "Ninh Binh": 1280,
    "Ho Chi Minh City": 1150,
    "Sapa": 980,
    "Ha Giang": 920,
  });

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

  const handleVote = (name) => {
    if (votedPlace) return;
    setVotedPlace(name);
    setVotes((prev) => ({
      ...prev,
      [name]: (prev[name] || 500) + 1,
    }));
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
        content: `Cảm ơn bạn đã hỏi về "${userText}". Dựa trên cẩm nang 15 điểm đến Việt Nam 2026, tôi gợi ý bạn nên dành ít nhất 2-3 ngày tại điểm này để có thể trải nghiệm trọn vẹn cảnh sắc và ẩm thực đặc trưng. Bạn có muốn tôi lập lịch trình chi tiết theo ngày không?`,
      },
    ]);
    setCompanionInput("");
  };

  return (
    <div className="places-article-page">
      {/* ─── 1. TOP BANNER (SCREENSHOT 1) ─── */}
      <div
        className="vnn-top-banner"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        title={lang === "vi" ? "TRỢ LÝ DU LỊCH AI MIỄN PHÍ • BẠN ĐỒNG HÀNH THÔNG MINH" : "FREE AI TRAVEL ASSISTANT • AI COMPANION"}
      >
        <div className="vnn-top-banner__inner">
          <img
            src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
            alt={lang === "vi" ? "Trợ lý Du lịch AI VinaTap - Đồng hành mọi chuyến đi" : "VinaTap AI Travel Assistant - AI Companion"}
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
      <section className="places-hero">
        <img
          src="/guide/15-best-places/hero.jpg"
          alt={lang === "vi" ? "15 điểm đến tuyệt nhất Việt Nam năm 2026 - Vịnh Hạ Long" : "15 best places to visit in Vietnam in 2026 - Ha Long Bay"}
          className="places-hero__bg"
        />
        <div className="places-hero__overlay" />
        <div className="places-hero__content">
          <div className="places-hero__badges">
            <span className="places-hero__badge">
              {lang === "vi" ? "#XU HƯỚNG" : "#TRENDING"}
            </span>
            <span className="places-hero__badge">
              {lang === "vi" ? "BÀI NỔI BẬT" : "FEATURED ARTICLES"}
            </span>
          </div>
          <h1 className="places-hero__title">
            {lang === "vi"
              ? "15 điểm đến tuyệt nhất Việt Nam năm 2026"
              : "15 best places to visit in Vietnam in 2026"}
          </h1>
          <div className="places-hero__meta">
            <span className="places-hero__author">
              {lang === "vi" ? "Ban Biên Tập VinaTap" : "By VinaTap"}
            </span>
            <span className="places-hero__date">
              {lang === "vi" ? "16 Tháng 6, 2026" : "June 16, 2026"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. ARTICLE BODY CONTAINER ─── */}
      <main className="places-container">
        {/* CTA PILL BUTTON (SCREENSHOT 2) */}
        <div className="places-cta-wrap">
          <button
            type="button"
            className="places-cta-btn"
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

        {/* INTRO PARAGRAPHS */}
        <div className="places-intro-text">
          {lang === "vi" ? (
            <>
              <p>
                Việt Nam, đất nước với 34 tỉnh thành trải dài hơn 1.650 km hình chữ S,
                là vùng đất được mẹ thiên nhiên ưu ái ban tặng cảnh quan trù phú và kỳ vĩ.
                Mỗi vùng miền, mỗi cổ trấn đều mang trong mình bản sắc độc nhất vô nhị
                về địa lý, văn hóa, ẩm thực và con người, hòa quyện thành vô vàn trải nghiệm
                mà có dành cả đời cũng khó lòng khám phá hết. Sự phong phú này đôi khi
                khiến du khách băn khoăn khi lên kế hoạch cho chuyến đi.
              </p>
              <p>
                Thấu hiểu điều đó, chúng tôi đã tổng hợp danh sách 15 điểm đến đáng trải nghiệm
                nhất giúp bạn dễ dàng lên lịch trình mà vẫn tận hưởng trọn vẹn tinh hoa của
                dải đất hình chữ S. Danh sách này được bình chọn từ hơn 8.000 du khách khắp nơi
                trong cộng đồng (kết quả bình chọn chi tiết ở cuối bài viết này).
              </p>
            </>
          ) : (
            <>
              <p>
                Vietnam, a country with 34 provinces stretching over 1,650
                kilometers in an S-shape, is a land blessed by Mother Nature with
                diverse and abundant landscapes. Each region and town has its own
                unique features in terms of geography, culture, cuisine, and people,
                blending together into countless experiences that could take a
                lifetime to fully explore. This diversity can sometimes overwhelm
                those planning their visit.
              </p>
              <p>
                Understanding this, we have compiled a list of the 15 most
                recommended destinations to help travelers plan their trip more
                easily while ensuring they experience the most distinctive aspects
                of Vietnam. This list is based on over 8,000 votes from our community
                (voting results can be found at the end of this article).
              </p>
            </>
          )}
        </div>

        {/* 3D RELIEF MAP SECTION (SCREENSHOTS 2 & 3) */}
        <section className="places-map-section">
          <div className="places-map-card">
            <img
              src="/guide/15-best-places/vietnam-map-3d.jpg"
              alt={lang === "vi" ? "15 Điểm Đến Tuyệt Nhất Việt Nam - Bản Đồ Địa Hình 3D" : "15 Best Places to Visit in Vietnam - 3D Relief Travel Map"}
              className="places-map-img"
              loading="eager"
            />
            <div className="places-map-banner">
              {lang === "vi"
                ? "15 ĐIỂM ĐẾN TUYỆT NHẤT VIỆT NAM"
                : "15 BEST PLACES TO VISIT IN VIETNAM"}
            </div>
          </div>
          <p className="places-map-caption">
            {lang === "vi"
              ? "15 điểm đến tuyệt nhất Việt Nam năm 2026"
              : "15 best places to visit in Vietnam in 2026"}
          </p>

          <div className="places-map-subtext">
            {lang === "vi" ? (
              <>
                <p>
                  Tự tạo bản đồ du lịch cá nhân hóa các điểm đến tuyệt nhất Việt Nam cùng Trợ lý AI.
                </p>
                <p>
                  Chỉ cần mở{" "}
                  <a
                    href="#ai-companion"
                    onClick={(e) => {
                      e.preventDefault();
                      setAiCompanionOpen(true);
                    }}
                  >
                    Trợ lý AI VinaTap
                  </a>
                  , chia sẻ phong cách du lịch bạn muốn, lưu lại các điểm đến yêu thích và
                  tải bản đồ hành trình riêng dưới định dạng PDF.
                </p>
                <div style={{ marginTop: "18px" }}>
                  <button
                    type="button"
                    className="places-cta-btn"
                    style={{ padding: "10px 26px", fontSize: "14px" }}
                    onClick={() => setAiCompanionOpen(true)}
                  >
                    Tạo bản đồ của bạn
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  Create your own personalized map of Vietnam's best places to visit
                  with Triplon.
                </p>
                <p>
                  Simply open{" "}
                  <a
                    href="#ai-companion"
                    onClick={(e) => {
                      e.preventDefault();
                      setAiCompanionOpen(true);
                    }}
                  >
                    Triplon.ai
                  </a>
                  , tell it what kind of trip you're planning, save the destinations you'd
                  like to explore, and download your custom travel map as a PDF.
                </p>
                <div style={{ marginTop: "18px" }}>
                  <button
                    type="button"
                    className="places-cta-btn"
                    style={{ padding: "10px 26px", fontSize: "14px" }}
                    onClick={() => setAiCompanionOpen(true)}
                  >
                    Create Your Map
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ─── 5. THE 15 NUMBERED DESTINATIONS (SCREENSHOTS 4 & 5) ─── */}
        <div className="places-list">
          {PLACES_ARTICLE_DATA.map((item) => {
            const displayTitle = lang === "vi" && item.titleVi ? item.titleVi : item.title;
            const paragraphsToRender = (lang === "vi" && item.paragraphsVi) ? item.paragraphsVi : item.paragraphs;

            return (
              <article
                key={item.number}
                id={`place-${item.number}`}
                className="place-item"
              >
                <h2 className="place-item__title">
                  {item.number}. {displayTitle}
                </h2>
                <div className="place-item__layout">
                  <div className="place-item__img-wrap">
                    <img
                      src={item.image}
                      alt={`${item.number}. ${displayTitle} - Vietnam Travel 2026`}
                      className="place-item__img"
                      loading={item.number <= 4 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="place-item__desc">
                    {paragraphsToRender.map((p, idx) => (
                      <p key={idx}>{renderTextWithLinks(p)}</p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ─── 6. COMMUNITY SURVEY / VOTING ─── */}
        <section className="places-survey-card">
          <h3 className="places-survey-title">
            {lang === "vi"
              ? "Điểm đến yêu thích nhất của bạn tại Việt Nam năm 2026 là gì?"
              : "What is your favorite place in Vietnam in 2026?"}
          </h3>
          <p className="places-survey-subtitle">
            {lang === "vi"
              ? "Cùng hơn 8.000 du khách quốc tế và Việt Nam bình chọn cho điểm đến ấn tượng nhất!"
              : "Join over 8,000 global travelers in voting for Vietnam’s most unforgettable destination!"}
          </p>
          <div className="places-survey-grid">
            {Object.entries(votes).map(([city, count]) => {
              const displayCity = lang === "vi" && CITY_NAMES_MAP[city]?.vi ? CITY_NAMES_MAP[city].vi : city;
              return (
                <button
                  key={city}
                  type="button"
                  className={`places-survey-btn ${votedPlace === city ? "voted" : ""}`}
                  onClick={() => handleVote(city)}
                >
                  <span>{displayCity}</span>
                  <span className="places-survey-badge">
                    {count.toLocaleString()} {lang === "vi" ? "lượt bình chọn" : "votes"}
                  </span>
                </button>
              );
            })}
          </div>
          {votedPlace && (
            <p style={{ marginTop: "16px", color: "#0d9488", fontWeight: 600, fontSize: "14px" }}>
              {lang === "vi"
                ? `✓ Cảm ơn bạn đã bình chọn cho ${CITY_NAMES_MAP[votedPlace]?.vi || votedPlace}!`
                : `✓ Thank you for voting for ${votedPlace}!`}
            </p>
          )}
        </section>
      </main>

      {/* ─── 7. FLOATING AI COMPANION BUTTON & MODAL (Hình 1) ─── */}
      <div className="vnn-floating-widget">
        <button
          type="button"
          className="vnn-floating-widget__btn"
          onClick={() => setAiCompanionOpen((prev) => !prev)}
          aria-label="Open AI Travel Companion"
          title={lang === "vi" ? "Trợ lý Du lịch Thông minh VinaTap" : "AI Travel Companion - Smart Travel Assistant"}
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

      {/* ─── 8. SEARCH MODAL ─── */}
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

      {/* ─── 9. EDITORIAL FOOTER ─── */}
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
