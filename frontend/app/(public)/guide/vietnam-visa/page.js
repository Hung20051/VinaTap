"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import HeaderSearch from "@/components/ui/HeaderSearch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import { VUNGTAU_VIETNAM_AFFILIATE_DEALS } from "@/lib/affiliateDeals";
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
  Plane,
  Ship,
  Truck,
  FileText,
  Clock,
  DollarSign,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Share2,
  Calendar,
  Globe,
  ArrowRight,
  Info,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/visa-guide.css";

// ─── MEGAMENUS DATA ───
const MEGA_MENUS_DATA = {
  inspired: {
    items: [
      {
        id: "insp-1",
        title: "15 best places to visit in Vietnam in 2026",
        titleVi: "15 địa điểm đẹp nhất Việt Nam năm 2026",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-1.jpg",
        link: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
      },
      {
        id: "insp-2",
        title: "Plan Your Vietnam Trip with Just One Prompt",
        titleVi: "Lên kế hoạch du lịch Việt Nam chỉ với một prompt",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-2.jpg",
        link: "/guide/plan-your-vietnam-trip-with-just-one-prompt",
      },
      {
        id: "insp-3",
        title: "The Complete Guide to Vietnam",
        titleVi: "Cẩm nang du lịch toàn diện Việt Nam",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-3.jpg",
        link: "/guide/the-complete-guide-to-vietnam",
      },
      {
        id: "insp-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm tuyệt nhất tại Việt Nam",
        badge: "#Trending",
        img: "/guide/megamenu/inspired-4.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "insp-5",
        title: "Ao Dai – Vietnamese Traditional Dress",
        titleVi: "Áo Dài – Quốc phục truyền thống Việt Nam",
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
        badge: "Destinations",
        img: "/guide/megamenu/dest-1-hcmc.jpg",
        link: "/province/ho-chi-minh",
      },
      {
        id: "dest-2",
        title: "Dalat",
        titleVi: "Đà Lạt",
        badge: "Central Vietnam",
        img: "/guide/megamenu/dest-2-dalat.jpg",
        link: "/province/dalat",
      },
      {
        id: "dest-3",
        title: "Hoi An",
        titleVi: "Hội An",
        badge: "Destinations",
        img: "/guide/megamenu/dest-3-hoian.jpg",
        link: "/province/hoi-an",
      },
      {
        id: "dest-4",
        title: "Da Nang",
        titleVi: "Đà Nẵng",
        badge: "Destinations",
        img: "/guide/megamenu/dest-4-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "dest-5",
        title: "Hanoi",
        titleVi: "Hà Nội",
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
        title: "10 best things to do in Ho Chi Minh City",
        titleVi: "10 điều thú vị nhất tại TP. Hồ Chí Minh",
        badge: "Things to do",
        img: "/guide/megamenu/todo-1-hcmc.jpg",
        link: "/guide/10-best-things-to-do-in-ho-chi-minh-city",
      },
      {
        id: "todo-2",
        title: "The 10 best attractions in Da Nang",
        titleVi: "10 điểm tham quan đẹp nhất Đà Nẵng",
        badge: "Da Nang",
        img: "/guide/megamenu/todo-2-danang.jpg",
        link: "/province/da-nang",
      },
      {
        id: "todo-3",
        title: "8 best things to do in Nha Trang",
        titleVi: "8 trải nghiệm tuyệt nhất tại Nha Trang",
        badge: "Nha Trang",
        img: "/guide/megamenu/todo-3-nhatrang.jpg",
        link: "/guide/8-best-things-to-do-in-nha-trang",
      },
      {
        id: "todo-4",
        title: "20 Best Things to Do in Vietnam",
        titleVi: "20 trải nghiệm nhất định phải thử tại Việt Nam",
        badge: "Articles",
        img: "/guide/megamenu/todo-4-vietnam.jpg",
        link: "/guide/20-best-things-to-do-in-vietnam",
      },
      {
        id: "todo-5",
        title: "The 15 best attractions in Dalat",
        titleVi: "15 điểm tham quan đẹp nhất Đà Lạt",
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
        badge: "Hanoi",
        img: "/guide/megamenu/eat-1-hanoi.jpg",
        link: "/guide/8-must-try-foods-in-hanoi",
      },
      {
        id: "eat-2",
        title: "12 must-try foods in Ho Chi Minh City",
        titleVi: "12 món ăn phải thử tại TP. Hồ Chí Minh",
        badge: "Articles",
        img: "/guide/megamenu/eat-2-hcmc.jpg",
        link: "/guide/12-must-try-foods-in-ho-chi-minh-city",
      },
      {
        id: "eat-3",
        title: "Pho",
        titleVi: "Phở truyền thống",
        badge: "Eat & Drink",
        img: "/guide/megamenu/eat-3-pho.jpg",
        link: "/guide/pho-the-complete-guide",
      },
      {
        id: "eat-4",
        title: "7 must-try foods in Vung Tau",
        titleVi: "7 món ăn tuyệt vời tại Vũng Tàu",
        badge: "Articles",
        img: "/guide/megamenu/eat-4-vungtau.jpg",
        link: "/guide/7-must-try-foods-in-vung-tau",
      },
      {
        id: "eat-5",
        title: "5 must-try Nha Trang dishes",
        titleVi: "5 món đặc sản Nha Trang",
        badge: "Articles",
        img: "/guide/megamenu/eat-5-nhatrang.jpg",
        link: "/guide/5-must-try-nha-trang-dishes",
      },
    ],
  },
  itineraries: {
    items: [
      {
        id: "itin-1",
        title: "3-week Vietnam Itinerary",
        titleVi: "Lịch trình 3 tuần xuyên Việt",
        badge: "Articles",
        img: "/guide/megamenu/itin-1-3week.jpg",
        link: "/guide/3-week-vietnam-itinerary",
      },
      {
        id: "itin-2",
        title: "10 Days in Vietnam",
        titleVi: "Lịch trình 10 ngày tại Việt Nam",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-2-10days.jpg",
        link: "/guide/10-days-in-vietnam",
      },
      {
        id: "itin-3",
        title: "2 Weeks in Vietnam",
        titleVi: "Lịch trình 2 tuần xuyên Việt",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-3-2weeks.jpg",
        link: "/guide/2-weeks-in-vietnam",
      },
      {
        id: "itin-4",
        title: "1 Month in Vietnam",
        titleVi: "Lịch trình 1 tháng trọn vẹn khám phá Việt Nam",
        badge: "Itinerary",
        img: "/guide/megamenu/itin-4-1month.jpg",
        link: "/guide/1-month-in-vietnam",
      },
    ],
  },
};

// ─── VISA EXEMPT COUNTRIES DATA ───
const VISA_EXEMPT_COUNTRIES = [
  // 14 days
  { name: "Brunei", nameVi: "Bru-nây", days: 14, region: "ASEAN" },
  { name: "Myanmar", nameVi: "Mi-an-ma", days: 14, region: "ASEAN" },
  // 21 days
  { name: "Philippines", nameVi: "Phi-líp-pin", days: 21, region: "ASEAN" },
  // 30 days
  { name: "Thailand", nameVi: "Thái Lan", days: 30, region: "ASEAN" },
  { name: "Singapore", nameVi: "Xin-ga-po", days: 30, region: "ASEAN" },
  { name: "Malaysia", nameVi: "Ma-lai-xi-a", days: 30, region: "ASEAN" },
  { name: "Indonesia", nameVi: "In-đô-nê-xi-a", days: 30, region: "ASEAN" },
  { name: "Cambodia", nameVi: "Campuchia", days: 30, region: "ASEAN" },
  { name: "Laos", nameVi: "Lào", days: 30, region: "ASEAN" },
  // 45 days
  { name: "Germany", nameVi: "Đức", days: 45, region: "Europe" },
  { name: "France", nameVi: "Pháp", days: 45, region: "Europe" },
  { name: "Italy", nameVi: "Ý (Italia)", days: 45, region: "Europe" },
  { name: "Spain", nameVi: "Tây Ban Nha", days: 45, region: "Europe" },
  { name: "United Kingdom", nameVi: "Vương quốc Anh", days: 45, region: "Europe" },
  { name: "Russia", nameVi: "Nga", days: 45, region: "Europe/Asia" },
  { name: "Japan", nameVi: "Nhật Bản", days: 45, region: "Asia" },
  { name: "South Korea", nameVi: "Hàn Quốc", days: 45, region: "Asia" },
  { name: "Denmark", nameVi: "Đan Mạch", days: 45, region: "Europe" },
  { name: "Sweden", nameVi: "Thụy Điển", days: 45, region: "Europe" },
  { name: "Norway", nameVi: "Na Uy", days: 45, region: "Europe" },
  { name: "Finland", nameVi: "Phần Lan", days: 45, region: "Europe" },
  { name: "Belarus", nameVi: "Bê-la-rút", days: 45, region: "Europe" },
  { name: "Poland", nameVi: "Ba Lan", days: 45, region: "Europe (Tour)" },
  { name: "Czech Republic", nameVi: "Cộng hòa Séc", days: 45, region: "Europe (Tour)" },
  { name: "Switzerland", nameVi: "Thụy Sĩ", days: 45, region: "Europe (Tour)" },
  // 90 days
  { name: "Chile", nameVi: "Chi-lê", days: 90, region: "Americas" },
  { name: "Panama", nameVi: "Pa-na-ma", days: 90, region: "Americas" },
];

// ─── ENTRY PORTS DATA ───
const ENTRY_PORTS = {
  airports: [
    { en: "Noi Bai Int'l Airport (Hanoi)", vi: "Sân bay Quốc tế Nội Bài (Hà Nội)" },
    { en: "Tan Son Nhat Int'l Airport (HCMC)", vi: "Sân bay Quốc tế Tân Sơn Nhất (TP.HCM)" },
    { en: "Da Nang Int'l Airport (Da Nang)", vi: "Sân bay Quốc tế Đà Nẵng" },
    { en: "Cam Ranh Int'l Airport (Khanh Hoa / Nha Trang)", vi: "Sân bay Quốc tế Cam Ranh (Khánh Hòa)" },
    { en: "Phu Quoc Int'l Airport (Kien Giang)", vi: "Sân bay Quốc tế Phú Quốc (Kiên Giang)" },
    { en: "Cat Bi Int'l Airport (Hai Phong)", vi: "Sân bay Quốc tế Cát Bi (Hải Phòng)" },
    { en: "Can Tho Int'l Airport (Can Tho)", vi: "Sân bay Quốc tế Cần Thơ" },
    { en: "Van Don Int'l Airport (Quang Ninh)", vi: "Sân bay Quốc tế Vân Đồn (Quảng Ninh)" },
    { en: "Tho Xuan Airport (Thanh Hoa)", vi: "Sân bay Thọ Xuân (Thanh Hóa)" },
    { en: "Dong Hoi Airport (Quang Binh)", vi: "Sân bay Đồng Hới (Quảng Bình)" },
    { en: "Phu Cat Airport (Binh Dinh)", vi: "Sân bay Phù Cát (Bình Định)" },
  ],
  landports: [
    { en: "Mong Cai Border Gate (Quang Ninh)", vi: "Cửa khẩu Quốc tế Móng Cái (Quảng Ninh)" },
    { en: "Huu Nghi Border Gate (Lang Son)", vi: "Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)" },
    { en: "Lao Cai Border Gate (Lao Cai)", vi: "Cửa khẩu Quốc tế Lào Cai" },
    { en: "Tay Trang Border Gate (Dien Bien)", vi: "Cửa khẩu Quốc tế Tây Trang (Điện Biên)" },
    { en: "Na Meo Border Gate (Thanh Hoa)", vi: "Cửa khẩu Quốc tế Na Mèo (Thanh Hóa)" },
    { en: "Cau Treo Border Gate (Ha Tinh)", vi: "Cửa khẩu Quốc tế Cầu Treo (Hà Tĩnh)" },
    { en: "Cha Lo Border Gate (Quang Binh)", vi: "Cửa khẩu Quốc tế Cha Lo (Quảng Bình)" },
    { en: "La Lay Border Gate (Quang Tri)", vi: "Cửa khẩu Quốc tế La Lay (Quảng Trị)" },
    { en: "Lao Bao Border Gate (Quang Tri)", vi: "Cửa khẩu Quốc tế Lao Bảo (Quảng Trị)" },
    { en: "Bo Y Border Gate (Kon Tum)", vi: "Cửa khẩu Quốc tế Bờ Y (Kon Tum)" },
    { en: "Moc Bai Border Gate (Tay Ninh)", vi: "Cửa khẩu Quốc tế Mộc Bài (Tây Ninh)" },
    { en: "Xa Mat Border Gate (Tay Ninh)", vi: "Cửa khẩu Quốc tế Xa Mát (Tây Ninh)" },
    { en: "Tinh Bien Border Gate (An Giang)", vi: "Cửa khẩu Quốc tế Tịnh Biên (An Giang)" },
    { en: "Ha Tien Border Gate (Kien Giang)", vi: "Cửa khẩu Quốc tế Hà Tiên (Kiên Giang)" },
  ],
  seaports: [
    { en: "Hai Phong Port (Hai Phong)", vi: "Cảng Hải Phòng" },
    { en: "Hon Gai Port (Quang Ninh)", vi: "Cảng Hòn Gai (Quảng Ninh)" },
    { en: "Cam Pha Port (Quang Ninh)", vi: "Cảng Cẩm Phả (Quảng Ninh)" },
    { en: "Chan May Port (Thua Thien Hue)", vi: "Cảng Chân Mây (Thừa Thiên Huế)" },
    { en: "Da Nang Port (Da Nang)", vi: "Cảng Đà Nẵng" },
    { en: "Quy Nhon Port (Binh Dinh)", vi: "Cảng Quy Nhơn (Bình Định)" },
    { en: "Nha Trang Port (Khanh Hoa)", vi: "Cảng Nha Trang (Khánh Hòa)" },
    { en: "Vung Tau Port (Ba Ria - Vung Tau)", vi: "Cảng Vũng Tàu" },
    { en: "Ho Chi Minh City Port (HCMC)", vi: "Cảng TP. Hồ Chí Minh" },
    { en: "Duong Dong Port (Phu Quoc)", vi: "Cảng Dương Đông (Phú Quốc)" },
  ],
};

// ─── FAQ DATA ───
const VISA_FAQS = [
  {
    qEn: "Can I enter Vietnam without applying for a visa?",
    qVi: "Tôi có thể nhập cảnh Việt Nam mà không cần xin visa không?",
    aEn: "Yes, if you hold a passport from one of the 26 visa-exempt countries (such as UK, Germany, France, Italy, Spain, Japan, South Korea, Russia, ASEAN nations, etc.) for the allowable stay period (14 to 90 days), or if you travel directly to Phu Quoc Island for up to 30 days.",
    aVi: "Có, nếu bạn mang hộ chiếu của một trong 26 quốc gia được miễn thị thực (như Anh, Đức, Pháp, Ý, Tây Ban Nha, Nhật Bản, Hàn Quốc, Nga, các nước ASEAN...) với thời gian lưu trú tương ứng từ 14 đến 90 ngày, hoặc nếu bạn đến thẳng đảo Phú Quốc lưu trú dưới 30 ngày.",
  },
  {
    qEn: "Do I still need to wait 30 days between visa-exempt visits?",
    qVi: "Tôi có cần phải đợi đủ 30 ngày giữa 2 lần nhập cảnh miễn thị thực không?",
    aEn: "No. The previous 30-day waiting gap rule between two visa-exempt visits has been officially abolished under current immigration regulations. You can re-enter Vietnam immediately under the exemption policy.",
    aVi: "Không. Quy định cũ yêu cầu phải cách nhau 30 ngày giữa 2 lần nhập cảnh miễn thị thực đã chính thức được bãi bỏ. Du khách có thể tái nhập cảnh theo diện miễn thị thực ngay khi cần.",
  },
  {
    qEn: "How long is the Vietnam e-Visa valid for?",
    qVi: "Thị thực điện tử e-Visa Việt Nam có giá trị trong bao lâu?",
    aEn: "The e-Visa is valid for up to 90 days, available in either single-entry (25 USD) or multiple-entry (50 USD) options. You are allowed to stay continuously up to the validity of the visa.",
    aVi: "e-Visa có hiệu lực tối đa lên tới 90 ngày, với hai lựa chọn: nhập cảnh 1 lần (25 USD) hoặc nhiều lần (50 USD). Bạn được phép lưu trú liên tục trong suốt thời hạn của visa.",
  },
  {
    qEn: "What is the official e-Visa website of the Vietnam Government?",
    qVi: "Trang web chính thức xin e-Visa của Chính phủ Việt Nam là gì?",
    aEn: "The only official website operated by the Vietnam Immigration Department is https://evisa.gov.vn. Be cautious of unofficial third-party agency sites charging excessive service fees.",
    aVi: "Trang web chính thức duy nhất do Cục Quản lý Xuất nhập cảnh - Bộ Công an Việt Nam vận hành là https://evisa.gov.vn. Du khách lưu ý cảnh giác với các trang web trung gian tính phí dịch vụ cao bất thường.",
  },
  {
    qEn: "What documents must I prepare before applying for an e-Visa?",
    qVi: "Tôi cần chuẩn bị những giấy tờ gì trước khi nộp hồ sơ xin e-Visa?",
    aEn: "You need: (1) A valid passport with at least 6 months remaining validity and 2 blank pages; (2) A clear digital photo of your passport biodata page (JPG/PNG); (3) A 4x6cm portrait photo with white background (no glasses); (4) An international payment card (Visa/Mastercard/JCB); (5) A temporary intended stay address in Vietnam.",
    aVi: "Bạn cần chuẩn bị: (1) Hộ chiếu còn hạn ít nhất 6 tháng và còn ít nhất 2 trang trống; (2) Ảnh chụp trang thông tin nhân thân hộ chiếu (JPG/PNG rõ nét); (3) Ảnh thẻ chân dung 4x6cm nền trắng, mắt nhìn thẳng, không đeo kính; (4) Thẻ thanh toán quốc tế (Visa/Mastercard/JCB); (5) Địa chỉ lưu trú dự kiến tại Việt Nam.",
  },
];

export default function VietnamVisaPage() {
  const [lang, setLang] = useState("vi");
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const megaMenuTimeoutRef = useRef(null);

  // Exemption Filter States
  const [searchCountry, setSearchCountry] = useState("");
  const [selectedDaysFilter, setSelectedDaysFilter] = useState("all");

  // Ports Tab State
  const [activePortTab, setActivePortTab] = useState("airports");

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Sync Language
  useEffect(() => {
    setLang(getLang());
    const handleStorageChange = () => setLang(getLang());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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

  // Filter countries
  const filteredCountries = VISA_EXEMPT_COUNTRIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
      c.nameVi.toLowerCase().includes(searchCountry.toLowerCase());
    const matchesDays =
      selectedDaysFilter === "all" || c.days.toString() === selectedDaysFilter;
    return matchesSearch && matchesDays;
  });

  return (
    <div className="visa-page">
      {/* ─── 1. TOP BANNER ─── */}
      <div
        className="vnn-top-banner"
        role="button"
        tabIndex={0}
        title="VIETNAM TRAVEL ASSISTANT • AI COMPANION"
      >
        <div className="vnn-top-banner__inner">
          <Link href="/guide/plan-your-vietnam-trip-with-just-one-prompt">
            <img
              src="/guide/hcmc/Vietnamnomad-header-banner-2026.jpg"
              alt="VinaTap AI Travel Assistant"
              className="vnn-top-banner__img"
            />
          </Link>
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
            <LanguageSwitch onLanguageChange={(newLang) => setLang(newLang)} />
          </div>
        </div>

        {/* ─── ACTIVE MEGA MENU DROPDOWN ─── */}
        {activeMegaMenu && MEGA_MENUS_DATA[activeMegaMenu] && (
          <div
            className="vnn-megamenu"
            onMouseEnter={handleMegaMouseEnter}
            onMouseLeave={handleMenuLeave}
          >
            <div className="vnn-megamenu__inner">
              <div className="vnn-megamenu__grid">
                {MEGA_MENUS_DATA[activeMegaMenu].items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="vnn-megamenu__card"
                  >
                    <div className="vnn-megamenu__thumb">
                      <img src={item.img} alt={item.title} />
                      <span className="vnn-megamenu__badge">{item.badge}</span>
                    </div>
                    <h4 className="vnn-megamenu__title">
                      {lang === "vi" && item.titleVi ? item.titleVi : item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION ─── */}
      <section className="visa-hero">
        <img
          src="/guide/visa/vietnam-visa-hero.jpg"
          alt="Vietnam Visa Information"
          className="visa-hero__bg"
        />
        <div className="visa-hero__overlay" />
        <div className="visa-hero__content">
          <span className="visa-hero__badge">
            <Globe size={13} />
            {lang === "vi"
              ? "CẨM NANG THỊ THỰC VIỆT NAM • THÔNG TIN CHÍNH THỨC"
              : "VIETNAM TRAVEL WIKI • OFFICIAL VISA GUIDE"}
          </span>
          <h1 className="visa-hero__title">
            {lang === "vi"
              ? "Thông Tin Visa Việt Nam"
              : "Vietnam Visa – Everything You Need to Know"}
          </h1>
          <p className="visa-hero__subtitle">
            {lang === "vi"
              ? "Cẩm nang toàn diện về chính sách miễn thị thực 45 ngày, cấp e-Visa 90 ngày cho mọi quốc tịch, thủ tục trực tuyến đơn giản và các cửa khẩu nhập cảnh."
              : "Complete guide on 45-day visa exemptions, 90-day e-Visas for all nationalities, easy online application steps, and approved international entry ports."}
          </p>
          <div className="visa-hero__meta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <Logo
              size={20}
              showText={true}
              noLink
              href={null}
              as="span"
              className="vnn-hero-author-logo"
            />
            <span>•</span>
            <span className="visa-hero__meta-item">
              <Calendar size={15} />
              {lang === "vi" ? "14 Tháng 10, 2026" : "October 14, 2026"}
            </span>
            <span>•</span>
            <span className="visa-hero__meta-item">
              <Clock size={15} />
              {lang === "vi" ? "Thời gian đọc: 5 phút" : "5 min read"}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 4. CALL TO ACTION BAR (NEWSPAPER STYLE) ─── */}
      <div className="visa-cta-bar">
        <Link
          href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
          className="visa-cta-btn"
        >
          <Sparkles size={18} />
          <span>
            {lang === "vi"
              ? "Lên kế hoạch du lịch Việt Nam chỉ trong vài giây với AI"
              : "Create your Vietnam trip in seconds with AI"}
          </span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* ─── 5. MAIN CONTAINER ─── */}
      <div className="visa-container">
        <main className="visa-main">
          {/* ─── QUICK POLICY HIGHLIGHTS BOX ─── */}
          <div className="visa-highlights">
            <h3 className="visa-highlights__title">
              <Sparkles size={20} />
              {lang === "vi"
                ? "Điểm nổi bật trong chính sách Visa Việt Nam hiện hành"
                : "Key Highlights of Vietnam's Current Visa Policy"}
            </h3>
            <div className="visa-highlights__grid">
              <div className="visa-highlight-card">
                <span className="visa-highlight-card__badge">E-VISA 90 NGÀY</span>
                <span className="visa-highlight-card__val">90 Ngày</span>
                <span className="visa-highlight-card__desc">
                  {lang === "vi"
                    ? "Cấp cho công dân TẤT CẢ các quốc gia & vùng lãnh thổ trên toàn thế giới (1 lần hoặc nhiều lần)."
                    : "Granted to citizens of ALL countries & territories worldwide (single or multiple entry)."}
                </span>
              </div>

              <div className="visa-highlight-card">
                <span className="visa-highlight-card__badge">MIỄN THỊ THỰC</span>
                <span className="visa-highlight-card__val">45 Ngày</span>
                <span className="visa-highlight-card__desc">
                  {lang === "vi"
                    ? "Thời hạn tạm trú miễn thị thực đơn phương cho 26 quốc gia (Anh, Pháp, Đức, Ý, Nhật, Hàn, v.v.)."
                    : "Unilateral visa-exempt stay up to 45 days for 26 countries (UK, France, Germany, Japan, etc.)."}
                </span>
              </div>

              <div className="visa-highlight-card">
                <span className="visa-highlight-card__badge">ĐẢO PHÚ QUỐC</span>
                <span className="visa-highlight-card__val">30 Ngày</span>
                <span className="visa-highlight-card__desc">
                  {lang === "vi"
                    ? "Miễn visa 30 ngày cho mọi quốc tịch bay thẳng hoặc quá cảnh nội địa tới Phú Quốc."
                    : "30-day visa exemption for all nationalities visiting Phu Quoc Island directly or in transit."}
                </span>
              </div>

              <div className="visa-highlight-card">
                <span className="visa-highlight-card__badge">TÁI NHẬP CẢNH</span>
                <span className="visa-highlight-card__val">Không Chờ Đợi</span>
                <span className="visa-highlight-card__desc">
                  {lang === "vi"
                    ? "Đã bãi bỏ hoàn toàn quy định phải cách 30 ngày giữa hai lần xuất nhập cảnh miễn thị thực."
                    : "The 30-day waiting gap between visa-exempt visits has been completely abolished."}
                </span>
              </div>
            </div>
          </div>

          {/* ─── SECTION 1: VISA-EXEMPT ENTRY ─── */}
          <section className="visa-section" id="visa-exemption">
            <h2 className="visa-section__heading">
              {lang === "vi"
                ? "1. Miễn thị thực nhập cảnh Việt Nam (Visa-Exempt Entry)"
                : "1. Visa-Exempt Entry to Vietnam"}
            </h2>
            <p className="visa-paragraph">
              {lang === "vi"
                ? "Công dân của 26 quốc gia được miễn thị thực khi nhập cảnh Việt Nam theo các điều ước quốc tế song phương hoặc quyết định đơn phương của Chính phủ Việt Nam. Thời gian lưu trú miễn visa dao động từ 14 đến 90 ngày tùy theo từng quốc gia."
                : "Citizens of 26 countries are exempt from visas when entering Vietnam under bilateral treaties or unilateral government exemptions, with permitted stays ranging from 14 to 90 days."}
            </p>

            {/* Infographic Image */}
            <figure className="visa-figure">
              <img
                src="/guide/visa/visa-exempt-countries.jpg"
                alt="List of visa-exempt countries for travel to Vietnam"
                className="visa-figure__img"
              />
              <figcaption className="visa-figure__caption">
                {lang === "vi"
                  ? "Danh sách tổng hợp các quốc gia được miễn thị thực du lịch Việt Nam."
                  : "Comprehensive chart of visa-exempt countries for travel to Vietnam."}
              </figcaption>
            </figure>

            <p className="visa-paragraph">
              {lang === "vi"
                ? "Du khách từ Ba Lan, Cộng hòa Séc và Thụy Sĩ được miễn thị thực lên đến 45 ngày khi tham gia các chương trình du lịch trọn gói do các công ty lữ hành quốc tế được cấp phép của Việt Nam tổ chức."
                : "Travelers from Poland, the Czech Republic, and Switzerland may enter Vietnam visa-free for stays of up to 45 days when participating in tourism trips organized by licensed Vietnamese international travel agencies, regardless of passport type."}
            </p>

            <p className="visa-paragraph">
              {lang === "vi"
                ? "Đặc biệt, tất cả quốc tịch trên thế giới đều được miễn thị thực khi đến Đảo Phú Quốc trong vòng 30 ngày nếu bay thẳng hoặc chỉ quá cảnh qua các sân bay quốc tế khác của Việt Nam trước khi đáp xuống Phú Quốc."
                : "All nationalities are exempted from visas to Phu Quoc Island for 30 days if they directly visit Phu Quoc or transit through other international airports in Vietnam before arriving in Phu Quoc."}
            </p>

            {/* Interactive Exemption Search & Filter Widget */}
            <div className="visa-lookup">
              <div className="visa-lookup__header">
                <h4 className="visa-lookup__title">
                  {lang === "vi"
                    ? "Tra cứu nhanh quốc gia miễn thị thực"
                    : "Instant Visa-Exemption Country Lookup"}
                </h4>
                <p className="visa-lookup__desc">
                  {lang === "vi"
                    ? "Nhập tên quốc gia hoặc chọn số ngày lưu trú để kiểm tra chính sách:"
                    : "Type your country name or select stay duration to check exemptions:"}
                </p>
              </div>

              <div className="visa-lookup__controls">
                <div className="visa-lookup__search-wrap">
                  <Search size={16} className="visa-lookup__search-icon" />
                  <input
                    type="text"
                    className="visa-lookup__search"
                    placeholder={
                      lang === "vi"
                        ? "Tìm quốc gia (VD: Đức, Pháp, Nhật Bản, Anh...)"
                        : "Search country (e.g. Germany, UK, Japan, France...)"
                    }
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                  />
                </div>

                <div className="visa-lookup__tabs">
                  {[
                    { id: "all", labelVi: "Tất cả", labelEn: "All" },
                    { id: "45", labelVi: "45 Ngày", labelEn: "45 Days" },
                    { id: "30", labelVi: "30 Ngày", labelEn: "30 Days" },
                    { id: "90", labelVi: "90 Ngày", labelEn: "90 Days" },
                    { id: "21", labelVi: "21 Ngày", labelEn: "21 Days" },
                    { id: "14", labelVi: "14 Ngày", labelEn: "14 Days" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`visa-lookup__tab ${selectedDaysFilter === tab.id ? "is-active" : ""}`}
                      onClick={() => setSelectedDaysFilter(tab.id)}
                    >
                      {lang === "vi" ? tab.labelVi : tab.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="visa-lookup__grid">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <div key={c.name} className="visa-country-tag">
                      <span>{lang === "vi" ? c.nameVi : c.name}</span>
                      <span className="visa-country-tag__days">
                        {c.days} {lang === "vi" ? "ngày" : "days"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: "14px", gridColumn: "1 / -1" }}>
                    {lang === "vi"
                      ? "Không tìm thấy quốc gia phù hợp. Bạn có thể xin e-Visa 90 ngày trực tuyến dễ dàng!"
                      : "No matching country found. You can easily apply for a 90-day e-Visa online!"}
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                padding: "16px 20px",
                borderRadius: "10px",
                borderLeft: "4px solid var(--vnn-cyan)",
                marginBottom: "24px",
              }}
            >
              <h5 style={{ margin: "0 0 6px", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                {lang === "vi" ? "Điều kiện nhập cảnh miễn visa:" : "Conditions for Visa-Exempt Entry:"}
              </h5>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                <li>
                  {lang === "vi"
                    ? "Hộ chiếu còn giá trị sử dụng ít nhất 6 tháng kể từ ngày nhập cảnh."
                    : "Passport valid for at least 6 months from entry date."}
                </li>
                <li>
                  {lang === "vi"
                    ? "Còn ít nhất 02 trang trống để đóng dấu xuất nhập cảnh."
                    : "At least 2 blank pages remaining for entry/exit stamps."}
                </li>
                <li>
                  {lang === "vi"
                    ? "Có vé máy bay khứ hồi hoặc vé đến quốc gia thứ ba chứng minh thời gian rời Việt Nam."
                    : "Proof of return or onward travel ticket within the visa exemption period."}
                </li>
              </ul>
            </div>
          </section>

          {/* ─── SECTION 2: HOW TO APPLY FOR E-VISA ─── */}
          <section className="visa-section" id="evisa-application">
            <h2 className="visa-section__heading">
              {lang === "vi"
                ? "2. Hướng dẫn nộp hồ sơ xin Thị thực Điện tử (e-Visa)"
                : "2. How to Apply for a Vietnam e-Visa"}
            </h2>
            <p className="visa-paragraph">
              {lang === "vi"
                ? "Truy cập cổng dịch vụ công chính thức của Cục Quản lý Xuất nhập cảnh Việt Nam để nộp hồ sơ trực tuyến. Quy trình hoàn toàn đơn giản, thực hiện 100% online và áp dụng cho công dân của tất cả các quốc gia, vùng lãnh thổ trên toàn thế giới."
                : "Visit the official portal of the Vietnam Immigration Department (https://evisa.gov.vn) to submit your application. The entire process is 100% online, remarkably straightforward, and accessible to citizens of all countries and territories worldwide."}
            </p>

            {/* Quick summary table */}
            <div className="visa-table-wrap">
              <table className="visa-table">
                <thead>
                  <tr>
                    <th>{lang === "vi" ? "Thông tin" : "Feature"}</th>
                    <th>{lang === "vi" ? "Chi tiết quy định" : "Specification"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{lang === "vi" ? "Lệ phí cấp thị thực" : "Visa Fee"}</strong>
                    </td>
                    <td>
                      {lang === "vi"
                        ? "25 USD (Nhập cảnh 1 lần - Single entry) | 50 USD (Nhập cảnh nhiều lần - Multiple entry)"
                        : "25 USD (Single-entry) | 50 USD (Multiple-entry)"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{lang === "vi" ? "Thời gian xử lý" : "Processing Time"}</strong>
                    </td>
                    <td>
                      {lang === "vi"
                        ? "Thông thường 3 ngày làm việc (không tính Thứ Bảy, Chủ Nhật và ngày lễ)"
                        : "Typically 3 working days (excluding weekends & public holidays)"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{lang === "vi" ? "Thời hạn giá trị" : "Validity & Stay"}</strong>
                    </td>
                    <td>
                      {lang === "vi"
                        ? "Hiệu lực tối đa 90 ngày; cho phép lưu trú lên đến 90 ngày cho mỗi lần nhập cảnh"
                        : "Valid for up to 90 days, permitting a continuous stay of up to 90 days per entry"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{lang === "vi" ? "Đối tượng áp dụng" : "Eligibility"}</strong>
                    </td>
                    <td>
                      {lang === "vi"
                        ? "Công dân tất cả các quốc gia và vùng lãnh thổ trên thế giới"
                        : "Citizens of all countries and territories worldwide"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4 Step Process Cards */}
            <h3 style={{ fontSize: "19px", fontWeight: 700, margin: "24px 0 14px", color: "#111827" }}>
              {lang === "vi"
                ? "Quy trình 4 bước nộp e-Visa nhanh chóng:"
                : "4 Simple Steps to Get Your Vietnam e-Visa:"}
            </h3>

            <div className="visa-steps">
              <div className="visa-step-card">
                <div className="visa-step-card__num">1</div>
                <div className="visa-step-card__body">
                  <h4 className="visa-step-card__title">
                    {lang === "vi"
                      ? "Chuẩn bị hình ảnh giấy tờ hợp lệ"
                      : "Prepare Your Digital Documents"}
                  </h4>
                  <p className="visa-step-card__desc">
                    {lang === "vi"
                      ? "Chụp ảnh rõ nét trang dữ liệu hộ chiếu (đầy đủ các góc, không bị lóa sáng) và 01 ảnh thẻ chân dung kích thước 4x6cm phông nền trắng, mắt nhìn thẳng, không đội mũ hay đeo kính râm."
                      : "Prepare a clear scan or photo of your passport biodata page (JPG/PNG format) and a 4x6cm portrait photo on a clean white background (facing forward, no glasses)."}
                  </p>
                </div>
              </div>

              <div className="visa-step-card">
                <div className="visa-step-card__num">2</div>
                <div className="visa-step-card__body">
                  <h4 className="visa-step-card__title">
                    {lang === "vi"
                      ? "Điền đơn trực tuyến trên Cổng chính thức"
                      : "Complete the Online Application"}
                  </h4>
                  <p className="visa-step-card__desc">
                    {lang === "vi"
                      ? "Truy cập https://evisa.gov.vn, tải ảnh lên và điền chính xác họ tên, số hộ chiếu, ngày sinh, ngày dự kiến nhập cảnh, cửa khẩu nhập cảnh và địa chỉ lưu trú tại Việt Nam."
                      : "Access https://evisa.gov.vn, upload your photos, and accurately fill in personal information, passport number, intended entry date, arrival border checkpoint, and Vietnam temporary address."}
                  </p>
                </div>
              </div>

              <div className="visa-step-card">
                <div className="visa-step-card__num">3</div>
                <div className="visa-step-card__body">
                  <h4 className="visa-step-card__title">
                    {lang === "vi"
                      ? "Thanh toán lệ phí & Lưu mã hồ sơ"
                      : "Pay Visa Fee & Save Registration Code"}
                  </h4>
                  <p className="visa-step-card__desc">
                    {lang === "vi"
                      ? "Thanh toán lệ phí an toàn bằng thẻ quốc tế (Visa, Mastercard, JCB). Hệ thống sẽ cấp một Mã hồ sơ điện tử (Registration Code) – hãy lưu lại cẩn thận mã này để tra cứu kết quả."
                      : "Pay the official visa fee securely using your international payment card. Note down your unique Registration Code to monitor application progress."}
                  </p>
                </div>
              </div>

              <div className="visa-step-card">
                <div className="visa-step-card__num">4</div>
                <div className="visa-step-card__body">
                  <h4 className="visa-step-card__title">
                    {lang === "vi"
                      ? "Tra cứu, Tải xuống & In bản giấy e-Visa"
                      : "Track Status, Download & Print e-Visa"}
                  </h4>
                  <p className="visa-step-card__desc">
                    {lang === "vi"
                      ? "Sau 3 ngày làm việc, nhập Mã hồ sơ và Email để tra cứu kết quả. Tải file PDF e-Visa và in sẵn ít nhất 2 bản giấy A4 mang theo để trình khi làm thủ tục check-in máy bay và tại quầy hải quan."
                      : "After approximately 3 working days, check your status using the Registration Code. Download your approved e-Visa PDF and print at least 2 hard copies to present at airport check-in and border control."}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Portal Box Banner */}
            <div className="visa-official-portal">
              <div className="visa-official-portal__text">
                <h4>
                  {lang === "vi"
                    ? "Cổng Thông Tin e-Visa Chính Thức – Bộ Công An Việt Nam"
                    : "Official Vietnam Government e-Visa Portal"}
                </h4>
                <p>
                  {lang === "vi"
                    ? "Nộp hồ sơ trực tiếp với mức lệ phí gốc của Chính phủ (25 USD - 50 USD), không qua trung gian."
                    : "Apply directly at original government rates ($25 - $50 USD) with no third-party markups."}
                </p>
              </div>
              <a
                href="https://evisa.gov.vn"
                target="_blank"
                rel="noreferrer noopener nofollow"
                className="visa-official-portal__btn"
              >
                <span>{lang === "vi" ? "Truy Cập evisa.gov.vn" : "Go to evisa.gov.vn"}</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </section>

          {/* ─── SECTION 3: ENTRY PORTS ─── */}
          <section className="visa-section" id="entry-ports">
            <h2 className="visa-section__heading">
              {lang === "vi"
                ? "3. Danh sách các Cửa khẩu Quốc tế Chấp nhận e-Visa"
                : "3. International Ports of Entry Accepting e-Visa"}
            </h2>
            <p className="visa-paragraph">
              {lang === "vi"
                ? "Du khách sở hữu e-Visa hợp lệ có thể nhập cảnh và xuất cảnh qua các cửa khẩu quốc tế được quy định bao gồm đường hàng không, đường bộ và đường biển:"
                : "Foreign visitors holding a valid Vietnam e-Visa may enter and exit through designated international border checkpoints across air, land, and sea ports:"}
            </p>

            <div className="visa-ports-box">
              <div className="visa-ports-tabs">
                <button
                  type="button"
                  className={`visa-ports-tab ${activePortTab === "airports" ? "is-active" : ""}`}
                  onClick={() => setActivePortTab("airports")}
                >
                  <Plane size={16} />
                  <span>{lang === "vi" ? "Đường Hàng Không (Sân Bay)" : "Airports"}</span>
                </button>
                <button
                  type="button"
                  className={`visa-ports-tab ${activePortTab === "landports" ? "is-active" : ""}`}
                  onClick={() => setActivePortTab("landports")}
                >
                  <Truck size={16} />
                  <span>{lang === "vi" ? "Đường Bộ (Cửa Khẩu)" : "Land Borders"}</span>
                </button>
                <button
                  type="button"
                  className={`visa-ports-tab ${activePortTab === "seaports" ? "is-active" : ""}`}
                  onClick={() => setActivePortTab("seaports")}
                >
                  <Ship size={16} />
                  <span>{lang === "vi" ? "Đường Biển (Cảng Biển)" : "Seaports"}</span>
                </button>
              </div>

              <div className="visa-ports-grid">
                {ENTRY_PORTS[activePortTab].map((port, idx) => (
                  <div key={idx} className="visa-port-item">
                    <CheckCircle2 size={16} />
                    <span>{lang === "vi" ? port.vi : port.en}</span>
                  </div>
                ))}
              </div>
            </div>
            <AffiliateDealBox
              deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.vietnamAirportTransferFastTrack}
              isVi={lang === "vi"}
            />
            <AffiliateDealBox
              deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.vietnamESim}
              isVi={lang === "vi"}
            />
          </section>

          {/* ─── SECTION 4: IMPORTANT TIPS ─── */}
          <section className="visa-section" id="important-tips">
            <h2 className="visa-section__heading">
              {lang === "vi"
                ? "4. Những lưu ý quan trọng khi nhập cảnh Việt Nam"
                : "4. Essential Travel Tips & Visa Advice"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                }}
              >
                <AlertCircle size={22} style={{ color: "#ef4444", flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#991b1b" }}>
                    {lang === "vi" ? "Tránh lỗi sai thông tin trên e-Visa" : "Double-Check Every Character on e-Visa"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#7f1d1d", lineHeight: 1.5 }}>
                    {lang === "vi"
                      ? "Nếu họ tên, ngày sinh hoặc số hộ chiếu trên e-Visa khác dù chỉ 1 ký tự so với hộ chiếu thực tế, hãng hàng không có quyền từ chối cho bạn lên máy bay. Hãy kiểm tra thật kỹ trước khi gửi đơn."
                      : "Even a single mismatch character in full name, birth date, or passport number will cause airlines to deny boarding. Always double check your application preview before payment."}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                }}
              >
                <CheckCircle2 size={22} style={{ color: "#22c55e", flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#166534" }}>
                    {lang === "vi" ? "Luôn in ít nhất 02 bản cứng A4" : "Always Keep Printed Physical Copies"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#14532d", lineHeight: 1.5 }}>
                    {lang === "vi"
                      ? "Mặc dù là thị thực điện tử, các cán bộ kiểm soát xuất nhập cảnh tại sân bay Việt Nam và nhân viên quầy vé máy bay quốc tế vẫn yêu cầu xem bản in giấy để đóng dấu xác nhận."
                      : "Although it is an electronic visa, immigration officers at border checkpoints and airline staff still require physical A4 paper printouts upon arrival and departure."}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  padding: "16px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                }}
              >
                <Info size={22} style={{ color: "#3b82f6", flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#1e40af" }}>
                    {lang === "vi" ? "Nộp đơn sớm ít nhất 1-2 tuần" : "Submit Your Application at Least 1-2 Weeks Ahead"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#1e3a8a", lineHeight: 1.5 }}>
                    {lang === "vi"
                      ? "Dù thời gian xử lý tiêu chuẩn là 3 ngày làm việc, vào các mùa cao điểm du lịch (tháng 11 đến tháng 4) số lượng hồ sơ có thể tăng cao. Bạn nên nộp trước chuyến bay từ 7 đến 14 ngày để an tâm tuyệt đối."
                      : "While the standard processing timeframe is 3 business days, peak travel seasons (November to April) can cause delays. Applying 7-14 days prior to departure ensures total peace of mind."}
                  </p>
                </div>
              </div>
            </div>
            <AffiliateDealBox
              deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.vietnamDomesticTransport}
              isVi={lang === "vi"}
            />
            <AffiliateDealBox
              deal={VUNGTAU_VIETNAM_AFFILIATE_DEALS.allVietnamHotels}
              isVi={lang === "vi"}
            />
          </section>

          {/* ─── SECTION 5: FREQUENTLY ASKED QUESTIONS ─── */}
          <section className="visa-section" id="faqs">
            <h2 className="visa-section__heading">
              {lang === "vi"
                ? "5. Câu hỏi thường gặp về Visa Du lịch Việt Nam (FAQ)"
                : "5. Frequently Asked Questions (FAQ)"}
            </h2>
            <div className="visa-faq-list">
              {VISA_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="visa-faq-item">
                    <button
                      type="button"
                      className="visa-faq-trigger"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    >
                      <span>{lang === "vi" ? faq.qVi : faq.qEn}</span>
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          color: "#64748b",
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="visa-faq-answer">
                        <p style={{ margin: 0 }}>
                          {lang === "vi" ? faq.aVi : faq.aEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Share & tags */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 0",
              borderTop: "1px solid var(--vnn-border)",
              marginTop: "20px",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                {lang === "vi" ? "Thẻ chủ đề:" : "Tags:"}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  background: "#f1f5f9",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                Vietnam Visa
              </span>
              <span
                style={{
                  fontSize: "12px",
                  background: "#f1f5f9",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                e-Visa
              </span>
              <span
                style={{
                  fontSize: "12px",
                  background: "#f1f5f9",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                Travel Guide
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Vietnam Visa - VinaTap Guide",
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === "vi" ? "Đã sao chép liên kết bài viết!" : "Link copied to clipboard!");
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1px solid var(--vnn-border)",
                  background: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer",
                }}
              >
                <Share2 size={15} />
                <span>{lang === "vi" ? "Chia sẻ bài viết" : "Share Guide"}</span>
              </button>
            </div>
          </div>
        </main>

        {/* ─── 6. SIDEBAR ─── */}
        <aside className="visa-sidebar">
          {/* AI Trip Assistant Widget */}
          <div className="visa-ai-widget">
            <div className="visa-ai-widget__icon">
              <Bot size={24} />
            </div>
            <h4 className="visa-ai-widget__title">
              {lang === "vi" ? "Trợ lý AI Du Lịch VinaTap" : "VinaTap AI Companion"}
            </h4>
            <p className="visa-ai-widget__desc">
              {lang === "vi"
                ? "Lên ngay lịch trình xuyên Việt hoàn hảo, giải đáp quy định visa và gợi ý điểm đến theo sở thích của riêng bạn."
                : "Generate custom Vietnam itineraries, verify entry requirements, and get personalized local suggestions in seconds."}
            </p>
            <Link
              href="/guide/plan-your-vietnam-trip-with-just-one-prompt"
              className="visa-ai-widget__btn"
            >
              <Sparkles size={16} />
              <span>{lang === "vi" ? "Thử Ngay Với 1 Prompt" : "Plan Trip in 1 Prompt"}</span>
            </Link>
          </div>

          {/* Related Articles Widget */}
          <div className="visa-widget">
            <h4 className="visa-widget__title">
              {lang === "vi" ? "Cẩm Nang Hữu Ích" : "Related Articles"}
            </h4>
            <div className="visa-related-list">
              <Link href="/guide/the-complete-guide-to-vietnam" className="visa-related-item">
                <img
                  src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                  alt="Complete Guide to Vietnam"
                  className="visa-related-thumb"
                />
                <div className="visa-related-info">
                  <span className="visa-related-cat">WIKI & GUIDE</span>
                  <h5 className="visa-related-title">
                    {lang === "vi"
                      ? "Cẩm nang toàn diện 34 Tỉnh Thành Việt Nam"
                      : "The Complete Guide to Vietnam"}
                  </h5>
                </div>
              </Link>

              <Link href="/guide/3-week-vietnam-itinerary" className="visa-related-item">
                <img
                  src="/guide/hcmc/3-week-vietnam-itinerary.jpg"
                  alt="3-Week Itinerary"
                  className="visa-related-thumb"
                />
                <div className="visa-related-info">
                  <span className="visa-related-cat">ITINERARY</span>
                  <h5 className="visa-related-title">
                    {lang === "vi"
                      ? "Lịch trình 3 tuần xuyên Việt kinh điển"
                      : "3-Week Vietnam Itinerary"}
                  </h5>
                </div>
              </Link>

              <Link href="/guide/15-best-places-to-visit-in-vietnam-in-2026" className="visa-related-item">
                <img
                  src="/guide/hcmc/15-best-places-to-visit-in-Vietnam-in-2026.jpg"
                  alt="15 Best Places"
                  className="visa-related-thumb"
                />
                <div className="visa-related-info">
                  <span className="visa-related-cat">TRENDING</span>
                  <h5 className="visa-related-title">
                    {lang === "vi"
                      ? "15 điểm đến tuyệt nhất Việt Nam 2026"
                      : "15 Best Places to Visit in Vietnam"}
                  </h5>
                </div>
              </Link>

              <Link href="/guide/20-best-things-to-do-in-vietnam" className="visa-related-item">
                <img
                  src="/guide/hcmc/20-Best-Things-to-Do-in-Vietnam.jpg"
                  alt="20 Best Things"
                  className="visa-related-thumb"
                />
                <div className="visa-related-info">
                  <span className="visa-related-cat">ACTIVITIES</span>
                  <h5 className="visa-related-title">
                    {lang === "vi"
                      ? "20 trải nghiệm nhất định phải thử tại Việt Nam"
                      : "20 Best Things to Do in Vietnam"}
                  </h5>
                </div>
              </Link>
            </div>
          </div>

          {/* Phu Quoc Special Box */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--vnn-border)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0284c7",
                  background: "#e0f2fe",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                SPECIAL ZONE
              </span>
            </div>
            <h4 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>
              {lang === "vi" ? "Đặc khu Đảo Phú Quốc" : "Phu Quoc Island 30-Day Visa Free"}
            </h4>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5, margin: "0 0 14px" }}>
              {lang === "vi"
                ? "Mọi du khách quốc tế bay thẳng đến Phú Quốc (hoặc transit qua sân bay Việt Nam mà không rời khu vực cách ly) đều được miễn visa trong 30 ngày."
                : "Travelers of all nationalities flying directly to Phu Quoc enjoy an automatic 30-day stay without applying for a visa."}
            </p>
            <Link
              href="/province/phu-quoc"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--vnn-cyan-dark)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{lang === "vi" ? "Khám phá cẩm nang Phú Quốc" : "Explore Phu Quoc Guide"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      {/* ─── 7. FLOATING AI CHATBOT ─── */}
      <ProvinceChatbot
        province={{
          name: lang === "vi" ? "Thị Thực Việt Nam (Visa Guide)" : "Vietnam Visa Guide",
          slug: "vietnam-visa",
          description:
            lang === "vi"
              ? "Cẩm nang chính thức về quy định thị thực, e-Visa 90 ngày và miễn visa 45 ngày tại Việt Nam."
              : "Official guide to Vietnam visa regulations, 90-day e-Visa, and 45-day exemptions.",
        }}
      />

      {/* ─── 8. PUBLIC FOOTER ─── */}
      <PublicFooter />
    </div>
  );
}
