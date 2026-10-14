"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Home,
  Waves,
  Wifi,
  CreditCard,
  Sun,
  Bed,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "@/styles/home.css";
import "@/styles/guide-editorial.css";
import "@/styles/accommodation-in-vietnam.css";

// ─── VERIFIED EXISTING RELATED ARTICLES ON VINATAP ───
const RELATED_ARTICLES = [
  {
    slug: "where-to-stay-in-ho-chi-minh-city",
    title: "Where to Stay in Ho Chi Minh City",
    titleVi: "Nơi Lưu Trú Tốt Nhất Tại TP. Hồ Chí Minh",
    badge: "CITY GUIDE",
    badgeVi: "CẨM NANG ĐÔ THỊ",
    excerpt:
      "Find your perfect stay in Ho Chi Minh City. Explore top hotels, hostels, and district tips from District 1 to District 3.",
    excerptVi:
      "Gợi ý chi tiết khách sạn, căn hộ và khu vực đáng ở nhất từ Quận 1 sôi động đến Quận 3 yên bình và Thảo Điền ven sông.",
    img: "/guide/hcmc/where-to-stay-in-hcmc-hd.jpg",
  },
  {
    slug: "the-complete-guide-to-vietnam",
    title: "The Complete Guide to Vietnam",
    titleVi: "Cẩm Nang Du Lịch Toàn Diện Việt Nam",
    badge: "ESSENTIAL",
    badgeVi: "CẨM NANG TOÀN DIỆN",
    excerpt:
      "Everything you need to plan an unforgettable journey across Vietnam, from visa regulations to cultural etiquette and transport.",
    excerptVi:
      "Tất cả thông tin quan trọng để lên kế hoạch hành trình khắp Việt Nam từ visa, tiền tệ, phong tục đến ẩm thực đặc sắc.",
    img: "/guide/hcmc/The-Complete-Guide-to-Vietnam.jpg",
  },
  {
    slug: "15-best-places-to-visit-in-vietnam-in-2026",
    title: "15 Best Places to Visit in Vietnam in 2026",
    titleVi: "15 Điểm Đến Đẹp Nhất Việt Nam Năm 2026",
    badge: "TRENDING",
    badgeVi: "XU HƯỚNG 2026",
    excerpt:
      "A curated list of Vietnam's most iconic destinations, scenic highlands, historic towns, and pristine coastal escapes.",
    excerptVi:
      "Danh sách chọn lọc các điểm đến hấp dẫn nhất Việt Nam từ danh thắng Tây Bắc, di sản miền Trung đến biển đảo phương Nam.",
    img: "/guide/15-best-places.jpg",
  },
  {
    slug: "vietnam-visa",
    title: "Vietnam Visa: All Information You Need to Know",
    titleVi: "Thông Tin Visa Việt Nam & Miễn Thị Thực",
    badge: "TRAVEL ESSENTIAL",
    badgeVi: "THỦ TỤC XUẤT NHẬP CẢNH",
    excerpt:
      "Complete guide on 90-day multiple-entry e-Visas, 45-day visa exemptions, and border crossing regulations for international visitors.",
    excerptVi:
      "Hướng dẫn chi tiết chính sách e-Visa 90 ngày, danh sách 13 quốc gia miễn thị thực 45 ngày và kinh nghiệm nhập cảnh an toàn.",
    img: "/guide/visa/vietnam-visa-hero.jpg",
  },
  {
    slug: "vietnamese-currency",
    title: "Vietnamese Currency: Practical Guide for Travelers",
    titleVi: "Cẩm Nang Tiền Tệ & Chi Tiêu Tại Việt Nam",
    badge: "MONEY & BUDGET",
    badgeVi: "TIỀN TỆ & TÀI CHÍNH",
    excerpt:
      "Learn about Vietnamese Dong (VND) polymer banknotes, current exchange rates, ATMs, and cashless payment options.",
    excerptVi:
      "Mẹo nhận biết các mệnh giá tiền polymer Việt Nam, quy đổi tỷ giá, rút tiền ATM và sử dụng thẻ quốc tế thuận tiện.",
    img: "/guide/currency/vietnam-currency-hero.jpg",
  },
  {
    slug: "vietnam-climate",
    title: "Vietnam's Climate & Weather Guide for 3 Regions",
    titleVi: "Khí Hậu & Thời Tiết Việt Nam 3 Miền",
    badge: "WEATHER & TIMING",
    badgeVi: "THỜI TIẾT 3 MIỀN",
    excerpt:
      "Understand regional climates and seasonal variations across Northern, Central, and Southern Vietnam to pick the best travel time.",
    excerptVi:
      "Nắm bắt thời tiết đặc trưng Bắc - Trung - Nam và các mùa mưa bão để chọn thời điểm du lịch hoàn hảo nhất trong năm.",
    img: "/guide/climate/climate-of-vietnam.jpg",
  },
];

export default function AccommodationInVietnamPage() {
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
          ? "Đã sao chép liên kết vào bộ nhớ tạm!"
          : "Link copied to clipboard!"
      );
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(
      !isBookmarked
        ? lang === "vi"
          ? "Đã lưu bài viết vào danh sách yêu thích!"
          : "Article saved to your bookmarks!"
        : lang === "vi"
        ? "Đã xóa bài viết khỏi mục yêu thích!"
        : "Article removed from bookmarks!"
    );
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isVi = lang === "vi";

  return (
    <div className="guide-page-wrapper accom-page">
      {/* Reading Progress Indicator */}
      <div
        className="guide-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Toast Notification */}
      {toastVisible && (
        <div className="guide-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Navbar */}
      <header className="header">
        <div className="header__container">
          <Link href="/" className="header__logo">
            <Logo size="normal" />
          </Link>
          <nav className="header__nav">
            <Link
              href="/guide/15-best-places-to-visit-in-vietnam-in-2026"
              className="header__nav-item"
            >
              {isVi ? "Cảm hứng" : "Be Inspired"}
            </Link>
            <Link href="/province/da-nang" className="header__nav-item">
              {isVi ? "Điểm đến" : "Destinations"}
            </Link>
            <Link
              href="/guide/20-best-things-to-do-in-vietnam"
              className="header__nav-item"
            >
              {isVi ? "Trải nghiệm" : "Things to Do"}
            </Link>
            <Link
              href="/guide/8-must-try-foods-in-hanoi"
              className="header__nav-item"
            >
              {isVi ? "Ẩm thực" : "Eat & Drink"}
            </Link>
            <Link
              href="/guide/3-week-vietnam-itinerary"
              className="header__nav-item"
            >
              {isVi ? "Lịch trình" : "Itineraries"}
            </Link>
          </nav>
          <div className="header__actions">
            <HeaderSearch />
            <LanguageSwitch />
            <Link href="/login" className="header__login-btn">
              {isVi ? "Đăng nhập" : "Sign In"}
            </Link>
          </div>
        </div>
      </header>

      {/* Sticky Secondary Breadcrumbs Bar */}
      <div className="guide-nav">
        <div className="guide-nav__inner">
          <div className="guide-nav__left">
            <nav className="guide-breadcrumb">
              <Link href="/">{isVi ? "Trang chủ" : "Home"}</Link>
              <ChevronRight size={13} />
              <Link href="/guide/the-complete-guide-to-vietnam">
                {isVi ? "Cẩm nang du lịch" : "Guides"}
              </Link>
              <ChevronRight size={13} />
              <span className="guide-breadcrumb__curr">
                {isVi ? "Lưu trú tại Việt Nam" : "Accommodation in Vietnam"}
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

      {/* Main Content Container */}
      <main className="guide-container">
        {/* Article Header */}
        <header className="guide-header">
          <div className="guide-badge-pill">
            <Hotel size={14} />
            <span>{isVi ? "CẨM NANG LƯU TRÚ" : "ACCOMMODATION GUIDE"}</span>
          </div>

          <h1 className="guide-title">
            {isVi
              ? "Lưu trú tại Việt Nam: Cẩm nang toàn diện cho du khách quốc tế"
              : "Accommodation in Vietnam: A Guide for International Travelers"}
          </h1>

          <p className="guide-subtitle">
            {isVi
              ? "Khám phá các loại hình lưu trú đa dạng tại Việt Nam, từ khu nghỉ dưỡng ven biển sang trọng, khách sạn boutique phố cổ đến homestay bản địa và hostel tiết kiệm, kèm bảng giá chuẩn và mẹo đặt phòng thực tế."
              : "Explore accommodation in Vietnam, from luxury beachfront resorts and boutique heritage hotels to authentic mountain homestays and budget hostels, with typical price ranges, best areas to stay, and essential booking tips."}
          </p>

          <div className="guide-meta-bar">
            <div className="guide-author-box">
              <div className="guide-author-avatar">VT</div>
              <div>
                <div className="guide-author-name">
                  VinaTap Travel Team
                  <span className="guide-verified-badge" title="Đã xác thực">
                    <CheckCircle2 size={14} />
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
                  {isVi ? "Cập nhật: Mới nhất 2026" : "Updated: Latest 2026"}
                </span>
              </div>
              <div className="guide-meta-item">
                <Clock size={14} />
                <span>
                  {isVi ? "Thời gian đọc: 6 phút" : "Read time: 6 mins"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Featured Image */}
        <figure className="accom-figure">
          <img
            src="/guide/accommodation/hero.jpg"
            alt={
              isVi
                ? "Lưu trú tại Việt Nam: Cẩm nang chi tiết cho du khách quốc tế"
                : "Accommodation in Vietnam: A Guide for International Travelers"
            }
            loading="eager"
          />
          <figcaption>
            {isVi
              ? "Hệ thống lưu trú tại Việt Nam phát triển nhanh chóng, kết hợp hài hòa giữa tiện nghi quốc tế và nét duyên dáng bản địa."
              : "Vietnam's hospitality infrastructure offers exceptional diversity, combining international standards with authentic local warmth."}
          </figcaption>
        </figure>

        {/* Key Highlights Card */}
        <div className="accom-snapshot-card">
          <div className="accom-snapshot-title">
            <Sparkles size={20} />
            <span>
              {isVi
                ? "Tóm tắt nhanh cẩm nang lưu trú"
                : "Accommodation at a Glance"}
            </span>
          </div>
          <div className="accom-snapshot-grid">
            <div className="accom-snapshot-item">
              <Bed className="accom-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Đa dạng lựa chọn:" : "Wide Range:"}</strong>{" "}
                {isVi
                  ? "6 nhóm lưu trú từ bình dân đến nghỉ dưỡng 5 sao sang trọng."
                  : "6 primary stay types from budget hostels to ultra-luxury resorts."}
              </div>
            </div>
            <div className="accom-snapshot-item">
              <DollarSign className="accom-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Mức giá hợp lý:" : "Great Value:"}</strong>{" "}
                {isVi
                  ? "$5 - $15/giường dorm, $40 - $80/khách sạn tầm trung 3-4 sao."
                  : "$5 - $15 for dorms, $40 - $80 for quality mid-range 3-4★ hotels."}
              </div>
            </div>
            <div className="accom-snapshot-item">
              <Wifi className="accom-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Kết nối Internet:" : "High-Speed Wi-Fi:"}</strong>{" "}
                {isVi
                  ? "Wi-Fi miễn phí và tốc độ cao tại gần như 100% cơ sở lưu trú."
                  : "Free high-speed Wi-Fi available in virtually all hotels & stays."}
              </div>
            </div>
            <div className="accom-snapshot-item">
              <CreditCard className="accom-snapshot-icon" size={18} />
              <div>
                <strong>{isVi ? "Thanh toán & Hộ chiếu:" : "Payments & ID:"}</strong>{" "}
                {isVi
                  ? "Thẻ quốc tế phổ biến ở thành phố; vùng cao cần chuẩn bị tiền mặt VND."
                  : "Cards widely accepted in cities; bring VND cash for rural villages."}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Introduction & Overview */}
        <section className="accom-section">
          <p className="accom-section-desc">
            {isVi
              ? "Việt Nam mang đến vô vàn lựa chọn nơi ở phù hợp cho mọi phong cách du lịch và ngân sách. Từ những khu nghỉ dưỡng 5 sao ven biển tuyệt đẹp, khách sạn boutique đậm chất nghệ thuật cho đến nhà nghỉ bình dân và homestay ấm cúng của người dân địa phương, bạn sẽ luôn dễ dàng tìm thấy một chỗ ngả lưng thoải mái trên khắp dải đất hình chữ S."
              : "Vietnam offers a wide range of accommodation options that suit every travel style and budget. From luxury beachfront resorts and boutique hotels to family-run guesthouses and homestays, travelers can easily find comfortable places to stay across the country. This guide provides an overview of accommodation types, price ranges, booking tips, and what to expect when staying in Vietnam."}
          </p>
          <p className="accom-section-desc">
            {isVi
              ? "Trong hơn một thập kỷ qua, Việt Nam đã vươn lên thành một trong những điểm đến hấp dẫn bậc nhất châu Á. Lượng khách quốc tế tăng trưởng vượt bậc đã thúc đẩy làn sóng đầu tư mạnh mẽ vào hạ tầng du lịch, đưa chất lượng phục vụ và tiện ích phòng nghỉ lên tầm cao mới với mức chi phí cực kỳ cạnh tranh."
              : "Over the past decade, Vietnam has steadily emerged as an attractive travel destination in Asia, with international visitor numbers growing rapidly. This growth has driven strong investment in tourism infrastructure, particularly accommodation, resulting in a wide range of options from budget stays to high-end luxury properties."}
          </p>
        </section>

        {/* Section 2: Types of Accommodation */}
        <section className="accom-section">
          <h2 className="accom-section-title">
            <Building size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi
                ? "Các loại hình lưu trú phổ biến tại Việt Nam"
                : "Types of Accommodation in Vietnam"}
            </span>
          </h2>

          <p className="accom-section-desc">
            {isVi
              ? "Tùy thuộc vào lịch trình, sở thích cá nhân và ngân sách chuyến đi, bạn có thể dễ dàng chọn lọc giữa 6 nhóm hình thức lưu trú chủ đạo sau đây:"
              : "Depending on your itinerary, travel style, and budget, you can easily choose among these six main accommodation categories:"}
          </p>

          <div className="accom-types-grid">
            {/* 1. Hotels */}
            <article className="accom-type-card">
              <div className="accom-type-card__header">
                <div className="accom-type-card__title-box">
                  <div className="accom-type-card__icon-wrap">
                    <Hotel size={22} />
                  </div>
                  <div>
                    <h3 className="accom-type-card__title">
                      {isVi ? "1. Khách sạn (1–5 sao)" : "1. Hotels (1–5 Star)"}
                    </h3>
                  </div>
                </div>
                <span className="accom-type-card__badge">
                  {isVi ? "Phổ biến nhất" : "Most Common"}
                </span>
              </div>
              <div className="accom-type-card__body">
                <p className="accom-type-card__desc">
                  {isVi
                    ? "Khách sạn là loại hình phổ biến nhất và hiện diện ở tất cả các thành phố lớn cũng như các điểm du lịch nổi tiếng trên toàn quốc."
                    : "Hotels are the most common type of accommodation in Vietnam and are available in all major cities and tourist destinations."}
                </p>
                <ul className="accom-type-card__list">
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      <strong>{isVi ? "Khách sạn 1–2 sao:" : "1–2 Star Hotels:"}</strong>{" "}
                      {isVi
                        ? "Đơn giản, sạch sẽ, giá cả phải chăng, rất phù hợp cho kỳ nghỉ ngắn ngày hoặc người chỉ cần nơi ngủ an toàn."
                        : "Simple, clean, and budget-friendly, highly suitable for short stays."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      <strong>{isVi ? "Khách sạn 3–4 sao:" : "3–4 Star Hotels:"}</strong>{" "}
                      {isVi
                        ? "Phòng ốc rộng rãi, tiện nghi hiện đại, bữa sáng buffet phong phú và phong cách phục vụ chu đáo, chuyên nghiệp."
                        : "Comfortable rooms, generous facilities, buffet breakfast, and professional hospitality service."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      <strong>{isVi ? "Khách sạn 5 sao:" : "5-Star Hotels:"}</strong>{" "}
                      {isVi
                        ? "Tiện ích đẳng cấp quốc tế, spa cao cấp, nhà hàng fine-dining, hồ bơi vô cực ngắm toàn cảnh và tọa lạc tại những vị trí vàng."
                        : "High-end luxury amenities, world-class spas, fine dining restaurants, rooftop infinity pools, and prime central locations."}
                    </span>
                  </li>
                </ul>
                <div className="accom-type-card__summary-note">
                  {isVi
                    ? "💡 Điểm cộng lớn: Khách sạn tại Việt Nam nổi tiếng với tỷ lệ giá trị trên chi phí (value for money) vượt trội so với nhiều quốc gia khác trong khu vực, đặc biệt ở phân khúc 3–5 sao."
                    : "💡 Great value: Vietnam is well known for offering exceptional value compared to many other countries, especially in the mid-range and luxury segments."}
                </div>
              </div>
            </article>

            {/* Photo 1: City hotel development */}
            <figure className="accom-figure">
              <img
                src="/guide/accommodation/hanoi-hotels.jpg"
                alt={
                  isVi
                    ? "Khách sạn và cơ sở lưu trú hiện đại tại các thành phố lớn của Việt Nam"
                    : "Vietnam's major cities have seen rapid development in tourism infrastructure, including a wide range of accommodation options."
                }
                loading="lazy"
              />
              <figcaption>
                {isVi
                  ? "Các đô thị lớn như Hà Nội, TP.HCM và Đà Nẵng sở hữu hệ thống khách sạn cao cấp phát triển mạnh mẽ."
                  : "Vietnam's major cities have seen rapid development in tourism infrastructure, including a wide range of accommodation options."}
              </figcaption>
            </figure>

            {/* 2. Boutique Hotels */}
            <article className="accom-type-card">
              <div className="accom-type-card__header">
                <div className="accom-type-card__title-box">
                  <div className="accom-type-card__icon-wrap">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="accom-type-card__title">
                      {isVi ? "2. Khách sạn Boutique" : "2. Boutique Hotels"}
                    </h3>
                  </div>
                </div>
                <span className="accom-type-card__badge">
                  {isVi ? "Phong cách & Độc đáo" : "Chic & Unique"}
                </span>
              </div>
              <div className="accom-type-card__body">
                <p className="accom-type-card__desc">
                  {isVi
                    ? "Lựa chọn lý tưởng cho những ai trân trọng tính thẩm mỹ, nghệ thuật kiến trúc và sự chăm sóc ân cần mang đậm dấu ấn bản địa."
                    : "This option is ideal for travelers who want upscale comfort infused with authentic local artistic charm."}
                </p>
                <ul className="accom-type-card__list">
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Quy mô vừa và nhỏ nhưng sở hữu thiết kế độc bản, giao thoa giữa nét đẹp truyền thống và hơi thở hiện đại."
                        : "Smaller boutique properties featuring unique architectural design and distinctive character."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Thường tọa lạc trong các khu phố cổ kính, bên bờ sông thơ mộng (Phố Cổ Hà Nội, Phố Cổ Hội An, Quận 1 & Quận 3 TP.HCM)."
                        : "Often situated right inside old towns, heritage neighborhoods, or tranquil riverfronts."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Dịch vụ tận tâm, chăm chút từng chi tiết nhỏ với nội thất bài trí phong cách và không gian check-in tuyệt đẹp."
                        : "Highly personalized concierge service and beautifully curated interior decor."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 3. Homestays */}
            <article className="accom-type-card">
              <div className="accom-type-card__header">
                <div className="accom-type-card__title-box">
                  <div className="accom-type-card__icon-wrap">
                    <Home size={22} />
                  </div>
                  <div>
                    <h3 className="accom-type-card__title">
                      {isVi
                        ? "3. Homestay (Nhà ở bản địa)"
                        : "3. Homestays"}
                    </h3>
                  </div>
                </div>
                <span className="accom-type-card__badge">
                  {isVi ? "Trải nghiệm văn hóa" : "Cultural Immersion"}
                </span>
              </div>
              <div className="accom-type-card__body">
                <p className="accom-type-card__desc">
                  {isVi
                    ? "Homestay phát triển mạnh mẽ tại các vùng núi cao, vùng nông thôn yên bình và các bản làng dân tộc thiểu số."
                    : "Homestays are widely available in rural areas, mountainous regions, and ethnic minority villages across Vietnam."}
                </p>
                <ul className="accom-type-card__list">
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Lưu trú trực tiếp cùng gia đình bản xứ hoặc trong những căn nhà gỗ, nhà sàn truyền thống do người dân quản lý."
                        : "Guests stay with local families or in traditionally managed heritage homes."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Rất phổ biến tại Hà Giang, Sa Pa, Mai Châu, Ninh Bình, Đà Lạt và vùng sông nước Đồng bằng sông Cửu Long."
                        : "Common in scenic highland spots like Sapa, Ha Giang, Mai Chau, Da Lat, and the tranquil Mekong Delta."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Cơ hội tuyệt vời để cùng ăn cơm nhà, thưởng thức đặc sản tự nhiên và cảm nhận trọn vẹn văn hóa đời thường."
                        : "An unforgettable way to experience authentic Vietnamese traditions, home-cooked regional feasts, and daily local life."}
                    </span>
                  </li>
                </ul>
                <div className="accom-type-card__summary-note">
                  {isVi
                    ? "✨ Dù cơ sở vật chất ở một số bản vùng sâu còn mộc mạc, sự thân thiện, ấm áp và lòng hiếu khách chân tình của chủ nhà luôn để lại ấn tượng sâu đậm trong lòng du khách."
                    : "✨ Facilities are usually simpler in remote villages, but the hospitality is genuinely warm, welcoming, and authentic."}
                </div>
              </div>
            </article>

            {/* Photo 2: Ha Giang Homestay */}
            <figure className="accom-figure">
              <img
                src="/guide/accommodation/ha-giang-homestay.jpg"
                alt={
                  isVi
                    ? "Homestay giữa núi đồi hùng vĩ tại Hà Giang, Việt Nam"
                    : "Homestays in rural and mountainous regions offer a more authentic and immersive stay experience in Vietnam."
                }
                loading="lazy"
              />
              <figcaption>
                {isVi
                  ? "Homestay tại các vùng đồi núi như Hà Giang và Sa Pa mang lại trải nghiệm hòa mình vào thiên nhiên và văn hóa bản địa độc nhất vô nhị."
                  : "Homestays in rural and mountainous regions offer a more authentic and immersive stay experience in Vietnam."}
              </figcaption>
            </figure>

            {/* 4. Hostels */}
            <article className="accom-type-card">
              <div className="accom-type-card__header">
                <div className="accom-type-card__title-box">
                  <div className="accom-type-card__icon-wrap">
                    <Bed size={22} />
                  </div>
                  <div>
                    <h3 className="accom-type-card__title">
                      {isVi
                        ? "4. Hostels & Nhà nghỉ tập thể"
                        : "4. Hostels & Budget Stays"}
                    </h3>
                  </div>
                </div>
                <span className="accom-type-card__badge">
                  {isVi ? "Dành cho dân phượt" : "Backpacker Favorite"}
                </span>
              </div>
              <div className="accom-type-card__body">
                <p className="accom-type-card__desc">
                  {isVi
                    ? "Hostel là sự lựa chọn số một của cộng đồng du lịch bụi (backpackers) và những du khách đi một mình (solo travelers)."
                    : "Hostels are overwhelmingly popular among backpackers, budget wanderers, and solo travelers exploring Southeast Asia."}
                </p>
                <ul className="accom-type-card__list">
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Cung cấp cả giường tầng trong phòng tập thể (dormitory) và phòng riêng (private room) với chi phí tối ưu."
                        : "Both dormitory pod beds and private double rooms are widely available at pocket-friendly rates."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Không khí xã hội sôi động, nhiều khu sinh hoạt chung, quán cà phê và tour đi bộ miễn phí giúp dễ dàng kết bạn mới."
                        : "Vibrant social atmosphere with lively common lounges, bar areas, and group walking tours to connect with fellow travelers."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Hostel tại các thành phố lớn như Hà Nội, TP.HCM, Đà Nẵng, Huế rất hiện đại, có tủ khóa an toàn, điều hòa và dịch vụ giặt ủi."
                        : "Vietnam has remarkably modern, clean, and well-managed hostels equipped with secure lockers, AC, and travel booking desks."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 5. Beachfront Resorts */}
            <article className="accom-type-card">
              <div className="accom-type-card__header">
                <div className="accom-type-card__title-box">
                  <div className="accom-type-card__icon-wrap">
                    <Waves size={22} />
                  </div>
                  <div>
                    <h3 className="accom-type-card__title">
                      {isVi
                        ? "5. Khu nghỉ dưỡng & Resort ven biển"
                        : "5. Resorts & Beachfront Accommodation"}
                    </h3>
                  </div>
                </div>
                <span className="accom-type-card__badge">
                  {isVi ? "Thư giãn & Nghỉ dưỡng" : "Luxury & Leisure"}
                </span>
              </div>
              <div className="accom-type-card__body">
                <p className="accom-type-card__desc">
                  {isVi
                    ? "Với đường bờ biển dài hơn 3.260 km, Việt Nam sở hữu chuỗi resort biển đẳng cấp tập trung tại Phú Quốc, Nha Trang, Đà Nẵng, Mũi Né, Côn Đảo và Quy Nhơn."
                    : "Boasting over 3,260 km of tropical coastline, Vietnam is home to stunning beach resorts across Phu Quoc, Nha Trang, Da Nang, Mui Ne, Con Dao, and Quy Nhon."}
                </p>
                <ul className="accom-type-card__list">
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Đa dạng từ khu nghỉ dưỡng ven biển giá phải chăng đến các thương hiệu siêu sang chuẩn 5 sao quốc tế."
                        : "Ranges from affordable seaside resorts to ultra-luxury private villa retreats."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Lựa chọn hoàn hảo cho kỳ nghỉ trăng mật, chuyến đi gia đình hoặc những ai muốn tái tạo năng lượng sau chuỗi ngày làm việc căng thẳng."
                        : "Ideal for honeymoons, romantic getaways, family holidays, and rejuvenating wellness vacations."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Thường sở hữu bãi biển cát trắng riêng, hồ bơi vô cực sát biển, spa trị liệu chuẩn Đông y và các hoạt động thể thao nước hấp dẫn."
                        : "Often features private beaches, beachfront infinity pools, tranquil spa centers, and water sports activities."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 6. Serviced Apartments & Airbnb */}
            <article className="accom-type-card">
              <div className="accom-type-card__header">
                <div className="accom-type-card__title-box">
                  <div className="accom-type-card__icon-wrap">
                    <Building size={22} />
                  </div>
                  <div>
                    <h3 className="accom-type-card__title">
                      {isVi
                        ? "6. Căn hộ dịch vụ & Airbnb"
                        : "6. Serviced Apartments & Airbnb"}
                    </h3>
                  </div>
                </div>
                <span className="accom-type-card__badge">
                  {isVi ? "Tiện nghi dài hạn" : "Extended Stay"}
                </span>
              </div>
              <div className="accom-type-card__body">
                <p className="accom-type-card__desc">
                  {isVi
                    ? "Căn hộ dịch vụ và Airbnb ngày càng được ưa chuộng tại các trung tâm kinh tế và đô thị lớn, đặc biệt đối với khách du lịch dài ngày, gia đình có con nhỏ và cộng đồng digital nomads."
                    : "Serviced apartments and Airbnb rentals are increasingly popular across major metropolises and coastal hubs, especially among long-term travelers, digital nomads, and families."}
                </p>
                <ul className="accom-type-card__list">
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Căn hộ studio hoặc căn hộ 1–3 phòng ngủ được trang bị đầy đủ nội thất, bếp nấu, tủ lạnh và máy giặt riêng."
                        : "Fully furnished apartments, studios, or private homes with self-catering kitchens and in-room laundry."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Mức giá cực kỳ tối ưu khi thuê theo tuần hoặc theo tháng so với đặt phòng khách sạn thông thường."
                        : "Significantly better value for weekly or monthly stays compared to traditional hotel bookings."}
                    </span>
                  </li>
                  <li className="accom-type-card__list-item">
                    <CheckCircle2
                      className="accom-type-card__list-icon"
                      size={18}
                    />
                    <span>
                      {isVi
                        ? "Không gian riêng tư, yên tĩnh làm việc, dễ dàng tiếp cận siêu thị, chợ dân sinh và các tiện ích sinh hoạt thường nhật."
                        : "More living space, quiet privacy for remote work, and easy access to neighborhood markets and daily services."}
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Photo 3: Serviced Apartments */}
            <figure className="accom-figure">
              <img
                src="/guide/accommodation/serviced-apartments.jpg"
                alt={
                  isVi
                    ? "Căn hộ dịch vụ hiện đại tiện nghi tại đô thị Việt Nam"
                    : "Serviced apartments with full amenities are increasingly popular for long-term stays in Vietnam."
                }
                loading="lazy"
              />
              <figcaption>
                {isVi
                  ? "Căn hộ dịch vụ với đầy đủ tiện nghi bếp, phòng khách và máy giặt là lựa chọn hàng đầu cho những ai lưu trú từ vài tuần đến vài tháng."
                  : "Serviced apartments with full home amenities are increasingly popular for extended and flexible long-term stays."}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Section 3: Typical Price Ranges */}
        <section className="accom-section">
          <h2 className="accom-section-title">
            <DollarSign size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi ? "Bảng giá phòng tham khảo" : "Typical Price Ranges"}
            </span>
          </h2>

          <p className="accom-section-desc">
            {isVi
              ? "Mức giá có thể biến động tùy theo mùa du lịch, vị trí trung tâm hay ngoại ô và nền tảng đặt phòng. Dưới đây là bảng giá tổng quan giúp bạn dễ dàng dự toán ngân sách chuyến đi:"
              : "Room rates vary depending on the season, central versus outer neighborhoods, and booking platforms. The following breakdown provides a realistic pricing overview for budgeting your stay:"}
          </p>

          <div className="accom-table-wrap">
            <table className="accom-table">
              <thead>
                <tr>
                  <th>{isVi ? "Loại hình lưu trú" : "Accommodation Type"}</th>
                  <th>{isVi ? "Giá ước tính (USD)" : "Estimated Price (USD)"}</th>
                  <th>{isVi ? "Giá ước tính (VND)" : "Estimated Price (VND)"}</th>
                  <th>{isVi ? "Đối tượng phù hợp nhất" : "Best Suited For"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>
                      {isVi ? "Hostel (Giường tập thể)" : "Hostel (Dorm Bed)"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">$5 – $15</span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      125.000 – 380.000 ₫
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Du lịch bụi, solo travelers, tiết kiệm chi phí"
                      : "Solo travelers, backpackers, extreme budget"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      {isVi ? "Hostel (Phòng riêng)" : "Hostel (Private Room)"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">$15 – $30</span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      380.000 – 760.000 ₫
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Cặp đôi thích không khí trẻ trung, du khách tự túc"
                      : "Couples on a budget, independent travelers"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      {isVi
                        ? "Khách sạn 1–2 sao & Homestay"
                        : "Budget Hotel (1–2★) & Homestay"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">$15 – $40</span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      380.000 – 1.000.000 ₫
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Du khách thích văn hóa địa phương, gia đình nhỏ"
                      : "Culture seekers, practical road-trippers"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      {isVi
                        ? "Khách sạn tầm trung 3–4 sao"
                        : "Mid-Range Hotel (3–4★)"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">$40 – $80</span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      1.000.000 – 2.050.000 ₫
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Gia đình, du khách thông thường tìm kiếm sự tiện nghi"
                      : "Families, comfort travelers, business trips"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      {isVi ? "Khách sạn Boutique" : "Boutique Hotel"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">$50 – $130</span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      1.250.000 – 3.300.000 ₫
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Du khách yêu nghệ thuật, kỳ nghỉ lãng mạn"
                      : "Design lovers, couples, heritage enthusiasts"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      {isVi
                        ? "Căn hộ dịch vụ (1 tháng)"
                        : "Serviced Apartment (Monthly)"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">
                      $350 – $900 / mo
                    </span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      8.800.000 – 22.800.000 ₫ / tháng
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Digital nomads, người làm việc từ xa, ở dài hạn"
                      : "Digital nomads, expats, remote workers"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      {isVi
                        ? "Khách sạn 5 sao & Resort ven biển"
                        : "5-Star Hotel & Luxury Resort"}
                    </strong>
                  </td>
                  <td>
                    <span className="accom-table__price-usd">$120 – $400+</span>
                  </td>
                  <td>
                    <span className="accom-table__price-vnd">
                      3.000.000 – 10.000.000+ ₫
                    </span>
                  </td>
                  <td>
                    {isVi
                      ? "Nghỉ dưỡng thượng lưu, trăng mật, chăm sóc sức khỏe"
                      : "Luxury getaways, honeymoons, wellness seekers"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Best Areas to Stay */}
        <section className="accom-section">
          <h2 className="accom-section-title">
            <MapPin size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi
                ? "Gợi ý khu vực lưu trú theo từng điểm đến"
                : "Best Areas to Stay by Destination"}
            </span>
          </h2>

          <p className="accom-section-desc">
            {isVi
              ? "Mỗi vùng miền và thành phố tại Việt Nam mang một sắc thái địa lý và văn hóa riêng, tạo nên những phong cách lưu trú đặc trưng phù hợp với từng nhu cầu khám phá:"
              : "Different destinations and tourist cities in Vietnam tend to offer distinct accommodation experiences shaped by geography, local character, and travel rhythms:"}
          </p>

          <div className="accom-regions-grid">
            {/* Hanoi */}
            <div className="accom-region-card">
              <span className="accom-region-card__badge">
                {isVi ? "Thủ đô văn hiến" : "Capital City"}
              </span>
              <h3 className="accom-region-card__title">Hà Nội (Hanoi)</h3>
              <ul className="accom-region-card__list">
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Khu Phố Cổ & Hoàn Kiếm:" : "Old Quarter & Hoan Kiem:"}</strong>{" "}
                  {isVi
                    ? "Lý tưởng cho người đến lần đầu, dễ dàng đi bộ ngắm phố, thưởng thức ẩm thực đường phố và dạo quanh hồ Gươm."
                    : "Perfect for first-time visitors, walking access to street food, night markets, and Hoan Kiem Lake."}
                </li>
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Khu Tây Hồ (West Lake):" : "West Lake (Tay Ho):"}</strong>{" "}
                  {isVi
                    ? "Không gian thoáng đãng, nhiều khách sạn boutique cao cấp, căn hộ dịch vụ và quán cà phê ven hồ thư thái."
                    : "Tranquil atmosphere, spacious lakeside boutique hotels, expat cafes, and serviced apartments."}
                </li>
              </ul>
            </div>

            {/* Ho Chi Minh City */}
            <div className="accom-region-card">
              <span className="accom-region-card__badge">
                {isVi ? "Trung tâm kinh tế" : "Southern Metropolis"}
              </span>
              <h3 className="accom-region-card__title">
                TP. Hồ Chí Minh (Saigon)
              </h3>
              <ul className="accom-region-card__list">
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Quận 1 (Trung tâm):" : "District 1 (Downtown):"}</strong>{" "}
                  {isVi
                    ? "Gần chợ Bến Thành, phố đi bộ Nguyễn Huệ, tập trung các khách sạn 5 sao sang trọng và phố Tây Bùi Viện."
                    : "Heart of the city, steps away from Ben Thanh, luxury high-rises, and Bui Vien nightlife."}
                </li>
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Quận 3 & Thảo Điền:" : "District 3 & Thao Dien:"}</strong>{" "}
                  {isVi
                    ? "Quận 3 rợp bóng cây cổ thụ yên bình; Thảo Điền (TP. Thủ Đức) phong cách quốc tế ven sông Sài Gòn."
                    : "District 3 offers quiet leafy boulevards; Thao Dien delivers riverside expat dining and boutique villas."}
                </li>
              </ul>
            </div>

            {/* Da Nang & Hoi An */}
            <div className="accom-region-card">
              <span className="accom-region-card__badge">
                {isVi ? "Miền Trung di sản" : "Central Coast & Heritage"}
              </span>
              <h3 className="accom-region-card__title">
                Đà Nẵng & Hội An (Central Hub)
              </h3>
              <ul className="accom-region-card__list">
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Bãi biển Mỹ Khê (Đà Nẵng):" : "My Khe Beach (Da Nang):"}</strong>{" "}
                  {isVi
                    ? "Chuỗi khách sạn và resort hướng biển cát trắng mịn, ngắm bình minh và tiện nghi hiện đại."
                    : "Beachfront tower hotels and resorts facing pristine ocean sunrises and modern bridges."}
                </li>
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Phố Cổ & Ven Sông Hoài (Hội An):" : "Ancient Town & Riverside (Hoi An):"}</strong>{" "}
                  {isVi
                    ? "Khách sạn boutique đậm phong cách đèn lồng hoặc homestay bên cánh đồng lúa thanh bình Cẩm Thanh."
                    : "Lantern-lit heritage villas in the ancient town or cozy homestays bordering emerald paddy fields."}
                </li>
              </ul>
            </div>

            {/* Mountain & Highlands */}
            <div className="accom-region-card">
              <span className="accom-region-card__badge">
                {isVi ? "Tây Bắc & Tây Nguyên" : "Highlands & Mountains"}
              </span>
              <h3 className="accom-region-card__title">
                Sa Pa, Hà Giang & Đà Lạt
              </h3>
              <ul className="accom-region-card__list">
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Bản làng Tả Van, Nặm Đăm:" : "Ethnic Villages (Ta Van, Nam Dam):"}</strong>{" "}
                  {isVi
                    ? "Trải nghiệm homestay nhà sàn mộc mạc, thức giấc ngắm biển mây và ruộng bậc thang kỳ vĩ."
                    : "Traditional wooden stilt house homestays with jaw-dropping views of terraced valleys and cloud seas."}
                </li>
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Đà Lạt xứ thông reo:" : "Da Lat Pine Forests:"}</strong>{" "}
                  {isVi
                    ? "Biệt thự kiến trúc Pháp cổ kính hoặc những căn homestay kính ngắm thung lũng sương mù mộng mơ."
                    : "Colonial French villas or hillside glass cabin homestays perched over misty pine valleys."}
                </li>
              </ul>
            </div>

            {/* Beach & Islands */}
            <div className="accom-region-card">
              <span className="accom-region-card__badge">
                {isVi ? "Thiên đường biển đảo" : "Island & Beach Havens"}
              </span>
              <h3 className="accom-region-card__title">
                Phú Quốc, Nha Trang & Mũi Né
              </h3>
              <ul className="accom-region-card__list">
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Đảo Ngọc Phú Quốc:" : "Phu Quoc Pearl Island:"}</strong>{" "}
                  {isVi
                    ? "Bãi Trường ngắm hoàng hôn rực rỡ, Bãi Khem cát trắng mịn và khu nghỉ dưỡng sinh thái biệt lập."
                    : "Sunset Sanato coastline, powder-white Kem Beach, and secluded rainforest eco-resorts."}
                </li>
                <li className="accom-region-card__list-item">
                  <strong>{isVi ? "Nha Trang & Mũi Né:" : "Nha Trang & Mui Ne:"}</strong>{" "}
                  {isVi
                    ? "Đường Trần Phú ôm sát vịnh biển Nha Trang và những resort phong cách lướt sóng nhiệt đới Mũi Né."
                    : "Tran Phu avenue overlooking turquoise Nha Trang Bay and wind-swept boutique beach resorts in Mui Ne."}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Seasonal Considerations */}
        <section className="accom-section">
          <h2 className="accom-section-title">
            <Sun size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi
                ? "Thời điểm du lịch & Biến động giá phòng"
                : "Seasonal Considerations & Rate Trends"}
            </span>
          </h2>

          <p className="accom-section-desc">
            {isVi
              ? "Giá phòng lưu trú tại Việt Nam thường có sự dao động theo các mùa cao điểm sau đây:"
              : "Accommodation prices fluctuate significantly during primary peak travel periods:"}
          </p>

          <div className="accom-season-grid">
            <div className="accom-season-card">
              <div className="accom-season-icon">
                <Sparkles size={20} />
              </div>
              <div className="accom-season-card__content">
                <h4>
                  {isVi ? "Tết Nguyên Đán (Tháng 1 – 2)" : "Lunar New Year (Tet)"}
                </h4>
                <p>
                  {isVi
                    ? "Kỳ nghỉ lễ lớn nhất trong năm. Các điểm du lịch nổi tiếng thường kín phòng sớm và áp dụng phụ thu lễ Tết (15% - 30%)."
                    : "Vietnam's biggest national holiday. Key tourist hotspots sell out quickly and may add holiday surcharges."}
                </p>
              </div>
            </div>

            <div className="accom-season-card">
              <div className="accom-season-icon">
                <Sun size={20} />
              </div>
              <div className="accom-season-card__content">
                <h4>
                  {isVi
                    ? "Cao điểm hè nội địa (Tháng 6 – 8)"
                    : "Domestic Summer (June – August)"}
                </h4>
                <p>
                  {isVi
                    ? "Các thành phố biển như Đà Nẵng, Nha Trang, Phú Quốc, Sầm Sơn rất đông khách gia đình Việt Nam vào dịp cuối tuần."
                    : "Beach destinations see surging domestic family travel, with higher weekend rates at seaside properties."}
                </p>
              </div>
            </div>

            <div className="accom-season-card">
              <div className="accom-season-icon">
                <Calendar size={20} />
              </div>
              <div className="accom-season-card__content">
                <h4>
                  {isVi
                    ? "Mùa khách quốc tế (Tháng 11 – 4)"
                    : "International Peak (Nov – April)"}
                </h4>
                <p>
                  {isVi
                    ? "Thời tiết khô ráo, dễ chịu nhất cả nước. Lượng khách phương Tây đông đảo, đặc biệt vào dịp Giáng sinh và Tết Dương lịch."
                    : "Pleasant, dry weather nationwide. Western traveler arrivals peak, particularly around Christmas and New Year."}
                </p>
              </div>
            </div>

            <div className="accom-season-card">
              <div className="accom-season-icon">
                <Waves size={20} />
              </div>
              <div className="accom-season-card__content">
                <h4>
                  {isVi
                    ? "Mùa mưa miền Trung (Tháng 9 – 11)"
                    : "Central Rainy Season (Sept – Nov)"}
                </h4>
                <p>
                  {isVi
                    ? "Huế, Hội An, Đà Nẵng có mưa nhiều, giá phòng giảm mạnh (off-peak deals), thích hợp cho ai muốn du lịch tiết kiệm và theo dõi thời tiết."
                    : "Heavy showers and storms can occur in Central Vietnam. Lowest rates and great deals, but monitor forecasts closely."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Essential Booking Tips */}
        <section className="accom-section">
          <h2 className="accom-section-title">
            <ShieldCheck size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi
                ? "Kinh nghiệm đặt phòng quan trọng cho du khách quốc tế"
                : "Booking Tips for International Travelers"}
            </span>
          </h2>

          <p className="accom-section-desc">
            {isVi
              ? "Nhờ sự phát triển mạnh mẽ của ngành khách sạn, tình trạng cháy phòng nghiêm trọng rất hiếm khi xảy ra. Tuy nhiên, để chuyến đi diễn ra suôn sẻ và hài lòng nhất, hãy ghi nhớ những lời khuyên thực tế sau:"
              : "Thanks to rapid expansion in Vietnam's hospitality sector, severe room shortages are rare. However, keeping these practical booking recommendations in mind ensures a smooth and effortless stay:"}
          </p>

          <div className="accom-tips-box">
            <div className="accom-tips-box__title">
              <Info size={20} />
              <span>
                {isVi ? "Lời khuyên từ chuyên gia du lịch VinaTap" : "VinaTap Expert Tips"}
              </span>
            </div>
            <ul className="accom-tips-box__list">
              <li className="accom-tips-box__item">
                <CheckCircle2 size={18} style={{ color: "#00c2cb", flexShrink: 0 }} />
                <span>
                  <strong>{isVi ? "Thủ tục đăng ký tạm trú (Passport Registration):" : "Passport Registration:"}</strong>{" "}
                  {isVi
                    ? "Theo quy định pháp luật Việt Nam, các cơ sở lưu trú có trách nhiệm đăng ký thông tin tạm trú của khách nước ngoài với công an địa phương. Lễ tân thường sẽ mượn hộ chiếu của bạn để chụp lại trang ảnh và thị thực (visa) rồi trả lại ngay sau ít phút."
                    : "Under Vietnamese law, all accommodation operators must register foreign guests with local police. The reception will ask for your passport to photograph the identity and visa pages, returning it promptly."}
                </span>
              </li>
              <li className="accom-tips-box__item">
                <CheckCircle2 size={18} style={{ color: "#00c2cb", flexShrink: 0 }} />
                <span>
                  <strong>{isVi ? "Đặt trước trong mùa cao điểm:" : "Book Early for Peak Seasons:"}</strong>{" "}
                  {isVi
                    ? "Nếu bạn dự định du lịch vào dịp Tết Nguyên Đán, Giáng sinh hoặc các ngày lễ lớn (30/4 - 1/5), nên đặt phòng trước từ 4 đến 8 tuần để có vị trí đẹp và mức giá hợp lý."
                    : "Reserve 4 to 8 weeks in advance if traveling during Lunar New Year, Christmas, or major national holidays to lock in prime locations and reasonable rates."}
                </span>
              </li>
              <li className="accom-tips-box__item">
                <CheckCircle2 size={18} style={{ color: "#00c2cb", flexShrink: 0 }} />
                <span>
                  <strong>{isVi ? "Kiểm tra điều hòa (A/C) và cách âm:" : "Check Air Conditioning & Soundproofing:"}</strong>{" "}
                  {isVi
                    ? "Vào mùa hè oi bức, hãy chắc chắn phòng nghỉ có máy lạnh hoạt động tốt. Tại các khu phố sầm uất như Phố Cổ Hà Nội hay Bùi Viện (TP.HCM), hãy đọc đánh giá của khách trước về độ cách âm của phòng."
                    : "During humid tropical summers, ensure your room features powerful AC. In lively nightlife areas, check recent guest reviews regarding window soundproofing."}
                </span>
              </li>
              <li className="accom-tips-box__item">
                <CheckCircle2 size={18} style={{ color: "#00c2cb", flexShrink: 0 }} />
                <span>
                  <strong>{isVi ? "Giờ nhận & trả phòng tiêu chuẩn:" : "Standard Check-in & Check-out:"}</strong>{" "}
                  {isVi
                    ? "Giờ check-in tiêu chuẩn là 14:00 và check-out là 12:00. Hầu hết các khách sạn và hostel đều hỗ trợ giữ hành lý miễn phí nếu bạn đến sớm hoặc có chuyến bay muộn trong ngày."
                    : "Standard check-in is at 14:00 and check-out at 12:00. Most hotels and hostels gladly offer secure free luggage storage for early arrivals or late night flights."}
                </span>
              </li>
              <li className="accom-tips-box__item">
                <CheckCircle2 size={18} style={{ color: "#00c2cb", flexShrink: 0 }} />
                <span>
                  <strong>{isVi ? "Phương thức thanh toán:" : "Payment Methods:"}</strong>{" "}
                  {isVi
                    ? "Các khách sạn từ 3 sao trở lên đều chấp nhận thẻ tín dụng Visa/Mastercard (đôi khi có phụ phí 2-3% phí giao dịch ngân hàng). Khi ở homestay vùng cao hoặc bản làng xa xôi, hãy luôn chuẩn bị sẵn tiền mặt VND."
                    : "Hotels 3★ and above accept Visa/Mastercard (some apply a 2-3% card processing fee). For rural homestays in remote valleys, always carry adequate cash in Vietnamese Dong (VND)."}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 7: FAQs */}
        <section className="accom-section">
          <h2 className="accom-section-title">
            <HelpCircle size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi
                ? "Câu hỏi thường gặp về lưu trú tại Việt Nam"
                : "Frequently Asked Questions (FAQ)"}
            </span>
          </h2>

          <div className="accom-faq-list">
            {/* FAQ 1 */}
            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(1)}
              >
                <span>
                  {isVi
                    ? "1. Lưu trú tại các khách sạn và homestay ở Việt Nam có an toàn không?"
                    : "1. Is accommodation in Vietnam safe for international travelers?"}
                </span>
                {openFaq === 1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 1 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Việt Nam được đánh giá là một trong những quốc gia an toàn hàng đầu châu Á. Hầu hết khách sạn đều có nhân viên lễ tân trực 24/7, camera an ninh và két sắt an toàn trong phòng. Tại các homestay vùng cao, sự trung thực và mến khách của người dân bản địa là điều du khách luôn trân trọng."
                    : "Yes, Vietnam is consistently ranked among the safest travel destinations in Asia. Most hotels maintain 24/7 reception desks, surveillance cameras, and in-room electronic safes. In rural homestays, local hosts take immense pride in hospitality and guest safety."}
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(2)}
              >
                <span>
                  {isVi
                    ? "2. Có bắt buộc phải tip (tiền boa) cho nhân viên phục vụ phòng hay không?"
                    : "2. Is tipping customary or expected at hotels in Vietnam?"}
                </span>
                {openFaq === 2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 2 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Tiền boa không phải là văn hóa bắt buộc tại Việt Nam. Hóa đơn của các khách sạn cao cấp thường đã bao gồm 5% phí phục vụ (service charge). Tuy nhiên, nếu bạn nhận được sự giúp đỡ nhiệt tình từ nhân viên mang hành lý (bellboy) hoặc dọn phòng, một khoản tip nhỏ khoảng 20.000 – 50.000 ₫ sẽ luôn được đón nhận với nụ cười cảm kích."
                    : "Tipping is not mandatory or expected in Vietnam. Luxury hotels often already include a 5% service charge on bills. However, a modest tip of 20,000 to 50,000 VND ($1-$2 USD) for luggage porters or housekeeping staff is always warmly appreciated for exceptional service."}
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(3)}
              >
                <span>
                  {isVi
                    ? "3. Nước máy trong phòng khách sạn có uống trực tiếp được không?"
                    : "3. Can I drink tap water in Vietnamese hotels?"}
                </span>
                {openFaq === 3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 3 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Không nên uống trực tiếp nước từ vòi. Hầu như mọi khách sạn và homestay đều cung cấp miễn phí 2 chai nước tinh khiết đóng chai mỗi ngày trong phòng, hoặc có cây nước lọc nóng lạnh tại sảnh để du khách châm nước vào bình cá nhân."
                    : "It is not recommended to drink tap water directly in Vietnam. Nearly all hotels and homestays supply complimentary bottled drinking water daily, and many modern properties offer purified refill stations in communal lobbies."}
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="accom-faq-item">
              <button
                className="accom-faq-question"
                onClick={() => toggleFaq(4)}
              >
                <span>
                  {isVi
                    ? "4. Chuẩn phích cắm điện tại khách sạn Việt Nam là loại nào?"
                    : "4. What electrical plug types are used in Vietnamese hotels?"}
                </span>
                {openFaq === 4 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === 4 && (
                <div className="accom-faq-answer">
                  {isVi
                    ? "Việt Nam sử dụng điện áp 220V với tần số 50Hz. Hầu hết các ổ cắm điện tại khách sạn là ổ đa năng tương thích với chân dẹt chuẩn A, chân tròn chuẩn C và hai chân chuẩn F. Du khách sử dụng thiết bị chuẩn chân 3 chấu (Anh, Úc, Singapore) nên mang theo đầu chuyển đổi."
                    : "Vietnam runs on 220V at 50Hz. Most hotel wall outlets are universal sockets accepting Type A (two flat prongs) and Type C/F (two round pins). If you carry three-prong plugs (UK, Australia), bringing a universal travel adapter is recommended."}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 8: Related Articles (Only verified existing guides) */}
        <section className="accom-section" style={{ marginTop: "4rem" }}>
          <h2 className="accom-section-title">
            <Compass size={24} style={{ color: "#00c2cb" }} />
            <span>
              {isVi ? "Cẩm nang du lịch liên quan" : "Related Articles"}
            </span>
          </h2>
          <p className="accom-section-desc">
            {isVi
              ? "Khám phá thêm các cẩm nang hữu ích đã có trên VinaTap để chuẩn bị chu đáo nhất cho chuyến du lịch Việt Nam của bạn:"
              : "Explore more verified travel guides on VinaTap to thoroughly plan your dream voyage across Vietnam:"}
          </p>

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
                  <span className="accom-related-badge">
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
                  <span className="accom-related-link">
                    <span>{isVi ? "Đọc cẩm nang" : "Read Guide"}</span>
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
