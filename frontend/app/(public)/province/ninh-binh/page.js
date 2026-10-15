"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
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
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Waves,
  Sun,
  Bus,
  Train,
  Bed,
  Utensils,
  ChevronDown,
  ChevronUp,
  Download,
  Camera,
  Check,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/guide-editorial.css";
import "@/styles/ninh-binh-guide.css";

// ─── VERIFIED EXISTING RELATED ARTICLES ON VINATAP ───
const RELATED_ARTICLES = [
  {
    slug: "the-complete-guide-to-vietnam",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm Nang Toàn Diện Du Lịch Việt Nam",
    badge: "ESSENTIAL GUIDE",
    badgeVi: "CẨM NANG TOÀN DIỆN",
    excerpt:
      "A complete overview of Vietnam travel essentials, cultural etiquette, regional itineraries, and insider tips.",
    excerptVi:
      "Tổng quan tất cả thông tin quan trọng từ thủ tục, tiền tệ, văn hóa đến lịch trình các miền cho du khách.",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
  },
  {
    slug: "accommodation-in-vietnam",
    title: "Accommodation in Vietnam: A Guide for International Travelers",
    titleVi: "Lưu Trú Tại Việt Nam: Cẩm Nang Cho Du Khách Quốc Tế",
    badge: "STAY GUIDE",
    badgeVi: "CẨM NANG LƯU TRÚ",
    excerpt:
      "Explore luxury resorts, boutique hotels, mountain homestays, and budget hostels across Vietnam with typical price ranges.",
    excerptVi:
      "Gợi ý chi tiết các loại hình khách sạn, resort, homestay và hostel cùng bảng giá và mẹo đặt phòng thực tế.",
    img: "/guide/accommodation/hero.jpg",
  },
  {
    slug: "15-best-places-to-visit-in-vietnam-in-2026",
    title: "15 Best Places to Visit in Vietnam in 2026",
    titleVi: "15 Điểm Đến Đẹp Nhất Việt Nam Năm 2026",
    badge: "TRENDING",
    badgeVi: "XU HƯỚNG 2026",
    excerpt:
      "Discover Vietnam's top scenic landscapes, from UNESCO-listed Trang An to misty mountain peaks and golden coastal waters.",
    excerptVi:
      "Danh sách chọn lọc các danh thắng ngoạn mục nhất từ Quần thể Tràng An đến vùng cao Tây Bắc và biển đảo.",
    img: "/guide/megamenu/inspired-1.jpg",
  },
  {
    slug: "3-week-vietnam-itinerary",
    title: "3-Week Vietnam Itinerary: The Ultimate Route",
    titleVi: "Lịch Trình Du Lịch Việt Nam 3 Tuần Lý Tưởng",
    badge: "ITINERARY",
    badgeVi: "LỊCH TRÌNH 3 TUẦN",
    excerpt:
      "Our recommended 3-week route connecting Saigon, Nha Trang, Da Nang, Hoi An, Hanoi, Ha Long Bay, and Ninh Binh.",
    excerptVi:
      "Lộ trình tối ưu xuyên Việt qua 7 điểm đến kinh điển: Sài Gòn → Nha Trang → Đà Nẵng → Hội An → Hà Nội → Hạ Long → Ninh Bình.",
    img: "/guide/megamenu/itin-1-3week.jpg",
  },
  {
    slug: "hanoi-tourist-map",
    title: "Hanoi Tourist Map | Ultimate Guide for Sightseeing",
    titleVi: "Bản Đồ Du Lịch Hà Nội | Cẩm Nang Khám Phá Thủ Đô",
    badge: "NORTHERN HUB",
    badgeVi: "CỬA NGÕ MIỀN BẮC",
    excerpt:
      "Detailed tourist map of Hanoi, just 90km north of Ninh Binh, exploring the Old Quarter, West Lake, and French Quarter.",
    excerptVi:
      "Bản đồ chi tiết điểm tham quan, ẩm thực và mua sắm tại Hà Nội – điểm xuất phát lý tưởng nhất để đến Ninh Bình.",
    img: "/guide/hanoi/hanoi-tourist-map-2026.jpg",
  },
  {
    slug: "where-to-stay-in-ho-chi-minh-city",
    title: "Where to Stay in Ho Chi Minh City",
    titleVi: "Nơi Lưu Trú Tốt Nhất Tại TP. Hồ Chí Minh",
    badge: "CITY GUIDE",
    badgeVi: "CẨM NANG ĐÔ THỊ",
    excerpt:
      "Neighborhood guide and top hotel recommendations in Vietnam's vibrant southern commercial hub.",
    excerptVi:
      "Kinh nghiệm chọn khách sạn và khu vực lưu trú lý tưởng tại thành phố mang tên Bác cho du khách tự túc.",
    img: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
  },
];

export default function NinhBinhDestinationPage() {
  const [lang, setLang] = useState("vi");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Sync language with VinaTap global state
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
    return () =>
      window.removeEventListener("vinatap:lang-updated", handleLangChange);
  }, []);

  // Scroll reading progress
  useEffect(() => {
    const updateProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((currentScroll / scrollHeight) * 100);
      }
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        lang === "vi"
          ? "Đã sao chép liên kết cẩm nang Ninh Bình!"
          : "Ninh Binh guide link copied to clipboard!"
      );
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      !isBookmarked
        ? lang === "vi"
          ? "Đã lưu Ninh Bình vào danh sách yêu thích!"
          : "Ninh Binh saved to your bookmarks!"
        : lang === "vi"
        ? "Đã xóa khỏi danh sách yêu thích!"
        : "Removed from bookmarks!"
    );
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isVi = lang === "vi";

  return (
    <div className="guide-page-wrapper ninhbinh-page">
      {/* Reading Progress Indicator */}
      <div
        className="guide-progress-bar"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #099f8a 0%, #00c2cb 100%)",
        }}
      />

      {/* Toast Notification */}
      {toastVisible && (
        <div className="guide-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standard Unified PublicHeader */}
      <PublicHeader />

      {/* Sticky Secondary Breadcrumbs Bar */}
      <div className="guide-nav">
        <div className="guide-nav__inner">
          <div className="guide-nav__left">
            <nav className="guide-breadcrumb">
              <Link href="/">{isVi ? "Trang chủ" : "Home"}</Link>
              <ChevronRight size={13} />
              <Link href="/guide/15-best-places-to-visit-in-vietnam-in-2026">
                {isVi ? "Điểm đến" : "Destinations"}
              </Link>
              <ChevronRight size={13} />
              <span className="guide-breadcrumb__curr">
                {isVi ? "Ninh Bình" : "Ninh Binh"}
              </span>
            </nav>
          </div>
          <div className="guide-nav__right">
            <button
              onClick={handleBookmark}
              className={`guide-action-btn ${isBookmarked ? "active" : ""}`}
              title={isVi ? "Lưu bài viết" : "Bookmark article"}
            >
              <Bookmark size={16} />
              <span>
                {isBookmarked
                  ? isVi
                    ? "Đã lưu"
                    : "Saved"
                  : isVi
                  ? "Lưu bài"
                  : "Bookmark"}
              </span>
            </button>
            <button
              onClick={handleCopyLink}
              className="guide-action-btn"
              title={isVi ? "Chia sẻ" : "Share"}
            >
              <Share2 size={16} />
              <span>{isVi ? "Chia sẻ" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="guide-container">
        {/* Article Header */}
        <header className="guide-header">
          <div className="nb-hero-badge">
            <Sparkles size={14} />
            <span>
              {isVi
                ? "DI SẢN KÉP THẾ GIỚI UNESCO • MIỀN BẮC"
                : "UNESCO DUAL WORLD HERITAGE • NORTHERN VIETNAM"}
            </span>
          </div>

          <h1 className="guide-title">
            {isVi
              ? "Cẩm nang du lịch Ninh Bình toàn diện: Khám phá 'Hạ Long trên cạn'"
              : "Ultimate Ninh Binh Travel Guide: Exploring Vietnam's 'Ha Long Bay on Land'"}
          </h1>

          <p className="guide-subtitle">
            {isVi
              ? "Sở hữu cảnh quan sơn thủy hữu tình cùng di sản văn hóa và thiên nhiên thế giới UNESCO, Ninh Bình là điểm đến không thể bỏ lỡ tại Việt Nam với Tam Cốc, Tràng An, Cố đô Hoa Lư và những dãy núi đá vôi kỳ vĩ."
              : "Boasting breathtaking karst landscapes and UNESCO dual world heritage sites, Ninh Binh is an unmissable destination in Vietnam, home to Trang An, Tam Coc, ancient imperial capitals, and emerald river valleys."}
          </p>

          <div className="guide-meta-bar">
            <div className="guide-author-box">
              <div
                className="guide-author-avatar"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="VinaTap"
                  width={32}
                  height={24}
                  style={{
                    width: "auto",
                    height: "22px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
              <div>
                <div className="guide-author-name">
                  VinaTap Travel Team
                  <span className="guide-verified-badge" title="Đã xác thực">
                    <CheckCircle2 size={14} style={{ color: "#099f8a" }} />
                  </span>
                </div>
                <div className="guide-author-role">
                  {isVi
                    ? "Biên soạn chuyên sâu bởi Ban Biên Tập VinaTap"
                    : "Curated by VinaTap Editorial Desk"}
                </div>
              </div>
            </div>

            <div className="guide-meta-stats">
              <div className="guide-meta-item">
                <Calendar size={14} />
                <span>
                  {isVi ? "Cập nhật: 10 Tháng 10, 2026" : "Updated: October 10, 2026"}
                </span>
              </div>
              <div className="guide-meta-item">
                <Clock size={14} />
                <span>
                  {isVi ? "Thời gian đọc: 12 phút" : "Read time: 12 mins"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Featured Image */}
        <figure className="nb-figure">
          <img
            src="/guide/ninh-binh/hero.jpg"
            alt={
              isVi
                ? "Toàn cảnh non nước hữu tình Ninh Bình Việt Nam"
                : "Spectacular karst mountains and emerald waterways in Ninh Binh, Vietnam"
            }
            loading="eager"
          />
          <figcaption>
            {isVi
              ? "Ninh Bình được mệnh danh là 'Hạ Long trên cạn' với hệ thống núi đá vôi hàng triệu năm tuổi và những dòng sông thơ mộng."
              : "Ninh Binh is renowned as 'Ha Long Bay on Land', with millions-year-old limestone karsts emerging from serene river valleys."}
          </figcaption>
        </figure>

        {/* Quick Snapshot Card */}
        <div className="nb-snapshot-box">
          <div className="nb-snapshot-title">
            <Compass size={20} />
            <span>
              {isVi ? "Ninh Bình tóm tắt nhanh" : "Ninh Binh at a Glance"}
            </span>
          </div>
          <div className="nb-snapshot-grid">
            <div className="nb-snapshot-item">
              <MapPin className="nb-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Vị trí địa lý:" : "Location:"}</strong>{" "}
                {isVi
                  ? "Cách trung tâm Hà Nội khoảng 90 – 93 km về phía Nam."
                  : "Located approximately 90–93 km south of Hanoi."}
              </div>
            </div>
            <div className="nb-snapshot-item">
              <Sun className="nb-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Mùa đẹp nhất:" : "Best Time:"}</strong>{" "}
                {isVi
                  ? "Tháng 1 – 3 (lễ hội mùa xuân) & Tháng 5 – 6 (mùa lúa chín vàng Tam Cốc)."
                  : "Jan – March (festivals) & May – June (golden ripe rice in Tam Coc)."}
              </div>
            </div>
            <div className="nb-snapshot-item">
              <Bus className="nb-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Thời gian di chuyển:" : "Transit Time:"}</strong>{" "}
                {isVi
                  ? "1.5 – 2 giờ bằng xe Limousine cao tốc hoặc tàu hỏa từ Hà Nội."
                  : "1.5 – 2 hours via express limousine or train from Hanoi."}
              </div>
            </div>
            <div className="nb-snapshot-item">
              <Sparkles className="nb-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Danh hiệu nổi bật:" : "Highlights:"}</strong>{" "}
                {isVi
                  ? "Di sản thế giới kép UNESCO Tràng An, Cố đô Hoa Lư, Chùa Bái Đính."
                  : "UNESCO Dual World Heritage Trang An, Hoa Lu Capital, Bai Dinh Pagoda."}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Overview & Map */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Compass size={24} style={{ color: "#099f8a" }} />
            <span>{isVi ? "1. Tổng quan & Bản đồ du lịch Ninh Bình" : "1. Ninh Binh Overview & Tourist Map"}</span>
          </h2>

          <p className="nb-section-desc">
            {isVi
              ? "Ninh Bình là một tỉnh thuộc cực Nam của Đồng bằng sông Hồng, tiếp giáp giữa miền Bắc và miền Trung Việt Nam. Nơi đây sở hữu mật độ danh lam thắng cảnh thiên nhiên và di tích lịch sử dày đặc hiếm có: từ Quần thể danh thắng Tràng An, Tam Cốc – Bích Động đến Cố đô Hoa Lư ngàn năm lịch sử và Vườn quốc gia Cúc Phương nguyên sinh."
              : "Ninh Binh is a province situated at the southern tip of the Red River Delta, approximately 90 km south of Hanoi. The province is world-famous for its high concentration of natural wonders and cultural landmarks, including Tam Coc - Bich Dong, Trang An, Bai Dinh Pagoda, Hoa Lu Ancient Capital, and Cuc Phuong National Park."}
          </p>

          <figure className="nb-figure">
            <img
              src="/guide/ninh-binh/map.jpg"
              alt={
                isVi
                  ? "Bản đồ du lịch Ninh Bình với các điểm tham quan nổi bật"
                  : "Ninh Binh Tourist Map highlighting major attractions"
              }
              loading="lazy"
            />
            <figcaption>
              {isVi
                ? "Bản đồ phân bố các điểm danh thắng nổi tiếng tại Ninh Bình: Tràng An, Tam Cốc, Hoa Lư, Bái Đính, Hang Múa, Đầm Vân Long."
                : "Tourist map showing major sightseeing hubs across Ninh Binh: Trang An, Tam Coc, Hoa Lu, Bai Dinh, Mua Cave, and Van Long Lagoon."}
            </figcaption>
          </figure>
        </section>

        {/* Section 2: Weather & Seasons */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Sun size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "2. Thời tiết Ninh Bình & Mùa nào đẹp nhất?"
                : "2. Ninh Binh Weather & Best Time to Visit"}
            </span>
          </h2>

          <p className="nb-section-desc">
            {isVi
              ? "Ninh Bình mang đặc trưng khí hậu nhiệt đới gió mùa của miền Bắc với 4 mùa rõ rệt. Mỗi thời khắc trong năm lại khoác lên vùng đất cố đô một vẻ đẹp kỳ ảo riêng biệt:"
              : "Ninh Binh enjoys a tropical monsoon climate with four distinct seasons: spring, summer, autumn, and winter. You can visit Ninh Binh year-round, and each season unveils a distinct charm:"}
          </p>

          <div className="nb-season-grid">
            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Sparkles size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Mùa xuân (Tháng 1 – 3)" : "Spring (Jan – March)"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Tiết trời se lạnh, trong lành, là mùa trẩy hội lớn nhất trong năm: Lễ hội chùa Bái Đính, Lễ hội Cố đô Hoa Lư, đền Thái Vi. Không khí hành hương đầu năm rộn ràng, tấp nập."
                  : "Pleasant chilly breezes and vibrant festive ambiance. Key spiritual pilgrimages take place, including Bai Dinh Pagoda and Hoa Lu Ancient Capital festivals."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Sun size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Mùa hè (Tháng 4 – 6)" : "Summer (April – June)"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Đặc biệt vào cuối tháng 5 đến tháng 6 là 'mùa vàng Tam Cốc' khi những cánh đồng lúa chín vàng rực hai bên dòng sông Ngô Đồng, hòa cùng sắc sen ngát hương tuyệt mỹ."
                  : "Late May and June feature the iconic 'golden season' in Tam Coc, with ripe yellow rice fields dancing alongside the Ngo Dong river beneath towering karsts."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Waves size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Mùa thu (Tháng 7 – 10)" : "Autumn (July – Oct)"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Nắng vàng dịu nhẹ, trời cao trong xanh và không còn oi bức. Đây cũng là thời điểm hoa súng tím biếc nở rộ trên mặt nước Đầm Vân Long và suối Yến, cảnh sắc nên thơ."
                  : "Milder temperatures, crisp sunny skies, and blooming purple water lilies floating across serene lagoons like Van Long."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Compass size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Mùa đông (Tháng 11 – 12)" : "Winter (Nov – Dec)"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Mùa đông mang cái lạnh se sắt đặc trưng miền Bắc. Khắp thung lũng Tràng An và chân núi Bái Đính, những cánh đồng lau trắng muốt nở rộ bồng bềnh như mây tuyết."
                  : "Chilly northern winter brings vast fields of fluffy white reed blossoms swaying across Trang An valleys and Hoa Lu hillsides."}
              </p>
            </div>
          </div>

          <figure className="nb-figure">
            <img
              src="/guide/ninh-binh/weather.jpg"
              alt={
                isVi
                  ? "Mùa lúa chín vàng rực rỡ tại Tam Cốc Ninh Bình"
                  : "Golden harvest season in Tam Coc, Ninh Binh"
              }
              loading="lazy"
            />
            <figcaption>
              {isVi
                ? "Mùa lúa chín vào tháng 5 và tháng 6 là thời khắc thu hút đông đảo nhiếp ảnh gia và du khách quốc tế đến với Ninh Bình."
                : "The golden harvest in May and June turns Tam Coc into one of the most photographed river landscapes in Southeast Asia."}
            </figcaption>
          </figure>
        </section>

        {/* Section 3: Transportation */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Bus size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "3. Cách di chuyển đến Ninh Bình & Đi lại tham quan"
                : "3. How to Get to Ninh Binh & Local Transit"}
            </span>
          </h2>

          <p className="nb-section-desc">
            {isVi
              ? "Nằm trên trục Quốc lộ 1A và tuyến đường sắt Bắc – Nam, việc đi lại giữa Hà Nội và Ninh Bình vô cùng thuận tiện:"
              : "Strategically located along National Highway 1A and the North-South railway, travelling to Ninh Binh from Hanoi is remarkably seamless:"}
          </p>

          <div className="nb-season-grid">
            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Bus size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Xe Limousine chất lượng cao" : "Luxury Limousine Van"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Lựa chọn phổ biến và tiện nghi nhất. Đón trả tận nơi tại phố cổ Hà Nội hoặc sân bay Nội Bài thẳng về khách sạn Ninh Bình. Giá vé từ 150.000 – 220.000 ₫/lượt, thời gian chỉ 1.5 giờ."
                  : "The most comfortable choice. Pick-up directly from Hanoi Old Quarter or Noi Bai Airport to your hotel in Ninh Binh (150,000–220,000 VND / ~1.5 hours)."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Train size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Tàu hỏa Bắc – Nam" : "Express Train"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Xuất phát từ ga Hà Nội đến ga Ninh Bình mất hơn 1 tiếng. Giá vé từ 90.000 – 180.000 ₫ tùy hạng ghế ngồi mềm điều hòa. Rất an toàn và ngắm cảnh đồng quê yên bình."
                  : "Departing from Hanoi Railway Station to Ninh Binh Station in roughly 1 hour 15 mins (90,000–180,000 VND). Scenic, leisurely, and reliable."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Compass size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Thuê xe máy & Xe đạp tại chỗ" : "Motorbike & Bicycle Rental"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Hầu hết homestay và khách sạn đều có dịch vụ cho thuê xe máy (100.000 – 150.000 ₫/ngày) hoặc xe đạp (50.000 ₫/ngày) để tự do len lỏi qua các con đường làng thơ mộng."
                  : "Virtually all homestays offer motorbike rentals (100,000–150,000 VND/day) or bicycles (50,000 VND/day) to cycle past lotus ponds and jagged cliffs."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Accommodation */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Bed size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "4. Khách sạn & Khu vực nên ở tại Ninh Bình"
                : "4. Where to Stay in Ninh Binh"}
            </span>
          </h2>

          <p className="nb-section-desc">
            {isVi
              ? "Hệ sinh thái lưu trú tại Ninh Bình rất đa dạng, từ khu resort sinh thái hòa vào thiên nhiên đến các căn homestay mộc mạc bên hồ sen:"
              : "Ninh Binh features a rich selection of lodging options, ranging from luxury eco-resorts nestled against limestone karsts to cozy waterside village homestays:"}
          </p>

          <div className="nb-season-grid">
            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Bed size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Homestay Tam Cốc & Tràng An" : "Tam Coc & Trang An Homestays"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Khu vực được du khách yêu thích nhất. Không gian mở view núi đá và hồ sen, giá từ 250.000 – 600.000 ₫/đêm. Không khí trong lành, đạp xe dạo chơi rất tuyệt."
                  : "The most atmospheric area, surrounded by dramatic limestone peaks and lotus lagoons (250,000–600,000 VND/night). Perfect for cycling and relaxation."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <Sparkles size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Resort nghỉ dưỡng cao cấp" : "Luxury Heritage Resorts"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Emeralda Resort Ninh Binh (Gia Viễn) hoặc Ninh Binh Hidden Charm Hotel & Resort là hai lựa chọn chuẩn mực 4–5 sao với spa, hồ bơi và kiến trúc làng quê Bắc Bộ tinh tế."
                  : "Emeralda Resort Ninh Binh and Ninh Binh Hidden Charm provide upscale 4–5 star luxury with world-class spas and authentic Tonkin village architecture."}
              </p>
            </div>

            <div className="nb-season-card">
              <div className="nb-season-card__top">
                <div className="nb-season-card__icon-wrap">
                  <MapPin size={20} />
                </div>
                <h3 className="nb-season-card__title">
                  {isVi ? "Khách sạn trung tâm TP Ninh Bình" : "Ninh Binh City Center"}
                </h3>
              </div>
              <p className="nb-season-card__text">
                {isVi
                  ? "Gần ga tàu, bến xe, nhiều nhà hàng đặc sản và quán cà phê sôi động về đêm. Phù hợp cho những ai tìm kiếm mức giá tiết kiệm và thuận tiện di chuyển."
                  : "Conveniently located near the train station, with abundant local restaurants, banks, and night dining options at accessible rates."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Top 10 Attractions */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Camera size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "5. Top 10 điểm tham quan đẹp nhất Ninh Bình"
                : "5. Top 10 Attractions in Ninh Binh"}
            </span>
          </h2>

          <p className="nb-section-desc">
            {isVi
              ? "Dưới đây là 10 thắng cảnh và di tích mang tính biểu tượng nhất định phải ghé thăm khi đặt chân tới Ninh Bình:"
              : "Here are the 10 most iconic scenic marvels and cultural treasures you must experience when exploring Ninh Binh:"}
          </p>

          <div className="nb-attractions-list">
            {/* 1. Bai Dinh */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">1</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Chùa Bái Đính" : "Bai Dinh Pagoda"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Kỷ lục châu Á" : "Asian Record Holder"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/bai-dinh.jpg"
                  alt={isVi ? "Chùa Bái Đính Ninh Bình" : "Bai Dinh Pagoda complex in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Chùa Bái Đính là quần thể tâm linh lớn nhất Đông Nam Á, tọa lạc trên sườn núi Bái Đính xã Gia Sinh, huyện Gia Viễn. Ngôi chùa sở hữu lịch sử hơn 1.000 năm gắn liền với ba triều đại Đinh, Tiền Lê, Lý. Quần thể chùa mới nổi bật với 8 kỷ lục quốc gia và châu Á: tượng Phật bằng đồng dát vàng lớn nhất châu Á, hành lang 500 tượng La Hán bằng đá xanh dài nhất, đại hồng chung lớn nhất Việt Nam."
                    : "Bai Dinh Pagoda is the largest spiritual Buddhist complex in Southeast Asia, perched upon Bai Dinh Mountain in Gia Vien District. Associated with the ancient Dinh, Early Le, and Ly dynasties, it holds 8 Vietnamese and Asian records, including the tallest bronze Buddha statue in Asia, a 3km corridor of 500 stone Arhat statues, and Southeast Asia's largest bronze Maitreya statue."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Vé vào cổng:" : "Entrance Fee:"}</strong>{" "}
                      {isVi
                        ? "Miễn phí vé tham quan; Xe điện di chuyển: 30.000 ₫/lượt; Vé lên Bảo Tháp: 50.000 ₫."
                        : "Free general admission; Electric shuttle buggy: 30,000 VND/way; Stupa tower access: 50,000 VND."}
                    </span>
                  </li>
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Lưu ý trang phục:" : "Dress Code:"}</strong>{" "}
                      {isVi
                        ? "Trang phục lịch sự, kín đáo (quần dài hoặc váy qua đầu gối, áo có tay) khi vào chiêm bái các điện thờ."
                        : "Modest attire required (covered shoulders and knees) inside prayer halls and shrines."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 2. Trang An */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">2</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Quần thể danh thắng Tràng An" : "Trang An Landscape Complex"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Di sản thế giới kép UNESCO" : "UNESCO Dual World Heritage"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/trang-an.jpg"
                  alt={isVi ? "Quần thể danh thắng Tràng An Ninh Bình" : "Trang An Landscape Complex in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Từng xuất hiện trong bom tấn Hollywood 'Kong: Skull Island', Tràng An là Di sản thế giới kép đầu tiên và duy nhất tại Đông Nam Á được UNESCO công nhận. Du khách sẽ được ngồi trên những chiếc thuyền nan truyền thống xuôi dòng sông Sào Khê, luồn lách qua các hang động thạch nhũ kỳ bí (Hang Địa Linh, Hang Ba Giọt, Hang Nấu Rượu) và ghé thăm đền Trình, đền Trần linh thiêng."
                    : "Featured in the Hollywood blockbuster 'Kong: Skull Island', Trang An is Southeast Asia's first and only UNESCO Dual World Heritage site, recognized for both cultural and natural criteria. Traditional hand-rowed sampan boats guide visitors through emerald river canyons, mystical limestone water caves, and secluded temples."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé thuyền:" : "Boat Tour Ticket:"}</strong>{" "}
                      {isVi
                        ? "250.000 ₫/người lớn, 120.000 ₫/trẻ em (hành trình thuyền 3 – 3.5 giờ, chọn Tuyến 1, 2 hoặc 3)."
                        : "250,000 VND / adult, 120,000 VND / child (3–3.5 hour tour along Route 1, 2, or 3)."}
                    </span>
                  </li>
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Thời điểm khuyên chọn:" : "Best Timing:"}</strong>{" "}
                      {isVi
                        ? "Nên đi vào buổi sáng sớm (7h30 – 9h00) để tránh nắng và tận hưởng mặt nước tĩnh lặng như gương."
                        : "Embark early morning (7:30 – 9:00 AM) to beat the afternoon heat and enjoy glassy reflections."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 3. Tam Coc - Bich Dong */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">3</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Tam Cốc – Bích Động" : "Tam Coc – Bich Dong"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Nam thiên đệ nhị động" : "Vietnam's Iconic Waterway"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/tam-coc.jpg"
                  alt={isVi ? "Tam Cốc Bích Động Ninh Bình" : "Tam Coc - Bich Dong scenery in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Tam Cốc (nghĩa là Ba Hang: Hang Cả, Hang Hai, Hang Ba) được thiên nhiên tạo tác ôm trọn lấy dòng sông Ngô Đồng. Điều độc đáo nhất là những người chèo thuyền địa phương có kỹ năng chèo thuyền bằng chân điêu luyện. Ngay cạnh Tam Cốc là Chùa Bích Động – 'Nam thiên đệ nhị động' cổ kính nép mình lưng chừng vách đá với cây cầu đá bắc qua hồ sen trứ danh."
                    : "Tam Coc ('Three Caves': Hang Ca, Hang Hai, Hang Ba) is carved by the Ngo Dong River winding through karst cliffs and rice paddies. Local boat rowers famously navigate using their feet. Nearby Bich Dong Pagoda, dubbed the 'Second Most Beautiful Cave in Vietnam', is an ancient temple nestled inside the mountainside behind a picturesque stone bridge."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé tham quan:" : "Ticket & Boat Fare:"}</strong>{" "}
                      {isVi
                        ? "Vé thắng cảnh: 120.000 ₫/người; Vé thuyền: 150.000 ₫/thuyền (tối đa 2 khách quốc tế hoặc 4 khách Việt)."
                        : "Sightseeing fee: 120,000 VND / person; Boat fare: 150,000 VND / boat."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 4. Hoa Lu Ancient Capital */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">4</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Cố đô Hoa Lư" : "Hoa Lu Ancient Capital"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Kinh đô ngàn năm" : "First Imperial Capital"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/hoa-lu.jpg"
                  alt={isVi ? "Cố đô Hoa Lư Ninh Bình" : "Hoa Lu Ancient Capital in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Hoa Lư là kinh đô đầu tiên của nhà nước phong kiến trung ương tập quyền Đại Cồ Việt thế kỷ thứ 10 dưới thời vua Đinh Tiên Hoàng và Lê Đại Hành. Nằm lọt giữa thung lũng đá vôi kiên cố như bức tường thành tự nhiên, khu di tích còn lưu giữ nguyên vẹn Đền thờ vua Đinh, Đền thờ vua Lê với các tác phẩm điêu khắc gỗ và đá tinh xảo."
                    : "Hoa Lu served as the first imperial capital of the feudal centralized state of Dai Co Viet in the 10th century under King Dinh Tien Hoang and King Le Dai Hanh. Sheltered by natural limestone ramparts, the complex preserves the sacred King Dinh and King Le temples, featuring intricate stone dragons and ancient courtyards."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé:" : "Entrance Ticket:"}</strong> 20.000 ₫/người.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 5. Mua Cave */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">5</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Hang Múa (Đỉnh Ngọa Long)" : "Mua Cave & Dragon Peak"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "View ngắm cảnh đẹp nhất" : "Ultimate Viewpoint"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/hang-mua.jpg"
                  alt={isVi ? "Đỉnh Hang Múa ngắm toàn cảnh Tam Cốc" : "Panoramic viewpoint from top of Mua Cave, Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Được ví như 'Vạn Lý Trường Thành thu nhỏ' của Việt Nam, Hang Múa thử thách du khách với gần 500 bậc thang đá uốn lượn men theo vách núi thẳng đứng. Đặt chân lên đỉnh Ngọa Long với tượng rồng đá kiêu hãnh, bạn sẽ thu trọn vào tầm mắt toàn cảnh thung lũng Tam Cốc xanh mướt và những dòng thuyền trôi lững lờ bên dưới."
                    : "Dubbed Vietnam's 'Miniature Great Wall', Mua Cave challenges hikers with nearly 500 winding stone steps clinging to jagged crags. At the summit of Ngoa Long Mountain, beside an imposing stone dragon statue, you are rewarded with panoramic 360-degree vistas of Tam Coc's emerald river valleys."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé tham quan:" : "Ticket:"}</strong> 100.000 ₫/người.
                    </span>
                  </li>
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Mẹo leo núi:" : "Hiking Tip:"}</strong>{" "}
                      {isVi
                        ? "Nên leo lúc bình minh (6h00 – 7h30) hoặc hoàng hôn (16h30 – 17h30) để ngắm ánh chiều tà rực rỡ và tránh nắng gắt."
                        : "Hike at sunrise or late afternoon for breathtaking golden hour light and cooler climbing weather."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 6. Am Tien Cave */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">6</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Động Am Tiên (Tuyệt Tình Cốc)" : "Am Tien Cave (Tuyet Tinh Coc)"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Thung lũng ngọc bích" : "Hidden Emerald Valley"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/am-tien.jpg"
                  alt={isVi ? "Động Am Tiên Tuyệt Tình Cốc Ninh Bình" : "Am Tien Cave emerald lake in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Động Am Tiên nằm lọt thỏm giữa lòng thung lũng khép kín, được bao bọc bởi những dãy núi đá vôi dựng đứng và hồ nước xanh trong màu ngọc bích quanh năm. Tương truyền nơi đây từng là pháp trường và nơi nuôi hổ báo thời vua Đinh. Vẻ đẹp trầm mặc, u tịch và cổng thành cổ kính khiến nơi này được mệnh danh là 'Tuyệt Tình Cốc' của Ninh Bình."
                    : "Am Tien Cave is nestled inside a secluded, bowl-shaped valley completely encircled by towering limestone walls and an emerald-green lake. Historically used as an imperial judicial dungeon and royal monastery during the Dinh Dynasty, its serene reflection and fortress gate evoke a mystical martial arts sanctuary."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé:" : "Entrance:"}</strong> 50.000 ₫/người.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 7. Cuc Phuong National Park */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">7</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Vườn quốc gia Cúc Phương" : "Cuc Phuong National Park"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Rừng nguyên sinh lâu đời nhất" : "First National Park"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/cuc-phuong.jpg"
                  alt={isVi ? "Vườn quốc gia Cúc Phương Ninh Bình" : "Cuc Phuong National Park rainforest, Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Cách thành phố Ninh Bình 45 km, Cúc Phương là vườn quốc gia đầu tiên của Việt Nam với diện tích 25.000 ha trải dài qua 3 tỉnh. Nơi đây là bảo tàng sống bảo tồn cây chò ngàn năm tuổi, trung tâm cứu hộ linh trưởng quý hiếm và hang động người tiền sử. Đặc biệt vào tháng 4 – tháng 5, hàng triệu cánh bướm trắng bay rợp trời tạo nên khung cảnh cổ tích."
                    : "Located 45 km northwest of Ninh Binh, Cuc Phuong is Vietnam's oldest national park (spanning 25,000 hectares). It preserves ancient thousand-year-old trees, endangered primate rescue centers, and prehistoric caves. During April and May, millions of colorful butterflies swarm the forest trails in a fairytale spectacle."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé vào cổng:" : "Park Admission:"}</strong> 60.000 ₫/người lớn, 10.000 ₫/trẻ em.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 8. Phat Diem Stone Church */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">8</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Nhà thờ đá Phát Diệm" : "Phat Diem Stone Cathedral"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Kiệt tác kiến trúc Á – Âu" : "Sino-Gothic Masterpiece"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/phat-diem.jpg"
                  alt={isVi ? "Nhà thờ đá Phát Diệm Kim Sơn Ninh Bình" : "Phat Diem Stone Cathedral in Kim Son, Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Nằm tại thị trấn Phát Diệm, huyện Kim Sơn, đây là công trình kiến trúc Công giáo độc nhất vô nhị trên thế giới khi kết hợp hoàn hảo giữa phong cách nhà thờ phương Tây với mái cong đình chùa truyền thống Á Đông. Quần thể được xây dựng ròng rã suốt 30 năm hoàn toàn bằng đá xanh nguyên khối và gỗ lim khổng lồ."
                    : "Located in Kim Son District, Phat Diem Cathedral is a global architectural marvel blending Roman Catholic cathedral design with traditional Vietnamese Buddhist pagoda curves. Built over 30 years using entirely solid blue limestone slabs and massive ironwood pillars, it is widely hailed as the capital of Vietnamese Catholicism."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Vé tham quan:" : "Admission:"}</strong> {isVi ? "Miễn phí vé tham quan." : "Free admission."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 9. Thung Nham */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">9</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Vườn chim Thung Nham" : "Thung Nham Bird Valley"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Khu sinh thái hoang dã" : "Avian Sanctuary"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/thung-nham.jpg"
                  alt={isVi ? "Vườn chim Thung Nham Ninh Bình" : "Thung Nham Bird Sanctuary in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Với diện tích hơn 334 ha, Thung Nham là nơi cư ngụ của hơn 46 loài chim với khoảng 50.000 cá thể (trong đó có cò, vạc, hằng hạc và sếu đầu đỏ ghi trong Sách Đỏ). Đi thuyền trên đầm lầy lúc hoàng hôn (17h00) để ngắm từng đàn chim chao lượn rợp trời trở về tổ là một trong những trải nghiệm bình yên và xúc động nhất."
                    : "Spanning over 334 hectares, Thung Nham is home to 46 bird species comprising roughly 50,000 birds, including storks, herons, and endangered cranes. Taking an afternoon boat tour around 5:00 PM to watch vast flocks swoop home to roost against the sunset is a truly magical wilderness encounter."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé trọn gói:" : "All-inclusive Ticket:"}</strong> 150.000 ₫/người lớn (bao gồm thuyền thăm vườn chim và các hang động).
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 10. Van Long */}
            <article className="nb-attraction-card">
              <div className="nb-attraction-card__header">
                <div className="nb-attraction-card__title-wrap">
                  <div className="nb-attraction-card__num">10</div>
                  <h3 className="nb-attraction-card__title">
                    {isVi ? "Đầm Vân Long" : "Van Long Wetland Nature Reserve"}
                  </h3>
                </div>
                <span className="nb-attraction-card__badge">
                  {isVi ? "Vùng ngập nước lớn nhất miền Bắc" : "Pristine Wetland Sanctuary"}
                </span>
              </div>
              <div className="nb-attraction-card__media">
                <img
                  src="/guide/ninh-binh/van-long.jpg"
                  alt={isVi ? "Đầm Vân Long khu bảo tồn thiên nhiên đất ngập nước" : "Van Long Wetland Reserve, Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-attraction-card__body">
                <p className="nb-attraction-card__desc">
                  {isVi
                    ? "Đầm Vân Long là khu bảo tồn thiên nhiên đất ngập nước lớn nhất Đồng bằng Bắc Bộ. Khác với sự tấp nập của Tràng An, Vân Long mang vẻ đẹp nguyên sơ, tĩnh lặng tuyệt đối. Mặt nước phẳng lặng như tấm gương khổng lồ soi bóng núi đá vôi Mèo Cào, Núi Mâm Xôi. Nơi đây hiện bảo tồn quần thể voọc mông trắng (Delacour’s langur) lớn nhất thế giới đang có nguy cơ tuyệt chủng."
                    : "Van Long is the largest wetland nature reserve in the Red River Delta. Far less commercialized than Trang An, it offers mirror-like flat waters reflecting soaring limestone peaks. It is the premier habitat for the critically endangered Delacour's langur monkey, often spotted leaping across cliff faces."}
                </p>
                <ul className="nb-attraction-card__meta-list">
                  <li className="nb-attraction-card__meta-item">
                    <CheckCircle2 className="nb-attraction-card__meta-icon" size={17} />
                    <span>
                      <strong>{isVi ? "Giá vé & Thuyền nan:" : "Ticket & Boat:"}</strong> 100.000 ₫/người.
                    </span>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* Section 6: Food & Specialties */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Utensils size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "6. Top 5 món ngon đặc sản nhất định phải thử tại Ninh Bình"
                : "6. Top 5 Must-Try Culinary Dishes in Ninh Binh"}
            </span>
          </h2>

          <p className="nb-section-desc">
            {isVi
              ? "Ẩm thực Ninh Bình đậm đà phong vị đồng quê Bắc Bộ kết hợp sản vật núi đá vôi tự nhiên:"
              : "Ninh Binh cuisine reflects the hearty, aromatic flavors of the northern countryside, utilizing unique pasture-grazed mountain produce:"}
          </p>

          <div className="nb-dishes-grid">
            {/* Dish 1: Com Chay */}
            <div className="nb-dish-card">
              <div className="nb-dish-card__media">
                <img
                  src="/guide/ninh-binh/com-chay.jpg"
                  alt={isVi ? "Cơm cháy Ninh Bình" : "Crispy burned rice in Ninh Binh"}
                  loading="lazy"
                />
              </div>
              <div className="nb-dish-card__body">
                <h3 className="nb-dish-card__title">
                  {isVi ? "1. Cơm cháy giòn rụm chà bông" : "1. Crispy Burned Rice (Com Chay)"}
                </h3>
                <p className="nb-dish-card__desc">
                  {isVi
                    ? "Đặc sản nức tiếng số một của đất Ninh Bình. Gạo nếp hương được nấu cháy vàng ươm, sấy khô rồi chiên ngập dầu giòn tan, ăn kèm ruốc thịt và chấm nước sốt tim cật dê béo ngậy."
                    : "Ninh Binh's signature culinary gift. Fragrant glutinous rice crusts are crisped in hot oil to golden perfection, topped with shredded pork floss and dipped in savory, piping-hot goat heart sauce."}
                </p>
                <div className="nb-dish-card__spots">
                  <strong>{isVi ? "Quán ngon gợi ý:" : "Recommended Spots:"}</strong>
                  • Nhà hàng Thăng Long (Trường Yên, Hoa Lư)<br />
                  • Nhà hàng Hoàng Giang (Hang Cả, Hoa Lư)
                </div>
              </div>
            </div>

            {/* Dish 2: Thit De */}
            <div className="nb-dish-card">
              <div className="nb-dish-card__media">
                <img
                  src="/guide/ninh-binh/de-nui.jpg"
                  alt={isVi ? "Thịt dê núi Hoa Lư Ninh Bình" : "Hoa Lu Mountain Goat Meat"}
                  loading="lazy"
                />
              </div>
              <div className="nb-dish-card__body">
                <h3 className="nb-dish-card__title">
                  {isVi ? "2. Thịt dê núi Hoa Lư" : "2. Hoa Lu Mountain Goat Meat"}
                </h3>
                <p className="nb-dish-card__desc">
                  {isVi
                    ? "Dê Ninh Bình được chăn thả tự nhiên trên các vách núi đá vôi, ăn cỏ cây thuốc quý nên thịt rất chắc, ngọt và thơm. Các món nổi bật: Dê tái chanh kẹp lá sung, dê nướng tảng, lẩu dê ngải cứu."
                    : "Locally grazed on jagged limestone cliffs, Ninh Binh goat meat is exceptionally lean, tender, and fragrant. Popular variations include lime-cured goat with wild fig leaves, grilled goat, and herbal hotpot."}
                </p>
                <div className="nb-dish-card__spots">
                  <strong>{isVi ? "Quán ngon gợi ý:" : "Recommended Spots:"}</strong>
                  • Nhà hàng Đức Dê (446 Nguyễn Huệ, TP. Ninh Bình)<br />
                  • Nhà hàng Chính Thư (Thôn Khê Thượng, Ninh Xuân)
                </div>
              </div>
            </div>

            {/* Dish 3: Nem Yen Mac */}
            <div className="nb-dish-card">
              <div className="nb-dish-card__media">
                <img
                  src="/guide/ninh-binh/hero.jpg"
                  alt={isVi ? "Nem chua Yên Mạc Ninh Bình" : "Yen Mac fermented pork roll"}
                  loading="lazy"
                />
              </div>
              <div className="nb-dish-card__body">
                <h3 className="nb-dish-card__title">
                  {isVi ? "3. Nem chua Yên Mạc" : "3. Yen Mac Fermented Pork (Nem Yen Mac)"}
                </h3>
                <p className="nb-dish-card__desc">
                  {isVi
                    ? "Đặc sản tiến vua truyền thống bắt nguồn từ cung đình Huế thời xưa. Thịt nạc mông và bì lợn thái sợi mảnh được lên men thính gạo, cuốn lá ổi chấm nước mắm chanh tỏi ớt cay nồng."
                    : "A historic royal delicacy made from finely shredded pork skin and lean pork naturally fermented with roasted rice flour, wrapped with fresh guava leaves and dipped in piquant chili garlic sauce."}
                </p>
                <div className="nb-dish-card__spots">
                  <strong>{isVi ? "Quán ngon gợi ý:" : "Recommended Spots:"}</strong>
                  • Làng nghề truyền thống Yên Mạc, huyện Yên Mô, Ninh Bình
                </div>
              </div>
            </div>

            {/* Dish 4: Mien Luon */}
            <div className="nb-dish-card">
              <div className="nb-dish-card__media">
                <img
                  src="/guide/ninh-binh/map.jpg"
                  alt={isVi ? "Miến lươn Ninh Bình" : "Ninh Binh Eel Vermicelli"}
                  loading="lazy"
                />
              </div>
              <div className="nb-dish-card__body">
                <h3 className="nb-dish-card__title">
                  {isVi ? "4. Miến lươn bà Phấn" : "4. Ninh Binh Eel Vermicelli"}
                </h3>
                <p className="nb-dish-card__desc">
                  {isVi
                    ? "Lươn đồng được rim theo công thức bí truyền gia truyền giúp thịt ngọt thơm, không tanh, nước dùng ninh từ xương lươn sánh ngọt đậm đà, ăn kèm hoa chuối thái mỏng và rau kinh giới."
                    : "Fresh field eel simmered with heritage spices creates a richly savory broth paired with glass noodles, fresh herbs, and finely sliced banana blossoms."}
                </p>
                <div className="nb-dish-card__spots">
                  <strong>{isVi ? "Quán ngon gợi ý:" : "Recommended Spots:"}</strong>
                  • Miến lươn bà Phấn (999 Trần Hưng Đạo, Vân Giang, TP. Ninh Bình)
                </div>
              </div>
            </div>

            {/* Dish 5: Xoi Trung Kien */}
            <div className="nb-dish-card">
              <div className="nb-dish-card__media">
                <img
                  src="/guide/ninh-binh/weather.jpg"
                  alt={isVi ? "Xôi trứng kiến Nho Quan" : "Sticky Rice with Ants' Eggs"}
                  loading="lazy"
                />
              </div>
              <div className="nb-dish-card__body">
                <h3 className="nb-dish-card__title">
                  {isVi ? "5. Xôi trứng kiến Nho Quan" : "5. Sticky Rice with Ants' Eggs"}
                </h3>
                <p className="nb-dish-card__desc">
                  {isVi
                    ? "Món ăn độc đáo của đồng bào vùng cao Nho Quan. Trứng kiến đen trên vách đá được phi thơm với mỡ hành, trộn đều cùng xôi nếp dẻo thơm lừng béo ngậy tạo dư vị khó quên."
                    : "An exotic highland delicacy from Nho Quan District. Black forest ant eggs are gently pan-fried with shallots and lard, then folded into fragrant steamed sticky rice."}
                </p>
                <div className="nb-dish-card__spots">
                  <strong>{isVi ? "Quán ngon gợi ý:" : "Recommended Spots:"}</strong>
                  • Các nhà hàng ẩm thực dân tộc tại thị trấn Nho Quan, Ninh Bình
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Festivals */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <Sparkles size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "7. Các lễ hội truyền thống đặc sắc tại Ninh Bình"
                : "7. Traditional Festivals in Ninh Binh"}
            </span>
          </h2>

          <div className="nb-festival-list">
            <div className="nb-festival-item">
              <div className="nb-festival-header">
                <div className="nb-festival-name">
                  {isVi ? "1. Lễ hội Tràng An" : "1. Trang An Festival"}
                </div>
                <div className="nb-festival-date">
                  {isVi ? "18 tháng 3 Âm lịch" : "18th day of 3rd lunar month"}
                </div>
              </div>
              <p className="nb-festival-desc">
                {isVi
                  ? "Tôn vinh công đức của Đức Thánh Quý Minh Đại Vương. Hàng trăm con thuyền rước kiệu lộng lẫy xuôi dòng sông Sào Khê cùng các điệu múa cờ và hòa tấu nhã nhạc giữa đại ngàn non nước."
                  : "Honors Saint Quy Minh Dai Vuong. Hundreds of dragon boats glide in ornate flotilla processions along the Sao Khe River with traditional folk music performances."}
              </p>
            </div>

            <div className="nb-festival-item">
              <div className="nb-festival-header">
                <div className="nb-festival-name">
                  {isVi ? "2. Lễ hội chùa Bái Đính" : "2. Bai Dinh Pagoda Festival"}
                </div>
                <div className="nb-festival-date">
                  {isVi ? "Mùng 6 tháng Giêng đến hết tháng 3 Âm lịch" : "6th of Tet through 3rd lunar month"}
                </div>
              </div>
              <p className="nb-festival-desc">
                {isVi
                  ? "Khai xuân rực rỡ tại vùng đất Phật, thu hút hàng triệu tăng ni phật tử hành hương về cầu quốc thái dân an, chiêm ngưỡng các trích đoạn chèo tái hiện lễ tế cờ của vua Đinh Tiên Hoàng."
                  : "Opens the grand spring pilgrimage to Buddha land, featuring elaborate Buddhist ceremonies and traditional Cheo opera recreating King Dinh Tien Hoang's historic battle rituals."}
              </p>
            </div>

            <div className="nb-festival-item">
              <div className="nb-festival-header">
                <div className="nb-festival-name">
                  {isVi ? "3. Lễ hội Cố đô Hoa Lư (Hội Trường Yên)" : "3. Hoa Lu Ancient Capital Festival"}
                </div>
                <div className="nb-festival-date">
                  {isVi ? "Mùng 6 – 8 tháng 3 Âm lịch" : "6th – 8th of 3rd lunar month"}
                </div>
              </div>
              <p className="nb-festival-desc">
                {isVi
                  ? "Tưởng niệm hai vị hoàng đế Đinh Tiên Hoàng và Lê Đại Hành. Nghi thức rước nước thiêng sông Hoàng Long và thả đèn hoa đăng lung linh mặt nước sông Sào Khê vào ban đêm là khoảnh khắc kỳ ảo nhất."
                  : "Commemorates Emperor Dinh and Emperor Le with sacred river water processions, martial arts games, and thousands of glowing flower lanterns released onto the nighttime river."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Golden Combo Tip */}
        <section className="nb-section">
          <div className="nb-combo-box">
            <div className="nb-combo-box__title">
              <Info size={22} />
              <span>
                {isVi
                  ? "Tam giác vàng du lịch: Hà Nội – Vịnh Hạ Long – Ninh Bình"
                  : "The Golden Triangle Route: Hanoi – Ha Long Bay – Ninh Binh"}
              </span>
            </div>
            <p className="nb-combo-box__text">
              {isVi
                ? "Đối với du khách quốc tế và tự túc, cung đường 'Hà Nội – Hạ Long – Ninh Bình' là hành trình lý tưởng và trọn vẹn nhất để chiêm ngưỡng trọn vẹn cả di sản biển đảo lẫn di sản trên cạn của miền Bắc:"
                : "For travelers visiting Northern Vietnam, connecting Hanoi, Ha Long Bay, and Ninh Binh offers the ultimate seamless itinerary combining coastal limestone bays and emerald mountain valleys:"}
            </p>
            <div className="nb-combo-routes">
              <div className="nb-combo-route-item">
                <strong>{isVi ? "Hà Nội → Ninh Bình:" : "Hanoi → Ninh Binh:"}</strong><br />
                {isVi
                  ? "Chỉ 1.5 giờ xe limousine cao tốc (150.000 – 200.000 ₫)."
                  : "1.5 hours via express highway limousine (150k–200k VND)."}
              </div>
              <div className="nb-combo-route-item">
                <strong>{isVi ? "Hạ Long → Ninh Bình:" : "Ha Long Bay → Ninh Binh:"}</strong><br />
                {isVi
                  ? "Xe khách hoặc limousine đón thẳng cảng Tuần Châu đến Tam Cốc (~3.5 giờ, 250.000 – 350.000 ₫)."
                  : "Direct daily tourist bus connecting Tuan Chau Port and Tam Coc (3.5 hours, ~300k VND)."}
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: FAQs */}
        <section className="nb-section">
          <h2 className="nb-section-title">
            <HelpCircle size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi
                ? "Câu hỏi thường gặp khi du lịch Ninh Bình"
                : "Frequently Asked Questions (FAQ)"}
            </span>
          </h2>

          <div className="accom-faq-list">
            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(1)}
              >
                <span>
                  {isVi
                    ? "1. Nên đi du lịch Ninh Bình trong bao lâu là hợp lý?"
                    : "1. How many days should I spend in Ninh Binh?"}
                </span>
                {openFaq === 1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 1 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Lịch trình 2 ngày 1 đêm là lý tưởng nhất để khám phá trọn vẹn các điểm nhấn chính: Ngày 1 (Tràng An, Hang Múa, Cố đô Hoa Lư); Ngày 2 (Chùa Bái Đính hoặc Đầm Vân Long, đạp xe quanh Tam Cốc). Nếu có nhiều thời gian, 3 ngày 2 đêm sẽ giúp bạn ghé thăm thêm Vườn quốc gia Cúc Phương và Nhà thờ đá Phát Diệm."
                    : "A 2-day, 1-night itinerary is ideal for hitting all major highlights: Day 1 (Trang An boat tour, Mua Cave viewpoint, Hoa Lu); Day 2 (Bai Dinh Pagoda or Van Long Lagoon, cycling Tam Coc). With 3 days, you can comfortably add Cuc Phuong National Park and Phat Diem Stone Cathedral."}
                </div>
              )}
            </div>

            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(2)}
              >
                <span>
                  {isVi
                    ? "2. Nên chọn đi thuyền ở Tràng An hay Tam Cốc?"
                    : "2. Should I choose the boat tour in Trang An or Tam Coc?"}
                </span>
                {openFaq === 2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 2 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Cả hai đều rất đẹp nhưng mang phong cách khác nhau: Tràng An có quy mô đồ sộ hơn, hệ thống hang động xuyên thủy dài và các đền phủ tâm linh tráng lệ. Tam Cốc mang nét đẹp mộc mạc làng quê với dòng sông uốn lượn sát ruộng lúa và người dân chèo đò bằng chân độc đáo (đặc biệt rực rỡ vào mùa lúa chín tháng 5 – 6)."
                    : "Both are majestic: Trang An offers larger cave systems and historic temples in a UNESCO-protected route. Tam Coc offers a more rustic countryside feel passing directly through rice paddies with unique foot-rowing boatmen (unmissable during the golden harvest in May/June)."}
                </div>
              )}
            </div>

            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(3)}
              >
                <span>
                  {isVi
                    ? "3. Cần chuẩn bị những gì khi đi thuyền tham quan Ninh Bình?"
                    : "3. What should I prepare for a boat tour in Ninh Binh?"}
                </span>
                {openFaq === 3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 3 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Mỗi chuyến thuyền kéo dài từ 2 đến 3 tiếng trên sông nước, bạn nên chuẩn bị: nón lá hoặc mũ che nắng, kem chống nắng, ô dù nhỏ, nước uống đóng chai, và áo phao an toàn (bắt buộc phải mặc khi thuyền xuất bến)."
                    : "Because boat tours last 2 to 3.5 hours on open water, bring sun hats or umbrellas, sunscreen, bottled water, and always wear the provided life jacket while on board."}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 10: Verified Related Guides */}
        <section className="nb-section" style={{ marginTop: "4rem" }}>
          <h2 className="nb-section-title">
            <Compass size={24} style={{ color: "#099f8a" }} />
            <span>
              {isVi ? "Cẩm nang du lịch liên quan" : "Related Travel Guides"}
            </span>
          </h2>

          <div className="accom-related-grid">
            {RELATED_ARTICLES.map((art) => (
              <Link
                key={art.slug}
                href={`/guide/${art.slug}`}
                className="accom-related-card"
              >
                <div className="accom-related-thumb">
                  <img
                    src={art.img}
                    alt={isVi ? art.titleVi : art.title}
                    loading="lazy"
                  />
                  <span
                    className="accom-related-badge"
                    style={{ background: "rgba(9, 159, 138, 0.9)" }}
                  >
                    {isVi ? art.badgeVi : art.badge}
                  </span>
                </div>
                <div className="accom-related-body">
                  <h3 className="accom-related-title">
                    {isVi ? art.titleVi : art.title}
                  </h3>
                  <p className="accom-related-excerpt">
                    {isVi ? art.excerptVi : art.excerpt}
                  </p>
                  <span
                    className="accom-related-link"
                    style={{ color: "#099f8a" }}
                  >
                    <span>{isVi ? "Xem cẩm nang" : "Read Guide"}</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Chatbot Assistant */}
      <ProvinceChatbot />

      {/* Global Public Footer */}
      <PublicFooter />
    </div>
  );
}
