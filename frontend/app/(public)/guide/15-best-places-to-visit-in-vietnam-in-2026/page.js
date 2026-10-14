"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import HeaderSearch from "@/components/ui/HeaderSearch";
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
        link: "/guide/the-15-best-attractions-in-dalat",
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
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

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
  const [lang, setLangState] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);

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
  const [companionInput, setCompanionInput] = useState("");
  const [companionMessages, setCompanionMessages] = useState([
    {
      role: "bot",
      content:
        "Xin chào! Tôi là Trợ lý AI Du lịch VinaTap. Bạn muốn khám phá hoặc lên kế hoạch cho địa điểm nào trong danh sách 15 điểm đến tuyệt nhất Việt Nam 2026 này?",
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
                  <h4 className="vnn-megamenu__title">
                    {lang === "vi" ? item.titleVi : item.title}
                  </h4>
                  <p className="vnn-megamenu__date">
                    {lang === "vi" ? item.dateVi : item.date}
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
          alt="15 best places to visit in Vietnam in 2026 - Ha Long Bay"
          className="places-hero__bg"
        />
        <div className="places-hero__overlay" />
        <div className="places-hero__content">
          <div className="places-hero__badges">
            <span className="places-hero__badge">#TRENDING</span>
            <span className="places-hero__badge">FEATURED ARTICLES</span>
          </div>
          <h1 className="places-hero__title">
            {lang === "vi"
              ? "15 địa điểm đẹp nhất Việt Nam năm 2026"
              : "15 best places to visit in Vietnam in 2026"}
          </h1>
          <div className="places-hero__meta">
            <span className="places-hero__author">
              {lang === "vi" ? "Bởi VinaTap" : "By VinaTap"}
            </span>
            <span className="places-hero__date">
              {lang === "vi" ? "11 Tháng 10, 2026" : "October 11, 2026"}
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
                Việt Nam, đất nước với 34 tỉnh thành trải dài hơn 1.650 km theo hình chữ S, là mảnh đất được thiên nhiên ưu đãi với vô vàn cảnh quan thiên nhiên đa dạng và phong phú. Mỗi vùng miền, mỗi địa danh đều mang những nét đặc trưng riêng về địa lý, văn hóa, ẩm thực và con người, hòa quyện tạo nên muôn vàn trải nghiệm mà có lẽ cần cả cuộc đời mới khám phá hết. Sự phong phú này đôi khi khiến du khách băn khoăn khi lựa chọn điểm đến.
              </p>
              <p>
                Hiểu được điều đó, chúng tôi đã tổng hợp danh sách 15 điểm đến được khuyến cử hàng đầu để giúp du khách dễ dàng lên kế hoạch cho chuyến đi của mình mà vẫn đảm bảo trải nghiệm trọn vẹn những nét đặc sắc nhất của Việt Nam. Danh sách này được bình chọn dựa trên hơn 8.000 lượt yêu thích từ cộng đồng du khách quốc tế.
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
                of Vietnam. This list is based on over 8,000 votes from our community.
              </p>
            </>
          )}
        </div>

        {/* 3D RELIEF MAP SECTION (SCREENSHOTS 2 & 3) */}
        <section className="places-map-section">
          <div className="places-map-card">
            <picture>
              <source srcSet="/guide/15-best-places/vietnam-map-3d.webp" type="image/webp" />
              <img
                src="/guide/15-best-places/vietnam-map-3d.jpg"
                alt="15 Best Places to Visit in Vietnam - 3D Relief Travel Map"
                className="places-map-img"
                loading="eager"
              />
            </picture>
          </div>
          <p className="places-map-caption">
            {lang === "vi"
              ? "Bản đồ 15 địa điểm đẹp nhất Việt Nam năm 2026"
              : "15 best places to visit in Vietnam in 2026"}
          </p>

          <div className="places-map-subtext">
            {lang === "vi" ? (
              <>
                <p>
                  Tạo bản đồ du lịch cá nhân hóa các điểm đến tuyệt nhất Việt Nam cùng VinaTap.
                </p>
                <p>
                  Mở Trợ lý AI Du lịch, chia sẻ mong muốn về chuyến đi, lưu lại các điểm bạn muốn khám phá và tải bản đồ hành trình riêng cho bạn.
                </p>
              </>
            ) : (
              <>
                <p>
                  Create your own personalized map of Vietnam's best places to visit
                  with VinaTap.
                </p>
                <p>
                  Simply open AI Travel Companion, tell it what kind of trip you're
                  planning, save the destinations you'd like to explore, and download
                  your custom travel map.
                </p>
              </>
            )}
            <div style={{ marginTop: "18px" }}>
              <button
                type="button"
                className="places-cta-btn"
                style={{ padding: "10px 26px", fontSize: "14px" }}
                onClick={() => setAiCompanionOpen(true)}
              >
                <Sparkles size={15} />
                <span>
                  {lang === "vi" ? "Lên kế hoạch du lịch" : "Create Your Map"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── 5. THE 15 NUMBERED DESTINATIONS (SCREENSHOTS 4 & 5) ─── */}
        <div className="places-list">
          {PLACES_ARTICLE_DATA.map((item) => (
            <article
              key={item.number}
              id={`place-${item.number}`}
              className="place-item"
            >
              <h2 className="place-item__title">
                {item.number}. {lang === "vi" ? item.titleVi : item.title}
              </h2>
              <div className="place-item__layout">
                <div className="place-item__img-wrap">
                  <img
                    src={item.image}
                    alt={`${item.number}. ${item.title} - Vietnam Travel 2026`}
                    className="place-item__img"
                    loading={item.number <= 4 ? "eager" : "lazy"}
                  />
                </div>
                <div className="place-item__desc">
                  {item.paragraphs.map((p, idx) => (
                    <p key={idx}>{renderTextWithLinks(p)}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ─── RELATED ARTICLES SECTION (MATCHING SCREENSHOT 3) ─── */}
        <section className="ad-related-section">
          <h3 className="ad-related-title">
            {lang === "vi" ? "Bài viết liên quan" : "Related Articles"}
          </h3>
          <div className="ad-related-grid">
            {/* Card 1: Plan Your Vietnam Trip with Just One Prompt */}
            <Link
              href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
              className="ad-related-card"
            >
              <div className="ad-related-card__img-wrap">
                <img
                  src="/guide/megamenu/inspired-2.jpg"
                  alt="Plan Your Vietnam Trip with Just One Prompt"
                  className="ad-related-card__img"
                  loading="lazy"
                />
              </div>
              <h4 className="ad-related-card__title">
                {lang === "vi"
                  ? "Lên kế hoạch du lịch Việt Nam chỉ với một prompt"
                  : "Plan Your Vietnam Trip with Just One Prompt"}
              </h4>
            </Link>

            {/* Card 2: The Complete Guide to Vietnam */}
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="ad-related-card"
            >
              <div className="ad-related-card__img-wrap">
                <img
                  src="/guide/megamenu/inspired-3.jpg"
                  alt="The Complete Guide to Vietnam"
                  className="ad-related-card__img"
                  loading="lazy"
                />
              </div>
              <h4 className="ad-related-card__title">
                {lang === "vi"
                  ? "Cẩm nang du lịch toàn diện Việt Nam"
                  : "The Complete Guide to Vietnam"}
              </h4>
            </Link>

            {/* Card 3: 20 Best Things to Do in Vietnam */}
            <Link
              href="/guide/20-best-things-to-do-in-vietnam"
              className="ad-related-card"
            >
              <div className="ad-related-card__img-wrap">
                <img
                  src="/guide/megamenu/inspired-4.jpg"
                  alt="20 Best Things to Do in Vietnam"
                  className="ad-related-card__img"
                  loading="lazy"
                />
              </div>
              <h4 className="ad-related-card__title">
                {lang === "vi"
                  ? "20 trải nghiệm tuyệt nhất tại Việt Nam"
                  : "20 Best Things to Do in Vietnam"}
              </h4>
            </Link>
          </div>
        </section>

      </main>

      {/* ─── 7. FLOATING AI COMPANION BUTTON & MODAL (Hình 1) ─── */}
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

      {/* ─── 8. SEARCH MODAL ─── */}
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

      {/* ─── 9. EDITORIAL FOOTER ─── */}
      <PublicFooter lang={lang} />
    </div>
  );
}
