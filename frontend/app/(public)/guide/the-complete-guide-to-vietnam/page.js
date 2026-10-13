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
  Play,
  MapPin,
  ExternalLink,
  ArrowRight,
  Plane,
  Train,
  Car,
  Compass,
  CheckCircle2,
  DollarSign,
  Wifi,
  CreditCard,
  Utensils,
  Sun,
  ShieldCheck,
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
        titleVi: "15 điểm đến tuyệt nhất Việt Nam năm 2026",
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
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
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
        link: "/guide/1-month-in-vietnam",
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

export default function CompleteGuideToVietnamPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchModalText, setSearchModalText] = useState("");
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Survey Poll State
  const [votedCost, setVotedCost] = useState(null);
  const [costVotes, setCostVotes] = useState({
    "under-800": { labelEn: "Under $800", labelVi: "Dưới $800 (~20 triệu VNĐ)", votes: 640 },
    "800-1500": { labelEn: "$800 - $1,500", labelVi: "$800 - $1,500 (20 - 38 triệu VNĐ)", votes: 1420 },
    "1500-2500": { labelEn: "$1,500 - $2,500", labelVi: "$1,500 - $2,500 (38 - 63 triệu VNĐ)", votes: 890 },
    "above-2500": { labelEn: "Above $2,500", labelVi: "Trên $2,500 (> 63 triệu VNĐ)", votes: 310 },
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

  const handleCostVote = (key) => {
    if (votedCost) return;
    setVotedCost(key);
    setCostVotes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        votes: prev[key].votes + 1,
      },
    }));
  };

  return (
    <div className="complete-guide-page">
      {/* ─── 1. TOP BANNER ─── */}
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

      {/* ─── 3. HERO COVER SECTION ─── */}
      <section className="complete-guide-hero">
        <img
          src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
          alt={
            lang === "vi"
              ? "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam 2026"
              : "The Complete Guide to Vietnam 2026"
          }
          className="complete-guide-hero__bg"
        />
        <div className="complete-guide-hero__overlay" />
        <div className="complete-guide-hero__content">
          <div className="complete-guide-hero__badges">
            <span className="complete-guide-hero__badge">
              {lang === "vi" ? "#XU HƯỚNG" : "#TRENDING"}
            </span>
            <span className="complete-guide-hero__badge">
              {lang === "vi" ? "BÀI NỔI BẬT" : "FEATURED ARTICLES"}
            </span>
          </div>
          <h1 className="complete-guide-hero__title">
            {lang === "vi"
              ? "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam 2026"
              : "The Complete Guide to Vietnam 2026"}
          </h1>
          <div className="complete-guide-hero__meta">
            <span className="complete-guide-hero__author">
              {lang === "vi" ? "Ban Biên Tập VinaTap" : "By VinaTap"}
            </span>
            <span className="complete-guide-hero__date">
              {lang === "vi" ? "111 Tháng 10, 2026" : "October 14, 2026"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. ARTICLE BODY CONTAINER ─── */}
      <main className="complete-guide-container">
        {/* CTA PILL BUTTON */}
        <div className="complete-guide-cta-wrap">
          <button
            type="button"
            className="complete-guide-cta-btn"
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

        <div className="complete-guide-body">
          {lang === "vi" ? (
            <p>
              Việt Nam là viên ngọc quý của Đông Nam Á, nổi tiếng toàn cầu bởi vẻ đẹp thiên nhiên ngoạn mục, bề dày văn hóa ngàn năm và nền ẩm thực phong phú bậc nhất thế giới. Từ kỳ quan vịnh Hạ Long kỳ vĩ và rẻo cao Sa Pa mờ sương ở miền Bắc, đến phố cổ Hội An lung linh đèn lồng ở miền Trung, cùng sông nước Mekong trù phú và nhịp sống đô thị hiện đại của TP. Hồ Chí Minh ở miền Nam — dải đất hình chữ S mang đến hành trình đầy mê hoặc trên khắp 34 tỉnh thành và vùng lãnh thổ.
            </p>
          ) : (
            <p>
              Vietnam is a Southeast Asian country renowned for its stunning natural landscapes, rich cultural heritage, and vibrant cuisine. From the limestone karsts of Ha Long Bay and misty peaks of Sapa in the North to the lantern-lit streets of Hoi An in the Center, and the bustling canals of the Mekong Delta and neon skyline of Ho Chi Minh City in the South, Vietnam offers a captivating journey across 34 diverse provinces and territories.
            </p>
          )}


          {/* ─── PHẦN 1: ĐỊA HÌNH VÀ KHÍ HẬU ─── */}
          <h2>
            {lang === "vi"
              ? "Địa hình và Khí hậu 3 Miền"
              : "Topography and climate"}
          </h2>
          <p>
            {lang === "vi"
              ? "Việt Nam được phân chia rõ rệt thành ba miền địa lý chính: Miền Bắc, Miền Trung và Miền Nam. Mỗi miền sở hữu cảnh quan địa hình đặc thù, nhịp sống văn hóa riêng biệt và khí hậu thời tiết mang sắc thái hoàn toàn khác nhau."
              : "Vietnam is divided into three main regions: Northern Vietnam, Central Vietnam, and Southern Vietnam. Each region features distinct topography, weather patterns, and rich cultural traditions."}
          </p>

          <figure className="complete-guide-figure">
            <img
              src="/guide/vietnam/vietnam-regions-provinces-map.jpg"
              alt="Bản đồ các vùng miền và tỉnh thành Việt Nam"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/guide/15-best-places/vietnam-map-3d.jpg";
              }}
            />
            <figcaption>
              {lang === "vi"
                ? "Bản đồ phân vùng địa lý và các tỉnh thành của Việt Nam"
                : "Vietnam map with regions, provinces, and key destinations"}
            </figcaption>
          </figure>

          {/* Useful maps link */}
          <div>
            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="cg-useful-maps-link"
            >
              {lang === "vi"
                ? "Xem thêm bản đồ du lịch Việt Nam hữu ích >"
                : "See more useful Vietnam travel maps >"}
            </Link>
          </div>

          {/* 1. MIỀN BẮC (MATCHING SCREENSHOT 5) */}
          <h4 className="cg-region-heading">
            {lang === "vi" ? "1. Miền Bắc Việt Nam" : "1. Northern Vietnam"}
          </h4>
          <div className="cg-region-layout">
            <div className="cg-region-layout__media">
              <img
                src="/guide/the-complete-guide/northern-vietnam.jpg"
                alt={lang === "vi" ? "Miền Bắc Việt Nam" : "Northern Vietnam"}
                className="cg-region-layout__img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/guide/vietnam/northeast-vietnam.jpg";
                }}
              />
            </div>
            <div className="cg-region-layout__content">
              <p>
                {lang === "vi"
                  ? "Miền Bắc Việt Nam bao gồm 15 tỉnh và thành phố: Hà Nội, Hải Phòng, Bắc Ninh, Hưng Yên, Quảng Ninh, Lạng Sơn, Lào Cai, Điện Biên, Sơn La, Cao Bằng, Tuyên Quang, Thái Nguyên, Phú Thọ và Ninh Bình."
                  : "Northern Vietnam consists of 15 provinces and cities: Hanoi, Hai Phong, Bac Ninh, Hung Yen, Quang Ninh, Lang Son, Lao Cai, Dien Bien, Son La, Cao Bang, Tuyen Quang, Thai Nguyen, Phu Tho, and Ninh Binh."}
              </p>
              <p>
                {lang === "vi" ? (
                  <>
                    Các điểm đến du lịch nổi tiếng bao gồm{" "}
                    <Link href="/province/ha-noi" className="cg-inline-link">
                      Hà Nội
                    </Link>
                    ,{" "}
                    <Link href="/province/quang-ninh" className="cg-inline-link">
                      Vịnh Hạ Long (Quảng Ninh)
                    </Link>
                    , Sa Pa & Fansipan (Lào Cai), Quần thể Tràng An và Tam Cốc (Ninh Bình), Thác Bản Giốc (Cao Bằng), Mộc Châu (Sơn La) và Mai Châu (Hòa Bình). Khu vực này trải dài từ các đồng bằng châu thổ đến vùng núi phía Bắc hùng vĩ giáp ranh Trung Quốc và Lào, mang đến cảnh quan ấn tượng, ruộng bậc thang, núi đá vôi karst và văn hóa đa dạng đặc sắc.
                  </>
                ) : (
                  <>
                    Famous tourist destinations include{" "}
                    <Link href="/province/ha-noi" className="cg-inline-link">
                      Hanoi
                    </Link>
                    ,{" "}
                    <Link href="/province/quang-ninh" className="cg-inline-link">
                      Ha Long Bay (Quang Ninh)
                    </Link>
                    , Sapa & Fansipan (Lao Cai), Ninh Binh's Trang An and Tam Coc, Ban Gioc Waterfall (Cao Bang), Moc Chau (Son La), and Mai Chau (Hoa Binh). The region ranges from lowland deltas to majestic northern mountains bordering China and Laos, offering dramatic landscapes, terraced rice fields, limestone karsts, and rich cultural diversity.
                  </>
                )}
              </p>
              <p>
                {lang === "vi"
                  ? "Miền Bắc Việt Nam có sự kết hợp của 4 mùa rõ rệt: Mùa hè (tháng 5 đến tháng 9) nóng ẩm với lượng mưa lớn, trong khi mùa đông (tháng 11 đến tháng 2) se lạnh đến rét, nhiều mây và đặc trưng bởi mưa phùn ở đồng bằng. Vùng núi cao có thể ghi nhận nhiệt độ tiệm cận hoặc dưới 0°C trong những tháng rét nhất. Mùa xuân và mùa thu ôn hòa, dễ chịu, rất lý tưởng để du lịch khám phá."
                  : "Northern Vietnam has a combination of four distinct seasons: Summer (May to September) is hot and humid with heavy rainfall, while winter (November to February) is cool to cold, often cloudy, and characterized by drizzle in the lowlands. Mountainous areas can experience temperatures approaching or even dropping below 0°C during the coldest months. Spring and autumn are mild and comfortable, making them ideal for travel."}
              </p>
            </div>
          </div>

          {/* 2. MIỀN TRUNG (MATCHING SCREENSHOT 5) */}
          <h4 className="cg-region-heading">
            {lang === "vi" ? "2. Miền Trung Việt Nam" : "2. Central Vietnam"}
          </h4>
          <div className="cg-region-layout">
            <div className="cg-region-layout__media">
              <img
                src="/guide/the-complete-guide/central-vietnam.jpg"
                alt={lang === "vi" ? "Miền Trung Việt Nam" : "Central Vietnam"}
                className="cg-region-layout__img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/guide/hcmc/region-central-danang.jpg";
                }}
              />
            </div>
            <div className="cg-region-layout__content">
              <p>
                {lang === "vi"
                  ? "Miền Trung Việt Nam bao gồm 11 tỉnh và thành phố: Thanh Hóa, Nghệ An, Hà Tĩnh, Huế, Quảng Trị, Đà Nẵng, Quảng Ngãi, Khánh Hòa, Gia Lai, Lâm Đồng và Đắk Lắk."
                  : "Central Vietnam consists of 11 provinces and cities: Thanh Hoa, Nghe An, Ha Tinh, Hue, Quang Tri, Da Nang, Quang Ngai, Khanh Hoa, Gia Lai, Lam Dong, and Dak Lak."}
              </p>
              <p>
                {lang === "vi" ? (
                  <>
                    Các điểm đến du lịch nổi tiếng bao gồm Cố đô Huế,{" "}
                    <Link href="/province/da-nang" className="cg-inline-link">
                      Đà Nẵng
                    </Link>
                    ,{" "}
                    <Link href="/province/hoi-an" className="cg-inline-link">
                      Phố cổ Hội An
                    </Link>
                    , Phong Nha - Kẻ Bàng (Quảng Trị), Nha Trang (Khánh Hòa), Quy Nhơn (Gia Lai),{" "}
                    <Link href="/province/dalat" className="cg-inline-link">
                      Đà Lạt
                    </Link>{" "}
                    (Lâm Đồng). Dải đất miền Trung trải dài dọc theo bờ biển và vùng Tây Nguyên, kết hợp hài hòa giữa những bãi biển tuyệt đẹp, di sản lịch sử lâu đời và cao nguyên mát mẻ.
                  </>
                ) : (
                  <>
                    Famous tourist destinations include Hue's Imperial City,{" "}
                    <Link href="/province/da-nang" className="cg-inline-link">
                      Da Nang
                    </Link>
                    ,{" "}
                    <Link href="/province/hoi-an" className="cg-inline-link">
                      Hoi An Ancient Town
                    </Link>
                    , Phong Nha-Ke Bang (Quang Tri), Nha Trang (Khanh Hoa), Quy Nhon (Gia Lai),{" "}
                    <Link href="/province/dalat" className="cg-inline-link">
                      Da Lat
                    </Link>{" "}
                    (Lam Dong). This region stretches along the coastline and the Central Highlands, combining beaches, historical heritage, and cool-climate highlands.
                  </>
                )}
              </p>
              <p>
                {lang === "vi"
                  ? "Miền Trung có khí hậu nhiệt đới gió mùa với 2 mùa chính: Mùa khô (tháng 1 đến tháng 8) nói chung nhiều nắng và ấm áp, đặc biệt là dọc theo bờ biển. Mùa mưa (tháng 9 đến tháng 12) mang đến những cơn mưa lớn và thỉnh thoảng có bão, đặc biệt ở dải duyên hải miền Trung. Vùng Tây Nguyên quanh năm mát mẻ hơn nhờ độ cao địa hình."
                  : "Central Vietnam has a tropical monsoon climate with two main seasons: The dry season (January to August) is generally sunny and warm, especially along the coast. The rainy season (September to December) brings heavy showers and occasional typhoons, particularly to the central coast. The Central Highlands enjoy cooler temperatures year-round due to higher elevation."}
              </p>
            </div>
          </div>

          {/* 3. MIỀN NAM (MATCHING 2-COLUMN LAYOUT) */}
          <h4 className="cg-region-heading">
            {lang === "vi" ? "3. Miền Nam Việt Nam" : "3. Southern Vietnam"}
          </h4>
          <div className="cg-region-layout">
            <div className="cg-region-layout__media">
              <img
                src="/guide/the-complete-guide/southern-vietnam.jpg"
                alt={lang === "vi" ? "Miền Nam Việt Nam" : "Southern Vietnam"}
                className="cg-region-layout__img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/guide/vietnam/mekong-delta.jpg";
                }}
              />
            </div>
            <div className="cg-region-layout__content">
              <p>
                {lang === "vi"
                  ? "Miền Nam Việt Nam bao gồm các tỉnh thành năng động: TP. Hồ Chí Minh, Đồng Nai, Bà Rịa - Vũng Tàu, Bình Dương, Cần Thơ, An Giang, Kiên Giang (Phú Quốc), Bến Tre, Tiền Giang, Cà Mau và vùng đồng bằng sông Cửu Long trù phú."
                  : "Southern Vietnam consists of dynamic provinces and cities: Ho Chi Minh City, Dong Nai, Ba Ria - Vung Tau, Binh Duong, Can Tho, An Giang, Kien Giang (Phu Quoc), Ben Tre, Tien Giang, Ca Mau, and the rich Mekong Delta."}
              </p>
              <p>
                {lang === "vi" ? (
                  <>
                    Các điểm đến du lịch nổi tiếng bao gồm{" "}
                    <Link href="/province/ho-chi-minh" className="cg-inline-link">
                      TP. Hồ Chí Minh
                    </Link>
                    , Chợ nổi Cái Răng (Cần Thơ), Tây Ninh, cùng những bãi biển thiên đường tại Phú Quốc và Côn Đảo. Nơi đây kết hợp hài hòa giữa nhịp sống đô thị hiện đại, miệt vườn sông nước trĩu quả và kỳ nghỉ dưỡng biển đảo nhiệt đới.
                  </>
                ) : (
                  <>
                    Famous tourist destinations include{" "}
                    <Link href="/province/ho-chi-minh" className="cg-inline-link">
                      Ho Chi Minh City
                    </Link>
                    , Can Tho's floating markets, Tay Ninh, and the pristine beaches of Phu Quoc Island and Con Dao. The region combines modern urban life, endless orchards, and tropical island escapes.
                  </>
                )}
              </p>
              <p>
                {lang === "vi"
                  ? "Miền Nam có khí hậu nhiệt đới ấm áp quanh năm với nhiệt độ trung bình từ 27°C - 32°C. Mùa khô (tháng 12 đến tháng 4) ngập tràn nắng vàng rực rỡ; Mùa mưa (tháng 5 đến tháng 11) với những cơn mưa rào nhanh chóng làm dịu mát bầu không khí."
                  : "Southern Vietnam features a warm tropical climate year-round with temperatures averaging 27°C - 32°C. The dry season (December to April) provides brilliant sunshine, while the rainy season (May to November) features quick, cooling afternoon showers."}
              </p>
            </div>
          </div>

          {/* ─── PHẦN 2: THỜI ĐIỂM LÝ TƯỞNG NHẤT ─── */}
          <h2>
            {lang === "vi"
              ? "Thời Điểm Lý Tưởng Nhất Du Lịch Việt Nam"
              : "Best time to visit Vietnam"}
          </h2>
          <p>
            {lang === "vi"
              ? "Do hình thế chữ S trải dài hơn 1.650 km, khí hậu giữa các miền có sự khác biệt rõ rệt. Nhìn chung, khoảng thời gian lý tưởng nhất để du lịch trọn vẹn cả nước là từ tháng 12 đến tháng 4 năm sau — khi thời tiết khô ráo, ôn hòa và cũng là mùa cao điểm du lịch rộn ràng nhất."
              : "Due to Vietnam’s extensive north-to-south territory stretching over 1,650 kilometers, weather varies between regions. Overall, the best time to explore Vietnam nationwide is from December to April, when the weather is generally dry, pleasant, and full of cultural celebrations."}
          </p>
          <figure className="complete-guide-figure">
            <img
              src="/guide/vietnam/weather-best-time-map.jpg"
              alt="Bản đồ thời điểm đẹp nhất để ghé thăm các thành phố Việt Nam"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/guide/hcmc/vietnam-weather-map.jpg";
              }}
            />
            <figcaption>
              {lang === "vi"
                ? "Bản đồ thời điểm vàng để khám phá từng thành phố tại Việt Nam"
                : "Map of the best times to visit Vietnamese cities"}
            </figcaption>
          </figure>

          {/* ─── PHẦN 3: THỊ THỰC VÀ VISA ─── */}
          <h2>{lang === "vi" ? "Chính Sách Thị Thực & Visa" : "Visas and Entry"}</h2>
          <p>
            {lang === "vi"
              ? "Việt Nam hiện áp dụng chính sách miễn thị thực cho công dân nhiều quốc gia và cung cấp hệ thống cấp e-Visa điện tử trực tuyến nhanh chóng, tiện lợi cho mọi quốc gia và vùng lãnh thổ trên thế giới."
              : "Vietnam offers visa-free entry to citizens of many countries, alongside an accessible, fully-digital e-Visa application process for travelers worldwide."}
          </p>
          <figure className="complete-guide-figure">
            <img
              src="/guide/vietnam/visa-exemption-list.jpg"
              alt="Danh sách các nước được miễn thị thực du lịch Việt Nam"
              loading="lazy"
            />
            <figcaption>
              {lang === "vi"
                ? "Danh sách các quốc gia được miễn thị thực và thời hạn lưu trú tối đa"
                : "List of countries eligible for visa-free entry to Vietnam"}
            </figcaption>
          </figure>

          <ul className="complete-guide-list">
            <li>
              <strong>14 ngày:</strong> Myanmar, Brunei.
            </li>
            <li>
              <strong>21 ngày:</strong> Philippines.
            </li>
            <li>
              <strong>30 ngày:</strong> Thái Lan, Indonesia, Singapore, Malaysia, Campuchia, Lào, Kyrgyzstan, Kazakhstan, Belarus.
            </li>
            <li>
              <strong>45 ngày:</strong> Đức, Pháp, Ý, Tây Ban Nha, Vương quốc Anh, Nga, Nhật Bản, Hàn Quốc, Đan Mạch, Thụy Điển, Na Uy, Phần Lan, Bỉ, Ba Lan, Cộng hòa Séc, Thụy Sĩ...
            </li>
            <li>
              <strong>90 ngày:</strong> Chile, Panama.
            </li>
          </ul>

          <div className="complete-guide-callout">
            <p>
              <strong>{lang === "vi" ? "Chính sách e-Visa 90 ngày:" : "90-Day e-Visa:"}</strong>{" "}
              {lang === "vi"
                ? "Đối với du khách không thuộc diện miễn thị thực, bạn có thể dễ dàng nộp đơn xin thị thực điện tử (e-Visa) có giá trị lưu trú lên đến 90 ngày (nhập cảnh một lần $25 USD hoặc nhiều lần $50 USD) trực tiếp tại Cổng Dịch Vụ Công Bộ Công An (evisa.gov.vn)."
                : "Travelers not eligible for visa exemptions can easily obtain a 90-day electronic visa (single-entry $25 USD or multiple-entry $50 USD) via the official government portal (evisa.gov.vn)."}
            </p>
          </div>

          {/* ─── PHẦN 4: TIỀN TỆ VÀ ĐỔI NGOẠI TỆ ─── */}
          <h2>{lang === "vi" ? "Tiền Tệ và Đổi Ngoại Tệ" : "Money and exchange"}</h2>
          <p>
            {lang === "vi"
              ? "Đơn vị tiền tệ chính thức là Việt Nam Đồng (VND, ký hiệu ₫). Hiện có các mệnh giá tiền polymer phổ biến từ 10.000₫ đến mệnh giá lớn nhất 500.000₫. Tỷ giá hiện tại xấp xỉ 1 USD ≈ 26.000 VNĐ (tờ 500.000 VNĐ tương đương khoảng 19.2 USD)."
              : "The official currency is the Vietnamese Dong (VND / ₫). Common polymer denominations range from 10,000₫ up to 500,000₫. The approximate exchange rate is 1 USD ≈ 26,000 VND, making a 500,000 VND note worth roughly $19.2 USD."}
          </p>
          <p>
            {lang === "vi"
              ? "Tiền mặt rất thuận tiện khi ăn uống đường phố và mua sắm tại chợ truyền thống. Trong khi đó, thẻ tín dụng quốc tế (Visa, Mastercard) và quét mã VietQR/chuyển khoản được chấp nhận rộng rãi tại hầu hết khách sạn, nhà hàng và quán cà phê hiện đại."
              : "Cash is highly recommended for street food and local markets, while credit cards (Visa, Mastercard) and contactless QR payments are widely supported across hotels, cafes, and shopping malls."}
          </p>

          {/* ─── PHẦN 5: PHƯƠNG TIỆN DI CHUYỂN ─── */}
          <h2>{lang === "vi" ? "Hệ Thống Giao Thông & Di Chuyển" : "Transportation"}</h2>
          <p>
            {lang === "vi"
              ? "Việt Nam sở hữu mạng lưới giao thông liên vùng phát triển hoàn chỉnh, gồm 22 sân bay dân dụng, tuyến đường sắt Bắc Nam lịch sử và hệ thống cao tốc kết nối thông suốt."
              : "Vietnam offers an integrated nationwide transport network spanning domestic & international flights, the classic North-South railway, and rapid expressways."}
          </p>

          <figure className="complete-guide-figure">
            <img
              src="/guide/vietnam/airports-map.jpg"
              alt="Bản đồ các sân bay tại Việt Nam"
              loading="lazy"
            />
            <figcaption>
              {lang === "vi"
                ? "Bản đồ mạng lưới 22 cảng hàng không trên khắp Việt Nam"
                : "Map of commercial and international airports in Vietnam"}
            </figcaption>
          </figure>

          <p>
            {lang === "vi"
              ? "Tuyến đường sắt Bắc - Nam dài 1.726 km nối liền Hà Nội và TP. Hồ Chí Minh mang lại trải nghiệm ngắm cảnh ngoạn mục (đặc biệt là cung đường qua đèo Hải Vân nhìn thẳng ra biển Lăng Cô). Ngoài ra, xe buýt giường nằm cao cấp và xe limousine là phương án di chuyển vô cùng thuận tiện, tiết kiệm cho các chặng dưới 300 km."
              : "The iconic 1,726-kilometer North-South railway links Hanoi and Ho Chi Minh City, offering breathtaking views along the central coast and Hai Van Pass. Modern sleeper buses and VIP limousines provide affordable, comfortable travel between neighboring cities."}
          </p>

          <figure className="complete-guide-figure">
            <img
              src="/guide/vietnam/travel-routes-map.jpg"
              alt="Bản đồ tuyến đường du lịch trọng điểm Việt Nam"
              loading="lazy"
            />
            <figcaption>
              {lang === "vi"
                ? "Bản đồ các cung đường du lịch nổi bật và tuyến di chuyển chính"
                : "Map of Vietnam travel highlights and signature routes"}
            </figcaption>
          </figure>

          {/* ─── PHẦN 6: INTERNET & SIM CARD ─── */}
          <h2>{lang === "vi" ? "Internet & Kết Nối Di Động" : "Internet and Connectivity"}</h2>
          <p>
            {lang === "vi"
              ? "Tại Việt Nam, sóng Wi-Fi miễn phí có mặt ở khắp mọi nơi — từ quán cà phê, nhà hàng, khách sạn cho đến các quán ăn đường phố. Bạn có thể dễ dàng mua SIM du lịch hoặc cài đặt eSIM tại sân bay với mức giá rất rẻ chỉ khoảng 150.000₫ - 200.000₫ (~$7 USD) cho gói data tốc độ cao 4GB - 6GB/ngày dùng trong 30 ngày."
              : "High-speed Wi-Fi is available free of charge across virtually all cafes, restaurants, and hotels. Purchasing a local 4G/5G physical SIM or eSIM at the airport is inexpensive (around $7 USD for 30 days of 4GB-6GB daily data with Viettel or Vinaphone)."}
          </p>

          {/* ─── PHẦN 7: CHI PHÍ DU LỊCH ─── */}
          <h2>{lang === "vi" ? "Chi Phí Du Lịch Tại Việt Nam" : "Cost of traveling in Vietnam"}</h2>
          <p>
            {lang === "vi"
              ? "Việt Nam luôn nằm trong top những điểm đến có chi phí du lịch hợp lý và giá trị nhất thế giới. Theo khảo sát từ cộng đồng du lịch VinaTap, chi phí trung bình cho một chuyến đi 3 tuần trọn vẹn dao động từ $750 đến $1.500 USD (khoảng 19 đến 38 triệu VNĐ) tùy theo phong cách trải nghiệm."
              : "Vietnam consistently ranks among the most budget-friendly destinations in the world. A typical 3-week journey ranges between $750 and $1,500 USD per traveler, covering comfortable accommodations, domestic travel, and world-class culinary experiences."}
          </p>

          {/* KHẢO SÁT BÌNH CHỌN CHI PHÍ */}
          <div className="complete-guide-poll-card">
            <h3 className="complete-guide-poll-title">
              {lang === "vi"
                ? "Chi phí chuyến đi Việt Nam của bạn thường là bao nhiêu?"
                : "How much does your Vietnam trip usually cost?"}
            </h3>
            <p className="complete-guide-poll-desc">
              {lang === "vi"
                ? "Bình chọn để cùng xây dựng bảng dự toán chi phí thực tế cho cộng đồng du lịch:"
                : "Cast your vote to help other travelers plan their trip budget:"}
            </p>
            <div className="complete-guide-poll-grid">
              {Object.entries(costVotes).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  className={`complete-guide-poll-btn ${votedCost === key ? "voted" : ""}`}
                  onClick={() => handleCostVote(key)}
                >
                  <span>{lang === "vi" ? data.labelVi : data.labelEn}</span>
                  <span className="complete-guide-poll-votes">
                    {data.votes.toLocaleString()} {lang === "vi" ? "lượt chọn" : "votes"}
                  </span>
                </button>
              ))}
            </div>
            {votedCost && (
              <p style={{ marginTop: "16px", color: "#0d9488", fontWeight: 700, fontSize: "14px" }}>
                {lang === "vi"
                  ? "✓ Cảm ơn bạn đã đóng góp số liệu chi phí cho cộng đồng!"
                  : "✓ Thank you for sharing your travel budget feedback!"}
              </p>
            )}
          </div>

          {/* ─── PHẦN 8: CÁC ĐIỂM ĐẾN HÀNG ĐẦU ─── */}
          <div className="vnn-biggrid-header">
            <h3 className="vnn-biggrid-header-title">
              {lang === "vi"
                ? "Các Điểm Đến Hàng Đầu Việt Nam"
                : "Top destinations in Vietnam"}
            </h3>
          </div>

          <div className="vnn-biggrid-5">
            {/* Card 1 (Large left): TP. Hồ Chí Minh */}
            <Link href="/province/ho-chi-minh" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/top-dest-hcmc.jpg"
                alt={lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
                </h4>
              </div>
            </Link>

            {/* Card 2 (Top-left right): Đà Nẵng */}
            <Link href="/province/da-nang" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/top-dest-danang.jpg"
                alt={lang === "vi" ? "Đà Nẵng" : "Da Nang"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Đà Nẵng" : "Da Nang"}
                </h4>
              </div>
            </Link>

            {/* Card 3 (Top-right right): Hà Nội */}
            <Link href="/province/ha-noi" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/top-dest-hanoi.jpg"
                alt={lang === "vi" ? "Hà Nội" : "Hanoi"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Hà Nội" : "Hanoi"}
                </h4>
              </div>
            </Link>

            {/* Card 4 (Bottom-left right): Nha Trang */}
            <Link href="/province/khanh-hoa" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/region-central-nhatrang.jpg"
                alt={lang === "vi" ? "Nha Trang" : "Nha Trang"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Nha Trang" : "Nha Trang"}
                </h4>
              </div>
            </Link>

            {/* Card 5 (Bottom-right right): Hội An */}
            <Link href="/province/hoi-an" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/top-dest-hoian.jpg"
                alt={lang === "vi" ? "Hội An" : "Hoi An"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Hội An" : "Hoi An"}
                </h4>
              </div>
            </Link>
          </div>

          {/* ─── PHẦN 9: LỊCH TRÌNH DU LỊCH GỢI Ý ─── */}
          <div className="vnn-biggrid-header">
            <h3 className="vnn-biggrid-header-title">
              {lang === "vi"
                ? "Lịch Trình Du Lịch Việt Nam Gợi Ý"
                : "Vietnam itineraries"}
            </h3>
          </div>

          <div className="vnn-biggrid-4">
            {/* Card 1 (Large left): 3-week Vietnam Itinerary */}
            <Link href="/guide/3-week-vietnam-itinerary" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/3-week-vietnam-itinerary.jpg"
                alt={lang === "vi" ? "Lịch trình 3 tuần xuyên Việt" : "3-week Vietnam Itinerary"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Lịch trình 3 tuần xuyên Việt" : "3-week Vietnam Itinerary"}
                </h4>
              </div>
            </Link>

            {/* Card 2 (Right row 1): 10 Days in Vietnam */}
            <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt" className="vnn-biggrid-item">
              <img
                src="/guide/megamenu/itin-2-10days.jpg"
                alt={lang === "vi" ? "Lịch trình 10 ngày khám phá" : "10 Days in Vietnam"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Lịch trình 10 ngày khám phá" : "10 Days in Vietnam"}
                </h4>
              </div>
            </Link>

            {/* Card 3 (Right row 2): 2 Weeks in Vietnam */}
            <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt" className="vnn-biggrid-item">
              <img
                src="/guide/megamenu/itin-3-2weeks.jpg"
                alt={lang === "vi" ? "Lịch trình 2 tuần cân bằng" : "2 Weeks in Vietnam"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Lịch trình 2 tuần cân bằng" : "2 Weeks in Vietnam"}
                </h4>
              </div>
            </Link>

            {/* Card 4 (Right row 3): 1 Month in Vietnam */}
            <Link href="/guide/1-month-in-vietnam" className="vnn-biggrid-item">
              <img
                src="/guide/megamenu/itin-4-1month.jpg"
                alt={lang === "vi" ? "Lịch trình 1 tháng trọn vẹn" : "1 Month in Vietnam"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Lịch trình 1 tháng trọn vẹn" : "1 Month in Vietnam"}
                </h4>
              </div>
            </Link>
          </div>

          {/* ─── PHẦN 10: ẨM THỰC ĐẶC SẮC ─── */}
          <div className="vnn-biggrid-header">
            <h3 className="vnn-biggrid-header-title">
              {lang === "vi"
                ? "Món Ngon Nhất Định Phải Thử Tại Việt Nam"
                : "Must-try dishes in Vietnam"}
            </h3>
          </div>

          <div className="vnn-biggrid-5">
            {/* Card 1 (Large left): Phở Truyền Thống */}
            <Link href="/guide/pho-the-complete-guide" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/Top-Hanoi-foods-Pho-Vietnamnomad.jpg"
                alt={lang === "vi" ? "Phở Truyền Thống" : "Traditional Pho"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Phở Truyền Thống" : "Traditional Pho"}
                </h4>
              </div>
            </Link>

            {/* Card 2 (Top-left right): Bún Chả Hà Nội */}
            <Link href="/guide/8-must-try-foods-in-hanoi" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/Top-Hanoi-foods-Bun-Cha-Vietnamnomad.jpg"
                alt={lang === "vi" ? "Bún Chả Hà Nội" : "Hanoi Bun Cha"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Bún Chả Hà Nội" : "Hanoi Bun Cha"}
                </h4>
              </div>
            </Link>

            {/* Card 3 (Top-right right): Cà Phê Sữa Đá */}
            <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Ca-Phe-Sua-Da.jpg"
                alt={lang === "vi" ? "Cà Phê Sữa Đá" : "Ca Phe Sua Da"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Cà Phê Sữa Đá" : "Ca Phe Sua Da"}
                </h4>
              </div>
            </Link>

            {/* Card 4 (Bottom-left right): Bún Bò Huế */}
            <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/Hanoi-food-Bun-Thang-Vietnamnomad.jpg"
                alt={lang === "vi" ? "Bún Bò Huế" : "Bun Bo Hue"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Bún Bò Huế" : "Bun Bo Hue"}
                </h4>
              </div>
            </Link>

            {/* Card 5 (Bottom-right right): Bánh Xèo Giòn Rụm */}
            <Link href="/guide/12-must-try-foods-in-ho-chi-minh-city" className="vnn-biggrid-item">
              <img
                src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Banh-Xeo.jpg"
                alt={lang === "vi" ? "Bánh Xèo Giòn Rụm" : "Crispy Banh Xeo"}
                className="vnn-biggrid-img"
                loading="lazy"
              />
              <div className="vnn-biggrid-overlay" />
              <div className="vnn-biggrid-text">
                <h4 className="vnn-biggrid-title">
                  {lang === "vi" ? "Bánh Xèo Giòn Rụm" : "Crispy Banh Xeo"}
                </h4>
              </div>
            </Link>
          </div>

          {/* ─── OTHER POSTS SECTION (HÌNH 5) ─── */}
          <section className="ad-related-section" style={{ borderTop: "1px solid #e5e7eb", marginTop: "50px", paddingTop: "40px", borderBottom: "1px solid #e5e7eb", paddingBottom: "50px", marginBottom: "40px" }}>
            <h3 className="ad-related-title" style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", color: "#111827", letterSpacing: "-0.01em" }}>
              {lang === "vi" ? "Bài viết khác" : "Other Posts"}
            </h3>
            <div className="ad-related-grid">
              {/* Card 1: 15 best places */}
              <Link
                href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
                className="ad-related-card"
              >
                <div className="ad-related-card__img-wrap">
                  <img
                    src="/guide/megamenu/inspired-1.jpg"
                    alt="15 best places to visit in Vietnam in 2026"
                    className="ad-related-card__img"
                    loading="lazy"
                  />
                </div>
                <h4 className="ad-related-card__title">
                  {lang === "vi"
                    ? "15 điểm đến tuyệt nhất Việt Nam năm 2026"
                    : "15 best places to visit in Vietnam in 2026"}
                </h4>
              </Link>

              {/* Card 2: Plan Your Vietnam Trip */}
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

              {/* Card 3: 20 Best Things to Do */}
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
        </div>
      </main>

      {/* ─── 5. FLOATING AI COMPANION BUTTON & MODAL ─── */}
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
      <PublicFooter lang={lang} />
    </div>
  );
}
