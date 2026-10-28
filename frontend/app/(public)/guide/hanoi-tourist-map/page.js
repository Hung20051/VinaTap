"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import AffiliateDealBox from "@/components/ui/AffiliateDealBox";
import { HANOI_AFFILIATE_DEALS } from "@/lib/affiliateDeals";
import { getLang } from "@/lib/prefs";
import {
  ChevronDown,
  Share2,
  MapPin,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Compass,
  Navigation,
  Utensils,
  Landmark,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import "@/styles/home.css";
import "./hanoi-tourist-map.css";


export default function HanoiTouristMapPage() {
  const [lang, setLang] = useState("vi");
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const menuTimerRef = useRef(null);

  const isVi = lang === "vi";

  // Sync language with prefs
  useEffect(() => {
    setLang(getLang() || "vi");
    const handleLangUpdated = (e) => {
      setLang(e.detail || getLang() || "vi");
    };
    window.addEventListener("vinatap:lang-updated", handleLangUpdated);
    window.addEventListener("storage", handleLangUpdated);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangUpdated);
      window.removeEventListener("storage", handleLangUpdated);
    };
  }, []);

  // Update document title
  useEffect(() => {
    document.title =
      lang === "vi"
        ? "Bản đồ du lịch Hà Nội | Map of Hanoi | Vietnam Travel Guide"
        : "Hanoi Tourist Map | Map of Hanoi | Vietnam Travel Guide";
  }, [lang]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuEnter = (menuKey) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleMegaMouseEnter = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title:
              lang === "vi"
                ? "Bản đồ du lịch Hà Nội | VinaTap"
                : "Hanoi Tourist Map | VinaTap",
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert(
          lang === "vi"
            ? "Đã sao chép liên kết vào bộ nhớ tạm!"
            : "Link copied to clipboard!"
        );
      }
    }
  };

  // Top 15 Hanoi Attractions matching VietnamNomad dump
  const TOP_ATTRACTIONS = [
    {
      id: 1,
      titleEn: "The Three Lakes (Hoan Kiem, West Lake, and Truc Bach)",
      titleVi: "Ba hồ nước biểu tượng (Hồ Hoàn Kiếm, Hồ Tây & Hồ Trúc Bạch)",
    },
    {
      id: 2,
      titleEn: "Temple of Literature (Van Mieu)",
      titleVi: "Văn Miếu – Quốc Tử Giám",
    },
    {
      id: 3,
      titleEn: "Ho Chi Minh Mausoleum",
      titleVi: "Lăng Chủ tịch Hồ Chí Minh & Quảng trường Ba Đình",
    },
    {
      id: 4,
      titleEn: "Hanoi 36 Streets (Hanoi Old Quarter)",
      titleVi: "36 Phố Phường Hà Nội (Khu phố cổ)",
    },
    {
      id: 5,
      titleEn: "St. Joseph's Cathedral (Hanoi Cathedral)",
      titleVi: "Nhà thờ Lớn Hà Nội",
    },
    {
      id: 6,
      titleEn: "Hoa Lo Prison Memorial",
      titleVi: "Di tích lịch sử Nhà tù Hỏa Lò",
    },
    {
      id: 7,
      titleEn: "Dong Xuan Market",
      titleVi: "Chợ Đồng Xuân",
    },
    {
      id: 8,
      titleEn: "Imperial Citadel of Thang Long",
      titleVi: "Hoàng thành Thăng Long",
    },
    {
      id: 9,
      titleEn: "Hanoi Opera House",
      titleVi: "Nhà hát Lớn Hà Nội",
    },
    {
      id: 10,
      titleEn: "Long Bien Bridge",
      titleVi: "Cầu Long Biên lịch sử",
    },
    {
      id: 11,
      titleEn: "Thang Long Water Puppet Theater",
      titleVi: "Nhà hát Múa rối nước Thăng Long",
    },
    {
      id: 12,
      titleEn: "Quang Ba Flower Market",
      titleVi: "Chợ hoa đêm Quảng Bá",
    },
    {
      id: 13,
      titleEn: "One Pillar Pagoda",
      titleVi: "Chùa Một Cột",
    },
    {
      id: 14,
      titleEn: "Bat Trang Ceramic Village",
      titleVi: "Làng gốm Bát Tràng",
    },
    {
      id: 15,
      titleEn: "Hanoi Train Street",
      titleVi: "Phố đường tàu Hà Nội",
    },
  ];

  // Top 10 Hanoi Foods matching VietnamNomad dump
  const TOP_FOODS = [
    {
      id: 1,
      titleEn: "Pho (Beef / Chicken Noodle Soup)",
      titleVi: "Phở (Phở bò, phở gà gia truyền)",
      img: "/guide/hanoi/hanoi-pho-hd.jpg",
      subEn: "Iconic Vietnamese national soup",
      subVi: "Tinh hoa ẩm thực thủ đô",
    },
    {
      id: 2,
      titleEn: "Bun Cha (Grilled Pork with Noodles)",
      titleVi: "Bún chả Hà Nội",
      img: "/guide/hanoi/hanoi-buncha-hd.jpg",
      subEn: "Fragrant grilled pork in fish sauce",
      subVi: "Chả nướng than hoa thơm lừng",
    },
    {
      id: 3,
      titleEn: "Bun Thang (Elegance in a Bowl)",
      titleVi: "Bún thang Hà Nội",
      img: "/guide/hanoi/hanoi-bunthang-hd.jpg",
      subEn: "Delicate shredded chicken, egg & sausage",
      subVi: "Bát bún cầu kỳ, thanh tao bậc nhất",
    },
    {
      id: 4,
      titleEn: "Banh Mi Hanoi",
      titleVi: "Bánh mì giòn rụm pate",
      img: "/guide/hanoi/hanoi-banhmi-hd.jpg",
      subEn: "Crispy baguette with pate & charcuterie",
      subVi: "Bánh mì bơ pate truyền thống",
    },
    {
      id: 5,
      titleEn: "Cha Ca La Vong (Turmeric Fish)",
      titleVi: "Chả cá Lã Vọng",
      img: "/guide/hanoi/hanoi-chaca-hd.jpg",
      subEn: "Pan-fried catfish with fresh dill",
      subVi: "Cá lăng xào thì là ăn kèm mắm tôm",
    },
    {
      id: 6,
      titleEn: "Pho Cuon Ngu Xa (Rolled Pho)",
      titleVi: "Phở cuốn Ngũ Xã",
      img: "/guide/hanoi/hanoi-phocuon-hd.jpg",
      subEn: "Fresh rice sheet rolled with stir-fried beef",
      subVi: "Bánh phở tươi cuốn thịt bò xào",
    },
    {
      id: 7,
      titleEn: "Ngan Chay Toi (Crispy Duck with Garlic)",
      titleVi: "Ngan cháy tỏi",
      img: "/guide/hanoi/hanoi-nganchaytoi-hd.jpg",
      subEn: "Sizzling rich duck with golden garlic",
      subVi: "Thịt ngan mềm thơm tỏi phi giòn",
    },
    {
      id: 8,
      titleEn: "Chao Suon (Smooth Rib Congee)",
      titleVi: "Cháo sườn quẩy ruốc",
      img: "/guide/hanoi/hanoi-chaosun-hd.jpg",
      subEn: "Velvety rice porridge with crispy donuts",
      subVi: "Cháo sườn sánh mịn phố Hàng Bồ",
    },
    {
      id: 9,
      titleEn: "Banh Goi (Crispy Pillow Cake)",
      titleVi: "Bánh gối Lý Quốc Sư",
      img: "/guide/hanoi/hanoi-banhgoi-hd.jpg",
      subEn: "Deep-fried pastry with glass noodle filling",
      subVi: "Bánh gối chiên vàng chấm nước mắm chua ngọt",
    },
    {
      id: 10,
      titleEn: "Ca Phe Trung (Egg Coffee)",
      titleVi: "Cà phê trứng Giảng",
      img: "/guide/hanoi/hanoi-caphetrung-hd.jpg",
      subEn: "Whipped egg yolk froth over robusta",
      subVi: "Lớp kem trứng béo ngậy nức tiếng",
    },
  ];

  // 4 Main Neighborhoods on the Map
  const DISTRICTS = [
    {
      id: "hoankiem",
      tagEn: "Heart of Hanoi",
      tagVi: "Trái tim Thủ đô",
      nameEn: "Hoan Kiem District & Old Quarter",
      nameVi: "Quận Hoàn Kiếm & 36 Phố Phường",
      descEn:
        "The ancient commercial hub with vibrant street life, craft guilds, boutique coffee shops, and the tranquil Hoan Kiem Lake at its core.",
      descVi:
        "Trung tâm lịch sử và văn hóa ngàn năm với những con phố nghề sầm uất, hồ Hoàn Kiếm bình yên và nhịp sống đường phố đậm đà phong vị Hà thành.",
      img: "/guide/hanoi/hanoi-hoankiem-turtle-tower-hd.jpg",
      spotsEn: [
        "Hoan Kiem Lake & Ngoc Son Temple",
        "Ta Hien Beer Street & Dong Xuan Market",
        "St. Joseph's Cathedral & Walking Streets",
      ],
      spotsVi: [
        "Hồ Hoàn Kiếm & Đền Ngọc Sơn",
        "Phố Tạ Hiện & Chợ Đồng Xuân",
        "Nhà thờ Lớn & Không gian phố đi bộ",
      ],
    },
    {
      id: "badinh",
      tagEn: "Political & Heritage Zone",
      tagVi: "Khu di tích lịch sử",
      nameEn: "Ba Dinh District",
      nameVi: "Quận Ba Đình & Hoàng Thành",
      descEn:
        "The political center of Vietnam featuring grand tree-lined boulevards, colonial villas, national monuments, and the UNESCO Imperial Citadel.",
      descVi:
        "Quần thể các cơ quan đầu não, công viên xanh mát, lăng Chủ tịch Hồ Chí Minh cùng di sản Hoàng thành Thăng Long nghìn năm.",
      img: "/guide/hanoi/hanoi-langbac-hd.jpg",
      spotsEn: [
        "Ho Chi Minh Mausoleum & Stilt House",
        "One Pillar Pagoda (Chua Mot Cot)",
        "Imperial Citadel of Thang Long",
      ],
      spotsVi: [
        "Lăng Bác, Nhà sàn & Quảng trường Ba Đình",
        "Chùa Một Cột",
        "Hoàng thành Thăng Long",
      ],
    },
    {
      id: "tayho",
      tagEn: "Scenic & Chill",
      tagVi: "Không gian thoáng đãng",
      nameEn: "Tay Ho District (West Lake)",
      nameVi: "Quận Tây Hồ & Hồ Trúc Bạch",
      descEn:
        "Hanoi's largest freshwater lake surrounded by ancient pagodas, upscale dining, hipster cafes, sunset viewpoints, and relaxing cycling loops.",
      descVi:
        "Hồ nước ngọt lớn nhất thủ đô, nơi hội tụ các đền chùa cổ kính, quán cà phê ngắm hoàng hôn cực chill và không gian thư giãn tuyệt vời.",
      img: "/guide/hanoi/hanoi-westlake-trucbach-hd.jpg",
      spotsEn: [
        "Tran Quoc Pagoda (Oldest in Hanoi)",
        "Tay Ho Temple (Phu Tay Ho)",
        "Thanh Nien Boulevard between two lakes",
      ],
      spotsVi: [
        "Chùa Trấn Quốc (Ngôi chùa cổ nhất)",
        "Phủ Tây Hồ",
        "Đường Thanh Niên thơ mộng giữa hai hồ",
      ],
    },
    {
      id: "dongda-hai-ba",
      tagEn: "Culture & Architecture",
      tagVi: "Văn hóa & Kiến trúc Pháp",
      nameEn: "Dong Da & French Quarter",
      nameVi: "Đống Đa & Khu phố Pháp (Hoàn Kiếm Nam)",
      descEn:
        "Home to Vietnam's first national university, famous historic prisons, and stately French neoclassical landmarks including the Opera House.",
      descVi:
        "Nơi lưu giữ trường đại học đầu tiên của Việt Nam, di tích Nhà tù Hỏa Lò và những công trình kiến trúc thời Pháp cổ kính như Nhà hát Lớn.",
      img: "/guide/hanoi/hanoi-vanmieu-hd.jpg",
      spotsEn: [
        "Temple of Literature (Van Mieu)",
        "Hoa Lo Prison Memorial",
        "Hanoi Opera House & Trang Tien Plaza",
      ],
      spotsVi: [
        "Văn Miếu – Quốc Tử Giám",
        "Di tích lịch sử Nhà tù Hỏa Lò",
        "Nhà hát Lớn & Phố Tràng Tiền",
      ],
    },
  ];

  return (
    <div className="vnn-article-page">
      <PublicHeader />

      {/* ─── ẢNH 3: FULL-BLEED HERO BANNER (TO CẢ 1 HÀNG NGANG KHÔNG CÁCH) ─── */}
      <section className="vnn-fullbleed-hero">
        <div className="vnn-fullbleed-hero__inner">
          <div className="vnn-fullbleed-hero__tags">
            <span className="vnn-fullbleed-hero__tag">
              {isVi ? "HÀ NỘI" : "HANOI"}
            </span>
            <span className="vnn-fullbleed-hero__tag">
              {isVi ? "BẢN ĐỒ DU LỊCH VIỆT NAM" : "VIETNAM TOURIST MAP"}
            </span>
          </div>

          <h1 className="vnn-fullbleed-hero__title">
            {isVi ? "Bản đồ du lịch Hà Nội" : "Hanoi Tourist Map"}
          </h1>

          <div className="vnn-fullbleed-hero__meta" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <Logo
              size={20}
              showText={true}
              noLink
              href={null}
              as="span"
              className="vnn-hero-author-logo"
            />
            <span className="vnn-fullbleed-hero__dot">•</span>
            <span>
              {isVi ? "12 Tháng 10, 2026" : "October 12, 2026"}
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Container (White Content Section) ── */}
      <main className="vnn-container">
        {/* Breadcrumb Navigation */}
        <nav className="vnn-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">{isVi ? "Trang chủ" : "Home"}</Link>
          <span className="vnn-breadcrumb-separator">/</span>
          <Link href="/category/destinations">
            {isVi ? "Điểm đến" : "Destinations"}
          </Link>
          <span className="vnn-breadcrumb-separator">/</span>
          <Link href="/province/ha-noi">
            {isVi ? "Hà Nội" : "Hanoi"}
          </Link>
          <span className="vnn-breadcrumb-separator">/</span>
          <span className="vnn-breadcrumb-current">
            {isVi ? "Bản đồ du lịch Hà Nội" : "Hanoi Tourist Map"}
          </span>
        </nav>

        {/* Primary CTA Pill Button (Exact VietnamNomad Style from Ảnh 3) */}
        <div className="vnn-pill-cta-wrap">
          <a
            href="https://tripion.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="vnn-pill-cta-btn"
          >
            <Sparkles size={18} />
            <span>
              {isVi
                ? "Lên kế hoạch du lịch Việt Nam chỉ trong vài giây"
                : "Create your Vietnam trip in seconds"}
            </span>
          </a>
        </div>

        {/* Article Lead Introduction */}
        <div className="vnn-article-lead">
          <p>
            {isVi
              ? "Một tấm bản đồ du lịch Hà Nội chi tiết và trực quan sẽ giúp bạn tiết kiệm đáng kể thời gian di chuyển, tối ưu hóa hành trình và nâng tầm trải nghiệm tại thủ đô ngàn năm văn hiến. Chúng tôi hân hạnh mang đến tấm bản đồ du lịch Hà Nội mới nhất, tổng hợp đầy đủ các danh lam thắng cảnh, di tích lịch sử, địa chỉ quán cà phê, quán bar và khu mua sắm đặc sắc."
              : "A detailed Hanoi map can save you time and enhance your travel experience. We are excited to introduce the Hanoi tourist map, which includes popular destinations as well as useful information about restaurants, cafes, bars, and shopping spots in the city."}
          </p>
        </div>

        {/* Quick Highlights Stats Row */}
        <div className="vnn-highlights-row">
          <div className="vnn-highlight-card">
            <div className="vnn-highlight-icon">
              <Landmark size={22} />
            </div>
            <div>
              <div className="vnn-highlight-num">15+</div>
              <div className="vnn-highlight-label">
                {isVi ? "Điểm tham quan hàng đầu" : "Top Attractions"}
              </div>
            </div>
          </div>

          <div className="vnn-highlight-card">
            <div className="vnn-highlight-icon">
              <Utensils size={22} />
            </div>
            <div>
              <div className="vnn-highlight-num">10+</div>
              <div className="vnn-highlight-label">
                {isVi ? "Món ngon phải thử" : "Must-Try Foods"}
              </div>
            </div>
          </div>

          <div className="vnn-highlight-card">
            <div className="vnn-highlight-icon">
              <Compass size={22} />
            </div>
            <div>
              <div className="vnn-highlight-num">4</div>
              <div className="vnn-highlight-label">
                {isVi ? "Khu vực trọng điểm" : "Historic Districts"}
              </div>
            </div>
          </div>

          <div className="vnn-highlight-card">
            <div className="vnn-highlight-icon">
              <CheckCircle size={22} />
            </div>
            <div>
              <div className="vnn-highlight-num">100%</div>
              <div className="vnn-highlight-label">
                {isVi ? "Miễn phí tải HD / PDF" : "Free High-Res Map"}
              </div>
            </div>
          </div>
        </div>

        {/* ── High-Resolution Map Showcase Card ── */}
        <section className="vnn-map-showcase">
          <div className="vnn-map-showcase-header">
            <div className="vnn-map-showcase-title">
              <MapPin size={18} color="#00c2cb" />
              <span>
                {isVi
                  ? "Bản đồ trung tâm thủ đô Hà Nội (Bản xem trước HD)"
                  : "Hanoi Central Tourist Map (HD Preview)"}
              </span>
            </div>
            <div className="vnn-map-showcase-actions">
              <button
                type="button"
                className="vnn-map-action-btn"
                onClick={() => {
                  setModalZoom(1);
                  setIsMapModalOpen(true);
                }}
              >
                <Maximize2 size={14} />
                <span>{isVi ? "Phóng to" : "Expand"}</span>
              </button>
              <a
                href="/guide/hanoi/hanoi-tourist-map-2026.jpg"
                download="Hanoi-Tourist-Map-2026.jpg"
                className="vnn-map-action-btn vnn-map-action-btn--primary"
              >
                <Download size={14} />
                <span>{isVi ? "Tải ảnh" : "Download"}</span>
              </a>
            </div>
          </div>

          <div
            className="vnn-map-img-container"
            onClick={() => {
              setModalZoom(1);
              setIsMapModalOpen(true);
            }}
            title={
              isVi
                ? "Nhấp để xem bản đồ độ phân giải cao"
                : "Click to view full resolution map"
            }
          >
            <img
              src="/guide/hanoi/hanoi-tourist-map-2026.jpg"
              alt="Hanoi Tourist Map Full"
              className="vnn-map-img"
            />
            <div className="vnn-map-zoom-badge">
              <ZoomIn size={16} />
              <span>
                {isVi
                  ? "Nhấp để phóng to toàn màn hình"
                  : "Click to zoom full screen"}
              </span>
            </div>
          </div>
        </section>

        {/* ── Download Card (Tripion & PDF) ── */}
        <section className="vnn-download-card">
          <h2 className="vnn-hanoi-teal-heading">
            {isVi
              ? "Tải xuống bản đồ du lịch Hà Nội (HD)"
              : "Download the Hanoi tourist map"}
          </h2>
          <p className="vnn-download-desc">
            {isVi
              ? "Tải miễn phí bản đồ du lịch Hà Nội chất lượng cao (PDF & ảnh HD) hoặc đồng bộ cùng ứng dụng thông minh để tạo lộ trình cá nhân hóa."
              : "Get a free, high-quality Hanoi travel map (PDF & HD image) or build your custom city itinerary."}
          </p>
          <p className="vnn-download-desc">
            {isVi
              ? "Với trợ lý du lịch AI, bạn có thể dễ dàng thiết kế lộ trình theo sở thích: chỉ cần nhập prompt như 'Bản đồ Hà Nội' hoặc '3 ngày tại Hà Nội', hệ thống sẽ gợi ý điểm tham quan, ẩm thực và hỗ trợ tải cẩm nang sử dụng ngoại tuyến."
              : "With Tripion, you can create a personalized travel map and itinerary for your trip. Simply open Tripion.ai, enter a prompt like “Hanoi map” or “3 days in Hanoi,” add the places you’d like to visit, and download your custom city guide as a PDF."}
          </p>

          <ul className="vnn-download-checklist">
            <li>
              <span className="vnn-checklist-dot" />
              <span>
                {isVi
                  ? "Khám phá các điểm đến, quán cà phê và trải nghiệm địa phương độc đáo."
                  : "Discover top attractions, cafés, and local experiences."}
              </span>
            </li>
            <li>
              <span className="vnn-checklist-dot" />
              <span>
                {isVi
                  ? "Tự tạo lịch trình khám phá Hà Nội theo số ngày của bạn."
                  : "Build your own Hanoi itinerary."}
              </span>
            </li>
            <li>
              <span className="vnn-checklist-dot" />
              <span>
                {isVi
                  ? "Lưu danh sách điểm yêu thích vào chuyến đi cá nhân."
                  : "Save places to your journey."}
              </span>
            </li>
            <li>
              <span className="vnn-checklist-dot" />
              <span>
                {isVi
                  ? "Tải bản đồ du lịch và cẩm nang chi tiết dưới dạng PDF ngoại tuyến."
                  : "Download a personalized travel map and city guide as a PDF."}
              </span>
            </li>
          </ul>

          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <a
              href="/guide/hanoi/hanoi-tourist-map-2026.jpg"
              download="Hanoi-Tourist-Map-2026.jpg"
              className="vnn-wire-btn"
            >
              <Download size={18} />
              <span>{isVi ? "Tải bản đồ HD" : "Get the Map"}</span>
            </a>
          </div>
        </section>

        {/* ── Top 15 Hanoi Attractions ── */}
        <section id="hanoi-attractions">
          <h2 className="vnn-hanoi-teal-heading">
            {isVi
              ? "15 điểm tham quan hàng đầu tại Hà Nội"
              : "Top Hanoi attractions"}
          </h2>

          <p style={{ color: "#475569", marginBottom: "16px" }}>
            {isVi
              ? "Dưới đây là 15 điểm đến tiêu biểu nhất được định vị rõ nét trên bản đồ du lịch Hà Nội, phân bổ hài hòa giữa lịch sử hào hùng và nét văn hóa ngàn năm:"
              : "Here are Hanoi's 15 most popular destinations clearly pinpointed on the tourist map:"}
          </p>

          <ol className="vnn-list-columns">
            {TOP_ATTRACTIONS.map((item) => (
              <li key={item.id} className="vnn-list-item">
                <span className="vnn-list-badge">{item.id}</span>
                <span>{isVi ? item.titleVi : item.titleEn}</span>
              </li>
            ))}
          </ol>

          <div>
            <Link href="/province/ha-noi" className="vnn-readmore-link">
              <span>
                {isVi
                  ? "Tìm hiểu chi tiết các điểm tham quan tại Hà Nội >"
                  : "Learn more about Hanoi attractions >"}
              </span>
            </Link>
          </div>
        </section>

        {/* ── 4 District Breakdown Cards ── */}
        <section style={{ marginTop: "48px" }}>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "8px",
            }}
          >
            {isVi
              ? "Khám phá Hà Nội qua 4 khu vực trọng điểm trên bản đồ"
              : "Explore Hanoi Across 4 Key Districts on the Map"}
          </h3>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            {isVi
              ? "Mỗi quận của Hà Nội đều mang một sắc thái và dấu ấn văn hóa rất riêng, từ phố cổ sôi động đến mặt hồ Tây lộng gió:"
              : "Each neighborhood has its own distinct personality, from the bustling alleyways of the Old Quarter to the serene breezes of West Lake:"}
          </p>

          <div className="vnn-district-grid">
            {DISTRICTS.map((dist) => (
              <div key={dist.id} className="vnn-district-card">
                <div className="vnn-district-thumb-wrap">
                  <img
                    src={dist.img}
                    alt={dist.nameEn}
                    className="vnn-district-thumb"
                  />
                  <span className="vnn-district-zone-tag">
                    {isVi ? dist.tagVi : dist.tagEn}
                  </span>
                </div>
                <div className="vnn-district-content">
                  <h4 className="vnn-district-title">
                    {isVi ? dist.nameVi : dist.nameEn}
                  </h4>
                  <p className="vnn-district-desc">
                    {isVi ? dist.descVi : dist.descEn}
                  </p>
                  <ul className="vnn-district-spots">
                    {(isVi ? dist.spotsVi : dist.spotsEn).map(
                      (spot, idx) => (
                        <li key={idx} className="vnn-district-spot-item">
                          <CheckCircle size={14} />
                          <span>{spot}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="vnn-section-divider" />

        {/* ── Top 10 Hanoi Foods ── */}
        <section id="hanoi-foods">
          <h2 className="vnn-hanoi-teal-heading">
            {isVi
              ? "10 món ngon trứ danh nhất định phải thử tại Hà Nội"
              : "Top Hanoi foods"}
          </h2>

          <p style={{ color: "#475569", marginBottom: "16px" }}>
            {isVi
              ? "Ẩm thực Hà Nội tinh tế, thanh tao và mang đậm bản sắc ngàn năm. Bản đồ du lịch đã tích hợp những khu ẩm thực trứ danh như Tạ Hiện, Đồng Xuân, Ngũ Xã và Hàng Buồm:"
              : "Hanoi's culinary tradition is subtle, sophisticated, and deeply rooted in centuries of culture. The map pinpoints famous foodie clusters across the city:"}
          </p>

          <ol className="vnn-list-columns">
            {TOP_FOODS.map((food) => (
              <li key={food.id} className="vnn-list-item">
                <span className="vnn-list-badge">{food.id}</span>
                <span>{isVi ? food.titleVi : food.titleEn}</span>
              </li>
            ))}
          </ol>

          {/* Visual Food Showcase Grid */}
          <div className="vnn-food-grid">
            {TOP_FOODS.slice(0, 6).map((food) => (
              <div key={food.id} className="vnn-food-card">
                <div className="vnn-food-thumb-wrap">
                  <img
                    src={food.img}
                    alt={food.titleEn}
                    className="vnn-food-thumb"
                  />
                </div>
                <div className="vnn-food-info">
                  <div className="vnn-food-name">
                    {isVi ? food.titleVi : food.titleEn}
                  </div>
                  <div className="vnn-food-sub">
                    {isVi ? food.subVi : food.subEn}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link
              href="/guide/8-must-try-foods-in-hanoi"
              className="vnn-readmore-link"
            >
              <span>
                {isVi
                  ? "Xem cẩm nang 8 món ăn phải thử tại Hà Nội >"
                  : "Read our full guide to 8 must-try foods in Hanoi >"}
              </span>
            </Link>
            <Link
              href="/guide/pho-the-complete-guide"
              className="vnn-readmore-link"
            >
              <span>
                {isVi
                  ? "Cẩm nang chuyên sâu về Phở truyền thống >"
                  : "The Complete Guide to Vietnamese Pho >"}
              </span>
            </Link>
          </div>
        </section>

        {/* ── Transportation Guide According to the Map ── */}
        <section style={{ marginTop: "48px" }}>
          <h2 className="vnn-hanoi-teal-heading">
            {isVi
              ? "Kinh nghiệm di chuyển theo bản đồ du lịch Hà Nội"
              : "How to navigate Hanoi using the map"}
          </h2>

          <div className="vnn-transport-grid">
            <div className="vnn-transport-card">
              <div className="vnn-transport-icon-wrap">
                <Navigation size={22} />
              </div>
              <div>
                <h4 className="vnn-transport-title">
                  {isVi
                    ? "Đi bộ (Walking) quanh Phố Cổ & Hồ Gươm"
                    : "Walking around Old Quarter & Hoan Kiem"}
                </h4>
                <p className="vnn-transport-desc">
                  {isVi
                    ? "Khu phố cổ và hồ Gươm có bán kính nhỏ gọn, rất lý tưởng để tản bộ. Vào dịp cuối tuần, phố đi bộ quanh hồ Hoàn Kiếm cấm xe cơ giới, mang lại không gian đi dạo tuyệt vời."
                    : "The Old Quarter is compact and best explored on foot. On weekends, the walking streets around Hoan Kiem Lake are pedestrian-only, ideal for leisurely strolls."}
                </p>
              </div>
            </div>

            <div className="vnn-transport-card">
              <div className="vnn-transport-icon-wrap">
                <Compass size={22} />
              </div>
              <div>
                <h4 className="vnn-transport-title">
                  {isVi
                    ? "Grab / Taxi cho cự ly 2-5km"
                    : "Grab / Taxi for 2-5km Trips"}
                </h4>
                <p className="vnn-transport-desc">
                  {isVi
                    ? "Để di chuyển giữa Phố Cổ sang Ba Đình (Lăng Bác, Văn Miếu) hoặc lên Tây Hồ, đặt GrabBike hoặc GrabCar là cách thuận tiện, nhanh chóng và minh bạch giá cả."
                    : "To travel between Old Quarter, Ba Dinh, and West Lake, GrabBike or GrabCar is the most transparent, cost-effective, and fastest choice."}
                </p>
              </div>
            </div>

            <div className="vnn-transport-card">
              <div className="vnn-transport-icon-wrap">
                <Landmark size={22} />
              </div>
              <div>
                <h4 className="vnn-transport-title">
                  {isVi
                    ? "Xích lô du lịch (Cyclo Ride)"
                    : "Traditional Cyclo Tour"}
                </h4>
                <p className="vnn-transport-desc">
                  {isVi
                    ? "Trải nghiệm văn hóa đặc sắc với chuyến xích lô dạo quanh 36 phố phường, ngắm nhìn nhịp sống chậm rãi và những góc nhà cổ rêu phong."
                    : "A classic Hanoi heritage experience. Take a 1-hour cyclo tour through ancient guilds and French colonial architecture at a relaxed pace."}
                </p>
              </div>
            </div>

            <div className="vnn-transport-card">
              <div className="vnn-transport-icon-wrap">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="vnn-transport-title">
                  {isVi
                    ? "Xe buýt 2 tầng (Hop-On Hop-Off)"
                    : "Hanoi City Tour Hop-On Hop-Off Bus"}
                </h4>
                <p className="vnn-transport-desc">
                  {isVi
                    ? "Tuyến xe buýt 2 tầng mui trần đi qua trọn vẹn 13 điểm tham quan nổi tiếng nhất theo đúng lộ trình trên bản đồ, khởi hành từ Nhà hát Lớn."
                    : "The double-decker open-top bus links 13 landmark attractions matching our tourist map route, starting conveniently from the Opera House."}
                </p>
              </div>
            </div>
          </div>

          <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.hopOnHopOffHanoi} lang={lang} />
          <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.waterPuppetTicket} lang={lang} />
          <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.noiBaiTransfer} lang={lang} />
          <AffiliateDealBox deal={HANOI_AFFILIATE_DEALS.oldQuarterHotels} lang={lang} />
        </section>

        {/* ── Solid Editorial Separator ── */}
        <div className="vnn-editorial-separator">
          <span className="vnn-editorial-separator-line" />
        </div>

        {/* ── Related Articles Section (Matching User's Standard) ── */}
        <section className="vnn-related-section">
          <div className="vnn-related-header">
            <h3 className="vnn-related-title">
              {isVi ? "Bài viết liên quan" : "Related Articles"}
            </h3>
          </div>

          <div className="vnn-related-grid">
            {/* Card 1: 8 Must-Try Foods in Hanoi */}
            <Link
              href="/guide/8-must-try-foods-in-hanoi"
              className="vnn-related-card"
            >
              <div className="vnn-related-card-thumb-wrap">
                <img
                  src="/guide/megamenu/eat-1-hanoi.jpg"
                  alt="8 must-try foods in Hanoi"
                  className="vnn-related-card-thumb"
                />
                <span className="vnn-related-card-badge">#Trending</span>
              </div>
              <div className="vnn-related-card-meta">
                <h4 className="vnn-related-card-title">
                  {isVi
                    ? "8 món ăn phải thử tại Hà Nội"
                    : "8 must-try foods in Hanoi"}
                </h4>
                <span className="vnn-related-card-date">
                  {isVi ? "12 Tháng 10, 2026" : "October 12, 2026"}
                </span>
              </div>
            </Link>

            {/* Card 2: Pho The Complete Guide */}
            <Link
              href="/guide/pho-the-complete-guide"
              className="vnn-related-card"
            >
              <div className="vnn-related-card-thumb-wrap">
                <img
                  src="/guide/hanoi/hanoi-pho-hd.jpg"
                  alt="Pho – The Complete Guide"
                  className="vnn-related-card-thumb"
                />
                <span className="vnn-related-card-badge">#Trending</span>
              </div>
              <div className="vnn-related-card-meta">
                <h4 className="vnn-related-card-title">
                  {isVi
                    ? "Phở – Quốc hồn quốc túy ẩm thực Việt"
                    : "Pho – The Complete Guide to Vietnam's Iconic Dish"}
                </h4>
                <span className="vnn-related-card-date">
                  {isVi ? "13 Tháng 10, 2026" : "October 13, 2026"}
                </span>
              </div>
            </Link>

            {/* Card 3: The Complete Guide to Vietnam */}
            <Link
              href="/guide/the-complete-guide-to-vietnam"
              className="vnn-related-card"
            >
              <div className="vnn-related-card-thumb-wrap">
                <img
                  src="/guide/megamenu/inspired-3.jpg"
                  alt="The Complete Guide to Vietnam"
                  className="vnn-related-card-thumb"
                />
                <span className="vnn-related-card-badge">#Trending</span>
              </div>
              <div className="vnn-related-card-meta">
                <h4 className="vnn-related-card-title">
                  {isVi
                    ? "Cẩm nang du lịch toàn diện Việt Nam"
                    : "The Complete Guide to Vietnam"}
                </h4>
                <span className="vnn-related-card-date">
                  {isVi ? "11 Tháng 10, 2026" : "October 14, 2026"}
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang={isVi ? "vi" : "en"} />

      {/* ── Fullscreen Interactive Lightbox Modal for Map ── */}
      {isMapModalOpen && (
        <div
          className="vnn-lightbox-backdrop"
          onClick={() => setIsMapModalOpen(false)}
        >
          <div
            className="vnn-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vnn-lightbox-bar">
              <span className="vnn-lightbox-title">
                {isVi
                  ? "Bản đồ du lịch Hà Nội (Độ phân giải cao)"
                  : "Hanoi Tourist Map (High-Resolution)"}
              </span>
              <div className="vnn-lightbox-controls">
                <button
                  type="button"
                  className="vnn-lightbox-btn"
                  onClick={() =>
                    setModalZoom((prev) => Math.min(prev + 0.25, 2.5))
                  }
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-lightbox-btn"
                  onClick={() =>
                    setModalZoom((prev) => Math.max(prev - 0.25, 0.75))
                  }
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  className="vnn-lightbox-btn"
                  onClick={() => setModalZoom(1)}
                  title="Reset Zoom"
                >
                  100%
                </button>
                <a
                  href="/guide/hanoi/hanoi-tourist-map-2026.jpg"
                  download="Hanoi-Tourist-Map-2026.jpg"
                  className="vnn-lightbox-btn"
                  style={{ background: "#00c2cb", borderColor: "#00c2cb" }}
                >
                  <Download size={14} />
                  <span>{isVi ? "Tải ảnh" : "Download"}</span>
                </a>
                <button
                  type="button"
                  className="vnn-lightbox-btn"
                  onClick={() => setIsMapModalOpen(false)}
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="vnn-lightbox-content">
              <img
                src="/guide/hanoi/hanoi-tourist-map-2026.jpg"
                alt="Hanoi Tourist Map Full HD"
                className="vnn-lightbox-img"
                style={{ transform: `scale(${modalZoom})` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Floating AI Chatbot for Hanoi with Teal Theme ── */}
      <ProvinceChatbot
        province={{
          name: isVi ? "Hà Nội" : "Hanoi",
          slug: "ha-noi",
        }}
      />
    </div>
  );
}
