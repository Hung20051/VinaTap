"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import PublicFooter from "@/components/layout/PublicFooter";
import HeaderSearch from "@/components/ui/HeaderSearch";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import ProvinceChatbot from "@/components/ui/ProvinceChatbot";
import { getLang } from "@/lib/prefs";
import {
  Compass,
  Calendar,
  Clock,
  Bookmark,
  Share2,
  ChevronRight,
  MapPin,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Building,
  Hotel,
  ShieldCheck,
  Plane,
  Bus,
  Car,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Eye,
  Utensils,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/guide-editorial.css";

// ─── AFFILIATE DEALS DATA ───
const AFFILIATE_DATA = {
  // 1. Xe đưa đón sân bay (Klook)
  airportTransfer: {
    url: "https://shorten.asia/86cswfB6",
    partner: "Klook",
    partnerType: "klook",
    badge: "Tiện Ích Sân Bay",
    badgeEn: "Airport Transfer",
    title: "Xe Đưa Đón Sân Bay Tân Sơn Nhất Về Khách Sạn Trung Tâm TP.HCM",
    titleEn: "Tan Son Nhat Airport (SGN) Private Transfer to HCMC Hotel",
    note: "Tài xế đón tận sảnh với bảng tên • Xe máy lạnh 4 - 16 chỗ • Giá cố định không lo chém giá",
    noteEn: "Meet & greet at arrival hall • AC private vehicle (4-16 seats) • Fixed fare, no surge pricing",
    ctaText: "Đặt xe đón sân bay",
    ctaTextEn: "Book Airport Transfer",
  },
  // 2. Xe buýt 2 tầng (Klook)
  hopOnHopOff: {
    url: "https://shorten.asia/HmxpWGsX",
    partner: "Klook",
    partnerType: "klook",
    badge: "Trải Nghiệm Đô Thị",
    badgeEn: "City Sightseeing",
    title: "Vé Xe Buýt 2 Tầng Saigon Hop-on Hop-off Ngắm Toàn Cảnh Thành Phố",
    titleEn: "Saigon Hop-On Hop-Off Double-Decker Sightseeing Bus Tour",
    note: "Dạo quanh các khách sạn lớn & danh lam thắng cảnh Quận 1 • Tự do lên xuống tại các trạm",
    noteEn: "Passes luxury hotels & iconic landmarks in District 1 • Unlimited hop-on hop-off stops",
    ctaText: "Đặt vé xe buýt 2 tầng",
    ctaTextEn: "Book Hop-On Hop-Off Bus",
  },
  // 3. Khách sạn Q1 Cao cấp (Traveloka)
  d1Luxury: {
    url: "https://shorten.asia/qjUErQNy",
    partner: "Traveloka",
    partnerType: "traveloka",
    badge: "5 Sao & Hạng Sang",
    badgeEn: "5-Star & Luxury",
    title: "Top Khách Sạn 5 Sao & Căn Hộ Dịch Vụ Cao Cấp Trung Tâm Quận 1",
    titleEn: "Top 5-Star Luxury Hotels & Serviced Suites in Central District 1",
    note: "Tập trung đường Đồng Khởi, Lê Lợi & ven sông • View panorama đỉnh cao, hồ bơi vô cực & spa cao cấp",
    noteEn: "Located on Dong Khoi, Le Loi & Riverfront • Panoramic skyline views, rooftop pools & luxury spas",
    ctaText: "Xem phòng & Giá ưu đãi",
    ctaTextEn: "Check Rooms & Rates",
  },
  // 4. Khách sạn Q1 Tầm trung (Traveloka)
  d1Midrange: {
    url: "https://shorten.asia/eQv8WuzN",
    partner: "Traveloka",
    partnerType: "traveloka",
    badge: "Boutique Tinh Tế",
    badgeEn: "Boutique & Mid-Range",
    title: "Khách Sạn Boutique & Tầm Trung Phong Cách Tinh Tế Tại Quận 1",
    titleEn: "Stylish Boutique & Mid-Range Hotels in District 1",
    note: "Thiết kế Indochine hoài cổ hoặc hiện đại trẻ trung • Gần chợ Bến Thành, phố đi bộ • Giá tối ưu",
    noteEn: "Indochine heritage or chic modern design • Steps from Ben Thanh Market & Walking Street",
    ctaText: "Xem phòng Boutique Quận 1",
    ctaTextEn: "View District 1 Hotels",
  },
  // 5. Hostel & Tiết kiệm Q1 (Traveloka)
  d1Budget: {
    url: "https://shorten.asia/H2W6WKCF",
    partner: "Traveloka",
    partnerType: "traveloka",
    badge: "Tiết Kiệm & Dân Phượt",
    badgeEn: "Budget & Backpackers",
    title: "Hostel & Khách Sạn Tiết Kiệm Gần Phố Tây Bùi Viện & Trung Tâm",
    titleEn: "Budget Hostels & Cozy Guesthouses near Bui Vien & Center",
    note: "Không gian sạch sẽ, thân thiện, kết nối bạn bè quốc tế • Tọa lạc tại các con hẻm sôi động của Sài Gòn",
    noteEn: "Clean, social and traveler-friendly • Nestled in energetic Saigon alleys & traveler hubs",
    ctaText: "Đặt phòng tiết kiệm",
    ctaTextEn: "Book Budget Stays",
  },
  // 6. Khách sạn Q3 (Traveloka)
  d3Hotels: {
    url: "https://shorten.asia/jNnJ9T11",
    partner: "Traveloka",
    partnerType: "traveloka",
    badge: "Yên Tĩnh & Cổ Kính",
    badgeEn: "Quiet & Heritage",
    title: "Khách Sạn Khu Vực Quận 3 – Rợp Bóng Cây Xanh & Biệt Thự Cổ",
    titleEn: "Where to Stay in District 3: Tree-Lined Avenues & Colonial Charms",
    note: "Không gian yên tĩnh hơn Quận 1 nhưng chỉ mất 5 phút di chuyển • Nhiều quán cà phê nghệ thuật",
    noteEn: "Quieter peaceful vibe just 5 mins from D1 • Surrounded by chic cafes & French-colonial mansions",
    ctaText: "Xem khách sạn Quận 3",
    ctaTextEn: "Browse District 3 Hotels",
  },
  // 7. Khách sạn Q5 Chợ Lớn (Traveloka)
  d5Hotels: {
    url: "https://shorten.asia/3myBKy6T",
    partner: "Traveloka",
    partnerType: "traveloka",
    badge: "Văn Hóa Chợ Lớn",
    badgeEn: "Chinatown Culture",
    title: "Khách Sạn Khu Vực Quận 5 (Chợ Lớn) – Trải Nghiệm Ẩm Thực Người Hoa",
    titleEn: "Hotels in District 5 (Chinatown): Immersive Heritage & Food Haven",
    note: "Gần các hội quán cổ kính, chợ Bình Tây và thiên đường món Hoa • Lựa chọn độc đáo, giá tốt",
    noteEn: "Near historic Chinese assembly halls, Binh Tay Market & culinary heaven • Authentic & great value",
    ctaText: "Xem khách sạn Quận 5",
    ctaTextEn: "Browse District 5 Hotels",
  },
  // 8. Khách sạn Sân bay Tân Sơn Nhất (Traveloka)
  airportHotels: {
    url: "https://shorten.asia/XHsdQQ54",
    partner: "Traveloka",
    partnerType: "traveloka",
    badge: "Gần Sân Bay",
    badgeEn: "Near Airport",
    title: "Khách Sạn Tiện Nghi Gần Sân Bay Tân Sơn Nhất (Quận Tân Bình)",
    titleEn: "Hotels Near Tan Son Nhat International Airport (Tan Binh District)",
    note: "Chỉ cách sân bay 5-10 phút • Hoàn hảo cho chuyến bay sáng sớm, hạ cánh đêm muộn hoặc quá cảnh",
    noteEn: "Only 5-10 mins from terminals • Ideal for early departures, late arrivals or layovers",
    ctaText: "Xem khách sạn gần sân bay",
    ctaTextEn: "View Airport Hotels",
  },
  // 9. Tour Địa đạo Củ Chi (Klook)
  cuChiTour: {
    url: "https://shorten.asia/nAnbAZdK",
    partner: "Klook",
    partnerType: "klook",
    badge: "Tour Nổi Tiếng Nhất",
    badgeEn: "Top Rated Tour",
    title: "Tour Khám Phá Địa Đạo Củ Chi (Đón Trả Tận Khách Sạn Trung Tâm)",
    titleEn: "Cu Chi Tunnels Guided Tour (With Hotel Pick-up in Central Saigon)",
    note: "Xe đưa đón tận sảnh khách sạn • Khám phá mạng lưới ngầm huyền thoại • Hướng dẫn viên song ngữ",
    noteEn: "Hotel lobby pick-up & drop-off • Explore legendary underground tunnels • Bilingual guide",
    ctaText: "Đặt tour Củ Chi giá tốt",
    ctaTextEn: "Book Cu Chi Tunnels Tour",
  },
  // 10. Tour Mekong Delta (Klook)
  mekongTour: {
    url: "https://shorten.asia/44DEAXha",
    partner: "Klook",
    partnerType: "klook",
    badge: "Miền Tây Sông Nước",
    badgeEn: "Mekong Delta Day Trip",
    title: "Tour 1 Ngày Khám Phá Đồng Bằng Sông Cửu Long (Mỹ Tho – Bến Tre)",
    titleEn: "Mekong Delta Full-Day Tour (My Tho & Ben Tre with Hotel Transfer)",
    note: "Đi xuồng ba lá len lỏi rạch dừa nước, thăm vườn trái cây & nghe đờn ca tài tử • Đón trả tại khách sạn Q1",
    noteEn: "Sampan boat ride through coconut canals, tropical fruit orchards & folk music • Hotel pick-up in D1",
    ctaText: "Đặt tour Miền Tây",
    ctaTextEn: "Book Mekong Delta Tour",
  },
};

// Component thẻ Affiliate Deal Box
function DealBox({ deal, lang }) {
  if (!deal) return null;
  const isKlook = deal.partnerType === "klook";
  const partnerBorderColor = isKlook ? "#ff5722" : "#0194f3";

  return (
    <div
      className="guide-affiliate-deal"
      style={{
        borderLeftColor: partnerBorderColor,
      }}
    >
      <div className="guide-affiliate-deal__content">
        <div className="guide-affiliate-deal__top">
          <div
            className="guide-affiliate-deal__badge"
            style={{
              backgroundColor: partnerBorderColor,
            }}
          >
            <Sparkles size={12} />
            <span>{lang === "vi" ? deal.badge : deal.badgeEn}</span>
          </div>
          <span className="guide-affiliate-deal__partner">
            {lang === "vi" ? "Đối tác chính thức" : "Official Partner"}:{" "}
            <strong style={{ color: partnerBorderColor }}>
              {deal.partner}
            </strong>
          </span>
        </div>
        <h5 className="guide-affiliate-deal__title">
          {lang === "vi" ? deal.title : deal.titleEn}
        </h5>
        <p className="guide-affiliate-deal__note">
          {lang === "vi" ? deal.note : deal.noteEn}
        </p>
      </div>
      <div className="guide-affiliate-deal__action">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="guide-affiliate-deal__cta"
          style={{
            background: isKlook
              ? "linear-gradient(135deg, #ff5722 0%, #ff7043 100%)"
              : "linear-gradient(135deg, #0194f3 0%, #00b4d8 100%)",
            boxShadow: isKlook
              ? "0 4px 14px rgba(255, 87, 34, 0.32)"
              : "0 4px 14px rgba(1, 148, 243, 0.32)",
          }}
        >
          <span>{lang === "vi" ? deal.ctaText : deal.ctaTextEn}</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

export default function WhereToStayInHCMCPage() {
  const [lang, setLang] = useState("vi");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    setLang(getLang());
    const handleLangChange = (e) => {
      const nextLang =
        typeof e.detail === "string"
          ? e.detail
          : e.detail?.lang || getLang();
      setLang(nextLang);
    };
    window.addEventListener("vinatap:lang-updated", handleLangChange);
    window.addEventListener("storage", handleLangChange);
    return () => {
      window.removeEventListener("vinatap:lang-updated", handleLangChange);
      window.removeEventListener("storage", handleLangChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      !isBookmarked
        ? lang === "vi"
          ? "Đã lưu cẩm nang lưu trú vào Sổ tay VinaTap! ✨"
          : "Saved to your VinaTap Travel Notebook! ✨"
        : lang === "vi"
        ? "Đã bỏ lưu bài viết"
        : "Removed from saved articles"
    );
  };

  const copyPageLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        lang === "vi"
          ? "Đã sao chép liên kết cẩm nang! 📋"
          : "Article link copied to clipboard! 📋"
      );
    }
  };

  return (
    <div className="guide-page-wrapper">
      {/* ─── THANH TIẾN TRÌNH ĐỌC ─── */}
      <div
        className="guide-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ─── TOP NAVBAR ─── */}
      <nav className="guide-nav" aria-label="Điều hướng cẩm nang">
        <div className="guide-nav__inner">
          <div className="guide-nav__left">
            <Logo size={28} />
            <div className="guide-breadcrumb">
              <Link href="/">
                {lang === "vi" ? "Trang chủ" : "Home"}
              </Link>
              <ChevronRight size={13} />
              <Link href="/province/ho-chi-minh">
                {lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}
              </Link>
              <ChevronRight size={13} />
              <span className="guide-breadcrumb__curr">
                {lang === "vi" ? "Khu Vực Lưu Trú" : "Where to Stay"}
              </span>
            </div>
          </div>

          <div className="guide-nav__right">
            <HeaderSearch />
            <LanguageSwitch />
          </div>
        </div>
      </nav>

      {/* ─── TOAST NOTIFICATION ─── */}
      {toastVisible && (
        <div className="guide-toast" role="alert">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── MAIN CONTAINER ─── */}
      <main className="guide-container">
        {/* HEADER BÀI VIẾT CHUẨN GUIDE-EDITORIAL */}
        <header className="guide-header">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <div className="guide-badge-pill" style={{ marginBottom: 0 }}>
              <Hotel size={14} />
              <span>{lang === "vi" ? "LƯU TRÚ SÀI GÒN" : "ACCOMMODATION GUIDE"}</span>
            </div>
            <div
              className="guide-badge-pill"
              style={{
                background: "rgba(0, 194, 203, 0.1)",
                color: "#009aa2",
                marginBottom: 0,
              }}
            >
              <MapPin size={14} />
              <span>{lang === "vi" ? "TP. HỒ CHÍ MINH" : "HO CHI MINH CITY"}</span>
            </div>
          </div>

          <h1 className="guide-title">
            {lang === "vi"
              ? "Khách Sạn & Khu Vực Nên Ở Tại TP. Hồ Chí Minh: Cẩm Nang Cho Người Đến Lần Đầu"
              : "Where to Stay in Ho Chi Minh City: A Guide for First-Time Visitors"}
          </h1>

          <p className="guide-subtitle">
            {lang === "vi"
              ? "Tìm kiếm nơi lưu trú hoàn hảo tại TP.HCM. Khám phá các khách sạn sang trọng, boutique ấn tượng, hostel tiện nghi và phân tích ưu nhược điểm từng quận để có chuyến đi trọn vẹn nhất."
              : "Find your perfect stay in Ho Chi Minh City. Explore hotels, boutique stays, hostels, and neighborhood insights for first-time visitors to Vietnam’s southern economic and cultural hub."}
          </p>

          <div className="guide-meta-bar">
            <div className="guide-author-box">
              <div className="guide-author-avatar">VT</div>
              <div>
                <div className="guide-author-name">
                  <span>Ban Biên Tập VinaTap</span>
                  <Sparkles size={14} className="guide-verified-badge" />
                </div>
                <div className="guide-author-role">
                  {lang === "vi"
                    ? "Chuyên trang Cẩm nang Du lịch Bản địa"
                    : "VinaTap Signature Travel Editorial"}
                </div>
              </div>
            </div>

            <div className="guide-meta-stats">
              <span className="guide-meta-item">
                <Calendar size={14} />
                <span>{lang === "vi" ? "12 Tháng 10, 2026" : "October 12, 2026"}</span>
              </span>
              <span className="guide-meta-item">
                <Clock size={14} />
                <span>{lang === "vi" ? "6 phút đọc" : "6 min read"}</span>
              </span>
              <span className="guide-meta-item">
                <Eye size={14} />
                <span>94.820 {lang === "vi" ? "lượt xem" : "views"}</span>
              </span>
            </div>

            <div className="guide-header-actions">
              <button
                type="button"
                className={`guide-action-btn ${isBookmarked ? "active" : ""}`}
                onClick={toggleBookmark}
                title={lang === "vi" ? "Lưu sổ tay" : "Bookmark"}
              >
                <Bookmark size={14} />
                <span>
                  {lang === "vi"
                    ? isBookmarked
                      ? "Đã lưu"
                      : "Lưu sổ tay"
                    : isBookmarked
                    ? "Saved"
                    : "Save"}
                </span>
              </button>
              <button
                type="button"
                className="guide-action-btn"
                onClick={copyPageLink}
                title={lang === "vi" ? "Chia sẻ" : "Share"}
              >
                <Share2 size={14} />
                <span>{lang === "vi" ? "Chia sẻ" : "Share"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ─── HERO BANNER ẢNH BÌA CINEMATIC ─── */}
        <section className="guide-hero-banner">
          <div className="guide-hero-img-wrap">
            <img
              src="/guide/hcmc/where-to-stay-in-hcmc-hd.jpg"
              alt="Where to Stay in Ho Chi Minh City"
              className="guide-hero-img"
              loading="eager"
            />
            <div className="guide-hero-overlay">
              <div className="guide-hero-chips">
                <span className="guide-hero-chip">
                  <Hotel size={13} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "middle" }} />
                  {lang === "vi" ? "Cẩm Nang Khách Sạn" : "Hotel Guide"}
                </span>
                <span className="guide-hero-chip">
                  {lang === "vi" ? "6 Khu Vực Trọng Điểm" : "6 Key Neighborhoods"}
                </span>
                <span className="guide-hero-chip">
                  {lang === "vi" ? "Đối Tác Klook & Traveloka" : "Official Travel Deals"}
                </span>
              </div>
              <p className="guide-hero-caption">
                {lang === "vi"
                  ? "Thành phố Hồ Chí Minh sở hữu mạng lưới lưu trú phong phú từ khách sạn 5 sao ven sông đến homestay đậm chất bản địa."
                  : "Ho Chi Minh City offers diverse accommodation choices ranging from riverside luxury hotels to atmospheric boutique stays."}
              </p>
            </div>
          </div>
        </section>

        {/* ─── LEAD STORY BOX ─── */}
        <div className="guide-lead-box" style={{ marginBottom: "2.5rem" }}>
          <p style={{ margin: 0, fontSize: "1.12rem", lineHeight: "1.75", color: "var(--guide-text-main)" }}>
            {lang === "vi"
              ? "Thành phố Hồ Chí Minh, trung tâm kinh tế và văn hóa sôi động bậc nhất phương Nam, không đơn thuần chỉ là điểm trung chuyển đến Đồng bằng Sông Cửu Long hay các bãi biển nhiệt đới — mà chính nó là một điểm đến đầy mê hoặc. Cho dù bạn tìm đến thành phố này vì cuộc sống về đêm náo nhiệt, những di tích lịch sử vang bóng hay thiên đường ẩm thực đường phố trứ danh, việc chọn đúng địa điểm dừng chân sẽ giúp chuyến hành trình trở nên thuận tiện và đáng nhớ hơn bao giờ hết."
              : "Ho Chi Minh City, Vietnam’s bustling southern hub, is not just a gateway to the Mekong Delta and other southern destinations—it’s a captivating destination in itself. Whether you’re visiting for the city’s vibrant nightlife, historical landmarks, or sensational street food, choosing the right place to stay can make your trip much more enjoyable and effortless."}
          </p>
        </div>

        {/* NỘI DUNG CHÍNH (EDITORIAL BODY) */}
        <article className="guide-editorial-content" style={{ maxWidth: "860px", margin: "0 auto", fontSize: "1.08rem", lineHeight: "1.8" }}>
          {/* GHI CHÚ QUY HOẠCH ĐÔ THỊ */}
          <div
            style={{
              backgroundColor: "var(--guide-primary-light)",
              borderLeft: "4px solid var(--guide-primary)",
              borderRadius: "12px",
              padding: "1.1rem 1.35rem",
              margin: "1.75rem 0",
              color: "var(--guide-text-main)",
              fontSize: "0.95rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", marginBottom: "4px" }}>
              <Info size={16} color="#00c2cb" />
              <span>{lang === "vi" ? "Ghi chú dành cho du khách:" : "Traveler Note:"}</span>
            </div>
            <p style={{ margin: 0, lineHeight: "1.6" }}>
              {lang === "vi"
                ? "Để thuận tiện nhất cho việc định vị, tra cứu bản đồ du lịch và đặt phòng khách sạn, bài viết này sẽ sử dụng tên gọi các Quận truyền thống (Quận 1, Quận 3, Quận 5, Tân Bình...) — vốn là các khu vực định danh quen thuộc nhất với du khách quốc tế và các nền tảng đặt phòng trực tuyến."
                : "For maximum clarity and alignment with international booking platforms and navigation maps, this guide refers to traditional district names (District 1, District 3, District 5, Tan Binh...) so travelers can easily identify key areas."}
            </p>
          </div>

          {/* ─── PHẦN 1: VỊ TRÍ ĐẮC ĐỊA TRÊN BẢN ĐỒ DU LỊCH ─── */}
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--guide-text-main)", marginTop: "2.75rem", marginBottom: "1rem" }}>
            {lang === "vi"
              ? "1. Vị trí đắc địa trên bản đồ du lịch phương Nam"
              : "1. Prime location on the southern travel map"}
          </h2>
          <p>
            {lang === "vi"
              ? "Vị trí địa lý trung tâm của TP.HCM biến nơi đây thành 'bàn đạp' lý tưởng để bạn khám phá toàn bộ dải đất phương Nam. Từ các khách sạn trung tâm thành phố, bạn có thể dễ dàng tham gia các tour trong ngày đi Địa đạo Củ Chi huyền thoại, xuôi thuyền về vùng sông nước Đồng bằng Sông Cửu Long, hay làm một chuyến du ngoạn ra thành phố biển Vũng Tàu."
              : "Ho Chi Minh City’s central location makes it an ideal launchpad for exploring southern Vietnam. From hotels in the city center, you can effortlessly embark on iconic day trips to the Cu Chi Tunnels, cruise down the waterways of the Mekong Delta, or take a quick coastal escape to Vung Tau."}
          </p>

          <p>
            {lang === "vi"
              ? "Ngay trong lòng đô thị, hầu hết các điểm tham quan biểu tượng như Chợ Bến Thành, Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm và Nhà hát Lớn Sài Gòn chỉ cách nhau vài phút đi bộ hoặc một cuốc xe công nghệ ngắn, giúp bạn tiết kiệm tối đa thời gian di chuyển."
              : "Within the city center, iconic landmarks such as Ben Thanh Market, the Independence Palace, Notre-Dame Cathedral, the Central Post Office, and Saigon Opera House are all closely clustered, making your sightseeing days efficient and hassle-free."}
          </p>

          {/* DEAL BOX: TOUR CỦ CHI (LINK 9 - KLOOK) */}
          <DealBox deal={AFFILIATE_DATA.cuChiTour} lang={lang} />

          {/* DEAL BOX: TOUR MEKONG (LINK 10 - KLOOK) */}
          <DealBox deal={AFFILIATE_DATA.mekongTour} lang={lang} />

          {/* ─── PHẦN 2: CÁC PHÂN KHÚC LƯU TRÚ ĐA DẠNG ─── */}
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--guide-text-main)", marginTop: "3rem", marginBottom: "1rem" }}>
            {lang === "vi"
              ? "2. Lựa chọn lưu trú phong phú theo từng ngân sách"
              : "2. Diverse accommodation options for every budget"}
          </h2>
          <p>
            {lang === "vi"
              ? "Thành phố Hồ Chí Minh đáp ứng hoàn hảo nhu cầu của mọi phong cách du lịch, từ những du khách ba lô tìm kiếm trải nghiệm giao lưu văn hóa cho đến các doanh nhân và gia đình mong muốn sự sang trọng tiện nghi tuyệt đối:"
              : "Ho Chi Minh City caters brilliantly to all styles of travel, from budget-conscious backpackers looking to mingle with fellow travelers to families and executives seeking world-class indulgence:"}
          </p>

          {/* ẢNH MINH HỌA LƯU TRÚ */}
          <figure style={{ margin: "2rem 0" }}>
            <img
              src="/guide/hcmc/accommodation-in-vietnam.jpg"
              alt="Accommodation in Vietnam and Ho Chi Minh City"
              style={{ width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "460px" }}
              loading="lazy"
            />
            <figcaption style={{ fontSize: "0.88rem", color: "var(--guide-text-muted)", marginTop: "8px", textAlign: "center" }}>
              {lang === "vi"
                ? "Hệ thống khách sạn tại TP.HCM vô cùng phong phú, từ boutique sang trọng đến căn hộ dịch vụ cao cấp."
                : "Ho Chi Minh City offers accommodations tailored to every preference, from boutique properties to high-end serviced residences."}
            </figcaption>
          </figure>

          {/* 2.1 KHÁCH SẠN CAO CẤP */}
          <h3 style={{ fontSize: "1.35rem", fontWeight: "700", color: "var(--guide-text-main)", marginTop: "1.5rem" }}>
            {lang === "vi"
              ? "• Khách sạn 5 sao & Căn hộ Dịch vụ Hạng sang (Luxury & 5-Star Hotels)"
              : "• Luxury Hotels & Serviced Suites (5-Star Quality)"}
          </h3>
          <p>
            {lang === "vi"
              ? "Tập trung dọc theo các đại lộ sầm uất như Đồng Khởi, Lê Lợi, Nguyễn Huệ và trải dài ven sông Sài Gòn. Các thương hiệu 5 sao đẳng cấp mang đến dịch vụ chuẩn quốc tế, hồ bơi vô cực trên tầng thượng ngắm hoàng hôn, spa thư giãn và những quầy sky bar sang trọng bậc nhất."
              : "Concentrated along prestigious boulevards such as Dong Khoi, Le Loi, Nguyen Hue, and along the scenic Saigon River. Luxury properties boast world-class hospitality, rooftop infinity pools with panoramic skyline views, serene wellness spas, and buzzing sky bars."}
          </p>
          {/* DEAL BOX: KHÁCH SẠN CAO CẤP Q1 (LINK 3 - TRAVELOKA) */}
          <DealBox deal={AFFILIATE_DATA.d1Luxury} lang={lang} />

          {/* 2.2 KHÁCH SẠN TẦM TRUNG & BOUTIQUE */}
          <h3 style={{ fontSize: "1.35rem", fontWeight: "700", color: "var(--guide-text-main)", marginTop: "2rem" }}>
            {lang === "vi"
              ? "• Khách sạn Tầm trung & Boutique Tinh tế (Mid-Range & Boutique Stays)"
              : "• Stylish Boutique & Mid-Range Stays"}
          </h3>
          <p>
            {lang === "vi"
              ? "Nằm rải rác khắp Quận 1 và khu vực lân cận, các khách sạn boutique tạo dấu ấn bởi phong cách kiến trúc Indochine giao thoa Á - Âu đầy chất thơ. Bạn sẽ được tận hưởng không gian phòng nghỉ ấm cúng, thiết kế thẩm mỹ và dịch vụ chu đáo mà không cần chi tiêu quá đắt đỏ."
              : "Dotted across District 1 and surrounding wards, boutique hotels charm guests with their poetic Indochine aesthetics and attentive local hospitality. They offer modern comforts, unique interior flair, and prime central locations without breaking the bank."}
          </p>
          {/* DEAL BOX: KHÁCH SẠN TẦM TRUNG Q1 (LINK 4 - TRAVELOKA) */}
          <DealBox deal={AFFILIATE_DATA.d1Midrange} lang={lang} />

          {/* 2.3 HOSTEL & TIẾT KIỆM */}
          <h3 style={{ fontSize: "1.35rem", fontWeight: "700", color: "var(--guide-text-main)", marginTop: "2rem" }}>
            {lang === "vi"
              ? "• Hostel Tiết kiệm & Nơi ở Cho Dân Du Lịch Tự Túc (Budget & Backpackers)"
              : "• Budget Hostels & Guesthouses for Solo Adventurers"}
          </h3>
          <p>
            {lang === "vi"
              ? "Khu phố Tây Bùi Viện, Đề Thám và các con ngõ yên tĩnh ở Quận 1, Quận 3 là thiên đường của các hostel hiện đại, phòng dorm con nhộng sạch sẽ và homestay thân thiện. Đây là nơi tuyệt vời để kết nối với những người bạn đồng hành đến từ khắp nơi trên thế giới."
              : "The traveler enclaves around Bui Vien, De Tham, and hidden laneways of District 1 and District 3 are hubs for stylish dorm capsules, cozy guesthouses, and social hostels. They provide clean amenities, affordable beds, and social common areas to meet fellow explorers."}
          </p>
          {/* DEAL BOX: HOSTEL / TIẾT KIỆM Q1 (LINK 5 - TRAVELOKA) */}
          <DealBox deal={AFFILIATE_DATA.d1Budget} lang={lang} />

          {/* ─── PHẦN 3: CẨM NANG CHI TIẾT TỪNG KHU VỰC / QUẬN NÊN Ở ─── */}
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--guide-text-main)", marginTop: "3.25rem", marginBottom: "1rem" }}>
            {lang === "vi"
              ? "3. Cẩm nang khu vực nên ở: Chọn quận nào phù hợp nhất?"
              : "3. Where to stay: neighborhood guide by district"}
          </h2>
          <p>
            {lang === "vi"
              ? "Mỗi khu vực của thành phố lại mang một cá tính và nhịp sống rất riêng. Dưới đây là phân tích chi tiết giúp bạn chọn đúng tọa độ lưu trú phù hợp với lịch trình của mình:"
              : "Each neighborhood in Ho Chi Minh City possesses its own distinct personality and rhythm. Here is a breakdown of the key districts to help you pinpoint the ideal base for your trip:"}
          </p>

          {/* ẢNH QUAN SÁT TỪ DINH ĐỘC LẬP */}
          <figure style={{ margin: "2rem 0" }}>
            <img
              src="/guide/hcmc/Things-to-do-in-Ho-Chi-Minh-City-Reunification-Palace-Vietnamnomad.jpg"
              alt="Central Ho Chi Minh City from Independence Palace"
              style={{ width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "450px" }}
              loading="lazy"
            />
            <figcaption style={{ fontSize: "0.88rem", color: "var(--guide-text-muted)", marginTop: "8px", textAlign: "center" }}>
              {lang === "vi"
                ? "Khu trung tâm Quận 1 nhìn từ Dinh Độc Lập — rợp bóng cây cổ thụ và dễ dàng tản bộ tham quan."
                : "Central District 1 viewed towards the Independence Palace — surrounded by green parks and walkable sights."}
            </figcaption>
          </figure>

          {/* QUẬN 1 */}
          <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.75rem", boxShadow: "var(--guide-shadow-sm)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--guide-text-main)", display: "flex", alignItems: "center", gap: "8px", marginTop: 0 }}>
              <MapPin size={18} color="#00c2cb" />
              {lang === "vi"
                ? "Quận 1 (Trung tâm Hành chính, Thương mại & Du lịch)"
                : "District 1 (Central Business, Shopping & Tourist Core)"}
            </h3>
            <p style={{ margin: "0.75rem 0", color: "var(--guide-text-muted)" }}>
              {lang === "vi"
                ? "Lựa chọn số 1 cho người đến TP.HCM lần đầu. Bạn chỉ cần bước chân ra khỏi sảnh là đã chạm tới Nhà hát Lớn, chợ Bến Thành, phố đi bộ Nguyễn Huệ, trung tâm thương mại Vincom/Takashimaya và hàng trăm nhà hàng, quán bar thời thượng."
                : "The uncontested top pick for first-time visitors. Stepping out of your lobby puts you right in front of the Opera House, Ben Thanh Market, Nguyen Hue Walking Street, luxury shopping malls, and hundreds of vibrant eateries."}
            </p>
            {/* DEAL BOX: XE BUÝT 2 TẦNG (LINK 2 - KLOOK) */}
            <DealBox deal={AFFILIATE_DATA.hopOnHopOff} lang={lang} />
          </div>

          {/* QUẬN 3 */}
          <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.75rem", boxShadow: "var(--guide-shadow-sm)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--guide-text-main)", display: "flex", alignItems: "center", gap: "8px", marginTop: 0 }}>
              <MapPin size={18} color="#00c2cb" />
              {lang === "vi"
                ? "Quận 3 (Khu Biệt Thự Cổ, Yên Bình & Giàu Văn Hóa)"
                : "District 3 (Tree-Lined Avenues, Quiet Charm & Local Life)"}
            </h3>
            <p style={{ margin: "0.75rem 0", color: "var(--guide-text-muted)" }}>
              {lang === "vi"
                ? "Nằm ngay cạnh Quận 1 nhưng Quận 3 lại mang bầu không khí êm ả, trong lành hơn với những con đường rợp bóng me cổ thụ, những căn biệt thự Pháp cổ kính và Bảo tàng Chứng tích Chiến tranh. Đây cũng là 'thánh địa' của các quán cà phê ngõ hẻm và quán ăn bản địa trứ danh."
                : "Directly bordering District 1, District 3 offers a calmer, greener retreat with shaded tamarind-lined boulevards, colonial French villas, and the War Remnants Museum. It is widely loved for atmospheric laneway coffee shops and authentic neighborhood dining."}
            </p>
            {/* DEAL BOX: KHÁCH SẠN QUẬN 3 (LINK 6 - TRAVELOKA) */}
            <DealBox deal={AFFILIATE_DATA.d3Hotels} lang={lang} />
          </div>

          {/* QUẬN 5 */}
          <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.75rem", boxShadow: "var(--guide-shadow-sm)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--guide-text-main)", display: "flex", alignItems: "center", gap: "8px", marginTop: 0 }}>
              <MapPin size={18} color="#00c2cb" />
              {lang === "vi"
                ? "Quận 5 (Khu Chợ Lớn / Chinatown)"
                : "District 5 (Chinatown / Cho Lon Heritage)"}
            </h3>
            <p style={{ margin: "0.75rem 0", color: "var(--guide-text-muted)" }}>
              {lang === "vi"
                ? "Nếu bạn đam mê văn hóa truyền thống và ẩm thực Trung Hoa, Quận 5 là nơi lưu trú độc đáo khó quên. Nơi đây có chùa Bà Thiên Hậu cổ kính, chợ đầu mối Bình Tây nhộn nhịp cùng thiên đường hủ tiếu, sủi cảo, chè Tàu thơm lừng."
                : "For travelers eager to immerse themselves in rich heritage and legendary culinary traditions, Chinatown (Cho Lon) in District 5 is an unforgettable choice. Enjoy centuries-old Chinese assembly halls, bustling Binh Tay wholesale market, and mouthwatering dim sum."}
            </p>
            {/* DEAL BOX: KHÁCH SẠN QUẬN 5 (LINK 7 - TRAVELOKA) */}
            <DealBox deal={AFFILIATE_DATA.d5Hotels} lang={lang} />
          </div>

          {/* KHU VỰC SÂN BAY TÂN SƠN NHẤT */}
          <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.75rem", boxShadow: "var(--guide-shadow-sm)" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--guide-text-main)", display: "flex", alignItems: "center", gap: "8px", marginTop: 0 }}>
              <Plane size={18} color="#00c2cb" />
              {lang === "vi"
                ? "Khu Vực Sân Bay Tân Sơn Nhất (Quận Tân Bình)"
                : "Tan Son Nhat Airport Area (Tan Binh District)"}
            </h3>
            <p style={{ margin: "0.75rem 0", color: "var(--guide-text-muted)" }}>
              {lang === "vi"
                ? "Lựa chọn tối ưu hàng đầu nếu bạn có chuyến bay cất cánh vào sáng sớm, hạ cánh vào đêm muộn hoặc chỉ dừng chân quá cảnh (layover) 1 đêm tại Sài Gòn. Ở gần sân bay giúp bạn chủ động thời gian và hoàn toàn tránh được áp lực kẹt xe giờ cao điểm."
                : "The optimal strategy if you have an early morning flight, a midnight arrival, or a short overnight layover in Ho Chi Minh City. Staying in Tan Binh eliminates traffic worries and guarantees swift airport commutes."}
            </p>
            {/* DEAL BOX: KHÁCH SẠN GẦN SÂN BAY (LINK 8 - TRAVELOKA) */}
            <DealBox deal={AFFILIATE_DATA.airportHotels} lang={lang} />

            {/* DEAL BOX: XE ĐƯA ĐÓN SÂN BAY VỀ TRUNG TÂM (LINK 1 - KLOOK) */}
            <DealBox deal={AFFILIATE_DATA.airportTransfer} lang={lang} />
          </div>

          {/* CÁC QUẬN KHÁC (QUẬN 2 & QUẬN 7) */}
          <div style={{ background: "var(--guide-bg)", border: "1px solid var(--guide-border)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--guide-text-main)", marginTop: 0 }}>
              {lang === "vi"
                ? "Các khu vực khác: Quận 2 (Thảo Điền) & Quận 7 (Phú Mỹ Hưng)"
                : "Other districts: District 2 (Thao Dien) & District 7 (Phu My Hung)"}
            </h3>
            <p style={{ margin: "0.5rem 0", color: "var(--guide-text-muted)" }}>
              {lang === "vi"
                ? "Thảo Điền (Quận 2 cũ) nổi tiếng với cộng đồng người nước ngoài, các quán cà phê nghệ thuật ven sông Sài Gòn và không khí trong lành. Quận 7 (Phú Mỹ Hưng) lại sở hữu các khu đô thị quy hoạch hiện đại với nhiều mảng xanh, trung tâm triển lãm SECC và các căn hộ dịch vụ cao cấp rất thích hợp cho gia đình hoặc khách lưu trú dài ngày."
                : "Thao Dien (former District 2) is famed for its international expat community, riverside restaurants, and laid-back vibe. District 7 (Phu My Hung) features wide sidewalks, modern residential towers, green parks, and the SECC convention center—perfect for families or extended stays."}
            </p>
          </div>

          {/* ─── PHẦN 4: BÍ QUYẾT CHỌN PHÒNG HOÀN HẢO ─── */}
          <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--guide-text-main)", marginTop: "2.75rem", marginBottom: "1rem" }}>
            {lang === "vi"
              ? "4. Bí quyết chọn phòng khách sạn thông minh tại TP.HCM"
              : "4. Practical tips for booking your stay in Ho Chi Minh City"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", margin: "1.5rem 0 2rem" }}>
            <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "14px", padding: "1.25rem", boxShadow: "var(--guide-shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--guide-text-main)", marginBottom: "6px" }}>
                <CheckCircle2 size={16} color="#00c2cb" />
                <span>{lang === "vi" ? "Gần điểm tham quan" : "Proximity to Attractions"}</span>
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--guide-text-muted)", margin: 0, lineHeight: "1.55" }}>
                {lang === "vi"
                  ? "Nếu lịch trình chỉ kéo dài 2-3 ngày, ưu tiên tuyệt đối cho Quận 1 hoặc ranh giới Quận 3 để có thể tản bộ và không mất nhiều thời gian trên đường."
                  : "If visiting for 2–3 days, prioritize staying in central District 1 or the border of District 3 to walk to top sights without traffic delays."}
              </p>
            </div>

            <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "14px", padding: "1.25rem", boxShadow: "var(--guide-shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--guide-text-main)", marginBottom: "6px" }}>
                <Car size={16} color="#00c2cb" />
                <span>{lang === "vi" ? "Giao thông & Gọi xe tiện lợi" : "Transportation Access"}</span>
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--guide-text-muted)", margin: 0, lineHeight: "1.55" }}>
                {lang === "vi"
                  ? "Chọn khách sạn nằm trên đường lớn hoặc hẻm xe hơi rộng để taxi và xe công nghệ (Grab, Be, Xanh SM) đón trả thuận tiện."
                  : "Pick hotels located on accessible main streets or wide alleys where ride-hailing apps (Grab, Be, Xanh SM) can drop you right at the door."}
              </p>
            </div>

            <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "14px", padding: "1.25rem", boxShadow: "var(--guide-shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--guide-text-main)", marginBottom: "6px" }}>
                <ShieldCheck size={16} color="#00c2cb" />
                <span>{lang === "vi" ? "Đọc kỹ đánh giá cách âm" : "Check Soundproofing Reviews"}</span>
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--guide-text-muted)", margin: 0, lineHeight: "1.55" }}>
                {lang === "vi"
                  ? "Sài Gòn là thành phố không ngủ. Hãy xem kỹ đánh giá về cửa kính cách âm, đặc biệt nếu bạn chọn khách sạn gần phố đi bộ Bùi Viện hoặc các trục đường chính."
                  : "Saigon is vibrant and energetic. Pay close attention to soundproofing reviews, especially if choosing accommodation close to nightlife strips."}
              </p>
            </div>

            <div style={{ background: "var(--guide-card-bg)", border: "1px solid var(--guide-border)", borderRadius: "14px", padding: "1.25rem", boxShadow: "var(--guide-shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "var(--guide-text-main)", marginBottom: "6px" }}>
                <Sparkles size={16} color="#00c2cb" />
                <span>{lang === "vi" ? "Điều hòa & Tiện nghi" : "Air Conditioning & Amenities"}</span>
              </div>
              <p style={{ fontSize: "0.92rem", color: "var(--guide-text-muted)", margin: 0, lineHeight: "1.55" }}>
                {lang === "vi"
                  ? "Khí hậu miền Nam nắng ấm quanh năm, một chiếc máy lạnh chạy êm ái cùng hệ thống nước nóng ổn định là yếu tố tiên quyết cho giấc ngủ ngon."
                  : "With Saigon's tropical warmth year-round, a strong, quiet air conditioner and reliable shower pressure are essential for refreshing rests."}
              </p>
            </div>
          </div>

          <p style={{ marginTop: "2rem", color: "var(--guide-text-main)" }}>
            {lang === "vi"
              ? "Dù ngân sách của bạn là bao nhiêu, Thành phố Hồ Chí Minh luôn có những căn phòng lý tưởng đón chào bạn. Hãy chọn cho mình một điểm dừng chân ưng ý để khởi đầu hành trình khám phá đô thị phương Nam trọn vẹn và tràn đầy cảm hứng!"
              : "Whether on a shoestring backpacker budget or seeking five-star indulgence, Ho Chi Minh City has welcoming doors ready for you. Pick the neighborhood that matches your travel rhythm and embark on an inspiring southern adventure!"}
          </p>

          {/* ─── TAGS SECTION ─── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--guide-border)" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--guide-text-muted)", textTransform: "uppercase", alignSelf: "center", marginRight: "6px" }}>
              TAGS:
            </span>
            <span style={{ fontSize: "0.85rem", padding: "5px 12px", background: "var(--guide-border-subtle)", borderRadius: "999px", color: "var(--guide-text-main)" }}>
              #Accommodation
            </span>
            <span style={{ fontSize: "0.85rem", padding: "5px 12px", background: "var(--guide-border-subtle)", borderRadius: "999px", color: "var(--guide-text-main)" }}>
              #HoChiMinhCity
            </span>
            <span style={{ fontSize: "0.85rem", padding: "5px 12px", background: "var(--guide-border-subtle)", borderRadius: "999px", color: "var(--guide-text-main)" }}>
              #District1Hotels
            </span>
            <span style={{ fontSize: "0.85rem", padding: "5px 12px", background: "var(--guide-border-subtle)", borderRadius: "999px", color: "var(--guide-text-main)" }}>
              #TravelGuide
            </span>
          </div>

          {/* ─── BÀI VIẾT LIÊN QUAN (OTHER POSTS SECTION) ─── */}
          <section style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: "2px solid var(--guide-border-subtle)" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--guide-text-main)", marginBottom: "1.5rem" }}>
              {lang === "vi" ? "Cẩm nang du lịch TP.HCM & Việt Nam nên đọc" : "Related Guides & Essential Reads"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
              {/* Card 1: 10 Best Things to Do in HCMC */}
              <Link
                href="/guide/10-best-things-to-do-in-ho-chi-minh-city"
                style={{ textDecoration: "none", color: "inherit", background: "var(--guide-card-bg)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--guide-border)", transition: "transform 0.2s" }}
              >
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <img
                    src="/guide/hcmc/10-best-things-hcmc-hd.jpg"
                    alt="10 best things to do in Ho Chi Minh City"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--guide-primary)", textTransform: "uppercase" }}>
                    {lang === "vi" ? "Trải nghiệm" : "Things to Do"}
                  </span>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", margin: "4px 0 0", color: "var(--guide-text-main)", lineHeight: "1.4" }}>
                    {lang === "vi"
                      ? "10 Trải Nghiệm Tuyệt Nhất Tại TP. Hồ Chí Minh"
                      : "10 Best Things to Do in Ho Chi Minh City"}
                  </h4>
                </div>
              </Link>

              {/* Card 2: 12 Must-Try Foods in HCMC */}
              <Link
                href="/guide/12-must-try-foods-in-ho-chi-minh-city"
                style={{ textDecoration: "none", color: "inherit", background: "var(--guide-card-bg)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--guide-border)", transition: "transform 0.2s" }}
              >
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <img
                    src="/guide/hcmc/12-must-try-foods-in-Ho-Chi-Minh-City-Com-Tam.jpg"
                    alt="12 must-try foods in Ho Chi Minh City"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--guide-primary)", textTransform: "uppercase" }}>
                    {lang === "vi" ? "Ẩm thực" : "Eat & Drink"}
                  </span>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", margin: "4px 0 0", color: "var(--guide-text-main)", lineHeight: "1.4" }}>
                    {lang === "vi"
                      ? "12 Món Ngon Nhất Định Phải Thử Tại TP. Hồ Chí Minh"
                      : "12 Must-Try Foods in Ho Chi Minh City"}
                  </h4>
                </div>
              </Link>

              {/* Card 3: The Complete Guide to Vietnam */}
              <Link
                href="/guide/the-complete-guide-to-vietnam"
                style={{ textDecoration: "none", color: "inherit", background: "var(--guide-card-bg)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--guide-border)", transition: "transform 0.2s" }}
              >
                <div style={{ height: "160px", overflow: "hidden" }}>
                  <img
                    src="/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg"
                    alt="The Complete Guide to Vietnam"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--guide-primary)", textTransform: "uppercase" }}>
                    {lang === "vi" ? "Toàn diện" : "Complete Guide"}
                  </span>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", margin: "4px 0 0", color: "var(--guide-text-main)", lineHeight: "1.4" }}>
                    {lang === "vi"
                      ? "Cẩm Nang Toàn Diện Du Lịch Việt Nam 2026"
                      : "The Complete Guide to Vietnam 2026"}
                  </h4>
                </div>
              </Link>
            </div>
          </section>
        </article>

      </main>

      {/* ─── FULL EDITORIAL FOOTER ─── */}
      <PublicFooter lang={lang} />

      {/* ─── AI TRAVEL COMPANION (CHATBOT) ─── */}
      <ProvinceChatbot
        province={{
          name: lang === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City",
          slug: "ho-chi-minh",
        }}
      />
    </div>
  );
}
