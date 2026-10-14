"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import NavbarAuthButton from "@/components/ui/NavbarAuthButton";
import HeaderSearch from "@/components/ui/HeaderSearch";
import { getLang } from "@/lib/prefs";
import { ChevronDown, ArrowRight } from "lucide-react";
import "@/styles/home.css";
import "@/styles/vietnamese-currency.css";

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
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Articles",
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
        title: "Da Lat",
        titleVi: "Đà Lạt",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        date: "October 13, 2026",
        dateVi: "13 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Destinations",
        img: "/guide/megamenu/dest-5-hanoi.jpg",
        link: "/province/ha-noi",
      },
    ],
  },
  things: {
    items: [
      {
        id: "things-1",
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 trải nghiệm tuyệt nhất tại TP. Hồ Chí Minh",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-2-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "things-2",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "things-3",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to do",
        img: "/guide/megamenu/todo-4-20things.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "things-4",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan tuyệt nhất tại Đà Lạt",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Things to do",
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
        titleVi: "8 món ngon nhất định phải thử tại Hà Nội",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ngon không thể bỏ lỡ tại TP. Hồ Chí Minh",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho – The Soul of Vietnamese Cuisine",
        titleVi: "Phở – Linh hồn ẩm thực Việt Nam",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/province/ha-noi",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ngon độc đáo tại Vũng Tàu",
        date: "October 14, 2026",
        dateVi: "111 Tháng 10, 2026",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-Week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        date: "October 10, 2026",
        dateVi: "10 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-1-3weeks.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam Itinerary",
        titleVi: "Lịch trình 10 ngày khám phá Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam Itinerary",
        titleVi: "Lịch trình 2 tuần khám phá trọn vẹn",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam Itinerary",
        titleVi: "Lịch trình 1 tháng trải nghiệm Việt Nam",
        date: "October 12, 2026",
        dateVi: "12 Tháng 10, 2026",
        badge: "Itineraries",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

// ─── BANKNOTES SPECIMEN LIST ───
const BANKNOTES = [
  {
    value: "500",
    img: "/guide/currency/vnd-500.jpg",
    captionEn: "Five hundred dong",
    captionVi: "Năm trăm đồng",
  },
  {
    value: "1,000",
    img: "/guide/currency/vnd-1000.jpg",
    captionEn: "One thousand dong",
    captionVi: "Một nghìn đồng",
  },
  {
    value: "2,000",
    img: "/guide/currency/vnd-2000.jpg",
    captionEn: "Two thousand dong",
    captionVi: "Hai nghìn đồng",
  },
  {
    value: "5,000",
    img: "/guide/currency/vnd-5000.jpg",
    captionEn: "Five thousand dong",
    captionVi: "Năm nghìn đồng",
  },
  {
    value: "10,000",
    img: "/guide/currency/vnd-10000.jpg",
    captionEn: "Ten thousand dong",
    captionVi: "Mười nghìn đồng",
  },
  {
    value: "20,000",
    img: "/guide/currency/vnd-20000.jpg",
    captionEn: "Twenty thousand dong",
    captionVi: "Hai mươi nghìn đồng",
  },
  {
    value: "50,000",
    img: "/guide/currency/vnd-50000.jpg",
    captionEn: "Fifty thousand dong",
    captionVi: "Năm mươi nghìn đồng",
  },
  {
    value: "100,000",
    img: "/guide/currency/vnd-100000.jpg",
    captionEn: "One hundred thousand dong",
    captionVi: "Một trăm nghìn đồng",
  },
  {
    value: "200,000",
    img: "/guide/currency/vnd-200000.jpg",
    captionEn: "Two hundred thousand dong",
    captionVi: "Hai trăm nghìn đồng",
  },
  {
    value: "500,000",
    img: "/guide/currency/vnd-500000.jpg",
    captionEn: "Five hundred thousand dong",
    captionVi: "Năm trăm nghìn đồng",
  },
];

// ─── RELATED ARTICLES (MATCHING SCREENSHOT) ───
const RELATED_ARTICLES = [
  {
    id: "railway-network",
    title: "Vietnam’s Railway Network",
    titleVi: "Mạng Lưới Đường Sắt Việt Nam",
    img: "/guide/currency/vietnam-railway-network.png",
    link: "/guide/the-complete-guide-to-vietnam",
    isMap: true,
  },
  {
    id: "airports-in-vietnam",
    title: "Airports in Vietnam",
    titleVi: "Hệ Thống Sân Bay Việt Nam",
    img: "/guide/currency/airports-in-vietnam.png",
    link: "/guide/the-complete-guide-to-vietnam",
    isMap: true,
  },
  {
    id: "climate-of-vietnam",
    title: "Climate of Vietnam",
    titleVi: "Khí Hậu & Thời Tiết Việt Nam",
    img: "/guide/currency/climate-of-vietnam.jpg",
    link: "/guide/the-complete-guide-to-vietnam",
    isMap: false,
  },
];

export default function VietnameseCurrencyPage() {
  const [lang, setLang] = useState("en");
  const isVi = lang === "vi";

  useEffect(() => {
    setLang(getLang());
    const handleLang = (e) => setLang(e?.detail || getLang());
    window.addEventListener("vinatap:lang-updated", handleLang);
    window.addEventListener("storage", handleLang);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLang);
      window.removeEventListener("storage", handleLang);
    };
  }, []);

  const [activeMenu, setActiveMenu] = useState(null);
  const menuTimeoutRef = useRef(null);

  const handleMouseEnter = (menuKey) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250);
  };

  return (
    <div className="currency-page-wrap">
      {/* ─── STICKY PROMO TOP BANNER ─── */}
      <div className="currency-promo-banner">
        <div className="currency-promo-banner__content">
          <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="/guide/hcmc/Vietnamnomad-header-banner-mobile-2026.jpg"
              />
              <img
                src="/guide/top-banner-companion.png"
                alt="Free AI Travel Assistant - AI Companion"
                className="currency-promo-banner__img"
              />
            </picture>
          </Link>
        </div>
      </div>

      {/* ─── EDITORIAL NAVBAR ─── */}
      <header className="vnn-navbar">
        <div className="vnn-navbar__inner">
          <div className="vnn-navbar__brand">
            <Logo size={32} showText={true} />
          </div>

          <ul className="vnn-navbar__menu">
            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("inspired")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "inspired" ? "is-active" : ""}`}
              >
                <span>{isVi ? "CẢM HỨNG" : "BE INSPIRED"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("destinations")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "destinations" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ĐIỂM ĐẾN" : "DESTINATIONS"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("things")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "things" ? "is-active" : ""}`}
              >
                <span>{isVi ? "TRẢI NGHIỆM" : "THINGS TO DO"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("eat")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "eat" ? "is-active" : ""}`}
              >
                <span>{isVi ? "ẨM THỰC" : "EAT & DRINK"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>

            <li
              className="vnn-navbar__item"
              onMouseEnter={() => handleMouseEnter("itineraries")}
            >
              <button
                type="button"
                className={`vnn-navbar__link ${activeMenu === "itineraries" ? "is-active" : ""}`}
              >
                <span>{isVi ? "LỊCH TRÌNH" : "ITINERARIES"}</span>
                <ChevronDown size={14} className="vnn-navbar__chevron" />
              </button>
            </li>
          </ul>

          <div className="vnn-navbar__actions">
            <HeaderSearch />
            <div className="vnn-navbar__divider" />
            <LanguageSwitch />
            <NavbarAuthButton />
          </div>
        </div>

        {/* ─── MEGAMENU DROPDOWN ─── */}
        {activeMenu && MEGA_MENUS_DATA[activeMenu] && (
          <div
            className="vnn-megamenu"
            onMouseEnter={() => handleMouseEnter(activeMenu)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="vnn-megamenu__container">
              <div className="vnn-megamenu__grid">
                {MEGA_MENUS_DATA[activeMenu].items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-megamenu__card group"
                    onClick={() => setActiveMenu(null)}
                  >
                    <div className="vnn-megamenu__thumb">
                      <img src={item.img} alt={item.title} loading="lazy" />
                      {item.badge && (
                        <span className="vnn-megamenu__badge">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="vnn-megamenu__info">
                      <span className="vnn-megamenu__date">
                        {isVi ? item.dateVi : item.date}
                      </span>
                      <h4 className="vnn-megamenu__title">
                        {isVi ? item.titleVi : item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION (MATCHING SCREENSHOT 1) ─── */}
      <section
        className="currency-hero"
        style={{
          backgroundImage: "url('/guide/currency/vietnam-currency-hero.jpg')",
        }}
      >
        <div className="currency-hero__overlay" />
        <div className="currency-hero__content">
          <span className="currency-badge">WIKI</span>
          <h1 className="currency-hero__title">
            {isVi ? "Tiền Tệ Việt Nam" : "Vietnamese Currency"}
          </h1>
          <div className="currency-hero__meta">
            {isVi
              ? "Bởi Welcome to Vietnam  |  30 Tháng 4, 2026"
              : "By Welcome to Vietnam    April 30, 2026"}
          </div>
        </div>
      </section>

      {/* ─── FLOATING ACTION BUTTON ─── */}
      <div className="currency-cta-wrap">
        <Link
          href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
          className="currency-cta-btn"
        >
          {isVi
            ? "Tạo chuyến đi Việt Nam trong vài giây"
            : "Create your Vietnam trip in seconds"}
        </Link>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <main className="currency-body">
        {/* INTRO PARAGRAPH */}
        <p className="currency-intro-text">
          {isVi
            ? "Đơn vị tiền tệ chính thức của Việt Nam là Đồng (ký hiệu VND hoặc ₫). Tiền xu hiện nay không còn được sử dụng trong lưu thông; toàn bộ giao dịch tiền mặt dùng tiền giấy cotton và tiền polymer, giúp việc mang theo vô cùng tiện lợi. Tuy nhiên, các tờ tiền Việt Nam có nhiều chữ số 0, dễ gây nhầm lẫn cho du khách lần đầu ghé thăm. Các mệnh giá nhỏ phổ biến trong lưu thông gồm 1.000 VNĐ, 2.000 VNĐ và 5.000 VNĐ, trong khi tờ tiền mệnh giá lớn nhất là 500.000 VNĐ."
            : "Vietnamese currency is known as the Dong or by its currency code, VND. Coins are no longer in use; only paper and polymerized notes are available, making them convenient to carry. However, Vietnamese banknotes feature many zeros, which can be confusing for first-time visitors. The smallest bills commonly in circulation are 1,000 VND, 2,000 VND, and 5,000 VND, while the largest is 500,000 VND."}
        </p>

        {/* SECTION 1: DENOMINATIONS IN CIRCULATION */}
        <h2 className="currency-section-title">
          {isVi
            ? "CÁC MỆNH GIÁ ĐANG LƯU HÀNH"
            : "DENOMINATIONS IN CIRCULATION"}
        </h2>
        <p className="currency-section-desc">
          {isVi
            ? "Dưới đây là các mệnh giá tiền Đồng Việt Nam đang lưu hành hiện nay (hình ảnh là mẫu tiền tham khảo - Specimen). Tờ 200 VNĐ được loại trừ do rất hiếm khi xuất hiện trong lưu thông."
            : "The following are the Vietnamese Dong denominations currently in circulation (images are specimens for reference only). The 200 VND note is excluded, as it is rarely used."}
        </p>

        {/* BANKNOTES LIST (SCREENSHOTS 2, 3, 4, 5) */}
        <div className="currency-notes-list">
          {BANKNOTES.map((note) => (
            <div key={note.value} className="currency-note-item">
              <div className="currency-note-card">
                <img
                  src={note.img}
                  alt={isVi ? note.captionVi : note.captionEn}
                  className="currency-note-img"
                  loading="lazy"
                />
              </div>
              <div className="currency-note-caption">
                {isVi ? note.captionVi : note.captionEn}
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 2: NOTES (SCREENSHOT 5) */}
        <div className="currency-notes-section">
          <h2 className="currency-section-title">
            {isVi ? "LƯU Ý" : "NOTES"}
          </h2>
          <ul className="currency-bullets-list">
            <li className="currency-bullet-item">
              {isVi
                ? "Hãy chú ý đến các mệnh giá có hình thức tương tự nhau, chẳng hạn như tờ 10.000 VNĐ so với 200.000 VNĐ (tông màu vàng nâu) và tờ 20.000 VNĐ so với 500.000 VNĐ (tông màu xanh dương)."
                : "Be mindful of denominations with similar appearances, such as 10,000 VND vs. 200,000 VND and 20,000 VND vs. 500,000 VND."}
            </li>
            <li className="currency-bullet-item">
              {isVi
                ? "Tờ 500.000 VNĐ là mệnh giá lớn nhất hiện nay và có giá trị tương đương khoảng $20 - $25 USD (dựa trên tỷ giá quy đổi)."
                : "The 500,000 VND note is the largest denomination and is worth approximately $25 USD (based on the 2024 exchange rate)."}
            </li>
            <li className="currency-bullet-item">
              {isVi
                ? "Luôn kiểm tra kỹ tiền thừa trả lại và tránh mang theo lượng tiền mặt quá lớn khi đi ra ngoài."
                : "Always double-check your change and avoid carrying large amounts of cash."}
            </li>
            <li className="currency-bullet-item">
              {isVi
                ? "Thẻ tín dụng và thẻ ghi nợ được chấp nhận rộng rãi tại các nhà hàng, khách sạn và các cơ sở công cộng khác, dù thường không dùng được ở các quán ăn đường phố. Các cây ATM cũng rất dễ tìm thấy ở hầu hết các khu vực."
                : "Credit and debit cards are widely accepted at restaurants, hotels, and other public establishments, though not typically at street food stalls. ATMs are easily accessible in most areas."}
            </li>
            <li className="currency-bullet-item">
              {isVi
                ? "Nhu cầu đổi tiền phổ biến nhất của du khách tại Việt Nam là từ USD sang VNĐ. Dù các tiệm vàng hay được đồn là có tỷ giá tốt nhất, việc đổi ngoại tệ tại đó hiện bị xem là không hợp pháp. Để đảm bảo an toàn và đúng luật, hãy đổi tiền tại sân bay, các chi nhánh ngân hàng địa phương hoặc rút tiền từ ATM."
                : "The most common currency exchange for travelers in Vietnam is from USD to VND. While jewelry shops are rumored to offer the best rates, exchanging currency there is now considered illegal. For a reliable and legal option, exchange money at airports, local banks, or ATMs."}
            </li>
          </ul>
        </div>

        {/* SECTION 3: RELATED ARTICLES (MATCHING SCREENSHOT) */}
        <section className="currency-related-section">
          <h2 className="currency-related-title">
            {isVi ? "Bài Viết Liên Quan" : "Related Articles"}
          </h2>
          <div className="currency-related-grid">
            {RELATED_ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={article.link}
                className="currency-related-card group"
              >
                <div
                  className={`currency-related-thumb ${
                    article.isMap ? "is-map" : ""
                  }`}
                >
                  <img
                    src={article.img}
                    alt={isVi ? article.titleVi : article.title}
                    loading="lazy"
                  />
                </div>
                <h3 className="currency-related-card-title">
                  {isVi ? article.titleVi : article.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ─── AI CHATBOT & FOOTER ─── */}
      <ProvinceChatbot />
      <PublicFooter />
    </div>
  );
}
