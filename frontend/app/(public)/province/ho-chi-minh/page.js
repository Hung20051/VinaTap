"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  ChevronRight,
  Compass,
  MapPin,
  Utensils,
  Tag,
  Play,
  X,
  ExternalLink,
  Calendar,
  Check,
  Copy,
  Sparkles,
  Facebook,
  Instagram,
  Youtube,
  Gift,
  Search,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/destination-hcmc.css";

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
        date: "September 18, 2026",
        dateVi: "18 Tháng 9, 2026",
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
        titleVi: "TP. Hồ Chí Minh",
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
        date: "September 25, 2026",
        dateVi: "25 Tháng 9, 2026",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "September 22, 2026",
        dateVi: "22 Tháng 9, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
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
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-1-3week.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "thing-2",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 hoạt động tuyệt nhất tại TP.HCM",
        date: "September 28, 2026",
        dateVi: "28 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "thing-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 hoạt động không thể bỏ lỡ tại Nha Trang",
        date: "September 12, 2026",
        dateVi: "12 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/province/khanh-hoa",
      },
      {
        id: "thing-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
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
        date: "September 14, 2026",
        dateVi: "14 Tháng 9, 2026",
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
        titleVi: "8 món ăn nhất định phải thử tại Hà Nội",
        date: "October 2, 2026",
        dateVi: "2 Tháng 10, 2026",
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        date: "September 24, 2026",
        dateVi: "24 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở Việt Nam",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon nổi tiếng tại Vũng Tàu",
        date: "September 30, 2026",
        dateVi: "30 Tháng 9, 2026",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/province/ba-ria-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
        date: "September 8, 2026",
        dateVi: "8 Tháng 9, 2026",
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
        date: "October 5, 2026",
        dateVi: "5 Tháng 10, 2026",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        date: "September 16, 2026",
        dateVi: "16 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        date: "September 15, 2026",
        dateVi: "15 Tháng 9, 2026",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        date: "September 14, 2026",
        dateVi: "14 Tháng 9, 2026",
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
    "Featured Articles": "Bài nổi bật",
    Destinations: "Điểm đến",
    "Central Vietnam": "Miền Trung",
    Articles: "Bài viết",
    Itinerary: "Lịch trình",
    "Eat & Drink": "Ẩm thực",
    Hanoi: "Hà Nội",
  };
  return map[badge] || badge;
}

export default function HoChiMinhCityPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("travel-guide");

  // Modals for Tourist Map and Offers
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [offerModalItem, setOfferModalItem] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const copyVoucherCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const otherDestinations = [
    {
      name: "Hanoi",
      nameVi: "Hà Nội",
      img: "/provinces/ha-noi.jpg",
      link: "/province/ha-noi",
    },
    {
      name: "Da Nang",
      nameVi: "Đà Nẵng",
      img: "/guide/megamenu/dest-4-danang.jpg",
      link: "/province/da-nang",
    },
    {
      name: "Hoi An",
      nameVi: "Hội An",
      img: "/guide/megamenu/dest-3-hoian.jpg",
      link: "/province/hoi-an",
    },
    {
      name: "Dalat",
      nameVi: "Đà Lạt",
      img: "/guide/megamenu/dest-2-dalat.jpg",
      link: "/province/dalat",
    },
    {
      name: "Nha Trang",
      nameVi: "Nha Trang",
      img: "/guide/megamenu/todo-3-nhatrang.jpg",
      link: "/province/khanh-hoa",
    },
    {
      name: "Vung Tau",
      nameVi: "Vũng Tàu",
      img: "/guide/megamenu/eat-4-vungtau.jpg",
      link: "/province/ba-ria-vung-tau",
    },
    {
      name: "Sapa",
      nameVi: "Sa Pa (Lào Cai)",
      img: "/lao-cai-cover.jpg",
      link: "/province/lao-cai",
    },
    {
      name: "Hai Phong",
      nameVi: "Hải Phòng",
      img: "/provinces/hai-phong.jpg",
      link: "/province/hai-phong",
    },
  ];

  return (
    <div className="vnn-hcmc-page">
      {/* ─── 1. TOP PROMO BANNER ─── */}
      <div
        className="vnn-hcmc-top-banner"
        onClick={() => setAiCompanionOpen(true)}
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
        title={
          lang === "vi"
            ? "TRỢ LÝ DU LỊCH AI MIỄN PHÍ • BẠN ĐỒNG HÀNH THÔNG MINH"
            : "FREE AI TRAVEL ASSISTANT • AI COMPANION"
        }
      >
        <img
          src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
          alt="FREE AI TRAVEL ASSISTANT AI-COMPANION"
        />
      </div>

      {/* ─── 2. EDITORIAL NAVBAR WITH MEGAMENUS ─── */}
      <header className="vnn-hcmc-header" onMouseLeave={handleMenuLeave}>
        <div className="vnn-hcmc-nav-inner">
          <Link href="/" className="vnn-hcmc-logo-wrap">
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

          <ul className="vnn-hcmc-nav-menu">
            {/* BE INSPIRED */}
            <li
              className="vnn-hcmc-nav-item"
              onMouseEnter={() => handleMenuEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-hcmc-nav-link ${activeMegaMenu === "inspired" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* DESTINATIONS */}
            <li
              className="vnn-hcmc-nav-item"
              onMouseEnter={() => handleMenuEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-hcmc-nav-link ${activeMegaMenu === "destinations" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* THINGS TO DO */}
            <li
              className="vnn-hcmc-nav-item"
              onMouseEnter={() => handleMenuEnter("things")}
            >
              <button
                type="button"
                className={`vnn-hcmc-nav-link ${activeMegaMenu === "things" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* EAT & DRINK */}
            <li
              className="vnn-hcmc-nav-item"
              onMouseEnter={() => handleMenuEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-hcmc-nav-link ${activeMegaMenu === "eat" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} />
              </button>
            </li>

            {/* ITINERARIES */}
            <li
              className="vnn-hcmc-nav-item"
              onMouseEnter={() => handleMenuEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-hcmc-nav-link ${activeMegaMenu === "itineraries" ? "active" : ""}`}
              >
                <span>{lang === "vi" ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} />
              </button>
            </li>
          </ul>

          <div className="vnn-hcmc-nav-actions">
            <HeaderSearch />
            <LanguageSwitch variant="navbar" />
          </div>
        </div>

        {/* HOVER MEGAMENU CONTAINER */}
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
                      alt={
                        lang === "vi" && item.titleVi
                          ? item.titleVi
                          : item.title
                      }
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

      {/* ─── 3. HERO SECTION (SCREENSHOT 1) ─── */}
      <section className="vnn-hcmc-hero">
        <img
          src="/guide/hcmc/hcmc-hero-aerial-hd.jpg"
          alt="Ho Chi Minh City Aerial Night View"
          className="vnn-hcmc-hero-bg"
        />
        <div className="vnn-hcmc-hero-overlay" />
        <div className="vnn-hcmc-hero-content">
          <div className="vnn-hcmc-hero-badges">
            <Link href="/#top-destinations" className="vnn-hcmc-pill-tag">
              DESTINATIONS
            </Link>
            <Link href="/#regional-destinations" className="vnn-hcmc-pill-tag">
              SOUTHERN VIETNAM
            </Link>
            <span className="vnn-hcmc-pill-tag">HO CHI MINH CITY</span>
          </div>

          <h1 className="vnn-hcmc-hero-title">
            {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
          </h1>

          <div className="vnn-hcmc-hero-meta">
            <span className="author">By Welcome To Vietnam</span>
            <span>•</span>
            <span className="date">October 12, 2026</span>
          </div>
        </div>
      </section>

      {/* ─── 4. QUICK NAVIGATION PILLS BAR (SCREENSHOT 1 & 2) ─── */}
      <div className="vnn-hcmc-quicknav-wrap">
        <div className="vnn-hcmc-quicknav-bar">
          <a
            href="#travel-guide"
            className={`vnn-hcmc-quick-btn ${activeTab === "travel-guide" ? "active" : ""}`}
            onClick={() => setActiveTab("travel-guide")}
          >
            <MapPin size={15} />
            <span>{lang === "vi" ? "Cẩm nang du lịch" : "Travel guide"}</span>
          </a>
          <a
            href="#attractions"
            className={`vnn-hcmc-quick-btn ${activeTab === "attractions" ? "active" : ""}`}
            onClick={() => setActiveTab("attractions")}
          >
            <Compass size={15} />
            <span>{lang === "vi" ? "Điểm tham quan" : "Attractions"}</span>
          </a>
          <a
            href="#cuisine"
            className={`vnn-hcmc-quick-btn ${activeTab === "cuisine" ? "active" : ""}`}
            onClick={() => setActiveTab("cuisine")}
          >
            <Utensils size={15} />
            <span>{lang === "vi" ? "Ẩm thực" : "Cuisine"}</span>
          </a>
          <a
            href="#offers"
            className={`vnn-hcmc-quick-btn ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            <Gift size={15} />
            <span>{lang === "vi" ? "Ưu đãi độc quyền" : "Offers"}</span>
          </a>
        </div>
      </div>

      <main className="vnn-hcmc-container">
        {/* ─── 5. TRAVEL GUIDE SECTION (SCREENSHOT 2) ─── */}
        <section id="travel-guide" className="vnn-hcmc-section">
          <div className="vnn-hcmc-section-header">
            <h2 className="vnn-hcmc-section-title">
              {lang === "vi"
                ? "Cẩm nang du lịch TP. Hồ Chí Minh"
                : "Ho Chi Minh City Travel Guide"}
            </h2>
          </div>
          <div className="vnn-hcmc-divider" />

          <div className="vnn-hcmc-intro-text">
            <p>
              {lang === "vi"
                ? "TP. Hồ Chí Minh, hay thường được người dân địa phương gọi bằng cái tên thân thương Sài Gòn, là một trong những điểm đến được săn đón nhiều nhất khi du lịch Việt Nam. Nằm ở phía Nam đất nước, đây là đô thị lớn nhất và đông dân nhất cả nước. Thành phố sôi động này nổi bật không chỉ bởi tốc độ phát triển thần tốc mà còn bởi nét duyên dáng phảng phất của kiến trúc Pháp cổ kính và phong cách sống hào sảng."
                : "Ho Chi Minh City, or as it is often affectionately called by locals, Saigon, is one of the most sought after destinations when traveling in Vietnam. Located in the southern part of the country, it is both the largest and most populous city. This vibrant metropolis stands out among other major cities not only for its rapid development but also for the lingering touch of French influence in its architecture and way of life."}
            </p>
            <p>
              {lang === "vi"
                ? "Đóng vai trò là đầu mối giao thông huyết mạch, trung tâm kinh tế và tâm điểm giải trí sôi động ngày đêm, TP. Hồ Chí Minh chắc chắn là điểm dừng chân không thể bỏ qua trên hành trình khám phá dải đất hình chữ S của bạn."
                : "Serving as a key transportation hub, economic center, and entertainment hotspot, Ho Chi Minh City is undeniably a must visit on your journey of discovery."}
            </p>
          </div>

          {/* YouTube Video Player Embed / Card */}
          <div className="vnn-hcmc-video-container">
            {isVideoPlaying ? (
              <iframe
                src="https://www.youtube.com/embed/wwDGC-pmKPw?autoplay=1&rel=0"
                title="Ho Chi Minh City: A Guide to Visit Vietnam's Largest City"
                className="vnn-hcmc-video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="vnn-hcmc-video-poster"
                onClick={() => setIsVideoPlaying(true)}
              >
                <img
                  src="/guide/hcmc/hcmc-hero-aerial-hd.jpg"
                  alt="Ho Chi Minh City Travel Guide Video Cover"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "24px",
                  }}
                >
                  <div style={{ color: "#fff", textAlign: "left" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/guide/hcmc/Vietnamnomad-logo-by-Welcome-to-Vietnam-official.png"
                        alt="Logo"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#fff",
                          padding: "2px",
                        }}
                      />
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Ho Chi Minh City: A Guide to Visit Vietnam&apos;s
                          Largest City
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            opacity: 0.85,
                          }}
                        >
                          Welcome To Vietnam
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontSize: "28px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                    }}
                  >
                    HO CHI MINH CITY
                    <br />
                    <span style={{ fontSize: "18px", color: "#ffd200" }}>
                      TRAVEL GUIDE
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                  >
                    <span>Xem trên YouTube</span>
                    <span style={{ opacity: 0.8 }}>14:03</span>
                  </div>
                </div>

                <div className="vnn-hcmc-video-play-btn">
                  <Play size={24} fill="#fff" />
                </div>
              </div>
            )}
          </div>

          {/* Expand Accordion Button */}
          <div className="vnn-hcmc-expand-wrap">
            <button
              className="vnn-hcmc-expand-btn"
              onClick={() => setIsGuideExpanded(!isGuideExpanded)}
            >
              <span>
                {isGuideExpanded
                  ? lang === "vi"
                    ? "Thu gọn cẩm nang du lịch ▲"
                    : "Collapse Ho Chi Minh City travel guide ▲"
                  : lang === "vi"
                    ? "Đọc thêm cẩm nang du lịch TP.HCM ▾"
                    : "Read more Ho Chi Minh City travel guide ▾"}
              </span>
            </button>
          </div>

          {/* Expanded Guide Content */}
          {isGuideExpanded && (
            <div className="vnn-hcmc-accordion-body">
              <div className="vnn-hcmc-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Thời tiết & Mùa du lịch lý tưởng"
                    : "Ho Chi Minh City Weather"}
                </h3>
                <p>
                  {lang === "vi"
                    ? "TP. Hồ Chí Minh mang đặc trưng khí hậu nhiệt đới gió mùa với hai mùa rõ rệt: mùa mưa (từ tháng 5 đến tháng 11) và mùa khô (từ tháng 12 đến tháng 4 năm sau). Nhiệt độ trung bình khoảng 27°C - 32°C. Thời điểm lý tưởng nhất để ghé thăm là từ tháng 12 đến cuối tháng 2, khi không khí lễ hội ngập tràn và những cơn gió mát lành xua tan cái nóng oi ả."
                    : "Ho Chi Minh City has a tropical monsoon climate with two distinct seasons: the rainy season (May to November) and the dry season (December to April). The weather is pleasantly warm year-round, averaging 27°C - 32°C. While you can visit anytime, the best window is from December to February when festive vibes fill the air and cooler breezes offer relief from the tropical heat."}
                </p>
              </div>

              <div className="vnn-hcmc-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Phương tiện di chuyển tại Sài Gòn"
                    : "Transport in Ho Chi Minh City"}
                </h3>
                <ul>
                  <li>
                    <strong>
                      {lang === "vi" ? "Máy bay:" : "By Air (Plane):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Sân bay Quốc tế Tân Sơn Nhất (SGN) kết nối hàng trăm chuyến bay nội địa và quốc tế mỗi ngày, chỉ cách trung tâm Quận 1 khoảng 7km."
                      : "Tan Son Nhat International Airport (SGN) is the country's busiest aviation hub, located just 7 km from District 1."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi" ? "Tàu hỏa (Ga Sài Gòn):" : "Train:"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Ga Sài Gòn nằm tại Quận 3 là điểm kết thúc của tuyến đường sắt Bắc Nam huyền thoại kết nối từ Hà Nội, Huế, Đà Nẵng, Nha Trang."
                      : "Saigon Railway Station in District 3 marks the southern terminus of the iconic North-South Reunification Express."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi"
                        ? "Metro Tuyến 1 (Bến Thành - Suối Tiên):"
                        : "Metro (Line 1):"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Tuyến đường sắt đô thị hiện đại nối liền trung tâm chợ Bến Thành qua Nhà hát Thành phố, Ba Son đến Suối Tiên."
                      : "The newly opened urban transit line connects Ben Thanh Market through Opera House, Ba Son to Thu Duc City."}
                  </li>
                  <li>
                    <strong>
                      {lang === "vi"
                        ? "Saigon Waterbus (Tàu buýt sông):"
                        : "Saigon Waterbus:"}
                    </strong>{" "}
                    {lang === "vi"
                      ? "Trải nghiệm ngắm hoàng hôn và tòa nhà Landmark 81 từ bến Bạch Đằng với giá vé chỉ 15.000 VNĐ."
                      : "A scenic, budget-friendly ferry ride along the Saigon River from Bach Dang Wharf for just 15,000 VND."}
                  </li>
                </ul>
              </div>

              <div className="vnn-hcmc-guide-subblock">
                <h3>
                  {lang === "vi"
                    ? "Khu vực lưu trú gợi ý"
                    : "Accommodation in Ho Chi Minh City"}
                </h3>
                <p>
                  {lang === "vi"
                    ? "Quận 1 là lựa chọn hàng đầu cho khách du lịch lần đầu (khu Bến Thành, phố đi bộ Nguyễn Huệ, Đồng Khởi). Nếu yêu thích không gian xanh mát và ẩm thực phong phú, Quận 3 là điểm đến lý tưởng. Khu Thảo Điền (Quận 2 cũ) quy tụ cộng đồng quốc tế với các quán cafe boutique và nhà hàng sang trọng."
                    : "District 1 is the prime choice for first-time visitors seeking walking proximity to top landmarks. District 3 offers tranquil colonial tree-lined boulevards and authentic street eats, while Thao Dien (District 2) provides riverside villas, boutique cafes, and vibrant nightlife."}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ─── 6. TOP ATTRACTIONS MOSAIC GRID (SCREENSHOT 3) ─── */}
        <section id="attractions" className="vnn-hcmc-section">
          <div className="vnn-hcmc-section-header">
            <h2 className="vnn-hcmc-section-title">
              {lang === "vi"
                ? "Điểm tham quan hàng đầu ở TP. Hồ Chí Minh"
                : "Top Attractions in Ho Chi Minh City"}
            </h2>
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="vnn-hcmc-view-all"
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </Link>
          </div>
          <div className="vnn-hcmc-divider" />

          <div className="vnn-hcmc-attractions-grid">
            {/* Card 1: Map (Large Left - 2 Rows) */}
            <div
              className="vnn-hcmc-attraction-card large"
              onClick={() => setMapModalOpen(true)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              title="Click to view full HD map"
            >
              <img
                src="/guide/hcmc/hcmc-tourist-map-hd.jpg"
                alt="Ho Chi Minh City Tourist Map"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi"
                    ? "Bản đồ du lịch TP. Hồ Chí Minh"
                    : "Ho Chi Minh City Tourist Map"}
                </h3>
              </div>
            </div>

            {/* Card 2: 12 Best Attractions (Middle Top) */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="vnn-hcmc-attraction-card"
            >
              <img
                src="/guide/hcmc/hcmc-12-attractions-hd.jpg"
                alt="12 best attractions in Ho Chi Minh City"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi"
                    ? "12 điểm tham quan ở Sài Gòn"
                    : "12 best attractions in Ho Chi Minh City"}
                </h3>
              </div>
            </Link>

            {/* Card 3: Ben Thanh Market (Right Top) */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="vnn-hcmc-attraction-card"
            >
              <img
                src="/guide/hcmc/ben-thanh-market-hd.jpg"
                alt="Ben Thanh Market"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi" ? "Chợ Bến Thành" : "Ben Thanh Market"}
                </h3>
              </div>
            </Link>

            {/* Card 4: Tan Dinh Church (Middle Bottom) */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="vnn-hcmc-attraction-card"
            >
              <img
                src="/guide/hcmc/tan-dinh-church-hd.jpg"
                alt="Tan Dinh Church"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi" ? "Nhà thờ Tân Định" : "Tan Dinh Church"}
                </h3>
              </div>
            </Link>

            {/* Card 5: Jade Emperor Pagoda (Right Bottom) */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="vnn-hcmc-attraction-card"
            >
              <img
                src="/guide/hcmc/jade-emperor-pagoda-hd.jpg"
                alt="Jade Emperor Pagoda"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi" ? "Chùa Ngọc Hoàng" : "Jade Emperor Pagoda"}
                </h3>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 7. MUST-TRY DISHES MOSAIC GRID (SCREENSHOT 4) ─── */}
        <section id="cuisine" className="vnn-hcmc-section">
          <div className="vnn-hcmc-section-header">
            <h2 className="vnn-hcmc-section-title">
              {lang === "vi"
                ? "Món ngon phải thử ở TP. Hồ Chí Minh"
                : "Must-Try Dishes in Ho Chi Minh City"}
            </h2>
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="vnn-hcmc-view-all"
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </Link>
          </div>
          <div className="vnn-hcmc-divider" />

          <div className="vnn-hcmc-dishes-grid">
            {/* Card 1: 12 Must Try Foods (Large Left - 3 Rows) */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="vnn-hcmc-dish-card large"
            >
              <img
                src="/guide/hcmc/hcmc-12-foods-hd.jpg"
                alt="12 must-try foods in Ho Chi Minh City"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi"
                    ? "12 món ăn nhất định phải thử tại Sài Gòn"
                    : "12 must-try foods in Ho Chi Minh City"}
                </h3>
              </div>
            </Link>

            {/* Card 2: Banh Mi (Right Top) */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="vnn-hcmc-dish-card"
            >
              <img
                src="/guide/hcmc/hcmc-banh-mi-hd.jpg"
                alt="Banh Mi"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi" ? "Bánh Mì Sài Gòn" : "Banh Mi"}
                </h3>
              </div>
            </Link>

            {/* Card 3: Com Tam (Right Middle) */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="vnn-hcmc-dish-card"
            >
              <img
                src="/guide/hcmc/hcmc-com-tam-hd.jpg"
                alt="Com Tam"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi" ? "Cơm Tấm Sườn Bì Chả" : "Com Tam"}
                </h3>
              </div>
            </Link>

            {/* Card 4: Banh Xeo (Right Bottom) */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="vnn-hcmc-dish-card"
            >
              <img
                src="/guide/hcmc/hcmc-banh-xeo-hd.jpg"
                alt="Banh Xeo"
                className="vnn-hcmc-card-img"
              />
              <div className="vnn-hcmc-card-overlay">
                <h3 className="vnn-hcmc-card-title">
                  {lang === "vi" ? "Bánh Xèo Nam Bộ" : "Banh Xeo"}
                </h3>
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 8. SPECIAL OFFERS SECTION (SCREENSHOT 5) ─── */}
        <section id="offers" className="vnn-hcmc-section">
          <div className="vnn-hcmc-section-header">
            <h2 className="vnn-hcmc-section-title">
              {lang === "vi"
                ? "Ưu đãi độc quyền tại TP. Hồ Chí Minh"
                : "Special Offers in Ho Chi Minh City"}
            </h2>
            <button
              type="button"
              className="vnn-hcmc-view-all"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={() =>
                setOfferModalItem({
                  title: "VinaTap Membership Program",
                  titleVi: "Chương trình Ưu đãi Thành viên VinaTap",
                  desc: "Nhận ưu đãi giảm giá độc quyền đến 20% tại các khách sạn đối tác và voucher nha khoa lên đến $800.",
                  code: "VINATAP2026",
                })
              }
            >
              <span>{lang === "vi" ? "Xem tất cả" : "View all"}</span>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="vnn-hcmc-divider" />

          <div className="vnn-hcmc-offers-grid">
            {/* Card 1: Cactusland */}
            <div
              className="vnn-hcmc-offer-card"
              onClick={() =>
                setOfferModalItem({
                  title:
                    "Stay & Save in Ho Chi Minh City – Save up to 20% at Cactusland",
                  titleVi:
                    "Nghỉ dưỡng & Tiết kiệm tại TP.HCM – Giảm đến 20% tại Cactusland",
                  image: "/guide/hcmc/offer-cactusland-hd.jpg",
                  validity: "Valid until January 31, 2026",
                  validityVi: "Có hiệu lực đến ngày 31 tháng 1 năm 2026",
                  code: "CACTUS20",
                  desc: "Giảm 10% cho các kỳ nghỉ dưới 7 ngày, giảm 20% cho kỳ nghỉ trên 1 tháng. Tặng thêm miễn phí check-in sớm / check-out muộn 2 giờ và dịch vụ giặt ủi miễn phí.",
                })
              }
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <div className="vnn-hcmc-offer-img-wrap">
                <img
                  src="/guide/hcmc/offer-cactusland-hd.jpg"
                  alt="Cactusland Exclusive Offer"
                />
              </div>
              <h3 className="vnn-hcmc-offer-title">
                {lang === "vi"
                  ? "Nghỉ dưỡng tại TP.HCM – Giảm tới 20% tại Cactusland"
                  : "Stay & Save in Ho Chi Minh City – Save up to 20% at Cactusland"}
              </h3>
              <p className="vnn-hcmc-offer-validity">
                {lang === "vi"
                  ? "Có hiệu lực đến 31/01/2026"
                  : "Valid until January 31, 2026"}
              </p>
            </div>

            {/* Card 2: Ha Linh Dental */}
            <div
              className="vnn-hcmc-offer-card"
              onClick={() =>
                setOfferModalItem({
                  title:
                    "Brighten Your Smile in Vietnam – Up to $800 Off at Ha Linh Dental",
                  titleVi:
                    "Tỏa sáng nụ cười tại Việt Nam – Ưu đãi đến $800 tại Nha khoa Hà Linh",
                  image: "/guide/hcmc/offer-halinh-dental-hd.png",
                  validity: "Valid until December 31, 2026",
                  validityVi: "Có hiệu lực đến ngày 31 tháng 12 năm 2026",
                  code: "HALINH800",
                  desc: "Voucher giảm giá trị giá lên đến $800 áp dụng cho các dịch vụ dán sứ veneer cao cấp, cấy ghép implant nha khoa và thẩm mỹ nụ cười chuẩn quốc tế.",
                })
              }
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <div className="vnn-hcmc-offer-img-wrap">
                <img
                  src="/guide/hcmc/offer-halinh-dental-hd.png"
                  alt="Ha Linh Dental Voucher"
                />
              </div>
              <h3 className="vnn-hcmc-offer-title">
                {lang === "vi"
                  ? "Tỏa sáng nụ cười tại Việt Nam – Ưu đãi tới $800 tại Nha khoa Hà Linh"
                  : "Brighten Your Smile in Vietnam – Up to $800 Off at Ha Linh Dental"}
              </h3>
              <p className="vnn-hcmc-offer-validity">
                {lang === "vi"
                  ? "Có hiệu lực đến 31/12/2026"
                  : "Valid until December 31, 2026"}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 9. TAGS SECTION (SCREENSHOT 5) ─── */}
        <div className="vnn-hcmc-tags-section">
          <span className="vnn-hcmc-tag-label">TAGS</span>
          <Link href="/#top-destinations" className="vnn-hcmc-tag-pill">
            Destinations
          </Link>
          <span className="vnn-hcmc-tag-pill">Ho Chi Minh City</span>
        </div>

        <div className="vnn-hcmc-divider" style={{ margin: "40px 0 48px 0" }} />

        {/* ─── 10. OTHER DESTINATIONS SECTION (NEW USER SCREENSHOT) ─── */}
        <section className="vnn-hcmc-section">
          <h3 className="vnn-hcmc-other-dest-title">
            {lang === "vi" ? "Các Điểm Đến Khác" : "Other Destinations"}
          </h3>

          <div className="vnn-hcmc-related-grid">
            {/* Card 1: Where to Stay in Ho Chi Minh City */}
            <Link
              href="/guide/where-to-stay-in-ho-chi-minh-city"
              className="vnn-hcmc-related-card"
            >
              <div className="vnn-hcmc-related-img-wrap">
                <img
                  src="/guide/hcmc/where-to-stay-in-hcmc-hd.jpg"
                  alt="Where to Stay in Ho Chi Minh City"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-hcmc-related-title">
                {lang === "vi"
                  ? "Khu vực lưu trú ở TP. Hồ Chí Minh"
                  : "Where to Stay in Ho Chi Minh City"}
              </h4>
            </Link>

            {/* Card 2: 10 best things to do in Ho Chi Minh City */}
            <Link
              href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
              className="vnn-hcmc-related-card"
            >
              <div className="vnn-hcmc-related-img-wrap">
                <img
                  src="/guide/hcmc/10-best-things-hcmc-hd.jpg"
                  alt="10 best things to do in Ho Chi Minh City"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-hcmc-related-title">
                {lang === "vi"
                  ? "10 điều tuyệt nhất ở TP. Hồ Chí Minh"
                  : "10 best things to do in Ho Chi Minh City"}
              </h4>
            </Link>

            {/* Card 3: 12 must-try foods in Ho Chi Minh City */}
            <Link
              href="/guide/12-must-try-foods-in-ho-chi-minh-city"
              className="vnn-hcmc-related-card"
            >
              <div className="vnn-hcmc-related-img-wrap">
                <img
                  src="/guide/hcmc/hcmc-12-foods-hd.jpg"
                  alt="12 must-try foods in Ho Chi Minh City"
                  loading="lazy"
                />
              </div>
              <h4 className="vnn-hcmc-related-title">
                {lang === "vi"
                  ? "12 món ăn phải thử tại TP. Hồ Chí Minh"
                  : "12 must-try foods in Ho Chi Minh City"}
              </h4>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── 11. FOOTER ─── */}
      <footer className="home-footer" style={{ marginTop: "40px" }}>
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

      {/* ─── 12. FLOATING AI COMPANION ─── */}
      <div
        className="vnn-hcmc-floating-ai"
        onClick={() => setAiCompanionOpen(true)}
        title="AI Companion Travel Assistant"
        role="button"
        tabIndex={0}
      >
        <img
          src="/guide/hcmc/Icon-Bubble-Chat-AI-Companion-Vietnamnomad.png"
          alt="AI Companion"
        />
      </div>

      {/* ─── AI CHATBOT MODAL ─── */}
      <ProvinceChatbot
        isOpen={aiCompanionOpen}
        onClose={() => setAiCompanionOpen(false)}
        provinceName={
          lang === "vi" ? "TP. Hồ Chí Minh (Sài Gòn)" : "Ho Chi Minh City (Saigon)"
        }
      />

      {/* ─── TOURIST MAP LIGHTBOX MODAL ─── */}
      {mapModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setMapModalOpen(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "1000px",
              width: "100%",
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                {lang === "vi"
                  ? "Bản đồ Du lịch TP. Hồ Chí Minh (Độ nét cao)"
                  : "Ho Chi Minh City Tourist Map (High Resolution)"}
              </h3>
              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                  display: "flex",
                  padding: "4px",
                }}
              >
                <X size={22} />
              </button>
            </div>
            <div
              style={{
                overflow: "auto",
                maxHeight: "calc(90vh - 70px)",
                textAlign: "center",
                background: "#f9f9f9",
                padding: "10px",
              }}
            >
              <img
                src="/guide/hcmc/hcmc-tourist-map-hd.jpg"
                alt="Ho Chi Minh City Tourist Map Full HD"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "inline-block",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── OFFER VOUCHER DETAIL MODAL ─── */}
      {offerModalItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setOfferModalItem(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "520px",
              width: "100%",
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOfferModalItem(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#666",
              }}
            >
              <X size={18} />
            </button>

            {offerModalItem.image && (
              <img
                src={offerModalItem.image}
                alt="Offer"
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              />
            )}

            <h3
              style={{
                fontSize: "19px",
                fontWeight: 700,
                color: "#111",
                margin: "0 0 10px 0",
                lineHeight: 1.4,
              }}
            >
              {lang === "vi" && offerModalItem.titleVi
                ? offerModalItem.titleVi
                : offerModalItem.title}
            </h3>

            <p
              style={{
                fontSize: "14px",
                color: "#00c2cb",
                fontWeight: 600,
                margin: "0 0 14px 0",
              }}
            >
              {lang === "vi" && offerModalItem.validityVi
                ? offerModalItem.validityVi
                : offerModalItem.validity}
            </p>

            <p
              style={{
                fontSize: "14.5px",
                color: "#555",
                lineHeight: 1.6,
                margin: "0 0 20px 0",
              }}
            >
              {offerModalItem.desc}
            </p>

            {offerModalItem.code && (
              <div
                style={{
                  background: "#f7f9fa",
                  border: "1.5px dashed #00c2cb",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      color: "#888",
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    VOUCHER CODE
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#111",
                      letterSpacing: "1px",
                    }}
                  >
                    {offerModalItem.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyVoucherCode(offerModalItem.code)}
                  style={{
                    background: copiedCode ? "#10b981" : "#00c2cb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background 0.2s",
                  }}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? "Đã sao chép!" : "Sao chép"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
